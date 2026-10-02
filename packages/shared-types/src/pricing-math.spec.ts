import { describe, expect, it } from 'vitest';
import { computeMeltValue, computeTransactionPrice, roundBuyPrice, roundSellPrice } from './pricing-math';

describe('computeTransactionPrice float noise', () => {
  it('does not push a whole-euro Sell price up by €1', () => {
    // 2948.0000000004 is a whole-euro price in exact arithmetic.
    expect(computeTransactionPrice(2948.0000000004, 'buying', 0)).toBe(2948);
  });

  it('does not push a whole-euro Buyback price down by €1', () => {
    expect(computeTransactionPrice(2947.9999999996, 'selling', 0)).toBe(2948);
  });
});

describe('computeTransactionPrice', () => {
  describe('buying (dealer sells to customer — rounds UP, favors the dealer)', () => {
    it('adds the premium on top of the base price', () => {
      expect(computeTransactionPrice(1000, 'buying', 10)).toBe(1100);
    });

    it('rounds a fractional result up, never down', () => {
      // 100 * 1.03 = 103.00...01-ish in float terms, but even a clean
      // fractional case must round toward the dealer, i.e. up.
      expect(computeTransactionPrice(333, 'buying', 7)).toBe(Math.ceil(333 * 1.07));
      expect(computeTransactionPrice(333, 'buying', 7)).toBeGreaterThanOrEqual(333 * 1.07);
    });

    it('a 0% premium still ceils (never returns less than base price)', () => {
      expect(computeTransactionPrice(100.2, 'buying', 0)).toBe(101);
    });

    it('a zero base price stays zero regardless of premium', () => {
      expect(computeTransactionPrice(0, 'buying', 25)).toBe(0);
    });
  });

  describe('selling (dealer buys from customer — rounds DOWN, favors the dealer)', () => {
    it('subtracts the discount from the base price', () => {
      expect(computeTransactionPrice(1000, 'selling', 10)).toBe(900);
    });

    it('rounds a fractional result down, never up', () => {
      expect(computeTransactionPrice(333, 'selling', 7)).toBe(Math.floor(333 * 0.93));
      expect(computeTransactionPrice(333, 'selling', 7)).toBeLessThanOrEqual(333 * 0.93);
    });

    it('a 0% discount still floors (never returns more than base price)', () => {
      expect(computeTransactionPrice(100.8, 'selling', 0)).toBe(100);
    });

    it('a zero base price stays zero regardless of discount', () => {
      expect(computeTransactionPrice(0, 'selling', 40)).toBe(0);
    });
  });
});

describe('computeMeltValue', () => {
  it('multiplies spot-per-gram by melt factor, purity, and weight', () => {
    expect(computeMeltValue(50, 0.995, 0.9167, 10)).toBeCloseTo(50 * 0.995 * 0.9167 * 10, 6);
  });

  it('is zero when weight is zero', () => {
    expect(computeMeltValue(50, 0.995, 0.9167, 0)).toBe(0);
  });

  it('collapses to spot * weight when meltFactor and purity are both 1', () => {
    expect(computeMeltValue(42.5, 1, 1, 3)).toBeCloseTo(42.5 * 3, 6);
  });
});

describe('roundSellPrice / roundBuyPrice (whole-euro quoted prices)', () => {
  it('rounds what we charge up and what we pay down', () => {
    expect(roundSellPrice(2948.01)).toBe(2949);
    expect(roundBuyPrice(2948.99)).toBe(2948);
  });

  it('leaves whole-euro amounts alone', () => {
    expect(roundSellPrice(2948)).toBe(2948);
    expect(roundBuyPrice(2948)).toBe(2948);
  });

  it('ignores float noise below a cent instead of adding or losing a euro', () => {
    expect(roundSellPrice(2948.0000000004)).toBe(2948);
    expect(roundBuyPrice(2947.9999999996)).toBe(2948);
  });
});
