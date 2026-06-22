// src/auth/guards/supabase-auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Expect Bearer token in the Authorization header
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            throw new UnauthorizedException('Missing token');
        }

        try {
            // Verify the Supabase JWT
            const user = await this.authService.verifyAccessToken(token);

            // Optional: ensure user exists in Prisma DB
            await this.authService.ensureUserExists(user.id, user.email);

            // Attach user info to request for controllers
            request.user = user;

            return true; // allow request
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
