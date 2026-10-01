import type { DbRowsResponse, DbTableSummary } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { AuditLogService } from './audit-log.service';
type Key = Record<string, string | number>;
type Json = Record<string, unknown>;
export declare class DbBrowserService {
    private readonly prisma;
    private readonly redis;
    private readonly audit;
    constructor(prisma: PrismaService, redis: RedisService, audit: AuditLogService);
    listTables(): Promise<DbTableSummary[]>;
    databaseBytes(): Promise<number>;
    getRows(table: string, options: {
        page: number;
        pageSize: number;
        sort?: string;
        dir: 'asc' | 'desc';
        search?: string;
    }): Promise<DbRowsResponse>;
    insert(table: string, values: Json, actor: string): Promise<Json>;
    update(table: string, key: Key, values: Json, actor: string): Promise<Json>;
    remove(table: string, key: Key, actor: string): Promise<void>;
    private columnsOf;
    private enumValues;
    private writableColumns;
    private settableNames;
    private typeOf;
    private keyClause;
    private afterWrite;
}
export {};
//# sourceMappingURL=db-browser.service.d.ts.map