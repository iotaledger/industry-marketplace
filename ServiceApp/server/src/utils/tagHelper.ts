import { zmq } from '../config.json';
import { getCodeFromMessageType, getLetterFromNumber } from './eclassHelper';


export const buildTag = (type, location = null, submodelId) => {

    try {
        submodelId = submodelId.substring(10, submodelId.length - 4)
        let serviceId = '';
        submodelId.split('').forEach((element) => {
            var int = parseInt(element)
            if (Number.isInteger(int)) {
                serviceId += getLetterFromNumber(int)
            }
            else {
                serviceId += element
            }
        })
        return `${zmq.prefix}${getCodeFromMessageType(type)}${serviceId}${location || ''}`
    } catch (error) {
        throw new Error(error);
    }
}