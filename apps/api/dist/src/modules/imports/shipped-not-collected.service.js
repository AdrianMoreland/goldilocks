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
exports.ShippedNotCollectedService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const iso = (d) => (d ? d.toISOString().slice(0, 10) : null);
let ShippedNotCollectedService = class ShippedNotCollectedService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async list() {
        const shipments = await this.prisma.bcShipment.findMany({
            where: { tradeId: { not: null }, trade: { collected: false } },
            orderBy: [{ postingDate: 'desc' }, { no: 'desc' }],
            include: {
                trade: {
                    select: {
                        id: true,
                        reference: true,
                        productText: true,
                        qty: true,
                        date: true,
                        customer: { select: { redactionCode: true } },
                        tasks: {
                            where: {
                                status: 'OPEN',
                                check: shared_types_1.COLLECTED_TASK.check,
                            },
                            select: { id: true },
                        },
                    },
                },
            },
        });
        const seen = new Set();
        const rows = [];
        for (const s of shipments) {
            const t = s.trade;
            if (!t || seen.has(t.id))
                continue;
            seen.add(t.id);
            rows.push({
                tradeId: t.id,
                reference: t.reference,
                customerCode: t.customer?.redactionCode ?? null,
                product: t.productText,
                qty: t.qty,
                saleDate: iso(t.date),
                shipmentNo: s.no,
                shippedOn: iso(s.postingDate),
                taskOpen: t.tasks.length > 0,
            });
        }
        return rows;
    }
    async createTasks(actor) {
        const rows = await this.list();
        const todo = rows.filter((r) => !r.taskOpen);
        if (todo.length === 0)
            return { created: 0, alreadyOpen: rows.length };
        const trades = await this.prisma.trade.findMany({
            where: { id: { in: todo.map((r) => r.tradeId) } },
            select: { id: true, reference: true, client: true },
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.sheetTask.createMany({
                data: trades.map((t) => ({
                    tradeId: t.id,
                    reference: t.reference,
                    client: t.client,
                    sheet: shared_types_1.COLLECTED_TASK.sheet,
                    what: shared_types_1.COLLECTED_TASK.what,
                    value: shared_types_1.COLLECTED_TASK.value,
                    check: shared_types_1.COLLECTED_TASK.check,
                    createdBy: actor,
                })),
            });
            await this.audit.record(actor, 'sheet-tasks', `Tick Collected for ${trades.length} sale${trades.length === 1 ? '' : 's'} Business Central shipped`, tx);
        });
        return {
            created: trades.length,
            alreadyOpen: rows.length - todo.length,
        };
    }
};
exports.ShippedNotCollectedService = ShippedNotCollectedService;
exports.ShippedNotCollectedService = ShippedNotCollectedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], ShippedNotCollectedService);
//# sourceMappingURL=shipped-not-collected.service.js.map