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
var AnthropicLlmClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicLlmClient = exports.DEFAULT_ANTHROPIC_MODEL = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const llm_port_1 = require("./llm.port");
exports.DEFAULT_ANTHROPIC_MODEL = 'claude-haiku-5-5';
const REQUEST_TIMEOUT_MS = 60_000;
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];
const DEFAULT_EFFORT = 'low';
const TLS_INTERCEPTION_CODES = new Set([
    'SELF_SIGNED_CERT_IN_CHAIN',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
]);
const toUsage = (usage) => {
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
let AnthropicLlmClient = AnthropicLlmClient_1 = class AnthropicLlmClient {
    config;
    logger = new common_1.Logger(AnthropicLlmClient_1.name);
    client = null;
    constructor(config) {
        this.config = config;
    }
    get model() {
        return this.config.get('AI_MODEL') || exports.DEFAULT_ANTHROPIC_MODEL;
    }
    get effort() {
        const configured = this.config.get('AI_EFFORT');
        return EFFORTS.find((level) => level === configured) ?? DEFAULT_EFFORT;
    }
    async generate(request) {
        const client = this.getClient();
        let message;
        try {
            message = await client.messages.create(this.body(request), {
                signal: request.signal,
            });
        }
        catch (error) {
            throw this.translate(error);
        }
        return this.toResult(message);
    }
    async *stream(request) {
        const client = this.getClient();
        let message;
        try {
            const stream = client.messages.stream(this.body(request), {
                signal: request.signal,
            });
            for await (const event of stream) {
                if (event.type === 'content_block_delta' &&
                    event.delta.type === 'text_delta' &&
                    event.delta.text) {
                    yield { type: 'delta', text: event.delta.text };
                }
            }
            message = await stream.finalMessage();
        }
        catch (error) {
            throw this.translate(error);
        }
        yield { type: 'done', result: this.toResult(message) };
    }
    toResult(message) {
        const usage = toUsage(message.usage);
        const billed = { usage, model: message.model };
        if (message.stop_reason === 'refusal') {
            throw new llm_port_1.LlmError('rejected', `The model declined to answer this request${message.stop_details?.category ? ` (${message.stop_details.category})` : ''}.`, billed);
        }
        const truncated = message.stop_reason === 'max_tokens';
        let text = '';
        const toolCalls = [];
        for (const block of message.content) {
            if (block.type === 'text')
                text += block.text;
            else if (block.type === 'tool_use') {
                toolCalls.push({
                    id: block.id,
                    name: block.name,
                    arguments: JSON.stringify(block.input ?? {}),
                });
            }
        }
        if (truncated && toolCalls.length > 0) {
            throw new llm_port_1.LlmError('unavailable', 'The model ran out of output allowance while asking for a lookup.', billed);
        }
        text = text.trim();
        if (!text && toolCalls.length === 0) {
            throw new llm_port_1.LlmError('unavailable', truncated
                ? 'The model used its whole output allowance before answering.'
                : 'The model returned an empty answer.', billed);
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
    body(request) {
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
                        input_schema: tool.parameters,
                    })),
                    tool_choice: request.toolChoice === 'none'
                        ? { type: 'none' }
                        : { type: 'auto' },
                }
                : {}),
        };
    }
    messages(request) {
        const messages = [
            { role: 'user', content: request.user },
        ];
        let results = [];
        const flush = () => {
            if (results.length === 0)
                return;
            messages.push({ role: 'user', content: results });
            results = [];
        };
        for (const turn of request.turns ?? []) {
            if (turn.role === 'assistant') {
                flush();
                messages.push({
                    role: 'assistant',
                    content: Array.isArray(turn.replay)
                        ? turn.replay
                        : this.rebuild(turn.content, turn.toolCalls),
                });
            }
            else {
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
    rebuild(content, toolCalls) {
        const blocks = [];
        if (content)
            blocks.push({ type: 'text', text: content });
        for (const call of toolCalls) {
            let input = {};
            try {
                input = JSON.parse(call.arguments || '{}');
            }
            catch {
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
    createClient(apiKey) {
        return new sdk_1.default({
            apiKey,
            timeout: REQUEST_TIMEOUT_MS,
            maxRetries: 3,
        });
    }
    getClient() {
        if (this.client)
            return this.client;
        const apiKey = this.config.get('ANTHROPIC_API_KEY');
        if (!apiKey) {
            throw new llm_port_1.LlmError('misconfigured', 'ANTHROPIC_API_KEY is not set.');
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
        const status = error instanceof sdk_1.default.APIError
            ? error.status
            : undefined;
        const rootCause = this.rootCause(error);
        const detail = (error instanceof Error ? error.message : String(error)) +
            (rootCause ? ` [${rootCause}]` : '') +
            (rootCause && TLS_INTERCEPTION_CODES.has(rootCause)
                ? ' - something on this machine or network is re-signing HTTPS traffic (antivirus HTTPS scanning or a proxy). Trust its root certificate with NODE_EXTRA_CA_CERTS, or exclude api.anthropic.com from scanning. Never disable certificate checks: that exposes the API key.'
                : '');
        this.logger.warn(`Anthropic call failed (status ${typeof status === 'number' ? status : 'none'}): ${detail}`);
        const fail = (kind, message) => new llm_port_1.LlmError(kind, message, { cause: error });
        if (error instanceof sdk_1.default.APIError &&
            (status === 402 ||
                error.type === 'billing_error' ||
                /credit balance/i.test(error.apiMessage ?? error.message))) {
            return fail('out_of_credit', 'The Anthropic account has no credit left or has reached its spending limit.');
        }
        if (error instanceof sdk_1.default.AuthenticationError ||
            error instanceof sdk_1.default.PermissionDeniedError) {
            return fail('misconfigured', 'The Anthropic key was not accepted.');
        }
        if (error instanceof sdk_1.default.NotFoundError) {
            return fail('misconfigured', `The model "${this.model}" is not available to this key.`);
        }
        if (error instanceof sdk_1.default.RateLimitError) {
            return fail('rate_limited', 'Anthropic is rate limiting requests.');
        }
        if (error instanceof sdk_1.default.APIConnectionError ||
            error instanceof sdk_1.default.APIUserAbortError ||
            (typeof status === 'number' && (status >= 500 || status === 408))) {
            return fail('unavailable', 'Anthropic could not be reached.');
        }
        if (typeof status === 'number' && status >= 400 && status < 500) {
            return fail('rejected', 'Anthropic rejected the request.');
        }
        return fail('unavailable', 'Anthropic could not be reached.');
    }
};
exports.AnthropicLlmClient = AnthropicLlmClient;
exports.AnthropicLlmClient = AnthropicLlmClient = AnthropicLlmClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AnthropicLlmClient);
//# sourceMappingURL=anthropic-llm.client.js.map