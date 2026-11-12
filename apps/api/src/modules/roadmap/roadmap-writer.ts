import type {
    RoadmapQueueAppended,
    RoadmapQueueSource,
} from '@goldilocks/shared-types';

/**
 * The one way anything outside a laptop session adds to the roadmap: it queues a dated note, nothing else.
 * Ids, priority and effort are assigned later when a laptop session triages the note. The page and the
 * endpoints depend only on this interface, so the implementation can change (today a database queue; later
 * a direct write to the roadmap repository with a server token) without touching them.
 */
export interface RoadmapWriter {
    append(entry: {
        text: string;
        source: RoadmapQueueSource;
    }): Promise<RoadmapQueueAppended>;
}

export const ROADMAP_WRITER = Symbol('ROADMAP_WRITER');
