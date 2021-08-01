import { Express, NextFunction, Request, Response, Router } from 'express'
import { Model, Query, UpdateWriteOpResult } from 'mongoose'
import { checkAccessIP } from './decorators'
import { StatusCode } from './controllers/baseController/base-controller'
import { HttpUnauthorizedException } from './dataClasses/httpErrors'
import { IObjectJWT } from './utils/utils'

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

/**
 * Перечисления кодов ответа сервера
 */
export const enum BlackBoxStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
}

/**
 * Перечисления причин ошибок
 */
export const enum BlackBoxReasonError {
    REQUEST = 'REQUEST',
    AMQP = 'AMQP',
    AMQP_CHANNEL = 'AMQP_CHANNEL',
    SOCKET = 'SOCKET',
    CONTROLLER = 'CONTROLLER',
    JWT = 'JWT',
}

// ==== Сущности ====

/**
 * Базовый контроллер
 */
class BlackBoxBaseController {
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
    prepareQueryAndSendResponse(promise: Query<any[], any, {}>): void
    prepareQueryAndSendResponse<T>(
        promise: Query<UpdateWriteOpResult, T, {}, any>
    ): void

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
class HttpValidationException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response)
}

/**
 * Слишком много запросов
 */
class HttpTooManyRequests extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response)
}

/**
 * Веутреня ошибка сервера
 */
class HttpInternalServerException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response)
}

/**
 * Базовый класс для сервиса
 */
class BaseServiceModel {
    readonly Model: Model<any>

    constructor(model: Model<any>)

    /**
     * Найти все записи модели
     */
    findAll<T>(): Query<T[], any, {}>

    /**
     * Поиск записей по одному полю
     * @param fieldName - название поля
     * @param value     - значение поля
     */
    findByOneField<T>(
        fieldName: string,
        value: string | number | null | boolean
    ): Query<T[], any, {}>

    /**
     * Поиск последней записи по полю
     * @param fieldName - название поля
     * @param value     - значение поля
     */
    findLastByOneField<T>(
        fieldName: string,
        value: string | number | null | boolean
    ): Query<T, any, {}, any>

    /**
     * Найти последнюю запись
     */
    findLast<T>(limit: number = 1): Query<T[], any, {}>

    /**
     * Создание записи
     * @param data  - данные записи
     */
    create<T>(data: T)

    /**
     * Создание или обновление записи
     * @param data - данные записи
     */
    createOrUpdateById<T extends { _id: string }>(
        data: T
    ): Query<UpdateWriteOpResult, T, {}, any>

    /**
     * Обновить одну запись по фильтру
     * @param filter
     * @param data
     */
    updateOneByFilter<T>(
        filter: object,
        data: T
    ): Query<UpdateWriteOpResult, T, {}, any>
    updateOneByFilter<T>(
        filter: object,
        data: object
    ): Query<UpdateWriteOpResult, T, {}, any>

    /**
     * Удаление записи
     * @param filter
     */
    remove(filter: object): Query<
        { ok?: number | undefined; n?: number | undefined } & {
            deletedCount?: number | undefined
        },
        any,
        {}
    >
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
export function BlackBoxHttpValidationException(): typeof HttpValidationException

/**
 * Класс ошибок с большим количеством запросов
 * @constructor
 */
export function BlackBoxHttpTooManyRequests(): typeof HttpTooManyRequests

/**
 * Класс внутренних ошибок сервера
 * @constructor
 */
export function BlackBoxHttpInternalServerException(): typeof HttpInternalServerException

/**
 * Класс внутренних ошибок сервера
 * @constructor
 */
export function BlackBoxHttpUnauthorizedException(): typeof HttpUnauthorizedException

/**
 * Базовый сервис
 * @constructor
 */
export function BlackBoxBaseServiceModel(): typeof BaseServiceModel

// ==== Функции ====

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
export interface TBlackBoxRequest extends Request {
    ClientInfo: {
        readonly connectDate: Date
        requestUrl: string
        requestMethod: string
        requestCookies: string
        requestSignedCookies: string
        requestIP: string
        body: object
        queryParams: object
        decodeAccessToken?: IObjectJWT
    }
}
export type TBlackBoxResponse = Response
export type TBlackBoxNextFunction = NextFunction

/**
 * Чтение настроек
 * @constructor
 */
export function BlackBoxGetConfig<T>(): T

// ==== Обработка запросов ====

/**
 * Страница 404
 * @param _request
 * @param response
 * @param _next
 */
export function notFound(
    _request: Request,
    response: Response,
    _next: NextFunction
): Response<any, Record<string, any>>

/**
 * Обработчик ошибок после запроса
 * @param error
 * @param _request
 * @param _response
 * @param _next
 */
export function onErrorAfterResponse(
    error: Error,
    _request: Request,
    _response: Response,
    _next: NextFunction
): void

/**
 * Обработчик ошибок в запросах
 * @param error
 * @param _request
 * @param response
 * @param _next
 */
export function onErrorRequest(
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
): Response<any, Record<string, any>>

/** Декораторы */

/**
 * Декоратор для проверки количества вызовов метода с одного IP
 * @param maxStack - количество запросов
 * @param timeLifeStack - интервал жизни очереди
 * @param messageError  - сообщение об ошибки
 */
export function checkAccessIp(
    maxStack: number,
    timeLifeStack: number,
    messageError?: string
)

/**
 * Аутентификация с помощью Bearer токена
 * @param messageError  - сообщение об ошибки
 * @param secretKey     - строка для расшифровки JWT
 */
export function checkTokenBearer(secretKey: string = '', messageError?: string)

/** utils */

/**
 * Проверка токена авторизации для предоставления ответа клиенту
 * @param token     - токен
 * @param response  - объект ответа
 * @param secret    - строка расшифровки jwt
 */
export function decodeJwtForResponse(
    token: string,
    response: Response,
    secret: string
): IObjectJWT
