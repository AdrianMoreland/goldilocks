import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import { BranchSchema } from '@goldilocks/shared-types';
import type { Branch, CreateBranchRequest, CreateUserRequest } from '@goldilocks/shared-types';

const CronStatusResponseSchema = z.object({ running: z.boolean() });
const MessageResponseSchema = z.object({ message: z.string() });
const SessionUserResponseSchema = z.object({ id: z.string() }).passthrough();

/** Admin Panel actions — every call here is gated server-side by JwtAuthGuard + RolesGuard('admin'). */
export function useAdminApi() {
    const client = useApiClient();

    return {
        getCronStatus: () => client.get('/metals/cron-status', CronStatusResponseSchema),
        toggleCron: () => client.post('/metals/cron-toggle', {}, CronStatusResponseSchema),
        clearPriceCache: () => client.post('/metals/clear-cache', {}, MessageResponseSchema),

        getBranches: () => client.get('/branches', z.array(BranchSchema)),
        createBranch: (body: CreateBranchRequest): Promise<Branch> => client.post('/branches', body, BranchSchema),

        createUser: (body: CreateUserRequest) => client.post('/auth/admin/users', body, SessionUserResponseSchema),
    };
}
