import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { DbBrowserService } from './db-browser.service';

interface Col {
    name: string;
    type: string;
    nullable?: boolean;
    has_default?: boolean;
    generated?: boolean;
    is_pk?: boolean;
}

const col = (c: Col) => ({
    nullable: false,
    has_default: false,
    generated: false,
    is_pk: false,
    ...c,
});

/** What the Postgres catalogue would report. Anything not listed here does not exist. */
const CATALOGUE: Record<string, ReturnType<typeof col>[]> = {
    products: [
        col({ name: 'id', type: 'integer', is_pk: true, has_default: true }),
        col({ name: 'sku', type: 'text' }),
        col({ name: 'name', type: 'text' }),
        col({ name: 'spreadSell', type: 'numeric(10,4)' }),
        col({ name: 'updatedAt', type: 'timestamp with time zone' }),
        col({ name: 'total', type: 'integer', generated: true }),
    ],
    kb_documents: [
        col({ name: 'slug', type: 'text', is_pk: true }),
        col({ name: 'title', type: 'text' }),
    ],
    users: [
        col({ name: 'id', type: 'text', is_pk: true }),
        col({ name: 'email', type: 'text' }),
        col({ name: 'password', type: 'text' }),
    ],
    no_pk_but_writable_like: [col({ name: 'a', type: 'text' })],
};

interface Call {
    sql: string;
    params: unknown[];
}

function build(
    options: {
        writeRows?: Record<string, unknown>[];
        catalogue?: typeof CATALOGUE;
    } = {},
) {
    const calls: Call[] = [];
    const events: string[] = [];
    const catalogue = options.catalogue ?? CATALOGUE;

    const queryRawUnsafe = jest.fn((sql: string, ...params: unknown[]) => {
        calls.push({ sql, params });
        if (sql.includes('a.attname')) {
            return Promise.resolve(catalogue[params[0] as string] ?? []);
        }
        if (sql.includes('pg_enum')) return Promise.resolve([]);
        if (/^\s*(INSERT|UPDATE|DELETE)/.test(sql)) {
            events.push('write');
            return Promise.resolve(
                (options.writeRows ?? [{ id: 7, sku: 'GB-1' }]).map((row) => ({
                    row,
                })),
            );
        }
        if (sql.includes('count(*)')) return Promise.resolve([{ count: 0 }]);
        return Promise.resolve([]);
    });
    const prisma = {
        $queryRawUnsafe: queryRawUnsafe,
        $transaction: jest.fn(async (run: (tx: unknown) => unknown) => {
            const result = await run(prisma);
            events.push('commit');
            return result;
        }),
    };
    const redis = {
        del: jest.fn(() => {
            events.push('cache');
            return Promise.resolve();
        }),
    };
    const audit = {
        record: jest.fn(() => {
            events.push('audit');
            return Promise.resolve();
        }),
    };
    const service = new DbBrowserService(
        prisma as never,
        redis as never,
        audit as never,
    );
    const sqlOf = (pattern: RegExp) => calls.filter((c) => pattern.test(c.sql));
    const writes = () => sqlOf(/^\s*(INSERT|UPDATE|DELETE)/);
    return { service, prisma, redis, audit, calls, events, writes, sqlOf };
}

const page = {
    page: 1,
    pageSize: 50,
    dir: 'asc' as const,
};

describe('DbBrowserService', () => {
    describe('unknown and read-only tables', () => {
        it('answers 404 for a table the catalogue does not list', async () => {
            const { service } = build();
            await expect(service.getRows('nope', page)).rejects.toThrow(
                NotFoundException,
            );
        });

        it.each(['insert', 'update', 'remove'] as const)(
            'refuses to %s on a read-only table and sends no write SQL',
            async (op) => {
                const { service, writes } = build();
                const run = () => {
                    if (op === 'insert')
                        return service.insert('users', { email: 'x' }, 'a');
                    if (op === 'update')
                        return service.update(
                            'users',
                            { id: 'u1' },
                            { email: 'x' },
                            'a',
                        );
                    return service.remove('users', { id: 'u1' }, 'a');
                };
                await expect(run()).rejects.toThrow(ForbiddenException);
                expect(writes()).toHaveLength(0);
            },
        );

        it('treats a table that is neither listed nor writable as read-only, not as a lookup', async () => {
            const { service, calls } = build();
            await expect(
                service.insert('not_a_table', { a: 1 }, 'a'),
            ).rejects.toThrow(ForbiddenException);
            expect(calls).toHaveLength(0);
        });
    });

    describe('hidden columns', () => {
        it('strips the password from the projection and from the column list', async () => {
            const { service, sqlOf } = build();

            const result = await service.getRows('users', page);

            const select = sqlOf(/SELECT to_jsonb|SELECT .*AS row FROM/)[0];
            expect(select.sql).toContain("- ARRAY['password']::text[]");
            expect(result.columns.map((c) => c.name)).toEqual(['id', 'email']);
        });

        it('lists a hidden column as read-only if it is ever shown', async () => {
            const { service } = build();
            const { columns } = await service.getRows('products', page);
            const total = columns.find((c) => c.name === 'total');
            expect(total?.readOnly).toBe(true);
        });
    });

    describe('identifiers come only from the catalogue', () => {
        const hostile = 'products"; DROP TABLE users; --';

        it('looks a hostile table name up as a bound parameter and 404s', async () => {
            const { service, calls } = build();

            await expect(service.getRows(hostile, page)).rejects.toThrow(
                NotFoundException,
            );

            expect(calls.every((c) => !c.sql.includes('DROP TABLE'))).toBe(
                true,
            );
            expect(calls[0].params).toEqual([hostile]);
        });

        it('never interpolates a sort column from the request', async () => {
            const { service, sqlOf } = build();

            await service.getRows('products', {
                ...page,
                sort: 'id"; DROP TABLE users; --',
            });

            const select = sqlOf(/LIMIT/)[0].sql;
            expect(select).toContain('ORDER BY "id" ASC');
            expect(select).not.toContain('DROP');
        });

        it('sorts by a real column when asked', async () => {
            const { service, sqlOf } = build();
            await service.getRows('products', {
                ...page,
                sort: 'sku',
                dir: 'desc',
            });
            expect(sqlOf(/LIMIT/)[0].sql).toContain(
                'ORDER BY "sku" DESC NULLS LAST',
            );
        });

        it('rejects a hostile column name on insert and update without writing', async () => {
            const { service, writes } = build();
            const bad = { 'name"; DROP TABLE users; --': 'x' };

            await expect(service.insert('products', bad, 'a')).rejects.toThrow(
                BadRequestException,
            );
            await expect(
                service.update('products', { id: 1 }, bad, 'a'),
            ).rejects.toThrow(BadRequestException);
            expect(writes()).toHaveLength(0);
        });

        it('rejects a read-only (generated) column', async () => {
            const { service, writes } = build();
            await expect(
                service.insert('products', { total: 5 }, 'a'),
            ).rejects.toThrow(/can't be set/);
            expect(writes()).toHaveLength(0);
        });

        it('quotes identifiers and binds values, so a hostile value cannot reach the SQL text', async () => {
            const { service, writes } = build();
            const evil = "x'); DROP TABLE users; --";

            await service.insert('products', { sku: evil, name: 'n' }, 'a');

            const [insert] = writes();
            expect(insert.sql).toContain('INSERT INTO "products"');
            expect(insert.sql).toContain('("sku", "name"');
            expect(insert.sql).not.toContain('DROP');
            expect(insert.params).toContain(evil);
        });
    });

    describe('browsing', () => {
        it('clamps the page size to 200 and the page to 1', async () => {
            const { service, sqlOf } = build();

            const result = await service.getRows('products', {
                ...page,
                page: 0,
                pageSize: 100_000,
            });

            expect(result.pageSize).toBe(200);
            expect(result.page).toBe(1);
            expect(sqlOf(/LIMIT/)[0].sql).toContain('LIMIT 200 OFFSET 0');
        });

        it('binds the search term and escapes LIKE wildcards in it', async () => {
            const { service, sqlOf } = build();

            await service.getRows('products', {
                ...page,
                search: ' 100%_gold\\ ',
            });

            const select = sqlOf(/ILIKE/)[0];
            expect(select.sql).not.toContain('gold');
            expect(select.params).toEqual(['%100\\%\\_gold\\\\%']);
        });
    });

    describe('keys', () => {
        it('requires every primary key column', async () => {
            const { service, writes } = build();
            await expect(
                service.update('products', {}, { name: 'x' }, 'a'),
            ).rejects.toThrow(/Missing primary key value "id"/);
            expect(writes()).toHaveLength(0);
        });

        it('refuses a table with no primary key', async () => {
            const { service } = build({
                catalogue: {
                    ...CATALOGUE,
                    products: [col({ name: 'a', type: 'text' })],
                },
            });
            await expect(
                service.remove('products', { a: 'x' }, 'a'),
            ).rejects.toThrow(/no primary key/);
        });

        it('casts the key and sets updatedAt on an update', async () => {
            const { service, writes } = build();

            await service.update(
                'products',
                { id: 7 },
                { spreadSell: 2.5 },
                'a',
            );

            const [update] = writes();
            expect(update.sql).toContain(
                '"spreadSell" = CAST($1 AS numeric(10,4))',
            );
            expect(update.sql).toContain('"updatedAt" = now()');
            expect(update.sql).toContain('t."id" = CAST($2 AS integer)');
            expect(update.params).toEqual(['2.5', '7']);
        });

        it('refuses an update with nothing to change', async () => {
            const { service } = build();
            await expect(
                service.update('products', { id: 1 }, {}, 'a'),
            ).rejects.toThrow(/Nothing to change/);
        });
    });

    describe('writes, audit and cache', () => {
        it('writes, audits inside the transaction, commits, then clears the product cache', async () => {
            const { service, audit, redis, events, prisma } = build();

            const row = await service.insert(
                'products',
                { sku: 'GB-1', name: 'Bar' },
                'boss@example.com',
            );

            expect(row).toEqual({ id: 7, sku: 'GB-1' });
            expect(audit.record).toHaveBeenCalledWith(
                'boss@example.com',
                'db',
                'inserted a row into products (7)',
                prisma,
            );
            expect(redis.del).toHaveBeenCalledWith('products:all');
            expect(events).toEqual(['write', 'audit', 'commit', 'cache']);
        });

        it('does not touch the cache for a table that has none', async () => {
            const { service, redis } = build({
                writeRows: [{ slug: 'pricing' }],
            });
            await service.update(
                'kb_documents',
                { slug: 'pricing' },
                { title: 'T' },
                'a',
            );
            expect(redis.del).not.toHaveBeenCalled();
        });

        it('answers 404, audits nothing and keeps the cache when no row matched', async () => {
            const { service, audit, redis } = build({ writeRows: [] });

            await expect(
                service.remove('products', { id: 99 }, 'a'),
            ).rejects.toThrow(NotFoundException);

            expect(audit.record).not.toHaveBeenCalled();
            expect(redis.del).not.toHaveBeenCalled();
        });

        it('fails the change and keeps the cache when the audit entry cannot be written', async () => {
            const { service, audit, redis } = build();
            audit.record.mockRejectedValueOnce(new Error('audit down'));

            await expect(
                service.remove('products', { id: 7 }, 'a'),
            ).rejects.toThrow('audit down');

            expect(redis.del).not.toHaveBeenCalled();
        });

        it('stamps updatedAt on insert when the caller does not give one', async () => {
            const { service, writes } = build();
            await service.insert('products', { sku: 'S', name: 'N' }, 'a');
            expect(writes()[0].sql).toContain('now()');
        });

        it('serialises object values as JSON text and null as a real null', async () => {
            const { service, writes } = build();
            await service.insert(
                'products',
                { sku: 'S', name: null, spreadSell: { a: 1 } },
                'a',
            );
            expect(writes()[0].params).toEqual(['S', null, '{"a":1}']);
        });
    });

    describe('listTables', () => {
        it('marks only the allow-listed tables writable', async () => {
            const { service, prisma } = build();
            const query = prisma.$queryRawUnsafe as jest.Mock;
            query.mockReset();
            query
                .mockResolvedValueOnce([
                    { name: 'products', bytes: 10 },
                    { name: 'users', bytes: 20 },
                ])
                .mockResolvedValue([{ count: 3 }]);

            const tables = await service.listTables();

            expect(tables).toEqual([
                { name: 'products', rows: 3, bytes: 10, writable: true },
                { name: 'users', rows: 3, bytes: 20, writable: false },
            ]);
        });
    });
});
