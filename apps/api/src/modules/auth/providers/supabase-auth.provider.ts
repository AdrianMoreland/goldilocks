import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../../supabase/supabase.service';
import type {
    AuthIdentity,
    AuthProviderPort,
    AuthSession,
} from '../auth-provider.port';

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
    private readonly logger = new Logger(SupabaseAuthProvider.name);

    constructor(private readonly supabase: SupabaseService) {}

    async signInWithPassword(
        email: string,
        password: string,
    ): Promise<AuthSession> {
        let data: Awaited<ReturnType<SupabaseService['signIn']>>;
        try {
            data = await this.supabase.signIn(email, password);
        } catch (error) {
            // Only a definite "no" from Supabase is a credentials problem. A
            // network failure, 5xx or rate limit must not read as "wrong
            // password" — staff would keep retrying against an outage.
            if (isRejectedCredentials(error)) {
                throw new UnauthorizedException('Invalid email or password');
            }
            this.logger.error(
                'Supabase sign-in failed',
                error instanceof Error ? error.stack : String(error),
            );
            throw new ServiceUnavailableException(
                'Sign-in is temporarily unavailable. Please try again shortly.',
            );
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

    async refreshSession(refreshToken: string): Promise<AuthSession> {
        let data: Awaited<ReturnType<SupabaseService['refreshSession']>>;
        try {
            data = await this.supabase.refreshSession(refreshToken);
        } catch (error) {
            // Same rule as sign-in: only a definite "no" ends the session. An outage or rate limit must not
            // sign people out; the web app keeps the refresh token and tries again.
            if (isRejectedCredentials(error)) {
                throw new UnauthorizedException(
                    'Your session has expired. Please sign in again.',
                );
            }
            this.logger.error(
                'Supabase session refresh failed',
                error instanceof Error ? error.stack : String(error),
            );
            throw new ServiceUnavailableException(
                'Sign-in is temporarily unavailable. Please try again shortly.',
            );
        }

        if (!data.session || !data.user?.email) {
            throw new UnauthorizedException(
                'Your session has expired. Please sign in again.',
            );
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

    async createIdentity(
        email: string,
        password: string,
    ): Promise<AuthIdentity> {
        try {
            const user = await this.supabase.adminCreateUser(email, password);
            return { id: user.id, email: user.email ?? email };
        } catch (error) {
            const { status, code } = errorDetails(error);
            if (status === 422 || code === 'email_exists') {
                throw new ConflictException(
                    'A user with this email already exists.',
                );
            }
            this.logger.error(
                'Supabase createUser failed',
                error instanceof Error ? error.stack : String(error),
            );
            throw new InternalServerErrorException(
                'Could not create the account.',
            );
        }
    }

    async deleteIdentity(id: string): Promise<void> {
        await this.supabase.adminDeleteUser(id);
    }
}

function errorDetails(error: unknown): { status?: number; code?: string } {
    if (typeof error !== 'object' || error === null) return {};
    const { status, code } = error as { status?: unknown; code?: unknown };
    return {
        status: typeof status === 'number' ? status : undefined,
        code: typeof code === 'string' ? code : undefined,
    };
}

function isRejectedCredentials(error: unknown): boolean {
    const { status } = errorDetails(error);
    return (
        status !== undefined && status >= 400 && status < 500 && status !== 429
    );
}
