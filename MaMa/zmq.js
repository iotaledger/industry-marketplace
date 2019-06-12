// Import libraries and create a ZMQ subscribe socket
const zmq = require('zeromq');
const { composeAPI } = require('@iota/core');
const { decodeMessage } = require('./helpers');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const provider = 'https://nodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

// Create a <query text="zmq" /> socket
const sock = zmq.socket('sub');

/**
 * Connect the <query text="ZMQ" /> socket to the IRI by passing the
 * `connect` function the URL or the IP address of the IRI and the
 * <query text="ZMQ" /> port
 */
sock.connect('tcp://zmq.devnet.iota.org:5556');
// Subscribe to the confirmed transactions event
sock.subscribe('tx');

// Create a callback function to process the data that is returned from the ZMQ
sock.on('message', msg => {
    // Split the data into an array
    const data = msg.toString().split(' ');
    console.log(data)

    // Filter for certain tag
    if (data[12] === 'MBPCHDRCWCWBTCICWB9CFA99999') {
        console.log(`Value: ${data[3]}` );
        console.log(`Timestamp: ${data[5]}` );
        console.log(`Tag: ${data[12]}` );

        // Get bundle and extract data
        const bundle = data[8];

        iota.findTransactionObjects({bundles: [bundle]})
            .then(transactionObject => {
                console.log('Decoded message:');
                console.log(decodeMessage(transactionObject));
            })
            .catch(err => console.error(err))
    }
});
