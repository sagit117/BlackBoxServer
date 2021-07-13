"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccessIP = void 0;
const stackAccessIP_1 = __importDefault(require("../dataClasses/stackAccessIP"));
const httpErrors_1 = require("../dataClasses/httpErrors");
function checkAccessIP(maxStack, timeLifeStack, messageError) {
    return function (_target, _method, descriptor) {
        const originMethod = descriptor.value;
        descriptor.value = function (...args) {
            const request = this.request;
            const response = this.response;
            const stackItem = stackAccessIP_1.default.addStack(request.ClientInfo.requestUrl, request.ClientInfo.requestIP, timeLifeStack);
            if (stackItem.countRequest > maxStack) {
                throw new httpErrors_1.HttpTooManyRequests(messageError ||
                    'Превышено число попыток, попробуйте позже!', response);
            }
            return originMethod.apply(this, args);
        };
    };
}
exports.checkAccessIP = checkAccessIP;
