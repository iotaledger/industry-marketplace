import io from 'socket.io-client';
import get from 'lodash/get';

const socket = io('http://localhost:4000');

socket.emit('subscribe', { events: ['tx'] })


socket.on('subscribe', (message) => { 
  console.log(message.subscriptionIds)  
})

socket.on('zmq', async (message) => {
    const data = get(message, 'data.data')
    if (typeof data === 'string') {
        JSON.parse(data);
    }
})

