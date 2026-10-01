import { KbFrontmatterSchema, type KbFrontmatter } from './kb.schema';

/**
 * Pure SOP-Markdown helpers, shared by the importer (validation), the API and
 * the web reader. Section anchors and link rewriting live here, once, so a
 * `[[slug#section]]` link can never resolve differently in two places.
 * Format spec: docs/sops/00-README.md.
 */

// ── Code-span awareness ────────────────────────────────────────────────────
// The README documents its own syntax (`[[slug]]`, `[TODO: …]`) inside code
// spans; those must not count as real links or unconfirmed facts.

const CODE_SEGMENT = /(```[\s\S]*?```|`[^`\n]*`)/g;

/** Applies `fn` to the text outside fenced blocks and inline code, leaving code untouched. */
export function mapOutsideCode(markdown: string, fn: (text: string) => string): string {
  return markdown
    .split(CODE_SEGMENT)
    .map((part, index) => (index % 2 === 1 ? part : fn(part)))
    .join('');
}

function textOutsideCode(markdown: string): string {
  return markdown
    .split(CODE_SEGMENT)
    .filter((_, index) => index % 2 === 0)
    .join('\n');
}

// ── Frontmatter ────────────────────────────────────────────────────────────

export interface RawKbFile {
  data: Record<string, string>;
  body: string;
}

/** Flat `key: value` frontmatter between `---` fences. Nothing nested — the SOP format doesn't need it. */
export function splitFrontmatter(raw: string): RawKbFile | null {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) return null;

  const data: Record<string, string> = {};
  const [, header = '', body = ''] = match;
  for (const line of header.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colon = trimmed.indexOf(':');
    if (colon < 1) continue;
    const key = trimmed.slice(0, colon).trim();
    const value = trimmed
      .slice(colon + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, '$2');
    data[key] = value;
  }
  return { data, body: body.trim() };
}

// ── Sections ───────────────────────────────────────────────────────────────

/** "Identity check" → "identity-check", "Customer safe (CST Safe)" → "customer-safe-cst-safe". */
export function headingAnchor(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface KbSection {
  /** Citation anchor, unique within the document. Empty for the text before the first heading. */
  anchor: string;
  heading: string;
  /** Section body without its heading line. */
  markdown: string;
  /** Contains at least one `[TODO: …]` — the fact is unconfirmed, so nobody (human or AI) should rely on it. */
  hasTodo: boolean;
  /** The text of each TODO, for showing "what needs confirming". */
  todos: string[];
  /** "Proposed controls (not yet in force)" — intended practice, not current practice. */
  isProposed: boolean;
}

const TODO_PATTERN = /\[TODO:?\s*([^\]]*)\]/gi;

export function findTodos(markdown: string): string[] {
  const found: string[] = [];
  for (const match of textOutsideCode(markdown).matchAll(TODO_PATTERN)) {
    found.push((match[1] ?? '').trim());
  }
  return found;
}

function plainHeading(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
}

/** Splits at level-2 headings (the README's "section"); deeper headings stay inside their section. */
export function splitSections(body: string): KbSection[] {
  const lines = body.split('\n');
  const raw: { heading: string; lines: string[] }[] = [{ heading: '', lines: [] }];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const heading = !inFence ? /^#{1,2}\s+(.+?)\s*#*\s*$/.exec(line) : null;
    if (heading) {
      raw.push({ heading: plainHeading(heading[1] ?? ''), lines: [] });
    } else {
      raw[raw.length - 1]?.lines.push(line);
    }
  }

  const used = new Map<string, number>();
  return raw
    .filter((section, index) => index > 0 || section.lines.join('').trim() !== '')
    .map((section) => {
      const markdown = section.lines.join('\n').trim();
      const base = headingAnchor(section.heading);
      let anchor = base;
      if (base) {
        const seen = used.get(base) ?? 0;
        used.set(base, seen + 1);
        if (seen > 0) anchor = `${base}-${seen + 1}`;
      }
      const todos = findTodos(markdown);
      return {
        anchor,
        heading: section.heading,
        markdown,
        hasTodo: todos.length > 0,
        todos,
        isProposed: /proposed controls/i.test(section.heading),
      };
    });
}

// ── Links ──────────────────────────────────────────────────────────────────

export interface KbLinkRef {
  slug: string;
  anchor: string | null;
}

const LINK_PATTERN = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9-]+))?\]\]/g;

/** Every `[[slug]]` / `[[slug#section]]` outside code. */
export function findLinks(markdown: string): KbLinkRef[] {
  return [...textOutsideCode(markdown).matchAll(LINK_PATTERN)].map((m) => ({ slug: m[1] ?? '', anchor: m[2] ?? null }));
}

export interface ResolvedKbLink {
  label: string;
  href: string;
}

/** Path of an article in the web app — also what the README says the importer rewrites links to. */
export function kbArticlePath(slug: string, anchor?: string | null): string {
  return `/knowledge/articles/${slug}${anchor ? `#${anchor}` : ''}`;
}

/** Marker href for a link whose SOP isn't in the Knowledge Center (yet). The web app renders it as a muted chip. */
export const KB_UNRESOLVED_HREF_PREFIX = '#unresolved-sop:';

/**
 * Turns `[[slug#section]]` into an ordinary Markdown link. `resolve` supplies
 * the label/href (it knows titles and the current document); returning null
 * marks the link as unresolved rather than leaving raw brackets on screen.
 */
export function rewriteKbLinks(markdown: string, resolve: (ref: KbLinkRef) => ResolvedKbLink | null): string {
  return mapOutsideCode(markdown, (text) =>
    text.replace(LINK_PATTERN, (_raw, slug: string, anchor?: string) => {
      const ref = { slug, anchor: anchor ?? null };
      const resolved = resolve(ref);
      return resolved
        ? `[${resolved.label}](${resolved.href})`
        : `[${slug}](${KB_UNRESOLVED_HREF_PREFIX}${slug})`;
    }),
  );
}

// ── Whole-document parsing ─────────────────────────────────────────────────

export interface ParsedKbDocument {
  frontmatter: KbFrontmatter;
  body: string;
  sections: KbSection[];
  links: KbLinkRef[];
}

export type ParseKbResult = { ok: true; doc: ParsedKbDocument } | { ok: false; errors: string[] };

export function parseKbDocument(raw: string): ParseKbResult {
  const file = splitFrontmatter(raw);
  if (!file) return { ok: false, errors: ['Missing frontmatter: the file must start with a --- block.'] };

  const frontmatter = KbFrontmatterSchema.safeParse(file.data);
  if (!frontmatter.success) {
    return {
      ok: false,
      errors: frontmatter.error.issues.map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`),
    };
  }

  return {
    ok: true,
    doc: {
      frontmatter: frontmatter.data,
      body: file.body,
      sections: splitSections(file.body),
      links: findLinks(file.body),
    },
  };
}

export interface BrokenKbLink {
  from: string;
  slug: string;
  anchor: string | null;
  reason: 'missing-document' | 'missing-section';
}

/**
 * Checks every link in a set of documents against that set. A link to a slug
 * that doesn't exist fails the import (README); a link to a section that
 * doesn't exist is the same mistake one level down.
 */
export function findBrokenLinks(docs: { slug: string; sections: KbSection[]; links: KbLinkRef[] }[]): BrokenKbLink[] {
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));
  const broken: BrokenKbLink[] = [];

  for (const doc of docs) {
    for (const link of doc.links) {
      const target = bySlug.get(link.slug);
      if (!target) {
        broken.push({ from: doc.slug, slug: link.slug, anchor: link.anchor, reason: 'missing-document' });
      } else if (link.anchor && !target.sections.some((section) => section.anchor === link.anchor)) {
        broken.push({ from: doc.slug, slug: link.slug, anchor: link.anchor, reason: 'missing-section' });
      }
    }
  }
  return broken;
}
