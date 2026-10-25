import { TradeService } from './trade.service';
import {
    GRAMS_PER_TROY_OUNCE,
    MELT_CATEGORIES,
} from '@goldilocks/shared-types';

describe('TradeService.calculateCart VAT', () => {
    const SPOT = 50;
    const product = (name: string, vatRate: number) => ({
        id: 1,
        sku: 'X',
        name,
        metalType: 'SILVER',
        weight: GRAMS_PER_TROY_OUNCE * 100, // 100 oz
        vatRate,
    });

    const build = (found: ReturnType<typeof product>) =>
        new TradeService(
            {
                getLatest: jest.fn().mockResolvedValue({ priceEur: SPOT }),
            } as never,
            { findById: jest.fn().mockResolvedValue(found) } as never,
        );

    const request = (
        transactionType: 'buying' | 'selling',
        percent: number,
    ) => ({
        metalType: 'SILVER' as const,
        transactionType,
        items: [{ productId: 1, percent, quantity: 1 }],
    });

    it('adds VAT to the price a customer pays for a regular product', async () => {
        const cart = await build(product('1kg Silver Bar', 0.23)).calculateCart(
            request('buying', 10),
        );
        // 100 oz at 50/oz = 5000, +10% premium, +23% VAT
        expect(cart.lines[0].unitPrice).toBe(Math.ceil(5000 * 1.1 * 1.23));
    });

    it('adds no VAT for a bonded product', async () => {
        const cart = await build(
            product('100 oz Silver Bonded Bar', 0.23),
        ).calculateCart(request('buying', 10));
        expect(cart.lines[0].unitPrice).toBe(5500);
    });

    it('never adds VAT to a buyback', async () => {
        const cart = await build(product('1kg Silver Bar', 0.23)).calculateCart(
            request('selling', 10),
        );
        expect(cart.lines[0].unitPrice).toBe(4500);
    });
});

describe('TradeService.calculateMelt rounding', () => {
    it('rounds the payout down, as it is money we pay out', async () => {
        const service = new TradeService(
            {
                getLatest: jest.fn().mockResolvedValue({ priceEur: 1000 }),
            } as never,
            {} as never,
        );
        const melt = await service.calculateMelt({
            category: Object.keys(MELT_CATEGORIES)[0] as never,
            weight: 1.234,
        });
        expect(melt.meltValue).toBe(Math.floor(melt.meltValue));
        expect(melt.meltValue).toBeGreaterThan(0);
    });
});
