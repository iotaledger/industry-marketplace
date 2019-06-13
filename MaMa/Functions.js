const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');
const zmq = require('zeromq');
const WebSocket = require('ws');
const { decodeMessage, getLetterFromNumber, getCodeFromMessageType } = require('./helpers');


const sock = zmq.socket('sub');

const provider = 'https://nodes.devnet.iota.org:443';

//var ws = new WebSocket("wss://echo.websocket.org");
//var ws = new WebSocket("ws://127.0.0.1:1880/ws/sp")

const iota = composeAPI({ provider });

exports.fetchFromTangle = data => {
    return new Promise((resolve, reject) => {
        // Get bundle and extract data
        const bundle = data[8];

        iota.findTransactionObjects({ bundles: [bundle] })
            .then(transactionObject => {
                const msg = decodeMessage(transactionObject);
                resolve(msg);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};

exports.sendMessage = data => {
    const json = JSON.parse(data);

    // Extract Dienstleistungs ID and Type of Message
    const type = json.frame.type;
    const serviceID = json.dataElements.submodels[0].identification.id;

    // Remove #, -, version number from Dienstleistungs ID to build tag
    // Convert tag to Trytes to be suitable for Tag (Allowed: 'A-Z & 9')
    const abbrServiceID = serviceID.replace(/#/g, '').replace(/-/g, '');
    let tag = abbrServiceID.substr(0, abbrServiceID.length - 3);
    tag = asciiToTrytes(tag);

    if (type === 'callForProposal') {
        this.sendToTangle(data, tag);
        sock.connect('tcp://zmq.devnet.iota.org:5556');
        sock.subscribe('tx');
        sock.on('message', msg => {
            const data = msg.toString().split(' ');

            // Filter for certain tag
            if (data[12] == tag) {
                console.log('RECEIVED ANOTHER MSG FROM ZMQ');
                const get = async () => {
                    const message = await fetch.fetchFromTangle(data);
                    publish.sendToUI(message, role);
                    console.log('GOT MSG FROM TANGLE');
                };

                get();
            }
        });
        // publish.sendToUI(data)
    }

    if (type === 'rejectProposal') {
        this.sendToTangle(data, tag);
        // publish.sendToUI(data)
    }

    if (type === 'acceptProposal') {
        this.sendToTangle(data, tag);
        // publish.sendToUI(data)
    }
};

exports.sendToTangle = (properties, tag) => {
    const seed = 'GXJ9NZBEYLNBIKIURJFCSYOATERR9TFCZTHHRICRESIHPSLRIZAZUGNHTCVDZSLO9ZSKTITCRJRWWZTLB';
    const message = asciiToTrytes(properties);
    const address = 'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD';

    // transfer array specifies transfers you want to make
    const transfers = [{
        value: 0,
        address,
        message,
        tag
    }];

    iota.prepareTransfers(seed, transfers)
        .then(trytes => iota.sendTrytes(trytes, 3, 9))
        .then(bundle => {
            console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
            console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`);
        })
        .catch(err => console.log(err));
};

exports.sendToUI = (data, role) => {
    //var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")
    const ws = new WebSocket('ws://127.0.0.1:1880/ws/' + role);

    ws.onopen = () => {
        ws.send(data);
    };
};


exports.buildTag = (messageType, id) => {

    console.log(messageType)
    messageTypecode = getCodeFromMessageType(messageType)
    console.log(messageTypecode)
    id = id.replace(/#/g, '').replace(/-/g, '');
    id = id.substr(4);
    id = id.split("")
  

    var tag = "SEMARKET"
          + messageTypecode
          + getLetterFromNumber(parseInt(id[0]))
          + getLetterFromNumber(parseInt(id[1]))         
          + getLetterFromNumber(parseInt(id[2]))
          + id[3]
          + id[4]
          + id[5]
          + getLetterFromNumber(parseInt(id[6])) 
          + getLetterFromNumber(parseInt(id[7]))
          + getLetterFromNumber(parseInt(id[8]))
          + getLetterFromNumber(parseInt(id[9]))
          + getLetterFromNumber(parseInt(id[10])) 
          + getLetterFromNumber(parseInt(id[11]))
          + "999999"
    return tag

}

exports.alterTag = (tag, type) => {

    newType = getCodeFromMessageType(type)
    newTag = tag.substr(0,8) + newType + tag.substr(9)

    return newTag
}