import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
    GRAMS_PER_TROY_OUNCE,
    type PortfolioBuildRequest,
    type ProfitAnalysisRequest,
} from '@goldilocks/shared-types';
import { PortfolioService } from './portfolio.service';

// Expected numbers below are worked out by hand from the business rules (price = spot x ounces
// x (1 + premium), buyback = spot x ounces x (1 - discount), profit = buyback - price), never by
// calling the code under test.

const product = (over: Record<string, unknown> = {}) => ({
    id: 1,
    sku: 'GB-1OZ',
    name: '1oz Gold Bar',
    metalType: 'GOLD',
    weight: GRAMS_PER_TROY_OUNCE, // exactly 1 troy ounce
    spreadSell: 0.05,
    spreadBuy: -0.02,
    vatRate: 0,
    stock: 5,
    isActive: true,
    category: 'bar',
    description: null,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    ...over,
});

function build(opts: {
    found?: ReturnType<typeof product> | null;
    catalogue?: ReturnType<typeof product>[];
    spot?: { priceEur: number } | null;
}) {
    const products = {
        findById: jest.fn().mockResolvedValue(opts.found ?? null),
        getRawProducts: jest.fn().mockResolvedValue(opts.catalogue ?? []),
    };
    const metals = {
        getLatest: jest
            .fn()
            .mockResolvedValue(
                opts.spot === undefined ? { priceEur: 2000 } : opts.spot,
            ),
    };
    return new PortfolioService(products as never, metals as never);
}

describe('PortfolioService.calculateProfitAnalysis', () => {
    const request = (
        over: Partial<ProfitAnalysisRequest> = {},
    ): ProfitAnalysisRequest => ({
        metalType: 'GOLD',
        productId: 1,
        purchaseSpot: 2000,
        purchasePremium: 5,
        purchasePrice: 0,
        missingField: 'price',
        currentSpot: 2200,
        currentDiscount: 2,
        targetProfit: 100,
        ...over,
    });

    it('works out purchase price, buyback, profit and the spot needed for the target', async () => {
        const service = build({ found: product() });

        const result = await service.calculateProfitAnalysis(request());

        // Bought 1oz at spot 2000 + 5% premium = 2100.
        expect(result.purchasePrice).toBeCloseTo(2100, 6);
        // Sells back at spot 2200 less a 2% discount = 2156.
        expect(result.currentBuybackValue).toBeCloseTo(2156, 6);
        expect(result.profit).toBeCloseTo(56, 6);
        expect(result.profitPercent).toBeCloseTo((56 / 2100) * 100, 6);
        // To make 100 profit the buyback must reach 2200, so spot x 0.98 = 2200.
        expect(result.requiredPrice).toBeCloseTo(2200, 6);
        expect(result.requiredSpot).toBeCloseTo(2200 / 0.98, 6);
        expect(result.product).toBe('1oz Gold Bar');
    });

    it('scales the purchase by the product weight, not just the spot', async () => {
        // A 10oz bar bought at 2000 + 5% costs ten times as much.
        const service = build({
            found: product({ weight: GRAMS_PER_TROY_OUNCE * 10 }),
        });

        const result = await service.calculateProfitAnalysis(request());

        expect(result.productMultiplier).toBeCloseTo(10, 9);
        expect(result.purchasePrice).toBeCloseTo(21000, 6);
    });

    it('recovers the premium from a known price and spot', async () => {
        const service = build({ found: product() });

        const result = await service.calculateProfitAnalysis(
            request({
                missingField: 'premium',
                purchasePrice: 2100,
                purchasePremium: 0,
            }),
        );

        expect(result.purchasePremium).toBeCloseTo(5, 6);
    });

    it('recovers the spot from a known price and premium', async () => {
        const service = build({ found: product() });

        const result = await service.calculateProfitAnalysis(
            request({
                missingField: 'spot',
                purchasePrice: 2100,
                purchaseSpot: 0,
            }),
        );

        expect(result.purchaseSpot).toBeCloseTo(2000, 6);
    });

    it('rejects a product that does not exist', async () => {
        const service = build({ found: null });

        await expect(
            service.calculateProfitAnalysis(request()),
        ).rejects.toThrow(NotFoundException);
    });

    it('rejects a product of a different metal than requested', async () => {
        const service = build({
            found: product({ metalType: 'SILVER', name: '1oz Silver Bar' }),
        });

        await expect(
            service.calculateProfitAnalysis(request()),
        ).rejects.toThrow(BadRequestException);
    });

    it('turns unusable purchase inputs into a 400, not a 500', async () => {
        const service = build({ found: product() });

        await expect(
            service.calculateProfitAnalysis(request({ purchaseSpot: 0 })),
        ).rejects.toThrow(BadRequestException);
        await expect(
            service.calculateProfitAnalysis(request({ purchasePremium: -1 })),
        ).rejects.toThrow(BadRequestException);
    });
});

describe('PortfolioService.buildPortfolio', () => {
    const request = (
        over: Partial<PortfolioBuildRequest> = {},
    ): PortfolioBuildRequest => ({
        metalType: 'GOLD',
        budget: 5000,
        productType: 'either',
        priorityStrength: 'none',
        ...over,
    });

    const bar = product();
    const coin = product({
        id: 2,
        sku: 'GC-HALF',
        name: '1/2oz Britannia Coin',
        weight: GRAMS_PER_TROY_OUNCE / 2,
        spreadSell: 0.08,
        category: 'coin',
    });
    const soldOutBar = product({
        id: 3,
        sku: 'GB-SOLD',
        name: '10oz Gold Bar',
        stock: 0,
    });
    const silverBar = product({
        id: 4,
        sku: 'SB-1OZ',
        name: '1oz Silver Bar',
        metalType: 'SILVER',
    });
    const catalogue = [bar, coin, soldOutBar, silverBar];

    it('fails with 404 when there is no spot price for the metal', async () => {
        const service = build({ spot: null, catalogue });

        await expect(service.buildPortfolio(request())).rejects.toThrow(
            NotFoundException,
        );
    });

    it('fails with 400 when no in-stock product of that metal exists', async () => {
        const service = build({ catalogue: [soldOutBar, silverBar] });

        await expect(service.buildPortfolio(request())).rejects.toThrow(
            BadRequestException,
        );
    });

    it('fails with 400 when the budget cannot buy a single product', async () => {
        const service = build({ catalogue });

        // Cheapest gold product is the half-ounce coin at 1000 x 1.08 = 1080.
        await expect(
            service.buildPortfolio(request({ budget: 500 })),
        ).rejects.toThrow(BadRequestException);
    });

    it('never spends more than the budget, and only buys in-stock products of the requested metal', async () => {
        const service = build({ catalogue });

        const response = await service.buildPortfolio(
            request({ budget: 5000 }),
        );

        expect(response.results.length).toBeGreaterThan(0);
        for (const result of response.results) {
            expect(result.totalInvested).toBeLessThanOrEqual(5000);
            expect(result.unspent).toBeCloseTo(5000 - result.totalInvested, 6);
            const lineTotal = result.items.reduce(
                (sum, item) => sum + item.totalValue,
                0,
            );
            expect(lineTotal).toBeCloseTo(result.totalInvested, 6);
            for (const item of result.items) {
                expect(['1oz Gold Bar', '1/2oz Britannia Coin']).toContain(
                    item.product,
                );
            }
        }
    });

    it('only offers bars when asked for bars', async () => {
        const service = build({ catalogue });

        const response = await service.buildPortfolio(
            request({ productType: 'bar' }),
        );

        for (const result of response.results) {
            for (const item of result.items) expect(item.type).toBe('bar');
        }
    });

    it('prices from the custom spot the user is quoting from, not the market spot', async () => {
        const service = build({ catalogue, spot: { priceEur: 2000 } });

        const response = await service.buildPortfolio(
            request({ customSpot: 3000, budget: 10000, productType: 'bar' }),
        );

        // 1oz bar at spot 3000 + 5% premium = 3150 each.
        for (const result of response.results) {
            for (const item of result.items)
                expect(item.unitPrice).toBeCloseTo(3150, 6);
        }
    });

    it('reports the priority product id when it exists and null when it does not', async () => {
        const service = build({ catalogue });

        const known = await service.buildPortfolio(
            request({ priorityProductId: 2 }),
        );
        const unknown = await service.buildPortfolio(
            request({ priorityProductId: 999 }),
        );

        expect(known.priorityProductId).toBe(2);
        expect(unknown.priorityProductId).toBeNull();
    });
});
