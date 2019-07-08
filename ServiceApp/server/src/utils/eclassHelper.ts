/**
 * Extract capital letter which follows the SEMARKET tag and specifies the message type
 * @param tag The tag to process.
 * @returns Found message type.
 */
export const extractMessageType = (tag) => {
    const regex = /(?<=SEMARKET)([A-F])/gi;
    const match = tag.match(regex);
    const map = {
        A: 'callForProposal',
        B: 'proposal',
        C: 'acceptProposal',
        D: 'rejectProposal',
        E: 'informConfirm',
        F: 'informPayment'
    };

    if (match !== null && match.length >= 1) {
        return map[match[0]] || null;
    }
    return null;
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

export const getRecieverID = message => {
    return message.frame.sender.identification.id || null;
};

export const getcfpLocation = message => {
    return message.dataElements._._.ort;
};

