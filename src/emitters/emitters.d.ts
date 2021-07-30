export const enum EventName {
    CLIENT_REQUEST = 'CLIENT_REQUEST',
    SERVER_IS_RUNNING = 'SERVER_IS_RUNNING',
    SERVER_IS_STOPPED = 'SERVER_IS_STOPPED',
    DB_IS_CONNECTED = 'DB_IS_CONNECTED',
    AMQP_IS_RECONNECTING = 'AMQP_IS_RECONNECTING',
    AMQP_IS_CONNECTED = 'AMQP_IS_CONNECTED',
    AMQP_CHANNEL_IS_CLOSED = 'AMQP_CHANNEL_IS_CLOSED',
    AMQP_WORKER_IS_STARTED = 'AMQP_WORKER_IS_STARTED',
}

export const enum ReasonError {
    REQUEST = 'REQUEST',
    AMQP = 'AMQP',
    AMQP_CHANNEL = 'AMQP_CHANNEL',
    SOCKET = 'SOCKET',
    CONTROLLER = 'CONTROLLER',
    JWT = 'JWT',
}
