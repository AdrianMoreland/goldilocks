import type { MetalType } from './spot-price.schema';
import type { Product, RawProduct } from './product.schema';
import {
  GRAMS_PER_TROY_OUNCE,
  effectiveVatRate,
  roundBuyPrice,
  roundSellPrice,
} from './pricing-math';

/** Rounds to 2 decimal places (display figures such as weight, spot and market value). */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Prices one stored product from a spot-price map (euros per troy ounce, by metal). The one place
 * a product's quoted Price, Price ex. VAT and Buyback are worked out, so the staff app, the API and
 * the public site cannot disagree on a price.
 */
export function calculateProductPrice(
  product: RawProduct,
  spotMap: Record<MetalType, number>,
): Product {
  const marketPrice = spotMap[product.metalType] ?? 0;
  const spotPerGram = marketPrice / GRAMS_PER_TROY_OUNCE;

  const basePrice = spotPerGram * product.weight;

  const priceSellVatExcl = basePrice * (1 + product.spreadSell);
  const vatRate = effectiveVatRate(product);
  const priceSell = priceSellVatExcl * (1 + vatRate);
  const priceBuy = basePrice * (1 + product.spreadBuy);

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    metalType: product.metalType,
    weight: round2(product.weight),
    description: product.description ?? '',

    spreadSell: product.spreadSell,
    spreadBuy: product.spreadBuy,
    vatRate,

    spotPrice: round2(marketPrice),
    marketValue: round2(basePrice),
    // Quoted prices are whole euros, rounded in the dealer's favour: what we charge rounds up, what
    // we pay rounds down - the same rule the Trade tool's computeTransactionPrice applies.
    priceSell: roundSellPrice(priceSell),
    priceSellVatExcl: roundSellPrice(priceSellVatExcl),
    priceBuy: roundBuyPrice(priceBuy),

    stock: product.stock,
    isActive: product.isActive,
    category: product.category ?? null,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

/** Merges a base spot-price map with overrides; an override wins when it has a value. */
export function mergeMetalPrices(
  base: Record<MetalType, number>,
  overrides: Partial<Record<MetalType, number>>,
): Record<MetalType, number> {
  const merged = { ...base };

  for (const metal of Object.keys(overrides) as MetalType[]) {
    const value = overrides[metal];

    if (value !== undefined) {
      merged[metal] = value;
    }
  }

  return merged;
}
