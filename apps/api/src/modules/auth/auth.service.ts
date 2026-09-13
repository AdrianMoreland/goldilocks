import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AUTH_PROVIDER, type AuthIdentity, type AuthProviderPort } from './auth-provider.port';
import type { LoginResponse, SessionUser } from '@goldilocks/shared-types';
import type { User } from '../../../prisma/generated/client';

/**
 * AuthService — the app's only entry point for "who is this and are they
 * allowed in". Everything identity-provider-specific lives behind
 * AuthProviderPort (see auth-provider.port.ts); this class only knows about
 * that interface plus this app's own User table.
 *
 * Deliberately closed: this is a small internal tool with a handful of
 * known staff accounts, provisioned via prisma/provision-users.ts — there's
 * no public self-registration, so a valid provider token with no matching
 * User row is treated as unauthorized rather than auto-provisioned.
 */
@Injectable()
export class AuthService {
    constructor(
        @Inject(AUTH_PROVIDER) private readonly authProvider: AuthProviderPort,
        private readonly prisma: PrismaService,
    ) {}

    async login(email: string, password: string): Promise<LoginResponse> {
        const session = await this.authProvider.signInWithPassword(email, password);
        const user = await this.loadActiveUser(session.identity);

        return {
            accessToken: session.accessToken,
            user: this.toSessionUser(user),
        };
    }

    /** Used by JwtAuthGuard — the returned User (full Prisma row) is attached to request.user. */
    async validateToken(token: string): Promise<User> {
        const identity = await this.authProvider.verifyToken(token);
        return this.loadActiveUser(identity);
    }

    async me(userId: string): Promise<SessionUser> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Account not found or inactive.');
        }
        return this.toSessionUser(user);
    }

    private async loadActiveUser(identity: AuthIdentity): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id: identity.id } });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('This account is not set up for this application.');
        }
        return user;
    }

    private toSessionUser(user: User): SessionUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            admin: user.admin,
        };
    }
}
