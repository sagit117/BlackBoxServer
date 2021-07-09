"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpTooManyRequests = exports.HttpValidationException = exports.HttpInternalServerException = exports.HttpUnauthorizedException = void 0;
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
class HttpValidationException extends HttpErrors {
    constructor(message, response) {
        super('HttpValidationException');
        this.message = message;
        this.response = response;
    }
}
exports.HttpValidationException = HttpValidationException;
class HttpTooManyRequests extends HttpErrors {
    constructor(message, response) {
        super('HttpTooManyRequests');
        this.message = message;
        this.response = response;
        this.response.status(429);
    }
}
exports.HttpTooManyRequests = HttpTooManyRequests;
