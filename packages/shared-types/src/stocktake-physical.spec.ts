import { describe, expect, it } from 'vitest';
import { findDuplicateSerials, isClosingBar, parseBarsPaste, parseCoinsPaste, planBarImport, summarizeBars } from './stocktake-physical';

const BARS = [
  'Branch\tCONFIRMED OCT\tWeight\tRefinery\tSerial\tGram\tCurrent Value\tDetails',
  'DU\t1\t100g Bar\tMetalor\t046156\t100\t11848.87\tCHIPPED PACKAGE',
  'DU\t\t100g Bar\tPAMP Lady Fortuna\tC528311\t100\t11848.87\t',
  'bc\t\t1g Bar\tUmicore\t\t1\t118\t',
  'DU\t\t5g Bar\tValcambi Suisse\tN/A\t5\t\t',
].join('\n');

describe('parseBarsPaste', () => {
  it('reads the stock workbook layout and ignores the extra columns', () => {
    const { rows, issues } = parseBarsPaste(BARS);
    expect(issues).toEqual([]);
    expect(rows).toHaveLength(4);
    expect(rows[0]).toEqual({ locationCode: 'DU', weightLabel: '100g Bar', refinery: 'Metalor', serial: '046156', grams: 100, details: 'CHIPPED PACKAGE' });
  });
  it('keeps leading zeros and upper-cases the branch', () => {
    const { rows } = parseBarsPaste(BARS);
    expect(rows[0]?.serial).toBe('046156');
    expect(rows[2]?.locationCode).toBe('BC');
  });
  it('keeps a bar with no serial, or N/A, as a bar with no serial', () => {
    const { rows } = parseBarsPaste(BARS);
    expect(rows[2]?.serial).toBeNull();
    expect(rows[3]?.serial).toBeNull();
  });
  it('splits "Refinery: serial" when there is no refinery cell', () => {
    const text = 'Branch\tWeight\tSerial\nDU\t1KG Bar\tValcambi Suisse: AG84938';
    expect(parseBarsPaste(text).rows[0]).toMatchObject({ refinery: 'Valcambi Suisse', serial: 'AG84938' });
  });
  it('rejects a paste without Branch and Weight, and flags blank cells', () => {
    expect(parseBarsPaste('Serial\nA1').issues[0]?.message).toMatch(/Branch and a Weight/);
    expect(parseBarsPaste('Branch\tWeight\n\t100g\nDU\t').issues).toHaveLength(2);
  });
});

describe('parseCoinsPaste', () => {
  it('reads item and quantity, with an optional branch', () => {
    const { rows, issues } = parseCoinsPaste('Item\tBranch\tQuantity\n1oz Krugerrand\tdu\t23\n1oz Krugerrand\tbc\t4');
    expect(issues).toEqual([]);
    expect(rows).toEqual([
      { locationCode: 'DU', item: '1oz Krugerrand', quantity: 23 },
      { locationCode: 'BC', item: '1oz Krugerrand', quantity: 4 },
    ]);
  });
  it('flags a repeated item and a non-integer quantity', () => {
    const { rows, issues } = parseCoinsPaste('Item\tQty\nA\t1\nA\t2\nB\t1.5');
    expect(rows).toHaveLength(1);
    expect(issues).toHaveLength(2);
  });
});

describe('serial duplicates and summary', () => {
  it('finds a serial held by two live bars but ignores bars marked gone and bars with no serial', () => {
    const dup = findDuplicateSerials([
      { id: 1, serial: 'A1', status: 'CONFIRMED' },
      { id: 2, serial: 'A1', status: 'NEW' },
      { id: 3, serial: 'B2', status: 'GONE' },
      { id: 4, serial: 'B2', status: 'CONFIRMED' },
      { id: 5, serial: null, status: 'NEW' },
      { id: 6, serial: null, status: 'NEW' },
    ]);
    expect([...dup.entries()]).toEqual([['A1', [1, 2]]]);
  });
  it('counts unconfirmed bars separately so none is assumed present', () => {
    expect(
      summarizeBars([
        { status: 'CONFIRMED', serial: 'A' },
        { status: 'UNCONFIRMED', serial: null },
        { status: 'NEW', serial: 'C' },
        { status: 'GONE', serial: 'D' },
      ]),
    ).toEqual({ total: 3, confirmed: 1, added: 1, gone: 1, unconfirmed: 1, withoutSerial: 1 });
  });
  it('carries forward only bars that were seen', () => {
    expect(['CONFIRMED', 'NEW', 'UNCONFIRMED', 'GONE'].map((s) => isClosingBar(s as never))).toEqual([true, true, false, false]);
  });
});

describe('planBarImport', () => {
  const row = (serial: string | null) => ({ locationCode: 'DU', weightLabel: '1g Bar', refinery: 'Umicore', serial, grams: 1, details: null });
  it('skips a serial already on a live bar but not one on a bar marked gone', () => {
    const existing = [
      { locationCode: 'DU', weightLabel: '1g Bar', refinery: 'Umicore', serial: 'A1', status: 'CONFIRMED' as const },
      { locationCode: 'DU', weightLabel: '1g Bar', refinery: 'Umicore', serial: 'B2', status: 'GONE' as const },
    ];
    const plan = planBarImport(existing, [row('A1'), row('B2'), row('C3'), row('C3')]);
    expect(plan.toAdd.map((r) => r.serial)).toEqual(['B2', 'C3']);
    expect(plan.skipped).toBe(2);
  });
  it('matches bars without a serial only up to the number already there', () => {
    const existing = [
      { locationCode: 'DU', weightLabel: '1g Bar', refinery: 'Umicore', serial: null, status: 'UNCONFIRMED' as const },
      { locationCode: 'DU', weightLabel: '1g Bar', refinery: 'Umicore', serial: null, status: 'UNCONFIRMED' as const },
    ];
    const plan = planBarImport(existing, [row(null), row(null), row(null)]);
    expect(plan.toAdd).toHaveLength(1);
    expect(plan.skipped).toBe(2);
  });
  it('adds everything to an empty register', () => {
    expect(planBarImport([], [row('A1'), row(null)]).toAdd).toHaveLength(2);
  });
});

describe('physical exports', () => {
  it('leaves Change blank for an uncounted coin line and writes bar status in words', async () => {
    const { buildBarExportRows, buildCoinExportRows } = await import('./stocktake-physical');
    expect(buildCoinExportRows([{ metal: 'GOLD', locationCode: '', item: 'A', previousQty: 5, countedQty: null, details: null }])[0]?.[5]).toBe('');
    expect(buildCoinExportRows([{ metal: 'GOLD', locationCode: '', item: 'A', previousQty: 5, countedQty: 3, details: null }])[0]?.[5]).toBe(-2);
    expect(buildBarExportRows([{ metal: 'GOLD', locationCode: 'DU', weightLabel: '1g Bar', refinery: null, serial: null, grams: null, status: 'UNCONFIRMED', details: null }])[0]?.[6]).toBe('Not seen');
  });
});
