import type { ConfigService } from '@nestjs/config';
import { AnthropicLlmClient } from './anthropic-llm.client';
import {
    createLlmClient,
    llmModelMismatch,
    resolveLlmProvider,
} from './llm.module';
import { OpenAiLlmClient } from './openai-llm.client';

const config = (settings: Record<string, string | undefined>) =>
    ({ get: (key: string) => settings[key] }) as unknown as ConfigService;

describe('resolveLlmProvider / createLlmClient', () => {
    it('uses the provider AI_PROVIDER names, in any case', () => {
        expect(
            createLlmClient(config({ AI_PROVIDER: ' OpenAI ' })),
        ).toBeInstanceOf(OpenAiLlmClient);
        expect(
            createLlmClient(
                config({ AI_PROVIDER: 'anthropic', OPENAI_API_KEY: 'sk' }),
            ),
        ).toBeInstanceOf(AnthropicLlmClient);
    });

    it('keeps a server that only has an OpenAI key on OpenAI when AI_PROVIDER is unset, so a deploy breaks nothing', () => {
        expect(resolveLlmProvider(config({ OPENAI_API_KEY: 'sk' }))).toBe(
            'openai',
        );
    });

    it('uses Anthropic when AI_PROVIDER is unset and there is an Anthropic key, or no key at all', () => {
        expect(
            resolveLlmProvider(
                config({ OPENAI_API_KEY: 'sk', ANTHROPIC_API_KEY: 'k' }),
            ),
        ).toBe('anthropic');
        expect(resolveLlmProvider(config({}))).toBe('anthropic');
    });

    it('refuses a value it does not know rather than guessing', () => {
        expect(() =>
            resolveLlmProvider(config({ AI_PROVIDER: 'open-ai' })),
        ).toThrow(/must be "anthropic" or "openai"/);
    });

    it('needs no key to be built, so the API boots with the assistant off', () => {
        expect(() =>
            createLlmClient(config({ AI_PROVIDER: 'anthropic' })),
        ).not.toThrow();
    });
});

describe('llmModelMismatch', () => {
    it('flags a model left over from the other vendor', () => {
        expect(
            llmModelMismatch(
                config({ AI_PROVIDER: 'anthropic', AI_MODEL: 'gpt-4o-mini' }),
            ),
        ).toMatch(/not a Claude model/);
        expect(
            llmModelMismatch(
                config({ AI_PROVIDER: 'openai', AI_MODEL: 'claude-haiku-5-5' }),
            ),
        ).toMatch(/is a Claude model/);
    });

    it('accepts a matching model, or none (the default is used)', () => {
        expect(
            llmModelMismatch(
                config({
                    AI_PROVIDER: 'anthropic',
                    AI_MODEL: 'claude-haiku-5-5',
                }),
            ),
        ).toBeNull();
        expect(llmModelMismatch(config({ AI_PROVIDER: 'openai' }))).toBeNull();
    });
});
