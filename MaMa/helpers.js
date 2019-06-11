const crypto = require('crypto');
const { trytesToAscii } = require('@iota/converter');

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

const decodeMessage = transaction => {
  // Modify to consumable length
  if (!transaction.length || !transaction[0].signatureMessageFragment) {
    return null;
  }
  const fragment = transaction[0].signatureMessageFragment;
  const trytes = fragment % 2 !== 0 ? fragment + '9' : fragment;

  // Decode message
  const message = trytesToAscii(trytes);
  return message;
}

module.exports = {
  generateSeed,
  decodeMessage
}
