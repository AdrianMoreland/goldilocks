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
