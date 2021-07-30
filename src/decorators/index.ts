import StackAccessIP from '../dataClasses/stackAccessIP'
import BaseController from '../controllers/baseController'
import { Request } from 'express'
import {
    HttpTooManyRequests,
    HttpUnauthorizedException,
} from '../dataClasses/httpErrors'
import { decodeJWTforResponse } from '../utils'

/**
 * Декоратор для проверки количества вызовов метода с одного IP
 * @param maxStack      - количество запросов
 * @param timeLifeStack - интервал жизни очереди
 * @param messageError  - сообщение об ошибки
 */
export function checkAccessIP(
    maxStack: number,
    timeLifeStack: number,
    messageError?: string
) {
    return function (
        _target: Object,
        _method: string,
        descriptor: PropertyDescriptor
    ) {
        /**
         * Оригинальный метод
         */
        const originMethod = descriptor.value

        /**
         * Подмена оригинального метода
         */
        descriptor.value = function (...args) {
            const request = (this as BaseController).request as Request
            const response = (this as BaseController).response

            const stackItem = StackAccessIP.addStack(
                request.ClientInfo.requestUrl,
                request.ClientInfo.requestIP,
                timeLifeStack
            )

            if (stackItem.countRequest > maxStack) {
                throw new HttpTooManyRequests(
                    messageError ||
                        'Превышено число попыток, попробуйте позже!',
                    response
                )
            }

            /**
             * Вернем оригинальный метод с текущим контекстом
             */
            return originMethod.apply(this, args)
        }
    }
}

/**
 * Аутентификация с помощью Bearer токена
 * @param messageError  - сообщение об ошибки
 * @param secretKey     - строка для расшифровки JWT
 */
export function checkBearerToken(
    secretKey: string = '',
    messageError?: string
) {
    return function (
        _target: Object,
        _method: string,
        descriptor: PropertyDescriptor
    ) {
        /**
         * Оригинальный метод
         */
        const originMethod = descriptor.value

        /**
         * Подмена оригинального метода
         */
        descriptor.value = function (...args) {
            const request = (this as BaseController).request
            const response = (this as BaseController).response
            const [type, token] = request
                ?.header('Authorization')
                ?.split(' ') || ['', '']

            if (type !== 'Bearer') {
                throw new HttpUnauthorizedException(
                    messageError || 'Ошибка авторизации',
                    response
                )
            }

            request.ClientInfo.decodeAccessToken = decodeJWTforResponse(
                token,
                response,
                secretKey
            )

            /**
             * Вернем оригинальный метод с текущим контекстом
             */
            return originMethod.apply(this, args)
        }
    }
}
