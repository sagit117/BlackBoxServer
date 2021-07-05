import Mongoose from 'mongoose'
import { EventName } from '../emitters/emitters'
import StatusAppConnect from '../dataClasses/statusAppConnect'
import { getConfig } from '../utils'

/**
 * Соединение с БД
 * @param App   - экземпляр приложения
 */
export function connectDB(App) {
    return Mongoose.connect(
        `mongodb://${getConfig().DB_HOST}:${getConfig().DB_PORT}${
            getConfig().DB_STRING_OPTIONS
        }`,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            dbName: getConfig().DB_NAME,
            user: getConfig().DB_USER,
            pass: getConfig().DB_PASSWORD,
        }
    )
        .then(() => {
            App.emit(
                'eventLog',
                EventName.DB_IS_CONNECTED,
                `Подключение к БД прошло успешно`
            )

            StatusAppConnect.connectedDB = true
        })
        .catch((error) => {
            StatusAppConnect.connectedDB = false
            return Promise.reject(error)
        })
}
