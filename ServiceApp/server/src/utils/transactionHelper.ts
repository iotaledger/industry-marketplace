import { asciiToTrytes } from '@iota/converter';
import { composeAPI } from '@iota/core';
import { defaultAddress, provider } from '../config.json';
import { generateSeed } from './iotaHelper';

const iota = composeAPI({ provider });

export const sendMessage = (payload, tag) => {
    const seed = generateSeed();
    const message = asciiToTrytes(JSON.stringify(payload));

    const transfers = [{
        value: 0,
        address: defaultAddress,
        message,
        tag
    }];

    return new Promise((resolve, reject) => {
        iota.prepareTransfers(seed, transfers)
            .then(trytes => {
                iota.sendTrytes(trytes, 3, 9)
                    .then(bundle => {
                        console.log("Send to tangle with bundle hash:",bundle[0].hash)
                        // console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
                        // console.log(`Bundle: ${JSON.stringify(bundle, null, 1)}`);
                        resolve(bundle[0].hash);
                    })
                    .catch(error => {
                        console.log('sendTrytes Error', error);
                        reject(error);
                    });
            })
            .catch(error => {
                console.log('prepareTransfers Error', error);
                reject(error);
            });
    });
};
