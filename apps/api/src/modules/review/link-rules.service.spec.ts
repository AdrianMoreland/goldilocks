import { LinkRulesService } from './link-rules.service';

type R = Record<string, unknown>;

/** Just the Prisma calls the rules make, over in-memory rows. */
function setup(data: { links: R[]; trades: R[]; lots: R[]; lines?: R[] }) {
    const updates: { ids: number[]; data: R }[] = [];
    const db = {
        entityLink: {
            findMany: jest.fn(
                async ({
                    where,
                    take,
                }: {
                    where: { id: { gt: number }; linkType: { in: string[] } };
                    take: number;
                }) =>
                    data.links
                        .filter(
                            (l) =>
                                (l.id as number) > where.id.gt &&
                                where.linkType.in.includes(
                                    l.linkType as string,
                                ) &&
                                l.status === 'PENDING' &&
                                l.confidence === 'PROBABLE',
                        )
                        .slice(0, take),
            ),
            updateMany: jest.fn(
                async ({
                    where,
                    data: d,
                }: {
                    where: { id: { in: number[] } };
                    data: R;
                }) => {
                    updates.push({ ids: where.id.in, data: d });
                    for (const l of data.links)
                        if (where.id.in.includes(l.id as number))
                            Object.assign(l, d);
                    return { count: where.id.in.length };
                },
            ),
        },
        trade: {
            findMany: jest.fn(
                async ({ where }: { where: { sourceKey: { in: string[] } } }) =>
                    data.trades.filter((t) =>
                        where.sourceKey.in.includes(t.sourceKey as string),
                    ),
            ),
        },
        purchaseLot: {
            findMany: jest.fn(
                async ({ where }: { where: { sourceKey: { in: string[] } } }) =>
                    data.lots.filter((l) =>
                        where.sourceKey.in.includes(l.sourceKey as string),
                    ),
            ),
        },
        zohoInvoiceLine: {
            findMany: jest.fn(
                async ({ where }: { where: { sourceKey: { in: string[] } } }) =>
                    (data.lines ?? []).filter((l) =>
                        where.sourceKey.in.includes(l.sourceKey as string),
                    ),
            ),
        },
    };
    return { db, updates, service: new LinkRulesService() };
}

const link = (id: number, type: string, from: string, to: string): R => ({
    id,
    linkType: type,
    fromKey: from,
    toKey: to,
    status: 'PENDING',
    confidence: 'PROBABLE',
});
const trade = (key: string, over: R = {}): R => ({
    sourceKey: key,
    qty: 2,
    productKey: '1oz britannia',
    productText: '1oz Brits',
    ...over,
});
const lot = (key: string, over: R = {}): R => ({
    sourceKey: key,
    qty: 100,
    allocatedQty: 10,
    productKey: '1oz britannia',
    productText: '1oz Britannia',
    ...over,
});

describe('LinkRulesService', () => {
    it('confirms what makes sense, asks about a different product, and sets aside an over-sold lot', async () => {
        const { service, db, updates } = setup({
            links: [
                link(1, 'trade_lot', 'T1', 'L1'),
                link(2, 'trade_lot', 'T2', 'L1'),
                link(3, 'trade_lot', 'T3', 'L2'),
            ],
            trades: [
                trade('T1'),
                trade('T2', {
                    productKey: '1oz krugerrand',
                    productText: '1oz Krugerrand',
                }),
                trade('T3'),
            ],
            lots: [lot('L1'), lot('L2', { qty: 5, allocatedQty: 9 })],
        });
        expect(await service.settle(db as never)).toEqual({
            confirmed: 1,
            asked: 1,
            overAllocated: 1,
        });
        expect(updates).toEqual([
            {
                ids: [1],
                data: expect.objectContaining({
                    status: 'CONFIRMED',
                    confirmedBy: 'rule',
                }),
            },
        ]);
    });

    it('matches invoice lines to sales on quantity and product', async () => {
        const { service, db } = setup({
            links: [
                link(10, 'invoice_line_trade', 'LN1', 'T1'),
                link(11, 'invoice_line_trade', 'LN2', 'T1'),
            ],
            trades: [trade('T1', { qty: 2 })],
            lots: [],
            lines: [
                { sourceKey: 'LN1', qty: 2, itemName: '1oz Gold Britannia' },
                { sourceKey: 'LN2', qty: 5, itemName: '1oz Gold Britannia' },
            ],
        });
        expect(await service.settle(db as never)).toEqual({
            confirmed: 1,
            asked: 1,
            overAllocated: 0,
        });
    });

    it('does nothing for link types it has no view on, and leaves decided links alone', async () => {
        const { service, db } = setup({
            links: [
                link(1, 'bc_trade', 'B1', 'T1'),
                { ...link(2, 'trade_lot', 'T1', 'L1'), status: 'REJECTED' },
            ],
            trades: [trade('T1')],
            lots: [lot('L1')],
        });
        expect(await service.settle(db as never)).toEqual({
            confirmed: 0,
            asked: 0,
            overAllocated: 0,
        });
    });

    it('is safe to run again', async () => {
        const { service, db } = setup({
            links: [link(1, 'trade_lot', 'T1', 'L1')],
            trades: [trade('T1')],
            lots: [lot('L1')],
        });
        expect((await service.settle(db as never)).confirmed).toBe(1);
        expect(await service.settle(db as never)).toEqual({
            confirmed: 0,
            asked: 0,
            overAllocated: 0,
        });
    });
});
