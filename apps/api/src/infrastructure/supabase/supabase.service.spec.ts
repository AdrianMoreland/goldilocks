import { createClient } from '@supabase/supabase-js';
import type { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn() }));

const createClientMock = createClient as jest.MockedFunction<
    typeof createClient
>;

function build() {
    const auth = {
        getUser: jest.fn(),
        signInWithPassword: jest.fn(),
        refreshSession: jest.fn(),
    };
    createClientMock.mockReturnValue({ auth } as never);
    const config = {
        get: (key: string) =>
            ({
                SUPABASE_URL: 'http://supabase.local',
                SUPABASE_KEY: 'anon-key',
            })[key],
    } as unknown as ConfigService;
    return { service: new SupabaseService(config), auth };
}

describe('SupabaseService', () => {
    beforeEach(() => createClientMock.mockReset());

    it('creates the shared client without a stored or auto-refreshed session', () => {
        build();
        expect(createClientMock).toHaveBeenCalledTimes(1);
        expect(createClientMock).toHaveBeenCalledWith(
            'http://supabase.local',
            'anon-key',
            expect.objectContaining({
                auth: expect.objectContaining({
                    persistSession: false,
                    autoRefreshToken: false,
                }) as unknown,
            }),
        );
    });

    it.each(['', '   '])(
        'returns null for an empty or blank token (%j) without calling auth.getUser',
        async (token) => {
            const { service, auth } = build();
            await expect(service.getUserFromToken(token)).resolves.toBeNull();
            expect(auth.getUser).not.toHaveBeenCalled();
        },
    );

    it('passes a real token to auth.getUser and returns its user', async () => {
        const { service, auth } = build();
        auth.getUser.mockResolvedValue({
            data: { user: { id: 'u1', email: 'a@b.c' } },
            error: null,
        });
        await expect(service.getUserFromToken('jwt')).resolves.toEqual({
            id: 'u1',
            email: 'a@b.c',
        });
        expect(auth.getUser).toHaveBeenCalledWith('jwt');
    });
});
