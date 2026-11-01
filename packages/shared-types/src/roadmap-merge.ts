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

/** Three-way merge; see the file comment for the rules. All three inputs are whole Markdown documents. */
export function mergeRoadmap(baseText: string, fileText: string, appText: string): RoadmapMergeResult {
  const base = splitLines(baseText);
  const file = splitLines(fileText);
  const app = splitLines(appText);
  const toFile = matchLines(base, file);
  const toApp = matchLines(base, app);

  // Base lines that survive in both versions are the fixed points between which regions are compared.
  const anchors: { b: number; f: number; a: number }[] = [];
  for (let b = 0; b < base.length; b++) {
    if (toFile[b]! >= 0 && toApp[b]! >= 0) anchors.push({ b, f: toFile[b]!, a: toApp[b]! });
  }
  anchors.push({ b: base.length, f: file.length, a: app.length });

  const forApp: string[] = [];
  const forFile: string[] = [];
  const log: RoadmapMergeEntry[] = [];
  let pb = -1;
  let pf = -1;
  let pa = -1;

  for (const anchor of anchors) {
    const B = base.slice(pb + 1, anchor.b);
    const F = file.slice(pf + 1, anchor.f);
    const A = app.slice(pa + 1, anchor.a);
    const entry = (kind: RoadmapMergeKind) => log.push({ kind, baseLine: pb + 2, text: firstText(A, F, B) });

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

    if (anchor.b < base.length) {
      forApp.push(base[anchor.b]!);
      forFile.push(base[anchor.b]!);
    }
    pb = anchor.b;
    pf = anchor.f;
    pa = anchor.a;
  }

  const eol = appText.includes('\r\n') ? '\r\n' : '\n';
  const merged = {
    forApp: forApp.join(eol),
    forFile: forFile.join(fileText.includes('\r\n') ? '\r\n' : '\n'),
  };
  return {
    ...merged,
    log,
    fileChanged: !same(forFile, file),
    appChanged: !same(forApp, app),
  };
}
