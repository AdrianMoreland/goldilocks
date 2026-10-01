import { Injectable, Logger } from '@nestjs/common';
import type { AiMode } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface QuestionLogEntry {
    userId: string;
    /** Already scrubbed of personal details — never pass the raw question. For an email or WhatsApp draft, a placeholder: the customer's message is not kept. */
    question: string;
    mode: AiMode;
    /** The live lookups used (names only, never their results). */
    toolNames: string[];
    status: 'answered' | 'refused' | 'uncited' | 'error';
    cached: boolean;
    retried: boolean;
    citations: string[];
    model: string;
    corpusHash: string;
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    costMicros: number;
    latencyMs: number;
    error?: string;
}

/**
 * Owns the ai_question_logs table: who asked what (scrubbed), what it cost,
 * and how it went. It feeds the daily spend breaker now and the admin
 * reports later. Writing a row must never stop an answer reaching the user,
 * so record() swallows and logs its own failures.
 */
@Injectable()
export class QuestionLogService {
    private readonly logger = new Logger(QuestionLogService.name);

    constructor(private readonly prisma: PrismaService) {}

    async record(entry: QuestionLogEntry): Promise<void> {
        try {
            await this.prisma.aiQuestionLog.create({ data: entry });
        } catch (error) {
            this.logger.warn(
                `Could not write the question log: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /** Total spend since `start`, in micro-dollars. Throws if the database is unreachable: a breaker that cannot count must not guess "zero". */
    async spentSince(start: Date): Promise<number> {
        const total = await this.prisma.aiQuestionLog.aggregate({
            _sum: { costMicros: true },
            where: { createdAt: { gte: start } },
        });
        return total._sum.costMicros ?? 0;
    }

    async purgeOlderThan(cutoff: Date): Promise<number> {
        const { count } = await this.prisma.aiQuestionLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
        return count;
    }
}
