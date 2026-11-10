import { BadRequestException } from '@nestjs/common';
import type { TradesheetImportRequest } from '@goldilocks/shared-types';
import { TradesheetImportService } from './tradesheet-import.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

const SALE_HEADERS = [
    'Branch:',
    'Client:',
    'QTY:',
    'Product:',
    'Date:',
    'CPTY:',
    'Cost:',
    'Receipt:',
    'Collected:',
    'NOTES:',
    'Reference:',
];
const LOT_HEADERS = [
    'Branch',
    'Client',
    'QTY',
    'Product',
    'Received',
    'Price Paid',
    'Price / Item',
    'Hedged At',
    'Comments',
    'Reference',
];

const request = (
    over: Partial<TradesheetImportRequest> = {},
): TradesheetImportRequest => ({
    fileName: 'October 2026 - EU Trade Sheet.xlsx',
    sheetMonth: '2026-10',
    source: 'TRADESHEET',
    tabs: [
        {
            name: 'IE - Gold',
            headerRow: 1,
            headers: SALE_HEADERS,
            rows: [
                {
                    row: 2,
                    cells: [
                        'DU',
                        'Tom',
                        20,
                        '1oz Krugerrand',
                        '2026-10-01T00:00:00.000Z',
                        'HEDGED',
                        null,
                        null,
                        null,
                        null,
                        'DU-G20261002',
                    ],
                },
            ],
        },
        {
            name: 'IE-GP',
            headerRow: 1,
            headers: LOT_HEADERS,
            rows: [
                {
                    row: 2,
                    cells: [
                        'DU',
                        'John',
                        3,
                        '250g bar',
                        '2026-10-01T00:00:00.000Z',
                        85803,
                        28601,
                        3695.7,
                        '1 sold',
                        'DU-GP20261002',
                    ],
                },
            ],
        },
    ],
    ...over,
});

function setup(
    existing: {
        trades?: unknown[];
        lots?: unknown[];
        unitCount?: number;
        /** Sales and lots as the allocation step reads them back after the writes. */
        allocTrades?: unknown[];
        allocLots?: unknown[];
    } = {},
) {
    const tx = {
        product: {
            findMany: jest.fn().mockResolvedValue([
                { id: 7, sku: 'GOLD-1OZ-KRUGERRAND-COIN', metalType: 'GOLD' },
                { id: 8, sku: 'GOLD-250G-BAR', metalType: 'GOLD' },
            ]),
        },
        productAlias: {
            findMany: jest.fn().mockResolvedValue([
                {
                    alias: '1oz krugerrand',
                    productId: 7,
                    salesProductId: null,
                },
            ]),
        },
        salesProduct: { findMany: jest.fn().mockResolvedValue([]) },
        branch: {
            findMany: jest.fn().mockResolvedValue([{ id: 3, name: 'DU' }]),
        },
        trade: {
            // The allocation step selects columns; the planning reads do not.
            findMany: jest
                .fn()
                .mockImplementation((args: { select?: unknown }) =>
                    Promise.resolve(
                        args.select
                            ? (existing.allocTrades ?? [])
                            : (existing.trades ?? []),
                    ),
                ),
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
            update: jest.fn(),
            updateMany: jest.fn(),
        },
        purchaseLot: {
            findMany: jest
                .fn()
                .mockImplementation((args: { select?: unknown }) =>
                    Promise.resolve(
                        args.select
                            ? (existing.allocLots ?? [])
                            : (existing.lots ?? []),
                    ),
                ),
            createManyAndReturn: jest
                .fn()
                .mockResolvedValue([
                    { id: 50, referenceKey: 'DUGP20261002', occurrence: 1 },
                ]),
            update: jest.fn(),
            updateMany: jest.fn(),
        },
        stockUnit: {
            count: jest.fn().mockResolvedValue(existing.unitCount ?? 0),
            createMany: jest.fn(),
            deleteMany: jest.fn(),
            updateMany: jest.fn(),
        },
        importBatch: { create: jest.fn().mockResolvedValue({ id: 11 }) },
    };
    const prisma = {
        ...tx,
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const service = new TradesheetImportService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
    );
    return { service, prisma, tx, audit };
}

describe('TradesheetImportService.preview', () => {
    it('reports what would be added and writes nothing', async () => {
        const { service, prisma, tx } = setup();
        const plan = await service.preview(request());
        expect(plan.totals).toMatchObject({ added: 2, changed: 0, missing: 0 });
        expect(plan.warnings).toEqual([]);
        expect(plan.tabs[0].productMatches).toEqual({
            saved: 1,
            rule: 0,
            none: 0,
        });
        expect(plan.tabs[1].productMatches).toEqual({
            saved: 0,
            rule: 1,
            none: 0,
        });
        expect(prisma.$transaction).not.toHaveBeenCalled();
        expect(tx.trade.createMany).not.toHaveBeenCalled();
        expect(tx.importBatch.create).not.toHaveBeenCalled();
    });
});

describe('TradesheetImportService.preview: saved decisions', () => {
    it('warns when there are none yet', async () => {
        const { service, tx } = setup();
        tx.productAlias.findMany.mockResolvedValue([]);
        const plan = await service.preview(request());
        expect(plan.warnings).toEqual([
            'No saved product-name decisions yet: products are matched by built-in rules only.',
        ]);
    });
});

describe('TradesheetImportService.commit', () => {
    it('stores the batch, the sale and the lot, one stock row per gold item, and audits it', async () => {
        const { service, tx, audit } = setup();
        const result = await service.commit(request(), 'admin@merrion.ie');

        expect(result.batchId).toBe(11);
        expect(tx.importBatch.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    sheetMonth: '2026-10',
                    importedBy: 'admin@merrion.ie',
                }),
            }),
        );

        const trade = (
            tx.trade.createMany.mock.calls[0]![0] as {
                data: Array<Record<string, unknown>>;
            }
        ).data[0];
        expect(trade).toMatchObject({
            reference: 'DU-G20261002',
            referenceKey: 'DUG20261002',
            metal: 'GOLD',
            state: 'HEDGED',
            qty: 20,
            productKey: '1oz krugerrand',
            productId: 7,
            branchId: 3,
            sourceMonth: '2026-10',
            sourceTab: 'IE - Gold',
            firstBatchId: 11,
            lastBatchId: 11,
        });

        const lot = (
            tx.purchaseLot.createManyAndReturn.mock.calls[0]![0] as {
                data: Array<Record<string, unknown>>;
            }
        ).data[0];
        expect(lot).toMatchObject({
            referenceKey: 'DUGP20261002',
            qty: 3,
            commentSoldQty: 1,
            productKey: '250g bar',
            productId: 8,
        });

        expect(tx.stockUnit.createMany).toHaveBeenCalledWith({
            data: [
                { lotId: 50, seq: 1 },
                { lotId: 50, seq: 2 },
                { lotId: 50, seq: 3 },
            ],
        });
        expect(audit.record).toHaveBeenCalledWith(
            'admin@merrion.ie',
            'tradesheet-import',
            expect.stringContaining('2 added'),
            tx,
        );
    });

    it('refreshes the product of an unchanged row without touching anything else', async () => {
        const first = setup();
        await first.service.commit(request(), 'admin@merrion.ie');
        const created = (
            first.tx.trade.createMany.mock.calls[0]![0] as {
                data: Array<Record<string, unknown>>;
            }
        ).data[0];
        const stored = {
            id: 40,
            referenceKey: 'DUG20261002',
            occurrence: 1,
            fingerprint: created.fingerprint,
            missingFromImport: false,
            sourceMonth: '2026-10',
            sourceTab: 'IE - Gold',
            client: 'Tom',
            qty: 20,
            productText: '1oz Krugerrand',
            cptyRaw: 'HEDGED',
            state: 'HEDGED',
            collected: false,
            cost: null,
            receipt: null,
            notes: null,
            lotKey: null,
            productKey: null,
            productId: null,
        };
        const { service, tx } = setup({ trades: [stored] });
        await service.commit(request(), 'admin@merrion.ie');
        expect(tx.trade.update).toHaveBeenCalledTimes(1);
        expect(tx.trade.update).toHaveBeenCalledWith({
            where: { id: 40 },
            data: { productKey: '1oz krugerrand', productId: 7 },
        });
    });

    it('does not make stock rows for silver lots', async () => {
        const { service, tx } = setup();
        tx.purchaseLot.createManyAndReturn.mockResolvedValue([
            { id: 60, referenceKey: 'DUSP20261002', occurrence: 1 },
        ]);
        const dto = request({
            tabs: [
                {
                    name: 'IE-SP',
                    headerRow: 1,
                    headers: LOT_HEADERS,
                    rows: [
                        {
                            row: 2,
                            cells: [
                                'DU',
                                'Gerard',
                                1,
                                '1kg bar',
                                '2026-10-01T00:00:00.000Z',
                                1635,
                                1635,
                                1722,
                                null,
                                'DU-SP20261002',
                            ],
                        },
                    ],
                },
            ],
        });
        await service.commit(dto, 'admin@merrion.ie');
        expect(tx.purchaseLot.createManyAndReturn).toHaveBeenCalled();
        expect(tx.stockUnit.createMany).not.toHaveBeenCalled();
    });

    it('updates a lot whose comment changed and keeps its stock rows in step', async () => {
        const stored = {
            id: 50,
            referenceKey: 'DUGP20261002',
            occurrence: 1,
            fingerprint: 'old',
            missingFromImport: false,
            sourceMonth: '2026-10',
            sourceTab: 'IE-GP',
            client: 'John',
            qty: 3,
            productText: '250g bar',
            pricePaid: 85803,
            hedgedAt: 3695.7,
            commentsRaw: '2 sold',
        };
        const { service, tx } = setup({ lots: [stored], unitCount: 3 });
        await service.commit(request(), 'admin@merrion.ie');
        expect(tx.purchaseLot.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 50 },
                data: expect.objectContaining({
                    commentsRaw: '1 sold',
                    commentSoldQty: 1,
                }),
            }),
        );
        expect(tx.stockUnit.createMany).not.toHaveBeenCalled();
        expect(tx.stockUnit.deleteMany).not.toHaveBeenCalled();
    });

    it('removes only unsold stock rows when the quantity drops', async () => {
        const stored = {
            id: 50,
            referenceKey: 'DUGP20261002',
            occurrence: 1,
            fingerprint: 'old',
            missingFromImport: false,
            sourceMonth: '2026-10',
            sourceTab: 'IE-GP',
            client: 'John',
            qty: 5,
            productText: '250g bar',
            pricePaid: 85803,
            hedgedAt: 3695.7,
            commentsRaw: null,
        };
        const { service, tx } = setup({ lots: [stored], unitCount: 5 });
        await service.commit(request(), 'admin@merrion.ie');
        expect(tx.stockUnit.deleteMany).toHaveBeenCalledWith({
            where: { lotId: 50, tradeId: null, seq: { gt: 3 } },
        });
    });

    it('flags a stored row the file no longer has instead of deleting it', async () => {
        const gone = {
            id: 9,
            referenceKey: 'DUG20261099',
            occurrence: 1,
            fingerprint: 'x',
            missingFromImport: false,
            sourceMonth: '2026-10',
            sourceTab: 'IE - Gold',
            client: 'Gone',
            qty: 1,
            productText: '1oz bar',
            cptyRaw: null,
            state: 'QUOTE',
            collected: false,
            cost: null,
            receipt: null,
            notes: null,
            lotKey: null,
        };
        const { service, tx } = setup({ trades: [gone] });
        await service.commit(request(), 'admin@merrion.ie');
        expect(tx.trade.updateMany).toHaveBeenCalledWith({
            where: { id: { in: [9] } },
            data: { missingFromImport: true },
        });
    });

    it('refuses a file where no tab can be read', async () => {
        const { service, tx } = setup();
        const dto = request({
            tabs: [
                {
                    name: 'Live Figures',
                    headerRow: 1,
                    headers: ['x'],
                    rows: [],
                },
            ],
        });
        await expect(service.commit(dto, 'admin@merrion.ie')).rejects.toThrow(
            BadRequestException,
        );
        expect(tx.importBatch.create).not.toHaveBeenCalled();
    });
});

describe('TradesheetImportService.commit: matching sales to lots', () => {
    const saleTab = (cpty: string, qty = 2) => ({
        name: 'IE - Gold',
        headerRow: 1,
        headers: SALE_HEADERS,
        rows: [
            {
                row: 2,
                cells: [
                    'DU',
                    'Tom',
                    qty,
                    '1oz Krugerrand',
                    '2026-10-01T00:00:00.000Z',
                    cpty,
                    null,
                    null,
                    null,
                    null,
                    'DU-G20261002',
                ],
            },
        ],
    });
    const lotTab = {
        name: 'IE-GP',
        headerRow: 1,
        headers: LOT_HEADERS,
        rows: [
            {
                row: 2,
                cells: [
                    'DU',
                    'John',
                    3,
                    '250g bar',
                    '2026-10-01T00:00:00.000Z',
                    85803,
                    28601,
                    3695.7,
                    '2 sold',
                    'DU-GP20261002',
                ],
            },
        ],
    };
    const lot = (over: Record<string, unknown> = {}) => ({
        id: 50,
        referenceKey: 'DUGP20261002',
        qty: 3,
        metal: 'GOLD',
        commentSoldQty: 2,
        ...over,
    });
    const sale = {
        id: 70,
        lotKey: 'DUGP20261002',
        qty: 2,
        date: new Date('2026-10-01T00:00:00Z'),
    };

    it('links the sale to its lot, gives it the first stock rows and records what the lot gave away', async () => {
        const { service, tx } = setup({
            allocLots: [lot()],
            allocTrades: [sale],
        });
        const result = await service.commit(
            request({ tabs: [saleTab('DU-GP20261002'), lotTab] }),
            'admin@merrion.ie',
        );

        expect(tx.trade.updateMany).toHaveBeenCalledWith({
            where: { id: { in: [70] } },
            data: { lotId: 50 },
        });
        expect(tx.purchaseLot.update).toHaveBeenCalledWith({
            where: { id: 50 },
            data: { allocatedQty: 2 },
        });
        expect(tx.stockUnit.updateMany).toHaveBeenCalledWith({
            where: { lotId: 50 },
            data: { tradeId: null },
        });
        expect(tx.stockUnit.updateMany).toHaveBeenCalledWith({
            where: { lotId: 50, seq: { gte: 1, lte: 2 } },
            data: { tradeId: 70 },
        });
        expect(result.allocation).toEqual({
            lotsChecked: 1,
            salesLinked: 1,
            lotNotImported: 0,
            overAllocated: 0,
            soldMismatches: 0,
        });
    });

    it('counts a sale whose lot is not imported and leaves it unlinked', async () => {
        const { service, tx } = setup({
            allocLots: [],
            allocTrades: [{ ...sale, lotKey: 'DUGP20260101' }],
        });
        const result = await service.commit(
            request({ tabs: [saleTab('DU-GP20260101')] }),
            'admin@merrion.ie',
        );
        expect(tx.trade.updateMany).toHaveBeenCalledWith({
            where: { id: { in: [70] } },
            data: { lotId: null },
        });
        expect(tx.purchaseLot.update).not.toHaveBeenCalled();
        expect(result.allocation).toMatchObject({
            lotNotImported: 1,
            salesLinked: 0,
            lotsChecked: 0,
        });
    });

    it('reports a lot that the sales emptied beyond what was bought, and a comment that disagrees', async () => {
        const { service } = setup({
            allocLots: [lot({ qty: 1, commentSoldQty: 1 })],
            allocTrades: [sale],
        });
        const result = await service.commit(
            request({ tabs: [saleTab('DU-GP20261002'), lotTab] }),
            'admin@merrion.ie',
        );
        expect(result.allocation).toMatchObject({
            overAllocated: 1,
            soldMismatches: 1,
        });
    });

    it('does not touch the stock rows of a silver lot', async () => {
        const { service, tx } = setup({
            allocLots: [lot({ metal: 'SILVER' })],
            allocTrades: [sale],
        });
        await service.commit(
            request({ tabs: [saleTab('DU-GP20261002'), lotTab] }),
            'admin@merrion.ie',
        );
        expect(tx.stockUnit.updateMany).not.toHaveBeenCalled();
        expect(tx.purchaseLot.update).toHaveBeenCalled();
    });

    it('checks nothing when no sale or lot named a purchase line', async () => {
        const { service, tx } = setup();
        const result = await service.commit(request(), 'admin@merrion.ie');
        expect(result.allocation.lotsChecked).toBe(0);
        expect(tx.trade.updateMany).not.toHaveBeenCalled();
    });
});
