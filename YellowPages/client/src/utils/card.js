import get from 'lodash-es/get';
import { operations } from 'industry_4.0_language';

export const prepareData = async (payload) => {
    try {
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
        let sender = get(data.frame, 'sender.identification.id');
        sender = sender && sender.indexOf('did:iota:') === 0 ? `${sender.substr(9, 15)}...` : sender;
        sender = sender && sender.indexOf('did:IOTA:') === 0 ? `${sender.substr(9, 15)}...` : sender;
        let receiver = get(data, 'frame.receiver.identification.id') || 'Pending';
        receiver = receiver && receiver.indexOf('did:iota:') === 0 ? `${receiver.substr(9, 15)}...` : receiver;
        receiver = receiver && receiver.indexOf('did:IOTA:') === 0 ? `${receiver.substr(9, 15)}...` : receiver;
        const sensorData = get(data, 'sensorData') || null;
        const coordinates = (location && location.split(',')) || [50, 10];

        const card = {
            operation,
            type,
            replyBy,
            location,
            params,
            irdi,
            receiver,
            sender,
            sensorData,
            startTimestamp,
            id: conversationId,
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
            partner: get(data.frame, 'sender.identification.id').replace('did:iota:', '').replace('did:IOTA:', ''),
            partnerName: get(data, 'userName') || sender,
            originalMessage: JSON.stringify(data, null, 2),
            storageId: type === 'proposal' ? `${conversationId}#${sender}` : conversationId,
            price: get(price, 'value') || 'Pending',
            startTime: (new Date(startTimestamp)).toLocaleDateString('de-DE', dateOptions),
            endTime: (new Date(endTimestamp)).toLocaleDateString('de-DE', dateOptions),
        };

        return card;
    } catch (error) {
        console.log('prepareData error', error);
    }
};
