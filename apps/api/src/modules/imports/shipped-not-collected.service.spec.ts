import { ShippedNotCollectedService } from './shipped-not-collected.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

const trade = (id: number, reference: string, openTasks: number) => ({
    id,
    reference,
    productText: '1oz bar',
    qty: 1,
    date: new Date('2026-10-28T00:00:00Z'),
    customer: { redactionCode: 'C000041' },
    tasks: Array.from({ length: openTasks }, (_, i) => ({ id: i + 1 })),
});

function setup() {
    const shipments = [
        {
            no: 'SHP-100150',
            postingDate: new Date('2026-10-29T00:00:00Z'),
            trade: trade(1, 'DU-G20261028', 0),
        },
        {
            no: 'SHP-100121',
            postingDate: new Date('2026-10-20T00:00:00Z'),
            trade: trade(2, 'DU-G202609107', 1),
        },
        // The same sale shipped in two parts: listed once.
        {
            no: 'SHP-100120',
            postingDate: new Date('2026-10-15T00:00:00Z'),
            trade: trade(1, 'DU-G20261028', 0),
        },
    ];
    const createMany = jest.fn();
    const prisma = {
        bcShipment: { findMany: jest.fn().mockResolvedValue(shipments) },
        trade: {
            findMany: jest
                .fn()
                .mockResolvedValue([
                    { id: 1, reference: 'DU-G20261028', client: 'C000041' },
                ]),
        },
        sheetTask: { createMany },
        $transaction: (fn: (tx: unknown) => Promise<unknown>) =>
            fn({ sheetTask: { createMany } }),
    } as unknown as PrismaService;
    const record = jest.fn();
    const audit = { record } as unknown as AuditLogService;
    return {
        service: new ShippedNotCollectedService(prisma, audit),
        createMany,
        record,
    };
}

describe('ShippedNotCollectedService', () => {
    it('lists each shipped sale once, with its latest shipment and whether a task is open', async () => {
        const { service } = setup();
        expect(await service.list()).toEqual([
            {
                tradeId: 1,
                reference: 'DU-G20261028',
                customerCode: 'C000041',
                product: '1oz bar',
                qty: 1,
                saleDate: '2026-10-28',
                shipmentNo: 'SHP-100150',
                shippedOn: '2026-10-29',
                taskOpen: false,
            },
            {
                tradeId: 2,
                reference: 'DU-G202609107',
                customerCode: 'C000041',
                product: '1oz bar',
                qty: 1,
                saleDate: '2026-10-28',
                shipmentNo: 'SHP-100121',
                shippedOn: '2026-10-20',
                taskOpen: true,
            },
        ]);
    });

    it('creates a "tick Collected" task only for sales without one, and audits it', async () => {
        const { service, createMany, record } = setup();
        const result = await service.createTasks('owner@example.com');
        expect(result).toEqual({ created: 1, alreadyOpen: 1 });
        expect(createMany).toHaveBeenCalledWith({
            data: [
                expect.objectContaining({
                    tradeId: 1,
                    reference: 'DU-G20261028',
                    sheet: 'Tradesheet',
                    value: 'C',
                    check: 'TRADE_COLLECTED',
                    createdBy: 'owner@example.com',
                }),
            ],
        });
        expect(record).toHaveBeenCalled();
    });
});
