/**
 * Three-way merge of docs/ROADMAP.md for the sync between the app's copy and the file on `master`
 * (docs/ROADMAP-TOOL-PLAN.md section 7). Pure and line based, like the rest of the roadmap helpers, so
 * everything a side did not touch comes back byte for byte.
 *
 *   base - the file at the last sync
 *   file - the file on master now
 *   app  - the app's copy now
 *
 * Two results come back because one rule makes them differ: a task that disappears from the file is
 * never deleted from the app (it stays, and is reported), while the file keeps its deletion.
 *
 * Per region (a stretch of lines between lines all three versions agree on):
 *
 * | Situation                                    | forApp        | forFile       |
 * |----------------------------------------------|---------------|---------------|
 * | only the app changed it                      | app           | app           |
 * | only the file changed it                     | file          | file          |
 * | only the file deleted it                     | kept, flagged | file (deleted)|
 * | both made the same change                    | that change   | that change   |
 * | both changed it differently                  | app wins      | app wins      |
 * | app deleted it, file edited it since base    | file (kept)   | file (kept)   |
 * | both added different lines at the same place | both          | both          |
 */

export type RoadmapMergeKind =
  | 'to-file' // an app change goes into the file
  | 'to-app' // a file change goes into the app
  | 'conflict-app-wins' // both changed it; the app's version is kept
  | 'kept-file-edit' // the app deleted it but the file changed it since base; the file's version is kept
  | 'missing-from-file' // the file deleted it; the app keeps it and flags it
  | 'both-added'; // both added different lines at the same place; both are kept

export interface RoadmapMergeEntry {
  kind: RoadmapMergeKind;
  /** 1-based line in the base where the region starts (the line it would be inserted before, for pure additions). */
  baseLine: number;
  /** The first non-empty line involved, trimmed, for the log. */
  text: string;
}

export interface RoadmapMergeResult {
  forApp: string;
  forFile: string;
  log: RoadmapMergeEntry[];
  /** True when `forFile` differs from the file on master, i.e. there is something to push. */
  fileChanged: boolean;
  /** True when `forApp` differs from the app's copy, i.e. there is something to pull. */
  appChanged: boolean;
}

const splitLines = (markdown: string) => markdown.replace(/\r\n/g, '\n').split('\n');
const same = (a: string[], b: string[]) => a.length === b.length && a.every((line, i) => line === b[i]);

/** For each line of `a`, the index of its partner in `b` along a longest common subsequence, or -1. */
function matchLines(a: string[], b: string[]): number[] {
  const n = a.length;
  const m = b.length;
  const width = m + 1;
  const table = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1]! + 1
          : Math.max(table[(i + 1) * width + j]!, table[i * width + j + 1]!);
    }
  }
  const partner = new Array<number>(n).fill(-1);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      partner[i] = j;
      i++;
      j++;
    } else if (table[(i + 1) * width + j]! >= table[i * width + j + 1]!) i++;
    else j++;
  }
  return partner;
}

const firstText = (...regions: string[][]) =>
  regions
    .flat()
    .map((line) => line.trim())
    .find((line) => line !== '') ?? '';

/** One side's change: `base[start..end)` became `lines`. A pure insertion has `start === end`. */
interface Hunk {
  start: number;
  end: number;
  lines: string[];
}

/** The runs of base lines that one side deleted or replaced, and the lines it put in their place. */
function hunksOf(partner: number[], side: string[], baseLength: number): Hunk[] {
  const hunks: Hunk[] = [];
  let b = 0;
  let x = 0;
  while (b <= baseLength) {
    let next = b;
    while (next < baseLength && partner[next]! < 0) next++;
    const sideEnd = next < baseLength ? partner[next]! : side.length;
    if (next > b || sideEnd > x) hunks.push({ start: b, end: next, lines: side.slice(x, sideEnd) });
    b = next + 1;
    x = sideEnd + 1;
  }
  return hunks;
}

/** Two hunks collide when they touch the same base lines, or both insert at the same point. Neighbouring lines do not collide. */
function collide(a: Hunk, b: Hunk): boolean {
  if (a.start === a.end && b.start === b.end) return a.start === b.start;
  if (a.start === a.end) return a.start > b.start && a.start < b.end;
  if (b.start === b.end) return b.start > a.start && b.start < a.end;
  return a.start < b.end && b.start < a.end;
}

/** What one side's hunks (all inside `[start, end)`) make of `base[start..end)`. */
function applyHunks(base: string[], start: number, end: number, hunks: Hunk[]): string[] {
  const out: string[] = [];
  let at = start;
  for (const h of hunks) {
    out.push(...base.slice(at, h.start), ...h.lines);
    at = h.end;
  }
  out.push(...base.slice(at, end));
  return out;
}

/** Three-way merge; see the file comment for the rules. All three inputs are whole Markdown documents. */
export function mergeRoadmap(baseText: string, fileText: string, appText: string): RoadmapMergeResult {
  const base = splitLines(baseText);
  const file = splitLines(fileText);
  const app = splitLines(appText);
  const fileHunks = hunksOf(matchLines(base, file), file, base.length);
  const appHunks = hunksOf(matchLines(base, app), app, base.length);

  const forApp: string[] = [];
  const forFile: string[] = [];
  const log: RoadmapMergeEntry[] = [];
  let at = 0;
  let fi = 0;
  let ai = 0;

  while (fi < fileHunks.length || ai < appHunks.length) {
    const nextF = fileHunks[fi];
    const nextA = appHunks[ai];
    const first = !nextA || (nextF && nextF.start <= nextA.start) ? nextF! : nextA;

    // Everything neither side touched comes back as it was.
    const untouched = base.slice(at, first.start);
    forApp.push(...untouched);
    forFile.push(...untouched);

    // Grow a cluster from the first hunk with every hunk of either side that collides with it.
    const inFile: Hunk[] = [];
    const inApp: Hunk[] = [];
    let start = first.start;
    let end = first.end;
    (first === nextF ? inFile : inApp).push(first);
    if (first === nextF) fi++;
    else ai++;
    for (let grew = true; grew; ) {
      grew = false;
      const cluster: Hunk = { start, end, lines: [] };
      const f = fileHunks[fi];
      const a = appHunks[ai];
      if (f && collide(cluster, f)) {
        inFile.push(f);
        fi++;
        end = Math.max(end, f.end);
        grew = true;
      } else if (a && collide(cluster, a)) {
        inApp.push(a);
        ai++;
        end = Math.max(end, a.end);
        grew = true;
      }
    }

    const B = base.slice(start, end);
    const F = applyHunks(base, start, end, inFile);
    const A = applyHunks(base, start, end, inApp);
    const entry = (kind: RoadmapMergeKind) => log.push({ kind, baseLine: start + 1, text: firstText(A, F, B) });

    if (same(F, B) && same(A, B)) {
      forApp.push(...B);
      forFile.push(...B);
    } else if (same(F, B)) {
      forApp.push(...A);
      forFile.push(...A);
      entry('to-file');
    } else if (same(A, B)) {
      if (F.length === 0 && B.length > 0) {
        forApp.push(...B);
        entry('missing-from-file');
      } else {
        forApp.push(...F);
        entry('to-app');
      }
      forFile.push(...F);
    } else if (same(A, F)) {
      forApp.push(...A);
      forFile.push(...A);
    } else if (B.length === 0) {
      // Both inserted different lines at the same place: keep both rather than drop either.
      forApp.push(...F, ...A);
      forFile.push(...F, ...A);
      entry('both-added');
    } else if (A.length === 0) {
      forApp.push(...F);
      forFile.push(...F);
      entry('kept-file-edit');
    } else {
      forApp.push(...A);
      forFile.push(...A);
      entry('conflict-app-wins');
    }
    at = end;
  }
  const rest = base.slice(at);
  forApp.push(...rest);
  forFile.push(...rest);

  const eol = appText.includes('\r\n') ? '\r\n' : '\n';
  return {
    forApp: forApp.join(eol),
    forFile: forFile.join(fileText.includes('\r\n') ? '\r\n' : '\n'),
    log,
    fileChanged: !same(forFile, file),
    appChanged: !same(forApp, app),
  };
}
