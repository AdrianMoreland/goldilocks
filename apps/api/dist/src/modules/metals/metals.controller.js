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
const common_2 = require("@nestjs/common");
const metals_provider_1 = require("./metals.provider");
const metals_cron_1 = require("./metals.cron");
const fetch_attempt_service_1 = require("./fetch-attempt.service");
const pricing_util_1 = require("../../common/utils/pricing.util");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
function parseMetal(value) {
    const metal = value.toUpperCase();
    if (!pricing_util_1.ALL_METALS.includes(metal)) {
        throw new common_1.BadRequestException(`Unknown metal "${value}" — expected one of ${pricing_util_1.ALL_METALS.join(', ')}`);
    }
    return metal;
}
let MetalsController = class MetalsController {
    metalsProvider;
    metalsCron;
    fetchAttempts;
    constructor(metalsProvider, metalsCron, fetchAttempts) {
        this.metalsProvider = metalsProvider;
        this.metalsCron = metalsCron;
        this.fetchAttempts = fetchAttempts;
    }
    async refresh() {
        const { prices } = await this.metalsProvider.refreshAll();
        return prices;
    }
    getCronStatus() {
        return { running: this.metalsCron.isPriceCronRunning() };
    }
    async toggleCron() {
        const running = await this.metalsCron.setPriceCronEnabled(!this.metalsCron.isPriceCronRunning());
        return { running };
    }
    async clearCache() {
        await this.metalsProvider.clearCache();
        return { message: 'Spot-price cache cleared.' };
    }
    async retryMetal(metalParam) {
        const metal = parseMetal(metalParam);
        const result = await this.metalsProvider.retryMetal(metal);
        if (!result) {
            throw new common_1.NotFoundException(`Retry didn't return a usable rate for ${metal} — the vendor API may still be down.`);
        }
        return result;
    }
    async getFetchLog(limit) {
        const parsed = limit ? Number(limit) : 20;
        const take = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100) : 20;
        return this.fetchAttempts.getRecent(take);
    }
    async getFetchMetrics() {
        return this.fetchAttempts.getMetrics();
    }
};
exports.MetalsController = MetalsController;
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Whether the 10-minute price-refresh cron is currently running (admin)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], MetalsController.prototype, "getCronStatus", null);
__decorate([
    (0, common_1.Post)('cron-toggle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Pause or resume the 10-minute price-refresh cron (admin)',
        description: 'A manual runtime pause — resets to running on the next restart/redeploy, not a persisted setting.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "toggleCron", null);
__decorate([
    (0, common_1.Post)('clear-cache'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'metal', enum: pricing_util_1.ALL_METALS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Retry a live fetch for one metal (admin)',
        description: 'The vendor API always returns all four metals in one call — this makes that same call but only stores/reports the one metal retried.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RawSpotPriceResponseDto }),
    __param(0, (0, common_1.Param)('metal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "retryMetal", null);
__decorate([
    (0, common_1.Get)('fetch-log'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiOperation)({
        summary: 'Recent external-API fetch attempts, newest first (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dtos_1.FetchAttemptResponseDto] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetalsController.prototype, "getFetchLog", null);
__decorate([
    (0, common_1.Get)('fetch-metrics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
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
    (0, common_2.UseInterceptors)(nestjs_zod_1.ZodSerializerInterceptor),
    __metadata("design:paramtypes", [metals_provider_1.MetalsProvider,
        metals_cron_1.MetalsCron,
        fetch_attempt_service_1.FetchAttemptService])
], MetalsController);
//# sourceMappingURL=metals.controller.js.map