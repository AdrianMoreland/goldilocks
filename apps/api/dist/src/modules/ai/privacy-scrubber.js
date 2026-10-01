"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDACTED_ACCOUNT = exports.REDACTED_PHONE = exports.REDACTED_EMAIL = exports.REDACTED_NAME = void 0;
exports.vocabularyOf = vocabularyOf;
exports.scrubPersonalData = scrubPersonalData;
exports.normaliseQuestion = normaliseQuestion;
const EMAIL = /[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+/g;
const IBAN = /\b[A-Za-z]{2}\d{2}(?:[ ]?[A-Za-z0-9]{2,4}){3,8}\b/g;
const PHONE = /\+?\d(?:[\s().-]?\d){8,}/g;
const TITLE = /\b(?:Mr|Mrs|Ms|Miss|Mx|Dr|Prof)\.?(?=\s)/g;
const CAPITALISED = /\b[A-Z][a-z]+(?:['’-][A-Za-z]+)*\b/g;
const COMMON = new Set(('a an and are as at be been but by can could did do does for from had has have how i if in is it its ' +
    'may me my no not of on one or our please should so some that the their them then there they this to ' +
    'was we were what when where which who whom whose why will with would yes you your').split(' '));
exports.REDACTED_NAME = '[customer]';
exports.REDACTED_EMAIL = '[email]';
exports.REDACTED_PHONE = '[phone]';
exports.REDACTED_ACCOUNT = '[account]';
function vocabularyOf(text) {
    const words = new Set();
    for (const match of text.toLowerCase().matchAll(/[a-z][a-z'’-]*/g)) {
        words.add(match[0]);
    }
    return words;
}
function scrubPersonalData(input, vocabulary) {
    let redacted = false;
    const swap = (pattern, replacement, value) => value.replace(pattern, () => {
        redacted = true;
        return replacement;
    });
    let text = input;
    text = swap(EMAIL, exports.REDACTED_EMAIL, text);
    text = swap(IBAN, exports.REDACTED_ACCOUNT, text);
    text = swap(PHONE, exports.REDACTED_PHONE, text);
    text = swap(TITLE, '', text);
    text = text.replace(CAPITALISED, (word) => {
        const lower = word.toLowerCase();
        if (COMMON.has(lower) || vocabulary.has(lower))
            return word;
        redacted = true;
        return exports.REDACTED_NAME;
    });
    text = text
        .replace(/(\[customer\])(?:\s+\[customer\])+/g, '$1')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
    return { text, redacted };
}
function normaliseQuestion(text) {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}€$£%.,\s-]/gu, ' ')
        .replace(/[.,](?=\s|$)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
//# sourceMappingURL=privacy-scrubber.js.map