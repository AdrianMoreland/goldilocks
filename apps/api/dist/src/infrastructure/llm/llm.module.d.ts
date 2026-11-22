import { ConfigService } from '@nestjs/config';
import { type LlmPort } from './llm.port';
export type LlmProvider = 'anthropic' | 'openai';
export declare function resolveLlmProvider(config: ConfigService): LlmProvider;
export declare const LLM_PROVIDER_KEY: Record<LlmProvider, string>;
export declare function llmModelMismatch(config: ConfigService): string | null;
export declare function createLlmClient(config: ConfigService): LlmPort;
export declare class LlmModule {
}
//# sourceMappingURL=llm.module.d.ts.map