import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import type { AuthenticatedUser } from '../../modules/auth/auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const BEARER = /^Bearer (\S+)$/;

export interface RequestWithUser extends Request {
    user: AuthenticatedUser;
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

        request.user = await this.authService.validateToken(match[1]);
        return true;
    }
}
