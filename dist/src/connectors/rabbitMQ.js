"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendingMsg = exports.connectRabbitMQ = exports.conn = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const utils_1 = require("../utils");
const statusAppConnect_1 = __importDefault(require("../dataClasses/statusAppConnect"));
exports.conn = null;
const url = utils_1.getConfig().RABBITMQ_URL || '';
const queueName = utils_1.getConfig().RABBITMQ_RECEIVE_QUEUE_NAME || '';
const channelOptions = {
    durable: false,
    autoDelete: true,
};
const exchange = utils_1.getConfig().RABBITMQ_SEND_EXCHANGE || '';
const channelSendOptions = {
    durable: true,
};
function connectRabbitMQ(App) {
    callback_api_1.default.connect(url, function (error, connection) {
        if (error) {
            exports.conn = null;
            App.emit('errorLog', error, "AMQP");
            statusAppConnect_1.default.connectedRabbit = false;
            setTimeout(connectRabbitMQ.bind(null, App), 1000);
        }
        connection.on('error', function (err) {
            exports.conn = null;
            if (err.message !== 'Connection closing') {
                App.emit('errorLog', error, "AMQP");
            }
            statusAppConnect_1.default.connectedRabbit = false;
            setTimeout(connectRabbitMQ.bind(null, App), 1000);
        });
        connection.on('close', function () {
            exports.conn = null;
            App.emit('eventLog', "AMQP_IS_RECONNECTING", 'amqp reconnecting');
            statusAppConnect_1.default.connectedRabbit = false;
            setTimeout(connectRabbitMQ.bind(null, App), 1000);
        });
        App.emit('eventLog', "AMQP_IS_CONNECTED", 'amqp connected');
        exports.conn = connection;
        statusAppConnect_1.default.connectedRabbit = true;
        receiveMsg(App);
    });
}
exports.connectRabbitMQ = connectRabbitMQ;
function receiveMsg(App) {
    if (!exports.conn)
        return;
    exports.conn.createChannel(function (error, ch) {
        if (closeOnErr(error, App))
            return;
        ch.on('error', function (error) {
            App.emit('errorLog', error, "AMQP_CHANNEL");
        });
        ch.on('close', function () {
            App.emit('eventLog', "AMQP_CHANNEL_IS_CLOSED", 'amqp канал получения закрыт');
        });
        ch.prefetch(10);
        ch.assertQueue(queueName, channelOptions, function (err, _ok) {
            if (closeOnErr(err, App))
                return;
            ch.consume(queueName, processMsg, { noAck: false });
            App.emit('eventLog', "AMQP_WORKER_IS_STARTED", 'amqp worker запущен');
            function processMsg(msg) {
                work(msg, function (ok) {
                    try {
                        if (ok)
                            ch.ack(msg);
                        else
                            ch.reject(msg, true);
                    }
                    catch (e) {
                        closeOnErr(e, App);
                    }
                });
            }
        });
        ch.bindQueue(queueName, utils_1.getConfig().RABBITMQ_RECEIVE_EXCHANGE || '', utils_1.getConfig().RABBITMQ_RECEIVE_ROUTING_KEY || '', {
            'x-message-ttl': Number(utils_1.getConfig().RABBITMQ_RECEIVE_BIND_XMTTL) || 600000,
        });
    });
    function work(msg, cb) {
        App.emit('getMessageRabbit', msg);
        cb(true);
    }
}
function sendingMsg(App, msg, doc) {
    if (!exports.conn)
        return;
    exports.conn.createChannel(function (error, ch) {
        if (closeOnErr(error, App))
            return;
        if (!ch)
            return;
        ch.on('error', function (error) {
            App.emit('errorLog', error, "AMQP_CHANNEL");
        });
        ch.on('close', function () {
            App.emit('eventLog', "AMQP_CHANNEL_IS_CLOSED", 'amqp канал отправки закрыт');
        });
        ch.assertExchange(exchange, 'fanout', channelSendOptions);
        const sendingIsSuccess = ch.publish(exchange, utils_1.getConfig().RABBITMQ_SEND_ROUTING_KEY || '', Buffer.from(msg));
        if (sendingIsSuccess) {
            doc.updateOne({ sending: true }).exec();
        }
    });
}
exports.sendingMsg = sendingMsg;
function closeOnErr(error, App) {
    if (!error || !exports.conn)
        return false;
    App.emit('errorLog', error, "AMQP");
    exports.conn.close();
    return true;
}
