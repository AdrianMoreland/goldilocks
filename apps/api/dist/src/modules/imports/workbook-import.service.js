"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbookImportService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const link_rules_service_1 = require("../review/link-rules.service");
const product_names_service_1 = require("../review/product-names.service");
const customer_orders_service_1 = require("../customer-orders/customer-orders.service");
const workbook_tables_1 = require("./workbook-tables");
const emptyCounts = () => ({
    added: 0,
    changed: 0,
    unchanged: 0,
    unmatched: 0,
    quotes: 0,
    quotesInvoiced: 0,
    unresolved: {},
    markedMissing: 0,
});
const str = (v) => typeof v === 'string' && v !== '' ? v : null;
const metalOf = (m) => m === 'GOLD' || m === 'SILVER' ? m : 'PGM';
let WorkbookImportService = class WorkbookImportService {
    prisma;
    audit;
    rules;
    orders;
    names;
    constructor(prisma, audit, rules, orders, names) {
        this.prisma = prisma;
        this.audit = audit;
        this.rules = rules;
        this.orders = orders;
        this.names = names;
    }
    async preview(dto) {
        return this.loadChunk(dto, this.prisma, 'preview', true);
    }
    async commit(dto, actor) {
        return this.prisma.$transaction((tx) => this.loadChunk(dto, tx, actor, false), { timeout: 120_000, maxWait: 10_000 });
    }
    async recentBatches(limit = 20) {
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
                null),
        }));
    }
    async loadChunk(dto, db, actor, dry) {
        const rows = this.validate(dto.table, dto.rows);
        const batchId = await this.openBatch(db, dto, actor, dry);
        const ctx = { db, dry, batchId, actor };
        let counts;
        if (dto.table === 'trades')
            counts = await this.annotateTrades(ctx, rows);
        else if (dto.table === 'purchase_lots')
            counts = await this.annotateLots(ctx, rows);
        else if (dto.table === 'links')
            counts = await this.upsertLinks(ctx, rows);
        else if (dto.table === 'customer_safe_items')
            counts = await this.saveSafeItems(ctx, rows);
        else if (dto.table === 'zoho_products')
            counts = await this.saveZohoProducts(ctx, rows);
        else if (dto.table === 'product_aliases')
            counts = await this.saveAliases(ctx, rows);
        else
            counts = await this.upsertDirect(ctx, workbook_tables_1.DIRECT_TABLES[dto.table], rows);
        if (dto.lastOfTable && !dry)
            counts.markedMissing = await this.flagMissing(ctx, dto.table);
        if (!dry)
            await this.closeBatch(db, batchId, dto, counts, actor);
        return { batchId, table: dto.table, ...counts };
    }
    validate(table, input) {
        const schema = shared_types_1.ImportTableSchemas[table];
        const people = table === 'customers' || table === 'vendors';
        const problems = [];
        const out = input.map((raw, i) => {
            const { name, ...rest } = raw;
            const parsed = schema.safeParse(people ? rest : raw);
            if (!parsed.success) {
                if (problems.length < 10)
                    problems.push(`row ${i + 1}: ${parsed.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join(', ')}`);
                return raw;
            }
            if (people && (typeof name !== 'string' || name.trim() === '')) {
                if (problems.length < 10)
                    problems.push(`row ${i + 1}: name is required`);
            }
            return people ? { ...parsed.data, name } : parsed.data;
        });
        if (problems.length)
            throw new common_1.BadRequestException({
                message: `Rows rejected in ${table}.`,
                problems,
            });
        return out;
    }
    async openBatch(db, dto, actor, dry) {
        if (dto.batchId === undefined) {
            if (dry)
                return 0;
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
            throw new common_1.NotFoundException(`Import batch ${dto.batchId} not found.`);
        if (batch.status !== 'OPEN')
            throw new common_1.ConflictException('That import batch is already complete.');
        return batch.id;
    }
    async closeBatch(db, batchId, dto, counts, actor) {
        const batch = await db.importBatch.findUniqueOrThrow({
            where: { id: batchId },
        });
        const so_far = (batch.tableCounts ?? {});
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
        await this.audit.record(actor, 'workbook-import', `batch ${batchId} ${dto.table}: ${counts.added} added, ${counts.changed} changed, ${counts.unchanged} unchanged${dto.complete ? ', complete' : ''}`, db);
    }
    delegate(db, name) {
        return db[name];
    }
    async lookupIds(db, kind, keys) {
        const out = new Map();
        if (keys.length === 0)
            return out;
        const { delegate, matchField } = workbook_tables_1.FK_LOOKUP[kind];
        for (let i = 0; i < keys.length; i += 5000) {
            const found = await this.delegate(db, delegate).findMany({
                where: { [matchField]: { in: keys.slice(i, i + 5000) } },
                select: { id: true, [matchField]: true },
            });
            for (const r of found)
                out.set(String(r[matchField]), r['id']);
        }
        return out;
    }
    async resolveParents(db, rows, fks) {
        const maps = new Map();
        for (const fk of fks) {
            const keys = [
                ...new Set(rows
                    .map((r) => str(r[fk.column]))
                    .filter((k) => k !== null)),
            ];
            maps.set(`${fk.kind}:${fk.column}`, await this.lookupIds(db, fk.kind, keys));
        }
        return maps;
    }
    async saveAliases(ctx, rows) {
        const counts = await this.upsertDirect(ctx, workbook_tables_1.DIRECT_TABLES.product_aliases, rows);
        if (!ctx.dry) {
            const keys = [
                ...new Set(rows
                    .map((r) => (0, workbook_tables_1.workbookAliasKey)(r))
                    .filter((k) => k !== null)),
            ];
            for (let i = 0; i < keys.length; i += 5000)
                await this.names.settleAndRecord({ aliases: keys.slice(i, i + 5000) }, ctx.actor, ctx.db, `batch ${ctx.batchId} product_aliases`);
        }
        return counts;
    }
    async saveZohoProducts(ctx, rows) {
        const numbers = [
            ...new Set(rows
                .map((r) => (0, shared_types_1.bcItemNoFromSku)(str(r['sku'])))
                .filter((n) => n !== null)),
        ];
        const items = new Map();
        for (let i = 0; i < numbers.length; i += 5000) {
            const found = await ctx.db.bcItem.findMany({
                where: { itemNo: { in: numbers.slice(i, i + 5000) } },
                select: {
                    itemNo: true,
                    productId: true,
                    salesProductId: true,
                },
            });
            for (const f of found)
                items.set(f.itemNo, f);
        }
        const linked = rows.map((r) => {
            const no = (0, shared_types_1.bcItemNoFromSku)(str(r['sku']));
            const item = no ? items.get(no) : undefined;
            return {
                ...r,
                _product_id: item?.productId ?? null,
                _sales_product_id: item?.salesProductId ?? null,
            };
        });
        return this.upsertDirect(ctx, workbook_tables_1.DIRECT_TABLES.zoho_products, linked);
    }
    async upsertDirect(ctx, spec, input) {
        const counts = emptyCounts();
        const parents = await this.resolveParents(ctx.db, input, spec.fks);
        const byKey = new Map();
        for (const row of input) {
            const key = spec.keyOf ? spec.keyOf(row) : str(row[spec.keyColumn]);
            if (!key) {
                if (spec.keyOf)
                    counts.unmatched++;
                continue;
            }
            const data = (0, workbook_tables_1.mapFields)(row, spec.fields);
            spec.derive?.(data, row, key);
            let skip = false;
            for (const fk of spec.fks) {
                const parentKey = str(row[fk.column]);
                const id = parentKey
                    ? parents.get(`${fk.kind}:${fk.column}`)?.get(parentKey)
                    : undefined;
                if (id === undefined) {
                    if ((parentKey && /^[CV]\d{6}$/.test(parentKey)) ||
                        fk.required)
                        counts.unresolved[fk.column] =
                            (counts.unresolved[fk.column] ?? 0) + 1;
                    if (fk.required)
                        skip = true;
                    data[fk.field] = null;
                }
                else
                    data[fk.field] = id;
            }
            if (!skip)
                byKey.set(key, data);
        }
        const tracked = spec.tracked !== false;
        if (spec.stocktakeSnapshotColumn) {
            const snapshots = new Map();
            for (const row of input) {
                const k = spec.keyOf
                    ? spec.keyOf(row)
                    : str(row[spec.keyColumn]);
                if (k)
                    snapshots.set(k, str(row[spec.stocktakeSnapshotColumn]) ?? 'unknown');
            }
            const ids = await this.ensureStocktakes(ctx, [
                ...new Set(snapshots.values()),
            ]);
            for (const [key, data] of byKey) {
                const id = ids.get(snapshots.get(key) ?? 'unknown');
                if (id !== undefined)
                    data['stocktakeId'] = id;
            }
        }
        const d = this.delegate(ctx.db, spec.delegate);
        const keys = [...byKey.keys()];
        const existing = new Map();
        for (let i = 0; i < keys.length; i += 5000) {
            const found = await d.findMany({
                where: { [spec.keyField]: { in: keys.slice(i, i + 5000) } },
            });
            for (const r of found)
                existing.set(String(r[spec.keyField]), r);
        }
        const toCreate = [];
        const toTouch = [];
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
            if (spec.newerWins) {
                const stored = old[spec.newerWins];
                const incoming = data[spec.newerWins];
                if (stored instanceof Date &&
                    (!(incoming instanceof Date) ||
                        stored.getTime() > incoming.getTime())) {
                    counts.unchanged++;
                    toTouch.push(key);
                    continue;
                }
            }
            const writable = { ...data };
            for (const f of spec.createOnly ?? [])
                delete writable[f];
            const diff = (0, workbook_tables_1.changedFields)(old, writable);
            if (Object.keys(diff).length === 0) {
                counts.unchanged++;
                toTouch.push(key);
            }
            else {
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
            if (tracked)
                await this.stamp(ctx, d, spec.keyField, toTouch);
        }
        return counts;
    }
    async ensureStocktakes(ctx, snapshots) {
        const names = snapshots.map((s) => `Imported: ${s}`);
        const st = this.delegate(ctx.db, 'stocktake');
        const found = await st.findMany({
            where: { imported: true, name: { in: names } },
        });
        const out = new Map();
        for (const f of found) {
            out.set(String(f['name']).replace(/^Imported: /, ''), f['id']);
        }
        if (ctx.dry)
            return out;
        const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
        for (const snap of snapshots) {
            if (out.has(snap))
                continue;
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
            out.set(snap, created['id']);
        }
        return out;
    }
    async stamp(ctx, d, keyField, keys) {
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
    async flagMissing(ctx, table) {
        const where = {
            importBatchId: { not: ctx.batchId },
            missingFromImport: false,
        };
        if (table === 'trades') {
            return (await this.delegate(ctx.db, 'quote').updateMany({
                where,
                data: { missingFromImport: true },
            })).count;
        }
        const spec = workbook_tables_1.DIRECT_TABLES[table];
        if (!spec || spec.tracked === false)
            return 0;
        return (await this.delegate(ctx.db, spec.delegate).updateMany({
            where,
            data: { missingFromImport: true },
        })).count;
    }
    async saveSafeItems(ctx, input) {
        const counts = emptyCounts();
        const codes = [
            ...new Set(input
                .map((r) => str(r['client_code']))
                .filter((k) => k !== null)),
        ];
        const names = new Map();
        for (let i = 0; i < codes.length; i += 5000) {
            const found = await ctx.db.customer.findMany({
                where: { redactionCode: { in: codes.slice(i, i + 5000) } },
                select: { redactionCode: true, name: true },
            });
            for (const c of found)
                names.set(c.redactionCode, c.name);
        }
        const rows = [];
        const metals = new Map();
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
            if (typeof qty !== 'number' ||
                !Number.isInteger(qty) ||
                qty < 1 ||
                !product ||
                !branch ||
                (status !== 'ALLOCATED' &&
                    status !== 'COLLECTED' &&
                    status !== 'ORDERED' &&
                    status !== 'TO_ORDER')) {
                counts.unmatched++;
                continue;
            }
            const text = (v) => str(v)?.trim() || null;
            const row = {
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
        const plan = await this.orders.planRows(ctx.db, rows, {
            fields: 'statusOnly',
        });
        counts.added = plan.toAdd.length;
        counts.changed = plan.toUpdate.length;
        counts.unchanged = plan.unchanged;
        if (!ctx.dry)
            await this.orders.writePlan(ctx.db, plan, (row) => metals.get(row) ?? 'PGM', ctx.actor);
        return counts;
    }
    async annotateTrades(ctx, input) {
        const counts = emptyCounts();
        const sales = input.filter((r) => r['cpty_kind'] !== 'QUOTE_ONLY');
        const quotes = input.filter((r) => r['cpty_kind'] === 'QUOTE_ONLY');
        const parents = await this.resolveParents(ctx.db, input, [
            { column: 'client_code', kind: 'customer' },
            { column: 'supplier_invoice_id', kind: 'supplierInvoice' },
        ]);
        const idOf = (kind, column, row) => {
            const k = str(row[column]);
            const id = k ? parents.get(`${kind}:${column}`)?.get(k) : undefined;
            if (k &&
                id === undefined &&
                !(column === 'client_code' && !/^[CV]\d{6}$/.test(k)))
                counts.unresolved[column] =
                    (counts.unresolved[column] ?? 0) + 1;
            return id ?? null;
        };
        const trades = this.delegate(ctx.db, 'trade');
        const keys = [
            ...new Set(sales
                .map((r) => (0, shared_types_1.referenceMatchKey)(str(r['reference'])))
                .filter(Boolean)),
        ];
        const found = [];
        for (let i = 0; i < keys.length; i += 5000) {
            found.push(...(await trades.findMany({
                where: { referenceKey: { in: keys.slice(i, i + 5000) } },
            })));
        }
        const byRef = new Map(found.map((t) => [
            `${String(t['referenceKey'])}#${String(t['occurrence'])}`,
            t,
        ]));
        for (const row of sales) {
            const trade = byRef.get(`${(0, shared_types_1.referenceMatchKey)(str(row['reference']))}#${String(typeof row['occurrence'] === 'number' ? row['occurrence'] : 1)}`);
            if (!trade) {
                counts.unmatched++;
                continue;
            }
            const next = {
                sourceKey: str(row['id']),
                system: str(row['system']),
                cptyFill: str(row['cpty_fill']),
                customerId: idOf('customer', 'client_code', row),
                supplierInvoiceId: idOf('supplierInvoice', 'supplier_invoice_id', row),
            };
            const diff = (0, workbook_tables_1.changedFields)(trade, next);
            if (Object.keys(diff).length === 0)
                counts.unchanged++;
            else {
                counts.changed++;
                if (!ctx.dry)
                    await trades.update({
                        where: { id: trade['id'] },
                        data: diff,
                    });
            }
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
        counts.quotes = await this.upsertQuotes(ctx, quotes, (row) => idOf('customer', 'client_code', row));
        return counts;
    }
    async upsertQuotes(ctx, rows, customerOf) {
        const q = this.delegate(ctx.db, 'quote');
        const keys = rows
            .map((r) => str(r['id']))
            .filter((k) => k !== null);
        const existing = new Map();
        for (let i = 0; i < keys.length; i += 5000) {
            for (const r of await q.findMany({
                where: { sourceKey: { in: keys.slice(i, i + 5000) } },
            }))
                existing.set(String(r['sourceKey']), r);
        }
        const toCreate = [];
        const seen = [];
        for (const row of rows) {
            const key = str(row['id']);
            if (!key)
                continue;
            const data = {
                reference: str(row['reference']) ?? '',
                referenceKey: (0, shared_types_1.referenceMatchKey)(str(row['reference'])),
                date: typeof row['date'] === 'string'
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
                const diff = (0, workbook_tables_1.changedFields)(old, data);
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
    async annotateLots(ctx, input) {
        const counts = emptyCounts();
        const parents = await this.resolveParents(ctx.db, input, [
            { column: 'seller_code', kind: 'customer' },
            { column: 'supplier_invoice_id', kind: 'supplierInvoice' },
        ]);
        const idOf = (kind, column, row) => {
            const k = str(row[column]);
            const id = k ? parents.get(`${kind}:${column}`)?.get(k) : undefined;
            if (k &&
                id === undefined &&
                !(column === 'seller_code' && !/^[CV]\d{6}$/.test(k)))
                counts.unresolved[column] =
                    (counts.unresolved[column] ?? 0) + 1;
            return id ?? null;
        };
        const lots = this.delegate(ctx.db, 'purchaseLot');
        const keys = [
            ...new Set(input
                .map((r) => (0, shared_types_1.referenceMatchKey)(str(r['reference'])))
                .filter(Boolean)),
        ];
        const found = [];
        for (let i = 0; i < keys.length; i += 5000) {
            found.push(...(await lots.findMany({
                where: { referenceKey: { in: keys.slice(i, i + 5000) } },
            })));
        }
        const byRef = new Map(found.map((t) => [
            `${String(t['referenceKey'])}#${String(t['occurrence'])}`,
            t,
        ]));
        for (const row of input) {
            const lot = byRef.get(`${(0, shared_types_1.referenceMatchKey)(str(row['reference']))}#${String(typeof row['occurrence'] === 'number' ? row['occurrence'] : 1)}`);
            if (!lot) {
                counts.unmatched++;
                continue;
            }
            const next = {
                sourceKey: str(row['id']),
                system: str(row['system']),
                sellerId: idOf('customer', 'seller_code', row),
                supplierInvoiceId: idOf('supplierInvoice', 'supplier_invoice_id', row),
            };
            const diff = (0, workbook_tables_1.changedFields)(lot, next);
            if (Object.keys(diff).length === 0)
                counts.unchanged++;
            else {
                counts.changed++;
                if (!ctx.dry)
                    await lots.update({ where: { id: lot['id'] }, data: diff });
            }
        }
        return counts;
    }
    async upsertLinks(ctx, input) {
        const counts = emptyCounts();
        const l = this.delegate(ctx.db, 'entityLink');
        const tupleOf = (r) => [
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
        const existing = new Map();
        for (let i = 0; i < fromKeys.length; i += 5000) {
            const rows = await l.findMany({
                where: {
                    linkType: { in: types },
                    fromKey: { in: fromKeys.slice(i, i + 5000) },
                },
            });
            for (const r of rows)
                existing.set([
                    r['linkType'],
                    r['fromTable'],
                    r['fromKey'],
                    r['toTable'],
                    r['toKey'],
                ]
                    .map(String)
                    .join('\u0001'), r);
        }
        const toCreate = [];
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
            const diff = (0, workbook_tables_1.changedFields)(old, fields);
            if (Object.keys(diff).length === 0)
                counts.unchanged++;
            else {
                counts.changed++;
                if (!ctx.dry)
                    await l.update({ where: { id: old['id'] }, data: diff });
            }
        }
        if (!ctx.dry)
            for (let i = 0; i < toCreate.length; i += 1000)
                await l.createMany({ data: toCreate.slice(i, i + 1000) });
        if (!ctx.dry)
            await this.rules.settle(ctx.db);
        return counts;
    }
};
exports.WorkbookImportService = WorkbookImportService;
exports.WorkbookImportService = WorkbookImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        link_rules_service_1.LinkRulesService,
        customer_orders_service_1.CustomerOrdersService,
        product_names_service_1.ProductNamesService])
], WorkbookImportService);
//# sourceMappingURL=workbook-import.service.js.map