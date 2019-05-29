// Require the IOTA libraries
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});




for (var i = 0; i < 100; i++) {
  (function (i) {
    setTimeout(function () {
        console.log("send next msg")
 sendMessage("CATCH ME ZMQ, I AM A PI" + i , "Bohren!!!", 766, "836482f", 12022020, 0)
    }, 0.001*i);
  })(i);
};




//for (let i = 0; i <= 50; i++) { 
   // setTimeout(function(){sendMessage("Ich bin MSG" + i , "Bohren!!!", 766, "836482f", 12022020, 0)},5000);
  // setTimeout(function() { console.log(i); }, 5000) 
//}


function sendMessage(purpose, dataelements, conversation_ID, message_ID, reply_by, value)
{
 var structure = {"Purpose":purpose, "Dataelements":dataelements, "Conversation_ID":conversation_ID, "Message_ID":message_ID, "Reply_by": reply_by}

    const seed = "GXJ9NZBEYLNBIKIURJFCSYOATERR9TFCZTHHRICRESIHPSLRIZAZUGNHTCVDZSLO9ZSKTITCRJRWWZTLB"

    const message = Converter.asciiToTrytes(JSON.stringify(structure))
    //const message = Converter.asciiToTrytes("TAKE MY TOKENS")

    address = "HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD"
    tag = "MBPCHDRCWCWBTCICWB9CFA99999"
    //transfer array specifies transfers you want to make 
    const transfers = [
        {
            value: value,
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


