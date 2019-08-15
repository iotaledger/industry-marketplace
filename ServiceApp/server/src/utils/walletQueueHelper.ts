import { getRandomRow, updateValue, readAllData, writeData } from './databaseHelper';
import { getBalance } from './walletHelper';
import { generateAddress } from '@iota/core';

export const initializeWalletQueue = async () => {

    await checkAddressBalance();

    //Rotate Incoming Wallet 

    //set reserved wallet back to usable
    // const IncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'reserved');
    // if (IncomingWallet) {
    //     const { seed } = await IncomingWallet
    //     updateValue(seed, 'usable')
    // }

    //reset all reserved,busy wallets to usable
    const wallet: any = await readAllData('wallet');

    wallet.forEach(async ({ seed, status }) => {
        if(status === 'reserved' || 'busy'){
           await updateValue(seed, 'usable')
        }
    });


    interface IWallet {
        seed?: string;
    }

    //reserve random wallet
    const newIncomingWallet: IWallet = await getRandomRow('wallet', 'status', 'usable');
    const {seed} = await newIncomingWallet
    updateValue(seed, 'reserved')

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
