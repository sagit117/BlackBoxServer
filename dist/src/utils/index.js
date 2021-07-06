"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
function getConfig() {
    try {
        return JSON.parse(fs_1.default.readFileSync('./configApp.json', 'utf8'));
    }
    catch (e) {
        throw new Error(e);
    }
}
exports.getConfig = getConfig;
