import { GRAMS_PER_TROY_OUNCE } from './pricing-math';
import { parseWeightGrams } from './stocktake';

export interface OrderableProduct {
  id: number;
  name: string;
  metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
  weight: number;
}

const METAL_RANK: Record<OrderableProduct['metalType'], number> = { GOLD: 0, SILVER: 1, PLATINUM: 2, PALLADIUM: 3 };

/**
 * The weights that come first within a metal, in this order. Product ids are assigned in creation order and carry
 * no importance, so stocktake and customer-order lists are sorted with this instead of by id. To promote another
 * size, add it here.
 */
const FEATURED_GRAMS = [GRAMS_PER_TROY_OUNCE, 100];

const featuredRank = (grams: number) => {
  const i = FEATURED_GRAMS.findIndex((g) => Math.abs(g - grams) <= Math.max(0.05, g * 0.005));
  return i === -1 ? FEATURED_GRAMS.length : i;
};

/** Metal rank, 1oz then 100g first, then the rest heaviest to lightest, then by name. */
function compareKeys(a: { metal: number; grams: number; name: string }, b: { metal: number; grams: number; name: string }): number {
  return a.metal - b.metal || featuredRank(a.grams) - featuredRank(b.grams) || b.grams - a.grams || a.name.localeCompare(b.name);
}

/**
 * Display order for product lists in the stocktake and customer-order screens: gold, then silver, then the rest;
 * within a metal 1oz then 100g first, then heaviest to lightest, then by name. Ids are never changed or used for
 * importance (only as the last tiebreak so the order is stable). The dashboard keeps its own order.
 */
export function compareProducts(a: OrderableProduct, b: OrderableProduct): number {
  return (
    compareKeys({ metal: METAL_RANK[a.metalType], grams: a.weight, name: a.name }, { metal: METAL_RANK[b.metalType], grams: b.weight, name: b.name }) ||
    a.id - b.id
  );
}

export type StockOrderMetal = 'GOLD' | 'SILVER' | 'PGM' | null;

const STOCK_METAL_RANK: Record<'GOLD' | 'SILVER' | 'PGM', number> = { GOLD: 0, SILVER: 1, PGM: 2 };

/**
 * The same order for rows that only carry a metal group and a text label ("100g Bar", "1oz Krugerrand"): bars,
 * coin counts and customer orders. The weight is read from the label; a label with no weight sorts after the
 * ones that have one, by name. A row with no metal sorts after the metals.
 */
export function compareStockLabels(a: { metal: StockOrderMetal; label: string }, b: { metal: StockOrderMetal; label: string }): number {
  const key = (x: { metal: StockOrderMetal; label: string }) => ({
    metal: x.metal ? STOCK_METAL_RANK[x.metal] : 3,
    grams: parseWeightGrams(x.label) ?? -1,
    name: x.label,
  });
  return compareKeys(key(a), key(b));
}
