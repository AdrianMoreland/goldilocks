/**
 * Removes personal details from a question before it is stored or used as a
 * cache key (docs/AI-AGENT-PLAN.md §7). Pure, so it can be tested without
 * mocks. It over-scrubs on purpose: losing a harmless word costs nothing,
 * keeping a customer's name in a log does.
 *
 * Numbers are kept. "A payout over €50,000" and "a payout over €5,000" have
 * different answers, so stripping amounts would let different questions share
 * a cache entry. Only long digit runs (phone and account numbers) go.
 */

const EMAIL = /[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+/g;
const IBAN = /\b[A-Za-z]{2}\d{2}(?:[ ]?[A-Za-z0-9]{2,4}){3,8}\b/g;
// Nine or more digits in a row, allowing the usual phone separators — but not commas,
// so "€12,000 and €50,000" is left alone.
const PHONE = /\+?\d(?:[\s().-]?\d){8,}/g;
const TITLE = /\b(?:Mr|Mrs|Ms|Miss|Mx|Dr|Prof)\.?(?=\s)/g;
const CAPITALISED = /\b[A-Z][a-z]+(?:['’-][A-Za-z]+)*\b/g;

/** Capitalised words that start questions or sit in every sentence, so they are never a name. */
const COMMON = new Set(
    (
        'a an and are as at be been but by can could did do does for from had has have how i if in is it its ' +
        'may me my no not of on one or our please should so some that the their them then there they this to ' +
        'was we were what when where which who whom whose why will with would yes you your'
    ).split(' '),
);

export const REDACTED_NAME = '[customer]';
export const REDACTED_EMAIL = '[email]';
export const REDACTED_PHONE = '[phone]';
export const REDACTED_ACCOUNT = '[account]';

export interface ScrubResult {
    text: string;
    /** True if anything at all was replaced — such a question is never cached (two different people would share one key). */
    redacted: boolean;
}

/** Every lower-case word in a piece of text: the vocabulary a capitalised word must belong to, or it is treated as a name. */
export function vocabularyOf(text: string): Set<string> {
    const words = new Set<string>();
    for (const match of text.toLowerCase().matchAll(/[a-z][a-z'’-]*/g)) {
        words.add(match[0]);
    }
    return words;
}

export function scrubPersonalData(
    input: string,
    vocabulary: ReadonlySet<string>,
): ScrubResult {
    let redacted = false;
    const swap = (pattern: RegExp, replacement: string, value: string) =>
        value.replace(pattern, () => {
            redacted = true;
            return replacement;
        });

    let text = input;
    text = swap(EMAIL, REDACTED_EMAIL, text);
    text = swap(IBAN, REDACTED_ACCOUNT, text);
    text = swap(PHONE, REDACTED_PHONE, text);
    text = swap(TITLE, '', text);
    text = text.replace(CAPITALISED, (word) => {
        const lower = word.toLowerCase();
        if (COMMON.has(lower) || vocabulary.has(lower)) return word;
        redacted = true;
        return REDACTED_NAME;
    });

    // "John Murphy" becomes one [customer], not two, and stray double spaces are tidied.
    text = text
        .replace(/(\[customer\])(?:\s+\[customer\])+/g, '$1')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    return { text, redacted };
}

/** The cache key for a question: lower-case, punctuation and spacing collapsed, so trivial variants match. */
export function normaliseQuestion(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}€$£%.,\s-]/gu, ' ')
        .replace(/[.,](?=\s|$)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
