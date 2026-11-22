import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { SupabaseService } from '../../../infrastructure/supabase/supabase.service';
import type { AuthIdentity, AuthProviderPort, AuthSession, AuthSessionsPort, ProviderSession } from '../auth-provider.port';
export declare class SupabaseAuthProvider implements AuthProviderPort, AuthSessionsPort {
    private readonly supabase;
    private readonly prisma?;
    private readonly logger;
    constructor(supabase: SupabaseService, prisma?: PrismaService | undefined);
    private db;
    listSessions(userId: string): Promise<ProviderSession[]>;
    revokeSession(userId: string, sessionId: string): Promise<boolean>;
    revokeOtherSessions(userId: string, keepId: string): Promise<number>;
    signInWithPassword(email: string, password: string): Promise<AuthSession>;
    refreshSession(refreshToken: string): Promise<AuthSession>;
    verifyToken(token: string): Promise<AuthIdentity>;
    createIdentity(email: string, password: string): Promise<AuthIdentity>;
    inviteIdentity(email: string): Promise<AuthIdentity>;
    deleteIdentity(id: string): Promise<void>;
}
//# sourceMappingURL=supabase-auth.provider.d.ts.map