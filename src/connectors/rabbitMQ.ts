import amqp from 'amqplib/callback_api'
import { getConfig } from '../utils'
import StatusAppConnect from '../dataClasses/statusAppConnect'
import { EventName } from '../emitters/emitters'

/**
 * Глобальный екземпляр соединения с rabbitMQ
 */
export let conn: amqp.Connection | null = null
/**
 * URL для подключения к rabbitMQ
 */
const url = getConfig().RABBITMQ_URL || ''

/**
 * название очереди получения
 */
const queueName: string = getConfig().RABBITMQ_RECEIVE_QUEUE_NAME || ''

/**
 * опции для канала получения
 */
const channelOptions = {
    durable: false,
    autoDelete: true,
}

/**
 * Название биржи
 */
const exchange = getConfig().RABBITMQ_SEND_EXCHANGE || ''

/**
 * опции для канала отправки
 */
const channelSendOptions = {
    durable: true,
}

/**
 * Соединение с rabbitMQ
 * @param App   - экземпляр приложения
 */
export function connectRabbitMQ(App) {
    amqp.connect(url, function (error, connection) {
        if (error) {
            conn = null

            App.emit('errorLog', error, 'AMQP')

            StatusAppConnect.connectedRabbit = false

            setTimeout(connectRabbitMQ.bind(null, App), 1000)
        }

        /**
         * Слушатели событий соединения
         */
        connection.on('error', function (err) {
            conn = null

            if (err.message !== 'Connection closing') {
                App.emit('errorLog', error, 'AMQP')
            }

            StatusAppConnect.connectedRabbit = false

            setTimeout(connectRabbitMQ.bind(null, App), 1000)
        })

        connection.on('close', function () {
            conn = null

            App.emit(
                'eventLog',
                EventName.AMQP_IS_RECONNECTING,
                'amqp reconnecting'
            )

            StatusAppConnect.connectedRabbit = false

            setTimeout(connectRabbitMQ.bind(null, App), 1000)
        })

        /** ==== */

        /**
         * Удачный коннект
         */
        App.emit('eventLog', EventName.AMQP_IS_CONNECTED, 'amqp connected')

        conn = connection

        StatusAppConnect.connectedRabbit = true

        /**
         * Создание канала получения
         */
        receiveMsg(App)
    })
}

/**
 * Канал получения сообщений
 * @param App
 */
function receiveMsg(App) {
    if (!conn) return

    conn.createChannel(function (error, ch) {
        if (closeOnErr(error, App)) return

        /**
         * Слушатели событий канала
         */
        ch.on('error', function (error) {
            App.emit('errorLog', error, 'AMQP_CHANNEL')
        })

        ch.on('close', function () {
            App.emit(
                'eventLog',
                EventName.AMQP_CHANNEL_IS_CLOSED,
                'amqp канал получения закрыт'
            )
        })

        /** ==== */

        ch.prefetch(10)

        ch.assertQueue(queueName, channelOptions, function (err, _ok) {
            if (closeOnErr(err, App)) return

            ch.consume(queueName, processMsg, { noAck: false })
            App.emit(
                'eventLog',
                EventName.AMQP_WORKER_IS_STARTED,
                'amqp worker запущен'
            )

            /**
             * Процесс обработки получения сообщений
             * @param msg
             */
            function processMsg(msg) {
                work(msg, function (ok) {
                    try {
                        if (ok) ch.ack(msg)
                        else ch.reject(msg, true)
                    } catch (e) {
                        closeOnErr(e, App)
                    }
                })
            }
        })

        /**
         * Байнд маршрутов
         */
        ch.bindQueue(
            queueName,
            getConfig().RABBITMQ_RECEIVE_EXCHANGE || '',
            getConfig().RABBITMQ_RECEIVE_ROUTING_KEY || '',
            {
                'x-message-ttl':
                    Number(getConfig().RABBITMQ_RECEIVE_BIND_XMTTL) || 600000,
            }
        )
    })

    /**
     * Обработка полученных сообщений
     * @param msg
     * @param cb
     */
    function work(msg, cb) {
        /**
         * Локальное событие с объектом статуса
         */
        App.emit('getMessageRabbit', msg)

        cb(true)
    }
}

/**
 * Канал для отправки
 * @param App
 * @param msg - сообщение для отправки
 * @param doc - экземпляр записи БД
 */
export function sendingMsg(App, msg: string, doc) {
    if (!conn) return

    conn.createChannel(function (error, ch) {
        if (closeOnErr(error, App)) return

        if (!ch) return

        /**
         * Слушатели событий канала
         */
        ch.on('error', function (error) {
            App.emit('errorLog', error, 'AMQP_CHANNEL')
        })

        ch.on('close', function () {
            App.emit(
                'eventLog',
                EventName.AMQP_CHANNEL_IS_CLOSED,
                'amqp канал отправки закрыт'
            )

            // StatusAppConnect.connectedRabbit = false
            //
            // setTimeout(connectRabbitMQ.bind(null, App), 1000)
        })

        /** ==== */

        ch.assertExchange(exchange, 'fanout', channelSendOptions)

        const sendingIsSuccess = ch.publish(
            exchange,
            getConfig().RABBITMQ_SEND_ROUTING_KEY || '',
            Buffer.from(msg)
        )

        if (sendingIsSuccess) {
            doc.updateOne({ sending: true }).exec()
        }
    })
}

/**
 * Обработка ошибок канала и очередей
 * @param error
 * @param App
 */
function closeOnErr(error, App) {
    if (!error || !conn) return false

    App.emit('errorLog', error, 'AMQP')
    conn.close()

    return true
}
