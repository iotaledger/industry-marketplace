// import SocketIO from 'socket.io';
import { ServiceFactory } from '../factories/serviceFactory';

/**
 * Subscribe to zmq events.
 * @param config The configuration.
 * @param socket The websocket.
 * @param request The request.
 * @returns The response.
 */
export function zmqSubscribe(config, socket, request) {
    let response;

    try {
        const subscriptionIds = [];

        if (request.events && request.events.length > 0) {
            const zmqService = ServiceFactory.get('zmq');

            for (let i = 0; i < request.events.length; i++) {
                const subscriptionId = zmqService.subscribeEvent(request.events[i], (event, zmqData) => {
                    socket.emit('zmq', {
                        event,
                        data: zmqData
                    });
                });
                subscriptionIds.push(subscriptionId);
            }
        }

        response = {
            success: true,
            message: '',
            subscriptionIds
        };
    } catch (err) {
        response = {
            success: false,
            message: err.toString()
        };
    }

    return response;
}
