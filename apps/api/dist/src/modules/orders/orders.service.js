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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = exports.toSheetTask = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../settings/notifications.service");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const WINDOW_DAYS = 120;
const MAX_ROWS = 500;
const tradeInclude = {
    events: { orderBy: { id: 'asc' } },
    tasks: { orderBy: { id: 'asc' } },
};
const iso = (d) => d.toISOString();
const dateOnly = (d) => (d ? d.toISOString().slice(0, 10) : null);
const num = (v) => (v === null ? null : Number(v));
const toSheetTask = (t) => ({
    id: t.id,
    tradeId: t.tradeId,
    reference: t.reference,
    client: t.client,
    sheet: t.sheet,
    what: t.what,
    value: t.value,
    check: t.check,
    status: t.status,
    createdAt: iso(t.createdAt),
    createdBy: t.createdBy,
    closedAt: t.closedAt ? iso(t.closedAt) : null,
    closedBy: t.closedBy,
    closedVia: t.closedVia,
});
exports.toSheetTask = toSheetTask;
const toEvent = (e) => ({
    id: e.id,
    step: e.step,
    by: e.by,
    at: iso(e.at),
    note: e.note,
});
let OrdersService = class OrdersService {
    prisma;
    audit;
    notifications;
    constructor(prisma, audit, notifications) {
        this.prisma = prisma;
        this.audit = audit;
        this.notifications = notifications;
    }
    facts(t) {
        return (0, shared_types_1.deriveOrder)({
            cptyKind: t.cptyKind,
            collected: t.collected,
            hasLot: t.lotId !== null,
            supplierInvoice: t.supplierInvoice,
            steps: t.events.map((e) => e.step),
            bcOpen: null,
        });
    }
    toRow(t) {
        const d = this.facts(t);
        return {
            id: t.id,
            reference: t.reference,
            client: t.client,
            branchCode: t.branchCode,
            metal: t.metal,
            qty: t.qty,
            product: t.productText,
            date: dateOnly(t.date),
            amount: num(t.receipt) ?? num(t.totalPrice),
            cpty: t.cptyRaw,
            supplierInvoice: t.supplierInvoice,
            lifecycle: d.lifecycle,
            source: d.source,
            queues: d.queues,
            nextAction: (0, shared_types_1.nextAction)(d.lifecycle, d.source, d.queues),
            openTasks: t.tasks.filter((x) => x.status === 'OPEN').length,
        };
    }
    async list(query) {
        const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);
        const trades = await this.prisma.trade.findMany({
            where: {
                missingFromImport: false,
                OR: [
                    { date: { gte: since } },
                    { tasks: { some: { status: 'OPEN' } } },
                ],
                ...(query.branch && { branchCode: query.branch.toUpperCase() }),
            },
            include: tradeInclude,
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
            take: 4000,
        });
        const all = trades.map((t) => ({
            row: this.toRow(t),
            d: this.facts(t),
        }));
        const open = all.filter(({ d }) => (0, shared_types_1.isOpenOrder)(d, null));
        const counts = { all: open.length };
        for (const { row } of all)
            for (const q of row.queues)
                counts[q] = (counts[q] ?? 0) + 1;
        const needle = query.q?.toLowerCase();
        const queue = query.queue ?? 'all';
        const rows = (queue === 'all'
            ? open
            : all.filter(({ row }) => row.queues.includes(queue)))
            .map(({ row }) => row)
            .filter((r) => !needle ||
            `${r.client} ${r.product} ${r.reference} ${r.cpty ?? ''}`
                .toLowerCase()
                .includes(needle))
            .slice(0, MAX_ROWS);
        const openTasks = await this.prisma.sheetTask.count({
            where: { status: 'OPEN' },
        });
        return { rows, counts, openTasks, asOf: iso(new Date()) };
    }
    async get(id) {
        const t = await this.prisma.trade.findUnique({
            where: { id },
            include: tradeInclude,
        });
        if (!t)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        return this.toDetail(t);
    }
    toDetail(t) {
        const d = this.facts(t);
        return {
            ...this.toRow(t),
            events: t.events.map(toEvent),
            tasks: t.tasks.map(exports.toSheetTask),
            allowedSteps: (0, shared_types_1.allowedSteps)(d.lifecycle, d.source),
            notes: t.notes,
        };
    }
    async recordStep(id, step, body, actor) {
        const t = await this.prisma.trade.findUnique({
            where: { id },
            include: tradeInclude,
        });
        if (!t)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        const d = this.facts(t);
        if (!(0, shared_types_1.allowedSteps)(d.lifecycle, d.source).includes(step)) {
            throw new common_1.BadRequestException(`${step} cannot be recorded while the order is ${shared_types_1.ORDER_LIFECYCLE_LABELS[d.lifecycle]}`);
        }
        const drafts = (0, shared_types_1.sheetTasksForStep)(step, {
            client: t.client,
            reference: t.reference,
            product: t.productText,
            qty: t.qty,
            supplierInvoice: body.supplierInvoice ?? t.supplierInvoice,
            pline: body.pline,
            soldComment: body.soldComment,
            serials: body.serials,
            refinery: body.refinery,
            stockChange: body.stockChange,
            date: t.date ? t.date.toISOString().slice(0, 10) : null,
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.orderEvent.create({
                data: { tradeId: id, step, by: actor, note: body.note ?? null },
            });
            if (drafts.length) {
                await tx.sheetTask.createMany({
                    data: drafts.map((x) => ({
                        tradeId: id,
                        reference: t.reference,
                        client: t.client,
                        sheet: x.sheet,
                        what: x.what,
                        value: x.value,
                        check: x.check,
                        createdBy: actor,
                    })),
                });
            }
            await this.audit.record(actor, 'order-step', `${t.reference}: ${step} (${drafts.length} sheet task${drafts.length === 1 ? '' : 's'})`, tx);
        });
        await this.notifications?.notifyAdmins({
            kind: 'order_step',
            title: `${t.reference} reached ${step.charAt(0)}${step.slice(1).toLowerCase()}`,
            body: `${t.client} · ${t.productText}${t.qty ? ` × ${t.qty}` : ''} (recorded by ${actor})`,
            link: '/orders',
        });
        return this.get(id);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map