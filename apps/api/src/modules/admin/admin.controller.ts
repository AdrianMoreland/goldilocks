import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    AdminLogEntry,
    AdminOverview,
    ApiEndpoint,
    AuditEntry,
    DbRowsResponse,
    DbTableSummary,
    LogLevel,
} from '@goldilocks/shared-types';
import {
    JwtAuthGuard,
    type RequestWithUser,
} from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    DbDeleteRequestDto,
    DbInsertRequestDto,
    DbUpdateRequestDto,
} from '../../common/dto/dtos';
import { AdminOverviewService } from './admin-overview.service';
import { ApiCatalogueService } from './api-catalogue.service';
import { AuditLogService } from './audit-log.service';
import { DbBrowserService } from './db-browser.service';
import { logBuffer } from './log-buffer';

const LEVEL_ORDER: LogLevel[] = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
];

/** The admin console API. Class-level guards: every route here needs an admin, and a new route can't forget it. */
@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
    constructor(
        private readonly overview: AdminOverviewService,
        private readonly logs: AuditLogService,
        private readonly catalogue: ApiCatalogueService,
        private readonly db: DbBrowserService,
    ) {}

    @Get('overview')
    @ApiOperation({
        summary: 'System health, 24h traffic, storage and error counts',
    })
    getOverview(): Promise<AdminOverview> {
        return this.overview.build();
    }

    @Get('logs')
    @ApiOperation({
        summary: 'Recent application log lines (pino), newest first',
    })
    getLogs(
        @Query('limit') limit?: string,
        @Query('level') level?: string,
        @Query('q') q?: string,
    ): { entries: AdminLogEntry[]; capacity: number } {
        const min = LEVEL_ORDER.indexOf((level as LogLevel) ?? 'info');
        const term = q?.trim().toLowerCase();
        const n = Math.min(Math.max(Number(limit) || 200, 1), 1000);

        const entries = logBuffer
            .recent(logBuffer.capacity)
            .filter((e) => LEVEL_ORDER.indexOf(e.level) >= Math.max(min, 0))
            .filter(
                (e) =>
                    !term ||
                    [e.message, e.context, e.url, e.method].some((v) =>
                        v?.toLowerCase().includes(term),
                    ),
            )
            .slice(0, n);
        return { entries, capacity: logBuffer.capacity };
    }

    @Get('audit')
    @ApiOperation({ summary: 'Recent changes made from the admin console' })
    getAudit(
        @Query('limit') limit?: string,
    ): Promise<{ entries: AuditEntry[]; persisted: boolean }> {
        return this.logs.getRecent(
            Math.min(Math.max(Number(limit) || 100, 1), 500),
        );
    }

    @Get('endpoints')
    @ApiOperation({ summary: 'Every API route, for the endpoint tester' })
    getEndpoints(): { endpoints: ApiEndpoint[] } {
        return { endpoints: this.catalogue.list() };
    }

    @Get('db/tables')
    @ApiOperation({
        summary: 'Tables in the public schema, with size and row count',
    })
    async getTables(): Promise<{ tables: DbTableSummary[] }> {
        return { tables: await this.db.listTables() };
    }

    @Get('db/tables/:table/rows')
    @ApiOperation({ summary: 'One page of rows from a table' })
    getRows(
        @Param('table') table: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('sort') sort?: string,
        @Query('dir') dir?: string,
        @Query('q') q?: string,
    ): Promise<DbRowsResponse> {
        return this.db.getRows(table, {
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 50,
            sort,
            dir: dir === 'asc' ? 'asc' : 'desc',
            search: q,
        });
    }

    @Post('db/tables/:table/rows')
    @ApiOperation({ summary: 'Insert a row (writable tables only)' })
    async insertRow(
        @Param('table') table: string,
        @Body() body: DbInsertRequestDto,
        @Req() req: RequestWithUser,
    ) {
        return {
            row: await this.db.insert(table, body.values, req.user.email),
        };
    }

    @Patch('db/tables/:table/rows')
    @ApiOperation({
        summary: 'Update a row by primary key (writable tables only)',
    })
    async updateRow(
        @Param('table') table: string,
        @Body() body: DbUpdateRequestDto,
        @Req() req: RequestWithUser,
    ) {
        return {
            row: await this.db.update(
                table,
                body.key,
                body.values,
                req.user.email,
            ),
        };
    }

    @Delete('db/tables/:table/rows')
    @ApiOperation({
        summary: 'Delete a row by primary key (writable tables only)',
    })
    async deleteRow(
        @Param('table') table: string,
        @Body() body: DbDeleteRequestDto,
        @Req() req: RequestWithUser,
    ) {
        await this.db.remove(table, body.key, req.user.email);
        return { message: 'Row deleted' };
    }
}
