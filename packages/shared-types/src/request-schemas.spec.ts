import { describe, expect, it } from 'vitest';
import { HistoricCloseQuerySchema, RecalculateOverridesSchema } from './market-data.schema';
import { UpdateStockRequestSchema } from './product.schema';

describe('RecalculateOverridesSchema', () => {
  it('accepts a partial map of positive numbers', () => {
    expect(RecalculateOverridesSchema.parse({ GOLD: 3000.5 })).toEqual({ GOLD: 3000.5 });
    expect(RecalculateOverridesSchema.parse({})).toEqual({});
  });

  it.each([
    ['a string', { GOLD: '3000' }],
    ['zero', { SILVER: 0 }],
    ['a negative', { PLATINUM: -1 }],
    ['NaN', { PALLADIUM: NaN }],
    ['Infinity', { GOLD: Infinity }],
  ])('rejects %s', (_label, body) => {
    expect(RecalculateOverridesSchema.safeParse(body).success).toBe(false);
  });

  it('drops unknown metals instead of passing them on', () => {
    expect(RecalculateOverridesSchema.parse({ GOLD: 1, COPPER: 2 })).toEqual({ GOLD: 1 });
  });
});

describe('HistoricCloseQuerySchema', () => {
  it('accepts a real date and an omitted date', () => {
    expect(HistoricCloseQuerySchema.parse({ date: '2026-09-29' })).toEqual({ date: '2026-09-29' });
    expect(HistoricCloseQuerySchema.parse({})).toEqual({});
  });

  it('accepts a leap day only in a leap year', () => {
    expect(HistoricCloseQuerySchema.safeParse({ date: '2028-02-29' }).success).toBe(true);
    expect(HistoricCloseQuerySchema.safeParse({ date: '2026-02-29' }).success).toBe(false);
  });

  it.each(['garbage', '2026-9-1', '2026-02-30', '2026-13-01', '2026-09-29T00:00:00Z', ''])(
    'rejects %j',
    (date) => {
      expect(HistoricCloseQuerySchema.safeParse({ date }).success).toBe(false);
    },
  );
});

describe('UpdateStockRequestSchema', () => {
  it('accepts a non-negative integer', () => {
    expect(UpdateStockRequestSchema.parse({ stock_quantity: 0 })).toEqual({ stock_quantity: 0 });
    expect(UpdateStockRequestSchema.parse({ stock_quantity: 12 })).toEqual({ stock_quantity: 12 });
  });

  it.each([{ stock_quantity: -1 }, { stock_quantity: 1.5 }, { stock_quantity: '5' }, {}])('rejects %j', (body) => {
    expect(UpdateStockRequestSchema.safeParse(body).success).toBe(false);
  });
});
