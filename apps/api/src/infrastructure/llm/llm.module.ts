import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LLM_PROVIDER } from './llm.port';
import { OpenAiLlmClient } from './openai-llm.client';

/**
 * Infrastructure module for the language-model vendor, alongside
 * PrismaModule/RedisModule/MetalPriceApiModule. Consumers depend on the
 * LLM_PROVIDER token (LlmPort), never on OpenAiLlmClient — swap vendors by
 * changing this one binding.
 */
@Module({
    imports: [ConfigModule],
    providers: [{ provide: LLM_PROVIDER, useClass: OpenAiLlmClient }],
    exports: [LLM_PROVIDER],
})
export class LlmModule {}
