import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PeopleService } from './people.service';

const ADMIN = {
    id: 'a1',
    email: 'boss@merrion.ie',
    firstName: 'Bo',
    lastName: 'Ss',
};

function user(over: Record<string, unknown> = {}) {
    return {
        id: 'u1',
        email: 'sam@merrion.ie',
        firstName: 'Sam',
        lastName: 'Lee',
        role: 'SALES',
        admin: false,
        isActive: true,
        branchId: 1,
        lastLoginAt: null,
        branch: { id: 1, name: 'Dublin', region: 'IE' },
        permissionOverrides: [],
        ...over,
    };
}

function setup(
    opts: {
        target?: ReturnType<typeof user> | null;
        otherActiveAdmins?: number;
        presets?: { role: string; key: string }[];
    } = {},
) {
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const tx = {
        user: {
            findUnique: jest
                .fn()
                .mockResolvedValue(
                    opts.target === undefined ? user() : opts.target,
                ),
            update: jest.fn().mockResolvedValue({}),
            count: jest.fn().mockResolvedValue(opts.otherActiveAdmins ?? 1),
        },
        branch: { findUnique: jest.fn().mockResolvedValue({ id: 2 }) },
        userPermissionOverride: {
            upsert: jest.fn(),
            deleteMany: jest.fn(),
            createMany: jest.fn(),
            findMany: jest.fn().mockResolvedValue([]),
        },
        rolePermission: {
            findUnique: jest.fn(
                async ({
                    where,
                }: {
                    where: { role_key: { role: string; key: string } };
                }) =>
                    (
                        opts.presets ?? [
                            { role: 'SALES', key: 'analytics.pricing' },
                        ]
                    ).find(
                        (p) =>
                            p.role === where.role_key.role &&
                            p.key === where.role_key.key,
                    ) ?? null,
            ),
            create: jest.fn(),
            delete: jest.fn(),
            findMany: jest
                .fn()
                .mockResolvedValue(
                    opts.presets ?? [
                        { role: 'SALES', key: 'analytics.pricing' },
                    ],
                ),
            deleteMany: jest.fn(),
            createMany: jest.fn(),
        },
    };
    const prisma = {
        ...tx,
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
    };
    const redis = { del: jest.fn() };
    const permissions = {
        presets: jest.fn().mockResolvedValue(opts.presets ?? []),
    };
    const notifications = {
        notifyAdmins: jest.fn().mockResolvedValue(undefined),
    };
    const service = new PeopleService(
        prisma as never,
        audit as never,
        redis as never,
        permissions as never,
        notifications as never,
    );
    return { service, tx, audit, redis, notifications };
}

describe('PeopleService notifications', () => {
    it('tells admins what changed and why, after the change is saved', async () => {
        const { service, notifications } = setup();
        await service.update(
            'u1',
            { role: 'MANAGER', reason: 'promoted' },
            ADMIN,
        );
        expect(notifications.notifyAdmins).toHaveBeenCalledWith({
            kind: 'permission_changed',
            title: 'sam@merrion.ie: role SALES → MANAGER',
            body: 'Changed by boss@merrion.ie. Reason: promoted',
            link: '/admin?tab=people',
        });
    });

    it('stays quiet when nothing changed', async () => {
        const { service, notifications } = setup();
        await service.update('u1', { role: 'SALES', reason: 'no-op' }, ADMIN);
        expect(notifications.notifyAdmins).not.toHaveBeenCalled();
    });
});

describe('PeopleService.update', () => {
    it('changes only what differs and writes one audit row per field, with the reason', async () => {
        const { service, tx, audit } = setup();
        await service.update(
            'u1',
            { role: 'MANAGER', branchId: 1, reason: 'promoted' },
            ADMIN,
        );
        expect(tx.user.update).toHaveBeenCalledWith({
            where: { id: 'u1' },
            data: { role: 'MANAGER' },
        });
        expect(audit.record).toHaveBeenCalledTimes(1);
        expect(audit.record).toHaveBeenCalledWith(
            'boss@merrion.ie',
            'user',
            'sam@merrion.ie: role SALES → MANAGER (reason: promoted)',
            tx,
        );
    });

    it('refuses to let an admin disable or demote themselves', async () => {
        const { service } = setup({ target: user({ id: 'a1', admin: true }) });
        await expect(
            service.update('a1', { isActive: false, reason: 'test' }, ADMIN),
        ).rejects.toThrow(BadRequestException);
        await expect(
            service.update('a1', { admin: false, reason: 'test' }, ADMIN),
        ).rejects.toThrow(BadRequestException);
    });

    it('refuses to remove the last active admin', async () => {
        const { service } = setup({
            target: user({ admin: true }),
            otherActiveAdmins: 0,
        });
        await expect(
            service.update('u1', { admin: false, reason: 'test' }, ADMIN),
        ).rejects.toThrow(/last active admin/);
    });

    it('404s an unknown person', async () => {
        const { service } = setup({ target: null });
        await expect(
            service.update('nope', { role: 'SALES', reason: 'x y z' }, ADMIN),
        ).rejects.toThrow(NotFoundException);
    });
});

describe('PeopleService.setOverrides', () => {
    it('writes only the changed key, keeping who set the others, and audits it', async () => {
        const { service, tx, audit } = setup({
            target: user({
                permissionOverrides: [
                    {
                        key: 'analytics.sales',
                        granted: false,
                        expiresAt: null,
                        reason: 'old',
                        createdBy: 'x@merrion.ie',
                        createdAt: new Date(),
                    },
                ],
            }),
        });
        await service.setOverrides(
            'u1',
            {
                overrides: [
                    { key: 'analytics.sales', granted: false, expiresAt: null },
                    {
                        key: 'analytics.ops',
                        granted: true,
                        expiresAt: '2026-12-12T00:00:00.000Z',
                    },
                ],
                reason: 'cover for Pat',
            },
            ADMIN,
        );
        expect(tx.userPermissionOverride.upsert).toHaveBeenCalledTimes(1);
        expect(tx.userPermissionOverride.upsert.mock.calls[0][0].where).toEqual(
            { userId_key: { userId: 'u1', key: 'analytics.ops' } },
        );
        expect(tx.userPermissionOverride.deleteMany).not.toHaveBeenCalled();
        expect(audit.record).toHaveBeenCalledTimes(1);
        expect(audit.record).toHaveBeenCalledWith(
            'boss@merrion.ie',
            'permission',
            'sam@merrion.ie: analytics.ops none → grant until 2026-12-12 (reason: cover for Pat)',
            tx,
        );
    });

    it('deletes an override that was taken away', async () => {
        const { service, tx } = setup({
            target: user({
                permissionOverrides: [
                    {
                        key: 'analytics.ops',
                        granted: true,
                        expiresAt: null,
                        reason: 'r',
                        createdBy: 'x',
                        createdAt: new Date(),
                    },
                ],
            }),
        });
        await service.setOverrides(
            'u1',
            { overrides: [], reason: 'back from leave' },
            ADMIN,
        );
        expect(tx.userPermissionOverride.deleteMany).toHaveBeenCalledWith({
            where: { userId: 'u1', key: 'analytics.ops' },
        });
    });
});

describe('PeopleService.setMatrix', () => {
    it('applies only the toggled cells, audits each and clears the presets cache', async () => {
        const { service, tx, audit, redis } = setup({
            presets: [{ role: 'SALES', key: 'analytics.pricing' }],
        });
        await service.setMatrix(
            {
                changes: [
                    { role: 'SALES', key: 'analytics.ops', granted: true },
                    { role: 'SALES', key: 'analytics.pricing', granted: true },
                ],
                reason: 'ops cover',
            },
            ADMIN,
        );
        expect(tx.rolePermission.create).toHaveBeenCalledTimes(1);
        expect(tx.rolePermission.create).toHaveBeenCalledWith({
            data: { role: 'SALES', key: 'analytics.ops' },
        });
        expect(audit.record).toHaveBeenCalledTimes(1);
        expect(audit.record).toHaveBeenCalledWith(
            'boss@merrion.ie',
            'permission',
            'SALES: analytics.ops granted (reason: ops cover)',
            tx,
        );
        expect(redis.del).toHaveBeenCalledWith('permissions:role-presets');
    });

    it('ignores cells for Admin, which always holds everything', async () => {
        const { service, tx, audit } = setup({ presets: [] });
        await service.setMatrix(
            {
                changes: [
                    { role: 'ADMIN', key: 'analytics.ops', granted: false },
                ],
                reason: 'tidy',
            },
            ADMIN,
        );
        expect(tx.rolePermission.delete).not.toHaveBeenCalled();
        expect(audit.record).not.toHaveBeenCalled();
    });
});
