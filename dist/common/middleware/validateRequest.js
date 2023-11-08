"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const validate = (schema, type) => async (req, res, next) => {
    try {
        await schema.parse(req[type]);
        return next();
    }
    catch (e) {
        logger_1.default.error(e.message);
        return res.badRequest(JSON.parse(e.message));
    }
};
exports.default = validate;
//# sourceMappingURL=validateRequest.js.map