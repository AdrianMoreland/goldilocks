import { findLinks, type KbLinkRef, type KbSection } from './kb-markdown';
import { toPlainText } from './kb-search';
import { termRegExp, type KbTerm } from './kb-terms';

/**
 * How a procedure page lays out an SOP's Markdown (docs/KNOWLEDGE-CENTER-LAYOUT
 * rules, spec section 6). Everything here is a pure function of the text, so the
 * reader renders the same thing on the server and in the browser and each rule
 * has a unit test against the real SOPs.
 *
 * The SOP files are not changed to suit these rules. A rule that doesn't match
 * simply leaves the section as ordinary Markdown, so an unknown SOP never fails.
 */

// ── 1. Markdown → blocks ───────────────────────────────────────────────────

export interface KbListItem {
  /** The item's Markdown, with its own indentation removed (nested lists stay inside it). */
  markdown: string;
  /** Plain text, for the rules that look at wording and length. */
  text: string;
  hasNested: boolean;
}

export type KbBlock =
  | { type: 'paragraph'; markdown: string }
  | { type: 'list'; ordered: boolean; items: KbListItem[]; raw: string }
  | { type: 'other'; markdown: string };

const MARKER = /^(\d{1,3}[.)]|[-*+])\s+(.*)$/;
const FENCE = /^\s*```/;
const HEADING = /^\s{0,3}#{1,6}\s/;
const TABLE_ROW = /^\s*\|/;
const QUOTE = /^\s*>/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

const startsAnotherBlock = (line: string) => HEADING.test(line) || FENCE.test(line) || TABLE_ROW.test(line) || QUOTE.test(line) || RULE.test(line);

function indentOf(line: string): number {
  return /^ */.exec(line)?.[0].length ?? 0;
}

function dedent(lines: string[]): string[] {
  const indents = lines.filter((line) => line.trim() !== '').map(indentOf);
  const cut = indents.length > 0 ? Math.min(...indents, 4) : 0;
  return lines.map((line) => line.slice(Math.min(cut, indentOf(line))));
}

/**
 * Splits Markdown into the blocks the layout rules care about: paragraphs, lists
 * and "other" (tables, headings, code, quotes). Top-level list items start at
 * column 0; anything indented belongs to the item above it.
 */
export function parseBlocks(markdown: string): KbBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: KbBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (line.trim() === '') {
      i++;
      continue;
    }

    if (FENCE.test(line)) {
      const start = i;
      i++;
      while (i < lines.length && !FENCE.test(lines[i] ?? '')) i++;
      i = Math.min(i + 1, lines.length);
      blocks.push({ type: 'other', markdown: lines.slice(start, i).join('\n') });
      continue;
    }

    if (startsAnotherBlock(line)) {
      const start = i;
      const same = (candidate: string) => (TABLE_ROW.test(line) ? TABLE_ROW.test(candidate) : QUOTE.test(line) ? QUOTE.test(candidate) : false);
      i++;
      while (i < lines.length && same(lines[i] ?? '')) i++;
      blocks.push({ type: 'other', markdown: lines.slice(start, i).join('\n') });
      continue;
    }

    const marker = MARKER.exec(line);
    if (marker) {
      const ordered = /^\d/.test(marker[1] ?? '');
      const rawStart = i;
      const itemLines: string[][] = [];

      while (i < lines.length) {
        const current = lines[i] ?? '';
        const item = MARKER.exec(current);

        if (item && !RULE.test(current)) {
          if (/^\d/.test(item[1] ?? '') !== ordered) break;
          itemLines.push([item[2] ?? '']);
          i++;
          continue;
        }

        if (current.trim() === '') {
          // A blank line ends the list unless the next text still belongs to it.
          let next = i + 1;
          while (next < lines.length && (lines[next] ?? '').trim() === '') next++;
          const after = lines[next] ?? '';
          const continues = next < lines.length && (indentOf(after) > 0 || (MARKER.test(after) && /^\d/.test(MARKER.exec(after)?.[1] ?? '') === ordered && !RULE.test(after)));
          if (!continues) break;
          itemLines[itemLines.length - 1]?.push('');
          i++;
          continue;
        }

        const lazy = indentOf(current) === 0 && (lines[i - 1] ?? '').trim() !== '' && !startsAnotherBlock(current);
        if (indentOf(current) > 0 || lazy) {
          itemLines[itemLines.length - 1]?.push(current);
          i++;
          continue;
        }
        break;
      }

      const items = itemLines.map((parts): KbListItem => {
        const [first = '', ...rest] = parts;
        const body = [first, ...dedent(rest)].join('\n').replace(/\n+$/, '');
        return { markdown: body, text: toPlainText(body), hasNested: rest.some((part) => MARKER.test(part.trim())) };
      });
      blocks.push({ type: 'list', ordered, items, raw: lines.slice(rawStart, i).join('\n').replace(/\n+$/, '') });
      continue;
    }

    const start = i;
    i++;
    while (i < lines.length && (lines[i] ?? '').trim() !== '' && !MARKER.test(lines[i] ?? '') && !startsAnotherBlock(lines[i] ?? '')) i++;
    blocks.push({ type: 'paragraph', markdown: lines.slice(start, i).join('\n') });
  }

  return blocks;
}

// ── 2. Section kinds ───────────────────────────────────────────────────────

export type KbSectionKind = 'lead' | 'related' | 'next' | 'before' | 'stop' | 'proposal' | 'steps' | 'ref';

const LEAD_ANCHORS = new Set(['purpose', 'summary']);
const STOP_HEADING = /^(stop|when to stop|if it does not match|if the payment)/i;

/** What a section is for, from its heading and whether it holds a numbered list. */
export function classifySection(section: KbSection, index: number, blocks: KbBlock[] = parseBlocks(section.markdown)): KbSectionKind {
  const heading = section.heading.toLowerCase();
  if (index === 0 && LEAD_ANCHORS.has(section.anchor)) return 'lead';
  if (section.anchor === 'related') return 'related';
  if (section.anchor === 'next') return 'next';
  if (heading.startsWith('before you start')) return 'before';
  if (STOP_HEADING.test(heading)) return 'stop';
  if (section.isProposed || heading.startsWith('proposed controls')) return 'proposal';
  if (blocks.some((block) => block.type === 'list' && block.ordered)) return 'steps';
  return 'ref';
}

// ── 3. Render blocks ───────────────────────────────────────────────────────

/** How a run of Markdown is styled: ordinary text, a numbered rail, lettered cards, tick boxes, or ✕/✓ rules. */
export type KbMarkdownVariant = 'plain' | 'steps' | 'miniflow' | 'checklist' | 'rules';

export type KbRenderBlock =
  | {
      type: 'markdown';
      markdown: string;
      variant: KbMarkdownVariant;
      /** For `steps`: the line each item starts on in `markdown`, so a chip can scroll to "step 3". */
      itemLines?: number[];
    }
  | { type: 'stop'; markdown: string }
  | { type: 'form'; leadIns: string[]; rows: KbFormRow[] }
  | { type: 'rightwrong'; right: string; wrong: string };

export interface KbFormRow {
  label: string;
  value: string;
  /** The row says "negative", "never" or "do not" — the one that goes wrong. */
  danger: boolean;
}

const STOP_STEP = /^[\s*_]*(stop|do not|never)\b/i;
const RULE_NO = /^[\s*_]*(do not|don[’']t|never|stop)\b/i;
const RULE_YES = /^[\s*_]*always\b/i;
const CHECK_LEAD_IN = /check each|check that|make sure|before you/i;
const RIGHT_WRONG = /^Right:\s*([\s\S]*?)\s+Wrong:\s*([\s\S]*)$/;

/** A step that is a warning ("Do not accept the cash until…"), so it gets the STOP look. */
export function isStopStep(text: string): boolean {
  return STOP_STEP.test(text);
}

/** Whether a bullet is a "don't" (no), an "always" (yes) or neither. */
export function ruleTone(text: string): 'no' | 'yes' | 'neutral' {
  if (RULE_NO.test(text)) return 'no';
  if (RULE_YES.test(text)) return 'yes';
  return 'neutral';
}

/** "Label: value" with the colon inside the first 34 characters. */
function splitField(item: KbListItem): { label: string; value: string } | null {
  const colon = item.text.indexOf(':');
  if (colon <= 1 || colon >= 34) return null;
  const match = /^([^:\n]{2,34}):\s*([\s\S]*)$/.exec(item.markdown);
  if (!match) return null;
  const label = (match[1] ?? '').replace(/[*_`]/g, '').trim();
  const value = (match[2] ?? '').replace(/^\*+\s*/, '').replace(/^([*_`[]*)([a-z])/, (_m, lead: string, ch: string) => lead + ch.toUpperCase());
  return label ? { label, value } : null;
}

function emitList(items: KbListItem[], ordered: boolean): { markdown: string; itemLines: number[] } {
  const lines: string[] = [];
  const itemLines: number[] = [];
  items.forEach((item, index) => {
    itemLines.push(lines.length + 1);
    const [first = '', ...rest] = item.markdown.split('\n');
    lines.push(`${ordered ? `${index + 1}.` : '-'} ${first}`);
    for (const line of rest) lines.push(line.trim() === '' ? '' : `   ${line}`);
  });
  return { markdown: lines.join('\n'), itemLines };
}

/** The numbered-list rules. Form table, then mini flow, then (with an optional leading STOP) the steps rail. */
function renderOrdered(items: KbListItem[], out: KbRenderBlock[]) {
  const fields = items.map(splitField);
  const fieldy = fields.filter((field) => field !== null).length;

  if (items.length >= 4 && fieldy / items.length >= 0.7) {
    const leadIns: string[] = [];
    const rows: KbFormRow[] = [];
    items.forEach((item, index) => {
      const field = fields[index];
      if (!field) {
        leadIns.push(item.markdown);
        return;
      }
      rows.push({ ...field, danger: /negative|never|do not/i.test(item.text) });
    });
    out.push({ type: 'form', leadIns, rows });
    return;
  }

  if (items.length >= 3 && items.length <= 6 && items.every((item) => item.text.length <= 80 && !item.hasNested)) {
    out.push({ type: 'markdown', variant: 'miniflow', ...emitList(items, true) });
    return;
  }

  let rest = items;
  const first = items[0];
  if (items.length > 2 && first && isStopStep(first.text)) {
    out.push({ type: 'stop', markdown: first.markdown });
    rest = items.slice(1);
  }
  out.push({ type: 'markdown', variant: 'steps', ...emitList(rest, true) });
}

/** The bullet-list rules: tick boxes, then ✕/✓ rules, otherwise untouched. */
function renderBullets(block: Extract<KbBlock, { type: 'list' }>, previous: KbBlock | undefined, kind: KbSectionKind, out: KbRenderBlock[]) {
  const introduced = previous?.type === 'paragraph' && CHECK_LEAD_IN.test(toPlainText(previous.markdown));
  if (kind === 'before' || introduced) {
    out.push({ type: 'markdown', variant: 'checklist', markdown: emitList(block.items, false).markdown });
  } else if (block.items.some((item) => ruleTone(item.text) !== 'neutral')) {
    out.push({ type: 'markdown', variant: 'rules', markdown: emitList(block.items, false).markdown });
  } else {
    out.push({ type: 'markdown', variant: 'plain', markdown: block.raw });
  }
}

/** A section body as render blocks. Adjacent plain Markdown is merged so it renders as one piece. */
export function buildBlocks(markdown: string, kind: KbSectionKind): KbRenderBlock[] {
  const blocks = parseBlocks(markdown);
  const out: KbRenderBlock[] = [];
  let plain: string[] = [];
  const flush = () => {
    if (plain.length > 0) out.push({ type: 'markdown', variant: 'plain', markdown: plain.join('\n\n') });
    plain = [];
  };

  blocks.forEach((block, index) => {
    if (block.type === 'paragraph') {
      const pair = RIGHT_WRONG.exec(block.markdown.replace(/\n/g, ' '));
      if (pair) {
        flush();
        out.push({ type: 'rightwrong', right: pair[1] ?? '', wrong: pair[2] ?? '' });
      } else {
        plain.push(block.markdown);
      }
    } else if (block.type === 'other') {
      plain.push(block.markdown);
    } else {
      const previous = blocks[index - 1];
      const sink: KbRenderBlock[] = [];
      if (block.ordered) renderOrdered(block.items, sink);
      else renderBullets(block, previous, kind, sink);

      // A bullet list that stays plain is just Markdown: keep it in the run it belongs to.
      const only = sink[0];
      if (sink.length === 1 && only?.type === 'markdown' && only.variant === 'plain') {
        plain.push(only.markdown);
      } else {
        flush();
        out.push(...sink);
      }
    }
  });

  flush();
  return out;
}

// ── 4. Whole article ───────────────────────────────────────────────────────

export interface KbLayoutEntry {
  section: KbSection;
  kind: KbSectionKind;
  blocks: KbRenderBlock[];
  /** Long reference sections and proposals start folded, with a one-line preview. */
  collapsed: boolean;
  preview: string;
  itemCount: number;
}

export interface KbGlanceChip {
  label: string;
  /** The section to jump to. */
  anchor: string;
  /** When the chip stands for step N of a numbered list, so the page can scroll to and flash that step. */
  step?: number;
  stop?: boolean;
}

export interface KbArticleLayout {
  /** One entry per section, in order: every section is accounted for. */
  entries: KbLayoutEntry[];
  /** "Sources: …" lifted out of the lead, shown as a footnote. */
  sources: string | null;
  glance: KbGlanceChip[];
  /** The first link in the "Next" section, if it has one. */
  next: KbLinkRef | null;
  /** "On this page": every section with a heading except the lead and Related. */
  contents: { anchor: string; heading: string; hasTodo: boolean }[];
}

export const COLLAPSE_ABOVE_CHARACTERS = 700;

/** Pulls a "Source(s): …" line (and the lines that continue it) out of Markdown. */
export function extractSources(markdown: string): { markdown: string; sources: string | null } {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => /^\s*\**sources?:\**/i.test(line));
  if (start < 0) return { markdown, sources: null };

  let end = start + 1;
  while (end < lines.length && (lines[end] ?? '').trim() !== '') end++;
  const text = toPlainText(lines.slice(start, end).join(' '))
    .replace(/^sources?:\s*/i, '')
    .replace(/\.$/, '')
    .trim();
  return { markdown: [...lines.slice(0, start), ...lines.slice(end)].join('\n').trim(), sources: text || null };
}

function shorten(text: string, max: number): string {
  const clean = text.replace(/\s*\([^)]*\)?/g, '').split(/[.:]/)[0]?.trim() ?? '';
  return clean.length > max ? `${clean.slice(0, max - 2).replace(/\s+\S*$/, '')}…` : clean;
}

function firstSentence(text: string): string {
  return (text.split(/(?<=[.:])\s/)[0] ?? '').slice(0, 120);
}

function countItems(blocks: KbBlock[]): number {
  return blocks.reduce((total, block) => total + (block.type === 'list' ? block.items.length : 0), 0);
}

function buildGlance(entries: KbLayoutEntry[], parsed: Map<string, KbBlock[]>): KbGlanceChip[] {
  const procedure = entries.filter((entry) => !['lead', 'related', 'next', 'before', 'proposal'].includes(entry.kind));

  // 1. The main numbered list, when the procedure has one of a readable size.
  const main = procedure.find((entry) => entry.kind === 'steps' && ['steps', 'the-steps', 'workflow'].includes(entry.section.anchor));
  const mainList = main ? parsed.get(main.section.anchor)?.find((block) => block.type === 'list' && block.ordered) : undefined;
  if (main && mainList?.type === 'list' && mainList.items.length >= 4 && mainList.items.length <= 9) {
    const isForm = mainList.items.filter((item) => splitField(item)).length / mainList.items.length >= 0.7;
    if (!isForm) {
      return mainList.items.map((item, index) => ({ label: shorten(item.text, 46), anchor: main.section.anchor, step: index + 1 }));
    }
  }

  // 2. Otherwise the section headings, with a red chip for the STOP section.
  const parts = procedure.filter((entry) => entry.kind !== 'stop');
  if (parts.length >= 3 && !(parts.every((entry) => entry.kind === 'ref') && parts.length > 6)) {
    const chips: KbGlanceChip[] = parts.slice(0, 7).map((entry) => ({ label: entry.section.heading, anchor: entry.section.anchor }));
    const stop = procedure.find((entry) => entry.kind === 'stop');
    if (stop) chips.push({ label: stop.section.heading, anchor: stop.section.anchor, stop: true });
    return chips;
  }

  // 3. Otherwise the first numbered list there is.
  const firstSteps = procedure.find((entry) => entry.kind === 'steps');
  const list = firstSteps ? parsed.get(firstSteps.section.anchor)?.find((block) => block.type === 'list' && block.ordered) : undefined;
  if (firstSteps && list?.type === 'list') {
    return list.items.slice(0, 9).map((item, index) => ({ label: shorten(item.text.replace(/\s*\(see.*$/i, ''), 46), anchor: firstSteps.section.anchor, step: index + 1 }));
  }
  return [];
}

/** Everything the procedure page needs to know about an article's sections. Never throws. */
export function buildArticleLayout(sections: KbSection[]): KbArticleLayout {
  let sources: string | null = null;
  const parsed = new Map<string, KbBlock[]>();

  const entries = sections.map((section, index): KbLayoutEntry => {
    let markdown = section.markdown;
    const provisional = classifySection(section, index);
    if (provisional === 'lead') {
      const lifted = extractSources(markdown);
      markdown = lifted.markdown;
      sources = lifted.sources;
    }

    const blocks = parseBlocks(markdown);
    const kind = classifySection(section, index, blocks);
    parsed.set(section.anchor, blocks);
    const text = toPlainText(markdown);

    return {
      section,
      kind,
      blocks: buildBlocks(markdown, kind),
      collapsed: (kind === 'ref' && text.length > COLLAPSE_ABOVE_CHARACTERS) || kind === 'proposal',
      preview: firstSentence(text),
      itemCount: countItems(blocks),
    };
  });

  const nextEntry = entries.find((entry) => entry.kind === 'next');
  return {
    entries,
    sources,
    glance: buildGlance(entries, parsed),
    next: nextEntry ? (findLinks(nextEntry.section.markdown)[0] ?? null) : null,
    contents: entries
      .filter((entry) => entry.kind !== 'lead' && entry.kind !== 'related' && entry.section.heading && entry.section.anchor)
      .map((entry) => ({ anchor: entry.section.anchor, heading: entry.section.heading, hasTodo: entry.section.hasTodo })),
  };
}

// ── 5. Term links ──────────────────────────────────────────────────────────

/**
 * A section links each concept at its first mention only. The Markdown is now
 * rendered in several pieces, so each term is handed to the first piece that
 * mentions it, and to no other.
 */
export function shareTermsAcrossBlocks(blocks: KbRenderBlock[], terms: KbTerm[]): Map<number, KbTerm[]> {
  const shared = new Map<number, KbTerm[]>();
  let pending = terms;

  blocks.forEach((block, index) => {
    if (block.type !== 'markdown' || pending.length === 0) return;
    const text = toPlainText(block.markdown);
    const taken = pending.filter((term) => {
      const pattern = termRegExp(term);
      pattern.lastIndex = 0;
      return pattern.test(text);
    });
    if (taken.length === 0) return;
    shared.set(index, taken);
    pending = pending.filter((term) => !taken.includes(term));
  });

  return shared;
}
