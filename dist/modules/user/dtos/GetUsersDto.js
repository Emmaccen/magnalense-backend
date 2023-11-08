"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserDto = void 0;
const zod_1 = require("zod");
exports.GetUserDto = zod_1.z.object({
    email: zod_1.z.string().email(),
});
//# sourceMappingURL=GetUsersDto.js.map