const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const WebSocket = require('ws');

//var ws = new WebSocket("wss://echo.websocket.org");
//var ws = new WebSocket("ws://127.0.0.1:1880/ws/sp")

const iota = Iota.composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
});

exports.fetchFromTangle = data => {
    return new Promise((resolve, reject) => {
        //Get bundle and extract data
        var bundle = data[8];

        iota.findTransactionObjects({ bundles: [bundle] })
            .then(transObj => {
                // Modify to consumable length
                const trytes = transObj[0].signatureMessageFragment + '9';
                //Convert to text
                msg = Converter.trytesToAscii(trytes);
                resolve(msg);
            })

            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};

exports.sendMessage = data => {
    var json = JSON.parse(data);

    //Extract Dienstleistungs ID and Type of Message
    var type = json.frame.type;
    var serviceID = json.dataElements.submodels[0].identification.id;

    //Remove #, -, version number from Dienstleistungs ID to build tag
    //Convert tag to Trytes to be suitable for Tag (Allowed: 'A-Z & 9')
    var abbrServiceID = serviceID.replace(/#/g, '').replace(/-/g, '');
    var tag = abbrServiceID.substr(0, abbrServiceID.length - 3);
    tag = Converter.asciiToTrytes(tag);

    if (type === 'callForProposal') {
        this.sendToTangle(data, tag);
        sock.connect('tcp://zmq.devnet.iota.org:5556');
        sock.subscribe('tx');
        sock.on('message', msg => {
            const data = msg.toString().split(' ');

            //Filter for certain tag
            if (data[12] == tag) {
                console.log('RECEIVED ANOTHER MSG FROM ZMQ');
                const get = async () => {
                    let message = await fetch.fetchFromTangle(data);
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
    const seed =
        'GXJ9NZBEYLNBIKIURJFCSYOATERR9TFCZTHHRICRESIHPSLRIZAZUGNHTCVDZSLO9ZSKTITCRJRWWZTLB';
    const message = Converter.asciiToTrytes(properties);
    address =
        'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD';

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
            return iota.sendTrytes(trytes, 3, 9);
        })
        .then(bundle => {
            console.log(
                `Published transaction with tail hash: ${bundle[0].hash}`
            );
            console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`);
        })

        .catch(err => {
            // Catch any errors
            console.log(err);
        });
};

exports.sendToUI = (data, role) => {
    //var ws = new WebSocket("ws://10.197.0.135:1880/ws/cfp")
    var ws = new WebSocket('ws://127.0.0.1:1880/ws/' + role);

    ws.onopen = () => {
        ws.send(data);
    };
};
