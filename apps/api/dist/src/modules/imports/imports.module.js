"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportsModule = void 0;
const common_1 = require("@nestjs/common");
const imports_controller_1 = require("./imports.controller");
const bc_history_import_service_1 = require("./bc-history-import.service");
const item_trace_service_1 = require("./item-trace.service");
const shipped_not_collected_service_1 = require("./shipped-not-collected.service");
const bc_awaiting_import_service_1 = require("./bc-awaiting-import.service");
const workbook_import_service_1 = require("./workbook-import.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const audit_log_module_1 = require("../audit-log/audit-log.module");
const customer_orders_module_1 = require("../customer-orders/customer-orders.module");
const review_module_1 = require("../review/review.module");
let ImportsModule = class ImportsModule {
};
exports.ImportsModule = ImportsModule;
exports.ImportsModule = ImportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            audit_log_module_1.AuditLogModule,
            review_module_1.ReviewModule,
            customer_orders_module_1.CustomerOrdersModule,
        ],
        controllers: [
            imports_controller_1.ImportsController,
            imports_controller_1.BcAwaitingController,
            imports_controller_1.BcHistoryController,
            imports_controller_1.ItemTraceController,
        ],
        providers: [
            workbook_import_service_1.WorkbookImportService,
            bc_awaiting_import_service_1.BcAwaitingImportService,
            bc_history_import_service_1.BcHistoryImportService,
            item_trace_service_1.ItemTraceService,
            shipped_not_collected_service_1.ShippedNotCollectedService,
        ],
    })
], ImportsModule);
//# sourceMappingURL=imports.module.js.map