import { zmq } from '../config.json';
import { getCodeFromMessageType } from './eclassHelper';


export const buildTag = (type,  location = null) => {

    return `${zmq.prefix}${getCodeFromMessageType(type)}${location || ''}`;
};


