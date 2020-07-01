import { composeAPI, LoadBalancerSettings } from '@iota/client-load-balancer';
import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import {
    createChannel,
    createMessage,
    IMamMessage,
    mamAttach,
    mamFetchAll
} from '@iota/mam.js';
import { depth, minWeightMagnitude, security } from '../config.json';
import { ServiceFactory } from '../factories/serviceFactory';
import { readData, writeData } from './databaseHelper';
import { generateSeed } from './iotaHelper';

// An enumerator for the different MAM Modes. Prevents typos in regards to the different modes.
enum MAM_MODE {
    private = 'private',
    public = 'public',
    restricted = 'restricted'
}

interface IMamState {
    id?: string;
    root?: string;
    seed?: string;
    nextRoot?: string;
    sideKey?: string;
    start?: number;
    mode?: MAM_MODE;
    security?: number;
    count?: number;
    nextCount?: number;
    index?: number;
    keyIndex?: number;
    keyId?: string;
}

// Publish to tangle
export const publish = async (id, packet, mode = 'restricted', tag = 'SEMARKETMAM') => {
    try {
        let mamState;
        let secretKey;
        const mamStateFromDB: IMamState = await readData('mam', id);
        if (mamStateFromDB) {
            secretKey = mamStateFromDB.sideKey;
            mamState = mamStateFromDB;
        } else {
            // Set channel mode & update key
            secretKey = generateSeed(81);
            mamState = createChannel(generateSeed(81), security, MAM_MODE[mode], secretKey);
        }

        // Create MAM Payload - STRING OF TRYTES
        const trytes = asciiToTrytes(encodeURI(JSON.stringify(packet)));
        const message: IMamMessage = createMessage(mamState, trytes);

        // Attach the payload
        const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
        const api = composeAPI(loadBalancerSettings);

        const bundle = await mamAttach(api, message, depth, minWeightMagnitude, tag);
        const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
      
        if (bundle && bundle.length && bundle[0].hash) {
            // Check if the message was attached
            await checkAttachedMessage(api, root, secretKey, mode);

            // Save new mamState
            await writeData('mam', { ...mamState, id, root });
            return { hash: bundle[0].hash, root, secretKey };
        }
        return null;
    } catch (error) {
        console.log('MAM publish Error', error);
        throw new Error(error);
    }
};

const checkAttachedMessage = async (api, root, secretKey, mode) => {
    let retries = 0;

    while (retries++ < 10) {
        const fetched = await mamFetchAll(api, root, MAM_MODE[mode], secretKey, 20);
        const result = [];
        
        if (fetched && fetched.length > 0) {
            for (let i = 0; i < fetched.length; i++) {
                result.push(trytesToAscii(fetched[i].message));
            }
        }

        if (result.length > 0) {
            return result.length;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

// Publish to tangle
export const publishDID = async (publicKey, privateKey) => {
    try {
        let mamState;
        const mamStateFromDB: IMamState = await readData('did');
        if (mamStateFromDB) {
            mamState = mamStateFromDB;
        }

        const message: IMamMessage = createMessage(mamState, asciiToTrytes(publicKey));

        // Attach the payload
        const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
        const api = composeAPI(loadBalancerSettings);

        const bundle = await mamAttach(api, message, depth, minWeightMagnitude);
        const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
        
        if (bundle && bundle.length && bundle[0].hash) {
            // Save new mamState
            await writeData('did', { ...mamState, root, privateKey });
            return message.root;
        }
        return null;
    } catch (error) {
        console.log('MAM publishDID Error', error);
        throw new Error(error);
    }
};

export const fetchDID = async root => {
    const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
    const api = composeAPI(loadBalancerSettings);

    const fetched = await mamFetchAll(api, root, 'public', null, 20);
    const result = [];
    
    if (fetched && fetched.length > 0) {
        for (let i = 0; i < fetched.length; i++) {
            result.push(trytesToAscii(fetched[i].message));
        }
    }
    return result;
};
