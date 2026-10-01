import {
    HttpException,
    Logger,
    ServiceUnavailableException,
    UnprocessableEntityException,
} from '@nestjs/common';
import type { KbDocument } from '@goldilocks/shared-types';
import {
    LlmError,
    type LlmPort,
    type LlmRequest,
    type LlmResult,
} from '../../infrastructure/llm/llm.port';
import { AiSettings } from './ai.settings';
import type { AnswerCacheService, CachedAnswer } from './answer-cache.service';
import { AskService, type AskEvent } from './ask.service';
import type { ToolOutcome, ToolRegistry } from './tools/tool.registry';
import type { AiMode } from '@goldilocks/shared-types';
import { buildPrompt } from './prompt-builder';
import type {
    QuestionLogEntry,
    QuestionLogService,
} from './question-log.service';
import type { QuotaService } from './quota.service';

const doc = (slug: string, markdown: string): KbDocument => ({
    slug,
    title: `Title of ${slug}`,
    category: 'sales',
    jurisdiction: 'IE',
    owner: 'Adrian',
    status: 'approved',
    version: 3,
    contentUpdatedOn: '2026-09-30',
    markdown,
});

const PRICING = doc('pricing', '## VAT\nSilver carries 23% VAT.');
const ACTOR = { id: 'user-1', email: 'boss@example.com' };
const QUESTION = 'Do we charge VAT on silver?';
const input = (question: string, mode: AiMode = 'procedures') => ({
    question,
    mode,
});

const result = (
    text: string,
    overrides: Partial<LlmResult> = {},
): LlmResult => ({
    text,
    model: 'fake-model-2026',
    usage: { inputTokens: 7000, cachedInputTokens: 6000, outputTokens: 40 },
    truncated: false,
    ...overrides,
});

const CITED = result('Silver has 23% VAT [[pricing#vat]].');
const UNCITED = result('Silver has 23% VAT.');

function build(
    options: {
        enabled?: boolean;
        docs?: KbDocument[];
        /** Model replies in call order; the last one repeats. An Error is thrown instead. */
        replies?: (LlmResult | Error)[];
        quotaError?: Error;
        spentMicros?: number;
        /** What each lookup returns, by tool name. */
        toolData?: Record<string, unknown>;
    } = {},
) {
    const replies = options.replies ?? [CITED];
    const requests: { kind: 'stream' | 'generate'; request: LlmRequest }[] = [];
    let call = 0;
    const nextReply = () => {
        const reply = replies[Math.min(call++, replies.length - 1)];
        if (reply instanceof Error) throw reply;
        return reply;
    };

    const llm: LlmPort = {
        model: 'fake-model',
        generate: jest.fn(async (request: LlmRequest) => {
            requests.push({ kind: 'generate', request });
            return nextReply();
        }),
        stream: async function* (request: LlmRequest) {
            requests.push({ kind: 'stream', request });
            const reply = nextReply();
            for (let i = 0; i < reply.text.length; i += 8) {
                yield {
                    type: 'delta' as const,
                    text: reply.text.slice(i, i + 8),
                };
            }
            yield { type: 'done' as const, result: reply };
        },
    };

    const load = jest.fn(async () => buildPrompt(options.docs ?? [PRICING]));
    const context = { load };
    const settings = {
        enabled: options.enabled ?? true,
        maxOutputTokens: 321,
        cacheTtlDays: 7,
        dailyBudgetUsd: 2,
        // Deterministic prices: 1000 uncached*1 + 6000 cached*0.5 + 40 out*2 = 4080 micro-dollars.
        priceOverride: { input: 1, cachedInput: 0.5, output: 2 },
    } as unknown as AiSettings;

    const release = jest.fn(async () => undefined);
    const acquire = jest.fn(async () => {
        if (options.quotaError) throw options.quotaError;
        return { release };
    });
    const quota = { acquire } as unknown as QuotaService;

    const cached = new Map<string, CachedAnswer>();
    const cacheGet = jest.fn(
        async (key: string, hash: string) =>
            cached.get(`${key}|${hash}`) ?? null,
    );
    const cachePut = jest.fn(
        async (key: string, hash: string, value: CachedAnswer) => {
            cached.set(`${key}|${hash}`, value);
        },
    );
    const cache = {
        get: cacheGet,
        put: cachePut,
    } as unknown as AnswerCacheService;

    const executed: { name: string; arguments: string }[] = [];
    const executeTool = jest.fn(
        async (
            call: { name: string; arguments: string },
            _context: unknown,
        ): Promise<ToolOutcome> => {
            executed.push(call);
            const data = options.toolData?.[call.name] ?? { matchCount: 0 };
            return {
                name: call.name,
                content: JSON.stringify(data),
                data,
                ok: true,
            };
        },
    );
    const tools = {
        specs: () => [
            {
                name: 'findProductPrices',
                description: 'prices',
                parameters: {},
            },
        ],
        execute: executeTool,
    } as unknown as ToolRegistry;

    const rows: QuestionLogEntry[] = [];
    const questionLog = {
        record: jest.fn(async (entry: QuestionLogEntry) => {
            rows.push(entry);
        }),
        spentSince: jest.fn(async () => options.spentMicros ?? 0),
    } as unknown as QuestionLogService;

    return {
        service: new AskService(
            llm,
            context,
            settings,
            quota,
            cache,
            questionLog,
            tools,
        ),
        executed,
        executeTool,
        llm,
        requests,
        load,
        acquire,
        release,
        cache,
        cacheGet,
        cachePut,
        rows,
        questionLog,
    };
}

async function collect(stream: AsyncGenerator<AskEvent>) {
    const events: AskEvent[] = [];
    for await (const event of stream) events.push(event);
    return events;
}

describe('AskService.ask', () => {
    it('refuses to run while switched off, without touching limits, the model or the SOPs', async () => {
        const { service, requests, load, acquire } = build({ enabled: false });

        await expect(
            service.ask(input(QUESTION), ACTOR),
        ).rejects.toBeInstanceOf(ServiceUnavailableException);
        expect(requests).toHaveLength(0);
        expect(load).not.toHaveBeenCalled();
        expect(acquire).not.toHaveBeenCalled();
    });

    it('answers from the SOPs: rules and corpus in the system prompt, the question alone in the user message', async () => {
        const { service, requests } = build();
        const signal = new AbortController().signal;

        const response = await service.ask(input(QUESTION), ACTOR, signal);

        const { request } = requests[0];
        expect(request.system).toContain('Silver carries 23% VAT.');
        expect(request.system).not.toContain(QUESTION);
        expect(request.user).toBe(QUESTION);
        expect(request.maxOutputTokens).toBe(321);
        expect(request.signal).toBe(signal);

        expect(response).toMatchObject({
            status: 'answered',
            model: 'fake-model-2026',
            cached: false,
            usage: {
                inputTokens: 7000,
                cachedInputTokens: 6000,
                outputTokens: 40,
            },
            corpus: { documents: 1 },
        });
        expect(response.citations).toEqual([
            {
                slug: 'pricing',
                anchor: 'vat',
                title: 'Title of pricing',
                heading: 'VAT',
            },
        ]);
        expect(response.corpus.hash).toMatch(/^[0-9a-f]{16}$/);
    });

    it('reports a NO_ANSWER reply as refused', async () => {
        const { service } = build({
            replies: [result('NO_ANSWER: Not covered. Ask a manager.')],
        });

        expect(
            await service.ask(input('How much up front?'), ACTOR),
        ).toMatchObject({
            status: 'refused',
            answer: 'Not covered. Ask a manager.',
            citations: [],
        });
    });

    it('flags an answer whose citations are not real as uncited, and strips them', async () => {
        const { service } = build({
            replies: [result('It is 23% [[pricing#made-up]].')],
        });

        const response = await service.ask(input('VAT?'), ACTOR);

        expect(response.status).toBe('uncited');
        expect(response.answer).not.toContain('made-up');
    });

    it('does not pay for a model call when no SOP is approved', async () => {
        const { service, requests } = build({ docs: [] });

        const response = await service.ask(input('Anything?'), ACTOR);

        expect(requests).toHaveLength(0);
        expect(response).toMatchObject({
            status: 'refused',
            usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 },
            corpus: { documents: 0 },
        });
    });
});

describe('AskService limits and cost', () => {
    it('takes the per-user slot before doing anything else, and gives it back afterwards', async () => {
        const { service, acquire, release } = build();

        await service.ask(input(QUESTION), ACTOR);

        expect(acquire).toHaveBeenCalledWith('user-1');
        expect(release).toHaveBeenCalledTimes(1);
    });

    it('stops at a quota refusal: no SOPs loaded, no model call, nothing logged', async () => {
        const { service, requests, load, rows } = build({
            quotaError: new HttpException('Slow down', 429),
        });

        await expect(service.ask(input(QUESTION), ACTOR)).rejects.toMatchObject(
            {
                status: 429,
            },
        );
        expect(load).not.toHaveBeenCalled();
        expect(requests).toHaveLength(0);
        expect(rows).toHaveLength(0);
    });

    it('gives the slot back even when the model fails', async () => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(
            () => undefined,
        );
        const { service, release } = build({
            replies: [new LlmError('unavailable', 'down')],
        });

        await service.ask(input(QUESTION), ACTOR).catch(() => undefined);

        expect(release).toHaveBeenCalledTimes(1);
        jest.restoreAllMocks();
    });

    it('pauses the assistant, without a model call, once the daily budget is spent', async () => {
        jest.spyOn(Logger.prototype, 'error').mockImplementation(
            () => undefined,
        );
        const { service, requests, release } = build({
            spentMicros: 2_000_000,
        });

        const failure = await service
            .ask(input(QUESTION), ACTOR)
            .catch((e: Error) => e);

        expect(failure).toBeInstanceOf(ServiceUnavailableException);
        expect((failure as Error).message).toMatch(/paused for today/);
        expect(requests).toHaveLength(0);
        expect(release).toHaveBeenCalledTimes(1);
        jest.restoreAllMocks();
    });

    it('still serves a cached answer while paused, because that costs nothing', async () => {
        const warm = build();
        await warm.service.ask(input(QUESTION), ACTOR);
        const { service, requests } = build({ spentMicros: 2_000_000 });
        // Share the warmed cache by replaying its stored entry.
        (service as unknown as { cache: AnswerCacheService }).cache =
            warm.cache;

        const response = await service.ask(input(QUESTION), ACTOR);

        expect(response.cached).toBe(true);
        expect(requests).toHaveLength(0);
    });

    it('logs tokens and an exact integer cost for every model answer', async () => {
        const { service, rows } = build();

        await service.ask(input(QUESTION), ACTOR);

        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            userId: 'user-1',
            status: 'answered',
            cached: false,
            retried: false,
            citations: ['pricing#vat'],
            inputTokens: 7000,
            cachedInputTokens: 6000,
            outputTokens: 40,
            costMicros: 4080,
        });
    });

    it('logs a failed model call as an error row with its kind, and costs nothing', async () => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(
            () => undefined,
        );
        jest.spyOn(Logger.prototype, 'error').mockImplementation(
            () => undefined,
        );
        const { service, rows } = build({
            replies: [new LlmError('out_of_credit', 'no credit')],
        });

        await service.ask(input(QUESTION), ACTOR).catch(() => undefined);

        expect(rows[0]).toMatchObject({
            status: 'error',
            error: 'out_of_credit',
            costMicros: 0,
        });
        jest.restoreAllMocks();
    });

    it('records a cancelled request as cancelled, not as a vendor failure', async () => {
        const controller = new AbortController();
        const { service, rows } = build({
            replies: [new LlmError('unavailable', 'aborted')],
        });
        controller.abort();

        await service
            .ask(input(QUESTION), ACTOR, controller.signal)
            .catch(() => undefined);

        expect(rows[0]).toMatchObject({ status: 'error', error: 'cancelled' });
    });
});

describe('AskService privacy', () => {
    it('never writes the question to the application log', async () => {
        const logged: string[] = [];
        jest.spyOn(Logger.prototype, 'log').mockImplementation(
            (message: unknown) => void logged.push(String(message)),
        );
        const { service } = build();

        await service.ask(
            input('Customer John Murphy wants to pay cash'),
            ACTOR,
        );

        expect(logged.join('\n')).toContain(
            '[ai] boss@example.com: procedures answered',
        );
        expect(logged.join('\n')).not.toContain('Murphy');
        jest.restoreAllMocks();
    });

    it('stores the question scrubbed of names, emails and phone numbers, but sends the model the real one', async () => {
        const { service, rows, requests } = build();
        const raw =
            'Customer John Murphy (john.murphy@example.ie, 087 123 4567) wants to collect. What do I check?';

        await service.ask(input(raw), ACTOR);

        expect(requests[0].request.user).toBe(raw);
        expect(rows[0].question).not.toMatch(/murphy|john|example\.ie|4567/i);
        expect(rows[0].question).toContain('[customer]');
    });

    it('never caches a question that had anything to scrub', async () => {
        const { service, cacheGet, cachePut } = build();

        await service.ask(input('Is Krugerrand VAT free?'), ACTOR);

        expect(cacheGet).not.toHaveBeenCalled();
        expect(cachePut).not.toHaveBeenCalled();
    });
});

describe('AskService answer cache', () => {
    it('serves a repeat question, even with different capitals and punctuation, from the cache at zero cost', async () => {
        const { service, requests, rows } = build();

        const first = await service.ask(input(QUESTION), ACTOR);
        const second = await service.ask(
            input('do we charge VAT on silver'),
            ACTOR,
        );

        expect(requests).toHaveLength(1);
        expect(first.cached).toBe(false);
        expect(second).toMatchObject({
            cached: true,
            status: 'answered',
            answer: first.answer,
            citations: first.citations,
            usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 },
        });
        expect(rows[1]).toMatchObject({
            cached: true,
            costMicros: 0,
            status: 'answered',
        });
    });

    it('caches a refusal too, but never an uncited answer', async () => {
        const refused = build({
            replies: [result('NO_ANSWER: Ask a manager.')],
        });
        await refused.service.ask(input('How much up front?'), ACTOR);
        expect(refused.cachePut).toHaveBeenCalledTimes(1);

        const uncited = build({ replies: [UNCITED, UNCITED] });
        await uncited.service.ask(input(QUESTION), ACTOR);
        expect(uncited.cachePut).not.toHaveBeenCalled();
    });

    it('stores an answer with the configured time to live', async () => {
        const { service, cachePut } = build();

        await service.ask(input(QUESTION), ACTOR);

        expect(cachePut).toHaveBeenCalledWith(
            'do we charge vat on silver',
            expect.stringMatching(/^[0-9a-f]{16}$/),
            expect.objectContaining({ status: 'answered' }),
            7,
        );
    });

    it('does not cache an answer that itself contains something to scrub', async () => {
        const { service, cachePut } = build({
            replies: [result('Ask Bartholomew about it [[pricing#vat]].')],
        });

        await service.ask(input(QUESTION), ACTOR);

        expect(cachePut).not.toHaveBeenCalled();
    });
});

describe('AskService.askStream', () => {
    it('streams the answer in pieces, then a final validated response', async () => {
        const { service } = build();

        const events = await collect(service.askStream(input(QUESTION), ACTOR));

        const deltas = events.filter((e) => e.type === 'delta');
        expect(deltas.length).toBeGreaterThan(1);
        expect(deltas.map((e) => (e as { text: string }).text).join('')).toBe(
            CITED.text,
        );
        expect(events[events.length - 1]).toMatchObject({
            type: 'done',
            response: { status: 'answered', cached: false },
        });
    });

    it('streams nothing of a refusal, only its final response', async () => {
        const { service } = build({
            replies: [result('NO_ANSWER: Not covered. Ask a manager.')],
        });

        const events = await collect(service.askStream(input(QUESTION), ACTOR));

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({
            type: 'done',
            response: { status: 'refused' },
        });
    });

    it('sends a single done event for a cached answer, without streaming', async () => {
        const { service } = build();
        await service.ask(input(QUESTION), ACTOR);

        const events = await collect(service.askStream(input(QUESTION), ACTOR));

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({
            type: 'done',
            response: { cached: true },
        });
    });

    it('releases the slot if the reader stops early', async () => {
        const { service, release } = build();
        const stream = service.askStream(input(QUESTION), ACTOR);

        await stream.next(); // first delta
        await stream.return(undefined); // the browser went away

        expect(release).toHaveBeenCalledTimes(1);
    });
});

describe('AskService when the model call fails', () => {
    it.each([
        ['unavailable', ServiceUnavailableException],
        ['rate_limited', ServiceUnavailableException],
        ['out_of_credit', ServiceUnavailableException],
        ['misconfigured', ServiceUnavailableException],
        ['rejected', UnprocessableEntityException],
    ] as const)(
        'turns a %s failure into the right plain error',
        async (kind, expected) => {
            jest.spyOn(Logger.prototype, 'error').mockImplementation(
                () => undefined,
            );
            jest.spyOn(Logger.prototype, 'warn').mockImplementation(
                () => undefined,
            );
            const { service } = build({
                replies: [new LlmError(kind, 'sk-proj-SECRET-vendor-detail')],
            });

            const failure = await service
                .ask(input('VAT?'), ACTOR)
                .catch((error: Error) => error);

            expect(failure).toBeInstanceOf(expected);
            // Whatever the vendor said (keys, account ids) must not reach the caller.
            expect((failure as Error).message).not.toContain('SECRET');
            jest.restoreAllMocks();
        },
    );

    it('lets an unexpected error through unchanged', async () => {
        const { service } = build({ replies: [new TypeError('bug')] });
        await expect(service.ask(input('VAT?'), ACTOR)).rejects.toThrow('bug');
    });
});

describe('AskService.status', () => {
    it('reports whether the assistant is on, and its model', () => {
        expect(build({ enabled: false }).service.status()).toEqual({
            enabled: false,
            model: 'fake-model',
        });
        expect(build({ enabled: true }).service.status()).toEqual({
            enabled: true,
            model: 'fake-model',
        });
    });
});

describe('AskService.ask retry', () => {
    it('retries once, without streaming, when the first answer is uncited, and adds up the tokens and cost', async () => {
        const { service, requests, rows } = build({
            replies: [UNCITED, CITED],
        });

        const response = await service.ask(input(QUESTION), ACTOR);

        expect(requests.map((r) => r.kind)).toEqual(['stream', 'generate']);
        expect(response.status).toBe('answered');
        expect(response.usage.inputTokens).toBe(14000);
        expect(rows[0]).toMatchObject({ retried: true, costMicros: 8160 });
        expect(requests[1].request.user).toContain(QUESTION);
        expect(requests[1].request.user).toContain('Reminder: cite');
    });

    it('keeps the first answer, still flagged, when the retry is uncited too, and does not retry twice', async () => {
        const { service, requests } = build({ replies: [UNCITED, UNCITED] });

        const response = await service.ask(input(QUESTION), ACTOR);

        expect(requests).toHaveLength(2);
        expect(response.status).toBe('uncited');
    });

    it('does not retry a cited answer or a refusal', async () => {
        const cited = build({ replies: [CITED] });
        await cited.service.ask(input(QUESTION), ACTOR);
        expect(cited.requests).toHaveLength(1);

        const refused = build({
            replies: [result('NO_ANSWER: Ask a manager.')],
        });
        await refused.service.ask(input('How much up front?'), ACTOR);
        expect(refused.requests).toHaveLength(1);
    });
});

const CALL_PRICE = {
    id: 'call_1',
    name: 'findProductPrices',
    arguments: '{"query":"100g gold bar"}',
};
const toolRound = (...calls: (typeof CALL_PRICE)[]) =>
    result('', { toolCalls: calls });

const PRICE_DATA = {
    matchCount: 1,
    quantity: 1,
    spot: [
        {
            metal: 'GOLD',
            eurPerTroyOunce: 3000,
            mayBeOutOfDate: false,
            asOfIrishTime: '01 Oct, 11:00',
        },
    ],
    products: [{ name: '100g Gold Bar', price: 10120, buyback: 9780 }],
};

describe('AskService live lookups', () => {
    it('runs the lookups the model asks for, sends their results back, and answers from them', async () => {
        const { service, requests, executed } = build({
            replies: [
                toolRound(CALL_PRICE),
                result('A 100g gold bar is €10,120 (taken 01 Oct, 11:00).'),
            ],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(
            input('How much is a 100g gold bar?'),
            ACTOR,
        );

        expect(executed).toEqual([CALL_PRICE]);
        expect(requests).toHaveLength(2);
        // The tools are offered, and the second call carries the model's request and our result.
        expect(requests[0].request.tools).toHaveLength(1);
        const turns = requests[1].request.turns ?? [];
        expect(turns.map((t) => t.role)).toEqual(['assistant', 'tool']);
        expect(turns[1]).toMatchObject({
            role: 'tool',
            toolCallId: 'call_1',
        });
        expect(response).toMatchObject({
            answer: 'A 100g gold bar is €10,120 (taken 01 Oct, 11:00).',
            status: 'answered',
            toolsUsed: ['findProductPrices'],
            warnings: [],
        });
    });

    it('treats an answer made only of live figures as answered, with no citation and no retry', async () => {
        const { service, requests } = build({
            replies: [toolRound(CALL_PRICE), result('€10,120.')],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input('100g gold bar?'), ACTOR);

        expect(response.status).toBe('answered');
        expect(response.citations).toEqual([]);
        expect(requests.map((r) => r.kind)).toEqual(['stream', 'stream']);
    });

    it('adds up the tokens and cost of every round', async () => {
        const { service, rows } = build({
            replies: [toolRound(CALL_PRICE), result('€10,120.')],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input('100g gold bar?'), ACTOR);

        expect(response.usage.inputTokens).toBe(14000);
        expect(rows[0]).toMatchObject({
            costMicros: 8160,
            toolNames: ['findProductPrices'],
        });
    });

    it('tells the stream when a lookup starts', async () => {
        const { service } = build({
            replies: [toolRound(CALL_PRICE), result('€10,120.')],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const events = await collect(
            service.askStream(input('100g gold bar?'), ACTOR),
        );

        expect(events.filter((e) => e.type === 'tool')).toEqual([
            { type: 'tool', name: 'findProductPrices' },
        ]);
    });

    it('stops looking things up after three rounds and withdraws the tools so the model must answer', async () => {
        const { service, requests } = build({
            replies: [
                toolRound(CALL_PRICE),
                toolRound(CALL_PRICE),
                toolRound(CALL_PRICE),
                result('Here is what I found: €10,120.'),
            ],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input('100g gold bar?'), ACTOR);

        expect(requests).toHaveLength(4);
        expect(requests[3].request.tools).toBeUndefined();
        expect(response.answer).toContain('€10,120');
    });

    it('passes the dashboard spot overrides through to the lookups, with the time', async () => {
        const { service, executeTool } = build({
            replies: [toolRound(CALL_PRICE), result('€10,120.')],
            toolData: { findProductPrices: PRICE_DATA },
        });

        await service.ask(
            {
                question: '100g gold bar?',
                mode: 'procedures',
                spotOverrides: { GOLD: 3100 },
            },
            ACTOR,
        );

        const context = executeTool.mock.calls[0][1] as {
            spotOverrides: unknown;
            now: Date;
        };
        expect(context.spotOverrides).toEqual({ GOLD: 3100 });
        expect(context.now).toBeInstanceOf(Date);
    });

    it('never caches an answer that used a live lookup: prices move', async () => {
        const { service, cachePut } = build({
            replies: [toolRound(CALL_PRICE), result('€10,120.')],
            toolData: { findProductPrices: PRICE_DATA },
        });

        await service.ask(input('100g gold bar?'), ACTOR);

        expect(cachePut).not.toHaveBeenCalled();
    });
});

describe('AskService figure check', () => {
    it('flags a euro amount that no lookup, question or procedure supplied', async () => {
        const { service } = build({
            replies: [
                toolRound(CALL_PRICE),
                result('A 100g gold bar is €10,500 today.'),
            ],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input('100g gold bar?'), ACTOR);

        expect(response.warnings).toEqual([
            expect.stringContaining('€10,500 was not given by a price lookup'),
        ]);
    });

    it('does not flag amounts that came from the lookup', async () => {
        const { service } = build({
            replies: [
                toolRound(CALL_PRICE),
                result('Price €10,120, buyback €9,780.'),
            ],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input('100g gold bar?'), ACTOR);

        expect(response.warnings).toEqual([]);
    });

    it('warns when the spot behind a price may be out of date, saying when it was taken', async () => {
        const stale = {
            ...PRICE_DATA,
            spot: [
                {
                    mayBeOutOfDate: true,
                    asOfIrishTime: '01 Oct, 09:00',
                    eurPerTroyOunce: 3000,
                },
            ],
        };
        const { service } = build({
            replies: [toolRound(CALL_PRICE), result('€10,120.')],
            toolData: { findProductPrices: stale },
        });

        const response = await service.ask(input('100g gold bar?'), ACTOR);

        expect(response.warnings).toEqual([
            expect.stringMatching(/may be out of date \(taken 01 Oct, 09:00\)/),
        ]);
    });

    it('does not cache an SOP answer that carries a warning', async () => {
        const { service, cachePut } = build({
            replies: [
                result('Silver has 23% VAT [[pricing#vat]] and costs €777.'),
            ],
        });

        const response = await service.ask(input(QUESTION), ACTOR);

        expect(response.warnings).toHaveLength(1);
        expect(cachePut).not.toHaveBeenCalled();
    });
});

describe('AskService reply drafts', () => {
    const EMAIL =
        'Hi, I would like a price for a 100g gold bar please. Anna Murphy, anna@example.ie';
    const DRAFT = [
        'Subject: Your enquiry',
        '',
        'Hello Anna,',
        '',
        'A 100g gold bar is €10,120 (taken 01 Oct, 11:00).',
        '',
        'Kind regards,',
        '[Your name]',
        'Merrion Gold',
        '---NOTES---',
        '- Customer wants a 100g gold bar price.',
        '- Silver VAT [[pricing#vat]].',
    ].join('\n');

    it('puts the mode instructions after the shared prompt, and gives a draft room to be longer', async () => {
        const { service, requests } = build({
            replies: [toolRound(CALL_PRICE), result(DRAFT)],
            toolData: { findProductPrices: PRICE_DATA },
        });

        await service.ask(input(EMAIL, 'email'), ACTOR);

        const { system, maxOutputTokens } = requests[0].request;
        expect(system).toContain('Silver carries 23% VAT.');
        expect(system.indexOf('Silver carries 23% VAT.')).toBeLessThan(
            system.indexOf('draft an EMAIL reply'),
        );
        expect(maxOutputTokens).toBe(900);
    });

    it('returns the message to send and the staff notes separately', async () => {
        const { service } = build({
            replies: [toolRound(CALL_PRICE), result(DRAFT)],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input(EMAIL, 'email'), ACTOR);

        expect(response.mode).toBe('email');
        expect(response.status).toBe('answered');
        expect(response.answer.startsWith('Subject: Your enquiry')).toBe(true);
        expect(response.answer).not.toContain('NOTES');
        expect(response.notes).toContain(
            'Customer wants a 100g gold bar price.',
        );
        expect(response.citations).toHaveLength(1);
        expect(response.toolsUsed).toEqual(['findProductPrices']);
        expect(response.warnings).toEqual([]);
    });

    it('flags an invented price in a draft before it can reach a customer', async () => {
        const { service } = build({
            replies: [
                toolRound(CALL_PRICE),
                result(DRAFT.replace('€10,120', '€9,999')),
            ],
            toolData: { findProductPrices: PRICE_DATA },
        });

        const response = await service.ask(input(EMAIL, 'email'), ACTOR);

        expect(response.warnings[0]).toContain('€9,999');
    });

    it('never caches or looks up a draft, never retries it for lacking citations, and keeps only a placeholder of the message', async () => {
        const { service, cacheGet, cachePut, requests, rows } = build({
            replies: [result('Hello Anna, thanks for your message.')],
        });

        const response = await service.ask(input(EMAIL, 'whatsapp'), ACTOR);

        expect(response.status).toBe('answered');
        expect(cacheGet).not.toHaveBeenCalled();
        expect(cachePut).not.toHaveBeenCalled();
        expect(requests).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            mode: 'whatsapp',
            question: `(whatsapp reply request, ${EMAIL.length} characters)`,
        });
        expect(rows[0].question).not.toMatch(/anna|murphy|example\.ie/i);
    });

    it('streams the draft as it is written, and replaces it with the split version at the end', async () => {
        const { service } = build({ replies: [result(DRAFT)] });

        const events = await collect(
            service.askStream(input(EMAIL, 'email'), ACTOR),
        );

        const streamed = events
            .filter((e) => e.type === 'delta')
            .map((e) => (e as { text: string }).text)
            .join('');
        expect(streamed).toBe(DRAFT);
        const last = events.at(-1) as Extract<AskEvent, { type: 'done' }>;
        expect(last.type).toBe('done');
        expect(last.response.answer).not.toContain('NOTES');
    });

    it('says so, rather than showing a blank, when the model writes nothing to send', async () => {
        const { service } = build({
            replies: [result('---NOTES---\n- unclear')],
        });

        const response = await service.ask(input(EMAIL, 'email'), ACTOR);

        expect(response.status).toBe('refused');
        expect(response.answer).toMatch(/could not draft/i);
    });
});
