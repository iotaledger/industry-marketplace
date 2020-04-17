import { asciiToTrytes } from '@iota/converter';
import { composeAPI } from '@iota/core';
import { defaultAddress, depth, minWeightMagnitude, provider } from '../config.json';
import { generateSeed } from './iotaHelper';

const iota = composeAPI({ provider });

export const sendMessage = (payload, tag) => {
    const seed = generateSeed();
    const message = asciiToTrytes(encodeURI(JSON.stringify(payload)));

    const transfers = [{
        value: 0,
        address: defaultAddress,
        message,
        tag
    }];

    return new Promise((resolve, reject) => {
        iota.prepareTransfers(seed, transfers)
            .then(trytes => {
                iota.sendTrytes(trytes, depth, minWeightMagnitude)
                    .then(bundle => {
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
