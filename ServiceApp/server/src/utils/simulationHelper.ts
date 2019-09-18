import io from 'socket.io-client';
import get from 'lodash/get';
import axios from 'axios';
import format from 'date-fns/format';
import { generate, submodel } from '@iota/industry_4.0_language';
import { generateRandomSubmodelValues, getRandomTimestamp, getRandomLocation } from '../utils/randomizer.js';
import { operations } from '../config.json';
import { initializeWalletQueue } from './walletQueueHelper';
import { createCloseLocation } from './locationHelper';
import { readRow } from './databaseHelper';

const BASE_URL = 'http://localhost:5000';
const socket = io('http://localhost:5000');



export const simulate = async (role) => {

    await initializeWalletQueue();

    //For SR send out random CFPs 
    if (role === 'SR') {

        const sendRandomCFP = async () => {

            const randomOperation = await randomValue(operations)
            const randomSubmodel = await submodel(randomOperation)
            const randomSubmodelElements = await generateRandomSubmodelValues(randomSubmodel)
            const randomTimestamp = getRandomTimestamp()
            const { id }: any = await readRow('user', 'role', role);

            const submodelValues = {};
            randomSubmodelElements.forEach(({ semanticId, value, valueType }) => {
                if (['date', 'dateTime', 'dateTimeStamp'].includes(valueType)) {
                    submodelValues[semanticId] = Date.parse(value);
                } if (valueType === 'boolean') {
                    submodelValues[semanticId] = Boolean(value);
                } else {
                    submodelValues[semanticId] = value;
                }
            });
            const request = generate({
                messageType: 'callForProposal',
                userId: id,
                creationDate: format(Date.now(), 'DD MMMM, YYYY H:mm a '),
                irdi: randomOperation,
                submodelValues: submodelValues,
                startTimestamp: randomTimestamp[0],
                endTimestamp: randomTimestamp[1],
                location: await getRandomLocation()
            })
            await apiPost('cfp', request)
        }
         //sendRandomCFP();
        setInterval(sendRandomCFP, 180000);
    }

    //subscribe to ZMQ messages
    socket.on('connect', () => {
        console.log("Connected")
    });

    socket.on('disconnect', (reason) => {
        console.log("disconnected:", reason)
    })

    socket.emit('subscribe', { events: ['tx'] })

    socket.on('zmq', async (message) => {
        const data = get(message, 'data.data')
        if (typeof data === 'string') {
            JSON.parse(data);
        }
        const { type } = data.frame;

        if (['callForProposal'].includes(type)) {
            const senderLocation = await get(data.frame, 'location')
            const { id }: any = await readRow('user', 'role', role);

            //generate message  
            const request = generate({
                messageType: 'proposal',
                originalMessage: data,
                userId: id,
                location: await createCloseLocation(senderLocation),
                irdi: await get(data.dataElements.submodels[0].identification, 'id'),
                price: await randomValue([1, 2])
            })

            //send message to Market Manager
            await apiPost('proposal', request)
        }

        if (['proposal'].includes(type)) {

            const request = generate({
                messageType: 'acceptProposal',
                userId: await get(data.frame.receiver.identification, 'id'),
                originalMessage: data,
            })
            await apiPost('acceptProposal', request)

        }

        if (['acceptProposal'].includes(type)) {

            const request = await generate({
                messageType: 'informConfirm',
                userId: await get(data.frame.receiver.identification, 'id'),
                originalMessage: data,
            })
            await apiPost('informConfirm', request)

        }

        if (['informConfirm'].includes(type)) {

            const request = await generate({
                messageType: 'informPayment',
                userId: await get(data.frame.receiver.identification, 'id'),
                originalMessage: data,
            })

            await apiPost('informPayment', request)

        }
    })

}
//}

const apiPost = async (messageType, message) => {
    const randomTimeout = (min, max) => {
        return min + Math.random() * (max - min);
    }

    return new Promise(async (resolve, reject) => {
        try {
            await new Promise(resolve => setTimeout(resolve, randomTimeout(10000, 15000)));
            const response = await axios.post(`${BASE_URL}/${messageType}`, message);
            resolve(response.data);
        } catch (error) {
            console.error('API Error', error);
            return error;
        }
    })
}

const randomValue = array => {
    return array[Math.floor(Math.random() * array.length)]
}
