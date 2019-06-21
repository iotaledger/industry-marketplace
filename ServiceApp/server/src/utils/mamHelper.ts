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

    // Save new mamState
    await writeData({ ...message.state, root: message.root }, `mam-${channelId}`);

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9, tag);

    return mamStateFromDB ? mamStateFromDB.root : message.root;
};

export const fetch = async root => {
    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode);
    return result.messages.map(message => JSON.parse(trytesToAscii(message)));
};
