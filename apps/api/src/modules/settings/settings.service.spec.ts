import { SettingsService } from './settings.service';

function setup(stored: unknown = null, template: unknown = null) {
    const prisma = {
        userPreference: {
            findUnique: jest
                .fn()
                .mockResolvedValue(stored === null ? null : { data: stored }),
            upsert: jest.fn().mockResolvedValue({}),
        },
        companySetting: {
            findUnique: jest
                .fn()
                .mockResolvedValue(
                    template === null ? null : { value: template },
                ),
            upsert: jest.fn().mockResolvedValue({}),
        },
        $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(prisma)),
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    return {
        service: new SettingsService(prisma as never, audit as never),
        prisma,
        audit,
    };
}

describe('SettingsService preferences', () => {
    it('gives the defaults to someone who never saved anything', async () => {
        const { service } = setup();
        await expect(service.preferences('u1')).resolves.toMatchObject({
            detail: 'detailed',
            board: { view: 'GOLD', pins: [] },
        });
    });

    it('falls back to the defaults when a stored record no longer parses', async () => {
        const { service } = setup({ detail: 'loud' });
        await expect(service.preferences('u1')).resolves.toMatchObject({
            detail: 'detailed',
        });
    });

    it('saves the whole record for that person', async () => {
        const { service, prisma } = setup();
        const prefs = {
            detail: 'simple' as const,
            singleKeyShortcuts: false,
            quote: { signOff: 'Maeve', defaultChannel: 'email' as const },
            board: { view: 'SILVER', pins: [1] },
            notifications: { muted: [] },
        };
        await service.savePreferences('u1', prefs);
        expect(prisma.userPreference.upsert).toHaveBeenCalledWith({
            where: { userId: 'u1' },
            create: { userId: 'u1', data: prefs },
            update: { data: prefs },
        });
    });
});

describe('SettingsService quote template', () => {
    it('is empty (built-in wording) until an admin sets it', async () => {
        const { service } = setup();
        await expect(service.quoteTemplate()).resolves.toEqual({
            opening: null,
            closingNote: null,
        });
    });

    it('saves and audits a change', async () => {
        const { service, prisma, audit } = setup();
        await service.saveQuoteTemplate(
            { opening: 'Hello from {name}', closingNote: null },
            'boss@merrion.ie',
        );
        expect(prisma.companySetting.upsert).toHaveBeenCalledWith(
            expect.objectContaining({ where: { key: 'quote-template' } }),
        );
        expect(audit.record).toHaveBeenCalledWith(
            'boss@merrion.ie',
            'settings',
            'quote template changed',
            prisma,
        );
    });
});
