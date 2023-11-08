"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponseCodes_1 = require("../../enums/HttpResponseCodes");
function attachResponder(req, res, next) {
    res.success = function (message = 'Successful', data = null) {
        return res.json({
            message,
            data,
            status: HttpResponseCodes_1.HttpResponseCodes.OK,
            success: true,
        });
    };
    res.badRequest = function (message = 'Bad request', errors = null) {
        return res.status(HttpResponseCodes_1.HttpResponseCodes.BAD_REQUEST).json({
            message,
            errors,
            status: HttpResponseCodes_1.HttpResponseCodes.BAD_REQUEST,
            success: false,
        });
    };
    res.notFound = function (message = 'Not found', errors = null) {
        return res.status(HttpResponseCodes_1.HttpResponseCodes.NOT_FOUND).json({
            message,
            errors,
            status: HttpResponseCodes_1.HttpResponseCodes.NOT_FOUND,
            success: false,
        });
    };
    res.internalServer = function (message = 'Internal server error', errors = null) {
        return res.status(HttpResponseCodes_1.HttpResponseCodes.INTERNAL_SERVER_ERROR).json({
            message,
            errors,
            status: HttpResponseCodes_1.HttpResponseCodes.INTERNAL_SERVER_ERROR,
            success: false,
        });
    };
    next();
}
exports.default = attachResponder;
//# sourceMappingURL=attachResponder.js.map