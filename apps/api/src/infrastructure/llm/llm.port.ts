/**
 * Everything the AI feature needs from "whatever language model we use",
 * boiled down to one call. AskService depends on this interface and the
 * LLM_PROVIDER token, never on a vendor SDK, so changing model vendor means
 * writing one new class and changing one binding in llm.module.ts - the same
 * shape as AUTH_PROVIDER and METAL_PRICE_API (docs/ENGINEERING.md §15).
 *
 * A tool is a read-only lookup the model may ask for (a price, a spot). The
 * model never runs it: it replies with a tool call, the application runs it
 * and sends the result back as a follow-up turn, and the model then answers.
 */

/** One lookup the model is allowed to ask for. `parameters` is a JSON Schema object. */
export interface LlmToolSpec {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}

/** The model asking for a lookup. `arguments` is the raw JSON text it wrote - untrusted until validated. */
export interface LlmToolCall {
    id: string;
    name: string;
    arguments: string;
}

/** What happened after the user's message in a tool round: the model's request, then the application's result. */
export type LlmTurn =
    | {
          role: 'assistant';
          content: string;
          toolCalls: LlmToolCall[];
          /** The adapter's own record of that reply (LlmResult.replay), passed back unchanged. */
          replay?: unknown;
      }
    | { role: 'tool'; toolCallId: string; content: string };

export interface LlmRequest {
    /** Rules and reference material. Kept identical between calls so the vendor's prompt cache can reuse it. */
    system: string;
    /** The user's question. Always last, because everything before it must match exactly for caching. */
    user: string;
    maxOutputTokens: number;
    /** Lookups the model may ask for. Part of the cacheable prefix, so keep it identical between calls. */
    tools?: LlmToolSpec[];
    /**
     * 'none' keeps the tools declared but stops the model calling them, so a
     * last round can force an answer without changing the cacheable prefix.
     * Defaults to 'auto'.
     */
    toolChoice?: 'auto' | 'none';
    /** The tool rounds so far, in order, continuing from the user message. */
    turns?: LlmTurn[];
    /** Aborting stops the upstream call, so a cancelled answer stops costing tokens. */
    signal?: AbortSignal;
}

export interface LlmUsage {
    inputTokens: number;
    /** Part of inputTokens served from the vendor's prompt cache (billed at a fraction). */
    cachedInputTokens: number;
    /** Part of inputTokens written to the vendor's prompt cache (some vendors bill this above the normal input rate). */
    cacheWriteInputTokens?: number;
    outputTokens: number;
}

export interface LlmResult {
    /** Empty when the model replied with tool calls instead of an answer. */
    text: string;
    /** Lookups the model asked for instead of (or before) answering. */
    toolCalls?: LlmToolCall[];
    /** The model that actually answered, as reported by the vendor. */
    model: string;
    usage: LlmUsage;
    /** The answer hit the output limit and was cut off. */
    truncated: boolean;
    /**
     * Vendor-specific content the adapter needs back, unchanged, when this
     * reply is continued after a tool round (for example the model's
     * reasoning blocks). Opaque to everything above the adapter.
     */
    replay?: unknown;
}

/** What stream() yields: pieces of text as they arrive, then one final event with the whole answer and its usage. */
export type LlmStreamEvent =
    | { type: 'delta'; text: string }
    | { type: 'done'; result: LlmResult };

/**
 * Why a call failed, in terms the application can act on - vendor errors are
 * translated to these at the adapter so nothing above it parses SDK errors.
 *  unavailable   - network problem, timeout or vendor 5xx; worth trying again later
 *  rate_limited  - too many requests; slow down and retry
 *  out_of_credit - the account has no credit or has hit its spending limit; a person must top it up
 *  misconfigured - missing/invalid key or an unknown model; a person must fix it
 *  rejected      - the vendor refused this particular request
 */
export type LlmFailureKind =
    | 'unavailable'
    | 'rate_limited'
    | 'out_of_credit'
    | 'misconfigured'
    | 'rejected';

export class LlmError extends Error {
    /** Tokens the failed call still used and was billed for (a refusal after output began, say); counted towards the daily budget. */
    readonly usage?: LlmUsage;
    /** The model that used them. */
    readonly model?: string;

    constructor(
        readonly kind: LlmFailureKind,
        message: string,
        options?: { cause?: unknown; usage?: LlmUsage; model?: string },
    ) {
        super(message, { cause: options?.cause });
        this.name = 'LlmError';
        this.usage = options?.usage;
        this.model = options?.model;
    }
}

export interface LlmPort {
    /** The model calls are made with - shown in the admin UI and recorded with every answer. */
    readonly model: string;
    generate(request: LlmRequest): Promise<LlmResult>;
    /** Like generate(), but yields the text as it is written so a screen can show it early. Failures throw LlmError, as generate() does. */
    stream(request: LlmRequest): AsyncIterable<LlmStreamEvent>;
}

export const LLM_PROVIDER = Symbol('LLM_PROVIDER');
