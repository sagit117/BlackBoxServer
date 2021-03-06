"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../../dataClasses/httpErrors");
const index_1 = require("../../index");
class BaseController {
    constructor(request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next || null;
    }
    prepareQueryAndSendResponse(promise) {
        promise
            .then((result) => {
            this.render(result, 200);
        })
            .catch((error) => {
            index_1.BlackBoxApp.emit('errorLog', error, "REQUEST");
            if (error.name === 'ValidationError') {
                throw new httpErrors_1.HttpValidationException('Данные не проходят проверку', this.response);
            }
            if (error.name === 'HttpValidationException') {
                throw error;
            }
            throw new httpErrors_1.HttpInternalServerException('Произошла внутренняя ошибка сервера', this.response);
        });
    }
    render(result, code) {
        this.response.status(code).send(result);
    }
}
exports.default = BaseController;
