// Import libraries and create a ZMQ subscribe socket 
let zmq = require('zeromq');
//Create a <query text="zmq" /> socket
let sock = zmq.socket('sub');
var WebSocket = require('ws');

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const fetch = require('./Fetch.js')
const publish = require('./Publish.js')

//var ws = new WebSocket("wss://echo.websocket.org");
var ws = new WebSocket("ws://127.0.0.1:1880/ws/sp")

const role = "sp"
 const iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
    });

 ws.onopen = () => {
      console.log("CONNECTED")
        };

 ws.onmessage = (serviceID) => {

    console.log("Received Service ID" + serviceID + "from UI")
    serviceID = serviceID.data
    var abbrServiceID = serviceID.replace(/#/g,'').replace(/-/g,''); 
    var tag = abbrServiceID.substr(0, abbrServiceID.length-3)
    tag = Converter.asciiToTrytes(tag) + '9'

    msg = fetch.fetchFromZMQ(tag)
    publish.sendToUI(msg, role)
 }