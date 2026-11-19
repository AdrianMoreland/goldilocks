import { LiveStockService } from './live-stock.service';
import { SheetApplyService } from './sheet-apply.service';
import type { AuditLogService } from '../audit-log/audit-log.service';
import type { AuthenticatedUser } from '../auth/auth.service';

/** In-memory stand-in for the tables the apply service touches, enough to run its real rules end to end. */
function setup() {
    const state = {
        branches: [
            {
                code: 'DU',
                name: 'Dublin',
                branchId: 7,
                cutoverDate: new Date('2026-11-18T00:00:00Z'),
            },
        ],
        lines: [
            {
                id: 1,
                branchCode: 'DU',
                metal: 'GOLD',
                kind: 'BAR',
                family: 'Bar',
                variant: '1oz',
                refinery: 'VALCAMBI SUISSE',
                qty: 5,
            },
        ] as any[],
        moves: [] as any[],
        apps: [] as any[],
        trades: [] as any[],
        lots: [] as any[],
    };
    const trade = (o: Record<string, unknown> = {}) => ({
        reference: 'DU-G20261120',
        referenceKey: 'DUG20261120',
        occurrence: 1,
        cptyKind: 'LOT_REF',
        state: 'INVOICED',
        missingFromImport: false,
        issues: [] as string[],
        metal: 'GOLD',
        branchCode: 'DU',
        productText: '1oz bar',
        qty: 2,
        date: new Date('2026-11-20T00:00:00Z'),
        ...o,
    });
    const tx: any = {
        liveStockBranch: {
            findMany: () => Promise.resolve(state.branches),
            findUnique: ({ where }: any) =>
                Promise.resolve(
                    state.branches.find((b) => b.code === where.code) ?? null,
                ),
        },
        sheetApplication: {
            findMany: ({ where }: any = {}) =>
                Promise.resolve(
                    state.apps.filter(
                        (a) => !where?.status || a.status === where.status,
                    ),
                ),
            findUnique: ({ where }: any) =>
                Promise.resolve(
                    state.apps.find((a) => a.id === where.id) ?? null,
                ),
            create: ({ data }: any) => {
                const a = {
                    id: state.apps.length + 1,
                    reason: null,
                    note: null,
                    lineId: null,
                    ...data,
                };
                state.apps.push(a);
                return Promise.resolve(a);
            },
            update: ({ where, data }: any) => {
                const a = state.apps.find((x) => x.id === where.id);
                for (const [k, v] of Object.entries(data)) {
                    if (v && typeof v === 'object' && 'increment' in v)
                        a[k] += (v as any).increment;
                    else a[k] = v;
                }
                return Promise.resolve(a);
            },
        },
        trade: {
            findMany: () => Promise.resolve(state.trades),
            findUnique: ({ where }: any) =>
                Promise.resolve(
                    state.trades.find(
                        (t) =>
                            t.referenceKey ===
                            where.referenceKey_occurrence.referenceKey,
                    ) ?? null,
                ),
        },
        purchaseLot: {
            findMany: () => Promise.resolve(state.lots),
            findUnique: () => Promise.resolve(null),
        },
        liveStockLine: {
            findMany: () => Promise.resolve(state.lines),
            findUnique: ({ where }: any) =>
                Promise.resolve(
                    state.lines.find((l) => l.id === where.id) ?? null,
                ),
            update: ({ where, data }: any) => {
                const l = state.lines.find((x) => x.id === where.id);
                l.qty += data.qty.increment;
                return Promise.resolve({ ...l });
            },
        },
        liveStockBar: { count: () => Promise.resolve(0) },
        liveStockMovement: {
            findMany: ({ where }: any) =>
                Promise.resolve(
                    state.moves.filter((m) =>
                        where.source
                            ? m.source === where.source
                            : m.reversesId != null,
                    ),
                ),
            create: ({ data }: any) => {
                const m = {
                    id: state.moves.length + 1,
                    at: new Date(),
                    reversesId: null,
                    ...data,
                };
                state.moves.push(m);
                return Promise.resolve(m);
            },
        },
    };
    const prisma = { ...tx, $transaction: (fn: any) => fn(tx) };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const stock = new LiveStockService(
        prisma,
        audit as unknown as AuditLogService,
    );
    const service = new SheetApplyService(
        prisma,
        stock,
        audit as unknown as AuditLogService,
    );
    return { service, state, trade };
}

const admin = {
    email: 'a@x.ie',
    admin: true,
    branchId: null,
} as AuthenticatedUser;
const du = { email: 'du@x.ie', admin: false, branchId: 7 } as AuthenticatedUser;

describe('SheetApplyService.apply', () => {
    it('subtracts a sale once; uploading it again changes nothing', async () => {
        const { service, state, trade } = setup();
        state.trades.push(trade());
        const first = await service.apply(admin);
        expect(first.applied).toBe(1);
        expect(state.lines[0].qty).toBe(3);
        const second = await service.apply(admin);
        expect(second.applied).toBe(0);
        expect(state.lines[0].qty).toBe(3);
        expect(
            state.moves.filter((m) => m.source === 'SHEET_SALE'),
        ).toHaveLength(1);
    });

    it('applies only the difference when the row grows', async () => {
        const { service, state, trade } = setup();
        state.trades.push(trade());
        await service.apply(admin);
        state.trades[0].qty = 3;
        await service.apply(admin);
        expect(state.lines[0].qty).toBe(2);
        expect(state.moves.map((m) => m.delta)).toEqual([-2, -1]);
    });

    it('never applies a sale dated on or before the cut-over', async () => {
        const { service, state, trade } = setup();
        state.trades.push(trade({ date: new Date('2026-11-18T00:00:00Z') }));
        const r = await service.apply(admin);
        expect(r.applied).toBe(0);
        expect(state.lines[0].qty).toBe(5);
    });

    it('ignores quotes, deferred, repeat and flagged rows', async () => {
        const { service, state, trade } = setup();
        state.trades.push(
            trade({ referenceKey: 'A', state: 'QUOTE' }),
            trade({ referenceKey: 'B', state: 'DEFERRED' }),
            trade({ referenceKey: 'C', occurrence: 2 }),
            trade({ referenceKey: 'D', issues: ['bad date'] }),
        );
        const r = await service.apply(admin);
        expect(r.applied).toBe(0);
        expect(state.lines[0].qty).toBe(5);
    });

    it('the 5, sold 2, edited to 3 case: asks instead of subtracting again, and remembers the answer', async () => {
        const { service, state, trade } = setup();
        // Staff edit 5 -> 3 on the sale's day, then the sheet shows the sale.
        state.lines[0].qty = 3;
        state.moves.push({
            id: 1,
            lineId: 1,
            delta: -2,
            qtyAfter: 3,
            source: 'MANUAL',
            at: new Date('2026-11-20T15:00:00Z'),
            reversesId: null,
        });
        state.trades.push(trade());
        const r = await service.apply(admin);
        expect(r.applied).toBe(0);
        expect(r.waiting).toBe(1);
        expect(state.lines[0].qty).toBe(3);

        await service.resolve(du, 1, { choice: 'COUNTED' });
        expect(state.lines[0].qty).toBe(3);
        expect(state.apps[0]).toMatchObject({
            status: 'APPLIED',
            appliedQty: -2,
            reason: 'COUNTED',
        });

        // Run again: the answer is remembered, nothing is asked or subtracted.
        const again = await service.apply(admin);
        expect(again.applied + again.waiting).toBe(0);
        expect(state.lines[0].qty).toBe(3);
    });

    it('"Subtract now" takes it from the line', async () => {
        const { service, state, trade } = setup();
        state.lines[0].qty = 5;
        state.moves.push({
            id: 1,
            lineId: 1,
            delta: 0,
            qtyAfter: 5,
            source: 'MANUAL',
            at: new Date('2026-11-21T09:00:00Z'),
            reversesId: null,
        });
        state.trades.push(trade());
        await service.apply(admin);
        await service.resolve(du, 1, { choice: 'APPLY' });
        expect(state.lines[0].qty).toBe(3);
    });

    it('flags a row that became a quote after being applied, and only reverses when told to', async () => {
        const { service, state, trade } = setup();
        state.trades.push(trade());
        await service.apply(admin);
        state.trades[0].state = 'QUOTE';
        const r = await service.apply(admin);
        expect(r.waiting).toBe(1);
        expect(state.lines[0].qty).toBe(3);
        await service.resolve(du, 1, { choice: 'REVERSE' });
        expect(state.lines[0].qty).toBe(5);
    });

    it('does not let a person settle another branch’s row', async () => {
        const { service, state, trade } = setup();
        state.lines[0].qty = 3;
        state.moves.push({
            id: 1,
            lineId: 1,
            delta: -2,
            qtyAfter: 3,
            source: 'MANUAL',
            at: new Date('2026-11-20T15:00:00Z'),
            reversesId: null,
        });
        state.trades.push(trade());
        await service.apply(admin);
        await expect(
            service.resolve(
                { email: 'x', admin: false, branchId: 99 } as AuthenticatedUser,
                1,
                { choice: 'COUNTED' },
            ),
        ).rejects.toThrow('own branch');
    });

    it('only an admin applies', async () => {
        const { service } = setup();
        await expect(service.apply(du)).rejects.toThrow('Only admins');
    });
});
