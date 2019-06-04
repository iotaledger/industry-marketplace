// Require the IOTA libraries
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
var WebSocket = require('ws');


// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")


ws.onopen = function() {
    console.log("CONNECTED")
      };


// Get json from websocket 
 ws.onmessage = function (msg) {
     
    data = msg.data
    var json = JSON.parse(data)
    var type = json.frame.type
    var serviceID = json.dataElements.submodels[0].identification.id


    if(type === 'callForProposal'){

        //send message to tangle
        sendMessage(data, serviceID)


    }
 }




 function sendMessage(properties, tag)
 {
 
    console.log(properties)
     const seed = "GXJ9NZBEYLNBIKIURJFCSYOATERR9TFCZTHHRICRESIHPSLRIZAZUGNHTCVDZSLO9ZSKTITCRJRWWZTLB"
 
     const message = Converter.asciiToTrytes(properties)
     //const message = Converter.asciiToTrytes("TAKE MY TOKENS")
 
     address = "HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD"
  
     //transfer array specifies transfers you want to make 
     const transfers = [
         {
    
             address: address,
             message: message,
             tag: tag
         }
         ];
         
         console.log("NOW SEND IT")
     iota.prepareTransfers(seed, transfers)
         .then(trytes => {
             console.log("WOOW YOU SEND IT")
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
 