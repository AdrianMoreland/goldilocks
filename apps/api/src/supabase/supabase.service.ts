// src/supabase/supabase.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
// import { config } from 'dotenv';
import {ConfigService} from "@nestjs/config";

// config(); // load .env

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

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
