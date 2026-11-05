import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { ReviewService } from './review.service';

function setup() {
    const prisma = {
        entityLink: {
            groupBy: jest.fn(),
            count: jest.fn(),
            findMany: jest.fn(),
            updateMany: jest.fn(),
        },
        trade: { count: jest.fn(), findMany: jest.fn() },
        purchaseLot: { findMany: jest.fn() },
        zohoInvoiceLine: { findMany: jest.fn() },
        productAlias: {
            count: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        salesProduct: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        product: { findUnique: jest.fn() },
        $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation((fn: (tx: unknown) => unknown) =>
        fn(prisma),
    );
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    return {
        prisma,
        audit,
        service: new ReviewService(prisma as never, audit as never),
    };
}

const date = (s: string) => new Date(`${s}T00:00:00.000Z`);

describe('ReviewService', () => {
    it('counts what waits in each queue', async () => {
        const { service, prisma } = setup();
        prisma.entityLink.groupBy.mockResolvedValue([
            { linkType: 'invoice_line_trade', _count: { _all: 551 } },
            { linkType: 'trade_lot', _count: { _all: 73 } },
        ]);
        prisma.trade.count
            .mockResolvedValueOnce(215)
            .mockResolvedValueOnce(122);
        prisma.productAlias.count.mockResolvedValue(689);
        expect(await service.summary()).toEqual({
            links: { invoice_line_trade: 551, trade_lot: 73 },
            unresolvedLots: 215,
            duplicates: 122,
            aliases: 689,
        });
        expect(prisma.entityLink.groupBy).toHaveBeenCalledWith(
            expect.objectContaining({ where: { status: 'PENDING' } }),
        );
    });

    it('lists pending links with a recognisable line at each end', async () => {
        const { service, prisma } = setup();
        prisma.entityLink.count.mockResolvedValue(1);
        prisma.entityLink.findMany.mockResolvedValue([
            {
                id: 7,
                linkType: 'invoice_line_trade',
                confidence: 'PROBABLE',
                method: 'CUSTOMER_DATE_QTY',
                note: null,
                fromTable: 'invoice_lines',
                fromKey: 'L1',
                toTable: 'trades',
                toKey: 'T1',
            },
        ]);
        prisma.zohoInvoiceLine.findMany.mockResolvedValue([
            {
                sourceKey: 'L1',
                qty: 2,
                itemName: '1oz Gold Bar',
                refinery: 'VALCAMBI',
                date: date('2026-10-05'),
                customer: { name: 'Fake Person' },
            },
        ]);
        prisma.trade.findMany.mockResolvedValue([
            {
                sourceKey: 'T1',
                reference: 'DU-G20260941',
                qty: 2,
                productText: '1oz Gold Bar',
                date: date('2026-10-05'),
                client: 'Fake Person',
            },
        ]);

        const res = await service.links({ type: 'invoice_line_trade' });
        expect(prisma.entityLink.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { status: 'PENDING', linkType: 'invoice_line_trade' },
                take: 50,
                skip: 0,
            }),
        );
        expect(res.total).toBe(1);
        expect(res.rows[0]).toMatchObject({
            id: 7,
            from: {
                table: 'invoice_lines',
                label: '2 × · 1oz Gold Bar · VALCAMBI',
                detail: '2026-10-05 · Fake Person',
            },
            to: { table: 'trades', label: 'DU-G20260941 · 2 × · 1oz Gold Bar' },
        });
    });

    it('falls back to the key when a row is not found', async () => {
        const { service, prisma } = setup();
        prisma.entityLink.count.mockResolvedValue(1);
        prisma.entityLink.findMany.mockResolvedValue([
            {
                id: 1,
                linkType: 'safe_trade',
                confidence: 'PROBABLE',
                method: 'REFERENCE',
                note: null,
                fromTable: 'customer_safe_items',
                fromKey: 'S1',
                toTable: 'trades',
                toKey: 'missing',
            },
        ]);
        prisma.trade.findMany.mockResolvedValue([]);
        const res = await service.links({});
        expect(res.rows[0].from).toEqual({
            table: 'customer_safe_items',
            label: 'S1',
            detail: null,
        });
        expect(res.rows[0].to.label).toBe('missing');
    });

    it('rejects a bad query', async () => {
        const { service } = setup();
        await expect(
            service.links({ type: 'nonsense' }),
        ).rejects.toBeInstanceOf(BadRequestException);
        await expect(
            service.unresolvedLots({ limit: '9999' }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('decides only pending links, records who, and audits counts only', async () => {
        const { service, prisma, audit } = setup();
        prisma.entityLink.updateMany.mockResolvedValue({ count: 2 });
        const res = await service.decide(
            { ids: [1, 2, 3], decision: 'CONFIRMED' },
            'admin@example.com',
        );
        expect(res).toEqual({ updated: 2 });
        expect(prisma.entityLink.updateMany).toHaveBeenCalledWith({
            where: { id: { in: [1, 2, 3] }, status: 'PENDING' },
            data: expect.objectContaining({
                status: 'CONFIRMED',
                confirmedBy: 'admin@example.com',
            }),
        });
        expect(audit.record).toHaveBeenCalledWith(
            'admin@example.com',
            'review-links',
            '2 links confirmed',
            prisma,
        );
    });

    it('lists sales whose purchase line is not loaded, and repeated references', async () => {
        const { service, prisma } = setup();
        prisma.trade.count.mockResolvedValue(1);
        prisma.trade.findMany.mockResolvedValue([
            {
                id: 5,
                reference: 'DU-G20260941',
                occurrence: 2,
                date: date('2026-10-05'),
                qty: 1,
                productText: '1oz Bar',
                lotKey: 'DUGP20260100',
                branchCode: 'DU',
            },
        ]);
        const lots = await service.unresolvedLots({});
        expect(prisma.trade.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    cptyKind: 'LOT_REF',
                    lotKey: { not: null },
                    lotId: null,
                    missingFromImport: false,
                },
            }),
        );
        expect(lots.rows[0]).toMatchObject({
            tradeId: 5,
            lotKey: 'DUGP20260100',
            date: '2026-10-05',
        });
        const dups = await service.duplicates({});
        expect(prisma.trade.findMany).toHaveBeenLastCalledWith(
            expect.objectContaining({
                where: { occurrence: { gt: 1 }, missingFromImport: false },
            }),
        );
        expect(dups.rows[0]).toMatchObject({
            reference: 'DU-G20260941',
            occurrence: 2,
        });
    });

    it('lists unmapped aliases, most used first', async () => {
        const { service, prisma } = setup();
        prisma.productAlias.count.mockResolvedValue(1);
        prisma.productAlias.findMany.mockResolvedValue([
            {
                id: 3,
                alias: '1oz bar|VALCAMBI',
                uses: 40,
                refinery: 'VALCAMBI',
            },
        ]);
        const res = await service.aliases({ limit: '10', offset: '20' });
        expect(prisma.productAlias.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { salesProductId: null },
                skip: 20,
                take: 10,
            }),
        );
        expect(res.rows[0]).toEqual({
            id: 3,
            alias: '1oz bar|VALCAMBI',
            uses: 40,
            refinery: 'VALCAMBI',
        });
    });

    describe('sales products', () => {
        const body = {
            name: '1oz Valcambi bar',
            metal: 'GOLD' as const,
            genericNorm: '1oz bar',
            refinery: 'VALCAMBI',
            pricingProductId: 9,
        };

        it('creates one tied to an existing pricing product', async () => {
            const { service, prisma, audit } = setup();
            prisma.product.findUnique.mockResolvedValue({ id: 9 });
            prisma.salesProduct.findUnique.mockResolvedValue(null);
            prisma.salesProduct.create.mockResolvedValue({
                id: 1,
                ...body,
                pricingProduct: { name: '1oz Gold Bar' },
            });
            const res = await service.createSalesProduct(body, 'a@example.com');
            expect(res).toMatchObject({
                id: 1,
                name: '1oz Valcambi bar',
                pricingProductName: '1oz Gold Bar',
            });
            expect(audit.record).toHaveBeenCalledWith(
                'a@example.com',
                'sales-product-create',
                'sales product 1 created',
                prisma,
            );
        });

        it('refuses a duplicate name and a pricing product that does not exist', async () => {
            const { service, prisma } = setup();
            prisma.product.findUnique.mockResolvedValue(null);
            await expect(
                service.createSalesProduct(body, 'a'),
            ).rejects.toBeInstanceOf(BadRequestException);
            prisma.product.findUnique.mockResolvedValue({ id: 9 });
            prisma.salesProduct.findUnique.mockResolvedValue({ id: 2 });
            await expect(
                service.createSalesProduct(body, 'a'),
            ).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('mapAlias', () => {
        it('ties the alias to the sales product and keeps its refinery', async () => {
            const { service, prisma, audit } = setup();
            prisma.productAlias.findUnique.mockResolvedValue({
                id: 3,
                refinery: null,
            });
            prisma.salesProduct.findUnique.mockResolvedValue({
                id: 8,
                refinery: 'VALCAMBI',
            });
            await service.mapAlias(3, { salesProductId: 8 }, 'a@example.com');
            expect(prisma.productAlias.update).toHaveBeenCalledWith({
                where: { id: 3 },
                data: { salesProductId: 8, refinery: 'VALCAMBI' },
            });
            expect(audit.record).toHaveBeenCalledWith(
                'a@example.com',
                'alias-map',
                'alias 3 mapped to sales product 8',
                prisma,
            );
        });

        it('says so when either does not exist', async () => {
            const { service, prisma } = setup();
            prisma.productAlias.findUnique.mockResolvedValue(null);
            prisma.salesProduct.findUnique.mockResolvedValue({ id: 8 });
            await expect(
                service.mapAlias(3, { salesProductId: 8 }, 'a'),
            ).rejects.toBeInstanceOf(NotFoundException);
            prisma.productAlias.findUnique.mockResolvedValue({ id: 3 });
            prisma.salesProduct.findUnique.mockResolvedValue(null);
            await expect(
                service.mapAlias(3, { salesProductId: 8 }, 'a'),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });
});
