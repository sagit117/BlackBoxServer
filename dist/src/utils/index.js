"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWTforResponse = exports.getConfigFile = exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const httpErrors_1 = require("../dataClasses/httpErrors");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const index_1 = require("../index");
function getConfig(url) {
    try {
        return JSON.parse(fs_1.default.readFileSync(url, 'utf8'));
    }
    catch (e) {
        throw new Error(e);
    }
}
exports.getConfig = getConfig;
exports.getConfigFile = getConfig('./configApp.json');
function decodeJWTforResponse(token, response, secret) {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        index_1.BlackBoxApp.emit('errorLog', error, "JWT");
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new httpErrors_1.HttpUnauthorizedException(error.message, response);
        }
        else {
            throw new httpErrors_1.HttpInternalServerException(error.message, response);
        }
    }
}
exports.decodeJWTforResponse = decodeJWTforResponse;
