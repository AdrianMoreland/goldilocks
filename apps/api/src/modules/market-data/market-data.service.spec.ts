import type { RawProduct, RawSpotPrice } from '@goldilocks/shared-types';
import { calculateProductPrice } from '../../common/utils/pricing.util';
import type { HistoricSpotService } from '../metals/historic-spot.service';
import type { MetalsProvider } from '../metals/metals.provider';
import type { ProductsProvider } from '../products/products.provider';
import { MarketDataService } from './market-data.service';

const spot = (
    metalType: RawSpotPrice['metalType'],
    priceEur: number,
    extra: Partial<RawSpotPrice> = {},
): RawSpotPrice => ({
    id: metalType,
    metalType,
    priceEur,
    priceGbp: priceEur * 0.85,
    source: 'test',
    createdAt: '2026-10-01T10:00:00.000Z',
    timestamp: '2026-10-01T10:00:00.000Z',
    ...extra,
});

const gold100g: RawProduct = {
    id: 1,
    sku: 'G100',
    name: '100g Gold Bar',
    metalType: 'GOLD',
    weight: 100,
    spreadBuy: -0.02,
    spreadSell: 0.03,
    vatRate: 0,
    stock: 8,
    isActive: true,
    category: null,
    description: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
};

function build(
    prices: RawSpotPrice[],
    degraded: RawSpotPrice['metalType'][] = [],
) {
    const service = new MarketDataService(
        {
            getAllLatestForLaunch: jest.fn(async () => ({
                prices,
                degradedMetals: degraded,
            })),
        } as unknown as MetalsProvider,
        {} as HistoricSpotService,
        {
            getAll: jest.fn(async () => [gold100g]),
        } as unknown as ProductsProvider,
    );
    return service;
}

const LIVE = [
    spot('GOLD', 3000),
    spot('SILVER', 35),
    spot('PLATINUM', 1000),
    spot('PALLADIUM', 950, { isFallback: true }),
];

describe('MarketDataService.getPricedCatalogue', () => {
    it('prices every product exactly as the table does, from the live spot', async () => {
        const { products, spots } = await build(LIVE).getPricedCatalogue();

        const expected = calculateProductPrice(gold100g, {
            GOLD: 3000,
            SILVER: 35,
            PLATINUM: 1000,
            PALLADIUM: 950,
        });
        expect(products).toEqual([expected]);
        expect(spots.find((s) => s.metalType === 'GOLD')).toMatchObject({
            usedEur: 3000,
            liveEur: 3000,
            overridden: false,
            timestamp: '2026-10-01T10:00:00.000Z',
        });
    });

    it('quotes from a frozen or typed spot where one is set, and says so', async () => {
        const { products, spots } = await build(LIVE).getPricedCatalogue({
            GOLD: 3100,
        });

        expect(products[0].priceSell).toBe(
            calculateProductPrice(gold100g, {
                GOLD: 3100,
                SILVER: 35,
                PLATINUM: 1000,
                PALLADIUM: 950,
            }).priceSell,
        );
        expect(products[0].priceSell).toBeGreaterThan(
            calculateProductPrice(gold100g, {
                GOLD: 3000,
                SILVER: 35,
                PLATINUM: 1000,
                PALLADIUM: 950,
            }).priceSell,
        );
        expect(spots.find((s) => s.metalType === 'GOLD')).toMatchObject({
            usedEur: 3100,
            liveEur: 3000,
            overridden: true,
        });
        expect(spots.find((s) => s.metalType === 'SILVER')?.overridden).toBe(
            false,
        );
    });

    it('reports a fallback spot and a metal with no usable price', async () => {
        const { spots, degradedMetals } = await build(
            LIVE.filter((s) => s.metalType !== 'SILVER'),
            ['SILVER'],
        ).getPricedCatalogue();

        expect(spots.find((s) => s.metalType === 'PALLADIUM')?.isFallback).toBe(
            true,
        );
        expect(spots.find((s) => s.metalType === 'SILVER')).toMatchObject({
            usedEur: 0,
            timestamp: null,
        });
        expect(degradedMetals).toEqual(['SILVER']);
    });
});
