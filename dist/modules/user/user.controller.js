"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const express_1 = require("express");
const middleware_1 = require("../../common/middleware");
const GetUsersDto_1 = require("./dtos/GetUsersDto");
const user_service_1 = require("./user.service");
const router = (0, express_1.Router)();
router.get('/', (0, middleware_1.validateRequest)(GetUsersDto_1.GetUserDto, 'query'), user_service_1.checkUserHandler);
exports.userController = router;
//# sourceMappingURL=user.controller.js.map