/**
 * Which metal the rows that carry a product name point to, from their prices against that day's spot. Pure: the
 * caller loads the rows and the spot table (all in one currency; the sheets and Zoho are in euro) and passes them in.
 */
import type { MatchMetal } from './product-match';

const GRAMS_PER_OZ = 31.1034768;
const METALS: readonly MatchMetal[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];

/** A unit price fits a metal when it is within these multiples of that day's spot per fine ounce (silver coins carry a bigger premium). */
export const FIT_LOW = 0.8;
export const FIT_HIGH = 1.3;
export const FIT_HIGH_SILVER = 1.6;

export type SpotRow = Partial<Record<MatchMetal, number>>;

export interface PriceRow {
  /** YYYY-MM-DD */
  date: string | null;
  /** Price of one item (not the line total). */
  unitPrice: number | null;
}

/** The metals whose spot a price per ounce is close to. */
export function metalsFitting(perOz: number, spot: SpotRow): MatchMetal[] {
  return METALS.filter((m) => {
    const s = spot[m];
    if (!s || s <= 0) return false;
    return perOz >= s * FIT_LOW && perOz <= s * (m === 'SILVER' ? FIT_HIGH_SILVER : FIT_HIGH);
  });
}

/**
 * The metal every priced row agrees on. A row votes only when exactly one metal fits its price per fine ounce; a row
 * that fits none or several abstains. Returns null when nobody votes, when the votes disagree, or when fewer than
 * half the priced rows voted.
 */
export function priceMetalEvidence(
  rows: readonly PriceRow[],
  grams: number | null,
  spotOn: (date: string) => SpotRow | undefined,
): { metal: MatchMetal; rows: number } | null {
  if (!grams || grams <= 0) return null;
  const ounces = grams / GRAMS_PER_OZ;
  const votes = new Map<MatchMetal, number>();
  let priced = 0;
  for (const r of rows) {
    if (!r.date || !r.unitPrice || r.unitPrice <= 0) continue;
    const spot = spotOn(r.date);
    if (!spot) continue;
    priced++;
    const fits = metalsFitting(r.unitPrice / ounces, spot);
    if (fits.length === 1) votes.set(fits[0]!, (votes.get(fits[0]!) ?? 0) + 1);
  }
  if (votes.size !== 1) return null;
  const [metal, n] = [...votes.entries()][0]!;
  if (n * 2 < priced) return null;
  return { metal, rows: n };
}

/**
 * Spot lookup by day from a list of (metal, day, price) rows: the price on that day, else the latest one before it
 * within a week (weekends, holidays). One lookup built once for a whole scan.
 */
export function spotLookup(rows: readonly { metal: MatchMetal; date: string; price: number }[]): (date: string) => SpotRow | undefined {
  const byMetal = new Map<MatchMetal, { date: string; price: number }[]>();
  for (const r of rows) {
    const list = byMetal.get(r.metal) ?? [];
    list.push({ date: r.date, price: r.price });
    byMetal.set(r.metal, list);
  }
  for (const list of byMetal.values()) list.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const WEEK_MS = 7 * 86_400_000;
  const cache = new Map<string, SpotRow | undefined>();
  return (date) => {
    if (cache.has(date)) return cache.get(date);
    const out: SpotRow = {};
    const t = Date.parse(date);
    for (const [metal, list] of byMetal) {
      let lo = 0;
      let hi = list.length - 1;
      let at = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (list[mid]!.date <= date) {
          at = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      if (at >= 0 && t - Date.parse(list[at]!.date) <= WEEK_MS) out[metal] = list[at]!.price;
    }
    const res = Object.keys(out).length ? out : undefined;
    cache.set(date, res);
    return res;
  };
}
