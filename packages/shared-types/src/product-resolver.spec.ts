import { describe, expect, it } from 'vitest';
import { aliasKey, normaliseRefinery, resolveProduct, resolveRowProduct, type ResolverData, type RowResolverData } from './product-resolver';
import { aliasOk, normaliseProductText, PRODUCT_NORM_EXAMPLES } from './product-text';
import { pricingSkuFor } from './product-rules';

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

describe('normaliseProductText examples', () => {
  it.each(PRODUCT_NORM_EXAMPLES.map((e) => [...e]))('%j -> %j', (input, expected) => {
    expect(normaliseProductText(input)).toBe(expected);
  });
  it('treats null and undefined as empty', () => {
    expect(normaliseProductText(null)).toBe('');
    expect(normaliseProductText(undefined)).toBe('');
  });
});

describe('aliasOk', () => {
  it.each([
    ['1oz Krugerrand', '1oz krugerrand', true],
    ['Full Sovereign', 'full sovereign', true],
    ['#REF!', 'ref', false],
    ['#N/A', 'n a', false],
    ['  #DIV/0!  ', 'div 0', false],
    ['5469.18', '5469.18', false],
    ['', '', false],
    ['1oz', '1oz', false],
    ['1/10oz', '1/10oz', false],
    ['1oz bar, 5g bar', '1oz bar 5g bar', false],
    ['1oz bar & 5g bar', '1oz bar 5g bar', false],
    ['1oz bar and 5g bar', '1oz bar 5g bar', false],
    ['Gold Investment', 'investment', false],
    ['1oz bar pamp', '1oz bar|pamp', false],
    ['1oz bar', '1oz bar | pamp', false],
  ])('%j / %j -> %s', (text, key, ok) => {
    expect(aliasOk(text, key)).toBe(ok);
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

describe('pricingSkuFor', () => {
  type M = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
  const cases: Array<[string, M, string | null]> = [
    ['5g bar', 'GOLD', 'GOLD-5G-BAR'],
    ['2.5 g bar', 'GOLD', 'GOLD-2.5G-BAR'],
    ['10 gram gold bars', 'GOLD', 'GOLD-10G-BAR'],
    ['1oz bar', 'GOLD', 'GOLD-1OZ-BAR'],
    ['1oz bar', 'SILVER', 'SILVER-1OZ-BAR'],
    ['1oz Bar PAMP', 'GOLD', 'GOLD-1OZ-BAR'],
    ['100g PAMP', 'GOLD', 'GOLD-100G-BAR'],
    ['50g Combi bar', 'GOLD', 'GOLD-50G-BAR'],
    ['1oz (31.1g) Gold Bar - PAMP', 'GOLD', 'GOLD-1OZ-BAR'],
    ['Half Ounce (15.5g) Gold Bar', 'GOLD', 'GOLD-1/2OZ-BAR'],
    ['1KG bar', 'SILVER', 'SILVER-1KG-BAR'],
    ['1oz Krugerrand', 'GOLD', 'GOLD-1OZ-KRUGERRAND-COIN'],
    ['1oz Krugerrands', 'SILVER', 'SILVER-1OZ-KRUGERRAND-COIN'],
    ['1/2oz Krugerrand', 'GOLD', 'GOLD-1/2OZ-KRUGERRAND-COIN'],
    ['1/4oz Eagle', 'GOLD', 'GOLD-1/4OZ-US-COIN'],
    ['1oz eagles', 'GOLD', 'GOLD-1OZ-USEAGLE-COIN'],
    ['1oz American Eagle', 'SILVER', 'SILVER-1OZ-USEAGLE-COIN'],
    ['1oz Philharmonics', 'GOLD', 'GOLD-1OZ-PHILHARMONIC-COIN'],
    ['1 oz Maple', 'GOLD', 'GOLD-1OZ-MAPLELEAF-COIN'],
    ['1oz Trees of Life', 'SILVER', 'SILVER-1OZ-TREEOFLIFE-COIN'],
    ['1g Tree of Life', 'GOLD', 'GOLD-1G-TREEOFLIFE-COIN'],
    ['2oz Queens Beasts', 'SILVER', 'SILVER-2OZ-QUEENSBEASTS-COIN'],
    ['Full Sovereign', 'GOLD', 'GOLD-FULL-SOVEREIGN-COIN'],
    ['Sovereign', 'GOLD', 'GOLD-FULL-SOVEREIGN-COIN'],
    ['Sovereign (Full)', 'GOLD', 'GOLD-FULL-SOVEREIGN-COIN'],
    ['Half Sovereign', 'GOLD', 'GOLD-HALF-SOVEREIGN-COIN'],
    ['Double Sovereign', 'GOLD', 'GOLD-DOUBLE-SOVEREIGN-COIN'],
    ['Gold Quintuple Sovereign', 'GOLD', null],
    ['Quarter Sovereign', 'GOLD', null],
    ['Silver Sovereign', 'GOLD', null],
    ['Sovereign', 'SILVER', null],
    ['Platinum - 100g bar', 'SILVER', 'PLATINUM-100G-BAR'],
    ['1oz Platinum', 'SILVER', null],
    ['1oz Platinum Britannia', 'GOLD', 'PLATINUM-1OZ-BRITANNIA-COIN'],
    ['1oz Palladium Maple Leaf', 'GOLD', 'PALLADIUM-1OZ-MAPLE-COIN'],
    ['1oz Buffalo', 'GOLD', null],
    ['1oz Buffalo coin', 'GOLD', null],
    ['30g Panda coin', 'SILVER', null],
    ['Double Eagle', 'GOLD', null],
    ['1oz Double Eagle coin', 'GOLD', null],
    ['1oz Lunar coin', 'GOLD', null],
    ['10oz Coin', 'SILVER', 'SILVER-10OZ-COIN'],
    ['2oz coins', 'SILVER', 'SILVER-2OZ-COIN'],
    ['1oz Silver Coins', 'SILVER', 'SILVER-1OZ-COIN'],
    ['1KG Coin', 'SILVER', 'SILVER-1KG-COINS-COIN'],
    ['1/10oz', 'GOLD', 'GOLD-1/10OZ-COIN'],
    ['1oz', 'GOLD', null],
    ['Melt Ounces', 'GOLD', null],
    ['Scrap coin', 'GOLD', null],
    ['John F Kennedy, 7.7 g', 'GOLD', null],
    ['1oz bar, 5g bar', 'GOLD', null],
    ['#REF!', 'GOLD', null],
    ['', 'GOLD', null],
  ];
  it.each(cases)('%s (%s) -> %s', (text, metal, sku) => {
    expect(pricingSkuFor(text, metal)?.sku ?? null).toBe(sku);
  });

  it('lists fallbacks in priority order', () => {
    expect(pricingSkuFor('1oz bar', 'SILVER')?.candidates).toEqual(['SILVER-1OZ-BAR', '1OZ-SILVER-BAR']);
    expect(pricingSkuFor('1/10oz Maple', 'GOLD')?.candidates).toEqual(['GOLD-1/10OZ-MAPLELEAF-COIN', 'GOLD-1/10OZ-COIN']);
    expect(pricingSkuFor('1/10oz eagle', 'GOLD')?.candidates).toEqual(['GOLD-1/10OZ-US-COIN', 'GOLD-1/10OZ-USEAGLE-COIN', 'GOLD-1/10OZ-COIN']);
    expect(pricingSkuFor('10oz Coin', 'SILVER')?.candidates).toEqual(['SILVER-10OZ-COIN', '10OZ-SILVER-COIN']);
    expect(pricingSkuFor('1oz Bonded Bar', 'SILVER')?.candidates[0]).toBe('SILVER-1OZ-BONDED-BAR');
  });

  it('reports a platinum or palladium text', () => {
    expect(pricingSkuFor('Platinum - 100g bar', 'SILVER')).toMatchObject({ metalFromText: 'PLATINUM' });
    expect(pricingSkuFor('1oz bar', 'GOLD')).toMatchObject({ metalFromText: null });
  });
});

describe('resolveRowProduct', () => {
  const rowData: RowResolverData = {
    catalogue: [
      { id: 1, sku: 'GOLD-1OZ-BAR', metalType: 'GOLD' },
      { id: 2, sku: 'GOLD-FULL-SOVEREIGN-COIN', metalType: 'GOLD' },
      { id: 3, sku: 'GOLD-1OZ-KRUGERRAND-COIN', metalType: 'GOLD' },
      { id: 4, sku: 'GOLD-1/10OZ-COIN', metalType: 'GOLD' },
    ],
    salesProducts: [
      { id: 7, name: '1oz Valcambi bar', genericNorm: '1oz bar', refinery: 'VALCAMBI', pricingProductId: 1 },
      { id: 8, name: 'Loose sovereign', genericNorm: 'old sov', refinery: null, pricingProductId: null },
    ],
    bcItems: { 'GB-9': 7 },
    decisions: [
      { key: '1oz bar', productId: 3, salesProductId: null },
      { key: '1oz bar pamp', productId: 1, salesProductId: 7 },
      { key: 'old sov', productId: 2, salesProductId: 8 },
      { key: '1oz', productId: 3, salesProductId: null },
      { key: 'bar, pamp', productId: 3, salesProductId: null },
    ],
  };
  const resolve = (productText: string, extra: object = {}) => resolveRowProduct({ productText, metal: 'GOLD', ...extra }, rowData);

  it('uses the BC item number first', () => {
    expect(resolve('1oz Krugerrand', { bcItemNo: 'GB-9' })).toMatchObject({ method: 'BC_ITEM', salesProductId: 7, pricingProductId: 1 });
  });
  it('uses a saved decision before the rules, and the decision with the most words', () => {
    expect(resolve('1oz Gold Bar PAMP')).toMatchObject({ method: 'ALIAS', salesProductId: 7, pricingProductId: 1 });
    expect(resolve('1oz bar')).toMatchObject({ method: 'ALIAS', salesProductId: null, pricingProductId: 3 });
  });
  it('falls back to the pricing product on the decision when its specific product has none', () => {
    expect(resolve('Old sov')).toMatchObject({ method: 'ALIAS', salesProductId: 8, pricingProductId: 2 });
  });
  it('ignores decisions that fail the guard', () => {
    expect(resolve('1oz Krugerrand')).toMatchObject({ method: 'RULE', pricingProductId: 3 });
  });
  it('matches generic name plus refinery before the rules', () => {
    const noDecisions = { ...rowData, decisions: [] };
    expect(resolveRowProduct({ productText: '1oz bar', metal: 'GOLD', refinery: 'Valcambi' }, noDecisions)).toMatchObject({
      method: 'GENERIC_REFINERY', salesProductId: 7, pricingProductId: 1, refinery: 'VALCAMBI',
    });
  });
  it('then uses the rules, picking the first candidate that exists', () => {
    expect(resolveRowProduct({ productText: '1/10oz Maple', metal: 'GOLD' }, rowData)).toMatchObject({ method: 'RULE', pricingProductId: 4, salesProductId: null });
    expect(resolve('Sovereign')).toMatchObject({ method: 'RULE', pricingProductId: 2 });
  });
  it('is NONE when nothing matches, keeping the metal and melt hints', () => {
    expect(resolve('1oz Buffalo')).toMatchObject({ method: 'NONE', pricingProductId: null, key: '1oz buffalo' });
    expect(resolve('1oz Platinum (Coin)')).toMatchObject({ method: 'NONE', metalFromText: 'PLATINUM' });
    expect(resolve('Melt Oz')).toMatchObject({ method: 'NONE', melt: true });
    expect(resolve('')).toMatchObject({ method: 'NONE', key: '' });
  });
  it('does not apply decisions to a text that lists several products', () => {
    expect(resolve('1oz bar, 5g bar').method).toBe('NONE');
  });
});
