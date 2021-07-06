import WebSocket from 'ws';
import { BlackBoxApp } from "../index";
export let webSocketServer = null;
export function createWebSocket(options) {
    webSocketServer = new WebSocket.Server(options);
    webSocketServer.on('connection', (ws) => {
        ws.on('message', (m) => {
            BlackBoxApp.emit('getMessageFromWS', ws, m);
        });
        ws.on('error', (e) => {
            BlackBoxApp.emit('errorLog', e, 'SOCKET');
            ws.send(e);
        });
        BlackBoxApp.emit('wsConnecting', ws);
    });
}
//# sourceMappingURL=webSocket.js.map