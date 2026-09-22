"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const products_module_1 = require("./modules/products/products.module");
const config_1 = require("@nestjs/config");
const metals_module_1 = require("./modules/metals/metals.module");
const core_1 = require("@nestjs/core");
const nestjs_zod_1 = require("nestjs-zod");
const market_data_module_1 = require("./modules/market-data/market-data.module");
const metal_price_api_module_1 = require("./infrastructure/metal-price-api/metal-price-api.module");
const trade_module_1 = require("./modules/trade/trade.module");
const portfolio_module_1 = require("./modules/portfolio/portfolio.module");
const branches_module_1 = require("./modules/branches/branches.module");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            metal_price_api_module_1.MetalPriceApiModule,
            metals_module_1.MetalsModule,
            products_module_1.ProductsModule,
            market_data_module_1.MarketDataModule,
            trade_module_1.TradeModule,
            portfolio_module_1.PortfolioModule,
            branches_module_1.BranchesModule,
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_PIPE, useClass: nestjs_zod_1.ZodValidationPipe },
            { provide: core_1.APP_INTERCEPTOR, useClass: nestjs_zod_1.ZodSerializerInterceptor },
            { provide: core_1.APP_FILTER, useClass: prisma_exception_filter_1.PrismaExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map