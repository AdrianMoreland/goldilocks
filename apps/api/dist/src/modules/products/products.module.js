"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const products_provider_1 = require("./products.provider");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const redis_module_1 = require("../../redis/redis.module");
const product_cache_store_1 = require("./product-cache.store");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
        ],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService, products_provider_1.ProductsProvider, product_cache_store_1.ProductCacheStore],
        exports: [
            products_service_1.ProductsService,
            products_provider_1.ProductsProvider,
        ],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map