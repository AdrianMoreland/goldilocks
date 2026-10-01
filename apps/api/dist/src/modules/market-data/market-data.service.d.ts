import { MetalType, Product, MarketDataResponse } from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { HistoricSpotService } from '../metals/historic-spot.service';
import { ProductsProvider } from '../products/products.provider';
export interface QuotedSpot {
    metalType: MetalType;
    usedEur: number;
    liveEur: number;
    overridden: boolean;
    timestamp: string | null;
    isFallback: boolean;
}
export interface PricedCatalogue {
    products: Product[];
    spots: QuotedSpot[];
    degradedMetals: MetalType[];
}
export declare class MarketDataService {
    private readonly metalsProvider;
    private readonly historicSpots;
    private readonly productsProvider;
    private readonly logger;
    constructor(metalsProvider: MetalsProvider, historicSpots: HistoricSpotService, productsProvider: ProductsProvider);
    getMarketData(): Promise<MarketDataResponse>;
    recalculate(overrides: Partial<Record<MetalType, number>>): Promise<Product[]>;
    getPricedCatalogue(overrides?: Partial<Record<MetalType, number>>): Promise<PricedCatalogue>;
    refresh(): Promise<MarketDataResponse>;
    private composeMarketData;
    private getSnapshotTimestamp;
    private toSpotMap;
    fetchHistoricClose(date: string): Promise<void>;
    backfillHistory(years: number): Promise<import("../metals/historic-spot.service").BackfillWindowReport[]>;
    seedHistoricPrices(): Promise<void>;
}
//# sourceMappingURL=market-data.service.d.ts.map