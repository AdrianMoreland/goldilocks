import { describe, expect, it } from 'vitest';
import { isSpotMarketClosed, spotFreshness } from './spot-freshness';

// November dates: London is on UTC, so the literals below read as London time.
// 2026-11-20 is a Friday, 2026-11-22 a Sunday.
const at = (iso: string) => new Date(iso);

describe('isSpotMarketClosed (Fri 22:00 to Sun 23:00, London time)', () => {
  it.each([
    ['2026-11-20T21:59:00Z', false], // Friday, a minute before the close
    ['2026-11-20T22:00:00Z', true], // Friday close
    ['2026-11-21T12:00:00Z', true], // Saturday
    ['2026-11-22T22:59:00Z', true], // Sunday, before the open
    ['2026-11-22T23:00:00Z', false], // Sunday open
    ['2026-11-18T03:00:00Z', false], // a Wednesday night
  ])('%s -> %s', (iso, closed) => {
    expect(isSpotMarketClosed(at(iso))).toBe(closed);
  });

  it('follows British Summer Time: Friday 21:30 UTC in July is 22:30 in London', () => {
    expect(isSpotMarketClosed(at('2026-07-17T21:30:00Z'))).toBe(true);
    expect(isSpotMarketClosed(at('2026-07-17T20:59:00Z'))).toBe(false);
  });
});

describe('spotFreshness', () => {
  const now = at('2026-11-18T12:00:00Z'); // Wednesday, market open

  it('is fresh up to one 5-minute cycle plus a minute of grace after the last fetch', () => {
    const result = spotFreshness({
      snapshotAt: '2026-11-18T11:44:00Z',
      lastFetchAt: '2026-11-18T11:54:00Z',
      now,
    });
    expect(result).toEqual({ state: 'fresh', priceAgeMs: 16 * 60_000, fetchAgeMs: 6 * 60_000 });
  });

  it('is late (amber) once a fetch has been missed', () => {
    const result = spotFreshness({
      snapshotAt: '2026-11-18T11:43:00Z',
      lastFetchAt: '2026-11-18T11:53:59Z',
      now,
    });
    expect(result.state).toBe('late');
  });

  it('is stale (red) 25 minutes after the last fetch', () => {
    expect(
      spotFreshness({ snapshotAt: '2026-11-18T11:25:00Z', lastFetchAt: '2026-11-18T11:35:00Z', now }).state,
    ).toBe('stale');
    expect(
      spotFreshness({ snapshotAt: '2026-11-18T11:25:01Z', lastFetchAt: '2026-11-18T11:35:01Z', now }).state,
    ).toBe('late');
  });

  it('is unknown without a snapshot', () => {
    expect(spotFreshness({ snapshotAt: null, lastFetchAt: null, now })).toEqual({
      state: 'unknown',
      priceAgeMs: null,
      fetchAgeMs: null,
    });
  });

  it('falls back to the price time when the fetch time is missing', () => {
    const result = spotFreshness({ snapshotAt: '2026-11-18T11:58:00Z', lastFetchAt: null, now });
    expect(result).toEqual({ state: 'fresh', priceAgeMs: 2 * 60_000, fetchAgeMs: 2 * 60_000 });
  });

  describe('while the market is closed', () => {
    const saturday = at('2026-11-21T12:00:00Z');

    it('shows the Friday closing price as closed, not stale', () => {
      expect(
        spotFreshness({ snapshotAt: '2026-11-20T21:50:00Z', lastFetchAt: '2026-11-20T22:00:00Z', now: saturday }).state,
      ).toBe('closed');
    });

    it('still flags a price from well before the close as stale', () => {
      expect(
        spotFreshness({ snapshotAt: '2026-11-20T14:00:00Z', lastFetchAt: '2026-11-20T14:10:00Z', now: saturday }).state,
      ).toBe('stale');
    });

    it('still flags last week\'s closing price as stale', () => {
      expect(
        spotFreshness({ snapshotAt: '2026-11-13T21:50:00Z', lastFetchAt: '2026-11-13T22:00:00Z', now: saturday }).state,
      ).toBe('stale');
    });

    it('stays fresh when a fetch just ran', () => {
      expect(
        spotFreshness({ snapshotAt: '2026-11-21T11:50:00Z', lastFetchAt: '2026-11-21T11:58:00Z', now: saturday }).state,
      ).toBe('fresh');
    });
  });
});
