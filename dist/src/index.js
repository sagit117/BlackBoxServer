import Express from 'express';
import Compression from 'compression';
import BodyParser from 'body-parser';
import { errorLog, errorPromiseLog, eventLog } from './emitters';
import { warnMsg } from './utils/log-colors';
import { HttpInternalServerException, HttpUnauthorizedException, HttpValidationErrorException, } from './dataClasses/httpErrors';
import ClientInfo from './dataClasses/clientInfo';
import StatusAppConnect from './dataClasses/statusAppConnect';
import { getConfig } from './utils';
export const BlackBoxApp = Express();
export function createApp() {
    BlackBoxApp.use(Compression());
    const urlencodedParser = BodyParser.urlencoded({
        limit: '50mb',
        extended: false,
        parameterLimit: 50000,
    });
    const jsonParser = BodyParser.json({ limit: '50mb' });
    BlackBoxApp.use(urlencodedParser);
    BlackBoxApp.use(jsonParser);
    BlackBoxApp.addListener('eventLog', eventLog);
    BlackBoxApp.addListener('errorLog', errorLog);
    BlackBoxApp.addListener('errorPromiseLog', errorPromiseLog);
    process.on('uncaughtException', (error) => {
        BlackBoxApp.emit('errorLog', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        if (reason instanceof HttpInternalServerException) {
            reason.response
                .status(500)
                .send(reason.message);
        }
        else if (reason instanceof HttpValidationErrorException) {
            reason.response.status(400).send(reason.message);
        }
        BlackBoxApp.emit('errorPromiseLog', reason, promise);
    });
    const exits = ['exit', 'SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'];
    exits.forEach((event) => {
        process.on(event, (code) => {
            console.log(warnMsg(`⚡️[event ${"SERVER_IS_STOPPED"}]: ${new Date()} - server остановлен по коду ${code}`));
            process.exit(0);
        });
    });
    BlackBoxApp.use((request, _response, next) => onRequest(request, _response, next));
    BlackBoxApp.get('/_ping', ping);
    BlackBoxApp.get('/healthcheck', healthCheck);
    BlackBoxApp.use(onErrorRequest);
    function onErrorRequest(error, _request, response, _next) {
        BlackBoxApp.emit('errorLog', error, 'REQUEST');
        if (error instanceof URIError) {
            return response.status(400).send('oops ...');
        }
        if (error instanceof HttpUnauthorizedException) {
            return response.status(401).send(error.message);
        }
        return response
            .status(500)
            .send(error.message);
    }
    function onRequest(request, _response, next) {
        const clientInfo = new ClientInfo(request);
        request.ClientInfo = clientInfo.toObject();
        BlackBoxApp.emit('eventLog', "CLIENT_REQUEST", clientInfo.toString());
        next();
    }
    function ping(_request, response, _next) {
        return response.status(200).send('OK');
    }
    function healthCheck(_request, response, _next) {
        if ((getConfig().USE_RABBIT && !StatusAppConnect.connectedRabbit) ||
            !StatusAppConnect.connectedDB) {
            return response
                .status(404)
                .send(JSON.stringify(StatusAppConnect));
        }
        return response.status(200).send('OK');
    }
    return BlackBoxApp;
}
export function NotFound(_request, response, _next) {
    return response.status(404).send('Ресурс не найден');
}
export function onErrorAfterResponse(error, _request, _response, _next) {
    if (error instanceof SyntaxError)
        BlackBoxApp.emit('errorLog', error, 'CONTROLLER');
}
export default {
    createApp,
    NotFound,
    onErrorAfterResponse,
};
//# sourceMappingURL=index.js.map