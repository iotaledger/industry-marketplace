import axios from 'axios';
import yargs from 'yargs';
import config from '../config.json';
import { writeData} from './databaseHelper';
import { publishDID } from './mamHelper';
import { generateKeyPair } from './encryptionHelper';
import {generateNewWallet, getBalance} from './walletHelper';

const createNewUser = async () => {
    const { name, role = '', location = ''} = argv;

    if (name && (role === 'SR' || role === 'SP')) {
        const { publicKey, privateKey }: any = await generateKeyPair();
        const root = await publishDID(publicKey, privateKey);
        await writeData('did', { root, privateKey });
        const id = `did:iota:${root}`;
        return await writeData('user', { id, name, role, location});
    } else {
        console.log('Params are missing or wrong');
        return;
    }
};

const createNewWallet = async () => {
        console.log('Creating wallet...');
        const wallet = generateNewWallet();
        const response = await axios.get(`${config.faucet}?address=${wallet.address}&amount=${config.faucetAmount}`);
        if (response.data.success) {
            const balance = await getBalance(wallet.address);
            await writeData('wallet', { ...wallet, balance });
        }
    };


const argv = yargs
    .usage('Create new user or wallet')
    .example('$0 --create user --role SR --name user-SR-123 --location 47.934438,10.340688')
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
