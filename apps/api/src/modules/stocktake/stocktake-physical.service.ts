import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    findDuplicateSerials,
    isClosingBar,
    normalizeSerial,
    parseBarsPaste,
    parseCoinsPaste,
    planBarImport,
    type AddBarRequest,
    type AddCoinRequest,
    type CarryForwardResult,
    type ImportPhysicalResult,
    type PhysicalRegister,
    type StocktakeBar,
    type StocktakeCoin,
    type UpdateBarRequest,
    type UpdateCoinRequest,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { StocktakeService } from './stocktake.service';

type BarRow = Prisma.StocktakeBarGetPayload<object>;
type CoinRow = Prisma.StocktakeCoinGetPayload<object>;

const serialOrNull = (s: string | null | undefined) =>
    s ? normalizeSerial(s) || null : null;

/**
 * The physical register: individual bars and coin counts, and carrying last month's closing position forward.
 * Carrying forward copies what was seen, marked unconfirmed. It never decides a bar is still here.
 */
@Injectable()
export class StocktakePhysicalService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly stocktakes: StocktakeService,
    ) {}

    async getRegister(stocktakeId: number): Promise<PhysicalRegister> {
        await this.exists(stocktakeId);
        const [bars, coins] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId },
                orderBy: [
                    { metal: 'asc' },
                    { locationCode: 'asc' },
                    { id: 'asc' },
                ],
            }),
            this.prisma.stocktakeCoin.findMany({
                where: { stocktakeId },
                orderBy: [
                    { metal: 'asc' },
                    { item: 'asc' },
                    { locationCode: 'asc' },
                ],
            }),
        ]);
        const dup = findDuplicateSerials(bars);
        const flagged = new Set([...dup.values()].flat());
        return {
            bars: bars.map((b) => toBar(b, flagged.has(b.id))),
            coins: coins.map(toCoin),
        };
    }

    // --- bars -----------------------------------------------------------------

    async importBars(
        stocktakeId: number,
        metal: BarRow['metal'],
        text: string,
        actor: string,
    ): Promise<ImportPhysicalResult> {
        await this.stocktakes.requireOpen(stocktakeId);
        const parsed = parseBarsPaste(text);
        if (parsed.rows.length === 0) {
            return { added: 0, skipped: 0, issues: parsed.issues };
        }
        const existing = await this.prisma.stocktakeBar.findMany({
            where: { stocktakeId, metal },
            select: {
                locationCode: true,
                weightLabel: true,
                refinery: true,
                serial: true,
                status: true,
            },
        });
        const plan = planBarImport(existing, parsed.rows);
        if (plan.toAdd.length > 0) {
            await this.prisma.$transaction(async (tx) => {
                await tx.stocktakeBar.createMany({
                    data: plan.toAdd.map((r) => ({
                        stocktakeId,
                        metal,
                        locationCode: r.locationCode,
                        weightLabel: r.weightLabel,
                        refinery: r.refinery,
                        serial: r.serial,
                        grams: r.grams,
                        details: r.details,
                        status: 'UNCONFIRMED' as const,
                    })),
                });
                await this.audit.record(
                    actor,
                    'stocktake-bars-import',
                    `stocktake ${stocktakeId}: ${plan.toAdd.length} ${metal} bars added, ${plan.skipped} already there`,
                    tx,
                );
            });
        }
        return {
            added: plan.toAdd.length,
            skipped: plan.skipped,
            issues: parsed.issues,
        };
    }

    async addBar(
        stocktakeId: number,
        dto: AddBarRequest,
    ): Promise<StocktakeBar> {
        await this.stocktakes.requireOpen(stocktakeId);
        const row = await this.prisma.stocktakeBar.create({
            data: {
                stocktakeId,
                metal: dto.metal,
                locationCode: dto.locationCode.toUpperCase(),
                weightLabel: dto.weightLabel,
                refinery: dto.refinery || null,
                serial: serialOrNull(dto.serial),
                grams: dto.grams ?? null,
                details: dto.details || null,
                // Found on the shelf, so it is physically present, but not on last month's list.
                status: 'NEW',
            },
        });
        return this.withDuplicateFlag(row);
    }

    async updateBar(
        stocktakeId: number,
        barId: number,
        dto: UpdateBarRequest,
    ): Promise<StocktakeBar> {
        await this.stocktakes.requireOpen(stocktakeId);
        await this.requireBar(stocktakeId, barId);
        const { serial, ...rest } = dto;
        const row = await this.prisma.stocktakeBar.update({
            where: { id: barId },
            data: {
                ...rest,
                ...(serial !== undefined && { serial: serialOrNull(serial) }),
            },
        });
        return this.withDuplicateFlag(row);
    }

    /** Only a bar added by hand can be deleted. One carried or pasted in is marked GONE so the history stays. */
    async deleteBar(stocktakeId: number, barId: number): Promise<void> {
        await this.stocktakes.requireOpen(stocktakeId);
        const bar = await this.requireBar(stocktakeId, barId);
        if (bar.status !== 'NEW' || bar.carriedFromId !== null) {
            throw new BadRequestException(
                'Mark this bar as gone instead of deleting it.',
            );
        }
        await this.prisma.stocktakeBar.delete({ where: { id: barId } });
    }

    // --- coins ----------------------------------------------------------------

    async importCoins(
        stocktakeId: number,
        metal: CoinRow['metal'],
        text: string,
        actor: string,
    ): Promise<ImportPhysicalResult> {
        await this.stocktakes.requireOpen(stocktakeId);
        const parsed = parseCoinsPaste(text);
        if (parsed.rows.length === 0) {
            return { added: 0, skipped: 0, issues: parsed.issues };
        }
        const created = await this.prisma.$transaction(async (tx) => {
            const res = await tx.stocktakeCoin.createMany({
                data: parsed.rows.map((r) => ({
                    stocktakeId,
                    metal,
                    locationCode: r.locationCode,
                    item: r.item,
                    previousQty: r.quantity,
                })),
                skipDuplicates: true,
            });
            await this.audit.record(
                actor,
                'stocktake-coins-import',
                `stocktake ${stocktakeId}: ${res.count} ${metal} coin lines added`,
                tx,
            );
            return res.count;
        });
        return {
            added: created,
            skipped: parsed.rows.length - created,
            issues: parsed.issues,
        };
    }

    async addCoin(
        stocktakeId: number,
        dto: AddCoinRequest,
    ): Promise<StocktakeCoin> {
        await this.stocktakes.requireOpen(stocktakeId);
        const row = await this.prisma.stocktakeCoin.upsert({
            where: {
                stocktakeId_metal_locationCode_item: {
                    stocktakeId,
                    metal: dto.metal,
                    locationCode: dto.locationCode.toUpperCase(),
                    item: dto.item,
                },
            },
            update: {},
            create: {
                stocktakeId,
                metal: dto.metal,
                locationCode: dto.locationCode.toUpperCase(),
                item: dto.item,
            },
        });
        return toCoin(row);
    }

    async updateCoin(
        stocktakeId: number,
        coinId: number,
        dto: UpdateCoinRequest,
    ): Promise<StocktakeCoin> {
        await this.stocktakes.requireOpen(stocktakeId);
        const found = await this.prisma.stocktakeCoin.findFirst({
            where: { id: coinId, stocktakeId },
        });
        if (!found)
            throw new NotFoundException(`Coin line ${coinId} not found.`);
        const row = await this.prisma.stocktakeCoin.update({
            where: { id: coinId },
            data: dto,
        });
        return toCoin(row);
    }

    // --- carry forward --------------------------------------------------------

    /**
     * Copies the previous stocktake's closing position into this one: bars that were seen (confirmed or newly
     * found), as UNCONFIRMED, and each coin line that was counted, as the previous quantity. Safe to repeat: a
     * bar already carried from the same source row, or a coin line already present, is left alone.
     */
    async carryForward(
        stocktakeId: number,
        fromId: number | undefined,
        actor: string,
    ): Promise<CarryForwardResult> {
        await this.stocktakes.requireOpen(stocktakeId);
        const source = fromId
            ? await this.prisma.stocktake.findUnique({ where: { id: fromId } })
            : await this.prisma.stocktake.findFirst({
                  where: { status: 'FINALISED', id: { not: stocktakeId } },
                  orderBy: { finalisedAt: 'desc' },
              });
        if (!source || source.id === stocktakeId) {
            throw new NotFoundException(
                'There is no earlier finalised stocktake to carry forward from.',
            );
        }
        if (source.status !== 'FINALISED') {
            throw new BadRequestException(
                'Only a finalised stocktake can be carried forward.',
            );
        }

        const [srcBars, srcCoins, haveBars] = await Promise.all([
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId: source.id },
            }),
            this.prisma.stocktakeCoin.findMany({
                where: { stocktakeId: source.id, countedQty: { not: null } },
            }),
            this.prisma.stocktakeBar.findMany({
                where: { stocktakeId, carriedFromId: { not: null } },
                select: { carriedFromId: true },
            }),
        ]);
        const alreadyCarried = new Set(haveBars.map((b) => b.carriedFromId));
        const closing = srcBars.filter((b) => isClosingBar(b.status));
        const toCarry = closing.filter((b) => !alreadyCarried.has(b.id));

        return this.prisma.$transaction(async (tx) => {
            if (toCarry.length > 0) {
                await tx.stocktakeBar.createMany({
                    data: toCarry.map((b) => ({
                        stocktakeId,
                        metal: b.metal,
                        locationCode: b.locationCode,
                        weightLabel: b.weightLabel,
                        refinery: b.refinery,
                        serial: b.serial,
                        grams: b.grams,
                        details: b.details,
                        status: 'UNCONFIRMED' as const,
                        carriedFromId: b.id,
                    })),
                });
            }
            const coins = await tx.stocktakeCoin.createMany({
                data: srcCoins.map((c) => ({
                    stocktakeId,
                    metal: c.metal,
                    locationCode: c.locationCode,
                    item: c.item,
                    previousQty: c.countedQty,
                })),
                skipDuplicates: true,
            });
            const result: CarryForwardResult = {
                fromStocktakeId: source.id,
                fromName: source.name,
                barsCarried: toCarry.length,
                barsAlreadyThere: closing.length - toCarry.length,
                coinsCarried: coins.count,
                coinsAlreadyThere: srcCoins.length - coins.count,
            };
            await this.audit.record(
                actor,
                'stocktake-carry-forward',
                `stocktake ${stocktakeId} from ${source.name}: ${result.barsCarried} bars, ${result.coinsCarried} coin lines`,
                tx,
            );
            return result;
        });
    }

    // --- helpers --------------------------------------------------------------

    private async exists(id: number): Promise<void> {
        const row = await this.prisma.stocktake.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!row) throw new NotFoundException(`Stocktake ${id} not found.`);
    }

    private async requireBar(
        stocktakeId: number,
        barId: number,
    ): Promise<BarRow> {
        const bar = await this.prisma.stocktakeBar.findFirst({
            where: { id: barId, stocktakeId },
        });
        if (!bar) throw new NotFoundException(`Bar ${barId} not found.`);
        return bar;
    }

    private async withDuplicateFlag(row: BarRow): Promise<StocktakeBar> {
        if (!row.serial) return toBar(row, false);
        const others = await this.prisma.stocktakeBar.count({
            where: {
                stocktakeId: row.stocktakeId,
                serial: row.serial,
                status: { not: 'GONE' },
                id: { not: row.id },
            },
        });
        return toBar(row, row.status !== 'GONE' && others > 0);
    }
}

function toBar(row: BarRow, duplicateSerial: boolean): StocktakeBar {
    return {
        id: row.id,
        metal: row.metal,
        locationCode: row.locationCode,
        weightLabel: row.weightLabel,
        refinery: row.refinery,
        serial: row.serial,
        grams: row.grams === null ? null : Number(row.grams),
        details: row.details,
        status: row.status,
        carriedFromId: row.carriedFromId,
        duplicateSerial,
    };
}

function toCoin(row: CoinRow): StocktakeCoin {
    return {
        id: row.id,
        metal: row.metal,
        locationCode: row.locationCode,
        item: row.item,
        previousQty: row.previousQty,
        countedQty: row.countedQty,
        details: row.details,
    };
}
