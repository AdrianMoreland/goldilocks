import { describe, expect, it } from 'vitest';
import { buildNameLookup, coreRef, mapBcReport, normaliseName, planUpload } from './import-hub';
import { ImportTableSchemas } from './import-workbook.schema';

describe('planUpload', () => {
  const rows = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `r${i}` }));

  it('sends parents first, chunks big tables and marks the last chunk of each table', () => {
    const plan = planUpload({ links: rows(3), customers: rows(5), trades: rows(1) }, 'f.xlsx', 2);
    expect(plan.map((p) => `${p.table}:${p.rows.length}:${p.lastOfTable}`)).toEqual([
      'customers:2:false', 'customers:2:false', 'customers:1:true', 'trades:1:true', 'links:2:false', 'links:1:true',
    ]);
    expect(plan.map((p) => p.complete)).toEqual([false, false, false, false, false, true]);
  });

  it('sends nothing for empty tables, so an empty tab flags no stored rows', () => {
    expect(planUpload({ customers: [], vendors: rows(1) }, 'f.xlsx').map((p) => p.table)).toEqual(['vendors']);
    expect(planUpload({}, 'f.xlsx')).toEqual([]);
  });
});

describe('name lookup', () => {
  it('folds legal suffixes and punctuation the way the script does', () => {
    expect(normaliseName("Fake  Alder Trading Ltd.")).toBe(normaliseName('fake alder trading'));
    expect(normaliseName('A and B (Dublin) Limited')).toBe('a & b');
  });
  it('finds a code by the original name or by the map key', () => {
    const l = buildNameLookup([{ code: 'C000001', key: 'fake alder trading', original: 'Fake Alder Trading Ltd' }]);
    expect(l.get(normaliseName('FAKE ALDER TRADING'))).toBe('C000001');
  });
});

describe('coreRef', () => {
  it('strips the branch and keeps the sale reference', () => {
    expect(coreRef('DU-G20260941')).toBe('G20260941');
    expect(coreRef('INV-009181')).toBe('INV009181');
  });
});

describe('mapBcReport', () => {
  const header = ['No.', 'Sell-to Customer No.', 'Sell-to Customer Name', 'External Document No.', 'Location Code', 'Document Date', 'Amount', 'Amount Including VAT', 'Amount Prepaid', 'Remaining Amount', 'Paid'];
  const names = buildNameLookup([{ code: 'C000001', original: 'Fake Alder Trading' }]);
  const sheet = [
    ['Orders Awaiting Collection'],
    header,
    ['SO-1', 'CU-1', 'Fake Alder Trading Ltd', 'DU-G20260941', 'DU', new Date(Date.UTC(2026, 9, 28)), 1000.5, 1000.5, 1000.5, 0, 1],
    ['SO-2', 'CU-2', 'Someone Not In The Map', 'DU-S20260956', '', '2026-10-29', '2,000', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, 'x', null, null, null, null, null, null, null, null, null],
  ];

  it('maps rows to bc_sales_orders with the order number as id and names as codes only', () => {
    const r = mapBcReport(sheet, 'report.xlsx', names);
    expect(r).toMatchObject({ headerFound: true, unmappedCustomers: 1, skipped: 1 });
    expect(r.rows[0]).toMatchObject({ id: 'SO-1', client_code: 'C000001', ext_doc_core: 'G20260941', branch_code: 'DU', doc_date: '2026-10-28', paid: true, snapshot: 'report.xlsx' });
    expect(r.rows[1]).toMatchObject({ id: 'SO-2', client_code: null, branch_code: 'DU', amount: 2000 });
    expect(JSON.stringify(r.rows)).not.toContain('Fake Alder');
    for (const row of r.rows) expect(ImportTableSchemas.bc_sales_orders.safeParse(row).success).toBe(true);
  });

  it('says so when the header is not there', () => {
    expect(mapBcReport([['a', 'b']], 'x.xlsx', names)).toMatchObject({ headerFound: false, rows: [] });
  });
});
