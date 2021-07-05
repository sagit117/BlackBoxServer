import { Response } from 'express'

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
 * Ошибка валидации данных при сохранение в БД
 */
export class HttpValidationErrorException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response) {
        super('HttpValidationErrorException')
        this.message = message
        this.response = response
    }
}
