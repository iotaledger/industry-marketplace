"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = __importDefault(require("socket.io"));
const serviceFactory_1 = require("./factories/serviceFactory");
const zmqSubscribe_1 = require("./routes/zmqSubscribe");
const zmqUnsubscribe_1 = require("./routes/zmqUnsubscribe");
const zmqService_1 = require("./services/zmqService");
const appHelper_1 = require("./utils/appHelper");
appHelper_1.AppHelper.build((app, config, port) => {
    serviceFactory_1.ServiceFactory.register('zmq', () => new zmqService_1.ZmqService(config.zmq));
    const server = new http_1.Server(app);
    const socketServer = socket_io_1.default(server);
    server.listen(port);
    socketServer.on('connection', (socket) => {
        socket.on('subscribe', (data) => socket.emit('subscribe', zmqSubscribe_1.zmqSubscribe(config, socket, data)));
        socket.on('unsubscribe', (data) => socket.emit('unsubscribe', zmqUnsubscribe_1.zmqUnsubscribe(config, socket, data)));
    });
}, true);
