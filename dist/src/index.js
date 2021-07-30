"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwtForResponse = exports.checkTokenBearer = exports.checkAccessIp = exports.BlackBoxGetConfig = exports.onErrorRequest = exports.BlackBoxBaseServiceModel = exports.BlackBoxHttpUnauthorizedException = exports.BlackBoxHttpInternalServerException = exports.BlackBoxHttpTooManyRequests = exports.BlackBoxHttpValidationException = exports.BlackBoxBaseController = exports.BlackBoxRouter = exports.onErrorAfterResponse = exports.notFound = exports.createApp = exports.BlackBoxApp = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const emitters_1 = require("./emitters");
const log_colors_1 = require("./utils/log-colors");
const httpErrors_1 = require("./dataClasses/httpErrors");
const clientInfo_1 = __importDefault(require("./dataClasses/clientInfo"));
const statusAppConnect_1 = __importDefault(require("./dataClasses/statusAppConnect"));
const utils_1 = require("./utils");
const server_1 = require("./server");
const http_1 = __importDefault(require("http"));
const baseController_1 = __importDefault(require("./controllers/baseController"));
const baseServiceModel_1 = __importDefault(require("./services/baseServiceModel"));
const decorators_1 = require("./decorators");
exports.BlackBoxApp = express_1.default();
function createApp(env) {
    exports.BlackBoxApp.use(compression_1.default());
    const urlencodedParser = body_parser_1.default.urlencoded({
        limit: '50mb',
        extended: false,
        parameterLimit: 50000,
    });
    const jsonParser = body_parser_1.default.json({ limit: '50mb' });
    exports.BlackBoxApp.use(urlencodedParser);
    exports.BlackBoxApp.use(jsonParser);
    exports.BlackBoxApp.addListener('eventLog', emitters_1.eventLog);
    exports.BlackBoxApp.addListener('errorLog', emitters_1.errorLog);
    exports.BlackBoxApp.addListener('errorPromiseLog', emitters_1.errorPromiseLog);
    process.on('uncaughtException', (error) => {
        exports.BlackBoxApp.emit('errorLog', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        if (reason instanceof httpErrors_1.HttpInternalServerException) {
            reason.response.send(reason.message);
        }
        else if (reason instanceof httpErrors_1.HttpValidationException) {
            reason.response.send(reason.message);
        }
        exports.BlackBoxApp.emit('errorPromiseLog', reason, promise);
    });
    const exits = ['exit', 'SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'];
    exits.forEach((event) => {
        process.on(event, (code) => {
            console.log(log_colors_1.warnMsg(`⚡️[event ${"SERVER_IS_STOPPED"}]: ${new Date()} - server остановлен по коду ${code}`));
            process.exit(0);
        });
    });
    exports.BlackBoxApp.use(onRequest);
    exports.BlackBoxApp.use(setHeader);
    exports.BlackBoxApp.get('/_ping', ping);
    exports.BlackBoxApp.get('/healthcheck', healthCheck);
    exports.BlackBoxApp.use(onErrorRequest);
    const server = http_1.default.createServer(exports.BlackBoxApp);
    server_1.serverStart(server, env);
    return exports.BlackBoxApp;
}
exports.createApp = createApp;
function notFound(_request, response, _next) {
    return response.status(404).send('Ресурс не найден');
}
exports.notFound = notFound;
function onErrorAfterResponse(error, _request, _response, _next) {
    if (error instanceof SyntaxError)
        exports.BlackBoxApp.emit('errorLog', error, "CONTROLLER");
}
exports.onErrorAfterResponse = onErrorAfterResponse;
function BlackBoxRouter() {
    return express_1.default.Router();
}
exports.BlackBoxRouter = BlackBoxRouter;
function BlackBoxBaseController() {
    return baseController_1.default;
}
exports.BlackBoxBaseController = BlackBoxBaseController;
function BlackBoxHttpValidationException() {
    return httpErrors_1.HttpValidationException;
}
exports.BlackBoxHttpValidationException = BlackBoxHttpValidationException;
function BlackBoxHttpTooManyRequests() {
    return httpErrors_1.HttpTooManyRequests;
}
exports.BlackBoxHttpTooManyRequests = BlackBoxHttpTooManyRequests;
function BlackBoxHttpInternalServerException() {
    return httpErrors_1.HttpInternalServerException;
}
exports.BlackBoxHttpInternalServerException = BlackBoxHttpInternalServerException;
function BlackBoxHttpUnauthorizedException() {
    return httpErrors_1.HttpUnauthorizedException;
}
exports.BlackBoxHttpUnauthorizedException = BlackBoxHttpUnauthorizedException;
function BlackBoxBaseServiceModel() {
    return baseServiceModel_1.default;
}
exports.BlackBoxBaseServiceModel = BlackBoxBaseServiceModel;
function onErrorRequest(error, _request, response, _next) {
    exports.BlackBoxApp.emit('errorLog', error, "REQUEST");
    if (error instanceof URIError) {
        return response.status(400).send('oops ...');
    }
    if (error instanceof httpErrors_1.HttpUnauthorizedException) {
        return response.send(error.message);
    }
    if (error instanceof httpErrors_1.HttpValidationException) {
        return response.send(error.message);
    }
    if (error instanceof httpErrors_1.HttpTooManyRequests) {
        return response.send(error.message);
    }
    if (error instanceof httpErrors_1.HttpUnauthorizedException) {
        return response.send(error.message);
    }
    return response.status(500).send(error.message);
}
exports.onErrorRequest = onErrorRequest;
function BlackBoxGetConfig() {
    return utils_1.getConfig();
}
exports.BlackBoxGetConfig = BlackBoxGetConfig;
function onRequest(request, _response, next) {
    const clientInfo = new clientInfo_1.default(request);
    request.ClientInfo = clientInfo.toObject();
    exports.BlackBoxApp.emit('eventLog', "CLIENT_REQUEST", clientInfo.toString());
    next();
}
function ping(_request, response, _next) {
    return response.status(200).send('OK');
}
function healthCheck(_request, response, _next) {
    if ((utils_1.getConfig().USE_RABBIT && !statusAppConnect_1.default.connectedRabbit) ||
        !statusAppConnect_1.default.connectedDB) {
        return response
            .status(404)
            .send(JSON.stringify(statusAppConnect_1.default));
    }
    return response.status(200).send('OK');
}
function setHeader(_request, response, next) {
    const headers = utils_1.getConfig().HEADERS;
    if (headers && Array.isArray(headers)) {
        headers.forEach((head) => {
            response.setHeader(head === null || head === void 0 ? void 0 : head.key, head === null || head === void 0 ? void 0 : head.value);
        });
    }
    next();
}
exports.checkAccessIp = decorators_1.checkAccessIP;
exports.checkTokenBearer = decorators_1.checkBearerToken;
exports.decodeJwtForResponse = utils_1.decodeJWTforResponse;
