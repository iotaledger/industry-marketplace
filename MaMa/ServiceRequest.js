// Require the IOTA libraries
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
var WebSocket = require('ws');

let publish = require('./Publish.js')


// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

//var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")
var ws = new WebSocket("ws://127.0.0.1:1880/ws/cfp")

ws.onopen = () => {
    console.log("CONNECTED")
      };


// Get json from websocket 
ws.onmessage = (msg) => {
     
    data = msg.data
    var json = JSON.parse(data)

    //Extract Dienstleistungs ID and Type of Message 
    var type = json.frame.type
    var serviceID = json.dataElements.submodels[0].identification.id

    //Remove #, -, version number from Dienstleistungs ID to build tag 
    //Convert tag to Trytes to be suitable for Tag (Allowed: 'A-Z & 9')
    var abbrServiceID = serviceID.replace(/#/g,'').replace(/-/g,''); 
    var tag = abbrServiceID.substr(0, abbrServiceID.length-3)
    tag = Converter.asciiToTrytes(tag)
  

    if(type === 'callForProposal'){
        publish.sendToTangle(data, tag)
       // publish.sendToUI(data)
    }
 }



