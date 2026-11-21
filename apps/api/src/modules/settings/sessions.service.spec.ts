import { SessionsService, sessionIdOf } from './sessions.service';

const jwt = (payload: object) =>
    `x.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.y`;

describe('sessionIdOf', () => {
    it('reads session_id from the bearer token the guard already verified', () => {
        expect(
            sessionIdOf(`Bearer ${jwt({ sub: 'u1', session_id: 's-1' })}`),
        ).toBe('s-1');
        expect(sessionIdOf(undefined)).toBeNull();
        expect(sessionIdOf('Bearer nonsense')).toBeNull();
    });
});

describe('SessionsService', () => {
    function setup() {
        const provider = {
            listSessions: jest.fn().mockResolvedValue([
                {
                    id: 's-1',
                    userAgent:
                        'Mozilla/5.0 (Windows NT 10.0) Chrome/131.0 Safari/537.36',
                    ip: '1.2.3.4',
                    createdAt: new Date('2026-11-01T10:00:00Z'),
                    lastActiveAt: new Date('2026-11-21T09:00:00Z'),
                },
            ]),
            revokeSession: jest.fn().mockResolvedValue(true),
            revokeOtherSessions: jest.fn().mockResolvedValue(2),
        };
        return { service: new SessionsService(provider), provider };
    }

    it('lists the person’s sessions through the auth provider, marking the current one', async () => {
        const { service, provider } = setup();
        await expect(service.list('u1', 's-1')).resolves.toEqual([
            {
                id: 's-1',
                device: 'Chrome on Windows',
                ip: '1.2.3.4',
                createdAt: '2026-11-01T10:00:00.000Z',
                lastActiveAt: '2026-11-21T09:00:00.000Z',
                current: true,
            },
        ]);
        expect(provider.listSessions).toHaveBeenCalledWith('u1');
    });

    it('signs out only through the provider, scoped to the caller', async () => {
        const { service, provider } = setup();
        await service.signOut('u1', 's-9');
        await service.signOutOthers('u1', 's-1');
        expect(provider.revokeSession).toHaveBeenCalledWith('u1', 's-9');
        expect(provider.revokeOtherSessions).toHaveBeenCalledWith('u1', 's-1');
    });
});
