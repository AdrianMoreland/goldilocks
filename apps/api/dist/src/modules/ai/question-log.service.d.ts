import type { AiMode } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export interface QuestionLogEntry {
    userId: string;
    question: string;
    mode: AiMode;
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
export declare class QuestionLogService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    record(entry: QuestionLogEntry): Promise<void>;
    spentSince(start: Date): Promise<number>;
    purgeOlderThan(cutoff: Date): Promise<number>;
}
//# sourceMappingURL=question-log.service.d.ts.map