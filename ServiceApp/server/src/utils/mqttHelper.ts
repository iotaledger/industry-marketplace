import mqtt from 'mqtt';
import io from 'socket.io-client';
import { mqttConfig } from '../config.json';

const client = mqtt.connect(mqttConfig.broker);
const socket = io(mqttConfig.domain);

export const createHelperClient = () => {
    return new Promise((resolve, reject) => {
        try {
            socket.emit('subscribe', { events: ['tx'] });
            socket.on('subscribe', data => {
                resolve(data.subscriptionIds[0]);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

export const zmqToMQTT = topic =>
    socket.on('zmq', data => client.publish(topic, JSON.stringify(data)));

export const unsubscribeHelperClient = subscriptionId =>
    socket.emit('unsubscribe', { subscriptionIds: [subscriptionId] });
