import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { type LlmPort, type LlmRequest, type LlmResult, type LlmStreamEvent } from './llm.port';
export declare const DEFAULT_ANTHROPIC_MODEL = "claude-haiku-5-5";
export declare class AnthropicLlmClient implements LlmPort {
    private readonly config;
    private readonly logger;
    private client;
    constructor(config: ConfigService);
    get model(): string;
    private get effort();
    generate(request: LlmRequest): Promise<LlmResult>;
    stream(request: LlmRequest): AsyncGenerator<LlmStreamEvent>;
    private toResult;
    private body;
    private messages;
    private rebuild;
    protected createClient(apiKey: string): Anthropic;
    private getClient;
    private rootCause;
    private translate;
}
//# sourceMappingURL=anthropic-llm.client.d.ts.map