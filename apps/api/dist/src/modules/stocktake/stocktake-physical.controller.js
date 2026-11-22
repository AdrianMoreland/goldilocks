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
exports.StocktakePhysicalController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stocktake_physical_service_1 = require("./stocktake-physical.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let StocktakePhysicalController = class StocktakePhysicalController {
    service;
    constructor(service) {
        this.service = service;
    }
    register(id) {
        return this.service.getRegister(id);
    }
    carryForward(id, body, req) {
        return this.service.carryForward(id, body.fromStocktakeId, req.user.email);
    }
    importBars(id, body, req) {
        return this.service.importBars(id, body.metal, body.text, req.user.email);
    }
    addBar(id, body) {
        return this.service.addBar(id, body);
    }
    updateBar(id, barId, body) {
        return this.service.updateBar(id, barId, body);
    }
    async deleteBar(id, barId) {
        await this.service.deleteBar(id, barId);
    }
    importCoins(id, body, req) {
        return this.service.importCoins(id, body.metal, body.text, req.user.email);
    }
    addCoin(id, body) {
        return this.service.addCoin(id, body);
    }
    updateCoin(id, coinId, body) {
        return this.service.updateCoin(id, coinId, body);
    }
};
exports.StocktakePhysicalController = StocktakePhysicalController;
__decorate([
    (0, common_1.Get)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Bars and coin counts for one stocktake' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('carry-forward'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Copy the last finalised closing position in as unconfirmed (repeat-safe)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.CarryForwardRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "carryForward", null);
__decorate([
    (0, common_1.Post)('bars/import'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Paste a bar list from the stock workbook (repeat-safe)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.ImportPhysicalRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "importBars", null);
__decorate([
    (0, common_1.Post)('bars'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a bar found on the shelf' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.AddBarRequestDto]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "addBar", null);
__decorate([
    (0, common_1.Patch)('bars/:barId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm a bar, mark it gone, or correct its details',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('barId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dtos_1.UpdateBarRequestDto]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "updateBar", null);
__decorate([
    (0, common_1.Delete)('bars/:barId'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a bar added by mistake' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('barId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "deleteBar", null);
__decorate([
    (0, common_1.Post)('coins/import'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Paste coin quantities as the previous position (repeat-safe)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.ImportPhysicalRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "importCoins", null);
__decorate([
    (0, common_1.Post)('coins'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a coin line' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.AddCoinRequestDto]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "addCoin", null);
__decorate([
    (0, common_1.Patch)('coins/:coinId'),
    (0, swagger_1.ApiOperation)({ summary: 'Record the counted quantity for a coin line' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('coinId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dtos_1.UpdateCoinRequestDto]),
    __metadata("design:returntype", Promise)
], StocktakePhysicalController.prototype, "updateCoin", null);
exports.StocktakePhysicalController = StocktakePhysicalController = __decorate([
    (0, swagger_1.ApiTags)('stocktake'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('stocktake/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.stocktake'),
    __metadata("design:paramtypes", [stocktake_physical_service_1.StocktakePhysicalService])
], StocktakePhysicalController);
//# sourceMappingURL=stocktake-physical.controller.js.map