import { type RoadmapQueueAppended, type RoadmapQueueFiledResult, type RoadmapQueueList, type RoadmapQueueSource } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { RoadmapWriter } from './roadmap-writer';
export declare const queueLine: (at: Date, source: string, text: string) => string;
export declare function cleanQueueText(raw: string): string;
export declare class RoadmapQueueService implements RoadmapWriter {
    private readonly prisma;
    constructor(prisma: PrismaService);
    append(entry: {
        text: string;
        source: RoadmapQueueSource;
    }): Promise<RoadmapQueueAppended>;
    list(): Promise<RoadmapQueueList>;
    pending(): Promise<RoadmapQueueList>;
    markFiled(ids: number[], actor: string): Promise<RoadmapQueueFiledResult>;
}
//# sourceMappingURL=roadmap-queue.service.d.ts.map