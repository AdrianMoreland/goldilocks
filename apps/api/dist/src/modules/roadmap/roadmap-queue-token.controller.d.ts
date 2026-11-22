import { ConfigService } from '@nestjs/config';
import { RoadmapQueueFiledRequestDto, RoadmapQueueRequestDto } from '../../common/dto/dtos';
import { RoadmapQueueService } from './roadmap-queue.service';
import { type RoadmapWriter } from './roadmap-writer';
export declare class RoadmapQueueTokenController {
    private readonly config;
    private readonly queue;
    private readonly writer;
    constructor(config: ConfigService, queue: RoadmapQueueService, writer: RoadmapWriter);
    private require;
    intake(token: string | undefined, body: RoadmapQueueRequestDto): Promise<{
        id: number;
        line: string;
    }>;
    pending(token: string | undefined): Promise<{
        entries: {
            id: number;
            text: string;
            source: "phone" | "web";
            status: "new" | "filed";
            line: string;
            createdAt: string;
            filedAt: string | null;
        }[];
    }>;
    filed(token: string | undefined, body: RoadmapQueueFiledRequestDto): Promise<{
        filed: number;
    }>;
}
//# sourceMappingURL=roadmap-queue-token.controller.d.ts.map