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
var PriceSnapshotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceSnapshotService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const market_data_service_1 = require("../market-data/market-data.service");
const analytics_service_1 = require("./analytics.service");
let PriceSnapshotService = PriceSnapshotService_1 = class PriceSnapshotService {
    prisma;
    marketData;
    logger = new common_1.Logger(PriceSnapshotService_1.name);
    constructor(prisma, marketData) {
        this.prisma = prisma;
        this.marketData = marketData;
    }
    async run() {
        try {
            const n = await this.capture(new Date());
            this.logger.log(`Daily price snapshot: ${n} products`);
        }
        catch (error) {
            this.logger.error(`Daily price snapshot failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async capture(now) {
        const { products, degradedMetals } = await this.marketData.getPricedCatalogue();
        const day = new Date(`${(0, analytics_service_1.dublinToday)(now)}T00:00:00Z`);
        const rows = products.filter((p) => p.isActive && !degradedMetals.includes(p.metalType));
        await this.prisma.$transaction(rows.map((p) => {
            const data = {
                metalType: p.metalType,
                spotEur: p.spotPrice,
                spreadSell: p.spreadSell,
                spreadBuy: p.spreadBuy,
                sellPriceEur: p.priceSell,
                buyPriceEur: p.priceBuy,
            };
            return this.prisma.productPriceSnapshot.upsert({
                where: { productId_day: { productId: p.id, day } },
                create: { productId: p.id, day, ...data },
                update: data,
            });
        }));
        return rows.length;
    }
};
exports.PriceSnapshotService = PriceSnapshotService;
__decorate([
    (0, schedule_1.Cron)('45 17 * * *', { timeZone: 'Europe/Dublin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceSnapshotService.prototype, "run", null);
exports.PriceSnapshotService = PriceSnapshotService = PriceSnapshotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        market_data_service_1.MarketDataService])
], PriceSnapshotService);
//# sourceMappingURL=price-snapshot.service.js.map