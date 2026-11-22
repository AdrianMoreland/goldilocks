import { fillHeat, stepTransitions, waitingByStep } from './analytics.shape';

describe('fillHeat', () => {
    it('returns all 168 cells, zero where nothing happened, Monday first', () => {
        const cells = fillHeat([
            { dow: 1, hour: 9, n: 4 }, // Postgres: Monday = 1
            { dow: 0, hour: 23, n: 2 }, // Sunday
        ]);
        expect(cells).toHaveLength(168);
        expect(cells.find((c) => c.weekday === 0 && c.hour === 9)?.value).toBe(
            4,
        );
        expect(cells.find((c) => c.weekday === 6 && c.hour === 23)?.value).toBe(
            2,
        );
        expect(cells.filter((c) => c.value > 0)).toHaveLength(2);
    });
});

describe('stepTransitions', () => {
    const at = (s: string) => new Date(s);
    const events = [
        { tradeId: 1, step: 'ORDERED', at: at('2026-11-01T10:00:00Z') },
        { tradeId: 1, step: 'ARRIVED', at: at('2026-11-03T10:00:00Z') }, // 48 h
        { tradeId: 1, step: 'ALLOCATED', at: at('2026-11-03T16:00:00Z') }, // 6 h
        { tradeId: 2, step: 'ORDERED', at: at('2026-11-02T08:00:00Z') },
        { tradeId: 2, step: 'ARRIVED', at: at('2026-11-03T08:00:00Z') }, // 24 h
    ];

    it('averages the hours between consecutive steps of the same order', () => {
        const { stepHours } = stepTransitions(events);
        expect(stepHours).toEqual([
            { from: 'ORDERED', to: 'ARRIVED', hours: 36, orders: 2 },
            { from: 'ARRIVED', to: 'ALLOCATED', hours: 6, orders: 1 },
        ]);
    });

    it('counts the orders that moved along each link', () => {
        expect(stepTransitions(events).flow).toEqual([
            { from: 'ORDERED', to: 'ARRIVED', value: 2 },
            { from: 'ARRIVED', to: 'ALLOCATED', value: 1 },
        ]);
    });
});

describe('waitingByStep', () => {
    it('places each unfinished order at its latest step with whole days waiting', () => {
        const rows = [
            {
                tradeId: 1,
                reference: 'GD-1',
                step: 'ORDERED',
                at: new Date('2026-11-10T09:00:00Z'),
            },
            {
                tradeId: 1,
                reference: 'GD-1',
                step: 'ARRIVED',
                at: new Date('2026-11-18T09:00:00Z'),
            },
            {
                tradeId: 2,
                reference: 'GD-2',
                step: 'ORDERED',
                at: new Date('2026-11-20T09:00:00Z'),
            },
            {
                tradeId: 3,
                reference: 'GD-3',
                step: 'POSTED',
                at: new Date('2026-11-01T09:00:00Z'),
            },
        ];
        const now = new Date('2026-11-21T12:00:00Z');
        const waiting = waitingByStep(rows, now);
        expect(waiting.find((w) => w.step === 'ARRIVED')?.orders).toEqual([
            { reference: 'GD-1', days: 3 },
        ]);
        expect(waiting.find((w) => w.step === 'ORDERED')?.orders).toEqual([
            { reference: 'GD-2', days: 1 },
        ]);
        expect(waiting.some((w) => w.step === 'POSTED')).toBe(false);
    });
});
