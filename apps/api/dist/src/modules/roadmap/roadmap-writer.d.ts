import type { RoadmapQueueAppended, RoadmapQueueSource } from '@goldilocks/shared-types';
export interface RoadmapWriter {
    append(entry: {
        text: string;
        source: RoadmapQueueSource;
    }): Promise<RoadmapQueueAppended>;
}
export declare const ROADMAP_WRITER: unique symbol;
//# sourceMappingURL=roadmap-writer.d.ts.map