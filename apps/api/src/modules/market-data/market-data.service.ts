import { Injectable, Logger } from '@nestjs/common';
import {MetalType, Product, SpotPrice} from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { ProductsProvider } from '../products/products.provider';
import { MarketDataResponse } from '@goldilocks/shared-types';
import {calculateProductPrice, ZERO_SPOT_MAP} from "../../common/utils/pricing.util";

/**
 * MarketDataService — the composition layer.
 *
 * This is the ONLY place in the codebase that knows both Metals and
 * Products exist. Products never imports Metals; Metals never imports
 * Products. This service fetches from both providers in parallel and
 * combines them with the pure calculateProductPrice() function.
 */
@Injectable()
export class MarketDataService {
    private readonly logger = new Logger(MarketDataService.name);

    constructor(
        private readonly metalsProvider: MetalsProvider,
        private readonly productsProvider: ProductsProvider,
    ) {}

    async getMarketData(): Promise<MarketDataResponse> {
        this.logger.log('Loading market data');

        const [spotPrices, historicSpot, rawProducts] = await Promise.all([
            this.metalsProvider.getAllLatest(),
            this.metalsProvider.getHistoricSpots(),
            this.productsProvider.getAll(),
        ]);

        const spotMap = this.toSpotMap(spotPrices);
        const products = rawProducts.map((p) => calculateProductPrice(p, spotMap));

        return {
            spotPrices,
            historicSpot,
            products,
            fetchedAt: new Date().toISOString(),
        };
    }

    /**
     * Manual spot-price overrides from the UI.
     *
     * These are NOT persisted to Redis/Prisma and never flow back into
     * MetalsProvider — they're a temporary "what if" view layered on top
     * of the live prices for this one response only.
     */
    async recalculate(overrides: Partial<Record<MetalType, number>>): Promise<Product[]> {
        const [spotPrices, rawProducts] = await Promise.all([
            this.metalsProvider.getAllLatest(),
            this.productsProvider.getAll(),
        ]);

        const liveMap = this.toSpotMap(spotPrices);
        const finalMap: Record<MetalType, number> = { ...liveMap, ...overrides };

        return rawProducts.map((p) => calculateProductPrice(p, finalMap));
    }

    async refresh(): Promise<MarketDataResponse> {

        await this.metalsProvider.fetchAndStore();

        return this.getMarketData();
    }

    private toSpotMap(spotPrices: SpotPrice[]): Record<MetalType, number> {
        const map: Record<MetalType, number> = { ...ZERO_SPOT_MAP };
        spotPrices.forEach((s) => {
            map[s.metalType] = s.priceEur;
        });
        return map;
    }
}