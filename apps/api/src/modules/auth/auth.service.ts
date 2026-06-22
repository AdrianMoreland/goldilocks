import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import {SupabaseService} from "../../supabase/supabase.service";
import {PrismaService} from "../../infrastructure/prisma/prisma.service";
import {UserRole} from "../../../prisma/generated/enums";

@Injectable()
export class AuthService {
    private supabase: SupabaseClient;

    constructor(
        private config: ConfigService,
        private readonly supabaseService: SupabaseService,
        private readonly prisma: PrismaService,
    ) {
        this.supabase = createClient(
            this.config.getOrThrow<string>('SUPABASE_URL'),
            this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );
    }

    /**
     * Verify Supabase JWT token
     */
    async verifyAccessToken(token: string) {
        try {
            const secret = new TextEncoder().encode(
                process.env.SUPABASE_JWT_SECRET!,
            );

            const { payload } = await jwtVerify(token, secret, {
                algorithms: ['HS256'],
            });

            return {
                id: payload.sub as string,
                email: payload.email as string,
                role: payload.role as string, // optional: Supabase role
            };
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    /**
     * Ensure user exists in your app database
     */
    async ensureUserExists(userId: string, email: string) {
        return this.prisma.user.upsert({
            where: { id: userId },
            update: {}, // nothing to update for now
            create: {
                id: userId,
                email: email,                 // use the parameter
                firstName: email.split('@')[0], // default firstName from email
                lastName: '',                    // default empty lastName
                password: '',                    // blank because Supabase handles auth
                isActive: true,
                admin: false,                    // default role
                role: UserRole.ADMIN,
            },
        });
    }

    async register(data: { email: string; password: string; full_name: string; phone?: string }) {
        const { data: authData, error } = await this.supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            user_metadata: { full_name: data.full_name, role: 'customer' },
            email_confirm: true,
        });

        if (error) throw new UnauthorizedException(error.message);
        return { success: true, data: { user_id: authData.user.id } };
    }

    async login(
        data: {
            email: string;
            password: string
        }
    ) {
        const {
            data: authData,
            error
        } = await this.supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) throw new UnauthorizedException(error.message);
        return {
            success: true,
            data: {
                access_token: authData.session?.access_token,
                refresh_token: authData.session?.refresh_token,
                user: authData.user,
            },
        };
    }

    async sendOtp(phone: string) {
        const { error } = await this.supabase.auth.signInWithOtp({ phone });
        if (error) throw new UnauthorizedException(error.message);
        return { success: true, message: 'OTP sent' };
    }

    async verifyOtp(phone: string, token: string) {
        const { data: authData, error } = await this.supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });

        if (error) throw new UnauthorizedException(error.message);
        return {
            success: true,
            data: {
                access_token: authData.session?.access_token,
                refresh_token: authData.session?.refresh_token,
                user: authData.user,
            },
        };
    }

    async validateToken(token: string) {
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error) throw new UnauthorizedException('Invalid token');
        return data.user;
    }
}