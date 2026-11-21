import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    PERMISSION_KEYS,
    diffOverrides,
    diffUserChanges,
    effectivePermissions,
    type AdminUser,
    type PermissionKey,
    type PermissionMatrix,
    type PermissionRole,
    type SetOverridesRequest,
    type UpdatePermissionMatrixRequest,
    type UpdateUserRequest,
} from '@goldilocks/shared-types';
import { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import {
    PermissionsService,
    ROLE_PRESETS_CACHE_KEY,
} from '../permissions/permissions.service';

export interface Actor {
    id: string;
    email: string;
}

const ROLES: PermissionRole[] = [
    'ADMIN',
    'MANAGER',
    'SALES',
    'ACCOUNTING',
    'AUDITOR',
];

// Never the password column: the auth provider owns credentials and this list goes to the browser.
const USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    admin: true,
    isActive: true,
    branchId: true,
    lastLoginAt: true,
    branch: { select: { id: true, name: true, region: true } },
    permissionOverrides: {
        select: {
            key: true,
            granted: true,
            expiresAt: true,
            reason: true,
            createdBy: true,
            createdAt: true,
        },
        orderBy: { key: 'asc' as const },
    },
} as const;

const show = (v: string | number | boolean | null) =>
    v === null ? 'none' : String(v);

/** Admin → People and Roles & permissions. Every change needs a reason and writes the audit log in the same transaction. */
@Injectable()
export class PeopleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly redis: RedisService,
        private readonly permissions: PermissionsService,
    ) {}

    async list(): Promise<AdminUser[]> {
        const [users, presets] = await Promise.all([
            this.prisma.user.findMany({
                select: USER_SELECT,
                orderBy: [
                    { isActive: 'desc' },
                    { firstName: 'asc' },
                    { lastName: 'asc' },
                ],
            }),
            this.permissions.presets(),
        ]);
        const now = new Date();
        return users.map((u) => ({
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            admin: u.admin,
            isActive: u.isActive,
            branch: u.branch,
            lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
            overrides: u.permissionOverrides.map((o) => ({
                key: o.key as PermissionKey,
                granted: o.granted,
                expiresAt: o.expiresAt?.toISOString() ?? null,
                reason: o.reason,
                createdBy: o.createdBy,
                createdAt: o.createdAt.toISOString(),
            })),
            permissions: effectivePermissions(
                u,
                presets,
                u.permissionOverrides,
                now,
            ),
        }));
    }

    async update(
        id: string,
        body: UpdateUserRequest,
        actor: Actor,
    ): Promise<void> {
        const { reason, ...patch } = body;
        await this.prisma.$transaction(
            async (tx) => {
                const before = await tx.user.findUnique({
                    where: { id },
                    select: USER_SELECT,
                });
                if (!before) throw new NotFoundException('Person not found');

                const losesAdmin =
                    (patch.admin === false || patch.isActive === false) &&
                    before.admin &&
                    before.isActive;
                if (losesAdmin && id === actor.id) {
                    throw new BadRequestException(
                        "You can't remove your own admin access or disable your own account.",
                    );
                }
                if (losesAdmin) {
                    const others = await tx.user.count({
                        where: { admin: true, isActive: true, id: { not: id } },
                    });
                    if (others === 0) {
                        throw new BadRequestException(
                            'This is the last active admin; make someone else an admin first.',
                        );
                    }
                }
                if (patch.branchId !== undefined && patch.branchId !== null) {
                    const branch = await tx.branch.findUnique({
                        where: { id: patch.branchId },
                        select: { id: true },
                    });
                    if (!branch)
                        throw new BadRequestException(
                            'That branch does not exist.',
                        );
                }

                const changes = diffUserChanges(before, patch);
                if (changes.length === 0) return;
                await tx.user.update({
                    where: { id },
                    data: Object.fromEntries(
                        changes.map((c) => [c.field, c.to]),
                    ),
                });
                for (const c of changes) {
                    await this.audit.record(
                        actor.email,
                        'user',
                        `${before.email}: ${c.field} ${show(c.from)} → ${show(c.to)} (reason: ${reason})`,
                        tx,
                    );
                }
                // Serializable: two admins removing each other at the same moment must not both pass the
                // "last active admin" count; one of them fails and can retry.
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
    }

    async setOverrides(
        id: string,
        body: SetOverridesRequest,
        actor: Actor,
    ): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const before = await tx.user.findUnique({
                where: { id },
                select: USER_SELECT,
            });
            if (!before) throw new NotFoundException('Person not found');

            const changes = diffOverrides(
                before.permissionOverrides.map((o) => ({
                    key: o.key as PermissionKey,
                    granted: o.granted,
                    expiresAt: o.expiresAt?.toISOString() ?? null,
                })),
                body.overrides,
            );
            if (changes.length === 0) return;

            // Only the keys that changed are written, so untouched overrides keep who set them and why.
            const next = new Map(body.overrides.map((o) => [o.key, o]));
            for (const c of changes) {
                const o = next.get(c.key);
                if (!o) {
                    await tx.userPermissionOverride.deleteMany({
                        where: { userId: id, key: c.key },
                    });
                    continue;
                }
                const data = {
                    granted: o.granted,
                    expiresAt: o.expiresAt ? new Date(o.expiresAt) : null,
                    reason: body.reason,
                    createdBy: actor.email,
                    createdAt: new Date(),
                };
                await tx.userPermissionOverride.upsert({
                    where: { userId_key: { userId: id, key: c.key } },
                    create: { userId: id, key: c.key, ...data },
                    update: data,
                });
            }
            for (const c of changes) {
                await this.audit.record(
                    actor.email,
                    'permission',
                    `${before.email}: ${c.key} ${c.from ?? 'none'} → ${c.to ?? 'none'} (reason: ${body.reason})`,
                    tx,
                );
            }
        });
    }

    async matrix(): Promise<PermissionMatrix> {
        return this.toMatrix(await this.permissions.presets());
    }

    /** Applies only the toggled cells. The Admin preset always holds everything, so cells for Admin are ignored. */
    async setMatrix(
        body: UpdatePermissionMatrixRequest,
        actor: Actor,
    ): Promise<void> {
        const changes = body.changes.filter((c) => c.role !== 'ADMIN');
        await this.prisma.$transaction(async (tx) => {
            for (const c of changes) {
                const existing = await tx.rolePermission.findUnique({
                    where: { role_key: { role: c.role, key: c.key } },
                    select: { role: true },
                });
                if (c.granted === !!existing) continue;
                if (c.granted) {
                    await tx.rolePermission.create({
                        data: { role: c.role, key: c.key },
                    });
                } else {
                    await tx.rolePermission.delete({
                        where: { role_key: { role: c.role, key: c.key } },
                    });
                }
                await this.audit.record(
                    actor.email,
                    'permission',
                    `${c.role}: ${c.key} ${c.granted ? 'granted' : 'removed'} (reason: ${body.reason})`,
                    tx,
                );
            }
        });
        await this.redis.del(ROLE_PRESETS_CACHE_KEY);
    }

    private toMatrix(rows: { role: string; key: string }[]): PermissionMatrix {
        const known = new Set<string>(PERMISSION_KEYS);
        return Object.fromEntries(
            ROLES.map((role) => [
                role,
                rows
                    .filter((r) => r.role === role && known.has(r.key))
                    .map((r) => r.key as PermissionKey),
            ]),
        ) as unknown as PermissionMatrix;
    }
}
