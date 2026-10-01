import { Decimal } from '../../../prisma/generated/internal/prismaNamespace';
import type {
    RawProduct,
    RawSpotPrice,
    HistoricSpot,
} from '@goldilocks/shared-types';
import { GRAMS_PER_TROY_OUNCE } from '@goldilocks/shared-types';
import {
    calculateProductPrice,
    enrichSpotPrices,
    mergeMetalPrices,
    toNumber,
} from './pricing.util';

describe('toNumber', () => {
    it('passes a plain number through unchanged', () => {
        expect(toNumber(42.5)).toBe(42.5);
    });

    it('converts a Prisma Decimal to a number', () => {
        expect(toNumber(new Decimal('123.45'))).toBe(123.45);
    });

    it('treats undefined as 0', () => {
        expect(toNumber(undefined)).toBe(0);
    });

    it('treats null as 0', () => {
        expect(toNumber(null)).toBe(0);
    });
});

describe('calculateProductPrice', () => {
    const baseProduct: RawProduct = {
        id: 1,
        sku: 'GOLD-1OZ',
        name: '1oz Gold Coin',
        metalType: 'GOLD',
        weight: GRAMS_PER_TROY_OUNCE, // exactly 1 troy ounce
        spreadSell: 0.05, // +5% premium on the sell side
        spreadBuy: -0.03, // -3% discount on the buyback side
        vatRate: 0.23,
        stock: 10,
        isActive: true,
        description: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    };

    const spotMap = { GOLD: 2000, SILVER: 25, PLATINUM: 900, PALLADIUM: 1000 };

    it('prices the sell side as basePrice * (1 + premium) * (1 + VAT)', () => {
        const priced = calculateProductPrice(baseProduct, spotMap);

        // basePrice = spot/gram * weight = (2000 / oz) * oz = 2000 (weight is exactly 1 troy oz)
        const basePrice =
            (spotMap.GOLD / GRAMS_PER_TROY_OUNCE) * baseProduct.weight;
        const expectedVatExcl = basePrice * (1 + baseProduct.spreadSell);
        const expectedSell = expectedVatExcl * (1 + baseProduct.vatRate);

        // Whole euros, rounded up — we're charging.
        expect(priced.priceSellVatExcl).toBe(
            Math.ceil(Math.round(expectedVatExcl * 100) / 100),
        );
        expect(priced.priceSell).toBe(
            Math.ceil(Math.round(expectedSell * 100) / 100),
        );
    });

    it('prices the buyback side as basePrice * (1 + spreadBuy), spreadBuy already signed negative', () => {
        const priced = calculateProductPrice(baseProduct, spotMap);
        const basePrice =
            (spotMap.GOLD / GRAMS_PER_TROY_OUNCE) * baseProduct.weight;

        // Whole euros, rounded down — we're paying.
        expect(priced.priceBuy).toBe(
            Math.floor(
                Math.round(basePrice * (1 + baseProduct.spreadBuy) * 100) / 100,
            ),
        );
        // Sanity: a negative spread must genuinely discount off the base price.
        expect(priced.priceBuy).toBeLessThan(basePrice);
    });

    it("quotes Price and Buyback in whole euros, rounded in the dealer's favour", () => {
        const product = { ...baseProduct, weight: 7.777 };
        const spot = { ...spotMap, GOLD: 1999.999 };
        const priced = calculateProductPrice(product, spot);
        const basePrice = (spot.GOLD / GRAMS_PER_TROY_OUNCE) * product.weight;
        const rawSell =
            basePrice * (1 + product.spreadSell) * (1 + product.vatRate);
        const rawBuy = basePrice * (1 + product.spreadBuy);

        for (const value of [
            priced.priceSell,
            priced.priceSellVatExcl,
            priced.priceBuy,
        ]) {
            expect(Number.isInteger(value)).toBe(true);
        }
        // Never charge less than the exact price, never pay more than it.
        expect(priced.priceSell).toBeGreaterThanOrEqual(rawSell - 0.005);
        expect(priced.priceSell - rawSell).toBeLessThan(1);
        expect(priced.priceBuy).toBeLessThanOrEqual(rawBuy + 0.005);
        expect(rawBuy - priced.priceBuy).toBeLessThan(1);
    });

    it('keeps market value and spot at 2 decimal places', () => {
        const priced = calculateProductPrice(
            { ...baseProduct, weight: 7.777 },
            { ...spotMap, GOLD: 1999.999 },
        );

        for (const value of [priced.marketValue, priced.spotPrice]) {
            // value * 100 must be within float-noise distance of a whole
            // integer — Number.isInteger(value * 100) is too strict here since
            // float multiplication (e.g. 123.45 * 100 === 12344.999999999998)
            // makes even genuinely-2dp values fail an exact-integer check.
            expect(
                Math.abs(value * 100 - Math.round(value * 100)),
            ).toBeLessThan(1e-6);
        }
    });

    it('prices at zero when the metal is missing from the spot map (guards against a poisoned/empty map)', () => {
        const priced = calculateProductPrice(baseProduct, {
            ...spotMap,
            GOLD: 0,
        });

        expect(priced.spotPrice).toBe(0);
        expect(priced.marketValue).toBe(0);
        expect(priced.priceSell).toBe(0);
        expect(priced.priceBuy).toBe(0);
    });
});

describe('mergeMetalPrices', () => {
    const base = { GOLD: 2000, SILVER: 25, PLATINUM: 900, PALLADIUM: 1000 };

    it('returns the base map untouched when there are no overrides', () => {
        expect(mergeMetalPrices(base, {})).toEqual(base);
    });

    it('overrides only the metals present in the overrides map', () => {
        const merged = mergeMetalPrices(base, { GOLD: 2100 });

        expect(merged.GOLD).toBe(2100);
        expect(merged.SILVER).toBe(base.SILVER);
        expect(merged.PLATINUM).toBe(base.PLATINUM);
    });

    it('accepts an explicit 0 override — 0 is a valid price, not "no override"', () => {
        // A truthy-style check (`if (value)`) would wrongly skip a 0 override;
        // this pins the correct `value !== undefined` behavior.
        expect(mergeMetalPrices(base, { SILVER: 0 }).SILVER).toBe(0);
    });

    it('does not mutate the base map it was given', () => {
        const original = { ...base };
        mergeMetalPrices(base, { GOLD: 9999 });
        expect(base).toEqual(original);
    });
});

describe('enrichSpotPrices', () => {
    const rawSpot: RawSpotPrice = {
        id: '1',
        metalType: 'GOLD',
        priceEur: 2100,
        priceGbp: 1800,
        source: 'test',
        createdAt: '2026-01-02T00:00:00.000Z',
        timestamp: '2026-01-02T00:00:00.000Z',
    };

    it('computes change and changePercent against the previous close', () => {
        const historicMap = new Map<RawSpotPrice['metalType'], HistoricSpot>([
            [
                'GOLD',
                {
                    metalType: 'GOLD',
                    priceEur: 2000,
                    priceGbp: 1700,
                    timestamp: '2026-01-01T00:00:00.000Z',
                },
            ],
        ]);

        const [enriched] = enrichSpotPrices([rawSpot], historicMap);

        expect(enriched.previousClose).toBe(2000);
        expect(enriched.change).toBe(100);
        expect(enriched.changePercent).toBeCloseTo(5, 6);
    });

    it('defaults previousClose to 0 and changePercent to 0 (not NaN/Infinity) when there is no historic entry', () => {
        const [enriched] = enrichSpotPrices([rawSpot], new Map());

        expect(enriched.previousClose).toBe(0);
        expect(enriched.change).toBe(rawSpot.priceEur);
        expect(enriched.changePercent).toBe(0);
    });
});
