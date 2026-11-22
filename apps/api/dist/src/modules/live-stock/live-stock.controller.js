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
exports.LiveStockController = void 0;
const capability_decorator_1 = require("../../common/decorators/capability.decorator");
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_types_1 = require("@goldilocks/shared-types");
const live_stock_service_1 = require("./live-stock.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let LiveStockController = class LiveStockController {
    service;
    constructor(service) {
        this.service = service;
    }
    branches(req) {
        return this.service.branches(req.user);
    }
    productLevels() {
        return this.service.productLevels();
    }
    board(req, query) {
        return this.service.board(req.user, shared_types_1.LiveStockBoardQuerySchema.parse(query));
    }
    history(id) {
        return this.service.history(id);
    }
    createLine(req, body) {
        return this.service.createLine(req.user, body);
    }
    adjust(req, id, body) {
        return this.service.adjust(req.user, id, body);
    }
    transfer(req, id, body) {
        return this.service.transfer(req.user, id, body);
    }
    async threshold(req, id, body) {
        await this.service.setThreshold(req.user, id, body.lowThreshold);
    }
    addBar(req, id, body) {
        return this.service.addBar(req.user, id, body);
    }
    barStatus(req, id, body) {
        return this.service.setBarStatus(req.user, id, body);
    }
    undo(req, id) {
        return this.service.undo(req.user, id);
    }
    link(req, code, body) {
        return this.service.linkBranch(req.user, code.toUpperCase(), body);
    }
    previewBaseline(req, body) {
        return this.service.previewBaseline(req.user, body);
    }
    commitBaseline(req, body) {
        return this.service.commitBaseline(req.user, body);
    }
};
exports.LiveStockController = LiveStockController;
__decorate([
    (0, common_1.Get)('branches'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Stock locations and which the caller may edit' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "branches", null);
__decorate([
    (0, common_1.Get)('product-levels'),
    (0, permission_decorator_1.RequiresPermission)('page.dashboard'),
    (0, capability_decorator_1.RequiresCapability)('pricingWorkbook'),
    (0, swagger_1.ApiOperation)({
        summary: 'Stock per priced product, for the dashboard flag',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "productLevels", null);
__decorate([
    (0, common_1.Get)('board'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Lines and serials for one branch and metal' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "board", null);
__decorate([
    (0, common_1.Get)('lines/:id/history'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Newest changes on a line, with their source' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "history", null);
__decorate([
    (0, common_1.Post)('lines'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a stock line (and an opening count)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateLiveStockLineRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "createLine", null);
__decorate([
    (0, common_1.Post)('lines/:id/adjust'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Change a count by a step or to a typed value' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.AdjustLiveStockRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "adjust", null);
__decorate([
    (0, common_1.Post)('lines/:id/transfer'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Move stock to another branch' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.TransferLiveStockRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "transfer", null);
__decorate([
    (0, common_1.Patch)('lines/:id/threshold'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Set or clear the low-stock threshold' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.LowThresholdRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "threshold", null);
__decorate([
    (0, common_1.Post)('lines/:id/bars'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a serialled bar to a bar line' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.AddLiveStockBarRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "addBar", null);
__decorate([
    (0, common_1.Post)('bars/:id/status'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a bar sold, removed or back in stock' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.SetLiveStockBarStatusRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "barStatus", null);
__decorate([
    (0, common_1.Post)('movements/:id/undo'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Undo a line's latest manual change" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "undo", null);
__decorate([
    (0, common_1.Put)('branches/:code/link'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: link a stock location to an app branch' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('code')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dtos_1.LinkLiveStockBranchRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "link", null);
__decorate([
    (0, common_1.Post)('baseline/preview'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: what loading the stock sheet would do' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.LiveBaselineRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "previewBaseline", null);
__decorate([
    (0, common_1.Post)('baseline'),
    (0, permission_decorator_1.RequiresPermission)('page.inventory'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: load the stock sheet as the baseline' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.LiveBaselineRequestDto]),
    __metadata("design:returntype", Promise)
], LiveStockController.prototype, "commitBaseline", null);
exports.LiveStockController = LiveStockController = __decorate([
    (0, swagger_1.ApiTags)('live-stock'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('live-stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [live_stock_service_1.LiveStockService])
], LiveStockController);
//# sourceMappingURL=live-stock.controller.js.map