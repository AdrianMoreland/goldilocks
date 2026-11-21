import { PriceSnapshotService } from './price-snapshot.service';

function product(id: number, metalType: string, isActive = true) {
    return {
        id,
        metalType,
        isActive,
        spotPrice: metalType === 'GOLD' ? 3500 : 40,
        spreadSell: 0.05,
        spreadBuy: -0.02,
        priceSell: 1200,
        priceBuy: 1100,
    };
}

describe('PriceSnapshotService.capture', () => {
    function setup(catalogue: {
        products: unknown[];
        degradedMetals: string[];
    }) {
        const upsert = jest.fn().mockResolvedValue({});
        const prisma = {
            productPriceSnapshot: { upsert },
            $transaction: jest.fn((ops: Promise<unknown>[]) =>
                Promise.all(ops),
            ),
        };
        const marketData = {
            getPricedCatalogue: jest.fn().mockResolvedValue(catalogue),
        };
        return {
            service: new PriceSnapshotService(
                prisma as never,
                marketData as never,
            ),
            upsert,
        };
    }

    it('writes one row per active product for the Dublin day, replacing an earlier run that day', async () => {
        const { service, upsert } = setup({
            products: [
                product(1, 'GOLD'),
                product(2, 'SILVER'),
                product(3, 'GOLD', false),
            ],
            degradedMetals: [],
        });
        await expect(
            service.capture(new Date('2026-11-21T23:30:00Z')),
        ).resolves.toBe(2);
        expect(upsert).toHaveBeenCalledTimes(2);
        const first = upsert.mock.calls[0][0];
        // 23:30 UTC on 21 Nov is still 21 Nov in Dublin (GMT in winter).
        expect(first.where).toEqual({
            productId_day: {
                productId: 1,
                day: new Date('2026-11-21T00:00:00Z'),
            },
        });
        expect(first.create).toMatchObject({
            productId: 1,
            metalType: 'GOLD',
            sellPriceEur: 1200,
            buyPriceEur: 1100,
        });
    });

    it('skips a metal with no usable spot, so a feed outage never records €0 prices', async () => {
        const { service, upsert } = setup({
            products: [product(1, 'GOLD'), product(2, 'SILVER')],
            degradedMetals: ['SILVER'],
        });
        await expect(
            service.capture(new Date('2026-11-21T17:00:00Z')),
        ).resolves.toBe(1);
        expect(upsert.mock.calls[0][0].create.productId).toBe(1);
    });
});
