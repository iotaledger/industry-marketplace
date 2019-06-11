const zmq = require('zeromq');
const WebSocket = require('ws');
const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');
const { sendToUI, fetchFromTangle } = require('./Functions.js');

//Create a <query text="zmq" /> socket
const sock = zmq.socket('sub');

const ws = new WebSocket('ws://127.0.0.1:1880/ws/sp');

const role = 'sp';

const provider = 'https://nodes.devnet.iota.org:443';

const iota = composeAPI({ provider });

ws.onopen = () => {
    console.log('CONNECTED');
};
let tag;

ws.onmessage = serviceID => {
    console.log('Received Service ID' + serviceID + 'from UI');
    serviceID = serviceID.data;
    const abbrServiceID = serviceID.replace(/#/g, '').replace(/-/g, '');
    tag = abbrServiceID.substr(0, abbrServiceID.length - 3);
    tag = asciiToTrytes(tag) + '9';

    sock.connect('tcp://zmq.devnet.iota.org:5556');
    sock.subscribe('tx');
    sock.on('message', msg => {
        const data = msg.toString().split(' ');

        // Filter for certain tag
        if (data[12] == tag) {
            console.log('RECEIVED ANOTHER MSG FROM ZMQ');
            const get = async () => {
                const message = await fetchFromTangle(data);
                sendToUI(message, role);
                console.log('GOT MSG FROM TANGLE');
            };

            get();
        }
    });
};
