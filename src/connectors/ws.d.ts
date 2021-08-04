import http from 'http'
import https from 'https'
import {
    PerMessageDeflateOptions,
    VerifyClientCallbackAsync,
    VerifyClientCallbackSync,
} from 'ws'

export interface IOptions {
    host?: string
    port?: number
    backlog?: number
    server?: http.Server | https.Server
    verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync
    handleProtocols?: any
    path?: string
    noServer?: boolean
    clientTracking?: boolean
    perMessageDeflate?: boolean | PerMessageDeflateOptions
    maxPayload?: number
}

export type Message = string | Buffer | ArrayBuffer | Buffer[]
