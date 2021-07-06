import { Express, NextFunction, Request, Response } from 'express'
export interface BlackBoxApp extends Express {}

export function createApp(env: {
    BASE_PATH?: string
    NODE_ENV?: string
}): BlackBoxApp
export function notFound(
    _request: Request,
    response: Response,
    _next: NextFunction
): BlackBoxApp.Response<any, Record<string, any>>
export function onErrorAfterResponse(
    error: Error,
    _request: Request,
    _response: Response,
    _next: NextFunction
): void