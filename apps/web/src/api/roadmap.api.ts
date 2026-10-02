import { useApiClient } from '@/api/api-client';
import { RoadmapDocumentSchema, type RoadmapEditRequest } from '@goldilocks/shared-types';

/** The roadmap Markdown behind the Project Management page (admin only on the server too). */
export function useRoadmapApi() {
    const client = useApiClient();

    return {
        getRoadmap: () => client.get('/roadmap', RoadmapDocumentSchema),
        editRoadmap: (body: RoadmapEditRequest) => client.post('/roadmap/edit', body, RoadmapDocumentSchema),
    };
}
