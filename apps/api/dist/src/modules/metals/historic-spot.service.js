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
var HistoricSpotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricSpotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const metal_price_api_port_1 = require("../../infrastructure/metal-price-api/metal-price-api.port");
const pricing_util_1 = require("../../common/utils/pricing.util");
const vendor_rates_1 = require("./vendor-rates");
let HistoricSpotService = HistoricSpotService_1 = class HistoricSpotService {
    prisma;
    metalPriceApi;
    logger = new common_1.Logger(HistoricSpotService_1.name);
    constructor(prisma, metalPriceApi) {
        this.prisma = prisma;
        this.metalPriceApi = metalPriceApi;
    }
    async getHistoricSpots() {
        const rows = (0, pricing_util_1.thinOldHistory)(await this.readFromDb());
        if (rows.length === 0) {
            this.logger.warn('No historic spot data found — has the cron run yet?');
        }
        return rows.map((row) => ({
            metalType: row.metalType,
            priceEur: (0, pricing_util_1.toNumber)(row.priceEur),
            priceGbp: (0, pricing_util_1.toNumber)(row.priceGbp),
            timestamp: row.recordedAt.toISOString(),
        }));
    }
    async getLatestHistoricDate() {
        const latest = await this.prisma.historicSpotPrice.findFirst({
            orderBy: { recordedAt: 'desc' },
            select: { recordedAt: true },
        });
        return latest?.recordedAt ?? null;
    }
    async fetchAndStoreHistoricClose(date) {
        this.logger.log(`Fetching OHLC historic close for ${date}`);
        const recordedAt = new Date(`${date}T00:00:00.000Z`);
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const existingCount = await this.prisma.historicSpotPrice.count({
            where: { recordedAt: { gte: startOfDay, lte: endOfDay } },
        });
        if (existingCount === pricing_util_1.ALL_METALS.length) {
            this.logger.log(`Historic OHLC already exists for ${recordedAt.toISOString()}`);
            return;
        }
        const records = await Promise.all(Object.entries(pricing_util_1.SYMBOL_MAP).map(async ([metalType, symbol]) => {
            const [eurResponse, gbpResponse] = await Promise.all([
                this.metalPriceApi.ohlcPrices(date, 'EUR', symbol),
                this.metalPriceApi.ohlcPrices(date, 'GBP', symbol),
            ]);
            if (!eurResponse.success || !gbpResponse.success) {
                return null;
            }
            this.logger.debug(`${metalType} close: EUR raw=${eurResponse.rate.close}, GBP raw=${gbpResponse.rate.close}`);
            return {
                metalType,
                priceEur: 1 / Number(eurResponse.rate.close),
                priceGbp: 1 / Number(gbpResponse.rate.close),
                recordedAt,
            };
        }));
        const validRecords = records.filter((r) => r !== null);
        if (validRecords.length === 0) {
            this.logger.warn('No OHLC records generated');
            return;
        }
        await this.prisma.historicSpotPrice.createMany({
            data: validRecords,
            skipDuplicates: true,
        });
        this.logger.log(`Inserted ${validRecords.length} historic close prices for ${date}`);
    }
    async seedHistoricPrices() {
        this.logger.log('Starting historic price seed...');
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 364);
        const startDate = start.toISOString().slice(0, 10);
        const endDate = end.toISOString().slice(0, 10);
        const records = await this.fetchTimeframe(startDate, endDate);
        if (!records.length) {
            this.logger.warn('No historic records returned');
            return;
        }
        await this.prisma.historicSpotPrice.createMany({
            data: records,
            skipDuplicates: true,
        });
        this.logger.log(`Inserted ${records.length} historic spot prices`);
    }
    async backfillYears(years) {
        const dayMs = 24 * 60 * 60 * 1000;
        const today = new Date();
        const reports = [];
        for (let i = 0; i < years; i++) {
            const end = new Date(today.getTime() - i * 364 * dayMs);
            const start = new Date(end.getTime() - 363 * dayMs);
            const from = start.toISOString().slice(0, 10);
            const to = end.toISOString().slice(0, 10);
            const existing = await this.prisma.historicSpotPrice.count({
                where: {
                    recordedAt: {
                        gte: new Date(`${from}T00:00:00.000Z`),
                        lte: new Date(`${to}T23:59:59.999Z`),
                    },
                },
            });
            if (existing >= 364 * pricing_util_1.ALL_METALS.length * 0.85) {
                reports.push({ from, to, status: 'skipped', inserted: 0 });
                continue;
            }
            const records = await this.fetchTimeframe(from, to);
            if (records.length === 0) {
                reports.push({ from, to, status: 'refused', inserted: 0 });
                break;
            }
            const { count } = await this.prisma.historicSpotPrice.createMany({
                data: records,
                skipDuplicates: true,
            });
            reports.push({ from, to, status: 'stored', inserted: count });
            this.logger.log(`Backfilled ${count} rows for ${from} to ${to}`);
        }
        return reports;
    }
    async fetchTimeframe(startDate, endDate) {
        const [eurResponse, gbpResponse] = await Promise.all([
            this.metalPriceApi.timeframePrices(startDate, endDate, 'EUR'),
            this.metalPriceApi.timeframePrices(startDate, endDate, 'GBP'),
        ]);
        if (!eurResponse.success) {
            this.logger.error(`EUR historic failed: ${JSON.stringify(eurResponse)}`);
            return [];
        }
        if (!gbpResponse.success) {
            this.logger.error(`GBP historic failed: ${JSON.stringify(gbpResponse)}`);
            return [];
        }
        return (0, vendor_rates_1.mapTimeframeRecords)(eurResponse.rates, gbpResponse.rates);
    }
    async readFromDb() {
        const since = new Date();
        since.setDate(since.getDate() - pricing_util_1.HISTORIC_LOOKBACK_DAYS);
        this.logger.debug(`Reading historic spot prices since ${since.toISOString()} from DB…`);
        return this.prisma.historicSpotPrice.findMany({
            where: {
                metalType: { in: pricing_util_1.ALL_METALS },
                recordedAt: { gte: since },
            },
            orderBy: { recordedAt: 'asc' },
            select: {
                metalType: true,
                priceEur: true,
                priceGbp: true,
                recordedAt: true,
            },
        });
    }
};
exports.HistoricSpotService = HistoricSpotService;
exports.HistoricSpotService = HistoricSpotService = HistoricSpotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(metal_price_api_port_1.METAL_PRICE_API)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], HistoricSpotService);
//# sourceMappingURL=historic-spot.service.js.map