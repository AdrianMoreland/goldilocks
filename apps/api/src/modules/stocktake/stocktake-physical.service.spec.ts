import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StocktakePhysicalService } from './stocktake-physical.service';
import type { StocktakeService } from './stocktake.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

const bar = (over: Record<string, unknown> = {}) => ({
    id: 1,
    stocktakeId: 10,
    metal: 'GOLD',
    locationCode: 'DU',
    weightLabel: '100g Bar',
    refinery: 'Metalor',
    serial: '046156',
    grams: null,
    details: null,
    status: 'CONFIRMED',
    carriedFromId: null,
    ...over,
});

type BarCreate = {
    data: { carriedFromId?: number; status: string; serial?: string }[];
};

function setup() {
    const tx = {
        stocktakeBar: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        stocktakeCoin: {
            createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
    };
    const prisma = {
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        stocktake: { findUnique: jest.fn(), findFirst: jest.fn() },
        stocktakeBar: {
            findMany: jest.fn().mockResolvedValue([]),
            findFirst: jest.fn(),
            delete: jest.fn(),
        },
        stocktakeCoin: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const stocktakes = { requireOpen: jest.fn().mockResolvedValue({}) };
    const service = new StocktakePhysicalService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
        stocktakes as unknown as StocktakeService,
    );
    return { service, prisma, tx, audit };
}

const september = { id: 5, name: 'September', status: 'FINALISED' };

describe('StocktakePhysicalService.carryForward', () => {
    it('carries only bars that were seen, as unconfirmed, and records where each came from', async () => {
        const { service, prisma, tx } = setup();
        prisma.stocktake.findFirst.mockResolvedValue(september);
        prisma.stocktakeBar.findMany
            .mockResolvedValueOnce([
                bar({ id: 1, status: 'CONFIRMED' }),
                bar({ id: 2, serial: null, status: 'NEW' }),
                bar({ id: 3, serial: 'X9', status: 'UNCONFIRMED' }),
                bar({ id: 4, serial: 'Y8', status: 'GONE' }),
            ])
            .mockResolvedValueOnce([]);
        tx.stocktakeBar.createMany.mockResolvedValue({ count: 2 });

        const result = await service.carryForward(10, undefined, 'a@b.ie');

        const { data } = tx.stocktakeBar.createMany.mock
            .calls[0][0] as BarCreate;
        expect(data.map((d) => d.carriedFromId)).toEqual([1, 2]);
        expect(data.every((d) => d.status === 'UNCONFIRMED')).toBe(true);
        expect(result).toMatchObject({
            fromStocktakeId: 5,
            barsCarried: 2,
            barsAlreadyThere: 0,
        });
    });

    it('is repeat-safe: a bar already carried from the same source row is not copied again', async () => {
        const { service, prisma, tx } = setup();
        prisma.stocktake.findFirst.mockResolvedValue(september);
        prisma.stocktakeBar.findMany
            .mockResolvedValueOnce([
                bar({ id: 1 }),
                bar({ id: 2, serial: 'B' }),
            ])
            .mockResolvedValueOnce([{ carriedFromId: 1 }]);
        const result = await service.carryForward(10, undefined, 'a@b.ie');
        const { data } = tx.stocktakeBar.createMany.mock
            .calls[0][0] as BarCreate;
        expect(data).toHaveLength(1);
        expect(result.barsAlreadyThere).toBe(1);
    });

    it('carries counted coin lines as the previous quantity and skips uncounted ones', async () => {
        const { service, prisma, tx } = setup();
        prisma.stocktake.findFirst.mockResolvedValue(september);
        prisma.stocktakeCoin.findMany.mockResolvedValue([
            {
                metal: 'GOLD',
                locationCode: '',
                item: '1oz Krugerrand',
                countedQty: 23,
            },
        ]);
        tx.stocktakeCoin.createMany.mockResolvedValue({ count: 1 });
        const result = await service.carryForward(10, undefined, 'a@b.ie');
        expect(prisma.stocktakeCoin.findMany).toHaveBeenCalledWith({
            where: { stocktakeId: 5, countedQty: { not: null } },
        });
        const { data } = tx.stocktakeCoin.createMany.mock.calls[0][0] as {
            data: { previousQty: number }[];
        };
        expect(data[0]?.previousQty).toBe(23);
        expect(result.coinsCarried).toBe(1);
    });

    it('refuses when there is no finalised stocktake, or the chosen one is not finalised', async () => {
        const { service, prisma } = setup();
        prisma.stocktake.findFirst.mockResolvedValue(null);
        await expect(
            service.carryForward(10, undefined, 'a'),
        ).rejects.toBeInstanceOf(NotFoundException);
        prisma.stocktake.findUnique.mockResolvedValue({
            id: 5,
            name: 'X',
            status: 'COUNTING',
        });
        await expect(service.carryForward(10, 5, 'a')).rejects.toBeInstanceOf(
            BadRequestException,
        );
    });
});

describe('StocktakePhysicalService.deleteBar', () => {
    it('lets a hand-added bar be deleted', async () => {
        const { service, prisma } = setup();
        prisma.stocktakeBar.findFirst.mockResolvedValue(
            bar({ status: 'NEW', carriedFromId: null }),
        );
        await service.deleteBar(10, 1);
        expect(prisma.stocktakeBar.delete).toHaveBeenCalled();
    });

    it('refuses to delete a carried bar, which must be marked gone so the history stays', async () => {
        const { service, prisma } = setup();
        prisma.stocktakeBar.findFirst.mockResolvedValue(
            bar({ status: 'UNCONFIRMED', carriedFromId: 7 }),
        );
        await expect(service.deleteBar(10, 1)).rejects.toBeInstanceOf(
            BadRequestException,
        );
        expect(prisma.stocktakeBar.delete).not.toHaveBeenCalled();
    });
});

describe('StocktakePhysicalService.importBars', () => {
    const PASTE =
        'Branch\tWeight\tRefinery\tSerial\nDU\t100g Bar\tMetalor\t046156\nDU\t100g Bar\tMetalor\tC1';

    it('skips a serial already on the register and adds the rest as unconfirmed', async () => {
        const { service, prisma, tx } = setup();
        prisma.stocktakeBar.findMany.mockResolvedValue([
            {
                locationCode: 'DU',
                weightLabel: '100g Bar',
                refinery: 'Metalor',
                serial: '046156',
                status: 'CONFIRMED',
            },
        ]);
        tx.stocktakeBar.createMany.mockResolvedValue({ count: 1 });
        const result = await service.importBars(10, 'GOLD', PASTE, 'a');
        expect(result).toMatchObject({ added: 1, skipped: 1 });
        const { data } = tx.stocktakeBar.createMany.mock
            .calls[0][0] as BarCreate;
        expect(data).toHaveLength(1);
        expect(data[0]).toMatchObject({ serial: 'C1', status: 'UNCONFIRMED' });
    });

    it('writes nothing for a paste with no valid rows', async () => {
        const { service, prisma } = setup();
        const result = await service.importBars(10, 'GOLD', 'Serial\nA1', 'a');
        expect(result.added).toBe(0);
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
});
