import type { AdminLogEntry } from '@goldilocks/shared-types';
import { AppLogsService } from './app-logs.service';
import { logBuffer } from './log-buffer';

const entry = (over: Partial<AdminLogEntry>): AdminLogEntry =>
    ({
        level: 'info',
        message: 'm',
        ...over,
    }) as AdminLogEntry;

describe('AppLogsService.search', () => {
    const service = new AppLogsService();
    let recent: jest.SpyInstance;

    beforeEach(() => {
        recent = jest.spyOn(logBuffer, 'recent').mockReturnValue([
            entry({ level: 'error', message: 'Boom', url: '/trade/cart' }),
            entry({
                level: 'info',
                message: 'Started',
                context: 'Bootstrap',
            }),
            entry({ level: 'debug', message: 'noise' }),
        ]);
    });
    afterEach(() => recent.mockRestore());

    it('keeps entries at or above the requested level', () => {
        const { entries } = service.search({ limit: 50, level: 'info' });
        expect(entries.map((e) => e.message)).toEqual(['Boom', 'Started']);
    });

    it('matches the search term across message, context, url and method, ignoring case', () => {
        expect(
            service
                .search({ limit: 50, level: 'trace', q: '  CART ' })
                .entries.map((e) => e.message),
        ).toEqual(['Boom']);
        expect(
            service
                .search({ limit: 50, level: 'trace', q: 'bootstrap' })
                .entries.map((e) => e.message),
        ).toEqual(['Started']);
    });

    it('applies the limit after filtering', () => {
        const { entries } = service.search({ limit: 1, level: 'trace' });
        expect(entries).toHaveLength(1);
    });
});
