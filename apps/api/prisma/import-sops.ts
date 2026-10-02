import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { KnowledgeService } from '../src/modules/knowledge/knowledge.service';

/**
 * Imports the SOP Markdown files (docs/sops/*.md, format in 00-README.md)
 * into the Knowledge Center. Validates everything first and writes nothing
 * unless every file is sound.
 *
 *   pnpm --filter api kb:import                      # import docs/sops
 *   pnpm --filter api kb:import --dry-run            # validate only
 *   pnpm --filter api kb:import --allow-unresolved   # tolerate links to SOPs not written yet
 *   pnpm --filter api kb:import --force              # overwrite a stored SOP with a higher version
 *   pnpm --filter api kb:import --dir <path>
 *
 * Built by hand rather than through Nest's container — the service only
 * needs Prisma, so a full application context (Supabase, Redis, cron…) would
 * be pure overhead for a one-off script.
 */
async function main() {
    // PrismaService logs every query in development; a one-off import only needs its own report.
    process.env.NODE_ENV = 'production';

    const args = process.argv.slice(2);
    const flag = (name: string) => args.includes(`--${name}`);
    const dirIndex = args.indexOf('--dir');
    const dir = resolve(
        dirIndex >= 0 && args[dirIndex + 1]
            ? args[dirIndex + 1]
            : join(__dirname, '../../../docs/sops'),
    );

    const names = (await readdir(dir))
        .filter((name) => name.endsWith('.md'))
        .sort();
    const files = await Promise.all(
        names.map(async (name) => ({
            name,
            raw: await readFile(join(dir, name), 'utf8'),
        })),
    );

    if (files.length === 0) {
        console.error(`No .md files found in ${dir}`);
        process.exit(1);
    }

    const prisma = new PrismaService(new ConfigService());
    await prisma.$connect();
    try {
        const report = await new KnowledgeService(prisma).importDocuments(
            files,
            {
                allowUnresolvedLinks: flag('allow-unresolved'),
                force: flag('force'),
                dryRun: flag('dry-run'),
            },
        );

        for (const result of report.results) {
            const label = result.action.toUpperCase().padEnd(9);
            console.log(
                `${label} ${result.file}${result.slug ? `  (${result.slug})` : ''}`,
            );
            for (const error of result.errors)
                console.log(`            ↳ ${error}`);
        }

        if (report.unresolvedLinks.length > 0) {
            const missing = [
                ...new Set(report.unresolvedLinks.map((link) => link.slug)),
            ];
            console.warn(
                `\nWARNING: ${report.unresolvedLinks.length} link(s) point at SOPs that don't exist yet: ${missing.join(', ')}.\n` +
                    'The reader shows them as "SOP not written yet". Write the SOP and re-import to resolve them.',
            );
        }

        if (!report.applied) {
            console.log(
                flag('dry-run')
                    ? '\nDry run — nothing written.'
                    : '\nNothing written: fix the problems above and re-run.',
            );
            process.exit(
                flag('dry-run') &&
                    !report.results.some((r) => r.action === 'rejected')
                    ? 0
                    : 1,
            );
        }
        console.log('\nImport complete.');
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
