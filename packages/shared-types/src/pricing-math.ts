import type { TradeTransactionType } from './trade.schema';

// ============================================================================
// PRICING MATH — pure domain logic, no I/O.
//
// Ported from the Merrion Gold Apps Script tool's PricingMath.gs / MeltMath.gs
// (the source comments there literally flagged these as "the file to lift
// into a shared TS package").
// ============================================================================

export const GRAMS_PER_TROY_OUNCE = 31.1034768;

/**
 * Prices one line: a buy (customer pays a premium over spot) or a sell
 * (customer receives a discount off spot).
 *
 * Rounding always favors the dealer, not the customer:
 *   - 'buying'  (dealer sells to customer)   -> round UP   (Math.ceil)
 *   - 'selling' (dealer buys from customer)  -> round DOWN (Math.floor)
 */
export function computeTransactionPrice(
  basePrice: number,
  transactionType: TradeTransactionType,
  percent: number,
): number {
  if (transactionType === 'buying') {
    return Math.ceil(basePrice * (1 + percent / 100));
  }

  return Math.floor(basePrice * (1 - percent / 100));
}

export function computeMeltValue(
  spotPerGram: number,
  meltFactor: number,
  purity: number,
  weight: number,
): number {
  return spotPerGram * meltFactor * purity * weight;
}

// ============================================================================
// PROFIT ANALYSIS — Portfolio P/L subtab.
//
// Ported from PricingMath.gs. `productMultiplier` there was
// baseProductSpot / masterSpot — a per-row snapshot ratio. Goldilocks has no
// such snapshot (every price is computed live from spot), and since
// baseProductSpot itself is just spot * weight/troyOunce at read time, the
// ratio collapses to a spot-independent constant: weight / troyOunce. Callers
// should pass `product.weight / GRAMS_PER_TROY_OUNCE`.
// ============================================================================

export type ProfitAnalysisMissingField = 'spot' | 'premium' | 'price';

/**
 * Exactly one of {spot, premium, price} is unknown; the other two determine
 * it. Throws a plain Error with a user-facing message on invalid input —
 * callers in an HTTP context should catch and rethrow as a 400.
 */
export function solveMissingPurchaseField(
  missingField: ProfitAnalysisMissingField,
  purchaseSpot: number,
  purchasePremium: number,
  purchasePrice: number,
  productMultiplier: number,
): { purchaseSpot: number; purchasePremium: number; purchasePrice: number } {
  if (missingField === 'price') {
    if (!isFinite(purchaseSpot) || purchaseSpot <= 0) {
      throw new Error('Please enter a valid purchase spot.');
    }
    if (!isFinite(purchasePremium) || purchasePremium < 0) {
      throw new Error('Please enter a valid purchase premium.');
    }
    purchasePrice = purchaseSpot * productMultiplier * (1 + purchasePremium / 100);
  } else if (missingField === 'premium') {
    if (!isFinite(purchaseSpot) || purchaseSpot <= 0) {
      throw new Error('Please enter a valid purchase spot.');
    }
    if (!isFinite(purchasePrice) || purchasePrice <= 0) {
      throw new Error('Please enter a valid purchase price.');
    }
    const adjustedSpot = purchaseSpot * productMultiplier;
    if (adjustedSpot <= 0) {
      throw new Error('Unable to calculate the purchase premium.');
    }
    purchasePremium = (purchasePrice / adjustedSpot - 1) * 100;
  } else if (missingField === 'spot') {
    if (!isFinite(purchasePremium) || purchasePremium < 0) {
      throw new Error('Please enter a valid purchase premium.');
    }
    if (!isFinite(purchasePrice) || purchasePrice <= 0) {
      throw new Error('Please enter a valid purchase price.');
    }
    const denominator = productMultiplier * (1 + purchasePremium / 100);
    if (denominator <= 0) {
      throw new Error('Unable to calculate the purchase spot.');
    }
    purchaseSpot = purchasePrice / denominator;
  } else {
    throw new Error('Invalid field selection.');
  }

  return { purchaseSpot, purchasePremium, purchasePrice };
}

export function computeCurrentBuybackValue(
  currentSpot: number,
  currentDiscount: number,
  productMultiplier: number,
): number {
  const currentAdjustedSpot = currentSpot * productMultiplier;
  return currentAdjustedSpot * (1 - currentDiscount / 100);
}

export function computeProfit(
  currentBuybackValue: number,
  purchasePrice: number,
): { profit: number; profitPercent: number } {
  const profit = currentBuybackValue - purchasePrice;
  const profitPercent = purchasePrice !== 0 ? (profit / purchasePrice) * 100 : 0;
  return { profit, profitPercent };
}

export function computeRequiredSpotForTarget(
  purchasePrice: number,
  targetProfit: number,
  productMultiplier: number,
  currentDiscount: number,
): { requiredPrice: number; requiredSpot: number; targetReturn: number } {
  const requiredPrice = purchasePrice + targetProfit;
  const requiredDenominator = productMultiplier * (1 - currentDiscount / 100);
  const requiredSpot = requiredDenominator > 0 ? requiredPrice / requiredDenominator : 0;
  const targetReturn = purchasePrice !== 0 ? (targetProfit / purchasePrice) * 100 : 0;

  return { requiredPrice, requiredSpot, targetReturn };
}
