import yargs from 'yargs';
import { writeData } from './databaseHelper';
import { generateNewWallet, getBalance,funding } from './walletHelper';

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
    const walletDelay = Number(process.env.WALLETDELAY)
    await new Promise(resolved => setTimeout(resolved, walletDelay));
    console.log('Creating wallet...');
    const wallet = generateNewWallet();

    const seed = 'SEED99999999999999999999999999999999999999999999999999999999999999999999999'
    const transfers = [{ address: wallet.address, value: 250000 }]
    await funding(seed, transfers)

    // for (let index of [0,1,2,3,4,5,6,7 ,8 ,9 ,10 ,11 , 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    //     const seed = 'SEED99999999999999999999999999999999999999999999999999999999999999999999999'

    //     const newAddress = await generateAddress(seed, index)
    //     const newBalance = await getBalance(newAddress);
    //     console.log(newAddress, newBalance, index)

    //     if (newBalance > 0) {
    //      const faucet: IFaucet = { address: newAddress, balance: newBalance, keyIndex: index, seed: seed }
    //   console.log("use faucet", faucet)
    //   const transfers = [{ address: wallet.address, value: 250000 }]
    //  await transferFunds(faucet, 250000, transfers, true)
    const balance = await getBalance(wallet.address);
    if (balance != 0) {
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
    createUser();
} else if (argv.create === 'wallet') {
    createNewWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}