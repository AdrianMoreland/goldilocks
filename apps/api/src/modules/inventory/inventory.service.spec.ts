import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InventoryService } from './inventory.service';

const date = (s: string) => new Date(`${s}T00:00:00.000Z`);

function setup() {
    const prisma = {
        stocktake: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
        stocktakeBar: { findMany: jest.fn() },
        stocktakeCoin: { findMany: jest.fn() },
        customerOrderItem: { findMany: jest.fn() },
    };
    prisma.stocktake.findMany.mockResolvedValue([]);
    prisma.customerOrderItem.findMany.mockResolvedValue([]);
    return { prisma, service: new InventoryService(prisma as never) };
}

const st = {
    id: 3,
    name: 'Imported: safe',
    countDate: date('2026-10-29'),
    status: 'DRAFT',
    imported: true,
};

describe('InventoryService', () => {
    describe('position', () => {
        it('says so when there is no stocktake yet', async () => {
            const { service, prisma } = setup();
            prisma.stocktake.findFirst.mockResolvedValue(null);
            const p = await service.position();
            expect(p.stocktake).toBeNull();
            expect(p.bars.total).toBe(0);
        });

        it('counts bars and coins from the newest stocktake and labels an imported one', async () => {
            const { service, prisma } = setup();
            prisma.stocktake.findFirst.mockResolvedValue(st);
            prisma.stocktake.findMany.mockResolvedValue([st]);
            prisma.stocktakeBar.findMany.mockResolvedValue([
                { metal: 'GOLD', serial: 'AA 099165', status: 'CONFIRMED' },
                { metal: 'GOLD', serial: 'AA099166', status: 'UNCONFIRMED' },
                { metal: 'SILVER', serial: null, status: 'NEW' },
                { metal: 'GOLD', serial: 'ZZ000001', status: 'GONE' },
            ]);
            prisma.stocktakeCoin.findMany.mockResolvedValue([
                { metal: 'GOLD', countedQty: 12 },
                { metal: 'GOLD', countedQty: 3 },
                { metal: 'SILVER', countedQty: null },
            ]);
            prisma.customerOrderItem.findMany.mockResolvedValue([
                {
                    id: 9,
                    reference: 'DU-G1',
                    client: 'Fake Person',
                    status: 'BAGGED',
                    serials: 'AA099165, ab1',
                },
            ]);

            const p = await service.position();
            expect(p.stocktake).toEqual({
                id: 3,
                name: 'Imported: safe',
                countDate: '2026-10-29',
                status: 'DRAFT',
                imported: true,
            });
            expect(p.bars).toEqual({
                total: 3,
                byMetal: { GOLD: 2, SILVER: 1 },
                heldForCustomers: 1,
                gone: 1,
            });
            expect(p.coins).toEqual({
                lines: 3,
                pieces: 15,
                byMetal: { GOLD: 15, SILVER: 0 },
                uncounted: 1,
            });
        });

        it('rejects a bad stocktake id and a missing stocktake', async () => {
            const { service, prisma } = setup();
            await expect(service.position('abc')).rejects.toBeInstanceOf(
                BadRequestException,
            );
            prisma.stocktake.findUnique.mockResolvedValue(null);
            await expect(service.position('99')).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('bars', () => {
        const bars = [
            {
                id: 1,
                serial: 'AA099165',
                refinery: 'VALCAMBI',
                weightLabel: '1oz',
                metal: 'GOLD',
                locationCode: 'DU',
                status: 'CONFIRMED',
                details: null,
            },
            {
                id: 2,
                serial: 'BB000002',
                refinery: 'PAMP',
                weightLabel: '1oz',
                metal: 'GOLD',
                locationCode: 'DU',
                status: 'CONFIRMED',
                details: null,
            },
            {
                id: 3,
                serial: null,
                refinery: null,
                weightLabel: '100g',
                metal: 'GOLD',
                locationCode: 'BL',
                status: 'NEW',
                details: null,
            },
        ];

        it('shows which open customer order holds a bar, and filters held and free', async () => {
            const { service, prisma } = setup();
            prisma.stocktake.findFirst.mockResolvedValue(st);
            prisma.stocktakeBar.findMany.mockResolvedValue(bars);
            prisma.customerOrderItem.findMany.mockResolvedValue([
                {
                    id: 9,
                    reference: 'DU-G1',
                    client: 'Fake Person',
                    status: 'ALLOCATED',
                    serials: 'aa-099165',
                },
            ]);

            const all = await service.bars({});
            expect(all.total).toBe(3);
            expect(all.rows[0].heldFor).toEqual({
                orderId: 9,
                reference: 'DU-G1',
                client: 'Fake Person',
                status: 'ALLOCATED',
            });
            expect(all.rows[1].heldFor).toBeNull();

            expect(
                (await service.bars({ where: 'held' })).rows.map((r) => r.id),
            ).toEqual([1]);
            expect(
                (await service.bars({ where: 'free' })).rows.map((r) => r.id),
            ).toEqual([2, 3]);
        });

        it('filters by metal, branch and serial in the query, and pages', async () => {
            const { service, prisma } = setup();
            prisma.stocktake.findFirst.mockResolvedValue(st);
            prisma.stocktakeBar.findMany.mockResolvedValue(bars);
            const res = await service.bars({
                metal: 'GOLD',
                branch: 'du',
                q: 'AA09',
                limit: '1',
                offset: '1',
            });
            expect(prisma.stocktakeBar.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        stocktakeId: 3,
                        metal: 'GOLD',
                        locationCode: 'DU',
                        serial: { contains: 'AA09', mode: 'insensitive' },
                    },
                }),
            );
            expect(res.total).toBe(3);
            expect(res.rows).toHaveLength(1);
            expect(res.rows[0].id).toBe(2);
        });

        it('rejects a bad query', async () => {
            const { service } = setup();
            await expect(
                service.bars({ metal: 'COPPER' }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('coins', () => {
        it('lists counted and previous quantities for a stocktake', async () => {
            const { service, prisma } = setup();
            prisma.stocktake.findFirst.mockResolvedValue(st);
            prisma.stocktakeCoin.findMany.mockResolvedValue([
                {
                    id: 1,
                    item: '1oz Krugerrand',
                    metal: 'GOLD',
                    locationCode: 'DU',
                    previousQty: 10,
                    countedQty: 12,
                    details: null,
                },
            ]);
            const res = await service.coins({ metal: 'GOLD' });
            expect(prisma.stocktakeCoin.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { stocktakeId: 3, metal: 'GOLD' },
                }),
            );
            expect(res.rows[0]).toMatchObject({
                item: '1oz Krugerrand',
                previousQty: 10,
                countedQty: 12,
            });
        });

        it('returns nothing when there is no stocktake', async () => {
            const { service, prisma } = setup();
            prisma.stocktake.findFirst.mockResolvedValue(null);
            expect(await service.coins({})).toEqual({ rows: [] });
        });
    });
});
