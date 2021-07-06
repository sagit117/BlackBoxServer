export default class ClientInfo {
    constructor(request) {
        this.connectDate = new Date();
        this.requestUrl = '';
        this.requestMethod = '';
        this.requestCookies = '';
        this.requestSignedCookies = '';
        this.requestIP = '';
        this.body = {};
        this.queryParams = {};
        this.requestUrl = request.url || '';
        this.requestMethod = request.method || '';
        this.requestCookies = request.cookies || '';
        this.requestSignedCookies = request.signedCookies || '';
        this.requestIP = request.ip || '';
        this.body = request.body || {};
        this.queryParams = request.query || {};
    }
    toObject() {
        return {
            connectDate: this.connectDate,
            requestUrl: this.requestUrl,
            requestMethod: this.requestMethod,
            requestCookies: this.requestCookies,
            requestSignedCookies: this.requestSignedCookies,
            requestIP: this.requestIP,
            body: this.body,
            queryParams: this.queryParams,
        };
    }
    toString() {
        return JSON.stringify(this.toObject());
    }
}
