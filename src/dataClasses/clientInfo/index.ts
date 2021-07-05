export default class ClientInfo {
    readonly connectDate: Date = new Date()
    requestUrl: string = ''
    requestMethod: string = ''
    requestCookies: string = ''
    requestSignedCookies: string = ''
    requestIP: string = ''
    body: object = {}
    queryParams: object = {}

    constructor(request) {
        this.requestUrl = request.url || ''
        this.requestMethod = request.method || ''
        this.requestCookies = request.cookies || ''
        this.requestSignedCookies = request.signedCookies || ''
        this.requestIP = request.ip || ''
        this.body = request.body || {}
        this.queryParams = request.query || {}
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
        }
    }

    toString() {
        return JSON.stringify(this.toObject())
    }
}
