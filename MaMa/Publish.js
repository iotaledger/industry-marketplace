const Iota = require('@iota/core');
const Converter = require('@iota/converter');
var WebSocket = require('ws');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
    });
    

 exports.sendToTangle = (properties, tag) => 
 {
     const seed = "GXJ9NZBEYLNBIKIURJFCSYOATERR9TFCZTHHRICRESIHPSLRIZAZUGNHTCVDZSLO9ZSKTITCRJRWWZTLB"
     const message = Converter.asciiToTrytes(properties)      
     address = "HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD"
  
     //transfer array specifies transfers you want to make 
     const transfers = [
         {
             value: 0, 
             address: address,
             message: message,
             tag: tag
         }
         ];
         
     iota.prepareTransfers(seed, transfers)
         .then(trytes => {
             return iota.sendTrytes(trytes, 3, 9)
             
         })
         .then(bundle => {
     console.log(`Published transaction with tail hash: ${bundle[0].hash}`)
         console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`)
     })
 
     .catch(err => {
             // Catch any errors
         console.log(err);
     });
 }
 

 exports.sendToUI = (data) => {
//var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")    
var ws = new WebSocket("ws://127.0.0.1:1880/ws/debug")

ws.onopen = () => {
    ws.send(data)
};

 }