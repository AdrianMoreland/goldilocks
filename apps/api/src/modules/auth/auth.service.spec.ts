import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthProviderPort } from './auth-provider.port';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { CreateUserRequest } from '@goldilocks/shared-types';

const dto: CreateUserRequest = {
    email: 'new@example.com',
    password: 'a-long-enough-password',
    firstName: 'New',
    lastName: 'Person',
    role: 'SALES',
    admin: false,
};

function build() {
    const provider = {
        signInWithPassword: jest.fn(),
        verifyToken: jest.fn(),
        createIdentity: jest
            .fn()
            .mockResolvedValue({ id: 'id-1', email: dto.email }),
        deleteIdentity: jest.fn().mockResolvedValue(undefined),
    };
    const prisma = { user: { create: jest.fn(), findUnique: jest.fn() } };
    const service = new AuthService(
        provider satisfies AuthProviderPort,
        prisma as unknown as PrismaService,
    );
    return { service, provider, prisma };
}

describe('AuthService.createUser', () => {
    it('creates the identity first and uses its id for the User row', async () => {
        const { service, provider, prisma } = build();
        prisma.user.create.mockResolvedValue({
            id: 'id-1',
            email: dto.email,
            firstName: 'New',
            lastName: 'Person',
            role: 'SALES',
            admin: false,
            isActive: true,
        });

        const result = await service.createUser(dto);

        expect(provider.createIdentity).toHaveBeenCalledWith(
            dto.email,
            dto.password,
        );
        expect(prisma.user.create.mock.calls[0][0].data).toMatchObject({
            id: 'id-1',
            password: '',
        });
        expect(result).toMatchObject({ id: 'id-1', email: dto.email });
        expect(provider.deleteIdentity).not.toHaveBeenCalled();
    });

    it('rolls the identity back and rethrows when the User row cannot be written', async () => {
        const { service, provider, prisma } = build();
        const failure = new Error('unique constraint');
        prisma.user.create.mockRejectedValue(failure);

        await expect(service.createUser(dto)).rejects.toBe(failure);
        expect(provider.deleteIdentity).toHaveBeenCalledWith('id-1');
    });

    it('still surfaces the original error if the rollback itself fails', async () => {
        const { service, provider, prisma } = build();
        const failure = new Error('unique constraint');
        prisma.user.create.mockRejectedValue(failure);
        provider.deleteIdentity.mockRejectedValue(new Error('supabase down'));

        await expect(service.createUser(dto)).rejects.toBe(failure);
    });

    it('does not touch the database when the provider rejects the identity', async () => {
        const { service, provider, prisma } = build();
        provider.createIdentity.mockRejectedValue(
            new ConflictException('exists'),
        );

        await expect(service.createUser(dto)).rejects.toBeInstanceOf(
            ConflictException,
        );
        expect(prisma.user.create).not.toHaveBeenCalled();
        expect(provider.deleteIdentity).not.toHaveBeenCalled();
    });
});
