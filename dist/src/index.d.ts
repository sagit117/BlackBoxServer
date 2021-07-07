import { Express, NextFunction, Request, Response } from 'express'
import { EventName } from './emitters/emitters'

export interface BlackBoxApp extends Express {}

/**
 * Перечисление событий сервера
 */
export const BlackBoxEventName = EventName

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
 * Роутер
 * @constructor
 */
export function BlackBoxRouter(): BlackBoxApp.Router

/**
 * Базовый контроллер
 * @constructor
 */
export function BlackBoxBaseController(): typeof BlackBoxBaseController

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
): BlackBoxApp.Response<any, Record<string, any>>

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
