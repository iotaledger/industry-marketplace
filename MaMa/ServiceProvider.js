// Import libraries and create a ZMQ subscribe socket
let zmq = require('zeromq');
//Create a <query text="zmq" /> socket
let sock = zmq.socket('sub');
var WebSocket = require('ws');

const Iota = require('@iota/core');
const Converter = require('@iota/converter');

let functions = require('./Functions.js');

var ws = new WebSocket('ws://127.0.0.1:1880/ws/sp');

const role = 'sp';
const iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
});

ws.onopen = () => {
    console.log('CONNECTED');
};
let tag;

ws.onmessage = serviceID => {
    console.log('Received Service ID' + serviceID + 'from UI');
    serviceID = serviceID.data;
    var abbrServiceID = serviceID.replace(/#/g, '').replace(/-/g, '');
    tag = abbrServiceID.substr(0, abbrServiceID.length - 3);
    tag = Converter.asciiToTrytes(tag) + '9';

    sock.connect('tcp://zmq.devnet.iota.org:5556');
    sock.subscribe('tx');
    sock.on('message', msg => {
        const data = msg.toString().split(' ');

        //Filter for certain tag
        if (data[12] == tag) {
            console.log('RECEIVED ANOTHER MSG FROM ZMQ');
            const get = async () => {
                let message = await functions.fetchFromTangle(data);
                functions.sendToUI(message, role);
                console.log('GOT MSG FROM TANGLE');
            };

            get();
        }
    });
};
