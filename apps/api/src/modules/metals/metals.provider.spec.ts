import { MetalsProvider } from './metals.provider';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { MetalPriceApiPort } from '../../infrastructure/metal-price-api/metal-price-api.port';
import type { SpotPriceCacheStore } from './spot-price-cache.store';
import type { CascadeMetricsService } from './cascade-metrics.service';
import type { FetchAttemptService } from './fetch-attempt.service';
import type { RawSpotPrice } from '@goldilocks/shared-types';

// Vendor rates are "units of metal per 1 EUR", so price = 1 / rate.
const VENDOR_TS = 1_750_000_000; // seconds, safely in the past
const liveResponse = (
    rates: Record<string, number>,
    overrides: object = {},
) => ({
    success: true,
    base: 'EUR',
    timestamp: VENDOR_TS,
    rates: { GBP: 0.8, ...rates },
    ...overrides,
});
const ALL_RATES = { XAU: 1 / 2000, XAG: 1 / 25, XPT: 1 / 1000, XPD: 1 / 1500 };

const dbRow = (
    metalType: RawSpotPrice['metalType'],
    priceEur: number,
    timestamp = new Date().toISOString(),
): RawSpotPrice => ({
    id: 'db',
    metalType,
    priceEur,
    priceGbp: priceEur * 0.8,
    source: 'db',
    createdAt: timestamp,
    timestamp,
});

function build() {
    const prisma = {
        metalSpotPrice: {
            createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
    };
    const api = {
        livePrices: jest.fn(),
    };
    const spotCache = {
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn(),
        getCachedOnly: jest.fn().mockResolvedValue(null),
        getFromDbOnly: jest.fn().mockResolvedValue(null),
        clearAll: jest.fn(),
    };
    const metrics = { recordCacheHit: jest.fn(), recordCacheMiss: jest.fn() };
    const attempts = { record: jest.fn().mockResolvedValue(undefined) };
    const provider = new MetalsProvider(
        prisma as unknown as PrismaService,
        api as unknown as MetalPriceApiPort,
        spotCache as unknown as SpotPriceCacheStore,
        metrics as unknown as CascadeMetricsService,
        attempts as unknown as FetchAttemptService,
    );
    return { provider, prisma, api, spotCache, metrics, attempts };
}

describe('MetalsProvider.refreshAll', () => {
    it('stores, caches and returns a live price for every metal the vendor returned', async () => {
        const { provider, prisma, api, spotCache, attempts } = build();
        api.livePrices.mockResolvedValue(liveResponse(ALL_RATES));

        const { prices, degradedMetals } = await provider.refreshAll('CRON');

        expect(degradedMetals).toEqual([]);
        expect(prices.map((p) => p.metalType).sort()).toEqual([
            'GOLD',
            'PALLADIUM',
            'PLATINUM',
            'SILVER',
        ]);
        expect(prices.every((p) => p.fetchSource === 'live')).toBe(true);

        const gold = prices.find((p) => p.metalType === 'GOLD')!;
        expect(gold.priceEur).toBeCloseTo(2000);
        expect(gold.priceGbp).toBeCloseTo(1600); // EUR price x GBP rate
        expect(gold.timestamp).toBe(new Date(VENDOR_TS * 1000).toISOString()); // vendor time, not "now"

        expect(prisma.metalSpotPrice.createMany).toHaveBeenCalledTimes(1);
        expect(
            prisma.metalSpotPrice.createMany.mock.calls[0][0].data,
        ).toHaveLength(4);
        expect(spotCache.set).toHaveBeenCalledTimes(4);
        expect(attempts.record).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                triggeredBy: 'CRON',
                metalsResolved: expect.arrayContaining(['GOLD']),
            }),
        );
    });

    it('falls back to the last stored price, flagged as a fallback, and writes nothing when the vendor fails', async () => {
        const { provider, prisma, api, spotCache, attempts } = build();
        api.livePrices.mockResolvedValue({ success: false, error: 'quota' });
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) => dbRow(metal, 100),
        );

        const { prices, degradedMetals } = await provider.refreshAll();

        expect(degradedMetals).toEqual([]);
        expect(prices).toHaveLength(4);
        expect(
            prices.every(
                (p) => p.fetchSource === 'db' && p.isFallback === true,
            ),
        ).toBe(true);
        expect(prisma.metalSpotPrice.createMany).not.toHaveBeenCalled();
        expect(attempts.record).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, triggeredBy: 'REFRESH' }),
        );
    });

    it('treats a thrown vendor error like a failed response', async () => {
        const { provider, api, spotCache, attempts } = build();
        api.livePrices.mockRejectedValue(new Error('ECONNRESET'));
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) => dbRow(metal, 100),
        );

        const { prices } = await provider.refreshAll();

        expect(prices).toHaveLength(4);
        expect(attempts.record).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                errorMessage: 'ECONNRESET',
            }),
        );
    });

    it('mixes live and fallback when the vendor omits one metal', async () => {
        const { provider, api, spotCache } = build();
        const { XPD: _omitted, ...withoutPalladium } = ALL_RATES;
        api.livePrices.mockResolvedValue(liveResponse(withoutPalladium));
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) => dbRow(metal, 1500),
        );

        const { prices, degradedMetals } = await provider.refreshAll();

        expect(degradedMetals).toEqual([]);
        expect(prices.filter((p) => p.fetchSource === 'live')).toHaveLength(3);
        const fallback = prices.find((p) => p.metalType === 'PALLADIUM')!;
        expect(fallback).toMatchObject({ fetchSource: 'db', isFallback: true });
    });

    it('reports a metal as degraded (but still returns its row) when even the stored price is unusable', async () => {
        const { provider, api, spotCache } = build();
        api.livePrices.mockResolvedValue({ success: false });
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) =>
                metal === 'GOLD' ? dbRow(metal, 0) : dbRow(metal, 100),
        );

        const { prices, degradedMetals } = await provider.refreshAll();

        expect(degradedMetals).toEqual(['GOLD']);
        expect(prices.find((p) => p.metalType === 'GOLD')?.priceEur).toBe(0);
    });

    it('ignores a vendor timestamp in the future', async () => {
        const { provider, api } = build();
        api.livePrices.mockResolvedValue(
            liveResponse(ALL_RATES, {
                timestamp: Math.floor(Date.now() / 1000) + 86_400,
            }),
        );

        const { prices } = await provider.refreshAll();

        expect(Date.parse(prices[0].timestamp)).toBeLessThanOrEqual(Date.now());
    });
});

describe('MetalsProvider.retryMetal', () => {
    it('stores and returns only the retried metal', async () => {
        const { provider, prisma, api, spotCache } = build();
        api.livePrices.mockResolvedValue(liveResponse(ALL_RATES));

        const result = await provider.retryMetal('SILVER');

        expect(result).toMatchObject({
            metalType: 'SILVER',
            fetchSource: 'live',
        });
        expect(result!.priceEur).toBeCloseTo(25);
        expect(
            prisma.metalSpotPrice.createMany.mock.calls[0][0].data,
        ).toHaveLength(1);
        expect(spotCache.set).toHaveBeenCalledTimes(1);
    });

    it('returns null and writes nothing when the vendor has no usable rate for it', async () => {
        const { provider, prisma, api } = build();
        api.livePrices.mockResolvedValue({ success: false });

        await expect(provider.retryMetal('SILVER')).resolves.toBeNull();
        expect(prisma.metalSpotPrice.createMany).not.toHaveBeenCalled();
    });
});

describe('MetalsProvider.getAllLatestForLaunch', () => {
    it('serves from cache without calling the vendor', async () => {
        const { provider, api, spotCache, metrics } = build();
        spotCache.getCachedOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) => dbRow(metal, 100),
        );

        const { prices, degradedMetals } =
            await provider.getAllLatestForLaunch();

        expect(api.livePrices).not.toHaveBeenCalled();
        expect(degradedMetals).toEqual([]);
        expect(prices.every((p) => p.fetchSource === 'cache')).toBe(true);
        expect(metrics.recordCacheHit).toHaveBeenCalledTimes(4);
    });

    it('skips a poisoned (0.00) cache entry and uses a fresh DB row, re-warming the cache', async () => {
        const { provider, api, spotCache, metrics } = build();
        spotCache.getCachedOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) => dbRow(metal, 0),
        );
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) => dbRow(metal, 100),
        );

        const { prices } = await provider.getAllLatestForLaunch();

        expect(api.livePrices).not.toHaveBeenCalled();
        expect(
            prices.every((p) => p.fetchSource === 'db' && p.priceEur === 100),
        ).toBe(true);
        expect(spotCache.set).toHaveBeenCalledTimes(4);
        expect(metrics.recordCacheMiss).toHaveBeenCalledTimes(4);
    });

    it('calls the vendor once, as a last resort, when the DB price is stale', async () => {
        const { provider, api, spotCache, prisma } = build();
        const stale = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) =>
                dbRow(metal, 100, stale),
        );
        api.livePrices.mockResolvedValue(liveResponse(ALL_RATES));

        const { prices, degradedMetals } =
            await provider.getAllLatestForLaunch();

        expect(api.livePrices).toHaveBeenCalledTimes(1);
        expect(degradedMetals).toEqual([]);
        expect(prices.every((p) => p.fetchSource === 'live')).toBe(true);
        expect(prisma.metalSpotPrice.createMany).toHaveBeenCalledTimes(1); // one batched insert for all resolved metals
        expect(
            prisma.metalSpotPrice.createMany.mock.calls[0][0].data,
        ).toHaveLength(4);
    });

    it('marks a metal degraded when cache, DB and vendor all fail, still returning the stale DB row', async () => {
        const { provider, api, spotCache } = build();
        const stale = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        spotCache.getFromDbOnly.mockImplementation(
            async (metal: RawSpotPrice['metalType']) =>
                dbRow(metal, 100, stale),
        );
        api.livePrices.mockResolvedValue({ success: false });

        const { prices, degradedMetals } =
            await provider.getAllLatestForLaunch();

        expect(degradedMetals.sort()).toEqual([
            'GOLD',
            'PALLADIUM',
            'PLATINUM',
            'SILVER',
        ]);
        expect(prices).toHaveLength(4);
    });
});
