import { getRandomRow, updateValue, readAllData, writeData } from './databaseHelper';
import { getBalance, getBalanceForSimulator } from './walletHelper';
import { generateAddress } from '@iota/core';

export const initializeWalletQueue = async () => {

    //Rotate Incoming Wallet 
    //reset all reserved,busy wallets to usable
    const wallet : any = await readAllData('wallet');

    wallet.forEach(async ({ seed, status }) => {
        if (status === 'reserved' || 'busy') {
            await updateValue('wallet', 'seed', 'status', seed, 'usable')
        }
    });

    //Check if balance correct
    await checkAddressBalance();

    interface IWallet {
        seed?: string;
    }

    //reserve random wallet for incoming payments
    const newIncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'usable');
    const { seed } = await newIncomingWallet
    await updateValue('wallet', 'seed', 'status', seed, 'reserved')
}


export const repairWallet = async (seed, keyIndex) => {

    return new Promise(async (resolve, reject) => {

        await updateValue('wallet', 'seed', 'status', seed, 'repairing')

        let iterable = [-2, -1, 0, 1, 2];

        for (let value of iterable) {
            const newIndex = Number(keyIndex) + Number(value)
            value += 1;
            const newAddress = await generateAddress(seed, newIndex);
            const balance = await getBalance(newAddress);
            console.log(balance)

            if (balance > 0) {
                await writeData('wallet', { address: newAddress, balance, keyIndex: newIndex, seed, status: 'usable' });
                resolve(); 
            }
        } reject(); 

    });
}


export const checkAddressBalance = async () => {

        const wallet: any = await readAllData('wallet');

        for (let each of wallet) {
            const { seed, address, keyIndex, status} = await each
            let balance = await getBalanceForSimulator(address);

            console.log("Wallet", address, balance, status)
            if (balance === 0 && (status === "usable" || status === "reserved")) {
                await repairWallet(seed, keyIndex)
            }
        }
    }

