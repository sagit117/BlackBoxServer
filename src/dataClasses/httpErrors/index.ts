import { Response } from 'express'
import { StatusCode } from '../../controllers/baseController/base-controller'

/**
 * Базовый класс для ошибок
 */
class HttpErrors extends Error {
    constructor(name: string) {
        super()
        this.name = name
    }
}

/**
 * Ошибка авторизации
 */
export class HttpUnauthorizedException extends HttpErrors {
    constructor(message: string) {
        super('HttpUnauthorizedException')
        this.message = message
    }
}

/**
 * Внутренняя ошибка сервера
 */
export class HttpInternalServerException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response) {
        super('HttpInternalServerException')
        this.message = message
        this.response = response
    }
}

/**
 * Ошибка валидации данных
 */
export class HttpValidationException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response) {
        super('HttpValidationException')
        this.message = message
        this.response = response
    }
}

/**
 * Слишком много запросов
 */
export class HttpTooManyRequests extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response) {
        super('HttpTooManyRequests')
        this.message = message
        this.response = response
        this.response.status(StatusCode.TOO_MANY_REQUESTS)
    }
}
