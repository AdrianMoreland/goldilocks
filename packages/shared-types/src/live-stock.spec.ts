import { describe, expect, it } from 'vitest';
import {
  AdjustLiveStockRequestSchema,
  liveRefinery,
  liveSerialKey,
  parseBarWeight,
  parseCoinName,
  planBaseline,
  parseWeight,
} from './index';

describe('parseWeight', () => {
  it('reads ounces, fractions, grams and kilos', () => {
    expect(parseWeight('1oz Krugerrand')?.label).toBe('1oz');
    expect(parseWeight('1/10oz Maple')?.label).toBe('1/10oz');
    expect(parseWeight('100g Bar')?.label).toBe('100g');
    expect(parseWeight('1KG Bar')?.label).toBe('1kg');
    expect(parseWeight('1KG Bar')?.grams).toBe(1000);
  });
  it('reads the 10z typo as 1oz', () => {
    expect(parseWeight('10z Kookaburra')?.label).toBe('1oz');
  });
  it('does not take a year for a weight', () => {
    expect(parseWeight('2013 Britannia')).toBeNull();
  });
  it('returns null with no weight', () => {
    expect(parseWeight('Full Sovereign')).toBeNull();
  });
});

describe('parseCoinName', () => {
  it('splits family and variant', () => {
    expect(parseCoinName('1oz Krugerrand')).toMatchObject({ family: 'Krugerrand', variant: '1oz' });
    expect(parseCoinName('1/10oz Maple')).toMatchObject({ family: 'Maple', variant: '1/10oz' });
  });
  it('keeps what tells variants apart', () => {
    expect(parseCoinName('1oz 22K Britannia').variant).toBe('1oz 22K');
    expect(parseCoinName('2013 1oz Britannia - Old Design').variant).toBe('1oz 2013 - Old Design');
  });
  it('handles sovereigns with no weight', () => {
    expect(parseCoinName('Full Sovereign')).toMatchObject({ family: 'Sovereign', variant: 'Full' });
    expect(parseCoinName('Half Sovereign Proof')).toMatchObject({ family: 'Sovereign', variant: 'Half Proof' });
  });
  it('puts one-offs under Other with the whole name', () => {
    expect(parseCoinName('50€ Gold Proof Coin')).toMatchObject({ family: 'Other', variant: '50€ Gold Proof Coin' });
  });
});

describe('bars and refineries', () => {
  it('folds bar weights', () => {
    expect(parseBarWeight('1oz bar').variant).toBe('1oz');
    expect(parseBarWeight('100oz bar').variant).toBe('100oz');
  });
  it('folds serials', () => {
    expect(liveSerialKey('ag-84938 ')).toBe('AG84938');
  });
  it('fixes known refinery spellings', () => {
    expect(liveRefinery('Heareus')).toEqual({ value: 'HERAEUS', listed: true });
    expect(liveRefinery('')).toEqual({ value: '', listed: true });
    expect(liveRefinery('Mystery Refiners').listed).toBe(false);
  });
});

const bar = (over: Partial<Parameters<typeof planBaseline>[0]['bars'][number]> = {}) => ({
  metal: 'GOLD' as const,
  row: 2,
  branch: 'DU',
  weight: '1oz Bar',
  refinery: 'Valcambi',
  serial: 'A1',
  grams: null,
  details: null,
  sold: false,
  ...over,
});

describe('planBaseline', () => {
  it('counts bars per branch, weight and refinery and keeps serials', () => {
    const plan = planBaseline({
      bars: [bar({ serial: 'A1' }), bar({ row: 3, serial: 'A2' }), bar({ row: 4, branch: 'CO', serial: 'B1' })],
      coins: [],
    });
    const du = plan.lines.find((l) => l.branchCode === 'DU');
    expect(du).toMatchObject({ variant: '1oz', refinery: 'VALCAMBI SUISSE', qty: 2 });
    expect(plan.bars).toHaveLength(3);
  });
  it('skips sold bars and reports blank branches', () => {
    const plan = planBaseline({ bars: [bar({ sold: true }), bar({ row: 3, branch: '' })], coins: [] });
    expect(plan.skippedSold).toBe(1);
    expect(plan.lines).toHaveLength(0);
    expect(plan.issues[0].row).toBe(3);
  });
  it('loads NOSERIAL bars as a count only', () => {
    const plan = planBaseline({ bars: [bar({ serial: 'NOSERIAL' })], coins: [] });
    expect(plan.bars).toHaveLength(0);
    expect(plan.lines[0].qty).toBe(1);
  });
  it('reports a repeated serial and loads neither copy as a serial', () => {
    const plan = planBaseline({
      bars: [bar({ serial: 'X9' }), bar({ row: 5, serial: 'x-9', refinery: 'PAMP' })],
      coins: [],
    });
    expect(plan.clashes).toEqual([{ serialKey: 'X9', rows: [2, 5] }]);
    expect(plan.bars).toHaveLength(0);
  });
  it('reads coin counts per branch and skips zero and blank', () => {
    const plan = planBaseline({
      bars: [],
      coins: [
        { metal: 'GOLD', row: 2, item: '1oz Krugerrand', counts: { DU: 4, CO: 0, BL: null }, details: { DU: '(damaged)' } },
      ],
    });
    expect(plan.lines).toHaveLength(1);
    expect(plan.lines[0]).toMatchObject({ branchCode: 'DU', family: 'Krugerrand', variant: '1oz', qty: 4, details: '(damaged)' });
  });
  it('rejects a fractional count', () => {
    const plan = planBaseline({
      bars: [],
      coins: [{ metal: 'GOLD', row: 2, item: '1oz Maple', counts: { DU: 1.5 }, details: {} }],
    });
    expect(plan.issues).toHaveLength(1);
  });
});

describe('AdjustLiveStockRequestSchema', () => {
  const base = { reason: 'Sold at counter' };
  it('takes a step or a typed quantity, not both', () => {
    expect(AdjustLiveStockRequestSchema.safeParse({ ...base, delta: -1 }).success).toBe(true);
    expect(AdjustLiveStockRequestSchema.safeParse({ ...base, qty: 3 }).success).toBe(true);
    expect(AdjustLiveStockRequestSchema.safeParse({ ...base, delta: 1, qty: 3 }).success).toBe(false);
    expect(AdjustLiveStockRequestSchema.safeParse(base).success).toBe(false);
  });
  it('requires a reason and refuses a zero step', () => {
    expect(AdjustLiveStockRequestSchema.safeParse({ delta: 1 }).success).toBe(false);
    expect(AdjustLiveStockRequestSchema.safeParse({ ...base, delta: 0 }).success).toBe(false);
  });
});

describe('branch order and names', () => {
  it('puts Dublin first and names Blanchardstown', async () => {
    const { sortBranchCodes, LIVE_BRANCH_NAMES } = await import('./index');
    const sorted = sortBranchCodes([{ code: 'BC' }, { code: 'CO' }, { code: 'DU' }, { code: 'BL' }, { code: 'ZZ' }]);
    expect(sorted.map((b) => b.code)).toEqual(['DU', 'BL', 'CO', 'BC', 'ZZ']);
    expect(LIVE_BRANCH_NAMES.BL).toBe('Blanchardstown');
  });
  it('knows the four extra refineries', async () => {
    const { liveRefinery } = await import('./index');
    for (const r of ['Asahi', 'Engelhard', 'Kantonal Bank', 'Melbourne Mint']) expect(liveRefinery(r).listed).toBe(true);
  });
});
