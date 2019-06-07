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
    
      
       
exports.fetchFromTangle = (data) => 

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
