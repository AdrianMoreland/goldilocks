// src/supabase/supabase.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

/**
 * Thin wrapper over the Supabase SDK. Only SupabaseAuthProvider should call
 * it — everything else goes through AuthProviderPort. Methods throw the SDK's
 * own error (with `status`/`code`) so the provider can tell "wrong password"
 * from "Supabase is down".
 */
@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;
    private supabaseAdmin: SupabaseClient | null = null;
    private readonly supabaseUrl: string;
    private readonly supabaseKey: string;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase env variables not set');
        }

        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;

        // The SDK's untyped-schema client is generic over `any`; we use none of the typed-table API.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Lazily created — the service-role key is only ever needed for the
    // admin "create user" action, so it's never touched on the hot path of
    // a normal login/session request.
    private get admin(): SupabaseClient {
        if (!this.supabaseAdmin) {
            const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
            const serviceRoleKey = this.configService.get<string>(
                'SUPABASE_SERVICE_ROLE_KEY',
            );

            if (!supabaseUrl || !serviceRoleKey) {
                throw new InternalServerErrorException(
                    'SUPABASE_SERVICE_ROLE_KEY not set',
                );
            }

            this.supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
        }

        return this.supabaseAdmin;
    }

    /** Admin-only: provisions a new Supabase Auth identity. Callers create the matching Prisma `User` row themselves (see AuthService.createUser). */
    async adminCreateUser(email: string, password: string): Promise<User> {
        const { data, error } = await this.admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (error) throw error;
        return data.user;
    }

    /** Admin-only: removes an identity, used to roll back a half-finished createUser. */
    async adminDeleteUser(id: string): Promise<void> {
        const { error } = await this.admin.auth.admin.deleteUser(id);
        if (error) throw error;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }

    /**
     * Exchanges a refresh token for a new session. Supabase rotates refresh tokens, so the caller must
     * store the one returned here. Uses a fresh stateless client per call so one user's session never
     * lingers inside a client shared with other users.
     */
    async refreshSession(refreshToken: string) {
        const client = createClient(this.supabaseUrl, this.supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data, error } = await client.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) throw error;
        return data;
    }

    async getUserFromToken(token: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error) return null;
        return data.user;
    }
}
