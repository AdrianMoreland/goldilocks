import { MetalType, Product, MarketDataResponse } from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { ProductsProvider } from '../products/products.provider';
export declare class MarketDataService {
    private readonly metalsProvider;
    private readonly productsProvider;
    private readonly logger;
    constructor(metalsProvider: MetalsProvider, productsProvider: ProductsProvider);
    getMarketData(): Promise<MarketDataResponse>;
    recalculate(overrides: Partial<Record<MetalType, number>>): Promise<Product[]>;
    refresh(): Promise<MarketDataResponse>;
    private composeMarketData;
    private getSnapshotTimestamp;
    private toSpotMap;
    fetchHistoricClose(date: string): Promise<void>;
    seedHistoricPrices(): Promise<void>;
}
//# sourceMappingURL=market-data.service.d.ts.map