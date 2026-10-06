import {
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import {
    AUTH_PROVIDER,
    type AuthIdentity,
    type AuthProviderPort,
} from './auth-provider.port';
import type {
    CreateUserRequest,
    LoginResponse,
    SessionUser,
} from '@goldilocks/shared-types';
import type { User } from '../../../prisma/generated/client';

// Never select the password hash for anything that ends up on request.user —
// it has no business leaving the DB query, let alone sitting in memory on
// every authenticated request. See docs/ENGINEERING.md §6 "Secrets".
const SAFE_USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    isActive: true,
    admin: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
} as const;

export type AuthenticatedUser = Omit<User, 'password'>;

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
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @Inject(AUTH_PROVIDER) private readonly authProvider: AuthProviderPort,
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    async login(email: string, password: string): Promise<LoginResponse> {
        const session = await this.authProvider.signInWithPassword(
            email,
            password,
        );
        const user = await this.loadActiveUser(session.identity);

        return {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user: this.toSessionUser(user),
        };
    }

    /**
     * Trades a refresh token for a new session. The account is re-checked, so a user deactivated since
     * they signed in cannot keep renewing their session.
     */
    async refresh(refreshToken: string): Promise<LoginResponse> {
        const session = await this.authProvider.refreshSession(refreshToken);
        const user = await this.loadActiveUser(session.identity);

        return {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user: this.toSessionUser(user),
        };
    }

    /** Used by JwtAuthGuard — the returned row is attached to request.user (password hash excluded at the query level, never fetched). */
    async validateToken(token: string): Promise<AuthenticatedUser> {
        const identity = await this.authProvider.verifyToken(token);
        return this.loadActiveUser(identity);
    }

    /** Admin-only: provisions a new staff account (identity at the auth provider + matching Prisma User row, same id — see prisma/provision-users.ts for the reference pattern). */
    async createUser(
        dto: CreateUserRequest,
        actor: string,
    ): Promise<SessionUser> {
        const identity = await this.authProvider.createIdentity(
            dto.email,
            dto.password,
        );

        try {
            // The row and its audit entry share a transaction; the identity above cannot, which is
            // why a failure here deletes it again below.
            const user = await this.prisma.$transaction(async (tx) => {
                const created = await tx.user.create({
                    data: {
                        id: identity.id,
                        email: dto.email,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        password: '', // the auth provider owns the real credential
                        role: dto.role,
                        admin: dto.admin,
                        isActive: true,
                    },
                    select: SAFE_USER_SELECT,
                });
                await this.audit.record(
                    actor,
                    'user',
                    `created ${dto.email} (${dto.role}${dto.admin ? ', admin' : ''})`,
                    tx,
                );
                return created;
            });

            return this.toSessionUser(user);
        } catch (error) {
            // The two writes can't share a transaction. Without this the
            // identity would be orphaned and the same email could never be
            // provisioned again.
            await this.authProvider
                .deleteIdentity(identity.id)
                .catch((cleanupError: unknown) => {
                    this.logger.error(
                        `Could not roll back auth identity ${identity.id} after the User row failed — delete it manually`,
                        cleanupError instanceof Error
                            ? cleanupError.stack
                            : String(cleanupError),
                    );
                });
            throw error;
        }
    }

    async me(userId: string): Promise<SessionUser> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: SAFE_USER_SELECT,
        });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Account not found or inactive.');
        }
        return this.toSessionUser(user);
    }

    private async loadActiveUser(
        identity: AuthIdentity,
    ): Promise<AuthenticatedUser> {
        const user = await this.prisma.user.findUnique({
            where: { id: identity.id },
            select: SAFE_USER_SELECT,
        });
        if (!user || !user.isActive) {
            throw new UnauthorizedException(
                'This account is not set up for this application.',
            );
        }
        return user;
    }

    private toSessionUser(user: AuthenticatedUser): SessionUser {
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
