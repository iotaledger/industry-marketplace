import io from 'socket.io-client';
import get from 'lodash/get';
import axios from 'axios';
import yargs from 'yargs';
import format from 'date-fns/format';
import { generate, submodel } from '@iota/industry_4.0_language'
import { generateRandomSubmodelValues, getRandomTimestamp, getRandomLocation } from '../utils/randomizer.js';
import { getRandomUser } from './multiUserHelper';
import { operations } from '../config.json';
import { initializeWalletQueue } from './walletQueueHelper';
import { createCloseLocation } from './locationHelper';


const BASE_URL = 'http://localhost:5000';
const socket = io('http://localhost:5000');


const simulate = async (role) => {

    await initializeWalletQueue();

    //For SR send out random CFPs 
    if (role === 'SR') {

        const sendRandomCFP = async () => {

            const randomOperation = await randomValue(operations)
            const randomSubmodel = await submodel(randomOperation)
            const randomSubmodelElements = await generateRandomSubmodelValues(randomSubmodel)
            const randomTimestamp = getRandomTimestamp()

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
                userId: await getRandomUser(role),
                creationDate: format(Date.now(), 'DD MMMM, YYYY H:mm a '),
                irdi: randomOperation,
                submodelValues: submodelValues,
                startTimestamp: randomTimestamp[0],
                endTimestamp: randomTimestamp[1],
                location: await getRandomLocation()
            })
            await apiPost('cfp', request)

        }
        // sendRandomCFP();
        setInterval(sendRandomCFP, 60000);
    }


    //subscribe to ZMQ messages
    socket.on('connect', () => {
        console.log("Connected")
    });
    socket.emit('subscribe', { events: ['tx'] })

    socket.on('zmq', async (message) => {
        const data = get(message, 'data.data')
        if (typeof data === 'string') {
            JSON.parse(data);
        }
        const { type } = data.frame;

        if (['callForProposal'].includes(type)) {

            let iterable = [1, 2, 3];

            for (let value of iterable) {

                value += 1;
                const senderLocation = await get(data.frame, 'location')

                //generate message  
                const request = generate({
                    messageType: 'proposal',
                    originalMessage: data,
                    userId: await getRandomUser(role),
                    location: await createCloseLocation(senderLocation),
                    irdi: await get(data.dataElements.submodels[0].identification, 'id'),
                    price: await randomValue([1, 2, 4, 5, 6, 7, 8, 9])
                })

                //send message to Market Manager
                await apiPost('proposal', request)

                await new Promise(resolve => setTimeout(resolve, 9000));
            }

        }//Timeout

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

const apiPost = async (messageType, message) => {
    const randomTimeout = (min, max) => {
        return min + Math.random() * (max - min);
    }

    return new Promise(async (resolve, reject) => {
        try {
            await new Promise(resolve => setTimeout(resolve, randomTimeout(1000, 7000)));
            const response = await axios.post(`${BASE_URL}/${messageType}`, message);
            resolve(response.data);
        } catch (error) {
            console.error('findTransactions catch', error);
            return error;
        }
    })
}

const randomValue = array => {
    return array[Math.floor(Math.random() * array.length)]
}



const argv = yargs
    .usage('Simulate SR or SP')
    .example('$0  --role SR', 'simulate SR')
    .required('role', 'Mode must be provided').describe('role', 'Simulates SR or SP. Options: ["SR", "SP"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .help('help')
    .argv;

if (argv.role === 'SR') {
    simulate('SR')
}
else if (argv.role === 'SP') {
    simulate('SP')
}
