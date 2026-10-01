import { mapOutsideCode, splitSections } from './kb-markdown';
import type { KbCategory } from './kb.schema';

/**
 * Knowledge Center search. Runs in the browser over the already-loaded SOPs
 * (a handful of short documents), so typing gives instant, section-level
 * results without a round trip. Pure and dependency-free on purpose: if the
 * corpus ever outgrows this, the same function can back a server endpoint.
 */

export interface KbIndexedSection {
  anchor: string;
  heading: string;
  /** Plain text: Markdown syntax and [[link]] brackets removed. */
  text: string;
  hasTodo: boolean;
}

export interface KbIndexedDocument {
  slug: string;
  title: string;
  category: KbCategory;
  sections: KbIndexedSection[];
}

/** Markdown → readable plain text, good enough for matching and snippets. */
export function toPlainText(markdown: string): string {
  return mapOutsideCode(markdown, (text) =>
    text
      .replace(/\[\[([a-z0-9-]+)(?:#([a-z0-9-]+))?\]\]/g, (_m, slug: string, anchor?: string) => (anchor ? anchor.replace(/-/g, ' ') : slug.replace(/-/g, ' ')))
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
      .replace(/^\s*\|?\s*[-:| ]+\|[-:| ]*$/gm, '')
      .replace(/\|/g, ' ')
      .replace(/[*_~]/g, '')
      .replace(/^#{1,6}\s+/gm, ''),
  )
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function indexKbDocument(doc: { slug: string; title: string; category: KbCategory; markdown: string }): KbIndexedDocument {
  const body = doc.markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    sections: splitSections(body).map((section) => ({
      anchor: section.anchor,
      heading: section.heading,
      text: toPlainText(section.markdown),
      hasTodo: section.hasTodo,
    })),
  };
}

export interface KbSnippetPart {
  text: string;
  hit: boolean;
}

export interface KbSearchHit {
  slug: string;
  title: string;
  category: KbCategory;
  /** Null when the match is on the document title alone. */
  sectionAnchor: string | null;
  sectionHeading: string | null;
  hasTodo: boolean;
  score: number;
  snippet: KbSnippetPart[];
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}-]/gu, ''))
    .filter((token) => token.length > 0);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SNIPPET_RADIUS = 70;

function buildSnippet(text: string, tokens: string[]): KbSnippetPart[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const first = tokens.map((token) => lower.indexOf(token)).filter((index) => index >= 0).sort((a, b) => a - b)[0];
  const start = first === undefined ? 0 : Math.max(0, first - SNIPPET_RADIUS / 2);
  const end = Math.min(text.length, start + SNIPPET_RADIUS * 2);
  const window = `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;

  if (tokens.length === 0) return [{ text: window, hit: false }];

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
  return window
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, hit: tokens.includes(part.toLowerCase()) }));
}

/**
 * Every query word must appear somewhere in a section (or in its document's
 * title). Title and heading matches outrank body matches; ties keep the
 * library's own order so results don't shuffle as you type.
 */
export function searchKb(docs: KbIndexedDocument[], query: string, limit = 20): KbSearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const hits: (KbSearchHit & { order: number })[] = [];
  let order = 0;

  for (const doc of docs) {
    const title = doc.title.toLowerCase();
    const titleHasAll = tokens.every((token) => title.includes(token));

    for (const section of doc.sections) {
      order += 1;
      const heading = section.heading.toLowerCase();
      const text = section.text.toLowerCase();
      const haystack = `${title} ${heading} ${text}`;
      if (!tokens.every((token) => haystack.includes(token))) continue;

      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 10;
        if (heading.includes(token)) score += 6;
        const occurrences = text.split(token).length - 1;
        score += Math.min(occurrences, 3);
      }

      hits.push({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        sectionAnchor: section.anchor || null,
        sectionHeading: section.heading || null,
        hasTodo: section.hasTodo,
        score,
        snippet: buildSnippet(section.text, tokens),
        order,
      });
    }

    // A title-only match (document has no matching section text) still deserves a result.
    if (titleHasAll && !hits.some((hit) => hit.slug === doc.slug)) {
      order += 1;
      hits.push({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        sectionAnchor: null,
        sectionHeading: null,
        hasTodo: false,
        score: 10 * tokens.length,
        snippet: [],
        order,
      });
    }
  }

  return hits
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map(({ order: _order, ...hit }) => hit);
}
