import io from 'socket.io-client'
import get from 'lodash/get';
import axios from 'axios'
import { generate } from 'SeMarket/Industry_4.0_language/index.js'
import { getRandomRow, setWalletStatus } from './databaseHelper'
//import {generateRandomSubmodelValues} from 'SeMarket/ServiceApp/src/utils/randomizer.js'

import { readData } from './databaseHelper';


const BASE_URL = 'http://localhost:4000';

const socket = io('http://localhost:4000');

const simulate = async () => {

    //Choose wallet for incoming payments 
    interface IWallet {
        seed?: string;
    }

    //Rotate Incoming Wallet 
    const IncomingWallet: IWallet = await getRandomRow('wallet','status','reserved');
    const { seed } = await IncomingWallet
    setWalletStatus(seed, 'usable')
 

   
    const newIncomingWallet: IWallet = await getRandomRow('wallet','status','usable');
    const seed2 = await newIncomingWallet.seed
    setWalletStatus(seed2, 'reserved')

    //get role of simulator
    interface IRole {
        role?: string;
    }
    const { role }: IRole = await readData('user', null, 'role')


if(role === 'SR'){

    //Add random cfps



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

            //generate message 
            const request = generate({
                messageType: 'proposal',
                originalMessage: data,
                userId: 'SimSR',
                price: 6,
            })

            //send message to Market Manager 
            apiPost('proposal', request)
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


simulate();


const apiPost = async (messageType, message) => {
    const response = await axios.post(`${BASE_URL}/${messageType}`, message);
    console.log(response.data);
}
