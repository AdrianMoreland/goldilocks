import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

/**
 * Reads back the roadmap text the app held before a sync changed it (table roadmap_snapshot).
 *
 *   pnpm --filter api roadmap:snapshot                       # list the snapshots, newest first
 *   pnpm --filter api roadmap:snapshot <id>                  # print one to the screen
 *   pnpm --filter api roadmap:snapshot <id> --out file.md    # write one to a file
 *
 * Read only: nothing is written to the database, and nothing is restored. Put an old text back by
 * hand if you ever need to (save it to a file, check it, then use roadmap:import on a copy of it).
 */
async function main() {
    process.env.NODE_ENV = 'production';
    const args = process.argv.slice(2);
    const outAt = args.indexOf('--out');
    const out = outAt >= 0 ? args[outAt + 1] : undefined;
    const outValueAt = outAt >= 0 ? outAt + 1 : -1;
    const idArg = args.find((a, i) => !a.startsWith('--') && i !== outValueAt);
    const id = idArg === undefined ? undefined : Number(idArg);
    if (
        (outAt >= 0 && !out) ||
        (idArg !== undefined && (!Number.isInteger(id) || id! < 1))
    ) {
        console.error('Usage: roadmap-snapshot.ts [id] [--out file]');
        process.exit(1);
    }

    const prisma = new PrismaService(new ConfigService());
    await prisma.$connect();
    try {
        if (id === undefined) {
            const rows = await prisma.roadmapSnapshot.findMany({
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    version: true,
                    reason: true,
                    createdBy: true,
                    createdAt: true,
                    markdown: true,
                },
            });
            if (rows.length === 0) console.log('No snapshots yet.');
            for (const r of rows) {
                console.log(
                    `#${r.id}  ${r.createdAt.toISOString()}  app version ${r.version}  ${r.markdown.length} chars  by ${r.createdBy}  ${r.reason}`,
                );
            }
            return;
        }
        const row = await prisma.roadmapSnapshot.findUnique({ where: { id } });
        if (!row) {
            console.error(`No snapshot #${id}.`);
            process.exit(1);
        }
        if (out) {
            writeFileSync(resolve(out), row.markdown, 'utf8');
            console.log(`Wrote snapshot #${id} to ${resolve(out)}.`);
        } else {
            process.stdout.write(row.markdown);
        }
    } finally {
        await prisma.$disconnect();
    }
}

void main();
