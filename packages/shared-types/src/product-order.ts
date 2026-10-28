import { GRAMS_PER_TROY_OUNCE } from './pricing-math';

export interface OrderableProduct {
  id: number;
  name: string;
  metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
  weight: number;
  category: 'BAR' | 'COIN' | null;
}

const METAL_RANK: Record<OrderableProduct['metalType'], number> = { GOLD: 0, SILVER: 1, PLATINUM: 2, PALLADIUM: 3 };

/**
 * The weights that come first within a metal, in this order. Product ids are assigned in creation order and carry
 * no importance, so lists are sorted with this instead of by id. To promote another size, add it here.
 */
const FEATURED_GRAMS = [GRAMS_PER_TROY_OUNCE, 100];

const featuredRank = (grams: number) => {
  const i = FEATURED_GRAMS.findIndex((g) => Math.abs(g - grams) <= Math.max(0.05, g * 0.005));
  return i === -1 ? FEATURED_GRAMS.length : i;
};

/**
 * Display order for product lists: gold, then silver, then the rest; within a metal the featured sizes (1oz, 100g)
 * first, then bars before coins, then lightest to heaviest, then by name. Ids are never changed or used for order.
 */
export function compareProducts(a: OrderableProduct, b: OrderableProduct): number {
  return (
    METAL_RANK[a.metalType] - METAL_RANK[b.metalType] ||
    featuredRank(a.weight) - featuredRank(b.weight) ||
    (a.category === 'BAR' ? 0 : 1) - (b.category === 'BAR' ? 0 : 1) ||
    a.weight - b.weight ||
    a.name.localeCompare(b.name) ||
    a.id - b.id
  );
}
