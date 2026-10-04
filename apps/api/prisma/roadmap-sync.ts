import 'dotenv/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import {
    diffRoadmap,
    normalizeRoadmap,
    type RoadmapDiff,
} from '../src/modules/roadmap/roadmap-file';

/**
 * Moves docs/ROADMAP.md between the repo and the database behind the Project Management page.
 *
 *   pnpm --filter api roadmap:import           # show what file -> database would overwrite
 *   pnpm --filter api roadmap:import --apply   # do it (the file wins; bumps the version)
 *   pnpm --filter api roadmap:export           # show what database -> file would overwrite
 *   pnpm --filter api roadmap:export --apply   # do it (the database wins)
 *
 * Run import after editing the file by hand, export after editing in the deployed app. Without
 * `--apply` nothing is written: an overwrite silently discards whatever the other side holds that
 * this side does not (an edit saved from the /project page, an uncommitted hand edit), so the diff
 * is shown first. Both do nothing when the two already match.
 */
const ROW_ID = 1;
const FILE = resolve(__dirname, '../../../docs/ROADMAP.md');
const MAX_DIFF_LINES = 60;

/** `-` lines are what the overwrite destroys in `loses`; `+` lines are what it brings in. */
function printDiff(diff: RoadmapDiff, loses: string) {
    console.log(
        `${diff.removed} line(s) would be lost from ${loses}, ${diff.added} added:\n`,
    );
    console.log(diff.lines.slice(0, MAX_DIFF_LINES).join('\n'));
    if (diff.lines.length > MAX_DIFF_LINES) {
        console.log(`  … ${diff.lines.length - MAX_DIFF_LINES} more line(s)`);
    }
    console.log();
}

async function main() {
    // PrismaService logs every query in development; a one-off sync only needs its own report.
    process.env.NODE_ENV = 'production';

    const [mode, ...flags] = process.argv.slice(2);
    const apply = flags.includes('--apply');
    if (
        (mode !== 'import' && mode !== 'export') ||
        flags.some((flag) => flag !== '--apply')
    ) {
        console.error('Usage: roadmap-sync.ts <import|export> [--apply]');
        process.exit(1);
    }

    const prisma = new PrismaService(new ConfigService());
    await prisma.$connect();
    try {
        const row = await prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });

        if (mode === 'import') {
            const markdown = readFileSync(FILE, 'utf8');
            if (
                row &&
                normalizeRoadmap(row.markdown) === normalizeRoadmap(markdown)
            ) {
                console.log('Already in step: nothing to import.');
                return;
            }
            if (row) {
                printDiff(diffRoadmap(row.markdown, markdown), 'the database');
            }
            if (!apply) {
                console.log(
                    row
                        ? `Dry run: nothing changed. Re-run with --apply to overwrite database version ${row.version} with the file.`
                        : 'Dry run: nothing changed. Re-run with --apply for the first import.',
                );
                return;
            }
            // Written together so the import is never missing from the audit trail.
            await prisma.$transaction([
                prisma.roadmapDocument.upsert({
                    where: { id: ROW_ID },
                    create: { id: ROW_ID, markdown, updatedBy: 'import' },
                    update: {
                        markdown,
                        version: { increment: 1 },
                        updatedBy: 'import',
                    },
                }),
                prisma.auditLog.create({
                    data: {
                        actor: 'import',
                        action: 'roadmap',
                        detail: row
                            ? `imported docs/ROADMAP.md over version ${row.version}`
                            : 'first import of docs/ROADMAP.md',
                    },
                }),
            ]);
            console.log(
                row
                    ? `Imported docs/ROADMAP.md over database version ${row.version}.`
                    : 'Imported docs/ROADMAP.md (first import).',
            );
            return;
        }

        if (!row) {
            console.error(
                'The database holds no roadmap yet: run roadmap:import --apply first.',
            );
            process.exit(1);
        }
        const current = readFileSync(FILE, 'utf8');
        if (normalizeRoadmap(current) === normalizeRoadmap(row.markdown)) {
            console.log('Already in step: nothing to export.');
            return;
        }
        printDiff(diffRoadmap(current, row.markdown), 'docs/ROADMAP.md');
        if (!apply) {
            console.log(
                'Dry run: nothing changed. Re-run with --apply to overwrite the file with the database.',
            );
            return;
        }
        // Keep the file's line endings so git does not show every line as changed.
        const eol = current.includes('\r\n') ? '\r\n' : '\n';
        writeFileSync(
            FILE,
            normalizeRoadmap(row.markdown).replace(/\n/g, eol) + eol,
            'utf8',
        );
        console.log(
            `Exported database version ${row.version} to docs/ROADMAP.md.`,
        );
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
