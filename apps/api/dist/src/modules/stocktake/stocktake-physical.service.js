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
exports.StocktakePhysicalService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const stocktake_service_1 = require("./stocktake.service");
const serialOrNull = (s) => s ? (0, shared_types_1.normalizeSerial)(s) || null : null;
let StocktakePhysicalService = class StocktakePhysicalService {
    prisma;
    audit;
    stocktakes;
    constructor(prisma, audit, stocktakes) {
        this.prisma = prisma;
        this.audit = audit;
        this.stocktakes = stocktakes;
    }
    async getRegister(stocktakeId) {
        await this.exists(stocktakeId);
        const [bars, coins] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId },
                orderBy: [
                    { metal: 'asc' },
                    { locationCode: 'asc' },
                    { id: 'asc' },
                ],
            }),
            this.prisma.stocktakeCoin.findMany({
                where: { stocktakeId },
                orderBy: [
                    { metal: 'asc' },
                    { item: 'asc' },
                    { locationCode: 'asc' },
                ],
            }),
        ]);
        const dup = (0, shared_types_1.findDuplicateSerials)(bars);
        const flagged = new Set([...dup.values()].flat());
        return {
            bars: [...bars]
                .sort((a, b) => (0, shared_types_1.compareStockLabels)({ metal: a.metal, label: a.weightLabel }, { metal: b.metal, label: b.weightLabel }) ||
                a.locationCode.localeCompare(b.locationCode) ||
                a.id - b.id)
                .map((b) => toBar(b, flagged.has(b.id))),
            coins: [...coins]
                .sort((a, b) => (0, shared_types_1.compareStockLabels)({ metal: a.metal, label: a.item }, { metal: b.metal, label: b.item }) || a.locationCode.localeCompare(b.locationCode))
                .map(toCoin),
        };
    }
    async importBars(stocktakeId, metal, text, actor) {
        await this.stocktakes.requireOpen(stocktakeId);
        const parsed = (0, shared_types_1.parseBarsPaste)(text);
        if (parsed.rows.length === 0) {
            return { added: 0, skipped: 0, issues: parsed.issues };
        }
        const existing = await this.prisma.stocktakeBar.findMany({
            where: { stocktakeId, metal },
            select: {
                locationCode: true,
                weightLabel: true,
                refinery: true,
                serial: true,
                status: true,
            },
        });
        const plan = (0, shared_types_1.planBarImport)(existing, parsed.rows);
        if (plan.toAdd.length > 0) {
            await this.prisma.$transaction(async (tx) => {
                await tx.stocktakeBar.createMany({
                    data: plan.toAdd.map((r) => ({
                        stocktakeId,
                        metal,
                        locationCode: r.locationCode,
                        weightLabel: r.weightLabel,
                        refinery: r.refinery,
                        serial: r.serial,
                        grams: r.grams,
                        details: r.details,
                        status: 'UNCONFIRMED',
                    })),
                });
                await this.audit.record(actor, 'stocktake-bars-import', `stocktake ${stocktakeId}: ${plan.toAdd.length} ${metal} bars added, ${plan.skipped} already there`, tx);
            });
        }
        return {
            added: plan.toAdd.length,
            skipped: plan.skipped,
            issues: parsed.issues,
        };
    }
    async addBar(stocktakeId, dto) {
        await this.stocktakes.requireOpen(stocktakeId);
        const row = await this.prisma.stocktakeBar.create({
            data: {
                stocktakeId,
                metal: dto.metal,
                locationCode: dto.locationCode.toUpperCase(),
                weightLabel: dto.weightLabel,
                refinery: dto.refinery || null,
                serial: serialOrNull(dto.serial),
                grams: dto.grams ?? null,
                details: dto.details || null,
                status: 'NEW',
            },
        });
        return this.withDuplicateFlag(row);
    }
    async updateBar(stocktakeId, barId, dto) {
        await this.stocktakes.requireOpen(stocktakeId);
        await this.requireBar(stocktakeId, barId);
        const { serial, ...rest } = dto;
        const row = await this.prisma.stocktakeBar.update({
            where: { id: barId },
            data: {
                ...rest,
                ...(serial !== undefined && { serial: serialOrNull(serial) }),
            },
        });
        return this.withDuplicateFlag(row);
    }
    async deleteBar(stocktakeId, barId) {
        await this.stocktakes.requireOpen(stocktakeId);
        const bar = await this.requireBar(stocktakeId, barId);
        if (bar.status !== 'NEW' || bar.carriedFromId !== null) {
            throw new common_1.BadRequestException('Mark this bar as gone instead of deleting it.');
        }
        await this.prisma.stocktakeBar.delete({ where: { id: barId } });
    }
    async importCoins(stocktakeId, metal, text, actor) {
        await this.stocktakes.requireOpen(stocktakeId);
        const parsed = (0, shared_types_1.parseCoinsPaste)(text);
        if (parsed.rows.length === 0) {
            return { added: 0, skipped: 0, issues: parsed.issues };
        }
        const created = await this.prisma.$transaction(async (tx) => {
            const res = await tx.stocktakeCoin.createMany({
                data: parsed.rows.map((r) => ({
                    stocktakeId,
                    metal,
                    locationCode: r.locationCode,
                    item: r.item,
                    previousQty: r.quantity,
                })),
                skipDuplicates: true,
            });
            await this.audit.record(actor, 'stocktake-coins-import', `stocktake ${stocktakeId}: ${res.count} ${metal} coin lines added`, tx);
            return res.count;
        });
        return {
            added: created,
            skipped: parsed.rows.length - created,
            issues: parsed.issues,
        };
    }
    async addCoin(stocktakeId, dto) {
        await this.stocktakes.requireOpen(stocktakeId);
        const row = await this.prisma.stocktakeCoin.upsert({
            where: {
                stocktakeId_metal_locationCode_item: {
                    stocktakeId,
                    metal: dto.metal,
                    locationCode: dto.locationCode.toUpperCase(),
                    item: dto.item,
                },
            },
            update: {},
            create: {
                stocktakeId,
                metal: dto.metal,
                locationCode: dto.locationCode.toUpperCase(),
                item: dto.item,
            },
        });
        return toCoin(row);
    }
    async updateCoin(stocktakeId, coinId, dto) {
        await this.stocktakes.requireOpen(stocktakeId);
        const found = await this.prisma.stocktakeCoin.findFirst({
            where: { id: coinId, stocktakeId },
        });
        if (!found)
            throw new common_1.NotFoundException(`Coin line ${coinId} not found.`);
        const row = await this.prisma.stocktakeCoin.update({
            where: { id: coinId },
            data: dto,
        });
        return toCoin(row);
    }
    async carryForward(stocktakeId, fromId, actor) {
        await this.stocktakes.requireOpen(stocktakeId);
        const source = fromId
            ? await this.prisma.stocktake.findUnique({ where: { id: fromId } })
            : await this.prisma.stocktake.findFirst({
                where: { status: 'FINALISED', id: { not: stocktakeId } },
                orderBy: { finalisedAt: 'desc' },
            });
        if (!source || source.id === stocktakeId) {
            throw new common_1.NotFoundException('There is no earlier finalised stocktake to carry forward from.');
        }
        if (source.status !== 'FINALISED') {
            throw new common_1.BadRequestException('Only a finalised stocktake can be carried forward.');
        }
        const [srcBars, srcCoins, haveBars] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId: source.id },
            }),
            this.prisma.stocktakeCoin.findMany({
                where: { stocktakeId: source.id, countedQty: { not: null } },
            }),
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId, carriedFromId: { not: null } },
                select: { carriedFromId: true },
            }),
        ]);
        const alreadyCarried = new Set(haveBars.map((b) => b.carriedFromId));
        const closing = srcBars.filter((b) => (0, shared_types_1.isClosingBar)(b.status));
        const toCarry = closing.filter((b) => !alreadyCarried.has(b.id));
        return this.prisma.$transaction(async (tx) => {
            if (toCarry.length > 0) {
                await tx.stocktakeBar.createMany({
                    data: toCarry.map((b) => ({
                        stocktakeId,
                        metal: b.metal,
                        locationCode: b.locationCode,
                        weightLabel: b.weightLabel,
                        refinery: b.refinery,
                        serial: b.serial,
                        grams: b.grams,
                        details: b.details,
                        status: 'UNCONFIRMED',
                        carriedFromId: b.id,
                    })),
                });
            }
            const coins = await tx.stocktakeCoin.createMany({
                data: srcCoins.map((c) => ({
                    stocktakeId,
                    metal: c.metal,
                    locationCode: c.locationCode,
                    item: c.item,
                    previousQty: c.countedQty,
                })),
                skipDuplicates: true,
            });
            const result = {
                fromStocktakeId: source.id,
                fromName: source.name,
                barsCarried: toCarry.length,
                barsAlreadyThere: closing.length - toCarry.length,
                coinsCarried: coins.count,
                coinsAlreadyThere: srcCoins.length - coins.count,
            };
            await this.audit.record(actor, 'stocktake-carry-forward', `stocktake ${stocktakeId} from ${source.name}: ${result.barsCarried} bars, ${result.coinsCarried} coin lines`, tx);
            return result;
        });
    }
    async exists(id) {
        const row = await this.prisma.stocktake.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!row)
            throw new common_1.NotFoundException(`Stocktake ${id} not found.`);
    }
    async requireBar(stocktakeId, barId) {
        const bar = await this.prisma.stocktakeBar.findFirst({
            where: { id: barId, stocktakeId },
        });
        if (!bar)
            throw new common_1.NotFoundException(`Bar ${barId} not found.`);
        return bar;
    }
    async withDuplicateFlag(row) {
        if (!row.serial)
            return toBar(row, false);
        const others = await this.prisma.stocktakeBar.count({
            where: {
                stocktakeId: row.stocktakeId,
                serial: row.serial,
                status: { not: 'GONE' },
                id: { not: row.id },
            },
        });
        return toBar(row, row.status !== 'GONE' && others > 0);
    }
};
exports.StocktakePhysicalService = StocktakePhysicalService;
exports.StocktakePhysicalService = StocktakePhysicalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        stocktake_service_1.StocktakeService])
], StocktakePhysicalService);
function toBar(row, duplicateSerial) {
    return {
        id: row.id,
        metal: row.metal,
        locationCode: row.locationCode,
        weightLabel: row.weightLabel,
        refinery: row.refinery,
        serial: row.serial,
        grams: row.grams === null ? null : Number(row.grams),
        details: row.details,
        status: row.status,
        carriedFromId: row.carriedFromId,
        duplicateSerial,
    };
}
function toCoin(row) {
    return {
        id: row.id,
        metal: row.metal,
        locationCode: row.locationCode,
        item: row.item,
        previousQty: row.previousQty,
        countedQty: row.countedQty,
        details: row.details,
    };
}
//# sourceMappingURL=stocktake-physical.service.js.map