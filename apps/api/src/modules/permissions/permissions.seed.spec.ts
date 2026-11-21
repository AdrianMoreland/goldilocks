import { readFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_ROLE_PERMISSIONS } from '@goldilocks/shared-types';

describe('role preset seed', () => {
    it('seeds exactly DEFAULT_ROLE_PERMISSIONS', () => {
        const sql = readFileSync(
            join(
                __dirname,
                '../../../prisma/migrations/20261121180000_permissions_snapshots_ai_feedback/migration.sql',
            ),
            'utf8',
        );
        const seeded = [...sql.matchAll(/\('([A-Z]+)', '([a-z.]+)'\)/g)]
            .map((m) => `${m[1]}:${m[2]}`)
            .sort();
        const expected = Object.entries(DEFAULT_ROLE_PERMISSIONS)
            .flatMap(([role, keys]) => keys.map((k) => `${role}:${k}`))
            .sort();
        expect(seeded).toEqual(expected);
    });
});
