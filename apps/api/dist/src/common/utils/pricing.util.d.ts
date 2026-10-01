import { MetalType, Product, SpotPrice, HistoricSpot, RawProduct, RawSpotPrice } from '@goldilocks/shared-types';
import { Decimal } from '../../../prisma/generated/internal/prismaNamespace';
import { Product as PrismaProduct } from '../../../prisma/generated/client';
import { MetalSpotPrice as PrismaSpotPrice } from '../../../prisma/generated/client';
export declare function toNumber(value: Decimal | number | undefined | null): number;
export declare function toRawMetalSpotPrice(record: PrismaSpotPrice): RawSpotPrice;
export declare function toRawProduct(product: PrismaProduct): RawProduct;
export declare function calculateProductPrice(product: RawProduct, spotMap: Record<MetalType, number>): Product;
export declare function mergeMetalPrices(base: Record<MetalType, number>, overrides: Partial<Record<MetalType, number>>): Record<MetalType, number>;
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