"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = void 0;
const config = {
    port: process.env?.PORT ? parseInt(process.env.PORT) : 4000,
    dbUrl: process.env.DB_URL,
    environment: process.env.NODE_ENV,
};
const configService = (key) => {
    if (!Object.prototype.hasOwnProperty.call(config, key)) {
        throw new Error(`Key ${key} not found in config`);
    }
    return config[key];
};
exports.configService = configService;
//# sourceMappingURL=config.service.js.map