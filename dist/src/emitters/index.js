import { noticeMsg, errorMsg } from '../utils/log-colors';
export function eventLog(eventName, description) {
    const date = new Date();
    console.log(noticeMsg(`⚡️[event ${eventName}]: ${date} - ${description}`));
}
export function errorLog(error, reasonError) {
    const date = new Date();
    console.error(errorMsg(`⚡️[error ${reasonError}]: ${date} - name: ${error === null || error === void 0 ? void 0 : error.name}, message: ${error === null || error === void 0 ? void 0 : error.message}, stack: `, error === null || error === void 0 ? void 0 : error.stack));
}
export function errorPromiseLog(reason, promise) {
    const date = new Date();
    console.error(errorMsg(`⚡️[error promise]: ${date} - reason: ${reason}, promise: `, promise));
}
