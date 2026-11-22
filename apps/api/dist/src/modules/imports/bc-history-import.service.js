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
exports.BcHistoryImportService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const client_1 = require("../../../prisma/generated/client");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const workbook_tables_1 = require("./workbook-tables");
const shipment_matcher_1 = require("./shipment-matcher");
const IN_CHUNK = 5000;
const day = (iso) => iso ? new Date(`${iso}T00:00:00.000Z`) : null;
const dec = (n) => (n === null ? null : new client_1.Prisma.Decimal(n));
const ZOHO_INVOICE = /^INV-\d+$/i;
let BcHistoryImportService = class BcHistoryImportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    preview(dto) {
        return this.run(dto, this.prisma, 'preview', true);
    }
    commit(dto, actor) {
        return this.prisma.$transaction((tx) => this.run(dto, tx, actor, false), { timeout: 300_000, maxWait: 10_000 });
    }
    async run(dto, db, actor, dry) {
        const batchId = dry
            ? 0
            : (await db.importBatch.create({
                data: {
                    fileName: dto.fileNames.join(', ').slice(0, 200) ||
                        'Business Central history',
                    sheetMonth: new Date().toISOString().slice(0, 7),
                    source: 'BC_HISTORY',
                    kind: 'BC_HISTORY',
                    importedBy: actor,
                    summary: {},
                    status: 'OPEN',
                },
            })).id;
        const people = await this.customers(db, dto);
        let customersLinked = 0;
        let customerConflicts = 0;
        const learn = new Map();
        const teach = (code, no, field) => {
            if (!code || !no)
                return;
            const c = people.byCode.get(code);
            if (!c)
                return;
            const pending = learn.get(c.id)?.[field];
            const current = c[field] ?? pending ?? null;
            if (current === null) {
                learn.set(c.id, { ...learn.get(c.id), [field]: no });
                customersLinked++;
            }
            else if (current !== no)
                customerConflicts++;
        };
        for (const s of dto.shipments)
            teach(s.customerCode, s.customerNo, 'bcCustomerNo');
        for (const r of dto.receipts)
            teach(r.sellerCode, r.vendorNo, 'bcVendorNo');
        const codesInFile = new Set([
            ...dto.shipments.map((s) => s.customerCode),
            ...dto.receipts.map((r) => r.sellerCode),
        ].filter((c) => !!c));
        const unknownCustomerCodes = [...codesInFile].filter((c) => !people.byCode.has(c)).length;
        if (!dry)
            for (const [id, data] of learn)
                await db.customer.update({ where: { id }, data });
        const customerOf = (code, no) => (code ? people.byCode.get(code)?.id : undefined) ??
            (no ? people.byBcNo.get(no) : undefined) ??
            null;
        const trades = await this.tradesByReference(db, dto);
        const invoices = await this.zohoInvoices(db, dto);
        let shipmentsToTrades = 0;
        let shipmentsToZohoInvoices = 0;
        let shippedNotCollected = 0;
        const shipmentRows = dto.shipments.map((s) => {
            const ext = s.externalDocNo?.trim() ?? '';
            const trade = ext ? trades.get((0, shared_types_1.referenceMatchKey)(ext)) : undefined;
            const invoiceId = ZOHO_INVOICE.test(ext)
                ? invoices.get(ext.toUpperCase())
                : undefined;
            if (trade) {
                shipmentsToTrades++;
                if (!trade.collected)
                    shippedNotCollected++;
            }
            if (invoiceId)
                shipmentsToZohoInvoices++;
            return {
                key: s.no,
                data: {
                    customerNo: s.customerNo,
                    customerId: customerOf(s.customerCode, s.customerNo),
                    documentDate: day(s.documentDate),
                    postingDate: day(s.postingDate),
                    externalDocNo: s.externalDocNo,
                    locationCode: s.locationCode,
                    tradeId: trade?.id ?? null,
                    zohoInvoiceId: invoiceId ?? null,
                    missingFromImport: false,
                },
            };
        });
        const shipments = await this.upsert(db, 'bcShipment', 'no', shipmentRows, batchId, dry);
        const shipmentLines = await this.upsert(db, 'bcShipmentLine', 'sourceKey', dto.shipmentLines.map((l) => ({
            key: `${l.documentNo}|${l.lineNo}`,
            data: {
                documentNo: l.documentNo,
                lineNo: l.lineNo,
                customerNo: l.customerNo,
                itemNo: l.itemNo,
                description: l.description,
                locationCode: l.locationCode,
                quantity: dec(l.quantity),
                missingFromImport: false,
            },
        })), batchId, dry);
        const receipts = await this.upsert(db, 'bcReceipt', 'no', dto.receipts.map((r) => ({
            key: r.no,
            data: {
                vendorNo: r.vendorNo,
                sellerId: r.sellerCode
                    ? (people.byCode.get(r.sellerCode)?.id ?? null)
                    : null,
                documentDate: day(r.documentDate),
                locationCode: r.locationCode,
                missingFromImport: false,
            },
        })), batchId, dry);
        const ledger = await this.upsert(db, 'bcLedgerEntry', 'entryNo', dto.ledger.map((e) => ({
            key: e.entryNo,
            data: {
                postingDate: day(e.postingDate),
                entryType: e.entryType,
                documentType: e.documentType,
                documentNo: e.documentNo,
                itemNo: e.itemNo,
                locationCode: e.locationCode,
                quantity: new client_1.Prisma.Decimal(e.quantity),
                remainingQuantity: dec(e.remainingQuantity),
                salesAmount: dec(e.salesAmount),
                costAmount: dec(e.costAmount),
                open: e.open,
                serialNo: e.serialNo,
                serialKey: e.serialNo ? (0, shared_types_1.serialKey)(e.serialNo) : null,
                sourceType: e.sourceType,
                sourceNo: e.sourceNo,
                missingFromImport: false,
            },
        })), batchId, dry);
        const plan = await this.planEvents(db, dto, shipmentRows, people);
        const applied = await this.applyEvents(db, plan.events, dry);
        const matched = await (0, shipment_matcher_1.matchShipments)(db, dry);
        const result = {
            batchId,
            shipments,
            shipmentLines,
            receipts,
            ledger,
            customersLinked,
            customerConflicts,
            unknownCustomerCodes,
            shipmentsToTrades,
            shipmentsToZohoInvoices,
            shippedNotCollected,
            itemsAdded: applied.itemsAdded,
            itemsUpdated: applied.itemsUpdated,
            eventsAdded: applied.eventsAdded,
            eventsUpdated: applied.eventsUpdated,
            eventsUnchanged: applied.eventsUnchanged,
            trackingWithoutLedger: plan.trackingWithoutLedger,
            shipmentLinesLinked: matched.linked,
            shipmentLinesSuggested: matched.suggested,
            shipmentLinesUnmatched: matched.unmatched,
        };
        if (!dry)
            await db.importBatch.update({
                where: { id: batchId },
                data: {
                    status: 'COMPLETE',
                    summary: result,
                },
            });
        return result;
    }
    async customers(db, dto) {
        const codes = [
            ...new Set([
                ...dto.shipments.map((s) => s.customerCode),
                ...dto.receipts.map((r) => r.sellerCode),
            ].filter((c) => !!c)),
        ];
        const nos = [
            ...new Set(dto.shipments
                .map((s) => s.customerNo)
                .filter((n) => !!n)),
        ];
        const select = {
            id: true,
            redactionCode: true,
            bcCustomerNo: true,
            bcVendorNo: true,
        };
        const byCode = new Map();
        const byBcNo = new Map();
        for (const part of chunks(codes))
            for (const c of await db.customer.findMany({
                where: { redactionCode: { in: part } },
                select,
            }))
                byCode.set(c.redactionCode, c);
        for (const part of chunks(nos))
            for (const c of await db.customer.findMany({
                where: { bcCustomerNo: { in: part } },
                select,
            }))
                if (c.bcCustomerNo)
                    byBcNo.set(c.bcCustomerNo, c.id);
        return { byCode, byBcNo };
    }
    async tradesByReference(db, dto) {
        const keys = [
            ...new Set(dto.shipments
                .map((s) => s.externalDocNo?.trim() ?? '')
                .filter((x) => x && !ZOHO_INVOICE.test(x))
                .map((x) => (0, shared_types_1.referenceMatchKey)(x))
                .filter(Boolean)),
        ];
        const out = new Map();
        for (const part of chunks(keys))
            for (const t of await db.trade.findMany({
                where: { referenceKey: { in: part }, occurrence: 1 },
                select: { id: true, referenceKey: true, collected: true },
            }))
                out.set(t.referenceKey, { id: t.id, collected: t.collected });
        return out;
    }
    async zohoInvoices(db, dto) {
        const keys = [
            ...new Set(dto.shipments
                .map((s) => s.externalDocNo?.trim().toUpperCase() ?? '')
                .filter((x) => ZOHO_INVOICE.test(x))),
        ];
        const out = new Map();
        for (const part of chunks(keys))
            for (const i of await db.zohoInvoice.findMany({
                where: { sourceKey: { in: part } },
                select: { id: true, sourceKey: true },
            }))
                out.set(i.sourceKey.toUpperCase(), i.id);
        return out;
    }
    async upsert(db, delegateName, keyField, rows, batchId, dry) {
        const counts = { added: 0, changed: 0, unchanged: 0 };
        if (rows.length === 0)
            return counts;
        const delegate = db[delegateName];
        const byKey = new Map(rows.map((r) => [r.key, r.data]));
        const existing = new Map();
        for (const part of chunks([...byKey.keys()]))
            for (const row of await delegate.findMany({
                where: { [keyField]: { in: part } },
            }))
                existing.set(row[keyField], row);
        const create = [];
        for (const [key, data] of byKey) {
            const old = existing.get(key);
            if (!old) {
                counts.added++;
                create.push({
                    [keyField]: key,
                    ...data,
                    importBatchId: batchId,
                });
                continue;
            }
            const diff = (0, workbook_tables_1.changedFields)(old, data);
            if (Object.keys(diff).length === 0) {
                counts.unchanged++;
                continue;
            }
            counts.changed++;
            if (!dry)
                await delegate.update({
                    where: { id: old['id'] },
                    data: { ...diff, importBatchId: batchId },
                });
        }
        if (!dry)
            for (const part of chunks(create))
                await delegate.createMany({ data: part });
        return counts;
    }
    async planEvents(db, dto, shipmentRows, people) {
        const num = (v) => v === null ? null : Number(v.toString());
        const ledger = new Map();
        const keep = (e) => ledger.set(e.entryNo, {
            ...e,
            quantity: Number(e.quantity.toString()),
            salesAmount: num(e.salesAmount),
            costAmount: num(e.costAmount),
        });
        for (const e of await db.bcLedgerEntry.findMany({
            where: { serialKey: { not: null } },
        }))
            keep(e);
        const tracking = await db.bcTrackingEntry.findMany({
            where: {
                serialNorm: { not: null },
                NOT: { serialNorm: '' },
                missingFromImport: false,
            },
            select: {
                entryNo: true,
                itemNo: true,
                serialNo: true,
                serialNorm: true,
            },
        });
        const missing = [
            ...new Set(tracking
                .map((t) => Number(t.entryNo))
                .filter((n) => Number.isInteger(n) && n > 0 && !ledger.has(n))),
        ];
        for (const part of chunks(missing))
            for (const e of await db.bcLedgerEntry.findMany({
                where: { entryNo: { in: part } },
            }))
                keep(e);
        for (const e of dto.ledger)
            ledger.set(e.entryNo, {
                ...e,
                postingDate: day(e.postingDate),
            });
        const shipments = new Map();
        const receipts = new Map();
        const docNos = [
            ...new Set([...ledger.values()].map((l) => l.documentNo)),
        ];
        for (const part of chunks(docNos)) {
            for (const s of await db.bcShipment.findMany({
                where: { no: { in: part } },
            }))
                shipments.set(s.no, {
                    partyNo: s.customerNo,
                    customerId: s.customerId,
                    tradeId: s.tradeId,
                });
            for (const r of await db.bcReceipt.findMany({
                where: { no: { in: part } },
            }))
                receipts.set(r.no, {
                    partyNo: r.vendorNo,
                    customerId: r.sellerId,
                });
        }
        for (const s of shipmentRows)
            shipments.set(s.key, {
                partyNo: s.data['customerNo'] ?? null,
                customerId: s.data['customerId'] ?? null,
                tradeId: s.data['tradeId'] ?? null,
            });
        for (const r of dto.receipts)
            receipts.set(r.no, {
                partyNo: r.vendorNo,
                customerId: r.sellerCode
                    ? (people.byCode.get(r.sellerCode)?.id ?? null)
                    : null,
            });
        const sourceNos = [
            ...new Set([...ledger.values()]
                .map((l) => l.sourceNo)
                .filter((n) => !!n)),
        ];
        const byCustomerNo = new Map();
        const byVendorNo = new Map();
        for (const part of chunks(sourceNos))
            for (const c of await db.customer.findMany({
                where: {
                    OR: [
                        { bcCustomerNo: { in: part } },
                        { bcVendorNo: { in: part } },
                    ],
                },
                select: { id: true, bcCustomerNo: true, bcVendorNo: true },
            })) {
                if (c.bcCustomerNo)
                    byCustomerNo.set(c.bcCustomerNo, c.id);
                if (c.bcVendorNo)
                    byVendorNo.set(c.bcVendorNo, c.id);
            }
        const pairs = new Map();
        for (const [entryNo, l] of ledger) {
            if (!l.serialNo || !(0, shared_types_1.isRealSerial)(l.serialNo))
                continue;
            const key = (0, shared_types_1.serialKey)(l.serialNo);
            pairs.set(`${entryNo}|${key}`, {
                entryNo,
                key,
                serial: l.serialNo.trim(),
                itemNo: l.itemNo,
            });
        }
        let trackingWithoutLedger = 0;
        for (const t of tracking) {
            const entryNo = Number(t.entryNo);
            const raw = t.serialNorm ?? t.serialNo;
            if (!(0, shared_types_1.isRealSerial)(raw))
                continue;
            const key = (0, shared_types_1.serialKey)(raw);
            if (!ledger.has(entryNo)) {
                trackingWithoutLedger++;
                continue;
            }
            if (!pairs.has(`${entryNo}|${key}`))
                pairs.set(`${entryNo}|${key}`, {
                    entryNo,
                    key,
                    serial: (t.serialNo ?? key).trim(),
                    itemNo: t.itemNo,
                });
        }
        const events = [];
        for (const { entryNo, key, serial, itemNo } of pairs.values()) {
            const l = ledger.get(entryNo);
            const kind = (0, shared_types_1.bcEventKind)(l.entryType, l.documentType, l.documentNo, l.quantity);
            if (!kind)
                continue;
            const shipment = shipments.get(l.documentNo);
            const doc = shipment ?? receipts.get(l.documentNo);
            const source = (l.sourceType ?? '').toLowerCase();
            const fromSource = l.sourceNo
                ? source === 'vendor'
                    ? byVendorNo.get(l.sourceNo)
                    : source === 'customer'
                        ? byCustomerNo.get(l.sourceNo)
                        : undefined
                : undefined;
            events.push({
                sourceKey: `BC|${entryNo}|${key}`,
                serialKey: key,
                serial,
                bcItemNo: itemNo,
                entryNo,
                kind,
                date: l.postingDate,
                sourceRef: l.documentNo,
                locationCode: l.locationCode,
                partyNo: doc?.partyNo ?? l.sourceNo ?? null,
                customerId: doc?.customerId ?? fromSource ?? null,
                tradeId: shipment?.tradeId ?? null,
                quantity: Math.sign(l.quantity) || 1,
                amount: kind === 'COLLECTED' || kind === 'RETURNED_BY_CUSTOMER'
                    ? l.salesAmount
                    : l.costAmount,
            });
        }
        events.sort((a, b) => a.entryNo - b.entryNo);
        return { events, trackingWithoutLedger };
    }
    async applyEvents(db, events, dry) {
        const out = {
            itemsAdded: 0,
            itemsUpdated: 0,
            eventsAdded: 0,
            eventsUpdated: 0,
            eventsUnchanged: 0,
        };
        if (events.length === 0)
            return out;
        const keys = [...new Set(events.map((e) => e.serialKey))];
        const items = new Map();
        for (const part of chunks(keys))
            for (const i of await db.item.findMany({
                where: { serialKey: { in: part } },
                select: {
                    id: true,
                    serialKey: true,
                    status: true,
                    locationCode: true,
                },
            }))
                items.set(i.serialKey, i);
        const stored = new Map();
        for (const part of chunks(events.map((e) => e.sourceKey)))
            for (const e of await db.itemEvent.findMany({
                where: { sourceKey: { in: part } },
                select: {
                    id: true,
                    sourceKey: true,
                    kind: true,
                    date: true,
                    locationCode: true,
                    partyNo: true,
                    customerId: true,
                    tradeId: true,
                },
            }))
                stored.set(e.sourceKey, e);
        const fresh = events.filter((e) => !stored.has(e.sourceKey));
        const changed = [];
        for (const e of events) {
            const old = stored.get(e.sourceKey);
            if (!old)
                continue;
            const next = {
                kind: e.kind,
                date: e.date,
                locationCode: e.locationCode,
                partyNo: e.partyNo,
                customerId: e.customerId ?? old.customerId,
                tradeId: e.tradeId ?? old.tradeId,
            };
            const diff = (0, workbook_tables_1.changedFields)(old, next);
            if (Object.keys(diff).length)
                changed.push({ id: old.id, data: diff });
        }
        out.eventsAdded = fresh.length;
        out.eventsUpdated = changed.length;
        out.eventsUnchanged = events.length - fresh.length - changed.length;
        if (!dry)
            for (const c of changed)
                await db.itemEvent.update({
                    where: { id: c.id },
                    data: c.data,
                });
        const latest = new Map();
        for (const e of events) {
            const prev = latest.get(e.serialKey);
            if (!prev || later(e, prev))
                latest.set(e.serialKey, e);
        }
        const newItems = keys.filter((k) => !items.has(k));
        out.itemsAdded = newItems.length;
        const first = new Map();
        for (const e of events)
            if (!first.has(e.serialKey))
                first.set(e.serialKey, e);
        if (dry) {
            out.itemsUpdated = keys.filter((k) => {
                const i = items.get(k);
                const l = latest.get(k);
                return (i &&
                    (i.status !== (0, shared_types_1.itemStatusAfter)(l.kind) ||
                        i.locationCode !== l.locationCode));
            }).length;
            return out;
        }
        const bcItemNos = [...new Set(events.map((e) => e.bcItemNo))];
        const productOf = new Map();
        for (const part of chunks(bcItemNos))
            for (const b of await db.bcItem.findMany({
                where: { itemNo: { in: part } },
                select: { itemNo: true, productId: true },
            }))
                productOf.set(b.itemNo, b.productId);
        for (const part of chunks(newItems))
            await db.item.createMany({
                data: part.map((k) => {
                    const f = first.get(k);
                    return {
                        serial: f.serial,
                        serialKey: k,
                        bcItemNo: f.bcItemNo,
                        productId: productOf.get(f.bcItemNo) ?? null,
                        status: 'UNKNOWN',
                    };
                }),
                skipDuplicates: true,
            });
        for (const part of chunks(newItems))
            for (const i of await db.item.findMany({
                where: { serialKey: { in: part } },
                select: {
                    id: true,
                    serialKey: true,
                    status: true,
                    locationCode: true,
                },
            }))
                items.set(i.serialKey, i);
        for (const part of chunks(fresh))
            await db.itemEvent.createMany({
                data: part.map((e) => ({
                    itemId: items.get(e.serialKey).id,
                    kind: e.kind,
                    date: e.date,
                    source: 'BC',
                    sourceRef: e.sourceRef,
                    sourceKey: e.sourceKey,
                    locationCode: e.locationCode,
                    partyNo: e.partyNo,
                    customerId: e.customerId,
                    tradeId: e.tradeId,
                    quantity: new client_1.Prisma.Decimal(e.quantity),
                    amount: dec(e.amount),
                })),
                skipDuplicates: true,
            });
        for (const [k, l] of latest) {
            const i = items.get(k);
            const status = (0, shared_types_1.itemStatusAfter)(l.kind);
            if (i.status === status && i.locationCode === l.locationCode)
                continue;
            if (!newItems.includes(k))
                out.itemsUpdated++;
            await db.item.update({
                where: { id: i.id },
                data: { status, locationCode: l.locationCode },
            });
        }
        return out;
    }
};
exports.BcHistoryImportService = BcHistoryImportService;
exports.BcHistoryImportService = BcHistoryImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BcHistoryImportService);
function later(a, b) {
    const ad = a.date?.getTime() ?? 0;
    const bd = b.date?.getTime() ?? 0;
    return ad !== bd ? ad > bd : a.entryNo > b.entryNo;
}
function chunks(list, size = IN_CHUNK) {
    const out = [];
    for (let i = 0; i < list.length; i += size)
        out.push(list.slice(i, i + size));
    return out;
}
//# sourceMappingURL=bc-history-import.service.js.map