import { IObjectJWT } from './src/utils/utils'

declare namespace Express {
    export interface Request {
        ClientInfo: {
            readonly connectDate: Date
            requestUrl: string
            requestMethod: string
            requestCookies: string
            requestSignedCookies: string
            requestIP: string
            body: object
            queryParams: object
            decodeAccessToken?: IObjectJWT
        }
    }
}
