import axios from 'axios';
import config from '../config.json';
import { composeAPI, createPrepareTransfers, generateAddress } from '@iota/core';
import { provider } from '../config.json';
import { updateValue, writeData, readRow } from './databaseHelper';
import { processPaymentQueue } from './paymentQueueHelper';
import { generateSeed } from './iotaHelper';
import { repairWallet } from './walletQueueHelper.js';



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
        console.log(address, seed, keyIndex)
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
            repairWallet(seed, keyIndex);
        }
        if (balance < totalAmount && balance != 0) {
            const response = await axios.get(`${config.faucet}?address=${address}&amount=${config.faucetAmount}`);
            if (response.data.success) {
                const balance = await getBalance(address);
                console.log("new balance", balance)
            }
            else {
                await updateValue('wallet', 'seed', 'status', seed, 'error')
                const wallet = generateNewWallet();
                await axios.get(`${config.faucet}?address=${wallet.address}&amount=${config.faucetAmount}`);
                seed = wallet.seed
                address = wallet.address
                keyIndex = wallet.keyIndex
            }
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
                            await updateValue('wallet', 'seed', 'status', seed, 'busy')

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
                            await updateValue('wallet', 'seed', 'status', seed, 'usable')

                            resolve(transactions);
                        })
                        .catch(error => {
                            console.error('transferFunds sendTrytes error', error);
                            //reject(error);
                        });
                })
                .catch(error => {
                    console.error('transferFunds prepareTransfers error', error);
                    //   reject(error);
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

    console.log('processPayment');

    interface IWallet {
        address?: string;
        balance?: number;
        keyIndex?: number;
        seed?: string;
    }

    let count = 0;
    const maxTries = 10;
    while (true) {
        try {
            //check if usable wallet available
            const wallet: IWallet = await readRow('wallet', 'status', 'usable');
            const { address, keyIndex, seed } = wallet;

            let transfers = [];
            let totalAmount = 0;

            const paymentQueue = await processPaymentQueue();

            transfers = paymentQueue.map(({ address, value }) => {
                totalAmount += value;
                return { address, value };
            })

            console.log('processPayment 1', wallet.balance, totalAmount);
            console.log('processPayment 2', transfers);

            if (transfers.length === 0) return;
            
            //set wallet busy
            await updateValue('wallet', 'seed', 'status', seed, 'busy')

            return await transferFunds(
                address,
                keyIndex,
                seed,
                totalAmount,
                transfers
            );
        } catch (e) {
            console.log("No wallet address available")
            await new Promise(resolve => setTimeout(resolve, 60000));
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
