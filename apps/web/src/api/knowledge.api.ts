// src/api/knowledge.api.ts
import { useApiClient } from '@/api/api-client';
import {
    KbDocumentListResponseSchema,
    KbDocumentSchema,
    type KbStatus,
    type UpdateKbDocumentRequest,
} from '@goldilocks/shared-types';

/** Knowledge Center — the SOPs. The set is small, so it is fetched whole and searched locally. */
export function useKnowledgeApi() {
    const client = useApiClient();

    return {
        listDocuments: () => client.get('/knowledge/documents', KbDocumentListResponseSchema),

        // Admin-only — gated server-side by JwtAuthGuard + RolesGuard('admin').
        updateDocument: (slug: string, body: UpdateKbDocumentRequest) =>
            client.patch(`/knowledge/documents/${slug}`, body, KbDocumentSchema),
        setStatus: (slug: string, status: KbStatus) =>
            client.post(`/knowledge/documents/${slug}/status`, { status }, KbDocumentSchema),
    };
}
