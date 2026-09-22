import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawSpotPrice, FetchTrigger, HistoricSpot, MetalType } from '@goldilocks/shared-types';
import { type MetalPriceApiPort } from '../../infrastructure/metal-price-api/metal-price-api.port';
import { SpotPriceCacheStore } from './spot-price-cache.store';
import { CascadeMetricsService } from './cascade-metrics.service';
import { FetchAttemptService } from './fetch-attempt.service';
export interface MetalsRefreshResult {
    prices: RawSpotPrice[];
    degradedMetals: MetalType[];
}
export declare class MetalsProvider {
    private readonly prisma;
    private readonly metalPriceApi;
    private readonly spotCache;
    private readonly cascadeMetrics;
    private readonly fetchAttempts;
    private readonly logger;
    constructor(prisma: PrismaService, metalPriceApi: MetalPriceApiPort, spotCache: SpotPriceCacheStore, cascadeMetrics: CascadeMetricsService, fetchAttempts: FetchAttemptService);
    getLatest(metal: MetalType): Promise<RawSpotPrice | null>;
    clearCache(): Promise<void>;
    getAllLatest(): Promise<RawSpotPrice[]>;
    getHistoricSpots(): Promise<HistoricSpot[]>;
    getAllLatestForLaunch(): Promise<MetalsRefreshResult>;
    refreshAll(triggeredBy?: FetchTrigger): Promise<MetalsRefreshResult>;
    retryMetal(metal: MetalType): Promise<RawSpotPrice | null>;
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