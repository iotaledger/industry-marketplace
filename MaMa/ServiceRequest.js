const { composeAPI } = require('@iota/core');
const WebSocket = require('ws');
const zmq = require('zeromq');
const { sendMessage } = require('./Functions.js');

const sock = zmq.socket('sub');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const provider = 'https://nodes.devnet.iota.org:443';

const iota = composeAPI({ provider });

//var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")
const ws = new WebSocket('ws://127.0.0.1:1880/ws/sr');

ws.onopen = () => {
    console.log('CONNECTED');
};

const role = 'sr';
// Get json from websocket
ws.onmessage = msg => {
    functions.sendMessage(msg.data);
};
