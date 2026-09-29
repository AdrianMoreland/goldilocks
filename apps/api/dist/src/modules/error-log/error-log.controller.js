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
exports.ErrorLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
const error_log_service_1 = require("./error-log.service");
let ErrorLogController = class ErrorLogController {
    errorLog;
    constructor(errorLog) {
        this.errorLog = errorLog;
    }
    async getRecent(limit) {
        const n = Math.min(Math.max(Number(limit) || 100, 1), 500);
        return this.errorLog.getRecent(n);
    }
    async clear() {
        await this.errorLog.clear();
        return { message: 'Error log cleared' };
    }
    async reportClient(body, request) {
        await this.errorLog.recordClientReports(body.reports, request.user?.email ?? null, request.headers['user-agent'] ?? null);
        return { message: 'Reported' };
    }
};
exports.ErrorLogController = ErrorLogController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Recent server and reported client errors, newest first (admin)' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ErrorLogController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear the error log (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ErrorLogController.prototype, "clear", null);
__decorate([
    (0, common_1.Post)('client'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Report browser-side errors (any signed-in user)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ClientErrorReportBatchDto, Object]),
    __metadata("design:returntype", Promise)
], ErrorLogController.prototype, "reportClient", null);
exports.ErrorLogController = ErrorLogController = __decorate([
    (0, swagger_1.ApiTags)('errors'),
    (0, common_1.Controller)('errors'),
    __metadata("design:paramtypes", [error_log_service_1.ErrorLogService])
], ErrorLogController);
//# sourceMappingURL=error-log.controller.js.map