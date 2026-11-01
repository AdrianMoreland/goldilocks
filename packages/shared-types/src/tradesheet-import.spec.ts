import { describe, expect, it } from 'vitest';
import {
  assignOccurrences,
  classifyCpty,
  classifyTab,
  deriveTradeState,
  extractQtyAndProduct,
  fillKind,
  findHeaderRow,
  fingerprint,
  guessSheetMonth,
  normaliseBackfillHeaders,
  mapPurchaseHeaders,
  mapSaleHeaders,
  matchProduct,
  parseDeferredLinks,
  parsePurchaseRow,
  parseReference,
  parseSaleRow,
  parseSheetNumber,
  parseSoldComment,
  readCollected,
  referenceMatchKey,
  stripHeader,
  type SheetCell,
  type SheetRow,
  type SheetValue,
} from './tradesheet-import';
import { TradesheetImportRequestSchema } from './tradesheet-import.schema';

const row = (...cells: Array<SheetValue | SheetCell>): SheetRow =>
  cells.map((c) => (c !== null && typeof c === 'object' && !(c instanceof Date) && 'value' in c ? (c as SheetCell) : { value: c as SheetValue }));

// The October 2026 IE - Gold header, exactly as the real sheet writes it (header on row 1, colons, a repeated hedging block).
const OCT_SALE_HEADERS = [
  'Branch:', 'Initials:', 'Client:', 'QTY:', 'Product:', 'Date:', 'Spot:', 'CPTY:', 'Cost:', 'Receipt:', 'Profit:', 'Margin:',
  'AML:', 'Paid:', 'Ordered:', 'Delivered:', 'Collected:', 'NOTES:', 'Net Hedging', 'Bought @:', 'Sold@:', 'Reference:',
  'Hedging Notes', 'Net Hedging', 'Bought @:', 'Sold@:',
];
const OCT_PURCHASE_HEADERS = [
  'Branch', 'Initials', 'Client', 'QTY', 'Product', 'Spot Price', 'Received', 'Price Paid', 'Price / Item', 'Gold Oz',
  'Date Paid:', 'Hedged At', 'Comments', 'Reference', 'Hedging Calculation', null, 'Bank Name', 'IBAN', 'Comments2',
];

describe('headers', () => {
  it('folds colons, spaces and case', () => {
    expect(stripHeader('Bought @:')).toBe('bought@');
    expect(stripHeader('Price / Item:')).toBe('price/item');
    expect(stripHeader('  NOTES:')).toBe('notes');
  });

  it('maps the October sales header and keeps the first of the repeated hedging columns', () => {
    const map = mapSaleHeaders(OCT_SALE_HEADERS);
    expect(map.reference).toBe(21);
    expect(map.cpty).toBe(7);
    expect(map.collected).toBe(16);
    expect(map.netHedging).toBe(18);
    expect(map.boughtAt).toBe(19);
    expect(map.soldAt).toBe(20);
    expect(map.delivered).toBe(15);
  });

  it('maps purchases, reading the first Comments column and ignoring the bank columns', () => {
    const map = mapPurchaseHeaders(OCT_PURCHASE_HEADERS);
    expect(map.comments).toBe(12);
    expect(map.reference).toBe(13);
    expect(map.pricePerItem).toBe(8);
    expect(map.received).toBe(6);
    expect(map.datePaid).toBe(10);
  });

  it('finds the header on row 1 or on row 2 under a timestamp', () => {
    expect(findHeaderRow([OCT_SALE_HEADERS, []], 'sale')).toBe(0);
    expect(findHeaderRow([[new Date('2026-07-01T17:58:19Z')], OCT_SALE_HEADERS], 'sale')).toBe(1);
    expect(findHeaderRow([['a', 'b'], ['c']], 'sale')).toBe(-1);
  });
});

describe('guessSheetMonth', () => {
  it('reads the month and year from the file name', () => {
    expect(guessSheetMonth('October 2026 - EU Trade Sheet (1).xlsx')).toBe('2026-10');
    expect(guessSheetMonth('September 2026 - EU Trade Sheet.xlsx')).toBe('2026-09');
    expect(guessSheetMonth('Copy of TEMPLATE July - EU Trade Sheet 2026.xlsx')).toBe('2026-07');
    expect(guessSheetMonth('trades-2025-03.xlsx')).toBe('2025-03');
  });

  it('returns null when the name does not say', () => {
    expect(guessSheetMonth('MASTER TEMPLATE - EU Trade Sheet.xlsx')).toBeNull();
    expect(guessSheetMonth('October trades.xlsx')).toBeNull();
  });
});

describe('tabs', () => {
  it('imports the Irish tabs under their old and new names and says why others are skipped', () => {
    expect(classifyTab('IE - Gold').kind).toBe('IE_GOLD_SALES');
    expect(classifyTab('IE-GP').kind).toBe('IE_GOLD_PURCHASES');
    expect(classifyTab('IE - Purchases').kind).toBe('IE_GOLD_PURCHASES');
    expect(classifyTab('IE - GP').kind).toBe('IE_GOLD_PURCHASES');
    expect(classifyTab('IE-SP').kind).toBe('IE_SILVER_PURCHASES');
    expect(classifyTab('Bonded').skipReason).toMatch(/separately/);
    expect(classifyTab('ES - Gold').skipReason).toMatch(/Spain/);
    expect(classifyTab('Live Figures').kind).toBeNull();
  });
});

describe('references', () => {
  it('parses branch, type, year, month and counter', () => {
    expect(parseReference('DU-G20261002')).toEqual({ branch: 'DU', type: 'G', role: 'SALE', metal: 'GOLD', year: 2026, month: 10, counter: 2 });
    expect(parseReference('DU-SP20261002')).toMatchObject({ branch: 'DU', type: 'SP', role: 'PURCHASE', metal: 'SILVER' });
    expect(parseReference('CO-G20260702')).toMatchObject({ branch: 'CO', month: 7, counter: 2 });
  });

  it('reads the older and July forms', () => {
    expect(parseReference('P20250102')).toMatchObject({ branch: null, type: 'P', role: 'PURCHASE', metal: null, year: 2025, month: 1 });
    expect(parseReference('GP-20260673')).toMatchObject({ branch: null, type: 'GP', role: 'PURCHASE', counter: 73 });
    expect(parseReference('G202601104')).toMatchObject({ type: 'G', month: 1, counter: 104 });
    expect(parseReference('BL -GP20260654')).toMatchObject({ branch: 'BL', type: 'GP' });
    expect(parseReference('  du-g20261002 ')).toMatchObject({ branch: 'DU' });
  });

  it('returns null for what is not a reference instead of half-parsing it', () => {
    expect(parseReference('Quote Only')).toBeNull();
    expect(parseReference('DU-G20261302')).toBeNull();
    expect(parseReference('')).toBeNull();
    expect(parseReference(null)).toBeNull();
  });

  it('compares references with spacing, case and hyphens folded', () => {
    expect(referenceMatchKey('BL -GP20260654')).toBe(referenceMatchKey('BL-GP20260654'));
    expect(referenceMatchKey('DU-GP20261023')).not.toBe(referenceMatchKey('CO-GP20261023'));
  });

  it('numbers repeats of the same reference', () => {
    expect(assignOccurrences(['DU-G20260194', 'DU-G20260195', 'du-g20260194', '', 'DU-G20260194'])).toEqual([1, 1, 2, 0, 3]);
  });
});

describe('CPTY and state', () => {
  it('reads the values staff really type', () => {
    expect(classifyCpty('Quote Only').kind).toBe('QUOTE_ONLY');
    expect(classifyCpty('Quote only ').kind).toBe('QUOTE_ONLY');
    expect(classifyCpty('Deferred ').kind).toBe('DEFERRED');
    expect(classifyCpty('Deffered').kind).toBe('DEFERRED');
    expect(classifyCpty('HEDGED  ').kind).toBe('HEDGED');
    expect(classifyCpty('HEDGED VALCAMBI ORDER').kind).toBe('HEDGED');
    expect(classifyCpty('Hedged - ORDER ').kind).toBe('HEDGED');
    expect(classifyCpty(null).kind).toBe('EMPTY');
  });

  it('reads a purchase line, including stray spaces, as a lot reference', () => {
    expect(classifyCpty('     DU-GP20261023')).toMatchObject({ kind: 'LOT_REF', lotKey: 'DUGP20261023' });
    expect(classifyCpty('BL -GP20260654')).toMatchObject({ kind: 'LOT_REF', lotKey: 'BLGP20260654' });
    expect(classifyCpty('GP-20260673').kind).toBe('LOT_REF');
    expect(classifyCpty('P20251214').kind).toBe('LOT_REF');
  });

  it('reads a supplier invoice with or without the hash', () => {
    expect(classifyCpty('StoneX #510873')).toMatchObject({ kind: 'SUPPLIER_INVOICE', supplier: 'StoneX', supplierInvoice: '510873' });
    expect(classifyCpty('StoneX 505844')).toMatchObject({ kind: 'SUPPLIER_INVOICE', supplierInvoice: '505844' });
    expect(classifyCpty('Coininvest #485532')).toMatchObject({ supplier: 'Coininvest' });
  });

  it('does not invent a meaning for anything else', () => {
    expect(classifyCpty('see Tom')).toMatchObject({ kind: 'OTHER' });
  });

  it('turns CPTY and colour into a trade state', () => {
    expect(deriveTradeState(classifyCpty('Quote Only'), null).state).toBe('QUOTE');
    expect(deriveTradeState(classifyCpty('HEDGED'), 'FFC9DAF8').state).toBe('HEDGED');
    expect(deriveTradeState(classifyCpty('DU-GP20261023'), null).state).toBe('INVOICED');
    expect(deriveTradeState(classifyCpty('StoneX #1234567'), null).state).toBe('INVOICED');
    expect(deriveTradeState(classifyCpty('Deferred'), null).state).toBe('DEFERRED');
  });

  it('reads an empty CPTY as awaiting a hedge only when it is blue', () => {
    expect(deriveTradeState(classifyCpty(''), 'FFC9DAF8')).toEqual({ state: 'AWAITING_HEDGE', fromColour: true });
    expect(deriveTradeState(classifyCpty(''), 'FFFFFFFF')).toEqual({ state: 'UNKNOWN', fromColour: false });
    expect(deriveTradeState(classifyCpty(''), null).state).toBe('UNKNOWN');
  });
});

describe('colours and collected', () => {
  it('knows the three meaningful fills and ignores the rest', () => {
    expect(fillKind('FF34A853')).toBe('GREEN');
    expect(fillKind('#34a853')).toBe('GREEN');
    expect(fillKind('FFC9DAF8')).toBe('BLUE');
    expect(fillKind('FFFFE599')).toBe('YELLOW');
    expect(fillKind('FFFFFFFF')).toBe('NONE');
    expect(fillKind('theme7')).toBe('NONE');
    expect(fillKind(null)).toBe('NONE');
  });

  it('counts a value or a green fill as collected, and an empty white cell as open', () => {
    expect(readCollected({ value: new Date('2026-09-14T00:00:00Z') })).toEqual({ collected: true, source: 'VALUE', date: '2026-09-14' });
    expect(readCollected({ value: 'SOLD BACK 24' })).toMatchObject({ collected: true, source: 'VALUE' });
    expect(readCollected({ value: null, fill: 'FF34A853' })).toEqual({ collected: true, source: 'FILL', date: null });
    expect(readCollected({ value: null, fill: 'FFFFFFFF' })).toEqual({ collected: false, source: null, date: null });
    expect(readCollected(undefined).collected).toBe(false);
  });
});

describe('deferred links', () => {
  it('reads from and to, several references and spacing slips', () => {
    expect(parseDeferredLinks('Deferred from DU-G202609226')).toEqual({ from: ['DU-G202609226'], to: [] });
    expect(parseDeferredLinks('Deferred to DU-G202609132-3')).toEqual({ from: [], to: ['DU-G202609132'] });
    expect(parseDeferredLinks('Deferred from BL- G202608211')).toEqual({ from: ['BL-G202608211'], to: [] });
    expect(parseDeferredLinks('Deferred from DU-G202607215/DU-G202607216').from).toEqual(['DU-G202607215', 'DU-G202607216']);
    expect(parseDeferredLinks('Deferred from G202603252').from).toEqual(['G202603252']);
  });

  it('finds nothing in an ordinary note', () => {
    expect(parseDeferredLinks('3.5% premium', 'Deferred')).toEqual({ from: [], to: [] });
    expect(parseDeferredLinks(null, undefined)).toEqual({ from: [], to: [] });
  });
});

describe('sold comments', () => {
  it('reads the plain forms', () => {
    expect(parseSoldComment('3 sold', 5)).toMatchObject({ soldCount: 3, remaining: 2, allSold: false, review: false });
    expect(parseSoldComment('ALL SOLD ', 5)).toMatchObject({ allSold: true, remaining: 0, review: false });
    expect(parseSoldComment('all sold', 1).remaining).toBe(0);
    expect(parseSoldComment('fully matched', 4).remaining).toBe(0);
    expect(parseSoldComment('', 4)).toMatchObject({ soldCount: null, remaining: 4, review: false });
    expect(parseSoldComment(null, 4).remaining).toBe(4);
  });

  it('adds up several counts', () => {
    expect(parseSoldComment('2 sold, 1 sold', 5)).toMatchObject({ soldCount: 3, remaining: 2 });
  });

  it('flags typos, a bare "sold" and more sold than bought instead of guessing silently', () => {
    expect(parseSoldComment('alls old', 2)).toMatchObject({ allSold: true, remaining: 0, review: true });
    expect(parseSoldComment('sold', 2)).toMatchObject({ remaining: 0, review: true });
    expect(parseSoldComment('6 sold', 5)).toMatchObject({ remaining: 0, review: true });
  });

  it('flags a note that may change stock, and leaves other notes alone', () => {
    expect(parseSoldComment('damaged', 4)).toMatchObject({ remaining: 4, review: true });
    expect(parseSoldComment('brinks london', 4)).toMatchObject({ remaining: 4, review: false });
    expect(parseSoldComment('6.36', 4)).toMatchObject({ remaining: 4, review: false });
  });
});

describe('products', () => {
  const aliases = { '1oz britannia': '1oz_britannia', '1oz tree of life': '1oz_tree_of_life', '1oz': '1oz_generic' };

  it('pulls a quantity out of the product cell', () => {
    expect(extractQtyAndProduct('5 x 10g gold bar')).toEqual({ qty: 5, product: '10g gold bar' });
    expect(extractQtyAndProduct('5x 10g gold bar')).toEqual({ qty: 5, product: '10g gold bar' });
    expect(extractQtyAndProduct('1oz Eagles x 3')).toEqual({ qty: 3, product: '1oz Eagles' });
    expect(extractQtyAndProduct('Market Bar x1')).toEqual({ qty: 1, product: 'Market Bar' });
    expect(extractQtyAndProduct('1oz Britannia')).toEqual({ qty: null, product: '1oz Britannia' });
  });

  it('prefers the longest alias', () => {
    expect(matchProduct('1 oz Tree of Life', aliases)).toEqual({ key: '1oz_tree_of_life', source: 'ALIAS', melt: false });
    expect(matchProduct('1oz Britannia 2026', aliases).key).toBe('1oz_britannia');
  });

  it('falls back to weight plus bar or coin, and flags melt', () => {
    expect(matchProduct('10 gram gold bars', {})).toEqual({ key: '10g_bar', source: 'WEIGHT', melt: false });
    expect(matchProduct('2.5g Bar', {}).key).toBe('2.5g_bar');
    expect(matchProduct('1/10oz Bar Melt', {})).toEqual({ key: '1/10oz_bar', source: 'WEIGHT', melt: true });
    expect(matchProduct('Austrian 4 Ducats', {})).toEqual({ key: null, source: 'NONE', melt: false });
    expect(matchProduct('', {}).key).toBeNull();
  });
});

describe('numbers', () => {
  it('reads sheet numbers and never turns blanks or errors into zero', () => {
    expect(parseSheetNumber(1736.907876)).toBe(1736.907876);
    expect(parseSheetNumber('£15,376.00')).toBe(15376);
    expect(parseSheetNumber('')).toBeNull();
    expect(parseSheetNumber('N/A')).toBeNull();
    expect(parseSheetNumber('#DIV/0!')).toBeNull();
    expect(parseSheetNumber(null)).toBeNull();
  });
});

describe('fingerprint', () => {
  it('is stable and sensitive to every part', () => {
    expect(fingerprint(['Tom', 20, '1oz Krugerrand'])).toBe(fingerprint(['Tom', 20, '1oz Krugerrand']));
    expect(fingerprint(['Tom', 20, '1oz Krugerrand'])).not.toBe(fingerprint(['Tom', 21, '1oz Krugerrand']));
    expect(fingerprint(['a', 'bc'])).not.toBe(fingerprint(['ab', 'c']));
  });
});

describe('sale rows', () => {
  const map = mapSaleHeaders(OCT_SALE_HEADERS);
  const blue = 'FFC9DAF8';

  it('reads a matched October sale in full', () => {
    const r = row(
      'DU', 'GOD', "Tom O'Neill", 20, '1oz Krugerrand', new Date('2026-10-01T00:00:00Z'), 3668, 'StoneX 505844', 74104.57, 75920,
      1736.907876, 0.02287813325, 'N/A', 'AIB', null, null, null, null, -78.52212389, 73361, 73282.4778761062, 'DU-G20261002',
    );
    const sale = parseSaleRow(r, map, 2)!;
    expect(sale).toMatchObject({
      reference: 'DU-G20261002',
      branchCode: 'DU',
      client: "Tom O'Neill",
      qty: 20,
      product: '1oz Krugerrand',
      date: '2026-10-01',
      state: 'INVOICED',
      cost: 74104.57,
      receipt: 75920,
      boughtAt: 73361,
      soldAt: 73282.4778761062,
      paid: 'AIB',
      issues: [],
    });
    expect(sale.cpty).toMatchObject({ kind: 'SUPPLIER_INVOICE', supplierInvoice: '505844' });
    expect(sale.collected.collected).toBe(false);
  });

  it('reads a quote and does not complain about the missing money', () => {
    const r = row('DU', 'DH', 'Archicon Limited', 26, '1oz Maple', new Date('2026-10-01T00:00:00Z'), 3682, 'Quote Only', null, null, null, null, null, null, null, null, null, null, null, null, null, 'DU-G20261003');
    const sale = parseSaleRow(r, map, 3)!;
    expect(sale.state).toBe('QUOTE');
    expect(sale.issues).toEqual([]);
    expect(sale.cost).toBeNull();
  });

  it('marks collected from the green fill and awaiting-hedge from the blue one', () => {
    const collected = row('DU', 'AM', 'Anna', 1, '1oz bar', new Date('2026-10-02T00:00:00Z'), 3700, 'DU-GP20261023', 1, 1, 1, 1, null, null, null, null, { value: null, fill: 'FF34A853' }, null, null, null, null, 'DU-G20261004');
    expect(parseSaleRow(collected, map, 4)!.collected).toEqual({ collected: true, source: 'FILL', date: null });

    const paid = row('DU', 'AM', 'Bob', 1, '1oz bar', new Date('2026-10-02T00:00:00Z'), 3700, { value: null, fill: blue }, null, null, null, null, null, null, null, null, null, null, null, null, null, 'DU-G20261005');
    expect(parseSaleRow(paid, map, 5)).toMatchObject({ state: 'AWAITING_HEDGE', stateFromColour: true });
  });

  it('links a deferred sale to the sale it came from', () => {
    const r = row('DU', 'AM', 'Cara', 10, '1oz bar', new Date('2026-10-05T00:00:00Z'), 3700, 'DU-GP20261024', null, null, null, null, null, null, null, null, null, 'Deferred from DU-G202609226', null, null, null, 'DU-G20261120');
    expect(parseSaleRow(r, map, 6)!.deferred).toEqual({ from: ['DU-G202609226'], to: [] });
  });

  it('keeps a row it cannot fully read and says why', () => {
    const r = row('DU', 'AM', 'Dan', null, '', null, null, 'see Tom', null, null, null, null, null, null, null, null, null, null, null, null, null, 'DU-G20261006');
    const sale = parseSaleRow(r, map, 7)!;
    expect(sale.state).toBe('UNKNOWN');
    expect(sale.issues).toEqual(expect.arrayContaining(['No quantity.', 'No product.', 'No date.', 'CPTY "see Tom" is not recognised.']));
  });

  it('skips a row with no reference and flags a reference that is not a sale', () => {
    expect(parseSaleRow(row('DU', 'AM', 'Ed', 1), map, 8)).toBeNull();
    const r = row('DU', 'AM', 'Fay', 1, '1oz bar', new Date('2026-10-05T00:00:00Z'), 1, 'Quote Only', null, null, null, null, null, null, null, null, null, null, null, null, null, 'DU-GP20261002');
    expect(parseSaleRow(r, map, 9)!.issues).toContain('Reference looks like a purchase, not a sale.');
  });

  it('changes the fingerprint only when something the user can edit changes', () => {
    const base = ['DU', 'AM', 'Gus', 2, '1oz bar', new Date('2026-10-05T00:00:00Z'), 3700, 'HEDGED', null, null, null, null, null, null, null, null, null, null, null, null, null, 'DU-G20261007'] as const;
    const a = parseSaleRow(row(...base), map, 10)!;
    const same = parseSaleRow(row(...base), map, 99)!;
    const edited = parseSaleRow(row(...[...base.slice(0, 7), 'DU-GP20261023', ...base.slice(8)] as SheetValue[]), map, 10)!;
    expect(same.fingerprint).toBe(a.fingerprint);
    expect(edited.fingerprint).not.toBe(a.fingerprint);
  });
});

describe('purchase rows', () => {
  const map = mapPurchaseHeaders(OCT_PURCHASE_HEADERS);

  it('reads a purchase that is all sold', () => {
    const r = row('DU', 'AM', 'John Callagy ', 4, '250g bar', 3687, new Date('2026-10-01T00:00:00Z'), 114404, 28601, 32.15, new Date('2026-10-12T00:00:00Z'), 3695.714918105357, 'ALL SOLD ', 'DU-GP20261002');
    const p = parsePurchaseRow(r, map, 2)!;
    expect(p).toMatchObject({
      reference: 'DU-GP20261002',
      branchCode: 'DU',
      client: 'John Callagy',
      qty: 4,
      product: '250g bar',
      received: '2026-10-01',
      datePaid: '2026-10-12',
      pricePaid: 114404,
      pricePerItem: 28601,
      hedgedAt: 3695.714918105357,
      issues: [],
    });
    expect(p.sold).toMatchObject({ allSold: true, remaining: 0 });
  });

  it('reads a purchase with part sold, and flags a comment that needs a person', () => {
    const part = row('DU', 'AM', 'X', 5, '1oz bar', 3700, new Date('2026-10-01T00:00:00Z'), 100, 20, 5, null, 3700, '3 sold', 'DU-GP20261003');
    expect(parsePurchaseRow(part, map, 3)!.sold.remaining).toBe(2);

    const damaged = row('DU', 'AM', 'X', 5, '1oz bar', 3700, new Date('2026-10-01T00:00:00Z'), 100, 20, 5, null, 3700, 'damaged', 'DU-GP20261004');
    expect(parsePurchaseRow(damaged, map, 4)!.issues[0]).toMatch(/may affect stock/);
  });

  it('takes the quantity from the product cell when the Qty cell is empty', () => {
    const r = row('BC', 'DH', 'StoneX #505846', null, '5 x 10g gold bar', 3678, null, 5753, 1917, 1, null, 1847, null, 'BC-GP20261002');
    expect(parsePurchaseRow(r, map, 5)).toMatchObject({ qty: 5, product: '10g gold bar' });
  });

  it('skips a row with no reference', () => {
    expect(parsePurchaseRow(row('DU', 'AM', 'Y', 1), map, 6)).toBeNull();
  });
});

describe('backfill files', () => {
  it('reads only RawG and RawGP, and only when the file is marked as a backfill', () => {
    expect(classifyTab('RawG', 'BACKFILL').kind).toBe('IE_GOLD_SALES');
    expect(classifyTab('RawGP', 'BACKFILL').kind).toBe('IE_GOLD_PURCHASES');
    expect(classifyTab('IE - Gold', 'BACKFILL').kind).toBeNull();
    expect(classifyTab('RawG').kind).toBeNull();
    expect(classifyTab('RawG', 'BACKFILL').skipReason).toBeNull();
  });

  it('renames the true/false Collected column so the Collected date column is the one read', () => {
    const headers = ['Status', 'Client', 'Collected', 'NOT collected', 'Reference', 'Collected:'];
    expect(mapSaleHeaders(headers).collected).toBe(2);
    const fixed = normaliseBackfillHeaders(headers);
    expect(mapSaleHeaders(fixed).collected).toBe(5);
    expect(normaliseBackfillHeaders(fixed)).toEqual(fixed);
  });

  it('leaves a header with a single Collected column alone', () => {
    const headers = ['Client', 'Collected:', 'Reference'];
    expect(normaliseBackfillHeaders(headers)).toBe(headers);
  });
});

describe('stray figures below the data', () => {
  it('skips a row whose reference cell is only a number, in sales and purchases', () => {
    const sale = row('DU', 'x', 'Tom', 1, '1oz bar', new Date('2026-10-01T00:00:00Z'), 3700, 'Quote Only', null, null, null, null, null, null, null, null, null, null, null, null, null, 553.072);
    expect(parseSaleRow(sale, mapSaleHeaders(OCT_SALE_HEADERS), 9)).toBeNull();
    const purchase = row('DU', 'AM', 'X', 1, '1oz bar', 3700, new Date('2026-10-01T00:00:00Z'), 100, 20, 5, null, 3700, null, '82813');
    expect(parsePurchaseRow(purchase, mapPurchaseHeaders(OCT_PURCHASE_HEADERS), 9)).toBeNull();
  });

  it('still reads a reference with a typo, because it has letters in it', () => {
    const r = row('DU', 'GOD', 'Tom', 1, '1oz bar', new Date('2026-10-01T00:00:00Z'), 3700, 'Quote Only', null, null, null, null, null, null, null, null, null, null, null, null, null, 'DU-Q20261002');
    expect(parseSaleRow(r, mapSaleHeaders(OCT_SALE_HEADERS), 9)!.issues).toContain('Reference is not in the expected format.');
  });
});

describe('import request', () => {
  const tab = (name: string) => ({ name, headerRow: 1, headers: [], rows: [] });

  it('accepts a workbook with many scratch tabs, like the 25-tab July copy', () => {
    const tabs = Array.from({ length: 25 }, (_, i) => tab(`Tab ${i + 1}`));
    expect(TradesheetImportRequestSchema.safeParse({ fileName: 'x.xlsx', sheetMonth: '2026-06', source: 'BACKFILL', tabs }).success).toBe(true);
  });

  it('still refuses an absurd number of tabs and a month that is not yyyy-mm', () => {
    const tabs = Array.from({ length: 61 }, (_, i) => tab(`Tab ${i + 1}`));
    expect(TradesheetImportRequestSchema.safeParse({ fileName: 'x.xlsx', sheetMonth: '2026-06', tabs }).success).toBe(false);
    expect(TradesheetImportRequestSchema.safeParse({ fileName: 'x.xlsx', sheetMonth: 'June', tabs: [tab('a')] }).success).toBe(false);
  });
});
