import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { LiveStockService } from './live-stock.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';
import type { AuthenticatedUser } from '../auth/auth.service';

type Line = {
    id: number;
    branchCode: string;
    metal: string;
    kind: 'COIN' | 'BAR';
    family: string;
    variant: string;
    refinery: string;
    qty: number;
};
type Bar = {
    id: number;
    lineId: number;
    serial: string;
    serialKey: string;
    status: string;
};
type Move = {
    id: number;
    lineId: number;
    delta: number;
    qtyAfter: number;
    source: string;
    reference: string | null;
    reversesId: number | null;
};

/** A small in-memory stand-in for the four live-stock tables, enough to run the service's real rules. */
function setup() {
    const lines: Line[] = [
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
        {
            id: 2,
            branchCode: 'DU',
            metal: 'GOLD',
            kind: 'COIN',
            family: 'Krugerrand',
            variant: '1oz',
            refinery: '',
            qty: 3,
        },
    ];
    const bars: Bar[] = [];
    const moves: Move[] = [];
    const branches = [
        { code: 'DU', name: 'Dublin', branchId: 7, cutoverDate: null },
        { code: 'CO', name: 'Cork', branchId: 8, cutoverDate: null },
    ];
    const by = <T extends { id: number }>(a: T[], id: number) =>
        a.find((x) => x.id === id) ?? null;
    const tx = {
        liveStockLine: {
            findUnique: jest.fn(({ where }: { where: { id: number } }) =>
                Promise.resolve(by(lines, where.id)),
            ),
            update: jest.fn(
                ({
                    where,
                    data,
                }: {
                    where: { id: number };
                    data: { qty: { increment: number } };
                }) => {
                    const l = by(lines, where.id) as Line;
                    l.qty += data.qty.increment;
                    return Promise.resolve({ ...l });
                },
            ),
            upsert: jest.fn(
                ({ create }: { create: Omit<Line, 'id' | 'qty'> }) => {
                    const found = lines.find(
                        (l) =>
                            l.branchCode === create.branchCode &&
                            l.family === create.family &&
                            l.variant === create.variant &&
                            l.refinery === create.refinery,
                    );
                    if (found) return Promise.resolve(found);
                    const l = { ...create, id: lines.length + 1, qty: 0 };
                    lines.push(l);
                    return Promise.resolve(l);
                },
            ),
        },
        liveStockBar: {
            count: jest.fn(({ where }: { where: { lineId: number } }) =>
                Promise.resolve(
                    bars.filter(
                        (b) =>
                            b.lineId === where.lineId &&
                            b.status === 'IN_STOCK',
                    ).length,
                ),
            ),
            findFirst: jest.fn(({ where }: { where: { serialKey: string } }) =>
                Promise.resolve(
                    bars
                        .filter(
                            (b) =>
                                b.serialKey === where.serialKey &&
                                b.status === 'IN_STOCK',
                        )
                        .map((b) => ({
                            ...b,
                            line: by(lines, b.lineId) as Line,
                        }))[0] ?? null,
                ),
            ),
            create: jest.fn(
                ({ data }: { data: Omit<Bar, 'id' | 'status'> }) => {
                    const b = {
                        ...data,
                        id: bars.length + 1,
                        status: 'IN_STOCK',
                    };
                    bars.push(b);
                    return Promise.resolve(b);
                },
            ),
        },
        liveStockMovement: {
            create: jest.fn(
                ({
                    data,
                }: {
                    data: Partial<Move> &
                        Omit<Move, 'id' | 'reference' | 'reversesId'>;
                }) => {
                    const m: Move = {
                        ...data,
                        reference: data.reference ?? null,
                        reversesId: data.reversesId ?? null,
                        id: moves.length + 1,
                    };
                    moves.push(m);
                    return Promise.resolve(m);
                },
            ),
            findFirst: jest.fn(
                ({
                    where,
                }: {
                    where: { lineId?: number; reversesId?: number };
                }) =>
                    Promise.resolve(
                        where.reversesId !== undefined
                            ? (moves.find(
                                  (m) => m.reversesId === where.reversesId,
                              ) ?? null)
                            : ([...moves]
                                  .filter((m) => m.lineId === where.lineId)
                                  .sort((a, b) => b.id - a.id)[0] ?? null),
                    ),
            ),
            findUnique: jest.fn(({ where }: { where: { id: number } }) => {
                const m = by(moves, where.id);
                return Promise.resolve(
                    m ? { ...m, line: by(lines, m.lineId) as Line } : null,
                );
            }),
        },
    };
    const prisma = {
        ...tx,
        $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        liveStockBranch: {
            findUnique: jest.fn(({ where }: { where: { code: string } }) =>
                Promise.resolve(
                    branches.find((b) => b.code === where.code) ?? null,
                ),
            ),
        },
    };
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const service = new LiveStockService(
        prisma as unknown as PrismaService,
        audit as unknown as AuditLogService,
    );
    return { service, lines, bars, moves, audit };
}

const du = { email: 'du@x.ie', admin: false, branchId: 7 } as AuthenticatedUser;
const co = { email: 'co@x.ie', admin: false, branchId: 8 } as AuthenticatedUser;
const admin = {
    email: 'a@x.ie',
    admin: true,
    branchId: null,
} as AuthenticatedUser;

describe('LiveStockService.adjust', () => {
    it('changes the count by a step and records movement and audit together', async () => {
        const { service, lines, moves, audit } = setup();
        const r = await service.adjust(du, 2, { delta: -1, reason: 'Sold' });
        expect(r.qty).toBe(2);
        expect(lines[1]?.qty).toBe(2);
        expect(moves).toHaveLength(1);
        expect(moves[0]).toMatchObject({
            delta: -1,
            qtyAfter: 2,
            source: 'MANUAL',
        });
        expect(audit.record).toHaveBeenCalledTimes(1);
    });

    it('sets a typed quantity as the difference', async () => {
        const { service, moves } = setup();
        await service.adjust(du, 2, { qty: 10, reason: 'Recount' });
        expect(moves[0]?.delta).toBe(7);
    });

    it('refuses to go below zero', async () => {
        const { service } = setup();
        await expect(
            service.adjust(du, 2, { delta: -4, reason: 'Oops' }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("refuses another branch's staff but allows an admin", async () => {
        const { service } = setup();
        await expect(
            service.adjust(co, 2, { delta: 1, reason: 'Found one' }),
        ).rejects.toBeInstanceOf(ForbiddenException);
        await expect(
            service.adjust(admin, 2, { delta: 1, reason: 'Found one' }),
        ).resolves.toMatchObject({ qty: 4 });
    });
});

describe('LiveStockService.addBar', () => {
    it('a serial on a line with unserialled bars names one already counted', async () => {
        const { service, lines } = setup();
        const r = await service.addBar(du, 1, {
            serial: 'AG-100',
            reason: 'Labelled',
        });
        expect(r.qty).toBe(5);
        expect(lines[0]?.qty).toBe(5);
    });

    it('a new bar (no unserialled ones left) raises the count', async () => {
        const { service, lines } = setup();
        for (let i = 0; i < 5; i++)
            await service.addBar(du, 1, { serial: `S${i}0`, reason: 'Label' });
        await service.addBar(du, 1, { serial: 'EXTRA1', reason: 'Found' });
        expect(lines[0]?.qty).toBe(6);
    });

    it('a serial already in stock is a clash, not an overwrite', async () => {
        const { service, bars } = setup();
        await service.addBar(du, 1, { serial: 'AG 100', reason: 'Label' });
        await expect(
            service.addBar(du, 1, { serial: 'ag-100', reason: 'Label' }),
        ).rejects.toBeInstanceOf(ConflictException);
        expect(bars).toHaveLength(1);
    });

    it('keeps the count from dropping below the serials in stock', async () => {
        const { service } = setup();
        for (let i = 0; i < 5; i++)
            await service.addBar(du, 1, { serial: `T${i}0`, reason: 'Label' });
        await expect(
            service.adjust(du, 1, { qty: 4, reason: 'Recount' }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });
});

describe('LiveStockService.undo', () => {
    it('reverses the latest manual change with a new UNDO movement', async () => {
        const { service, lines, moves } = setup();
        const a = await service.adjust(du, 2, { delta: -2, reason: 'Sold' });
        const r = await service.undo(du, a.movementId);
        expect(r.qty).toBe(3);
        expect(lines[1]?.qty).toBe(3);
        expect(moves).toHaveLength(2);
        expect(moves[1]).toMatchObject({
            source: 'UNDO',
            delta: 2,
            reversesId: a.movementId,
        });
    });

    it('only the latest change, and only once', async () => {
        const { service } = setup();
        const first = await service.adjust(du, 2, { delta: -1, reason: 'A' });
        const second = await service.adjust(du, 2, { delta: -1, reason: 'B' });
        await expect(service.undo(du, first.movementId)).rejects.toBeInstanceOf(
            BadRequestException,
        );
        await service.undo(du, second.movementId);
        // The latest is now the UNDO itself, so the same change cannot be undone twice.
        await expect(
            service.undo(du, second.movementId),
        ).rejects.toBeInstanceOf(BadRequestException);
    });
});
