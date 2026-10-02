import { SPOT_STALE_AFTER_MS } from '@goldilocks/shared-types';
import type { QuotedSpot } from '../../market-data/market-data.service';

export { SPOT_STALE_AFTER_MS };

export interface SpotDescription {
    metal: string;
    /** False when there is no usable price: do not quote anything for this metal. */
    available: boolean;
    eurPerTroyOunce: number;
    /** "live" is the market spot; "manual" is a spot the staff member froze or typed on the dashboard. */
    source: 'live' | 'manual';
    /** When the live spot was taken, in Irish time, e.g. "01 Oct, 10:00". Null when unavailable. */
    asOfIrishTime: string | null;
    ageMinutes: number | null;
    /** True when the price may be out of date (a missed refresh, or the live feed failed and this is the last stored price). */
    mayBeOutOfDate: boolean;
}

function irishTime(iso: string): string {
    return new Date(iso).toLocaleString('en-IE', {
        timeZone: 'Europe/Dublin',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

/** The spot behind a quoted price, in the terms the assistant must report it: the figure, where it came from, when, and whether to trust it. */
export function describeSpot(spot: QuotedSpot, now: Date): SpotDescription {
    const available = spot.usedEur > 0;
    const ageMs =
        spot.timestamp === null
            ? null
            : now.getTime() - new Date(spot.timestamp).getTime();

    return {
        metal: spot.metalType,
        available,
        eurPerTroyOunce: spot.usedEur,
        source: spot.overridden ? 'manual' : 'live',
        asOfIrishTime: spot.timestamp ? irishTime(spot.timestamp) : null,
        ageMinutes:
            ageMs === null ? null : Math.max(0, Math.round(ageMs / 60_000)),
        // A manual spot is the staff member's own number, so staleness of the live feed behind it is beside the point.
        mayBeOutOfDate:
            !spot.overridden &&
            (spot.isFallback || ageMs === null || ageMs > SPOT_STALE_AFTER_MS),
    };
}
