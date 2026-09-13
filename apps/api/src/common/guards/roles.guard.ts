import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RequestWithUser } from './jwt-auth.guard';

/**
 * Checks the User row JwtAuthGuard already attached to the request —
 * previously this queried a Supabase `profiles` table that doesn't exist in
 * this schema (this app's role/admin fields live on Prisma's own `users`
 * table), so every admin-gated route was unconditionally forbidden. Must
 * run after JwtAuthGuard.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest<RequestWithUser>();
        if (!user) throw new ForbiddenException('No user found on request');

        const isAdmin = user.admin === true;
        if (requiredRoles.includes('admin') && !isAdmin) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
