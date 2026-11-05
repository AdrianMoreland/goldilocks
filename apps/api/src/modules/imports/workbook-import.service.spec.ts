import { BadRequestException, ConflictException } from '@nestjs/common';
import {
    fakeWorkbookSheets,
    readImportWorkbook,
    referenceMatchKey,
    IMPORT_SCHEMA_VERSION,
    type WorkbookChunkRequest,
    type WorkbookLoadTable,
} from '@goldilocks/shared-types';
import { WorkbookImportService } from './workbook-import.service';
import { BcAwaitingImportService } from './bc-awaiting-import.service';

type R = Record<string, unknown>;

function matches(row: R, where: R): boolean {
    return Object.entries(where).every(([k, v]) => {
        if (k === 'OR') return (v as R[]).some((w) => matches(row, w));
        if (v && typeof v === 'object' && !(v instanceof Date)) {
            const c = v as { in?: unknown[]; not?: unknown; endsWith?: string };
            if (c.in) return c.in.includes(row[k]);
            if ('endsWith' in c)
                return String(row[k]).endsWith(String(c.endsWith));
            if ('not' in c) return row[k] !== c.not;
        }
        return row[k] === v;
    });
}

/** An in-memory stand-in for one Prisma model: just the calls the import makes. */
class FakeTable {
    rows: R[] = [];
    private next = 1;
    constructor(private readonly defaults: R = {}) {}
    findMany = async (args: { where?: R } = {}) =>
        this.rows
            .filter((r) => matches(r, args.where ?? {}))
            .map((r) => ({ ...r }));
    createMany = async ({ data }: { data: R[] }) => {
        for (const d of data)
            this.rows.push({
                id: this.next++,
                missingFromImport: false,
                ...this.defaults,
                ...d,
            });
    };
    create = async ({ data }: { data: R }) => {
        const row = { id: this.next++, ...data };
        this.rows.push(row);
        return { ...row };
    };
    findUnique = async ({ where }: { where: R }) =>
        this.rows.find((r) => matches(r, where)) ?? null;
    findUniqueOrThrow = async ({ where }: { where: R }) =>
        this.rows.find((r) => matches(r, where))!;
    update = async ({ where, data }: { where: R; data: R }) => {
        Object.assign(this.rows.find((r) => matches(r, where))!, data);
    };
    updateMany = async ({ where, data }: { where: R; data: R }) => {
        const hit = this.rows.filter((r) => matches(r, where));
        for (const r of hit) Object.assign(r, data);
        return { count: hit.length };
    };
}

function setup() {
    const t = {
        customer: new FakeTable(),
        vendor: new FakeTable(),
        supplierInvoice: new FakeTable(),
        zohoInvoice: new FakeTable(),
        zohoInvoiceLine: new FakeTable(),
        lineSerial: new FakeTable(),
        zohoPayment: new FakeTable(),
        zohoPurchaseOrderLine: new FakeTable(),
        bcSalesOrder: new FakeTable(),
        bcTrackingEntry: new FakeTable(),
        trade: new FakeTable(),
        purchaseLot: new FakeTable(),
        quote: new FakeTable({ status: 'OPEN' }),
        entityLink: new FakeTable(),
        importBatch: new FakeTable(),
        stocktake: new FakeTable(),
        stocktakeBar: new FakeTable(),
        stocktakeCoin: new FakeTable(),
        stocktakeLine: new FakeTable(),
        bcItem: new FakeTable(),
        productAlias: new FakeTable(),
        orderEvent: new FakeTable(),
    };
    const prisma = {
        ...t,
        $transaction: async (fn: (tx: unknown) => unknown) => fn(prisma),
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const service = new WorkbookImportService(
        prisma as never,
        audit as never,
        { settle: jest.fn() } as never,
    );
    const bc = new BcAwaitingImportService(prisma as never, service);
    return { t, service, audit, bc };
}

const tables = readImportWorkbook(fakeWorkbookSheets(3))
    .tables as unknown as Record<string, R[]>;
const rowsOf = (table: string, patch: (r: R, i: number) => R = (r) => r): R[] =>
    tables[table].map((r, i) => patch({ ...r }, i));
const people = (): R[] =>
    rowsOf('customers', (r, i) => ({
        ...r,
        id: `C00000${i + 1}`,
        name: `Fake Person ${i + 1}`,
    }));

const req = (
    table: WorkbookLoadTable,
    rows: R[],
    extra: Partial<WorkbookChunkRequest> = {},
): WorkbookChunkRequest => ({
    fileName: 'fake.xlsx',
    schemaVersion: IMPORT_SCHEMA_VERSION,
    table,
    rows,
    lastOfTable: false,
    complete: false,
    ...extra,
});

describe('WorkbookImportService', () => {
    it('adds on the first import and changes nothing on the second', async () => {
        const { service, t } = setup();
        const first = await service.commit(
            req('customers', people()),
            'admin@example.com',
        );
        expect(first).toMatchObject({ added: 3, changed: 0, unchanged: 0 });
        const second = await service.commit(
            req('customers', people(), { batchId: first.batchId }),
            'admin@example.com',
        );
        expect(second).toMatchObject({ added: 0, changed: 0, unchanged: 3 });
        expect(t.customer.rows).toHaveLength(3);
    });

    it('imports a dependent table and counts rows whose parent is not loaded', async () => {
        const { service, t } = setup();
        const batch = await service.commit(req('customers', people()), 'a');
        const invoices = rowsOf('invoices', (r, i) => ({
            ...r,
            id: `inv-${i}`,
            customer_code: i === 0 ? 'C000009' : 'C000001',
        }));
        const r = await service.commit(
            req('invoices', invoices, { batchId: batch.batchId }),
            'a',
        );
        expect(r).toMatchObject({ added: 3, unresolved: { customer_code: 1 } });
        expect(
            t.zohoInvoice.rows.filter((x) => x['customerId'] === null),
        ).toHaveLength(1);

        const lines = rowsOf('invoice_lines', (l, i) => ({
            ...l,
            id: `line-${i}`,
            invoice_id: i === 0 ? 'inv-missing' : 'inv-1',
        }));
        const lr = await service.commit(
            req('invoice_lines', lines, { batchId: batch.batchId }),
            'a',
        );
        expect(lr.added).toBe(2);
        expect(lr.unresolved['invoice_id']).toBe(1);
    });

    it('updates only the fields that changed', async () => {
        const { service, t } = setup();
        const b = await service.commit(req('customers', people()), 'a');
        const edited = people().map((p, i) =>
            i === 1 ? { ...p, currency: 'GBP' } : p,
        );
        const r = await service.commit(
            req('customers', edited, { batchId: b.batchId }),
            'a',
        );
        expect(r).toMatchObject({ added: 0, changed: 1, unchanged: 2 });
        expect(t.customer.rows[1]).toMatchObject({ currency: 'GBP' });
    });

    it('flags a row missing from a newer batch, never deletes it, and clears the flag when it returns', async () => {
        const { service, t } = setup();
        await service.commit(
            req('customers', people(), { complete: true }),
            'a',
        );
        const second = await service.commit(
            req('customers', people().slice(0, 2), { lastOfTable: true }),
            'a',
        );
        expect(second.markedMissing).toBe(1);
        expect(t.customer.rows).toHaveLength(3);
        expect(
            t.customer.rows.filter((r) => r['missingFromImport']),
        ).toHaveLength(1);

        const third = await service.commit(
            req('customers', people(), { lastOfTable: true }),
            'a',
        );
        expect(third.markedMissing).toBe(0);
        expect(
            t.customer.rows.filter((r) => r['missingFromImport']),
        ).toHaveLength(0);
    });

    it('attaches workbook columns to trades the tradesheet loaded, and creates nothing for the rest', async () => {
        const { service, t } = setup();
        const b = await service.commit(req('customers', people()), 'a');
        const trades = rowsOf('trades', (r, i) => ({
            ...r,
            id: `tr-${i}`,
            reference: `DU-G2026090${i}`,
            occurrence: 1,
            client_code: 'C000001',
            cpty_kind: 'HEDGED',
        }));
        t.trade.rows.push({
            id: 10,
            referenceKey: referenceMatchKey('DU-G20260900'),
            occurrence: 1,
            sourceKey: null,
            system: null,
            cptyFill: null,
            customerId: null,
            supplierInvoiceId: null,
        });

        const r = await service.commit(
            req('trades', trades, { batchId: b.batchId }),
            'a',
        );
        expect(r).toMatchObject({ changed: 1, unmatched: 2, added: 0 });
        expect(t.trade.rows).toHaveLength(1);
        expect(t.trade.rows[0]).toMatchObject({
            sourceKey: 'tr-0',
            customerId: 1,
        });

        const again = await service.commit(
            req('trades', trades, { batchId: b.batchId }),
            'a',
        );
        expect(again).toMatchObject({ changed: 0, unchanged: 1, unmatched: 2 });
    });

    it('keeps a quote as its own record and marks it invoiced when the sale appears', async () => {
        const { service, t } = setup();
        const b = await service.commit(req('customers', people()), 'a');
        const quote = rowsOf('trades', (r) => ({
            ...r,
            id: 'q-1',
            reference: 'DU-G20260950',
            client_code: 'C000001',
            cpty_kind: 'QUOTE_ONLY',
            metal: 'GOLD',
        })).slice(0, 1);
        const q = await service.commit(
            req('trades', quote, { batchId: b.batchId }),
            'a',
        );
        expect(q.quotes).toBe(1);
        expect(t.quote.rows[0]).toMatchObject({
            status: 'OPEN',
            referenceKey: referenceMatchKey('DU-G20260950'),
        });

        t.trade.rows.push({
            id: 77,
            referenceKey: referenceMatchKey('DU-G20260950'),
            occurrence: 1,
        });
        const sale = rowsOf('trades', (r) => ({
            ...r,
            id: 'tr-9',
            reference: 'DU-G20260950',
            occurrence: 1,
            cpty_kind: 'HEDGED',
        })).slice(0, 1);
        const s = await service.commit(
            req('trades', sale, { batchId: b.batchId }),
            'a',
        );
        expect(s.quotesInvoiced).toBe(1);
        expect(t.quote.rows[0]).toMatchObject({
            status: 'INVOICED',
            convertedTradeId: 77,
        });
        expect(t.quote.rows).toHaveLength(1);
    });

    it('stores EXACT links confirmed and PROBABLE links pending, and keeps a decision across imports', async () => {
        const { service, t } = setup();
        const links = rowsOf('links', (r, i) => ({
            ...r,
            link_type: 'trade_lot',
            from_id: `t${i}`,
            to_id: `l${i}`,
            confidence: i === 0 ? 'EXACT' : 'PROBABLE',
        }));
        const b = await service.commit(req('links', links), 'a');
        expect(b.added).toBe(3);
        expect(t.entityLink.rows.map((r) => r['status'])).toEqual([
            'CONFIRMED',
            'PENDING',
            'PENDING',
        ]);

        t.entityLink.rows[1]['status'] = 'REJECTED';
        const again = await service.commit(
            req('links', links, { batchId: b.batchId }),
            'a',
        );
        expect(again).toMatchObject({ added: 0, changed: 0, unchanged: 3 });
        expect(t.entityLink.rows[1]).toMatchObject({ status: 'REJECTED' });
    });

    it('previews without writing', async () => {
        const { service, t } = setup();
        const r = await service.preview(req('customers', people()));
        expect(r).toMatchObject({ batchId: 0, added: 3 });
        expect(t.customer.rows).toHaveLength(0);
        expect(t.importBatch.rows).toHaveLength(0);
    });

    it('rejects rows that break the schema without echoing their values', async () => {
        const { service } = setup();
        const bad = people().map((p, i) =>
            i === 0 ? { ...p, rows: 'Secret Value' } : p,
        );
        const err = await service
            .commit(req('customers', bad), 'a')
            .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(BadRequestException);
        expect(
            JSON.stringify((err as BadRequestException).getResponse()),
        ).not.toContain('Secret Value');
    });

    it('does not accept more chunks once the batch is complete', async () => {
        const { service } = setup();
        const b = await service.commit(
            req('customers', people(), { complete: true }),
            'a',
        );
        await expect(
            service.commit(
                req('vendors', people(), { batchId: b.batchId }),
                'a',
            ),
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('audits counts only', async () => {
        const { service, audit } = setup();
        await service.commit(req('customers', people()), 'admin@example.com');
        const detail = String(audit.record.mock.calls[0]![2]);
        expect(detail).toMatch(/customers: 3 added/);
        expect(detail).not.toContain('Fake Person');
    });

    it('puts stock rows into one imported stocktake per snapshot and is repeat-safe', async () => {
        const { service, t } = setup();
        const bars = rowsOf('stock_bars', (r, i) => ({
            ...r,
            snapshot: 'safe',
            metal: i === 0 ? 'PLATINUM' : 'GOLD',
            branch: 'DU',
        }));
        const first = await service.commit(req('stock_bars', bars), 'a');
        expect(first.added).toBe(3);
        expect(t.stocktake.rows).toHaveLength(1);
        expect(t.stocktake.rows[0]).toMatchObject({
            name: 'Imported: safe',
            imported: true,
            status: 'DRAFT',
        });
        expect(t.stocktakeBar.rows[0]).toMatchObject({
            metal: 'PGM',
            locationCode: 'DU',
            stocktakeId: t.stocktake.rows[0]['id'],
        });

        const again = await service.commit(
            req('stock_bars', bars, { batchId: first.batchId }),
            'a',
        );
        expect(again).toMatchObject({ added: 0, changed: 0, unchanged: 3 });
        expect(t.stocktake.rows).toHaveLength(1);
    });

    it('imports coin counts and journal lines with derived counted flags', async () => {
        const { service, t } = setup();
        const coins = rowsOf('stock_coins', (r) => ({
            ...r,
            snapshot: 'safe',
            counts_json: '{"oct":4}',
            qty_counted: 4,
        }));
        await service.commit(req('stock_coins', coins), 'a');
        expect(t.stocktakeCoin.rows[0]).toMatchObject({
            countedQty: 4,
            countsJson: { oct: 4 },
        });

        const lines = rowsOf('bc_journal_lines', (r, i) => ({
            ...r,
            snapshot: 'BC Report',
            counted_normal: i === 0 ? 2 : null,
            counted_customer: null,
        }));
        await service.commit(req('bc_journal_lines', lines), 'a');
        expect(t.stocktakeLine.rows.map((r) => r['counted'])).toEqual([
            true,
            false,
            false,
        ]);
    });

    it('does not call a JSON column changed just because the database reordered its keys', async () => {
        const { service, t } = setup();
        const coins = rowsOf('stock_coins', (r) => ({
            ...r,
            snapshot: 'safe',
            counts_json: '{"oct":4,"sept":2}',
        }));
        await service.commit(req('stock_coins', coins), 'a');
        for (const row of t.stocktakeCoin.rows)
            row['countsJson'] = { sept: 2, oct: 4 };
        const again = await service.commit(req('stock_coins', coins), 'a');
        expect(again).toMatchObject({ added: 0, changed: 0, unchanged: 3 });

        const edited = coins.map((c) => ({
            ...c,
            counts_json: '{"oct":5,"sept":2}',
        }));
        expect(
            (await service.commit(req('stock_coins', edited), 'a')).changed,
        ).toBe(3);
    });

    it('keeps a confirmed alias link: productKey is only set on create', async () => {
        const { service, t } = setup();
        const aliases = rowsOf('product_aliases', (r) => ({ ...r, uses: 5 }));
        await service.commit(req('product_aliases', aliases), 'a');
        t.productAlias.rows[0]['productKey'] = 'confirmed-key';
        const again = await service.commit(
            req(
                'product_aliases',
                aliases.map((a) => ({ ...a, uses: 9 })),
            ),
            'a',
        );
        expect(again.changed).toBe(3);
        expect(t.productAlias.rows[0]).toMatchObject({
            productKey: 'confirmed-key',
            uses: 9,
        });
    });

    it('loads BC items keyed by item number', async () => {
        const { service, t } = setup();
        const r = await service.commit(
            req('bc_items', rowsOf('bc_items')),
            'a',
        );
        expect(r.added).toBe(3);
        expect(t.bcItem.rows[0]).toMatchObject({ itemNo: 'id-1' });
        expect(
            (await service.commit(req('bc_items', rowsOf('bc_items')), 'a'))
                .unchanged,
        ).toBe(3);
    });

    describe('BC awaiting-collection report', () => {
        const order = (id: string, core: string): R => ({
            ...rowsOf('bc_sales_orders')[0],
            id,
            ext_doc_no: `DU-${core}`,
            ext_doc_core: core,
        });
        const report = (...orders: R[]) => ({
            fileName: 'bc.xlsx',
            schemaVersion: IMPORT_SCHEMA_VERSION as '1.1',
            rows: orders,
        });

        it('posts the trade of an order that dropped out of the report, once', async () => {
            const { bc, t } = setup();
            t.trade.rows.push({
                id: 5,
                referenceKey: referenceMatchKey('DU-G20260941'),
                occurrence: 1,
            });
            t.trade.rows.push({
                id: 6,
                referenceKey: referenceMatchKey('DU-G20260970'),
                occurrence: 1,
            });

            const first = await bc.commit(
                report(order('SO1', 'G20260941'), order('SO2', 'G20260970')),
                'a',
            );
            expect(first).toMatchObject({ added: 2, gone: 0, posted: 0 });

            const second = await bc.commit(
                report(order('SO2', 'G20260970')),
                'a',
            );
            expect(second).toMatchObject({ unchanged: 1, gone: 1, posted: 1 });
            expect(t.orderEvent.rows).toEqual([
                expect.objectContaining({
                    tradeId: 5,
                    step: 'POSTED',
                    by: 'import',
                }),
            ]);
            expect(
                t.bcSalesOrder.rows.find((o) => o['sourceKey'] === 'SO1'),
            ).toMatchObject({ missingFromImport: true });

            const third = await bc.commit(
                report(order('SO2', 'G20260970')),
                'a',
            );
            expect(third.posted).toBe(0);
            expect(t.orderEvent.rows).toHaveLength(1);
        });

        it('previews without posting', async () => {
            const { bc, t } = setup();
            t.trade.rows.push({
                id: 5,
                referenceKey: referenceMatchKey('DU-G20260941'),
                occurrence: 1,
            });
            await bc.commit(report(order('SO1', 'G20260941')), 'a');
            const p = await bc.preview(report(order('SO9', 'G20260999')));
            expect(p).toMatchObject({ gone: 1, posted: 1 });
            expect(t.orderEvent.rows).toHaveLength(0);
            expect(
                t.bcSalesOrder.rows.filter((o) => o['missingFromImport']),
            ).toHaveLength(0);
        });
    });
});
