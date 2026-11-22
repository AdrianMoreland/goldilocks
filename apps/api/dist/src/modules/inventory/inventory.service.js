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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const day = (d) => d.toISOString().slice(0, 10);
const norm = (s) => String(s ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
const HELD_STATUSES = ['DELIVERED', 'BAGGED', 'ALLOCATED'];
const MIN_SERIAL = 4;
const BAR_CAP = 5000;
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ref(s) {
        return {
            id: s.id,
            name: s.name,
            countDate: day(s.countDate),
            status: s.status,
            imported: s.imported,
        };
    }
    async pick(stocktakeId) {
        if (stocktakeId !== undefined) {
            const s = await this.prisma.stocktake.findUnique({
                where: { id: stocktakeId },
            });
            if (!s)
                throw new common_1.NotFoundException(`Stocktake ${stocktakeId} not found.`);
            return s;
        }
        return this.prisma.stocktake.findFirst({
            orderBy: [{ countDate: 'desc' }, { id: 'desc' }],
        });
    }
    async heldSerials() {
        const items = await this.prisma.customerOrderItem.findMany({
            where: {
                status: { in: [...HELD_STATUSES] },
                serials: { not: null },
            },
        });
        const out = new Map();
        for (const item of items) {
            for (const token of (item.serials ?? '').split(/[,;\s]+/)) {
                const n = norm(token);
                if (n.length >= MIN_SERIAL)
                    out.set(n, {
                        orderId: item.id,
                        reference: item.reference,
                        client: item.client,
                        status: item.status,
                    });
            }
        }
        return out;
    }
    async position(rawStocktakeId) {
        const id = rawStocktakeId === undefined ? undefined : Number(rawStocktakeId);
        if (id !== undefined && !Number.isInteger(id))
            throw new common_1.BadRequestException('Invalid stocktake.');
        const [st, recent] = await Promise.all([
            this.pick(id),
            this.prisma.stocktake.findMany({
                orderBy: [{ countDate: 'desc' }, { id: 'desc' }],
                take: 12,
            }),
        ]);
        const empty = {
            stocktake: null,
            available: recent.map((s) => this.ref(s)),
            bars: { total: 0, byMetal: {}, heldForCustomers: 0, gone: 0 },
            coins: { lines: 0, pieces: 0, byMetal: {}, uncounted: 0 },
        };
        if (!st)
            return empty;
        const [bars, coins, held] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId: st.id },
                select: { metal: true, serial: true, status: true },
                take: BAR_CAP,
            }),
            this.prisma.stocktakeCoin.findMany({
                where: { stocktakeId: st.id },
                select: { metal: true, countedQty: true },
            }),
            this.heldSerials(),
        ]);
        const present = bars.filter((b) => b.status !== 'GONE');
        const byMetal = {};
        for (const b of present)
            byMetal[b.metal] = (byMetal[b.metal] ?? 0) + 1;
        const coinMetal = {};
        for (const c of coins)
            coinMetal[c.metal] =
                (coinMetal[c.metal] ?? 0) + (c.countedQty ?? 0);
        return {
            stocktake: this.ref(st),
            available: recent.map((s) => this.ref(s)),
            bars: {
                total: present.length,
                byMetal,
                heldForCustomers: present.filter((b) => held.has(norm(b.serial))).length,
                gone: bars.length - present.length,
            },
            coins: {
                lines: coins.length,
                pieces: coins.reduce((n, c) => n + (c.countedQty ?? 0), 0),
                byMetal: coinMetal,
                uncounted: coins.filter((c) => c.countedQty === null).length,
            },
        };
    }
    async bars(raw) {
        const parsed = shared_types_1.InventoryBarsQuerySchema.safeParse(raw);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid query.');
        const { stocktakeId, metal, branch, where, q, limit, offset } = parsed.data;
        const st = await this.pick(stocktakeId);
        if (!st)
            return { total: 0, rows: [] };
        const filter = {
            stocktakeId: st.id,
            ...(metal ? { metal } : {}),
            ...(branch ? { locationCode: branch.toUpperCase() } : {}),
            ...(q ? { serial: { contains: q, mode: 'insensitive' } } : {}),
        };
        const [bars, held] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: filter,
                orderBy: [
                    { metal: 'asc' },
                    { weightLabel: 'asc' },
                    { serial: 'asc' },
                ],
                take: BAR_CAP,
            }),
            this.heldSerials(),
        ]);
        const rows = bars
            .map((b) => ({ b, h: held.get(norm(b.serial)) ?? null }))
            .filter(({ h }) => where === 'held'
            ? h !== null
            : where === 'free'
                ? h === null
                : true);
        return {
            total: rows.length,
            rows: rows.slice(offset, offset + limit).map(({ b, h }) => ({
                id: b.id,
                serial: b.serial,
                refinery: b.refinery,
                weightLabel: b.weightLabel,
                metal: b.metal,
                locationCode: b.locationCode,
                status: b.status,
                details: b.details,
                heldFor: h,
            })),
        };
    }
    async coins(raw) {
        const parsed = shared_types_1.InventoryCoinsQuerySchema.safeParse(raw);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid query.');
        const { stocktakeId, metal, branch } = parsed.data;
        const st = await this.pick(stocktakeId);
        if (!st)
            return { rows: [] };
        const coins = await this.prisma.stocktakeCoin.findMany({
            where: {
                stocktakeId: st.id,
                ...(metal ? { metal } : {}),
                ...(branch ? { locationCode: branch.toUpperCase() } : {}),
            },
            orderBy: [
                { metal: 'asc' },
                { item: 'asc' },
                { locationCode: 'asc' },
            ],
        });
        return {
            rows: coins.map((c) => ({
                id: c.id,
                item: c.item,
                metal: c.metal,
                locationCode: c.locationCode,
                previousQty: c.previousQty,
                countedQty: c.countedQty,
                details: c.details,
            })),
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map