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
exports.CustomerOrdersService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const toDate = (iso) => iso ? new Date(`${iso}T00:00:00.000Z`) : iso === null ? null : undefined;
const toIso = (d) => (d ? d.toISOString().slice(0, 10) : null);
const blank = (v) => (v === '' ? null : v);
let CustomerOrdersService = class CustomerOrdersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async list(filter) {
        const rows = await this.prisma.customerOrderItem.findMany({
            where: {
                ...(filter.status && { status: filter.status }),
                ...(filter.locationCode && {
                    locationCode: filter.locationCode.toUpperCase(),
                }),
            },
            include: { evidence: { orderBy: { id: 'asc' } } },
            orderBy: [
                { locationCode: 'asc' },
                { client: 'asc' },
                { id: 'asc' },
            ],
        });
        return rows
            .sort((a, b) => a.locationCode.localeCompare(b.locationCode) ||
            (0, shared_types_1.compareStockLabels)({ metal: a.metal, label: a.product }, { metal: b.metal, label: b.product }) ||
            a.client.localeCompare(b.client) ||
            a.id - b.id)
            .map(toOrder);
    }
    async create(dto, actor) {
        const row = await this.prisma.$transaction(async (tx) => {
            const created = await tx.customerOrderItem.create({
                data: {
                    locationCode: dto.locationCode.toUpperCase(),
                    client: dto.client,
                    reference: blank(dto.reference) ?? null,
                    bcOrderNo: blank(dto.bcOrderNo) ?? null,
                    supplierRef: blank(dto.supplierRef) ?? null,
                    metal: dto.metal ?? null,
                    product: dto.product,
                    bcItemNo: blank(dto.bcItemNo) ?? null,
                    quantity: dto.quantity,
                    refinery: blank(dto.refinery) ?? null,
                    serials: blank(dto.serials) ?? null,
                    status: dto.status,
                    orderedOn: toDate(dto.orderedOn) ?? null,
                    notes: blank(dto.notes) ?? null,
                    createdBy: actor,
                },
                include: { evidence: true },
            });
            await this.audit.record(actor, 'customer-order-create', `${created.client}: ${created.quantity} x ${created.product} (${created.status})`, tx);
            return created;
        });
        return toOrder(row);
    }
    async update(id, dto, actor) {
        const current = await this.require(id);
        const { orderedOn, ...rest } = dto;
        const row = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.customerOrderItem.update({
                where: { id },
                data: {
                    ...rest,
                    ...(rest.locationCode && {
                        locationCode: rest.locationCode.toUpperCase(),
                    }),
                    ...(orderedOn !== undefined && {
                        orderedOn: toDate(orderedOn),
                    }),
                },
                include: { evidence: { orderBy: { id: 'asc' } } },
            });
            if (dto.status && dto.status !== current.status) {
                await this.audit.record(actor, 'customer-order-status', `${current.client}, ${current.product} x${current.quantity}: ${shared_types_1.CUSTOMER_ORDER_STATUS_LABELS[current.status]} -> ${shared_types_1.CUSTOMER_ORDER_STATUS_LABELS[dto.status]}`, tx);
            }
            return updated;
        });
        return toOrder(row);
    }
    async addEvidence(id, dto, actor) {
        await this.require(id);
        await this.prisma.customerOrderEvidence.create({
            data: {
                itemId: id,
                kind: dto.kind,
                reference: blank(dto.reference) ?? null,
                note: blank(dto.note) ?? null,
                observedOn: toDate(dto.observedOn) ?? null,
                recordedBy: actor,
            },
        });
        const row = await this.prisma.customerOrderItem.findUniqueOrThrow({
            where: { id },
            include: { evidence: { orderBy: { id: 'asc' } } },
        });
        return toOrder(row);
    }
    async planRows(db, rows, options) {
        if (rows.length === 0)
            return { toAdd: [], toUpdate: [], unchanged: 0 };
        const existing = await db.customerOrderItem.findMany({
            where: {
                locationCode: {
                    in: [...new Set(rows.map((r) => r.locationCode))],
                },
            },
            select: {
                id: true,
                locationCode: true,
                client: true,
                reference: true,
                product: true,
                quantity: true,
                status: true,
                serials: true,
                notes: true,
                orderedOn: true,
                missing: true,
                supplierRef: true,
                refinery: true,
            },
            orderBy: { id: 'asc' },
        });
        return (0, shared_types_1.planCustomerOrderImport)(existing.map((e) => ({ ...e, orderedOn: toIso(e.orderedOn) })), rows, options);
    }
    async writePlan(tx, plan, metalFor, actor) {
        await tx.customerOrderItem.createMany({
            data: plan.toAdd.map((r) => ({
                locationCode: r.locationCode,
                client: r.client,
                reference: r.reference,
                supplierRef: r.supplierRef,
                metal: metalFor(r),
                product: r.product,
                quantity: r.quantity,
                refinery: r.refinery,
                serials: r.serials,
                status: r.status,
                orderedOn: toDate(r.orderedOn) ?? null,
                missing: r.missing,
                notes: r.notes,
                createdBy: actor,
            })),
        });
        for (const u of plan.toUpdate) {
            await tx.customerOrderItem.update({
                where: { id: u.id },
                data: { ...u.changes, orderedOn: toDate(u.changes.orderedOn) },
            });
        }
    }
    async planImport(dto) {
        const parsed = (0, shared_types_1.parseCustomerOrdersPaste)(dto.text, dto.fallbackStatus ?? null);
        const plan = await this.planRows(this.prisma, parsed.rows);
        return { parsed, plan };
    }
    async previewImport(dto) {
        const { parsed, plan } = await this.planImport(dto);
        return {
            added: plan.toAdd.length,
            updated: plan.toUpdate.length,
            unchanged: plan.unchanged,
            issues: parsed.issues,
        };
    }
    async importSheet(dto, actor) {
        const { parsed, plan } = await this.planImport(dto);
        if (plan.toAdd.length > 0 || plan.toUpdate.length > 0) {
            await this.prisma.$transaction(async (tx) => {
                await this.writePlan(tx, plan, () => dto.metal, actor);
                await this.audit.record(actor, 'customer-orders-import', `${plan.toAdd.length} added, ${plan.toUpdate.length} updated, ${plan.unchanged} unchanged, ${parsed.issues.length} rejected`, tx);
            }, { timeout: 120_000, maxWait: 10_000 });
        }
        return {
            added: plan.toAdd.length,
            updated: plan.toUpdate.length,
            unchanged: plan.unchanged,
            issues: parsed.issues,
        };
    }
    async expectedStock() {
        const rows = await this.prisma.customerOrderItem.findMany({
            where: { status: { in: ['DELIVERED', 'BAGGED', 'ALLOCATED'] } },
            select: {
                locationCode: true,
                product: true,
                quantity: true,
                status: true,
            },
        });
        return (0, shared_types_1.expectedCustomerStock)(rows);
    }
    async require(id) {
        const row = await this.prisma.customerOrderItem.findUnique({
            where: { id },
        });
        if (!row)
            throw new common_1.NotFoundException(`Customer order ${id} not found.`);
        return row;
    }
};
exports.CustomerOrdersService = CustomerOrdersService;
exports.CustomerOrdersService = CustomerOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], CustomerOrdersService);
function toOrder(row) {
    return {
        id: row.id,
        locationCode: row.locationCode,
        client: row.client,
        reference: row.reference,
        bcOrderNo: row.bcOrderNo,
        supplierRef: row.supplierRef,
        metal: row.metal,
        product: row.product,
        bcItemNo: row.bcItemNo,
        quantity: row.quantity,
        refinery: row.refinery,
        serials: row.serials,
        status: row.status,
        orderedOn: toIso(row.orderedOn),
        missing: row.missing,
        notes: row.notes,
        createdBy: row.createdBy,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        evidence: row.evidence.map((e) => ({
            id: e.id,
            kind: e.kind,
            reference: e.reference,
            note: e.note,
            observedOn: toIso(e.observedOn),
            recordedBy: e.recordedBy,
            createdAt: e.createdAt.toISOString(),
        })),
    };
}
//# sourceMappingURL=customer-orders.service.js.map