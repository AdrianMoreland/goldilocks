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
exports.StocktakeService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const toDate = (iso) => new Date(`${iso}T00:00:00.000Z`);
const toIso = (d) => d.toISOString().slice(0, 10);
let StocktakeService = class StocktakeService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async list() {
        const rows = await this.prisma.stocktake.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return rows.map(toStocktake);
    }
    async get(id) {
        const row = await this.prisma.stocktake.findUnique({
            where: { id },
            include: {
                lines: {
                    orderBy: [{ locationCode: 'asc' }, { itemNo: 'asc' }],
                },
                discrepancies: { orderBy: { id: 'asc' } },
            },
        });
        if (!row)
            throw new common_1.NotFoundException(`Stocktake ${id} not found.`);
        return {
            ...toStocktake(row),
            lines: row.lines.map(toLine),
            discrepancies: row.discrepancies.map(toDiscrepancy),
        };
    }
    async create(dto, actor) {
        if (dto.cutoffDate < dto.countDate) {
            throw new common_1.BadRequestException('The cutoff date cannot be before the count date.');
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const created = await tx.stocktake.create({
                data: {
                    name: dto.name,
                    countDate: toDate(dto.countDate),
                    cutoffDate: toDate(dto.cutoffDate),
                    stocktakeLead: dto.stocktakeLead,
                    secondChecker: dto.secondChecker,
                    createdBy: actor,
                },
            });
            await this.audit.record(actor, 'stocktake-create', `${created.name} (count ${dto.countDate}, cutoff ${dto.cutoffDate})`, tx);
            return created;
        });
        return toStocktake(row);
    }
    async update(id, dto, actor) {
        const current = await this.requireOpen(id);
        if (dto.status === 'FINALISED') {
            throw new common_1.BadRequestException('Use the finalise action to finalise a stocktake.');
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.stocktake.update({
                where: { id },
                data: dto,
            });
            if (dto.status && dto.status !== current.status) {
                await this.audit.record(actor, 'stocktake-status', `${current.name}: ${current.status} -> ${dto.status}`, tx);
            }
            return updated;
        });
        return toStocktake(row);
    }
    async finalise(id, actor) {
        const current = await this.requireOpen(id);
        const [lines, unresolved, unconfirmedBars] = await Promise.all([
            this.prisma.stocktakeLine.count({ where: { stocktakeId: id } }),
            this.prisma.stocktakeDiscrepancy.count({
                where: { stocktakeId: id, resolved: false },
            }),
            this.prisma.stocktakeBar.count({
                where: { stocktakeId: id, status: 'UNCONFIRMED' },
            }),
        ]);
        if (lines === 0) {
            throw new common_1.BadRequestException('Import the journal before finalising.');
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.stocktake.update({
                where: { id },
                data: {
                    status: 'FINALISED',
                    finalisedBy: actor,
                    finalisedAt: new Date(),
                },
            });
            await this.audit.record(actor, 'stocktake-finalise', `${current.name}: ${lines} lines, ${unresolved} unresolved discrepancies, ${unconfirmedBars} unconfirmed bars`, tx);
            return updated;
        });
        return toStocktake(row);
    }
    async importJournal(id, text, actor) {
        await this.requireOpen(id);
        const parsed = (0, shared_types_1.parseJournalPaste)(text);
        if (parsed.rows.length === 0) {
            return { added: 0, skippedExisting: 0, issues: parsed.issues };
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const created = await tx.stocktakeLine.createMany({
                data: parsed.rows.map((r) => ({ stocktakeId: id, ...r })),
                skipDuplicates: true,
            });
            await tx.bcItem.createMany({
                data: [
                    ...new Map(parsed.rows.map((r) => [
                        r.itemNo,
                        { itemNo: r.itemNo, description: r.description },
                    ])).values(),
                ],
                skipDuplicates: true,
            });
            await this.audit.record(actor, 'stocktake-import', `stocktake ${id}: ${created.count} added, ${parsed.rows.length - created.count} already present, ${parsed.issues.length} rows rejected`, tx);
            return created.count;
        });
        return {
            added: result,
            skippedExisting: parsed.rows.length - result,
            issues: parsed.issues,
        };
    }
    async updateLine(stocktakeId, lineId, dto) {
        await this.requireOpen(stocktakeId);
        const line = await this.prisma.stocktakeLine.findFirst({
            where: { id: lineId, stocktakeId },
        });
        if (!line)
            throw new common_1.NotFoundException(`Line ${lineId} not found.`);
        const enteredCount = dto.countedNormal !== undefined ||
            dto.countedCustomer !== undefined;
        const row = await this.prisma.stocktakeLine.update({
            where: { id: lineId },
            data: {
                ...dto,
                counted: dto.counted ?? (enteredCount ? true : undefined),
            },
        });
        return toLine(row);
    }
    async addDiscrepancy(stocktakeId, dto, actor) {
        await this.requireOpen(stocktakeId);
        const row = await this.prisma.stocktakeDiscrepancy.create({
            data: { stocktakeId, createdBy: actor, ...dto },
        });
        return toDiscrepancy(row);
    }
    async updateDiscrepancy(stocktakeId, discrepancyId, dto) {
        await this.requireOpen(stocktakeId);
        const existing = await this.prisma.stocktakeDiscrepancy.findFirst({
            where: { id: discrepancyId, stocktakeId },
        });
        if (!existing)
            throw new common_1.NotFoundException(`Discrepancy ${discrepancyId} not found.`);
        const row = await this.prisma.stocktakeDiscrepancy.update({
            where: { id: discrepancyId },
            data: dto,
        });
        return toDiscrepancy(row);
    }
    async deleteDiscrepancy(stocktakeId, discrepancyId) {
        await this.requireOpen(stocktakeId);
        const res = await this.prisma.stocktakeDiscrepancy.deleteMany({
            where: { id: discrepancyId, stocktakeId },
        });
        if (res.count === 0)
            throw new common_1.NotFoundException(`Discrepancy ${discrepancyId} not found.`);
    }
    async listBcItems() {
        const [items, products] = await Promise.all([
            this.prisma.bcItem.findMany({
                include: { product: { select: { id: true, name: true } } },
                orderBy: { itemNo: 'asc' },
            }),
            this.prisma.product.findMany({
                where: { deletedAt: null },
                select: {
                    id: true,
                    name: true,
                    weight: true,
                    category: true,
                    metalType: true,
                },
            }),
        ]);
        const suggestable = products.map((p) => ({
            id: p.id,
            name: p.name,
            weight: Number(p.weight),
            category: p.category,
            metalType: p.metalType,
        }));
        const mapped = items.map((i) => {
            const s = i.product
                ? null
                : (0, shared_types_1.suggestProductForBcItem)(i.description, suggestable);
            return {
                itemNo: i.itemNo,
                description: i.description,
                productId: i.productId,
                productName: i.product?.name ?? null,
                suggestedProductIds: s?.status === 'SUGGESTED'
                    ? [s.productId]
                    : s?.status === 'AMBIGUOUS'
                        ? s.productIds
                        : [],
            };
        });
        return {
            items: mapped,
            products: products
                .map((p) => ({
                id: p.id,
                name: p.name,
                metalType: p.metalType,
                category: p.category,
                weight: Number(p.weight),
            }))
                .sort(shared_types_1.compareProducts)
                .map(({ id, name, metalType, category }) => ({
                id,
                name,
                metalType,
                category,
            })),
        };
    }
    async linkBcItem(itemNo, productId, actor) {
        const item = await this.prisma.bcItem.findUnique({ where: { itemNo } });
        if (!item)
            throw new common_1.NotFoundException(`BC item ${itemNo} not found.`);
        if (productId !== null) {
            const product = await this.prisma.product.findFirst({
                where: { id: productId, deletedAt: null },
            });
            if (!product)
                throw new common_1.NotFoundException(`Product ${productId} not found.`);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.bcItem.update({ where: { itemNo }, data: { productId } });
            await this.audit.record(actor, 'bc-item-link', `${itemNo} -> ${productId ?? 'unlinked'}`, tx);
        });
    }
    async requireOpen(id) {
        const row = await this.prisma.stocktake.findUnique({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException(`Stocktake ${id} not found.`);
        if (row.status === 'FINALISED') {
            throw new common_1.ConflictException('This stocktake is finalised and can no longer be changed.');
        }
        return row;
    }
};
exports.StocktakeService = StocktakeService;
exports.StocktakeService = StocktakeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], StocktakeService);
function toStocktake(row) {
    return {
        id: row.id,
        name: row.name,
        countDate: toIso(row.countDate),
        cutoffDate: toIso(row.cutoffDate),
        status: row.status,
        stocktakeLead: row.stocktakeLead,
        secondChecker: row.secondChecker,
        notes: row.notes,
        createdBy: row.createdBy,
        finalisedBy: row.finalisedBy,
        finalisedAt: row.finalisedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
    };
}
function toLine(row) {
    return {
        id: row.id,
        itemNo: row.itemNo,
        description: row.description,
        locationCode: row.locationCode,
        qtyCalculated: row.qtyCalculated,
        countedNormal: row.countedNormal,
        countedCustomer: row.countedCustomer,
        counted: row.counted,
        variance: (0, shared_types_1.computeVariance)(row.qtyCalculated, row.countedNormal, row.countedCustomer, row.counted),
        reason: row.reason,
        serialsChecked: row.serialsChecked,
        serialNote: row.serialNote,
        batchName: row.batchName,
        documentNo: row.documentNo,
        entryType: row.entryType,
        unitAmount: row.unitAmount === null ? null : Number(row.unitAmount),
        unitCost: row.unitCost === null ? null : Number(row.unitCost),
    };
}
function toDiscrepancy(row) {
    return {
        id: row.id,
        itemNo: row.itemNo,
        description: row.description,
        issueType: row.issueType,
        bcShows: row.bcShows,
        physicalFound: row.physicalFound,
        serialNo: row.serialNo,
        action: row.action,
        resolved: row.resolved,
        createdBy: row.createdBy,
    };
}
//# sourceMappingURL=stocktake.service.js.map