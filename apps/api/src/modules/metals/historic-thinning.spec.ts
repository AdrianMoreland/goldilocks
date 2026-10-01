import { thinOldHistory } from '../../common/utils/pricing.util';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-10-01T12:00:00.000Z');
const daysAgo = (n: number) => ({
    recordedAt: new Date(NOW.getTime() - n * DAY_MS),
});

describe('thinOldHistory', () => {
    it('keeps every row from the last year', () => {
        const rows = Array.from({ length: 365 }, (_, i) => daysAgo(i));
        expect(thinOldHistory(rows, NOW)).toHaveLength(365);
    });

    it('keeps about one row in seven from before that', () => {
        const rows = Array.from({ length: 700 }, (_, i) => daysAgo(400 + i));
        const kept = thinOldHistory(rows, NOW).length;
        expect(kept).toBe(100);
    });

    it('chooses the same days on every call', () => {
        const rows = Array.from({ length: 50 }, (_, i) => daysAgo(500 + i));
        expect(thinOldHistory(rows, NOW)).toEqual(thinOldHistory(rows, NOW));
    });
});
