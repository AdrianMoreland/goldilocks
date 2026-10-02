import { SPOT_STALE_AFTER_MS } from '@goldilocks/shared-types';
import type { QuotedSpot } from '../../market-data/market-data.service';
export { SPOT_STALE_AFTER_MS };
export interface SpotDescription {
    metal: string;
    available: boolean;
    eurPerTroyOunce: number;
    source: 'live' | 'manual';
    asOfIrishTime: string | null;
    ageMinutes: number | null;
    mayBeOutOfDate: boolean;
}
export declare function describeSpot(spot: QuotedSpot, now: Date): SpotDescription;
//# sourceMappingURL=spot-description.d.ts.map