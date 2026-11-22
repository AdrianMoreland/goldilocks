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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
const app_logs_service_1 = require("./app-logs.service");
const admin_overview_service_1 = require("./admin-overview.service");
const api_catalogue_service_1 = require("./api-catalogue.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const db_browser_service_1 = require("./db-browser.service");
let AdminController = class AdminController {
    overview;
    appLogs;
    logs;
    catalogue;
    db;
    constructor(overview, appLogs, logs, catalogue, db) {
        this.overview = overview;
        this.appLogs = appLogs;
        this.logs = logs;
        this.catalogue = catalogue;
        this.db = db;
    }
    getOverview() {
        return this.overview.build();
    }
    getLogs({ limit, level, q }) {
        return this.appLogs.search({ limit, level, q });
    }
    getAudit({ limit }) {
        return this.logs.getRecent(limit);
    }
    getEndpoints() {
        return { endpoints: this.catalogue.list() };
    }
    async getTables() {
        return { tables: await this.db.listTables() };
    }
    getRows(table, { page, pageSize, sort, dir, q }) {
        return this.db.getRows(table, {
            page,
            pageSize,
            sort,
            dir,
            search: q,
        });
    }
    async insertRow(table, body, req) {
        return {
            row: await this.db.insert(table, body.values, req.user.email),
        };
    }
    async updateRow(table, body, req) {
        return {
            row: await this.db.update(table, body.key, body.values, req.user.email),
        };
    }
    async deleteRow(table, body, req) {
        await this.db.remove(table, body.key, req.user.email);
        return { message: 'Row deleted' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({
        summary: 'System health, 24h traffic, storage and error counts',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Recent application log lines (pino), newest first',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AdminLogsQueryDto]),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('audit'),
    (0, swagger_1.ApiOperation)({ summary: 'Recent changes made from the admin console' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AuditQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAudit", null);
__decorate([
    (0, common_1.Get)('endpoints'),
    (0, swagger_1.ApiOperation)({ summary: 'Every API route, for the endpoint tester' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AdminController.prototype, "getEndpoints", null);
__decorate([
    (0, common_1.Get)('db/tables'),
    (0, swagger_1.ApiOperation)({
        summary: 'Tables in the public schema, with size and row count',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTables", null);
__decorate([
    (0, common_1.Get)('db/tables/:table/rows'),
    (0, swagger_1.ApiOperation)({ summary: 'One page of rows from a table' }),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.DbRowsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRows", null);
__decorate([
    (0, common_1.Post)('db/tables/:table/rows'),
    (0, swagger_1.ApiOperation)({ summary: 'Insert a row (writable tables only)' }),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.DbInsertRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "insertRow", null);
__decorate([
    (0, common_1.Patch)('db/tables/:table/rows'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a row by primary key (writable tables only)',
    }),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.DbUpdateRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRow", null);
__decorate([
    (0, common_1.Delete)('db/tables/:table/rows'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a row by primary key (writable tables only)',
    }),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.DbDeleteRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRow", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_overview_service_1.AdminOverviewService,
        app_logs_service_1.AppLogsService,
        audit_log_service_1.AuditLogService,
        api_catalogue_service_1.ApiCatalogueService,
        db_browser_service_1.DbBrowserService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map