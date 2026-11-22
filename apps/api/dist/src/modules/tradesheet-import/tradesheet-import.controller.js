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
exports.TradesheetImportController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tradesheet_import_service_1 = require("./tradesheet-import.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let TradesheetImportController = class TradesheetImportController {
    service;
    constructor(service) {
        this.service = service;
    }
    preview(body) {
        return this.service.preview(body);
    }
    commit(body, req) {
        return this.service.commit(body, req.user.email);
    }
};
exports.TradesheetImportController = TradesheetImportController;
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'What importing this file would add, change or flag. Writes nothing.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.TradesheetImportRequestDto]),
    __metadata("design:returntype", Promise)
], TradesheetImportController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('commit'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Import this file. Reimporting a month updates its rows by reference.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.TradesheetImportRequestDto, Object]),
    __metadata("design:returntype", Promise)
], TradesheetImportController.prototype, "commit", null);
exports.TradesheetImportController = TradesheetImportController = __decorate([
    (0, swagger_1.ApiTags)('tradesheet-import'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tradesheet-import'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.tradesheets'),
    __metadata("design:paramtypes", [tradesheet_import_service_1.TradesheetImportService])
], TradesheetImportController);
//# sourceMappingURL=tradesheet-import.controller.js.map