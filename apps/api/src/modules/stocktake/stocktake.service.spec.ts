import { BadRequestException, ConflictException } from '@nestjs/common';
import { StocktakeService } from './stocktake.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

const stocktakeRow = (over: Record<string, unknown> = {}) => ({
    id: 1,
    name: 'October 2026',
    countDate: new Date('2026-10-30T00:00:00Z'),
    cutoffDate: new Date('2026-10-31T00:00:00Z'),
    status: 'COUNTING',
    stocktakeLead: null,
    secondChecker: null,
    notes: null,
    createdBy: 'a@b.ie',
    finalisedBy: null,
    finalisedAt: null,
    createdAt: new Date('2026-10-28T09:00:00Z'),
    ...over,
});

function setup() {
    const tx = {
        stocktake: { create: jest.fn(), update: jest.fn() },
        stocktakeLine: {
            createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
        bcItem: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
    };
    const prisma = {
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        stocktake: { findUnique: jest.fn() },
        stocktakeLine: {
            count: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        stocktakeDiscrepancy: { count: jest.fn(), create: jest.fn() },
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const service = new StocktakeService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
    );
    return { service, prisma, tx, audit };
}

const JOURNAL =
    'Item No.\tDescription\tLocation Code\tQty. (Calculated)\n1005\t1oz Pamp Suisse\tDU\t5\n1012\tPlatinum\tDU\t1';

describe('StocktakeService.create', () => {
    it('rejects a cutoff before the count date', async () => {
        const { service } = setup();
        await expect(
            service.create(
                {
                    name: 'x',
                    countDate: '2026-10-30',
                    cutoffDate: '2026-10-29',
                },
                'a@b.ie',
            ),
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('allows a Friday count reconciled to a Saturday cutoff and audits it', async () => {
        const { service, tx, audit } = setup();
        tx.stocktake.create.mockResolvedValue(
            stocktakeRow({ status: 'DRAFT' }),
        );
        const created = await service.create(
            {
                name: 'October 2026',
                countDate: '2026-10-30',
                cutoffDate: '2026-10-31',
            },
            'a@b.ie',
        );
        expect(created.countDate).toBe('2026-10-30');
        expect(created.cutoffDate).toBe('2026-10-31');
        expect(audit.record).toHaveBeenCalledWith(
            'a@b.ie',
            'stocktake-create',
            expect.stringContaining('2026-10-31'),
            tx,
        );
    });
});

describe('StocktakeService.importJournal', () => {
    it('is repeat-safe: existing lines are skipped, not overwritten', async () => {
        const { service, prisma, tx } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        tx.stocktakeLine.createMany.mockResolvedValue({ count: 1 });

        const result = await service.importJournal(1, JOURNAL, 'a@b.ie');

        expect(tx.stocktakeLine.createMany).toHaveBeenCalledWith(
            expect.objectContaining({ skipDuplicates: true }),
        );
        expect(result).toEqual({ added: 1, skippedExisting: 1, issues: [] });
    });

    it('registers each BC item once without touching a linked product', async () => {
        const { service, prisma, tx } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        await service.importJournal(1, JOURNAL, 'a@b.ie');
        const arg = tx.bcItem.createMany.mock.calls[0][0] as {
            data: { itemNo: string }[];
            skipDuplicates: boolean;
        };
        expect(arg.data.map((d) => d.itemNo)).toEqual(['1005', '1012']);
        expect(arg.skipDuplicates).toBe(true);
    });

    it('reports rejected rows and writes nothing when none are valid', async () => {
        const { service, prisma } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        const result = await service.importJournal(
            1,
            'Item No.\tDescription\n1\tx',
            'a@b.ie',
        );
        expect(result.added).toBe(0);
        expect(result.issues[0]?.message).toMatch(/Missing column/);
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
});

describe('StocktakeService.updateLine', () => {
    it('marks a line counted when a count is entered', async () => {
        const { service, prisma } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        prisma.stocktakeLine.findFirst.mockResolvedValue({ id: 9 });
        prisma.stocktakeLine.update.mockResolvedValue({
            id: 9,
            itemNo: '1005',
            description: 'x',
            locationCode: 'DU',
            qtyCalculated: 5,
            countedNormal: 4,
            countedCustomer: 2,
            counted: true,
            reason: null,
            serialsChecked: null,
            serialNote: null,
            batchName: null,
            documentNo: null,
            entryType: null,
            unitAmount: null,
            unitCost: null,
        });
        const line = await service.updateLine(1, 9, {
            countedNormal: 4,
            countedCustomer: 2,
        });
        expect(prisma.stocktakeLine.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ counted: true }),
            }),
        );
        expect(line.variance).toBe(-1);
    });
});

describe('finalised stocktakes', () => {
    const cases: [string, (s: StocktakeService) => Promise<unknown>][] = [
        ['import', (s) => s.importJournal(1, JOURNAL, 'a')],
        ['count', (s) => s.updateLine(1, 9, { countedNormal: 1 })],
        ['edit', (s) => s.update(1, { notes: 'x' }, 'a')],
        [
            'add a discrepancy',
            (s) =>
                s.addDiscrepancy(
                    1,
                    {
                        description: 'x',
                        issueType: 'OTHER',
                        bcShows: '',
                        physicalFound: '',
                        action: '',
                    },
                    'a',
                ),
        ],
        ['finalise again', (s) => s.finalise(1, 'a')],
    ];
    it.each(cases)('refuses to %s', async (_name, act) => {
        const { service, prisma } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(
            stocktakeRow({ status: 'FINALISED' }),
        );
        await expect(act(service)).rejects.toBeInstanceOf(ConflictException);
    });
});

describe('StocktakeService.finalise', () => {
    it('will not finalise an empty stocktake', async () => {
        const { service, prisma } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        prisma.stocktakeLine.count.mockResolvedValue(0);
        prisma.stocktakeDiscrepancy.count.mockResolvedValue(0);
        await expect(service.finalise(1, 'a')).rejects.toBeInstanceOf(
            BadRequestException,
        );
    });

    it('finalises with unresolved discrepancies and records how many', async () => {
        const { service, prisma, tx, audit } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        prisma.stocktakeLine.count.mockResolvedValue(12);
        prisma.stocktakeDiscrepancy.count.mockResolvedValue(3);
        tx.stocktake.update.mockResolvedValue(
            stocktakeRow({ status: 'FINALISED', finalisedBy: 'a' }),
        );
        const out = await service.finalise(1, 'a');
        expect(out.status).toBe('FINALISED');
        expect(audit.record).toHaveBeenCalledWith(
            'a',
            'stocktake-finalise',
            expect.stringContaining('3 unresolved'),
            tx,
        );
    });

    it('cannot be reached through the generic status update', async () => {
        const { service, prisma } = setup();
        prisma.stocktake.findUnique.mockResolvedValue(stocktakeRow());
        await expect(
            service.update(1, { status: 'FINALISED' }, 'a'),
        ).rejects.toBeInstanceOf(BadRequestException);
    });
});
