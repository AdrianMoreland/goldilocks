import { Injectable, Logger } from '@nestjs/common';
import {
    HistoricSpot,
    MetalType,
    Product,
    RawSpotPrice,
    MarketDataResponse,
} from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { HistoricSpotService } from '../metals/historic-spot.service';
import { ProductsProvider } from '../products/products.provider';

import {
    calculateProductPrice,
    enrichSpotPrices,
    mergeMetalPrices,
    ZERO_SPOT_MAP,
} from '../../common/utils/pricing.util';

/** One metal's spot as a price is being quoted from it right now. */
export interface QuotedSpot {
    metalType: MetalType;
    /** EUR per troy ounce actually used for pricing: the override when one is set, otherwise the live spot. */
    usedEur: number;
    liveEur: number;
    overridden: boolean;
    /** When the live spot was taken; null when there is no usable price for the metal. */
    timestamp: string | null;
    /** True when the live feed failed and this is the last stored price. */
    isFallback: boolean;
}

/** Every product priced the way the dashboard table prices it, plus the spot behind those prices. */
export interface PricedCatalogue {
    products: Product[];
    spots: QuotedSpot[];
    /** Metals with no usable price at all (their products read €0). */
    degradedMetals: MetalType[];
}

const ALL_METALS: MetalType[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];

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
        private readonly historicSpots: HistoricSpotService,
        private readonly productsProvider: ProductsProvider,
    ) {}

    /**
     * Fetches and combines the latest market data, including spot prices,
     * historic spot prices, and product prices. Spot prices are resolved
     * via the launch cascade (cache → DB → live API last resort, see
     * MetalsProvider.getAllLatestForLaunch) — this is the initial page load
     * and its periodic refetch, where any recent-enough non-zero price is
     * fine, so cache/DB are preferred over always paying for a live call.
     */
    async getMarketData(): Promise<MarketDataResponse> {
        this.logger.log('Loading market data');
        const { prices, degradedMetals } =
            await this.metalsProvider.getAllLatestForLaunch();
        return this.composeMarketData(prices, degradedMetals);
    }

    /**
     * Manual spot-price overrides from the UI.
     *
     * These are NOT persisted to Redis/Prisma and never flow back into
     * MetalsProvider — they're a temporary "what if" view layered on top
     * of the live prices for this one response only.
     *
     * Recalculates product prices based on manual spot-price overrides.
     * These overrides are temporary and do not persist.
     * @param overrides - Partial map of metal types to their overridden prices.
     * @returns A promise resolving to the recalculated product prices.
     *
     */
    async recalculate(
        overrides: Partial<Record<MetalType, number>>,
    ): Promise<Product[]> {
        const [spotPrices, rawProducts] = await Promise.all([
            this.metalsProvider.getAllLatest(),
            this.productsProvider.getAll(),
        ]);

        const liveMap = this.toSpotMap(spotPrices);

        // Merge live prices with overrides
        const finalMap = mergeMetalPrices(liveMap, overrides);

        return rawProducts.map((p) => calculateProductPrice(p, finalMap));
    }

    /**
     * The product table's prices as data: every product priced from the live
     * spot, or from `overrides` (a frozen or hand-typed spot) where the user
     * has set one. Uses the same cascade and the same pure pricing functions as
     * the page load, so a price read here equals the price on screen. The AI
     * assistant's price lookups call this; nothing is persisted.
     */
    async getPricedCatalogue(
        overrides: Partial<Record<MetalType, number>> = {},
    ): Promise<PricedCatalogue> {
        const [{ prices, degradedMetals }, rawProducts] = await Promise.all([
            this.metalsProvider.getAllLatestForLaunch(),
            this.productsProvider.getAll(),
        ]);

        const liveMap = this.toSpotMap(prices);
        const usedMap = mergeMetalPrices(liveMap, overrides);

        return {
            products: rawProducts.map((p) => calculateProductPrice(p, usedMap)),
            spots: ALL_METALS.map((metal) => {
                const spot = prices.find((s) => s.metalType === metal);
                return {
                    metalType: metal,
                    usedEur: usedMap[metal],
                    liveEur: liveMap[metal],
                    overridden: overrides[metal] !== undefined,
                    timestamp: spot?.timestamp ?? null,
                    isFallback: spot?.isFallback ?? false,
                };
            }),
            degradedMetals,
        };
    }

    /**
     * The Refresh button: always tries the live API first (that's the whole
     * point of clicking it) via MetalsProvider.refreshAll, falling back to
     * the last stored DB price per metal only where the API didn't return
     * one. Composes its own response rather than delegating to
     * getMarketData() — that would re-run the cache/DB-first launch cascade
     * (including its own live-API-last-resort) right after refreshAll
     * already tried the API for everything, doubling up the external call
     * for no benefit.
     */
    async refresh(): Promise<MarketDataResponse> {
        const { prices, degradedMetals } =
            await this.metalsProvider.refreshAll();
        return this.composeMarketData(prices, degradedMetals);
    }

    /**
     * Shared tail end of getMarketData/refresh: pulls in historic spot +
     * products, prices the products against the resolved spot prices, and
     * turns any degraded metals into a human-readable warning the frontend
     * shows as a toast instead of silently rendering €0.00.
     */
    private async composeMarketData(
        spotPrices: RawSpotPrice[],
        degradedMetals: MetalType[],
    ): Promise<MarketDataResponse> {
        const [historicSpot, rawProducts] = await Promise.all([
            this.historicSpots.getHistoricSpots(),
            this.productsProvider.getAll(),
        ]);

        const latestHistoric = new Map<MetalType, HistoricSpot>();

        for (const h of historicSpot) {
            const current = latestHistoric.get(h.metalType);

            if (
                !current ||
                new Date(h.timestamp) > new Date(current.timestamp)
            ) {
                latestHistoric.set(h.metalType, h);
            }
        }

        const enrichedSpotPrices = enrichSpotPrices(spotPrices, latestHistoric);

        const spotMap = this.toSpotMap(enrichedSpotPrices);
        const products = rawProducts.map((p) =>
            calculateProductPrice(p, spotMap),
        );

        return {
            spotPrices: enrichedSpotPrices,
            historicSpot,
            products,
            // The actual snapshot time, not "now" — the oldest timestamp
            // across spotPrices, so a cache/DB hit correctly shows as
            // however old it really is rather than as freshly fetched.
            fetchedAt: this.getSnapshotTimestamp(enrichedSpotPrices),
            priceWarning:
                degradedMetals.length > 0
                    ? `Live price unavailable for ${degradedMetals.join(', ')} — showing €0.00 until the price feed recovers.`
                    : null,
            degradedMetals,
        };
    }

    private getSnapshotTimestamp(spotPrices: RawSpotPrice[]): string {
        if (spotPrices.length === 0) return new Date().toISOString();

        return spotPrices.reduce(
            (oldest, spot) =>
                spot.timestamp < oldest ? spot.timestamp : oldest,
            spotPrices[0].timestamp,
        );
    }

    /**
     * Converts an array of raw spot prices into a map of metal types to prices.
     * @param spotPrices - Array of raw spot prices.
     * @returns A map of metal types to their respective prices.
     */
    private toSpotMap(spotPrices: RawSpotPrice[]): Record<MetalType, number> {
        const map: Record<MetalType, number> = { ...ZERO_SPOT_MAP };
        spotPrices.forEach((s) => {
            map[s.metalType] = s.priceEur;
        });
        return map;
    }

    /**
     * Fetches and stores historic close prices for a specific date.
     * @param date - The date for which to fetch historic close prices.
     * @returns A promise resolving when the fetch is complete.
     */
    async fetchHistoricClose(date: string): Promise<void> {
        this.logger.log(`Manual historic close fetch requested for ${date}`);
        await this.historicSpots.fetchAndStoreHistoricClose(date);
        this.logger.log(`Manual historic close fetch completed for ${date}`);
    }

    /**
     * Seeds the database with historic prices by fetching and storing them.
     * @returns A promise resolving when the seeding process is complete.
     */
    /** Extends the historic table back `years` years; see HistoricSpotService.backfillYears. */
    backfillHistory(years: number) {
        this.logger.log(`Historic backfill requested: ${years} year(s)`);
        return this.historicSpots.backfillYears(years);
    }

    async seedHistoricPrices(): Promise<void> {
        this.logger.log('Starting historic price seed...');

        await this.historicSpots.seedHistoricPrices();

        this.logger.log('Historic price seed completed.');
    }
}
