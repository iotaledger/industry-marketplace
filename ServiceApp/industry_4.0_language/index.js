import uuid from 'uuid/v4';
import sample_operations from './templates/operations.json';
import eClass from './templates/eClass.json';
import cfp from '../templates/cfp.json';
import proposal from '../templates/proposal.json';
import acceptProposal from '../templates/acceptProposal.json';
import rejectProposal from '../templates/rejectProposal.json';
import informConfirm from '../templates/informConfirm.json';

/**
 * GET /operations
 * 1. For CfP message type returns list of operations (plain text)
 */
const operations = () => {
    return sample_operations;
}

/**
 * GET /submodel/{irdi}
 * 1. Performs lookup in the eCl@ss catalog, retrieves submodel  
 * 2. Returns submodel  
 */
const submodel = (irdi) => {
    return eClass[irdi];
}

/**
 * GET /evaluate/{irdi}/values/{submodel_parameter_values}
 * 1. Evaluates values  
 * 2. Returns success or failure notification
 */
const evaluate = (irdi, values) => {
    const submodelTemplate = eClass[irdi];
    submodelTemplate.forEach(element => {
        const value = values[element.semanticId];
        if (!value) {
            return `Value for ${element.idShort} (${element.semanticId}) is missing`;
        }

        const isTypeValid = checkType(element.valueType, value);
        if (!isTypeValid) {
            return `Type for ${element.idShort} (${element.semanticId}) is invalid`; 
        }
    });
    return 'success';
}

const checkType = (type, value) => {
    switch (type) {
        case 'string':
        case 'langString':
        case 'anyURI':
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
        case 'time':
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
const generate = ({ messageType, userId, irdi, submodel, replyTime }) => {
    const template = getTemplate(messageType);
    if (!template) {
        return null;
    }
    const conversationId = uuid();
    template.frame.conversationId = conversationId;
    template.frame.sender.identification.id = userId;
    template.frame.replyBy = getReplyByTime(replyTime);

    // template.frame.dataElements = {};

}

const getReplyByTime = (minutes = 10) => {
    const timestamp = new Date();
    const timeToReply = minutes * 60 * 1000; // 10 minutes in milliseconds
    timestamp.setTime(timestamp.getTime() + timeToReply);
    return timestamp;
}

const getTemplate = (type) => {
    switch (type) {
        case 'cfp':
            return cfp;
        case 'proposal':
            return proposal;
        case 'acceptProposal':
            return acceptProposal;
        case 'rejectProposal':
            return rejectProposal;        
        case 'informConfirm':
            return informConfirm;
        default:
            return null;
}

module.exports = {
    generate,
    evaluate,
    operations,
    submodel
}