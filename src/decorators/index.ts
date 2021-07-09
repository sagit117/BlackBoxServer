import StackAccessIP from '../dataClasses/stackAccessIP'
import BaseController from '../controllers/baseController'
import { Request } from 'express'
import { HttpTooManyRequests } from '../dataClasses/httpErrors'

/**
 * Декоратор для проверки количества вызовов метода с одного IP
 * @param maxStack - количество запросов
 * @param timeLifeStack - интервал жизни очереди
 */
export function checkAccessIP(maxStack: number, timeLifeStack: number) {
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
            // const maxStack = 5
            // const timeLifeStack = 60000

            const stackItem = StackAccessIP.addStack(
                request.ClientInfo.requestUrl,
                request.ClientInfo.requestIP,
                timeLifeStack
            )

            if (stackItem.countRequest > maxStack) {
                throw new HttpTooManyRequests(
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
