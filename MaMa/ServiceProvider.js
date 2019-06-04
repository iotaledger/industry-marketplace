// Import libraries and create a ZMQ subscribe socket 
let zmq = require('zeromq');
//Create a <query text="zmq" /> socket
let sock = zmq.socket('sub');
var WebSocket = require('ws');

const Iota = require('@iota/core');
const Converter = require('@iota/converter');

//var ws = new WebSocket("wss://echo.websocket.org");
 var ws = new WebSocket("ws://10.197.0.187:1880/ws/dienstleistung")


 const iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
    });

 ws.onopen = function() {
      console.log("CONNECTED")
        };

 ws.onmessage = function (dienstleistung) {

    tag = dienstleistung.data
    console.log(tag)

 }

// Create a new instance of the IOTA object

// Use the `provider` field to specify which IRI node to connect to



/**
 * Connect the <query text="ZMQ" /> socket to the IRI by passing the 
 * `connect` function the URL or the IP address of the IRI and the 
 * <query text="ZMQ" /> port 
 */
sock.connect('tcp://zmq.devnet.iota.org:5556');
//Subscribe to the confirmed transactions event
sock.subscribe('tx');

//Create a callback function to process the data that is returned from the ZMQ
sock.on('message', msg => {
//Split the data into an array
const data = msg.toString().split(' ');

console.log(tag)
//Filter for certain tag
if (data[12] == tag)

{
//Get bundle and extract data
        var bundle = data[8]

        iota.findTransactionObjects({bundles: [bundle]})
                .then(transObj => { 
                //  console.log('Encoded message:') 
                //  console.log(transObj[0].signatureMessageFragment)
                        
                        // Modify to consumable length
                        const trytes = transObj[0].signatureMessageFragment + '9'
                        //Convert to text
                        var data = Converter.trytesToAscii(trytes)
                        console.log('Decoded message:')
                        console.log(data)
                        var ts = Math.round((new Date()).getTime());
                        console.log('Date now:' + ts)
                      //  ws.send(JSON.stringify(data));
          
          
                        
                })
                .catch(err => { 
                        console.error(err) 
                })

}

});