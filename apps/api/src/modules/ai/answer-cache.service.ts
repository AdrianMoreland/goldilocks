import { Injectable, Logger } from '@nestjs/common';
import type { AiAnswerStatus, AiCitation } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface CachedAnswer {
    answer: string;
    status: AiAnswerStatus;
    citations: AiCitation[];
    model: string;
}

/**
 * Owns the ai_answer_cache table: a repeat question, asked word for word,
 * is answered from here at zero token cost. The key includes the SOP-set
 * hash, so approving or editing any SOP stops old answers being served.
 * It is an optimisation only: any failure here degrades to "no cache".
 */
@Injectable()
export class AnswerCacheService {
    private readonly logger = new Logger(AnswerCacheService.name);

    constructor(private readonly prisma: PrismaService) {}

    async get(
        questionKey: string,
        corpusHash: string,
        now = new Date(),
    ): Promise<CachedAnswer | null> {
        try {
            const row = await this.prisma.aiAnswerCache.findUnique({
                where: { questionKey_corpusHash: { questionKey, corpusHash } },
            });
            if (!row || row.expiresAt <= now) return null;

            await this.prisma.aiAnswerCache.update({
                where: { id: row.id },
                data: { hits: { increment: 1 } },
            });
            return {
                answer: row.answer,
                status: row.status as AiAnswerStatus,
                citations: row.citations as unknown as AiCitation[],
                model: row.model,
            };
        } catch (error) {
            this.warn('read', error);
            return null;
        }
    }

    async put(
        questionKey: string,
        corpusHash: string,
        value: CachedAnswer,
        ttlDays: number,
        now = new Date(),
    ): Promise<void> {
        const data = {
            answer: value.answer,
            status: value.status,
            citations: value.citations as unknown as object,
            model: value.model,
            expiresAt: new Date(now.getTime() + ttlDays * DAY_MS),
        };
        try {
            await this.prisma.aiAnswerCache.upsert({
                where: { questionKey_corpusHash: { questionKey, corpusHash } },
                create: { questionKey, corpusHash, ...data },
                update: { ...data, hits: 0, createdAt: now },
            });
        } catch (error) {
            this.warn('write', error);
        }
    }

    async purgeExpired(now = new Date()): Promise<number> {
        const { count } = await this.prisma.aiAnswerCache.deleteMany({
            where: { expiresAt: { lt: now } },
        });
        return count;
    }

    private warn(action: string, error: unknown) {
        this.logger.warn(
            `Answer cache ${action} failed: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}
