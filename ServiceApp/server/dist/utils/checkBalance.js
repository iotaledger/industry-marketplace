"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_json_1 = require("../config.json");
const request = async (payload) => {
    const response = await node_fetch_1.default(config_json_1.provider, {
        headers: {
            'Content-Type': 'application/json',
            'X-IOTA-API-Version': 1
        },
        method: 'post',
        body: JSON.stringify(payload)
    });
    // tslint:disable-next-line:no-unnecessary-local-variable
    const result = await response.json();
    return result;
};
const getBalance = async (address) => {
    try {
        const payload = {
            command: 'getBalances',
            addresses: [address.substring(0, 81).toUpperCase()],
            threshold: 100
        };
        const result = await request(payload);
        if (result && result.balances && result.balances.length > 0) {
            return result.balances[0];
        }
        return 0;
    }
    catch (error) {
        console.error('getBalance error', error);
        return 0;
    }
};
module.exports = {
    getBalance
};
// const run = async address => {
//     const balance = await getBalance(address);
//     console.log(balance, address);
// }
// run('BESTFUVXSXDUQAKVESPOQQUEWT9SREQXQV9TIUWCXMCZRJETDRODUIYVNWZWKXFJOIGXURYJCXXOUCELDXTBIGWNID')
