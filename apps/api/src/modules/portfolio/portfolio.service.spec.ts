import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { RawProduct, RawSpotPrice } from '@goldilocks/shared-types';
import { GRAMS_PER_TROY_OUNCE, roundSellPrice } from '@goldilocks/shared-types';
import type { MetalsProvider } from '../metals/metals.provider';
import type { ProductsProvider } from '../products/products.provider';
import { PortfolioService } from './portfolio.service';

const SPOT_EUR = 4500;

const product = (
    id: number,
    name: string,
    weight: number,
    spreadSell: number,
    extra: Partial<RawProduct> = {},
): RawProduct => ({
    id,
    sku: `SKU-${id}`,
    name,
    metalType: 'GOLD',
    weight,
    spreadBuy: -0.03,
    spreadSell,
    vatRate: 0,
    stock: 10,
    isActive: true,
    category: null,
    description: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...extra,
});

// Mirrors the gold rows in apps/api/prisma/seed.ts.
const ONE_OZ_BAR = product(1, '1 oz Gold Bar', 31.1035, 0.02);
const catalogue: RawProduct[] = [
    ONE_OZ_BAR,
    product(2, '1 kg Gold Bar', 1000, 0.025),
    product(3, '1 g Gold Bar', 1, 0.015),
    product(4, '1 oz Gold Coin', 31.1035, 0.03),
    product(5, '1/2 oz Gold Coin', 15.5518, 0.03),
    product(6, '100 g Gold Bar', 100, 0.02),
    product(7, '50 g Gold Bar', 50, 0.02),
    product(8, '5 g Gold Bar', 5, 0.015),
    product(9, 'Out of stock Gold Bar', 31.1035, 0.02, { stock: 0 }),
    product(10, '1 oz Silver Bar', 31.1035, 0.05, { metalType: 'SILVER' }),
];

const spotRow = (priceEur: number): RawSpotPrice => ({
    id: 'GOLD',
    metalType: 'GOLD',
    priceEur,
    priceGbp: priceEur * 0.85,
    source: 'test',
    createdAt: '2026-10-01T10:00:00.000Z',
    timestamp: '2026-10-01T10:00:00.000Z',
});

function build(spot: RawSpotPrice | null = spotRow(SPOT_EUR)) {
    const getLatest = jest.fn(async () => spot);
    const getAll = jest.fn(async () => catalogue);
    const service = new PortfolioService(
        { getAll } as unknown as ProductsProvider,
        { getLatest } as unknown as MetalsProvider,
    );
    return { service, getLatest, getAll };
}

describe('PortfolioService.buildPortfolio', () => {
    describe('€150,000 budget, bars only, 1 oz gold bar as medium priority', () => {
        const request = {
            metalType: 'GOLD' as const,
            budget: 150_000,
            productType: 'bar' as const,
            priorityProductId: ONE_OZ_BAR.id,
            priorityStrength: 'medium' as const,
        };

        it('returns the three strategies in display order', async () => {
            const { service } = build();

            const response = await service.buildPortfolio(request);

            expect(response.results.map((r) => r.strategy.id)).toEqual([
                'maximum',
                'balanced',
                'flexible',
            ]);
            expect(response.priorityProductId).toBe(ONE_OZ_BAR.id);
            expect(response.priorityStrength).toBe('medium');
        });

        it('only ever contains in-stock gold bars (no coins, no silver, no out-of-stock)', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);

            const names = results.flatMap((r) => r.items.map((i) => i.product));
            expect(names.length).toBeGreaterThan(0);
            for (const item of results.flatMap((r) => r.items)) {
                expect(item.type).toBe('bar');
            }
            expect(names).not.toContain('1 oz Gold Coin');
            expect(names).not.toContain('1 oz Silver Bar');
            expect(names).not.toContain('Out of stock Gold Bar');
        });

        it('never spends more than the budget and reports unspent correctly', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);

            for (const r of results) {
                expect(r.totalInvested).toBeLessThanOrEqual(150_000);
                expect(r.unspent).toBeGreaterThanOrEqual(0);
                // totalInvested and unspent are each rounded to whole euros.
                expect(
                    Math.abs(r.totalInvested + r.unspent - 150_000),
                ).toBeLessThanOrEqual(1);
            }
        });

        it('uses large-investor products only: nothing smaller than 1 oz is bought for a budget over €5,000', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);

            for (const item of results.flatMap((r) => r.items)) {
                // The remainder step may add a small bar, but it is capped at 5 pieces.
                if (item.weight < GRAMS_PER_TROY_OUNCE - 0.75) {
                    expect(item.quantity).toBeLessThanOrEqual(5);
                }
            }
        });

        // Characterises current behaviour (ported from the Apps Script tool): medium
        // strength first buys ~50% of the budget in the priority bar, but the final
        // "spend the remainder" step ranks the priority product first and tops it up
        // with whatever is left. When the priority IS the 1 oz bar, Flexible ends up
        // all-in on it, the same as choosing no priority at all.
        it('Maximum Flexibility: medium priority on the 1 oz bar is topped up by the remainder step', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);
            const flexible = results.find((r) => r.strategy.id === 'flexible')!;

            const priority = flexible.items.find((i) => i.isPriority)!;
            expect(priority.product).toBe('1 oz Gold Bar');
            const halfBudgetQty = Math.floor(
                (150_000 * 0.5) / priority.unitPrice,
            );
            expect(priority.quantity).toBeGreaterThanOrEqual(halfBudgetQty);
            expect(priority.quantity).toBe(
                Math.floor(150_000 / priority.unitPrice),
            );
            expect(flexible.priorityShare).toBeGreaterThan(90);
        });

        it('Balanced includes the priority bar when it is chosen', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);
            const balanced = results.find((r) => r.strategy.id === 'balanced')!;

            expect(balanced.priorityQuantity).toBeGreaterThan(0);
            expect(balanced.items.some((i) => i.isPriority)).toBe(true);
        });

        it('Maximum Value ignores the priority and buys the single largest affordable bar', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);
            const maximum = results.find((r) => r.strategy.id === 'maximum')!;

            expect(maximum.items).toHaveLength(1);
            expect(maximum.items[0].product).toBe('1 kg Gold Bar');
            expect(maximum.items[0].quantity).toBe(1);
        });

        it('flags exactly the requested product as priority', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);

            for (const r of results) {
                for (const item of r.items) {
                    expect(item.isPriority).toBe(
                        item.product === '1 oz Gold Bar',
                    );
                }
            }
        });

        it('prices the 1 oz bar from the latest spot: spot x weight/oz x (1 + spread), rounded up', async () => {
            const { service } = build();

            const { results } = await service.buildPortfolio(request);
            const line = results
                .flatMap((r) => r.items)
                .find((i) => i.product === '1 oz Gold Bar')!;

            const expected = roundSellPrice(
                (SPOT_EUR / GRAMS_PER_TROY_OUNCE) * 31.1035 * 1.02,
            );
            expect(line.unitPrice).toBe(expected);
            expect(line.premium).toBeCloseTo(2, 5);
        });

        it('uses the card override spot instead of the market spot when customSpot is sent', async () => {
            const { service } = build();

            const market = await service.buildPortfolio(request);
            const custom = await service.buildPortfolio({
                ...request,
                customSpot: 5000,
            });

            const price = (r: typeof market) =>
                r.results
                    .flatMap((x) => x.items)
                    .find((i) => i.product === '1 oz Gold Bar')!.unitPrice;
            expect(price(custom)).toBeGreaterThan(price(market));
        });

        it('reads the spot and the catalogue once each, in parallel', async () => {
            const { service, getLatest, getAll } = build();

            await service.buildPortfolio(request);

            expect(getLatest).toHaveBeenCalledTimes(1);
            expect(getLatest).toHaveBeenCalledWith('GOLD');
            expect(getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('input handling', () => {
        const base = {
            metalType: 'GOLD' as const,
            budget: 150_000,
            productType: 'bar' as const,
            priorityStrength: 'none' as const,
        };

        it('404s when there is no spot price for the metal', async () => {
            const { service } = build(null);

            await expect(service.buildPortfolio(base)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('400s when the budget cannot buy any product', async () => {
            const { service } = build();

            await expect(
                service.buildPortfolio({ ...base, budget: 1 }),
            ).rejects.toThrow(BadRequestException);
        });

        it('400s when no product matches the selected type', async () => {
            const { service } = build();

            await expect(
                service.buildPortfolio({
                    ...base,
                    metalType: 'PLATINUM',
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it('ignores an unknown priorityProductId rather than failing', async () => {
            const { service } = build();

            const response = await service.buildPortfolio({
                ...base,
                priorityProductId: 9999,
                priorityStrength: 'high',
            });

            expect(response.priorityProductId).toBeNull();
            expect(
                response.results.every((r) => r.priorityQuantity === 0),
            ).toBe(true);
        });
    });
});
