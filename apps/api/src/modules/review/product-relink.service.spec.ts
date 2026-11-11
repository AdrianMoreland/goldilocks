import { ProductRelinkService } from './product-relink.service';

type R = Record<string, unknown>;

const CATALOGUE = [
    { id: 42, sku: 'GOLD-1OZ-BAR', metalType: 'GOLD' },
    { id: 50, sku: 'SILVER-1OZ-BAR', metalType: 'SILVER' },
    { id: 75, sku: 'GOLD-1OZ-KRUGERRAND-COIN', metalType: 'GOLD' },
    { id: 76, sku: 'GOLD-1OZ-BRITANNIA-COIN', metalType: 'GOLD' },
];

const SALES = [
    {
        id: 7,
        name: 'Valcambi 1oz bar',
        metal: 'GOLD',
        genericNorm: '1oz bar',
        refinery: 'VALCAMBI',
        pricingProductId: 42,
    },
    {
        id: 8,
        name: '1oz Krugerrand',
        metal: 'GOLD',
        genericNorm: '1oz krugerrand',
        refinery: null,
        pricingProductId: 75,
    },
];

const decision = (over: R): R => ({
    alias: '1oz bar',
    productId: null,
    salesProductId: null,
    noProduct: false,
    decidedBy: 'PERSON',
    metalHint: null,
    ...over,
});

interface Tables {
    trade?: R[];
    purchaseLot?: R[];
    zohoInvoiceLine?: R[];
    zohoProduct?: R[];
    quote?: R[];
    aliases?: R[];
    bcItem?: R[];
}

function setup(t: Tables) {
    const table = (rows: R[] = []) => ({
        rows,
        findMany: jest.fn(async () => rows.map((r) => ({ ...r }))),
        updateMany: jest.fn(async (a: { where: R; data: R }) => {
            const ids = (a.where.id as { in: number[] }).in;
            const guards = Object.entries(a.where).filter(([k]) => k !== 'id');
            let count = 0;
            for (const row of rows) {
                if (!ids.includes(row.id as number)) continue;
                if (guards.some(([k, v]) => row[k] !== v)) continue;
                Object.assign(row, a.data);
                count++;
            }
            return { count };
        }),
    });
    const prisma = {
        product: { findMany: jest.fn(async () => CATALOGUE) },
        salesProduct: { findMany: jest.fn(async () => SALES) },
        productAlias: { findMany: jest.fn(async () => t.aliases ?? []) },
        bcItem: { findMany: jest.fn(async () => t.bcItem ?? []) },
        refineryAlias: { findMany: jest.fn(async () => []) },
        trade: table(t.trade),
        purchaseLot: table(t.purchaseLot),
        zohoInvoiceLine: table(t.zohoInvoiceLine),
        zohoProduct: table(t.zohoProduct),
        quote: table(t.quote),
        $transaction: jest.fn(
            async (fn: (tx: unknown) => Promise<unknown>, _o: unknown) =>
                fn(prisma),
        ),
    };
    const audit = { record: jest.fn(async () => undefined) };
    const svc = new ProductRelinkService(prisma as never, audit as never);
    return { svc, prisma, audit };
}

const trade = (id: number, over: R = {}): R => ({
    id,
    productText: '1oz gold bar',
    refinery: null,
    metal: 'GOLD',
    productId: null,
    salesProductId: null,
    ...over,
});

describe('ProductRelinkService', () => {
    it('fills only empty product fields and leaves a set product alone, even when correcting', async () => {
        const { svc, prisma } = setup({
            trade: [trade(1), trade(2, { productId: 99 })],
        });
        const r = await svc.relink({ dryRun: false, correct: true }, 'a@b.c');
        expect(r.tables.trades).toMatchObject({
            rowsChecked: 2,
            fill: 1,
            correct: 0,
            written: 1,
        });
        expect(prisma.trade.rows[0]).toMatchObject({ productId: 42 });
        expect(prisma.trade.rows[1]).toMatchObject({ productId: 99 });
    });

    it('corrects from a person decision only when asked, and counts it on a dry run either way', async () => {
        const rows = () => [trade(1, { productId: 42 })];
        const aliases = [decision({ productId: 76 })];

        const off = setup({ trade: rows(), aliases });
        const a = await off.svc.relink({ dryRun: false, correct: false }, 'x');
        expect(a.tables.trades).toMatchObject({ correct: 1, written: 0 });
        expect(off.prisma.trade.rows[0]).toMatchObject({ productId: 42 });

        const on = setup({ trade: rows(), aliases });
        const b = await on.svc.relink({ dryRun: false, correct: true }, 'x');
        expect(b.tables.trades).toMatchObject({ correct: 1, written: 1 });
        expect(on.prisma.trade.rows[0]).toMatchObject({ productId: 76 });
        // The WHERE holds the value the plan saw.
        expect(on.prisma.trade.updateMany).toHaveBeenCalledWith({
            where: { id: { in: [1] }, productId: 42 },
            data: { productId: 76 },
        });
    });

    it('never corrects from a RULE decision or an engine result, and never across metals', async () => {
        const rule = setup({
            trade: [trade(1, { productId: 99 })],
            aliases: [
                decision({
                    decidedBy: 'RULE',
                    productId: 76,
                    metalHint: 'GOLD',
                }),
            ],
        });
        const r1 = await rule.svc.relink({ dryRun: false, correct: true }, 'x');
        expect(r1.tables.trades).toMatchObject({ correct: 0, written: 0 });

        const engine = setup({ trade: [trade(1, { productId: 99 })] });
        const r2 = await engine.svc.relink(
            { dryRun: false, correct: true },
            'x',
        );
        expect(r2.tables.trades.correct).toBe(0);

        // A person's gold decision does not correct a silver row.
        const silver = setup({
            trade: [
                trade(1, {
                    productText: '1oz bar',
                    metal: 'SILVER',
                    productId: 50,
                }),
            ],
            aliases: [decision({ productId: 76 })],
        });
        const r3 = await silver.svc.relink(
            { dryRun: false, correct: true },
            'x',
        );
        expect(r3.tables.trades.correct).toBe(0);
        expect(silver.prisma.trade.rows[0]).toMatchObject({ productId: 50 });
    });

    it('does not apply a RULE decision of another metal: the engine runs with the row metal', async () => {
        const { svc, prisma } = setup({
            trade: [trade(1, { productText: '1oz bar' })],
            aliases: [
                decision({
                    decidedBy: 'RULE',
                    productId: 76,
                    metalHint: 'SILVER',
                }),
            ],
        });
        await svc.relink({ dryRun: false, correct: false }, 'x');
        expect(prisma.trade.rows[0]).toMatchObject({ productId: 42 });
    });

    it('leaves a name settled as not a product alone and reports it', async () => {
        const { svc, prisma } = setup({
            trade: [
                trade(1, { productText: 'delivery fee', productId: 99 }),
                trade(2, { productText: 'delivery fee' }),
            ],
            aliases: [decision({ alias: 'delivery fee', noProduct: true })],
        });
        const r = await svc.relink({ dryRun: false, correct: true }, 'x');
        expect(r.tables.trades).toMatchObject({
            notProduct: 2,
            fill: 0,
            written: 0,
        });
        expect(prisma.trade.updateMany).not.toHaveBeenCalled();
    });

    it('counts an invoice line that resolves to a pricing product only, and writes nothing for it', async () => {
        const { svc, prisma } = setup({
            zohoInvoiceLine: [
                {
                    id: 1,
                    itemName: '1oz gold bar',
                    refinery: null,
                    salesProductId: null,
                },
                {
                    id: 2,
                    itemName: 'mystery thing',
                    refinery: null,
                    salesProductId: null,
                },
            ],
        });
        const r = await svc.relink({ dryRun: false, correct: false }, 'x');
        expect(r.tables.zoho_invoice_lines).toMatchObject({
            rowsChecked: 2,
            fill: 0,
            pricingOnlyNoColumn: 1,
            unresolved: 1,
            written: 0,
        });
        expect(prisma.zohoInvoiceLine.updateMany).not.toHaveBeenCalled();
    });

    it('fills an invoice line and a quote from a specific product decision', async () => {
        const { svc, prisma } = setup({
            zohoInvoiceLine: [
                {
                    id: 1,
                    itemName: '1oz Krugerrand',
                    refinery: null,
                    salesProductId: null,
                },
            ],
            quote: [
                {
                    id: 5,
                    productText: '1oz Krugerrand',
                    metal: 'GOLD',
                    salesProductId: null,
                },
            ],
            aliases: [
                decision({
                    alias: '1oz krugerrand',
                    salesProductId: 8,
                    productId: 75,
                }),
            ],
        });
        const r = await svc.relink({ dryRun: false, correct: false }, 'x');
        expect(r.tables.zoho_invoice_lines).toMatchObject({
            fill: 1,
            written: 1,
        });
        expect(r.tables.quotes).toMatchObject({ fill: 1, written: 1 });
        expect(prisma.zohoInvoiceLine.rows[0]).toMatchObject({
            salesProductId: 8,
        });
        expect(prisma.quote.rows[0]).toMatchObject({ salesProductId: 8 });
        expect(prisma.zohoInvoiceLine.updateMany).toHaveBeenCalledWith({
            where: { id: { in: [1] }, salesProductId: null },
            data: { salesProductId: 8 },
        });
    });

    it('keeps the BC link on a Zoho product whose SKU is a BC item, and never corrects it', async () => {
        const { svc, prisma } = setup({
            zohoProduct: [
                // Linked by the import: a person decision for the name must not overwrite it.
                {
                    id: 1,
                    sku: '1103',
                    itemName: '1oz gold bar',
                    metal: 'Gold',
                    productId: 42,
                    salesProductId: 7,
                },
                // BC item known but the import found it before the link existed: filled from the BC item.
                {
                    id: 2,
                    sku: '1103-HISTORIC',
                    itemName: '1oz gold bar',
                    metal: 'Gold',
                    productId: null,
                    salesProductId: null,
                },
                // No BC SKU: filled from the name.
                {
                    id: 3,
                    sku: 'X-9',
                    itemName: '1oz gold bar',
                    metal: 'Gold',
                    productId: null,
                    salesProductId: null,
                },
            ],
            bcItem: [{ itemNo: '1103', productId: 42, salesProductId: 7 }],
            aliases: [decision({ productId: 76 })],
        });
        const r = await svc.relink({ dryRun: false, correct: true }, 'x');
        expect(prisma.zohoProduct.rows[0]).toMatchObject({
            productId: 42,
            salesProductId: 7,
        });
        expect(prisma.zohoProduct.rows[1]).toMatchObject({
            productId: 42,
            salesProductId: 7,
        });
        expect(prisma.zohoProduct.rows[2]).toMatchObject({
            productId: 76,
            salesProductId: null,
        });
        expect(r.tables.zoho_products).toMatchObject({ fill: 2, correct: 0 });
    });

    it('writes nothing on a dry run, outside a transaction', async () => {
        const { svc, prisma, audit } = setup({
            trade: [trade(1), trade(2, { productId: 99 })],
            aliases: [decision({ productId: 76 })],
        });
        const r = await svc.relink({ dryRun: true, correct: true }, 'x');
        expect(r.dryRun).toBe(true);
        expect(r.tables.trades).toMatchObject({
            fill: 1,
            correct: 1,
            written: 0,
        });
        expect(prisma.$transaction).not.toHaveBeenCalled();
        expect(prisma.trade.updateMany).not.toHaveBeenCalled();
        expect(audit.record).not.toHaveBeenCalled();
    });

    it('groups rows with the same target into one write, in chunks of at most 1000 ids', async () => {
        const rows = Array.from({ length: 2500 }, (_, i) => trade(i + 1));
        const { svc, prisma } = setup({ trade: rows });
        const r = await svc.relink({ dryRun: false, correct: false }, 'x');
        expect(r.tables.trades.written).toBe(2500);
        const calls = prisma.trade.updateMany.mock.calls;
        expect(calls).toHaveLength(3);
        expect(
            calls.map((c) => (c[0].where.id as { in: number[] }).in.length),
        ).toEqual([1000, 1000, 500]);
    });

    it('runs one transaction with the long timeout and audits counts only', async () => {
        const { svc, prisma, audit } = setup({
            trade: [trade(1, { client: 'Jane Doe' })],
        });
        await svc.relink({ dryRun: false, correct: false }, 'admin@x.y');
        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(prisma.$transaction.mock.calls[0]![1]).toEqual({
            timeout: 300_000,
            maxWait: 10_000,
        });
        const detail = (audit.record.mock.calls[0] as unknown as string[])[2];
        expect(detail).toContain('trades fill 1 correct 0 written 1');
        expect(detail).not.toMatch(/1oz|Jane/);
    });

    it('does not overwrite a row changed since it was read', async () => {
        const { svc, prisma } = setup({ trade: [trade(1)] });
        // Someone sets the product between the read and the write.
        const read = prisma.trade.findMany.getMockImplementation()!;
        prisma.trade.findMany.mockImplementationOnce(async () => {
            const snapshot = await read();
            prisma.trade.rows[0]!.productId = 99;
            return snapshot;
        });
        const r = await svc.relink({ dryRun: false, correct: false }, 'x');
        expect(r.tables.trades).toMatchObject({ fill: 1, written: 0 });
        expect(prisma.trade.rows[0]).toMatchObject({ productId: 99 });
    });
});
