import type { MetalType } from '@goldilocks/shared-types';
import { type HistoricSpotRecord } from '../../common/utils/pricing.util';
export interface MetalRate {
    eur: number;
    gbp: number;
}
export type MetalRates = Partial<Record<MetalType, MetalRate>>;
export declare function isUsableRate(rate: MetalRate | undefined): rate is MetalRate;
export declare function vendorAsOf(vendorSeconds: unknown, now?: number): Date;
export declare function mapLiveRates(rates: Record<string, number>, onMissing?: (metal: MetalType, symbol: string) => void): MetalRates;
export declare function mapTimeframeRecords(eurByDate: Record<string, Record<string, number>>, gbpByDate: Record<string, Record<string, number>>): HistoricSpotRecord[];
//# sourceMappingURL=vendor-rates.d.ts.map