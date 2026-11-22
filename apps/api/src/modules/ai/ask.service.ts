import {
    Inject,
    Injectable,
    Logger,
    ServiceUnavailableException,
    UnprocessableEntityException,
} from '@nestjs/common';
import type {
    AiAnswerStatus,
    AiCitation,
    AiMode,
    AiStatus,
    AskResponse,
    RecalculateOverrides,
} from '@goldilocks/shared-types';
import {
    LLM_PROVIDER,
    LlmError,
    type LlmPort,
    type LlmResult,
    type LlmTurn,
} from '../../infrastructure/llm/llm.port';
import { AiSettings } from './ai.settings';
import { findUnverifiedAmounts, numbersIn } from './amount-check';
import { AnswerCacheService } from './answer-cache.service';
import { interpretAnswer } from './answer-interpreter';
import { costMicros, usdToMicros } from './cost.calculator';
import { interpretDraft } from './draft-interpreter';
import { dublinDate, startOfDublinDay } from './dublin-day';
import { normaliseQuestion, scrubPersonalData } from './privacy-scrubber';
import { modeInstructions } from './prompt-builder';
import { QuestionLogService } from './question-log.service';
import { QuotaService } from './quota.service';
import { RefusalGate } from './refusal-gate';
import { SOP_CONTEXT, type SopContextProvider } from './sop-context.provider';
import type { AiToolContext } from './tools/ai-tool.port';
import { collectFacts, describeSpotNote } from './tools/tool-facts';
import { ToolRegistry } from './tools/tool.registry';

const NO_PROCEDURES =
    'No procedures are approved yet, so there is nothing to answer from. Ask a manager.';
const NO_DRAFT =
    'The assistant could not draft a reply to that. Try again, or write the reply yourself.';

const CITATION_REMINDER =
    'Reminder: cite the section you rely on as [[slug#section]], using only sections shown in the procedures. If no procedure covers this, reply with NO_ANSWER: and one short sentence.';

/**
 * Hard cap on model calls for one message, counting tool rounds and the
 * citation retry. A customer asking about four products needs four lookups,
 * which the model may make in one round or several; the last allowed call
 * withdraws the lookups so it has to answer. Nothing can loop.
 */
export const MAX_MODEL_CALLS = 4;
/** Today's spend above this share of the daily limit is logged as a warning. */
const BUDGET_WARNING_SHARE = 0.8;

const NO_USAGE: LlmResult['usage'] = {
    inputTokens: 0,
    cachedInputTokens: 0,
    cacheWriteInputTokens: 0,
    outputTokens: 0,
};

function addUsage(
    a: LlmResult['usage'],
    b: LlmResult['usage'],
): LlmResult['usage'] {
    return {
        inputTokens: a.inputTokens + b.inputTokens,
        cachedInputTokens: a.cachedInputTokens + b.cachedInputTokens,
        cacheWriteInputTokens:
            (a.cacheWriteInputTokens ?? 0) + (b.cacheWriteInputTokens ?? 0),
        outputTokens: a.outputTokens + b.outputTokens,
    };
}

export interface Actor {
    id: string;
    email: string;
}

/** What a staff member asked for. */
export interface AskInput {
    /** A question, or the customer's pasted message for email and WhatsApp. */
    question: string;
    mode: AiMode;
    /** The spot the dashboard's product table is quoting from, where they froze or typed one. */
    spotOverrides?: RecalculateOverrides;
}

/** What askStream() yields: pieces of the answer as they arrive, a note when a lookup starts, then the final, validated response. */
export type AskEvent =
    | { type: 'delta'; text: string }
    | { type: 'tool'; name: string }
    | { type: 'done'; response: AskResponse };

/**
 * The "ask" use case. It coordinates; every decision lives in a collaborator
 * it is given - the model behind LlmPort, the SOPs behind SopContextProvider,
 * the live lookups in ToolRegistry, the answer rules in interpretAnswer and
 * interpretDraft, the limits in QuotaService, the privacy rules in
 * scrubPersonalData.
 *
 * Order matters (docs/AI-AGENT-PLAN.md §4): per-user limits first (cheap, and
 * they stop abuse before anything else runs), then the answer cache (free),
 * then the daily spend breaker, and only then the model.
 */
@Injectable()
export class AskService {
    private readonly logger = new Logger(AskService.name);
    /** The Dublin day the 80%-of-budget warning was last logged. */
    private budgetWarnedOn: string | null = null;

    constructor(
        @Inject(LLM_PROVIDER) private readonly llm: LlmPort,
        @Inject(SOP_CONTEXT) private readonly context: SopContextProvider,
        private readonly settings: AiSettings,
        private readonly quota: QuotaService,
        private readonly cache: AnswerCacheService,
        private readonly questionLog: QuestionLogService,
        private readonly tools: ToolRegistry,
    ) {}

    status(): AiStatus {
        return { enabled: this.settings.enabled, model: this.llm.model };
    }

    /** The whole answer at once - what the evaluation script and simple clients use. */
    async ask(
        input: AskInput,
        actor: Actor,
        signal?: AbortSignal,
    ): Promise<AskResponse> {
        for await (const event of this.askStream(input, actor, signal)) {
            if (event.type === 'done') return event.response;
        }
        throw new ServiceUnavailableException(
            'The assistant did not produce an answer.',
        );
    }

    async *askStream(
        input: AskInput,
        actor: Actor,
        signal?: AbortSignal,
    ): AsyncGenerator<AskEvent> {
        if (!this.settings.enabled) {
            throw new ServiceUnavailableException(
                'The assistant is switched off.',
            );
        }

        const { question, mode } = input;
        const isDraft = mode !== 'procedures';

        const slot = await this.quota.acquire(actor.id);
        const started = Date.now();
        // What is known so far, so a failure can still be logged with the right question and corpus.
        let loggedQuestion = '';
        let corpusHash = '';
        // What the model calls have cost so far, priced call by call (a vendor's long-prompt rate applies per
        // call, never to the sum), so a failure part-way through is still charged to the daily budget.
        let spentUsage: LlmResult['usage'] = NO_USAGE;
        let spentMicros = 0;
        const charge = (model: string, usage: LlmResult['usage']) => {
            spentUsage = addUsage(spentUsage, usage);
            spentMicros += costMicros(
                model,
                usage,
                this.settings.priceOverride,
            );
        };

        try {
            const prompt = await this.context.load(question);
            corpusHash = prompt.corpusHash;
            const corpus = { documents: prompt.documents, hash: corpusHash };

            // Personal details are removed before a question is stored or used as a cache key.
            const scrubbed = scrubPersonalData(question, prompt.vocabulary);
            // A pasted customer message is correspondence, not a question: only a placeholder is kept.
            loggedQuestion = isDraft
                ? `(${mode} reply request, ${question.length} characters)`
                : scrubbed.text;
            // Never cached: a draft (it is for one customer and carries live prices), and a question with anything
            // redacted ("Is [customer] VAT free?" could stand for two different products).
            const cacheKey =
                isDraft || scrubbed.redacted
                    ? null
                    : normaliseQuestion(question);

            const finish = async (result: {
                status: AiAnswerStatus;
                answer: string;
                citations: AiCitation[];
                model: string;
                usage: LlmResult['usage'];
                cached?: boolean;
                retried?: boolean;
                notes?: string | null;
                warnings?: string[];
                toolsUsed?: string[];
                spotNote?: AskResponse['spotNote'];
            }): Promise<AskResponse> => {
                const latencyMs = Date.now() - started;
                const cached = result.cached ?? false;
                const retried = result.retried ?? false;
                const toolsUsed = result.toolsUsed ?? [];
                const cost = cached ? 0 : spentMicros;
                const questionId = await this.questionLog.record({
                    userId: actor.id,
                    question: loggedQuestion,
                    mode,
                    toolNames: toolsUsed,
                    status: result.status,
                    cached,
                    retried,
                    citations: result.citations.map(
                        (c) => `${c.slug}${c.anchor ? `#${c.anchor}` : ''}`,
                    ),
                    model: result.model,
                    corpusHash,
                    inputTokens: result.usage.inputTokens,
                    cachedInputTokens: result.usage.cachedInputTokens,
                    outputTokens: result.usage.outputTokens,
                    costMicros: cost,
                    latencyMs,
                });
                // The question text is deliberately not logged: staff may type a customer's name into it.
                this.logger.log(
                    `[ai] ${actor.email}: ${mode} ${result.status}${cached ? ' (cached)' : ''}${retried ? ' (after retry)' : ''}${toolsUsed.length ? ` tools=${toolsUsed.join(',')}` : ''}, ${result.citations.length} citation(s), tokens in/cached/written/out ${result.usage.inputTokens}/${result.usage.cachedInputTokens}/${result.usage.cacheWriteInputTokens ?? 0}/${result.usage.outputTokens}, ${latencyMs} ms, corpus ${corpusHash}`,
                );
                return {
                    questionId,
                    answer: result.answer,
                    mode,
                    status: result.status,
                    citations: result.citations,
                    model: result.model,
                    usage: result.usage,
                    latencyMs,
                    corpus,
                    cached,
                    notes: result.notes ?? null,
                    warnings: result.warnings ?? [],
                    spotNote: result.spotNote ?? null,
                    toolsUsed,
                };
            };

            // Nothing approved means nothing to answer from - don't pay for a model call to say so.
            if (prompt.documents === 0) {
                yield {
                    type: 'done',
                    response: await finish({
                        status: 'refused',
                        answer: NO_PROCEDURES,
                        citations: [],
                        model: this.llm.model,
                        usage: NO_USAGE,
                    }),
                };
                return;
            }

            if (cacheKey) {
                const hit = await this.cache.get(cacheKey, corpusHash);
                if (hit) {
                    yield {
                        type: 'done',
                        response: await finish({
                            status: hit.status,
                            answer: hit.answer,
                            citations: hit.citations,
                            model: hit.model,
                            usage: NO_USAGE,
                            cached: true,
                        }),
                    };
                    return;
                }
            }

            await this.assertUnderBudget();

            // The rules and SOPs come first and never change, so the vendor's prompt cache reuses them; what the
            // staff member wants this time is last.
            const system = `${prompt.systemPrompt}\n\n${modeInstructions(mode)}`;
            const maxOutputTokens = isDraft
                ? Math.max(
                      this.settings.maxOutputTokens,
                      this.settings.draftMaxOutputTokens,
                  )
                : this.settings.maxOutputTokens;
            const toolContext: AiToolContext = {
                spotOverrides: input.spotOverrides ?? {},
                now: new Date(),
            };
            const toolSpecs = this.tools.specs();

            const turns: LlmTurn[] = [];
            const toolResults: unknown[] = [];
            const toolsUsed: string[] = [];
            // A refusal starts with a marker that is an instruction to the server, so its first characters are held back.
            const gate = isDraft ? null : new RefusalGate();
            let result: LlmResult | undefined;
            let modelCalls = 0;

            for (;;) {
                // On the last allowed call the lookups are withdrawn (still declared, so the cached prefix is
                // unchanged), and the model has to answer with what it has.
                const lastRound = modelCalls >= MAX_MODEL_CALLS - 1;
                let step: LlmResult | undefined;

                modelCalls += 1;
                for await (const event of this.llm.stream({
                    system,
                    user: question,
                    maxOutputTokens,
                    tools: toolSpecs,
                    toolChoice: lastRound ? 'none' : 'auto',
                    turns,
                    signal,
                })) {
                    if (event.type === 'delta') {
                        const visible = gate
                            ? gate.push(event.text)
                            : event.text;
                        if (visible) yield { type: 'delta', text: visible };
                    } else {
                        step = event.result;
                    }
                }
                if (!step) {
                    throw new LlmError(
                        'unavailable',
                        'The model stream ended without a result.',
                    );
                }

                charge(step.model, step.usage);
                const calls = step.toolCalls ?? [];
                if (calls.length === 0 || lastRound) {
                    result = { ...step, usage: spentUsage };
                    break;
                }

                turns.push({
                    role: 'assistant',
                    content: step.text,
                    toolCalls: calls,
                    replay: step.replay,
                });
                for (const call of calls) {
                    yield { type: 'tool', name: call.name };
                    const outcome = await this.tools.execute(call, toolContext);
                    if (!toolsUsed.includes(call.name)) {
                        toolsUsed.push(call.name);
                    }
                    toolResults.push(outcome.data);
                    turns.push({
                        role: 'tool',
                        toolCallId: call.id,
                        content: outcome.content,
                    });
                }
            }
            const tail = gate?.flush();
            if (tail) yield { type: 'delta', text: tail };

            // What the answer is allowed to say about money: figures a lookup returned, plus those already in the
            // question or the procedures. Anything else is flagged for the staff member to check.
            const facts = collectFacts(toolResults);
            const checkFigures = (text: string): string[] => {
                const allowed = new Set<number>([
                    ...facts.numbers,
                    ...numbersIn(question),
                    ...numbersIn(prompt.systemPrompt),
                ]);
                const unverified = findUnverifiedAmounts(text, allowed);
                const warnings: string[] = [];
                if (unverified.length > 0) {
                    warnings.push(
                        `${unverified.join(', ')} ${unverified.length > 1 ? 'were' : 'was'} not given by a price lookup. Check ${unverified.length > 1 ? 'them' : 'it'} before relying on it.`,
                    );
                }
                return warnings;
            };

            const spotNote = describeSpotNote(facts);

            if (isDraft) {
                const draft = interpretDraft(result.text, prompt);
                const response = await finish({
                    status: draft.message ? 'answered' : 'refused',
                    answer: draft.message || NO_DRAFT,
                    citations: draft.citations,
                    model: result.model,
                    usage: result.usage,
                    notes: draft.notes,
                    warnings: checkFigures(
                        `${draft.message}\n${draft.notes ?? ''}`,
                    ),
                    toolsUsed,
                    spotNote,
                });
                yield { type: 'done', response };
                return;
            }

            let interpreted = interpretAnswer(result.text, prompt);
            // An answer made of live figures cites no procedure, and that is correct.
            if (interpreted.status === 'uncited' && toolsUsed.length > 0) {
                interpreted = { ...interpreted, status: 'answered' };
            }

            // One retry, only for an answer that cited nothing valid: the model usually fixes it when reminded, and the prefix is cached so it is cheap.
            let retried = false;
            if (
                interpreted.status === 'uncited' &&
                modelCalls < MAX_MODEL_CALLS
            ) {
                retried = true;
                modelCalls += 1;
                const second = await this.llm.generate({
                    system,
                    user: `${question}\n\n${CITATION_REMINDER}`,
                    maxOutputTokens,
                    // Declared but not callable: the same prefix as the first call, so it is read from the cache.
                    tools: toolSpecs,
                    toolChoice: 'none',
                    signal,
                });
                charge(second.model, second.usage);
                const again = interpretAnswer(second.text, prompt);
                result = { ...second, usage: spentUsage };
                // Keep the retry only if it improved things; otherwise the first, uncited answer stands and still carries its warning.
                if (again.status !== 'uncited') interpreted = again;
            }

            const warnings = checkFigures(interpreted.answer);
            const response = await finish({
                status: interpreted.status,
                answer: interpreted.answer,
                citations: interpreted.citations,
                model: result.model,
                usage: result.usage,
                retried,
                warnings,
                toolsUsed,
                spotNote,
            });

            // Only clean, settled, SOP-only answers are kept: nothing that used a live lookup (prices move), nothing
            // flagged, nothing the scrubber would redact, and never an uncited one.
            if (
                cacheKey &&
                toolsUsed.length === 0 &&
                warnings.length === 0 &&
                interpreted.status !== 'uncited' &&
                !scrubPersonalData(interpreted.answer, prompt.vocabulary)
                    .redacted
            ) {
                await this.cache.put(
                    cacheKey,
                    corpusHash,
                    {
                        answer: interpreted.answer,
                        status: interpreted.status,
                        citations: interpreted.citations,
                        model: result.model,
                    },
                    this.settings.cacheTtlDays,
                );
            }

            yield { type: 'done', response };
        } catch (error) {
            if (error instanceof LlmError && error.usage) {
                charge(error.model ?? this.llm.model, error.usage);
            }
            await this.logFailure(
                actor,
                mode,
                loggedQuestion,
                corpusHash,
                started,
                error,
                { usage: spentUsage, micros: spentMicros },
                signal,
            );
            throw this.toHttpError(error);
        } finally {
            await slot.release();
        }
    }

    /** Pauses the assistant - not the app - once today's spend reaches the configured ceiling. */
    private async assertUnderBudget(): Promise<void> {
        let spent: number;
        try {
            spent = await this.questionLog.spentSince(
                startOfDublinDay(new Date()),
            );
        } catch (error) {
            // A breaker that cannot count must not guess "zero": refuse, as the per-user limits do without Redis.
            this.logger.error(
                `Today's assistant spend could not be read, so the assistant refused: ${error instanceof Error ? error.message : String(error)}`,
            );
            throw new ServiceUnavailableException(
                "The assistant is unavailable right now: its spending limit can't be checked. Try again shortly.",
            );
        }
        const limit = usdToMicros(this.settings.dailyBudgetUsd);
        const today = dublinDate(new Date());
        if (
            spent >= limit * BUDGET_WARNING_SHARE &&
            spent < limit &&
            this.budgetWarnedOn !== today
        ) {
            // Once a day per API process, not on every question.
            this.budgetWarnedOn = today;
            this.logger.warn(
                `The assistant has spent $${(spent / 1_000_000).toFixed(2)} today, over ${BUDGET_WARNING_SHARE * 100}% of its $${this.settings.dailyBudgetUsd} daily limit.`,
            );
        }
        if (spent >= limit) {
            this.logger.error(
                `The assistant's daily budget of $${this.settings.dailyBudgetUsd} has been reached; it is paused until tomorrow.`,
            );
            throw new ServiceUnavailableException(
                'The assistant is paused for today: its daily spending limit has been reached. It resumes tomorrow.',
            );
        }
    }

    private async logFailure(
        actor: Actor,
        mode: AiMode,
        question: string,
        corpusHash: string,
        started: number,
        error: unknown,
        spent: { usage: LlmResult['usage']; micros: number },
        signal?: AbortSignal,
    ): Promise<void> {
        // Refusals by the budget breaker and the like are already HTTP answers, not faults to record.
        if (!(error instanceof LlmError) && !signal?.aborted) return;

        await this.questionLog.record({
            userId: actor.id,
            question,
            mode,
            toolNames: [],
            status: 'error',
            cached: false,
            retried: false,
            citations: [],
            model: this.llm.model,
            corpusHash,
            // Calls that ran before the failure were billed, so they count towards the daily budget.
            inputTokens: spent.usage.inputTokens,
            cachedInputTokens: spent.usage.cachedInputTokens,
            outputTokens: spent.usage.outputTokens,
            costMicros: spent.micros,
            latencyMs: Date.now() - started,
            error: signal?.aborted
                ? 'cancelled'
                : error instanceof LlmError
                  ? error.kind
                  : 'unknown',
        });
    }

    /** Vendor failures become plain, non-leaking HTTP errors; the cause is logged, never shown. */
    private toHttpError(error: unknown): Error {
        if (!(error instanceof LlmError))
            return error instanceof Error ? error : new Error(String(error));

        switch (error.kind) {
            case 'misconfigured':
                this.logger.error(
                    `The assistant is misconfigured: ${error.message}`,
                );
                return new ServiceUnavailableException(
                    'The assistant is not set up correctly. An admin needs to check its configuration.',
                );
            case 'out_of_credit':
                this.logger.error(
                    `The assistant's model account is out of credit: ${error.message}`,
                );
                return new ServiceUnavailableException(
                    'The assistant is unavailable: its model provider account has no credit left. An admin needs to top it up.',
                );
            case 'rejected':
                return new UnprocessableEntityException(
                    'The assistant could not handle that question. Try rephrasing it.',
                );
            case 'rate_limited':
            case 'unavailable':
                return new ServiceUnavailableException(
                    'The assistant is busy or unreachable right now. Try again shortly.',
                );
        }
    }
}
