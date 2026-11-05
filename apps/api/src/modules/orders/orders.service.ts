import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ORDER_LIFECYCLE_LABELS,
    allowedSteps,
    deriveOrder,
    isOpenOrder,
    nextAction,
    sheetTasksForStep,
    type OrderDetail,
    type OrderEvent,
    type OrderListQuery,
    type OrderListResponse,
    type OrderRow,
    type OrderStep,
    type RecordStepRequest,
    type SheetTask,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

/** How far back the order list looks. Older sales are history, not work to do. */
const WINDOW_DAYS = 120;
const MAX_ROWS = 500;

const tradeInclude = {
    events: { orderBy: { id: 'asc' } },
    tasks: { orderBy: { id: 'asc' } },
} satisfies Prisma.TradeInclude;
type TradeWithSteps = Prisma.TradeGetPayload<{ include: typeof tradeInclude }>;

const iso = (d: Date) => d.toISOString();
const dateOnly = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);
const num = (v: Prisma.Decimal | null) => (v === null ? null : Number(v));

export const toSheetTask = (t: TradeWithSteps['tasks'][number]): SheetTask => ({
    id: t.id,
    tradeId: t.tradeId,
    reference: t.reference,
    client: t.client,
    sheet: t.sheet as SheetTask['sheet'],
    what: t.what,
    value: t.value,
    check: t.check,
    status: t.status,
    createdAt: iso(t.createdAt),
    createdBy: t.createdBy,
    closedAt: t.closedAt ? iso(t.closedAt) : null,
    closedBy: t.closedBy,
    closedVia: t.closedVia,
});

const toEvent = (e: TradeWithSteps['events'][number]): OrderEvent => ({
    id: e.id,
    step: e.step,
    by: e.by,
    at: iso(e.at),
    note: e.note,
});

/**
 * Orders as staff see them: one row per tradesheet sale, with the lifecycle derived from what the tradesheet shows
 * plus the steps recorded here. Imported trades are never changed; a recorded step only adds an event and the sheet
 * tasks that go with it.
 */
@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    private facts(t: TradeWithSteps) {
        return deriveOrder({
            cptyKind: t.cptyKind,
            collected: t.collected,
            hasLot: t.lotId !== null,
            supplierInvoice: t.supplierInvoice,
            steps: t.events.map((e) => e.step),
            // Filled in once the BC "Orders Awaiting Collection" report is imported.
            bcOpen: null,
        });
    }

    private toRow(t: TradeWithSteps): OrderRow {
        const d = this.facts(t);
        return {
            id: t.id,
            reference: t.reference,
            client: t.client,
            branchCode: t.branchCode,
            metal: t.metal,
            qty: t.qty,
            product: t.productText,
            date: dateOnly(t.date),
            amount: num(t.receipt) ?? num(t.totalPrice),
            cpty: t.cptyRaw,
            supplierInvoice: t.supplierInvoice,
            lifecycle: d.lifecycle,
            source: d.source,
            queues: d.queues,
            nextAction: nextAction(d.lifecycle, d.source, d.queues),
            openTasks: t.tasks.filter((x) => x.status === 'OPEN').length,
        };
    }

    async list(query: OrderListQuery): Promise<OrderListResponse> {
        const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);
        const trades = await this.prisma.trade.findMany({
            where: {
                missingFromImport: false,
                OR: [
                    { date: { gte: since } },
                    { tasks: { some: { status: 'OPEN' } } },
                ],
                ...(query.branch && { branchCode: query.branch.toUpperCase() }),
            },
            include: tradeInclude,
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
            take: 4000,
        });

        const all = trades.map((t) => ({
            row: this.toRow(t),
            d: this.facts(t),
        }));
        const open = all.filter(({ d }) => isOpenOrder(d, null));
        const counts: Record<string, number> = { all: open.length };
        for (const { row } of all)
            for (const q of row.queues) counts[q] = (counts[q] ?? 0) + 1;

        const needle = query.q?.toLowerCase();
        const queue = query.queue ?? 'all';
        const rows = (
            queue === 'all'
                ? open
                : all.filter(({ row }) => row.queues.includes(queue))
        )
            .map(({ row }) => row)
            .filter(
                (r) =>
                    !needle ||
                    `${r.client} ${r.product} ${r.reference} ${r.cpty ?? ''}`
                        .toLowerCase()
                        .includes(needle),
            )
            .slice(0, MAX_ROWS);

        const openTasks = await this.prisma.sheetTask.count({
            where: { status: 'OPEN' },
        });
        return { rows, counts, openTasks, asOf: iso(new Date()) };
    }

    async get(id: number): Promise<OrderDetail> {
        const t = await this.prisma.trade.findUnique({
            where: { id },
            include: tradeInclude,
        });
        if (!t) throw new NotFoundException(`Order ${id} not found`);
        return this.toDetail(t);
    }

    private toDetail(t: TradeWithSteps): OrderDetail {
        const d = this.facts(t);
        return {
            ...this.toRow(t),
            events: t.events.map(toEvent),
            tasks: t.tasks.map(toSheetTask),
            allowedSteps: allowedSteps(d.lifecycle, d.source),
            notes: t.notes,
        };
    }

    async recordStep(
        id: number,
        step: OrderStep,
        body: RecordStepRequest,
        actor: string,
    ): Promise<OrderDetail> {
        const t = await this.prisma.trade.findUnique({
            where: { id },
            include: tradeInclude,
        });
        if (!t) throw new NotFoundException(`Order ${id} not found`);
        const d = this.facts(t);
        if (!allowedSteps(d.lifecycle, d.source).includes(step)) {
            throw new BadRequestException(
                `${step} cannot be recorded while the order is ${ORDER_LIFECYCLE_LABELS[d.lifecycle]}`,
            );
        }

        const drafts = sheetTasksForStep(step, {
            client: t.client,
            reference: t.reference,
            product: t.productText,
            qty: t.qty,
            supplierInvoice: body.supplierInvoice ?? t.supplierInvoice,
            pline: body.pline,
            soldComment: body.soldComment,
            serials: body.serials,
            refinery: body.refinery,
            stockChange: body.stockChange,
            date: t.date ? t.date.toISOString().slice(0, 10) : null,
        });

        await this.prisma.$transaction(async (tx) => {
            await tx.orderEvent.create({
                data: { tradeId: id, step, by: actor, note: body.note ?? null },
            });
            if (drafts.length) {
                await tx.sheetTask.createMany({
                    data: drafts.map((x) => ({
                        tradeId: id,
                        reference: t.reference,
                        client: t.client,
                        sheet: x.sheet,
                        what: x.what,
                        value: x.value,
                        check: x.check,
                        createdBy: actor,
                    })),
                });
            }
            await this.audit.record(
                actor,
                'order-step',
                `${t.reference}: ${step} (${drafts.length} sheet task${drafts.length === 1 ? '' : 's'})`,
                tx,
            );
        });
        return this.get(id);
    }
}
