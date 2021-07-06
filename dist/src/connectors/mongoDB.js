import Mongoose from 'mongoose';
import StatusAppConnect from '../dataClasses/statusAppConnect';
import { getConfig } from '../utils';
export function connectDB(App) {
    return Mongoose.connect(`mongodb://${getConfig().DB_HOST}:${getConfig().DB_PORT}${getConfig().DB_STRING_OPTIONS}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        dbName: getConfig().DB_NAME,
        user: getConfig().DB_USER,
        pass: getConfig().DB_PASSWORD,
    })
        .then(() => {
        App.emit('eventLog', "DB_IS_CONNECTED", `Подключение к БД прошло успешно`);
        StatusAppConnect.connectedDB = true;
    })
        .catch((error) => {
        StatusAppConnect.connectedDB = false;
        return Promise.reject(error);
    });
}
//# sourceMappingURL=mongoDB.js.map