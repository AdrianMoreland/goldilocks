import { describe, expect, it } from 'vitest';
import { FOREIGN_COINS, meltLabel, readForeignCoin } from './product-match-coins';
import { priceMetalEvidence, spotLookup } from './metal-evidence';
import { matchProductName, type MatchCatalogue, type MatchInput } from './product-match';
import { normaliseProductText } from './product-text';

const P = (id: number, sku: string, name: string, metal: string, category: string | null = null) => ({ id, sku, name, metal, category });

let nextSpecific = 1000;
const S = (name: string, metal: string, pricingProductId: number, genericNorm: string, refinery: string | null = null) => ({
  id: nextSpecific++,
  name,
  metal,
  refinery,
  genericNorm,
  pricingProductId,
});

const GOLD_MELT = 500;
const foreign = FOREIGN_COINS.map((c) => S(c.name, 'GOLD', GOLD_MELT, normaliseProductText(c.name)));

const cat: MatchCatalogue = {
  pricing: [
    P(500, 'GOLD-MELT', 'Gold Melt', 'GOLD'),
    P(501, 'SILVER-MELT', 'Silver Melt', 'SILVER'),
    P(42, 'GOLD-1OZ-BAR', '1oz Gold Bar', 'GOLD'),
    P(44, 'GOLD-100G-BAR', '100g Gold Bar', 'GOLD'),
    P(39, 'GOLD-5G-BAR', '5g Gold Bar', 'GOLD'),
    P(41, 'GOLD-20G-BAR', '20g Gold Bar', 'GOLD'),
    P(36, 'GOLD-1G-BAR', '1g Gold Bar', 'GOLD'),
    P(43, 'GOLD-50G-BAR', '50g Gold Bar', 'GOLD'),
    P(520, 'GOLD-1TOLA-BAR', '1 tola Gold Bar', 'GOLD', 'BAR'),
    P(521, 'GOLD-5TOLA-BAR', '5 tola Gold Bar', 'GOLD', 'BAR'),
    P(522, 'GOLD-10TOLA-BAR', '10 tola Gold Bar', 'GOLD', 'BAR'),
    P(244, '1OZ-SILVER-BAR', '1oz Silver Bar', 'SILVER', 'BAR'),
    P(300, 'SILVER-1000OZ-BAR', '1000oz Silver Bar', 'SILVER', 'BAR'),
    P(301, 'SILVER-20G-BAR', '20g Silver Bar', 'SILVER', 'BAR'),
    P(302, 'SILVER-5G-BAR', '5g Silver Bar', 'SILVER', 'BAR'),
    P(248, 'GOLD-1OZ-COIN', '1oz Gold Coin', 'GOLD', 'COIN'),
    P(249, 'GOLD-2OZ-COIN', '2oz Gold Coin', 'GOLD', 'COIN'),
    P(250, 'GOLD-30G-COIN', '30g Gold Coin', 'GOLD', 'COIN'),
    P(251, 'GOLD-15G-COIN', '15g Gold Coin', 'GOLD', 'COIN'),
    P(252, 'GOLD-3G-COIN', '3g Gold Coin', 'GOLD', 'COIN'),
    P(245, '1OZ-SILVER-COIN', '1oz Silver Coin', 'SILVER', 'COIN'),
    P(253, 'SILVER-30G-COIN', '30g Silver Coin', 'SILVER', 'COIN'),
    P(254, 'SILVER-1/4OZ-COIN', '1/4oz Silver Coin', 'SILVER', 'COIN'),
    P(255, 'SILVER-100G-COIN', '100g Silver Coin', 'SILVER', 'COIN'),
    P(247, '10OZ-SILVER-COIN', '10oz Silver Coin', 'SILVER', 'COIN'),
    P(222, 'SILVER-2OZ-QUEENSBEASTS-COIN', "2oz Queen's Beasts", 'SILVER'),
    P(86, 'GOLD-1/4OZ-COIN', '1/4oz', 'GOLD'),
    P(75, 'GOLD-1OZ-KRUGERRAND-COIN', '1oz Krugerrand', 'GOLD'),
    P(77, 'GOLD-1OZ-KANGAROO-COIN', '1oz Kangaroo', 'GOLD'),
    P(106, 'SILVER-1OZ-KANGAROO-COIN', '1oz Kangaroo', 'SILVER'),
    P(81, 'GOLD-FULL-SOVEREIGN-COIN', 'Full Sovereign', 'GOLD'),
    P(302 + 1, 'PLATINUM-1OZ-BAR', '1oz Platinum Bar', 'PLATINUM'),
  ],
  specific: [
    ...foreign,
    S('Kookaburra 1oz Silver', 'SILVER', 245, '1oz kookaburra'),
    S('Koala 1oz Silver', 'SILVER', 245, '1oz koala'),
    S('American Buffalo 1oz Gold', 'GOLD', 248, '1oz american buffalo'),
    S('Lunar 1oz Gold', 'GOLD', 248, '1oz lunar'),
    S('Lunar 1oz Silver', 'SILVER', 245, '1oz lunar'),
    S('Isle of Man Angel 1oz Gold', 'GOLD', 248, '1oz isle of man angel'),
    S('Gold Panda 30g', 'GOLD', 250, '30g panda'),
    S('Gold Panda 15g', 'GOLD', 251, '15g panda'),
    S('Gold Panda 3g', 'GOLD', 252, '3g panda'),
    S('Silver Panda 30g', 'SILVER', 253, '30g panda'),
    S("Queen's Beasts 2oz Silver", 'SILVER', 222, '2oz queen s beast'),
    S("Queen's Beasts 10oz Silver", 'SILVER', 247, '10oz queen s beast'),
    S('Australian Kangaroo 2oz Gold', 'GOLD', 249, '2oz australian kangaroo'),
    S('Ten Pence RM', 'SILVER', 245, 'ten pence rm'),
    S('Metalor 100g bar', 'GOLD', 44, '100g bar', 'METALOR'),
    S('Valcambi Suisse 1g bar', 'GOLD', 36, '1g bar', 'VALCAMBI SUISSE'),
    S('PAMP Suisse Lady Fortuna 20g bar', 'GOLD', 41, 'lady fortuna 20g bar', 'PAMP SUISSE'),
    S('Best Value (Mixed Refiners) 50g bar', 'GOLD', 43, '50g bar'),
  ],
};

const run = (text: string, over: Partial<MatchInput> = {}) => matchProductName({ text, ...over }, cat);
const nameOf = (m: ReturnType<typeof run>) => (m.salesProductId !== undefined ? cat.specific!.find((s) => s.id === m.salesProductId)?.name : cat.pricing.find((p) => p.id === m.productId)?.name);

describe('foreign gold coins', () => {
  const cases: [string, string][] = [
    ['Napoleon', '20 French Franc'],
    ['20 French Franc', '20 French Franc'],
    ['20 Francs French Gold Coin 1912', '20 French Franc'],
    ['10 French Franc', '10 French Franc'],
    ['100 French Franc', '100 French Franc'],
    ['20 Swiss Franc', '20 Swiss Franc (Vreneli)'],
    ['Swiss Franc 20', '20 Swiss Franc (Vreneli)'],
    ['Vreneli', '20 Swiss Franc (Vreneli)'],
    ['Austrian 4 Ducat', 'Austrian 4 Ducat'],
    ['1 Ducat', 'Austrian 1 Ducat'],
    ['Austrian 100 Corona', 'Austrian 100 Corona'],
    ['20 Corona', 'Austrian 20 Corona'],
    ['10 Krone', 'Austrian 10 Corona'],
    ['Mexican 50 Peso', 'Mexican 50 Pesos'],
    ['50 Pesos', 'Mexican 50 Pesos'],
    ['Mexican dos y medio peso', 'Mexican 2.5 Pesos'],
    ['2.5 peso', 'Mexican 2.5 Pesos'],
    ['South African 2 Rand', 'South African 2 Rand'],
    ['1 Rand', 'South African 1 Rand'],
    ['US Double Eagle', 'US $20 Double Eagle'],
    ['Saint Gaudens', 'US $20 Double Eagle'],
    ['St Gaudens', 'US $20 Double Eagle'],
    ['Liberty Head 20', 'US $20 Double Eagle'],
    ['US 20 dollar', 'US $20 Double Eagle'],
    ['Eagle 10', 'US $10 Eagle'],
    ['US 10 Liberty', 'US $10 Eagle'],
    ['5 dollar', 'US $5 Half Eagle'],
    ['Indian Head 2.5', 'US $2.5 Quarter Eagle'],
    ['2.5 dollar', 'US $2.5 Quarter Eagle'],
    ['20 Mark', 'German 20 Mark'],
    ['German Mark', 'German 20 Mark'],
    ['10 Rouble', 'Russian 10 Rouble'],
    ['5 Ruble', 'Russian 5 Rouble'],
    ['100 Kurush', 'Turkish 100 Kurush'],
    ['100 Piastres', 'Turkish 100 Kurush'],
    ['Saudi Guinea', 'Saudi Guinea'],
    ['Saudi Arabia Guinea', 'Saudi Guinea'],
  ];
  it.each(cases)('%s is %s, certain, gold implied', (text, product) => {
    const r = run(text);
    expect(nameOf(r)).toBe(product);
    expect(r).toMatchObject({ outcome: 'SPECIFIC', productId: GOLD_MELT, confidence: 'CERTAIN', metal: 'GOLD' });
  });

  it('a bare ducat is only LIKELY', () => {
    expect(run('Ducat')).toMatchObject({ outcome: 'SPECIFIC', confidence: 'LIKELY', question: 'Match to Austrian 1 Ducat?' });
  });

  it('is not taken for a refinery, a weight coin or a silver coin', () => {
    expect(nameOf(run('1oz Rand Refinery', { metal: 'GOLD' }))).not.toBe('South African 1 Rand');
    expect(run('10oz silver eagle', { metal: 'SILVER' }).outcome).not.toBe('SPECIFIC');
    expect(run('1/4oz eagle', { metal: 'GOLD' })).toMatchObject({ outcome: 'PRICING', productId: 86 });
    expect(run('Silver Napoleon', { metal: 'SILVER' }).confidence).not.toBe('CERTAIN');
  });

  it('the fine weight labels read in troy ounces with four decimals', () => {
    expect(meltLabel(5.806)).toBe('0.1867oz melt');
    expect(meltLabel(13.77)).toBe('0.4427oz melt');
    expect(meltLabel(30.093)).toBe('0.9675oz melt');
    expect(meltLabel(37.5)).toBe('1.2057oz melt');
    expect(readForeignCoin('hello')).toBeNull();
  });

  it('without the product in the catalogue it is a catalogue gap, never a guess', () => {
    const empty: MatchCatalogue = { pricing: cat.pricing, specific: [] };
    expect(matchProductName({ text: 'Napoleon' }, empty)).toMatchObject({ outcome: 'NONE', catalogueGap: true });
  });
});

describe('bullion designs sold in several metals', () => {
  it('never take a metal from the Zoho convention', () => {
    expect(run('1oz kookaburra', { sources: 'invoice_lines' })).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR' });
    expect(run("2oz queen's beasts", { sources: 'invoice_lines' })).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR' });
  });

  it('take it from the text', () => {
    expect(run('1oz Silver Kookaburra')).toMatchObject({ outcome: 'SPECIFIC', confidence: 'CERTAIN' });
    expect(nameOf(run('1oz Silver Kookaburra'))).toBe('Kookaburra 1oz Silver');
    expect(nameOf(run('1oz Silver Koala'))).toBe('Koala 1oz Silver');
    expect(nameOf(run('Gold Panda 30g'))).toBe('Gold Panda 30g');
    expect(nameOf(run('Silver Panda 30g'))).toBe('Silver Panda 30g');
    expect(nameOf(run('15g Gold Panda'))).toBe('Gold Panda 15g');
    expect(nameOf(run('3g gold panda'))).toBe('Gold Panda 3g');
    expect(nameOf(run('1oz gold angel isle of man'))).toBe('Isle of Man Angel 1oz Gold');
    expect(nameOf(run('1oz Gold Lunar'))).toBe('Lunar 1oz Gold');
    expect(nameOf(run('silver 1oz year of the horse'))).toBe('Lunar 1oz Silver');
    expect(nameOf(run('1oz gold american buffalo'))).toBe('American Buffalo 1oz Gold');
    expect(nameOf(run("2oz silver queen's beasts"))).toBe("Queen's Beasts 2oz Silver");
    expect(nameOf(run("10oz silver queen's beast"))).toBe("Queen's Beasts 10oz Silver");
    expect(nameOf(run('2oz gold australian kangaroo'))).toBe('Australian Kangaroo 2oz Gold');
    expect(nameOf(run('2oz gold nugget'))).toBe('Australian Kangaroo 2oz Gold');
  });

  it('take it from the tab, or from price evidence: unanimous rows are CERTAIN, one row is LIKELY', () => {
    expect(run('1oz buffalo', { metal: 'GOLD' })).toMatchObject({ outcome: 'SPECIFIC', confidence: 'CERTAIN', metalFrom: 'tab' });
    expect(nameOf(run('1oz buffalo', { metal: 'GOLD' }))).toBe('American Buffalo 1oz Gold');
    const many = run('1oz kookaburra', { metalEvidence: { metal: 'SILVER', from: 'price', rows: 4 } });
    expect(many).toMatchObject({ outcome: 'SPECIFIC', confidence: 'CERTAIN', metalFrom: 'price' });
    expect(nameOf(many)).toBe('Kookaburra 1oz Silver');
    expect(run('1oz kookaburra', { metalEvidence: { metal: 'SILVER', from: 'price', rows: 1 } })).toMatchObject({ confidence: 'LIKELY', question: 'Match to Kookaburra 1oz Silver?' });
  });

  it('with no product yet fall back to the generic coin row, LIKELY, on the to-add list', () => {
    expect(run('1oz Silver Buffalo')).toMatchObject({ outcome: 'PRICING', productId: 245, confidence: 'LIKELY', catalogueGap: true });
    expect(run('1/4oz silver koala')).toMatchObject({ productId: 254, confidence: 'LIKELY', catalogueGap: true });
  });
});

describe('exact names', () => {
  it('a name equal to a specific product is that product', () => {
    expect(run('ten pence rm')).toMatchObject({ outcome: 'SPECIFIC', confidence: 'CERTAIN', productId: 245 });
    expect(nameOf(run('pamp suisse lady fortuna 20g bar'))).toBe('PAMP Suisse Lady Fortuna 20g bar');
    expect(nameOf(run('metalor 100g bar'))).toBe('Metalor 100g bar');
    expect(nameOf(run('valcambi suisse 1g bar'))).toBe('Valcambi Suisse 1g bar');
    expect(nameOf(run('100g bar|METALOR', { metal: 'GOLD' }))).toBe('Metalor 100g bar');
  });
  it('but not when the metal shown disagrees, and a plain weight is never taken for a refinery', () => {
    expect(run('ten pence rm', { metal: 'GOLD' }).outcome).not.toBe('SPECIFIC');
    expect(run('100g bar', { metal: 'GOLD' })).toMatchObject({ outcome: 'PRICING', productId: 44 });
  });
  it('"best value mixed refiner(s) Xg bar" is the plain bar, the metal from the evidence', () => {
    expect(run('Best Value (Mixed Refiners) 20g bar', { metal: 'GOLD' })).toMatchObject({ outcome: 'PRICING', productId: 41, confidence: 'CERTAIN' });
    expect(run('best value mixed refiner 20g bar', { metal: 'SILVER' })).toMatchObject({ productId: 301 });
    expect(run('Best Value (Mixed Refiners) 50g bar')).toMatchObject({ outcome: 'NONE' });
  });
});

describe('carat, ounce, tola and typos', () => {
  it('22 carat is a coin, gold', () => {
    expect(run('1oz 22 carat')).toMatchObject({ outcome: 'PRICING', productId: 248, confidence: 'CERTAIN' });
    expect(run('1oz 22k')).toMatchObject({ productId: 248 });
    expect(run('1oz 22ct')).toMatchObject({ productId: 248 });
  });
  it('a silver bar of 900 to 1100 oz is the 1000oz bar', () => {
    expect(run('silver bar 1050oz')).toMatchObject({ productId: 300, confidence: 'CERTAIN' });
    expect(run('Silver 950 oz bar')).toMatchObject({ productId: 300 });
    expect(run('silver bar 500oz').productId).not.toBe(300);
  });
  it('tola bars', () => {
    expect(run('1 tola bar')).toMatchObject({ productId: 520, confidence: 'CERTAIN' });
    expect(run('5 tola bar')).toMatchObject({ productId: 521 });
    expect(run('10 tola bar')).toMatchObject({ productId: 522 });
    expect(run('2 tola bar')).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR', reason: 'no 2 tola bar row' });
  });
  it('typos', () => {
    expect(run('10z gold bar', { metal: 'GOLD' })).toMatchObject({ productId: 42 });
    expect(run('1/4 maple', { metal: 'GOLD' })).toMatchObject({ productId: 86 });
    expect(run('one oz gold bar', { metal: 'GOLD' })).toMatchObject({ productId: 42 });
  });
});

describe('melt and scrap', () => {
  it('goes to the Melt row of the metal in the text', () => {
    expect(run('silver scrap oz')).toMatchObject({ outcome: 'PRICING', productId: 501, confidence: 'CERTAIN' });
    expect(run('24k melt')).toMatchObject({ productId: GOLD_MELT, confidence: 'CERTAIN' });
    expect(run('282.2g of 22k 916.7 purity')).toMatchObject({ productId: GOLD_MELT, confidence: 'CERTAIN' });
    expect(run('scrap 6.7g gold')).toMatchObject({ productId: GOLD_MELT });
  });
  it('else the tab; with no evidence at all it is UNCLEAR; the Zoho convention alone is only LIKELY', () => {
    expect(run('melt oz', { metal: 'SILVER' })).toMatchObject({ productId: 501, confidence: 'CERTAIN' });
    expect(run('for melt')).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR' });
    expect(run('non lbma oz')).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR' });
    expect(run('melt oz', { sources: 'invoice_lines' })).toMatchObject({ productId: GOLD_MELT, confidence: 'LIKELY' });
    expect(run('non lbma oz', { metalEvidence: { metal: 'SILVER', from: 'price', rows: 3 } })).toMatchObject({ productId: 501, confidence: 'CERTAIN', metalFrom: 'price' });
  });
  it('a melt word beside a coin design is the coin', () => {
    expect(run('1oz krugerrand scrap', { metal: 'GOLD' })).toMatchObject({ productId: 75 });
  });
});

describe('not a product, quantities, sovereigns', () => {
  it('copper and pool sales are certainly not products', () => {
    expect(run('Copper')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN' });
    expect(run('Copper - 5KG Bar')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN' });
    expect(run('Pool sale')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN' });
  });
  it('a quantity in the name matches the single item, LIKELY, with the question', () => {
    const r = run('monster box of 500 x 1oz australian kangaroo', { metal: 'GOLD' });
    expect(r).toMatchObject({ outcome: 'PRICING', productId: 77, confidence: 'LIKELY', question: 'Match to 1oz Kangaroo? (quantity is on the row)' });
    expect(run('10 x 1oz gold bar', { metal: 'GOLD' })).toMatchObject({ productId: 42, confidence: 'LIKELY', question: 'Match to 1oz Gold Bar? (quantity is on the row)' });
    expect(run('10 x 1g multidisk').confidence).not.toBe('CERTAIN');
  });
  it('a silver sovereign is not in the catalogue', () => {
    expect(run('silver sovereign')).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR', reason: 'not in catalogue' });
  });
});

describe('price evidence from the rows', () => {
  const spots = [
    ...['2025-03-03', '2025-03-04', '2025-03-05'].flatMap((date) => [
      { metal: 'GOLD' as const, date, price: 3000 },
      { metal: 'SILVER' as const, date, price: 32 },
      { metal: 'PLATINUM' as const, date, price: 1000 },
      { metal: 'PALLADIUM' as const, date, price: 600 },
    ]),
  ];
  const spotOn = spotLookup(spots);
  const oz = 31.1034768;
  const rows = (unit: number, n = 3) => Array.from({ length: n }, (_, i) => ({ date: `2025-03-0${3 + (i % 3)}`, unitPrice: unit }));

  it('gold, silver and platinum are told apart by price per ounce', () => {
    expect(priceMetalEvidence(rows(3100), oz, spotOn)).toEqual({ metal: 'GOLD', rows: 3 });
    expect(priceMetalEvidence(rows(38), oz, spotOn)).toEqual({ metal: 'SILVER', rows: 3 });
    expect(priceMetalEvidence(rows(1050), oz, spotOn)).toEqual({ metal: 'PLATINUM', rows: 3 });
  });
  it('rows that point to different metals, or a price that fits none, give nothing', () => {
    expect(priceMetalEvidence([...rows(3100, 2), ...rows(38, 2)], oz, spotOn)).toBeNull();
    expect(priceMetalEvidence(rows(5), oz, spotOn)).toBeNull();
    expect(priceMetalEvidence(rows(3100), null, spotOn)).toBeNull();
  });
  it('a price that fits two metals abstains', () => {
    const close = spotLookup([
      { metal: 'PLATINUM', date: '2025-03-03', price: 1000 },
      { metal: 'PALLADIUM', date: '2025-03-03', price: 950 },
    ]);
    expect(priceMetalEvidence(rows(970), oz, close)).toBeNull();
  });
  it('uses the nearest earlier day for a weekend, none after a week', () => {
    expect(spotOn('2025-03-06')?.GOLD).toBe(3000);
    expect(spotOn('2025-04-01')).toBeUndefined();
    expect(priceMetalEvidence([{ date: '2025-04-01', unitPrice: 3000 }], oz, spotOn)).toBeNull();
  });
  it('the weight sets the price per ounce', () => {
    expect(priceMetalEvidence(rows(300), oz / 10, spotOn)).toEqual({ metal: 'GOLD', rows: 3 });
  });
  it('feeds the match: unanimous prices make a Kookaburra the silver one', () => {
    const ev = priceMetalEvidence(rows(38), oz, spotOn)!;
    expect(run('1oz kookaburra', { metalEvidence: { ...ev, from: 'price' } })).toMatchObject({ outcome: 'SPECIFIC', confidence: 'CERTAIN', metal: 'SILVER', metalFrom: 'price' });
    expect(run('1oz kookaburra', { metalEvidence: { metal: 'SILVER', from: 'price', rows: 1 } }).confidence).toBe('LIKELY');
    expect(run('1oz kookaburra', {}).confidence).toBe('UNCLEAR');
  });
});
