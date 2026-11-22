import { NotificationsService } from '../settings/notifications.service';
import { type AdminUser, type PermissionMatrix, type SetOverridesRequest, type UpdatePermissionMatrixRequest, type UpdateUserRequest } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PermissionsService } from '../permissions/permissions.service';
export interface Actor {
    id: string;
    email: string;
}
export declare class PeopleService {
    private readonly prisma;
    private readonly audit;
    private readonly redis;
    private readonly permissions;
    private readonly notifications?;
    constructor(prisma: PrismaService, audit: AuditLogService, redis: RedisService, permissions: PermissionsService, notifications?: NotificationsService | undefined);
    private changed;
    list(): Promise<AdminUser[]>;
    update(id: string, body: UpdateUserRequest, actor: Actor): Promise<void>;
    setOverrides(id: string, body: SetOverridesRequest, actor: Actor): Promise<void>;
    matrix(): Promise<PermissionMatrix>;
    setMatrix(body: UpdatePermissionMatrixRequest, actor: Actor): Promise<void>;
    private toMatrix;
}
//# sourceMappingURL=people.service.d.ts.map