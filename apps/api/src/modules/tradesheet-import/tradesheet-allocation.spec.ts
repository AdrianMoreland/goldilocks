import { planLotAllocation, soldMismatch } from './tradesheet-allocation';

const day = (d: string) => new Date(`${d}T00:00:00Z`);

describe('planLotAllocation', () => {
    it('gives the first items to the earliest sale', () => {
        const plan = planLotAllocation(5, [
            { id: 2, qty: 1, date: day('2026-10-05') },
            { id: 1, qty: 3, date: day('2026-10-02') },
        ]);
        expect(plan.allocatedQty).toBe(4);
        expect(plan.ranges).toEqual([
            { tradeId: 1, fromSeq: 1, toSeq: 3 },
            { tradeId: 2, fromSeq: 4, toSeq: 4 },
        ]);
        expect(plan.overBy).toBe(0);
    });

    it('breaks a date tie by row id so the answer is always the same', () => {
        const plan = planLotAllocation(4, [
            { id: 9, qty: 2, date: day('2026-10-02') },
            { id: 3, qty: 2, date: day('2026-10-02') },
        ]);
        expect(plan.ranges.map((r) => r.tradeId)).toEqual([3, 9]);
    });

    it('puts a sale with no date last', () => {
        const plan = planLotAllocation(2, [
            { id: 1, qty: 1, date: null },
            { id: 2, qty: 1, date: day('2026-10-02') },
        ]);
        expect(plan.ranges.map((r) => r.tradeId)).toEqual([2, 1]);
    });

    it('reports how many items were taken beyond what was bought, and stops at the lot', () => {
        const plan = planLotAllocation(3, [
            { id: 1, qty: 2, date: day('2026-10-01') },
            { id: 2, qty: 4, date: day('2026-10-02') },
        ]);
        expect(plan.allocatedQty).toBe(6);
        expect(plan.overBy).toBe(3);
        expect(plan.ranges).toEqual([
            { tradeId: 1, fromSeq: 1, toSeq: 2 },
            { tradeId: 2, fromSeq: 3, toSeq: 3 },
        ]);
    });

    it('gives no stock rows to a sale that arrives after the lot is used up', () => {
        const plan = planLotAllocation(1, [
            { id: 1, qty: 1, date: day('2026-10-01') },
            { id: 2, qty: 1, date: day('2026-10-02') },
        ]);
        expect(plan.ranges).toEqual([{ tradeId: 1, fromSeq: 1, toSeq: 1 }]);
        expect(plan.overBy).toBe(1);
    });

    it('lists a sale with no quantity instead of guessing one', () => {
        const plan = planLotAllocation(5, [
            { id: 1, qty: null, date: day('2026-10-01') },
            { id: 2, qty: 2, date: day('2026-10-02') },
        ]);
        expect(plan.withoutQty).toEqual([1]);
        expect(plan.allocatedQty).toBe(2);
    });

    it('counts what sales took for a lot of unknown size, without stock rows or an over-allocation', () => {
        const plan = planLotAllocation(null, [
            { id: 1, qty: 2, date: day('2026-10-01') },
        ]);
        expect(plan).toMatchObject({ allocatedQty: 2, overBy: 0, ranges: [] });
    });

    it('returns an empty plan for a lot nobody cites', () => {
        expect(planLotAllocation(4, [])).toEqual({
            allocatedQty: 0,
            overBy: 0,
            ranges: [],
            withoutQty: [],
        });
    });
});

describe('soldMismatch', () => {
    it('agrees when the comment and the sales say the same', () => {
        expect(soldMismatch({ qty: 5, commentSoldQty: 3 }, 3)).toBe(false);
        expect(soldMismatch({ qty: 5, commentSoldQty: 5 }, 5)).toBe(false);
        expect(soldMismatch({ qty: 5, commentSoldQty: null }, 0)).toBe(false);
    });

    it('disagrees when they differ either way', () => {
        expect(soldMismatch({ qty: 5, commentSoldQty: 3 }, 2)).toBe(true);
        expect(soldMismatch({ qty: 5, commentSoldQty: null }, 2)).toBe(true);
        expect(soldMismatch({ qty: 5, commentSoldQty: 5 }, 4)).toBe(true);
    });

    it('says nothing about a lot with no known quantity', () => {
        expect(soldMismatch({ qty: null, commentSoldQty: 3 }, 1)).toBe(false);
    });
});
