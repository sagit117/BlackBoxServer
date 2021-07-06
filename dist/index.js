/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/connectors/mongoDB.ts":
/*!***********************************!*\
  !*** ./src/connectors/mongoDB.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connectDB\": () => (/* binding */ connectDB)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dataClasses/statusAppConnect */ \"./src/dataClasses/statusAppConnect/index.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ \"./src/utils/index.ts\");\n\n\n\nfunction connectDB(App) {\n    return mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(`mongodb://${(0,_utils__WEBPACK_IMPORTED_MODULE_2__.getConfig)().DB_HOST}:${(0,_utils__WEBPACK_IMPORTED_MODULE_2__.getConfig)().DB_PORT}${(0,_utils__WEBPACK_IMPORTED_MODULE_2__.getConfig)().DB_STRING_OPTIONS}`, {\n        useUnifiedTopology: true,\n        useNewUrlParser: true,\n        useCreateIndex: true,\n        dbName: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getConfig)().DB_NAME,\n        user: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getConfig)().DB_USER,\n        pass: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getConfig)().DB_PASSWORD,\n    })\n        .then(() => {\n        App.emit('eventLog', \"DB_IS_CONNECTED\", `Подключение к БД прошло успешно`);\n        _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_1__.default.connectedDB = true;\n    })\n        .catch((error) => {\n        _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_1__.default.connectedDB = false;\n        return Promise.reject(error);\n    });\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/connectors/mongoDB.ts?");

/***/ }),

/***/ "./src/connectors/rabbitMQ.ts":
/*!************************************!*\
  !*** ./src/connectors/rabbitMQ.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"conn\": () => (/* binding */ conn),\n/* harmony export */   \"connectRabbitMQ\": () => (/* binding */ connectRabbitMQ),\n/* harmony export */   \"sendingMsg\": () => (/* binding */ sendingMsg)\n/* harmony export */ });\n/* harmony import */ var amqplib_callback_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! amqplib/callback_api */ \"amqplib/callback_api\");\n/* harmony import */ var amqplib_callback_api__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(amqplib_callback_api__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ \"./src/utils/index.ts\");\n/* harmony import */ var _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dataClasses/statusAppConnect */ \"./src/dataClasses/statusAppConnect/index.ts\");\n\n\n\nlet conn = null;\nconst url = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_URL || '';\nconst queueName = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_RECEIVE_QUEUE_NAME || '';\nconst channelOptions = {\n    durable: false,\n    autoDelete: true,\n};\nconst exchange = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_SEND_EXCHANGE || '';\nconst channelSendOptions = {\n    durable: true,\n};\nfunction connectRabbitMQ(App) {\n    amqplib_callback_api__WEBPACK_IMPORTED_MODULE_0___default().connect(url, function (error, connection) {\n        if (error) {\n            conn = null;\n            App.emit('errorLog', error, 'AMQP');\n            _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_2__.default.connectedRabbit = false;\n            setTimeout(connectRabbitMQ.bind(null, App), 1000);\n        }\n        connection.on('error', function (err) {\n            conn = null;\n            if (err.message !== 'Connection closing') {\n                App.emit('errorLog', error, 'AMQP');\n            }\n            _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_2__.default.connectedRabbit = false;\n            setTimeout(connectRabbitMQ.bind(null, App), 1000);\n        });\n        connection.on('close', function () {\n            conn = null;\n            App.emit('eventLog', \"AMQP_IS_RECONNECTING\", 'amqp reconnecting');\n            _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_2__.default.connectedRabbit = false;\n            setTimeout(connectRabbitMQ.bind(null, App), 1000);\n        });\n        App.emit('eventLog', \"AMQP_IS_CONNECTED\", 'amqp connected');\n        conn = connection;\n        _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_2__.default.connectedRabbit = true;\n        receiveMsg(App);\n    });\n}\nfunction receiveMsg(App) {\n    if (!conn)\n        return;\n    conn.createChannel(function (error, ch) {\n        if (closeOnErr(error, App))\n            return;\n        ch.on('error', function (error) {\n            App.emit('errorLog', error, 'AMQP_CHANNEL');\n        });\n        ch.on('close', function () {\n            App.emit('eventLog', \"AMQP_CHANNEL_IS_CLOSED\", 'amqp канал получения закрыт');\n        });\n        ch.prefetch(10);\n        ch.assertQueue(queueName, channelOptions, function (err, _ok) {\n            if (closeOnErr(err, App))\n                return;\n            ch.consume(queueName, processMsg, { noAck: false });\n            App.emit('eventLog', \"AMQP_WORKER_IS_STARTED\", 'amqp worker запущен');\n            function processMsg(msg) {\n                work(msg, function (ok) {\n                    try {\n                        if (ok)\n                            ch.ack(msg);\n                        else\n                            ch.reject(msg, true);\n                    }\n                    catch (e) {\n                        closeOnErr(e, App);\n                    }\n                });\n            }\n        });\n        ch.bindQueue(queueName, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_RECEIVE_EXCHANGE || '', (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_RECEIVE_ROUTING_KEY || '', {\n            'x-message-ttl': Number((0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_RECEIVE_BIND_XMTTL) || 600000,\n        });\n    });\n    function work(msg, cb) {\n        App.emit('getMessageRabbit', msg);\n        cb(true);\n    }\n}\nfunction sendingMsg(App, msg, doc) {\n    if (!conn)\n        return;\n    conn.createChannel(function (error, ch) {\n        if (closeOnErr(error, App))\n            return;\n        if (!ch)\n            return;\n        ch.on('error', function (error) {\n            App.emit('errorLog', error, 'AMQP_CHANNEL');\n        });\n        ch.on('close', function () {\n            App.emit('eventLog', \"AMQP_CHANNEL_IS_CLOSED\", 'amqp канал отправки закрыт');\n        });\n        ch.assertExchange(exchange, 'fanout', channelSendOptions);\n        const sendingIsSuccess = ch.publish(exchange, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().RABBITMQ_SEND_ROUTING_KEY || '', Buffer.from(msg));\n        if (sendingIsSuccess) {\n            doc.updateOne({ sending: true }).exec();\n        }\n    });\n}\nfunction closeOnErr(error, App) {\n    if (!error || !conn)\n        return false;\n    App.emit('errorLog', error, 'AMQP');\n    conn.close();\n    return true;\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/connectors/rabbitMQ.ts?");

/***/ }),

/***/ "./src/connectors/webSocket.ts":
/*!*************************************!*\
  !*** ./src/connectors/webSocket.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"webSocketServer\": () => (/* binding */ webSocketServer),\n/* harmony export */   \"createWebSocket\": () => (/* binding */ createWebSocket)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ \"./src/index.ts\");\n\n\nlet webSocketServer = null;\nfunction createWebSocket(options) {\n    webSocketServer = new (ws__WEBPACK_IMPORTED_MODULE_0___default().Server)(options);\n    webSocketServer.on('connection', (ws) => {\n        ws.on('message', (m) => {\n            _index__WEBPACK_IMPORTED_MODULE_1__.BlackBoxApp.emit('getMessageFromWS', ws, m);\n        });\n        ws.on('error', (e) => {\n            _index__WEBPACK_IMPORTED_MODULE_1__.BlackBoxApp.emit('errorLog', e, 'SOCKET');\n            ws.send(e);\n        });\n        _index__WEBPACK_IMPORTED_MODULE_1__.BlackBoxApp.emit('wsConnecting', ws);\n    });\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/connectors/webSocket.ts?");

/***/ }),

/***/ "./src/dataClasses/clientInfo/index.ts":
/*!*********************************************!*\
  !*** ./src/dataClasses/clientInfo/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ClientInfo)\n/* harmony export */ });\nclass ClientInfo {\n    constructor(request) {\n        this.connectDate = new Date();\n        this.requestUrl = '';\n        this.requestMethod = '';\n        this.requestCookies = '';\n        this.requestSignedCookies = '';\n        this.requestIP = '';\n        this.body = {};\n        this.queryParams = {};\n        this.requestUrl = request.url || '';\n        this.requestMethod = request.method || '';\n        this.requestCookies = request.cookies || '';\n        this.requestSignedCookies = request.signedCookies || '';\n        this.requestIP = request.ip || '';\n        this.body = request.body || {};\n        this.queryParams = request.query || {};\n    }\n    toObject() {\n        return {\n            connectDate: this.connectDate,\n            requestUrl: this.requestUrl,\n            requestMethod: this.requestMethod,\n            requestCookies: this.requestCookies,\n            requestSignedCookies: this.requestSignedCookies,\n            requestIP: this.requestIP,\n            body: this.body,\n            queryParams: this.queryParams,\n        };\n    }\n    toString() {\n        return JSON.stringify(this.toObject());\n    }\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/dataClasses/clientInfo/index.ts?");

/***/ }),

/***/ "./src/dataClasses/httpErrors/index.ts":
/*!*********************************************!*\
  !*** ./src/dataClasses/httpErrors/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"HttpUnauthorizedException\": () => (/* binding */ HttpUnauthorizedException),\n/* harmony export */   \"HttpInternalServerException\": () => (/* binding */ HttpInternalServerException),\n/* harmony export */   \"HttpValidationErrorException\": () => (/* binding */ HttpValidationErrorException)\n/* harmony export */ });\nclass HttpErrors extends Error {\n    constructor(name) {\n        super();\n        this.name = name;\n    }\n}\nclass HttpUnauthorizedException extends HttpErrors {\n    constructor(message) {\n        super('HttpUnauthorizedException');\n        this.message = message;\n    }\n}\nclass HttpInternalServerException extends HttpErrors {\n    constructor(message, response) {\n        super('HttpInternalServerException');\n        this.message = message;\n        this.response = response;\n    }\n}\nclass HttpValidationErrorException extends HttpErrors {\n    constructor(message, response) {\n        super('HttpValidationErrorException');\n        this.message = message;\n        this.response = response;\n    }\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/dataClasses/httpErrors/index.ts?");

/***/ }),

/***/ "./src/dataClasses/statusAppConnect/index.ts":
/*!***************************************************!*\
  !*** ./src/dataClasses/statusAppConnect/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass StatusAppInfo {\n    constructor() {\n        this.DB_IS_CONNECTED = false;\n        this.RABBIT_IS_CONNECTED = false;\n    }\n    set connectedDB(isConnected) {\n        this.DB_IS_CONNECTED = isConnected;\n    }\n    set connectedRabbit(isConnected) {\n        this.RABBIT_IS_CONNECTED = isConnected;\n    }\n    get connectedDB() {\n        return this.DB_IS_CONNECTED;\n    }\n    get connectedRabbit() {\n        return this.RABBIT_IS_CONNECTED;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new StatusAppInfo());\n\n\n//# sourceURL=webpack://blackbox_server/./src/dataClasses/statusAppConnect/index.ts?");

/***/ }),

/***/ "./src/emitters/index.ts":
/*!*******************************!*\
  !*** ./src/emitters/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"eventLog\": () => (/* binding */ eventLog),\n/* harmony export */   \"errorLog\": () => (/* binding */ errorLog),\n/* harmony export */   \"errorPromiseLog\": () => (/* binding */ errorPromiseLog)\n/* harmony export */ });\n/* harmony import */ var _utils_log_colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/log-colors */ \"./src/utils/log-colors.ts\");\n\nfunction eventLog(eventName, description) {\n    const date = new Date();\n    console.log((0,_utils_log_colors__WEBPACK_IMPORTED_MODULE_0__.noticeMsg)(`⚡️[event ${eventName}]: ${date} - ${description}`));\n}\nfunction errorLog(error, reasonError) {\n    const date = new Date();\n    console.error((0,_utils_log_colors__WEBPACK_IMPORTED_MODULE_0__.errorMsg)(`⚡️[error ${reasonError}]: ${date} - name: ${error === null || error === void 0 ? void 0 : error.name}, message: ${error === null || error === void 0 ? void 0 : error.message}, stack: `, error === null || error === void 0 ? void 0 : error.stack));\n}\nfunction errorPromiseLog(reason, promise) {\n    const date = new Date();\n    console.error((0,_utils_log_colors__WEBPACK_IMPORTED_MODULE_0__.errorMsg)(`⚡️[error promise]: ${date} - reason: ${reason}, promise: `, promise));\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/emitters/index.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BlackBoxApp\": () => (/* binding */ BlackBoxApp),\n/* harmony export */   \"createApp\": () => (/* binding */ createApp),\n/* harmony export */   \"NotFound\": () => (/* binding */ NotFound),\n/* harmony export */   \"onErrorAfterResponse\": () => (/* binding */ onErrorAfterResponse)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! compression */ \"compression\");\n/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _emitters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./emitters */ \"./src/emitters/index.ts\");\n/* harmony import */ var _utils_log_colors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/log-colors */ \"./src/utils/log-colors.ts\");\n/* harmony import */ var _dataClasses_httpErrors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dataClasses/httpErrors */ \"./src/dataClasses/httpErrors/index.ts\");\n/* harmony import */ var _dataClasses_clientInfo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dataClasses/clientInfo */ \"./src/dataClasses/clientInfo/index.ts\");\n/* harmony import */ var _dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dataClasses/statusAppConnect */ \"./src/dataClasses/statusAppConnect/index.ts\");\n\n\n\n\n\n\n\n\nconst BlackBoxApp = express__WEBPACK_IMPORTED_MODULE_0___default()();\nfunction createApp() {\n    BlackBoxApp.use(compression__WEBPACK_IMPORTED_MODULE_1___default()());\n    const urlencodedParser = body_parser__WEBPACK_IMPORTED_MODULE_2___default().urlencoded({\n        limit: '50mb',\n        extended: false,\n        parameterLimit: 50000,\n    });\n    const jsonParser = body_parser__WEBPACK_IMPORTED_MODULE_2___default().json({ limit: '50mb' });\n    BlackBoxApp.use(urlencodedParser);\n    BlackBoxApp.use(jsonParser);\n    BlackBoxApp.addListener('eventLog', _emitters__WEBPACK_IMPORTED_MODULE_3__.eventLog);\n    BlackBoxApp.addListener('errorLog', _emitters__WEBPACK_IMPORTED_MODULE_3__.errorLog);\n    BlackBoxApp.addListener('errorPromiseLog', _emitters__WEBPACK_IMPORTED_MODULE_3__.errorPromiseLog);\n    process.on('uncaughtException', (error) => {\n        BlackBoxApp.emit('errorLog', error);\n        process.exit(1);\n    });\n    process.on('unhandledRejection', (reason, promise) => {\n        if (reason instanceof _dataClasses_httpErrors__WEBPACK_IMPORTED_MODULE_5__.HttpInternalServerException) {\n            reason.response\n                .status(500)\n                .send(reason.message);\n        }\n        else if (reason instanceof _dataClasses_httpErrors__WEBPACK_IMPORTED_MODULE_5__.HttpValidationErrorException) {\n            reason.response.status(400).send(reason.message);\n        }\n        BlackBoxApp.emit('errorPromiseLog', reason, promise);\n    });\n    const exits = ['exit', 'SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'];\n    exits.forEach((event) => {\n        process.on(event, (code) => {\n            console.log((0,_utils_log_colors__WEBPACK_IMPORTED_MODULE_4__.warnMsg)(`⚡️[event ${\"SERVER_IS_STOPPED\"}]: ${new Date()} - server остановлен по коду ${code}`));\n            process.exit(0);\n        });\n    });\n    BlackBoxApp.use(onRequest);\n    BlackBoxApp.get('/_ping', ping);\n    BlackBoxApp.get('/healthcheck', healthCheck);\n    BlackBoxApp.use(onErrorRequest);\n    function onErrorRequest(error, _request, response, _next) {\n        BlackBoxApp.emit('errorLog', error, 'REQUEST');\n        if (error instanceof URIError) {\n            return response.status(400).send('oops ...');\n        }\n        if (error instanceof _dataClasses_httpErrors__WEBPACK_IMPORTED_MODULE_5__.HttpUnauthorizedException) {\n            return response.status(401).send(error.message);\n        }\n        return response\n            .status(500)\n            .send(error.message);\n    }\n    function onRequest(request, _response, next) {\n        const clientInfo = new _dataClasses_clientInfo__WEBPACK_IMPORTED_MODULE_6__.default(request);\n        request.ClientInfo = clientInfo.toObject();\n        BlackBoxApp.emit('eventLog', \"CLIENT_REQUEST\", clientInfo.toString());\n        next();\n    }\n    function ping(_request, response, _next) {\n        return response.status(200).send('OK');\n    }\n    function healthCheck(_request, response, _next) {\n        if (!_dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_7__.default.connectedDB) {\n            return response\n                .status(404)\n                .send(JSON.stringify(_dataClasses_statusAppConnect__WEBPACK_IMPORTED_MODULE_7__.default));\n        }\n        return response.status(200).send('OK');\n    }\n    return BlackBoxApp;\n}\nfunction NotFound(_request, response, _next) {\n    return response.status(404).send('Ресурс не найден');\n}\nfunction onErrorAfterResponse(error, _request, _response, _next) {\n    if (error instanceof SyntaxError)\n        BlackBoxApp.emit('errorLog', error, 'CONTROLLER');\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/index.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ \"./src/index.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils/index.ts\");\n/* harmony import */ var _utils_log_colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/log-colors */ \"./src/utils/log-colors.ts\");\n/* harmony import */ var _connectors_mongoDB__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connectors/mongoDB */ \"./src/connectors/mongoDB.ts\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _connectors_webSocket__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./connectors/webSocket */ \"./src/connectors/webSocket.ts\");\n/* harmony import */ var _connectors_rabbitMQ__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./connectors/rabbitMQ */ \"./src/connectors/rabbitMQ.ts\");\n\n\n\n\n\n\n\nconst server = http__WEBPACK_IMPORTED_MODULE_4___default().createServer(_index__WEBPACK_IMPORTED_MODULE_0__.BlackBoxApp);\n(0,_connectors_webSocket__WEBPACK_IMPORTED_MODULE_5__.createWebSocket)({ server, path: process.env.BASE_PATH || '' });\nserver\n    .listen((0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().PORT, () => {\n    (0,_connectors_mongoDB__WEBPACK_IMPORTED_MODULE_3__.connectDB)(_index__WEBPACK_IMPORTED_MODULE_0__.BlackBoxApp)\n        .then(() => {\n        _index__WEBPACK_IMPORTED_MODULE_0__.BlackBoxApp.emit('eventLog', \"SERVER_IS_RUNNING\", `port: ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().PORT}, mode: ${\"development\"}`);\n        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)().USE_RABBIT && (0,_connectors_rabbitMQ__WEBPACK_IMPORTED_MODULE_6__.connectRabbitMQ)(_index__WEBPACK_IMPORTED_MODULE_0__.BlackBoxApp);\n    })\n        .catch((error) => {\n        console.error((0,_utils_log_colors__WEBPACK_IMPORTED_MODULE_2__.errorMsg)(`⚡️[error DB]: ${new Date()} - name: ${error.name}, message: ${error.message}, stack: `, error.stack));\n        process.exit(2);\n    });\n})\n    .on('error', (error) => {\n    console.error((0,_utils_log_colors__WEBPACK_IMPORTED_MODULE_2__.errorMsg)(`⚡️[error server]: ${new Date()} - name: ${error.name}, message: ${error.message}, stack: `, error.stack));\n    process.exit(2);\n});\n\n\n//# sourceURL=webpack://blackbox_server/./src/server.ts?");

/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getConfig\": () => (/* binding */ getConfig)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction getConfig() {\n    try {\n        return JSON.parse(fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync('./configApp.json', 'utf8'));\n    }\n    catch (e) {\n        throw new Error(e);\n    }\n}\n\n\n//# sourceURL=webpack://blackbox_server/./src/utils/index.ts?");

/***/ }),

/***/ "./src/utils/log-colors.ts":
/*!*********************************!*\
  !*** ./src/utils/log-colors.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"errorMsg\": () => (/* binding */ errorMsg),\n/* harmony export */   \"warnMsg\": () => (/* binding */ warnMsg),\n/* harmony export */   \"noticeMsg\": () => (/* binding */ noticeMsg)\n/* harmony export */ });\n/* harmony import */ var cli_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cli-color */ \"cli-color\");\n/* harmony import */ var cli_color__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cli_color__WEBPACK_IMPORTED_MODULE_0__);\n\nconst errorMsg = (cli_color__WEBPACK_IMPORTED_MODULE_0___default().red.bold);\nconst warnMsg = (cli_color__WEBPACK_IMPORTED_MODULE_0___default().yellow);\nconst noticeMsg = (cli_color__WEBPACK_IMPORTED_MODULE_0___default().blue);\n\n\n//# sourceURL=webpack://blackbox_server/./src/utils/log-colors.ts?");

/***/ }),

/***/ "amqplib/callback_api":
/*!***************************************!*\
  !*** external "amqplib/callback_api" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("amqplib/callback_api");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "cli-color":
/*!****************************!*\
  !*** external "cli-color" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("cli-color");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("ws");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.ts");
/******/ 	
/******/ })()
;