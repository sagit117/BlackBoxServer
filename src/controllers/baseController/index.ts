import { NextFunction, Request, Response } from 'express'
import { StatusCode } from './base-controller'
import { Query } from 'mongoose'
import {
    HttpInternalServerException,
    HttpValidationErrorException,
} from '../../dataClasses/httpErrors'
import { BlackBoxApp } from '../../index'

/**
 * Базовый класс для контроллера
 */
export default class BaseController {
    request: Request
    response: Response
    next: NextFunction | null

    constructor(request: Request, response: Response, next?: NextFunction) {
        this.request = request
        this.response = response
        this.next = next || null
    }

    /**
     * Обрабатываем запрос к БД и выводим ответ
     * @param promise   - запрос к БД
     */
    prepareQueryAndSendResponse(promise: Query<any[], any, {}>) {
        promise
            .then((result) => {
                this.render(result, StatusCode.OK)
            })
            .catch((error) => {
                BlackBoxApp.emit('errorLog', error, 'REQUEST')

                if (error.name === 'ValidationError') {
                    throw new HttpValidationErrorException(
                        'Данные не проходят проверку',
                        this.response
                    )
                }

                throw new HttpInternalServerException(
                    'Произошла внутренняя ошибка сервера',
                    this.response
                )
            })
    }

    /**
     * Отправка данных на фронт
     * @param result    - данные для отправки
     * @param code      - код ответа из TStatusCode
     */
    render(result: any, code: StatusCode) {
        this.response.setHeader('Access-Control-Allow-Origin', '*')
        this.response.status(code).send(result)
        // this.next()
    }
}
