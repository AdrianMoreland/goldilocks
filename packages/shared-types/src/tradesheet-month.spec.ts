import { describe, expect, it } from 'vitest';
import { guessSheetMonthFromTabs } from './tradesheet-import';

const now = new Date('2026-11-05T10:00:00Z');
const sales = (...dates: (string | Date | null)[]) => ({
  headers: ['Branch', 'Client', 'Date', 'Reference'] as (string | null)[],
  rows: dates.map((d) => ({ cells: ['DU', 'C000001', d, 'DU-G1'] as never })),
});

describe('guessSheetMonthFromTabs', () => {
  it('reads a master file that runs January to August as August', () => {
    const tab = sales('2026-01-14', '2026-03-02', '2026-08-29', '2026-05-11');
    expect(guessSheetMonthFromTabs([tab], now)).toBe('2026-08');
  });

  it('takes the newest date across tabs, sales and purchases', () => {
    const purchases = {
      headers: ['Client', 'Received', 'Price Paid', 'Reference'] as (string | null)[],
      rows: [{ cells: ['C000002', '2026-09-03', 100, 'DU-GP1'] as never }],
    };
    expect(guessSheetMonthFromTabs([sales('2026-07-01'), purchases], now)).toBe('2026-09');
  });

  it('reads real dates and day-first text', () => {
    expect(guessSheetMonthFromTabs([sales(new Date(Date.UTC(2026, 9, 20)))], now)).toBe('2026-10');
    expect(guessSheetMonthFromTabs([sales('14/10/2026')], now)).toBe('2026-10');
  });

  it('is not fooled by a typo year or a date far in the future', () => {
    expect(guessSheetMonthFromTabs([sales('2026-06-01', '0206-03-01', '2099-01-01', '2026-02-02')], now)).toBe('2026-06');
  });

  it('says nothing when there is no usable date', () => {
    expect(guessSheetMonthFromTabs([sales(null, '', 'soon')], now)).toBeNull();
    expect(guessSheetMonthFromTabs([{ headers: ['Notes'], rows: [{ cells: ['2026-01-01'] as never }] }], now)).toBeNull();
  });
});
