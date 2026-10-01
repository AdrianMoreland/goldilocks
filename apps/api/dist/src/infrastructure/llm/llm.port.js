"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLM_PROVIDER = exports.LlmError = void 0;
class LlmError extends Error {
    kind;
    constructor(kind, message, options) {
        super(message, options);
        this.kind = kind;
        this.name = 'LlmError';
    }
}
exports.LlmError = LlmError;
exports.LLM_PROVIDER = Symbol('LLM_PROVIDER');
//# sourceMappingURL=llm.port.js.map