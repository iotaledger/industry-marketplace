import { zmq } from '../config.json';
import { getCodeFromMessageType, getLetterFromNumber } from './eclassHelper';


export const buildTag = (type, location = null, submodelId) => {

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
        return `${zmq.prefix}${getCodeFromMessageType(type)}${serviceId}${location || ''}`;
    } catch (error) {
        throw new Error(error);
    }
}