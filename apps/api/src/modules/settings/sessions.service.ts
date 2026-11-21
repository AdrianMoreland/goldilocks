import { Inject, Injectable } from '@nestjs/common';
import { parseUserAgent, type SignedInSession } from '@goldilocks/shared-types';
import {
    AUTH_PROVIDER,
    type AuthSessionsPort,
} from '../auth/auth-provider.port';

/**
 * The session id inside the bearer token. JwtAuthGuard has already verified the token, so this only decodes it
 * to tell which listed session is the one making the request.
 */
export function sessionIdOf(authorization: string | undefined): string | null {
    const token = authorization?.replace(/^Bearer\s+/i, '');
    const payload = token?.split('.')[1];
    if (!payload) return null;
    try {
        const claims = JSON.parse(
            Buffer.from(payload, 'base64url').toString('utf8'),
        ) as { session_id?: unknown };
        return typeof claims.session_id === 'string' ? claims.session_id : null;
    } catch {
        return null;
    }
}

/** Signed-in devices, through the auth provider port (the provider owns sessions). */
@Injectable()
export class SessionsService {
    constructor(
        @Inject(AUTH_PROVIDER) private readonly provider: AuthSessionsPort,
    ) {}

    async list(
        userId: string,
        currentId: string | null,
    ): Promise<SignedInSession[]> {
        const rows = await this.provider.listSessions(userId);
        return rows.map((r) => ({
            id: r.id,
            device: parseUserAgent(r.userAgent),
            ip: r.ip,
            createdAt: r.createdAt.toISOString(),
            lastActiveAt: r.lastActiveAt.toISOString(),
            current: r.id === currentId,
        }));
    }

    /** Signs out one of the caller's own sessions. Returns false when there was no such session. */
    signOut(userId: string, sessionId: string): Promise<boolean> {
        return this.provider.revokeSession(userId, sessionId);
    }

    /** Signs out every session except the one making the request. */
    signOutOthers(userId: string, currentId: string): Promise<number> {
        return this.provider.revokeOtherSessions(userId, currentId);
    }
}
