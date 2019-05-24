
// Import libraries and create a ZMQ subscribe socket 
let zmq = require('zeromq');
//Create a <query text="zmq" /> socket
let sock = zmq.socket('sub');

const Iota = require('@iota/core');
const Converter = require('@iota/converter');


// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

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

//Filter for certain tag
if (data[12] == 'MBPCHDRCWCWBTCICWB9CFA99999')
{
    console.log(`Value: ${data[3]}` );
    console.log(`timestamp: ${data[5]}` );
    console.log(`tag: ${data[12]}` );
 

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
                        
                })
                .catch(err => { 
                        console.error(err) 
                })

}


});