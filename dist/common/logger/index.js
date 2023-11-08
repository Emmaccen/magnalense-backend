"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const pino_1 = __importDefault(require("pino"));
const log = (0, pino_1.default)({
    prettyPrint: true,
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss')}"`,
});
exports.default = log;
//# sourceMappingURL=index.js.map