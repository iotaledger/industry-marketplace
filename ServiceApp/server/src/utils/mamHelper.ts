import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import Mam from '@iota/mam';
import crypto from 'crypto';
import { provider } from '../config.json';
import { readData, writeData } from './databaseHelper';

const mode = 'restricted';

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
export const publish = async (id, packet, tag = 'SEMARKETMAM') => {

    try {
        let mamState;
        let secretKey;
        const mamStateFromDB: IMamState = await readData('mam', id);
        if (mamStateFromDB) {
            mamState = {
                subscribed: [],
                channel: {
                    side_key: mamStateFromDB.side_key,
                    mode: 'restricted',
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
            // Initialise MAM State
            mamState = Mam.init(provider);
            
            // Set channel mode & update key
            secretKey = generateRandomKey(81);
            mamState = Mam.changeMode(mamState, 'restricted', secretKey);
        }

        // Create MAM Payload - STRING OF TRYTES
        const trytes = asciiToTrytes(JSON.stringify(packet));
        const message = Mam.create(mamState, trytes);
        const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
        const { channel: { next_root, side_key, start }, seed } = message.state;
      
        // Attach the payload
        const bundle = await Mam.attach(message.payload, message.address, 3, 9, tag);
        if (bundle && bundle.length && bundle[0].hash) {
            // Save new mamState
            await writeData('mam', { id, root, seed, next_root, side_key, start });
            return { hash: bundle[0].hash, root, secretKey };
        }
        return null;
    } catch (error) {
        console.log('MAM publish Error', error);
        return null;
    }
};

export const fetchFromRoot = async (root, secretKey) => {
    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode, secretKey);
    return result.messages.map(message => JSON.parse(trytesToAscii(message)));
};

export const fetchFromChannelId = async channelId => {
    const channelData: IMamState = await readData('mam', channelId);
    if (channelData) {
        return await fetchFromRoot(channelData.root, channelData.side_key);
    }
    return [];
};

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
