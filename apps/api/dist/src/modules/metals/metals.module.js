"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalsModule = void 0;
const common_1 = require("@nestjs/common");
const metals_controller_1 = require("./metals.controller");
const metals_provider_1 = require("./metals.provider");
const metals_cron_1 = require("./metals.cron");
const auth_module_1 = require("../auth/auth.module");
const redis_module_1 = require("../../redis/redis.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const metal_price_api_module_1 = require("../../infrastructure/metal-price-api/metal-price-api.module");
const spot_price_cache_store_1 = require("./spot-price-cache.store");
const cascade_metrics_service_1 = require("./cascade-metrics.service");
const fetch_attempt_service_1 = require("./fetch-attempt.service");
const historic_spot_service_1 = require("./historic-spot.service");
const spot_price_retention_service_1 = require("./spot-price-retention.service");
let MetalsModule = class MetalsModule {
};
exports.MetalsModule = MetalsModule;
exports.MetalsModule = MetalsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            redis_module_1.RedisModule,
            prisma_module_1.PrismaModule,
            metal_price_api_module_1.MetalPriceApiModule,
        ],
        controllers: [metals_controller_1.MetalsController],
        providers: [
            metals_provider_1.MetalsProvider,
            historic_spot_service_1.HistoricSpotService,
            metals_cron_1.MetalsCron,
            spot_price_cache_store_1.SpotPriceCacheStore,
            cascade_metrics_service_1.CascadeMetricsService,
            fetch_attempt_service_1.FetchAttemptService,
            spot_price_retention_service_1.SpotPriceRetentionService,
        ],
        exports: [
            metals_provider_1.MetalsProvider,
            historic_spot_service_1.HistoricSpotService,
            fetch_attempt_service_1.FetchAttemptService,
        ],
    })
], MetalsModule);
//# sourceMappingURL=metals.module.js.map