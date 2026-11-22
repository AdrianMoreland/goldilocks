"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const nestjs_pino_1 = require("nestjs-pino");
const pino_1 = __importDefault(require("pino"));
const admin_module_1 = require("./modules/admin/admin.module");
const log_buffer_1 = require("./modules/admin/log-buffer");
const metals_module_1 = require("./modules/metals/metals.module");
const core_1 = require("@nestjs/core");
const nestjs_zod_1 = require("nestjs-zod");
const market_data_module_1 = require("./modules/market-data/market-data.module");
const metal_price_api_module_1 = require("./infrastructure/metal-price-api/metal-price-api.module");
const trade_module_1 = require("./modules/trade/trade.module");
const portfolio_module_1 = require("./modules/portfolio/portfolio.module");
const branches_module_1 = require("./modules/branches/branches.module");
const stocktake_module_1 = require("./modules/stocktake/stocktake.module");
const customer_orders_module_1 = require("./modules/customer-orders/customer-orders.module");
const tradesheet_import_module_1 = require("./modules/tradesheet-import/tradesheet-import.module");
const imports_module_1 = require("./modules/imports/imports.module");
const review_module_1 = require("./modules/review/review.module");
const customer_records_module_1 = require("./modules/customer-records/customer-records.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const live_stock_module_1 = require("./modules/live-stock/live-stock.module");
const orders_module_1 = require("./modules/orders/orders.module");
const market_mode_module_1 = require("./modules/market-mode/market-mode.module");
const roadmap_module_1 = require("./modules/roadmap/roadmap.module");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const redis_module_1 = require("./infrastructure/redis/redis.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const error_log_module_1 = require("./modules/error-log/error-log.module");
const knowledge_module_1 = require("./modules/knowledge/knowledge.module");
const ai_module_1 = require("./modules/ai/ai.module");
const capability_guard_1 = require("./common/guards/capability.guard");
const permission_guard_1 = require("./common/guards/permission.guard");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const people_module_1 = require("./modules/people/people.module");
const settings_module_1 = require("./modules/settings/settings.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const user_throttler_guard_1 = require("./common/guards/user-throttler.guard");
const throttler_1 = require("@nestjs/throttler");
function prettyStream() {
    const pretty = require('pino-pretty');
    return pretty({ colorize: true, singleLine: true, ignore: 'pid,hostname' });
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 300 }] }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            nestjs_pino_1.LoggerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const production = config.get('NODE_ENV') === 'production';
                    const stdout = production ? process.stdout : prettyStream();
                    return {
                        pinoHttp: {
                            level: config.get('LOG_LEVEL', 'info'),
                            stream: pino_1.default.multistream([
                                { stream: stdout },
                                { stream: log_buffer_1.logBuffer.stream },
                            ]),
                            redact: [
                                'req.headers.authorization',
                                'req.headers.cookie',
                            ],
                            serializers: {
                                req: (req) => ({
                                    method: req.method,
                                    url: req.url,
                                }),
                                res: (res) => ({
                                    statusCode: res.statusCode,
                                }),
                            },
                            autoLogging: {
                                ignore: (req) => req.url === '/health' ||
                                    (req.method === 'GET' &&
                                        !!req.url?.startsWith('/admin/')),
                            },
                        },
                    };
                },
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
            stocktake_module_1.StocktakeModule,
            customer_orders_module_1.CustomerOrdersModule,
            tradesheet_import_module_1.TradesheetImportModule,
            imports_module_1.ImportsModule,
            review_module_1.ReviewModule,
            customer_records_module_1.CustomerRecordsModule,
            inventory_module_1.InventoryModule,
            live_stock_module_1.LiveStockModule,
            orders_module_1.OrdersModule,
            market_mode_module_1.MarketModeModule,
            permissions_module_1.PermissionsModule,
            analytics_module_1.AnalyticsModule,
            people_module_1.PeopleModule,
            settings_module_1.SettingsModule,
            roadmap_module_1.RoadmapModule,
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            error_log_module_1.ErrorLogModule,
            knowledge_module_1.KnowledgeModule,
            ai_module_1.AiModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: capability_guard_1.CapabilityGuard },
            { provide: core_1.APP_GUARD, useClass: permission_guard_1.PermissionGuard },
            { provide: core_1.APP_GUARD, useClass: user_throttler_guard_1.UserThrottlerGuard },
            { provide: core_1.APP_PIPE, useClass: nestjs_zod_1.ZodValidationPipe },
            { provide: core_1.APP_INTERCEPTOR, useClass: nestjs_zod_1.ZodSerializerInterceptor },
            { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map