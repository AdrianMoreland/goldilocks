import { describe, expect, it } from 'vitest';
import {
  buildJournalExportRows,
  buildRegisterExportRows,
  compareSerials,
  computeVariance,
  JOURNAL_EXPORT_HEADERS,
  normalizeSerial,
  onHandSerials,
  parseJournalPaste,
  parseTrackingPaste,
  parseTsv,
  parseWeightGrams,
  splitSerials,
  suggestProductForBcItem,
  summarizeLines,
  toCsv,
  type CountLine,
} from './stocktake';

const line = (over: Partial<CountLine> = {}): CountLine => ({
  itemNo: '1005',
  description: '1oz Pamp Suisse',
  locationCode: 'DU',
  qtyCalculated: 5,
  countedNormal: null,
  countedCustomer: null,
  counted: false,
  reason: null,
  serialsChecked: null,
  serialNote: null,
  batchName: 'STOCKTAKE',
  documentNo: 'TEST',
  entryType: 'Positive Adjmt.',
  unitAmount: 3589,
  unitCost: 3589,
  ...over,
});

describe('computeVariance', () => {
  it('is Calculated minus both counts: 5 with 4 and 2 gives -1', () => {
    expect(computeVariance(5, 4, 2, true)).toBe(-1);
  });
  it('is zero when counts equal the calculated quantity', () => {
    expect(computeVariance(5, 3, 2, true)).toBe(0);
  });
  it('is positive when stock is missing', () => {
    expect(computeVariance(5, 2, 1, true)).toBe(2);
  });
  it('is null, not the calculated quantity, for an uncounted line', () => {
    expect(computeVariance(5, null, null, false)).toBeNull();
  });
  it('treats a blank column as 0 once the line is counted', () => {
    expect(computeVariance(5, 5, null, true)).toBe(0);
    expect(computeVariance(5, null, null, true)).toBe(5);
  });
});

const JOURNAL = [
  'Batch Name\tPosting Date\tEntry Type\tDocument No.\tItem No.\tDescription\tLocation Code\tQty. (Calculated)\tUnit Amount\tUnit Cost',
  'STOCKTAKE\t30/09/2026\tPositive Adjmt.\tTEST\t1005\t1oz Pamp Suisse\tDU\t5\t3,589\t3589',
  'STOCKTAKE\t30/09/2026\tPositive Adjmt.\tTEST\t1012\t1OZ PLATINUM PHILHARMONIC\tDU\t1.0\t1509.56\t1509.56',
].join('\r\n');

describe('parseTsv', () => {
  it('keeps tabs and line breaks inside quoted cells', () => {
    expect(parseTsv('a\t"b\tc"\n"d\ne"\tf')).toEqual([['a', 'b\tc'], ['d\ne', 'f']]);
  });
  it('skips fully blank lines', () => {
    expect(parseTsv('a\tb\n\t\n\nc\td\n')).toEqual([['a', 'b'], ['c', 'd']]);
  });
});

describe('parseJournalPaste', () => {
  it('reads rows by header and accepts 5.0 and 1,234 style numbers', () => {
    const { rows, issues } = parseJournalPaste(JOURNAL);
    expect(issues).toEqual([]);
    expect(rows).toHaveLength(2);
    expect(rows[0] ?? {}).toMatchObject({ itemNo: '1005', locationCode: 'DU', qtyCalculated: 5, unitAmount: 3589 });
    expect(rows[1]?.qtyCalculated).toBe(1);
  });
  it('is not thrown by the team\'s extra columns or a different column order', () => {
    const text = 'Location Code\tQuantity Counted (normal Safe)\tQty. (Calculated)\tItem No.\n' + 'DU\t4\t5\t1005';
    expect(parseJournalPaste(text).rows[0] ?? {}).toMatchObject({ itemNo: '1005', qtyCalculated: 5 });
  });
  it('reports a missing required column instead of guessing', () => {
    const r = parseJournalPaste('Item No.\tDescription\n1005\tx');
    expect(r.rows).toEqual([]);
    expect(r.issues[0]?.message).toMatch(/Location Code, Qty\. \(Calculated\)/);
  });
  it('flags a duplicate item at the same location and keeps the first', () => {
    const text = JOURNAL + '\r\nSTOCKTAKE\t\t\tTEST\t1005\tdup\tDU\t9';
    const r = parseJournalPaste(text);
    expect(r.rows).toHaveLength(2);
    expect(r.issues[0]?.message).toMatch(/appears twice/);
  });
  it('flags a non-integer quantity and a blank location', () => {
    const text = 'Item No.\tLocation Code\tQty. (Calculated)\n1\tDU\t1.5\n2\t\t3';
    expect(parseJournalPaste(text).issues).toHaveLength(2);
  });
  it('allows the same item at different locations', () => {
    const text = 'Item No.\tLocation Code\tQty. (Calculated)\n1\tDU\t1\n1\tBC\t2';
    expect(parseJournalPaste(text).rows).toHaveLength(2);
  });
});

describe('serials', () => {
  it('keeps leading zeros and drops the .0 Excel adds', () => {
    expect(normalizeSerial(' 046156 ')).toBe('046156');
    expect(normalizeSerial('251109.0')).toBe('251109');
    expect(normalizeSerial('ac 6663')).toBe('AC6663');
  });
  it('splits pasted lists and ignores N/A and blanks', () => {
    expect(splitSerials('AC542808, AC542881\nN/A;;046156')).toEqual(['AC542808', 'AC542881', '046156']);
  });
  it('compares expected against found without assuming completeness', () => {
    const c = compareSerials(['A1', 'A2', 'A3'], ['A2', 'A3', 'Z9']);
    expect(c.matched).toEqual(['A2', 'A3']);
    expect(c.missing).toEqual(['A1']);
    expect(c.unexpected).toEqual(['Z9']);
  });
  it('flags a serial found twice and a serial BC lists twice', () => {
    const c = compareSerials(['AC6663', 'AC6663', 'B1'], ['B1', 'b1']);
    expect(c.duplicatesFound).toEqual(['B1']);
    expect(c.duplicatesExpected).toEqual(['AC6663']);
  });
});

const TRACKING = [
  'Positive\tDocument No.\tItem No.\tLocation Code\tQuantity\tSerial No.\tRemaining Quantity\tEntry No.',
  '1\tOPEN-INV\t1103\tDU\t1\tAC6663\t0\t5',
  '1\tOPEN-INV\t1103\tDU\t1\t251109.0\t1\t6',
  '1\tOPEN-INV\t1103\tDU\t1\t\t1\t7',
  '1\tOPEN-INV\t1103\tBC\t1\tX1\t1\t8',
].join('\n');

describe('item tracking', () => {
  it('lists only on-hand serials for the item and location, ignoring blanks', () => {
    const { entries, issues } = parseTrackingPaste(TRACKING);
    expect(issues).toEqual([]);
    expect(entries).toHaveLength(4);
    expect(onHandSerials(entries, '1103', 'DU')).toEqual(['251109']);
  });
  it('rejects a paste without the required columns', () => {
    expect(parseTrackingPaste('Item No.\tSerial No.\n1\tA').issues[0]?.message).toMatch(/Missing/);
  });
});

describe('product suggestions', () => {
  const products = [
    { id: 45, name: '250g Gold Bar', weight: 250, category: 'BAR' as const },
    { id: 46, name: '250g Silver Bar', weight: 250, category: 'BAR' as const },
    { id: 50, name: '1oz Krugerrand', weight: 31.1035, category: 'COIN' as const },
    { id: 51, name: '1kg Silver Bar', weight: 1000, category: 'BAR' as const },
  ];
  it('reads grams, kilos, ounces and fractions from BC descriptions', () => {
    expect(parseWeightGrams('Umicore - 250g bar')).toBe(250);
    expect(parseWeightGrams('Argor-Heraeus 1KG bar')).toBe(1000);
    expect(parseWeightGrams('1oz Pamp Suisse')).toBeCloseTo(31.1035);
    expect(parseWeightGrams('1/2oz Krugerrand')).toBeCloseTo(15.55175);
    expect(parseWeightGrams('Mixed bar')).toBeNull();
  });
  it('is ambiguous when the same weight exists for two metals', () => {
    expect(suggestProductForBcItem('Umicore - 250g bar', products)).toEqual({ status: 'AMBIGUOUS', productIds: [45, 46] });
  });
  it('suggests a single match and respects bar versus coin', () => {
    expect(suggestProductForBcItem('Argor-Heraeus 1KG bar', products)).toEqual({ status: 'SUGGESTED', productId: 51 });
    expect(suggestProductForBcItem('1oz Krugerrand coin', products)).toEqual({ status: 'SUGGESTED', productId: 50 });
    expect(suggestProductForBcItem('1oz bar', products)).toEqual({ status: 'NONE' });
  });
  it('returns NONE when no weight can be read', () => {
    expect(suggestProductForBcItem('Best Value mixed', products)).toEqual({ status: 'NONE' });
  });
});

describe('summarizeLines', () => {
  it('counts partial counts separately and nets the variance', () => {
    const s = summarizeLines([
      line({ counted: true, countedNormal: 4, countedCustomer: 2 }),
      line({ itemNo: '2', counted: true, countedNormal: 5 }),
      line({ itemNo: '3' }),
    ]);
    expect(s).toEqual({ lines: 3, counted: 2, uncounted: 1, withVariance: 1, netVariance: -1 });
  });
});

describe('journal export', () => {
  it('matches the header count and leaves uncounted lines blank rather than zero', () => {
    const row = buildJournalExportRows([line()], '2026-10-30')[0] ?? [];
    expect(row).toHaveLength(JOURNAL_EXPORT_HEADERS.length);
    const at = (h: (typeof JOURNAL_EXPORT_HEADERS)[number]) => row[JOURNAL_EXPORT_HEADERS.indexOf(h)];
    expect(at('Quantity Counted (normal Safe)')).toBe('');
    expect(at('Variance')).toBe('');
    expect(at('Quantity')).toBe('');
    expect(at('Qty. (Phys. Inventory)')).toBe(5);
  });
  it('writes variance with the confirmed sign and BC\'s Quantity with the opposite one', () => {
    const row = buildJournalExportRows([line({ counted: true, countedNormal: 4, countedCustomer: 2 })], null)[0] ?? [];
    const at = (h: (typeof JOURNAL_EXPORT_HEADERS)[number]) => row[JOURNAL_EXPORT_HEADERS.indexOf(h)];
    expect(at('Variance')).toBe(-1);
    expect(at('Qty. (Phys. Inventory)')).toBe(6);
    expect(at('Quantity')).toBe(1);
  });
});

describe('register export and csv', () => {
  it('uses the guide\'s labels', () => {
    const rows = buildRegisterExportRows([
      { itemNo: '1005', description: 'x', issueType: 'SERIAL', bcShows: 'A', physicalFound: 'B', serialNo: null, action: 'check', resolved: false },
    ]);
    expect(rows[0] ?? {}).toEqual(['1005', 'x', 'Serial Number', 'A', 'B', '', 'check', 'No']);
  });
  it('quotes commas and neutralises formula-looking text, but not numbers', () => {
    const csv = toCsv(['a', 'b', 'c'], [['x,y', '=SUM(A1)', -1]]);
    expect(csv.split('\r\n')[1]).toBe('"x,y",\'=SUM(A1),-1');
  });
});
