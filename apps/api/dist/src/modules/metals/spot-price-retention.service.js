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
var SpotPriceRetentionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotPriceRetentionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const error_log_service_1 = require("../error-log/error-log.service");
const pricing_util_1 = require("../../common/utils/pricing.util");
const DEFAULT_RETENTION_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
let SpotPriceRetentionService = SpotPriceRetentionService_1 = class SpotPriceRetentionService {
    prisma;
    errorLog;
    logger = new common_1.Logger(SpotPriceRetentionService_1.name);
    retentionDays;
    constructor(prisma, errorLog, config) {
        this.prisma = prisma;
        this.errorLog = errorLog;
        const configured = Number(config.get('SPOT_PRICE_RETENTION_DAYS'));
        this.retentionDays =
            Number.isFinite(configured) && configured >= 1
                ? Math.floor(configured)
                : DEFAULT_RETENTION_DAYS;
    }
    onModuleInit() {
        void this.prune();
    }
    async prune() {
        try {
            const cutoff = new Date(Date.now() - this.retentionDays * DAY_MS);
            const newest = await Promise.all(pricing_util_1.ALL_METALS.map((metalType) => this.prisma.metalSpotPrice.findFirst({
                where: { metalType },
                orderBy: { timestamp: 'desc' },
                select: { id: true },
            })));
            const keep = newest.flatMap((row) => (row ? [row.id] : []));
            const { count } = await this.prisma.metalSpotPrice.deleteMany({
                where: { timestamp: { lt: cutoff }, id: { notIn: keep } },
            });
            if (count > 0) {
                this.logger.log(`Deleted ${count} spot-price rows older than ${this.retentionDays} days`);
            }
            return count;
        }
        catch (error) {
            await this.errorLog.record({
                severity: 'warning',
                kind: 'database',
                message: 'Spot-price cleanup failed',
                error,
            });
            return 0;
        }
    }
};
exports.SpotPriceRetentionService = SpotPriceRetentionService;
__decorate([
    (0, schedule_1.Cron)('30 3 * * *', { timeZone: 'UTC' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpotPriceRetentionService.prototype, "prune", null);
exports.SpotPriceRetentionService = SpotPriceRetentionService = SpotPriceRetentionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        error_log_service_1.ErrorLogService,
        config_1.ConfigService])
], SpotPriceRetentionService);
//# sourceMappingURL=spot-price-retention.service.js.map