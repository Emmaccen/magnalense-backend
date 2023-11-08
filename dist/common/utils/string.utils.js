"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleCase = void 0;
function titleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
exports.titleCase = titleCase;
//# sourceMappingURL=string.utils.js.map