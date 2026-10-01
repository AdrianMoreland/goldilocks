import { dublinDate, startOfDublinDay } from './dublin-day';

describe('dublinDate', () => {
    it('uses Irish local time, so late evening in summer is still that day', () => {
        expect(dublinDate(new Date('2026-07-01T22:30:00Z'))).toBe('2026-07-01');
        expect(dublinDate(new Date('2026-07-01T23:30:00Z'))).toBe('2026-07-02');
    });
});

describe('startOfDublinDay', () => {
    it('starts at 23:00 UTC the evening before during summer time', () => {
        expect(
            startOfDublinDay(new Date('2026-07-01T12:00:00Z')).toISOString(),
        ).toBe('2026-06-30T23:00:00.000Z');
    });

    it('starts at UTC midnight in winter', () => {
        expect(
            startOfDublinDay(new Date('2026-12-01T12:00:00Z')).toISOString(),
        ).toBe('2026-12-01T00:00:00.000Z');
    });

    it('treats 00:30 local summer time as the new day', () => {
        expect(
            startOfDublinDay(new Date('2026-07-01T23:30:00Z')).toISOString(),
        ).toBe('2026-07-01T23:00:00.000Z');
    });
});
