import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { RequestWithUser } from './jwt-auth.guard';

/**
 * Counts requests per signed-in user rather than per IP. A branch office shares one public address,
 * so an IP-only limit would let one busy desk throttle everyone else in the building. Requests with
 * no user (login, refresh) fall back to the client IP, which is the right key for brute-force limits.
 * Must run after JwtAuthGuard so request.user is already populated.
 */
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, unknown>): Promise<string> {
        const { user, ip } = req as unknown as Partial<RequestWithUser>;
        return Promise.resolve(user?.id ? `user:${user.id}` : `ip:${ip}`);
    }
}
