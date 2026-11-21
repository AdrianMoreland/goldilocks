import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnthropicLlmClient } from './anthropic-llm.client';
import { LLM_PROVIDER, type LlmPort } from './llm.port';
import { OpenAiLlmClient } from './openai-llm.client';

/** AI_PROVIDER picks the vendor: "anthropic" (the default) or "openai" (kept as a rollback). */
export function createLlmClient(config: ConfigService): LlmPort {
    const provider = (config.get<string>('AI_PROVIDER') || 'anthropic')
        .trim()
        .toLowerCase();
    return provider === 'openai'
        ? new OpenAiLlmClient(config)
        : new AnthropicLlmClient(config);
}

/**
 * Infrastructure module for the language-model vendor, alongside
 * PrismaModule/RedisModule/MetalPriceApiModule. Consumers depend on the
 * LLM_PROVIDER token (LlmPort), never on a vendor client - the vendor is
 * chosen here, from configuration.
 */
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: LLM_PROVIDER,
            useFactory: createLlmClient,
            inject: [ConfigService],
        },
    ],
    exports: [LLM_PROVIDER],
})
export class LlmModule {}
