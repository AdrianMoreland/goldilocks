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
exports.CustomerRecordsService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const day = (d) => d ? d.toISOString().slice(0, 10) : null;
const num = (v) => v === null || v === undefined ? null : Number(v);
const PROFILE_ROWS = 100;
const COUNTED_STATUS = {
    status: { notIn: ['Draft', 'Void'] },
};
function collectedOf(flags) {
    let yes = 0;
    let no = 0;
    for (const f of flags) {
        if (f.collectedFlag === 'YES')
            yes += f._count._all;
        else if (f.collectedFlag === 'NO')
            no += f._count._all;
    }
    if (yes && !no)
        return 'YES';
    if (no && !yes)
        return 'NO';
    return yes || no ? 'PARTIAL' : null;
}
let CustomerRecordsService = class CustomerRecordsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    search(body) {
        return shared_types_1.RecordSearchRequestSchema.parse(body ?? {});
    }
    async customers(body) {
        const { q, limit, offset } = this.search(body);
        const where = {
            missingFromImport: false,
            ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
        };
        const [total, rows] = await Promise.all([
            this.prisma.customer.count({ where }),
            this.prisma.customer.findMany({
                where,
                orderBy: { name: 'asc' },
                skip: offset,
                take: limit,
            }),
        ]);
        const ids = rows.map((r) => r.id);
        const sales = {
            customerId: { in: ids },
            missingFromImport: false,
        };
        const [open, last, invoices] = await Promise.all([
            this.prisma.trade.groupBy({
                by: ['customerId'],
                where: { ...sales, collected: false },
                _count: { _all: true },
            }),
            this.prisma.trade.groupBy({
                by: ['customerId'],
                where: sales,
                _max: { date: true },
                _min: { date: true },
            }),
            this.prisma.zohoInvoice.groupBy({
                by: ['customerId'],
                where: {
                    customerId: { in: ids },
                    missingFromImport: false,
                    ...COUNTED_STATUS,
                },
                _sum: { total: true },
                _min: { date: true },
                _max: { date: true },
            }),
        ]);
        const openBy = new Map(open.map((g) => [g.customerId, g._count._all]));
        const saleBy = new Map(last.map((g) => [g.customerId, g]));
        const invBy = new Map(invoices.map((g) => [g.customerId, g]));
        const earliest = (a, b) => (a && b ? (a < b ? a : b) : (a ?? b ?? null));
        const latest = (a, b) => (a && b ? (a > b ? a : b) : (a ?? b ?? null));
        return {
            total,
            rows: rows.map((c) => {
                const s = saleBy.get(c.id);
                const i = invBy.get(c.id);
                return {
                    id: c.id,
                    name: c.name,
                    status: c.status,
                    currency: c.currency,
                    openOrders: openBy.get(c.id) ?? 0,
                    lastOrder: day(latest(s?._max.date, i?._max.date)),
                    lifetime: num(i?._sum.total) ?? 0,
                    since: day(earliest(s?._min.date, i?._min.date)),
                };
            }),
        };
    }
    async customer(id) {
        const c = await this.prisma.customer.findUnique({ where: { id } });
        if (!c || c.missingFromImport)
            throw new common_1.NotFoundException(`Customer ${id} not found.`);
        const sales = {
            customerId: id,
            missingFromImport: false,
        };
        const [orders, openOrders, invoices, totals, payments, quotes] = await Promise.all([
            this.prisma.trade.findMany({
                where: sales,
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                take: PROFILE_ROWS,
            }),
            this.prisma.trade.count({
                where: { ...sales, collected: false },
            }),
            this.prisma.zohoInvoice.findMany({
                where: { customerId: id, missingFromImport: false },
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                take: PROFILE_ROWS,
            }),
            this.prisma.zohoInvoice.aggregate({
                where: {
                    customerId: id,
                    missingFromImport: false,
                    ...COUNTED_STATUS,
                },
                _sum: { total: true },
                _min: { date: true },
                _max: { date: true },
            }),
            this.prisma.zohoPayment.findMany({
                where: { customerId: id, missingFromImport: false },
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                take: PROFILE_ROWS,
                include: { invoice: true },
            }),
            this.prisma.quote.findMany({
                where: { customerId: id, missingFromImport: false },
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                take: 50,
            }),
        ]);
        const flags = await this.prisma.zohoInvoiceLine.groupBy({
            by: ['invoiceId', 'collectedFlag'],
            where: { invoiceId: { in: invoices.map((i) => i.id) } },
            _count: { _all: true },
        });
        const flagsBy = (invoiceId) => flags.filter((f) => f.invoiceId === invoiceId);
        const firstSale = orders.length ? orders[orders.length - 1].date : null;
        const since = totals._min.date && firstSale
            ? totals._min.date < firstSale
                ? totals._min.date
                : firstSale
            : (totals._min.date ?? firstSale);
        const lastSale = orders[0]?.date ?? null;
        return {
            id: c.id,
            name: c.name,
            status: c.status,
            currency: c.currency,
            zohoNumber: c.zohoNumber,
            since: day(since),
            lastOrder: day(totals._max.date && lastSale
                ? totals._max.date > lastSale
                    ? totals._max.date
                    : lastSale
                : (totals._max.date ?? lastSale)),
            openOrders,
            lifetime: num(totals._sum.total) ?? 0,
            orders: orders.map((t) => ({
                tradeId: t.id,
                reference: t.reference,
                date: day(t.date),
                qty: t.qty,
                productText: t.productText,
                state: t.state,
                collected: t.collected,
                branchCode: t.branchCode,
            })),
            invoices: invoices.map((i) => ({
                id: i.id,
                number: i.sourceKey,
                date: day(i.date),
                total: num(i.total),
                status: i.status,
                collected: collectedOf(flagsBy(i.id)),
            })),
            payments: payments.map((p) => ({
                id: p.id,
                date: day(p.date),
                amount: num(p.amount),
                mode: p.mode,
                invoiceNumber: p.invoice?.sourceKey ?? null,
            })),
            quotes: quotes.map((q) => ({
                id: q.id,
                reference: q.reference,
                date: day(q.date),
                qty: num(q.qty),
                productText: q.productText,
                status: q.status,
            })),
        };
    }
    async invoices(body) {
        const { q, status, limit, offset } = this.search(body);
        const serial = q ? q.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
        const byText = q
            ? [
                { sourceKey: { contains: q, mode: 'insensitive' } },
                { customer: { name: { contains: q, mode: 'insensitive' } } },
                ...(serial.length >= 4
                    ? [
                        {
                            lines: {
                                some: {
                                    serials: {
                                        some: {
                                            serialNorm: {
                                                contains: serial,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ]
                    : []),
            ]
            : [];
        const where = {
            missingFromImport: false,
            ...(status ? { status } : {}),
            ...(byText.length ? { OR: byText } : {}),
        };
        const [total, rows] = await Promise.all([
            this.prisma.zohoInvoice.count({ where }),
            this.prisma.zohoInvoice.findMany({
                where,
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                skip: offset,
                take: limit,
                include: { customer: true },
            }),
        ]);
        const flags = await this.prisma.zohoInvoiceLine.groupBy({
            by: ['invoiceId', 'collectedFlag'],
            where: { invoiceId: { in: rows.map((r) => r.id) } },
            _count: { _all: true },
        });
        return {
            total,
            rows: rows.map((i) => ({
                id: i.id,
                number: i.sourceKey,
                date: day(i.date),
                customerId: i.customerId,
                customerName: i.customer?.name ?? null,
                total: num(i.total),
                status: i.status,
                lineCount: i.lineCount,
                collected: collectedOf(flags.filter((f) => f.invoiceId === i.id)),
            })),
        };
    }
    async invoice(id) {
        const inv = await this.prisma.zohoInvoice.findUnique({
            where: { id },
            include: {
                customer: true,
                lines: {
                    orderBy: { lineNo: 'asc' },
                    include: { serials: true },
                },
                payments: true,
            },
        });
        if (!inv || inv.missingFromImport)
            throw new common_1.NotFoundException(`Invoice ${id} not found.`);
        const links = await this.prisma.entityLink.findMany({
            where: {
                fromTable: 'invoice_lines',
                fromKey: { in: inv.lines.map((l) => l.sourceKey) },
                status: { not: 'REJECTED' },
            },
        });
        const trades = await this.prisma.trade.findMany({
            where: { sourceKey: { in: links.map((l) => l.toKey) } },
        });
        const tradeBy = new Map(trades.map((t) => [t.sourceKey, t.reference]));
        return {
            id: inv.id,
            number: inv.sourceKey,
            date: day(inv.date),
            status: inv.status,
            total: num(inv.total),
            customerId: inv.customerId,
            customerName: inv.customer?.name ?? null,
            lines: inv.lines.map((l) => ({
                id: l.id,
                product: l.itemName,
                refinery: l.refinery,
                qty: num(l.qty),
                unitPrice: num(l.unitPrice),
                lineTotal: num(l.lineTotal),
                serials: l.serials.map((s) => s.serial),
                collectedFlag: l.collectedFlag,
                collectedDate: day(l.collectedDate),
                deliveredBrinks: l.deliveredBrinks,
                soldBack: l.soldBack,
            })),
            payments: inv.payments.map((p) => ({
                id: p.id,
                date: day(p.date),
                amount: num(p.amount),
                mode: p.mode,
                invoiceNumber: inv.sourceKey,
            })),
            links: links.map((l) => ({
                linkType: l.linkType,
                confidence: l.confidence,
                status: l.status,
                trade: tradeBy.get(l.toKey) ?? l.toKey,
            })),
        };
    }
};
exports.CustomerRecordsService = CustomerRecordsService;
exports.CustomerRecordsService = CustomerRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerRecordsService);
//# sourceMappingURL=customer-records.service.js.map