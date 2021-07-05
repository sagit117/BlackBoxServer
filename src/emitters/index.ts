import { noticeMsg, errorMsg } from '../utils/log-colors'
import { EventName } from './emitters'

/**
 * Логирование событий
 * @param eventName     - имя события
 * @param description   - описание
 */
export function eventLog(
    eventName: keyof typeof EventName,
    description: string
) {
    const date = new Date()

    console.log(noticeMsg(`⚡️[event ${eventName}]: ${date} - ${description}`))
}

/**
 * Логирование исключений
 * @param error         - ошибка
 * @param reasonError   - причина ошибки, например DB
 */
export function errorLog(error: Error, reasonError?: string) {
    const date = new Date()

    console.error(
        errorMsg(
            `⚡️[error ${reasonError}]: ${date} - name: ${error?.name}, message: ${error?.message}, stack: `,
            error?.stack
        )
    )
}

/**
 * Логирование исключений в промисах
 * @param reason    - причина ошибки
 * @param promise   - сам промис с ошибкой
 */
export function errorPromiseLog(
    reason: {} | null | undefined,
    promise: Promise<any>
) {
    const date = new Date()

    console.error(
        errorMsg(
            `⚡️[error promise]: ${date} - reason: ${reason}, promise: `,
            promise
        )
    )
}
