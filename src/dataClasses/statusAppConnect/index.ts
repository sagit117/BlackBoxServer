/**
 * Класс для отслеживания статусов подключения приложения к источникам данных
 */
class StatusAppInfo {
    protected DB_IS_CONNECTED: boolean = false
    protected RABBIT_IS_CONNECTED: boolean = false

    constructor() {}

    set connectedDB(isConnected) {
        this.DB_IS_CONNECTED = isConnected
    }

    set connectedRabbit(isConnected) {
        this.RABBIT_IS_CONNECTED = isConnected
    }

    get connectedDB() {
        return this.DB_IS_CONNECTED
    }

    get connectedRabbit() {
        return this.RABBIT_IS_CONNECTED
    }
}

export default new StatusAppInfo()
