import { describe, expect, it } from 'vitest';
import { planRow, readProduct, type LineCandidate, type PlanContext, type PriorApplication, type ApplyRow } from './sheet-apply';

const row = (o: Partial<ApplyRow> = {}): ApplyRow => ({
  kind: 'SALE',
  referenceKey: 'DUG20261120',
  occurrence: 1,
  branchCode: 'DU',
  metal: 'GOLD',
  productText: '2x 1oz bar'.replace('2x ', ''),
  qty: 2,
  date: '2026-11-20',
  eligible: true,
  ...o,
});

const bar = (o: Partial<LineCandidate> = {}): LineCandidate => ({
  lineId: 1,
  kind: 'BAR',
  family: 'Bar',
  variant: '1oz',
  refinery: 'VALCAMBI SUISSE',
  qty: 5,
  lastManualOn: null,
  ...o,
});

const ctx = (o: Partial<PlanContext> = {}): PlanContext => ({ cutoverDate: '2026-11-18', candidates: [bar()], ...o });

const prior = (o: Partial<PriorApplication> = {}): PriorApplication => ({
  id: 9,
  status: 'APPLIED',
  appliedQty: -2,
  lineId: 1,
  reason: null,
  ...o,
});

describe('planRow: the first time a row is seen', () => {
  it('a sale takes stock from the one line that fits', () => {
    expect(planRow(row(), null, ctx())).toEqual({ type: 'APPLY', delta: -2, lineId: 1 });
  });

  it('a purchase adds stock', () => {
    expect(planRow(row({ kind: 'PURCHASE' }), null, ctx())).toEqual({ type: 'APPLY', delta: 2, lineId: 1 });
  });

  it('never applies a row dated on or before the cut-over', () => {
    expect(planRow(row({ date: '2026-11-18' }), null, ctx())).toEqual({ type: 'SKIP', reason: 'CUTOVER' });
    expect(planRow(row({ date: '2026-11-01' }), null, ctx())).toEqual({ type: 'SKIP', reason: 'CUTOVER' });
  });

  it('skips a row with no baseline for its branch, no date, or no quantity', () => {
    expect(planRow(row(), null, ctx({ cutoverDate: null }))).toEqual({ type: 'SKIP', reason: 'NO_BRANCH' });
    expect(planRow(row({ date: null }), null, ctx())).toEqual({ type: 'SKIP', reason: 'NO_DATE' });
    expect(planRow(row({ qty: null }), null, ctx())).toEqual({ type: 'SKIP', reason: 'NO_QTY' });
  });

  it('ignores an ineligible row (quote, deferred, repeat)', () => {
    expect(planRow(row({ eligible: false }), null, ctx())).toEqual({ type: 'SKIP', reason: 'INELIGIBLE' });
  });
});

describe('planRow: the double-count rule', () => {
  it('asks when the line was edited by hand on or after the sale day', () => {
    // 5 Valcambi, sold 2, staff edit 5 to 3 the same day: the edit may already include the sale.
    const lines = [bar({ qty: 3, lastManualOn: '2026-11-20' })];
    expect(planRow(row(), null, ctx({ candidates: lines }))).toEqual({ type: 'ASK_COUNTED', delta: -2, lineId: 1 });
    const later = [bar({ qty: 3, lastManualOn: '2026-11-21' })];
    expect(planRow(row(), null, ctx({ candidates: later })).type).toBe('ASK_COUNTED');
  });

  it('applies when the last manual edit was before the sale day', () => {
    const lines = [bar({ lastManualOn: '2026-11-19' })];
    expect(planRow(row(), null, ctx({ candidates: lines }))).toEqual({ type: 'APPLY', delta: -2, lineId: 1 });
  });

  it('a row already applied changes nothing when uploaded again', () => {
    expect(planRow(row(), prior(), ctx())).toEqual({ type: 'SKIP', reason: 'UNCHANGED' });
  });

  it('an already-applied row is not asked about again even if the line was edited since', () => {
    const lines = [bar({ qty: 3, lastManualOn: '2026-11-21' })];
    expect(planRow(row(), prior(), ctx({ candidates: lines }))).toEqual({ type: 'SKIP', reason: 'UNCHANGED' });
  });

  it('a row whose quantity grows applies only the difference', () => {
    expect(planRow(row({ qty: 3 }), prior(), ctx())).toEqual({ type: 'APPLY', delta: -1, lineId: 1 });
    expect(planRow(row({ qty: 1 }), prior(), ctx())).toEqual({ type: 'APPLY', delta: 1, lineId: 1 });
  });

  it('a row waiting for a decision is left alone', () => {
    expect(planRow(row(), prior({ status: 'NEEDS_DECISION', appliedQty: 0, lineId: 1 }), ctx())).toEqual({ type: 'SKIP', reason: 'PENDING' });
  });

  it('a row a person dismissed never applies', () => {
    expect(planRow(row(), prior({ status: 'DISMISSED', appliedQty: 0 }), ctx())).toEqual({ type: 'SKIP', reason: 'DISMISSED' });
  });
});

describe('planRow: rows that change or disappear', () => {
  it('flags an applied row that is now a quote, deferred or gone, and never reverses it silently', () => {
    expect(planRow(row({ eligible: false }), prior(), ctx())).toEqual({ type: 'WITHDRAWN', appliedQty: -2, lineId: 1 });
  });
});

describe('planRow: which line', () => {
  const two = [bar({ lineId: 1 }), bar({ lineId: 2, refinery: 'METALOR', qty: 3 })];
  it('asks which refinery when several lines hold stock', () => {
    expect(planRow(row(), null, ctx({ candidates: two }))).toEqual({ type: 'PICK_LINE', delta: -2, lineIds: [1, 2] });
  });
  it('only lines with stock are choices for a sale', () => {
    const lines = [bar({ lineId: 1 }), bar({ lineId: 2, qty: 0 })];
    expect(planRow(row(), null, ctx({ candidates: lines }))).toEqual({ type: 'APPLY', delta: -2, lineId: 1 });
  });
  it('reports a sale with no matching or no stocked line', () => {
    expect(planRow(row(), null, ctx({ candidates: [] })).type).toBe('UNMATCHED');
    expect(planRow(row(), null, ctx({ candidates: [bar({ qty: 0 })] })).type).toBe('UNMATCHED');
  });
  it('a purchase of something new creates its line', () => {
    expect(planRow(row({ kind: 'PURCHASE' }), null, ctx({ candidates: [] }))).toEqual({
      type: 'CREATE_AND_APPLY',
      delta: 2,
      create: { kind: 'BAR', family: 'Bar', variant: '1oz', refinery: '' },
    });
  });
  it('matches a coin by family and weight', () => {
    const coin: LineCandidate = { lineId: 7, kind: 'COIN', family: 'Krugerrand', variant: '1oz', refinery: '', qty: 4, lastManualOn: null };
    expect(planRow(row({ productText: '1oz Krugerrand' }), null, ctx({ candidates: [coin] }))).toEqual({ type: 'APPLY', delta: -2, lineId: 7 });
  });
  it('cannot read a one-off product', () => {
    expect(planRow(row({ productText: '50€ Gold Proof Coin' }), null, ctx()).type).toBe('UNMATCHED');
  });
});

describe('readProduct', () => {
  it('tells bars from coins', () => {
    expect(readProduct('1kg bar')).toEqual({ kind: 'BAR', variant: '1kg' });
    expect(readProduct('1oz Maple')).toMatchObject({ kind: 'COIN', family: 'Maple', variant: '1oz' });
  });
});
