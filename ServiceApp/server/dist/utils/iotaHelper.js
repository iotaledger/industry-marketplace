"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const core_1 = require("@iota/core");
const config_json_1 = require("../config.json");
const iota = core_1.composeAPI({ provider: config_json_1.provider });
/**
 * Helper functions for use with iota.
 */
class IotaHelper {
    /**
     * Find transaction objects from the given bundle
     * @param bundle The bundle to process.
     * @returns Array of IOTA transactions
     */
    static async findTransactions(bundle) {
        try {
            return new Promise((resolve, reject) => {
                iota.findTransactionObjects({ bundles: [bundle] })
                    .then(transactions => resolve(transactions))
                    .catch(error => {
                    console.error('findTransactions error', error);
                    reject(error);
                });
            });
        }
        catch (error) {
            console.error('findTransactions catch', error);
            return error;
        }
    }
    /**
     * Check to see if there is connectivity to a node.
     * @param provider The provider to check for connectivity.
     * @param throwIfNoConnectivity Throw an exception if there is no tangle connectivity.
     * @returns True if there is connectivity.
     */
    static async isNodeAvailable(provider, throwIfNoConnectivity = false) {
        let hasConnectivity;
        try {
            const response = await axios_1.default.post(provider, {
                command: 'getNodeInfo'
            }, {
                headers: {
                    'X-IOTA-API-Version': 1
                },
                timeout: 5000
            });
            hasConnectivity = response.status === 200 && !!response.data.appName && !!response.data.appVersion;
        }
        catch (err) {
            hasConnectivity = false;
        }
        if (!hasConnectivity && throwIfNoConnectivity) {
            throw new Error('There is currently no tangle connectivity, please try again later.');
        }
        return hasConnectivity;
    }
}
exports.IotaHelper = IotaHelper;
