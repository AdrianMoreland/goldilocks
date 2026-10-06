import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import type {
    DbColumn,
    DbRowsResponse,
    DbTableSummary,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';

// Tables the console may change. Everything else is browse-only: `users` rows
// must stay in step with Supabase Auth ids, and the fetch/AI logs are history
// that nothing should rewrite.
const WRITABLE_TABLES = new Set([
    'products',
    'branches',
    'historic_spot_prices',
    'kb_documents',
]);

// Never sent to the browser, never writable.
const HIDDEN_COLUMNS: Record<string, string[]> = { users: ['password'] };

// Raw SQL skips Prisma's client-side `@updatedAt`, so it is set here.
const UPDATED_AT = 'updatedAt';

// Raw writes bypass the API's Redis caches (docs/ENGINEERING.md §8); this is the key a
// product write must drop so the dashboard doesn't show stale rows.
const CACHE_KEYS_BY_TABLE: Record<string, string[]> = {
    products: ['products:all'],
};

const MAX_PAGE_SIZE = 200;

type Key = Record<string, string | number>;
type Json = Record<string, unknown>;

interface ColumnRow {
    name: string;
    type: string;
    nullable: boolean;
    has_default: boolean;
    generated: boolean;
    is_pk: boolean;
}

// Identifiers cannot be bound parameters, so they are quoted instead. This is safe only because every
// name reaching it came out of the Postgres catalogue (a request value is looked up there first, see
// columnsOf), and doubling the quote character leaves no way to close the quoted identifier early.
// The spec feeds it hostile names to keep that true.
const quote = (identifier: string) => `"${identifier.replace(/"/g, '""')}"`;

/** Everything is sent as text and cast server-side, so one code path covers numeric, enum, timestamptz and jsonb columns. */
function toParam(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') return JSON.stringify(value);
    return `${value as string | number | boolean}`;
}

/**
 * A Supabase-style table browser over the `public` schema. Table and column
 * names are only ever taken from the Postgres catalogue — a name from the
 * request is looked up there, never interpolated — and every value is a bound
 * parameter.
 */
@Injectable()
export class DbBrowserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly audit: AuditLogService,
    ) {}

    async listTables(): Promise<DbTableSummary[]> {
        const tables = await this.prisma.$queryRawUnsafe<
            { name: string; bytes: number }[]
        >(
            `SELECT c.relname AS name, pg_total_relation_size(c.oid)::float8 AS bytes
             FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relkind = 'r'
             ORDER BY c.relname`,
        );

        return Promise.all(
            tables.map(async (t) => {
                const [{ count }] = await this.prisma.$queryRawUnsafe<
                    { count: number }[]
                >(`SELECT count(*)::int AS count FROM ${quote(t.name)}`);
                return {
                    name: t.name,
                    rows: count,
                    bytes: Number(t.bytes),
                    writable: WRITABLE_TABLES.has(t.name),
                };
            }),
        );
    }

    async databaseBytes(): Promise<number> {
        const [{ bytes }] = await this.prisma.$queryRawUnsafe<
            { bytes: number }[]
        >(`SELECT pg_database_size(current_database())::float8 AS bytes`);
        return Number(bytes);
    }

    async getRows(
        table: string,
        options: {
            page: number;
            pageSize: number;
            sort?: string;
            dir: 'asc' | 'desc';
            search?: string;
        },
    ): Promise<DbRowsResponse> {
        const columns = await this.columnsOf(table);
        const pageSize = Math.min(Math.max(options.pageSize, 1), MAX_PAGE_SIZE);
        const page = Math.max(options.page, 1);

        const sortColumn =
            columns.find((c) => c.name === options.sort) ??
            columns.find((c) => c.isPrimaryKey) ??
            columns[0];
        const direction = options.dir === 'asc' ? 'ASC' : 'DESC';

        const search = options.search?.trim();
        const where = search ? `WHERE t::text ILIKE $1` : '';
        const searchParams = search
            ? [`%${search.replace(/[\\%_]/g, '\\$&')}%`]
            : [];

        const hidden = HIDDEN_COLUMNS[table] ?? [];
        const projection = hidden.length
            ? `to_jsonb(t) - ARRAY[${hidden.map((h) => `'${h.replace(/'/g, "''")}'`).join(',')}]::text[]`
            : 'to_jsonb(t)';

        const [rows, [{ count }]] = await Promise.all([
            this.prisma.$queryRawUnsafe<{ row: Json }[]>(
                `SELECT ${projection} AS row FROM ${quote(table)} t ${where}
                 ORDER BY ${quote(sortColumn.name)} ${direction} NULLS LAST
                 LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
                ...searchParams,
            ),
            this.prisma.$queryRawUnsafe<{ count: number }[]>(
                `SELECT count(*)::int AS count FROM ${quote(table)} t ${where}`,
                ...searchParams,
            ),
        ]);

        return {
            table,
            writable: WRITABLE_TABLES.has(table),
            columns: columns.filter((c) => !hidden.includes(c.name)),
            rows: rows.map((r) => r.row),
            total: count,
            page,
            pageSize,
        };
    }

    async insert(table: string, values: Json, actor: string): Promise<Json> {
        const columns = await this.writableColumns(table);
        const names = this.settableNames(columns, values);
        if (
            columns.some((c) => c.name === UPDATED_AT) &&
            !names.includes(UPDATED_AT)
        ) {
            names.push(UPDATED_AT);
        }

        const params: (string | null)[] = [];
        const placeholders = names.map((name) => {
            if (name === UPDATED_AT && !(name in values)) return 'now()';
            params.push(toParam(values[name]));
            return `CAST($${params.length} AS ${this.typeOf(columns, name)})`;
        });

        const sql = names.length
            ? `INSERT INTO ${quote(table)} AS t (${names.map(quote).join(', ')})
               VALUES (${placeholders.join(', ')}) RETURNING to_jsonb(t) AS row`
            : `INSERT INTO ${quote(table)} AS t DEFAULT VALUES RETURNING to_jsonb(t) AS row`;

        const [{ row }] = await this.audited(
            table,
            actor,
            'inserted a row into',
            (tx) => tx.$queryRawUnsafe<{ row: Json }[]>(sql, ...params),
        );
        return row;
    }

    async update(
        table: string,
        key: Key,
        values: Json,
        actor: string,
    ): Promise<Json> {
        const columns = await this.writableColumns(table);
        const names = this.settableNames(columns, values);
        if (names.length === 0) {
            throw new BadRequestException('Nothing to change.');
        }

        const params: (string | null)[] = [];
        const assignments = names.map((name) => {
            params.push(toParam(values[name]));
            return `${quote(name)} = CAST($${params.length} AS ${this.typeOf(columns, name)})`;
        });
        if (
            columns.some((c) => c.name === UPDATED_AT) &&
            !names.includes(UPDATED_AT)
        ) {
            assignments.push(`${quote(UPDATED_AT)} = now()`);
        }
        const where = this.keyClause(columns, key, params);

        const rows = await this.audited(table, actor, 'edited a row in', (tx) =>
            tx.$queryRawUnsafe<{ row: Json }[]>(
                `UPDATE ${quote(table)} AS t SET ${assignments.join(', ')}
                 WHERE ${where} RETURNING to_jsonb(t) AS row`,
                ...params,
            ),
        );
        return rows[0].row;
    }

    async remove(table: string, key: Key, actor: string): Promise<void> {
        const columns = await this.writableColumns(table);
        const params: (string | null)[] = [];
        const where = this.keyClause(columns, key, params);

        await this.audited(table, actor, 'deleted a row from', (tx) =>
            tx.$queryRawUnsafe<{ row: Json }[]>(
                `DELETE FROM ${quote(table)} AS t WHERE ${where} RETURNING to_jsonb(t) AS row`,
                ...params,
            ),
        );
    }

    // ── internals ──────────────────────────────────────────────────────────

    /** Looks the table up in the catalogue; a name that isn't a real public table is a 404, never SQL. */
    private async columnsOf(table: string): Promise<DbColumn[]> {
        const rows = await this.prisma.$queryRawUnsafe<ColumnRow[]>(
            `SELECT a.attname AS name,
                    format_type(a.atttypid, a.atttypmod) AS type,
                    NOT a.attnotnull AS nullable,
                    (a.atthasdef OR a.attidentity <> '') AS has_default,
                    a.attgenerated <> '' AS generated,
                    COALESCE(i.indisprimary, false) AS is_pk
             FROM pg_class c
             JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
             JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
             LEFT JOIN pg_index i ON i.indrelid = c.oid AND i.indisprimary AND a.attnum = ANY (i.indkey)
             WHERE c.relname = $1 AND c.relkind = 'r'
             ORDER BY a.attnum`,
            table,
        );
        if (rows.length === 0) {
            throw new NotFoundException(`Table "${table}" not found.`);
        }
        const hidden = HIDDEN_COLUMNS[table] ?? [];
        const enums = await this.enumValues();
        return rows.map((r) => ({
            name: r.name,
            type: r.type,
            nullable: r.nullable,
            hasDefault: r.has_default,
            isPrimaryKey: r.is_pk,
            readOnly: r.generated || hidden.includes(r.name),
            enumValues: enums.get(r.type.replace(/"/g, '')),
        }));
    }

    /** Postgres enum name -> its labels in declared order, so the editor can offer a dropdown. */
    private async enumValues(): Promise<Map<string, string[]>> {
        const rows = await this.prisma.$queryRawUnsafe<
            { name: string; labels: string[] }[]
        >(
            `SELECT t.typname::text AS name, array_agg(e.enumlabel::text ORDER BY e.enumsortorder) AS labels
             FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
             GROUP BY t.typname`,
        );
        return new Map(rows.map((r) => [r.name, r.labels]));
    }

    private async writableColumns(table: string): Promise<DbColumn[]> {
        if (!WRITABLE_TABLES.has(table)) {
            throw new ForbiddenException(
                `"${table}" is read-only in the console.`,
            );
        }
        return this.columnsOf(table);
    }

    private settableNames(columns: DbColumn[], values: Json): string[] {
        const names = Object.keys(values);
        for (const name of names) {
            const column = columns.find((c) => c.name === name);
            if (!column) {
                throw new BadRequestException(`Unknown column "${name}".`);
            }
            if (column.readOnly) {
                throw new BadRequestException(`Column "${name}" can't be set.`);
            }
        }
        return names;
    }

    private typeOf(columns: DbColumn[], name: string): string {
        return columns.find((c) => c.name === name)!.type;
    }

    private keyClause(
        columns: DbColumn[],
        key: Key,
        params: (string | null)[],
    ) {
        const pk = columns.filter((c) => c.isPrimaryKey);
        if (pk.length === 0) {
            throw new BadRequestException('This table has no primary key.');
        }
        return pk
            .map((c) => {
                if (!(c.name in key)) {
                    throw new BadRequestException(
                        `Missing primary key value "${c.name}".`,
                    );
                }
                params.push(String(key[c.name]));
                return `t.${quote(c.name)} = CAST($${params.length} AS ${c.type})`;
            })
            .join(' AND ');
    }

    /**
     * Runs a write and its audit entry in one transaction, so a committed edit always has its entry
     * (and a failed audit insert undoes the edit). The cache is cleared only after the commit,
     * otherwise a rolled-back write would still have evicted good data.
     */
    private async audited(
        table: string,
        actor: string,
        verb: string,
        write: (tx: Prisma.TransactionClient) => Promise<{ row: Json }[]>,
    ): Promise<{ row: Json }[]> {
        const rows = await this.prisma.$transaction(async (tx) => {
            const written = await write(tx);
            if (written.length === 0)
                throw new NotFoundException('Row not found.');

            const { row } = written[0];
            const id = [row.id, row.sku, row.slug].find(
                (v): v is string | number =>
                    typeof v === 'string' || typeof v === 'number',
            );
            await this.audit.record(
                actor,
                'db',
                `${verb} ${table}${id !== undefined ? ` (${id})` : ''}`,
                tx,
            );
            return written;
        });

        const cacheKeys = CACHE_KEYS_BY_TABLE[table];
        if (cacheKeys) await this.redis.del(...cacheKeys);
        return rows;
    }
}
