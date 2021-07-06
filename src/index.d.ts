import { Express, NextFunction, Request, Response } from 'express'

export interface BlackBoxApp extends Express {}

export class BaseController {
    request: Request
    response: Response
    next: NextFunction | null

    constructor(request: Request, response: Response, next?: NextFunction)

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

export function createApp(env: {
    BASE_PATH?: string
    NODE_ENV?: string
}): BlackBoxApp

export function notFound(
    _request: Request,
    response: Response,
    _next: NextFunction
): BlackBoxApp.Response<any, Record<string, any>>

export function onErrorAfterResponse(
    error: Error,
    _request: Request,
    _response: Response,
    _next: NextFunction
): void

export function BlackBoxRouter(): BlackBoxApp.Router

export function BlackBoxBaseController(): typeof BaseController