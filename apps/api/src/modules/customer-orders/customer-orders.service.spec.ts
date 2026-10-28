import { NotFoundException } from '@nestjs/common';
import { CustomerOrdersService } from './customer-orders.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

const row = (over: Record<string, unknown> = {}) => ({
    id: 1,
    locationCode: 'DU',
    client: 'David Caulfield',
    reference: 'DU-G202608147',
    bcOrderNo: null,
    supplierRef: null,
    metal: 'GOLD',
    product: '1oz Krugerrand',
    bcItemNo: null,
    quantity: 4,
    refinery: null,
    serials: null,
    status: 'BAGGED',
    orderedOn: new Date('2026-09-28T00:00:00Z'),
    missing: false,
    notes: null,
    createdBy: 'a@b.ie',
    createdAt: new Date('2026-10-28T09:00:00Z'),
    updatedAt: new Date('2026-10-28T09:00:00Z'),
    evidence: [],
    ...over,
});

function setup() {
    const tx = {
        customerOrderItem: {
            create: jest.fn(),
            update: jest.fn(),
            createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
    };
    const prisma = {
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        customerOrderItem: {
            findUnique: jest.fn(),
            findUniqueOrThrow: jest.fn(),
            findMany: jest.fn().mockResolvedValue([]),
        },
        customerOrderEvidence: { create: jest.fn() },
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const service = new CustomerOrdersService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
    );
    return { service, prisma, tx, audit };
}

describe('CustomerOrdersService.update', () => {
    it('audits a status change with the old and new status in words', async () => {
        const { service, prisma, tx, audit } = setup();
        prisma.customerOrderItem.findUnique.mockResolvedValue(
            row({ status: 'BAGGED' }),
        );
        tx.customerOrderItem.update.mockResolvedValue(
            row({ status: 'COLLECTED' }),
        );
        const out = await service.update(1, { status: 'COLLECTED' }, 'a@b.ie');
        expect(out.status).toBe('COLLECTED');
        expect(audit.record).toHaveBeenCalledWith(
            'a@b.ie',
            'customer-order-status',
            expect.stringContaining('Bagged (customer safe) -> Collected'),
            tx,
        );
    });

    it('does not audit an edit that leaves the status alone, and 404s on an unknown id', async () => {
        const { service, prisma, tx, audit } = setup();
        prisma.customerOrderItem.findUnique.mockResolvedValue(row());
        tx.customerOrderItem.update.mockResolvedValue(row({ notes: 'x' }));
        await service.update(1, { notes: 'x' }, 'a');
        expect(audit.record).not.toHaveBeenCalled();
        prisma.customerOrderItem.findUnique.mockResolvedValue(null);
        await expect(service.update(9, {}, 'a')).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });
});

describe('CustomerOrdersService.addEvidence', () => {
    it('only ever creates evidence rows, naming who recorded them', async () => {
        const { service, prisma } = setup();
        prisma.customerOrderItem.findUnique.mockResolvedValue(row());
        prisma.customerOrderItem.findUniqueOrThrow.mockResolvedValue(row());
        await service.addEvidence(
            1,
            { kind: 'SIGNED_INVOICE', reference: 'INV-9' },
            'a@b.ie',
        );
        expect(prisma.customerOrderEvidence.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                itemId: 1,
                kind: 'SIGNED_INVOICE',
                reference: 'INV-9',
                recordedBy: 'a@b.ie',
            }),
        });
    });
});

describe('CustomerOrdersService.importSheet', () => {
    const SHEET =
        'STATUS\tBRANCH\tClient\tReference\tQTY\tProduct\nBagged\tDU\tDavid Caulfield\tDU-G202608147\t4\t1oz Krugerrand\nBagged\tDU\tBad\t\t0\tx';

    it('adds new rows with the chosen metal and reports rejected ones', async () => {
        const { service, prisma, tx } = setup();
        tx.customerOrderItem.createMany.mockResolvedValue({ count: 1 });
        const result = await service.importSheet(
            { metal: 'GOLD', text: SHEET },
            'a',
        );
        expect(result).toMatchObject({ added: 1, skipped: 0 });
        expect(result.issues).toHaveLength(1);
        const data = (
            tx.customerOrderItem.createMany.mock.calls[0][0] as {
                data: { metal: string; status: string }[];
            }
        ).data;
        expect(data[0]).toMatchObject({ metal: 'GOLD', status: 'BAGGED' });
        expect(prisma.customerOrderItem.findMany).toHaveBeenCalled();
    });

    it('skips a row that is already stored, so a repeat paste adds nothing', async () => {
        const { service, prisma } = setup();
        prisma.customerOrderItem.findMany.mockResolvedValue([
            {
                locationCode: 'DU',
                client: 'david caulfield',
                reference: 'du-g202608147',
                product: '1oz krugerrand',
                quantity: 4,
            },
        ]);
        const result = await service.importSheet(
            { metal: 'GOLD', text: SHEET },
            'a',
        );
        expect(result).toMatchObject({ added: 0, skipped: 1 });
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
});

describe('CustomerOrdersService.expectedStock', () => {
    it('totals only items physically here, by branch and product', async () => {
        const { service, prisma } = setup();
        prisma.customerOrderItem.findMany.mockResolvedValue([
            {
                locationCode: 'DU',
                product: '1oz Krugerrand',
                quantity: 4,
                status: 'BAGGED',
            },
            {
                locationCode: 'DU',
                product: '1oz Krugerrand',
                quantity: 1,
                status: 'DELIVERED',
            },
        ]);
        expect(await service.expectedStock()).toEqual([
            { locationCode: 'DU', product: '1oz Krugerrand', quantity: 5 },
        ]);
        expect(prisma.customerOrderItem.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { status: { in: ['DELIVERED', 'BAGGED'] } },
            }),
        );
    });
});
