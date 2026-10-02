/**
 * Pure readers for the two reference documents the Project Management page shows: DESIGN.md (YAML
 * front matter of design tokens, then prose) and docs/ENGINEERING.md (numbered `##` sections).
 * Kept dependency-free so the page can read the Markdown as-is, with no second copy to keep in step.
 */

export interface DocSection {
  /** The `## ` heading text. */
  title: string;
  /** Everything under it up to the next `## `, trimmed. */
  body: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, Record<string, string>>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  components: Record<string, Record<string, string>>;
}

export interface DesignRule {
  name: string;
  text: string;
}

export interface DesignDoc {
  name: string;
  description: string;
  tokens: DesignTokens;
  /** The prose after the front matter, split on `## `. */
  sections: DocSection[];
  /** "The X Rule." paragraphs from anywhere in the prose. */
  rules: DesignRule[];
  dos: string[];
  donts: string[];
}

const unquote = (value: string) => value.trim().replace(/^"(.*)"$/s, '$1').replace(/\\"/g, '"');

/** Splits on `## ` headings, ignoring any inside code fences. Text before the first heading is dropped. */
export function splitDocSections(markdown: string): DocSection[] {
  const sections: DocSection[] = [];
  let current: { title: string; lines: string[] } | null = null;
  let inFence = false;
  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (line.trimStart().startsWith('```')) inFence = !inFence;
    const heading = inFence ? null : /^## (.+)$/.exec(line);
    if (heading) {
      if (current) sections.push({ title: current.title, body: current.lines.join('\n').trim() });
      current = { title: heading[1]!.trim(), lines: [] };
    } else current?.lines.push(line);
  }
  if (current) sections.push({ title: current.title, body: current.lines.join('\n').trim() });
  return sections;
}

/**
 * Reads the two-level YAML subset DESIGN.md uses: top-level keys, each holding either `name: value`
 * pairs or `name:` blocks of `key: value` pairs. Values keep their `{colors.x}` references as text.
 */
function parseFrontMatter(raw: string): { data: Record<string, string | Record<string, string | Record<string, string>>>; rest: string } {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, rest: text };

  const data: Record<string, string | Record<string, string | Record<string, string>>> = {};
  let top: string | null = null;
  let sub: string | null = null;
  for (const line of match[1]!.split('\n')) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const pair = /^\s*([^:]+):\s*(.*)$/.exec(line);
    if (!pair) continue;
    const key = pair[1]!.trim();
    const value = pair[2]!;
    if (indent === 0) {
      top = key;
      sub = null;
      if (value) data[key] = unquote(value);
      else data[key] = {};
    } else if (top && typeof data[top] === 'object') {
      const group = data[top] as Record<string, string | Record<string, string>>;
      if (indent <= 2) {
        if (value) group[key] = unquote(value);
        else {
          group[key] = {};
          sub = key;
        }
      } else if (sub && typeof group[sub] === 'object') {
        (group[sub] as Record<string, string>)[key] = unquote(value);
      }
    }
  }
  return { data, rest: text.slice(match[0].length) };
}

const flat = (value: unknown): Record<string, string> =>
  typeof value === 'object' && value
    ? Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'string')) as Record<string, string>
    : {};
const nested = (value: unknown): Record<string, Record<string, string>> =>
  typeof value === 'object' && value
    ? Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'object')) as Record<string, Record<string, string>>
    : {};

function listItems(body: string, heading: RegExp): string[] {
  const start = body.search(heading);
  if (start < 0) return [];
  const after = body.slice(start).split('\n').slice(1);
  const items: string[] = [];
  for (const line of after) {
    if (/^###? /.test(line)) break;
    const bullet = /^- (.+)$/.exec(line);
    if (bullet) items.push(bullet[1]!);
    else if (items.length && line.startsWith('  ') && line.trim()) items[items.length - 1] += ` ${line.trim()}`;
  }
  return items;
}

export function parseDesignDoc(markdown: string): DesignDoc {
  const { data, rest } = parseFrontMatter(markdown);
  const prose = rest.replace(/^# .+\n/, '');
  const sections = splitDocSections(prose);

  const rules: DesignRule[] = [];
  for (const match of prose.matchAll(/\*\*(The [^*]+? Rule)\.\*\*\s+([^\n]+)/g)) rules.push({ name: match[1]!, text: match[2]! });

  const dosSection = sections.find((s) => /^Do's and Don'ts/i.test(s.title))?.body ?? '';
  return {
    name: typeof data.name === 'string' ? data.name : 'Design system',
    description: typeof data.description === 'string' ? data.description : '',
    tokens: {
      colors: flat(data.colors),
      typography: nested(data.typography),
      rounded: flat(data.rounded),
      spacing: flat(data.spacing),
      components: nested(data.components),
    },
    sections,
    rules,
    dos: listItems(dosSection, /^### Do:/m),
    donts: listItems(dosSection, /^### Don't:/m),
  };
}
