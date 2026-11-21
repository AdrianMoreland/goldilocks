import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
    LlmError,
    type LlmPort,
    type LlmRequest,
    type LlmResult,
    type LlmStreamEvent,
    type LlmToolCall,
    type LlmUsage,
} from './llm.port';

export const DEFAULT_ANTHROPIC_MODEL = 'claude-haiku-5-5';
/** Thinking makes a call slower than a plain completion, so the timeout is generous. */
const REQUEST_TIMEOUT_MS = 60_000;

type Effort = NonNullable<Anthropic.OutputConfig['effort']>;
const EFFORTS: readonly Effort[] = ['low', 'medium', 'high', 'xhigh', 'max'];
const DEFAULT_EFFORT: Effort = 'low';

/** Certificate errors that mean something between this machine and the vendor is presenting its own certificate. */
const TLS_INTERCEPTION_CODES = new Set([
    'SELF_SIGNED_CERT_IN_CHAIN',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
]);

/**
 * The vendor reports uncached input, cache reads and cache writes separately;
 * LlmUsage.inputTokens is their sum, with the other two as parts of it.
 */
const toUsage = (usage: Anthropic.Usage | undefined): LlmUsage => {
    const uncached = usage?.input_tokens ?? 0;
    const read = usage?.cache_read_input_tokens ?? 0;
    const written = usage?.cache_creation_input_tokens ?? 0;
    return {
        inputTokens: uncached + read + written,
        cachedInputTokens: read,
        cacheWriteInputTokens: written,
        outputTokens: usage?.output_tokens ?? 0,
    };
};

/**
 * Anthropic (Claude) implementation of LlmPort - the only file in the app
 * that imports the Anthropic SDK. Model, key and reasoning effort come from
 * configuration (AI_MODEL, ANTHROPIC_API_KEY, AI_EFFORT).
 *
 * - No temperature is ever sent: current Claude models reject sampling
 *   settings, so AI_TEMPERATURE is ignored here.
 * - Thinking is on by default for these models; AI_EFFORT sets how much.
 *   Thinking counts against the output cap, so AiSettings gives generous caps.
 * - The system prompt (rules and SOPs) carries a cache breakpoint, so the
 *   tools and system prompt are read from the prompt cache on later calls.
 * - The model's reply is kept whole in LlmResult.replay and sent back
 *   unchanged after a tool round: its reasoning blocks must be returned as
 *   they were, and the earlier part of the request must not change.
 *
 * The SDK client is created on first use, not at startup: the API must boot
 * (and its tests must run) with the assistant switched off and no key present.
 */
@Injectable()
export class AnthropicLlmClient implements LlmPort {
    private readonly logger = new Logger(AnthropicLlmClient.name);
    private client: Anthropic | null = null;

    constructor(private readonly config: ConfigService) {}

    get model(): string {
        return this.config.get<string>('AI_MODEL') || DEFAULT_ANTHROPIC_MODEL;
    }

    private get effort(): Effort {
        const configured = this.config.get<string>('AI_EFFORT');
        return EFFORTS.find((level) => level === configured) ?? DEFAULT_EFFORT;
    }

    async generate(request: LlmRequest): Promise<LlmResult> {
        const client = this.getClient();
        let message: Anthropic.Message;
        try {
            message = await client.messages.create(this.body(request), {
                signal: request.signal,
            });
        } catch (error) {
            throw this.translate(error);
        }
        return this.toResult(message);
    }

    /** Same request as generate(), but the answer text arrives piece by piece; the final event is built from the SDK's assembled message. */
    async *stream(request: LlmRequest): AsyncGenerator<LlmStreamEvent> {
        const client = this.getClient();
        let message: Anthropic.Message;
        try {
            const stream = client.messages.stream(this.body(request), {
                signal: request.signal,
            });
            for await (const event of stream) {
                if (
                    event.type === 'content_block_delta' &&
                    event.delta.type === 'text_delta' &&
                    event.delta.text
                ) {
                    yield { type: 'delta', text: event.delta.text };
                }
            }
            message = await stream.finalMessage();
        } catch (error) {
            throw this.translate(error);
        }
        yield { type: 'done', result: this.toResult(message) };
    }

    /** One finished reply → LlmResult. Tool inputs come from the assembled message, never from hand-joined fragments. */
    private toResult(message: Anthropic.Message): LlmResult {
        const usage = toUsage(message.usage);
        const billed = { usage, model: message.model };
        if (message.stop_reason === 'refusal') {
            throw new LlmError(
                'rejected',
                `The model declined to answer this request${message.stop_details?.category ? ` (${message.stop_details.category})` : ''}.`,
                billed,
            );
        }

        const truncated = message.stop_reason === 'max_tokens';
        let text = '';
        const toolCalls: LlmToolCall[] = [];
        for (const block of message.content) {
            if (block.type === 'text') text += block.text;
            else if (block.type === 'tool_use') {
                toolCalls.push({
                    id: block.id,
                    name: block.name,
                    arguments: JSON.stringify(block.input ?? {}),
                });
            }
        }
        // A tool call cut off by the output cap may carry half its input: never run it, and never pass off
        // the sentence before it ("Let me check the prices...") as the answer.
        if (truncated && toolCalls.length > 0) {
            throw new LlmError(
                'unavailable',
                'The model ran out of output allowance while asking for a lookup.',
                billed,
            );
        }

        text = text.trim();
        if (!text && toolCalls.length === 0) {
            throw new LlmError(
                'unavailable',
                truncated
                    ? 'The model used its whole output allowance before answering.'
                    : 'The model returned an empty answer.',
                billed,
            );
        }

        return {
            text,
            ...(toolCalls.length > 0 ? { toolCalls } : {}),
            model: message.model,
            usage,
            truncated,
            replay: message.content,
        };
    }

    /** The request body both calls share. Order matters for caching: tools, then system (with the breakpoint), then messages. */
    private body(
        request: LlmRequest,
    ): Anthropic.MessageCreateParamsNonStreaming {
        return {
            model: this.model,
            max_tokens: request.maxOutputTokens,
            system: [
                {
                    type: 'text',
                    text: request.system,
                    cache_control: { type: 'ephemeral' },
                },
            ],
            messages: this.messages(request),
            output_config: { effort: this.effort },
            ...(request.tools?.length
                ? {
                      tools: request.tools.map((tool) => ({
                          name: tool.name,
                          description: tool.description,
                          input_schema:
                              tool.parameters as Anthropic.Tool.InputSchema,
                      })),
                      tool_choice:
                          request.toolChoice === 'none'
                              ? { type: 'none' as const }
                              : { type: 'auto' as const },
                  }
                : {}),
        };
    }

    /**
     * The user's message, then each tool round: the model's reply exactly as
     * it came back, then every result of that round in one user message.
     */
    private messages(request: LlmRequest): Anthropic.MessageParam[] {
        const messages: Anthropic.MessageParam[] = [
            { role: 'user', content: request.user },
        ];
        let results: Anthropic.ToolResultBlockParam[] = [];
        const flush = () => {
            if (results.length === 0) return;
            messages.push({ role: 'user', content: results });
            results = [];
        };

        for (const turn of request.turns ?? []) {
            if (turn.role === 'assistant') {
                flush();
                messages.push({
                    role: 'assistant',
                    content: Array.isArray(turn.replay)
                        ? (turn.replay as Anthropic.ContentBlockParam[])
                        : this.rebuild(turn.content, turn.toolCalls),
                });
            } else {
                results.push({
                    type: 'tool_result',
                    tool_use_id: turn.toolCallId,
                    content: turn.content,
                });
            }
        }
        flush();
        return messages;
    }

    /** Only for a turn that has no replay (not produced by this adapter): its text and tool calls as blocks. */
    private rebuild(
        content: string,
        toolCalls: LlmToolCall[],
    ): Anthropic.ContentBlockParam[] {
        const blocks: Anthropic.ContentBlockParam[] = [];
        if (content) blocks.push({ type: 'text', text: content });
        for (const call of toolCalls) {
            let input: unknown = {};
            try {
                input = JSON.parse(call.arguments || '{}');
            } catch {
                // Leave the input empty; the tool already answered with an error for it.
            }
            blocks.push({
                type: 'tool_use',
                id: call.id,
                name: call.name,
                input,
            });
        }
        return blocks;
    }

    /** Overridable so tests can supply a fake SDK client without a network or a key. */
    protected createClient(apiKey: string): Anthropic {
        return new Anthropic({
            apiKey,
            timeout: REQUEST_TIMEOUT_MS,
            // The SDK retries connection errors, 408/409/429 and 5xx (including "overloaded") with backoff.
            maxRetries: 3,
        });
    }

    private getClient(): Anthropic {
        if (this.client) return this.client;

        const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
        if (!apiKey) {
            throw new LlmError(
                'misconfigured',
                'ANTHROPIC_API_KEY is not set.',
            );
        }
        this.client = this.createClient(apiKey);
        return this.client;
    }

    /** The deepest error code in a chain of causes - the real reason behind "Connection error". */
    private rootCause(error: unknown): string | undefined {
        let current: unknown = error;
        let found: string | undefined;
        for (let depth = 0; depth < 6 && current instanceof Error; depth++) {
            const code = (current as { code?: unknown }).code;
            if (typeof code === 'string') found = code;
            current = current.cause;
        }
        return found;
    }

    /** Vendor errors → LlmError. The raw SDK error is kept as `cause` for the log, never shown to a user. */
    private translate(error: unknown): LlmError {
        if (error instanceof LlmError) return error;

        const status: number | undefined =
            error instanceof Anthropic.APIError
                ? (error.status as number | undefined)
                : undefined;
        const rootCause = this.rootCause(error);
        const detail =
            (error instanceof Error ? error.message : String(error)) +
            (rootCause ? ` [${rootCause}]` : '') +
            (rootCause && TLS_INTERCEPTION_CODES.has(rootCause)
                ? ' - something on this machine or network is re-signing HTTPS traffic (antivirus HTTPS scanning or a proxy). Trust its root certificate with NODE_EXTRA_CA_CERTS, or exclude api.anthropic.com from scanning. Never disable certificate checks: that exposes the API key.'
                : '');
        this.logger.warn(
            `Anthropic call failed (status ${typeof status === 'number' ? status : 'none'}): ${detail}`,
        );

        const fail = (kind: LlmError['kind'], message: string) =>
            new LlmError(kind, message, { cause: error });

        if (
            error instanceof Anthropic.APIError &&
            (status === 402 ||
                error.type === 'billing_error' ||
                /credit balance/i.test(error.apiMessage ?? error.message))
        ) {
            return fail(
                'out_of_credit',
                'The Anthropic account has no credit left or has reached its spending limit.',
            );
        }
        if (
            error instanceof Anthropic.AuthenticationError ||
            error instanceof Anthropic.PermissionDeniedError
        ) {
            return fail('misconfigured', 'The Anthropic key was not accepted.');
        }
        if (error instanceof Anthropic.NotFoundError) {
            return fail(
                'misconfigured',
                `The model "${this.model}" is not available to this key.`,
            );
        }
        if (error instanceof Anthropic.RateLimitError) {
            return fail('rate_limited', 'Anthropic is rate limiting requests.');
        }
        if (
            error instanceof Anthropic.APIConnectionError ||
            error instanceof Anthropic.APIUserAbortError ||
            (typeof status === 'number' && (status >= 500 || status === 408))
        ) {
            return fail('unavailable', 'Anthropic could not be reached.');
        }
        if (typeof status === 'number' && status >= 400 && status < 500) {
            return fail('rejected', 'Anthropic rejected the request.');
        }
        return fail('unavailable', 'Anthropic could not be reached.');
    }
}
