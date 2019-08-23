import { getRandomRow, updateValue, readAllData, writeData } from './databaseHelper';
import { getBalance, getBalanceForSimulator } from './walletHelper';
import { generateAddress } from '@iota/core';

export const initializeWalletQueue = async () => {

    await checkAddressBalance();

    //Rotate Incoming Wallet 
    //reset all reserved,busy wallets to usable
    const wallet: any = await readAllData('wallet');

    wallet.forEach(async ({ seed, status }) => {
        if(status === 'reserved' || 'busy'){
           await updateValue('wallet', 'seed','status', seed, 'usable')
        }
    });

    interface IWallet {
        seed?: string;
    }

    //reserve random wallet for incoming payments
    const newIncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'usable');
    const {seed} = await newIncomingWallet
    await updateValue('wallet', 'seed','status', seed, 'reserved')
}

const checkAddressBalance = async () => {

    const wallet: any = await readAllData('wallet');
    for (let each of wallet) {     
        const { seed, address, keyIndex } = each
        let balance = await getBalanceForSimulator(address);
        console.log("Walletstatus", address, balance)

        let iterable = [-2,-1,0,1,2];
        if (balance <= 0) {
        for (let value of iterable) {
                const index = Number(keyIndex) + Number(value)
                value += 1;
    
                const newAddress = await generateAddress(seed, index);
                balance = await getBalance(newAddress);
    
                if (balance > 0) {
                    await writeData('wallet', { address: newAddress, balance, keyIndex, seed, status: 'usable' });
                }
        
            }
        }
    }
 
}
