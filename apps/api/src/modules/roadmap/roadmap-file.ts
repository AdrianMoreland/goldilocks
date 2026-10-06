import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * docs/ROADMAP.md on disk. Present in a local checkout, absent on Railway. The API runs from `apps/api`
 * or the repo root depending on how it was started, so both are tried; ROADMAP_FILE overrides.
 */
export function roadmapFilePath(): string | null {
    const candidates = [
        process.env.ROADMAP_FILE,
        join(process.cwd(), 'docs/ROADMAP.md'),
        join(process.cwd(), '../../docs/ROADMAP.md'),
    ].filter((p): p is string => !!p);
    const found = candidates.map((p) => resolve(p)).find((p) => existsSync(p));
    return found ?? null;
}

export const readRoadmapFile = (path: string) => readFileSync(path, 'utf8');
export const writeRoadmapFile = (path: string, markdown: string) =>
    writeFileSync(path, markdown, 'utf8');

/** Line endings and a trailing newline are not a real difference between the file and the database. */
export const normalizeRoadmap = (markdown: string) =>
    markdown.replace(/\r\n/g, '\n').replace(/\s+$/, '');

export interface RoadmapDiff {
    added: number;
    removed: number;
    /** Changed lines with one line of context, `+`/`-` prefixed, for printing. */
    lines: string[];
}

/**
 * Line diff of two roadmaps (after normalising line endings), for `roadmap:import` / `export` to show
 * what an overwrite would destroy before it happens. A plain longest-common-subsequence diff: the
 * roadmap is a few hundred lines, so nothing cleverer is needed and no dependency is added.
 */
export function diffRoadmap(from: string, to: string): RoadmapDiff {
    const a = normalizeRoadmap(from).split('\n');
    const b = normalizeRoadmap(to).split('\n');

    const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
        new Array<number>(b.length + 1).fill(0),
    );
    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            lcs[i][j] =
                a[i] === b[j]
                    ? lcs[i + 1][j + 1] + 1
                    : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
        }
    }

    const ops: { kind: ' ' | '-' | '+'; text: string; line: number }[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && a[i] === b[j]) {
            ops.push({ kind: ' ', text: a[i], line: i + 1 });
            i++;
            j++;
        } else if (
            j < b.length &&
            (i === a.length || lcs[i][j + 1] > lcs[i + 1][j])
        ) {
            ops.push({ kind: '+', text: b[j], line: i + 1 });
            j++;
        } else {
            ops.push({ kind: '-', text: a[i], line: i + 1 });
            i++;
        }
    }

    const changed = ops.map((op) => op.kind !== ' ');
    const show = ops.map(
        (_, k) => changed[k] || changed[k - 1] || changed[k + 1],
    );
    const lines: string[] = [];
    ops.forEach((op, k) => {
        if (!show[k]) {
            if (show[k - 1]) lines.push('  …');
            return;
        }
        lines.push(`${op.kind} ${op.text}`);
    });

    return {
        added: ops.filter((op) => op.kind === '+').length,
        removed: ops.filter((op) => op.kind === '-').length,
        lines,
    };
}
