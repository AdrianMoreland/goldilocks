"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefusalGate = void 0;
const prompt_builder_1 = require("./prompt-builder");
class RefusalGate {
    held = '';
    decision = null;
    push(text) {
        if (this.decision === 'refusal')
            return '';
        if (this.decision === 'pass')
            return text;
        this.held += text;
        const probe = this.held.trimStart();
        if (probe.length < prompt_builder_1.NO_ANSWER_MARKER.length)
            return '';
        if (probe.toUpperCase().startsWith(prompt_builder_1.NO_ANSWER_MARKER)) {
            this.decision = 'refusal';
            this.held = '';
            return '';
        }
        this.decision = 'pass';
        const released = this.held;
        this.held = '';
        return released;
    }
    flush() {
        if (this.decision !== null)
            return '';
        const released = this.held;
        this.held = '';
        this.decision = 'pass';
        return released;
    }
}
exports.RefusalGate = RefusalGate;
//# sourceMappingURL=refusal-gate.js.map