import mqtt from 'mqtt';
import io from 'socket.io-client';
import { mqttBroker, domain } from '../config.json';



const client = mqtt.connect(mqttBroker)
const socket = io(domain);

export const createHelperClient = () => {
    socket.emit('subscribe', { events: ['tx'] })

    let subscriptionId = ''

    return new Promise((resolve, reject) => {
        socket.on('subscribe', (data) => {
            subscriptionId = data.subscriptionIds[0];
            resolve(subscriptionId);
        });
    });
}

export const zmqToMQTT = topic =>
    socket.on('zmq', data => client.publish(topic, JSON.stringify(data)));


export const unsubscribeHelperClient = subscriptionId =>
    socket.emit('unsubscribe', { subscriptionIds: [subscriptionId] });
