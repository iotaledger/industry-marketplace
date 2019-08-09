import axios from 'axios';
import yargs from 'yargs';
import { faucet } from '../config.json';
import { createUser, createWallet } from './databaseHelper';

const createNewUser = async () => {
    const { name, role = '', areaCode = '' } = argv;
    if (name && (role === 'SR' || role === 'SP')) {
        return await createUser({ id: '', name, role, areaCode });
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
    .example('$0 --create user --role SR --name user-SR-123 --areaCode NPHTQORL9XK', 'Creates a new Service Requester with name user-SR-123')
    .required('create', 'Mode must be provided').describe('create', 'Create new user or wallet. Options: ["user", "wallet"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .describe('name', 'Define user name')
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
