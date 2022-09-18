"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var LOG_LEVEL = {
    info: "info",
    debug: "debug",
    warn: "warn",
    error: "error"
};
var CONSOLE_COLORS = {
    red: "\u001B[31m",
    green: "\u001B[32m",
    yellow: "\u001B[33m",
    cyan: "\u001B[36m",
    white: "\u001B[37m",
    reset: "\u001B[0m"
};
var LOG_LEVEL_COLOR = (_a = {},
    _a[LOG_LEVEL.info] = CONSOLE_COLORS.white,
    _a[LOG_LEVEL.debug] = CONSOLE_COLORS.white,
    _a[LOG_LEVEL.warn] = CONSOLE_COLORS.yellow,
    _a[LOG_LEVEL.error] = CONSOLE_COLORS.red,
    _a);
exports.default = {
    LOG_LEVEL: LOG_LEVEL,
    CONSOLE_COLORS: CONSOLE_COLORS,
    LOG_LEVEL_COLOR: LOG_LEVEL_COLOR
};
