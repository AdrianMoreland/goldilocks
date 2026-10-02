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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskService = void 0;
const common_1 = require("@nestjs/common");
const llm_port_1 = require("../../infrastructure/llm/llm.port");
const ai_settings_1 = require("./ai.settings");
const amount_check_1 = require("./amount-check");
const answer_cache_service_1 = require("./answer-cache.service");
const answer_interpreter_1 = require("./answer-interpreter");
const cost_calculator_1 = require("./cost.calculator");
const draft_interpreter_1 = require("./draft-interpreter");
const dublin_day_1 = require("./dublin-day");
const privacy_scrubber_1 = require("./privacy-scrubber");
const prompt_builder_1 = require("./prompt-builder");
const question_log_service_1 = require("./question-log.service");
const quota_service_1 = require("./quota.service");
const refusal_gate_1 = require("./refusal-gate");
const sop_context_provider_1 = require("./sop-context.provider");
const tool_facts_1 = require("./tools/tool-facts");
const tool_registry_1 = require("./tools/tool.registry");
const NO_PROCEDURES = 'No procedures are approved yet, so there is nothing to answer from. Ask a manager.';
const NO_DRAFT = 'The assistant could not draft a reply to that. Try again, or write the reply yourself.';
const CITATION_REMINDER = 'Reminder: cite the section you rely on as [[slug#section]], using only sections shown in the procedures. If no procedure covers this, reply with NO_ANSWER: and one short sentence.';
const MAX_TOOL_ROUNDS = 3;
const DRAFT_MIN_OUTPUT_TOKENS = 900;
const NO_USAGE = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
function addUsage(a, b) {
    return {
        inputTokens: a.inputTokens + b.inputTokens,
        cachedInputTokens: a.cachedInputTokens + b.cachedInputTokens,
        outputTokens: a.outputTokens + b.outputTokens,
    };
}
let AskService = AskService_1 = class AskService {
    llm;
    context;
    settings;
    quota;
    cache;
    questionLog;
    tools;
    logger = new common_1.Logger(AskService_1.name);
    constructor(llm, context, settings, quota, cache, questionLog, tools) {
        this.llm = llm;
        this.context = context;
        this.settings = settings;
        this.quota = quota;
        this.cache = cache;
        this.questionLog = questionLog;
        this.tools = tools;
    }
    status() {
        return { enabled: this.settings.enabled, model: this.llm.model };
    }
    async ask(input, actor, signal) {
        for await (const event of this.askStream(input, actor, signal)) {
            if (event.type === 'done')
                return event.response;
        }
        throw new common_1.ServiceUnavailableException('The assistant did not produce an answer.');
    }
    async *askStream(input, actor, signal) {
        if (!this.settings.enabled) {
            throw new common_1.ServiceUnavailableException('The assistant is switched off.');
        }
        const { question, mode } = input;
        const isDraft = mode !== 'procedures';
        const slot = await this.quota.acquire(actor.id);
        const started = Date.now();
        let loggedQuestion = '';
        let corpusHash = '';
        try {
            const prompt = await this.context.load(question);
            corpusHash = prompt.corpusHash;
            const corpus = { documents: prompt.documents, hash: corpusHash };
            const scrubbed = (0, privacy_scrubber_1.scrubPersonalData)(question, prompt.vocabulary);
            loggedQuestion = isDraft
                ? `(${mode} reply request, ${question.length} characters)`
                : scrubbed.text;
            const cacheKey = isDraft || scrubbed.redacted
                ? null
                : (0, privacy_scrubber_1.normaliseQuestion)(question);
            const finish = async (result) => {
                const latencyMs = Date.now() - started;
                const cached = result.cached ?? false;
                const retried = result.retried ?? false;
                const toolsUsed = result.toolsUsed ?? [];
                const cost = cached
                    ? 0
                    : (0, cost_calculator_1.costMicros)(result.model, result.usage, this.settings.priceOverride);
                await this.questionLog.record({
                    userId: actor.id,
                    question: loggedQuestion,
                    mode,
                    toolNames: toolsUsed,
                    status: result.status,
                    cached,
                    retried,
                    citations: result.citations.map((c) => `${c.slug}${c.anchor ? `#${c.anchor}` : ''}`),
                    model: result.model,
                    corpusHash,
                    inputTokens: result.usage.inputTokens,
                    cachedInputTokens: result.usage.cachedInputTokens,
                    outputTokens: result.usage.outputTokens,
                    costMicros: cost,
                    latencyMs,
                });
                this.logger.log(`[ai] ${actor.email}: ${mode} ${result.status}${cached ? ' (cached)' : ''}${retried ? ' (after retry)' : ''}${toolsUsed.length ? ` tools=${toolsUsed.join(',')}` : ''}, ${result.citations.length} citation(s), tokens in/cached/out ${result.usage.inputTokens}/${result.usage.cachedInputTokens}/${result.usage.outputTokens}, ${latencyMs} ms, corpus ${corpusHash}`);
                return {
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
            const system = `${prompt.systemPrompt}\n\n${(0, prompt_builder_1.modeInstructions)(mode)}`;
            const maxOutputTokens = isDraft
                ? Math.max(this.settings.maxOutputTokens, DRAFT_MIN_OUTPUT_TOKENS)
                : this.settings.maxOutputTokens;
            const toolContext = {
                spotOverrides: input.spotOverrides ?? {},
                now: new Date(),
            };
            const toolSpecs = this.tools.specs();
            const turns = [];
            const toolResults = [];
            const toolsUsed = [];
            const gate = isDraft ? null : new refusal_gate_1.RefusalGate();
            let usage = NO_USAGE;
            let result;
            for (let round = 0;; round++) {
                const lastRound = round >= MAX_TOOL_ROUNDS;
                let step;
                for await (const event of this.llm.stream({
                    system,
                    user: question,
                    maxOutputTokens,
                    tools: lastRound ? undefined : toolSpecs,
                    turns,
                    signal,
                })) {
                    if (event.type === 'delta') {
                        const visible = gate
                            ? gate.push(event.text)
                            : event.text;
                        if (visible)
                            yield { type: 'delta', text: visible };
                    }
                    else {
                        step = event.result;
                    }
                }
                if (!step) {
                    throw new llm_port_1.LlmError('unavailable', 'The model stream ended without a result.');
                }
                usage = addUsage(usage, step.usage);
                const calls = step.toolCalls ?? [];
                if (calls.length === 0 || lastRound) {
                    result = { ...step, usage };
                    break;
                }
                turns.push({
                    role: 'assistant',
                    content: step.text,
                    toolCalls: calls,
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
            if (tail)
                yield { type: 'delta', text: tail };
            const facts = (0, tool_facts_1.collectFacts)(toolResults);
            const checkFigures = (text) => {
                const allowed = new Set([
                    ...facts.numbers,
                    ...(0, amount_check_1.numbersIn)(question),
                    ...(0, amount_check_1.numbersIn)(prompt.systemPrompt),
                ]);
                const unverified = (0, amount_check_1.findUnverifiedAmounts)(text, allowed);
                const warnings = [];
                if (unverified.length > 0) {
                    warnings.push(`${unverified.join(', ')} ${unverified.length > 1 ? 'were' : 'was'} not given by a price lookup. Check ${unverified.length > 1 ? 'them' : 'it'} before relying on it.`);
                }
                return warnings;
            };
            const spotNote = (0, tool_facts_1.describeSpotNote)(facts);
            if (isDraft) {
                const draft = (0, draft_interpreter_1.interpretDraft)(result.text, prompt);
                const response = await finish({
                    status: draft.message ? 'answered' : 'refused',
                    answer: draft.message || NO_DRAFT,
                    citations: draft.citations,
                    model: result.model,
                    usage: result.usage,
                    notes: draft.notes,
                    warnings: checkFigures(`${draft.message}\n${draft.notes ?? ''}`),
                    toolsUsed,
                    spotNote,
                });
                yield { type: 'done', response };
                return;
            }
            let interpreted = (0, answer_interpreter_1.interpretAnswer)(result.text, prompt);
            if (interpreted.status === 'uncited' && toolsUsed.length > 0) {
                interpreted = { ...interpreted, status: 'answered' };
            }
            let retried = false;
            if (interpreted.status === 'uncited') {
                retried = true;
                const second = await this.llm.generate({
                    system,
                    user: `${question}\n\n${CITATION_REMINDER}`,
                    maxOutputTokens,
                    signal,
                });
                const again = (0, answer_interpreter_1.interpretAnswer)(second.text, prompt);
                result = {
                    ...second,
                    usage: addUsage(result.usage, second.usage),
                };
                if (again.status !== 'uncited')
                    interpreted = again;
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
            if (cacheKey &&
                toolsUsed.length === 0 &&
                warnings.length === 0 &&
                interpreted.status !== 'uncited' &&
                !(0, privacy_scrubber_1.scrubPersonalData)(interpreted.answer, prompt.vocabulary)
                    .redacted) {
                await this.cache.put(cacheKey, corpusHash, {
                    answer: interpreted.answer,
                    status: interpreted.status,
                    citations: interpreted.citations,
                    model: result.model,
                }, this.settings.cacheTtlDays);
            }
            yield { type: 'done', response };
        }
        catch (error) {
            await this.logFailure(actor, mode, loggedQuestion, corpusHash, started, error, signal);
            throw this.toHttpError(error);
        }
        finally {
            await slot.release();
        }
    }
    async assertUnderBudget() {
        const spent = await this.questionLog.spentSince((0, dublin_day_1.startOfDublinDay)(new Date()));
        if (spent >= (0, cost_calculator_1.usdToMicros)(this.settings.dailyBudgetUsd)) {
            this.logger.error(`The assistant's daily budget of $${this.settings.dailyBudgetUsd} has been reached; it is paused until tomorrow.`);
            throw new common_1.ServiceUnavailableException('The assistant is paused for today: its daily spending limit has been reached. It resumes tomorrow.');
        }
    }
    async logFailure(actor, mode, question, corpusHash, started, error, signal) {
        if (!(error instanceof llm_port_1.LlmError) && !signal?.aborted)
            return;
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
            inputTokens: 0,
            cachedInputTokens: 0,
            outputTokens: 0,
            costMicros: 0,
            latencyMs: Date.now() - started,
            error: signal?.aborted
                ? 'cancelled'
                : error instanceof llm_port_1.LlmError
                    ? error.kind
                    : 'unknown',
        });
    }
    toHttpError(error) {
        if (!(error instanceof llm_port_1.LlmError))
            return error instanceof Error ? error : new Error(String(error));
        switch (error.kind) {
            case 'misconfigured':
                this.logger.error(`The assistant is misconfigured: ${error.message}`);
                return new common_1.ServiceUnavailableException('The assistant is not set up correctly. An admin needs to check its configuration.');
            case 'out_of_credit':
                this.logger.error(`The assistant's OpenAI account is out of credit: ${error.message}`);
                return new common_1.ServiceUnavailableException('The assistant is unavailable: its OpenAI account has no credit left. An admin needs to top it up.');
            case 'rejected':
                return new common_1.UnprocessableEntityException('The assistant could not handle that question. Try rephrasing it.');
            case 'rate_limited':
            case 'unavailable':
                return new common_1.ServiceUnavailableException('The assistant is busy or unreachable right now. Try again shortly.');
        }
    }
};
exports.AskService = AskService;
exports.AskService = AskService = AskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(llm_port_1.LLM_PROVIDER)),
    __param(1, (0, common_1.Inject)(sop_context_provider_1.SOP_CONTEXT)),
    __metadata("design:paramtypes", [Object, Object, ai_settings_1.AiSettings,
        quota_service_1.QuotaService,
        answer_cache_service_1.AnswerCacheService,
        question_log_service_1.QuestionLogService,
        tool_registry_1.ToolRegistry])
], AskService);
//# sourceMappingURL=ask.service.js.map