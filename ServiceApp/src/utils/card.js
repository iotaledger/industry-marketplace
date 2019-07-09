import get from 'lodash-es/get';
import { operations } from '../Industry_4.0_language';

export const prepareData = async (role, payload) => {
    let data = payload;
    console.log('card', typeof payload, data);
    if (typeof payload === 'string') {
        console.log('card convert', JSON.parse(payload));
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
    console.log(11111, submodelElements);
    const params = submodelElements.map(({ idShort, value }) => ({ idShort, value }));
    console.log(22222, params);

    // Get price
    const price = submodelElements.find(({ idShort }) => idShort === 'preis');
    console.log(33333, price);

    // Get operation
    const irdi = get(data, 'dataElements.submodels[0].identification.id');
    console.log(44444, irdi);
    const eClassOperations = await operations();
    console.log(55555, eClassOperations);
    const operationObject = eClassOperations.find(({ id }) => id === irdi);
    console.log(66666, operationObject);
    const operation = get(operationObject, 'name');
    console.log(77777, operation);
    // Set date format options
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    
    const card = {
        operation,
        type,
        replyBy,
        location,
        params,
        id: conversationId,
        coordinates: await getCoordinates(location),
        price: price || 'Pending',
        partner: await getPartner(role, data.frame),
        startTime: (new Date(startTimestamp)).toLocaleDateString('de-DE', dateOptions),
        endTime: (new Date(endTimestamp)).toLocaleDateString('de-DE', dateOptions),
    };
    console.log(88888, card);
    
    return card;
};

const getCoordinates = async areaCode => {
    return areaCode;
}

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
