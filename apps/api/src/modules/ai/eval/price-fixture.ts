import type { MetalType, Product, RawProduct } from '@goldilocks/shared-types';
import { calculateProductPrice } from '../../../common/utils/pricing.util';
import type {
    MarketDataService,
    PricedCatalogue,
} from '../../market-data/market-data.service';

/**
 * A small fixed catalogue and spot for the evaluation. The REAL price tools
 * run over it (so product matching, totals and wording are exercised), but
 * the figures are known in advance, so a golden case can check the model
 * quoted them exactly. Nothing here touches the database or the price feed.
 */
const SPOT: Record<MetalType, number> = {
    GOLD: 3412.5,
    SILVER: 38.4,
    PLATINUM: 1040.1,
    PALLADIUM: 980,
};

const raw = (
    id: number,
    name: string,
    metalType: MetalType,
    weight: number,
    spreadSell: number,
    spreadBuy: number,
    vatRate: number,
): RawProduct => ({
    id,
    sku: `EVAL${id}`,
    name,
    metalType,
    weight,
    spreadSell,
    spreadBuy,
    vatRate,
    stock: 8,
    isActive: true,
    category: null,
    description: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
});

// Investment gold is VAT-exempt in Ireland; silver and platinum carry 23%.
const RAW_PRODUCTS: RawProduct[] = [
    raw(1, '100g Gold Bar', 'GOLD', 100, 0.03, -0.02, 0),
    raw(2, '1oz Gold Bar', 'GOLD', 31.1035, 0.035, -0.02, 0),
    raw(3, '1oz Krugerrand', 'GOLD', 31.1035, 0.045, -0.03, 0),
    raw(4, '1oz Maple Leaf', 'GOLD', 31.1035, 0.045, -0.03, 0),
    raw(5, '100g Silver Bar', 'SILVER', 100, 0.08, -0.06, 0.23),
    raw(6, '1oz Britannia', 'SILVER', 31.1035, 0.15, -0.1, 0.23),
    raw(7, '1oz Platinum Bar', 'PLATINUM', 31.1035, 0.06, -0.04, 0.23),
];

export const FIXTURE_PRODUCTS: Product[] = RAW_PRODUCTS.map((p) =>
    calculateProductPrice(p, SPOT),
);

/** The priced fixture product with this name (and metal, when names repeat across metals). */
export function fixtureProduct(name: string, metal?: MetalType): Product {
    const found = FIXTURE_PRODUCTS.find(
        (p) => p.name === name && (!metal || p.metalType === metal),
    );
    if (!found) throw new Error(`No fixture product "${name}"`);
    return found;
}

/** A fixture product priced from the live spot with some metals overridden, as the dashboard does for a typed spot. */
export function fixtureProductAt(
    name: string,
    overrides: Partial<Record<MetalType, number>>,
): Product {
    const found = RAW_PRODUCTS.find((p) => p.name === name);
    if (!found) throw new Error(`No fixture product "${name}"`);
    return calculateProductPrice(found, { ...SPOT, ...overrides });
}

/**
 * A pattern that finds an amount however the model writes it: 10120, 10,120,
 * 10.120 or "10 120", with or without a euro sign. Cents are ignored, so
 * 3412 finds "3,412.50".
 */
export function figure(amount: number): RegExp {
    const digits = String(Math.trunc(amount));
    const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '[,. ]?');
    return new RegExp(`(?<![\\d,.])${grouped}(?![\\d])`);
}

/** A stand-in for MarketDataService that answers from the fixture, honouring a manual spot override. */
export function fixtureMarketData(now = new Date()): MarketDataService {
    const takenAt = new Date(now.getTime() - 2 * 60_000).toISOString();
    return {
        getPricedCatalogue: (
            overrides: Partial<Record<MetalType, number>> = {},
        ): Promise<PricedCatalogue> => {
            const used = { ...SPOT, ...overrides };
            return Promise.resolve({
                products: RAW_PRODUCTS.map((p) =>
                    calculateProductPrice(p, used),
                ),
                spots: (Object.keys(SPOT) as MetalType[]).map((metalType) => ({
                    metalType,
                    usedEur: used[metalType],
                    liveEur: SPOT[metalType],
                    overridden: overrides[metalType] !== undefined,
                    timestamp: takenAt,
                    isFallback: false,
                })),
                degradedMetals: [],
            });
        },
    } as unknown as MarketDataService;
}

export const FIXTURE_SPOT = SPOT;
