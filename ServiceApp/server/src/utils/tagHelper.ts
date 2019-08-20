import { zmq } from '../config.json';
import { convertSubmodelId, getCodeFromMessageType } from './eclassHelper';

export const buildTag = (type, location = null, submodelId) => {
    try {
        const serviceId = convertSubmodelId(submodelId);
        return `${zmq.prefix}${getCodeFromMessageType(type)}${serviceId}`;
    } catch (error) {
        throw new Error(error);
    }
};
