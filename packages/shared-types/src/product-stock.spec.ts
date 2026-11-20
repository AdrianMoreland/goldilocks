import { describe, expect, it } from 'vitest';
import { productStockKey, productStockLevels } from './product-stock';

const p = (id: number, name: string, metalType = 'GOLD') => ({ id, name, metalType });
const line = (
  family: string,
  variant: string,
  qty: number,
  extra: Partial<{ metal: string; kind: string; refinery: string; branchCode: string; lowThreshold: number | null }> = {},
) => ({
  metal: 'GOLD',
  kind: family === 'Bar' ? 'BAR' : 'COIN',
  family,
  variant,
  refinery: '',
  qty,
  lowThreshold: null,
  branchCode: 'DUB',
  branchName: 'Dublin',
  ...extra,
});

describe('productStockKey', () => {
  it.each([
    ['1oz Gold Bar', 'GOLD', { metal: 'GOLD', kind: 'BAR', variant: '1oz', pampOnly: false }],
    ['1 oz Gold PAMP Bar', 'GOLD', { metal: 'GOLD', kind: 'BAR', variant: '1oz', pampOnly: true }],
    ['1oz Britannia', 'SILVER', { metal: 'SILVER', kind: 'COIN', family: 'Britannia', variant: '1oz' }],
    ['1oz US Eagle', 'GOLD', { metal: 'GOLD', kind: 'COIN', family: 'Eagle', variant: '1oz' }],
    ['Full Sovereign', 'GOLD', { metal: 'GOLD', kind: 'COIN', family: 'Sovereign', variant: 'Full' }],
    ['1/10oz Coin', 'GOLD', { metal: 'GOLD', kind: 'COIN', family: null, variant: '1/10oz' }],
  ])('reads %s', (name, metalType, key) => {
    expect(productStockKey({ name, metalType })).toEqual(key);
  });

  it.each([
    ['1oz Platinum Bar', 'PLATINUM'],
    ['1kg Silver Bonded Bar', 'SILVER'],
    ['1oz Bonded Coins', 'SILVER'],
    ['100 g Gold CombiBar', 'GOLD'],
    ["2oz Queen's Beasts", 'SILVER'],
  ])('gives no key for %s, so no flag rather than a wrong one', (name, metalType) => {
    expect(productStockKey({ name, metalType })).toBeNull();
  });
});

describe('productStockLevels', () => {
  const lines = [
    line('Bar', '1oz', 3, { branchCode: 'DUB' }),
    line('Bar', '1oz', 2, { branchCode: 'CORK', refinery: 'PAMP' }),
    line('Britannia', '1oz', 0),
    line('Britannia', '1oz 22K', 2),
    line('Maple', '1/10oz', 21),
    line('Krugerrand', '1/10oz', 4),
    line('Eagle', '1/10oz', 33),
    line('Eagle', '1/10oz Proof', 1),
    line('Krugerrand', '1oz', 5, { lowThreshold: 6 }),
    line('Krugerrand', '1oz', 1, { metal: 'SILVER' }),
  ];
  const levels = productStockLevels(
    [
      p(1, '1oz Gold Bar'),
      p(2, '1 oz Gold PAMP Bar'),
      p(3, '1oz Britannia'),
      p(4, '1/10oz Coin'),
      p(5, '1/10oz US Eagle'),
      p(6, '1oz Krugerrand'),
      p(7, '1oz Platinum Bar', 'PLATINUM'),
    ],
    lines,
  );
  const byId = (id: number) => levels.find((l) => l.productId === id);

  it('adds every refinery for a plain bar, and lists branches largest first', () => {
    expect(byId(1)).toMatchObject({ total: 5, state: 'IN' });
    expect(byId(1)!.branches.map((b) => b.code)).toEqual(['DUB', 'CORK']);
  });

  it('counts only PAMP lines for a PAMP bar', () => {
    expect(byId(2)).toMatchObject({ total: 2 });
  });

  it('matches the exact coin variant only, so special editions are not counted', () => {
    expect(byId(3)).toMatchObject({ total: 0, state: 'OUT', branches: [] });
  });

  it('adds every non-US coin of the weight for a generic coin, and the plain Eagle line for a US Eagle', () => {
    expect(byId(4)).toMatchObject({ total: 25 });
    expect(byId(5)).toMatchObject({ total: 33 });
  });

  it('is LOW at or under the threshold, and keeps metals apart', () => {
    expect(byId(6)).toMatchObject({ total: 5, state: 'LOW' });
  });

  it('leaves out products with no key', () => {
    expect(byId(7)).toBeUndefined();
  });
});
