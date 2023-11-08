"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger"));
const config_service_1 = require("../service/config.service");
function connect() {
    const dbUrl = (0, config_service_1.configService)('dbUrl');
    return mongoose_1.default
        .connect(dbUrl)
        .then(() => {
        logger_1.default.info('Database connected.');
    })
        .catch((error) => {
        logger_1.default.error('Db error.', error);
        throw error;
    });
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map