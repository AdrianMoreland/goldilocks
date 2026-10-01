import { SupabaseService } from '../../../supabase/supabase.service';
import type { AuthIdentity, AuthProviderPort, AuthSession } from '../auth-provider.port';
export declare class SupabaseAuthProvider implements AuthProviderPort {
    private readonly supabase;
    private readonly logger;
    constructor(supabase: SupabaseService);
    signInWithPassword(email: string, password: string): Promise<AuthSession>;
    verifyToken(token: string): Promise<AuthIdentity>;
    createIdentity(email: string, password: string): Promise<AuthIdentity>;
    deleteIdentity(id: string): Promise<void>;
}
//# sourceMappingURL=supabase-auth.provider.d.ts.map