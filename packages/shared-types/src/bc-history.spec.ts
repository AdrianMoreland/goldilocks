import { describe, expect, it } from 'vitest';
import {
  BcHistoryRequestSchema,
  bcDate,
  bcEventKind,
  detectDateOrder,
  detectBcHistoryKind,
  itemStatusAfter,
  mapBcHistory,
  parsePastedTable,
  isRealSerial,
  serialKey,
} from './bc-history';

const names = new Map([['con mcnamee', 'C000101'], ['alan gale', 'C000202']]);

describe('bcDate', () => {
  it('reads slash dates in the order given, day-first by default', () => {
    expect(bcDate('9/1/2026', 'MDY')).toBe('2026-09-01');
    expect(bcDate('9/1/2026', 'DMY')).toBe('2026-01-09');
    expect(bcDate('12/10/2026')).toBe('2026-10-12');
  });
  it('reads a value that only fits the other way round that way', () => {
    expect(bcDate('10/30/2026')).toBe('2026-10-30');
    expect(bcDate('30/10/2026', 'MDY')).toBe('2026-10-30');
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

describe('detectDateOrder', () => {
  it('lets the whole list decide', () => {
    expect(detectDateOrder(['10/9/2026', '29/10/2026', '3/11/2026'])).toBe('DMY');
    expect(detectDateOrder(['9/10/2026', '10/29/2026', '11/3/2026'])).toBe('MDY');
    expect(detectDateOrder(['1/2/2026', 'x', null])).toBeNull();
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

describe('isRealSerial', () => {
  it('drops placeholders typed for bars without a serial', () => {
    expect(isRealSerial('NOBARNO12')).toBe(false);
    expect(isRealSerial('BRINKS TBC')).toBe(false);
    expect(isRealSerial('')).toBe(false);
    expect(isRealSerial('AA 174840')).toBe(true);
    expect(isRealSerial('4626')).toBe(true);
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

  it('reads a day-first paste the same as a month-first one', () => {
    const header = 'Document Date\tPosting Date\tNo.\tSell-to Customer No.\tSell-to Customer Name\n';
    const dmy = mapBcHistory(parsePastedTable(header + '10/9/2026\t10/9/2026\tSHP-1\tPRV1\tX\n29/10/2026\t29/10/2026\tSHP-2\tPRV2\tY\n'), names);
    const mdy = mapBcHistory(parsePastedTable(header + '9/10/2026\t9/10/2026\tSHP-1\tPRV1\tX\n10/29/2026\t10/29/2026\tSHP-2\tPRV2\tY\n'), names);
    expect(dmy.dateOrder).toBe('DMY');
    expect(mdy.dateOrder).toBe('MDY');
    expect(dmy.shipments.map((x) => x.postingDate)).toEqual(['2026-09-10', '2026-10-29']);
    expect(mdy.shipments.map((x) => x.postingDate)).toEqual(['2026-09-10', '2026-10-29']);
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
      { entryNo: 2470, postingDate: '2026-10-29', entryType: 'Sale', documentType: 'Sales Shipment', documentNo: 'SHP-100149', itemNo: '1101', locationCode: 'DU', quantity: -1, remainingQuantity: 0, salesAmount: 3905, costAmount: -3529, open: false, serialNo: null, sourceType: null, sourceNo: null },
    ]);
    expect(m.skipped).toBe(1);
  });

  it('reads serials and the customer or vendor from a pasted ledger', () => {
    const m = mapBcHistory(
      parsePastedTable(
        'Posting Date\tEntry Type\tDocument Type\tDocument No.\tItem No.\tLot No.\tSerial No.\tDescription\tLocation Code\tQuantity\tInvoiced Quantity\tRemaining Quantity\tSales Amount (Actual)\tCost Amount (Actual)\tCost Amount (Non-Invtbl.)\tOpen\tOrder Type\tEntry No.\tSource Type\tSource No.\tExcise Tax Posted\n' +
          '10/29/2026\tSale\tSales Shipment\tSHP-100149\t1101\t\t1334834\t\tDU\t-1\t-1\t0\t3,905.00\t-3,529.00\t0.00\tNo\t \t2227\tCustomer\tPRV02393\tNo\n' +
          '11/12/2026\tSale\tSales Shipment\tSHP-100235\t4501\t\t\t\tDU\t-1,000\t-1,000\t0\t57,000.00\t-44,840.00\t0.00\tNo\t \t2701\tCustomer\tPRV00029\tNo\n' +
          '9/7/2026\tSale\tSales Shipment\tSHP-100030\t3106\t\tNOBARNO25\t\tCO\t-1\t-1\t0\t912.44\t-920.15\t0.00\tNo\t \t1355\tCustomer\tCOI001\tNo\n' +
          '9/10/2026\tSale\tSales Shipment\tSHP-100068\t1201\t\tAA 174840\t\tDU\t-1\t-1\t0\t4,060.00\t-3,602.00\t0.00\tNo\t \t1750\tCustomer\tPRV02221\tNo\n' +
          '10/30/2026\tPositive Adjmt.\t \tIJL-100012\t1036\t\tVC275392\t\tBL\t1\t1\t1\t0.00\t5,632.39\t0.00\tYes\t \t2425\t \t\tNo\n',
      ),
      names,
    );
    expect(m.kind).toBe('ledger');
    expect(m.ledger.map((e) => [e.entryNo, e.serialNo, e.sourceType, e.sourceNo, e.quantity, e.open])).toEqual([
      [2227, '1334834', 'Customer', 'PRV02393', -1, false],
      [2701, null, 'Customer', 'PRV00029', -1000, false],
      [1355, null, 'Customer', 'COI001', -1, false],
      [1750, 'AA 174840', 'Customer', 'PRV02221', -1, false],
      [2425, 'VC275392', null, null, 1, true],
    ]);
    expect(m.ledger[0]!.salesAmount).toBe(3905);
  });

  it('produces rows the request schema accepts', () => {
    const m = mapBcHistory(parsePastedTable('No.\tSell-to Customer No.\tSell-to Customer Name\nSHP-1\tPRV1\tCon McNamee'), names);
    expect(BcHistoryRequestSchema.safeParse({ fileNames: ['paste'], shipments: m.shipments }).success).toBe(true);
  });

  it('returns nothing for an unknown list', () => {
    expect(mapBcHistory([['a', 'b'], ['1', '2']], names).kind).toBeNull();
  });
});
