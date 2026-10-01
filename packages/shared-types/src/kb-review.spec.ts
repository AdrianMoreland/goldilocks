import { describe, expect, it } from 'vitest';
import { kbReviewDueOn, kbReviewStatus } from './kb-review';

const at = (day: string) => new Date(`${day}T15:30:00.000Z`);

describe('kbReviewDueOn', () => {
  it.each([
    ['2026-09-30', '2027-03-30'],
    ['2026-01-15', '2026-07-15'],
    ['2026-08-31', '2027-02-28'], // clamped, not rolled into March
    ['2027-08-31', '2028-02-29'], // leap year
    ['2026-07-31', '2027-01-31'],
  ])('%s -> %s', (from, due) => {
    expect(kbReviewDueOn(from)).toBe(due);
  });
});

describe('kbReviewStatus', () => {
  it('is ok well before the due date', () => {
    expect(kbReviewStatus('2026-09-30', at('2026-10-01'))).toMatchObject({ state: 'ok', dueOn: '2027-03-30' });
  });

  it('turns due-soon inside the 30-day warning window, inclusive', () => {
    expect(kbReviewStatus('2026-09-30', at('2027-02-28')).state).toBe('due-soon'); // 30 days left
    expect(kbReviewStatus('2026-09-30', at('2027-02-27')).state).toBe('ok'); // 31 days left
    expect(kbReviewStatus('2026-09-30', at('2027-03-30')).state).toBe('due-soon'); // due today
  });

  it('is overdue the day after it was due, with negative days', () => {
    const status = kbReviewStatus('2026-09-30', at('2027-04-02'));
    expect(status.state).toBe('overdue');
    expect(status.daysUntilDue).toBe(-3);
  });

  it('ignores the time of day', () => {
    expect(kbReviewStatus('2026-09-30', new Date('2027-03-30T23:59:59Z')).daysUntilDue).toBe(0);
  });
});
