import type { AiMode, AiStatus, AskResponse, RecalculateOverrides } from '@goldilocks/shared-types';
import { type LlmPort } from '../../infrastructure/llm/llm.port';
import { AiSettings } from './ai.settings';
import { AnswerCacheService } from './answer-cache.service';
import { QuestionLogService } from './question-log.service';
import { QuotaService } from './quota.service';
import { type SopContextProvider } from './sop-context.provider';
import { ToolRegistry } from './tools/tool.registry';
export interface Actor {
    id: string;
    email: string;
}
export interface AskInput {
    question: string;
    mode: AiMode;
    spotOverrides?: RecalculateOverrides;
}
export type AskEvent = {
    type: 'delta';
    text: string;
} | {
    type: 'tool';
    name: string;
} | {
    type: 'done';
    response: AskResponse;
};
export declare class AskService {
    private readonly llm;
    private readonly context;
    private readonly settings;
    private readonly quota;
    private readonly cache;
    private readonly questionLog;
    private readonly tools;
    private readonly logger;
    constructor(llm: LlmPort, context: SopContextProvider, settings: AiSettings, quota: QuotaService, cache: AnswerCacheService, questionLog: QuestionLogService, tools: ToolRegistry);
    status(): AiStatus;
    ask(input: AskInput, actor: Actor, signal?: AbortSignal): Promise<AskResponse>;
    askStream(input: AskInput, actor: Actor, signal?: AbortSignal): AsyncGenerator<AskEvent>;
    private assertUnderBudget;
    private logFailure;
    private toHttpError;
}
//# sourceMappingURL=ask.service.d.ts.map