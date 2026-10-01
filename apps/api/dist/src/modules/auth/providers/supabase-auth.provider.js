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
var SupabaseAuthProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthProvider = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../../supabase/supabase.service");
let SupabaseAuthProvider = SupabaseAuthProvider_1 = class SupabaseAuthProvider {
    supabase;
    logger = new common_1.Logger(SupabaseAuthProvider_1.name);
    constructor(supabase) {
        this.supabase = supabase;
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
    async verifyToken(token) {
        const user = await this.supabase.getUserFromToken(token);
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
    async deleteIdentity(id) {
        await this.supabase.adminDeleteUser(id);
    }
};
exports.SupabaseAuthProvider = SupabaseAuthProvider;
exports.SupabaseAuthProvider = SupabaseAuthProvider = SupabaseAuthProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
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