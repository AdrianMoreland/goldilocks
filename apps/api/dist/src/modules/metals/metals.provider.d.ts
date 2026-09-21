import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawSpotPrice, HistoricSpot, MetalType } from '@goldilocks/shared-types';
import { MetalPriceApiClient } from '../../infrastructure/metal-price-api/metal-price-api.client';
import { SpotPriceCacheStore } from './spot-price-cache.store';
export interface MetalsRefreshResult {
    prices: RawSpotPrice[];
    degradedMetals: MetalType[];
}
export declare class MetalsProvider {
    private readonly prisma;
    private readonly metalPriceApi;
    private readonly spotCache;
    private readonly logger;
    constructor(prisma: PrismaService, metalPriceApi: MetalPriceApiClient, spotCache: SpotPriceCacheStore);
    getLatest(metal: MetalType): Promise<RawSpotPrice | null>;
    clearCache(): Promise<void>;
    getAllLatest(): Promise<RawSpotPrice[]>;
    getHistoricSpots(): Promise<HistoricSpot[]>;
    getAllLatestForLaunch(): Promise<MetalsRefreshResult>;
    refreshAll(): Promise<MetalsRefreshResult>;
    private toDto;
    private fetchFromExternalApi;
    private fetchHistoricFromExternalApi;
    fetchAndStoreHistoricClose(date: string): Promise<void>;
    seedHistoricPrices(): Promise<void>;
    getLatestHistoricDate(): Promise<Date | null>;
    private readHistoricFromDb;
    private storeInDb;
}
//# sourceMappingURL=metals.provider.d.ts.map