import { describe, expect, it } from 'vitest';
import {
  buildPortfolioStrategies,
  PORTFOLIO_MAX_QTY,
  type PortfolioCandidateProduct,
} from './portfolio-builder-math';
import { PortfolioBuildRequestSchema } from './portfolio.schema';

// Whole-euro prices for the seed gold bars at a €4,500/oz spot.
const bar = (id: number, product: string, weight: number, sellPrice: number, premium: number): PortfolioCandidateProduct => ({
  id,
  product,
  weight,
  sellPrice,
  premium,
  type: 'bar',
});
const coin = (id: number, product: string, weight: number, sellPrice: number): PortfolioCandidateProduct => ({
  id,
  product,
  weight,
  sellPrice,
  premium: 3,
  type: 'coin',
});

const oneOz = bar(1, '1 oz Gold Bar', 31.1035, 4590, 2);
const kilo = bar(2, '1 kg Gold Bar', 1000, 148296, 2.5);
const oneGram = bar(3, '1 g Gold Bar', 1, 147, 1.5);
const hundredGram = bar(6, '100 g Gold Bar', 100, 14758, 2);
const fiftyGram = bar(7, '50 g Gold Bar', 50, 7379, 2);
const fiveGram = bar(8, '5 g Gold Bar', 5, 735, 1.5);
const bars = [oneOz, kilo, oneGram, hundredGram, fiftyGram, fiveGram];

describe('buildPortfolioStrategies', () => {
  it('returns maximum, balanced and flexible, in that order', () => {
    const out = buildPortfolioStrategies(bars, 150_000, 'bar', '1 oz Gold Bar', 'medium');

    expect(out.map((s) => s.strategy.id)).toEqual(['maximum', 'balanced', 'flexible']);
  });

  it('filters candidates by product type before building', () => {
    const mixed = [...bars, coin(4, '1 oz Gold Coin', 31.1035, 4635)];

    const out = buildPortfolioStrategies(mixed, 150_000, 'bar', '', 'none');

    for (const s of out) for (const item of s.result.items) expect(item.type).toBe('bar');
  });

  it('never exceeds the budget or the per-product quantity cap', () => {
    for (const strength of ['none', 'low', 'medium', 'high'] as const) {
      const out = buildPortfolioStrategies(bars, 150_000, 'bar', '1 oz Gold Bar', strength);
      for (const s of out) {
        expect(s.result.totalInvested).toBeLessThanOrEqual(150_000);
        for (const item of s.result.items) expect(item.quantity).toBeLessThanOrEqual(PORTFOLIO_MAX_QTY);
      }
    }
  });

  it('Maximum Value buys the single 1 kg bar at €150,000', () => {
    const [maximum] = buildPortfolioStrategies(bars, 150_000, 'bar', '1 oz Gold Bar', 'medium');

    expect(maximum!.result.items.map((i) => `${i.quantity}x ${i.product}`)).toEqual(['1x 1 kg Gold Bar']);
    expect(maximum!.result.unspent).toBe(1704);
  });

  it('Balanced at medium priority holds 16 x 1 oz (about half the portfolio) plus 5 x 100 g', () => {
    const out = buildPortfolioStrategies(bars, 150_000, 'bar', '1 oz Gold Bar', 'medium');
    const balanced = out.find((s) => s.strategy.id === 'balanced')!.result;

    expect(balanced.items.map((i) => `${i.quantity}x ${i.product}`).sort()).toEqual([
      '16x 1 oz Gold Bar',
      '5x 100 g Gold Bar',
    ]);
    expect(Math.round(balanced.priorityShare)).toBe(50);
    expect(balanced.totalInvested).toBe(16 * 4590 + 5 * 14758);
  });

  it('for a budget over €5,000 the balanced search ignores sub-1oz products', () => {
    const out = buildPortfolioStrategies(bars, 150_000, 'bar', '', 'none');
    const balanced = out.find((s) => s.strategy.id === 'balanced')!.result;

    for (const item of balanced.items) expect(item.weight).toBeGreaterThanOrEqual(31);
  });

  it('flexibility score is 0 to 100', () => {
    const out = buildPortfolioStrategies(bars, 150_000, 'bar', '1 oz Gold Bar', 'medium');

    for (const s of out) {
      expect(s.result.flexibilityScore).toBeGreaterThanOrEqual(0);
      expect(s.result.flexibilityScore).toBeLessThanOrEqual(100);
    }
  });

  it('rejects a non-positive budget with a user-facing message', () => {
    expect(() => buildPortfolioStrategies(bars, 0, 'bar', '', 'none')).toThrow('valid investment budget');
  });

  it('rejects a type filter that matches nothing', () => {
    expect(() => buildPortfolioStrategies(bars, 150_000, 'coin', '', 'none')).toThrow('No products matching');
  });

  it('rejects a budget below the cheapest product', () => {
    expect(() => buildPortfolioStrategies(bars, 100, 'bar', '', 'none')).toThrow('No product can be purchased');
  });
});

describe('PortfolioBuildRequestSchema', () => {
  const valid = {
    metalType: 'GOLD',
    budget: 150000,
    productType: 'bar',
    priorityProductId: 1,
    priorityStrength: 'medium',
  };

  it('accepts the Builder form payload', () => {
    expect(PortfolioBuildRequestSchema.safeParse(valid).success).toBe(true);
  });

  it('coerces a string budget to a number', () => {
    const parsed = PortfolioBuildRequestSchema.parse({ ...valid, budget: '150000' });

    expect(parsed.budget).toBe(150000);
  });

  it.each([
    ['zero budget', { budget: 0 }],
    ['negative budget', { budget: -5 }],
    ['unknown product type', { productType: 'ingot' }],
    ['unknown strength', { priorityStrength: 'extreme' }],
    ['unknown metal', { metalType: 'COPPER' }],
    ['non-positive custom spot', { customSpot: 0 }],
  ])('rejects %s', (_label, patch) => {
    expect(PortfolioBuildRequestSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });

  it('priority product and custom spot are optional', () => {
    const { priorityProductId: _omit, ...rest } = valid;

    expect(PortfolioBuildRequestSchema.safeParse(rest).success).toBe(true);
  });
});
