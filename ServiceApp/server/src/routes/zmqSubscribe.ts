import { ServiceFactory } from '../factories/serviceFactory';
import { ZmqService } from '../services/zmqService';

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
            const zmqService = ServiceFactory.get<ZmqService>('zmq');

            for (let i = 0; i < request.events.length; i++) {
                const subscriptionId = zmqService.subscribeEvent(request.events[i], (event, data) => {
                    console.log('emit', event, data);
                    socket.emit('zmq', { event, data });
                });
                subscriptionIds.push(subscriptionId);
                console.log('zmqSubscribe', subscriptionId, subscriptionIds);
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
