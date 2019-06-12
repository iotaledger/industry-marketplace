// Require the IOTA libraries
const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');
const { generateSeed } = require('./helpers');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const provider = 'https://nodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

function sendMessage(purpose, data_elements, conversation_ID, message_ID, reply_by, value) {
    const payload = {
      'Purpose': purpose,
      'Dataelements': data_elements,
      'Conversation_ID': conversation_ID,
      'Message_ID': message_ID,
      'Reply_by': reply_by
    }

    const seed = generateSeed();

    const message = asciiToTrytes(JSON.stringify(payload));

    const address = 'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD';

    const tag = 'SEMARKETABC9999999999999999';

    //transfer array specifies transfers you want to make
    const transfers = [{ value, address, message, tag }];

    iota.prepareTransfers(seed, transfers)
        .then(trytes => iota.sendTrytes(trytes, 3, 9))
        .then(bundle => {
            console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
            console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`);
        })
        .catch(err => console.log(err));
}

sendMessage('cfp', 'Bohren!!!', 766, '836482f', 12022020, 0);
