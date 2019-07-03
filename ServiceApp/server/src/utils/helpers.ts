import { trytesToAscii } from '@iota/converter';

export const decodeMessage = transaction => {
    // Modify to consumable length
    if (!transaction.length || !transaction[0].signatureMessageFragment) {
        return null;
    }
    const fragment = transaction[0].signatureMessageFragment;
    const trytes = fragment % 2 !== 0 ? `${fragment}9` : fragment;

    // Decode message
    return trytesToAscii(trytes);
};

export const getCodeFromMessageType = message => {
    const map = {
        callForProposal: 'A',
        proposal: 'B',
        acceptProposal: 'C',
        rejectProposal: 'D',
        informConfirm: 'E',
        informPayment: 'F'
    };
    return map[message] || null;
};

export const getMessageTypeFromCode = code => {
    const map = {
        A: 'callForProposal',
        B: 'proposal',
        C: 'acceptProposal',
        D: 'rejectProposal',
        E: 'informConfirm',
        F: 'informPayment'
    };
    return map[code] || null;
};

export const getNumberFromLetter = letter => {
    return letter.charCodeAt(0) - 65;
};

export const getLetterFromNumber = number => {
    return String.fromCharCode(65 + number);
};
