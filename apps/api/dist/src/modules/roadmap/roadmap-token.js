"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidToken = isValidToken;
const node_crypto_1 = require("node:crypto");
function isValidToken(expected, given) {
    if (!expected || !given)
        return false;
    const a = (0, node_crypto_1.createHash)('sha256').update(expected).digest();
    const b = (0, node_crypto_1.createHash)('sha256').update(given).digest();
    return (0, node_crypto_1.timingSafeEqual)(a, b);
}
//# sourceMappingURL=roadmap-token.js.map