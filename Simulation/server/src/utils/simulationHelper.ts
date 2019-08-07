import io from 'socket.io-client'
import get from 'lodash/get';

const socket = io('http://localhost:4000');
const role = 'SP'

socket.on('connect', () => {
    console.log("Connected")
});
socket.emit('subscribe', { events: ['tx'] })

socket.on('zmq', (message) => {

    const data = get(message, 'data.data')
    if (typeof data === 'string') {
        JSON.parse(data);
    }

    const {
        conversationId,
        location,
        type,
    } = data.frame;



    const submodelElements = get(data, 'dataElements.submodels[0].identification.submodelElements');
    console.log(submodelElements)
    console.log(conversationId,
        location,
        type)
    // const params = submodelElements.map(({ idShort, value }) => ({ idShort, value }));


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


