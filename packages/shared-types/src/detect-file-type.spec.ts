import { describe, expect, it } from 'vitest';
import { detectFileType, detectTabType } from './detect-file-type';
import { fakeWorkbookSheets } from './import-workbook.fixture';

describe('detectTabType', () => {
  it('recognises tradesheet sales and purchase tabs', () => {
    expect(detectTabType('IE - Gold', ['Client', 'Qty', 'Product', 'CPTY', 'Reference'])).toBe('trade_sales');
    expect(detectTabType('IE-GP', ['Client', 'Price Paid', 'Received'])).toBe('trade_purchases');
  });
  it('ignores Spain tabs', () => {
    expect(detectTabType('ES - Gold', ['Client', 'CPTY', 'Reference'])).toBe('');
  });
  it('recognises the BC awaiting-collection report', () => {
    expect(detectTabType('Sheet1', ['External Document No.', 'Amount Prepaid', 'Remaining'])).toBe('bc_orders');
  });
  it('recognises Zoho invoices and tolerates trailing colons and case', () => {
    expect(detectTabType('inv', ['Invoice Number:', 'Item Desc', 'INVOICE STATUS'])).toBe('zoho_invoices');
  });
  it('returns empty for unknown headers', () => {
    expect(detectTabType('Other', ['a', 'b'])).toBe('');
  });
});

describe('detectFileType', () => {
  it('detects the assembled workbook from its tabs', () => {
    const tabs = Object.entries(fakeWorkbookSheets()).map(([name, rows]) => ({ name, headers: rows[0]! }));
    expect(detectFileType(tabs).kind).toBe('import_workbook');
  });
  it('detects the private map', () => {
    expect(detectFileType([{ name: 'map', headers: ['code', 'key', 'original', 'type'] }]).kind).toBe('redaction_map');
  });
  it('detects a BC awaiting-collection report on its own', () => {
    expect(detectFileType([{ name: 'Report', headers: ['External Document No.', 'Amount Prepaid'] }]).kind).toBe('bc_awaiting_collection');
  });
  it('calls different kinds mixed and nothing unknown', () => {
    expect(
      detectFileType([
        { name: 'IE - Gold', headers: ['Client', 'CPTY', 'Reference'] },
        { name: 'Report', headers: ['External Document No.', 'Amount Prepaid'] },
      ]).kind,
    ).toBe('mixed');
    expect(detectFileType([{ name: 'x', headers: ['a'] }]).kind).toBe('unknown');
  });
});
