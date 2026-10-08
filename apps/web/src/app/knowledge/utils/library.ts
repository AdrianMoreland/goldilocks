import {
    extractSources,
    indexKbDocument,
    kbArticlePath,
    splitSections,
    toPlainText,
    type KbDocument,
    type KbIndexedDocument,
    type KbSection,
    type ResolvedKbLink,
} from '@goldilocks/shared-types';

export interface KnowledgeArticle {
    doc: KbDocument;
    sections: KbSection[];
    /** How many sections still contain an unconfirmed `[TODO: …]` fact. */
    todoSectionCount: number;
    /** One plain-text line for the library list — the opening of the first section, without its Sources line. */
    summary: string;
}

export interface KnowledgeLibrary {
    /** Sorted by title; topics (utils/topics.ts) decide how they are grouped. */
    articles: KnowledgeArticle[];
    bySlug: Map<string, KnowledgeArticle>;
    searchIndex: KbIndexedDocument[];
    /** Resolves a `[[slug#section]]` reference; null when the SOP (or section) isn't in the library. */
    resolveLink: (ref: { slug: string; anchor?: string | null }, fromSlug: string) => ResolvedKbLink | null;
}

const SUMMARY_LENGTH = 190;

function summarise(sections: KbSection[]): string {
    const first = sections.find((section) => section.markdown.trim() !== '');
    if (!first) return '';
    // The Purpose ends with a "Sources: …" line; it is a footnote, not what the procedure is for.
    const text = toPlainText(extractSources(first.markdown).markdown);
    if (text.length <= SUMMARY_LENGTH) return text;
    const cut = text.slice(0, SUMMARY_LENGTH);
    return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 60))}…`;
}

export function buildLibrary(documents: KbDocument[]): KnowledgeLibrary {
    const articles = documents
        .map((doc): KnowledgeArticle => {
            const sections = splitSections(doc.markdown);
            return {
                doc,
                sections,
                todoSectionCount: sections.filter((section) => section.hasTodo).length,
                summary: summarise(sections),
            };
        })
        .sort((a, b) => a.doc.title.localeCompare(b.doc.title));

    const bySlug = new Map(articles.map((article) => [article.doc.slug, article]));

    return {
        articles,
        bySlug,
        searchIndex: articles.map((article) => indexKbDocument(article.doc)),
        resolveLink: (ref, fromSlug) => {
            const target = bySlug.get(ref.slug);
            if (!target) return null;

            if (!ref.anchor) return { label: target.doc.title, href: kbArticlePath(ref.slug) };

            const section = target.sections.find((candidate) => candidate.anchor === ref.anchor);
            if (!section) return null;

            return {
                label: ref.slug === fromSlug ? section.heading : `${target.doc.title} › ${section.heading}`,
                href: kbArticlePath(ref.slug, ref.anchor),
            };
        },
    };
}
