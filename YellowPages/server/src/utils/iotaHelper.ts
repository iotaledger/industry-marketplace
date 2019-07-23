import { composeAPI } from '@iota/core';
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
