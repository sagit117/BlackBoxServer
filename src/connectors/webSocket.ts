import WebSocket, {
    PerMessageDeflateOptions,
    VerifyClientCallbackAsync,
    VerifyClientCallbackSync,
} from 'ws'
import http from 'http'
import https from 'https'
import { BlackBoxApp } from '../index'
import { ReasonError } from '../emitters/emitters'

export let webSocketServer: WebSocket.Server | null = null

interface IOptions {
    host?: string
    port?: number
    backlog?: number
    server?: http.Server | https.Server
    verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync
    handleProtocols?: any
    path?: string
    noServer?: boolean
    clientTracking?: boolean
    perMessageDeflate?: boolean | PerMessageDeflateOptions
    maxPayload?: number
}

export type Message = string | Buffer | ArrayBuffer | Buffer[]

/**
 * Запускаем слушатель web socket
 * @param options
 */
export function createWebSocket(options: IOptions) {
    webSocketServer = new WebSocket.Server(options)

    webSocketServer.on('connection', (ws) => {
        /**
         * Обрабатываем то, что отправил клиент
         */
        ws.on('message', (m: Message) => {
            BlackBoxApp.emit('getMessageFromWS', ws, m)
        })

        ws.on('error', (e) => {
            BlackBoxApp.emit('errorLog', e, ReasonError.SOCKET)
            ws.send(e)
        })

        BlackBoxApp.emit('wsConnecting', ws)
    })
}
