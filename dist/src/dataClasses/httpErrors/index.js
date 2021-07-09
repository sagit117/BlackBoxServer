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
    constructor(message, response) {
        super('HttpUnauthorizedException');
        this.message = message;
        this.response = response;
        this.response.status(401);
    }
}
exports.HttpUnauthorizedException = HttpUnauthorizedException;
class HttpInternalServerException extends HttpErrors {
    constructor(message, response) {
        super('HttpInternalServerException');
        this.message = message;
        this.response = response;
        this.response.status(500);
    }
}
exports.HttpInternalServerException = HttpInternalServerException;
class HttpValidationException extends HttpErrors {
    constructor(message, response) {
        super('HttpValidationException');
        this.message = message;
        this.response = response;
        this.response.status(400);
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
