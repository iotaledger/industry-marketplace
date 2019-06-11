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

const extractMessageType = tag => {
    const regex = /(?<=SEMARKET)([0-9]+)/gi;
    const match = tag.match(regex);
    if (match !== null && match.length >= 1) {
        return match[0];
    }
    return null;
}

const getCodeFromMessageType = message => {
    const map = {
        callForProposal: 'A',
        proposal: 'B',
        acceptProposal: 'C',
        rejectProposal: 'D',
        informConfirm: 'E'
    }
    return map[message] || null;
}

const getMessageTypeFromCode = code => {
    const map = {
        A: 'callForProposal',
        B: 'proposal',
        C: 'acceptProposal',
        D: 'rejectProposal',
        E: 'informConfirm'
    }
    return map[code] || null;
}

const getNumberFromLetter = letter => {
    return letter.charCodeAt(0) - 65;
}

const getLetterFromNumber = number => {
    return String.fromCharCode(65 + number);
}

module.exports = {
  generateSeed,
  decodeMessage,
  extractMessageType,
  getCodeFromMessageType,
  getMessageTypeFromCode,
  getLetterFromNumber,
  getNumberFromLetter
}
