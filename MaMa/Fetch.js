const Iota = require('@iota/core');
const Converter = require('@iota/converter');
let zmq = require('zeromq');
let sock = zmq.socket('sub');
var WebSocket = require('ws');

//var ws = new WebSocket("wss://echo.websocket.org");
var ws = new WebSocket("ws://127.0.0.1:1880/ws/sp")

const iota = Iota.composeAPI({
        provider: 'https://nodes.devnet.iota.org:443'
        });
    
exports.fetchFromZMQ = (tag) => {

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
        
                 const get = async () => {
                      let message = await fetchFromTangle(data)
                      console.log(message) // publish.sendToUI(message, role)
                 }
                
                get();
                
        }
          
        });
         
}
        

fetchFromTangle = (data) => 

{ 
 return new Promise(resolve => {
               
         //Get bundle and extract data
var bundle = data[8]  

iota.findTransactionObjects({bundles: [bundle]})
        .then( transObj => { 
        
                // Modify to consumable length
                const trytes = transObj[0].signatureMessageFragment + '9'
                //Convert to text
                msg = Converter.trytesToAscii(trytes)
                resolve( msg ) 
        })
       
        .catch(err => { 
                console.error(err) 
        })

    

})
}
