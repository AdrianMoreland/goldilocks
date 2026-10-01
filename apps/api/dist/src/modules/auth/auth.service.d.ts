import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { type AuthProviderPort } from './auth-provider.port';
import type { CreateUserRequest, LoginResponse, SessionUser } from '@goldilocks/shared-types';
import type { User } from '../../../prisma/generated/client';
export type AuthenticatedUser = Omit<User, 'password'>;
export declare class AuthService {
    private readonly authProvider;
    private readonly prisma;
    private readonly logger;
    constructor(authProvider: AuthProviderPort, prisma: PrismaService);
    login(email: string, password: string): Promise<LoginResponse>;
    validateToken(token: string): Promise<AuthenticatedUser>;
    createUser(dto: CreateUserRequest): Promise<SessionUser>;
    me(userId: string): Promise<SessionUser>;
    private loadActiveUser;
    private toSessionUser;
}
//# sourceMappingURL=auth.service.d.ts.map