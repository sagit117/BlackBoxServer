class StatusAppInfo {
    constructor() {
        this.DB_IS_CONNECTED = false;
        this.RABBIT_IS_CONNECTED = false;
    }
    set connectedDB(isConnected) {
        this.DB_IS_CONNECTED = isConnected;
    }
    set connectedRabbit(isConnected) {
        this.RABBIT_IS_CONNECTED = isConnected;
    }
    get connectedDB() {
        return this.DB_IS_CONNECTED;
    }
    get connectedRabbit() {
        return this.RABBIT_IS_CONNECTED;
    }
}
export default new StatusAppInfo();
