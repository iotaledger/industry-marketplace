"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import SocketIO from 'socket.io';
const serviceFactory_1 = require("../factories/serviceFactory");
/**
 * Subscribe to zmq events.
 * @param config The configuration.
 * @param socket The websocket.
 * @param request The request.
 * @returns The response.
 */
function zmqSubscribe(config, socket, request) {
    let response;
    try {
        const subscriptionIds = [];
        if (request.events && request.events.length > 0) {
            const zmqService = serviceFactory_1.ServiceFactory.get('zmq');
            const subscriptionId = zmqService.subscribeEvent('tx', (event, data) => {
                console.log('emit', event, data);
                socket.emit('zmq', { event, data });
            });
            subscriptionIds.push(subscriptionId);
            console.log('zmqSubscribe', subscriptionId);
        }
        response = {
            success: true,
            message: '',
            subscriptionIds
        };
    }
    catch (err) {
        response = {
            success: false,
            message: err.toString()
        };
    }
    return response;
}
exports.zmqSubscribe = zmqSubscribe;
