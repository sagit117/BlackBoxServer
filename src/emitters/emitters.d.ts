export const enum EventName {
    CLIENT_REQUEST = 'CLIENT_REQUEST',
    SERVER_IS_RUNNING = 'SERVER_IS_RUNNING',
    SERVER_IS_STOPPED = 'SERVER_IS_STOPPED',
    DB_IS_CONNECTED = 'DB_IS_CONNECTED',
    AMQP_IS_RECONNECTING = 'AMQP_IS_RECONNECTING',
    AMQP_IS_CONNECTED = 'AMQP_IS_CONNECTED',
    AMQP_CHANNEL_IS_CLOSED = 'AMQP_CHANNEL_IS_CLOSED',
    AMQP_WORKER_IS_STARTED = 'AMQP_WORKER_IS_STARTED',
    CREATE_DISP_EVENT = 'CREATE_DISP_EVENT',
    CREATE_CUBES_EXECUTOR = 'CREATE_CUBES_EXECUTOR',
    REMOVE_CUBES_EXECUTOR = 'REMOVE_CUBES_EXECUTOR',
    SAVE_EVENTS_BOARD = 'SAVE_EVENTS_BOARD',
    SAVE_COMPLETED_EVENTS = 'SAVE_COMPLETED_EVENTS',
}
