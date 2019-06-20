// import SocketIO from 'socket.io';
import { ServiceFactory } from '../factories/serviceFactory';

/**
 * Unsubscribe from zmq events.
 * @param config The configuration.
 * @param socket The websocket.
 * @param request The request.
 * @returns The response.
 */
export function zmqUnsubscribe(config, socket, request) {
    let response;

    try {
        if (request.subscriptionIds && request.subscriptionIds.length > 0) {
            const zmqService = ServiceFactory.get('zmq');

            for (let i = 0; i < request.subscriptionIds.length; i++) {
                zmqService.unsubscribe(request.subscriptionIds[i]);
            }
            console.log('zmqUnsubscribe', request.subscriptionIds)
        }

        response = {
            success: true,
            message: ''
        };
    } catch (err) {
        response = {
            success: false,
            message: err.toString()
        };
    }

    return response;
}
