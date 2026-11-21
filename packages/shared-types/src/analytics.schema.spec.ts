import { describe, expect, it } from 'vitest';
import { resolveAnalyticsPeriod } from './analytics.schema';

describe('resolveAnalyticsPeriod', () => {
  it('90 days ending today, and the 90 days before', () => {
    expect(resolveAnalyticsPeriod('90d', '2026-11-21')).toEqual({
      preset: '90d',
      current: { from: '2026-08-24', to: '2026-11-21' },
      previous: { from: '2026-05-26', to: '2026-08-23' },
    });
  });

  it('30 days', () => {
    const p = resolveAnalyticsPeriod('30d', '2026-03-01');
    expect(p.current).toEqual({ from: '2026-01-31', to: '2026-03-01' });
    expect(p.previous).toEqual({ from: '2026-01-01', to: '2026-01-30' });
  });

  it('year to date compares with the same number of days before 1 January', () => {
    const p = resolveAnalyticsPeriod('ytd', '2026-01-10');
    expect(p.current).toEqual({ from: '2026-01-01', to: '2026-01-10' });
    expect(p.previous).toEqual({ from: '2025-12-22', to: '2025-12-31' });
  });

  it('12 months', () => {
    const p = resolveAnalyticsPeriod('12m', '2026-11-21');
    expect(p.current).toEqual({ from: '2025-11-22', to: '2026-11-21' });
    expect(p.previous).toEqual({ from: '2024-11-22', to: '2025-11-21' });
  });

  it('12 months from 29 February starts on 1 March a year earlier', () => {
    expect(resolveAnalyticsPeriod('12m', '2028-02-29').current).toEqual({ from: '2027-03-01', to: '2028-02-29' });
  });
});
