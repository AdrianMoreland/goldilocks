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
exports.SheetTasksService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const orders_service_1 = require("./orders.service");
let SheetTasksService = class SheetTasksService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async list(query) {
        const rows = await this.prisma.sheetTask.findMany({
            where: query.status ? { status: query.status } : {},
            orderBy: [{ status: 'asc' }, { id: 'desc' }],
            take: 500,
        });
        return rows.map(orders_service_1.toSheetTask);
    }
    async complete(id, actor) {
        const t = await this.prisma.sheetTask.findUnique({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException(`Sheet task ${id} not found`);
        if (t.status === 'DONE')
            return (0, orders_service_1.toSheetTask)(t);
        const done = await this.prisma.$transaction(async (tx) => {
            const u = await tx.sheetTask.update({
                where: { id },
                data: {
                    status: 'DONE',
                    closedAt: new Date(),
                    closedBy: actor,
                    closedVia: 'MANUAL',
                },
            });
            await this.audit.record(actor, 'sheet-task-done', `${t.reference}: ${t.sheet}, ${t.what}`, tx);
            return u;
        });
        return (0, orders_service_1.toSheetTask)(done);
    }
    async reconcile(actor) {
        const open = await this.prisma.sheetTask.findMany({
            where: {
                status: 'OPEN',
                check: { not: 'MANUAL' },
                tradeId: { not: null },
            },
            include: { trade: { select: { collected: true, cptyRaw: true } } },
        });
        const ids = open
            .filter((t) => t.trade && (0, shared_types_1.taskShowsDone)(t, t.trade))
            .map((t) => t.id);
        if (ids.length) {
            await this.prisma.$transaction(async (tx) => {
                await tx.sheetTask.updateMany({
                    where: { id: { in: ids }, status: 'OPEN' },
                    data: {
                        status: 'DONE',
                        closedAt: new Date(),
                        closedBy: 'import',
                        closedVia: 'IMPORT',
                    },
                });
                await this.audit.record(actor, 'sheet-tasks-reconcile', `${ids.length} of ${open.length} open tasks closed by an import`, tx);
            });
        }
        return { checked: open.length, closed: ids.length };
    }
    async latestHandover() {
        const h = await this.prisma.handover.findFirst({
            orderBy: { id: 'desc' },
        });
        return h
            ? {
                id: h.id,
                note: h.note,
                by: h.by,
                createdAt: h.createdAt.toISOString(),
            }
            : null;
    }
    async saveHandover(note, actor) {
        const h = await this.prisma.$transaction(async (tx) => {
            const created = await tx.handover.create({
                data: { note, by: actor },
            });
            await this.audit.record(actor, 'handover', 'Closed the day', tx);
            return created;
        });
        return {
            id: h.id,
            note: h.note,
            by: h.by,
            createdAt: h.createdAt.toISOString(),
        };
    }
};
exports.SheetTasksService = SheetTasksService;
exports.SheetTasksService = SheetTasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], SheetTasksService);
//# sourceMappingURL=sheet-tasks.service.js.map