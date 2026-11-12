import { describe, expect, it } from 'vitest';
import { COIN_DESIGNS, matchProductName, type MatchCatalogue, type MatchInput } from './product-match';

const P = (id: number, sku: string, name: string, metal: string, category: string | null = null) => ({ id, sku, name, metal, category });

const cat: MatchCatalogue = {
  pricing: [
    P(42, 'GOLD-1OZ-BAR', '1oz Gold Bar', 'GOLD'),
    P(40, 'GOLD-10G-BAR', '10g Gold Bar', 'GOLD'),
    P(44, 'GOLD-100G-BAR', '100g Gold Bar', 'GOLD'),
    P(45, 'GOLD-250G-BAR', '250g Gold Bar', 'GOLD'),
    P(43, 'GOLD-50G-BAR', '50g Gold Bar', 'GOLD'),
    P(244, '1OZ-SILVER-BAR', '1oz Silver Bar', 'SILVER', 'BAR'),
    P(59, 'SILVER-1KG-BAR', '1kg Silver Bar', 'SILVER'),
    P(300, 'SILVER-1000OZ-BAR', '1000oz Silver Bar', 'SILVER'),
    P(301, 'SILVER-1OZ-BAR', '1oz Silver Bar (generic)', 'SILVER'),
    P(302, 'PLATINUM-1OZ-BAR', '1oz Platinum Bar', 'PLATINUM'),
    P(74, 'GOLD-1OZ-BRITANNIA-COIN', '1oz Britannia', 'GOLD'),
    P(103, 'SILVER-1OZ-BRITANNIA-COIN', '1oz Britannia', 'SILVER'),
    P(132, 'PLATINUM-1OZ-BRITANNIA-COIN', '1oz Britannia', 'PLATINUM'),
    P(75, 'GOLD-1OZ-KRUGERRAND-COIN', '1oz Krugerrand', 'GOLD'),
    P(79, 'GOLD-1OZ-USEAGLE-COIN', '1oz US Eagle', 'GOLD'),
    P(80, 'GOLD-HALF-SOVEREIGN-COIN', 'Half Sovereign', 'GOLD'),
    P(81, 'GOLD-FULL-SOVEREIGN-COIN', 'Full Sovereign', 'GOLD'),
    P(86, 'GOLD-1/4OZ-COIN', '1/4oz', 'GOLD'),
    P(87, 'GOLD-1/4OZ-US-COIN', '1/4oz US Eagle', 'GOLD'),
    P(245, '1OZ-SILVER-COIN', '1oz Silver Coin', 'SILVER', 'COIN'),
  ],
  specific: [
    { id: 72, name: 'Valcambi Suisse 1oz bar', metal: 'GOLD', refinery: 'VALCAMBI SUISSE', genericNorm: '1oz bar', pricingProductId: 42 },
    { id: 85, name: 'Umicore 1oz bar', metal: 'GOLD', refinery: 'UMICORE', genericNorm: '1oz bar', pricingProductId: 42 },
    { id: 96, name: 'Metalor 50g bar', metal: 'GOLD', refinery: 'METALOR', genericNorm: '50g bar', pricingProductId: 43 },
  ],
};

const SPOT = { GOLD: 3000, SILVER: 38, PLATINUM: 1150, PALLADIUM: 770 };
const run = (text: string, over: Partial<MatchInput> = {}) => matchProductName({ text, ...over }, cat);

describe('matchProductName', () => {
  it('1oz Britannia on a gold tab is the gold 1oz Britannia', () => {
    const r = run('1oz Britannia', { metal: 'GOLD' });
    expect(r).toMatchObject({ outcome: 'PRICING', productId: 74, confidence: 'CERTAIN' });
    expect(r.reason).toBe('1oz + coin + Britannia + gold (tab)');
  });

  it('"Silver - 1oz Britannia" from Zoho is silver', () => {
    expect(run('Silver - 1oz Britannia', { sources: 'zoho_products' })).toMatchObject({ productId: 103, confidence: 'CERTAIN' });
  });

  it('Zoho names without a metal are gold, certain only when no platinum or palladium version exists', () => {
    // Britannia exists in platinum: gold is only LIKELY.
    expect(run('1oz Britannia', { sources: 'invoice_lines' })).toMatchObject({ productId: 74, confidence: 'LIKELY', question: 'Match to 1oz Britannia?', metalFrom: 'source' });
    // A Krugerrand has no platinum row in this catalogue.
    expect(run('1oz Krugerrand', { sources: 'invoice_lines' })).toMatchObject({ productId: 75, confidence: 'CERTAIN', metalFrom: 'source' });
  });

  it('a silver tab is only LIKELY where platinum or palladium exist; a gold tab stays CERTAIN', () => {
    expect(run('1oz Britannia', { metal: 'SILVER' })).toMatchObject({ productId: 103, confidence: 'LIKELY', question: 'Match to 1oz Britannia?', metalFrom: 'tab' });
    expect(run('1oz Britannia', { metal: 'GOLD' })).toMatchObject({ productId: 74, confidence: 'CERTAIN', metalFrom: 'tab' });
    expect(run('1000oz bar', { metal: 'SILVER' })).toMatchObject({ productId: 300, confidence: 'CERTAIN' });
    expect(run('1oz Silver Britannia', { metal: 'GOLD' })).toMatchObject({ productId: 103, confidence: 'CERTAIN', metalFrom: 'text' });
  });

  it('exposes where the metal came from', () => {
    expect(run('1oz Britannia', { metal: 'GOLD' }).metalFrom).toBe('tab');
    expect(run('Sovereign').metalFrom).toBe('default');
  });

  it('1000oz is a weight: "1000oz silver bar" is the 1000oz silver bar', () => {
    expect(run('1000oz silver bar')).toMatchObject({ productId: 300, confidence: 'CERTAIN' });
  });

  it('a name with a Rand Refinery refinery is not taken for a bar', () => {
    const r = run('1oz Rand Refinery', { metal: 'GOLD' });
    expect(r.confidence).not.toBe('CERTAIN');
  });

  it('a fee word with a weight or design is only LIKELY not a product', () => {
    expect(run('Shipping fee')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN' });
    expect(run('1oz Britannia delivery', { metal: 'GOLD' })).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'LIKELY', question: 'Mark as not a product?' });
    expect(run('Krugerrand storage')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'LIKELY' });
  });

  it('a coin with no weight is only LIKELY, with a question', () => {
    const r = run('South African Krugerrand', { metal: 'GOLD' });
    expect(r).toMatchObject({ outcome: 'PRICING', productId: 75, confidence: 'LIKELY', question: 'Match to 1oz Krugerrand?' });
  });

  it('plain and full sovereign are the Full Sovereign; half is the half', () => {
    expect(run('sovereign full')).toMatchObject({ productId: 81, confidence: 'CERTAIN' });
    expect(run('Sovereign')).toMatchObject({ productId: 81, confidence: 'CERTAIN' });
    expect(run('Half Sovereign', { metal: 'GOLD' })).toMatchObject({ productId: 80, confidence: 'CERTAIN' });
    expect(run('Quarter Sovereign')).toMatchObject({ outcome: 'NONE', catalogueGap: true });
  });

  it('a bar with a refinery is that refinery\'s specific product when there is one, else the plain bar', () => {
    expect(run('1oz bar|METALOR', { metal: 'GOLD' })).toMatchObject({ outcome: 'PRICING', productId: 42, confidence: 'CERTAIN' });
    expect(run('1oz bar', { metal: 'GOLD', refinery: 'Valcambi' })).toMatchObject({ outcome: 'SPECIFIC', salesProductId: 72, productId: 42, confidence: 'CERTAIN' });
    expect(run('50g bar|METALOR', { metal: 'GOLD' })).toMatchObject({ outcome: 'SPECIFIC', salesProductId: 96, productId: 43 });
  });

  it('a bar with no refinery is the pricing bar', () => {
    expect(run('1oz bar', { metal: 'GOLD' })).toMatchObject({ outcome: 'PRICING', productId: 42, confidence: 'CERTAIN' });
    expect(run('1oz Silver Bar')).toMatchObject({ productId: 244 });
    expect(run('1 Ounce Gold Bullion Bar (2026)', { metal: 'GOLD' })).toMatchObject({ productId: 42 });
    expect(run('31.1g bar', { metal: 'GOLD' })).toMatchObject({ productId: 42 });
    expect(run('1/2oz bar', { metal: 'GOLD' })).toMatchObject({ outcome: 'NONE', catalogueGap: true });
  });

  it('fees, shipments and deposits are not products', () => {
    for (const t of ['SHIPMENT', 'Shipmint', 'Delivery', 'Insurance', 'Deposit', '2022 Quarter 4 Bonded Silver Storage Fees']) {
      expect(run(t)).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN' });
    }
  });

  it('several products, sheet errors and bare numbers are NONE', () => {
    for (const t of ['1oz Britannia and 1oz Krugerrand', '1oz bar, 10g bar', '#REF!', '5469.18', '', '1oz Krugerrand / Britannia']) {
      expect(run(t, { metal: 'GOLD' })).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR' });
    }
  });

  it('1/4oz Eagle and 1/4oz American Eagle are the same product', () => {
    const a = run('1/4oz Eagle', { metal: 'GOLD' });
    const b = run('1/4oz American Eagle', { metal: 'GOLD' });
    const c = run('1/4oz US Eagles', { metal: 'GOLD' });
    expect(a).toMatchObject({ productId: 87, confidence: 'CERTAIN' });
    expect(b).toEqual({ ...a, reason: b.reason });
    expect(c.productId).toBe(87);
  });

  it('a design that maps to exactly one specific product is that product; two means pricing only', () => {
    const withCoins: MatchCatalogue = {
      pricing: cat.pricing,
      specific: [
        ...(cat.specific ?? []),
        { id: 116, name: '1/4oz Gold American Eagle', metal: 'GOLD', refinery: null, genericNorm: '1/4oz american eagle', pricingProductId: 86 },
        { id: 109, name: '1oz Gold Krugerrand (2026)', metal: 'GOLD', refinery: null, genericNorm: '1oz krugerrand', pricingProductId: 75 },
        { id: 110, name: '1oz Gold Krugerrand (Mixed Years)', metal: 'GOLD', refinery: null, genericNorm: '1oz krugerrand mixed year', pricingProductId: 75 },
      ],
    };
    const a = matchProductName({ text: '1/4oz Eagle', metal: 'GOLD' }, withCoins);
    const b = matchProductName({ text: '1/4oz American Eagle', metal: 'GOLD' }, withCoins);
    expect(a).toMatchObject({ outcome: 'SPECIFIC', salesProductId: 116, productId: 86, confidence: 'CERTAIN' });
    expect(b).toMatchObject({ outcome: 'SPECIFIC', salesProductId: 116, productId: 86 });
    expect(matchProductName({ text: '1oz Krugerrand', metal: 'GOLD' }, withCoins)).toMatchObject({ outcome: 'PRICING', productId: 75, confidence: 'CERTAIN' });
  });

  it('reads units written out, bare fractions and "mixed" lots', () => {
    expect(run('10gram Gold Bullion Bar', { metal: 'GOLD' })).toMatchObject({ productId: 40, confidence: 'CERTAIN' });
    expect(run('1/4 Krugerrand', { metal: 'GOLD' })).toMatchObject({ productId: 86, confidence: 'CERTAIN' });
    expect(run('Mixed Sovereign Gold Coins')).toMatchObject({ productId: 81, confidence: 'LIKELY' });
    expect(run('Silver - Market Bars - Total Ounces')).toMatchObject({ outcome: 'NONE' });
    expect(run('Copper - 5KG Bar')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN' });
  });

  it('notes and balances are probably not products', () => {
    expect(run('Funds remaining on account')).toMatchObject({ outcome: 'NOT_A_PRODUCT', confidence: 'LIKELY', question: 'Mark as not a product?' });
  });

  it('fractions fall back to the generic fraction row; weights spelt out are read', () => {
    expect(run('1/4oz Britannia', { metal: 'GOLD' })).toMatchObject({ productId: 86, confidence: 'CERTAIN' });
    expect(run('quarter ounce Krugerrand', { metal: 'GOLD' })).toMatchObject({ productId: 86 });
    expect(run('1/4oz', { metal: 'GOLD' })).toMatchObject({ productId: 86, confidence: 'LIKELY' });
  });

  it('an obscure coin gets the generic coin row, LIKELY, and is a catalogue gap', () => {
    expect(run('1oz Koala', { metal: 'SILVER' })).toMatchObject({ productId: 245, confidence: 'LIKELY', catalogueGap: true });
    const gold = run('1oz Koala', { metal: 'GOLD' });
    expect(gold).toMatchObject({ outcome: 'NONE', catalogueGap: true, reason: 'needs generic 1oz gold coin row' });
  });

  it('ignores years, purity text and country words', () => {
    expect(run('1oz Gold Krugerrand Coin 2023 999.9 purity', { metal: 'GOLD' })).toMatchObject({ productId: 75, confidence: 'CERTAIN' });
    expect(run('1oz South African Krugerrands (24 carat)', { metal: 'GOLD' })).toMatchObject({ productId: 75, confidence: 'CERTAIN' });
  });

  it('the tab metal beats nothing, the text metal beats the tab', () => {
    expect(run('1oz Silver Britannia', { metal: 'GOLD' })).toMatchObject({ productId: 103 });
    expect(run('1oz Britannia')).toMatchObject({ outcome: 'NONE' });
  });

  describe('price check', () => {
    it('picks platinum for a 1oz coin at the platinum price on a silver tab', () => {
      const r = run('1oz Britannia', { metal: 'SILVER', unitPrice: 1190, spot: SPOT });
      expect(r).toMatchObject({ productId: 132, metal: 'PLATINUM', confidence: 'LIKELY' });
    });
    it('confirms the tab when the price agrees', () => {
      expect(run('1oz Britannia', { metal: 'GOLD', unitPrice: 3150, spot: SPOT })).toMatchObject({ productId: 74, confidence: 'CERTAIN' });
    });
    it('is UNCLEAR when two metals fit', () => {
      const r = run('1oz Britannia', { unitPrice: 1000, spot: { PLATINUM: 1000, PALLADIUM: 1050 } });
      expect(r).toMatchObject({ outcome: 'NONE', confidence: 'UNCLEAR' });
    });
    it('does not override a metal named in the text', () => {
      expect(run('1oz Silver Britannia', { unitPrice: 3150, spot: SPOT })).toMatchObject({ productId: 103 });
    });
  });

  it('holds the designs as data', () => {
    expect(COIN_DESIGNS.map((d) => d.id)).toEqual(expect.arrayContaining(['britannia', 'krugerrand', 'treeoflife', 'philharmonic', 'kangaroo', 'maple', 'eagle', 'sovereign:full']));
  });
});
