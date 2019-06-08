// Require the IOTA libraries
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
var WebSocket = require('ws');
// Import libraries and create a ZMQ subscribe socket 
let zmq = require('zeromq');
//Create a <query text="zmq" /> socket
let sock = zmq.socket('sub');
var WebSocket = require('ws');
let functions = require('./Functions.js')
    

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

//var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")
var ws = new WebSocket("ws://127.0.0.1:1880/ws/sr")

ws.onopen = () => {
    console.log("CONNECTED")
      };

const role = "sr"
// Get json from websocket 
ws.onmessage = (msg) => {
   

   functions.sendMessage(msg.data)
   
 }



