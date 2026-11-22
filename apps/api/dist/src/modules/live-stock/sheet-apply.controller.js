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
exports.SheetApplyController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sheet_apply_service_1 = require("./sheet-apply.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let SheetApplyController = class SheetApplyController {
    service;
    constructor(service) {
        this.service = service;
    }
    preview(req) {
        return this.service.preview(req.user);
    }
    apply(req) {
        return this.service.apply(req.user);
    }
    pending(req) {
        return this.service.pending(req.user);
    }
    resolve(req, id, body) {
        return this.service.resolve(req.user, id, body);
    }
};
exports.SheetApplyController = SheetApplyController;
__decorate([
    (0, common_1.Get)('preview'),
    (0, permission_decorator_1.RequiresPermission)('page.import'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: what applying the sheet would change' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SheetApplyController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('apply'),
    (0, permission_decorator_1.RequiresPermission)('page.import'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: apply the clear rows, park the rest' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SheetApplyController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Rows waiting for a decision' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SheetApplyController.prototype, "pending", null);
__decorate([
    (0, common_1.Post)('applications/:id/resolve'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Settle a waiting row' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.ResolveSheetApplicationRequestDto]),
    __metadata("design:returntype", Promise)
], SheetApplyController.prototype, "resolve", null);
exports.SheetApplyController = SheetApplyController = __decorate([
    (0, swagger_1.ApiTags)('live-stock'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('live-stock/sheet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [sheet_apply_service_1.SheetApplyService])
], SheetApplyController);
//# sourceMappingURL=sheet-apply.controller.js.map