import { BranchesService } from './branches.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

describe('BranchesService.create', () => {
    it('writes the branch and its audit entry in one transaction', async () => {
        const tx = {
            branch: {
                create: jest.fn().mockResolvedValue({
                    id: 3,
                    name: 'Cork',
                    address: null,
                    region: 'IE',
                    currency: 'EUR',
                    createdAt: new Date('2026-10-25T10:00:00Z'),
                }),
            },
        };
        const prisma = {
            $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        };
        const audit = { record: jest.fn().mockResolvedValue(undefined) };
        const service = new BranchesService(
            prisma as unknown as PrismaService,
            audit as unknown as AuditLogService,
        );

        const branch = await service.create(
            { name: 'Cork', region: 'IE', currency: 'EUR' },
            'admin@merrion.ie',
        );

        expect(branch.id).toBe(3);
        expect(audit.record).toHaveBeenCalledWith(
            'admin@merrion.ie',
            'branch-create',
            'Cork (IE, EUR)',
            tx,
        );
    });

    it('does not return a branch when the audit entry cannot be written', async () => {
        const tx = {
            branch: {
                create: jest.fn().mockResolvedValue({
                    name: 'Cork',
                    region: 'IE',
                    currency: 'EUR',
                }),
            },
        };
        const prisma = {
            $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        };
        const audit = {
            record: jest.fn().mockRejectedValue(new Error('db down')),
        };
        const service = new BranchesService(
            prisma as unknown as PrismaService,
            audit as unknown as AuditLogService,
        );

        await expect(
            service.create(
                { name: 'Cork', region: 'IE', currency: 'EUR' },
                'a@b.ie',
            ),
        ).rejects.toThrow('db down');
    });
});
