import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import Mam, { MamMode } from '@iota/mam';
import crypto from 'crypto';
import { minWeightMagnitude, provider } from '../config.json';
import { readData, writeData } from './databaseHelper';

interface IMamState {
    id?: string;
    root?: string;
    seed?: string;
    next_root?: string;
    side_key?: string;
    start?: number;
}

// Random Key Generator
const generateRandomKey = length => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    const values = crypto.randomBytes(length);
    return Array.from(new Array(length), (x, i) => charset[values[i] % charset.length]).join('');
};

// Publish to tangle
export const publish = async (id, packet, mode: MamMode = 'restricted', tag = 'SEMARKETMAM') => {
    try {
        let mamState = Mam.init(provider);
        let secretKey;
        const mamStateFromDB: IMamState = await readData('mam', id);
        if (mamStateFromDB) {
            mamState = {
                subscribed: [],
                channel: {
                    side_key: mamStateFromDB.side_key,
                    mode,
                    next_root: mamStateFromDB.next_root,
                    security: 2,
                    start: mamStateFromDB.start,
                    count: 1,
                    next_count: 1,
                    index: 0
                },
                seed: mamStateFromDB.seed
            };
            secretKey = mamStateFromDB.side_key;
        } else {
            // Set channel mode & update key
            secretKey = generateRandomKey(81);
            mamState = Mam.changeMode(mamState, mode, secretKey);
        }

        // Create MAM Payload - STRING OF TRYTES
        const trytes = asciiToTrytes(encodeURI(JSON.stringify(packet)));
        const message = Mam.create(mamState, trytes);
        const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
        const { channel: { next_root, side_key, start }, seed } = message.state;
      
        // Attach the payload
        const bundle = await Mam.attach(message.payload, message.address, 3, minWeightMagnitude, tag);
        if (bundle && bundle.length && bundle[0].hash) {
            // Save new mamState
            await writeData('mam', { id, root, seed, next_root, side_key, start });
            return { hash: bundle[0].hash, root, secretKey };
        }
        return null;
    } catch (error) {
        console.log('MAM publish Error', error);
        throw new Error(error);
    }
};

// Publish to tangle
export const publishDID = async (publicKey, privateKey) => {
    try {
        let mamState = Mam.init(provider);
        const mamStateFromDB: IMamState = await readData('did');
        if (mamStateFromDB) {
            mamState = {
                subscribed: [],
                channel: {
                    side_key: null,
                    mode: 'public',
                    next_root: mamStateFromDB.next_root,
                    security: 2,
                    start: mamStateFromDB.start,
                    count: 1,
                    next_count: 1,
                    index: 0
                },
                seed: mamStateFromDB.seed
            };
        }

        const message = Mam.create(mamState, asciiToTrytes(publicKey));
        const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
        const { channel: { next_root, start }, seed } = message.state;
      
        // Attach the payload
        const bundle = await Mam.attach(message.payload, message.address, 3, 9);
        if (bundle && bundle.length && bundle[0].hash) {
            // Save new mamState
            await writeData('did', { root, privateKey, seed, next_root, start });
            return message.root;
        }
        return null;
    } catch (error) {
        console.log('MAM publishDID Error', error);
        throw new Error(error);
    }
};

export const fetchDID = async root => {
    Mam.init(provider);
    const result: any = await Mam.fetch(root, 'public');
    return result && result.messages && result.messages.map(trytesToAscii);
};

// export const fetchFromRoot = async (root, secretKey) => {
//     // Output syncronously once fetch is completed
//     const mode = 'restricted';
//     const result = await Mam.fetch(root, mode, secretKey);
//     return result && result.messages.map(message => JSON.parse(trytesToAscii(message)));
// };

// export const fetchFromChannelId = async channelId => {
//     const channelData: IMamState = await readData('mam', channelId);
//     if (channelData) {
//         return await fetchFromRoot(channelData.root, channelData.side_key);
//     }
//     return [];
// };

/*
Example write operation:

import uuid from 'uuid/v4';
import { publish } from './mamHelper';

const channelId = uuid();

await publish(channelId, { message: 'Message from Alice' });
await publish(channelId, { message: 'Message from Bob' });

*/

/*
Example read operation:

import { fetchFromChannelId } from './mamHelper';

const fetchData = async channelId => {
    const messages = await fetchFromChannelId(channelId);
    messages.forEach(message => console.log(message));
}

*/
