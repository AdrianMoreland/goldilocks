import { MarketModeService } from './market-mode.service';

const ACTOR = { firstName: 'Ann', lastName: 'Byrne', email: 'ann@example.com' };

function build(row: Record<string, unknown> | null) {
    const upsert = jest.fn(
        (args: { update: Record<string, unknown> }): Promise<unknown> =>
            Promise.resolve({
                ...args.update,
                updatedAt: new Date('2026-10-01T10:00:00Z'),
            }),
    );
    const prisma = {
        marketModeState: {
            findUnique: jest.fn().mockResolvedValue(row),
            upsert,
        },
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const service = new MarketModeService(prisma as never, audit as never);
    return { service, upsert, audit };
}

describe('MarketModeService', () => {
    it('is Standard when nobody has ever set a mode', async () => {
        const { service } = build(null);

        await expect(service.get()).resolves.toEqual({
            weekend: false,
            volatile: false,
            shortage: false,
            updatedBy: null,
            updatedAt: null,
        });
    });

    it('reports who last changed it and when', async () => {
        const { service } = build({
            weekend: false,
            volatile: true,
            shortage: false,
            updatedBy: 'Ann Byrne',
            updatedAt: new Date('2026-10-01T09:30:00Z'),
        });

        await expect(service.get()).resolves.toEqual({
            weekend: false,
            volatile: true,
            shortage: false,
            updatedBy: 'Ann Byrne',
            updatedAt: '2026-10-01T09:30:00.000Z',
        });
    });

    it('stores the new mode against the actor and audits the change', async () => {
        const { service, upsert, audit } = build(null);

        const state = await service.set(
            { weekend: false, volatile: true, shortage: false },
            ACTOR,
        );

        expect(upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 1 },
                update: expect.objectContaining({
                    volatile: true,
                    updatedBy: 'Ann Byrne',
                }),
            }),
        );
        expect(state.volatile).toBe(true);
        expect(state.updatedBy).toBe('Ann Byrne');
        expect(audit.record).toHaveBeenCalledWith(
            'ann@example.com',
            'market-mode',
            'standard → volatile',
        );
    });
});
