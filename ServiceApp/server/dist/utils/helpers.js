"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("@iota/converter");
const decodeMessage = transaction => {
    // Modify to consumable length
    if (!transaction.length || !transaction[0].signatureMessageFragment) {
        return null;
    }
    const fragment = transaction[0].signatureMessageFragment;
    const trytes = fragment % 2 !== 0 ? `${fragment}9` : fragment;
    // Decode message
    return converter_1.trytesToAscii(trytes);
};
const extractMessageType = tag => {
    const regex = /(?<=SEMARKET)([A-E])/gi;
    const match = tag.match(regex);
    if (match !== null && match.length >= 1) {
        return match[0];
    }
    return null;
};
const getCodeFromMessageType = message => {
    const map = {
        callForProposal: 'A',
        proposal: 'B',
        acceptProposal: 'C',
        rejectProposal: 'D',
        informConfirm: 'E'
    };
    return map[message] || null;
};
const getMessageTypeFromCode = code => {
    const map = {
        A: 'callForProposal',
        B: 'proposal',
        C: 'acceptProposal',
        D: 'rejectProposal',
        E: 'informConfirm'
    };
    return map[code] || null;
};
const getNumberFromLetter = letter => {
    return letter.charCodeAt(0) - 65;
};
const getLetterFromNumber = number => {
    return String.fromCharCode(65 + number);
};
module.exports = {
    decodeMessage,
    extractMessageType,
    getCodeFromMessageType,
    getMessageTypeFromCode,
    getLetterFromNumber,
    getNumberFromLetter
};
