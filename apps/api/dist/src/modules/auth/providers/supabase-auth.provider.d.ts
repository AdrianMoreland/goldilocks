import { SupabaseService } from '../../../supabase/supabase.service';
import type { AuthIdentity, AuthProviderPort, AuthSession } from '../auth-provider.port';
export declare class SupabaseAuthProvider implements AuthProviderPort {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    signInWithPassword(email: string, password: string): Promise<AuthSession>;
    verifyToken(token: string): Promise<AuthIdentity>;
}
//# sourceMappingURL=supabase-auth.provider.d.ts.map