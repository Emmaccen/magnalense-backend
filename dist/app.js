"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const connect_1 = require("./common/database/connect");
const logger_1 = __importDefault(require("./common/logger"));
const config_service_1 = require("./common/service/config.service");
const routes_1 = __importDefault(require("./routes"));
const port = (0, config_service_1.configService)('port');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.listen(port, async () => {
    try {
        logger_1.default.info(`Server listening at port ${port}`);
        await (0, connect_1.connect)();
        (0, routes_1.default)(app);
    }
    catch (error) {
        logger_1.default.error(error);
    }
});
//# sourceMappingURL=app.js.map