import { describe, expect, it } from 'vitest';
import { compareProducts, type OrderableProduct } from './product-order';

const p = (id: number, name: string, metalType: OrderableProduct['metalType'], weight: number, category: OrderableProduct['category'] = 'BAR'): OrderableProduct => ({
  id,
  name,
  metalType,
  weight,
  category,
});

describe('compareProducts', () => {
  const list = [
    p(1, '1oz Britannia', 'SILVER', 31.1035, 'COIN'),
    p(2, '5g Gold Bar', 'GOLD', 5),
    p(3, '1KG Silver Bar', 'SILVER', 1000),
    p(4, '100g Gold Bar', 'GOLD', 100),
    p(5, '1oz Palladium Bar', 'PALLADIUM', 31.1035),
    p(6, '1oz Gold Bar', 'GOLD', 31.1035),
    p(7, '250g Gold Bar', 'GOLD', 250),
    p(8, '1oz Platinum Bar', 'PLATINUM', 31.1035),
    p(9, '1oz Krugerrand', 'GOLD', 31.1035, 'COIN'),
  ];

  it('puts gold first, then silver, then the rest', () => {
    const order = [...list].sort(compareProducts).map((x) => x.metalType);
    expect(order[0]).toBe('GOLD');
    expect(order.indexOf('SILVER')).toBeGreaterThan(order.lastIndexOf('GOLD'));
    expect(order.indexOf('PLATINUM')).toBeGreaterThan(order.lastIndexOf('SILVER'));
    expect(order.indexOf('PALLADIUM')).toBeGreaterThan(order.lastIndexOf('PLATINUM'));
  });

  it('puts 1oz then 100g first within a metal, bars before coins, then by weight', () => {
    const gold = [...list].sort(compareProducts).filter((x) => x.metalType === 'GOLD').map((x) => x.name);
    expect(gold).toEqual(['1oz Gold Bar', '1oz Krugerrand', '100g Gold Bar', '5g Gold Bar', '250g Gold Bar']);
  });

  it('does not use the id for importance', () => {
    expect([...list].sort(compareProducts)[0]?.id).toBe(6);
  });

  it('is stable for identical products by falling back to the id', () => {
    expect(compareProducts(p(1, 'X', 'GOLD', 10), p(2, 'X', 'GOLD', 10))).toBeLessThan(0);
  });
});
