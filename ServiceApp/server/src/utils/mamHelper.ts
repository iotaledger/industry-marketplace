import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import Mam from '@iota/mam';
import { provider } from '../config.json';
import { readData, writeData } from './databaseHelper';

const mode = 'public';

interface IMamState {
    channel?: any;
    root?: string;
    subscribed?: [];
    seed?: string;
}

// Publish to tangle
export const publish = async (channelId, packet, tag = 'SEMARKETMAM') => {
    let mamState;
    const mamStateFromDB: IMamState = await readData(`mam-${channelId}`);
    if (mamStateFromDB) {
        mamState = mamStateFromDB;
    } else {
        // Initialise MAM State
        mamState = Mam.init(provider);
    }

    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);
    const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;

    // Save new mamState
    await writeData({ ...message.state, root }, `mam-${channelId}`);

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9, tag);

    return root;
};

export const fetchFromRoot = async root => {
    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode);
    return result.messages.map(message => JSON.parse(trytesToAscii(message)));
};

export const fetchFromChannelId = async channelId => {
    const channelData: IMamState = await readData(`mam-${channelId}`);
    if (channelData) {
        return await fetchFromRoot(channelData.root);
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
import { readData } from './databaseHelper';

const fetchData = async channelId => {
    const messages = await fetchFromChannelId(channelId);
    messages.forEach(message => console.log(message));
}

*/
