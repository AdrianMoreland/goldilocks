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
    refreshSession(refreshToken: string): Promise<AuthSession>;
    verifyToken(token: string): Promise<AuthIdentity>;
    createIdentity(email: string, password: string): Promise<AuthIdentity>;
    inviteIdentity(email: string): Promise<AuthIdentity>;
    deleteIdentity(id: string): Promise<void>;
}
export interface ProviderSession {
    id: string;
    userAgent: string | null;
    ip: string | null;
    createdAt: Date;
    lastActiveAt: Date;
}
export interface AuthSessionsPort {
    listSessions(userId: string): Promise<ProviderSession[]>;
    revokeSession(userId: string, sessionId: string): Promise<boolean>;
    revokeOtherSessions(userId: string, keepId: string): Promise<number>;
}
export declare const AUTH_PROVIDER: unique symbol;
//# sourceMappingURL=auth-provider.port.d.ts.map