import { composeAPI } from '@iota/core';
import crypto from 'crypto';
import { provider } from '../config.json';

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = composeAPI({ provider });

const generateSeed = (length = 81) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let newSeed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1);
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
