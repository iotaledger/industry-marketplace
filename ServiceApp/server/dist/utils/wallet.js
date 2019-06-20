"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@iota/core");
const crypto_1 = __importDefault(require("crypto"));
const config_json_1 = require("../config.json");
// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = core_1.composeAPI({ provider: config_json_1.provider });
const generateSeed = (length = 81) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let newSeed = '';
    while (seed.length < length) {
        const byte = crypto_1.default.randomBytes(1);
        if (byte[0] < 243) {
            newSeed += charset.charAt(byte[0] % 27);
        }
    }
    return newSeed;
};
const seed = generateSeed();
iota.getNewAddress(seed)
    .then(address => console.log(`Address: ${address} \nSeed: ${seed}`))
    .catch(err => console.log(err));
// Insert public adress into https://data.iota.org/#/faucet to get IOTA tokens
