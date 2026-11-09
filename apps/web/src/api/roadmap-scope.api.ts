import { useApiClient } from '@/api/api-client';
import {
    RoadmapQueueAppendedSchema,
    RoadmapQueueListSchema,
    RoadmapScopeRefreshSchema,
    RoadmapScopeSchema,
} from '@goldilocks/shared-types';

/**
 * The roadmap kept as scope files in the roadmap repository (read only here) and the queue of notes
 * that a laptop session turns into inbox lines. Admin only on the server too.
 */
export function useRoadmapScopeApi() {
    const client = useApiClient();

    return {
        getScope: () => client.get('/roadmap/scope', RoadmapScopeSchema),
        refreshScope: () => client.post('/roadmap/scope/refresh', {}, RoadmapScopeRefreshSchema),
        getQueue: () => client.get('/roadmap/queue', RoadmapQueueListSchema),
        addToQueue: (text: string) => client.post('/roadmap/queue', { text }, RoadmapQueueAppendedSchema),
    };
}
