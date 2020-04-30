import io from 'socket.io-client';
import get from 'lodash/get';
import fs from 'fs';
import { readRow, updateValue, writeData, removeData } from '../utils/databaseHelper';


const socket = io(`http://localhost:${process.env.PORT}`);

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

const extractMetricToFile = async () => {
  try {
    
    //Extract metric
    const cfpCounter: any = await readRow('metric', 'context', 'cfp');
    const proposalCounter: any = await readRow('metric', 'context', 'proposal');
    const informPaymentCounter: any = await readRow('metric', 'context', 'informPayment');

    const date = new Date().toLocaleString()
    let payload = { date: date, cfpCounter, proposalCounter, informPaymentCounter }

    //Append to file
    fs.appendFile('metric.txt', JSON.stringify(payload, null, 2) + '\n' + '\n' + '\n' + '\n', function (err) {
      if (err) throw err;
      console.log(`Saved to metric on ${date}`);
    });
    
    //Reset metric
    await removeData('metric')
    await writeData('metric', { "context": "cfp", "counter": 0 })
    await writeData('metric', { "context": "proposal", "counter": 0 })
    await writeData('metric', { "context": "informPayment", "counter": 0 })

  } catch (err) {
    console.log(err)
  }
}


setInterval(extractMetricToFile, Number(process.env.FREQUENCY))





export const updateMetric = async (messageType) => {

  let counter: any = await readRow('metric', 'context', messageType);

  if (counter === null) {
    await writeData('metric', { 'context': messageType, 'counter': 0 });
    counter = { 'context': messageType, 'counter': 0 }
  }

  counter.counter = counter.counter + 1
  await updateValue('metric', 'context', 'counter', messageType, counter.counter)

}
