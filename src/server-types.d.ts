import { Request } from 'express'

export interface clientRequest extends Request {
    ClientInfo: {
        readonly connectDate: Date
        requestUrl: string
        requestMethod: string
        requestCookies: string
        requestSignedCookies: string
        requestIP: string
        body: object
        queryParams: object
    }
}
