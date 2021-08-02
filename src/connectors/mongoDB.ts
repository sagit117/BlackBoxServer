import Mongoose from 'mongoose'
import { EventName } from '../emitters/emitters'
import StatusAppConnect from '../dataClasses/statusAppConnect'
import { getConfigFile } from '../utils'

/**
 * Соединение с БД
 * @param App   - экземпляр приложения
 */
export function connectDB(App) {
    return Mongoose.connect(
        `mongodb://${getConfigFile.DB_HOST}:${getConfigFile.DB_PORT}${
            getConfigFile.DB_STRING_OPTIONS
        }`,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            dbName: getConfigFile.DB_NAME,
            user: getConfigFile.DB_USER,
            pass: getConfigFile.DB_PASSWORD,
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
