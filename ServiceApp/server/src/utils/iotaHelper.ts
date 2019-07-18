import { composeAPI } from '@iota/core';
import axios from 'axios';
import crypto from 'crypto';
import { provider } from '../config.json';
import { fromTrytes } from './trytesHelper';

const iota = composeAPI({ provider });

/**
 * Find transaction objects from the given bundle
 * @param bundle The bundle to process.
 * @returns Array of IOTA transactions
 */
export const findTransactions = async (bundle) => {
    try {
        return new Promise((resolve, reject) => {
            iota.findTransactionObjects({ bundles: [bundle] })
                .then(resolve)
                .catch(error => {
                    console.error('findTransactions error', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('findTransactions catch', error);
        return error;
    }
};

/**
 * Check to see if there is connectivity to a node.
 * @param _provider The provider to check for connectivity.
 * @param throwIfNoConnectivity Throw an exception if there is no tangle connectivity.
 * @returns True if there is connectivity.
 */
export const isNodeAvailable = async (_provider, throwIfNoConnectivity = false) => {
    let hasConnectivity;

    try {
        const response = await axios.post(
            provider,
            {
                command: 'getNodeInfo'
            },
            {
                headers: {
                    'X-IOTA-API-Version': 1
                },
                timeout: 5000
            });

        hasConnectivity = response.status === 200 && !!response.data.appName && !!response.data.appVersion;
    } catch (err) {
        hasConnectivity = false;
    }

    if (!hasConnectivity && throwIfNoConnectivity) {
        throw new Error('There is currently no tangle connectivity, please try again later.');
    }

    return hasConnectivity;
};

export const generateSeed = (length = 81) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1);
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
};

export const getPayload = async (bundle) => {
    try {
        const transactions = await findTransactions(bundle);
        if (!transactions.length || !transactions[0].signatureMessageFragment) {
            return null;
        }
        let message = '';
        transactions
            .sort((a, b) => a.currentIndex - b.currentIndex)
            .forEach(({ signatureMessageFragment }) => {
                message += signatureMessageFragment;
            });
        return JSON.parse(fromTrytes(message));
    } catch (error) {
        console.error('getPayload catch', error);
        return error;
    }
};
