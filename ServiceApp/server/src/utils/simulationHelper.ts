import io from 'socket.io-client'
import get from 'lodash/get';
//import {generate} from '../Industry_4.0_language'

const socket = io('http://localhost:4000');
const role = 'SP'
//const id = 'UserSP'

socket.on('connect', () => {
    console.log("Connected")
});
socket.emit('subscribe', { events: ['tx'] })

socket.on('zmq', async (message) => {

    const data = get(message, 'data.data')
    if (typeof data === 'string') {
        JSON.parse(data);
    }

    const {
       // conversationId,
        location,
       // type,
    } = data.frame;

    const partner = await getPartner(role, data.frame);
console.log(location, partner)
  //  const submodelElements = get(data, 'dataElements.submodels[0].identification.submodelElements');

  
//  const request = generate({
// messageType: 'proposal',
// location,
// partner,
// originalMessage: await JSON.parse(data),
// userId: id,
// price: 6,
// })





});




// 1. Check user role (SR, SP, YP)
switch (role) {
    case 'SP':

        //Extract message
        //extract type of msg 
        //if with type of msg






        break;

}


//         // 2. For SR only react on message types B, E ('proposal' and 'informConfirm')
//         if (['proposal', 'informConfirm'].includes(messageType)) {
//             // 2.1 Decode every such message and retrieve receiver ID
//             const data = await getPayload(bundle);
//             const receiverID = data.frame.receiver.identification.id;

//             // 2.2 Compare receiver ID with user ID. Only if match, send message to UI
//             if (id === receiverID) {
//                 this.sendEvent(data, messageType, messageParams);

//                 if (messageType === 'informConfirm') {
//                     const channelId = data.frame.conversationId;
//                     await publish(channelId, data);
//                 }
//             }
//         }
//         break;
//     case 'SP':

// socket.on('zmq', (data) => {
//     console.log('zmsqdata',data)

//   //  console.log(data.data)
//   //  console.log(parse.data.data.dataElements)

// });


const getPartner = async (role, data) => {
    if (role === 'SP') {
        if (['callForProposal', 'acceptProposal', 'rejectProposal', 'informPayment'].includes(data.type)) {
            return get(data, 'sender.identification.id');
        } else if (['proposal', 'informConfirm'].includes(data.type)) {
            return get(data, 'receiver.identification.id');
        }
    } else if (role === 'SR') {
        if (data.type === 'callForProposal') {
            return 'Pending';
        } else if (['acceptProposal', 'rejectProposal', 'informPayment'].includes(data.type)) {
            return get(data, 'receiver.identification.id');
        } else if (['proposal', 'informConfirm'].includes(data.type)) {
            return get(data, 'sender.identification.id');
        }
    }
}

