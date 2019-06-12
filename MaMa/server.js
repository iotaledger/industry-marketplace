//const server = require('http').createServer();
const io = require('socket.io');
const server = io.listen(3000)
//var client = require('./client.js')
const {zmqSubscribe} = require('./sub.js')
var functions = require('./Functions.js')

const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');
const { sendToUI, fetchFromTangle } = require('./Functions.js');



server.on('connection', client => {

   client.on('subscribe', (tag) => client.emit('subscribe', zmqSubscribe(tag, client)))
    
    })
