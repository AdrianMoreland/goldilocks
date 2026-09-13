/**
 * Auth provider abstraction — everything the rest of the app needs from
 * "whatever handles logins" boiled down to two operations. AuthService only
 * ever talks to this interface, never to Supabase directly, so swapping the
 * identity provider later (Auth0, Cognito, a hand-rolled one, whatever)
 * means writing one new class that implements this and changing the single
 * DI binding in auth.module.ts — nothing else in the app changes.
 *
 * `id` here is expected to double as the app's own User.id (see
 * SupabaseAuthProvider) so the rest of the app never has to think about a
 * separate "external identity id" — there's just one id per person.
 */
export interface AuthIdentity {
    id: string;
    email: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string | null;
    identity: AuthIdentity;
}

export interface AuthProviderPort {
    /** Throws UnauthorizedException on bad credentials. */
    signInWithPassword(email: string, password: string): Promise<AuthSession>;

    /** Throws UnauthorizedException on an invalid/expired token. */
    verifyToken(token: string): Promise<AuthIdentity>;
}

export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');
