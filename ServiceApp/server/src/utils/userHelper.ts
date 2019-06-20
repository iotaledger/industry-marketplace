import fetch from 'node-fetch';
import yargs from 'yargs';
import { faucet } from '../config.json';
import { writeData } from './databaseHelper';

const createUser = async () => {
    const { id, role } = argv;
    if (!id || !role || !['SR', 'SP'].includes(role)) {
        console.log('Params are missing or wrong');
        return;
    }
    await writeData({ id, role }, 'user', 'new');
};

const createWallet = async () => {
    console.log('Creating wallet...');
    const response = await fetch(faucet);
    const json = await response.json();
    if (json.success) {
        await writeData(json.wallet, 'wallet', 'new');
    }
};

const argv = yargs
    .usage('Create new user or wallet')
    .example('$0 --create user --role SR --id user-123', 'Creates a new Service Requeser with ID user-123')
    .required('create', 'Mode must be provided').describe('create', 'Create new user or wallet. Options: ["user", "wallet"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .describe('id', 'Define user ID')
    .help('help')
    .argv;

if (argv.create === 'user') {
    createUser();
} else if (argv.create === 'wallet') {
    createWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}
