import {
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { SupabaseAuthProvider } from './supabase-auth.provider';
import type { SupabaseService } from '../../../infrastructure/supabase/supabase.service';

const sdkError = (status: number | undefined, code?: string) =>
    Object.assign(new Error('sdk error'), { status, code });

function build() {
    const supabase = {
        signIn: jest.fn(),
        getUserFromToken: jest.fn(),
        refreshSession: jest.fn(),
        adminCreateUser: jest.fn(),
        adminDeleteUser: jest.fn(),
    };
    return {
        provider: new SupabaseAuthProvider(
            supabase as unknown as SupabaseService,
        ),
        supabase,
    };
}

describe('SupabaseAuthProvider.signInWithPassword', () => {
    it.each([400, 401, 403])(
        'maps a %i from Supabase to "invalid email or password"',
        async (status) => {
            const { provider, supabase } = build();
            supabase.signIn.mockRejectedValue(
                sdkError(status, 'invalid_credentials'),
            );
            await expect(
                provider.signInWithPassword('a@b.c', 'x'),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        },
    );

    it.each([[500], [502], [429], [undefined]])(
        'reports an outage (status %s) as 503, not as bad credentials',
        async (status) => {
            const { provider, supabase } = build();
            supabase.signIn.mockRejectedValue(sdkError(status));
            await expect(
                provider.signInWithPassword('a@b.c', 'x'),
            ).rejects.toBeInstanceOf(ServiceUnavailableException);
        },
    );

    it('returns the session for valid credentials', async () => {
        const { provider, supabase } = build();
        supabase.signIn.mockResolvedValue({
            session: { access_token: 'tok', refresh_token: 'ref' },
            user: { id: 'u1', email: 'a@b.c' },
        });
        await expect(
            provider.signInWithPassword('a@b.c', 'x'),
        ).resolves.toEqual({
            accessToken: 'tok',
            refreshToken: 'ref',
            identity: { id: 'u1', email: 'a@b.c' },
        });
    });
});

describe('SupabaseAuthProvider identity management', () => {
    it('returns the new identity', async () => {
        const { provider, supabase } = build();
        supabase.adminCreateUser.mockResolvedValue({
            id: 'u2',
            email: 'n@b.c',
        });
        await expect(provider.createIdentity('n@b.c', 'pw')).resolves.toEqual({
            id: 'u2',
            email: 'n@b.c',
        });
    });

    it.each([[sdkError(422)], [sdkError(400, 'email_exists')]])(
        'maps "already registered" to 409',
        async (error) => {
            const { provider, supabase } = build();
            supabase.adminCreateUser.mockRejectedValue(error);
            await expect(
                provider.createIdentity('n@b.c', 'pw'),
            ).rejects.toBeInstanceOf(ConflictException);
        },
    );

    it('hides other provider failures behind a generic 500', async () => {
        const { provider, supabase } = build();
        supabase.adminCreateUser.mockRejectedValue(sdkError(500));
        await expect(
            provider.createIdentity('n@b.c', 'pw'),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('deletes an identity by id', async () => {
        const { provider, supabase } = build();
        supabase.adminDeleteUser.mockResolvedValue(undefined);
        await provider.deleteIdentity('u2');
        expect(supabase.adminDeleteUser).toHaveBeenCalledWith('u2');
    });
});

describe('SupabaseAuthProvider.refreshSession', () => {
    const sessionData = {
        session: { access_token: 'acc', refresh_token: 'ref' },
        user: { id: 'u1', email: 'a@b.c' },
    };

    it('returns the new tokens and the identity', async () => {
        const { provider, supabase } = build();
        supabase.refreshSession.mockResolvedValue(sessionData);

        await expect(provider.refreshSession('old')).resolves.toEqual({
            accessToken: 'acc',
            refreshToken: 'ref',
            identity: { id: 'u1', email: 'a@b.c' },
        });
        expect(supabase.refreshSession).toHaveBeenCalledWith('old');
    });

    it.each([400, 401, 403])(
        'maps a %i (token invalid or already used) to Unauthorized so the user signs in again',
        async (status) => {
            const { provider, supabase } = build();
            supabase.refreshSession.mockRejectedValue(
                sdkError(status, 'refresh_token_not_found'),
            );
            await expect(provider.refreshSession('old')).rejects.toBeInstanceOf(
                UnauthorizedException,
            );
        },
    );

    it.each([[500], [429], [undefined]])(
        'reports an outage (status %s) as 503 so a blip does not sign anyone out',
        async (status) => {
            const { provider, supabase } = build();
            supabase.refreshSession.mockRejectedValue(sdkError(status));
            await expect(provider.refreshSession('old')).rejects.toBeInstanceOf(
                ServiceUnavailableException,
            );
        },
    );

    it('treats a response without a session as an expired session', async () => {
        const { provider, supabase } = build();
        supabase.refreshSession.mockResolvedValue({
            session: null,
            user: null,
        });
        await expect(provider.refreshSession('old')).rejects.toBeInstanceOf(
            UnauthorizedException,
        );
    });
});
