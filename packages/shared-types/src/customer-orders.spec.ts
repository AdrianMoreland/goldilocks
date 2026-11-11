import { describe, expect, it } from 'vitest';
import {
  expectedCustomerStock,
  isPhysicallyHere,
  linkOrdersToTradesheet,
  parseTradesheetPaste,
  matchTradeLine,
  normalizeClient,
  normalizeReference,
  parseCustomerOrdersPaste,
  parseSheetDate,
  planCustomerOrderImport,
} from './customer-orders';

describe('keys', () => {
  it('folds spacing and case in references and names, but not spelling', () => {
    expect(normalizeReference('CO- G202609122')).toBe('CO-G202609122');
    expect(normalizeClient('  Michael  JONKER ')).toBe('michael jonker');
    expect(normalizeClient('David Caulfeild')).not.toBe(normalizeClient('David Caulfield'));
  });
});

describe('matchTradeLine', () => {
  const lines = [
    { reference: 'DU-G20261002', client: 'Tom Oneill' },
    { reference: 'DU-G20261003', client: 'Archicon Limited' },
    { reference: 'DU-G20261004', client: 'Archicon Limited' },
    { reference: 'DU-G20261004', client: 'Another Client' },
  ];
  it('links on reference plus the same name', () => {
    expect(matchTradeLine({ reference: 'du-g20261003', client: 'ARCHICON LIMITED' }, lines).status).toBe('EXACT');
  });
  it('sends a reference match with a misspelt name to review, never silently linking', () => {
    const m = matchTradeLine({ reference: 'DU-G20261002', client: 'Tom Oneil' }, lines);
    expect(m.status).toBe('REVIEW');
  });
  it('never links on the name alone', () => {
    expect(matchTradeLine({ reference: 'DU-G99999999', client: 'Tom Oneill' }, lines).status).toBe('NONE');
    expect(matchTradeLine({ reference: '', client: 'Tom Oneill' }, lines).status).toBe('NONE');
  });
  it('is ambiguous when one reference sits on several lines and the name does not pick one', () => {
    expect(matchTradeLine({ reference: 'DU-G20261004', client: 'Somebody Else' }, lines).status).toBe('AMBIGUOUS');
  });
});

describe('parseSheetDate', () => {
  it('reads Excel serials, ISO and day/month/year', () => {
    expect(parseSheetDate('46293')).toBe('2026-09-28');
    expect(parseSheetDate('46293.0')).toBe('2026-09-28');
    expect(parseSheetDate('2026-10-05')).toBe('2026-10-05');
    expect(parseSheetDate('5/10/2026')).toBe('2026-10-05');
    expect(parseSheetDate('31/02/2026')).toBeNull();
    expect(parseSheetDate('hello')).toBeNull();
  });
});

const SHEET = [
  'STATUS\tBRANCH\tDate\tClient\tReference\tQTY\tProduct\tRefinery\tSERIALS\tNOTES',
  'Bagged\tDU\t46293\tDavid Caulfield\tDU-G202608147\t4\t1oz Krugerrand\tN/A\tN/A\tin transit',
  'Ordered\tdu\t46293\tLouis Power\tDU-G202609166\t35\t1oz Britannia\t\t\t',
  'Weird\tDU\t\tBad Row\t\t1\tx\t\t\t',
  'Bagged\tDU\t\tZero Qty\t\t0\tx\t\t\t',
].join('\n');

describe('parseCustomerOrdersPaste', () => {
  it('reads the sheet by header and keeps unknowns as null rather than inventing them', () => {
    const { rows, issues } = parseCustomerOrdersPaste(SHEET, null);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ locationCode: 'DU', client: 'David Caulfield', quantity: 4, status: 'BAGGED', orderedOn: '2026-09-28', refinery: null, serials: null });
    expect(rows[1]?.locationCode).toBe('DU');
    expect(issues).toHaveLength(2);
  });
  it('rejects an unknown status instead of guessing, and a row with no status when none is chosen', () => {
    const none = parseCustomerOrdersPaste('Client\tBranch\tQTY\tProduct\nA\tDU\t1\tX', null);
    expect(none.rows).toEqual([]);
    expect(none.issues[0]?.message).toMatch(/no status/);
    const withFallback = parseCustomerOrdersPaste('Client\tBranch\tQTY\tProduct\nA\tDU\t1\tX', 'DELIVERED');
    expect(withFallback.rows[0]?.status).toBe('DELIVERED');
  });
  it('lets a Collected collection status win over the order status', () => {
    const t = 'Branch\tOrderStatus\tCollection Status\tClient\tQTY\tProduct\nBL\tDelivered\tCollected\tThomas Rock\t12\t1oz Maple';
    expect(parseCustomerOrdersPaste(t, null).rows[0]?.status).toBe('COLLECTED');
  });
  it('needs the core columns', () => {
    expect(parseCustomerOrdersPaste('Client\nA', null).issues[0]?.message).toMatch(/Needs at least/);
  });
});

describe('planCustomerOrderImport', () => {
  const base = { locationCode: 'DU', client: 'A', reference: 'DU-G1', product: '1oz X', quantity: 2 };
  const stored = (over = {}) => ({ ...base, id: 1, status: 'BAGGED' as const, serials: null, notes: null, orderedOn: null, missing: false, supplierRef: null, refinery: null, ...over });
  const row = (over = {}) => ({ ...base, supplierRef: null, refinery: null, serials: null, status: 'BAGGED' as const, orderedOn: null, missing: false, notes: null, ...over });
  it('is repeat-safe up to the number already stored, and counts matches as unchanged', () => {
    const plan = planCustomerOrderImport([stored()], [row(), row()]);
    expect(plan).toMatchObject({ unchanged: 1, toUpdate: [] });
    expect(plan.toAdd).toHaveLength(1);
    expect(planCustomerOrderImport([], [row(), row()]).toAdd).toHaveLength(2);
  });
  it('pairs duplicates with separate stored items', () => {
    const plan = planCustomerOrderImport([stored({ id: 1 }), stored({ id: 2 })], [row({ notes: 'x' }), row({ notes: 'y' })]);
    expect(plan.toUpdate).toEqual([
      { id: 1, changes: { notes: 'x' } },
      { id: 2, changes: { notes: 'y' } },
    ]);
    expect(plan.toAdd).toHaveLength(0);
  });
  it('treats a different quantity or reference as a different order', () => {
    expect(planCustomerOrderImport([stored()], [row({ quantity: 3 }), row({ reference: 'DU-G2' })]).toAdd).toHaveLength(2);
  });
  it('moves status forward only', () => {
    expect(planCustomerOrderImport([stored({ status: 'ALLOCATED' })], [row({ status: 'COLLECTED' })]).toUpdate).toEqual([{ id: 1, changes: { status: 'COLLECTED' } }]);
    expect(planCustomerOrderImport([stored({ status: 'ORDERED' })], [row({ status: 'DELIVERED' })]).toUpdate[0]?.changes.status).toBe('DELIVERED');
    const back = planCustomerOrderImport([stored({ status: 'COLLECTED' })], [row({ status: 'ORDERED' })]);
    expect(back.toUpdate).toEqual([]);
    expect(back.unchanged).toBe(1);
  });
  it('treats BAGGED and ALLOCATED as the same status', () => {
    expect(planCustomerOrderImport([stored({ status: 'BAGGED' })], [row({ status: 'ALLOCATED' })])).toMatchObject({ toUpdate: [], unchanged: 1 });
    expect(planCustomerOrderImport([stored({ status: 'ALLOCATED' })], [row({ status: 'BAGGED' })])).toMatchObject({ toUpdate: [], unchanged: 1 });
  });
  it('takes new serials, notes, refs and refinery, but an empty cell never clears a stored value', () => {
    const s = stored({ serials: 'S1', notes: 'old', supplierRef: 'PO1', refinery: 'Perth' });
    expect(planCustomerOrderImport([s], [row()])).toMatchObject({ toUpdate: [], unchanged: 1 });
    expect(planCustomerOrderImport([s], [row({ serials: '  ', notes: '' })]).unchanged).toBe(1);
    expect(planCustomerOrderImport([s], [row({ serials: ' S1 ', notes: 'new', supplierRef: 'PO2', refinery: 'Umicore' })]).toUpdate).toEqual([
      { id: 1, changes: { notes: 'new', supplierRef: 'PO2', refinery: 'Umicore' } },
    ]);
  });
  it('updates the date when the sheet has one that differs, and sets missing but never clears it', () => {
    expect(planCustomerOrderImport([stored({ orderedOn: '2026-09-01' })], [row({ orderedOn: '2026-09-28' })]).toUpdate[0]?.changes).toEqual({ orderedOn: '2026-09-28' });
    expect(planCustomerOrderImport([stored({ orderedOn: '2026-09-01' })], [row()]).unchanged).toBe(1);
    expect(planCustomerOrderImport([stored()], [row({ missing: true })]).toUpdate[0]?.changes).toEqual({ missing: true });
    expect(planCustomerOrderImport([stored({ missing: true })], [row()]).unchanged).toBe(1);
  });

  describe('statusOnly', () => {
    it('ignores text and date differences', () => {
      const plan = planCustomerOrderImport(
        [stored({ orderedOn: '2026-09-01' })],
        [row({ notes: 'n', serials: 'S9', supplierRef: 'PO', refinery: 'Umicore', orderedOn: '2026-09-28' })],
        { fields: 'statusOnly' },
      );
      expect(plan).toMatchObject({ toUpdate: [], unchanged: 1 });
    });
    it('moves status forward and sets missing only', () => {
      const plan = planCustomerOrderImport(
        [stored({ status: 'ALLOCATED' })],
        [row({ status: 'COLLECTED', notes: 'n', missing: true })],
        { fields: 'statusOnly' },
      );
      expect(plan.toUpdate).toEqual([{ id: 1, changes: { status: 'COLLECTED', missing: true } }]);
    });
    it('still adds new items in full', () => {
      expect(planCustomerOrderImport([], [row({ notes: 'n' })], { fields: 'statusOnly' }).toAdd[0]?.notes).toBe('n');
    });
  });
});
