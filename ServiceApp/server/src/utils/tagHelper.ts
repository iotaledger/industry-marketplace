import { zmq } from '../config.json';
import { getCodeFromMessageType } from './eclassHelper';



// const transformServiceId = (serviceId) => {

//     serviceId = serviceId.replace(/#/g, '').replace(/-/g, '').substr(4);
//     //id = id.substr(4);
//     const serviceIdparams = serviceId.split("")

//     return
//     `
//     ${getLetterFromNumber(parseInt(serviceIdparams[0]))}
//     +${getLetterFromNumber(parseInt(serviceIdparams[1]))}
//    + ${getLetterFromNumber(parseInt(serviceIdparams[2]))}
//     +${serviceIdparams[3]}
//    + ${serviceIdparams[4]}
//     +${serviceIdparams[5]}
//     +${getLetterFromNumber(parseInt(serviceIdparams[6]))}
//     +${getLetterFromNumber(parseInt(serviceIdparams[7]))}
//     +${getLetterFromNumber(parseInt(serviceIdparams[8]))}
//     `
// }



export const buildTag = (type,  location = null) => {

    return `${zmq.prefix}${getCodeFromMessageType(type)}${location || ''}`;
};


