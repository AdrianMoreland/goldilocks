import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { type AuthProviderPort } from './auth-provider.port';
import type { CreateUserRequest, LoginResponse, SessionBranch, SessionUser, InviteUserRequest, UiSettings } from '@goldilocks/shared-types';
import type { User } from '../../../prisma/generated/client';
export type AuthenticatedUser = Omit<User, 'password'> & {
    branch: SessionBranch | null;
};
export declare class AuthService {
    private readonly authProvider;
    private readonly prisma;
    private readonly audit;
    private readonly logger;
    constructor(authProvider: AuthProviderPort, prisma: PrismaService, audit: AuditLogService);
    login(email: string, password: string): Promise<LoginResponse>;
    refresh(refreshToken: string): Promise<LoginResponse>;
    validateToken(token: string): Promise<AuthenticatedUser>;
    createUser(dto: CreateUserRequest, actor: string): Promise<SessionUser>;
    inviteUser(dto: InviteUserRequest, actor: string): Promise<SessionUser>;
    private provisionUser;
    setUserBranch(userId: string, branchId: number | null, actor: string): Promise<SessionUser>;
    private requireBranch;
    me(userId: string): Promise<SessionUser>;
    private loadActiveUser;
    private toSessionUser;
    saveUiSettings(userId: string, settings: UiSettings): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map