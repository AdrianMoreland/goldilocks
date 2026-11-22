import { ThrottlerGuard } from '@nestjs/throttler';
export declare class UserThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, unknown>): Promise<string>;
}
//# sourceMappingURL=user-throttler.guard.d.ts.map