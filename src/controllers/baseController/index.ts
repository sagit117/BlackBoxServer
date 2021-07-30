import { NextFunction, Response } from 'express'
import { StatusCode } from './base-controller'
import { Query } from 'mongoose'
import {
    HttpInternalServerException,
    HttpValidationException,
} from '../../dataClasses/httpErrors'
import { BlackBoxApp } from '../../index'
import { ReasonError } from '../../emitters/emitters'
import { TBlackBoxRequest } from '../../index.d'

/**
 * Базовый класс для контроллера
 */
export default class BaseController {
    request: TBlackBoxRequest
    response: Response
    next: NextFunction | null

    constructor(
        request: TBlackBoxRequest,
        response: Response,
        next?: NextFunction
    ) {
        this.request = request
        this.response = response
        this.next = next || null
    }

    /**
     * Обрабатываем запрос к БД и выводим ответ
     * @param promise   - запрос к БД
     */
    public prepareQueryAndSendResponse(
        promise:
            | Query<any[], any, {}>
            | Promise<any>
            | Query<
                  { ok?: number | undefined; n?: number | undefined } & {
                      deletedCount?: number | undefined
                  },
                  any,
                  {}
              >
    ) {
        promise
            .then((result) => {
                this.render(result, StatusCode.OK)
            })
            .catch((error: Error) => {
                BlackBoxApp.emit('errorLog', error, ReasonError.REQUEST)

                if (error.name === 'ValidationError') {
                    throw new HttpValidationException(
                        'Данные не проходят проверку',
                        this.response
                    )
                }

                if (error.name === 'HttpValidationException') {
                    throw error
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
    public render(result: any, code: StatusCode) {
        this.response.status(code).send(result)
        // this.next()
    }
}
