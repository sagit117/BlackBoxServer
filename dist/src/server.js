"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverStart = void 0;
const index_1 = require("./index");
const utils_1 = require("./utils");
const log_colors_1 = require("./utils/log-colors");
const mongoDB_1 = require("./connectors/mongoDB");
const webSocket_1 = require("./connectors/webSocket");
const rabbitMQ_1 = require("./connectors/rabbitMQ");
function serverStart(server, env) {
    utils_1.getConfigFile.USE_WS && webSocket_1.createWebSocket({ server, path: env.BASE_PATH || '' });
    server
        .listen(utils_1.getConfigFile.PORT, () => {
        mongoDB_1.connectDB(index_1.BlackBoxApp)
            .then(() => {
            index_1.BlackBoxApp.emit('eventLog', "SERVER_IS_RUNNING", `port: ${utils_1.getConfigFile.PORT}, mode: ${env.NODE_ENV}`);
            utils_1.getConfigFile.USE_RABBIT && rabbitMQ_1.connectRabbitMQ(index_1.BlackBoxApp);
        })
            .catch((error) => {
            console.error(log_colors_1.errorMsg(`⚡️[error DB]: ${new Date()} - name: ${error.name}, message: ${error.message}, stack: `, error.stack));
            process.exit(2);
        });
    })
        .on('error', (error) => {
        console.error(log_colors_1.errorMsg(`⚡️[error server]: ${new Date()} - name: ${error.name}, message: ${error.message}, stack: `, error.stack));
        process.exit(2);
    });
}
exports.serverStart = serverStart;
