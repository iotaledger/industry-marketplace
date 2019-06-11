const { composeAPI } = require('@iota/core');
const { generateSeed } = require('./helpers');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const provider = 'https://nodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

const seed = generateSeed();

iota.getNewAddress(seed)
  .then(address => console.log(`Address: ${address} \nSeed: ${seed}`))
  .catch(err => console.log(err));

// Insert public adress into https://data.iota.org/#/faucet to get IOTA tokens
