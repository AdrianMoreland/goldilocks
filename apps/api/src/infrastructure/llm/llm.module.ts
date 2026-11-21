import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnthropicLlmClient } from './anthropic-llm.client';
import { LLM_PROVIDER, type LlmPort } from './llm.port';
import { OpenAiLlmClient } from './openai-llm.client';

export type LlmProvider = 'anthropic' | 'openai';

/**
 * The vendor, from AI_PROVIDER: "anthropic" or "openai" (kept as a rollback).
 * When it is unset, a server that only has an OpenAI key keeps using OpenAI,
 * so deploying this before the variables are changed breaks nothing; with no
 * key at all it is Anthropic. Any other value is a configuration error.
 */
export function resolveLlmProvider(config: ConfigService): LlmProvider {
    const raw = (config.get<string>('AI_PROVIDER') ?? '').trim().toLowerCase();
    if (raw === 'anthropic' || raw === 'openai') return raw;
    if (raw) {
        throw new Error(
            `AI_PROVIDER must be "anthropic" or "openai", not "${raw}".`,
        );
    }
    return config.get<string>('OPENAI_API_KEY') &&
        !config.get<string>('ANTHROPIC_API_KEY')
        ? 'openai'
        : 'anthropic';
}

/** The key each provider needs, for the startup check. */
export const LLM_PROVIDER_KEY: Record<LlmProvider, string> = {
    anthropic: 'ANTHROPIC_API_KEY',
    openai: 'OPENAI_API_KEY',
};

/**
 * A model name that plainly belongs to the other vendor (gpt-* sent to
 * Anthropic, claude-* sent to OpenAI) - a leftover AI_MODEL after a switch.
 * Returns the problem, or null.
 */
export function llmModelMismatch(config: ConfigService): string | null {
    const model = (config.get<string>('AI_MODEL') ?? '').trim().toLowerCase();
    if (!model) return null;
    const provider = resolveLlmProvider(config);
    if (provider === 'anthropic' && !model.startsWith('claude')) {
        return `AI_MODEL "${model}" is not a Claude model, but AI_PROVIDER is anthropic.`;
    }
    if (provider === 'openai' && model.startsWith('claude')) {
        return `AI_MODEL "${model}" is a Claude model, but AI_PROVIDER is openai.`;
    }
    return null;
}

export function createLlmClient(config: ConfigService): LlmPort {
    return resolveLlmProvider(config) === 'openai'
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
