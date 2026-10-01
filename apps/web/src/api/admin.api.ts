import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    AdminLogsResponseSchema,
    AdminOverviewSchema,
    ApiCatalogueSchema,
    AuditLogResponseSchema,
    BranchSchema,
    DbRowResponseSchema,
    DbRowsResponseSchema,
    DbTablesResponseSchema,
    ErrorLogEntrySchema,
    FetchAttemptSchema,
    FetchMetricsSchema,
    RawSpotPriceSchema,
} from '@goldilocks/shared-types';
import type { Branch, CreateBranchRequest, CreateUserRequest, LogLevel, MetalType } from '@goldilocks/shared-types';

const CronStatusResponseSchema = z.object({ running: z.boolean() });
const MessageResponseSchema = z.object({ message: z.string() });
const SessionUserResponseSchema = z.object({ id: z.string() }).passthrough();
const ErrorLogResponseSchema = z.object({ entries: z.array(ErrorLogEntrySchema), persisted: z.boolean() });

/** Admin Panel actions — every call here is gated server-side by JwtAuthGuard + RolesGuard('admin'). */
export function useAdminApi() {
    const client = useApiClient();

    return {
        getCronStatus: () => client.get('/metals/cron-status', CronStatusResponseSchema),
        toggleCron: () => client.post('/metals/cron-toggle', {}, CronStatusResponseSchema),
        refreshPrices: () => client.post('/metals/refresh', {}, z.array(RawSpotPriceSchema)),
        clearPriceCache: () => client.post('/metals/clear-cache', {}, MessageResponseSchema),

        getBranches: () => client.get('/branches', z.array(BranchSchema)),
        createBranch: (body: CreateBranchRequest): Promise<Branch> => client.post('/branches', body, BranchSchema),

        createUser: (body: CreateUserRequest) => client.post('/auth/admin/users', body, SessionUserResponseSchema),

        getFetchLog: (limit = 5) => client.get(`/metals/fetch-log?limit=${limit}`, z.array(FetchAttemptSchema)),
        getFetchMetrics: () => client.get('/metals/fetch-metrics', FetchMetricsSchema),
        retryMetal: (metal: MetalType) => client.post(`/metals/${metal}/retry`, {}, RawSpotPriceSchema),

        getErrorLog: (limit = 200) => client.get(`/errors?limit=${limit}`, ErrorLogResponseSchema),
        clearErrorLog: () => client.del('/errors', MessageResponseSchema),

        getOverview: () => client.get('/admin/overview', AdminOverviewSchema),
        getLogs: (level: LogLevel, q: string, limit = 300) =>
            client.get(`/admin/logs?level=${level}&limit=${limit}&q=${encodeURIComponent(q)}`, AdminLogsResponseSchema),
        getAudit: () => client.get('/admin/audit?limit=200', AuditLogResponseSchema),
        getEndpoints: () => client.get('/admin/endpoints', ApiCatalogueSchema),

        getDbTables: () => client.get('/admin/db/tables', DbTablesResponseSchema),
        getDbRows: (table: string, page: number, sort: string, dir: 'asc' | 'desc', q: string, pageSize = 50) =>
            client.get(
                `/admin/db/tables/${encodeURIComponent(table)}/rows?page=${page}&pageSize=${pageSize}&dir=${dir}${sort ? `&sort=${encodeURIComponent(sort)}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`,
                DbRowsResponseSchema,
            ),
        insertDbRow: (table: string, values: Record<string, unknown>) =>
            client.post(`/admin/db/tables/${encodeURIComponent(table)}/rows`, { values }, DbRowResponseSchema),
        updateDbRow: (table: string, key: Record<string, string | number>, values: Record<string, unknown>) =>
            client.patch(`/admin/db/tables/${encodeURIComponent(table)}/rows`, { key, values }, DbRowResponseSchema),
        deleteDbRow: (table: string, key: Record<string, string | number>) =>
            client.del(`/admin/db/tables/${encodeURIComponent(table)}/rows`, MessageResponseSchema, { key }),
    };
}
