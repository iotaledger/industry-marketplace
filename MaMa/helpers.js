const crypto = require('crypto');
const { trytesToAscii } = require('@iota/converter');
const { composeAPI } = require('@iota/core');

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
    const regex = /(?<=SEMARKET)([A-E])/gi;
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


const provider = 'https://nodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

const findTransactions = async (bundle) => {
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

const decodeNonASCII = (value) => {
    return value ? value.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16))) : undefined;
};

const fromTrytes = (trytes) => {
    // Trim trailing 9s
    let trimmed = trytes.replace(/\9+$/, '');

    // And make sure it is even length (2 trytes per ascii char)
    if (trimmed.length % 2 === 1) {
        trimmed += '9';
    }

    const ascii = trytesToAscii(trimmed);
    return decodeNonASCII(ascii);
    // return json ? JSON.parse(json) : undefined;
};

const getPayload = async (bundle) => {
    try {
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

        console.log(JSON.parse(decodeURI(fromTrytes(message))));
        // return JSON.parse(decodeURI(fromTrytes(message)));
    } catch (error) {
        console.error('getPayload catch', error);
        console.error('getPayload bundle', bundle);
        console.error('getPayload message', message);
        return error;
    }
}

const bundle = 'Q9JZBSOZ9ZAJBGLOZDJCPPBJAETXMBGGRRXQFFKKQBLBCX9VHOJ9YIKJPEIUBPHYZUZ9FKJFIIUGWEGNC';

getPayload(bundle)