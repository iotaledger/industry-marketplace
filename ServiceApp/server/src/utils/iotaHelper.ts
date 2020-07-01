import { composeAPI, LoadBalancerSettings } from '@iota/client-load-balancer';
import axios from 'axios';
import crypto from 'crypto';
import { onlineNodeConfig, onlineNodeConfigURL, providers } from '../config.json';
import { ServiceFactory } from '../factories/serviceFactory';
import { fromTrytes } from './trytesHelper';

/**
 * Find transaction objects from the given bundle
 * @param bundle The bundle to process.
 * @returns Array of IOTA transactions
 */
export const findTransactions = async (bundle) => {
    try {
        const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
        const iota = composeAPI(loadBalancerSettings);

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
 * @param provider The provider to check for connectivity.
 * @param throwIfNoConnectivity Throw an exception if there is no tangle connectivity.
 * @returns True if there is connectivity.
 */
export const isNodeAvailable = async (provider: string, throwIfNoConnectivity: boolean = false): Promise<boolean> => {
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        const rawTransactions = await findTransactions(bundle);
        if (!rawTransactions.length || !rawTransactions[0].signatureMessageFragment) {
            return null;
        }

        const transactions = [];
        const map = new Map();
        for (const transaction of rawTransactions) {
            if (!map.has(transaction.currentIndex)) {
                map.set(transaction.currentIndex, true);
                transactions.push(transaction);
            }
        }

        let message = '';
        transactions
            .sort((a, b) => a.currentIndex - b.currentIndex)
            .forEach(({ signatureMessageFragment }) => {
                message += signatureMessageFragment;
            });

        try {
            const uriToDecode = fromTrytes(message);
            const decodedURI = decodeURI(uriToDecode);
            return JSON.parse(decodedURI);
        } catch (error) {
            console.error('uriToDecode', fromTrytes(message), message, error);
            throw new Error(`Can't decode URI and parse JSON from ${fromTrytes(message)}. Message trytes: ${message}. Error: ${error}`);
        }
    } catch (error) {
        console.error('getPayload catch', error, bundle);
        return error;
    }
};

export const getAvailableProvider = async () => {
    let providerCandidates = providers;

    if (onlineNodeConfig) {
        const response = await axios.get(onlineNodeConfigURL);
        const data = response.data;
        if (data && data.nodes) {
            providerCandidates = data.nodes;
        }
    }

    let provider;
    for (const providerCandidate of providerCandidates) {
        const isAvailable = await isNodeAvailable(providerCandidate);
        if (isAvailable) {
            provider = providerCandidate;
            break;
        }
    }
    console.log('getAvailableProvider', provider);
    return provider;
};
