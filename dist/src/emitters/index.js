"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorPromiseLog = exports.errorLog = exports.eventLog = void 0;
const log_colors_1 = require("../utils/log-colors");
function eventLog(eventName, description) {
    const date = new Date();
    console.log(log_colors_1.noticeMsg(`⚡️[event ${eventName}]: ${date} - ${description}`));
}
exports.eventLog = eventLog;
function errorLog(error, reasonError) {
    const date = new Date();
    console.error(log_colors_1.errorMsg(`⚡️[error ${reasonError}]: ${date} - name: ${error === null || error === void 0 ? void 0 : error.name}, message: ${error === null || error === void 0 ? void 0 : error.message}, stack: `, error === null || error === void 0 ? void 0 : error.stack));
}
exports.errorLog = errorLog;
function errorPromiseLog(reason, promise) {
    const date = new Date();
    console.error(log_colors_1.errorMsg(`⚡️[error promise]: ${date} - reason: ${reason}, promise: `, promise));
}
exports.errorPromiseLog = errorPromiseLog;
