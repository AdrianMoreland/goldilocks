import type { AiCitation } from '@goldilocks/shared-types';
import { checkCitations } from './answer-interpreter';
import { NOTES_MARKER, type BuiltPrompt } from './prompt-builder';

export interface InterpretedDraft {
    /** The reply to send. Never contains wiki-style links: the customer must not see them. */
    message: string;
    /** Staff-only notes (what was understood, what to check), with validated citations. Null when the model wrote none. */
    notes: string | null;
    citations: AiCitation[];
}

const MARKER_LINE = new RegExp(
    `^[ \\t]*-{2,}[ \\t]*${NOTES_MARKER.replace(/-/g, '')}[ \\t]*-{2,}[ \\t]*$`,
    'im',
);
const ANY_LINK = /[ \t]?\[\[[^\]]*\]\]/g;

/**
 * Splits a drafted reply at the notes marker into the message to send and
 * the notes for the staff member. Citations are validated in the notes only;
 * any link the model leaked into the message itself is removed.
 */
export function interpretDraft(
    raw: string,
    prompt: BuiltPrompt,
): InterpretedDraft {
    const text = raw.trim();
    const match = MARKER_LINE.exec(text);

    const messagePart = match ? text.slice(0, match.index) : text;
    const notesPart = match ? text.slice(match.index + match[0].length) : '';

    const message = messagePart
        .replace(ANY_LINK, '')
        .replace(/[ \t]+([.,;:!?])/g, '$1')
        .trim();

    const trimmedNotes = notesPart.trim();
    if (!trimmedNotes) return { message, notes: null, citations: [] };

    const { cleaned, citations } = checkCitations(trimmedNotes, prompt);
    return { message, notes: cleaned || null, citations };
}
