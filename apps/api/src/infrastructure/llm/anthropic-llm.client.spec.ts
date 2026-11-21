import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicLlmClient } from './anthropic-llm.client';
import { LlmError, type LlmRequest } from './llm.port';

type Body = Record<string, unknown> & {
    messages: { role: string; content: unknown }[];
};

/** A reply as the SDK assembles it. */
const message = (overrides: Record<string, unknown> = {}) => ({
    id: 'msg_1',
    type: 'message',
    role: 'assistant',
    model: 'claude-haiku-5-5',
    content: [
        { type: 'thinking', thinking: '', signature: 'sig-1' },
        {
            type: 'text',
            text: '  The answer [[pricing#vat]].  ',
            citations: null,
        },
    ],
    stop_reason: 'end_turn',
    stop_details: null,
    usage: {
        input_tokens: 500,
        cache_read_input_tokens: 6000,
        cache_creation_input_tokens: 0,
        output_tokens: 300,
    },
    ...overrides,
});

/** A fake streamed reply: the text in pieces, then the assembled message. */
function fakeStream(
    reply: ReturnType<typeof message> | Error,
    pieces: string[],
) {
    return {
        async *[Symbol.asyncIterator]() {
            if (reply instanceof Error) throw reply;
            yield { type: 'content_block_start', index: 0 };
            for (const text of pieces) {
                yield {
                    type: 'content_block_delta',
                    index: 1,
                    delta: { type: 'text_delta', text },
                };
            }
        },
        finalMessage: async () => {
            if (reply instanceof Error) throw reply;
            return reply;
        },
    };
}

/** The real adapter, with the SDK client swapped for a fake: no network, no key, no cost. */
class TestableClient extends AnthropicLlmClient {
    created = 0;
    constructor(
        config: ConfigService,
        private readonly fake: { create: jest.Mock; stream: jest.Mock },
    ) {
        super(config);
    }
    protected override createClient(): Anthropic {
        this.created += 1;
        return { messages: this.fake } as unknown as Anthropic;
    }
}

function build(
    settings: Record<string, string | undefined> = {
        ANTHROPIC_API_KEY: 'test-key',
    },
    reply: ReturnType<typeof message> | Error = message(),
    pieces: string[] = ['The answer ', '[[pricing#vat]].'],
) {
    const create = jest.fn(async (_body: Body, _options: unknown) => {
        if (reply instanceof Error) throw reply;
        return reply;
    });
    const stream = jest.fn((_body: Body, _options: unknown) =>
        fakeStream(reply, pieces),
    );
    const config = {
        get: (key: string) => settings[key],
    } as unknown as ConfigService;
    return {
        client: new TestableClient(config, { create, stream }),
        create,
        stream,
    };
}

const request: LlmRequest = {
    system: 'RULES + SOPs',
    user: 'Do we charge VAT?',
    maxOutputTokens: 2000,
};

const tools = [
    {
        name: 'getSpot',
        description: 'Live spot',
        parameters: { type: 'object', properties: {} },
    },
];

async function collect(iterable: AsyncIterable<unknown>) {
    const events: unknown[] = [];
    for await (const event of iterable) events.push(event);
    return events;
}

const apiError = (
    Kind: new (...args: never[]) => Error,
    status: number,
    body: { type: string; message: string },
) =>
    new (Kind as unknown as new (
        status: number,
        error: object,
        message: string,
        headers: Headers,
        type?: string,
    ) => Error)(
        status,
        { type: 'error', error: body },
        body.message,
        new Headers(),
        body.type,
    );

beforeEach(
    () =>
        void jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined),
);
afterEach(() => jest.restoreAllMocks());

describe('AnthropicLlmClient.generate', () => {
    it('defaults to Claude Haiku 5.5, low effort, and sends no sampling settings', async () => {
        const { client, create } = build({
            ANTHROPIC_API_KEY: 'test-key',
            AI_TEMPERATURE: '0.2',
        });
        const signal = new AbortController().signal;

        await client.generate({ ...request, signal });

        const [body, options] = create.mock.calls[0];
        expect(body.model).toBe('claude-haiku-5-5');
        expect(body.max_tokens).toBe(2000);
        expect(body.output_config).toEqual({ effort: 'low' });
        expect(body).not.toHaveProperty('temperature');
        expect(body).not.toHaveProperty('top_p');
        expect(body).not.toHaveProperty('top_k');
        expect(body).not.toHaveProperty('thinking');
        expect(options).toEqual({ signal });
    });

    it('uses the configured model and effort, and ignores an effort it does not know', async () => {
        const configured = build({
            ANTHROPIC_API_KEY: 'k',
            AI_MODEL: 'claude-sonnet-5-5',
            AI_EFFORT: 'medium',
        });
        await configured.client.generate(request);
        expect(configured.create.mock.calls[0][0].model).toBe(
            'claude-sonnet-5-5',
        );
        expect(configured.create.mock.calls[0][0].output_config).toEqual({
            effort: 'medium',
        });

        const typo = build({ ANTHROPIC_API_KEY: 'k', AI_EFFORT: 'lowest' });
        await typo.client.generate(request);
        expect(typo.create.mock.calls[0][0].output_config).toEqual({
            effort: 'low',
        });
    });

    it('puts a cache breakpoint on the system prompt and the question in the user message', async () => {
        const { client, create } = build();

        await client.generate(request);

        const [body] = create.mock.calls[0];
        expect(body.system).toEqual([
            {
                type: 'text',
                text: 'RULES + SOPs',
                cache_control: { type: 'ephemeral' },
            },
        ]);
        expect(body.messages).toEqual([
            { role: 'user', content: 'Do we charge VAT?' },
        ]);
    });

    it('sends the same prefix twice, so a second identical-prefix call reads from the cache', async () => {
        const { client, create } = build();

        await client.generate({ ...request, tools });
        await client.generate({ ...request, user: 'Another question', tools });

        const [first] = create.mock.calls[0];
        const [second] = create.mock.calls[1];
        expect(second.system).toEqual(first.system);
        expect(second.tools).toEqual(first.tools);
        expect(second.output_config).toEqual(first.output_config);
    });

    it('returns the trimmed answer text, skipping reasoning blocks, with usage that counts cache reads and writes as input', async () => {
        const { client } = build(
            undefined,
            message({
                usage: {
                    input_tokens: 500,
                    cache_read_input_tokens: 6000,
                    cache_creation_input_tokens: 1500,
                    output_tokens: 300,
                },
            }),
        );

        const result = await client.generate(request);

        expect(result.text).toBe('The answer [[pricing#vat]].');
        expect(result.model).toBe('claude-haiku-5-5');
        expect(result.truncated).toBe(false);
        expect(result.usage).toEqual({
            inputTokens: 8000,
            cachedInputTokens: 6000,
            cacheWriteInputTokens: 1500,
            outputTokens: 300,
        });
    });

    it('flags an answer that hit the output limit', async () => {
        const { client } = build(
            undefined,
            message({ stop_reason: 'max_tokens' }),
        );

        expect((await client.generate(request)).truncated).toBe(true);
    });

    it('fails as unavailable when the output limit was used up before any answer', async () => {
        const { client } = build(
            undefined,
            message({
                stop_reason: 'max_tokens',
                content: [{ type: 'thinking', thinking: '', signature: 's' }],
            }),
        );

        await expect(client.generate(request)).rejects.toMatchObject({
            kind: 'unavailable',
        });
    });

    it('turns a refusal into a rejected LlmError', async () => {
        const { client } = build(
            undefined,
            message({
                stop_reason: 'refusal',
                stop_details: {
                    type: 'refusal',
                    category: 'general_harms',
                    explanation: null,
                },
            }),
        );

        const error = await client.generate(request).catch((e) => e);
        expect(error).toBeInstanceOf(LlmError);
        expect(error.kind).toBe('rejected');
        // The refused call was still billed, so its usage travels with the error.
        expect(error.usage).toEqual({
            inputTokens: 6500,
            cachedInputTokens: 6000,
            cacheWriteInputTokens: 0,
            outputTokens: 300,
        });
        expect(error.model).toBe('claude-haiku-5-5');
    });

    it('creates the SDK client once, and only when first needed', async () => {
        const { client } = build();
        expect(client.created).toBe(0);
        await client.generate(request);
        await client.generate(request);
        expect(client.created).toBe(1);
    });

    it('fails as misconfigured, without a network call, when there is no key', async () => {
        const { client, create } = build({});

        await expect(client.generate(request)).rejects.toMatchObject({
            kind: 'misconfigured',
        });
        expect(create).not.toHaveBeenCalled();
    });
});

describe('AnthropicLlmClient error translation', () => {
    const cases: [string, Error, LlmError['kind']][] = [
        [
            '401 bad key',
            apiError(Anthropic.AuthenticationError, 401, {
                type: 'authentication_error',
                message: 'invalid x-api-key',
            }),
            'misconfigured',
        ],
        [
            '403 permission',
            apiError(Anthropic.PermissionDeniedError, 403, {
                type: 'permission_error',
                message: 'no access',
            }),
            'misconfigured',
        ],
        [
            '404 unknown model',
            apiError(Anthropic.NotFoundError, 404, {
                type: 'not_found_error',
                message: 'model: nope',
            }),
            'misconfigured',
        ],
        [
            '429 rate limit',
            apiError(Anthropic.RateLimitError, 429, {
                type: 'rate_limit_error',
                message: 'slow down',
            }),
            'rate_limited',
        ],
        [
            '400 credit balance too low',
            apiError(Anthropic.BadRequestError, 400, {
                type: 'invalid_request_error',
                message:
                    'Your credit balance is too low to access the Anthropic API.',
            }),
            'out_of_credit',
        ],
        [
            'billing error',
            apiError(Anthropic.PaymentRequiredError, 402, {
                type: 'billing_error',
                message: 'spend limit reached',
            }),
            'out_of_credit',
        ],
        [
            '400 other',
            apiError(Anthropic.BadRequestError, 400, {
                type: 'invalid_request_error',
                message: 'messages: bad shape',
            }),
            'rejected',
        ],
        [
            '529 overloaded',
            apiError(Anthropic.InternalServerError, 529, {
                type: 'overloaded_error',
                message: 'Overloaded',
            }),
            'unavailable',
        ],
        [
            '500',
            apiError(Anthropic.InternalServerError, 500, {
                type: 'api_error',
                message: 'oops',
            }),
            'unavailable',
        ],
        [
            'connection error',
            new Anthropic.APIConnectionError({ message: 'Connection error.' }),
            'unavailable',
        ],
        ['timeout', new Anthropic.APIConnectionTimeoutError(), 'unavailable'],
    ];

    it.each(cases)('%s → %s', async (_name, failure, kind) => {
        const { client } = build(undefined, failure);
        const error = await client.generate(request).catch((e) => e);
        expect(error).toBeInstanceOf(LlmError);
        expect(error.kind).toBe(kind);
        expect(error.cause).toBe(failure);
    });

    it('names api.anthropic.com in the hint when something is re-signing HTTPS traffic', async () => {
        const warn = jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined);
        const cause = Object.assign(new Error('self-signed certificate'), {
            code: 'SELF_SIGNED_CERT_IN_CHAIN',
        });
        const failure = new Anthropic.APIConnectionError({
            message: 'Connection error.',
            cause,
        });
        const { client } = build(undefined, failure);

        await client.generate(request).catch(() => undefined);

        const logged = String(warn.mock.calls.at(-1)?.[0]);
        expect(logged).toContain('SELF_SIGNED_CERT_IN_CHAIN');
        expect(logged).toContain('api.anthropic.com');
    });
});

describe('AnthropicLlmClient.stream', () => {
    it('yields each piece of text, then one final event with the whole answer and usage', async () => {
        const { client, stream } = build();
        const signal = new AbortController().signal;

        const events = await collect(client.stream({ ...request, signal }));

        expect(events).toEqual([
            { type: 'delta', text: 'The answer ' },
            { type: 'delta', text: '[[pricing#vat]].' },
            {
                type: 'done',
                result: expect.objectContaining({
                    text: 'The answer [[pricing#vat]].',
                    usage: {
                        inputTokens: 6500,
                        cachedInputTokens: 6000,
                        cacheWriteInputTokens: 0,
                        outputTokens: 300,
                    },
                    truncated: false,
                }),
            },
        ]);
        expect(stream.mock.calls[0][1]).toEqual({ signal });
    });

    it('marks a cut-off stream as truncated', async () => {
        const { client } = build(
            undefined,
            message({ stop_reason: 'max_tokens' }),
        );
        const events = await collect(client.stream(request));
        expect(events.at(-1)).toMatchObject({
            type: 'done',
            result: { truncated: true },
        });
    });

    it('translates a vendor failure to an LlmError, as generate() does', async () => {
        const { client } = build(
            undefined,
            apiError(Anthropic.RateLimitError, 429, {
                type: 'rate_limit_error',
                message: 'slow down',
            }),
        );
        await expect(collect(client.stream(request))).rejects.toMatchObject({
            kind: 'rate_limited',
        });
    });

    it('turns a streamed refusal into a rejected LlmError', async () => {
        const { client } = build(
            undefined,
            message({ stop_reason: 'refusal' }),
        );
        await expect(collect(client.stream(request))).rejects.toMatchObject({
            kind: 'rejected',
        });
    });
});

describe('AnthropicLlmClient tool calls', () => {
    const toolReply = message({
        stop_reason: 'tool_use',
        content: [
            { type: 'thinking', thinking: '', signature: 'sig-tools' },
            {
                type: 'tool_use',
                id: 'toolu_1',
                name: 'findProductPrices',
                input: { products: ['1oz Krugerrand'] },
            },
            {
                type: 'tool_use',
                id: 'toolu_2',
                name: 'getSpot',
                input: {},
            },
        ],
    });

    it('offers the tools with tool_choice auto, in the vendor format', async () => {
        const { client, create } = build();

        await client.generate({ ...request, tools });

        const [body] = create.mock.calls[0];
        expect(body.tools).toEqual([
            {
                name: 'getSpot',
                description: 'Live spot',
                input_schema: { type: 'object', properties: {} },
            },
        ]);
        expect(body.tool_choice).toEqual({ type: 'auto' });
    });

    it('keeps the tools declared but not callable when asked for none, so the prefix is unchanged', async () => {
        const { client, create } = build();

        await client.generate({ ...request, tools, toolChoice: 'none' });

        const [body] = create.mock.calls[0];
        expect(body.tools).toHaveLength(1);
        expect(body.tool_choice).toEqual({ type: 'none' });
    });

    it('sends no tools field when none are offered', async () => {
        const { client, create } = build();
        await client.generate(request);
        expect(create.mock.calls[0][0]).not.toHaveProperty('tools');
        expect(create.mock.calls[0][0]).not.toHaveProperty('tool_choice');
    });

    it('returns the lookups from the assembled message, and keeps the whole reply for replay', async () => {
        const { client } = build(undefined, toolReply, []);

        const events = await collect(client.stream({ ...request, tools }));
        const done = events.at(-1) as {
            result: { toolCalls: unknown; text: string; replay: unknown };
        };

        expect(done.result.text).toBe('');
        expect(done.result.toolCalls).toEqual([
            {
                id: 'toolu_1',
                name: 'findProductPrices',
                arguments: JSON.stringify({ products: ['1oz Krugerrand'] }),
            },
            { id: 'toolu_2', name: 'getSpot', arguments: '{}' },
        ]);
        expect(done.result.replay).toBe(toolReply.content);
    });

    it('never returns a tool call that the output cap cut off', async () => {
        const cut = message({
            stop_reason: 'max_tokens',
            content: [
                { type: 'text', text: 'Let me check', citations: null },
                { type: 'tool_use', id: 'toolu_x', name: 'getSpot', input: {} },
            ],
        });
        const { client } = build(undefined, cut);

        const error = await client
            .generate({ ...request, tools })
            .catch((e: unknown) => e);

        // Neither the half-written lookup nor the sentence before it may be used as the answer.
        expect(error).toBeInstanceOf(LlmError);
        expect((error as LlmError).kind).toBe('unavailable');
        expect((error as LlmError).usage?.outputTokens).toBe(300);
    });

    it('replays a tool round: the reply exactly as it came back (reasoning included), then all its results in one user message', async () => {
        const { client, create } = build();

        await client.generate({
            ...request,
            tools,
            turns: [
                {
                    role: 'assistant',
                    content: '',
                    toolCalls: [
                        {
                            id: 'toolu_1',
                            name: 'findProductPrices',
                            arguments: '{}',
                        },
                        { id: 'toolu_2', name: 'getSpot', arguments: '{}' },
                    ],
                    replay: toolReply.content,
                },
                { role: 'tool', toolCallId: 'toolu_1', content: '{"a":1}' },
                { role: 'tool', toolCallId: 'toolu_2', content: '{"b":2}' },
            ],
        });

        const [body] = create.mock.calls[0];
        expect(body.messages).toEqual([
            { role: 'user', content: 'Do we charge VAT?' },
            { role: 'assistant', content: toolReply.content },
            {
                role: 'user',
                content: [
                    {
                        type: 'tool_result',
                        tool_use_id: 'toolu_1',
                        content: '{"a":1}',
                    },
                    {
                        type: 'tool_result',
                        tool_use_id: 'toolu_2',
                        content: '{"b":2}',
                    },
                ],
            },
        ]);
    });

    it('rebuilds a turn that has no replay from its text and tool calls', async () => {
        const { client, create } = build();

        await client.generate({
            ...request,
            tools,
            turns: [
                {
                    role: 'assistant',
                    content: 'Checking.',
                    toolCalls: [
                        {
                            id: 'call_1',
                            name: 'getSpot',
                            arguments: '{"metal":"gold"}',
                        },
                    ],
                },
                { role: 'tool', toolCallId: 'call_1', content: 'ok' },
            ],
        });

        const [body] = create.mock.calls[0];
        expect(body.messages[1]).toEqual({
            role: 'assistant',
            content: [
                { type: 'text', text: 'Checking.' },
                {
                    type: 'tool_use',
                    id: 'call_1',
                    name: 'getSpot',
                    input: { metal: 'gold' },
                },
            ],
        });
    });
});
