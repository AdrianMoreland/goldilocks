import { useApiClient } from '@/api/api-client';
import {
    RoadmapPullResultSchema,
    RoadmapPushResultSchema,
    RoadmapSyncStatusSchema,
    type RoadmapPullRequest,
    type RoadmapPushRequest,
} from '@goldilocks/shared-types';

/** How the app's roadmap compares with docs/ROADMAP.md on master (admin only on the server too). */
export function useRoadmapSyncApi() {
    const client = useApiClient();

    return {
        getSyncStatus: () => client.get('/roadmap/sync', RoadmapSyncStatusSchema),
        pull: (body: RoadmapPullRequest) => client.post('/roadmap/sync/pull', body, RoadmapPullResultSchema),
        push: (body: RoadmapPushRequest) => client.post('/roadmap/sync/push', body, RoadmapPushResultSchema),
    };
}
