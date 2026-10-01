import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { type LlmPort, type LlmRequest, type LlmResult, type LlmStreamEvent } from './llm.port';
export declare const DEFAULT_AI_MODEL = "gpt-4o-mini";
export declare class OpenAiLlmClient implements LlmPort {
    private readonly config;
    private readonly logger;
    private client;
    constructor(config: ConfigService);
    get model(): string;
    generate(request: LlmRequest): Promise<LlmResult>;
    stream(request: LlmRequest): AsyncGenerator<LlmStreamEvent>;
    private body;
    protected createClient(apiKey: string): OpenAI;
    private getClient;
    private rootCause;
    private translate;
}
//# sourceMappingURL=openai-llm.client.d.ts.map