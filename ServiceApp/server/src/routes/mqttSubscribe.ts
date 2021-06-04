import { ServiceFactory } from '../factories/serviceFactory';
import { MqttService } from '../services/mqttService';

/**
 * Subscribe to mqtt events.
 * @param config The configuration.
 * @param socket The websocket.
 * @param request The request.
 * @returns The response.
 */
export function mqttSubscribe(config, socket, request) {
    let response;

    try {
        const subscriptionIds = [];

        if (request.events && request.events.length > 0) {
            const mqttService = ServiceFactory.get<MqttService>('mqtt');

            for (let i = 0; i < request.events.length; i++) {
                const subscriptionId = mqttService.subscribeEvent(request.events[i], (event, data) => {
                    console.log('emit', event, data);
                    socket.emit('mqtt', { event, data });
                });
                subscriptionIds.push(subscriptionId);
                console.log('mqttSubscribe', subscriptionId, subscriptionIds);
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
