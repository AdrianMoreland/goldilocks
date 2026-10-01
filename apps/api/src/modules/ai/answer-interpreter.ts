import {
    findLinks,
    type AiAnswerStatus,
    type AiCitation,
} from '@goldilocks/shared-types';
import { NO_ANSWER_MARKER, type BuiltPrompt } from './prompt-builder';

export interface InterpretedAnswer {
    answer: string;
    status: AiAnswerStatus;
    citations: AiCitation[];
}

const REFUSAL_PREFIX = new RegExp(`^\\s*${NO_ANSWER_MARKER}\\s*:?\\s*`, 'i');
const CITATION = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9-]+))?\]\]/g;

const DEFAULT_REFUSAL =
    'The approved procedures do not cover this. Ask a manager.';

/**
 * Checks every `[[slug#section]]` in a text against the library: the real
 * ones become citations, and a link the library doesn't know is removed so a
 * made-up reference never reaches the screen.
 */
export function checkCitations(
    text: string,
    prompt: BuiltPrompt,
): { cleaned: string; citations: AiCitation[] } {
    const isValid = (slug: string, anchor: string | null): boolean =>
        anchor
            ? prompt.sections.has(`${slug}#${anchor}`)
            : prompt.titles.has(slug);

    const citations: AiCitation[] = [];
    const seen = new Set<string>();
    for (const link of findLinks(text)) {
        const key = `${link.slug}#${link.anchor ?? ''}`;
        if (seen.has(key) || !isValid(link.slug, link.anchor)) continue;
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
        .replace(CITATION, (match, slug: string, anchor?: string) =>
            isValid(slug, anchor ?? null) ? match : '',
        )
        .replace(/[ \t]+([.,;:!?])/g, '$1')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    return { cleaned, citations };
}

/**
 * Turns the model's raw text into something safe to show: decides whether it
 * answered or declined, and checks every citation against the library.
 * The model is told to cite, but never trusted to: a citation that doesn't
 * point at a real SOP section is removed, and an answer left with none is
 * reported as 'uncited' so the UI can warn and the unanswered report can count it.
 */
export function interpretAnswer(
    raw: string,
    prompt: BuiltPrompt,
): InterpretedAnswer {
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
