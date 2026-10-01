"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbBrowserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const audit_log_service_1 = require("./audit-log.service");
const WRITABLE_TABLES = new Set([
    'products',
    'branches',
    'historic_spot_prices',
    'kb_documents',
]);
const HIDDEN_COLUMNS = { users: ['password'] };
const UPDATED_AT = 'updatedAt';
const CACHE_KEYS_BY_TABLE = {
    products: ['products:all'],
};
const MAX_PAGE_SIZE = 200;
const quote = (identifier) => `"${identifier.replace(/"/g, '""')}"`;
function toParam(value) {
    if (value === null || value === undefined)
        return null;
    if (typeof value === 'object')
        return JSON.stringify(value);
    return `${value}`;
}
let DbBrowserService = class DbBrowserService {
    prisma;
    redis;
    audit;
    constructor(prisma, redis, audit) {
        this.prisma = prisma;
        this.redis = redis;
        this.audit = audit;
    }
    async listTables() {
        const tables = await this.prisma.$queryRawUnsafe(`SELECT c.relname AS name, pg_total_relation_size(c.oid)::float8 AS bytes
             FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relkind = 'r'
             ORDER BY c.relname`);
        return Promise.all(tables.map(async (t) => {
            const [{ count }] = await this.prisma.$queryRawUnsafe(`SELECT count(*)::int AS count FROM ${quote(t.name)}`);
            return {
                name: t.name,
                rows: count,
                bytes: Number(t.bytes),
                writable: WRITABLE_TABLES.has(t.name),
            };
        }));
    }
    async databaseBytes() {
        const [{ bytes }] = await this.prisma.$queryRawUnsafe(`SELECT pg_database_size(current_database())::float8 AS bytes`);
        return Number(bytes);
    }
    async getRows(table, options) {
        const columns = await this.columnsOf(table);
        const pageSize = Math.min(Math.max(options.pageSize, 1), MAX_PAGE_SIZE);
        const page = Math.max(options.page, 1);
        const sortColumn = columns.find((c) => c.name === options.sort) ??
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
            this.prisma.$queryRawUnsafe(`SELECT ${projection} AS row FROM ${quote(table)} t ${where}
                 ORDER BY ${quote(sortColumn.name)} ${direction} NULLS LAST
                 LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`, ...searchParams),
            this.prisma.$queryRawUnsafe(`SELECT count(*)::int AS count FROM ${quote(table)} t ${where}`, ...searchParams),
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
    async insert(table, values, actor) {
        const columns = await this.writableColumns(table);
        const names = this.settableNames(columns, values);
        if (columns.some((c) => c.name === UPDATED_AT) &&
            !names.includes(UPDATED_AT)) {
            names.push(UPDATED_AT);
        }
        const params = [];
        const placeholders = names.map((name) => {
            if (name === UPDATED_AT && !(name in values))
                return 'now()';
            params.push(toParam(values[name]));
            return `CAST($${params.length} AS ${this.typeOf(columns, name)})`;
        });
        const sql = names.length
            ? `INSERT INTO ${quote(table)} AS t (${names.map(quote).join(', ')})
               VALUES (${placeholders.join(', ')}) RETURNING to_jsonb(t) AS row`
            : `INSERT INTO ${quote(table)} AS t DEFAULT VALUES RETURNING to_jsonb(t) AS row`;
        const [{ row }] = await this.prisma.$queryRawUnsafe(sql, ...params);
        await this.afterWrite(table, actor, 'inserted a row into', row);
        return row;
    }
    async update(table, key, values, actor) {
        const columns = await this.writableColumns(table);
        const names = this.settableNames(columns, values);
        if (names.length === 0) {
            throw new common_1.BadRequestException('Nothing to change.');
        }
        const params = [];
        const assignments = names.map((name) => {
            params.push(toParam(values[name]));
            return `${quote(name)} = CAST($${params.length} AS ${this.typeOf(columns, name)})`;
        });
        if (columns.some((c) => c.name === UPDATED_AT) &&
            !names.includes(UPDATED_AT)) {
            assignments.push(`${quote(UPDATED_AT)} = now()`);
        }
        const where = this.keyClause(columns, key, params);
        const rows = await this.prisma.$queryRawUnsafe(`UPDATE ${quote(table)} AS t SET ${assignments.join(', ')}
             WHERE ${where} RETURNING to_jsonb(t) AS row`, ...params);
        if (rows.length === 0)
            throw new common_1.NotFoundException('Row not found.');
        await this.afterWrite(table, actor, 'edited a row in', rows[0].row);
        return rows[0].row;
    }
    async remove(table, key, actor) {
        const columns = await this.writableColumns(table);
        const params = [];
        const where = this.keyClause(columns, key, params);
        const rows = await this.prisma.$queryRawUnsafe(`DELETE FROM ${quote(table)} AS t WHERE ${where} RETURNING to_jsonb(t) AS row`, ...params);
        if (rows.length === 0)
            throw new common_1.NotFoundException('Row not found.');
        await this.afterWrite(table, actor, 'deleted a row from', rows[0].row);
    }
    async columnsOf(table) {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT a.attname AS name,
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
             ORDER BY a.attnum`, table);
        if (rows.length === 0) {
            throw new common_1.NotFoundException(`Table "${table}" not found.`);
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
    async enumValues() {
        const rows = await this.prisma.$queryRawUnsafe(`SELECT t.typname::text AS name, array_agg(e.enumlabel::text ORDER BY e.enumsortorder) AS labels
             FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
             GROUP BY t.typname`);
        return new Map(rows.map((r) => [r.name, r.labels]));
    }
    async writableColumns(table) {
        if (!WRITABLE_TABLES.has(table)) {
            throw new common_1.ForbiddenException(`"${table}" is read-only in the console.`);
        }
        return this.columnsOf(table);
    }
    settableNames(columns, values) {
        const names = Object.keys(values);
        for (const name of names) {
            const column = columns.find((c) => c.name === name);
            if (!column) {
                throw new common_1.BadRequestException(`Unknown column "${name}".`);
            }
            if (column.readOnly) {
                throw new common_1.BadRequestException(`Column "${name}" can't be set.`);
            }
        }
        return names;
    }
    typeOf(columns, name) {
        return columns.find((c) => c.name === name).type;
    }
    keyClause(columns, key, params) {
        const pk = columns.filter((c) => c.isPrimaryKey);
        if (pk.length === 0) {
            throw new common_1.BadRequestException('This table has no primary key.');
        }
        return pk
            .map((c) => {
            if (!(c.name in key)) {
                throw new common_1.BadRequestException(`Missing primary key value "${c.name}".`);
            }
            params.push(String(key[c.name]));
            return `t.${quote(c.name)} = CAST($${params.length} AS ${c.type})`;
        })
            .join(' AND ');
    }
    async afterWrite(table, actor, verb, row) {
        const cacheKeys = CACHE_KEYS_BY_TABLE[table];
        if (cacheKeys)
            await this.redis.del(...cacheKeys);
        const id = [row.id, row.sku, row.slug].find((v) => typeof v === 'string' || typeof v === 'number');
        await this.audit.record(actor, 'db', `${verb} ${table}${id !== undefined ? ` (${id})` : ''}`);
    }
};
exports.DbBrowserService = DbBrowserService;
exports.DbBrowserService = DbBrowserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService])
], DbBrowserService);
//# sourceMappingURL=db-browser.service.js.map