import { GRAMS_PER_TROY_OUNCE } from './pricing-math';

// ============================================================================
// PORTFOLIO BUILDER — pure domain logic.
//
// Ported from the Apps Script tool's PortfolioMath.gs. Given a budget and a
// list of candidate products, builds and scores three candidate portfolios
// ("Maximum Value", "Balanced", "Maximum Flexibility"). Nothing here touches
// the database — the caller (PortfolioService) supplies already-priced
// candidates and this module is pure enough to unit test directly.
//
// Priority product identity uses the product's real `id` (the Apps Script
// version used the spreadsheet row number for the same purpose).
//
// NOTE ON COST: buildBalanced evaluates a few thousand candidate portfolios
// per call — a known, separate efficiency item, not addressed here (carried
// over from the source).
// ============================================================================

export type PortfolioProductType = 'bar' | 'coin';
export type PriorityStrength = 'none' | 'low' | 'medium' | 'high';
export type PortfolioProductTypeFilter = 'either' | 'bar' | 'coin';

export const PORTFOLIO_SMALL_INVESTOR_LIMIT = 5000;
export const PORTFOLIO_MAX_QTY = 500;

export interface PortfolioCandidateProduct {
  id: number;
  product: string;
  weight: number;
  sellPrice: number;
  premium: number;
  type: PortfolioProductType;
}

export interface PortfolioLineItem {
  product: string;
  quantity: number;
  weight: number;
  totalWeight: number;
  unitPrice: number;
  totalValue: number;
  premium: number;
  type: PortfolioProductType;
  isPriority: boolean;
}

export interface PortfolioCandidateResult {
  totalInvested: number;
  unspent: number;
  totalGrams: number;
  averagePerGram: number;
  averagePremium: number;
  pieces: number;
  largestPositionPercent: number;
  flexibilityScore: number;
  priorityQuantity: number;
  priorityShare: number;
  items: PortfolioLineItem[];
}

export type PortfolioStrategyId = 'maximum' | 'balanced' | 'flexible';

export interface PortfolioStrategyResult {
  strategy: { id: PortfolioStrategyId; name: string; badge: string; description: string };
  result: PortfolioCandidateResult;
}

// ── Product filter (normal / large-investor products) ─────────────────────

function getNormalProducts(
  products: PortfolioCandidateProduct[],
  budget: number,
  priorityProductName: string,
): PortfolioCandidateProduct[] {
  const priority = (priorityProductName || '').trim();

  if (budget <= PORTFOLIO_SMALL_INVESTOR_LIMIT) {
    return products.filter((p) => p.sellPrice <= budget);
  }

  return products.filter((p) => {
    if (p.sellPrice > budget) return false;
    if (p.weight >= GRAMS_PER_TROY_OUNCE) return true;
    if (priority && p.product === priority) return true;
    return false;
  });
}

function findPreferredOneOzProduct(products: PortfolioCandidateProduct[]): PortfolioCandidateProduct | null {
  const oneOz = products.filter((p) => Math.abs(p.weight - GRAMS_PER_TROY_OUNCE) < 0.75);
  if (!oneOz.length) return null;

  oneOz.sort((a, b) =>
    a.premium !== b.premium ? a.premium - b.premium : a.sellPrice / a.weight - b.sellPrice / b.weight,
  );

  return oneOz[0]!;
}

function portfolioFromQuantities(
  quantities: Record<string, number>,
  allProducts: PortfolioCandidateProduct[],
  budget: number,
  priorityId: number | null,
): PortfolioCandidateResult | null {
  const items: PortfolioLineItem[] = [];

  let totalInvested = 0;
  let totalGrams = 0;
  let totalPremiumWeight = 0;
  let pieces = 0;
  let largestPosition = 0;
  let priorityQuantity = 0;
  let priorityValue = 0;

  for (const p of allProducts) {
    let qty = quantities[p.product] ?? 0;
    if (qty <= 0) continue;
    qty = Math.min(qty, PORTFOLIO_MAX_QTY);

    const value = qty * p.sellPrice;
    const grams = qty * p.weight;

    totalInvested += value;
    totalGrams += grams;
    pieces += qty;
    totalPremiumWeight += p.premium * grams;
    largestPosition = Math.max(largestPosition, value);

    const isPriority = priorityId !== null && p.id === priorityId;
    if (isPriority) {
      priorityQuantity = qty;
      priorityValue = value;
    }

    items.push({
      product: p.product,
      quantity: qty,
      weight: p.weight,
      totalWeight: grams,
      unitPrice: p.sellPrice,
      totalValue: value,
      premium: p.premium,
      type: p.type,
      isPriority,
    });
  }

  if (totalInvested <= 0) return null;

  items.sort((a, b) => b.totalValue - a.totalValue);

  const unspent = Math.max(0, budget - totalInvested);
  const averagePerGram = totalGrams > 0 ? totalInvested / totalGrams : 0;
  const averagePremium = totalGrams > 0 ? totalPremiumWeight / totalGrams : 0;
  const largestPositionPercent = totalInvested > 0 ? (largestPosition / totalInvested) * 100 : 0;

  let positionScore: number;
  if (pieces >= 4 && pieces <= 15) positionScore = 100;
  else if (pieces < 4) positionScore = pieces * 20;
  else positionScore = Math.max(20, 100 - (pieces - 15) * 2);

  const concentrationScore = Math.max(0, 100 - largestPositionPercent);
  const diversityScore = Math.min(100, items.length * 25);

  const flexibilityScore = Math.round(positionScore * 0.45 + concentrationScore * 0.35 + diversityScore * 0.2);

  return {
    totalInvested: Math.round(totalInvested),
    unspent: Math.round(unspent),
    totalGrams,
    averagePerGram,
    averagePremium,
    pieces,
    largestPositionPercent,
    flexibilityScore,
    priorityQuantity,
    priorityShare: totalInvested > 0 ? (priorityValue / totalInvested) * 100 : 0,
    items,
  };
}

function fallbackPortfolio(
  products: PortfolioCandidateProduct[],
  budget: number,
  priorityId: number | null,
): PortfolioCandidateResult | null {
  const affordable = products.filter((p) => p.sellPrice <= budget);
  if (!affordable.length) return null;

  affordable.sort((a, b) => a.sellPrice / a.weight - b.sellPrice / b.weight);

  const p = affordable[0]!;
  const qty = Math.floor(budget / p.sellPrice);
  if (qty <= 0) return null;

  return portfolioFromQuantities({ [p.product]: qty }, products, budget, priorityId);
}

// ── Maximum value ───────────────────────────────────────────────────────────

function buildMaximumValue(
  normalProducts: PortfolioCandidateProduct[],
  allAffordable: PortfolioCandidateProduct[],
  budget: number,
  priorityId: number | null,
): PortfolioCandidateResult | null {
  let products = normalProducts.slice();
  if (!products.length) products = allAffordable.slice();

  products.sort((a, b) => (b.weight !== a.weight ? b.weight - a.weight : a.sellPrice - b.sellPrice));

  const quantities: Record<string, number> = {};
  let remaining = budget;

  while (remaining > 0) {
    let chosen: PortfolioCandidateProduct | null = null;

    for (const p of products) {
      if (p.sellPrice <= remaining) {
        chosen = p;
        break;
      }
    }

    if (!chosen) break;

    const newQty = (quantities[chosen.product] ?? 0) + 1;
    quantities[chosen.product] = newQty;
    remaining -= chosen.sellPrice;

    if (newQty >= PORTFOLIO_MAX_QTY) {
      const chosenProduct = chosen.product;
      products = products.filter((p) => p.product !== chosenProduct);
    }
  }

  const priority = priorityId !== null ? (allAffordable.find((p) => p.id === priorityId) ?? null) : null;

  if (priority && priority.sellPrice <= remaining) {
    const currentQty = quantities[priority.product] ?? 0;
    if (currentQty < PORTFOLIO_MAX_QTY) {
      quantities[priority.product] = currentQty + 1;
      remaining -= priority.sellPrice;
    }
  }

  return portfolioFromQuantities(quantities, allAffordable, budget, priorityId);
}

// ── Maximum flexibility ─────────────────────────────────────────────────────

function buildMaximumFlexibility(
  normalProducts: PortfolioCandidateProduct[],
  allAffordable: PortfolioCandidateProduct[],
  budget: number,
  priorityId: number | null,
  priorityStrength: PriorityStrength,
  priorityProduct: PortfolioCandidateProduct | null,
): PortfolioCandidateResult | null {
  let oneOz = findPreferredOneOzProduct(normalProducts);

  if (!oneOz) {
    const oneOzProducts = allAffordable.filter((p) => Math.abs(p.weight - GRAMS_PER_TROY_OUNCE) < 0.75);
    oneOzProducts.sort((a, b) =>
      a.premium !== b.premium ? a.premium - b.premium : a.sellPrice / a.weight - b.sellPrice / b.weight,
    );
    if (oneOzProducts.length) oneOz = oneOzProducts[0] ?? null;
  }

  let primaryProduct = oneOz;

  if (priorityProduct && priorityProduct.sellPrice <= budget) {
    if (priorityStrength === 'high' || priorityStrength === 'medium') primaryProduct = priorityProduct;
  }
  if (!primaryProduct && priorityProduct) primaryProduct = priorityProduct;

  const quantities: Record<string, number> = {};

  if (priorityProduct && priorityStrength === 'high') {
    let priorityQty = Math.floor((budget * 0.75) / priorityProduct.sellPrice);
    if (priorityQty < 1 && priorityProduct.sellPrice <= budget) priorityQty = 1;
    priorityQty = Math.min(priorityQty, PORTFOLIO_MAX_QTY);
    if (priorityQty > 0) quantities[priorityProduct.product] = priorityQty;
  } else if (priorityProduct && priorityStrength === 'medium') {
    let mediumQty = Math.floor((budget * 0.5) / priorityProduct.sellPrice);
    if (mediumQty < 1 && priorityProduct.sellPrice <= budget) mediumQty = 1;
    mediumQty = Math.min(mediumQty, PORTFOLIO_MAX_QTY);
    if (mediumQty > 0) quantities[priorityProduct.product] = mediumQty;
  } else if (primaryProduct) {
    let primaryQty = Math.floor(budget / primaryProduct.sellPrice);
    primaryQty = Math.min(primaryQty, PORTFOLIO_MAX_QTY);
    if (primaryQty > 0) quantities[primaryProduct.product] = primaryQty;
  }

  let spent = 0;
  for (const name of Object.keys(quantities)) {
    const product = allAffordable.find((p) => p.product === name);
    if (product) spent += (quantities[name] ?? 0) * product.sellPrice;
  }
  let remaining = budget - spent;

  if (oneOz && (!priorityProduct || oneOz.product !== priorityProduct.product) && oneOz.sellPrice <= remaining) {
    let oneOzQty = Math.floor(remaining / oneOz.sellPrice);

    if (priorityStrength === 'high' && priorityProduct) {
      const priorityValue = (quantities[priorityProduct.product] ?? 0) * priorityProduct.sellPrice;
      oneOzQty = Math.min(oneOzQty, Math.floor(priorityValue / oneOz.sellPrice));
    } else if (priorityStrength === 'medium' && priorityProduct) {
      const mediumPriorityValue = (quantities[priorityProduct.product] ?? 0) * priorityProduct.sellPrice;
      oneOzQty = Math.min(oneOzQty, Math.floor(mediumPriorityValue / oneOz.sellPrice));
    }

    oneOzQty = Math.min(oneOzQty, PORTFOLIO_MAX_QTY);

    if (oneOzQty > 0) {
      quantities[oneOz.product] = (quantities[oneOz.product] ?? 0) + oneOzQty;
      spent += oneOzQty * oneOz.sellPrice;
      remaining = budget - spent;
    }
  }

  const remainderCandidates = allAffordable.filter((p) => p.sellPrice <= remaining);
  remainderCandidates.sort((a, b) => {
    if (priorityProduct) {
      const aPriority = a.product === priorityProduct.product ? 1 : 0;
      const bPriority = b.product === priorityProduct.product ? 1 : 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
    }
    if (oneOz) {
      const aOz = Math.abs(a.weight - GRAMS_PER_TROY_OUNCE) < 0.75 ? 1 : 0;
      const bOz = Math.abs(b.weight - GRAMS_PER_TROY_OUNCE) < 0.75 ? 1 : 0;
      if (aOz !== bOz) return bOz - aOz;
    }
    return a.sellPrice / a.weight - b.sellPrice / b.weight;
  });

  if (remainderCandidates.length) {
    const remainderProduct = remainderCandidates[0]!;
    let remainderQty = Math.floor(remaining / remainderProduct.sellPrice);

    if (
      remainderProduct.weight < GRAMS_PER_TROY_OUNCE &&
      (!priorityProduct || remainderProduct.product !== priorityProduct.product)
    ) {
      remainderQty = Math.min(remainderQty, 5);
    }

    remainderQty = Math.min(remainderQty, PORTFOLIO_MAX_QTY);

    if (remainderQty > 0) {
      quantities[remainderProduct.product] = (quantities[remainderProduct.product] ?? 0) + remainderQty;
    }
  }

  const portfolio = portfolioFromQuantities(quantities, allAffordable, budget, priorityId);
  if (!portfolio) return fallbackPortfolio(allAffordable, budget, priorityId);
  return portfolio;
}

// ── Balanced ─────────────────────────────────────────────────────────────

function priorityMultiplier(strength: PriorityStrength): number {
  switch (strength) {
    case 'high':
      return 1;
    case 'medium':
      return 0.65;
    case 'low':
      return 0.3;
    default:
      return 0;
  }
}

function balancedScore(
  portfolio: PortfolioCandidateResult | null,
  budget: number,
  priorityStrength: PriorityStrength,
): number {
  if (!portfolio) return -Infinity;

  const utilisation = portfolio.totalInvested / budget;
  const efficiencyScore = 1 / Math.max(1, portfolio.averagePerGram / 100);
  const utilisationScore = Math.min(1, utilisation);

  let concentration = 1 - portfolio.largestPositionPercent / 100;
  concentration = Math.max(0, Math.min(1, concentration));

  const pieces = portfolio.pieces;
  let pieceScore: number;
  if (pieces >= 6 && pieces <= 15) pieceScore = 1;
  else if (pieces < 6) pieceScore = pieces / 6;
  else pieceScore = Math.max(0, 1 - (pieces - 15) / 30);

  const goldScore = Math.min(1, portfolio.totalGrams / (budget / 130));
  const priorityScore = portfolio.priorityQuantity > 0 ? 1 : 0;

  let premiumScore: number;
  if (portfolio.averagePremium <= 6) premiumScore = 1;
  else if (portfolio.averagePremium <= 8) premiumScore = 1 - (portfolio.averagePremium - 6) * 0.2;
  else premiumScore = Math.max(0, 0.6 - (portfolio.averagePremium - 8) * 0.1);

  let score =
    utilisationScore * 0.18 +
    efficiencyScore * 0.22 +
    goldScore * 0.24 +
    pieceScore * 0.14 +
    concentration * 0.08 +
    premiumScore * 0.1 +
    priorityScore * priorityMultiplier(priorityStrength) * 0.04;

  if (portfolio.averagePremium > 10) {
    score -= (portfolio.averagePremium - 10) / 100;
  }

  return score;
}

function createBalancedCandidate(
  products: (PortfolioCandidateProduct | null)[],
  quantities: number[],
  allAffordable: PortfolioCandidateProduct[],
  budget: number,
  priorityId: number | null,
): PortfolioCandidateResult | null {
  const map: Record<string, number> = {};

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const qty = quantities[i] ?? 0;
    if (!p || qty <= 0) continue;
    map[p.product] = (map[p.product] ?? 0) + qty;
  }

  return portfolioFromQuantities(map, allAffordable, budget, priorityId);
}

function buildBalanced(
  normalProducts: PortfolioCandidateProduct[],
  allAffordable: PortfolioCandidateProduct[],
  budget: number,
  priorityId: number | null,
  priorityStrength: PriorityStrength,
): PortfolioCandidateResult | null {
  const candidates: (PortfolioCandidateResult | null)[] = [];

  const oneOz = findPreferredOneOzProduct(normalProducts);

  if (oneOz) {
    const maxOz = Math.floor(budget / oneOz.sellPrice);
    for (let q = Math.max(0, maxOz - 8); q <= maxOz; q++) {
      candidates.push(createBalancedCandidate([oneOz], [q], allAffordable, budget, priorityId));
    }
  }

  for (const anchor of normalProducts) {
    if (Math.abs(anchor.weight - GRAMS_PER_TROY_OUNCE) < 0.5) continue;
    if (anchor.sellPrice > budget) continue;

    const maxAnchor = Math.min(5, Math.floor(budget / anchor.sellPrice));

    for (let aq = 1; aq <= maxAnchor; aq++) {
      const spentAnchor = aq * anchor.sellPrice;
      const remainder = budget - spentAnchor;
      const ozQty = oneOz ? Math.floor(remainder / oneOz.sellPrice) : 0;

      for (let delta = 0; delta <= 4; delta++) {
        const actualOz = Math.max(0, ozQty - delta);
        candidates.push(createBalancedCandidate([anchor, oneOz], [aq, actualOz], allAffordable, budget, priorityId));
      }
    }
  }

  for (let a = 0; a < normalProducts.length; a++) {
    const p1 = normalProducts[a]!;
    if (p1.sellPrice > budget) continue;

    for (let b = a + 1; b < normalProducts.length; b++) {
      const p2 = normalProducts[b]!;
      if (p2.sellPrice > budget) continue;

      const max1 = Math.min(4, Math.floor(budget / p1.sellPrice));
      const max2 = Math.min(12, Math.floor(budget / p2.sellPrice));

      for (let q1 = 1; q1 <= max1; q1++) {
        for (let q2 = 1; q2 <= max2; q2++) {
          const total = q1 * p1.sellPrice + q2 * p2.sellPrice;
          if (total <= budget) {
            candidates.push(createBalancedCandidate([p1, p2], [q1, q2], allAffordable, budget, priorityId));
          }
        }
      }
    }
  }

  if (oneOz) {
    const large = normalProducts.filter((p) => p.weight > GRAMS_PER_TROY_OUNCE * 1.5);

    for (const lp of large) {
      if (lp.sellPrice >= budget) continue;

      const maxLarge = Math.min(2, Math.floor(budget / lp.sellPrice));

      for (let lq = 1; lq <= maxLarge; lq++) {
        const rem = budget - lq * lp.sellPrice;
        const oq = Math.floor(rem / oneOz.sellPrice);

        for (let od = 0; od <= 3; od++) {
          const finalOq = Math.max(0, oq - od);
          candidates.push(createBalancedCandidate([lp, oneOz], [lq, finalOq], allAffordable, budget, priorityId));
        }
      }
    }
  }

  const validCandidates = candidates.filter(
    (c): c is PortfolioCandidateResult => !!c && c.totalInvested > 0,
  );

  if (!validCandidates.length) {
    return fallbackPortfolio(allAffordable, budget, priorityId);
  }

  validCandidates.sort(
    (a, b) => balancedScore(b, budget, priorityStrength) - balancedScore(a, budget, priorityStrength),
  );

  return validCandidates[0]!;
}

// ── Entry point ─────────────────────────────────────────────────────────

/**
 * Builds and scores the three portfolio strategies for a budget. Throws a
 * plain Error with a user-facing message on invalid input — callers in an
 * HTTP context should catch and rethrow as a 400.
 */
export function buildPortfolioStrategies(
  allProducts: PortfolioCandidateProduct[],
  budget: number,
  productType: PortfolioProductTypeFilter,
  priorityProductName: string,
  priorityStrength: PriorityStrength,
): PortfolioStrategyResult[] {
  if (!isFinite(budget) || budget <= 0) {
    throw new Error('Please enter a valid investment budget.');
  }

  const products = allProducts.filter((p) => {
    if (productType === 'bar') return p.type === 'bar';
    if (productType === 'coin') return p.type === 'coin';
    return true;
  });

  if (!products.length) {
    throw new Error('No products matching the selected product type were found.');
  }

  const priorityProductObject = priorityProductName
    ? (products.find((p) => p.product === priorityProductName) ?? null)
    : null;
  const priorityId = priorityProductObject ? priorityProductObject.id : null;

  const normalProducts = getNormalProducts(products, budget, priorityProductName);
  const allAffordable = products.filter((p) => p.sellPrice <= budget);

  if (!allAffordable.length) {
    throw new Error('No product can be purchased within the selected budget.');
  }

  const maximum = buildMaximumValue(normalProducts, allAffordable, budget, priorityId);
  const balanced = buildBalanced(normalProducts, allAffordable, budget, priorityId, priorityStrength);
  const flexible = buildMaximumFlexibility(
    normalProducts,
    allAffordable,
    budget,
    priorityId,
    priorityStrength,
    priorityProductObject,
  );

  const fallback = () => fallbackPortfolio(allAffordable, budget, priorityId);

  const strategies: { id: PortfolioStrategyId; name: string; badge: string; description: string; result: PortfolioCandidateResult | null }[] = [
    {
      id: 'maximum',
      name: 'Maximum Value',
      badge: 'MAXIMUM VALUE',
      description:
        'Starts with the largest affordable investment products and works down through the remaining budget, prioritising gold acquired and acquisition efficiency.',
      result: maximum,
    },
    {
      id: 'balanced',
      name: 'Balanced',
      badge: 'RECOMMENDED',
      description:
        'Looks for a sensible combination of larger bars and 1oz bars, balancing gold acquired, concentration and resale flexibility.',
      result: balanced,
    },
    {
      id: 'flexible',
      name: 'Maximum Flexibility',
      badge: 'MAXIMUM FLEXIBILITY',
      description:
        "Favours independently sellable 1oz positions and uses the remaining budget efficiently without turning a large investment into a collection of small-investor products.",
      result: flexible,
    },
  ];

  return strategies.map(({ id, name, badge, description, result }) => ({
    strategy: { id, name, badge, description },
    result: result ?? fallback() ?? {
      totalInvested: 0,
      unspent: budget,
      totalGrams: 0,
      averagePerGram: 0,
      averagePremium: 0,
      pieces: 0,
      largestPositionPercent: 0,
      flexibilityScore: 0,
      priorityQuantity: 0,
      priorityShare: 0,
      items: [],
    },
  }));
}
