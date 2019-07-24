
var mqtt = require('mqtt')

//LATER FROM CONFIG
var client = mqtt.connect('mqtt://test.mosquitto.org')
var socket = require('socket.io-client')('http://localhost:4000');




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

export const zmqToMQTT = (topic) => {
    socket.on('zmq', (data) => {
        client.publish(topic, JSON.stringify(data));
    });
}


export const unsubscribeHelperClient = (subscriptionId) => {

    const unsubscribeRequest = {
        subscriptionIds: [subscriptionId]
    };

    socket.emit('unsubscribe', unsubscribeRequest);
}