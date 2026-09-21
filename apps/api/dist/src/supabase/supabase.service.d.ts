import { SupabaseClient, User } from '@supabase/supabase-js';
import { ConfigService } from "@nestjs/config";
export declare class SupabaseService {
    private configService;
    private supabase;
    private supabaseAdmin;
    constructor(configService: ConfigService);
    get client(): SupabaseClient<any, "public", "public", any, any>;
    private get admin();
    adminCreateUser(email: string, password: string): Promise<User>;
    signUp(email: string, password: string): Promise<{
        user: User | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    signIn(email: string, password: string): Promise<{
        user: User;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    }>;
    signOut(): Promise<{
        success: boolean;
    }>;
    updateUserPassword(password: string): Promise<{
        user: User;
    }>;
    updateUserEmail(newEmail: string): Promise<{
        user: User;
    }>;
    getUserFromToken(token: string): Promise<User | null>;
}
//# sourceMappingURL=supabase.service.d.ts.map