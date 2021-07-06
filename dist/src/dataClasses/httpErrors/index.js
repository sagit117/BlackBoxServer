class HttpErrors extends Error {
    constructor(name) {
        super();
        this.name = name;
    }
}
export class HttpUnauthorizedException extends HttpErrors {
    constructor(message) {
        super('HttpUnauthorizedException');
        this.message = message;
    }
}
export class HttpInternalServerException extends HttpErrors {
    constructor(message, response) {
        super('HttpInternalServerException');
        this.message = message;
        this.response = response;
    }
}
export class HttpValidationErrorException extends HttpErrors {
    constructor(message, response) {
        super('HttpValidationErrorException');
        this.message = message;
        this.response = response;
    }
}
//# sourceMappingURL=index.js.map