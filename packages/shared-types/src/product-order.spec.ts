import { describe, expect, it } from 'vitest';
import { compareProducts, compareStockLabels, type OrderableProduct } from './product-order';

const p = (id: number, name: string, metalType: OrderableProduct['metalType'], weight: number): OrderableProduct => ({ id, name, metalType, weight });

describe('compareProducts', () => {
  const list = [
    p(1, '1oz Britannia', 'SILVER', 31.1035),
    p(2, '5g Gold Bar', 'GOLD', 5),
    p(3, '1KG Silver Bar', 'SILVER', 1000),
    p(4, '100g Gold Bar', 'GOLD', 100),
    p(5, '1oz Palladium Bar', 'PALLADIUM', 31.1035),
    p(6, '1oz Gold Bar', 'GOLD', 31.1035),
    p(7, '250g Gold Bar', 'GOLD', 250),
    p(8, '1oz Platinum Bar', 'PLATINUM', 31.1035),
    p(9, '1oz Krugerrand', 'GOLD', 31.1035),
    p(10, '1KG Gold Bar', 'GOLD', 1000),
  ];
  const names = (metal: OrderableProduct['metalType']) => [...list].sort(compareProducts).filter((x) => x.metalType === metal).map((x) => x.name);

  it('puts gold first, then silver, then platinum, then palladium', () => {
    const order = [...list].sort(compareProducts).map((x) => x.metalType);
    expect(order[0]).toBe('GOLD');
    expect(order.indexOf('SILVER')).toBeGreaterThan(order.lastIndexOf('GOLD'));
    expect(order.indexOf('PLATINUM')).toBeGreaterThan(order.lastIndexOf('SILVER'));
    expect(order.indexOf('PALLADIUM')).toBeGreaterThan(order.lastIndexOf('PLATINUM'));
  });

  it('puts 1oz then 100g first within a metal, then heaviest to lightest, then by name', () => {
    expect(names('GOLD')).toEqual(['1oz Gold Bar', '1oz Krugerrand', '100g Gold Bar', '1KG Gold Bar', '250g Gold Bar', '5g Gold Bar']);
    expect(names('SILVER')).toEqual(['1oz Britannia', '1KG Silver Bar']);
  });

  it('does not use the id for importance', () => {
    expect([...list].sort(compareProducts)[0]?.id).toBe(6);
  });

  it('falls back to the id only for identical products', () => {
    expect(compareProducts(p(1, 'X', 'GOLD', 10), p(2, 'X', 'GOLD', 10))).toBeLessThan(0);
  });
});

describe('compareStockLabels', () => {
  const rows = [
    { metal: 'SILVER' as const, label: '1KG Bar' },
    { metal: 'GOLD' as const, label: '5g Bar' },
    { metal: 'GOLD' as const, label: '100g Bar' },
    { metal: null, label: '1oz Mystery' },
    { metal: 'GOLD' as const, label: '1oz Krugerrand' },
    { metal: 'GOLD' as const, label: '1/2oz Krugerrand' },
    { metal: 'GOLD' as const, label: 'Gold Melt' },
    { metal: 'PGM' as const, label: '1oz bar' },
  ];
  it('orders bars, coin lines and customer orders the same way, using the weight in the label', () => {
    expect([...rows].sort(compareStockLabels).map((r) => r.label)).toEqual([
      '1oz Krugerrand',
      '100g Bar',
      '1/2oz Krugerrand',
      '5g Bar',
      'Gold Melt',
      '1KG Bar',
      '1oz bar',
      '1oz Mystery',
    ]);
  });
});
