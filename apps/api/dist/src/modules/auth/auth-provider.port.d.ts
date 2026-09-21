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
    signInWithPassword(email: string, password: string): Promise<AuthSession>;
    verifyToken(token: string): Promise<AuthIdentity>;
}
export declare const AUTH_PROVIDER: unique symbol;
//# sourceMappingURL=auth-provider.port.d.ts.map