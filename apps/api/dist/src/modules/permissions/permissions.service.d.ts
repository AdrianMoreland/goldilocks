import { type PermissionKey, type RolePermissionRow } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
export declare const ROLE_PRESETS_CACHE_KEY = "permissions:role-presets";
export interface PermissionUser {
    id: string;
    role: RolePermissionRow['role'];
    admin: boolean;
}
export declare class PermissionsService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    presets(): Promise<RolePermissionRow[]>;
    forUser(user: PermissionUser): Promise<PermissionKey[]>;
}
//# sourceMappingURL=permissions.service.d.ts.map