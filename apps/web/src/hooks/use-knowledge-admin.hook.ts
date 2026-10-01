import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { KbStatus, UpdateKbDocumentRequest } from '@goldilocks/shared-types';
import { useKnowledgeApi } from '@/api/knowledge.api';
import { queryKeys } from '@/lib/query-keys';

const STATUS_DONE: Record<KbStatus, string> = {
    approved: 'Approved',
    draft: 'Returned to draft',
    retired: 'Retired',
};

/**
 * Admin actions on a SOP: edit its text, and move it through draft → approved.
 * The server enforces every rule (admin-only, no approval while a [TODO]
 * remains, no edit that would break a link); this just calls it and refreshes
 * the library so the reader shows the new state straight away.
 */
export function useKnowledgeAdmin(slug: string) {
    const { updateDocument, setStatus } = useKnowledgeApi();
    const queryClient = useQueryClient();
    const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.documents });

    const save = useMutation({
        mutationFn: (body: UpdateKbDocumentRequest) => updateDocument(slug, body),
        onSuccess: async (saved) => {
            await refresh();
            toast.success(saved.status === 'draft' ? 'Saved — this procedure needs approving again' : 'Saved');
        },
    });

    const changeStatus = useMutation({
        mutationFn: (status: KbStatus) => setStatus(slug, status),
        onSuccess: async (saved) => {
            await refresh();
            toast.success(`${STATUS_DONE[saved.status]}${saved.status === 'approved' ? ` — now version ${saved.version}` : ''}`);
        },
    });

    return { save, changeStatus };
}
