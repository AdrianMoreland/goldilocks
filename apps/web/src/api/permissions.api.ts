import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PermissionListSchema, type PermissionKey } from '@goldilocks/shared-types';
import { useApiClient } from '@/api/api-client';
import { useAuth } from '@/contexts/auth-context';
import { queryKeys } from '@/lib/query-keys';

/** The signed-in person's permissions. Only hides what the server would refuse anyway. */
export function useMyPermissions() {
    const client = useApiClient();
    const { isAuthenticated, user } = useAuth();
    const query = useQuery({
        queryKey: queryKeys.permissions.me(user?.id ?? ''),
        queryFn: () => client.get('/permissions/me', PermissionListSchema),
        enabled: isAuthenticated,
        staleTime: 60_000,
    });
    // An admin holds every permission, so their menu does not wait for (or flicker on) the request.
    const isAdmin = user?.admin === true;
    const can = useCallback(
        (key: PermissionKey) => isAdmin || (query.data ?? []).includes(key),
        [isAdmin, query.data],
    );
    return { ...query, can };
}
