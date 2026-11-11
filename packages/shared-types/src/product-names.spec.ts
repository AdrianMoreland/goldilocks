import { describe, expect, it } from 'vitest';
import { bcItemNoFromSku, deriveMetalHint } from './product-names';

describe('bcItemNoFromSku', () => {
  it('reads a BC item number out of a Zoho SKU', () => {
    expect(bcItemNoFromSku('1103')).toBe('1103');
    expect(bcItemNoFromSku('1103-HISTORIC')).toBe('1103');
    expect(bcItemNoFromSku('2705.0')).toBe('2705');
  });
  it('ignores a SKU that is not an item number', () => {
    expect(bcItemNoFromSku('GOLD-1OZ-BAR')).toBeNull();
    expect(bcItemNoFromSku('12')).toBeNull();
    expect(bcItemNoFromSku('')).toBeNull();
    expect(bcItemNoFromSku(null)).toBeNull();
  });
});

describe('deriveMetalHint', () => {
  it('takes the metal the text names', () => {
    expect(deriveMetalHint('1oz silver britannia', 'invoice_lines')).toBe('SILVER');
  });
  it('else the one metal the sources name', () => {
    expect(deriveMetalHint('1oz britannia', 'tradesheet:silver')).toBe('SILVER');
  });
  it('is null when nothing or two metals say', () => {
    expect(deriveMetalHint('1oz britannia', 'stock_coins,invoice_lines')).toBeNull();
    expect(deriveMetalHint('1oz britannia', 'tradesheet:gold,tradesheet:silver')).toBeNull();
  });
});
