import axios from 'axios';
import yargs from 'yargs';
import { faucet } from '../config.json';
import { createUser, createWallet, writeData} from './databaseHelper';
import { publishDID } from './mamHelper';
import { generateKeyPair } from './encryptionHelper';

const createNewUser = async () => {
    const { id, role = '', areaCode = '' } = argv;

    if (id && (role === 'SR' || role === 'SP')) {
        const { publicKey, privateKey }: any = await generateKeyPair();

        const root = await publishDID(publicKey);
        await writeData('did', { root, privateKey });
        const did = `did:iota:${root}`;
        return await createUser({ id: did, name: id, role, areaCode });
    } else {
        console.log('Params are missing or wrong');
        return;
    }
};

const createNewWallet = async () => {
    console.log('Creating wallet...');
    const response = await axios.get(faucet);
    const data = response.data;
    if (data.success) {
        await createWallet(data.wallet);
    }
};

const argv = yargs
    .usage('Create new user or wallet')
    .example('$0 --create user --role SR --id user-SR-123 --areaCode NPHTQORL9XK', 'Creates a new Service Requester with ID user-SR-123')
    .required('create', 'Mode must be provided').describe('create', 'Create new user or wallet. Options: ["user", "wallet"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .describe('id', 'Define user ID')
    .describe('areaCode', 'Define location')
    .help('help')
    .argv;

if (argv.create === 'user') {
    createNewUser();
} else if (argv.create === 'wallet') {
    createNewWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}
