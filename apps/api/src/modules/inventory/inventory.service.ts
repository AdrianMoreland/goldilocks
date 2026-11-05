import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    InventoryBarsQuerySchema,
    InventoryCoinsQuerySchema,
    type InventoryBarsResponse,
    type InventoryCoinsResponse,
    type InventoryPosition,
    type InventoryStocktakeRef,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

const day = (d: Date): string => d.toISOString().slice(0, 10);
const norm = (s: string | null | undefined): string =>
    String(s ?? '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
/** Customer orders in these states have the goods in a branch safe for the customer. */
const HELD_STATUSES = ['DELIVERED', 'BAGGED', 'ALLOCATED'] as const;
const MIN_SERIAL = 4;
const BAR_CAP = 5000;

type Held = {
    orderId: number;
    reference: string | null;
    client: string;
    status: string;
};

/**
 * Stock position from the stocktake models. Read only. Free-to-sell is deliberately not computed here: it needs each
 * product name tied to a sales product first (the review queue), and a wrong number on a quote costs more than none.
 */
@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) {}

    private ref(s: {
        id: number;
        name: string;
        countDate: Date;
        status: string;
        imported: boolean;
    }): InventoryStocktakeRef {
        return {
            id: s.id,
            name: s.name,
            countDate: day(s.countDate),
            status: s.status,
            imported: s.imported,
        };
    }

    /** The stocktake asked for, else the newest. */
    private async pick(stocktakeId: number | undefined) {
        if (stocktakeId !== undefined) {
            const s = await this.prisma.stocktake.findUnique({
                where: { id: stocktakeId },
            });
            if (!s)
                throw new NotFoundException(
                    `Stocktake ${stocktakeId} not found.`,
                );
            return s;
        }
        return this.prisma.stocktake.findFirst({
            orderBy: [{ countDate: 'desc' }, { id: 'desc' }],
        });
    }

    /** Serial -> the open customer order that names it. */
    private async heldSerials(): Promise<Map<string, Held>> {
        const items = await this.prisma.customerOrderItem.findMany({
            where: {
                status: { in: [...HELD_STATUSES] },
                serials: { not: null },
            },
        });
        const out = new Map<string, Held>();
        for (const item of items) {
            for (const token of (item.serials ?? '').split(/[,;\s]+/)) {
                const n = norm(token);
                if (n.length >= MIN_SERIAL)
                    out.set(n, {
                        orderId: item.id,
                        reference: item.reference,
                        client: item.client,
                        status: item.status,
                    });
            }
        }
        return out;
    }

    async position(rawStocktakeId?: string): Promise<InventoryPosition> {
        const id =
            rawStocktakeId === undefined ? undefined : Number(rawStocktakeId);
        if (id !== undefined && !Number.isInteger(id))
            throw new BadRequestException('Invalid stocktake.');
        const [st, recent] = await Promise.all([
            this.pick(id),
            this.prisma.stocktake.findMany({
                orderBy: [{ countDate: 'desc' }, { id: 'desc' }],
                take: 12,
            }),
        ]);
        const empty: InventoryPosition = {
            stocktake: null,
            available: recent.map((s) => this.ref(s)),
            bars: { total: 0, byMetal: {}, heldForCustomers: 0, gone: 0 },
            coins: { lines: 0, pieces: 0, byMetal: {}, uncounted: 0 },
        };
        if (!st) return empty;

        const [bars, coins, held] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId: st.id },
                select: { metal: true, serial: true, status: true },
                take: BAR_CAP,
            }),
            this.prisma.stocktakeCoin.findMany({
                where: { stocktakeId: st.id },
                select: { metal: true, countedQty: true },
            }),
            this.heldSerials(),
        ]);
        const present = bars.filter((b) => b.status !== 'GONE');
        const byMetal: Record<string, number> = {};
        for (const b of present) byMetal[b.metal] = (byMetal[b.metal] ?? 0) + 1;
        const coinMetal: Record<string, number> = {};
        for (const c of coins)
            coinMetal[c.metal] =
                (coinMetal[c.metal] ?? 0) + (c.countedQty ?? 0);

        return {
            stocktake: this.ref(st),
            available: recent.map((s) => this.ref(s)),
            bars: {
                total: present.length,
                byMetal,
                heldForCustomers: present.filter((b) =>
                    held.has(norm(b.serial)),
                ).length,
                gone: bars.length - present.length,
            },
            coins: {
                lines: coins.length,
                pieces: coins.reduce((n, c) => n + (c.countedQty ?? 0), 0),
                byMetal: coinMetal,
                uncounted: coins.filter((c) => c.countedQty === null).length,
            },
        };
    }

    async bars(raw: Record<string, unknown>): Promise<InventoryBarsResponse> {
        const parsed = InventoryBarsQuerySchema.safeParse(raw);
        if (!parsed.success) throw new BadRequestException('Invalid query.');
        const { stocktakeId, metal, branch, where, q, limit, offset } =
            parsed.data;
        const st = await this.pick(stocktakeId);
        if (!st) return { total: 0, rows: [] };

        const filter: Prisma.StocktakeBarWhereInput = {
            stocktakeId: st.id,
            ...(metal ? { metal } : {}),
            ...(branch ? { locationCode: branch.toUpperCase() } : {}),
            ...(q ? { serial: { contains: q, mode: 'insensitive' } } : {}),
        };
        const [bars, held] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: filter,
                orderBy: [
                    { metal: 'asc' },
                    { weightLabel: 'asc' },
                    { serial: 'asc' },
                ],
                take: BAR_CAP,
            }),
            this.heldSerials(),
        ]);
        const rows = bars
            .map((b) => ({ b, h: held.get(norm(b.serial)) ?? null }))
            .filter(({ h }) =>
                where === 'held'
                    ? h !== null
                    : where === 'free'
                      ? h === null
                      : true,
            );
        return {
            total: rows.length,
            rows: rows.slice(offset, offset + limit).map(({ b, h }) => ({
                id: b.id,
                serial: b.serial,
                refinery: b.refinery,
                weightLabel: b.weightLabel,
                metal: b.metal,
                locationCode: b.locationCode,
                status: b.status,
                details: b.details,
                heldFor: h,
            })),
        };
    }

    async coins(raw: Record<string, unknown>): Promise<InventoryCoinsResponse> {
        const parsed = InventoryCoinsQuerySchema.safeParse(raw);
        if (!parsed.success) throw new BadRequestException('Invalid query.');
        const { stocktakeId, metal, branch } = parsed.data;
        const st = await this.pick(stocktakeId);
        if (!st) return { rows: [] };
        const coins = await this.prisma.stocktakeCoin.findMany({
            where: {
                stocktakeId: st.id,
                ...(metal ? { metal } : {}),
                ...(branch ? { locationCode: branch.toUpperCase() } : {}),
            },
            orderBy: [
                { metal: 'asc' },
                { item: 'asc' },
                { locationCode: 'asc' },
            ],
        });
        return {
            rows: coins.map((c) => ({
                id: c.id,
                item: c.item,
                metal: c.metal,
                locationCode: c.locationCode,
                previousQty: c.previousQty,
                countedQty: c.countedQty,
                details: c.details,
            })),
        };
    }
}
