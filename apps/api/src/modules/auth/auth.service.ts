import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
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
    SessionBranch,
    SessionUser,
    InviteUserRequest,
    UiSettings,
} from '@goldilocks/shared-types';
import { UiSettingsSchema } from '@goldilocks/shared-types';
import type { Prisma, User } from '../../../prisma/generated/client';

// Never select the password hash for anything that ends up on request.user -
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
    branchId: true,
    uiSettings: true,
    branch: { select: { id: true, name: true, region: true } },
} as const;

export type AuthenticatedUser = Omit<User, 'password'> & {
    branch: SessionBranch | null;
};

/**
 * AuthService - the app's only entry point for "who is this and are they
 * allowed in". Everything identity-provider-specific lives behind
 * AuthProviderPort (see auth-provider.port.ts); this class only knows about
 * that interface plus this app's own User table.
 *
 * Deliberately closed: this is a small internal tool with a handful of
 * known staff accounts, provisioned via prisma/provision-users.ts - there's
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
        // For the People directory's "last sign-in". Never blocks a sign-in.
        await this.prisma.user
            .update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
                select: { id: true },
            })
            .catch((error: unknown) =>
                this.logger.warn(
                    `Could not record the sign-in time: ${error instanceof Error ? error.message : String(error)}`,
                ),
            );

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

    /** Used by JwtAuthGuard - the returned row is attached to request.user (password hash excluded at the query level, never fetched). */
    async validateToken(token: string): Promise<AuthenticatedUser> {
        const identity = await this.authProvider.verifyToken(token);
        return this.loadActiveUser(identity);
    }

    /** Admin-only: provisions a new staff account (identity at the auth provider + matching Prisma User row, same id - see prisma/provision-users.ts for the reference pattern). */
    async createUser(
        dto: CreateUserRequest,
        actor: string,
    ): Promise<SessionUser> {
        // Checked first so a bad branch can't leave an identity at the provider to roll back.
        if (dto.branchId !== null) await this.requireBranch(dto.branchId);
        const identity = await this.authProvider.createIdentity(
            dto.email,
            dto.password,
        );
        return this.provisionUser(identity, dto, actor, 'created');
    }

    /** Admin-only: like createUser, but the person sets their own password from an emailed link. */
    async inviteUser(
        dto: InviteUserRequest,
        actor: string,
    ): Promise<SessionUser> {
        if (dto.branchId !== null) await this.requireBranch(dto.branchId);
        // Checked first: for an email whose invite is still pending the provider re-sends it and returns the
        // existing identity, and the rollback below would then delete that person's login.
        const existing = await this.prisma.user.findFirst({
            where: { email: { equals: dto.email, mode: 'insensitive' } },
            select: { id: true },
        });
        if (existing)
            throw new ConflictException(
                'A user with this email already exists.',
            );
        const identity = await this.authProvider.inviteIdentity(dto.email);
        return this.provisionUser(identity, dto, actor, 'invited');
    }

    /** The app-side User row for a new identity, rolled back at the provider if the row cannot be written. */
    private async provisionUser(
        identity: AuthIdentity,
        dto: Omit<CreateUserRequest, 'password'>,
        actor: string,
        verb: 'created' | 'invited',
    ): Promise<SessionUser> {
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
                        branchId: dto.branchId,
                        isActive: true,
                    },
                    select: SAFE_USER_SELECT,
                });
                await this.audit.record(
                    actor,
                    'user',
                    `${verb} ${dto.email} (${dto.role}${dto.admin ? ', admin' : ''})`,
                    tx,
                );
                return created;
            });

            return this.toSessionUser(user);
        } catch (error) {
            // The two writes can't share a transaction. Without this the
            // identity would be orphaned and the same email could never be
            // provisioned again.
            // An identity that already had an account (a re-sent invite, or two invites at once) is not ours
            // to delete; only roll back a login this call created.
            let owned: { id: string } | null = null;
            try {
                owned = await this.prisma.user.findUnique({
                    where: { id: identity.id },
                    select: { id: true },
                });
            } catch {
                owned = null;
            }
            if (owned) throw error;
            await this.authProvider
                .deleteIdentity(identity.id)
                .catch((cleanupError: unknown) => {
                    this.logger.error(
                        `Could not roll back auth identity ${identity.id} after the User row failed - delete it manually`,
                        cleanupError instanceof Error
                            ? cleanupError.stack
                            : String(cleanupError),
                    );
                });
            throw error;
        }
    }

    /** Admin-only: moves a staff member to another branch, or clears it (which behaves as an Irish branch). */
    async setUserBranch(
        userId: string,
        branchId: number | null,
        actor: string,
    ): Promise<SessionUser> {
        const existing = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!existing) throw new NotFoundException('User not found.');
        if (branchId !== null) await this.requireBranch(branchId);

        const user = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id: userId },
                data: { branchId },
                select: SAFE_USER_SELECT,
            });
            await this.audit.record(
                actor,
                'user',
                `moved ${existing.email} to ${updated.branch ? `${updated.branch.name} (${updated.branch.region})` : 'no branch'}`,
                tx,
            );
            return updated;
        });
        return this.toSessionUser(user);
    }

    private async requireBranch(branchId: number): Promise<void> {
        const branch = await this.prisma.branch.findUnique({
            where: { id: branchId },
            select: { id: true },
        });
        if (!branch)
            throw new BadRequestException('That branch does not exist.');
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
            branch: user.branch,
            uiSettings: readUiSettings(user.uiSettings),
        };
    }

    /** Saves the look a person chose on their account, so it follows them to any browser. */
    async saveUiSettings(userId: string, settings: UiSettings): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { uiSettings: settings as Prisma.InputJsonValue },
        });
    }
}

/** A stored value that no longer fits the schema (an older shape, a hand edit) reads as "never chosen", not an error. */
function readUiSettings(raw: unknown): UiSettings | null {
    const parsed = UiSettingsSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
}
