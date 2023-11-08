"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserHandler = void 0;
const user_model_1 = __importDefault(require("./user.model"));
async function checkUserHandler(req, res) {
    try {
        const { type, value } = req.query;
        const user = await user_model_1.default.findOne({ type, value });
        if (!user) {
            return res.notFound('User not found');
        }
        return res.success('User found', { type, value });
    }
    catch (error) {
        return res.internalServer('Error', error);
    }
}
exports.checkUserHandler = checkUserHandler;
//# sourceMappingURL=user.service.js.map