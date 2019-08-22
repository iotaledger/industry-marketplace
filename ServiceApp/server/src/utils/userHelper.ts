import axios from 'axios';
import yargs from 'yargs';
import { faucet } from '../config.json';
import { createWallet, writeData } from './databaseHelper';
import { generateKeyPair } from './encryptionHelper';
import { publishDID } from './mamHelper';

const createNewUser = async () => {
    const { name, role = '', location = '', paymentQueue = 'true' } = argv;
    if (name && (role === 'SR' || role === 'SP')) {
        // Generate key pair
        const { publicKey, privateKey }: any = await generateKeyPair();
        const root = await publishDID(publicKey, privateKey);
        const id = `did:iota:${root}`;
        const usePaymentQueue = paymentQueue === 'true' ? 1 : 0;
        return await writeData('user', { id, name, role, location, usePaymentQueue });
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
    .example('$0 --create user --role SR --name user-SR-123 --location 47.934438,10.340688 --paymentQueue true', 'Creates a new Service Requester with name user-SR-123')
    .required('create', 'Mode must be provided').describe('create', 'Create new user or wallet. Options: ["user", "wallet"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .describe('name', 'Define user name')
    .describe('location', 'Define location')
    .describe('paymentQueue', 'Define if cloud-based payment queue should be used to speed up multiple payments')
    .help('help')
    .argv;

if (argv.create === 'user') {
    createNewUser();
} else if (argv.create === 'wallet') {
    createNewWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}
