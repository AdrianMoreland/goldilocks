import { ProductNamesService, REJECTED_REASON } from './product-names.service';

type R = Record<string, unknown>;

const P = (id: number, sku: string, name: string, metalType: string) => ({
    id,
    sku,
    name,
    metalType,
    category: null,
});

const PRODUCTS = [
    P(42, 'GOLD-1OZ-BAR', '1oz Gold Bar', 'GOLD'),
    P(74, 'GOLD-1OZ-BRITANNIA-COIN', '1oz Britannia', 'GOLD'),
    P(75, 'GOLD-1OZ-KRUGERRAND-COIN', '1oz Krugerrand', 'GOLD'),
];

function alias(over: R): R {
    return {
        id: 1,
        alias: '1oz gold bar',
        productKey: '1oz gold bar',
        productId: null,
        salesProductId: null,
        noProduct: false,
        refinery: null,
        uses: 1,
        sources: null,
        metalHint: null,
        decidedBy: null,
        suggestedProductId: null,
        suggestedSalesProductId: null,
        suggestedNoProduct: false,
        confidence: null,
        reason: null,
        question: null,
        catalogueGap: false,
        ...over,
    };
}

function matches(row: R, where: R): boolean {
    return Object.entries(where).every(([k, v]) => {
        if (k === 'OR') return (v as R[]).some((w) => matches(row, w));
        if (v && typeof v === 'object') {
            const c = v as { in?: unknown[]; not?: unknown };
            if (c.in) return c.in.includes(row[k]);
            if ('not' in c) return row[k] !== c.not;
        }
        return row[k] === v;
    });
}

function setup(rows: R[]) {
    const table = {
        rows,
        findMany: jest.fn(async (args: { where?: R } = {}) =>
            rows.filter((r) => matches(r, args.where ?? {})),
        ),
        count: jest.fn(
            async (args: { where?: R } = {}) =>
                rows.filter((r) => matches(r, args.where ?? {})).length,
        ),
        update: jest.fn(async ({ where, data }: { where: R; data: R }) => {
            Object.assign(rows.find((r) => matches(r, where)) as R, data);
        }),
        updateMany: jest.fn(async ({ where, data }: { where: R; data: R }) => {
            const hit = rows.filter((x) => matches(x, where));
            for (const r of hit) Object.assign(r, data);
            return { count: hit.length };
        }),
        findUnique: jest.fn(
            async ({ where }: { where: R }) =>
                rows.find((r) => matches(r, where)) ?? null,
        ),
        createMany: jest.fn(),
    };
    const prisma = {
        productAlias: table,
        product: { findMany: jest.fn().mockResolvedValue(PRODUCTS) },
        salesProduct: { findMany: jest.fn().mockResolvedValue([]) },
        $executeRaw: jest.fn().mockResolvedValue(0),
        $queryRaw: jest.fn().mockResolvedValue([]),
        $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(prisma)),
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    return {
        rows,
        prisma,
        audit,
        service: new ProductNamesService(prisma as never, audit as never),
    };
}

describe('ProductNamesService.settle', () => {
    it('applies a CERTAIN match by rule and clears any suggestion', async () => {
        const { service, rows } = setup([
            alias({
                alias: '1oz gold bar',
                suggestedProductId: 74,
                confidence: 'LIKELY',
                question: 'old?',
            }),
        ]);
        const r = await service.settle('all');
        expect(r).toEqual({
            dryRun: false,
            certain: 1,
            likely: 0,
            unclear: 0,
            unchanged: 0,
        });
        expect(rows[0]).toMatchObject({
            productId: 42,
            salesProductId: null,
            noProduct: false,
            decidedBy: 'RULE',
            confidence: 'CERTAIN',
            suggestedProductId: null,
            question: null,
        });
        expect(rows[0]['reason']).toEqual(expect.any(String));
    });

    it('leaves a LIKELY match as a suggestion with its question, applying nothing', async () => {
        const { service, rows } = setup([
            alias({ alias: 'south african krugerrand', metalHint: 'GOLD' }),
        ]);
        const r = await service.settle('all');
        expect(r).toMatchObject({ certain: 0, likely: 1, unclear: 0 });
        expect(rows[0]).toMatchObject({
            productId: null,
            decidedBy: null,
            suggestedProductId: 75,
            confidence: 'LIKELY',
        });
        expect(rows[0]['question']).toEqual(
            expect.stringContaining('Krugerrand'),
        );
    });

    it('marks a name it cannot place as UNCLEAR with a reason', async () => {
        const { service, rows } = setup([
            alias({ alias: 'mystery piece of metal', metalHint: null }),
        ]);
        const r = await service.settle('all');
        expect(r).toMatchObject({ certain: 0, likely: 0, unclear: 1 });
        expect(rows[0]).toMatchObject({
            productId: null,
            decidedBy: null,
            confidence: 'UNCLEAR',
        });
        expect(rows[0]['reason']).toEqual(expect.any(String));
    });

    it('never touches a name a person decided', async () => {
        const { service, rows, prisma } = setup([
            alias({
                id: 1,
                alias: '1oz gold bar',
                productId: 74,
                decidedBy: 'PERSON',
            }),
        ]);
        const r = await service.settle('all');
        expect(r).toMatchObject({
            certain: 0,
            likely: 0,
            unclear: 0,
            unchanged: 0,
        });
        expect(rows[0]).toMatchObject({ productId: 74, decidedBy: 'PERSON' });
        expect(prisma.productAlias.update).not.toHaveBeenCalled();
    });

    it('re-checks a rule decision and clears it when it no longer holds', async () => {
        const { service, rows } = setup([
            alias({
                alias: 'mystery piece of metal',
                productId: 42,
                decidedBy: 'RULE',
                confidence: 'CERTAIN',
            }),
        ]);
        await service.settle('all');
        expect(rows[0]).toMatchObject({
            productId: null,
            decidedBy: null,
            confidence: 'UNCLEAR',
        });
    });

    it('counts an already settled name as unchanged and writes nothing', async () => {
        const { service, prisma } = setup([alias({})]);
        await service.settle('all');
        prisma.productAlias.update.mockClear();
        const again = await service.settle('all');
        expect(again).toMatchObject({ certain: 1, unchanged: 1 });
        expect(prisma.productAlias.update).not.toHaveBeenCalled();
    });

    it('a dry run counts what would happen and writes nothing', async () => {
        const { service, rows, prisma } = setup([
            alias({ id: 1, alias: '1oz gold bar' }),
            alias({
                id: 2,
                alias: 'south african krugerrand',
                metalHint: 'GOLD',
            }),
            alias({ id: 3, alias: 'mystery piece of metal' }),
        ]);
        const r = await service.settle('all', { dryRun: true });
        expect(r).toEqual({
            dryRun: true,
            certain: 1,
            likely: 1,
            unclear: 1,
            unchanged: 0,
        });
        expect(prisma.productAlias.update).not.toHaveBeenCalled();
        expect(rows.every((x) => x['decidedBy'] === null)).toBe(true);
    });

    it('only looks at the names in scope', async () => {
        const { service, rows } = setup([
            alias({ id: 1, alias: '1oz gold bar' }),
            alias({ id: 2, alias: '1oz britannia', metalHint: 'GOLD' }),
        ]);
        const r = await service.settle({ aliases: ['1oz britannia'] });
        expect(r.certain).toBe(1);
        expect(rows[0]).toMatchObject({ decidedBy: null });
        expect(rows[1]).toMatchObject({ decidedBy: 'RULE', productId: 74 });
    });

    it('keeps a turned down suggestion turned down, unless a rule now settles the name', async () => {
        const { service, rows } = setup([
            alias({
                alias: 'south african krugerrand',
                metalHint: 'GOLD',
                confidence: 'UNCLEAR',
                reason: REJECTED_REASON,
            }),
        ]);
        const r = await service.settle('all');
        expect(r).toMatchObject({ likely: 1, unchanged: 1 });
        expect(rows[0]).toMatchObject({ suggestedProductId: null });
    });
});

describe('ProductNamesService.settle writes', () => {
    it("writes names with the same target state in one updateMany, guarded against a person's decision", async () => {
        const rows = Array.from({ length: 30 }, (_, i) =>
            alias({
                id: i + 1,
                alias: `1oz gold bar ${i}`,
                productKey: `k${i}`,
            }),
        );
        const { service, prisma } = setup(rows);
        // A name that fails the scan's state needs a write; make every row identical in outcome.
        const r = await service.settle('all');
        expect(r.certain + r.likely + r.unclear).toBe(30);
        expect(prisma.productAlias.update).not.toHaveBeenCalled();
        const calls = prisma.productAlias.updateMany.mock.calls as unknown as {
            where: R;
        }[][];
        expect(calls.length).toBeLessThan(30);
        for (const [c] of calls)
            expect(c.where).toMatchObject({
                OR: [{ decidedBy: null }, { decidedBy: 'RULE' }],
            });
    });

    it('does not overwrite a name a person decided while the scan was running', async () => {
        const { service, rows, prisma } = setup([alias({ id: 1 })]);
        // The person decides after the scan has read the row but before it writes.
        const realFind = prisma.productAlias.findMany;
        prisma.productAlias.findMany = jest.fn(
            async (args: { where?: R } = {}) => {
                const found = await realFind(args);
                const copy = found.map((f) => ({ ...f }));
                rows[0]['decidedBy'] = 'PERSON';
                rows[0]['productId'] = 75;
                return copy;
            },
        );
        await service.settle('all');
        expect(rows[0]).toMatchObject({ decidedBy: 'PERSON', productId: 75 });
    });

    it('writes in chunks of at most 1000 ids', async () => {
        const rows = Array.from({ length: 2500 }, (_, i) =>
            alias({ id: i + 1, alias: `1oz gold bar`, productKey: `k${i}` }),
        );
        const { service, prisma } = setup(rows);
        await service.settle('all');
        const calls = prisma.productAlias.updateMany.mock.calls as unknown as {
            where: { id: { in: number[] } };
        }[][];
        expect(calls).toHaveLength(3);
        expect(Math.max(...calls.map(([c]) => c.where.id.in.length))).toBe(
            1000,
        );
    });

    it('uses one parameterised UPDATE per chunk when the states are too many to group', async () => {
        // Each name gives its own odd weight, so every stored reason is different.
        const rows = Array.from({ length: 250 }, (_, i) =>
            alias({
                id: i + 1,
                alias: `${i + 11}.5oz gold bar`,
                productKey: `k${i}`,
            }),
        );
        const { service, prisma } = setup(rows);
        const r = await service.settle('all');
        expect(r.unclear).toBe(250);
        expect(prisma.productAlias.updateMany).not.toHaveBeenCalled();
        expect(prisma.productAlias.update).not.toHaveBeenCalled();
        expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
        const sql = (
            prisma.$executeRaw.mock.calls[0] as unknown[]
        )[0] as string[];
        expect(sql.join('?')).toContain(
            '"decidedBy" IS NULL OR a."decidedBy" = \'RULE\'',
        );
    });

    it('a rescan transaction has room for a long scan', async () => {
        const { service, prisma } = setup([]);
        await service.rescan(false, 'a@example.com');
        expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
            timeout: 300_000,
            maxWait: 10_000,
        });
    });
});

describe('ProductNamesService accept and reject', () => {
    const waiting = () =>
        alias({
            id: 5,
            alias: 'south african krugerrand',
            suggestedProductId: 75,
            confidence: 'LIKELY',
            question: 'match?',
        });

    it("accepting makes the suggestion the person's decision and audits ids only", async () => {
        const { service, rows, audit } = setup([
            waiting(),
            alias({ id: 6, productId: 74, decidedBy: 'PERSON' }),
            alias({ id: 7 }),
        ]);
        const r = await service.accept(
            [
                { id: 5, expected: { productId: 75 } },
                { id: 6, expected: { productId: 74 } },
                { id: 7, expected: { productId: 75 } },
                { id: 99, expected: { productId: 75 } },
            ],
            'a@example.com',
        );
        expect(r).toEqual({ accepted: 1, skipped: 3 });
        expect(rows[0]).toMatchObject({
            productId: 75,
            decidedBy: 'PERSON',
            suggestedProductId: null,
            question: null,
        });
        expect(rows[1]).toMatchObject({ productId: 74 });
        const detail = audit.record.mock.calls[0][2] as string;
        expect(detail).toContain('ids 5');
        expect(detail).not.toContain('krugerrand');
    });

    it('skips a name whose stored suggestion is no longer the one the person saw', async () => {
        const { service, rows } = setup([waiting()]);
        // The person saw a suggestion for product 74; a rescan since then moved it to 75.
        const r = await service.accept(
            [{ id: 5, expected: { productId: 74 } }],
            'a@example.com',
        );
        expect(r).toEqual({ accepted: 0, skipped: 1 });
        expect(rows[0]).toMatchObject({
            decidedBy: null,
            productId: null,
            suggestedProductId: 75,
        });
    });

    it('accepts a "not a product" suggestion only when expected says so', async () => {
        const { service, rows } = setup([
            alias({ id: 8, suggestedNoProduct: true, confidence: 'LIKELY' }),
        ]);
        expect(
            await service.accept(
                [{ id: 8, expected: { productId: 75 } }],
                'a@example.com',
            ),
        ).toEqual({ accepted: 0, skipped: 1 });
        expect(
            await service.accept(
                [{ id: 8, expected: { noProduct: true } }],
                'a@example.com',
            ),
        ).toEqual({ accepted: 1, skipped: 0 });
        expect(rows[0]).toMatchObject({
            noProduct: true,
            decidedBy: 'PERSON',
            suggestedNoProduct: false,
        });
    });

    it('rejecting clears the suggestion and keeps the name waiting as UNCLEAR', async () => {
        const { service, rows } = setup([
            waiting(),
            alias({ id: 6, productId: 74, decidedBy: 'PERSON' }),
        ]);
        const r = await service.reject([5, 6], 'a@example.com');
        expect(r).toEqual({ done: 1, skipped: 1 });
        expect(rows[0]).toMatchObject({
            decidedBy: null,
            productId: null,
            suggestedProductId: null,
            question: null,
            confidence: 'UNCLEAR',
            reason: REJECTED_REASON,
        });
        expect(rows[1]).toMatchObject({ productId: 74, decidedBy: 'PERSON' });
    });
});

describe('ProductNamesService.list', () => {
    it('counts each state and names the suggestion', async () => {
        const { service } = setup([
            alias({
                id: 1,
                suggestedProductId: 75,
                confidence: 'LIKELY',
                question: 'q?',
            }),
            alias({ id: 2, confidence: 'UNCLEAR', reason: 'no metal' }),
            alias({
                id: 3,
                productId: 42,
                decidedBy: 'RULE',
                confidence: 'CERTAIN',
            }),
            alias({ id: 4, productId: 42, decidedBy: 'PERSON' }),
        ]);
        const all = await service.list({});
        expect(all.counts).toEqual({
            settledByRule: 1,
            settledPerRow: 0,
            toConfirm: 1,
            toDecide: 1,
        });
        expect(all.total).toBe(2);
        const confirm = await service.list({ view: 'confirm' });
        expect(confirm.rows).toHaveLength(1);
        expect(confirm.rows[0].suggestion).toEqual({
            kind: 'PRICING',
            id: 75,
            name: '1oz Krugerrand',
        });
        const settled = await service.list({ view: 'settled' });
        expect(settled.rows.map((r) => r.id)).toEqual([3]);
        expect(settled.rows[0].settledTo?.name).toBe('1oz Gold Bar');
    });
});

// --- where a name is used --------------------------------------------------------------------

type Raw = {
    k: string;
    refinery: string | null;
    metal: string | null;
    resolved: boolean;
    n: number;
};

/** The four grouped usage queries, answered by the table each one reads. */
function usageSetup(
    aliases: R[],
    data: { trades?: Raw[]; lots?: Raw[]; zoho?: Raw[]; safe?: Raw[] },
) {
    const base = setup(aliases);
    const prisma = base.prisma as unknown as {
        $queryRaw: jest.Mock;
        trade: R;
        purchaseLot: R;
        salesProduct: R;
        product: R;
    };
    prisma.$queryRaw.mockImplementation(async (strings: string[]) => {
        const sql = strings.join('?');
        if (sql.includes('FROM trades')) return data.trades ?? [];
        if (sql.includes('FROM purchase_lots')) return data.lots ?? [];
        if (sql.includes('FROM zoho_invoice_lines')) return data.zoho ?? [];
        if (sql.includes('FROM customer_order_items')) return data.safe ?? [];
        return [];
    });
    return base;
}
const g = (
    k: string,
    metal: string | null,
    resolved: boolean,
    n: number,
    refinery: string | null = null,
): Raw => ({ k, refinery, metal, resolved, n });

describe('ProductNamesService.list: settled per row and context', () => {
    const waiting = (id: number, name: string, over: R = {}) =>
        alias({
            id,
            alias: name,
            uses: 10 - id,
            confidence: 'UNCLEAR',
            ...over,
        });

    it('moves a name whose sales and purchases all have a product out of the queues', async () => {
        const { service } = usageSetup(
            [waiting(1, '1oz maple'), waiting(2, '1oz koala')],
            {
                trades: [
                    g('1oz maple', 'GOLD', true, 98),
                    g('1oz maple', 'SILVER', true, 48),
                    g('1oz koala', 'GOLD', false, 3),
                ],
                lots: [g('1oz maple', 'GOLD', true, 41)],
            },
        );
        const open = await service.list({});
        expect(open.rows.map((r) => r.alias)).toEqual(['1oz koala']);
        expect(open.counts).toMatchObject({
            settledPerRow: 1,
            toDecide: 1,
            toConfirm: 0,
        });
        const perRow = await service.list({ view: 'per-row' });
        expect(perRow.rows.map((r) => r.alias)).toEqual(['1oz maple']);
        expect(perRow.total).toBe(1);
        expect((await service.list({ view: 'decide' })).rows).toHaveLength(1);
    });

    it('keeps a name in the queue when one sale or purchase is still without a product', async () => {
        const { service } = usageSetup([waiting(1, '1oz maple')], {
            trades: [
                g('1oz maple', 'GOLD', true, 98),
                g('1oz maple', 'SILVER', false, 2),
            ],
        });
        const r = await service.list({});
        expect(r.rows).toHaveLength(1);
        expect(r.counts.settledPerRow).toBe(0);
        expect(r.rows[0].perMetal).toEqual([
            { metal: 'GOLD', unresolved: 0 },
            { metal: 'SILVER', unresolved: 2 },
        ]);
    });

    it('keeps a name in the queue when a Zoho line using it has no product, and when only a customer safe item uses it', async () => {
        const { service } = usageSetup(
            [waiting(1, '1oz maple'), waiting(2, '1oz eagle')],
            {
                trades: [g('1oz maple', 'GOLD', true, 5)],
                zoho: [g('1oz Maple', null, false, 1)],
                safe: [g('1oz eagle', 'GOLD', true, 2)],
            },
        );
        const r = await service.list({});
        expect(r.rows.map((x) => x.alias).sort()).toEqual([
            '1oz eagle',
            '1oz maple',
        ]);
        expect(r.counts.settledPerRow).toBe(0);
    });

    it('a name with a refinery only counts the rows of that refinery', async () => {
        const { service } = usageSetup([waiting(1, '1oz bar|ARGOR HERAEUS')], {
            trades: [
                g('1oz bar', 'GOLD', true, 4, 'Argor-Heraeus'),
                g('1oz bar', 'GOLD', false, 9, 'PAMP'),
            ],
        });
        const r = await service.list({ view: 'per-row' });
        expect(r.rows).toHaveLength(1);
    });

    it('says where a name is seen, per source and metal', async () => {
        const { service } = usageSetup([waiting(1, '1oz maple')], {
            trades: [
                g('1oz maple', 'GOLD', false, 153),
                g('1oz maple', 'SILVER', false, 63),
            ],
            lots: [g('1oz maple', 'GOLD', false, 74)],
            zoho: [g('1oz maple', null, true, 4)],
            safe: [g('1oz Maple 2026', 'GOLD', true, 2)],
        });
        const { rows } = await service.list({});
        expect(rows[0].seenIn).toEqual([
            { source: 'SALES', metal: 'GOLD', count: 153 },
            { source: 'SALES', metal: 'SILVER', count: 63 },
            { source: 'PURCHASES', metal: 'GOLD', count: 74 },
            { source: 'ZOHO', metal: null, count: 4 },
            { source: 'CUSTOMER_SAFE', metal: 'GOLD', count: 2 },
        ]);
    });

    it('runs the usage queries once for the whole list, not once per name', async () => {
        const { service, prisma } = usageSetup(
            [waiting(1, 'a b'), waiting(2, 'c d'), waiting(3, 'e f')],
            {},
        );
        await service.list({});
        expect(prisma.$queryRaw).toHaveBeenCalledTimes(4);
    });
});

describe('ProductNamesService.usage', () => {
    function usageService(over: R = {}) {
        const { prisma, service } = usageSetup(
            [alias({ id: 1, alias: '1oz maple', confidence: 'UNCLEAR' })],
            {
                zoho: [g('1oz maple', null, false, 1)],
                safe: [g('1oz maple', 'GOLD', true, 1)],
            },
        );
        const p = prisma as unknown as R;
        p.trade = {
            findMany: jest.fn().mockResolvedValue([
                {
                    metal: 'GOLD',
                    sourceTab: 'IE - Gold',
                    date: new Date('2026-03-04'),
                    qty: 2,
                    totalPrice: { toString: () => '6000' },
                    refinery: null,
                    product: { name: '1oz Maple' },
                    salesProduct: null,
                },
            ]),
        };
        p.purchaseLot = {
            findMany: jest.fn().mockResolvedValue([
                {
                    metal: 'SILVER',
                    sourceTab: 'IE-SP',
                    received: new Date('2026-02-01'),
                    qty: 10,
                    pricePerItem: { toString: () => '31.5' },
                    pricePaid: null,
                    refinery: null,
                    product: null,
                    salesProduct: null,
                },
            ]),
        };
        p.zohoInvoiceLine = {
            findMany: jest.fn().mockResolvedValue([
                {
                    date: new Date('2026-01-05'),
                    qty: { toString: () => '1' },
                    unitPrice: { toString: () => '3100' },
                    refinery: null,
                    salesProduct: null,
                },
            ]),
        };
        p.customerOrderItem = {
            findMany: jest
                .fn()
                .mockResolvedValue([
                    { metal: 'GOLD', orderedOn: null, quantity: 3 },
                ]),
        };
        (p.$queryRaw as jest.Mock).mockImplementation(async () => [
            { k: '1oz maple' },
        ]);
        void over;
        return { service, p };
    }

    it('returns a mix of sources with unit price per item and the resolved product', async () => {
        const { service } = usageService();
        const { rows } = await service.usage(1);
        expect(rows).toEqual([
            {
                source: 'SALES',
                metal: 'GOLD',
                sheet: 'IE - Gold',
                date: '2026-03-04',
                qty: 2,
                unitPrice: 3000,
                resolvedTo: '1oz Maple',
            },
            {
                source: 'PURCHASES',
                metal: 'SILVER',
                sheet: 'IE-SP',
                date: '2026-02-01',
                qty: 10,
                unitPrice: 31.5,
                resolvedTo: null,
            },
            {
                source: 'ZOHO',
                metal: null,
                sheet: null,
                date: '2026-01-05',
                qty: 1,
                unitPrice: 3100,
                resolvedTo: null,
            },
            {
                source: 'CUSTOMER_SAFE',
                metal: 'GOLD',
                sheet: null,
                date: null,
                qty: 3,
                unitPrice: null,
                resolvedTo: null,
            },
        ]);
    });

    it('selects no customer, vendor or client fields and returns at most five rows', async () => {
        const { service, p } = usageService();
        const res = await service.usage(1);
        expect(res.rows.length).toBeLessThanOrEqual(5);
        const keys = res.rows.flatMap((r) => Object.keys(r)).join(',');
        expect(keys).not.toMatch(
            /client|customer|seller|supplier|vendor|code/i,
        );
        for (const t of [
            'trade',
            'purchaseLot',
            'zohoInvoiceLine',
            'customerOrderItem',
        ]) {
            const select = (
                (p[t] as { findMany: jest.Mock }).findMany.mock.calls[0][0] as {
                    select: R;
                }
            ).select;
            expect(Object.keys(select).join(',')).not.toMatch(
                /client|customer|seller|supplier|cpty|initials|reference/i,
            );
        }
    });

    it('404s for an unknown name', async () => {
        const { service } = usageService();
        await expect(service.usage(99)).rejects.toThrow('not found');
    });
});

describe('ProductNamesService.applyPerMetal', () => {
    function perMetal(tradeCount = 3, lotCount = 1) {
        const { prisma, service, audit } = usageSetup(
            [alias({ id: 1, alias: '1oz maple', confidence: 'UNCLEAR' })],
            {},
        );
        const p = prisma as unknown as R;
        (p.product as R).findFirst = jest.fn(
            async ({ where }: { where: { id: number } }) =>
                where.id === 10
                    ? { id: 10, metalType: 'GOLD' }
                    : where.id === 20
                      ? { id: 20, metalType: 'SILVER' }
                      : null,
        );
        (p.salesProduct as R).findUnique = jest.fn(async () => ({
            id: 7,
            metal: 'GOLD',
            pricingProductId: 10,
        }));
        const updateMany = jest.fn(async () => ({ count: tradeCount }));
        p.trade = { updateMany, findMany: jest.fn() };
        const lotUpdate = jest.fn(async () => ({ count: lotCount }));
        p.purchaseLot = { updateMany: lotUpdate, findMany: jest.fn() };
        return { service, audit, updateMany, lotUpdate };
    }

    it('updates only the unresolved rows of the chosen metal, once per table, and audits counts only', async () => {
        const { service, audit, updateMany, lotUpdate } = perMetal();
        const r = await service.applyPerMetal(
            1,
            {
                choices: [
                    { metal: 'GOLD', productId: 10 },
                    { metal: 'SILVER', productId: 20 },
                ],
            },
            'a@b.c',
        );
        expect(r).toEqual({ trades: 6, lots: 2 });
        expect(updateMany).toHaveBeenCalledTimes(2);
        expect(updateMany).toHaveBeenNthCalledWith(1, {
            where: { productKey: '1oz maple', metal: 'GOLD', productId: null },
            data: { productId: 10 },
        });
        expect(lotUpdate).toHaveBeenNthCalledWith(2, {
            where: {
                productKey: '1oz maple',
                metal: 'SILVER',
                productId: null,
            },
            data: { productId: 20 },
        });
        const line = audit.record.mock.calls[0][2] as string;
        expect(line).toBe(
            'name 1: gold 3 sales, 1 purchases; silver 3 sales, 1 purchases',
        );
        expect(line).not.toContain('maple');
    });

    it('a specific product sets both the pricing and the specific product', async () => {
        const { service, updateMany } = perMetal();
        await service.applyPerMetal(
            1,
            { choices: [{ metal: 'GOLD', salesProductId: 7 }] },
            'a@b.c',
        );
        expect(updateMany).toHaveBeenCalledWith(
            expect.objectContaining({
                data: { productId: 10, salesProductId: 7 },
            }),
        );
    });

    it('refuses a product of the wrong metal and leaves the alias undecided', async () => {
        const { service, updateMany } = perMetal();
        await expect(
            service.applyPerMetal(
                1,
                { choices: [{ metal: 'GOLD', productId: 20 }] },
                'a@b.c',
            ),
        ).rejects.toThrow('not gold');
        expect(updateMany).not.toHaveBeenCalled();
    });

    it('refuses a name a person already decided', async () => {
        const { prisma, service } = usageSetup(
            [alias({ id: 1, alias: '1oz maple', decidedBy: 'PERSON' })],
            {},
        );
        void prisma;
        await expect(
            service.applyPerMetal(
                1,
                { choices: [{ metal: 'GOLD', productId: 10 }] },
                'a@b.c',
            ),
        ).rejects.toThrow('already decided');
    });
});
