import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { OpenAiLlmClient } from '../src/infrastructure/llm/openai-llm.client';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { AiSettings } from '../src/modules/ai/ai.settings';
import type { AnswerCacheService } from '../src/modules/ai/answer-cache.service';
import { AskService } from '../src/modules/ai/ask.service';
import { costMicros } from '../src/modules/ai/cost.calculator';
import type { QuestionLogService } from '../src/modules/ai/question-log.service';
import type { QuotaService } from '../src/modules/ai/quota.service';
import {
    GOLDEN_QUESTIONS,
    type GoldenCase,
} from '../src/modules/ai/eval/golden-questions';
import { fixtureMarketData } from '../src/modules/ai/eval/price-fixture';
import { FullCorpusContext } from '../src/modules/ai/sop-context.provider';
import { FindProductPricesTool } from '../src/modules/ai/tools/find-product-prices.tool';
import { GetSpotTool } from '../src/modules/ai/tools/get-spot.tool';
import { ToolRegistry } from '../src/modules/ai/tools/tool.registry';
import { KnowledgeService } from '../src/modules/knowledge/knowledge.service';

/**
 * Runs the golden questions through the REAL model and the approved SOPs in
 * the database, and reports which ones behave. It spends a few cents of the
 * OpenAI budget (about 14 short calls), so it only runs when asked:
 *
 *   pnpm --filter api ai:eval             # every case
 *   pnpm --filter api ai:eval cash-over   # cases whose id contains the text
 *
 * Built by hand rather than through Nest's container: it only needs Prisma,
 * the SOPs and the model. The quota, answer cache and question log are
 * deliberately switched off here: a test run must not use up anyone's daily
 * allowance, be answered from a cache (it would test nothing), or write rows.
 */

const noQuota = {
    acquire: async () => ({ release: async () => undefined }),
} as unknown as QuotaService;
const noCache = {
    get: async () => null,
    put: async () => undefined,
} as unknown as AnswerCacheService;
const noLog = {
    record: async () => undefined,
    spentSince: async () => 0,
} as unknown as QuestionLogService;
const EVAL_ACTOR = { id: 'ai-eval', email: 'ai-eval' };

function check(
    golden: GoldenCase,
    response: Awaited<ReturnType<AskService['ask']>>,
): string[] {
    const problems: string[] = [];

    if (!golden.status.includes(response.status)) {
        problems.push(
            `status was "${response.status}", expected ${golden.status.join(' or ')}`,
        );
    }
    if (golden.citesAny) {
        const hit = response.citations.some((citation) =>
            golden.citesAny!.some(
                (wanted) =>
                    wanted.slug === citation.slug &&
                    (!wanted.anchor || wanted.anchor === citation.anchor),
            ),
        );
        if (!hit) {
            const wanted = golden.citesAny
                .map((c) => `${c.slug}${c.anchor ? `#${c.anchor}` : ''}`)
                .join(' | ');
            const got =
                response.citations
                    .map((c) => `${c.slug}${c.anchor ? `#${c.anchor}` : ''}`)
                    .join(', ') || 'none';
            problems.push(`expected a citation of ${wanted}; got ${got}`);
        }
    }
    for (const tool of golden.toolsUsed ?? []) {
        if (!response.toolsUsed.includes(tool))
            problems.push(
                `expected the ${tool} lookup to be used; used ${response.toolsUsed.join(', ') || 'none'}`,
            );
    }
    if (golden.noWarnings && response.warnings.length > 0) {
        problems.push(`unexpected warnings: ${response.warnings.join(' | ')}`);
    }
    if (
        golden.maxAnswerLength &&
        response.answer.length > golden.maxAnswerLength
    ) {
        problems.push(
            `answer is ${response.answer.length} characters; expected at most ${golden.maxAnswerLength}`,
        );
    }
    for (const pattern of golden.notesMustMatch ?? []) {
        if (!pattern.test(response.notes ?? ''))
            problems.push(`notes should match ${pattern}`);
    }
    for (const pattern of golden.mustMatch ?? []) {
        if (!pattern.test(response.answer))
            problems.push(`answer should match ${pattern}`);
    }
    for (const pattern of golden.mustNotMatch ?? []) {
        if (pattern.test(response.answer))
            problems.push(`answer must not match ${pattern}`);
    }
    return problems;
}

async function main() {
    // Running this script is the explicit opt-in to spend tokens.
    process.env.AI_ENABLED = 'true';
    process.env.NODE_ENV = 'production'; // PrismaService logs every query in development

    const filter = process.argv[2];
    const cases = GOLDEN_QUESTIONS.filter(
        (golden) => !filter || golden.id.includes(filter),
    );
    if (cases.length === 0) {
        console.error(`No golden question id contains "${filter}".`);
        process.exit(1);
    }

    const config = new ConfigService();
    const prisma = new PrismaService(config);
    await prisma.$connect();

    try {
        const llm = new OpenAiLlmClient(config);
        const settings = new AiSettings(config);
        // The real price tools over a fixed catalogue: matching and totals are exercised, and the expected figures are known.
        const market = fixtureMarketData();
        const tools = new ToolRegistry([
            new GetSpotTool(market),
            new FindProductPricesTool(market),
        ]);
        const service = new AskService(
            llm,
            new FullCorpusContext(new KnowledgeService(prisma)),
            settings,
            noQuota,
            noCache,
            noLog,
            tools,
        );

        let failed = 0;
        let inputTokens = 0;
        let cachedTokens = 0;
        let outputTokens = 0;
        let micros = 0;
        let corpus = '';

        console.log(`Model: ${llm.model}\n`);

        for (const golden of cases) {
            try {
                const response = await service.ask(
                    {
                        question: golden.question,
                        mode: golden.mode ?? 'procedures',
                        spotOverrides: golden.spotOverrides,
                    },
                    EVAL_ACTOR,
                );
                const problems = check(golden, response);
                inputTokens += response.usage.inputTokens;
                cachedTokens += response.usage.cachedInputTokens;
                outputTokens += response.usage.outputTokens;
                micros += costMicros(
                    response.model,
                    response.usage,
                    settings.priceOverride,
                );
                corpus = `${response.corpus.documents} approved SOPs, corpus ${response.corpus.hash}`;

                console.log(
                    `${problems.length === 0 ? 'PASS' : 'FAIL'}  ${golden.id}  [${response.mode} ${response.status}${response.toolsUsed.length ? `, ${response.toolsUsed.join('+')}` : ''}, ${response.latencyMs} ms]`,
                );
                console.log(`      Q: ${golden.question}`);
                console.log(
                    `      A: ${response.answer.replace(/\s+/g, ' ').slice(0, 280)}`,
                );
                if (response.notes) {
                    console.log(
                        `      notes: ${response.notes.replace(/\s+/g, ' ').slice(0, 200)}`,
                    );
                }
                for (const warning of response.warnings)
                    console.log(`      ⚠ ${warning}`);
                for (const problem of problems)
                    console.log(`      ✗ ${problem}`);
                console.log('');
                if (problems.length > 0) failed += 1;
            } catch (error) {
                failed += 1;
                console.log(
                    `FAIL  ${golden.id}  threw: ${error instanceof Error ? error.message : String(error)}\n`,
                );
            }
        }

        console.log(
            `${cases.length - failed}/${cases.length} passed — ${corpus}`,
        );
        console.log(
            `Tokens: ${inputTokens} in (${cachedTokens} cached), ${outputTokens} out — about $${(micros / 1_000_000).toFixed(4)}`,
        );
        process.exitCode = failed === 0 ? 0 : 1;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
