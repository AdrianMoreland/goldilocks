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
exports.FetchAttemptService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const cascade_metrics_service_1 = require("./cascade-metrics.service");
const error_log_service_1 = require("../error-log/error-log.service");
const METRICS_WINDOW_MS = 24 * 60 * 60 * 1000;
let FetchAttemptService = class FetchAttemptService {
    prisma;
    cascadeMetrics;
    errorLog;
    constructor(prisma, cascadeMetrics, errorLog) {
        this.prisma = prisma;
        this.cascadeMetrics = cascadeMetrics;
        this.errorLog = errorLog;
    }
    async record(entry) {
        if (!entry.success) {
            await this.errorLog.record({
                severity: 'warning',
                kind: 'external-api',
                message: `Spot price fetch failed (${entry.triggeredBy})`,
                detail: `${entry.errorMessage ?? 'No error message'} — after ${entry.durationMs} ms; resolved: ${entry.metalsResolved.join(', ') || 'none'}`,
            });
        }
        await this.prisma.fetchAttempt.create({ data: entry });
    }
    async getRecent(limit) {
        const rows = await this.prisma.fetchAttempt.findMany({
            orderBy: { attemptedAt: 'desc' },
            take: limit,
        });
        return rows.map((row) => this.toDto(row));
    }
    async getMetrics() {
        const since = new Date(Date.now() - METRICS_WINDOW_MS);
        const attempts = await this.prisma.fetchAttempt.findMany({ where: { attemptedAt: { gte: since } } });
        const total = attempts.length;
        const failureCount = attempts.filter((a) => !a.success).length;
        const avgLatencyMs = total > 0 ? attempts.reduce((sum, a) => sum + a.durationMs, 0) / total : 0;
        return {
            successRate24h: total > 0 ? (total - failureCount) / total : 1,
            totalAttempts24h: total,
            failureCount24h: failureCount,
            avgLatencyMs: Math.round(avgLatencyMs),
            cacheHitRatio: this.cascadeMetrics.getCacheHitRatio(),
        };
    }
    async getLastSuccessfulAt() {
        const row = await this.prisma.fetchAttempt.findFirst({
            where: { success: true },
            orderBy: { attemptedAt: 'desc' },
        });
        return row ? row.attemptedAt.toISOString() : null;
    }
    toDto(row) {
        return {
            id: row.id.toString(),
            attemptedAt: row.attemptedAt.toISOString(),
            durationMs: row.durationMs,
            success: row.success,
            errorMessage: row.errorMessage,
            metalsResolved: row.metalsResolved,
            triggeredBy: row.triggeredBy,
        };
    }
};
exports.FetchAttemptService = FetchAttemptService;
exports.FetchAttemptService = FetchAttemptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cascade_metrics_service_1.CascadeMetricsService,
        error_log_service_1.ErrorLogService])
], FetchAttemptService);
//# sourceMappingURL=fetch-attempt.service.js.map