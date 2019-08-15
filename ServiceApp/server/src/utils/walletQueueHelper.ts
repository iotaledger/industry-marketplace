import { getRandomRow, updateValue, readAllData, writeData } from './databaseHelper';
import { getBalance } from './walletHelper';
import { generateAddress } from '@iota/core';

export const initializeWalletQueue = async () => {

    checkAddressBalance();

    interface IWallet {
        seed?: string;
    }

    //Rotate Incoming Wallet 

    //set reserved wallet back to usable
    const IncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'reserved');
    if (IncomingWallet) {
        const { seed } = await IncomingWallet
        updateValue(seed, 'usable')
    }

    //reserve random wallet
    const newIncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'usable');
    const reservedSeed = await newIncomingWallet.seed
    updateValue(reservedSeed, 'reserved')
}

const checkAddressBalance = async () => {

    const wallet: any = await readAllData('wallet');

    wallet.forEach(async ({ seed, address, keyIndex }) => {

        //Check balance of all addresses 
        let balance = await getBalance(address);
        if (balance <= 0) {
            [-2, -1, 0, 1, 2].forEach(async tempIndex => {
                const index = Number(keyIndex) + Number(tempIndex)
    
                const newAddress = await generateAddress(seed, index);
                balance = await getBalance(newAddress);

                if (balance > 0) {
                    await writeData('wallet', { address: newAddress, balance, keyIndex, seed });
                }
 
            })
        }
    });
}
