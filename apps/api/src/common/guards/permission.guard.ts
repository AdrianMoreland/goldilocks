import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PermissionKey } from '@goldilocks/shared-types';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { PermissionsService } from '../../modules/permissions/permissions.service';
import type { RequestWithUser } from './jwt-auth.guard';

/** Registered globally after JwtAuthGuard, RolesGuard and CapabilityGuard; a route must pass all of them. */
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly permissions: PermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Class and handler both count: a controller's page permission AND a route's own one must be held.
        const required = this.reflector.getAllAndMerge<PermissionKey[]>(
            PERMISSION_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!required || required.length === 0) return true;

        const { user } = context.switchToHttp().getRequest<RequestWithUser>();
        // A permission on a @Public() route is a mistake; fail closed.
        if (!user) throw new ForbiddenException('Insufficient permissions');
        const held = await this.permissions.forUser(user);
        if (!required.every((key) => held.includes(key))) {
            throw new ForbiddenException('Insufficient permissions');
        }
        return true;
    }
}
