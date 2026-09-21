"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterday = getYesterday;
function getYesterday() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
}
//# sourceMappingURL=date.utils.js.map