import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
    LlmError,
    type LlmPort,
    type LlmRequest,
    type LlmResult,
    type LlmStreamEvent,
    type LlmToolCall,
} from './llm.port';

export const DEFAULT_AI_MODEL = 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 30_000;

/** Certificate errors that mean something between this machine and OpenAI is presenting its own certificate. */
const TLS_INTERCEPTION_CODES = new Set([
    'SELF_SIGNED_CERT_IN_CHAIN',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
]);

type Usage =
    | {
          prompt_tokens?: number;
          completion_tokens?: number;
          prompt_tokens_details?: { cached_tokens?: number } | null;
      }
    | null
    | undefined;

const toUsage = (usage: Usage) => ({
    inputTokens: usage?.prompt_tokens ?? 0,
    cachedInputTokens: usage?.prompt_tokens_details?.cached_tokens ?? 0,
    outputTokens: usage?.completion_tokens ?? 0,
});

/**
 * OpenAI implementation of LlmPort — the only file in the app that imports the
 * OpenAI SDK. Uses Chat Completions, with the model, key and optional
 * temperature taken from configuration (AI_MODEL, OPENAI_API_KEY,
 * AI_TEMPERATURE). Temperature is left unset unless configured, because some
 * models reject anything but their default.
 *
 * The SDK client is created on first use, not at startup: the API must boot
 * (and its tests must run) with the assistant switched off and no key present.
 */
@Injectable()
export class OpenAiLlmClient implements LlmPort {
    private readonly logger = new Logger(OpenAiLlmClient.name);
    private client: OpenAI | null = null;

    constructor(private readonly config: ConfigService) {}

    get model(): string {
        return this.config.get<string>('AI_MODEL') || DEFAULT_AI_MODEL;
    }

    async generate(request: LlmRequest): Promise<LlmResult> {
        const client = this.getClient();

        try {
            const completion = await client.chat.completions.create(
                this.body(request),
                { signal: request.signal },
            );

            const choice = completion.choices[0];
            if (choice?.finish_reason === 'content_filter') {
                throw new LlmError(
                    'rejected',
                    'The model declined to answer this request.',
                );
            }

            const toolCalls: LlmToolCall[] = [];
            for (const call of choice?.message?.tool_calls ?? []) {
                if (call.type === 'function') {
                    toolCalls.push({
                        id: call.id,
                        name: call.function.name,
                        arguments: call.function.arguments,
                    });
                }
            }

            const text = choice?.message?.content?.trim() ?? '';
            if (!text && toolCalls.length === 0) {
                throw new LlmError(
                    'unavailable',
                    'The model returned an empty answer.',
                );
            }

            return {
                text,
                ...(toolCalls.length > 0 ? { toolCalls } : {}),
                model: completion.model,
                usage: toUsage(completion.usage),
                truncated: choice?.finish_reason === 'length',
            };
        } catch (error) {
            throw this.translate(error);
        }
    }

    /**
     * Same request as generate(), but the text arrives piece by piece. The
     * final event carries the whole answer, any tool calls and the token usage
     * (requested with include_usage, which OpenAI sends in a last, choice-less
     * chunk).
     */
    async *stream(request: LlmRequest): AsyncGenerator<LlmStreamEvent> {
        const client = this.getClient();

        let text = '';
        let model = this.model;
        let finishReason: string | null = null;
        let usage: Usage;
        // A tool call arrives in fragments (name first, then the argument text in pieces), keyed by index.
        const pending = new Map<number, LlmToolCall>();

        try {
            const chunks = await client.chat.completions.create(
                {
                    ...this.body(request),
                    stream: true,
                    stream_options: { include_usage: true },
                },
                { signal: request.signal },
            );

            for await (const chunk of chunks) {
                model = chunk.model || model;
                const choice = chunk.choices[0];
                const piece = choice?.delta?.content;
                if (piece) {
                    text += piece;
                    yield { type: 'delta', text: piece };
                }
                for (const fragment of choice?.delta?.tool_calls ?? []) {
                    const call = pending.get(fragment.index) ?? {
                        id: '',
                        name: '',
                        arguments: '',
                    };
                    if (fragment.id) call.id = fragment.id;
                    if (fragment.function?.name)
                        call.name += fragment.function.name;
                    if (fragment.function?.arguments)
                        call.arguments += fragment.function.arguments;
                    pending.set(fragment.index, call);
                }
                if (choice?.finish_reason) finishReason = choice.finish_reason;
                if (chunk.usage) usage = chunk.usage;
            }
        } catch (error) {
            throw this.translate(error);
        }

        if (finishReason === 'content_filter') {
            throw new LlmError(
                'rejected',
                'The model declined to answer this request.',
            );
        }
        const toolCalls = [...pending.entries()]
            .sort(([a], [b]) => a - b)
            .map(([, call]) => call);
        if (!text.trim() && toolCalls.length === 0) {
            throw new LlmError(
                'unavailable',
                'The model returned an empty answer.',
            );
        }

        yield {
            type: 'done',
            result: {
                text: text.trim(),
                ...(toolCalls.length > 0 ? { toolCalls } : {}),
                model,
                usage: toUsage(usage),
                truncated: finishReason === 'length',
            },
        };
    }

    /** The request body both calls share: messages (system, user, then any tool rounds), tools, token cap, temperature. */
    private body(request: LlmRequest) {
        const configuredTemperature = this.config.get<string>('AI_TEMPERATURE');
        const temperature = configuredTemperature
            ? Number(configuredTemperature)
            : Number.NaN;

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: request.system },
            { role: 'user', content: request.user },
        ];
        for (const turn of request.turns ?? []) {
            if (turn.role === 'assistant') {
                messages.push({
                    role: 'assistant',
                    content: turn.content || null,
                    tool_calls: turn.toolCalls.map((call) => ({
                        id: call.id,
                        type: 'function' as const,
                        function: {
                            name: call.name,
                            arguments: call.arguments,
                        },
                    })),
                });
            } else {
                messages.push({
                    role: 'tool',
                    tool_call_id: turn.toolCallId,
                    content: turn.content,
                });
            }
        }

        return {
            model: this.model,
            messages,
            max_completion_tokens: request.maxOutputTokens,
            ...(request.tools?.length
                ? {
                      tools: request.tools.map((tool) => ({
                          type: 'function' as const,
                          function: {
                              name: tool.name,
                              description: tool.description,
                              parameters: tool.parameters,
                          },
                      })),
                  }
                : {}),
            ...(Number.isFinite(temperature) ? { temperature } : {}),
        };
    }

    /** Overridable so tests can supply a fake SDK client without a network or a key. */
    protected createClient(apiKey: string): OpenAI {
        return new OpenAI({
            apiKey,
            timeout: REQUEST_TIMEOUT_MS,
            // The SDK retries connection errors, 429s and 5xx with backoff; OpenAI drops the odd connection, so more than one retry.
            maxRetries: 3,
        });
    }

    private getClient(): OpenAI {
        if (this.client) return this.client;

        const apiKey = this.config.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            throw new LlmError('misconfigured', 'OPENAI_API_KEY is not set.');
        }
        this.client = this.createClient(apiKey);
        return this.client;
    }

    /** The deepest error code or message in a chain of causes — the real reason behind "fetch failed". */
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

        const status =
            typeof error === 'object' && error !== null
                ? (error as { status?: unknown }).status
                : undefined;
        const rootCause = this.rootCause(error);
        const detail =
            (error instanceof Error ? error.message : String(error)) +
            (rootCause ? ` [${rootCause}]` : '') +
            (rootCause && TLS_INTERCEPTION_CODES.has(rootCause)
                ? ' — something on this machine or network is re-signing HTTPS traffic (antivirus HTTPS scanning or a proxy). Trust its root certificate with NODE_EXTRA_CA_CERTS, or exclude api.openai.com from scanning. Never disable certificate checks: that exposes the API key.'
                : '');
        this.logger.warn(
            `OpenAI call failed (status ${typeof status === 'number' ? status : 'none'}): ${detail}`,
        );

        if (status === 401 || status === 403) {
            return new LlmError(
                'misconfigured',
                'The OpenAI key was not accepted.',
                { cause: error },
            );
        }
        if (status === 404) {
            return new LlmError(
                'misconfigured',
                `The model "${this.model}" is not available to this key.`,
                { cause: error },
            );
        }
        // OpenAI uses 429 both for "too fast" and for "no credit left"; only the error code tells them apart.
        const code =
            typeof error === 'object' && error !== null
                ? (error as { code?: unknown }).code
                : undefined;
        if (status === 429 && code === 'insufficient_quota') {
            return new LlmError(
                'out_of_credit',
                'The OpenAI account has no credit left or has reached its spending limit.',
                { cause: error },
            );
        }
        if (status === 429) {
            return new LlmError(
                'rate_limited',
                'OpenAI is rate limiting requests.',
                { cause: error },
            );
        }
        if (typeof status === 'number' && status >= 400 && status < 500) {
            return new LlmError('rejected', 'OpenAI rejected the request.', {
                cause: error,
            });
        }
        // 5xx, connection failures and timeouts carry no (or a 5xx) status.
        return new LlmError('unavailable', 'OpenAI could not be reached.', {
            cause: error,
        });
    }
}
