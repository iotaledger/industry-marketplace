// import { composeAPI, LoadBalancerSettings } from '@iota/client-load-balancer';
// import { createPrepareTransfers, generateAddress } from '@iota/core';
import { AccountManager, SignerType, RemainderValueStrategy } from '@iota/wallet';
import axios from 'axios';
// import { depth, faucet, faucetC2, faucetAmount, minWeightMagnitude, security, providersC2 } from '../config.json';
import { faucetC2, providersC2 } from '../config.json'; //TODO: Merge providersC2, provider with my previously introduced config values
// import { ServiceFactory } from '../factories/serviceFactory';
import { readData, writeData } from './databaseHelper';
// import { generateSeed } from './iotaHelper';
import { processPaymentQueue } from './paymentQueueHelper';
require('dotenv').config();

// export const fundWallet = async () => {
//     try {
//         const userWallet: any = await readData('wallet');
//         const response = await axios.get(`${faucet}?address=${userWallet.address}&amount=${faucetAmount}`);
//         const data = response.data;
//         if (data.success) {
//             const balance = await getBalance(userWallet.address);
//             await writeData('wallet', { ...userWallet, balance });
//         }
//     } catch (error) {
//         console.log('fund wallet error', error);
//         throw new Error('Wallet funding error. \n\nPlease contact industry@iota.org');
//     }
// };

export const fundWallet = async () => {
    try {
        const userWallet: any = await readData('walletC2');
        const response = await axios.get(`${faucetC2}?address=${userWallet.address}`);
        if (response && response.status === 200) {
            // wait ~9sec for balance to be available to be read and written to db
            // I think this is an ugly fix so it's temporary?
            await new Promise(r => setTimeout(r, 9000));
            const balance = await getBalance(userWallet.alias);
            await writeData('walletC2', { ...userWallet, balance });
        }
    } catch (error) {
        console.log('fund wallet error', error);
        throw new Error('Wallet funding error. \n\nPlease contact industry@iota.org');
    }
};

// export const generateNewWallet = () => {
//     try {
//         const seed = generateSeed();
//         const address = generateAddress(seed, 0, security, true);
//         return { seed, address, keyIndex: 0, balance: 0 };
//     } catch (error) {
//         console.error('generateNewWallet error', error);
//         return {};
//     }
// };

export const generateNewAccount = async (alias) => {
    try {
    const manager = new AccountManager({
        storagePath: `./${alias.toLowerCase()}-database`,
    })

    //TODO: password for every alias (SR || SP)?
    manager.setStrongholdPassword(process.env.SH_PASSWORD);
    manager.storeMnemonic(SignerType.Stronghold);

    const account = manager.createAccount({
        clientOptions: { node: `${providersC2}`, localPow: false },
        alias: alias,
    })
    alias = account.alias();
    const address = account.latestAddress()

    return { alias: alias, address: address.address, balance: address.balance, keyIndex: address.keyIndex };
    } catch (error) {
        console.error('generateNewAccount error', error);
        return {};
    }
}

// export const getBalance = async address => {
//     try {
//         if (!address) {
//             return 0;
//         }
//         const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
//         const { getBalances } = composeAPI(loadBalancerSettings);
//         const { balances } = await getBalances([address]);
//         return balances && balances.length > 0 ? balances[0] : 0;
//     } catch (error) {
//         console.error('getBalance error', error);
//         return 0;
//     }
// };

export const getBalance = async alias => {
    try {
        if (!alias) {
            return 0;
        }
        const manager = new AccountManager({
            storagePath: `./${alias.toLowerCase()}-database`
        })    
        const account = manager.getAccount(alias);
        console.log('Account:', account.alias());
        const synced = await account.sync();
        if (synced) {
            console.log('Available balance', account.balance().available);
            return account.balance().available;
        }
    }
    catch (error) {
        console.error('getBalance error', error);
        return 0;
    }
};

// const transferFunds = async (wallet, totalAmount, transfers) => {
//     try {
//         const { address, keyIndex, seed } = wallet;
//         const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
//         const { getInclusionStates, sendTrytes } = composeAPI(loadBalancerSettings);
//         const prepareTransfers = createPrepareTransfers();
//         const balance = await getBalance(address);

//         if (balance === 0) {
//             console.error('transferFunds. Insufficient balance', address);
//             return null;
//         }
//         if (balance < totalAmount) {
//             throw new Error(`Insufficient balance: ${balance}. Needed: ${totalAmount}`);
//         }

//         return new Promise((resolve, reject) => {
//             const remainderAddress = generateAddress(seed, keyIndex + 1);
//             const options = {
//                 inputs: [{
//                     address,
//                     keyIndex,
//                     security,
//                     balance
//                 }],
//                 security,
//                 remainderAddress
//             };

//             prepareTransfers(seed, transfers, options)
//                 .then(async trytes => {
//                     sendTrytes(trytes, depth, minWeightMagnitude)
//                         .then(async transactions => {
//                             // Before the payment is confirmed update the wallet with new address and index, calculate expected balance
//                             await updateWallet(seed, remainderAddress, keyIndex + 1, balance - totalAmount);

//                             const hashes = transactions.map(transaction => transaction.hash);

//                             let retries = 0;
//                             while (retries++ < 40) {
//                                 const statuses = await getInclusionStates(hashes);
//                                 if (statuses.filter(status => status).length === 4) {
//                                     break;
//                                 }
//                                 await new Promise(resolved => setTimeout(resolved, 5000));
//                             }

//                             // Once the payment is confirmed fetch the real wallet balance and update the wallet again
//                             const newBalance = await getBalance(remainderAddress);
//                             await updateWallet(seed, remainderAddress, keyIndex + 1, newBalance);
                            
//                             resolve(transactions);
//                         })
//                         .catch(error => {
//                             console.error('transferFunds sendTrytes error', error);
//                             reject(error);
//                         });
//                 })
//                 .catch(error => {
//                     console.error('transferFunds prepareTransfers error', error);
//                     reject(error);
//                 });
//         });
//     } catch (error) {
//         console.error('transferFunds catch', error);
//         return error;
//     }
// };

export const transferFunds = async (alias, receivingAddress, totalAmount) => {
    try {
        if (!alias) {
            console.error('Invalid account.');
        }
        const manager = new AccountManager({
            storagePath: `./${alias.toLowerCase()}-database`
        })
        manager.setStrongholdPassword(process.env.SH_PASSWORD);

        const account = manager.getAccount(alias);
        const balance = await getBalance(alias);

        if (balance === 0) {
            console.error('transferFunds. Insufficient balance');
            return null;
        }
        if (balance < totalAmount) {
            throw new Error(`Insufficient balance: ${balance}. Needed: ${totalAmount}`);
        }
	    const nodeResponse = await account.send(
		receivingAddress,
		totalAmount,
        {remainderValueStrategy: RemainderValueStrategy.reuseAddress()}
    )
        console.log('nodeResponse', nodeResponse);
        const newBalance = await getBalance(alias);
        const address = account.latestAddress();
        await updateWallet(alias, address.address, address.keyIndex, newBalance);
    return nodeResponse;
    } catch (error) {
        console.error('transferFunds', error);
        return error;
    }
};

// const updateWallet = async (seed, address, keyIndex, balance) => {
//     await writeData('wallet', { address, balance, keyIndex, seed });
// };

const updateWallet = async (alias, address, keyIndex, balance) => {
    await writeData('walletC2', { alias, address, balance, keyIndex });
};

// export const processPayment = async () => {
//     try {
//         console.log('processPayment start');
//         interface IWallet {
//             address?: string;
//             balance?: number;
//             keyIndex?: number;
//             seed?: string;
//         }

//         const wallet: IWallet = await readData('wallet');
    
//         if (!wallet) {
//             console.log('processPayment error. No Wallet');
//             return null;
//         }

//         const walletBalance = await getBalance(wallet.address);
//         console.log('processPayment check wallet', wallet.address, walletBalance);
//         if (walletBalance === 0) {
//           const newWallet = generateNewWallet();
//           console.log('processPayment generating new wallet', newWallet);
//           try {
//               const response = await axios.get(`${faucet}?address=${newWallet.address}&amount=${faucetAmount}`);
//               const data = response.data;
//               if (data.success) {
//                   const balance = await getBalance(newWallet.address);
//                   await writeData('wallet', { ...newWallet, balance });
//                   return null;
//               }
//           } catch (error) {
//               console.log('fund wallet error', error);
//               throw new Error('Wallet funding error');
//               return null;
//           }
//           console.log('processPayment funding new wallet', newWallet);
//           return null;
//         }

//         let totalAmount = 0;
//         const paymentQueue: any = await processPaymentQueue();
//         console.log('processPayment paymentQueue', paymentQueue);
//         paymentQueue.forEach(({ value }) => totalAmount += value);
//         console.log('processPayment', totalAmount, wallet);
        
//         if (paymentQueue.length === 0 || totalAmount === 0) {
//             return null;
//         }

//         return await transferFunds(
//             wallet,
//             totalAmount,
//             paymentQueue
//         );
//     } catch (error) {
//         console.error('transferFunds catch', error);
//         return error;
//     }
// };

export const processPayment = async () => {
    try {
        console.log('processPayment start');
        interface IWallet {
            alias?: string;
            address?: string;
            balance?: number;
            keyIndex?: number;
        }

        const wallet: IWallet = await readData('walletC2');
    
        if (!wallet) {
            console.log('processPayment error. No Wallet');
            return null;
        }

        const walletBalance = await getBalance(wallet.alias);
        console.log('processPayment check wallet', wallet.address, walletBalance);
        if (walletBalance === 0) {
            const newWallet = await generateNewAccount(wallet.alias);
            console.log('processPayment generating new wallet', newWallet);
            try {
                const response = await axios.get(`${faucetC2}?address=${newWallet.address}`);
                if (response && response.status === 200) {
                // wait ~9sec for balance to be available to be read and written to db
                // I think this is an ugly fix so it's temporary?
                await new Promise(r => setTimeout(r, 9000));
                const balance = await getBalance(newWallet.alias);
                await writeData('walletC2', { ...newWallet, balance });
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