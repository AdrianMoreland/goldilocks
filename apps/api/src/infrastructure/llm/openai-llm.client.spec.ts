import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type OpenAI from 'openai';
import { LlmError } from './llm.port';
import { OpenAiLlmClient } from './openai-llm.client';

type Create = jest.Mock<
    Promise<unknown>,
    [Record<string, unknown>, { signal?: AbortSignal }]
>;

/** The real adapter, with the SDK client swapped for a fake: no network, no key, no cost. */
class TestableClient extends OpenAiLlmClient {
    created = 0;
    constructor(
        config: ConfigService,
        private readonly create: Create,
    ) {
        super(config);
    }
    protected override createClient(): OpenAI {
        this.created += 1;
        return {
            chat: { completions: { create: this.create } },
        } as unknown as OpenAI;
    }
}

const completion = (overrides: Record<string, unknown> = {}) => ({
    model: 'gpt-4o-mini-2024-07-18',
    choices: [
        {
            finish_reason: 'stop',
            message: { content: '  The answer [[pricing#vat]].  ' },
        },
    ],
    usage: {
        prompt_tokens: 7000,
        completion_tokens: 42,
        prompt_tokens_details: { cached_tokens: 6144 },
    },
    ...overrides,
});

function build(
    settings: Record<string, string | undefined> = {
        OPENAI_API_KEY: 'sk-test',
    },
    reply: unknown = completion(),
) {
    const create: Create = jest.fn(
        async (
            _body: Record<string, unknown>,
            _options: { signal?: AbortSignal },
        ) => {
            if (reply instanceof Error) throw reply;
            return reply;
        },
    );
    const config = {
        get: (key: string) => settings[key],
    } as unknown as ConfigService;
    return { client: new TestableClient(config, create), create };
}

const request = {
    system: 'RULES + SOPs',
    user: 'Do we charge VAT?',
    maxOutputTokens: 400,
};

describe('OpenAiLlmClient.generate', () => {
    beforeEach(
        () =>
            void jest
                .spyOn(Logger.prototype, 'warn')
                .mockImplementation(() => undefined),
    );
    afterEach(() => jest.restoreAllMocks());

    it('sends the rules as the system message and the question as the user message, with the configured model and token cap', async () => {
        const { client, create } = build({
            OPENAI_API_KEY: 'sk-test',
            AI_MODEL: 'some-model',
        });
        const signal = new AbortController().signal;

        await client.generate({ ...request, signal });

        const [body, options] = create.mock.calls[0];
        expect(body).toMatchObject({
            model: 'some-model',
            max_completion_tokens: 400,
            messages: [
                { role: 'system', content: 'RULES + SOPs' },
                { role: 'user', content: 'Do we charge VAT?' },
            ],
        });
        expect(options.signal).toBe(signal);
    });

    it('defaults to gpt-4o-mini', async () => {
        const { client, create } = build();
        await client.generate(request);
        expect(create.mock.calls[0][0]).toMatchObject({ model: 'gpt-4o-mini' });
        expect(client.model).toBe('gpt-4o-mini');
    });

    it('returns the trimmed text, the vendor-reported model and the usage including cached input tokens', async () => {
        const { client } = build();

        await expect(client.generate(request)).resolves.toEqual({
            text: 'The answer [[pricing#vat]].',
            model: 'gpt-4o-mini-2024-07-18',
            usage: {
                inputTokens: 7000,
                cachedInputTokens: 6144,
                outputTokens: 42,
            },
            truncated: false,
        });
    });

    it('reports zero cached tokens when the vendor does not say', async () => {
        const { client } = build(
            undefined,
            completion({ usage: { prompt_tokens: 10, completion_tokens: 5 } }),
        );
        expect((await client.generate(request)).usage.cachedInputTokens).toBe(
            0,
        );
    });

    it('flags an answer that hit the output limit', async () => {
        const { client } = build(
            undefined,
            completion({
                choices: [
                    { finish_reason: 'length', message: { content: 'cut of' } },
                ],
            }),
        );
        expect((await client.generate(request)).truncated).toBe(true);
    });

    it('sends a temperature only when one is configured (some models reject anything but their default)', async () => {
        const without = build();
        await without.client.generate(request);
        expect(without.create.mock.calls[0][0]).not.toHaveProperty(
            'temperature',
        );

        const withIt = build({
            OPENAI_API_KEY: 'sk-test',
            AI_TEMPERATURE: '0.2',
        });
        await withIt.client.generate(request);
        expect(withIt.create.mock.calls[0][0]).toMatchObject({
            temperature: 0.2,
        });
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

    describe('translates vendor failures into LlmError kinds', () => {
        const failing = (status?: number) =>
            Object.assign(new Error(`vendor said ${status}`), { status });

        it.each([
            [401, 'misconfigured'],
            [403, 'misconfigured'],
            [404, 'misconfigured'],
            [429, 'rate_limited'],
            [400, 'rejected'],
            [422, 'rejected'],
            [500, 'unavailable'],
            [503, 'unavailable'],
            [undefined, 'unavailable'], // connection failure or timeout: the SDK sets no status
        ])('status %s -> %s', async (status, kind) => {
            const { client } = build(undefined, failing(status));

            const error = await client
                .generate(request)
                .catch((e: unknown) => e);

            expect(error).toBeInstanceOf(LlmError);
            expect((error as LlmError).kind).toBe(kind);
        });

        it('tells "out of credit" apart from "too fast": OpenAI uses 429 for both', async () => {
            const noCredit = Object.assign(
                new Error('You have no credits remaining'),
                { status: 429, code: 'insufficient_quota' },
            );
            const { client } = build(undefined, noCredit);

            const error = (await client
                .generate(request)
                .catch((e: unknown) => e)) as LlmError;

            expect(error.kind).toBe('out_of_credit');
            expect(error.message).not.toContain('no credits remaining');
        });

        it('names the model when it is unknown to the key, and never echoes the vendor message', async () => {
            const { client } = build(
                { OPENAI_API_KEY: 'sk-test', AI_MODEL: 'nope-1' },
                failing(404),
            );

            const error = (await client
                .generate(request)
                .catch((e: unknown) => e)) as LlmError;

            expect(error.message).toContain('nope-1');
            expect(error.message).not.toContain('vendor said');
        });

        it('keeps the original error as the cause, for the log', async () => {
            const original = failing(500);
            const { client } = build(undefined, original);

            const error = (await client
                .generate(request)
                .catch((e: unknown) => e)) as LlmError;

            expect(error.cause).toBe(original);
        });
    });

    it.each([
        [
            'an empty answer',
            completion({
                choices: [
                    { finish_reason: 'stop', message: { content: '   ' } },
                ],
            }),
            'unavailable',
        ],
        ['no choices at all', completion({ choices: [] }), 'unavailable'],
        [
            'a content-filter stop',
            completion({
                choices: [
                    {
                        finish_reason: 'content_filter',
                        message: { content: 'x' },
                    },
                ],
            }),
            'rejected',
        ],
    ])('treats %s as a failure', async (_label, reply, kind) => {
        const { client } = build(undefined, reply);
        await expect(client.generate(request)).rejects.toMatchObject({ kind });
    });
});

async function* chunks(...items: Record<string, unknown>[]) {
    await Promise.resolve();
    for (const item of items) yield item;
}

const piece = (text: string, extra: Record<string, unknown> = {}) => ({
    model: 'gpt-4o-mini-2024-07-18',
    choices: [{ delta: { content: text }, finish_reason: null, ...extra }],
});

const STREAM = () =>
    chunks(
        piece('The answer '),
        piece('[[pricing#vat]].'),
        {
            model: 'gpt-4o-mini-2024-07-18',
            choices: [{ delta: {}, finish_reason: 'stop' }],
        },
        {
            model: 'gpt-4o-mini-2024-07-18',
            choices: [],
            usage: {
                prompt_tokens: 7000,
                completion_tokens: 42,
                prompt_tokens_details: { cached_tokens: 6144 },
            },
        },
    );

async function drain(iterable: AsyncIterable<unknown>) {
    const events: unknown[] = [];
    for await (const event of iterable) events.push(event);
    return events;
}

describe('OpenAiLlmClient.stream', () => {
    beforeEach(
        () =>
            void jest
                .spyOn(Logger.prototype, 'warn')
                .mockImplementation(() => undefined),
    );
    afterEach(() => jest.restoreAllMocks());

    it('asks for a stream with usage, using the same messages and cap as generate()', async () => {
        const { client, create } = build(undefined, STREAM());

        await drain(client.stream(request));

        expect(create.mock.calls[0][0]).toMatchObject({
            stream: true,
            stream_options: { include_usage: true },
            max_completion_tokens: 400,
            messages: [
                { role: 'system', content: 'RULES + SOPs' },
                { role: 'user', content: 'Do we charge VAT?' },
            ],
        });
    });

    it('yields each piece of text, then one final event with the whole answer and the usage', async () => {
        const { client } = build(undefined, STREAM());

        const events = await drain(client.stream(request));

        expect(events).toEqual([
            { type: 'delta', text: 'The answer ' },
            { type: 'delta', text: '[[pricing#vat]].' },
            {
                type: 'done',
                result: {
                    text: 'The answer [[pricing#vat]].',
                    model: 'gpt-4o-mini-2024-07-18',
                    usage: {
                        inputTokens: 7000,
                        cachedInputTokens: 6144,
                        outputTokens: 42,
                    },
                    truncated: false,
                },
            },
        ]);
    });

    it('marks a cut-off answer as truncated', async () => {
        const { client } = build(
            undefined,
            chunks(piece('Partial', { finish_reason: 'length' })),
        );

        const events = (await drain(client.stream(request))) as {
            type: string;
            result?: { truncated: boolean };
        }[];

        expect(events.at(-1)?.result?.truncated).toBe(true);
    });

    it('translates a vendor failure to an LlmError, as generate() does', async () => {
        const { client } = build(
            undefined,
            Object.assign(new Error('no credit'), {
                status: 429,
                code: 'insufficient_quota',
            }),
        );

        await expect(drain(client.stream(request))).rejects.toMatchObject({
            name: 'LlmError',
            kind: 'out_of_credit',
        });
    });

    it('rejects an empty stream rather than returning a blank answer', async () => {
        const { client } = build(undefined, chunks());

        await expect(drain(client.stream(request))).rejects.toBeInstanceOf(
            LlmError,
        );
    });

    it('refuses a content-filtered stream', async () => {
        const { client } = build(
            undefined,
            chunks(piece('x', { finish_reason: 'content_filter' })),
        );

        await expect(drain(client.stream(request))).rejects.toMatchObject({
            kind: 'rejected',
        });
    });
});

const TOOL_SPEC = {
    name: 'findProductPrices',
    description: 'prices',
    parameters: { type: 'object', properties: { query: { type: 'string' } } },
};

const TOOL_REPLY = {
    model: 'gpt-4o-mini-2024-07-18',
    choices: [
        {
            finish_reason: 'tool_calls',
            message: {
                content: null,
                tool_calls: [
                    {
                        id: 'call_1',
                        type: 'function',
                        function: {
                            name: 'findProductPrices',
                            arguments: '{"query":"100g gold bar"}',
                        },
                    },
                ],
            },
        },
    ],
    usage: { prompt_tokens: 7000, completion_tokens: 20 },
};

describe('OpenAiLlmClient tool calls', () => {
    beforeEach(
        () =>
            void jest
                .spyOn(Logger.prototype, 'warn')
                .mockImplementation(() => undefined),
    );
    afterEach(() => jest.restoreAllMocks());

    it('offers the tools in the vendor format, and replays earlier tool rounds after the user message', async () => {
        const { client, create } = build();

        await client.generate({
            ...request,
            tools: [TOOL_SPEC],
            turns: [
                {
                    role: 'assistant',
                    content: '',
                    toolCalls: [
                        {
                            id: 'call_1',
                            name: 'findProductPrices',
                            arguments: '{"query":"100g gold bar"}',
                        },
                    ],
                },
                {
                    role: 'tool',
                    toolCallId: 'call_1',
                    content: '{"price":10120}',
                },
            ],
        });

        const [body] = create.mock.calls[0];
        expect(body.tools).toEqual([
            {
                type: 'function',
                function: {
                    name: 'findProductPrices',
                    description: 'prices',
                    parameters: TOOL_SPEC.parameters,
                },
            },
        ]);
        expect(body.messages).toEqual([
            { role: 'system', content: 'RULES + SOPs' },
            { role: 'user', content: 'Do we charge VAT?' },
            {
                role: 'assistant',
                content: null,
                tool_calls: [
                    {
                        id: 'call_1',
                        type: 'function',
                        function: {
                            name: 'findProductPrices',
                            arguments: '{"query":"100g gold bar"}',
                        },
                    },
                ],
            },
            {
                role: 'tool',
                tool_call_id: 'call_1',
                content: '{"price":10120}',
            },
        ]);
    });

    it('sends no tools field when none are offered', async () => {
        const { client, create } = build();

        await client.generate(request);

        expect(create.mock.calls[0][0]).not.toHaveProperty('tools');
    });

    it('returns the lookups the model asked for instead of treating an empty reply as a failure', async () => {
        const { client } = build(undefined, TOOL_REPLY);

        const result = await client.generate({
            ...request,
            tools: [TOOL_SPEC],
        });

        expect(result.text).toBe('');
        expect(result.toolCalls).toEqual([
            {
                id: 'call_1',
                name: 'findProductPrices',
                arguments: '{"query":"100g gold bar"}',
            },
        ]);
    });

    it('assembles a tool call that arrives in fragments while streaming', async () => {
        const fragment = (
            index: number,
            extra: Record<string, unknown>,
            finish: string | null = null,
        ) => ({
            model: 'gpt-4o-mini-2024-07-18',
            choices: [
                {
                    delta: { tool_calls: [{ index, ...extra }] },
                    finish_reason: finish,
                },
            ],
        });
        const { client } = build(
            undefined,
            chunks(
                fragment(0, {
                    id: 'call_1',
                    function: { name: 'findProductPrices', arguments: '' },
                }),
                fragment(0, { function: { arguments: '{"query":' } }),
                fragment(0, { function: { arguments: '"100g gold bar"}' } }),
                fragment(1, {
                    id: 'call_2',
                    function: {
                        name: 'getSpot',
                        arguments: '{"metal":"GOLD"}',
                    },
                }),
                {
                    model: 'm',
                    choices: [{ delta: {}, finish_reason: 'tool_calls' }],
                },
                {
                    model: 'm',
                    choices: [],
                    usage: { prompt_tokens: 7000, completion_tokens: 30 },
                },
            ),
        );

        const events = (await drain(
            client.stream({ ...request, tools: [TOOL_SPEC] }),
        )) as {
            type: string;
            result?: { text: string; toolCalls: unknown[] };
        }[];

        expect(events).toHaveLength(1);
        expect(events[0].result?.toolCalls).toEqual([
            {
                id: 'call_1',
                name: 'findProductPrices',
                arguments: '{"query":"100g gold bar"}',
            },
            { id: 'call_2', name: 'getSpot', arguments: '{"metal":"GOLD"}' },
        ]);
        expect(events[0].result?.text).toBe('');
    });
});

describe('OpenAiLlmClient connection diagnostics', () => {
    afterEach(() => jest.restoreAllMocks());

    it('names the real reason, and the safe fix, when something is re-signing HTTPS traffic', async () => {
        const warn = jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined);
        const tlsError = Object.assign(new Error('Connection error.'), {
            cause: Object.assign(new TypeError('fetch failed'), {
                cause: Object.assign(
                    new Error('self-signed certificate in certificate chain'),
                    { code: 'SELF_SIGNED_CERT_IN_CHAIN' },
                ),
            }),
        });
        const { client } = build(undefined, tlsError);

        await expect(client.generate(request)).rejects.toMatchObject({
            kind: 'unavailable',
        });

        const message = String(warn.mock.calls[0][0]);
        expect(message).toContain('SELF_SIGNED_CERT_IN_CHAIN');
        expect(message).toContain('NODE_EXTRA_CA_CERTS');
        expect(message).toMatch(/never disable certificate checks/i);
    });

    it('does not suggest an antivirus problem for an ordinary network failure', async () => {
        const warn = jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined);
        const { client } = build(undefined, new Error('Connection error.'));

        await client.generate(request).catch(() => undefined);

        expect(String(warn.mock.calls[0][0])).not.toContain(
            'NODE_EXTRA_CA_CERTS',
        );
    });
});
