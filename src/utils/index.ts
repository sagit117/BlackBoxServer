import fs from 'fs'
import { IConfigApp } from './utils'

/**
 * Загрузка настроек из файла конфигурации
 */
export function getConfig(): IConfigApp {
    try {
        return JSON.parse(fs.readFileSync('./configApp.json', 'utf8'))
    } catch (e) {
        throw new Error(e)
    }
}
