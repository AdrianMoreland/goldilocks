import { MetalType, SpotPrice, HistoricSpot, RawSpotPrice } from '@goldilocks/shared-types';
export { calculateProductPrice, mergeMetalPrices, } from '@goldilocks/shared-types';
export declare const ZERO_SPOT_MAP: Record<MetalType, number>;
export declare const ALL_METALS: MetalType[];
export declare const SYMBOL_MAP: Record<MetalType, string>;
export interface HistoricSpotRecord {
    metalType: MetalType;
    priceEur: number;
    priceGbp: number;
    recordedAt: Date;
}
export declare const HISTORIC_LOOKBACK_DAYS: number;
export declare const HISTORIC_DAILY_DAYS = 365;
export declare const HISTORIC_OLD_STEP_DAYS = 7;
export declare function thinOldHistory<T extends {
    recordedAt: Date;
}>(rows: T[], now?: Date): T[];
export declare function enrichSpotPrices(spotPrices: RawSpotPrice[], historicMap: Map<MetalType, HistoricSpot>): SpotPrice[];
//# sourceMappingURL=pricing.util.d.ts.map