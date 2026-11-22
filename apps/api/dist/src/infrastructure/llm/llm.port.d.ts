export interface LlmToolSpec {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
export interface LlmToolCall {
    id: string;
    name: string;
    arguments: string;
}
export type LlmTurn = {
    role: 'assistant';
    content: string;
    toolCalls: LlmToolCall[];
    replay?: unknown;
} | {
    role: 'tool';
    toolCallId: string;
    content: string;
};
export interface LlmRequest {
    system: string;
    user: string;
    maxOutputTokens: number;
    tools?: LlmToolSpec[];
    toolChoice?: 'auto' | 'none';
    turns?: LlmTurn[];
    signal?: AbortSignal;
}
export interface LlmUsage {
    inputTokens: number;
    cachedInputTokens: number;
    cacheWriteInputTokens?: number;
    outputTokens: number;
}
export interface LlmResult {
    text: string;
    toolCalls?: LlmToolCall[];
    model: string;
    usage: LlmUsage;
    truncated: boolean;
    replay?: unknown;
}
export type LlmStreamEvent = {
    type: 'delta';
    text: string;
} | {
    type: 'done';
    result: LlmResult;
};
export type LlmFailureKind = 'unavailable' | 'rate_limited' | 'out_of_credit' | 'misconfigured' | 'rejected';
export declare class LlmError extends Error {
    readonly kind: LlmFailureKind;
    readonly usage?: LlmUsage;
    readonly model?: string;
    constructor(kind: LlmFailureKind, message: string, options?: {
        cause?: unknown;
        usage?: LlmUsage;
        model?: string;
    });
}
export interface LlmPort {
    readonly model: string;
    generate(request: LlmRequest): Promise<LlmResult>;
    stream(request: LlmRequest): AsyncIterable<LlmStreamEvent>;
}
export declare const LLM_PROVIDER: unique symbol;
//# sourceMappingURL=llm.port.d.ts.map