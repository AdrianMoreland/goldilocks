import { describe, expect, it } from 'vitest';
import { aliasKey, normaliseProductText, normaliseRefinery, resolveProduct, type ResolverData } from './product-resolver';

const data: ResolverData = {
  salesProducts: [
    { id: 'sp-val', name: '1oz Valcambi Suisse bar', genericNorm: '1oz bar', refinery: 'VALCAMBI SUISSE', pricingProductId: 10 },
    { id: 'sp-arg', name: '1oz Argor-Heraeus bar', genericNorm: '1oz bar', refinery: 'ARGOR HERAEUS', pricingProductId: 10 },
    { id: 'sp-kr', name: '1/10oz Krugerrand', genericNorm: '1/10oz krugerrand', refinery: null, pricingProductId: 20 },
  ],
  bcItems: { 'GB-001': 'sp-val' },
  aliases: { [aliasKey('1oz fancy bar', null)]: 'sp-arg' },
  refineryAliases: [{ alias: 'ARGOR', refinery: 'Argor Heraeus' }],
};

describe('normaliseProductText', () => {
  it('matches the workbook normalisation', () => {
    expect(normaliseProductText('1 Ounce Gold Bullion Bar (2026)')).toBe('1oz bar');
    expect(normaliseProductText('1/10oz Gold Krugerrands')).toBe('1/10oz krugerrand');
  });
});

describe('normaliseRefinery', () => {
  it('treats spelling variants as one refinery and unknown as null', () => {
    expect(normaliseRefinery('ARGOR HERAEUS')).toBe(normaliseRefinery('argor-heraeus'));
    expect(normaliseRefinery('UNKNOWN')).toBeNull();
    expect(normaliseRefinery('')).toBeNull();
    expect(normaliseRefinery('Argor', data.refineryAliases)).toBe('ARGOR HERAEUS');
  });
});

describe('resolveProduct', () => {
  it('prefers the BC item number', () => {
    expect(resolveProduct({ bcItemNo: 'GB-001', productText: '1oz Gold Bar', refinery: 'Argor Heraeus' }, data)).toMatchObject({
      status: 'RESOLVED', method: 'BC_ITEM', salesProductId: 'sp-val', pricingProductId: 10,
    });
  });
  it('uses a confirmed alias before the generic rule', () => {
    expect(resolveProduct({ productText: '1oz fancy bar' }, data)).toMatchObject({ method: 'ALIAS', salesProductId: 'sp-arg' });
  });
  it('resolves generic name plus normalised refinery', () => {
    expect(resolveProduct({ productText: '1oz Gold Bullion Bar', refinery: 'ARGOR-HERAEUS' }, data)).toMatchObject({
      status: 'RESOLVED', method: 'GENERIC_REFINERY', salesProductId: 'sp-arg',
    });
  });
  it('resolves a coin that has no refinery', () => {
    expect(resolveProduct({ productText: '1/10oz Gold Krugerrand' }, data)).toMatchObject({ method: 'GENERIC_REFINERY', salesProductId: 'sp-kr', pricingProductId: 20 });
  });
  it('sends a bar with no refinery to review, with candidates', () => {
    expect(resolveProduct({ productText: '1oz Gold Bullion Bar' }, data)).toEqual({
      status: 'REVIEW', reason: 'NEEDS_REFINERY', key: '1oz bar', candidateIds: ['sp-val', 'sp-arg'],
    });
  });
  it('sends an unknown refinery or product to review', () => {
    expect(resolveProduct({ productText: '1oz bar', refinery: 'Nobody Mint' }, data)).toMatchObject({ status: 'REVIEW', reason: 'NO_MATCH', key: '1oz bar|NOBODY MINT' });
    expect(resolveProduct({ productText: 'mystery coin' }, data)).toMatchObject({ status: 'REVIEW', reason: 'NO_MATCH' });
    expect(resolveProduct({}, data)).toMatchObject({ status: 'REVIEW', reason: 'NO_MATCH' });
  });
});
