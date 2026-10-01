"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const auth_module_1 = require("../auth/auth.module");
const metals_module_1 = require("../metals/metals.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const redis_module_1 = require("../../redis/redis.module");
const admin_controller_1 = require("./admin.controller");
const admin_overview_service_1 = require("./admin-overview.service");
const api_catalogue_service_1 = require("./api-catalogue.service");
const audit_log_service_1 = require("./audit-log.service");
const db_browser_service_1 = require("./db-browser.service");
const request_metrics_service_1 = require("./request-metrics.service");
const system_health_service_1 = require("./system-health.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            terminus_1.TerminusModule,
            auth_module_1.AuthModule,
            metals_module_1.MetalsModule,
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_overview_service_1.AdminOverviewService,
            api_catalogue_service_1.ApiCatalogueService,
            audit_log_service_1.AuditLogService,
            db_browser_service_1.DbBrowserService,
            request_metrics_service_1.RequestMetricsService,
            system_health_service_1.SystemHealthService,
        ],
        exports: [api_catalogue_service_1.ApiCatalogueService, request_metrics_service_1.RequestMetricsService, audit_log_service_1.AuditLogService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map