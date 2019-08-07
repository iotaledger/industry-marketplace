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

export const getLetterFromNumber = number => {
    return String.fromCharCode(65 + number);
};

export const convertSubmodelId = submodelId => {
    try {
        const submodel = submodelId.substring(10, submodelId.length - 4);
        let serviceId = '';
        submodel.split('').forEach(element => {
            const int = parseInt(element, 10);
            if (Number.isInteger(int)) {
                serviceId += getLetterFromNumber(int);
            } else {
                serviceId += element;
            }
        });
        return serviceId;
    } catch (error) {
        throw new Error(error);
    }
};

export const convertOperationsList = operations => operations.map(convertSubmodelId);
