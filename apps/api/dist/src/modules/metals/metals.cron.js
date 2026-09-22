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
var MetalsCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalsCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const metals_provider_1 = require("./metals.provider");
const date_utils_1 = require("../../common/utils/date.utils");
const STALE_THRESHOLD_DAYS = 1;
const PRICE_REFRESH_JOB = 'updateMetals';
let MetalsCron = MetalsCron_1 = class MetalsCron {
    metalsProvider;
    schedulerRegistry;
    logger = new common_1.Logger(MetalsCron_1.name);
    constructor(metalsProvider, schedulerRegistry) {
        this.metalsProvider = metalsProvider;
        this.schedulerRegistry = schedulerRegistry;
    }
    isPriceCronRunning() {
        return this.schedulerRegistry.getCronJob(PRICE_REFRESH_JOB).isActive;
    }
    setPriceCronEnabled(enabled) {
        const job = this.schedulerRegistry.getCronJob(PRICE_REFRESH_JOB);
        if (enabled) {
            job.start();
            this.logger.log('▶️ Price-refresh cron resumed by admin');
        }
        else {
            job.stop();
            this.logger.warn('⏸️ Price-refresh cron paused by admin');
        }
        return this.isPriceCronRunning();
    }
    async onModuleInit() {
        const latest = await this.metalsProvider.getLatestHistoricDate();
        const daysStale = latest
            ? (Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24)
            : Infinity;
        if (daysStale <= STALE_THRESHOLD_DAYS) {
            return;
        }
        this.logger.warn(latest
            ? `Historic spot data is stale (latest: ${latest.toISOString()}) — backfilling…`
            : 'No historic spot data found — seeding…');
        await this.metalsProvider.seedHistoricPrices();
    }
    async updateMetals() {
        const { degradedMetals } = await this.metalsProvider.refreshAll('CRON');
        if (degradedMetals.length > 0) {
            this.logger.warn(`No usable price anywhere (API/DB) for: ${degradedMetals.join(', ')}`);
        }
    }
    async dailyHistoricClose() {
        this.logger.log('Running daily historic close job');
        const yesterday = (0, date_utils_1.getYesterday)();
        await this.metalsProvider.fetchAndStoreHistoricClose(yesterday);
    }
};
exports.MetalsCron = MetalsCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES, { name: PRICE_REFRESH_JOB }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetalsCron.prototype, "updateMetals", null);
__decorate([
    (0, schedule_1.Cron)('0 6 * * *', {
        timeZone: 'UTC',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetalsCron.prototype, "dailyHistoricClose", null);
exports.MetalsCron = MetalsCron = MetalsCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metals_provider_1.MetalsProvider,
        schedule_1.SchedulerRegistry])
], MetalsCron);
//# sourceMappingURL=metals.cron.js.map