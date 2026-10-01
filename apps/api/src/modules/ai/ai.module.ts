import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from '../../infrastructure/llm/llm.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { AiController } from './ai.controller';
import { AiRetentionService } from './ai-retention.service';
import { AiSettings } from './ai.settings';
import { AnswerCacheService } from './answer-cache.service';
import { AskService } from './ask.service';
import { QuestionLogService } from './question-log.service';
import { QuotaService } from './quota.service';
import { FullCorpusContext, SOP_CONTEXT } from './sop-context.provider';
import { AI_TOOLS } from './tools/ai-tool.port';
import { FindProductPricesTool } from './tools/find-product-prices.tool';
import { GetSpotTool } from './tools/get-spot.tool';
import { ToolRegistry } from './tools/tool.registry';

/**
 * The internal AI assistant (roadmap 1.5; plan in docs/AI-AGENT-PLAN.md).
 * Depends on Knowledge (to read approved SOPs) and on the LLM port; nothing
 * depends on it. Owns the ai_question_logs and ai_answer_cache tables and the
 * per-user limits; the price/branch tools join here in phase 3.
 */
@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard
        ConfigModule,
        KnowledgeModule,
        LlmModule,
        MarketDataModule,
        PrismaModule,
        RedisModule,
    ],
    controllers: [AiController],
    providers: [
        AskService,
        AiSettings,
        QuotaService,
        AnswerCacheService,
        QuestionLogService,
        AiRetentionService,
        GetSpotTool,
        FindProductPricesTool,
        // One entry per tool: adding a tool is writing its class and listing it here.
        {
            provide: AI_TOOLS,
            useFactory: (spot: GetSpotTool, prices: FindProductPricesTool) => [
                spot,
                prices,
            ],
            inject: [GetSpotTool, FindProductPricesTool],
        },
        ToolRegistry,
        { provide: SOP_CONTEXT, useClass: FullCorpusContext },
    ],
})
export class AiModule {}
