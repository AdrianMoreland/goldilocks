import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useKnowledgeApi } from '@/api/knowledge.api';
import { queryKeys } from '@/lib/query-keys';
import { buildLibrary } from '@/app/knowledge/utils/library';

/**
 * The Knowledge Center's data: every SOP the signed-in user may read, parsed
 * once into sections, links and a search index. SOPs change rarely (an import
 * or an approval), so a few minutes of staleness is fine.
 */
export function useKnowledgeLibrary() {
    const { listDocuments } = useKnowledgeApi();

    const query = useQuery({
        queryKey: queryKeys.knowledge.documents,
        queryFn: listDocuments,
        staleTime: 5 * 60 * 1000,
    });

    const library = useMemo(() => buildLibrary(query.data?.documents ?? []), [query.data]);

    return {
        library,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
