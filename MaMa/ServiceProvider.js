// Import libraries and create a ZMQ subscribe socket 
let zmq = require('zeromq');
//Create a <query text="zmq" /> socket
let sock = zmq.socket('sub');
var WebSocket = require('ws');

const Iota = require('@iota/core');
const Converter = require('@iota/converter');
//let fetch = require('./Fetch.js')
let publish = require('./Publish.js')

//var ws = new WebSocket("wss://echo.websocket.org");
 var ws = new WebSocket("ws://127.0.0.1:1880/ws/newService")


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


sock.connect('tcp://zmq.devnet.iota.org:5556');
//Subscribe to the confirmed transactions event
sock.subscribe('tx');


//Create a callback function to process the data that is returned from the ZMQ
sock.on('message', msg => {
//Split the data into an array

const data = msg.toString().split(' ');


//Filter for certain tag
if (data[12] == tag)
{
        var bundle = data[8]

        iota.findTransactionObjects({bundles: [bundle]})
                .then( transObj => { 
                
                        // Modify to consumable length
                        const trytes = transObj[0].signatureMessageFragment + '9'
                        //Convert to text
                        msg = Converter.trytesToAscii(trytes)
                        publish.sendToUI(msg)
                })
               
                .catch(err => { 
                        console.error(err) 
                })
        
            }
           
});
 
}
