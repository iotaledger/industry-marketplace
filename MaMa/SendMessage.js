const Iota = require('@iota/core');
const Converter = require('@iota/converter');
let zmq = require('zeromq');
let sock = zmq.socket('sub');
var WebSocket = require('ws');
let publish = require('./Publish.js')
//var ws = new WebSocket("wss://echo.websocket.org");
//var ws = new WebSocket("ws://127.0.0.1:1880/ws/sp")

const iota = Iota.composeAPI({
        provider: 'https://nodes.devnet.iota.org:443'
        });
    
      
       
exports.sendMessage = (data) => 
{
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
            sock.connect('tcp://zmq.devnet.iota.org:5556');
            sock.subscribe('tx');
            sock.on('message', msg => {
            const data = msg.toString().split(' ');
            
            //Filter for certain tag
            if (data[12] == tag)
            {
                    console.log("RECEIVED ANOTHER MSG FROM ZMQ")
                     const get = async () => {
                          let message = await fetch.fetchFromTangle(data)
                          publish.sendToUI(message, role)
                          console.log("GOT MSG FROM TANGLE")
                    }
                    
                     get();
                    
            }
        })
           // publish.sendToUI(data)
        }
    
        if(type === 'rejectProposal'){
            publish.sendToTangle(data, tag)
           // publish.sendToUI(data)
        }
    
        if(type === 'acceptProposal'){
            publish.sendToTangle(data, tag)
           // publish.sendToUI(data)
        }

}