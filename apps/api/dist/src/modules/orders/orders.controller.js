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
exports.HandoverController = exports.SheetTasksController = exports.OrdersController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_types_1 = require("@goldilocks/shared-types");
const orders_service_1 = require("./orders.service");
const sheet_tasks_service_1 = require("./sheet-tasks.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let OrdersController = class OrdersController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(query) {
        const parsed = shared_types_1.OrderListQuerySchema.safeParse(query);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid order filter');
        return this.service.list(parsed.data);
    }
    get(id) {
        return this.service.get(id);
    }
    step(id, step, body, req) {
        const parsed = shared_types_1.OrderStepEnum.safeParse(step);
        if (!parsed.success)
            throw new common_1.BadRequestException('Unknown step');
        return this.service.recordStep(id, parsed.data, body, req.user.email);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Orders with their lifecycle, next action and queue counts',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'One order with its steps and sheet tasks' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':id/steps/:step'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Record a step. Creates the sheet tasks that go with it',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('step')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, dtos_1.RecordStepRequestDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "step", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
let SheetTasksController = class SheetTasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(query) {
        const parsed = shared_types_1.SheetTaskListQuerySchema.safeParse(query);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid filter');
        return this.service.list(parsed.data);
    }
    reconcile(req) {
        return this.service.reconcile(req.user.email);
    }
    done(id, req) {
        return this.service.complete(id, req.user.email);
    }
};
exports.SheetTasksController = SheetTasksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sheet tasks, open first' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SheetTasksController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('reconcile'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Close tasks that the imported trades now show as done',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SheetTasksController.prototype, "reconcile", null);
__decorate([
    (0, common_1.Post)(':id/done'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Tick a task as done in the sheet' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SheetTasksController.prototype, "done", null);
exports.SheetTasksController = SheetTasksController = __decorate([
    (0, swagger_1.ApiTags)('sheet-tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('sheet-tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.orders'),
    __metadata("design:paramtypes", [sheet_tasks_service_1.SheetTasksService])
], SheetTasksController);
let HandoverController = class HandoverController {
    service;
    constructor(service) {
        this.service = service;
    }
    async latest() {
        return { handover: await this.service.latestHandover() };
    }
    save(body, req) {
        return this.service.saveHandover(body.note, req.user.email);
    }
};
exports.HandoverController = HandoverController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'The latest handover note' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HandoverController.prototype, "latest", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Save the handover note and close the day' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SaveHandoverRequestDto, Object]),
    __metadata("design:returntype", Promise)
], HandoverController.prototype, "save", null);
exports.HandoverController = HandoverController = __decorate([
    (0, swagger_1.ApiTags)('handover'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('handover'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.orders'),
    __metadata("design:paramtypes", [sheet_tasks_service_1.SheetTasksService])
], HandoverController);
//# sourceMappingURL=orders.controller.js.map