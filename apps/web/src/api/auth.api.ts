import { useApiClient } from '@/api/api-client';
import { LoginResponseSchema, SessionUserSchema, type LoginRequest } from '@goldilocks/shared-types';

/** Auth — login + session lookup. Talks only to our own backend; the actual identity provider (Supabase, for now) is entirely hidden behind it. */
export function useAuthApi() {
    const client = useApiClient();

    return {
        login: (body: LoginRequest) => client.post('/auth/login', body, LoginResponseSchema),
        me: () => client.get('/auth/me', SessionUserSchema),
    };
}
