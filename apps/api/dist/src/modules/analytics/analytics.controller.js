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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const capability_decorator_1 = require("../../common/decorators/capability.decorator");
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const dtos_1 = require("../../common/dto/dtos");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    analytics;
    constructor(analytics) {
        this.analytics = analytics;
    }
    spot({ preset }) {
        return this.analytics.pricing(preset);
    }
    sales({ preset }) {
        return this.analytics.sales(preset);
    }
    orders({ preset }) {
        return this.analytics.orders(preset);
    }
    inventory({ preset }) {
        return this.analytics.inventory(preset);
    }
    customers({ preset }) {
        return this.analytics.customers(preset);
    }
    ai({ preset }) {
        return this.analytics.chatbot(preset);
    }
    ops({ preset }) {
        return this.analytics.ops(preset);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('spot'),
    (0, permission_decorator_1.RequiresPermission)('analytics.pricing'),
    (0, swagger_1.ApiOperation)({ summary: 'Pricing tab: spot, premiums, market modes' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "spot", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, permission_decorator_1.RequiresPermission)('analytics.sales'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sales & margin tab: profit, margin, products, branches',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "sales", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, permission_decorator_1.RequiresPermission)('analytics.orders'),
    (0, swagger_1.ApiOperation)({
        summary: 'Orders tab: conversion, step times, waiting orders',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "orders", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, permission_decorator_1.RequiresPermission)('analytics.inventory'),
    (0, swagger_1.ApiOperation)({
        summary: 'Inventory tab: pieces by branch, low lines, movements',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "inventory", null);
__decorate([
    (0, common_1.Get)('customers'),
    (0, permission_decorator_1.RequiresPermission)('analytics.customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Customers & invoices tab' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "customers", null);
__decorate([
    (0, common_1.Get)('ai'),
    (0, permission_decorator_1.RequiresPermission)('analytics.chatbot'),
    (0, swagger_1.ApiOperation)({
        summary: 'Chatbot tab: questions, outcomes, cost, feedback',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "ai", null);
__decorate([
    (0, common_1.Get)('ops'),
    (0, permission_decorator_1.RequiresPermission)('analytics.ops'),
    (0, swagger_1.ApiOperation)({ summary: 'Ops tab: price feed and imports' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "ops", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, capability_decorator_1.RequiresCapability)('pricingWorkbook'),
    (0, permission_decorator_1.RequiresPermission)('page.analytics'),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map