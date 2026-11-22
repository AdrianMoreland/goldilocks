"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveStockModule = void 0;
const common_1 = require("@nestjs/common");
const live_stock_controller_1 = require("./live-stock.controller");
const live_stock_service_1 = require("./live-stock.service");
const sheet_apply_controller_1 = require("./sheet-apply.controller");
const sheet_apply_service_1 = require("./sheet-apply.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const audit_log_module_1 = require("../audit-log/audit-log.module");
let LiveStockModule = class LiveStockModule {
};
exports.LiveStockModule = LiveStockModule;
exports.LiveStockModule = LiveStockModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, prisma_module_1.PrismaModule, audit_log_module_1.AuditLogModule],
        controllers: [live_stock_controller_1.LiveStockController, sheet_apply_controller_1.SheetApplyController],
        providers: [live_stock_service_1.LiveStockService, sheet_apply_service_1.SheetApplyService],
    })
], LiveStockModule);
//# sourceMappingURL=live-stock.module.js.map