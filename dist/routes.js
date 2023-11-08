"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("./common/middleware");
const user_controller_1 = require("./modules/user/user.controller");
function default_1(app) {
    app.use(middleware_1.attachResponder);
    app.use('/user', user_controller_1.userController);
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map