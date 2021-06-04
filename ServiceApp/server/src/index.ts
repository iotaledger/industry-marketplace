import { Server } from 'http';
import SocketIO from 'socket.io';
import { ServiceFactory } from './factories/serviceFactory';
import { mqttSubscribe } from './routes/mqttSubscribe';
import { mqttUnsubscribe } from './routes/mqttUnsubscribe';
import { MqttService } from './services/mqttService';
import { AppHelper } from './utils/appHelper';

AppHelper.build(
    async (app, config, port) => {
        ServiceFactory.register('mqtt', () => new MqttService(config.mqtt));

        const server = new Server(app);
        const socketServer = SocketIO(server);

        server.listen(port);

        socketServer.on('connection', (socket) => {
            socket.on('subscribe', (data) => socket.emit('subscribe', mqttSubscribe(config, socket, data)));
            socket.on('unsubscribe', (data) => socket.emit('unsubscribe', mqttUnsubscribe(config, socket, data)));
        });
    },
    true);
