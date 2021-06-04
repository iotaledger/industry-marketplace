import { ServiceFactory } from '../factories/serviceFactory';
import { MqttService } from '../services/mqttService';

/**
 * Unsubscribe from mqtt events.
 * @param config The configuration.
 * @param socket The websocket.
 * @param request The request.
 * @returns The response.
 */
export function mqttUnsubscribe(config, socket, request) {
    let response;

    try {
        if (request.subscriptionIds && request.subscriptionIds.length > 0) {
            const mqttService = ServiceFactory.get<MqttService>('mqtt');

            for (let i = 0; i < request.subscriptionIds.length; i++) {
                mqttService.unsubscribe(request.subscriptionIds[i]);
            }
            console.log('mqttUnsubscribe', request.subscriptionIds);
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
