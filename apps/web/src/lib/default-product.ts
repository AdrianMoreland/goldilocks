import { GRAMS_PER_TROY_OUNCE } from '@goldilocks/shared-types';
import type { MetalType } from '@/lib/types';

const BAR_NAME_RE = /bar/i;
const BONDED_NAME_RE = /bonded/i;

/**
 * The product shown when nothing has been picked — on the Product tab, the
 * Trade cart and the P/L calculator alike, so they never disagree. Plain 1oz
 * bars for gold/platinum/palladium and a 1kg bar for silver (how each metal
 * is actually traded in bulk). Picked by shape (bar) + weight rather than
 * name text alone, since "contains 1oz" also matches mint coins like the US
 * Eagle, which isn't the standard product. Bonded bars share the weight tier
 * but are a separate, specialty product, so they're excluded.
 */
export function findDefaultProduct<T extends { name: string; weight: number }>(metal: MetalType, products: T[]): T | null {
    const targetWeight = metal === 'SILVER' ? 1000 : GRAMS_PER_TROY_OUNCE;
    const tolerance = metal === 'SILVER' ? 1 : 0.5;

    const bar = products.find(
        (p) => BAR_NAME_RE.test(p.name) && !BONDED_NAME_RE.test(p.name) && Math.abs(p.weight - targetWeight) < tolerance,
    );
    return bar ?? products.find((p) => BAR_NAME_RE.test(p.name) && !BONDED_NAME_RE.test(p.name)) ?? products[0] ?? null;
}
