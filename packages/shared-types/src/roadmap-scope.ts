import {
  ROADMAP_SCOPE_FILES,
  type RoadmapScopeDecision,
  type RoadmapScopeDone,
  type RoadmapScopeItem,
  type RoadmapScopeKey,
  type RoadmapScopeTask,
  type RoadmapScopeView,
} from './roadmap-scope.schema';

/**
 * Pure helpers for the roadmap kept as scope files (`docs/roadmap/{features,fixes,ops,decisions}.md`
 * plus the generated `docs/NOW.md`). The API bundles the files into one text for storage and the web
 * page reads the parsed view. Nothing here writes a file: the files are changed by hand at a laptop.
 */

const MARK = /^<!--roadmap-file:(.+)-->$/;

/** One text holding every file, each preceded by a marker line. Missing optional files are left out. */
export function bundleScopeFiles(files: { path: string; content: string }[]): string {
  return files
    .map((f) => `<!--roadmap-file:${f.path}-->\n${f.content.replace(/\r\n/g, '\n').replace(/\n*$/, '\n')}`)
    .join('');
}

export function splitScopeBundle(bundle: string): Map<string, string> {
  const out = new Map<string, string>();
  let path: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (path) out.set(path, buf.join('\n'));
  };
  for (const line of bundle.split('\n')) {
    const m = MARK.exec(line);
    if (m) {
      flush();
      path = m[1] ?? null;
      buf = [];
    } else buf.push(line);
  }
  flush();
  return out;
}

const META = /^`([^`]+)`(?: · verified `([^`]+)` \(([\d-]+)\))?/;
const TASK = /^(\s*)- \[( |x|X)\] (.*)$/;
const PRIORITY = /^P[0-3]$/;
const EFFORT = /^(S|M|L|XL)$/;
const STATUS = /^(idea|planned|next|doing|done|dropped)$/;

const field = (parts: string[], name: string): string | null => {
  const hit = parts.find((p) => p.startsWith(`${name}:`));
  const value = hit?.slice(name.length + 1).trim();
  return value && value !== 'none' ? value : null;
};
const list = (value: string | null): string[] => (value ? value.split(/[,\s]+/).filter(Boolean) : []);

/** Open items and Done lines of one scope file. Blocks that do not match the format are skipped. */
export function parseScopeFile(
  scope: RoadmapScopeKey,
  markdown: string,
): { items: RoadmapScopeItem[]; done: RoadmapScopeDone[] } {
  const text = markdown.replace(/\r\n/g, '\n');
  const [open = '', doneText = ''] = text.split(/^## Done\s*$/m);
  const items: RoadmapScopeItem[] = [];

  for (const block of open.split(/^### /m).slice(1)) {
    const lines = block.split('\n');
    const head = /^([FBO]-\d+) · (.+)$/.exec(lines[0] ?? '');
    const metaLine = lines.find((l) => l.startsWith('`'));
    const meta = metaLine ? META.exec(metaLine) : null;
    if (!head || !meta) continue;
    const parts = (meta[1] ?? '').split(' · ').map((s) => s.trim());
    const [priority = '', effort = '', status = ''] = parts;
    if (!PRIORITY.test(priority) || !EFFORT.test(effort) || !STATUS.test(status)) continue;

    const tasks: RoadmapScopeTask[] = [];
    const prose: string[] = [];
    for (const l of lines.slice(1)) {
      const t = TASK.exec(l);
      if (t) tasks.push({ checked: t[2] !== ' ', text: t[3] ?? '', depth: Math.floor((t[1] ?? '').length / 2) });
      else if (l !== metaLine && !/^(Evidence|Was|Spec|Deadline|fp):/.test(l)) prose.push(l);
    }
    const line = (name: string) => lines.find((l) => l.startsWith(`${name}:`))?.slice(name.length + 1).trim() ?? null;
    items.push({
      id: head[1] ?? '',
      scope,
      title: head[2] ?? '',
      priority: priority as RoadmapScopeItem['priority'],
      effort: effort as RoadmapScopeItem['effort'],
      status: status as RoadmapScopeItem['status'],
      after: list(field(parts, 'after')),
      flags: (field(parts, 'flags') ?? '').split(',').map((f) => f.trim()).filter(Boolean),
      verified: meta[2] ?? null,
      was: line('Was'),
      evidence: [...(line('Evidence') ?? '').matchAll(/`([^`]+)`/g)].map((m) => m[1] ?? ''),
      spec: line('Spec')?.replace(/^`|`$/g, '') ?? null,
      deadline: line('Deadline'),
      body: prose.join('\n').trim(),
      tasks,
    });
  }

  const done: RoadmapScopeDone[] = doneText
    .split('\n')
    .map((l) => /^- ([FBO]-\d+)\b\s*·?\s*(.*)$/.exec(l))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ id: m[1] ?? '', scope, text: m[2] ?? '' }));
  return { items, done };
}

/** Open decisions (`### D-nn` blocks) and settled ones (`- D-nn · text` lines). */
export function parseDecisions(markdown: string): RoadmapScopeDecision[] {
  const text = markdown.replace(/\r\n/g, '\n');
  const [open = '', settled = ''] = text.split(/^## Settled\s*$/m);
  const out: RoadmapScopeDecision[] = [];
  for (const block of open.split(/^### /m).slice(1)) {
    const head = /^(D-\d+) · (.+)$/m.exec(block);
    if (!head) continue;
    const grab = (name: string) => new RegExp(`${name}: ([^\\n]*?)(?:\\.(?=\\s|$)|$)`, 'm').exec(block)?.[1]?.trim() ?? null;
    const title = head[2] ?? '';
    out.push({ id: head[1] ?? '', title, settled: false, default: grab('Default'), blocks: grab('Blocks'), text: title });
  }
  for (const l of settled.split('\n')) {
    const m = /^- (D-\d+) · (.*)$/.exec(l);
    if (!m) continue;
    const text = m[2] ?? '';
    out.push({ id: m[1] ?? '', title: text.split(':')[0] ?? text, settled: true, default: null, blocks: null, text });
  }
  return out;
}

const SCOPES: RoadmapScopeKey[] = ['features', 'fixes', 'ops'];

/** The whole view from a bundle made by `bundleScopeFiles`. */
export function parseScopeBundle(bundle: string): RoadmapScopeView {
  const files = splitScopeBundle(bundle);
  const path = (key: string) => ROADMAP_SCOPE_FILES.find((f) => f.key === key)?.path ?? '';
  const items: RoadmapScopeItem[] = [];
  const done: RoadmapScopeDone[] = [];
  for (const scope of SCOPES) {
    const parsed = parseScopeFile(scope, files.get(path(scope)) ?? '');
    items.push(...parsed.items);
    done.push(...parsed.done);
  }
  return {
    items,
    done,
    decisions: parseDecisions(files.get(path('decisions')) ?? ''),
    now: files.get(path('now')) ?? null,
  };
}

export const EMPTY_SCOPE_VIEW: RoadmapScopeView = { items: [], done: [], decisions: [], now: null };
