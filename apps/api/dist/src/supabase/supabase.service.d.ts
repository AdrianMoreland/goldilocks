import { User } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private configService;
    private supabase;
    private supabaseAdmin;
    constructor(configService: ConfigService);
    private get admin();
    adminCreateUser(email: string, password: string): Promise<User>;
    adminDeleteUser(id: string): Promise<void>;
    signIn(email: string, password: string): Promise<{
        user: User;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    }>;
    getUserFromToken(token: string): Promise<User | null>;
}
//# sourceMappingURL=supabase.service.d.ts.map