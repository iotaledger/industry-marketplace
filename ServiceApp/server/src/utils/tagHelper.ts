import { prefix } from '../config.json';
import { convertSubmodelId, getCodeFromMessageType } from './eclassHelper';

export const buildTag = (type, submodelId) => {
    try {
        const serviceId = convertSubmodelId(submodelId);
        return `${prefix}${getCodeFromMessageType(type)}${serviceId}`;
    } catch (error) {
        throw new Error(error);
    }
};
