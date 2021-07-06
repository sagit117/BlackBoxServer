"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocket = exports.webSocketServer = void 0;
const ws_1 = __importDefault(require("ws"));
const index_1 = require("../index");
exports.webSocketServer = null;
function createWebSocket(options) {
    exports.webSocketServer = new ws_1.default.Server(options);
    exports.webSocketServer.on('connection', (ws) => {
        ws.on('message', (m) => {
            index_1.BlackBoxApp.emit('getMessageFromWS', ws, m);
        });
        ws.on('error', (e) => {
            index_1.BlackBoxApp.emit('errorLog', e, 'SOCKET');
            ws.send(e);
        });
        index_1.BlackBoxApp.emit('wsConnecting', ws);
    });
}
exports.createWebSocket = createWebSocket;
