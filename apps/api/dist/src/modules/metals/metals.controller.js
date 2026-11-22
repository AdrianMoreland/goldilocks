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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const metals_provider_1 = require("./metals.provider");
const metals_cron_1 = require("./metals.cron");
const fetch_attempt_service_1 = require("./fetch-attempt.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const pricing_util_1 = require("../../common/utils/pricing.util");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
let MetalsController = class MetalsController {
    metalsProvider;
    metalsCron;
    fetchAttempts;
    audit;
    constructor(metalsProvider, metalsCron, fetchAttempts, audit) {
        this.metalsProvider = metalsProvider;
        this.metalsCron = metalsCron;
        this.fetchAttempts = fetchAttempts;
        this.audit = audit;
    }
    async refresh() {
        const { prices } = await this.metalsProvider.refreshAll();
        return prices;
    }
    getCronStatus() {
        return { running: this.metalsCron.isPriceCronRunning() };
    }
    async toggleCron(request) {
        const enable = !this.metalsCron.isPriceCronRunning();
        await this.audit.record(request.user.email, 'price-cron', enable ? 'Resumed the price refresh' : 'Paused the price refresh');
        const running = await this.metalsCron.setPriceCronEnabled(enable);
        return { running };
    }
    async clearCache() {
        await this.metalsProvider.clearCache();
        return { message: 'Spot-price cache cleared.' };
    }
    async retryMetal(metal) {
        const result = await this.metalsProvider.retryMetal(metal);
        if (!result) {
            throw new common_1.NotFoundException(`Retry didn't return a usable rate for ${metal} - the vendor API may still be down.`);
        }
        return result;
    }
    async getFetchLog({ limit }) {
        return this.fetchAttempts.getRecent(limit);
    }
    async getFetchMetrics() {
        return this.fetchAttempts.getMetrics();
    }
};
exports.MetalsController = MetalsController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 6, ttl: 60_000 } }),
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({
        summary: 'Force a manual spot-price refresh (admin)',
        description: 'Bypasses the cron schedule and fetches fresh prices from the external API immediately.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dtos_1.RawSpotPriceResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('cron-status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Whether the 5-minute price-refresh cron is currently running (admin). It starts paused after every deploy.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], MetalsController.prototype, "getCronStatus", null);
__decorate([
    (0, common_1.Post)('cron-toggle'),
    (0, swagger_1.ApiOperation)({
        summary: 'Pause or resume the 5-minute price-refresh cron (admin)',
        description: 'A manual runtime pause - resets to running on the next restart/redeploy, not a persisted setting.',
    }),
    __param(0, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "toggleCron", null);
__decorate([
    (0, common_1.Post)('clear-cache'),
    (0, swagger_1.ApiOperation)({
        summary: 'Clear the spot-price cache (admin)',
        description: 'Forces the next read of every metal back to the DB/live API instead of whatever is currently cached.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Post)(':metal/retry'),
    (0, swagger_1.ApiParam)({ name: 'metal', enum: pricing_util_1.ALL_METALS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Retry a live fetch for one metal (admin)',
        description: 'The vendor API always returns all four metals in one call - this makes that same call but only stores/reports the one metal retried.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RawSpotPriceResponseDto }),
    __param(0, (0, common_1.Param)('metal', new nestjs_zod_1.ZodValidationPipe(shared_types_1.MetalTypeEnum))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "retryMetal", null);
__decorate([
    (0, common_1.Get)('fetch-log'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiOperation)({
        summary: 'Recent external-API fetch attempts, newest first (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dtos_1.FetchAttemptResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.FetchLogQueryDto]),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "getFetchLog", null);
__decorate([
    (0, common_1.Get)('fetch-metrics'),
    (0, swagger_1.ApiOperation)({
        summary: '24h fetch success rate, avg latency, and cache hit ratio (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.FetchMetricsResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "getFetchMetrics", null);
exports.MetalsController = MetalsController = __decorate([
    (0, swagger_1.ApiTags)('metals'),
    (0, common_1.Controller)('metals'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseInterceptors)(nestjs_zod_1.ZodSerializerInterceptor),
    __metadata("design:paramtypes", [metals_provider_1.MetalsProvider,
        metals_cron_1.MetalsCron,
        fetch_attempt_service_1.FetchAttemptService,
        audit_log_service_1.AuditLogService])
], MetalsController);
//# sourceMappingURL=metals.controller.js.map