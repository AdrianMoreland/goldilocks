"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const llm_module_1 = require("../../infrastructure/llm/llm.module");
const market_data_module_1 = require("../market-data/market-data.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const redis_module_1 = require("../../redis/redis.module");
const auth_module_1 = require("../auth/auth.module");
const knowledge_module_1 = require("../knowledge/knowledge.module");
const ai_controller_1 = require("./ai.controller");
const ai_retention_service_1 = require("./ai-retention.service");
const ai_settings_1 = require("./ai.settings");
const answer_cache_service_1 = require("./answer-cache.service");
const ask_service_1 = require("./ask.service");
const question_log_service_1 = require("./question-log.service");
const quota_service_1 = require("./quota.service");
const sop_context_provider_1 = require("./sop-context.provider");
const ai_tool_port_1 = require("./tools/ai-tool.port");
const find_product_prices_tool_1 = require("./tools/find-product-prices.tool");
const get_spot_tool_1 = require("./tools/get-spot.tool");
const tool_registry_1 = require("./tools/tool.registry");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            config_1.ConfigModule,
            knowledge_module_1.KnowledgeModule,
            llm_module_1.LlmModule,
            market_data_module_1.MarketDataModule,
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
        ],
        controllers: [ai_controller_1.AiController],
        providers: [
            ask_service_1.AskService,
            ai_settings_1.AiSettings,
            quota_service_1.QuotaService,
            answer_cache_service_1.AnswerCacheService,
            question_log_service_1.QuestionLogService,
            ai_retention_service_1.AiRetentionService,
            get_spot_tool_1.GetSpotTool,
            find_product_prices_tool_1.FindProductPricesTool,
            {
                provide: ai_tool_port_1.AI_TOOLS,
                useFactory: (spot, prices) => [
                    spot,
                    prices,
                ],
                inject: [get_spot_tool_1.GetSpotTool, find_product_prices_tool_1.FindProductPricesTool],
            },
            tool_registry_1.ToolRegistry,
            { provide: sop_context_provider_1.SOP_CONTEXT, useClass: sop_context_provider_1.FullCorpusContext },
        ],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map