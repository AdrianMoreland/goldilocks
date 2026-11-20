import { z } from 'zod';
import { parseBarWeight, parseCoinName, parseWeight } from './live-stock';

/**
 * Which live-stock lines a priced product draws on, so the dashboard can show "in stock / low / out" next to its price.
 * Live stock is kept per sheet line (metal, bar weight or coin family + weight), not per product, so this reads the
 * product's name. Only gold and silver are counted (platinum and palladium sit together in one PGM sheet); bonded
 * products, CombiBars and coins with no recognisable family or weight get no key, so no flag rather than a wrong one.
 */
export type ProductStockKey =
  | { metal: 'GOLD' | 'SILVER'; kind: 'BAR'; variant: string; pampOnly: boolean }
  | { metal: 'GOLD' | 'SILVER'; kind: 'COIN'; family: string | null; variant: string };

/** The family US Eagles are kept under; a generic "1/10oz Coin" is any coin of that weight except these. */
const US_FAMILY = 'Eagle';

export function productStockKey(product: { name: string; metalType: string }): ProductStockKey | null {
  const metal = product.metalType;
  if (metal !== 'GOLD' && metal !== 'SILVER') return null;
  const name = product.name;
  if (/bonded/i.test(name)) return null;

  if (/bar\b/i.test(name)) {
    if (/combi/i.test(name)) return null;
    const bar = parseBarWeight(name);
    if (bar.grams === null) return null;
    return { metal, kind: 'BAR', variant: bar.variant, pampOnly: /pamp/i.test(name) };
  }

  const coin = parseCoinName(name);
  const weight = parseWeight(name)?.label ?? null;
  if (coin.family === 'Sovereign') return { metal, kind: 'COIN', family: 'Sovereign', variant: coin.variant };
  if (coin.family !== 'Other') return weight ? { metal, kind: 'COIN', family: coin.family, variant: weight } : null;
  // "1/10oz Coin", "1oz Silver Coin", "1kg Coins": any (non-US) coin of exactly that weight.
  if (weight && /\bcoins?\b/i.test(name)) return { metal, kind: 'COIN', family: null, variant: weight };
  return null;
}

export interface StockLineForMatch {
  metal: string;
  kind: string;
  family: string;
  variant: string;
  refinery: string;
}

export function lineMatchesKey(line: StockLineForMatch, key: ProductStockKey): boolean {
  if (line.metal !== key.metal || line.kind !== key.kind) return false;
  if (line.variant.toLowerCase() !== key.variant.toLowerCase()) return false;
  if (key.kind === 'BAR') return !key.pampOnly || /pamp/i.test(line.refinery);
  if (key.family === null) return line.family !== US_FAMILY && line.family !== 'Other';
  return line.family.toLowerCase() === key.family.toLowerCase();
}

export const StockLevelStateSchema = z.enum(['IN', 'LOW', 'OUT']);
export type StockLevelState = z.infer<typeof StockLevelStateSchema>;

export const ProductStockLevelSchema = z.object({
  productId: z.number(),
  total: z.number(),
  state: StockLevelStateSchema,
  /** Count per stock location that has the product (or a threshold for it), largest first. */
  branches: z.array(z.object({ code: z.string(), name: z.string(), qty: z.number() })),
});
export type ProductStockLevel = z.infer<typeof ProductStockLevelSchema>;
export const ProductStockLevelsResponseSchema = z.array(ProductStockLevelSchema);

/**
 * Totals per product across every stock location. LOW when the total is at or under the summed low-stock thresholds
 * of its lines (only when at least one threshold is set); OUT at zero. Products with no key are left out.
 */
export function productStockLevels(
  products: { id: number; name: string; metalType: string }[],
  lines: (StockLineForMatch & { qty: number; lowThreshold: number | null; branchCode: string; branchName: string })[],
): ProductStockLevel[] {
  const out: ProductStockLevel[] = [];
  for (const product of products) {
    const key = productStockKey(product);
    if (!key) continue;
    const matched = lines.filter((l) => lineMatchesKey(l, key));
    const perBranch = new Map<string, { code: string; name: string; qty: number }>();
    let threshold = 0;
    let hasThreshold = false;
    for (const l of matched) {
      const b = perBranch.get(l.branchCode) ?? { code: l.branchCode, name: l.branchName, qty: 0 };
      b.qty += l.qty;
      perBranch.set(l.branchCode, b);
      if (l.lowThreshold !== null) {
        threshold += l.lowThreshold;
        hasThreshold = true;
      }
    }
    const total = [...perBranch.values()].reduce((s, b) => s + b.qty, 0);
    const state: StockLevelState = total <= 0 ? 'OUT' : hasThreshold && total <= threshold ? 'LOW' : 'IN';
    out.push({
      productId: product.id,
      total,
      state,
      branches: [...perBranch.values()].filter((b) => b.qty !== 0).sort((a, b) => b.qty - a.qty || a.code.localeCompare(b.code)),
    });
  }
  return out;
}
