import Express, { NextFunction, Request, Response } from 'express'
import Compression from 'compression'
import BodyParser from 'body-parser'
// import CookieParse from 'cookie-parser'
import { errorLog, errorPromiseLog, eventLog } from './emitters'
import { warnMsg } from './utils/log-colors'
import {
    HttpInternalServerException,
    HttpUnauthorizedException,
    HttpValidationErrorException,
} from './dataClasses/httpErrors'
import { StatusCode } from './controllers/baseController/base-controller'
import { EventName } from './emitters/emitters'
import ClientInfo from './dataClasses/clientInfo'
import StatusAppConnect from './dataClasses/statusAppConnect'
import { getConfig } from './utils'
import { clientRequest } from './server-types'
import { serverStart } from './server'
import http from 'http'

export const BlackBoxApp = Express()
/**
 * Настройка приложения
 */
export function createApp(env: NodeJS.ProcessEnv) {
    /**
     * Сжатие
     */
    BlackBoxApp.use(Compression())

    /**
     * Парсеры
     */
    // BlackBoxApp.use(CookieParse(env.COOKIE_SECRET)) // Передаем строку шифрования для cookie

    const urlencodedParser = BodyParser.urlencoded({
        limit: '50mb',
        extended: false,
        parameterLimit: 50000,
    }) // чтение данных из форм
    const jsonParser = BodyParser.json({ limit: '50mb' }) // чтение данных из json

    BlackBoxApp.use(urlencodedParser)
    BlackBoxApp.use(jsonParser)

    /**
     * Слушатели системных событий
     */
    BlackBoxApp.addListener('eventLog', eventLog)
    BlackBoxApp.addListener('errorLog', errorLog)
    BlackBoxApp.addListener('errorPromiseLog', errorPromiseLog)

    /**
     * Обработчики неизвестных ошибок
     */
    process.on('uncaughtException', (error) => {
        BlackBoxApp.emit('errorLog', error)
        process.exit(1)
    })

    /**
     * Оброботчик ошибок в promises
     */
    process.on('unhandledRejection', (reason, promise) => {
        /**
         * Обработка ошибок специальных исключений
         */
        if (reason instanceof HttpInternalServerException) {
            reason.response
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .send(reason.message)
        } else if (reason instanceof HttpValidationErrorException) {
            reason.response.status(StatusCode.BAD_REQUEST).send(reason.message)
        }

        BlackBoxApp.emit('errorPromiseLog', reason, promise)
    })

    /**
     * Обработчики выхода
     */
    const exits = ['exit', 'SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT']

    exits.forEach((event) => {
        process.on(event, (code) => {
            console.log(
                warnMsg(
                    `⚡️[event ${
                        EventName.SERVER_IS_STOPPED
                    }]: ${new Date()} - server остановлен по коду ${code}`
                )
            )

            process.exit(0)
        })
    })

    /**
     * Обработчики http запросов
     */
    // лог todo: временное решение
    BlackBoxApp.use((request, _response: Response, next: NextFunction) =>
        onRequest(request as clientRequest, _response, next)
    )

    // служебные
    BlackBoxApp.get('/_ping', ping)
    BlackBoxApp.get('/healthcheck', healthCheck)

    // errors
    BlackBoxApp.use(onErrorRequest)

    /** Служебные функции */

    /**
     * Обработка ошибок в ходе запроса по http
     * @param error     - ошибка
     * @param _request
     * @param response  - response
     * @param _next
     */
    function onErrorRequest(
        error: Error,
        _request: Request,
        response: Response,
        _next: NextFunction
    ) {
        BlackBoxApp.emit('errorLog', error, 'REQUEST')

        if (error instanceof URIError) {
            return response.status(StatusCode.BAD_REQUEST).send('oops ...')
        }

        if (error instanceof HttpUnauthorizedException) {
            return response.status(StatusCode.UNAUTHORIZED).send(error.message)
        }

        return response
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .send(error.message)
    }

    /**
     * Собираем данные подключения http
     * @param request   - данные запроса
     * @param _response
     * @param next
     */
    function onRequest(
        request: clientRequest,
        _response: Response,
        next: NextFunction
    ) {
        const clientInfo = new ClientInfo(request)

        request.ClientInfo = clientInfo.toObject()

        BlackBoxApp.emit(
            'eventLog',
            EventName.CLIENT_REQUEST,
            clientInfo.toString()
        )

        next()
    }

    /**
     * Проверка работоспособности приложения
     * @param _request
     * @param response
     * @param _next
     */
    function ping(_request: Request, response: Response, _next: NextFunction) {
        return response.status(StatusCode.OK).send('OK')
    }

    /**
     * Проверка состояния приложения
     * @param _request
     * @param response
     * @param _next
     */
    function healthCheck(
        _request: Request,
        response: Response,
        _next: NextFunction
    ) {
        /**
         * Если подключение к rabbit или к БД не доступно
         * вернем 404 код
         */
        if (
            (getConfig().USE_RABBIT && !StatusAppConnect.connectedRabbit) ||
            !StatusAppConnect.connectedDB
        ) {
            return response
                .status(StatusCode.NOT_FOUND)
                .send(JSON.stringify(StatusAppConnect))
        }

        return response.status(StatusCode.OK).send('OK')
    }

    /**
     * Процесс создания сервера и подключения к сервисам
     */
    const server = http.createServer(BlackBoxApp)
    serverStart(server, env)

    return BlackBoxApp
}

/**
 * Обработка не существующего маршрута
 * @param _request
 * @param response
 * @param _next
 * @constructor
 */
export function notFound(
    _request: Request,
    response: Response,
    _next: NextFunction
) {
    return response.status(StatusCode.NOT_FOUND).send('Ресурс не найден')
}

/**
 * Обработка ошибок в запросах
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
) {
    if (error instanceof SyntaxError)
        BlackBoxApp.emit('errorLog', error, 'CONTROLLER')
}

/**
 * Роутер
 * @constructor
 */
export function BlackBoxRouter() {
    return Express.Router()
}
