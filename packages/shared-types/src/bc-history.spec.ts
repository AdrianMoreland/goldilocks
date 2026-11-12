import { describe, expect, it } from 'vitest';
import {
  BcHistoryRequestSchema,
  bcDate,
  bcEventKind,
  detectBcHistoryKind,
  itemStatusAfter,
  mapBcHistory,
  parsePastedTable,
  serialKey,
} from './bc-history';

const names = new Map([['con mcnamee', 'C000101'], ['alan gale', 'C000202']]);

describe('bcDate', () => {
  it('reads the M/D/YYYY text BC copies out', () => {
    expect(bcDate('10/30/2026')).toBe('2026-10-30');
    expect(bcDate('9/1/2026')).toBe('2026-09-01');
  });
  it('reads a first part above 12 as the day', () => {
    expect(bcDate('30/10/2026')).toBe('2026-10-30');
  });
  it('reads Date objects, ISO text and Excel serials', () => {
    expect(bcDate(new Date('2026-11-04T00:00:00Z'))).toBe('2026-11-04');
    expect(bcDate('2026-11-04 00:00:00')).toBe('2026-11-04');
    expect(bcDate(46330)).toBe('2026-11-04');
  });
  it('gives null for empty or unreadable cells', () => {
    expect(bcDate('')).toBeNull();
    expect(bcDate('soon')).toBeNull();
    expect(bcDate('13/13/2026')).toBeNull();
  });
});

describe('detectBcHistoryKind', () => {
  it('tells the four lists apart', () => {
    expect(detectBcHistoryKind(['Posting Date', 'Entry Type', 'Document No.', 'Item No.', 'Entry No.'])).toBe('ledger');
    expect(detectBcHistoryKind(['No.', 'Buy-from Vendor No.', 'Buy-from Vendor Name'])).toBe('receipts');
    expect(detectBcHistoryKind(['Document No.', 'Sell-to Customer No.', 'No.', 'Quantity'])).toBe('shipment_lines');
    expect(detectBcHistoryKind(['No.', 'Sell-to Customer No.', 'Sell-to Customer Name'])).toBe('shipments');
  });
  it('does not take the awaiting-collection report for shipments', () => {
    expect(detectBcHistoryKind(['No.', 'Sell-to Customer No.', 'Amount Prepaid'])).toBeNull();
  });
});

describe('bcEventKind', () => {
  it('reads receipts, shipments and returns', () => {
    expect(bcEventKind('Purchase', 'Purchase Receipt', 'GRN-100108', 1)).toBe('RECEIVED');
    expect(bcEventKind('Purchase', 'Purchase Credit Memo', 'PPCR-1', -1)).toBe('RETURNED_TO_VENDOR');
    expect(bcEventKind('Sale', 'Sales Shipment', 'SHP-100149', -1)).toBe('COLLECTED');
    expect(bcEventKind('Sale', 'Sales Credit Memo', 'PSCR-1', 1)).toBe('RETURNED_BY_CUSTOMER');
  });
  it('reads opening balances, adjustments and transfers', () => {
    expect(bcEventKind('Positive Adjmt.', ' ', 'OPEN-DU', 1)).toBe('OPENING_BALANCE');
    expect(bcEventKind('Positive Adjmt.', ' ', 'IJL-0001', 1)).toBe('ADJUSTED_IN');
    expect(bcEventKind('Negative Adjmt.', ' ', 'IJL-0002', -1)).toBe('ADJUSTED_OUT');
    expect(bcEventKind('Transfer', 'Transfer Receipt', 'TRC-1', 1)).toBe('TRANSFERRED');
  });
  it('ignores entry types that say nothing about a bar', () => {
    expect(bcEventKind('Output', null, 'X', 1)).toBeNull();
  });
});

describe('itemStatusAfter', () => {
  it('follows the last event', () => {
    expect(itemStatusAfter('RECEIVED')).toBe('IN_STOCK');
    expect(itemStatusAfter('COLLECTED')).toBe('COLLECTED');
    expect(itemStatusAfter('RETURNED_TO_VENDOR')).toBe('GONE');
    expect(itemStatusAfter('RETURNED_BY_CUSTOMER')).toBe('IN_STOCK');
  });
});

describe('serialKey', () => {
  it('folds case and punctuation', () => {
    expect(serialKey(' a020-927 ')).toBe('A020927');
    expect(serialKey(1334834)).toBe('1334834');
  });
});

describe('mapBcHistory', () => {
  it('maps a pasted shipments list and swaps names for codes', () => {
    const sheet = parsePastedTable(
      'Document Date\tPosting Date\tNo.\tSell-to Customer No.\tSell-to Customer Name\tCurrency Code\tLocation Code\tExternal Document No.\tNo. Printed\n' +
        '10/29/2026\t10/29/2026\tSHP-100149\tPRV02393\tCon McNamee\t\t\t\t0\n' +
        '9/1/2026\t10/25/2026\tSHP-100040\tPRV09999\tSomeone Unknown\t\t\tINV-009179\t4\n',
    );
    const m = mapBcHistory(sheet, names);
    expect(m.kind).toBe('shipments');
    expect(m.shipments).toEqual([
      { no: 'SHP-100149', customerNo: 'PRV02393', customerCode: 'C000101', documentDate: '2026-10-29', postingDate: '2026-10-29', externalDocNo: null, locationCode: null },
      { no: 'SHP-100040', customerNo: 'PRV09999', customerCode: null, documentDate: '2026-09-01', postingDate: '2026-10-25', externalDocNo: 'INV-009179', locationCode: null },
    ]);
    expect(m.unmappedNames).toBe(1);
    expect(JSON.stringify(m)).not.toContain('McNamee');
  });

  it('numbers shipment lines within their shipment', () => {
    const m = mapBcHistory(
      [
        ['Document No.', 'Sell-to Customer No.', 'No.', 'Description', 'Location Code', 'Quantity'],
        ['SHP-1', 'PRV1', '1101', 'Argor-Heraeus 1oz bar', 'DU', 2],
        ['SHP-1', 'PRV1', '2102', '1oz Gold Britannia', 'DU', '1'],
        ['SHP-2', 'PRV2', '1101', 'Argor-Heraeus 1oz bar', '', 1],
      ],
      names,
    );
    expect(m.shipmentLines.map((l) => [l.documentNo, l.lineNo, l.quantity])).toEqual([
      ['SHP-1', 1, 2],
      ['SHP-1', 2, 1],
      ['SHP-2', 1, 1],
    ]);
  });

  it('looks up private sellers only on receipts', () => {
    const m = mapBcHistory(
      [
        ['No.', 'Buy-from Vendor No.', 'Buy-from Vendor Name', 'Location Code', 'Document Date'],
        ['GRN-100108', 'PRV00001', 'Alan Gale', '', '10/29/2026'],
        ['GRN-100146', 'COI001', 'CoinInvest - StoneX', '', '11/5/2026'],
      ],
      names,
    );
    expect(m.receipts.map((r) => [r.no, r.sellerCode])).toEqual([
      ['GRN-100108', 'C000202'],
      ['GRN-100146', null],
    ]);
    expect(m.unmappedNames).toBe(0);
  });

  it('maps ledger entries and skips rows without an entry number', () => {
    const m = mapBcHistory(
      [
        ['Posting Date', 'Entry Type', 'Document Type', 'Document No.', 'Item No.', 'Location Code', 'Quantity', 'Remaining Quantity', 'Sales Amount (Actual)', 'Cost Amount (Actual)', 'Open', 'Entry No.'],
        [new Date('2026-10-29T00:00:00Z'), 'Sale', 'Sales Shipment', 'SHP-100149', '1101', 'DU', -1, 0, 3905, -3529, 0, 2470],
        ['10/29/2026', 'Purchase', 'Purchase Receipt', 'GRN-100108', '1101', 'DU', '25', '24', '0', '87,534.52', '1', ''],
      ],
      names,
    );
    expect(m.ledger).toEqual([
      { entryNo: 2470, postingDate: '2026-10-29', entryType: 'Sale', documentType: 'Sales Shipment', documentNo: 'SHP-100149', itemNo: '1101', locationCode: 'DU', quantity: -1, remainingQuantity: 0, salesAmount: 3905, costAmount: -3529, open: false },
    ]);
    expect(m.skipped).toBe(1);
  });

  it('produces rows the request schema accepts', () => {
    const m = mapBcHistory(parsePastedTable('No.\tSell-to Customer No.\tSell-to Customer Name\nSHP-1\tPRV1\tCon McNamee'), names);
    expect(BcHistoryRequestSchema.safeParse({ fileNames: ['paste'], shipments: m.shipments }).success).toBe(true);
  });

  it('returns nothing for an unknown list', () => {
    expect(mapBcHistory([['a', 'b'], ['1', '2']], names).kind).toBeNull();
  });
});
