"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const common_1 = require("@nestjs/common");
const review_controller_1 = require("./review.controller");
const review_service_1 = require("./review.service");
const bc_sales_products_service_1 = require("./bc-sales-products.service");
const product_names_service_1 = require("./product-names.service");
const product_relink_service_1 = require("./product-relink.service");
const link_rules_service_1 = require("./link-rules.service");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const audit_log_module_1 = require("../audit-log/audit-log.module");
let ReviewModule = class ReviewModule {
};
exports.ReviewModule = ReviewModule;
exports.ReviewModule = ReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, prisma_module_1.PrismaModule, audit_log_module_1.AuditLogModule],
        controllers: [review_controller_1.ReviewController],
        providers: [
            review_service_1.ReviewService,
            link_rules_service_1.LinkRulesService,
            bc_sales_products_service_1.BcSalesProductsService,
            product_names_service_1.ProductNamesService,
            product_relink_service_1.ProductRelinkService,
        ],
        exports: [link_rules_service_1.LinkRulesService, product_names_service_1.ProductNamesService],
    })
], ReviewModule);
//# sourceMappingURL=review.module.js.map