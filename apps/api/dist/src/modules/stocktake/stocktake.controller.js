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
exports.StocktakeController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stocktake_service_1 = require("./stocktake.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let StocktakeController = class StocktakeController {
    service;
    constructor(service) {
        this.service = service;
    }
    list() {
        return this.service.list();
    }
    listBcItems() {
        return this.service.listBcItems();
    }
    async linkBcItem(itemNo, body, req) {
        await this.service.linkBcItem(itemNo, body.productId, req.user.email);
    }
    create(body, req) {
        return this.service.create(body, req.user.email);
    }
    get(id) {
        return this.service.get(id);
    }
    update(id, body, req) {
        return this.service.update(id, body, req.user.email);
    }
    finalise(id, req) {
        return this.service.finalise(id, req.user.email);
    }
    importJournal(id, body, req) {
        return this.service.importJournal(id, body.text, req.user.email);
    }
    updateLine(id, lineId, body) {
        return this.service.updateLine(id, lineId, body);
    }
    addDiscrepancy(id, body, req) {
        return this.service.addDiscrepancy(id, body, req.user.email);
    }
    updateDiscrepancy(id, discrepancyId, body) {
        return this.service.updateDiscrepancy(id, discrepancyId, body);
    }
    async deleteDiscrepancy(id, discrepancyId) {
        await this.service.deleteDiscrepancy(id, discrepancyId);
    }
};
exports.StocktakeController = StocktakeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List stocktakes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('bc-items'),
    (0, swagger_1.ApiOperation)({
        summary: 'BC item codes seen so far, with their product link',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "listBcItems", null);
__decorate([
    (0, common_1.Put)('bc-items/:itemNo/product'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({
        summary: 'Link (or unlink with null) a BC item to a Goldilocks product',
    }),
    __param(0, (0, common_1.Param)('itemNo')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.LinkBcItemRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "linkBcItem", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start a stocktake' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateStocktakeRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'One stocktake with its lines and discrepancies' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update status, people or notes' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.UpdateStocktakeRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/finalise'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Lock the count. Does not adjust Business Central.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "finalise", null);
__decorate([
    (0, common_1.Post)(':id/import-journal'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Add Physical Inventory Journal lines pasted from Excel (repeat-safe)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.ImportJournalRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "importJournal", null);
__decorate([
    (0, common_1.Patch)(':id/lines/:lineId'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a count for one line' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('lineId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dtos_1.UpdateStocktakeLineRequestDto]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "updateLine", null);
__decorate([
    (0, common_1.Post)(':id/discrepancies'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a discrepancy to the register' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.CreateDiscrepancyRequestDto, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "addDiscrepancy", null);
__decorate([
    (0, common_1.Patch)(':id/discrepancies/:discrepancyId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a discrepancy; resolved is set separately from the explanation',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('discrepancyId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dtos_1.UpdateDiscrepancyRequestDto]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "updateDiscrepancy", null);
__decorate([
    (0, common_1.Delete)(':id/discrepancies/:discrepancyId'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a discrepancy entered by mistake' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('discrepancyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "deleteDiscrepancy", null);
exports.StocktakeController = StocktakeController = __decorate([
    (0, swagger_1.ApiTags)('stocktake'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('stocktake'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.stocktake'),
    __metadata("design:paramtypes", [stocktake_service_1.StocktakeService])
], StocktakeController);
//# sourceMappingURL=stocktake.controller.js.map