import io from 'socket.io-client';
import get from 'lodash/get';
import axios from 'axios';
import yargs from 'yargs';

import { generate, submodel } from 'SeMarket/Industry_4.0_language/index.js';
import { generateRandomSubmodelValues, getRandomLocation } from '../utils/randomizer.js';
import { getRandomRow, setWalletStatus } from './databaseHelper';
import { operations } from '../config.json'

//, getRandomTimestamp, getRandomLocation
const BASE_URL = 'http://localhost:4000';
const socket = io('http://localhost:4000');

const simulate = async (role) => {

    //Choose wallet for incoming payments 
    interface IWallet {
        seed?: string;
    }

    //Rotate Incoming Wallet 

    const IncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'reserved');
    if (IncomingWallet) {
        const { seed } = await IncomingWallet
        setWalletStatus(seed, 'usable')
    }

    const newIncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'usable');
    const reservedSeed = await newIncomingWallet.seed
    setWalletStatus(reservedSeed, 'reserved')

//For SR send out random CFPs 
    if (role === 'SR') {

        const sendRandomCFP = async () => {

            interface IUser {
                areaCode?: string;
                id?: string;
                role?: string;
                name?: string;
            }
            const user: IUser = await getRandomRow('user', 'role', role);

            const { id } = user
            const randomOperation = randomValue(operations)
            const randomSubmodel = await submodel(randomOperation)

            const randomSubmodelElements = await generateRandomSubmodelValues(randomSubmodel)

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
                irdi: randomOperation,
                submodelValues: submodelValues,
                location: await getRandomLocation()
            })

            apiPost('cfp', request)
        }
        setInterval( sendRandomCFP , 5000);
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
         
            [1, 2, 3].forEach(async () => {
    
                interface IUser {
                    areaCode?: string;
                    id?: string;
                    role?: string;
                    name?: string;
                }

                const user: IUser = await getRandomRow('user', 'role', role);
                const { id } = user

                //generate message 
                const request = generate({
                    messageType: 'proposal',
                    originalMessage: data,
                    userId: id,
                    location: await getRandomLocation(),
                    price: await randomValue([1,2,4,5,6,7,8,9])
                })
                console.log(request)

                //send message to Market Manager 
            //    apiPost('proposal', request)
            })
        }


        if (['proposal'].includes(type)) {

            const request = await generate({
                messageType: 'acceptProposal',
                originalMessage: data,
            })
            apiPost('acceptProposal', request)
        }

        if (['acceptProposal'].includes(type)) {

            const request = await generate({
                messageType: 'informConfirm',
                originalMessage: data,
            })
            apiPost('informConfirm', request)
        }

        if (['informConfirm'].includes(type)) {

            const request = await generate({
                messageType: 'informPayment',
                originalMessage: data,
            })
            console.log('informPayment', request)
            //apiPost('informPayment', request)
        }
    })
}

const apiPost = async (messageType, message) => {
    const response = await axios.post(`${BASE_URL}/${messageType}`, message);
    console.log(response.data);
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
