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
            for (const r of rows.filter((x) => matches(x, where)))
                Object.assign(r, data);
        }),
        createMany: jest.fn(),
    };
    const prisma = {
        productAlias: table,
        product: { findMany: jest.fn().mockResolvedValue(PRODUCTS) },
        salesProduct: { findMany: jest.fn().mockResolvedValue([]) },
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
        const r = await service.accept([5, 6, 7, 99], 'a@example.com');
        expect(r).toEqual({ done: 1, skipped: 3 });
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
