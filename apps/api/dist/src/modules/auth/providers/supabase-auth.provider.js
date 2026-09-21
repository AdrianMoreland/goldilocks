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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthProvider = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../../supabase/supabase.service");
let SupabaseAuthProvider = class SupabaseAuthProvider {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async signInWithPassword(email, password) {
        let data;
        try {
            data = await this.supabase.signIn(email, password);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid email or password');
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
};
exports.SupabaseAuthProvider = SupabaseAuthProvider;
exports.SupabaseAuthProvider = SupabaseAuthProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SupabaseAuthProvider);
//# sourceMappingURL=supabase-auth.provider.js.map