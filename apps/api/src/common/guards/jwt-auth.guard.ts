import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { parseViewAs, VIEW_AS_HEADER } from '@goldilocks/shared-types';
import { AuthService } from '../../modules/auth/auth.service';
import type { AuthenticatedUser } from '../../modules/auth/auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const BEARER = /^Bearer (\S+)$/;

export interface RequestWithUser extends Request {
    user: AuthenticatedUser;
    /** The signed-in person themselves, set only while an admin is viewing the app as someone else. */
    realUser?: AuthenticatedUser;
    /** The "view as" value in force, set together with realUser. */
    viewAs?: string;
}

/**
 * An admin's "view as" choice: that request is treated as a non-admin of the chosen role and region, so every guard
 * and permission applies for real. Anyone who is not an admin gets their own user back, whatever header they send.
 */
export function applyViewAs(
    user: AuthenticatedUser,
    header: string | string[] | undefined,
): { user: AuthenticatedUser; viewAs?: string } {
    const option = user.admin ? parseViewAs(header) : null;
    if (!option) return { user };
    return {
        user: {
            ...user,
            admin: false,
            role: option.role,
            branch: { id: 0, name: option.label, region: option.region },
        },
        viewAs: option.value,
    };
}

/**
 * Registered globally (APP_GUARD) so a route is protected unless it is
 * explicitly marked @Public() - a forgotten decorator fails closed. Routes
 * that still declare @UseGuards(JwtAuthGuard) keep working: the second run
 * sees request.user already populated and skips, rather than repeating the
 * Supabase + DB lookup for the same token.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<RequestWithUser>();
        if (request.user) return true;

        // Exactly "Bearer <token>": an empty or split token must never reach the provider.
        const match = BEARER.exec(request.headers.authorization ?? '');
        if (!match) {
            throw new UnauthorizedException(
                'Missing or invalid authorization header',
            );
        }

        const real = await this.authService.validateToken(match[1]);
        const seen = applyViewAs(real, request.headers[VIEW_AS_HEADER]);
        request.user = seen.user;
        if (seen.viewAs) {
            request.realUser = real;
            request.viewAs = seen.viewAs;
        }
        return true;
    }
}
