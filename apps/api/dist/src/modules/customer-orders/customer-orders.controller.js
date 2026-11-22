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
exports.CustomerOrdersController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_types_1 = require("@goldilocks/shared-types");
const customer_orders_service_1 = require("./customer-orders.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let CustomerOrdersController = class CustomerOrdersController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(status, locationCode) {
        const parsed = shared_types_1.CustomerOrderStatusEnum.safeParse(status);
        return this.service.list({
            status: parsed.success ? parsed.data : undefined,
            locationCode: locationCode || undefined,
        });
    }
    expectedStock() {
        return this.service.expectedStock();
    }
    previewImport(body) {
        return this.service.previewImport(body);
    }
    importSheet(body, req) {
        return this.service.importSheet(body, req.user.email);
    }
    create(body, req) {
        return this.service.create(body, req.user.email);
    }
    update(id, body, req) {
        return this.service.update(id, body, req.user.email);
    }
    addEvidence(id, body, req) {
        return this.service.addEvidence(id, body, req.user.email);
    }
};
exports.CustomerOrdersController = CustomerOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List customer order items, optionally by status or branch',
    }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('locationCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('expected-stock'),
    (0, swagger_1.ApiOperation)({
        summary: 'Items that should physically be in each branch for customers',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "expectedStock", null);
__decorate([
    (0, common_1.Post)('import/preview'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'What a paste from the Customer Orders sheet would add and update (writes nothing)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ImportCustomerOrdersRequestDto]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "previewImport", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Paste rows from the Customer Orders sheet: adds new rows, updates changed ones',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ImportCustomerOrdersRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "importSheet", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a customer order item' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateCustomerOrderRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Change status or details' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.UpdateCustomerOrderRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/evidence'),
    (0, swagger_1.ApiOperation)({
        summary: 'Log where a collection claim came from (append-only)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.AddEvidenceRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "addEvidence", null);
exports.CustomerOrdersController = CustomerOrdersController = __decorate([
    (0, swagger_1.ApiTags)('customer-orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customer-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.customer-orders'),
    __metadata("design:paramtypes", [customer_orders_service_1.CustomerOrdersService])
], CustomerOrdersController);
//# sourceMappingURL=customer-orders.controller.js.map