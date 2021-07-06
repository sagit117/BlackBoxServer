"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeMsg = exports.warnMsg = exports.errorMsg = void 0;
const cli_color_1 = __importDefault(require("cli-color"));
exports.errorMsg = cli_color_1.default.red.bold;
exports.warnMsg = cli_color_1.default.yellow;
exports.noticeMsg = cli_color_1.default.blue;
