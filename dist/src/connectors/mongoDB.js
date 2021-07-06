"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const statusAppConnect_1 = __importDefault(require("../dataClasses/statusAppConnect"));
const utils_1 = require("../utils");
function connectDB(App) {
    return mongoose_1.default.connect(`mongodb://${utils_1.getConfig().DB_HOST}:${utils_1.getConfig().DB_PORT}${utils_1.getConfig().DB_STRING_OPTIONS}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        dbName: utils_1.getConfig().DB_NAME,
        user: utils_1.getConfig().DB_USER,
        pass: utils_1.getConfig().DB_PASSWORD,
    })
        .then(() => {
        App.emit('eventLog', "DB_IS_CONNECTED", `Подключение к БД прошло успешно`);
        statusAppConnect_1.default.connectedDB = true;
    })
        .catch((error) => {
        statusAppConnect_1.default.connectedDB = false;
        return Promise.reject(error);
    });
}
exports.connectDB = connectDB;
