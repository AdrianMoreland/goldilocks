import type { AiAnswerStatus, AiCitation } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export interface CachedAnswer {
    answer: string;
    status: AiAnswerStatus;
    citations: AiCitation[];
    model: string;
}
export declare class AnswerCacheService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    get(questionKey: string, corpusHash: string, now?: Date): Promise<CachedAnswer | null>;
    put(questionKey: string, corpusHash: string, value: CachedAnswer, ttlDays: number, now?: Date): Promise<void>;
    purgeExpired(now?: Date): Promise<number>;
    private warn;
}
//# sourceMappingURL=answer-cache.service.d.ts.map