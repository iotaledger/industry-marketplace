const uuid = require('uuid/v4');
const sample_operations = require('./templates/operations.json');
const eClass = require('./templates/eClass.json');
const callForProposal = require('./templates/callForProposal.json');
const proposal = require('./templates/proposal.json');
const acceptProposal = require('./templates/acceptProposal.json');
const rejectProposal = require('./templates/rejectProposal.json');
const informConfirm = require('./templates/informConfirm.json');
const informPayment = require('./templates/informPayment.json');
/**
 * GET /operations
 * 1. For CfP message type returns list of operations (plain text)
 */
export const operations = () => {
    return sample_operations;
}

/**
 * GET /submodel/{irdi}
 * 1. Performs lookup in the eCl@ss catalog, retrieves submodel  
 * 2. Returns submodel without price property
 */
export const submodel = (irdi) => {
    return eClass[irdi].submodelElements.filter(({ idShort }) => !['preis', 'price'].includes(idShort));
}

/**
 * GET /evaluate/{irdi}/values/{submodel_parameter_values}
 * 1. Evaluates values  
 * 2. Returns success or failure notification
 */
export const evaluate = (irdi, values) => {
    const submodelTemplate = submodel(irdi);
    let status;
    submodelTemplate.some(element => {
        const value = values[element.semanticId];
        if (!value) {
            status = `Value for ${element.idShort} (${element.semanticId}) is missing`;
            return null;
        }

        const isTypeValid = checkType(element.valueType, value);
        if (!isTypeValid) {
            status = `Type for ${element.idShort} (${element.semanticId}) is invalid`; 
            return null;
        }
        return null;
    });
    return status || 'success';
}

const checkType = (type, value) => {
    switch (type) {
        case 'string':
        case 'langString':
        case 'anyURI':
        case 'time':
            return typeof value === 'string';

        case 'decimal':
        case 'double':
        case 'float':
            return typeof value === 'number';

        case 'int':
        case 'integer':
        case 'long':
        case 'short':
        case 'byte':
        case 'unsignedLong':
        case 'unsignedShort':
        case 'unsignedByte':
            return typeof value === 'number' && Math.abs(value % 1) === 0;
        case 'nonNegativeInteger':
            return typeof value === 'number' && value >= 0 && value % 1 === 0;
        case 'positiveInteger':
            return typeof value === 'number' && value > 0 && value % 1 === 0;
        case 'nonPositiveInteger':
            return typeof value === 'number' && value <= 0 && value % 1 === 0;
        case 'negativeInteger':
            return typeof value === 'number' && value < 0 && value % 1 === 0;
    
        case 'date':
        case 'dateTime':
        case 'dateTimeStamp':
            return typeof value === 'number' && typeof new Date(value) === 'object';

        case 'boolean':
            return typeof value === 'boolean';
        
        case 'complexType':
            return typeof value === 'object';
        
        case 'anyType':
        case 'anySimpleType':
        case 'anyAtomicType':
        default:
          return true;
    }
}

/**
 * GET /generate/{message_type}/user/{user_id}/irdi/{irdi}/values/{submodel_parameter_values}  
 * 1. Generates conversationId, messageId,  
 * 2. Fills placeholder JSON for selected message type with provided values, appends submodel  
 * 3. Returns generated message of the selected type (CfP, Proposal, etc.)  
 */
export const generate = ({ 
    messageType, 
    userId, 
    irdi, 
    submodelValues, 
    replyTime, 
    originalMessage = null, 
    price = null,
    location = null,
    startTimestamp = null,
    endTimestamp = null,
    creationDate = null
}) => {
    const message = getTemplate(messageType);
    if (!message) {
        return null;
    }
    const conversationId = uuid();
    message.frame.sender.identification.id = userId;
    message.frame.replyBy = getReplyByTime(replyTime);

    if (originalMessage && messageType !== 'callForProposal') {
        message.frame.conversationId = originalMessage.frame.conversationId;
        message.frame.receiver.identification.id = originalMessage.frame.sender.identification.id;
        message.dataElements = originalMessage.dataElements;
        message.frame.location = originalMessage.frame.location;
        message.frame.startTimestamp = originalMessage.frame.startTimestamp;
        message.frame.endTimestamp = originalMessage.frame.endTimestamp;
        message.frame.creationDate = originalMessage.frame.creationDate;

        if (messageType === 'proposal' && price && irdi) {
            const priceModel = eClass[irdi].submodelElements.find(({ idShort }) => ['preis', 'price'].includes(idShort));
            priceModel.value = price;
            message.dataElements.submodels[0].identification.submodelElements.push(priceModel);
        }
    } else if (irdi && messageType === 'callForProposal') {
        message.frame.conversationId = conversationId;

        if (location) {
            message.frame.location = location;
        }
        
        if (startTimestamp && endTimestamp) {
            message.frame.startTimestamp = startTimestamp;
            message.frame.endTimestamp = endTimestamp;
        }

        if (creationDate) {
            message.frame.creationDate = creationDate;
        }

        if (evaluate(irdi, submodelValues) === 'success') {
            const submodelTemplate = submodel(irdi);
            const submodelElements = submodelTemplate.map(element => (
                { ...element, value: submodelValues[element.semanticId] } 
            ));
            message.dataElements.submodels.push({
                identification: {
                    id: irdi,
                    submodelElements
                }
            });
        }
    }

    return message;
}

const getReplyByTime = (minutes = 10) => {
    const timestamp = new Date();
    const timeToReply = minutes * 60 * 1000; // 10 minutes in milliseconds
    timestamp.setTime(timestamp.getTime() + timeToReply);
    return Date.parse(timestamp);
}

const getTemplate = (type) => {
    switch (type) {
        case 'callForProposal':
            return callForProposal;
        case 'proposal':
            return proposal;
        case 'acceptProposal':
            return acceptProposal;
        case 'rejectProposal':
            return rejectProposal;        
        case 'informConfirm':
            return informConfirm;
        case 'informPayment':
            return informPayment;
        default:
            return null;
    }
}

// const values = {
//     "0173-1#02-AAB713#005": 4.5,
//     "0173-1#02-AAN521#005": "Rot",
//     "0173-1#02-BAF634#008": "Stahl",
//     "0173-1#02-BAF163#002": "Berlin",
//     "0173-1#02-AAO738#001": 1561968195120
// }
// const test3 = evaluate('0173-1#02-BAF574#004', values);
// console.log('Result', test3);
// console.log('=======================');

// const generateValuesCFP = {
//     messageType: 'callForProposal', 
//     userId: 'test-user1',
//     irdi: '0173-1#02-BAF574#004', 
//     submodelValues: values, 
//     replyTime: 10, 
// }
// const originalMessage = generate(generateValuesCFP);
// console.log(JSON.stringify(originalMessage));
// console.log('=========================')

// const generateValuesProposal = {
//     messageType: 'proposal', 
//     userId: 'test-user2',
//     irdi: '0173-1#02-BAF574#004', 
//     replyTime: 10,
//     price: 120,
//     originalMessage,
// }

// const proposalTest = generate(generateValuesProposal);
// console.log(JSON.stringify(proposalTest));
// console.log('=========================')

// const generateValuesAccept = {
//     messageType: 'acceptProposal', 
//     userId: 'test-user1',
//     replyTime: 10,
//     originalMessage: proposalTest,
// }

// const acceptTest = generate(generateValuesAccept);
// console.log(JSON.stringify(acceptTest));
