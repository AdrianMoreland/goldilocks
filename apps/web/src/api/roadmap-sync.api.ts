import { useApiClient } from '@/api/api-client';
import { RoadmapSyncStatusSchema } from '@goldilocks/shared-types';

/** How the app's roadmap compares with docs/ROADMAP.md on master (admin only on the server too). */
export function useRoadmapSyncApi() {
    const client = useApiClient();

    return {
        getSyncStatus: () => client.get('/roadmap/sync', RoadmapSyncStatusSchema),
    };
}
