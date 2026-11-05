import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SheetTasksService } from './sheet-tasks.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

const trade = (over: Record<string, unknown> = {}) => ({
    id: 1,
    reference: 'DU-G2026461',
    client: 'Test Client',
    branchCode: 'DU',
    metal: 'GOLD',
    qty: 5,
    productText: '1oz Krugerrand',
    date: new Date('2026-11-02T00:00:00Z'),
    receipt: 16890,
    totalPrice: null,
    cptyRaw: 'HEDGED',
    cptyKind: 'HEDGED',
    supplierInvoice: null,
    collected: false,
    lotId: null,
    notes: null,
    events: [] as unknown[],
    tasks: [] as unknown[],
    ...over,
});

function setup() {
    const tx = {
        orderEvent: { create: jest.fn() },
        sheetTask: {
            createMany: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
        },
        handover: { create: jest.fn() },
    };
    const prisma = {
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        trade: {
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn(),
        },
        sheetTask: {
            count: jest.fn().mockResolvedValue(0),
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn(),
        },
        handover: { findFirst: jest.fn() },
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const orders = new OrdersService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
    );
    const tasks = new SheetTasksService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
    );
    return { prisma, tx, audit, orders, tasks };
}

describe('OrdersService', () => {
    it('lists open orders, counts queues over everything, and hides quotes from "all"', async () => {
        const { prisma, orders } = setup();
        prisma.trade.findMany.mockResolvedValue([
            trade({ id: 1 }),
            trade({
                id: 2,
                reference: 'DU-G2026412',
                cptyKind: 'QUOTE_ONLY',
                cptyRaw: 'Quote Only',
            }),
            trade({
                id: 3,
                reference: 'DU-G2026455',
                cptyKind: 'SUPPLIER_INVOICE',
                cptyRaw: 'StoneX #511411',
                supplierInvoice: 'StoneX #511411',
            }),
        ]);
        const res = await orders.list({});
        expect(res.rows.map((r) => r.reference)).toEqual([
            'DU-G2026461',
            'DU-G2026455',
        ]);
        expect(res.counts).toMatchObject({
            all: 2,
            quote: 1,
            arrive: 1,
            alloc: 1,
        });
        expect(res.rows[0]).toMatchObject({
            lifecycle: 'PAID',
            nextAction: { who: 'broker', step: 'ALLOCATED' },
        });
    });

    it('filters by queue and search text', async () => {
        const { prisma, orders } = setup();
        prisma.trade.findMany.mockResolvedValue([
            trade({ id: 1 }),
            trade({
                id: 3,
                reference: 'DU-G2026455',
                client: 'Kavanagh',
                cptyKind: 'SUPPLIER_INVOICE',
                supplierInvoice: 'StoneX #1',
            }),
        ]);
        expect(
            (await orders.list({ queue: 'arrive' })).rows.map((r) => r.id),
        ).toEqual([3]);
        expect(
            (await orders.list({ q: 'kavan' })).rows.map((r) => r.id),
        ).toEqual([3]);
    });

    it('records a step as an event plus the sheet tasks, in one transaction, with an audit entry', async () => {
        const { prisma, tx, audit, orders } = setup();
        prisma.trade.findUnique.mockResolvedValue(trade());
        await orders.recordStep(
            1,
            'ALLOCATED',
            { serials: ['A1'], stockChange: 'Coins: 1oz Krugerrand 42 -> 37' },
            'a@b.ie',
        );
        expect(tx.orderEvent.create).toHaveBeenCalledWith({
            data: { tradeId: 1, step: 'ALLOCATED', by: 'a@b.ie', note: null },
        });
        const tasks = tx.sheetTask.createMany.mock.calls[0][0].data as {
            sheet: string;
            value: string;
        }[];
        expect(tasks.map((t) => t.sheet)).toEqual([
            'Stock sheet',
            'Customer safe sheet',
        ]);
        expect(tasks[1].value).toContain('A1');
        expect(audit.record).toHaveBeenCalledWith(
            'a@b.ie',
            'order-step',
            expect.stringContaining('ALLOCATED (2 sheet tasks)'),
            tx,
        );
    });

    it('refuses a step that does not follow the current stage', async () => {
        const { prisma, tx, orders } = setup();
        prisma.trade.findUnique.mockResolvedValue(trade());
        await expect(
            orders.recordStep(1, 'POSTED', {}, 'a@b.ie'),
        ).rejects.toBeInstanceOf(BadRequestException);
        expect(tx.orderEvent.create).not.toHaveBeenCalled();
    });

    it('throws for an unknown order', async () => {
        const { prisma, orders } = setup();
        prisma.trade.findUnique.mockResolvedValue(null);
        await expect(orders.get(9)).rejects.toBeInstanceOf(NotFoundException);
    });
});

describe('SheetTasksService', () => {
    const open = (
        id: number,
        check: string,
        value: string,
        t: { collected: boolean; cptyRaw: string | null },
    ) => ({ id, status: 'OPEN', check, value, tradeId: 1, trade: t });

    it('closes by import only the tasks the trades now show as done', async () => {
        const { prisma, tx, tasks } = setup();
        prisma.sheetTask.findMany.mockResolvedValue([
            open(1, 'TRADE_COLLECTED', 'C', { collected: true, cptyRaw: null }),
            open(2, 'TRADE_CPTY', 'DU-GP20261028', {
                collected: false,
                cptyRaw: 'HEDGED',
            }),
            open(3, 'TRADE_CPTY', 'DU-GP20261028', {
                collected: false,
                cptyRaw: 'DU-GP20261028',
            }),
        ]);
        expect(await tasks.reconcile('a@b.ie')).toEqual({
            checked: 3,
            closed: 2,
        });
        expect(tx.sheetTask.updateMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: { in: [1, 3] }, status: 'OPEN' },
                data: expect.objectContaining({ closedVia: 'IMPORT' }),
            }),
        );
    });

    it('writes nothing when nothing is done', async () => {
        const { prisma, tx, tasks } = setup();
        prisma.sheetTask.findMany.mockResolvedValue([
            open(1, 'TRADE_COLLECTED', 'C', {
                collected: false,
                cptyRaw: null,
            }),
        ]);
        expect(await tasks.reconcile('a@b.ie')).toEqual({
            checked: 1,
            closed: 0,
        });
        expect(tx.sheetTask.updateMany).not.toHaveBeenCalled();
    });

    it('ticks a task by hand once', async () => {
        const { prisma, tx, tasks } = setup();
        const base = {
            id: 4,
            tradeId: 1,
            reference: 'R',
            client: 'C',
            sheet: 'Stock sheet',
            what: 'x',
            value: 'v',
            check: 'MANUAL',
            createdAt: new Date(),
            createdBy: 'a',
            closedAt: null,
            closedBy: null,
            closedVia: null,
        };
        prisma.sheetTask.findUnique.mockResolvedValue({
            ...base,
            status: 'OPEN',
        });
        tx.sheetTask.update.mockResolvedValue({
            ...base,
            status: 'DONE',
            closedAt: new Date(),
            closedBy: 'a@b.ie',
            closedVia: 'MANUAL',
        });
        const done = await tasks.complete(4, 'a@b.ie');
        expect(done).toMatchObject({ status: 'DONE', closedVia: 'MANUAL' });
        prisma.sheetTask.findUnique.mockResolvedValue({
            ...base,
            status: 'DONE',
            closedAt: new Date(),
            closedBy: 'a',
            closedVia: 'MANUAL',
        });
        await tasks.complete(4, 'a@b.ie');
        expect(tx.sheetTask.update).toHaveBeenCalledTimes(1);
    });
});
