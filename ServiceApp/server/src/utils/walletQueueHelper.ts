//import axios from 'axios';
//import config from '../config.json';
import { readRow, updateValue, readAllData, writeData } from './databaseHelper';
//import { getBalance, getBalanceForSimulator, generateNewWallet } from './walletHelper';
import { getBalance, getBalanceForSimulator} from './walletHelper';
import { generateAddress } from '@iota/core';


export const initializeWalletQueue = async () => {

    //Rotate Incoming Wallet 
    //reset all reserved,busy wallets to usable
    const wallet: any = await readAllData('wallet');

    wallet.forEach(async ({ seed, status }) => {
        if (status === 'reserved' || status === 'busy') {
            await updateValue('wallet', 'seed', 'status', seed, 'usable')
        }
    });

    //Check if balance correct and if not repair wallet
    await checkAddressBalance();

    //reserve random wallet for incoming payments
    const { seed }: any = await readRow('wallet', 'status', 'usable');
    await updateValue('wallet', 'seed', 'status', seed, 'reserved')
}


export const repairWallet = async (seed, keyIndex) => {
    try {
        return new Promise(async (resolve, reject) => {
		const repair = await generateAddress(seed, keyIndex)
            console.log("repairing address", repair )
            await updateValue('wallet', 'seed', 'status', seed, 'error')

            let iterable = [-2, -1, 0, 1, 2, 3, -3];

            for (let value of iterable) {
                const newIndex = Number(keyIndex) + Number(value)
                value += 1;
                const newAddress = await generateAddress(seed, newIndex)
                const balance = await getBalance(newAddress);

                if (balance > 0) {
                    await writeData('wallet', { address: newAddress, balance, keyIndex: newIndex, seed, status: 'usable' });
                    resolve();
                }
            }
               
            await updateValue('wallet', 'seed', 'status', seed, 'error')

            //If it was not possible to repair wallet, generate new one
           // console.log('Wallet', repair, 'could not be repaired. Creating wallet...');
           // const wallet = generateNewWallet();
           // await axios.get(`${config.faucet}?address=${wallet.address}&amount=${config.faucetAmount}`);
            //const balance = await getBalance(wallet.address);
          //  await writeData('wallet', { address: wallet.address, balance, keyIndex: wallet.keyIndex, seed: wallet.seed, status: 'usable' });
        });
    } catch (error) {
        console.log("Repair wallet Error", error)
    }
}


export const checkAddressBalance = async () => {

    const wallet: any = await readAllData('wallet');

    for (let each of wallet) {
        const { seed, address, keyIndex, status } = await each
        let balance = await getBalanceForSimulator(address);

        console.log("Wallet", address, balance, status)
        if (balance === 0 && (status === "usable" || status === "reserved")) {
            await repairWallet(seed, keyIndex)
        }
 if (balance > 0 && status === "pending") {
            await updateValue('wallet', 'seed', 'status', seed, 'usable')
        }
    }
}

