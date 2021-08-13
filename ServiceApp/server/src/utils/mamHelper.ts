import { asciiToTrytes, trytesToAscii } from '@iota/converter';
import {
    createChannel,
    createMessage,
    IMamMessage,
    mamAttach,
    mamFetchAll
} from '@iota/mam.js';
import { provider, security } from '../config.json';
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
            mamState.index = mamStateFromDB.keyIndex;
        } else {
            // Set channel mode & update key
            secretKey = generateSeed(81);
            mamState = createChannel(generateSeed(81), security, MAM_MODE[mode], secretKey);
        }

        // Create MAM Payload - STRING OF TRYTES
        const trytes = asciiToTrytes(encodeURI(JSON.stringify(packet)));
        const message = createMessage(mamState, trytes);

        // Attach the payload
        const bundle = await mamAttach(provider, message, tag);
        const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
      
        if (bundle && bundle.messageId) {
            // Check if the message was attached
            await checkAttachedMessage(root, secretKey, mode);

            // Save new mamState
            await writeData('mam', { ...mamState, id, root });
            return { hash: bundle.messageId, root, secretKey };
        }
        return null;
    } catch (error) {
        console.log('MAM publish Error', error);
        throw new Error(error);
    }
};

const checkAttachedMessage = async (root, secretKey, mode) => {
    let retries = 0;

    while (retries++ < 10) {
        const fetched = await mamFetchAll(provider, root, MAM_MODE[mode], secretKey, 20);
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

// //TODO: Both methods seem to be unused, also before remove-did-pr
// // Publish to tangle
// export const publishDID = async (publicKey, privateKey) => {
//     try {
//         let mamState;
//         const mamStateFromDB: IMamState = await readData('did');
//         if (mamStateFromDB) {
//             mamState = mamStateFromDB;
//         }

//         const message: IMamMessage = createMessage(mamState, asciiToTrytes(publicKey));

//         // Attach the payload
//         const bundle = await mamAttach(provider, message);
//         const root = mamStateFromDB && mamStateFromDB.root ? mamStateFromDB.root : message.root;
        
//         if (bundle && bundle.messageId) {
//             // Save new mamState
//             await writeData('did', { ...mamState, root, privateKey });
//             return message.root;
//         }
//         return null;
//     } catch (error) {
//         console.log('MAM publishDID Error', error);
//         throw new Error(error);
//     }
// };

// export const fetchDID = async root => {
//     const fetched = await mamFetchAll(provider, root, 'public', null, 20);
//     const result = [];
    
//     if (fetched && fetched.length > 0) {
//         for (let i = 0; i < fetched.length; i++) {
//             result.push(trytesToAscii(fetched[i].message));
//         }
//     }
//     return result;
// };
