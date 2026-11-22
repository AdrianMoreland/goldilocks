import { type SignedInSession } from '@goldilocks/shared-types';
import { type AuthSessionsPort } from '../auth/auth-provider.port';
export declare function sessionIdOf(authorization: string | undefined): string | null;
export declare class SessionsService {
    private readonly provider;
    constructor(provider: AuthSessionsPort);
    list(userId: string, currentId: string | null): Promise<SignedInSession[]>;
    signOut(userId: string, sessionId: string): Promise<boolean>;
    signOutOthers(userId: string, currentId: string): Promise<number>;
}
//# sourceMappingURL=sessions.service.d.ts.map