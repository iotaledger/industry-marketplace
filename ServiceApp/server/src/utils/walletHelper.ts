import { composeAPI, createPrepareTransfers, generateAddress } from '@iota/core';
import axios from 'axios';
import { depth, faucet, faucetAmount, minWeightMagnitude, provider, security } from '../config.json';
import { readData, writeData } from './databaseHelper';
import { generateSeed } from './iotaHelper';
import { processPaymentQueue } from './paymentQueueHelper';


export const generateNewWallet = () => {
    try {
        const seed = generateSeed();
        const address = generateAddress(seed, 0, 2, true);
        return { seed, address, keyIndex: 0, balance: 0 };
    } catch (error) {
        console.error('generateNewWallet error', error);
        return {};
    }
};

export const getBalance = async address => {
    try {
        if (!address) {
            return 0;
        }
        const { getBalances } = composeAPI({ provider });
        const { balances } = await getBalances([address], 100);
        return balances && balances.length > 0 ? balances[0] : 0;
    } catch (error) {
        console.error('getBalance error', error);
        return 0;
    }
};

const repairWallet = async (seed, keyIndex) => {
    try {
        return new Promise(async (resolve, reject) => {
            //Iterating through keyIndex ordered by likelyhood
            for (let value of [-2, -1, 1, 2, 3, 4, -3, -4, -5, -6, -7, 5, 6, 7]) {
                const newIndex = Number(keyIndex) + Number(value)
                if (newIndex >= 0) {
                    const newAddress = await generateAddress(seed, newIndex)
                    const newBalance = await getBalance(newAddress);

                    if (newBalance > 0) {
                        await writeData('wallet', { address: newAddress, balance: newBalance, keyIndex: newIndex, seed });
                        resolve();
                    }
                }
            }
        });
    } catch (error) {
        console.log("Repair wallet Error", error)
    }
}


const transferFunds = async (wallet, totalAmount, transfers) => {
    try {
        const { address, keyIndex, seed } = wallet;
        const { sendTrytes, getLatestInclusion } = composeAPI({ provider });
        const prepareTransfers = createPrepareTransfers();
        const balance = await getBalance(address);

        if (balance === 0) {
            console.error('transferFunds. Insufficient balance', address);
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

export const processPayment = async () => {
    try {
        console.log('processPayment start');
        interface IWallet {
            address?: string;
            balance?: number;
            keyIndex?: number;
            seed?: string;
        }

        const wallet: IWallet = await readData('wallet');

        if (!wallet) {
            console.log('processPayment error. No Wallet');
            return null;
        }

        const walletBalance = await getBalance(wallet.address);
        console.log('processPayment check wallet', wallet.address, walletBalance);
        if (walletBalance === 0) {
            let status = await repairWallet(wallet.seed, wallet.keyIndex)
            if (status) {
                const newWallet = generateNewWallet();
                console.log('processPayment generating new wallet', newWallet);
                try {
                    const response = await axios.get(`${faucet}?address=${newWallet.address}&amount=${faucetAmount}`);
                    const data = response.data;
                    if (data.success) {
                        const balance = await getBalance(newWallet.address);
                        await writeData('wallet', { ...newWallet, balance });
                        return null;
                    }
                } catch (error) {
                    console.log('fund wallet error', error);
                    throw new Error('Wallet funding error');
                    return null;
                }
                console.log('processPayment funding new wallet', newWallet);
                return null;
            }
        }

        let totalAmount = 0;
        const paymentQueue: any = await processPaymentQueue();
        console.log('processPayment paymentQueue', paymentQueue);
        paymentQueue.forEach(({ value }) => totalAmount += value);
        console.log('processPayment', totalAmount, wallet);

        if (paymentQueue.length === 0 || totalAmount === 0) {
            return null;
        }

        return await transferFunds(
            wallet,
            totalAmount,
            paymentQueue
        );
    } catch (error) {
        console.error('transferFunds catch', error);
        return error;
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

await processPayment();

*/