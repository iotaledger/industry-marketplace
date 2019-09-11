import get from 'lodash-es/get';
import { operations } from 'industry_4.0_language';

export const prepareData = async (role, payload) => {
    let data = payload;
    if (typeof payload === 'string') {
        data = JSON.parse(payload);
    }

    // Get payload parameters
    const {
        conversationId,
        location,
        replyBy,
        startTimestamp,
        endTimestamp,
        type,
    } = data.frame;

    // Get params/submodelElements
    const submodelElements = get(data, 'dataElements.submodels[0].identification.submodelElements');
    const params = submodelElements.map(({ idShort, semanticId, value }) => ({ idShort, semanticId, value }));

    // Get price
    const price = submodelElements.find(({ idShort }) => ['preis', 'price'].includes(idShort));

    // Get operation
    const irdi = get(data, 'dataElements.submodels[0].identification.id');
    const eClassOperations = await operations();
    const operationObject = eClassOperations.find(({ id }) => id === irdi);
    const operation = get(operationObject, 'name');
    // Set date format options
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const partner = await getPartner(role, data.frame);
    const sensorData = get(data, 'sensorData') || null;

    const card = {
        operation,
        type,
        replyBy,
        location,
        params,
        irdi,
        partner,
        sensorData,
        startTimestamp,
        id: conversationId,
        partnerName: get(data, 'userName') || partner,
        originalMessage: JSON.stringify(data),
        storageId: type === 'proposal' && role === 'SR' ? `${conversationId}#${partner}` : conversationId,
        price: get(price, 'value') || 'Pending',
        startTime: (new Date(startTimestamp)).toLocaleDateString('de-DE', dateOptions),
        endTime: (new Date(endTimestamp)).toLocaleDateString('de-DE', dateOptions),
    };
    
    return card;
};

const getPartner = async (role, data) => {
    if (role === 'SP') {
        if (['callForProposal', 'acceptProposal', 'rejectProposal', 'informPayment'].includes(data.type)) {
            return get(data, 'sender.identification.id');
        } else if (['proposal', 'informConfirm'].includes(data.type)) {
            return get(data, 'receiver.identification.id');
        }
    } else if (role === 'SR') {
        if (data.type === 'callForProposal') {
            return 'Pending';
        } else if (['acceptProposal', 'rejectProposal', 'informPayment'].includes(data.type)) {
            return get(data, 'receiver.identification.id');
        } else if (['proposal', 'informConfirm'].includes(data.type)) {
            return get(data, 'sender.identification.id');
        }
    }
}
