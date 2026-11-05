import { describe, expect, it } from 'vitest';
import { allowedSteps, customerSafeRow, deriveOrder, isOpenOrder, isCashOverThreshold, nextAction, sheetTasksForStep, taskShowsDone, type OrderFacts } from './orders';

const base: OrderFacts = { cptyKind: 'HEDGED', collected: false, hasLot: false, supplierInvoice: null, steps: [], bcOpen: null };
const d = (o: Partial<OrderFacts>) => deriveOrder({ ...base, ...o });

describe('deriveOrder', () => {
  it('treats a quote as a quote that reserves nothing', () => {
    const r = d({ cptyKind: 'QUOTE_ONLY' });
    expect(r.lifecycle).toBe('QUOTE');
    expect(r.queues).toEqual(['quote']);
  });

  it('reads a paid, hedged order with no decision as paid and needing allocation', () => {
    const r = d({});
    expect(r).toMatchObject({ lifecycle: 'PAID', source: 'UNDECIDED' });
    expect(r.queues).toEqual(expect.arrayContaining(['alloc', 'pline']));
  });

  it('reads a supplier invoice as Ordered until delivery is marked, then Arrived and Allocated', () => {
    const f = { cptyKind: 'SUPPLIER_INVOICE' as const, supplierInvoice: 'StoneX #511411' };
    expect(d(f)).toMatchObject({ lifecycle: 'ORDERED', source: 'SUPPLIER', queues: ['arrive'] });
    expect(d({ ...f, steps: ['ARRIVED'] }).lifecycle).toBe('ARRIVED');
    expect(d({ ...f, steps: ['ARRIVED'] }).queues).toContain('alloc');
    const allocated = d({ ...f, steps: ['ARRIVED', 'ALLOCATED'] });
    expect(allocated.lifecycle).toBe('ALLOCATED');
    expect(allocated.queues).not.toContain('pline'); // supplier orders never get a P-line
  });

  it('reads a P-line in CPTY as Matched', () => {
    const r = d({ cptyKind: 'LOT_REF', hasLot: true });
    expect(r).toMatchObject({ lifecycle: 'MATCHED', source: 'STOCK' });
    expect(r.queues).not.toContain('pline');
  });

  it('puts deferred placeholders in their own queue', () => {
    expect(d({ cptyKind: 'DEFERRED' }).queues).toEqual(['defer']);
  });

  it('flags collected-not-posted only while BC still lists the order', () => {
    expect(d({ cptyKind: 'LOT_REF', hasLot: true, collected: true, bcOpen: true })).toMatchObject({ lifecycle: 'COLLECTED', queues: ['nopost'] });
    expect(d({ cptyKind: 'LOT_REF', hasLot: true, collected: true, bcOpen: false }).lifecycle).toBe('POSTED');
    expect(d({ cptyKind: 'LOT_REF', hasLot: true, collected: true, bcOpen: null }).queues).toEqual([]);
  });

  it('flags a tradesheet that does not say collected when a step or BC says it was', () => {
    const r = d({ cptyKind: 'LOT_REF', hasLot: true, steps: ['COLLECTED'], collected: false });
    expect(r.lifecycle).toBe('COLLECTED');
    expect(r.queues).toContain('tsmark');
    expect(nextAction(r.lifecycle, r.source, r.queues).code).toBe('TICK');
  });

  it('carries BC and P-line anomalies into the queues', () => {
    expect(d({ cptyKind: 'LOT_REF', hasLot: true, bcAnomaly: true, lotOverAllocated: true }).queues).toEqual(['bcanom', 'over']);
  });
});

describe('isOpenOrder', () => {
  it('hides quotes and old collected orders, keeps work to do', () => {
    expect(isOpenOrder(d({ cptyKind: 'QUOTE_ONLY' }), null)).toBe(false);
    expect(isOpenOrder(d({}), null)).toBe(true);
    const done = { cptyKind: 'LOT_REF' as const, hasLot: true, collected: true };
    expect(isOpenOrder(d(done), null)).toBe(false);
    expect(isOpenOrder(d(done), true)).toBe(true);
    expect(isOpenOrder(d({ ...done, collected: false, steps: ['POSTED'] }), false)).toBe(true); // tradesheet still to be ticked
  });
});

describe('steps and next actions', () => {
  it('lets Paid go to allocate or order, but a needs-order order only to ordered', () => {
    expect(allowedSteps('PAID', 'UNDECIDED')).toEqual(['ALLOCATED', 'ORDERED']);
    expect(allowedSteps('PAID', 'NEEDS_ORDER')).toEqual(['ORDERED']);
    expect(allowedSteps('POSTED', 'STOCK')).toEqual([]);
  });

  it('names who does each action', () => {
    expect(nextAction('PAID', 'NEEDS_ORDER', ['order'])).toMatchObject({ who: 'manager', step: 'ORDERED' });
    expect(nextAction('ARRIVED', 'SUPPLIER', ['alloc'])).toMatchObject({ who: 'broker', step: 'ALLOCATED' });
  });
});

describe('sheet tasks', () => {
  const ctx = { client: 'Doyle, R', reference: 'DU-G2026438', product: '1oz Krugerrand', qty: 4, date: '30 Oct', serials: ['A1', 'B2'], pline: 'DU-GP20261028', soldComment: '7 sold', stockChange: 'Coins: 1oz Krugerrand 42 -> 38' };

  it('creates the sheet changes for each step', () => {
    expect(sheetTasksForStep('ALLOCATED', ctx).map((t) => t.sheet)).toEqual(['Stock sheet', 'Customer safe sheet']);
    expect(sheetTasksForStep('MATCHED', ctx).map((t) => t.value)).toEqual(['DU-GP20261028', '7 sold']);
    expect(sheetTasksForStep('COLLECTED', ctx).map((t) => t.sheet)).toEqual(['Tradesheet', 'Customer safe sheet']);
    expect(sheetTasksForStep('ARRIVED', ctx)).toEqual([]);
  });

  it('builds a tab-separated customer safe row with serials', () => {
    expect(customerSafeRow(ctx)).toBe('Allocated\tDU\t30 Oct\tDoyle, R\tDU-G2026438\t4\t1oz Krugerrand\t\tA1, B2');
  });

  it('closes a task only when the import shows the change', () => {
    expect(taskShowsDone({ check: 'TRADE_COLLECTED', value: 'C' }, { collected: true, cptyRaw: null })).toBe(true);
    expect(taskShowsDone({ check: 'TRADE_COLLECTED', value: 'C' }, { collected: false, cptyRaw: null })).toBe(false);
    expect(taskShowsDone({ check: 'TRADE_CPTY', value: 'DU-GP20261028' }, { collected: false, cptyRaw: 'du-gp20261028' })).toBe(true);
    expect(taskShowsDone({ check: 'TRADE_CPTY', value: 'StoneX #511411' }, { collected: false, cptyRaw: 'HEDGED' })).toBe(false);
    expect(taskShowsDone({ check: 'MANUAL', value: 'x' }, { collected: true, cptyRaw: 'x' })).toBe(false);
  });
});

describe('cash threshold', () => {
  it('flags cash of 10,000 euro or more only', () => {
    expect(isCashOverThreshold('Cash', 10000)).toBe(true);
    expect(isCashOverThreshold('cash', 9999.99)).toBe(false);
    expect(isCashOverThreshold('Bank Transfer', 50000)).toBe(false);
  });
});
