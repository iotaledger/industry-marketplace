import io from 'socket.io-client';
import get from 'lodash/get';
import { readRow, updateValue, writeData } from '../utils/databaseHelper';


const socket = io('http://localhost:3000');

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

export const updateMetric = async (messageType) => {

  let counter: any = await readRow('metric', 'context', messageType);

  if (counter === null) {
    await writeData('metric', { 'context': messageType, 'counter': 0 });
    counter = { 'context': messageType, 'counter': 0 }
  }

  counter.counter = counter.counter + 1
  await updateValue('metric', 'context', 'counter', messageType, counter.counter)

}
