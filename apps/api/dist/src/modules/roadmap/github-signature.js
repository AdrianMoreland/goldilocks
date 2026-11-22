"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGithubSignature = isValidGithubSignature;
const node_crypto_1 = require("node:crypto");
function isValidGithubSignature(secret, rawBody, header) {
    if (!secret || !rawBody || !header)
        return false;
    const expected = Buffer.from(`sha256=${(0, node_crypto_1.createHmac)('sha256', secret).update(rawBody).digest('hex')}`);
    const given = Buffer.from(header);
    return given.length === expected.length && (0, node_crypto_1.timingSafeEqual)(given, expected);
}
//# sourceMappingURL=github-signature.js.map