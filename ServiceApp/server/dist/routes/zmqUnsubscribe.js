"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import SocketIO from 'socket.io';
const serviceFactory_1 = require("../factories/serviceFactory");
/**
 * Unsubscribe from zmq events.
 * @param config The configuration.
 * @param socket The websocket.
 * @param request The request.
 * @returns The response.
 */
function zmqUnsubscribe(config, socket, request) {
    let response;
    try {
        if (request.subscriptionIds && request.subscriptionIds.length > 0) {
            const zmqService = serviceFactory_1.ServiceFactory.get('zmq');
            for (let i = 0; i < request.subscriptionIds.length; i++) {
                zmqService.unsubscribe(request.subscriptionIds[i]);
            }
            console.log('zmqUnsubscribe', request.subscriptionIds);
        }
        response = {
            success: true,
            message: ''
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
exports.zmqUnsubscribe = zmqUnsubscribe;
