import { Express, NextFunction, Request, Response, Router } from 'express'

export interface BlackBoxApp extends Express {}

/**
 * Перечисление событий сервера
 */
export const enum BlackBoxEventName {
    CLIENT_REQUEST = 'CLIENT_REQUEST',
    SERVER_IS_RUNNING = 'SERVER_IS_RUNNING',
    SERVER_IS_STOPPED = 'SERVER_IS_STOPPED',
    DB_IS_CONNECTED = 'DB_IS_CONNECTED',
    AMQP_IS_RECONNECTING = 'AMQP_IS_RECONNECTING',
    AMQP_IS_CONNECTED = 'AMQP_IS_CONNECTED',
    AMQP_CHANNEL_IS_CLOSED = 'AMQP_CHANNEL_IS_CLOSED',
    AMQP_WORKER_IS_STARTED = 'AMQP_WORKER_IS_STARTED',
}

// == Сущности

/**
 * Базовый контроллер
 */
export class BlackBoxBaseController {
    request: Request
    response: Response
    next: NextFunction | null

    constructor(
        request: TBlackBoxRequest,
        response: TBlackBoxResponse,
        next?: TBlackBoxNextFunction
    )

    /**
     * Обрабатываем запрос к БД и выводим ответ
     * @param promise   - запрос к БД
     */
    prepareQueryAndSendResponse: (promise: Query<any[], any, {}>) => void

    /**
     * Отправка данных на фронт
     * @param result    - данные для отправки
     * @param code      - код ответа из TStatusCode
     */
    render: (result: any, code: StatusCode) => void
}

/**
 * Базовый класс для ошибок
 */
class HttpErrors extends Error {
    constructor(name: string)
}

/**
 * Класс ошибки валидации
 */
export class HttpValidationErrorException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response)
}


/**
 * Роутер
 * @constructor
 */
export function BlackBoxRouter(): Router

/**
 * Базовый контроллер
 * @constructor
 */
export function BlackBoxBaseController(): typeof BlackBoxBaseController

/**
 * Класс ошибок валидации
 * @constructor
 */
export function BlackBoxHttpValidationErrorException(): typeof HttpValidationErrorException

// == Функции

/**
 * Основная функция для создания приложения
 * @param env
 */
export function createApp(env: {
    BASE_PATH?: string
    NODE_ENV?: string
}): BlackBoxApp

/**
 * Типы аргументов для функций запросов
 */
export type TBlackBoxRequest = Request
export type TBlackBoxResponse = Response
export type TBlackBoxNextFunction = NextFunction

// == Обработка запросов

/**
 * Страница 404
 * @param _request
 * @param response
 * @param _next
 */
export function notFound(
    _request: TBlackBoxRequest,
    response: TBlackBoxResponse,
    _next: TBlackBoxNextFunction
): Response<any, Record<string, any>>

/**
 * Обработчик ошибок в запросах
 * @param error
 * @param _request
 * @param _response
 * @param _next
 */
export function onErrorAfterResponse(
    error: Error,
    _request: TBlackBoxRequest,
    _response: TBlackBoxResponse,
    _next: NextFuncTBlackBoxNextFunctiontion
): void
