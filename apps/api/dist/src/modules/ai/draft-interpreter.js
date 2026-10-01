"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretDraft = interpretDraft;
const answer_interpreter_1 = require("./answer-interpreter");
const prompt_builder_1 = require("./prompt-builder");
const MARKER_LINE = new RegExp(`^[ \\t]*-{2,}[ \\t]*${prompt_builder_1.NOTES_MARKER.replace(/-/g, '')}[ \\t]*-{2,}[ \\t]*$`, 'im');
const ANY_LINK = /[ \t]?\[\[[^\]]*\]\]/g;
function interpretDraft(raw, prompt) {
    const text = raw.trim();
    const match = MARKER_LINE.exec(text);
    const messagePart = match ? text.slice(0, match.index) : text;
    const notesPart = match ? text.slice(match.index + match[0].length) : '';
    const message = messagePart
        .replace(ANY_LINK, '')
        .replace(/[ \t]+([.,;:!?])/g, '$1')
        .trim();
    const trimmedNotes = notesPart.trim();
    if (!trimmedNotes)
        return { message, notes: null, citations: [] };
    const { cleaned, citations } = (0, answer_interpreter_1.checkCitations)(trimmedNotes, prompt);
    return { message, notes: cleaned || null, citations };
}
//# sourceMappingURL=draft-interpreter.js.map