const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const WebSocket = require('ws');
const functions = require('./Functions.js');
//var ws = new WebSocket("wss://echo.websocket.org");
//var ws = new WebSocket("ws://127.0.0.1:1880/ws/sp")

const iota = composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
});

exports.sendMessage = data => {
    const json = JSON.parse(data);

    //Extract Dienstleistungs ID and Type of Message
    const type = json.frame.type;
    const serviceID = json.dataElements.submodels[0].identification.id;

    //Remove #, -, version number from Dienstleistungs ID to build tag
    //Convert tag to Trytes to be suitable for Tag (Allowed: 'A-Z & 9')
    const abbrServiceID = serviceID.replace(/#/g, '').replace(/-/g, '');
    let tag = abbrServiceID.substr(0, abbrServiceID.length - 3);
    tag = asciiToTrytes(tag);

    if (type === 'callForProposal') {
        functions.sendToTangle(data, tag);
        sock.connect('tcp://zmq.devnet.iota.org:5556');
        sock.subscribe('tx');
        sock.on('message', msg => {
            const data = msg.toString().split(' ');

            //Filter for certain tag
            if (data[12] == tag) {
                console.log('RECEIVED ANOTHER MSG FROM ZMQ');
                const get = async () => {
                    const message = await fetch.fetchFromTangle(data);
                    functions.sendToUI(message, role);
                    console.log('GOT MSG FROM TANGLE');
                };

                get();
            }
        });
        // functions.sendToUI(data)
    }

    if (type === 'rejectProposal') {
        functions.sendToTangle(data, tag);
        // functions.sendToUI(data)
    }

    if (type === 'acceptProposal') {
        functions.sendToTangle(data, tag);
        // functions.sendToUI(data)
    }
};
