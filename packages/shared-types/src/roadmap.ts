import type { RoadmapEdit } from './roadmap.schema';

/**
 * Pure helpers for docs/ROADMAP.md, shared by the API (which applies edits) and the web page (which
 * reads the structure). Everything works on lines, so an edit touches only the line it means to and the
 * rest of the file, wording and spacing included, comes back untouched.
 */

export interface RoadmapTask {
  /** 0-based line in the Markdown. */
  line: number;
  checked: boolean;
  text: string;
  /** Indented non-checkbox lines under the task (evidence, caveats). */
  notes: string[];
  children: RoadmapTask[];
}

export interface RoadmapSection {
  /** `0.12`, or a slug for headings without an ID (`icebox`). Unique in the file. */
  key: string;
  /** The ID as written (`0.12`), or null. */
  id: string | null;
  title: string;
  /** Section note from the heading, e.g. "quick win; feeds charts". */
  note: string | null;
  /** `← depends: …` from the heading. */
  depends: string | null;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | null;
  /** The `# ` heading this section sits under. */
  group: string;
  /** 0-based line of the heading. */
  headingLine: number;
  /** Prose, tables and plain bullets that are not tasks. */
  body: string;
  tasks: RoadmapTask[];
}

export interface RoadmapProgress {
  done: number;
  total: number;
}

const TASK_LINE = /^(\s*)- \[( |x|X)\] (.*)$/;
const HEADING = /^(#{1,2}) (.+)$/;
const PRIORITY_EMOJI: Record<string, RoadmapSection['priority']> = { '🔴': 'P0', '🟠': 'P1', '🟡': 'P2', '⚪': 'P3' };

const indentOf = (line: string) => line.length - line.trimStart().length;
const eolOf = (markdown: string) => (markdown.includes('\r\n') ? '\r\n' : '\n');
const linesOf = (markdown: string) => markdown.split(/\r?\n/);

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseHeading(raw: string, group: string, headingLine: number, taken: Set<string>): RoadmapSection {
  let text = raw.trim();
  let priority: RoadmapSection['priority'] = null;
  for (const [emoji, level] of Object.entries(PRIORITY_EMOJI)) {
    if (text.includes(emoji)) {
      priority ??= level;
      text = text.replace(emoji, '');
    }
  }
  let depends: string | null = null;
  const arrow = text.indexOf('←');
  if (arrow >= 0) {
    depends = text.slice(arrow + 1).replace(/^\s*depends:\s*/i, '').trim() || null;
    text = text.slice(0, arrow);
  }
  let note: string | null = null;
  text = text.replace(/\*\(([^)]*)\)\*/, (_m, inner: string) => {
    note = inner.trim();
    return '';
  });
  text = text.replace(/`/g, '').replace(/\s*→\s*$/, '').replace(/\s+/g, ' ').trim();

  const idMatch = /^(\d+\.\d+)\s+(.*)$/.exec(text);
  const id = idMatch ? (idMatch[1] ?? null) : null;
  const title = idMatch ? (idMatch[2] ?? text) : text;
  const phase = /^PHASE (\d+)/.exec(title);
  let key = id ?? (phase ? `phase-${phase[1]!}` : slug(title).slice(0, 30).replace(/-$/, ''));
  while (taken.has(key)) key += '-2';
  taken.add(key);
  return { key, id, title, note, depends, priority, group, headingLine, body: '', tasks: [] };
}

/** Splits the roadmap into its `#`/`##` sections, each with its task tree. */
export function parseRoadmap(markdown: string): RoadmapSection[] {
  const lines = linesOf(markdown);
  const sections: RoadmapSection[] = [];
  const taken = new Set<string>();
  let group = '';
  let current: RoadmapSection | null = null;
  let stack: { indent: number; task: RoadmapTask }[] = [];
  let body: string[] = [];
  let inFence = false;

  const close = () => {
    if (current) current.body = body.join('\n').trim();
    body = [];
    stack = [];
  };

  lines.forEach((line, index) => {
    if (line.trimStart().startsWith('```')) inFence = !inFence;
    const heading = inFence ? null : HEADING.exec(line);
    if (heading) {
      close();
      const level = heading[1]!.length;
      const headingText = heading[2]!;
      if (level === 1) group = headingText.trim();
      // The file title is not a section; a `#` heading is, once it holds its own content (Icebox, Scaling triggers).
      current = parseHeading(headingText, level === 1 ? headingText.trim() : group, index, taken);
      if (level === 1 && index === 0) current = null;
      else sections.push(current);
      return;
    }
    if (!current) return;

    const task = inFence ? null : TASK_LINE.exec(line);
    if (task) {
      const indent = task[1]!.length;
      const node: RoadmapTask = { line: index, checked: task[2] !== ' ', text: task[3]!.trim(), notes: [], children: [] };
      while (stack.length && stack[stack.length - 1]!.indent >= indent) stack.pop();
      (stack.length ? stack[stack.length - 1]!.task.children : current.tasks).push(node);
      stack.push({ indent, task: node });
      return;
    }

    // A deeper-indented plain line belongs to the nearest shallower task above it.
    const owner = line.trim() === '' ? undefined : [...stack].reverse().find((entry) => indentOf(line) > entry.indent);
    if (owner) owner.task.notes.push(line.trim().replace(/^- /, ''));
    else {
      if (line.trim() !== '') stack = [];
      body.push(line);
    }
  });
  close();

  // A phase heading (`# PHASE 0 …`) only introduces its sections; keep it only if it carries content of its own.
  return sections.filter((s) => s.id !== null || s.body !== '' || s.tasks.length > 0 || s.group !== s.title);
}

export function countTasks(tasks: RoadmapTask[]): RoadmapProgress {
  let done = 0;
  let total = 0;
  for (const task of tasks) {
    total += 1;
    if (task.checked) done += 1;
    const inner = countTasks(task.children);
    done += inner.done;
    total += inner.total;
  }
  return { done, total };
}

// ── Edits ──────────────────────────────────────────────────────────────────

export class RoadmapEditError extends Error {}

function requireTask(lines: string[], line: number, text: string): RegExpExecArray {
  const match = TASK_LINE.exec(lines[line] ?? '');
  if (!match) throw new RoadmapEditError(`Line ${line + 1} is not a task. Reload and try again.`);
  if (match[3]!.trim() !== text.trim()) throw new RoadmapEditError('That task changed since you loaded the page. Reload and try again.');
  return match;
}

/** The last line of a task's block: itself plus the deeper-indented lines under it. */
function blockEnd(lines: string[], line: number): number {
  const indent = indentOf(lines[line]!);
  let end = line;
  for (let i = line + 1; i < lines.length; i++) {
    if (lines[i]!.trim() === '') continue;
    if (indentOf(lines[i]!) <= indent) break;
    end = i;
  }
  return end;
}

/** Applies one edit and returns the new Markdown. Throws RoadmapEditError when the edit does not fit the file. */
export function applyRoadmapEdit(markdown: string, edit: RoadmapEdit): string {
  const eol = eolOf(markdown);
  const lines = linesOf(markdown);

  switch (edit.type) {
    case 'toggle': {
      const m = requireTask(lines, edit.line, edit.text);
      lines[edit.line] = `${m[1]!}- [${edit.checked ? 'x' : ' '}] ${m[3]!}`;
      break;
    }
    case 'edit': {
      const m = requireTask(lines, edit.line, edit.text);
      lines[edit.line] = `${m[1]!}- [${m[2]!}] ${edit.newText}`;
      break;
    }
    case 'delete': {
      requireTask(lines, edit.line, edit.text);
      lines.splice(edit.line, blockEnd(lines, edit.line) - edit.line + 1);
      break;
    }
    case 'add': {
      const heading = HEADING.exec(lines[edit.sectionLine] ?? '');
      if (!heading && edit.parentLine === undefined) throw new RoadmapEditError('Section not found. Reload and try again.');
      if (edit.parentLine !== undefined) {
        const parent = TASK_LINE.exec(lines[edit.parentLine] ?? '');
        if (!parent) throw new RoadmapEditError('Parent task not found. Reload and try again.');
        const end = blockEnd(lines, edit.parentLine);
        lines.splice(end + 1, 0, `${parent[1]!}  - [ ] ${edit.text}`);
        break;
      }
      // After the section's last top-level task block; with no tasks yet, after its intro text.
      let sectionEnd = lines.length;
      for (let i = edit.sectionLine + 1; i < lines.length; i++) {
        if (HEADING.test(lines[i]!)) {
          sectionEnd = i;
          break;
        }
      }
      let lastTop = -1;
      for (let i = edit.sectionLine + 1; i < sectionEnd; i++) if (TASK_LINE.test(lines[i]!) && indentOf(lines[i]!) === 0) lastTop = i;
      if (lastTop >= 0) {
        lines.splice(blockEnd(lines, lastTop) + 1, 0, `- [ ] ${edit.text}`);
      } else {
        let at = sectionEnd;
        while (at > edit.sectionLine + 1 && lines[at - 1]!.trim() === '') at--;
        lines.splice(at, 0, ...(at === edit.sectionLine + 1 ? [''] : []), `- [ ] ${edit.text}`);
      }
      break;
    }
  }
  return lines.join(eol);
}
