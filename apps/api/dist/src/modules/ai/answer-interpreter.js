"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCitations = checkCitations;
exports.interpretAnswer = interpretAnswer;
const shared_types_1 = require("@goldilocks/shared-types");
const prompt_builder_1 = require("./prompt-builder");
const REFUSAL_PREFIX = new RegExp(`^\\s*${prompt_builder_1.NO_ANSWER_MARKER}\\s*:?\\s*`, 'i');
const CITATION = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9-]+))?\]\]/g;
const DEFAULT_REFUSAL = 'The approved procedures do not cover this. Ask a manager.';
function checkCitations(text, prompt) {
    const isValid = (slug, anchor) => anchor
        ? prompt.sections.has(`${slug}#${anchor}`)
        : prompt.titles.has(slug);
    const citations = [];
    const seen = new Set();
    for (const link of (0, shared_types_1.findLinks)(text)) {
        const key = `${link.slug}#${link.anchor ?? ''}`;
        if (seen.has(key) || !isValid(link.slug, link.anchor))
            continue;
        seen.add(key);
        const title = prompt.titles.get(link.slug) ?? link.slug;
        const heading = link.anchor
            ? (prompt.sections.get(`${link.slug}#${link.anchor}`)?.heading ??
                null)
            : null;
        citations.push({
            slug: link.slug,
            anchor: link.anchor,
            title,
            heading,
        });
    }
    const cleaned = text
        .replace(CITATION, (match, slug, anchor) => isValid(slug, anchor ?? null) ? match : '')
        .replace(/[ \t]+([.,;:!?])/g, '$1')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
    return { cleaned, citations };
}
function interpretAnswer(raw, prompt) {
    const text = raw.trim();
    if (REFUSAL_PREFIX.test(text)) {
        const reason = text.replace(REFUSAL_PREFIX, '').trim();
        return {
            answer: reason || DEFAULT_REFUSAL,
            status: 'refused',
            citations: [],
        };
    }
    const { cleaned, citations } = checkCitations(text, prompt);
    return {
        answer: cleaned,
        status: citations.length > 0 ? 'answered' : 'uncited',
        citations,
    };
}
//# sourceMappingURL=answer-interpreter.js.map