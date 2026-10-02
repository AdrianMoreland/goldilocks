/**
 * Auth provider abstraction — everything the rest of the app needs from
 * "whatever handles logins" boiled down to five operations. AuthService only
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

    /**
     * Exchanges a refresh token for a fresh session. Providers that rotate refresh tokens return the
     * new one in `refreshToken`. Throws UnauthorizedException when the token is invalid or expired.
     */
    refreshSession(refreshToken: string): Promise<AuthSession>;

    /** Throws UnauthorizedException on an invalid/expired token. */
    verifyToken(token: string): Promise<AuthIdentity>;

    /**
     * Provisions a new login. The returned id becomes the app's User.id.
     * Throws ConflictException if the email is already registered.
     */
    createIdentity(email: string, password: string): Promise<AuthIdentity>;

    /** Undoes createIdentity when the app-side User row could not be written. */
    deleteIdentity(id: string): Promise<void>;
}

export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');
