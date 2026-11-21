import { z } from 'zod';
import {
    AdminUserListSchema,
    PermissionMatrixSchema,
    type CreateUserRequest,
    type InviteUserRequest,
    type SetOverridesRequest,
    type UpdatePermissionMatrixRequest,
    type UpdateUserRequest,
} from '@goldilocks/shared-types';
import { useApiClient } from '@/api/api-client';

const CreatedUserSchema = z.object({ id: z.string() }).passthrough();

/** Admin → People and Roles & permissions. Every write needs a reason; the server audit-logs it. */
export function usePeopleApi() {
    const client = useApiClient();
    const none = z.unknown();
    return {
        list: () => client.get('/admin/users', AdminUserListSchema),
        update: (id: string, body: UpdateUserRequest) => client.patch(`/admin/users/${id}`, body, none),
        setOverrides: (id: string, body: SetOverridesRequest) => client.put(`/admin/users/${id}/overrides`, body, none),
        matrix: () => client.get('/admin/permissions', PermissionMatrixSchema),
        setMatrix: (body: UpdatePermissionMatrixRequest) => client.put('/admin/permissions', body, none),
        create: (body: CreateUserRequest) => client.post('/auth/admin/users', body, CreatedUserSchema),
        invite: (body: InviteUserRequest) => client.post('/auth/admin/users/invite', body, CreatedUserSchema),
    };
}
