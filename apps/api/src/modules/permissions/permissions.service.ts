import { Injectable } from '@nestjs/common';
import {
    effectivePermissions,
    type PermissionKey,
    type RolePermissionRow,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';

/** Presets change rarely and only through Roles & permissions, which clears this key. */
export const ROLE_PRESETS_CACHE_KEY = 'permissions:role-presets';
const PRESETS_TTL_SECONDS = 300;

export interface PermissionUser {
    id: string;
    role: RolePermissionRow['role'];
    admin: boolean;
}

@Injectable()
export class PermissionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {}

    async presets(): Promise<RolePermissionRow[]> {
        const cached = await this.redis.get<RolePermissionRow[]>(
            ROLE_PRESETS_CACHE_KEY,
        );
        if (cached) return cached;
        const rows = await this.prisma.rolePermission.findMany({
            select: { role: true, key: true },
        });
        await this.redis.set(ROLE_PRESETS_CACHE_KEY, rows, PRESETS_TTL_SECONDS);
        return rows;
    }

    /** Overrides are read on every call (not cached) so a removal takes effect on the next request. */
    async forUser(user: PermissionUser): Promise<PermissionKey[]> {
        if (user.admin) return effectivePermissions(user, [], [], new Date());
        const [presets, overrides] = await Promise.all([
            this.presets(),
            this.prisma.userPermissionOverride.findMany({
                where: { userId: user.id },
                select: { key: true, granted: true, expiresAt: true },
            }),
        ]);
        return effectivePermissions(user, presets, overrides, new Date());
    }
}
