import { composeAPI, LoadBalancerSettings } from '@iota/client-load-balancer';
import { asciiToTrytes } from '@iota/converter';
import { defaultAddress, depth, minWeightMagnitude } from '../config.json';
import { ServiceFactory } from '../factories/serviceFactory';
import { generateSeed } from './iotaHelper';

//TODO: Migrate DID ?
export const sendMessage = (payload, tag) => {
    const seed = generateSeed();
    const message = asciiToTrytes(encodeURI(JSON.stringify(payload)));

    const transfers = [{
        value: 0,
        address: defaultAddress,
        message,
        tag
    }];

    const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
    const iota = composeAPI(loadBalancerSettings);

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
