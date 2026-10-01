import type { AdminLogEntry, AdminOverview, ApiEndpoint, AuditEntry, DbRowsResponse, DbTableSummary } from '@goldilocks/shared-types';
import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { DbDeleteRequestDto, DbInsertRequestDto, DbUpdateRequestDto } from '../../common/dto/dtos';
import { AdminOverviewService } from './admin-overview.service';
import { ApiCatalogueService } from './api-catalogue.service';
import { AuditLogService } from './audit-log.service';
import { DbBrowserService } from './db-browser.service';
export declare class AdminController {
    private readonly overview;
    private readonly logs;
    private readonly catalogue;
    private readonly db;
    constructor(overview: AdminOverviewService, logs: AuditLogService, catalogue: ApiCatalogueService, db: DbBrowserService);
    getOverview(): Promise<AdminOverview>;
    getLogs(limit?: string, level?: string, q?: string): {
        entries: AdminLogEntry[];
        capacity: number;
    };
    getAudit(limit?: string): Promise<{
        entries: AuditEntry[];
        persisted: boolean;
    }>;
    getEndpoints(): {
        endpoints: ApiEndpoint[];
    };
    getTables(): Promise<{
        tables: DbTableSummary[];
    }>;
    getRows(table: string, page?: string, pageSize?: string, sort?: string, dir?: string, q?: string): Promise<DbRowsResponse>;
    insertRow(table: string, body: DbInsertRequestDto, req: RequestWithUser): Promise<{
        row: {
            [x: string]: unknown;
        };
    }>;
    updateRow(table: string, body: DbUpdateRequestDto, req: RequestWithUser): Promise<{
        row: {
            [x: string]: unknown;
        };
    }>;
    deleteRow(table: string, body: DbDeleteRequestDto, req: RequestWithUser): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=admin.controller.d.ts.map