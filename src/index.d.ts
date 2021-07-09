import { Express, NextFunction, Request, Response, Router } from 'express'
import { Model, Query, UpdateWriteOpResult } from 'mongoose'
import { checkAccessIP } from './decorators'

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
export const enum BlackBoxReasonErro {
    REQUEST = 'REQUEST',
    AMQP = 'AMQP',
    AMQP_CHANNEL = 'AMQP_CHANNEL',
    SOCKET = 'SOCKET',
    CONTROLLER = 'CONTROLLER',
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
class HttpValidationException extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response)
}

/**
 * Слишком много запросов
 */
export class HttpTooManyRequests extends HttpErrors {
    readonly response: Response

    constructor(message: string, response: Response)
}

/**
 * Базовый класс для сервиса
 */
export default class BaseServiceModel {
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
    createOrUpdateById<T extends { _id: string }>(data: T): Query<UpdateWriteOpResult, T, {}, any>

    /**
     * Обновить одну запись по фильтру
     * @param filter
     * @param data
     */
    updateOneByFilter<T>(filter: object, data: T): Query<UpdateWriteOpResult, T, {}, any>

    /**
     * Удаление записи
     * @param filter
     */
    remove(filter: object): Query<
        { ok?: number | undefined; n?: number | undefined }
        & {
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
 */
export function checkAccessIp(maxStack: number, timeLifeStack: number)

