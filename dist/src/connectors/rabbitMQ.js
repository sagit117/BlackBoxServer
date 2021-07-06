import amqp from 'amqplib/callback_api';
import { getConfig } from '../utils';
import StatusAppConnect from '../dataClasses/statusAppConnect';
export let conn = null;
const url = getConfig().RABBITMQ_URL || '';
const queueName = getConfig().RABBITMQ_RECEIVE_QUEUE_NAME || '';
const channelOptions = {
    durable: false,
    autoDelete: true,
};
const exchange = getConfig().RABBITMQ_SEND_EXCHANGE || '';
const channelSendOptions = {
    durable: true,
};
export function connectRabbitMQ(App) {
    amqp.connect(url, function (error, connection) {
        if (error) {
            conn = null;
            App.emit('errorLog', error, 'AMQP');
            StatusAppConnect.connectedRabbit = false;
            setTimeout(connectRabbitMQ.bind(null, App), 1000);
        }
        connection.on('error', function (err) {
            conn = null;
            if (err.message !== 'Connection closing') {
                App.emit('errorLog', error, 'AMQP');
            }
            StatusAppConnect.connectedRabbit = false;
            setTimeout(connectRabbitMQ.bind(null, App), 1000);
        });
        connection.on('close', function () {
            conn = null;
            App.emit('eventLog', "AMQP_IS_RECONNECTING", 'amqp reconnecting');
            StatusAppConnect.connectedRabbit = false;
            setTimeout(connectRabbitMQ.bind(null, App), 1000);
        });
        App.emit('eventLog', "AMQP_IS_CONNECTED", 'amqp connected');
        conn = connection;
        StatusAppConnect.connectedRabbit = true;
        receiveMsg(App);
    });
}
function receiveMsg(App) {
    if (!conn)
        return;
    conn.createChannel(function (error, ch) {
        if (closeOnErr(error, App))
            return;
        ch.on('error', function (error) {
            App.emit('errorLog', error, 'AMQP_CHANNEL');
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
        ch.bindQueue(queueName, getConfig().RABBITMQ_RECEIVE_EXCHANGE || '', getConfig().RABBITMQ_RECEIVE_ROUTING_KEY || '', {
            'x-message-ttl': Number(getConfig().RABBITMQ_RECEIVE_BIND_XMTTL) || 600000,
        });
    });
    function work(msg, cb) {
        App.emit('getMessageRabbit', msg);
        cb(true);
    }
}
export function sendingMsg(App, msg, doc) {
    if (!conn)
        return;
    conn.createChannel(function (error, ch) {
        if (closeOnErr(error, App))
            return;
        if (!ch)
            return;
        ch.on('error', function (error) {
            App.emit('errorLog', error, 'AMQP_CHANNEL');
        });
        ch.on('close', function () {
            App.emit('eventLog', "AMQP_CHANNEL_IS_CLOSED", 'amqp канал отправки закрыт');
        });
        ch.assertExchange(exchange, 'fanout', channelSendOptions);
        const sendingIsSuccess = ch.publish(exchange, getConfig().RABBITMQ_SEND_ROUTING_KEY || '', Buffer.from(msg));
        if (sendingIsSuccess) {
            doc.updateOne({ sending: true }).exec();
        }
    });
}
function closeOnErr(error, App) {
    if (!error || !conn)
        return false;
    App.emit('errorLog', error, 'AMQP');
    conn.close();
    return true;
}
//# sourceMappingURL=rabbitMQ.js.map