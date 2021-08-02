import fs from 'fs'
import { IConfigApp, IObjectJWT } from './utils'
import { HttpUnauthorizedException } from '../dataClasses/httpErrors'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { Response } from 'express'
import { BlackBoxApp } from '../index'
import { ReasonError } from '../emitters/emitters'

/**
 * Загрузка настроек из файла конфигурации
 */
export function getConfig<T>(url: string): T {
    try {
        return JSON.parse(fs.readFileSync(url, 'utf8'))
    } catch (e) {
        throw new Error(e)
    }
}

export const getConfigFile = getConfig<IConfigApp>('./configApp.json')

/**
 * Проверка токена авторизации для предоставления ответа клиенту
 * @param token     - токен
 * @param response  - объект ответа
 * @param secret    - строка расшифровки jwt
 */
export function decodeJWTforResponse(
    token: string,
    response: Response,
    secret: string
): IObjectJWT {
    try {
        return jwt.verify(token, secret) as IObjectJWT
    } catch (error) {
        BlackBoxApp.emit('errorLog', error, ReasonError.JWT)

        if (error instanceof TokenExpiredError) {
            throw new HttpUnauthorizedException(error.message, response)
        } else {
            throw new HttpUnauthorizedException(error.message, response)
        }
    }
}
