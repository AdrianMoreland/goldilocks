import 'dotenv/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { normalizeRoadmap } from '../src/modules/roadmap/roadmap-file';

/**
 * Moves docs/ROADMAP.md between the repo and the database behind the Project Management page.
 *
 *   pnpm --filter api roadmap:import   # file -> database (the file wins; bumps the version)
 *   pnpm --filter api roadmap:export   # database -> file (the database wins)
 *
 * Run import after editing the file by hand, export after editing in the deployed app. Both report
 * what they would overwrite when the two differ, and do nothing when they already match.
 */
const ROW_ID = 1;
const FILE = resolve(__dirname, '../../../docs/ROADMAP.md');

async function main() {
    // PrismaService logs every query in development; a one-off sync only needs its own report.
    process.env.NODE_ENV = 'production';

    const mode = process.argv[2];
    if (mode !== 'import' && mode !== 'export') {
        console.error('Usage: roadmap-sync.ts <import|export>');
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
            await prisma.roadmapDocument.upsert({
                where: { id: ROW_ID },
                create: { id: ROW_ID, markdown, updatedBy: 'import' },
                update: {
                    markdown,
                    version: { increment: 1 },
                    updatedBy: 'import',
                },
            });
            console.log(
                row
                    ? `Imported docs/ROADMAP.md over database version ${row.version}.`
                    : 'Imported docs/ROADMAP.md (first import).',
            );
            return;
        }

        if (!row) {
            console.error(
                'The database holds no roadmap yet: run roadmap:import first.',
            );
            process.exit(1);
        }
        const current = readFileSync(FILE, 'utf8');
        if (normalizeRoadmap(current) === normalizeRoadmap(row.markdown)) {
            console.log('Already in step: nothing to export.');
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
