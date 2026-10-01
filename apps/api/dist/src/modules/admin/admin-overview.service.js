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
exports.AdminOverviewService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const error_log_service_1 = require("../error-log/error-log.service");
const db_browser_service_1 = require("./db-browser.service");
const request_metrics_service_1 = require("./request-metrics.service");
const system_health_service_1 = require("./system-health.service");
const DAY_MS = 24 * 60 * 60 * 1000;
let AdminOverviewService = class AdminOverviewService {
    config;
    prisma;
    health;
    metrics;
    db;
    errorLog;
    constructor(config, prisma, health, metrics, db, errorLog) {
        this.config = config;
        this.prisma = prisma;
        this.health = health;
        this.metrics = metrics;
        this.db = db;
        this.errorLog = errorLog;
    }
    async build() {
        const since = new Date(Date.now() - DAY_MS);
        const [health, traffic, tables, databaseBytes, roles, activeUsers, errors,] = await Promise.all([
            this.health.check(),
            this.metrics.getLastDay(),
            this.db.listTables(),
            this.db.databaseBytes(),
            this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
            this.prisma.user.count({ where: { lastLoginAt: { gte: since } } }),
            this.errorLog.getRecent(500),
        ]);
        const errorCounts = new Map();
        for (const entry of errors.entries) {
            if (Date.parse(entry.at) < since.getTime())
                continue;
            errorCounts.set(entry.kind, (errorCounts.get(entry.kind) ?? 0) + 1);
        }
        return {
            generatedAt: new Date().toISOString(),
            uptimeSeconds: Math.round(process.uptime()),
            nodeVersion: process.version,
            environment: this.config.get('NODE_ENV', 'development'),
            aiEnabled: this.config.get('AI_ENABLED') === 'true',
            health,
            metricsAvailable: traffic !== null,
            hours: traffic?.hours ?? [],
            topRoutes: traffic?.topRoutes ?? [],
            databaseBytes,
            tables: tables
                .map((t) => ({ name: t.name, bytes: t.bytes, rows: t.rows }))
                .sort((a, b) => b.bytes - a.bytes),
            usersByRole: roles.map((r) => ({
                role: r.role,
                count: r._count._all,
            })),
            activeUsers,
            errorsByKind: [...errorCounts.entries()].map(([kind, count]) => ({
                kind,
                count,
            })),
        };
    }
};
exports.AdminOverviewService = AdminOverviewService;
exports.AdminOverviewService = AdminOverviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        system_health_service_1.SystemHealthService,
        request_metrics_service_1.RequestMetricsService,
        db_browser_service_1.DbBrowserService,
        error_log_service_1.ErrorLogService])
], AdminOverviewService);
//# sourceMappingURL=admin-overview.service.js.map