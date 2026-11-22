import { User } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private configService;
    private supabase;
    private supabaseAdmin;
    private readonly supabaseUrl;
    private readonly supabaseKey;
    constructor(configService: ConfigService);
    private get admin();
    adminCreateUser(email: string, password: string): Promise<User>;
    adminInviteUser(email: string): Promise<User>;
    adminDeleteUser(id: string): Promise<void>;
    signIn(email: string, password: string): Promise<{
        user: User;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    }>;
    refreshSession(refreshToken: string): Promise<{
        user: User | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    getUserFromToken(token: string): Promise<User | null>;
}
//# sourceMappingURL=supabase.service.d.ts.map