"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocktakeModule = void 0;
const common_1 = require("@nestjs/common");
const stocktake_controller_1 = require("./stocktake.controller");
const stocktake_service_1 = require("./stocktake.service");
const stocktake_physical_controller_1 = require("./stocktake-physical.controller");
const stocktake_physical_service_1 = require("./stocktake-physical.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const audit_log_module_1 = require("../audit-log/audit-log.module");
let StocktakeModule = class StocktakeModule {
};
exports.StocktakeModule = StocktakeModule;
exports.StocktakeModule = StocktakeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            audit_log_module_1.AuditLogModule,
        ],
        controllers: [stocktake_controller_1.StocktakeController, stocktake_physical_controller_1.StocktakePhysicalController],
        providers: [stocktake_service_1.StocktakeService, stocktake_physical_service_1.StocktakePhysicalService],
    })
], StocktakeModule);
//# sourceMappingURL=stocktake.module.js.map