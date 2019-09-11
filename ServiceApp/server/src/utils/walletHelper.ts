import { composeAPI, createPrepareTransfers, generateAddress } from '@iota/core';
import { provider } from '../config.json';
import { getRandomRow, updateValue, writeData, readDataEquals } from './databaseHelper';
import {repairWallet} from './walletQueueHelper';
import { processPaymentQueue } from './paymentQueueHelper';


export const getBalance = async address => {
    try {
        if (!address) {
            return 0;
        }
        const { getBalances } = composeAPI({ provider });
        const { balances } = await getBalances([address], 100);
        let balance = balances && balances.length > 0 ? balances[0] : 0;
        
        if (balance === 0) {
            let retries = 0;
            while (retries++ < 10) {
                const response = await getBalances([address], 100);
                balance = response.balances && response.balances.length > 0 ? response.balances[0] : 0;
                if (balance > 0) {
                    break;
                }
                await new Promise(resolved => setTimeout(resolved, 1000));
            }
        }

        return balance;
    } catch (error) {
        console.error('getBalance error', error);
        return 0;
    }
};

const transferFunds = async (address, keyIndex, seed, totalAmount, transfers) => {
    try {
        const { sendTrytes, getLatestInclusion } = composeAPI({ provider });
        const prepareTransfers = createPrepareTransfers();
        const balance = await getBalance(address);
        const security = 2;

        // Depth or how far to go for tip selection entry point
        const depth = 5;

        // Difficulty of Proof-of-Work required to attach transaction to tangle.
        // Minimum value on mainnet & spamnet is `14`, `9` on devnet and other testnets.
        const minWeightMagnitude = 9;

        if (balance === 0) {

            try{
            await repairWallet(seed, keyIndex); 
            } catch(e){
                await updateValue('wallet', 'seed', 'status', seed, 'error')
                console.error('transferFunds. Insufficient balance', address);
            }
            return null;
        }
        if (balance < totalAmount) {
            throw new Error(`Insufficient balance: ${balance}. Needed: ${totalAmount}`);
        }

        return new Promise((resolve, reject) => {
            const remainderAddress = generateAddress(seed, keyIndex + 1);
            const options = {
                inputs: [{
                    address,
                    keyIndex,
                    security,
                    balance
                }],
                security,
                remainderAddress
            };

            prepareTransfers(seed, transfers, options)
                .then(async trytes => {
                    sendTrytes(trytes, depth, minWeightMagnitude)
                        .then(async transactions => {
                            // Before the payment is confirmed update the wallet with new address and index, calculate expected balance
                            await updateWallet(seed, remainderAddress, keyIndex + 1, balance - totalAmount);
                            await updateValue('wallet', 'seed','status', seed,  'busy')

                            const hashes = transactions.map(transaction => transaction.hash);

                            let retries = 0;
                            while (retries++ < 40) {
                                const statuses = await getLatestInclusion(hashes);
                                if (statuses.filter(status => status).length === 4) {
                                    break;
                                }
                                await new Promise(resolved => setTimeout(resolved, 5000));
                            }

                            // Once the payment is confirmed fetch the real wallet balance and update the wallet again
                            const newBalance = await getBalance(remainderAddress);
                            await updateWallet(seed, remainderAddress, keyIndex + 1, newBalance);
                            await updateValue('wallet', 'seed','status', seed,  'usable')

                            resolve(transactions);
                        })
                        .catch(error => {
                            console.error('transferFunds sendTrytes error', error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.error('transferFunds prepareTransfers error', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('transferFunds catch', error);
        return error;
    }
};

const updateWallet = async (seed, address, keyIndex, balance) => {
    await writeData('wallet', { address, balance, keyIndex, seed });
};

export const processPayment = async (receiveAddress = null, paymentValue = null) => {
        console.log('processPayment called', receiveAddress, paymentValue);

    interface IWallet {
        address?: string;
        balance?: number;
        keyIndex?: number;
        seed?: string;
    }

    let count = 0;
    const maxTries = 10;
    while(true) {
    try{
    const wallet: IWallet = await getRandomRow('wallet','status','usable');
    const { address, keyIndex, seed } = wallet;

    const user : any = await readDataEquals('user','usePaymentQueue', '1')
        
    let transfers = [];
    let totalAmount = 0;

    if(user){
       const paymentQueue = await processPaymentQueue();
        console.log('paymentQueue', paymentQueue);

        transfers = paymentQueue.map(({ address, value }) => {
            totalAmount += value;
            return { address, value };
        })
    } else if (receiveAddress && paymentValue) {
        transfers = [{ address: receiveAddress, value: paymentValue }];
        totalAmount = paymentValue;
    }


    console.log('processPayment 1', wallet.balance, totalAmount);
    console.log('processPayment 2', transfers);

    if (transfers.length === 0) return;
    
    await updateValue('wallet', 'seed','status', seed,  'busy')

    return await transferFunds(
        address,
        keyIndex,
        seed,
        totalAmount,
        transfers
    );
}catch(e){
    console.log("No wallet address available")
    await new Promise(resolve => setTimeout(resolve, 20000));
    if (++count === maxTries) throw e;
        }
    }
};



export const getBalanceForSimulator = async address => {
    try {
        if (!address) {
            return 0;
        }
        const { getBalances } = composeAPI({ provider });
        const { balances } = await getBalances([address], 100);
        const balance = balances && balances.length > 0 ? balances[0] : 0;
        return balance;
    } catch (error) {
        console.error('getBalance error', error);
        return 0;
    }
};


/*
Example getBalance operation:

import { getBalance } from './walletHelper';

await getBalance(address);

*/

/*
Example payment operation:

import { processPayment } from './walletHelper';

const transactions = await processPayment(address, amount);
if (transactions.length > 0) {
    console.log('Success');
}

*/
