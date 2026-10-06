import { AuditLogService } from './audit-log.service';

function build() {
    const create = jest.fn().mockResolvedValue(undefined);
    const findMany = jest.fn();
    const prisma = { auditLog: { create, findMany } };
    return { service: new AuditLogService(prisma as never), create, findMany };
}

describe('AuditLogService', () => {
    it('writes through the transaction client when one is given', async () => {
        const { service, create } = build();
        const txCreate = jest.fn().mockResolvedValue(undefined);
        const tx = { auditLog: { create: txCreate } };

        await service.record('a@b.c', 'db', 'edited x', tx as never);

        expect(txCreate).toHaveBeenCalledWith({
            data: { actor: 'a@b.c', action: 'db', detail: 'edited x' },
        });
        expect(create).not.toHaveBeenCalled();
    });

    it('writes through the pool when called outside a transaction', async () => {
        const { service, create } = build();
        await service.record('a@b.c', 'roadmap', 'add: x');
        expect(create).toHaveBeenCalledTimes(1);
    });

    it('does not swallow a failed insert, so the surrounding change rolls back', async () => {
        const { service, create } = build();
        create.mockRejectedValue(new Error('db down'));
        await expect(service.record('a', 'b', 'c')).rejects.toThrow('db down');
    });

    it('returns newest first, mapped to the API shape, always persisted', async () => {
        const { service, findMany } = build();
        findMany.mockResolvedValue([
            {
                id: 2,
                at: new Date('2026-10-04T10:00:00Z'),
                actor: 'a@b.c',
                action: 'db',
                detail: 'edited x',
            },
        ]);

        await expect(service.getRecent(10)).resolves.toEqual({
            entries: [
                {
                    at: '2026-10-04T10:00:00.000Z',
                    user: 'a@b.c',
                    action: 'db',
                    detail: 'edited x',
                },
            ],
            persisted: true,
        });
        expect(findMany).toHaveBeenCalledWith({
            orderBy: [{ at: 'desc' }, { id: 'desc' }],
            take: 10,
        });
    });
});
