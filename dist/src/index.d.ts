import { Express } from 'express'
export interface BlackBoxApp extends Express {

}

export function createApp(env: { BASE_PATH?: string, NODE_ENV?: string }): BlackBoxApp

