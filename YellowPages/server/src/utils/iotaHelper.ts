import { composeAPI, FailMode, RandomWalkStrategy, SuccessMode } from '@iota/client-load-balancer';
import { depth, minWeightMagnitude, providers } from '../config.json';
import { fromTrytes } from './trytesHelper';

/**
 * Find transaction objects from the given bundle
 * @param bundle The bundle to process.
 * @returns Array of IOTA transactions
 */
export const findTransactions = async (bundle) => {
    try {
        let config = { depth, minWeightMagnitude, providers };

        const iota = composeAPI({
            nodeWalkStrategy: new RandomWalkStrategy(
                config.providers.map(provider => ({ provider }))
            ),
            depth: config.depth,
            mwm: config.minWeightMagnitude,
            successMode: SuccessMode.keep,
            failMode: FailMode.all,
            timeoutMs: 10000,
            failNodeCallback: (node, err) => {
                console.log(`Failed node ${node.provider}, ${err.message}`);
            }
        });

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
        return JSON.parse(decodeURI(fromTrytes(message)));
    } catch (error) {
        console.error('getPayload catch', error, bundle);
        return error;
    }
};
