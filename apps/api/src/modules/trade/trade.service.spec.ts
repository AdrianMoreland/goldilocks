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
            { findByIds: jest.fn().mockResolvedValue([found]) } as never,
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

describe('TradeService.calculateCart product lookup', () => {
    const product = (id: number) => ({
        id,
        sku: `X${id}`,
        name: `Silver Bar ${id}`,
        metalType: 'SILVER',
        weight: GRAMS_PER_TROY_OUNCE,
        vatRate: 0.23,
    });
    const build = (found: ReturnType<typeof product>[]) => {
        const findByIds = jest.fn().mockResolvedValue(found);
        const service = new TradeService(
            {
                getLatest: jest.fn().mockResolvedValue({ priceEur: 50 }),
            } as never,
            { findByIds } as never,
        );
        return { service, findByIds };
    };
    const line = (productId: number) => ({
        productId,
        percent: 5,
        quantity: 1,
    });

    it('loads the products of a cart in one lookup over distinct ids', async () => {
        const { service, findByIds } = build([product(1), product(2)]);
        const cart = await service.calculateCart({
            metalType: 'SILVER',
            transactionType: 'buying',
            items: [line(1), line(2), line(1)],
        });
        expect(findByIds).toHaveBeenCalledTimes(1);
        expect(findByIds).toHaveBeenCalledWith([1, 2]);
        expect(cart.lines).toHaveLength(3);
    });

    it('still reports a product that was not found', async () => {
        const { service } = build([product(1)]);
        await expect(
            service.calculateCart({
                metalType: 'SILVER',
                transactionType: 'buying',
                items: [line(1), line(9)],
            }),
        ).rejects.toThrow('Product 9 not found.');
    });
});
