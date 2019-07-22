import get from 'lodash-es/get';
import { operations } from '../Industry_4.0_language';

const iotaAreaCodes = require('@iota/area-codes');

export const prepareData = async (payload) => {
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
    const params = submodelElements.map(({ idShort, value }) => ({ idShort, value }));

    // Get price
    const price = submodelElements.find(({ idShort }) => idShort === 'preis');

    // Get operation
    const irdi = get(data, 'dataElements.submodels[0].identification.id');
    const eClassOperations = await operations();
    const operationObject = eClassOperations.find(({ id }) => id === irdi);
    const operation = get(operationObject, 'name');
    // Set date format options
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const partner = get(data, 'frame.sender.identification.id');

    const card = {
        operation,
        type,
        replyBy,
        location,
        params,
        irdi,
        partner,
        id: conversationId,
        walletAddress: get(data, 'walletAddress') || null,
        originalMessage: JSON.stringify(data),
        storageId: type === 'proposal' ? `${conversationId}#${partner}` : conversationId,
        coordinates: await getCoordinates(location),
        price: get(price, 'value') || 'Pending',
        startTime: (new Date(startTimestamp)).toLocaleDateString('de-DE', dateOptions),
        endTime: (new Date(endTimestamp)).toLocaleDateString('de-DE', dateOptions),
    };
    
    return card;
};

const getCoordinates = async areaCode => {
    const { latitude, longitude } = iotaAreaCodes.decode(areaCode);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}

