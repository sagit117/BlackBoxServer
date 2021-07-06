import { BlackBoxApp } from './index';
import { getConfig } from './utils';
import { errorMsg } from './utils/log-colors';
import { connectDB } from './connectors/mongoDB';
import http from 'http';
import { createWebSocket } from './connectors/webSocket';
import { connectRabbitMQ } from './connectors/rabbitMQ';
const server = http.createServer(BlackBoxApp);
createWebSocket({ server, path: process.env.BASE_PATH || '' });
server
    .listen(getConfig().PORT, () => {
    connectDB(BlackBoxApp)
        .then(() => {
        BlackBoxApp.emit('eventLog', "SERVER_IS_RUNNING", `port: ${getConfig().PORT}, mode: ${process.env.NODE_ENV}`);
        getConfig().USE_RABBIT && connectRabbitMQ(BlackBoxApp);
    })
        .catch((error) => {
        console.error(errorMsg(`⚡️[error DB]: ${new Date()} - name: ${error.name}, message: ${error.message}, stack: `, error.stack));
        process.exit(2);
    });
})
    .on('error', (error) => {
    console.error(errorMsg(`⚡️[error server]: ${new Date()} - name: ${error.name}, message: ${error.message}, stack: `, error.stack));
    process.exit(2);
});
//# sourceMappingURL=server.js.map