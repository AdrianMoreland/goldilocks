"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLM_PROVIDER = exports.LlmError = void 0;
class LlmError extends Error {
    kind;
    usage;
    model;
    constructor(kind, message, options) {
        super(message, { cause: options?.cause });
        this.kind = kind;
        this.name = 'LlmError';
        this.usage = options?.usage;
        this.model = options?.model;
    }
}
exports.LlmError = LlmError;
exports.LLM_PROVIDER = Symbol('LLM_PROVIDER');
//# sourceMappingURL=llm.port.js.map