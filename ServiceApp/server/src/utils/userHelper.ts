import yargs from 'yargs';
import { writeData, readData } from './databaseHelper';
import { generateNewWallet, getBalance, transferFunds } from './walletHelper';
import { createNewUser } from './credentialHelper';

const createUser = async () => {
    const { name, role = '', location = '' } = argv;
    if (name && (role === 'SR' || role === 'SP')) {
        createNewUser(name, role, location);
    } else {
        console.log('Params are missing or wrong');
        return;
    }
};

const createNewWallet = async () => {
    console.log('Creating wallet...');
    try {
        const wallet = generateNewWallet();

        interface IFaucet {
            address?: string;
            balance?: number;
            keyIndex?: number;
            seed?: string;
        }

        const faucet: IFaucet = await readData('faucet');
        const transfer = [{ address: wallet.address, value: 250000 }]

        await transferFunds(faucet, 250000, transfer)
        const balance = await getBalance(wallet.address);
        if(balance != 0){
           await writeData('wallet', { ...wallet, balance });
        }
    } catch (e) {
        console.log("wallet-error", e)
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
    createUser();
} else if (argv.create === 'wallet') {
    createNewWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}