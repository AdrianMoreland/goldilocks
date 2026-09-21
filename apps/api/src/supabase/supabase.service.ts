// src/supabase/supabase.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
// import { config } from 'dotenv';
import {ConfigService} from "@nestjs/config";

// config(); // load .env

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;
    private supabaseAdmin: SupabaseClient | null = null;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase env variables not set');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    get client() {
        return this.supabase;
    }

    // Lazily created — the service-role key is only ever needed for the
    // admin "create user" action, so it's never touched on the hot path of
    // a normal login/session request.
    private get admin(): SupabaseClient {
        if (!this.supabaseAdmin) {
            const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
            const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

            if (!supabaseUrl || !serviceRoleKey) {
                throw new InternalServerErrorException('SUPABASE_SERVICE_ROLE_KEY not set');
            }

            this.supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
        }

        return this.supabaseAdmin;
    }

    /** Admin-only: provisions a new Supabase Auth identity. Callers create the matching Prisma `User` row themselves (see AuthService.createUser). */
    async adminCreateUser(email: string, password: string): Promise<User> {
        const { data, error } = await this.admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (error) throw new InternalServerErrorException(error.message);
        return data.user;
    }

    // Auth methods
    async signUp(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw new InternalServerErrorException(error.message);
        return { success: true };
    }


    async updateUserPassword(password: string) {
        const { data, error } = await this.supabase.auth.updateUser({ password });
        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async updateUserEmail(newEmail: string) {
        const { data, error } = await this.supabase.auth.updateUser({ email: newEmail });
        if (error) throw new InternalServerErrorException(error.message);
        return data;
    }

    async getUserFromToken(token: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error) return null;
        return data.user;
    }
}
