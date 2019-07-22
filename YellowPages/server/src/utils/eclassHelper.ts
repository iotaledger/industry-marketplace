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
