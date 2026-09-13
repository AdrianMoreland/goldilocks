import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../../supabase/supabase.service';
import type { AuthIdentity, AuthProviderPort, AuthSession } from '../auth-provider.port';

/**
 * Supabase implementation of AuthProviderPort — the only file in the app
 * that should ever call SupabaseService's auth methods. Reuses the existing
 * shared SupabaseService (anon-key client) rather than opening yet another
 * Supabase client — this module previously had three separate `createClient`
 * calls scattered around; this is now the one place login/token-verification
 * actually happens.
 */
@Injectable()
export class SupabaseAuthProvider implements AuthProviderPort {
    constructor(private readonly supabase: SupabaseService) {}

    async signInWithPassword(email: string, password: string): Promise<AuthSession> {
        let data;
        try {
            data = await this.supabase.signIn(email, password);
        } catch {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!data.session || !data.user?.email) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token ?? null,
            identity: { id: data.user.id, email: data.user.email },
        };
    }

    async verifyToken(token: string): Promise<AuthIdentity> {
        const user = await this.supabase.getUserFromToken(token);
        if (!user?.email) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        return { id: user.id, email: user.email };
    }
}
