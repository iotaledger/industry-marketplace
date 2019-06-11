const { composeAPI } = require('@iota/core');
const crypto = require('crypto');

const generateSeed = (length = 81) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
          }
    }
    return seed;
};

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const provider = 'https://nodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

const seed = generateSeed();

iota.getNewAddress(seed)
  .then(address => console.log(`Address: ${address} \nSeed: ${seed}`))
  .catch(err => console.log(err));

// Insert public adress into https://data.iota.org/#/faucet to get IOTA tokens
