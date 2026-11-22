"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SupabaseAuthProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthProvider = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/prisma/prisma.service");
const supabase_service_1 = require("../../../infrastructure/supabase/supabase.service");
let SupabaseAuthProvider = SupabaseAuthProvider_1 = class SupabaseAuthProvider {
    supabase;
    prisma;
    logger = new common_1.Logger(SupabaseAuthProvider_1.name);
    constructor(supabase, prisma) {
        this.supabase = supabase;
        this.prisma = prisma;
    }
    db() {
        if (!this.prisma)
            throw new Error('Sessions need the database');
        return this.prisma;
    }
    async listSessions(userId) {
        const rows = await this.db().$queryRaw `
            SELECT id::text, user_agent, host(ip) AS ip, created_at,
                   coalesce(refreshed_at AT TIME ZONE 'UTC', updated_at, created_at) AS last_active
            FROM auth.sessions
            WHERE user_id = ${userId}::uuid AND (not_after IS NULL OR not_after > now())
            ORDER BY 5 DESC`;
        return rows.map((r) => ({
            id: r.id,
            userAgent: r.user_agent,
            ip: r.ip,
            createdAt: r.created_at,
            lastActiveAt: r.last_active,
        }));
    }
    async revokeSession(userId, sessionId) {
        const n = await this.db().$executeRaw `
            DELETE FROM auth.sessions WHERE id = ${sessionId}::uuid AND user_id = ${userId}::uuid`;
        return n > 0;
    }
    async revokeOtherSessions(userId, keepId) {
        return this.db().$executeRaw `
            DELETE FROM auth.sessions WHERE user_id = ${userId}::uuid AND id <> ${keepId}::uuid`;
    }
    async signInWithPassword(email, password) {
        let data;
        try {
            data = await this.supabase.signIn(email, password);
        }
        catch (error) {
            if (isRejectedCredentials(error)) {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            this.logger.error('Supabase sign-in failed', error instanceof Error ? error.stack : String(error));
            throw new common_1.ServiceUnavailableException('Sign-in is temporarily unavailable. Please try again shortly.');
        }
        if (!data.session || !data.user?.email) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token ?? null,
            identity: { id: data.user.id, email: data.user.email },
        };
    }
    async refreshSession(refreshToken) {
        let data;
        try {
            data = await this.supabase.refreshSession(refreshToken);
        }
        catch (error) {
            if (isRejectedCredentials(error)) {
                throw new common_1.UnauthorizedException('Your session has expired. Please sign in again.');
            }
            this.logger.error('Supabase session refresh failed', error instanceof Error ? error.stack : String(error));
            throw new common_1.ServiceUnavailableException('Sign-in is temporarily unavailable. Please try again shortly.');
        }
        if (!data.session || !data.user?.email) {
            throw new common_1.UnauthorizedException('Your session has expired. Please sign in again.');
        }
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token ?? null,
            identity: { id: data.user.id, email: data.user.email },
        };
    }
    async verifyToken(token) {
        const user = token.trim()
            ? await this.supabase.getUserFromToken(token)
            : null;
        if (!user?.email) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        return { id: user.id, email: user.email };
    }
    async createIdentity(email, password) {
        try {
            const user = await this.supabase.adminCreateUser(email, password);
            return { id: user.id, email: user.email ?? email };
        }
        catch (error) {
            const { status, code } = errorDetails(error);
            if (status === 422 || code === 'email_exists') {
                throw new common_1.ConflictException('A user with this email already exists.');
            }
            this.logger.error('Supabase createUser failed', error instanceof Error ? error.stack : String(error));
            throw new common_1.InternalServerErrorException('Could not create the account.');
        }
    }
    async inviteIdentity(email) {
        try {
            const user = await this.supabase.adminInviteUser(email);
            return { id: user.id, email: user.email ?? email };
        }
        catch (error) {
            const { status, code } = errorDetails(error);
            if (status === 422 || code === 'email_exists') {
                throw new common_1.ConflictException('A user with this email already exists.');
            }
            this.logger.error('Supabase inviteUserByEmail failed', error instanceof Error ? error.stack : String(error));
            throw new common_1.InternalServerErrorException('Could not create the account.');
        }
    }
    async deleteIdentity(id) {
        await this.supabase.adminDeleteUser(id);
    }
};
exports.SupabaseAuthProvider = SupabaseAuthProvider;
exports.SupabaseAuthProvider = SupabaseAuthProvider = SupabaseAuthProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        prisma_service_1.PrismaService])
], SupabaseAuthProvider);
function errorDetails(error) {
    if (typeof error !== 'object' || error === null)
        return {};
    const { status, code } = error;
    return {
        status: typeof status === 'number' ? status : undefined,
        code: typeof code === 'string' ? code : undefined,
    };
}
function isRejectedCredentials(error) {
    const { status } = errorDetails(error);
    return (status !== undefined && status >= 400 && status < 500 && status !== 429);
}
//# sourceMappingURL=supabase-auth.provider.js.map