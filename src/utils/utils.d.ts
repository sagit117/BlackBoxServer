export interface IConfigApp {
    PORT: number
    DB_HOST: string
    DB_PORT: number
    DB_USER: string
    DB_PASSWORD: string
    DB_NAME: string
    DB_STRING_OPTIONS: string
    USE_RABBIT: boolean
    RABBITMQ_URL: string
    RABBITMQ_RECEIVE_QUEUE_NAME: string
    RABBITMQ_RECEIVE_EXCHANGE: string
    RABBITMQ_RECEIVE_ROUTING_KEY: string
    RABBITMQ_RECEIVE_BIND_XMTTL: number
    RABBITMQ_SEND_EXCHANGE: string
    RABBITMQ_SEND_ROUTING_KEY: string
    USE_WS: boolean
    HEADERS: THeader[]
}

export type THeader = { key: string; value: string }
