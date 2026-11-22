import { readFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_ROLE_PERMISSIONS } from '@goldilocks/shared-types';

const migration = (name: string) =>
    readFileSync(
        join(__dirname, '../../../prisma/migrations', name, 'migration.sql'),
        'utf8',
    );

const seeded = (sql: string) =>
    [...sql.matchAll(/\('([A-Z]+)', '([a-z.-]+)'\)/g)].map(
        (m) => `${m[1]}:${m[2]}`,
    );

describe('role preset seed', () => {
    it('seeds exactly DEFAULT_ROLE_PERMISSIONS across the two migrations', () => {
        const actual = [
            ...seeded(
                migration('20261121180000_permissions_snapshots_ai_feedback'),
            ),
            ...seeded(migration('20261122120000_page_permissions')),
        ].sort();
        const expected = Object.entries(DEFAULT_ROLE_PERMISSIONS)
            .flatMap(([role, keys]) => keys.map((k) => `${role}:${k}`))
            .sort();
        expect(actual).toEqual(expected);
    });
});
