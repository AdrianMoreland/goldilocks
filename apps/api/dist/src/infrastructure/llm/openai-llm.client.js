"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OpenAiLlmClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiLlmClient = exports.DEFAULT_AI_MODEL = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
const llm_port_1 = require("./llm.port");
exports.DEFAULT_AI_MODEL = 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 30_000;
const TLS_INTERCEPTION_CODES = new Set([
    'SELF_SIGNED_CERT_IN_CHAIN',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
]);
const toUsage = (usage) => ({
    inputTokens: usage?.prompt_tokens ?? 0,
    cachedInputTokens: usage?.prompt_tokens_details?.cached_tokens ?? 0,
    outputTokens: usage?.completion_tokens ?? 0,
});
let OpenAiLlmClient = OpenAiLlmClient_1 = class OpenAiLlmClient {
    config;
    logger = new common_1.Logger(OpenAiLlmClient_1.name);
    client = null;
    constructor(config) {
        this.config = config;
    }
    get model() {
        return this.config.get('AI_MODEL') || exports.DEFAULT_AI_MODEL;
    }
    async generate(request) {
        const client = this.getClient();
        try {
            const completion = await client.chat.completions.create(this.body(request), { signal: request.signal });
            const choice = completion.choices[0];
            if (choice?.finish_reason === 'content_filter') {
                throw new llm_port_1.LlmError('rejected', 'The model declined to answer this request.');
            }
            const toolCalls = [];
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
                throw new llm_port_1.LlmError('unavailable', 'The model returned an empty answer.');
            }
            return {
                text,
                ...(toolCalls.length > 0 ? { toolCalls } : {}),
                model: completion.model,
                usage: toUsage(completion.usage),
                truncated: choice?.finish_reason === 'length',
            };
        }
        catch (error) {
            throw this.translate(error);
        }
    }
    async *stream(request) {
        const client = this.getClient();
        let text = '';
        let model = this.model;
        let finishReason = null;
        let usage;
        const pending = new Map();
        try {
            const chunks = await client.chat.completions.create({
                ...this.body(request),
                stream: true,
                stream_options: { include_usage: true },
            }, { signal: request.signal });
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
                    if (fragment.id)
                        call.id = fragment.id;
                    if (fragment.function?.name)
                        call.name += fragment.function.name;
                    if (fragment.function?.arguments)
                        call.arguments += fragment.function.arguments;
                    pending.set(fragment.index, call);
                }
                if (choice?.finish_reason)
                    finishReason = choice.finish_reason;
                if (chunk.usage)
                    usage = chunk.usage;
            }
        }
        catch (error) {
            throw this.translate(error);
        }
        if (finishReason === 'content_filter') {
            throw new llm_port_1.LlmError('rejected', 'The model declined to answer this request.');
        }
        const toolCalls = [...pending.entries()]
            .sort(([a], [b]) => a - b)
            .map(([, call]) => call);
        if (!text.trim() && toolCalls.length === 0) {
            throw new llm_port_1.LlmError('unavailable', 'The model returned an empty answer.');
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
    body(request) {
        const configuredTemperature = this.config.get('AI_TEMPERATURE');
        const temperature = configuredTemperature
            ? Number(configuredTemperature)
            : Number.NaN;
        const messages = [
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
                        type: 'function',
                        function: {
                            name: call.name,
                            arguments: call.arguments,
                        },
                    })),
                });
            }
            else {
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
                        type: 'function',
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
    createClient(apiKey) {
        return new openai_1.default({
            apiKey,
            timeout: REQUEST_TIMEOUT_MS,
            maxRetries: 3,
        });
    }
    getClient() {
        if (this.client)
            return this.client;
        const apiKey = this.config.get('OPENAI_API_KEY');
        if (!apiKey) {
            throw new llm_port_1.LlmError('misconfigured', 'OPENAI_API_KEY is not set.');
        }
        this.client = this.createClient(apiKey);
        return this.client;
    }
    rootCause(error) {
        let current = error;
        let found;
        for (let depth = 0; depth < 6 && current instanceof Error; depth++) {
            const code = current.code;
            if (typeof code === 'string')
                found = code;
            current = current.cause;
        }
        return found;
    }
    translate(error) {
        if (error instanceof llm_port_1.LlmError)
            return error;
        const status = typeof error === 'object' && error !== null
            ? error.status
            : undefined;
        const rootCause = this.rootCause(error);
        const detail = (error instanceof Error ? error.message : String(error)) +
            (rootCause ? ` [${rootCause}]` : '') +
            (rootCause && TLS_INTERCEPTION_CODES.has(rootCause)
                ? ' — something on this machine or network is re-signing HTTPS traffic (antivirus HTTPS scanning or a proxy). Trust its root certificate with NODE_EXTRA_CA_CERTS, or exclude api.openai.com from scanning. Never disable certificate checks: that exposes the API key.'
                : '');
        this.logger.warn(`OpenAI call failed (status ${typeof status === 'number' ? status : 'none'}): ${detail}`);
        if (status === 401 || status === 403) {
            return new llm_port_1.LlmError('misconfigured', 'The OpenAI key was not accepted.', { cause: error });
        }
        if (status === 404) {
            return new llm_port_1.LlmError('misconfigured', `The model "${this.model}" is not available to this key.`, { cause: error });
        }
        const code = typeof error === 'object' && error !== null
            ? error.code
            : undefined;
        if (status === 429 && code === 'insufficient_quota') {
            return new llm_port_1.LlmError('out_of_credit', 'The OpenAI account has no credit left or has reached its spending limit.', { cause: error });
        }
        if (status === 429) {
            return new llm_port_1.LlmError('rate_limited', 'OpenAI is rate limiting requests.', { cause: error });
        }
        if (typeof status === 'number' && status >= 400 && status < 500) {
            return new llm_port_1.LlmError('rejected', 'OpenAI rejected the request.', {
                cause: error,
            });
        }
        return new llm_port_1.LlmError('unavailable', 'OpenAI could not be reached.', {
            cause: error,
        });
    }
};
exports.OpenAiLlmClient = OpenAiLlmClient;
exports.OpenAiLlmClient = OpenAiLlmClient = OpenAiLlmClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAiLlmClient);
//# sourceMappingURL=openai-llm.client.js.map