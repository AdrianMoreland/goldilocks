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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
let SupabaseService = class SupabaseService {
    configService;
    supabase;
    supabaseAdmin = null;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase env variables not set');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    get client() {
        return this.supabase;
    }
    get admin() {
        if (!this.supabaseAdmin) {
            const supabaseUrl = this.configService.get('SUPABASE_URL');
            const serviceRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
            if (!supabaseUrl || !serviceRoleKey) {
                throw new common_1.InternalServerErrorException('SUPABASE_SERVICE_ROLE_KEY not set');
            }
            this.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey);
        }
        return this.supabaseAdmin;
    }
    async adminCreateUser(email, password) {
        const { data, error } = await this.admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data.user;
    }
    async signUp(email, password) {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async signIn(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return { success: true };
    }
    async updateUserPassword(password) {
        const { data, error } = await this.supabase.auth.updateUser({ password });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async updateUserEmail(newEmail) {
        const { data, error } = await this.supabase.auth.updateUser({ email: newEmail });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async getUserFromToken(token) {
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error)
            return null;
        return data.user;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map