import 'dotenv/config';
import Redis from 'ioredis';
import { normalizeProductName } from '@goldilocks/shared-types';
import { prisma } from '../src/lib/db/prisma';

/**
 * One-off data fix: product names imported with a space between the number
 * and the weight unit ("1 oz Gold Bar", "50 g Gold Bar") are rewritten
 * without it ("1oz Gold Bar", "50g Gold Bar"). New and edited products are
 * normalised by the API itself (see products.provider.ts), so this only
 * needs to run once for the rows that already exist.
 *
 *   pnpm --filter api tsx prisma/normalize-product-names.ts          # dry run — prints the changes
 *   pnpm --filter api tsx prisma/normalize-product-names.ts --apply  # writes them, then clears the products cache
 *
 * Includes soft-deleted products, so a restored one comes back tidy too.
 */
async function main() {
    const apply = process.argv.includes('--apply');
    const products = await prisma.product.findMany({ select: { id: true, sku: true, name: true }, orderBy: { id: 'asc' } });

    const changes = products
        .map((p) => ({ ...p, next: normalizeProductName(p.name) }))
        .filter((p) => p.next !== p.name);

    if (changes.length === 0) {
        console.log(`Checked ${products.length} products — every name is already tidy.`);
        return;
    }

    for (const c of changes) console.log(`[${c.id}] ${c.sku}: "${c.name}" -> "${c.next}"`);
    console.log(`\n${changes.length} of ${products.length} products would change.`);

    if (!apply) {
        console.log('Dry run only — re-run with --apply to write these.');
        return;
    }

    // Name isn't unique (sku is), so these are independent single-row updates.
    for (const c of changes) {
        await prisma.product.update({ where: { id: c.id }, data: { name: c.next } });
    }
    console.log(`Updated ${changes.length} products.`);

    // The API caches the product list for 5 minutes and a raw script write
    // doesn't invalidate it (CLAUDE.md §8) — drop the key so the change shows now.
    if (process.env.REDIS_URL) {
        const redis = new Redis(process.env.REDIS_URL);
        try {
            await redis.del('products:all');
            console.log('Cleared the products cache.');
        } finally {
            redis.disconnect();
        }
    } else {
        console.log('REDIS_URL not set — the product list will refresh within 5 minutes.');
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
