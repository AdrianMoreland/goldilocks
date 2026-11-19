// ============================================================================
// SPOT FRESHNESS - how far to trust the spot prices on screen. Pure, no I/O.
//
// Two times describe a spot price:
//   - snapshotAt: when the market price was struck (the vendor's own time).
//     The vendor plan delays prices by about 10 minutes, so this is always
//     at least that old. It is what staff read as "Prices as of".
//   - lastFetchAt: when we last received it from the vendor. The colour
//     follows this one, because it says whether the feed is keeping up.
// ============================================================================

/** How often the price cron calls the vendor while it is running. */
export const SPOT_FETCH_INTERVAL_MS = 5 * 60 * 1000;

/** Fresh (green) for one fetch cycle plus a minute of grace; after that a fetch was missed. */
export const SPOT_LATE_AFTER_MS = SPOT_FETCH_INTERVAL_MS + 60 * 1000;

/** Stale (red) this long after the last fetch: staff should type a spot or refresh before quoting. */
export const SPOT_RED_AFTER_MS = 25 * 60 * 1000;

/** A closing price older than this cannot belong to the current weekend (Fri 22:00 to Sun 23:00 is 49 h). */
const MAX_WEEKEND_GAP_MS = 50 * 60 * 60 * 1000;

/**
 * fresh: the feed is keeping up. late: a fetch was missed (amber).
 * stale: no fetch for 25 minutes or more (red). closed: the market is shut and
 * this is its closing price. unknown: no price yet.
 */
export type SpotFreshnessState = 'fresh' | 'late' | 'stale' | 'closed' | 'unknown';

export interface SpotFreshness {
  state: SpotFreshnessState;
  /** Age of the market price itself (now - snapshotAt). */
  priceAgeMs: number | null;
  /** Time since we last received a price (now - lastFetchAt, or the price age if unknown). */
  fetchAgeMs: number | null;
}

const LONDON_PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  hour: '2-digit',
  hourCycle: 'h23',
});

/**
 * Spot metals stop trading from Friday 22:00 to Sunday 23:00, London time
 * (summer time included). Bank holidays are not covered.
 */
export function isSpotMarketClosed(at: Date): boolean {
  const parts = LONDON_PARTS.formatToParts(at);
  const weekday = parts.find((p) => p.type === 'weekday')?.value;
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);

  if (weekday === 'Sat') return true;
  if (weekday === 'Fri') return hour >= 22;
  if (weekday === 'Sun') return hour < 23;
  return false;
}

function ageMs(iso: string | null | undefined, now: Date): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  return Number.isFinite(ms) ? Math.max(0, now.getTime() - ms) : null;
}

export function spotFreshness(input: {
  snapshotAt: string | null | undefined;
  lastFetchAt: string | null | undefined;
  now: Date;
}): SpotFreshness {
  const { snapshotAt, now } = input;
  const priceAgeMs = ageMs(snapshotAt, now);
  if (priceAgeMs === null || !snapshotAt) {
    return { state: 'unknown', priceAgeMs: null, fetchAgeMs: null };
  }
  const fetchAgeMs = ageMs(input.lastFetchAt, now) ?? priceAgeMs;

  if (fetchAgeMs <= SPOT_LATE_AFTER_MS) return { state: 'fresh', priceAgeMs, fetchAgeMs };

  // The price was struck in the last trading minutes before this weekend's close.
  const isClosingPrice =
    isSpotMarketClosed(now) &&
    priceAgeMs < MAX_WEEKEND_GAP_MS &&
    isSpotMarketClosed(new Date(new Date(snapshotAt).getTime() + SPOT_RED_AFTER_MS));
  if (isClosingPrice) return { state: 'closed', priceAgeMs, fetchAgeMs };

  return { state: fetchAgeMs >= SPOT_RED_AFTER_MS ? 'stale' : 'late', priceAgeMs, fetchAgeMs };
}
