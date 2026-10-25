import { describe, expect, it } from 'vitest';
import { GRAMS_PER_TROY_OUNCE } from './pricing-math';
import { calculateProductPrice, mergeMetalPrices } from './product-pricing';
import type { RawProduct } from './product.schema';

// Expected values are worked out by hand from the business rules: price = spot x ounces x
// (1 + premium) x (1 + VAT); buyback = spot x ounces x (1 + spreadBuy) with spreadBuy negative.
// Quoted prices are whole euros: what we charge rounds up, what we pay rounds down, after
// absorbing float noise below one cent.

const spots = { GOLD: 2000, SILVER: 25, PLATINUM: 900, PALLADIUM: 1000 };

const product = (over: Partial<RawProduct> = {}): RawProduct => ({
  id: 1,
  sku: 'GB-1OZ',
  name: '1oz Gold Bar',
  metalType: 'GOLD',
  weight: GRAMS_PER_TROY_OUNCE, // exactly 1 troy ounce
  spreadSell: 0.05,
  spreadBuy: -0.03,
  vatRate: 0,
  stock: 3,
  isActive: true,
  description: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...over,
});

describe('calculateProductPrice', () => {
  it('prices a VAT-free bar: 2000 spot + 5% premium sells at 2100, buys back at 1940', () => {
    const priced = calculateProductPrice(product(), spots);

    expect(priced.priceSell).toBe(2100);
    expect(priced.priceSellVatExcl).toBe(2100);
    expect(priced.priceBuy).toBe(1940); // 2000 - 3%
    expect(priced.marketValue).toBe(2000);
    expect(priced.spotPrice).toBe(2000);
  });

  it('adds VAT on top of the premium: 2100 x 1.23 = 2583', () => {
    const priced = calculateProductPrice(product({ vatRate: 0.23 }), spots);

    expect(priced.priceSellVatExcl).toBe(2100);
    expect(priced.priceSell).toBe(2583);
  });

  it('does not push an exact whole-euro price up by a euro because of float noise', () => {
    // 1900 + 7% is exactly 2033, but binary floating point gives 2033.0000000000002, which a naive
    // ceil would turn into 2034.
    expect(Math.ceil(1900 * 1.07)).toBe(2034);

    const priced = calculateProductPrice(
      product({ spreadSell: 0.07 }),
      { ...spots, GOLD: 1900 },
    );

    expect(priced.priceSell).toBe(2033);
  });

  it('rounds a charged price up and a paid price down at half a euro', () => {
    const sell = calculateProductPrice(
      product({ spreadSell: 0, vatRate: 0 }),
      { ...spots, GOLD: 2100.5 },
    );
    const buy = calculateProductPrice(
      product({ spreadBuy: 0 }),
      { ...spots, GOLD: 2100.5 },
    );

    expect(sell.priceSell).toBe(2101); // up: we are charging
    expect(buy.priceBuy).toBe(2100); // down: we are paying
  });

  it('charges the full amount for a sub-euro remainder rather than giving it away', () => {
    const priced = calculateProductPrice(
      product({ spreadSell: 0 }),
      { ...spots, GOLD: 2100.01 },
    );

    expect(priced.priceSell).toBe(2101);
  });

  it('takes a negative sell spread as a discount', () => {
    const priced = calculateProductPrice(product({ spreadSell: -0.1 }), spots);

    expect(priced.priceSell).toBe(1800); // 2000 - 10%
  });

  it('scales with weight: a 10oz bar is ten times the price', () => {
    const priced = calculateProductPrice(product({ weight: GRAMS_PER_TROY_OUNCE * 10 }), spots);

    expect(priced.priceSell).toBe(21000);
    expect(priced.priceBuy).toBe(19400);
  });

  it('prices everything at zero when the spot is zero or the metal has no spot', () => {
    const zero = calculateProductPrice(product(), { ...spots, GOLD: 0 });
    const missing = calculateProductPrice(product(), {} as typeof spots);

    for (const priced of [zero, missing]) {
      expect(priced.priceSell).toBe(0);
      expect(priced.priceBuy).toBe(0);
      expect(priced.marketValue).toBe(0);
    }
  });

  it('charges no VAT on a bonded product whatever rate is stored', () => {
    const priced = calculateProductPrice(
      product({ name: '100oz Silver Bonded Bar', metalType: 'SILVER', vatRate: 0.23 }),
      spots,
    );

    expect(priced.vatRate).toBe(0);
    expect(priced.priceSell).toBe(priced.priceSellVatExcl);
  });

  it('shows the weight to two decimals and an empty description as ""', () => {
    const priced = calculateProductPrice(product(), spots);

    expect(priced.weight).toBe(31.1);
    expect(priced.description).toBe('');
  });
});

describe('mergeMetalPrices', () => {
  it('lets an override win and leaves the other metals alone', () => {
    expect(mergeMetalPrices(spots, { GOLD: 3000 })).toEqual({ ...spots, GOLD: 3000 });
  });

  it('ignores an override that has no value and does not change the base map', () => {
    const merged = mergeMetalPrices(spots, { SILVER: undefined });

    expect(merged).toEqual(spots);
    expect(merged).not.toBe(spots);
  });
});
