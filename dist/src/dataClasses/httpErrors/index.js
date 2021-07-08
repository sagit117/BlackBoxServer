"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpValidationErrorException = exports.HttpInternalServerException = exports.HttpUnauthorizedException = void 0;
class HttpErrors extends Error {
    constructor(name) {
        super();
        this.name = name;
    }
}
class HttpUnauthorizedException extends HttpErrors {
    constructor(message) {
        super('HttpUnauthorizedException');
        this.message = message;
    }
}
exports.HttpUnauthorizedException = HttpUnauthorizedException;
class HttpInternalServerException extends HttpErrors {
    constructor(message, response) {
        super('HttpInternalServerException');
        this.message = message;
        this.response = response;
    }
}
exports.HttpInternalServerException = HttpInternalServerException;
class HttpValidationErrorException extends HttpErrors {
    constructor(message, response) {
        super('HttpValidationErrorException');
        this.message = message;
        this.response = response;
    }
}
exports.HttpValidationErrorException = HttpValidationErrorException;
