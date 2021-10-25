import axios from 'axios';
import yargs from 'yargs';
import { faucet, faucetAmount } from '../config.json';
import { createNewUserC2 } from './credentialHelper';
import { writeData } from './databaseHelper';
import { generateNewWallet, getBalance } from './walletHelper.js';

const createUser = async () => {
    try {
        const { name, role = '', location = '' } = argv;	
        if (name && (role === 'SR' || role === 'SP')) {	
            console.log('Creating user...');
            createNewUserC2(name, role, location);	
        } else {	
            console.log('Params are missing or wrong');	
            return;	
        }	
    } catch (error) {
        console.error('Create user error', error);
    }
};

const createNewWallet = async () => {
    console.log('Creating wallet...');
    const wallet = generateNewWallet();
    const response = await axios.get(`${faucet}?address=${wallet.address}&amount=${faucetAmount}`);
    if (response.data.success) {
        const balance = await getBalance(wallet.address);
        await writeData('wallet', { ...wallet, balance });
    }
};

const argv = yargs
    .usage('Create new user or wallet')
    .example('$0 --create user --role SR --name user-SR-123 --location 47.934438,10.340688', 'Creates a new Service Requester with name user-SR-123')
    .required('create', 'Mode must be provided').describe('create', 'Create new user or wallet. Options: ["user", "wallet"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .describe('name', 'Define user name')
    .describe('location', 'Define location')
    .help('help')
    .options({
        create: { type: 'string', demandOption: true },
        name: { type: 'string' },
        role: { type: 'string' },
        location: { type: 'string' }
    })
    .argv;

if (argv.create === 'user') {
    createUser();
} else if (argv.create === 'wallet') {
    createNewWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}
