import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    liveSerialKey,
    planBaseline,
    type AddLiveStockBarRequest,
    type AdjustLiveStockRequest,
    type BaselinePlan,
    type CreateLiveStockLineRequest,
    type LinkLiveStockBranchRequest,
    type LiveBaselinePreview,
    type LiveBaselineRequest,
    type LiveBaselineResult,
    type LiveStockBoard,
    type LiveStockBoardQuery,
    type LiveStockBranch,
    type LiveStockBranchesResponse,
    type LiveStockLine,
    type LiveStockMovement,
    type SetLiveStockBarStatusRequest,
    type TransferLiveStockRequest,
    productStockLevels,
    type ProductStockLevel,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import type { AuthenticatedUser } from '../auth/auth.service';

type Tx = Prisma.TransactionClient;
type Source =
    | 'MANUAL'
    | 'IMPORT'
    | 'SHEET_SALE'
    | 'SHEET_PURCHASE'
    | 'TRANSFER'
    | 'UNDO';

const day = (d: Date): string => d.toISOString().slice(0, 10);

interface MoveMeta {
    source: Source;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    reversesId?: number | null;
}

/**
 * Live stock: current counts per branch, edited day to day. Branch codes are the stock sheet's (DU Dublin, BL Blanchardstown, CO Cork, BC Barcelona). A line's quantity is the running sum of its movements;
 * every change goes through `move`, which writes the movement and the audit entry in the same transaction, so a count
 * never changes without a trail. Business rules (no negative counts, bars never fewer than their serials, one in-stock
 * bar per serial) live here, not in the controller.
 */
@Injectable()
export class LiveStockService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    // ------------------------------------------------------------ access

    canEditBranch(
        user: AuthenticatedUser,
        branch: { branchId: number | null },
    ): boolean {
        if (user.admin) return true;
        return branch.branchId !== null && branch.branchId === user.branchId;
    }

    async assertCanEdit(
        user: AuthenticatedUser,
        branchCode: string,
    ): Promise<void> {
        const branch = await this.prisma.liveStockBranch.findUnique({
            where: { code: branchCode },
        });
        if (!branch)
            throw new NotFoundException(`Unknown branch "${branchCode}".`);
        if (!this.canEditBranch(user, branch))
            throw new ForbiddenException(
                `You can only change stock for your own branch.`,
            );
    }

    private toBranch(
        b: {
            code: string;
            name: string;
            branchId: number | null;
            cutoverDate: Date | null;
        },
        user: AuthenticatedUser,
    ): LiveStockBranch {
        return {
            code: b.code,
            name: b.name,
            branchId: b.branchId,
            cutoverDate: b.cutoverDate ? day(b.cutoverDate) : null,
            canEdit: this.canEditBranch(user, b),
        };
    }

    // ------------------------------------------------------------ reads

    async branches(
        user: AuthenticatedUser,
    ): Promise<LiveStockBranchesResponse> {
        const rows = await this.prisma.liveStockBranch.findMany({
            orderBy: { code: 'asc' },
        });
        const mine = rows.find(
            (r) => r.branchId !== null && r.branchId === user.branchId,
        );
        return {
            branches: rows.map((r) => this.toBranch(r, user)),
            mine: mine?.code ?? null,
        };
    }

    /**
     * Stock per priced product across every location, for the flag next to each price on the dashboard.
     * Read-only and open to every signed-in user; the matching from product names to sheet lines is in shared-types.
     */
    async productLevels(): Promise<ProductStockLevel[]> {
        const [products, lines] = await Promise.all([
            this.prisma.product.findMany({
                where: { isActive: true, deletedAt: null },
                select: { id: true, name: true, metalType: true },
            }),
            this.prisma.liveStockLine.findMany({
                where: { metal: { in: ['GOLD', 'SILVER'] } },
                select: {
                    metal: true,
                    kind: true,
                    family: true,
                    variant: true,
                    refinery: true,
                    qty: true,
                    lowThreshold: true,
                    branchCode: true,
                    branch: { select: { name: true } },
                },
            }),
        ]);
        return productStockLevels(
            products,
            lines.map(({ branch, ...l }) => ({ ...l, branchName: branch.name })),
        );
    }

    async board(
        user: AuthenticatedUser,
        query: LiveStockBoardQuery,
    ): Promise<LiveStockBoard> {
        const branch = await this.prisma.liveStockBranch.findUnique({
            where: { code: query.branch },
        });
        if (!branch)
            throw new NotFoundException(`Unknown branch "${query.branch}".`);
        const rows = await this.prisma.liveStockLine.findMany({
            where: { branchCode: query.branch, metal: query.metal },
            include: {
                bars: {
                    where: { status: 'IN_STOCK' },
                    orderBy: { serial: 'asc' },
                },
            },
            orderBy: [
                { family: 'asc' },
                { variant: 'asc' },
                { refinery: 'asc' },
            ],
        });
        const lines: LiveStockLine[] = rows.map((l) => ({
            id: l.id,
            branchCode: l.branchCode,
            metal: l.metal,
            kind: l.kind,
            family: l.family,
            variant: l.variant,
            refinery: l.refinery,
            qty: l.qty,
            lowThreshold: l.lowThreshold,
            unassigned: l.unassigned,
            details: l.details,
            bars: l.bars.map((b) => ({
                id: b.id,
                serial: b.serial,
                grams: b.grams === null ? null : Number(b.grams),
                details: b.details,
                status: b.status,
            })),
            updatedAt: l.updatedAt.toISOString(),
        }));
        return {
            branch: this.toBranch(branch, user),
            metal: query.metal,
            lines,
        };
    }

    /** The newest movements on a line, newest first, each marked when a later undo reversed it. */
    async history(lineId: number, limit = 30): Promise<LiveStockMovement[]> {
        const rows = await this.prisma.liveStockMovement.findMany({
            where: { lineId },
            orderBy: [{ at: 'desc' }, { id: 'desc' }],
            take: Math.min(Math.max(limit, 1), 200),
        });
        const reversed = new Set(
            (
                await this.prisma.liveStockMovement.findMany({
                    where: { lineId, reversesId: { not: null } },
                    select: { reversesId: true },
                })
            ).map((m) => m.reversesId),
        );
        return rows.map((m) => ({
            id: m.id,
            lineId: m.lineId,
            delta: m.delta,
            qtyAfter: m.qtyAfter,
            source: m.source,
            reference: m.reference,
            reason: m.reason,
            note: m.note,
            actor: m.actor,
            at: m.at.toISOString(),
            reversesId: m.reversesId,
            undone: reversed.has(m.id),
        }));
    }

    // ------------------------------------------------------------ the one write path

    /**
     * Change a line's count by `delta` and record why. Rejects a count below zero, and for bars a count below the number
     * of serialled bars still in stock. Throws inside the transaction, so nothing is half written.
     */
    async move(
        tx: Tx,
        lineId: number,
        delta: number,
        meta: MoveMeta,
    ): Promise<{ id: number; qtyAfter: number }> {
        const line = await tx.liveStockLine.update({
            where: { id: lineId },
            data: { qty: { increment: delta } },
        });
        if (line.qty < 0)
            throw new BadRequestException(
                `${line.family} ${line.variant} cannot go below zero (it has ${line.qty - delta}).`,
            );
        if (line.kind === 'BAR') {
            const serialled = await tx.liveStockBar.count({
                where: { lineId, status: 'IN_STOCK' },
            });
            if (line.qty < serialled)
                throw new BadRequestException(
                    `${line.qty} is fewer than the ${serialled} serialled bars in stock. Mark those sold or removed first.`,
                );
        }
        const m = await tx.liveStockMovement.create({
            data: {
                lineId,
                delta,
                qtyAfter: line.qty,
                source: meta.source,
                reference: meta.reference ?? null,
                reason: meta.reason ?? null,
                note: meta.note ?? null,
                actor: meta.actor,
                reversesId: meta.reversesId ?? null,
            },
        });
        await this.audit.record(
            meta.actor,
            `live-stock.${meta.source.toLowerCase()}`,
            `${line.branchCode} ${line.metal} ${line.family} ${line.variant}${line.refinery ? ' ' + line.refinery : ''}: ${line.qty - delta} -> ${line.qty}${meta.reason ? ' (' + meta.reason + ')' : ''}`,
            tx,
        );
        return { id: m.id, qtyAfter: line.qty };
    }

    async lineOrThrow(tx: Tx | PrismaService, id: number) {
        const line = await tx.liveStockLine.findUnique({ where: { id } });
        if (!line) throw new NotFoundException(`Stock line ${id} not found.`);
        return line;
    }

    // ------------------------------------------------------------ edits

    async adjust(
        user: AuthenticatedUser,
        lineId: number,
        dto: AdjustLiveStockRequest,
    ): Promise<{ qty: number; movementId: number }> {
        const existing = await this.lineOrThrow(this.prisma, lineId);
        await this.assertCanEdit(user, existing.branchCode);
        return this.prisma.$transaction(async (tx) => {
            const line = await this.lineOrThrow(tx, lineId);
            const delta = dto.delta ?? (dto.qty as number) - line.qty;
            if (delta === 0)
                throw new BadRequestException('The count is already that.');
            const m = await this.move(tx, lineId, delta, {
                source: 'MANUAL',
                reason: dto.reason,
                note: dto.note ?? null,
                actor: user.email,
            });
            return { qty: m.qtyAfter, movementId: m.id };
        });
    }

    async createLine(
        user: AuthenticatedUser,
        dto: CreateLiveStockLineRequest,
    ): Promise<{ id: number }> {
        await this.assertCanEdit(user, dto.branchCode);
        return this.prisma.$transaction(async (tx) => {
            const key = {
                branchCode: dto.branchCode,
                metal: dto.metal,
                kind: dto.kind,
                family: dto.family,
                variant: dto.variant,
                refinery: dto.refinery,
            };
            const found = await tx.liveStockLine.findUnique({
                where: { branchCode_metal_kind_family_variant_refinery: key },
            });
            if (found)
                throw new ConflictException(
                    'That line already exists. Change its count instead.',
                );
            const line = await tx.liveStockLine.create({ data: key });
            if (dto.qty > 0)
                await this.move(tx, line.id, dto.qty, {
                    source: 'MANUAL',
                    reason: dto.reason,
                    note: dto.note ?? null,
                    actor: user.email,
                });
            else
                await this.audit.record(
                    user.email,
                    'live-stock.create-line',
                    `${dto.branchCode} ${dto.metal} ${dto.family} ${dto.variant}`,
                    tx,
                );
            return { id: line.id };
        });
    }

    /**
     * Add a serial to a bar line. When the line has more bars than serials, the new serial names one of the bars already
     * counted (the count stays); otherwise it is a new bar and the count goes up by one. A serial already in stock on
     * any line is a clash and is refused.
     */
    async addBar(
        user: AuthenticatedUser,
        lineId: number,
        dto: AddLiveStockBarRequest,
    ): Promise<{ id: number; qty: number }> {
        const existing = await this.lineOrThrow(this.prisma, lineId);
        await this.assertCanEdit(user, existing.branchCode);
        if (existing.kind !== 'BAR')
            throw new BadRequestException('Only bar lines hold serials.');
        const serialKey = liveSerialKey(dto.serial);
        if (!serialKey) throw new BadRequestException('Serial is empty.');
        return this.prisma.$transaction(async (tx) => {
            const clash = await tx.liveStockBar.findFirst({
                where: { serialKey, status: 'IN_STOCK' },
                include: { line: true },
            });
            if (clash)
                throw new ConflictException(
                    `Serial ${dto.serial} is already in stock at ${clash.line.branchCode} (${clash.line.variant} ${clash.line.refinery}).`,
                );
            const line = await this.lineOrThrow(tx, lineId);
            const serialled = await tx.liveStockBar.count({
                where: { lineId, status: 'IN_STOCK' },
            });
            const bar = await tx.liveStockBar.create({
                data: {
                    lineId,
                    serial: dto.serial.trim(),
                    serialKey,
                    grams: dto.grams ?? null,
                    details: dto.details ?? null,
                },
            });
            let qty = line.qty;
            if (serialled >= line.qty) {
                qty = (
                    await this.move(tx, lineId, 1, {
                        source: 'MANUAL',
                        reason: dto.reason,
                        reference: `bar:${bar.id}:ADD`,
                        actor: user.email,
                    })
                ).qtyAfter;
            } else {
                await this.audit.record(
                    user.email,
                    'live-stock.serial',
                    `${line.branchCode} ${line.variant} ${line.refinery}: serial ${bar.serial} added (${dto.reason})`,
                    tx,
                );
            }
            return { id: bar.id, qty };
        });
    }

    /** Mark a serialled bar sold or removed (count -1) or put it back in stock (count +1). */
    async setBarStatus(
        user: AuthenticatedUser,
        barId: number,
        dto: SetLiveStockBarStatusRequest,
    ): Promise<{ qty: number }> {
        const bar = await this.prisma.liveStockBar.findUnique({
            where: { id: barId },
            include: { line: true },
        });
        if (!bar) throw new NotFoundException(`Bar ${barId} not found.`);
        await this.assertCanEdit(user, bar.line.branchCode);
        if (bar.status === dto.status)
            throw new BadRequestException(`Bar is already ${dto.status}.`);
        return this.prisma.$transaction(async (tx) => {
            if (dto.status === 'IN_STOCK') {
                const clash = await tx.liveStockBar.findFirst({
                    where: {
                        serialKey: bar.serialKey,
                        status: 'IN_STOCK',
                        id: { not: barId },
                    },
                });
                if (clash)
                    throw new ConflictException(
                        `Serial ${bar.serial} is already in stock on another bar.`,
                    );
            }
            // Count must move first when restoring (the serial check compares against the count) and after when
            // removing; both orders are inside one transaction, so either failure rolls both back.
            if (dto.status === 'IN_STOCK') {
                const m = await this.move(tx, bar.lineId, 1, {
                    source: 'MANUAL',
                    reason: dto.reason,
                    note: dto.note ?? null,
                    reference: `bar:${barId}:IN_STOCK`,
                    actor: user.email,
                });
                await tx.liveStockBar.update({
                    where: { id: barId },
                    data: { status: 'IN_STOCK' },
                });
                return { qty: m.qtyAfter };
            }
            await tx.liveStockBar.update({
                where: { id: barId },
                data: { status: dto.status },
            });
            const m = await this.move(tx, bar.lineId, -1, {
                source: 'MANUAL',
                reason: dto.reason,
                note: dto.note ?? null,
                reference: `bar:${barId}:${dto.status}`,
                actor: user.email,
            });
            return { qty: m.qtyAfter };
        });
    }

    /** Move `qty` from a line to the same line at another branch. Both legs are TRANSFER movements sharing a reference. */
    async transfer(
        user: AuthenticatedUser,
        lineId: number,
        dto: TransferLiveStockRequest,
    ): Promise<{ fromQty: number; toQty: number }> {
        const from = await this.lineOrThrow(this.prisma, lineId);
        await this.assertCanEdit(user, from.branchCode);
        if (dto.toBranchCode === from.branchCode)
            throw new BadRequestException('Pick a different branch.');
        const to = await this.prisma.liveStockBranch.findUnique({
            where: { code: dto.toBranchCode },
        });
        if (!to)
            throw new NotFoundException(
                `Unknown branch "${dto.toBranchCode}".`,
            );
        if (dto.barIds.length > dto.qty)
            throw new BadRequestException(
                'More serialled bars selected than the quantity moved.',
            );
        const reference = `transfer:${from.id}>${to.code}:${Date.now()}`;
        return this.prisma.$transaction(async (tx) => {
            const target = await tx.liveStockLine.upsert({
                where: {
                    branchCode_metal_kind_family_variant_refinery: {
                        branchCode: to.code,
                        metal: from.metal,
                        kind: from.kind,
                        family: from.family,
                        variant: from.variant,
                        refinery: from.refinery,
                    },
                },
                update: {},
                create: {
                    branchCode: to.code,
                    metal: from.metal,
                    kind: from.kind,
                    family: from.family,
                    variant: from.variant,
                    refinery: from.refinery,
                },
            });
            if (dto.barIds.length > 0) {
                const bars = await tx.liveStockBar.findMany({
                    where: {
                        id: { in: dto.barIds },
                        lineId,
                        status: 'IN_STOCK',
                    },
                });
                if (bars.length !== dto.barIds.length)
                    throw new BadRequestException(
                        'Some selected bars are not in stock on this line.',
                    );
                await tx.liveStockBar.updateMany({
                    where: { id: { in: dto.barIds } },
                    data: { lineId: target.id },
                });
            }
            const out = await this.move(tx, lineId, -dto.qty, {
                source: 'TRANSFER',
                reference,
                reason: dto.reason,
                note: dto.note ?? null,
                actor: user.email,
            });
            const inn = await this.move(tx, target.id, dto.qty, {
                source: 'TRANSFER',
                reference,
                reason: dto.reason,
                note: dto.note ?? null,
                actor: user.email,
            });
            return { fromQty: out.qtyAfter, toQty: inn.qtyAfter };
        });
    }

    /**
     * Undo the line's latest change. Only a plain manual count change can be undone this way: transfers, serial changes
     * and sheet applications each have a second record to keep in step, so they are corrected with a new edit instead.
     */
    async undo(
        user: AuthenticatedUser,
        movementId: number,
    ): Promise<{ qty: number }> {
        const m = await this.prisma.liveStockMovement.findUnique({
            where: { id: movementId },
            include: { line: true },
        });
        if (!m) throw new NotFoundException(`Change ${movementId} not found.`);
        await this.assertCanEdit(user, m.line.branchCode);
        return this.prisma.$transaction(async (tx) => {
            const newest = await tx.liveStockMovement.findFirst({
                where: { lineId: m.lineId },
                orderBy: [{ id: 'desc' }],
            });
            if (newest?.id !== m.id)
                throw new BadRequestException(
                    'Only the latest change on a line can be undone.',
                );
            if (m.source !== 'MANUAL' || m.reference)
                throw new BadRequestException(
                    'That change cannot be undone here. Make a new correcting change instead.',
                );
            const already = await tx.liveStockMovement.findFirst({
                where: { reversesId: m.id },
            });
            if (already)
                throw new BadRequestException('That change is already undone.');
            const r = await this.move(tx, m.lineId, -m.delta, {
                source: 'UNDO',
                reason: `Undo of #${m.id}`,
                actor: user.email,
                reversesId: m.id,
            });
            return { qty: r.qtyAfter };
        });
    }

    async setThreshold(
        user: AuthenticatedUser,
        lineId: number,
        lowThreshold: number | null,
    ): Promise<void> {
        const line = await this.lineOrThrow(this.prisma, lineId);
        await this.assertCanEdit(user, line.branchCode);
        await this.prisma.liveStockLine.update({
            where: { id: lineId },
            data: { lowThreshold },
        });
    }

    /** Admin: link a stock location to an app branch so that branch's staff can edit it (null unlinks). */
    async linkBranch(
        user: AuthenticatedUser,
        code: string,
        dto: LinkLiveStockBranchRequest,
    ): Promise<LiveStockBranch> {
        if (!user.admin)
            throw new ForbiddenException('Only admins link branches.');
        if (dto.branchId !== null) {
            const b = await this.prisma.branch.findUnique({
                where: { id: dto.branchId },
            });
            if (!b)
                throw new NotFoundException(
                    `Branch ${dto.branchId} not found.`,
                );
        }
        const row = await this.prisma.liveStockBranch
            .update({ where: { code }, data: { branchId: dto.branchId } })
            .catch(() => {
                throw new NotFoundException(`Unknown branch "${code}".`);
            });
        await this.audit.record(
            user.email,
            'live-stock.link-branch',
            `${code} -> branch ${dto.branchId ?? 'none'}`,
        );
        return this.toBranch(row, user);
    }

    // ------------------------------------------------------------ baseline load

    /** The plan for a request, plus what it would change in the database. Read only. */
    private async diff(dto: LiveBaselineRequest): Promise<{
        plan: BaselinePlan;
        preview: LiveBaselinePreview;
    }> {
        const wanted = new Set(dto.branchCodes);
        const raw = planBaseline({ bars: dto.bars, coins: dto.coins });
        const plan: BaselinePlan = {
            ...raw,
            lines: raw.lines.filter((l) => wanted.has(l.branchCode)),
            bars: raw.bars.filter((b) => wanted.has(b.branchCode)),
        };
        const known = new Set(
            (
                await this.prisma.liveStockBranch.findMany({
                    select: { code: true },
                })
            ).map((b) => b.code),
        );
        const unknown = [...wanted].filter((c) => !known.has(c));
        if (unknown.length)
            throw new BadRequestException(
                `Unknown branch code(s): ${unknown.join(', ')}.`,
            );

        const existing = await this.prisma.liveStockLine.findMany({
            where: { branchCode: { in: [...wanted] } },
            select: {
                branchCode: true,
                metal: true,
                kind: true,
                family: true,
                variant: true,
                refinery: true,
                qty: true,
            },
        });
        const k = (l: {
            branchCode: string;
            metal: string;
            kind: string;
            family: string;
            variant: string;
            refinery: string;
        }) =>
            [
                l.branchCode,
                l.metal,
                l.kind,
                l.family,
                l.variant,
                l.refinery,
            ].join('|');
        const have = new Map(existing.map((l) => [k(l), l.qty]));
        let toCreate = 0;
        let toChange = 0;
        const byBranch: Record<string, number> = {};
        for (const l of plan.lines) {
            const cur = have.get(k(l));
            if (cur === undefined) toCreate += 1;
            else if (cur !== l.qty) toChange += 1;
            byBranch[l.branchCode] = (byBranch[l.branchCode] ?? 0) + l.qty;
        }
        const inStock = new Set(
            (
                await this.prisma.liveStockBar.findMany({
                    where: {
                        status: 'IN_STOCK',
                        serialKey: { in: plan.bars.map((b) => b.serialKey) },
                    },
                    select: { serialKey: true },
                })
            ).map((b) => b.serialKey),
        );
        return {
            plan,
            preview: {
                lines: plan.lines.length,
                linesToCreate: toCreate,
                linesToChange: toChange,
                units: plan.lines.reduce((n, l) => n + l.qty, 0),
                bars: plan.bars.length,
                barsToCreate: plan.bars.filter((b) => !inStock.has(b.serialKey))
                    .length,
                skippedSold: plan.skippedSold,
                fixes: plan.fixes,
                issues: plan.issues,
                clashes: plan.clashes,
                unlistedRefineries: plan.unlistedRefineries,
                byBranch,
            },
        };
    }

    async previewBaseline(
        user: AuthenticatedUser,
        dto: LiveBaselineRequest,
    ): Promise<LiveBaselinePreview> {
        this.assertAdmin(user);
        return (await this.diff(dto)).preview;
    }

    private assertAdmin(user: AuthenticatedUser): void {
        if (!user.admin)
            throw new ForbiddenException('Only admins load the baseline.');
    }

    /**
     * Load the sheet as the starting counts. Re-runnable: a line already there is set to the sheet's number through an
     * IMPORT movement (nothing is overwritten), a serial already in stock is left alone, and lines the sheet does not
     * mention are untouched. Stamps each loaded branch with the cut-over date.
     */
    async commitBaseline(
        user: AuthenticatedUser,
        dto: LiveBaselineRequest,
    ): Promise<LiveBaselineResult> {
        this.assertAdmin(user);
        const { plan, preview } = await this.diff(dto);
        const cutover = new Date(`${dto.cutoverDate}T00:00:00.000Z`);
        const reference = `baseline:${dto.cutoverDate}`;
        await this.prisma.$transaction(
            async (tx) => {
                const ids = new Map<string, number>();
                const lineKey = (l: {
                    branchCode: string;
                    metal: string;
                    kind: string;
                    family: string;
                    variant: string;
                    refinery: string;
                }) =>
                    [
                        l.branchCode,
                        l.metal,
                        l.kind,
                        l.family,
                        l.variant,
                        l.refinery,
                    ].join('|');
                for (const l of plan.lines) {
                    const line = await tx.liveStockLine.upsert({
                        where: {
                            branchCode_metal_kind_family_variant_refinery: {
                                branchCode: l.branchCode,
                                metal: l.metal,
                                kind: l.kind,
                                family: l.family,
                                variant: l.variant,
                                refinery: l.refinery,
                            },
                        },
                        update: {},
                        create: {
                            branchCode: l.branchCode,
                            metal: l.metal,
                            kind: l.kind,
                            family: l.family,
                            variant: l.variant,
                            refinery: l.refinery,
                            details: l.details,
                        },
                    });
                    ids.set(lineKey(l), line.id);
                    const delta = l.qty - line.qty;
                    if (delta !== 0)
                        await this.move(tx, line.id, delta, {
                            source: 'IMPORT',
                            reference,
                            reason: 'Baseline load from stock sheet',
                            actor: user.email,
                        });
                }
                for (const b of plan.bars) {
                    const exists = await tx.liveStockBar.findFirst({
                        where: { serialKey: b.serialKey, status: 'IN_STOCK' },
                    });
                    if (exists) continue;
                    const lineId = ids.get(
                        lineKey({ ...b, kind: 'BAR' as const }),
                    );
                    if (lineId === undefined) continue;
                    await tx.liveStockBar.create({
                        data: {
                            lineId,
                            serial: b.serial,
                            serialKey: b.serialKey,
                            grams: b.grams,
                            details: b.details,
                        },
                    });
                }
                await tx.liveStockBranch.updateMany({
                    where: { code: { in: dto.branchCodes } },
                    data: { cutoverDate: cutover },
                });
                await this.audit.record(
                    user.email,
                    'live-stock.baseline',
                    `${preview.lines} lines, ${preview.units} units, ${preview.barsToCreate} serials, cut-over ${dto.cutoverDate}`,
                    tx,
                );
            },
            { timeout: 120_000, maxWait: 10_000 },
        );
        return { ...preview, applied: true };
    }
}
