import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ImportTableSchemas,
    type ImportBatchSummary,
    referenceMatchKey,
    type CustomerOrderImportRow,
    type ImportTableName,
    type StockMetal,
    type WorkbookChunkRequest,
    type WorkbookChunkResult,
    type WorkbookLoadTable,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { LinkRulesService } from '../review/link-rules.service';
import { CustomerOrdersService } from '../customer-orders/customer-orders.service';
import {
    DIRECT_TABLES,
    FK_LOOKUP,
    changedFields,
    mapFields,
    type DirectTableSpec,
    type FkKind,
    type Row,
} from './workbook-tables';

/** The few Prisma delegate methods the import uses; keeps the generic code free of per-model types. */
interface Delegate {
    findMany(args: unknown): Promise<Row[]>;
    createMany(args: unknown): Promise<unknown>;
    update(args: unknown): Promise<unknown>;
    create(args: unknown): Promise<Row>;
    updateMany(args: unknown): Promise<{ count: number }>;
}

type Db = Prisma.TransactionClient | PrismaService;
type Counts = Omit<WorkbookChunkResult, 'batchId' | 'table'>;

const emptyCounts = (): Counts => ({
    added: 0,
    changed: 0,
    unchanged: 0,
    unmatched: 0,
    quotes: 0,
    quotesInvoiced: 0,
    unresolved: {},
    markedMissing: 0,
});

const str = (v: unknown): string | null =>
    typeof v === 'string' && v !== '' ? v : null;
const metalOf = (m: unknown): 'GOLD' | 'SILVER' | 'PGM' =>
    m === 'GOLD' || m === 'SILVER' ? m : 'PGM';

/**
 * Loads the assembled import workbook, one table per request. Every row is upserted by its `sourceKey`, so sending
 * the same file again adds and changes nothing; a row missing from a newer file is flagged, never deleted.
 * Trades and purchase lots belong to the tradesheet importer: this only attaches the workbook's extra columns to the
 * rows it already loaded, and creates nothing for a reference it has not seen. Logs and audit entries carry counts
 * only, never row values.
 */
@Injectable()
export class WorkbookImportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly rules: LinkRulesService,
        private readonly orders: CustomerOrdersService,
    ) {}

    /** What this chunk would do. Writes nothing (the batch id is 0 until a commit creates one). */
    async preview(dto: WorkbookChunkRequest): Promise<WorkbookChunkResult> {
        return this.loadChunk(dto, this.prisma, 'preview', true);
    }

    async commit(
        dto: WorkbookChunkRequest,
        actor: string,
    ): Promise<WorkbookChunkResult> {
        return this.prisma.$transaction(
            (tx) => this.loadChunk(dto, tx, actor, false),
            { timeout: 120_000, maxWait: 10_000 },
        );
    }

    /** The last imports, newest first, for the Import hub's history. Counts only. */
    async recentBatches(limit = 20): Promise<ImportBatchSummary[]> {
        const rows = await this.prisma.importBatch.findMany({
            where: { kind: 'WORKBOOK' },
            orderBy: { importedAt: 'desc' },
            take: limit,
        });
        return rows.map((r) => ({
            id: r.id,
            fileName: r.fileName,
            importedBy: r.importedBy,
            importedAt: r.importedAt.toISOString(),
            status: r.status,
            schemaVersion: r.schemaVersion,
            tableCounts: (r.tableCounts ??
                null) as ImportBatchSummary['tableCounts'],
        }));
    }

    /** One chunk, inside the caller's transaction (or none, for a preview). */
    async loadChunk(
        dto: WorkbookChunkRequest,
        db: Db,
        actor: string,
        dry: boolean,
    ): Promise<WorkbookChunkResult> {
        const rows = this.validate(dto.table, dto.rows);
        const batchId = await this.openBatch(db, dto, actor, dry);
        const ctx: Ctx = { db, dry, batchId, actor };

        let counts: Counts;
        if (dto.table === 'trades')
            counts = await this.annotateTrades(ctx, rows);
        else if (dto.table === 'purchase_lots')
            counts = await this.annotateLots(ctx, rows);
        else if (dto.table === 'links')
            counts = await this.upsertLinks(ctx, rows);
        else if (dto.table === 'customer_safe_items')
            counts = await this.saveSafeItems(ctx, rows);
        else
            counts = await this.upsertDirect(
                ctx,
                DIRECT_TABLES[dto.table]!,
                rows,
            );

        if (dto.lastOfTable && !dry)
            counts.markedMissing = await this.flagMissing(ctx, dto.table);
        if (!dry) await this.closeBatch(db, batchId, dto, counts, actor);
        return { batchId, table: dto.table, ...counts };
    }

    // --- validation and the batch ------------------------------------------------------------

    /** Checks every row against the table's schema. Errors name the row and column, never the value. */
    private validate(table: WorkbookLoadTable, input: Row[]): Row[] {
        const schema = ImportTableSchemas[table as ImportTableName];
        const people = table === 'customers' || table === 'vendors';
        const problems: string[] = [];
        const out = input.map((raw, i) => {
            const { name, ...rest } = raw;
            const parsed = schema.safeParse(people ? rest : raw);
            if (!parsed.success) {
                if (problems.length < 10)
                    problems.push(
                        `row ${i + 1}: ${parsed.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join(', ')}`,
                    );
                return raw;
            }
            if (people && (typeof name !== 'string' || name.trim() === '')) {
                if (problems.length < 10)
                    problems.push(`row ${i + 1}: name is required`);
            }
            return people ? { ...(parsed.data as Row), name } : parsed.data;
        });
        if (problems.length)
            throw new BadRequestException({
                message: `Rows rejected in ${table}.`,
                problems,
            });
        return out;
    }

    private async openBatch(
        db: Db,
        dto: WorkbookChunkRequest,
        actor: string,
        dry: boolean,
    ): Promise<number> {
        if (dto.batchId === undefined) {
            if (dry) return 0;
            const created = await db.importBatch.create({
                data: {
                    fileName: dto.fileName,
                    sheetMonth: new Date().toISOString().slice(0, 7),
                    source: 'WORKBOOK',
                    kind: 'WORKBOOK',
                    schemaVersion: dto.schemaVersion,
                    status: 'OPEN',
                    importedBy: actor,
                    summary: {},
                    tableCounts: {},
                },
            });
            return created.id;
        }
        const batch = await db.importBatch.findUnique({
            where: { id: dto.batchId },
        });
        if (!batch || batch.kind !== 'WORKBOOK')
            throw new NotFoundException(
                `Import batch ${dto.batchId} not found.`,
            );
        if (batch.status !== 'OPEN')
            throw new ConflictException(
                'That import batch is already complete.',
            );
        return batch.id;
    }

    private async closeBatch(
        db: Db,
        batchId: number,
        dto: WorkbookChunkRequest,
        counts: Counts,
        actor: string,
    ): Promise<void> {
        const batch = await db.importBatch.findUniqueOrThrow({
            where: { id: batchId },
        });
        const so_far = (batch.tableCounts ?? {}) as Record<
            string,
            Record<string, number>
        >;
        const t = so_far[dto.table] ?? {
            added: 0,
            changed: 0,
            unchanged: 0,
            unmatched: 0,
        };
        so_far[dto.table] = {
            added: (t.added ?? 0) + counts.added,
            changed: (t.changed ?? 0) + counts.changed,
            unchanged: (t.unchanged ?? 0) + counts.unchanged,
            unmatched: (t.unmatched ?? 0) + counts.unmatched,
        };
        await db.importBatch.update({
            where: { id: batchId },
            data: {
                tableCounts: so_far,
                ...(dto.complete ? { status: 'COMPLETE' } : {}),
            },
        });
        await this.audit.record(
            actor,
            'workbook-import',
            `batch ${batchId} ${dto.table}: ${counts.added} added, ${counts.changed} changed, ${counts.unchanged} unchanged${dto.complete ? ', complete' : ''}`,
            db,
        );
    }

    // --- parents looked up by key -------------------------------------------------------------

    private delegate(db: Db, name: string): Delegate {
        return (db as unknown as Record<string, Delegate>)[name];
    }

    /** Ids of the parent rows these keys name, one query per kind. */
    private async lookupIds(
        db: Db,
        kind: FkKind,
        keys: string[],
    ): Promise<Map<string, number>> {
        const out = new Map<string, number>();
        if (keys.length === 0) return out;
        const { delegate, matchField } = FK_LOOKUP[kind];
        for (let i = 0; i < keys.length; i += 5000) {
            const found = await this.delegate(db, delegate).findMany({
                where: { [matchField]: { in: keys.slice(i, i + 5000) } },
                select: { id: true, [matchField]: true },
            });
            for (const r of found)
                out.set(String(r[matchField]), r['id'] as number);
        }
        return out;
    }

    private async resolveParents(
        db: Db,
        rows: Row[],
        fks: readonly { column: string; kind: FkKind }[],
    ): Promise<Map<string, Map<string, number>>> {
        const maps = new Map<string, Map<string, number>>();
        for (const fk of fks) {
            const keys = [
                ...new Set(
                    rows
                        .map((r) => str(r[fk.column]))
                        .filter((k): k is string => k !== null),
                ),
            ];
            maps.set(
                `${fk.kind}:${fk.column}`,
                await this.lookupIds(db, fk.kind, keys),
            );
        }
        return maps;
    }

    // --- plain upserts by key ----------------------------------------------------------------

    private async upsertDirect(
        ctx: Ctx,
        spec: DirectTableSpec,
        input: Row[],
    ): Promise<Counts> {
        const counts = emptyCounts();
        const parents = await this.resolveParents(ctx.db, input, spec.fks);

        // Last row wins when a key repeats inside one chunk.
        const byKey = new Map<string, Record<string, unknown>>();
        for (const row of input) {
            const key = spec.keyOf ? spec.keyOf(row) : str(row[spec.keyColumn]);
            if (!key) {
                if (spec.keyOf) counts.unmatched++;
                continue;
            }
            const data = mapFields(row, spec.fields);
            spec.derive?.(data, row, key);
            let skip = false;
            for (const fk of spec.fks) {
                const parentKey = str(row[fk.column]);
                const id = parentKey
                    ? parents.get(`${fk.kind}:${fk.column}`)?.get(parentKey)
                    : undefined;
                if (id === undefined) {
                    // A supplier name sitting in a customer column is not a customer; only a coded key counts as unresolved.
                    if (
                        (parentKey && /^[CV]\d{6}$/.test(parentKey)) ||
                        fk.required
                    )
                        counts.unresolved[fk.column] =
                            (counts.unresolved[fk.column] ?? 0) + 1;
                    if (fk.required) skip = true;
                    data[fk.field] = null;
                } else data[fk.field] = id;
            }
            if (!skip) byKey.set(key, data);
        }

        const tracked = spec.tracked !== false;
        if (spec.stocktakeSnapshotColumn) {
            const snapshots = new Map<string, string>();
            for (const row of input) {
                const k = spec.keyOf
                    ? spec.keyOf(row)
                    : str(row[spec.keyColumn]);
                if (k)
                    snapshots.set(
                        k,
                        str(row[spec.stocktakeSnapshotColumn]) ?? 'unknown',
                    );
            }
            const ids = await this.ensureStocktakes(ctx, [
                ...new Set(snapshots.values()),
            ]);
            for (const [key, data] of byKey) {
                const id = ids.get(snapshots.get(key) ?? 'unknown');
                if (id !== undefined) data['stocktakeId'] = id;
            }
        }

        const d = this.delegate(ctx.db, spec.delegate);
        const keys = [...byKey.keys()];
        const existing = new Map<string, Row>();
        for (let i = 0; i < keys.length; i += 5000) {
            const found = await d.findMany({
                where: { [spec.keyField]: { in: keys.slice(i, i + 5000) } },
            });
            for (const r of found) existing.set(String(r[spec.keyField]), r);
        }

        const toCreate: Record<string, unknown>[] = [];
        const toTouch: string[] = [];
        for (const [key, data] of byKey) {
            const old = existing.get(key);
            if (!old) {
                counts.added++;
                toCreate.push({
                    ...data,
                    [spec.keyField]: key,
                    ...(tracked ? { importBatchId: ctx.batchId } : {}),
                });
                continue;
            }
            // Fields in createOnly are set when a row is created and left to people afterwards.
            const writable = { ...data };
            for (const f of spec.createOnly ?? []) delete writable[f];
            const diff = changedFields(old, writable);
            if (Object.keys(diff).length === 0) {
                counts.unchanged++;
                toTouch.push(key);
            } else {
                counts.changed++;
                if (!ctx.dry)
                    await d.update({
                        where: { [spec.keyField]: key },
                        data: tracked
                            ? {
                                  ...diff,
                                  importBatchId: ctx.batchId,
                                  missingFromImport: false,
                              }
                            : diff,
                    });
            }
        }
        if (!ctx.dry) {
            for (let i = 0; i < toCreate.length; i += 1000)
                await d.createMany({
                    data: toCreate.slice(i, i + 1000),
                    ...(tracked ? {} : { skipDuplicates: true }),
                });
            if (tracked) await this.stamp(ctx, d, spec.keyField, toTouch);
        }
        return counts;
    }

    /** One imported stocktake per snapshot name, found again on a re-import. Rows belong to it by `stocktakeId`. */
    private async ensureStocktakes(
        ctx: Ctx,
        snapshots: string[],
    ): Promise<Map<string, number>> {
        const names = snapshots.map((s) => `Imported: ${s}`);
        const st = this.delegate(ctx.db, 'stocktake');
        const found = await st.findMany({
            where: { imported: true, name: { in: names } },
        });
        const out = new Map<string, number>();
        for (const f of found) {
            out.set(
                String(f['name']).replace(/^Imported: /, ''),
                f['id'] as number,
            );
        }
        if (ctx.dry) return out;
        const today = new Date(
            `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`,
        );
        for (const snap of snapshots) {
            if (out.has(snap)) continue;
            const created = await st.create({
                data: {
                    name: `Imported: ${snap}`,
                    countDate: today,
                    cutoffDate: today,
                    status: 'DRAFT',
                    createdBy: ctx.actor,
                    imported: true,
                    importBatchId: ctx.batchId,
                },
            });
            out.set(snap, created['id'] as number);
        }
        return out;
    }

    /** Marks rows seen again in this batch (and clears a missing flag) without counting that as a change. */
    private async stamp(
        ctx: Ctx,
        d: Delegate,
        keyField: string,
        keys: string[],
    ): Promise<void> {
        for (let i = 0; i < keys.length; i += 5000) {
            await d.updateMany({
                where: {
                    [keyField]: { in: keys.slice(i, i + 5000) },
                    OR: [
                        { importBatchId: { not: ctx.batchId } },
                        { missingFromImport: true },
                    ],
                },
                data: { importBatchId: ctx.batchId, missingFromImport: false },
            });
        }
    }

    /** After the last chunk of a table: rows no chunk of this batch touched are flagged, not deleted. */
    private async flagMissing(
        ctx: Ctx,
        table: WorkbookLoadTable,
    ): Promise<number> {
        const where = {
            importBatchId: { not: ctx.batchId },
            missingFromImport: false,
        };
        if (table === 'trades') {
            return (
                await this.delegate(ctx.db, 'quote').updateMany({
                    where,
                    data: { missingFromImport: true },
                })
            ).count;
        }
        const spec = DIRECT_TABLES[table];
        if (!spec || spec.tracked === false) return 0; // purchase lots and links: the tradesheet importer / the review queue own those flags
        return (
            await this.delegate(ctx.db, spec.delegate).updateMany({
                where,
                data: { missingFromImport: true },
            })
        ).count;
    }

    // --- customer safe items: saved as customer orders ------------------------------------------

    /**
     * Customer safe rows become customer order items, matched and updated by the same rules as the Customer Orders
     * paste import (planRows / writePlan), so the two routes never duplicate each other. The client code is resolved
     * to the customer's real name from the customers table; a row with an unknown code, no product or branch, or a
     * quantity that is not a whole number above zero is skipped and counted as unmatched. Nothing is flagged missing.
     * Every chunk plans against what is stored, so a table must travel in one chunk: two identical rows split across
     * chunks would pair with the item the first chunk added and the second would be lost.
     */
    private async saveSafeItems(ctx: Ctx, input: Row[]): Promise<Counts> {
        const counts = emptyCounts();
        const codes = [
            ...new Set(
                input
                    .map((r) => str(r['client_code']))
                    .filter((k): k is string => k !== null),
            ),
        ];
        const names = new Map<string, string>();
        for (let i = 0; i < codes.length; i += 5000) {
            const found = await ctx.db.customer.findMany({
                where: { redactionCode: { in: codes.slice(i, i + 5000) } },
                select: { redactionCode: true, name: true },
            });
            for (const c of found) names.set(c.redactionCode, c.name);
        }

        const rows: CustomerOrderImportRow[] = [];
        const metals = new Map<CustomerOrderImportRow, StockMetal>();
        for (const r of input) {
            const code = str(r['client_code']);
            const client = code ? names.get(code)?.trim() : undefined;
            if (!client) {
                counts.unresolved['client_code'] =
                    (counts.unresolved['client_code'] ?? 0) + 1;
                counts.unmatched++;
                continue;
            }
            const qty = r['qty'];
            const product = str(r['product_text'])?.trim();
            const branch = str(r['branch_code'])?.trim();
            const status = r['status_norm'];
            if (
                typeof qty !== 'number' ||
                !Number.isInteger(qty) ||
                qty < 1 ||
                !product ||
                !branch ||
                (status !== 'ALLOCATED' &&
                    status !== 'COLLECTED' &&
                    status !== 'ORDERED')
            ) {
                counts.unmatched++;
                continue;
            }
            const text = (v: unknown) => str(v)?.trim() || null;
            const row: CustomerOrderImportRow = {
                locationCode: branch.toUpperCase(),
                client,
                reference: text(r['reference']),
                supplierRef: null,
                product,
                quantity: qty,
                refinery: text(r['refinery']),
                serials: text(r['serials']),
                status,
                orderedOn: str(r['date']),
                missing: false,
                notes: text(r['notes']),
            };
            rows.push(row);
            metals.set(row, metalOf(r['metal']));
        }

        const plan = await this.orders.planRows(ctx.db, rows);
        counts.added = plan.toAdd.length;
        counts.changed = plan.toUpdate.length;
        counts.unchanged = plan.unchanged;
        if (!ctx.dry)
            await this.orders.writePlan(
                ctx.db,
                plan,
                (row) => metals.get(row) ?? 'PGM',
                ctx.actor,
            );
        return counts;
    }

    // --- trades and purchase lots: attach, never create ----------------------------------------

    private async annotateTrades(ctx: Ctx, input: Row[]): Promise<Counts> {
        const counts = emptyCounts();
        const sales = input.filter((r) => r['cpty_kind'] !== 'QUOTE_ONLY');
        const quotes = input.filter((r) => r['cpty_kind'] === 'QUOTE_ONLY');
        const parents = await this.resolveParents(ctx.db, input, [
            { column: 'client_code', kind: 'customer' },
            { column: 'supplier_invoice_id', kind: 'supplierInvoice' },
        ]);
        const idOf = (
            kind: FkKind,
            column: string,
            row: Row,
        ): number | null => {
            const k = str(row[column]);
            const id = k ? parents.get(`${kind}:${column}`)?.get(k) : undefined;
            if (
                k &&
                id === undefined &&
                !(column === 'client_code' && !/^[CV]\d{6}$/.test(k))
            )
                counts.unresolved[column] =
                    (counts.unresolved[column] ?? 0) + 1;
            return id ?? null;
        };

        const trades = this.delegate(ctx.db, 'trade');
        const keys = [
            ...new Set(
                sales
                    .map((r) => referenceMatchKey(str(r['reference'])))
                    .filter(Boolean),
            ),
        ];
        const found: Row[] = [];
        for (let i = 0; i < keys.length; i += 5000) {
            found.push(
                ...(await trades.findMany({
                    where: { referenceKey: { in: keys.slice(i, i + 5000) } },
                })),
            );
        }
        const byRef = new Map(
            found.map((t) => [
                `${String(t['referenceKey'])}#${String(t['occurrence'])}`,
                t,
            ]),
        );

        for (const row of sales) {
            const trade = byRef.get(
                `${referenceMatchKey(str(row['reference']))}#${String(typeof row['occurrence'] === 'number' ? row['occurrence'] : 1)}`,
            );
            if (!trade) {
                counts.unmatched++;
                continue;
            }
            const next = {
                sourceKey: str(row['id']),
                system: str(row['system']),
                cptyFill: str(row['cpty_fill']),
                customerId: idOf('customer', 'client_code', row),
                supplierInvoiceId: idOf(
                    'supplierInvoice',
                    'supplier_invoice_id',
                    row,
                ),
            };
            const diff = changedFields(trade, next);
            if (Object.keys(diff).length === 0) counts.unchanged++;
            else {
                counts.changed++;
                if (!ctx.dry)
                    await trades.update({
                        where: { id: trade['id'] },
                        data: diff,
                    });
            }
            // A quote for this reference that is still open has now become a real sale.
            if (!ctx.dry) {
                const done = await this.delegate(ctx.db, 'quote').updateMany({
                    where: {
                        referenceKey: String(trade['referenceKey']),
                        status: 'OPEN',
                    },
                    data: { status: 'INVOICED', convertedTradeId: trade['id'] },
                });
                counts.quotesInvoiced += done.count;
            }
        }

        counts.quotes = await this.upsertQuotes(ctx, quotes, (row) =>
            idOf('customer', 'client_code', row),
        );
        return counts;
    }

    private async upsertQuotes(
        ctx: Ctx,
        rows: Row[],
        customerOf: (row: Row) => number | null,
    ): Promise<number> {
        const q = this.delegate(ctx.db, 'quote');
        const keys = rows
            .map((r) => str(r['id']))
            .filter((k): k is string => k !== null);
        const existing = new Map<string, Row>();
        for (let i = 0; i < keys.length; i += 5000) {
            for (const r of await q.findMany({
                where: { sourceKey: { in: keys.slice(i, i + 5000) } },
            }))
                existing.set(String(r['sourceKey']), r);
        }
        const toCreate: Record<string, unknown>[] = [];
        const seen: string[] = [];
        for (const row of rows) {
            const key = str(row['id']);
            if (!key) continue;
            const data = {
                reference: str(row['reference']) ?? '',
                referenceKey: referenceMatchKey(str(row['reference'])),
                date:
                    typeof row['date'] === 'string'
                        ? new Date(`${row['date']}T00:00:00.000Z`)
                        : null,
                metal: metalOf(row['metal']),
                branchCode: str(row['branch_code']),
                qty: typeof row['qty'] === 'number' ? row['qty'] : null,
                productText: str(row['product_text']) ?? '',
                productNorm: str(row['product_norm']),
                customerId: customerOf(row),
            };
            const old = existing.get(key);
            if (!old)
                toCreate.push({
                    ...data,
                    sourceKey: key,
                    importBatchId: ctx.batchId,
                });
            else {
                seen.push(key);
                const diff = changedFields(old, data);
                if (Object.keys(diff).length && !ctx.dry)
                    await q.update({ where: { id: old['id'] }, data: diff });
            }
        }
        if (!ctx.dry) {
            for (let i = 0; i < toCreate.length; i += 1000)
                await q.createMany({ data: toCreate.slice(i, i + 1000) });
            await this.stamp(ctx, q, 'sourceKey', seen);
        }
        return rows.length;
    }

    private async annotateLots(ctx: Ctx, input: Row[]): Promise<Counts> {
        const counts = emptyCounts();
        const parents = await this.resolveParents(ctx.db, input, [
            { column: 'seller_code', kind: 'customer' },
            { column: 'supplier_invoice_id', kind: 'supplierInvoice' },
        ]);
        const idOf = (
            kind: FkKind,
            column: string,
            row: Row,
        ): number | null => {
            const k = str(row[column]);
            const id = k ? parents.get(`${kind}:${column}`)?.get(k) : undefined;
            if (
                k &&
                id === undefined &&
                !(column === 'seller_code' && !/^[CV]\d{6}$/.test(k))
            )
                counts.unresolved[column] =
                    (counts.unresolved[column] ?? 0) + 1;
            return id ?? null;
        };
        const lots = this.delegate(ctx.db, 'purchaseLot');
        const keys = [
            ...new Set(
                input
                    .map((r) => referenceMatchKey(str(r['reference'])))
                    .filter(Boolean),
            ),
        ];
        const found: Row[] = [];
        for (let i = 0; i < keys.length; i += 5000) {
            found.push(
                ...(await lots.findMany({
                    where: { referenceKey: { in: keys.slice(i, i + 5000) } },
                })),
            );
        }
        const byRef = new Map(
            found.map((t) => [
                `${String(t['referenceKey'])}#${String(t['occurrence'])}`,
                t,
            ]),
        );
        for (const row of input) {
            const lot = byRef.get(
                `${referenceMatchKey(str(row['reference']))}#${String(typeof row['occurrence'] === 'number' ? row['occurrence'] : 1)}`,
            );
            if (!lot) {
                counts.unmatched++;
                continue;
            }
            const next = {
                sourceKey: str(row['id']),
                system: str(row['system']),
                sellerId: idOf('customer', 'seller_code', row),
                supplierInvoiceId: idOf(
                    'supplierInvoice',
                    'supplier_invoice_id',
                    row,
                ),
            };
            const diff = changedFields(lot, next);
            if (Object.keys(diff).length === 0) counts.unchanged++;
            else {
                counts.changed++;
                if (!ctx.dry)
                    await lots.update({ where: { id: lot['id'] }, data: diff });
            }
        }
        return counts;
    }

    // --- links ----------------------------------------------------------------------------------

    /**
     * EXACT links are stored CONFIRMED, PROBABLE ones PENDING. A link that already has a decision keeps it: only
     * method, confidence and note are refreshed, so a rejected pairing is not asked about again.
     */
    private async upsertLinks(ctx: Ctx, input: Row[]): Promise<Counts> {
        const counts = emptyCounts();
        const l = this.delegate(ctx.db, 'entityLink');
        const tupleOf = (r: Row) =>
            [
                r['link_type'],
                r['from_table'],
                r['from_id'],
                r['to_table'],
                r['to_id'],
            ]
                .map(String)
                .join('\u0001');
        const dedup = new Map(input.map((r) => [tupleOf(r), r]));

        const types = [
            ...new Set([...dedup.values()].map((r) => String(r['link_type']))),
        ];
        const fromKeys = [
            ...new Set([...dedup.values()].map((r) => String(r['from_id']))),
        ];
        const existing = new Map<string, Row>();
        for (let i = 0; i < fromKeys.length; i += 5000) {
            const rows = await l.findMany({
                where: {
                    linkType: { in: types },
                    fromKey: { in: fromKeys.slice(i, i + 5000) },
                },
            });
            for (const r of rows)
                existing.set(
                    [
                        r['linkType'],
                        r['fromTable'],
                        r['fromKey'],
                        r['toTable'],
                        r['toKey'],
                    ]
                        .map(String)
                        .join('\u0001'),
                    r,
                );
        }

        const toCreate: Record<string, unknown>[] = [];
        for (const [tuple, row] of dedup) {
            const fields = {
                method: str(row['method']) ?? '',
                confidence: row['confidence'],
                note: str(row['note']),
            };
            const old = existing.get(tuple);
            if (!old) {
                counts.added++;
                const exact = row['confidence'] === 'EXACT';
                toCreate.push({
                    linkType: row['link_type'],
                    fromTable: row['from_table'],
                    fromKey: row['from_id'],
                    toTable: row['to_table'],
                    toKey: row['to_id'],
                    ...fields,
                    status: exact ? 'CONFIRMED' : 'PENDING',
                    ...(exact
                        ? { confirmedBy: 'import', confirmedAt: new Date() }
                        : {}),
                    importBatchId: ctx.batchId,
                });
                continue;
            }
            const diff = changedFields(old, fields);
            if (Object.keys(diff).length === 0) counts.unchanged++;
            else {
                counts.changed++;
                if (!ctx.dry)
                    await l.update({ where: { id: old['id'] }, data: diff });
            }
        }
        if (!ctx.dry)
            for (let i = 0; i < toCreate.length; i += 1000)
                await l.createMany({ data: toCreate.slice(i, i + 1000) });
        // Links that make sense (same product, quantity agrees, nothing over-sold) are confirmed without asking.
        if (!ctx.dry) await this.rules.settle(ctx.db);
        return counts;
    }
}

interface Ctx {
    db: Db;
    dry: boolean;
    batchId: number;
    actor: string;
}
