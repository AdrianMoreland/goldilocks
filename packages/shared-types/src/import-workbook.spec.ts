import { describe, expect, it } from 'vitest';
import { fakeRedactionMap, fakeWorkbookSheets, withoutOptionalColumns } from './import-workbook.fixture';
import { readImportWorkbook, type RawSheets } from './import-workbook';
import { IMPORT_TABLE_NAMES, ImportTableSchemas } from './import-workbook.schema';
import { unredactTables } from './unredact';

const withCell = (sheets: RawSheets, table: string, col: string, value: unknown, row = 1): RawSheets => {
  const rows = sheets[table]!.map((r) => [...r]);
  rows[row]![rows[0]!.indexOf(col)] = value;
  return { ...sheets, [table]: rows };
};

describe('readImportWorkbook', () => {
  it('round-trips a generated fake workbook with zero issues', () => {
    const r = readImportWorkbook(fakeWorkbookSheets(4));
    expect(r.schemaErrors).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.issues).toEqual([]);
    for (const t of IMPORT_TABLE_NAMES) {
      expect(r.counts[t]).toBe(4);
      for (const row of r.tables[t]) expect(ImportTableSchemas[t].safeParse(row).success).toBe(true);
    }
  });

  it('accepts the older script build without the optional columns', () => {
    const r = readImportWorkbook(withoutOptionalColumns(fakeWorkbookSheets()));
    expect(r.ok).toBe(true);
    expect(r.tables.product_aliases[0]!.refinery).toBeNull();
  });

  it('coerces floats, dates, booleans and year-months', () => {
    let s = fakeWorkbookSheets();
    s = withCell(s, 'trades', 'occurrence', 1.0);
    s = withCell(s, 'trades', 'qty', '1,5');
    s = withCell(s, 'trades', 'hedged_order', 'TRUE');
    s = withCell(s, 'trades', 'date', '2026-10-05 00:00:00');
    s = withCell(s, 'trades', 'ref_month', '2026-01');
    s = withCell(s, 'trades', 'source_month', new Date(Date.UTC(2026, 2, 1)));
    s = withCell(s, 'trades', 'spot', 46300);
    const row = readImportWorkbook(s).tables.trades[0];
    expect(row).toMatchObject({ occurrence: 1, qty: 1.5, hedged_order: true, date: '2026-10-05', ref_month: '2026-01', source_month: '2026-03', spot: 46300 });
  });

  it('turns impossible dates into row issues, not values', () => {
    const s = withCell(fakeWorkbookSheets(), 'trades', 'source_month', '0206-03-01');
    const r = readImportWorkbook(s);
    expect(r.tables.trades[0]!.source_month).toBeNull();
    expect(r.issues).toContainEqual({ table: 'trades', row: 2, column: 'source_month', code: 'IMPOSSIBLE_DATE', raw: '0206-03-01' });
    expect(r.warnings.impossibleDates).toBe(1);
    expect(r.ok).toBe(true);
  });

  it('flags emails and web addresses without echoing them', () => {
    let s = withCell(fakeWorkbookSheets(), 'trades', 'notes', 'mail someone@example.com');
    s = withCell(s, 'trades', 'product_text', 'see www.example.com', 2);
    const r = readImportWorkbook(s);
    expect(r.warnings.emailOrUrlCells).toBe(2);
    expect(JSON.stringify(r.issues)).not.toContain('example.com');
  });

  it('reports bad numbers, integers and booleans as issues', () => {
    let s = withCell(fakeWorkbookSheets(), 'trades', 'qty', 'abc');
    s = withCell(s, 'trades', 'occurrence', 1.5);
    s = withCell(s, 'trades', 'hedged_order', 'maybe');
    const r = readImportWorkbook(s);
    expect(r.issues.map((i) => i.code).sort()).toEqual(['BAD_BOOLEAN', 'BAD_INTEGER', 'BAD_NUMBER']);
  });

  it('rejects unknown and missing columns and a wrong schema version with clear messages', () => {
    const s = fakeWorkbookSheets();
    const trades = s.trades!.map((r) => r.slice(1));
    trades[0] = [...trades[0]!, 'surprise'];
    const r = readImportWorkbook({ ...s, trades, meta: [['key', 'value'], ['schema_version', '1.0']] });
    expect(r.ok).toBe(false);
    expect(r.schemaErrors).toEqual(
      expect.arrayContaining([expect.stringContaining('missing column(s) id'), expect.stringContaining('unknown column(s) surprise'), expect.stringContaining('"1.0"')]),
    );
  });

  it('reports a missing sheet', () => {
    const { links: _links, ...rest } = fakeWorkbookSheets();
    expect(readImportWorkbook(rest).schemaErrors).toContain('Missing sheet "links".');
  });

  it('drops link rows with an unknown type or confidence and says so', () => {
    const s = withCell(fakeWorkbookSheets(), 'links', 'confidence', 'MAYBE');
    const r = readImportWorkbook(s);
    expect(r.counts.links).toBe(2);
    expect(r.droppedRows.links).toBe(1);
    expect(r.issueTotals['links.BAD_VALUE']).toBe(1);
  });

  it('skips fully empty rows', () => {
    const s = fakeWorkbookSheets();
    const r = readImportWorkbook({ ...s, vendors: [...s.vendors!, ['', null, undefined, '', '', '']] });
    expect(r.counts.vendors).toBe(3);
  });
});

describe('unredactTables', () => {
  it('adds names to customers and vendors, restores names in free text, and keeps other code columns as codes', () => {
    let s = fakeWorkbookSheets();
    s = withCell(s, 'trades', 'client_code', 'C000002');
    s = withCell(s, 'trades', 'notes', 'paid by C000001 and C000009');
    s = withCell(s, 'trades', 'paid_by', 'STONEX 12345', 2);
    s = withCell(s, 'customers', 'id', 'C000003');
    const read = readImportWorkbook(s);
    const out = unredactTables({ trades: read.tables.trades, customers: read.tables.customers }, fakeRedactionMap());
    expect(out.tables.customers![0]).toMatchObject({ id: 'C000003', name: 'Fake Cedar Jewellers' });
    expect(out.tables.trades![0]!.client_code).toBe('C000002');
    expect(out.tables.trades![0]!.notes).toBe('paid by Fake Alder Trading and C000009');
    expect(out.tables.trades![1]!.paid_by).toBe('STONEX 12345');
    expect(out.unmappedCodes).toEqual(['C000009']);
    expect(read.tables.trades[0]!.notes).toBe('paid by C000001 and C000009');
  });

  it('lets a supplier-style id name itself and reports no unmapped code', () => {
    const s = withCell(fakeWorkbookSheets(), 'customers', 'id', 'COININVEST');
    const out = unredactTables({ customers: readImportWorkbook(s).tables.customers }, fakeRedactionMap());
    expect(out.tables.customers![0]).toMatchObject({ id: 'COININVEST', name: 'COININVEST' });
    expect(out.unmappedCodes).toEqual([]);
  });

  it('reports a code column value the map does not know', () => {
    const s = withCell(fakeWorkbookSheets(), 'trades', 'client_code', 'C000099');
    const out = unredactTables({ trades: readImportWorkbook(s).tables.trades }, fakeRedactionMap());
    expect(out.unmappedCodes).toEqual(['C000099']);
  });
});
