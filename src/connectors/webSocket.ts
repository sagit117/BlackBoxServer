import WebSocket from 'ws'
import { BlackBoxApp } from '../index'
import { ReasonError } from '../emitters/emitters'
import { IOptions, Message } from './ws'

export let webSocketServer: WebSocket.Server | null = null

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
