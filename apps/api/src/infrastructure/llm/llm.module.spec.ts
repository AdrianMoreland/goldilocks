import type { ConfigService } from '@nestjs/config';
import { AnthropicLlmClient } from './anthropic-llm.client';
import { createLlmClient } from './llm.module';
import { OpenAiLlmClient } from './openai-llm.client';

const config = (settings: Record<string, string | undefined>) =>
    ({ get: (key: string) => settings[key] }) as unknown as ConfigService;

describe('createLlmClient', () => {
    it('uses Anthropic by default', () => {
        expect(createLlmClient(config({}))).toBeInstanceOf(AnthropicLlmClient);
    });

    it('uses OpenAI when AI_PROVIDER is openai, as a rollback', () => {
        expect(
            createLlmClient(config({ AI_PROVIDER: ' OpenAI ' })),
        ).toBeInstanceOf(OpenAiLlmClient);
    });

    it('needs no key to be built, so the API boots with the assistant off', () => {
        expect(() =>
            createLlmClient(config({ AI_PROVIDER: 'anthropic' })),
        ).not.toThrow();
    });
});
