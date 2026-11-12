import { Injectable } from '@nestjs/common';
import {
    COLLECTED_TASK,
    type ShippedNotCollectedRow,
    type ShippedNotCollectedTasksResult,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

/**
 * Sales a posted Business Central shipment links to (the customer collected them) that the tradesheet still does not
 * show as collected. Staff tick Collected in the sheet; a "tick Collected" sheet task tells them where, and the next
 * tradesheet import closes it.
 */
@Injectable()
export class ShippedNotCollectedService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    async list(): Promise<ShippedNotCollectedRow[]> {
        const shipments = await this.prisma.bcShipment.findMany({
            where: { tradeId: { not: null }, trade: { collected: false } },
            orderBy: [{ postingDate: 'desc' }, { no: 'desc' }],
            include: {
                trade: {
                    select: {
                        id: true,
                        reference: true,
                        productText: true,
                        qty: true,
                        date: true,
                        customer: { select: { redactionCode: true } },
                        tasks: {
                            where: {
                                status: 'OPEN',
                                check: COLLECTED_TASK.check,
                            },
                            select: { id: true },
                        },
                    },
                },
            },
        });
        const seen = new Set<number>();
        const rows: ShippedNotCollectedRow[] = [];
        for (const s of shipments) {
            const t = s.trade;
            if (!t || seen.has(t.id)) continue;
            seen.add(t.id);
            rows.push({
                tradeId: t.id,
                reference: t.reference,
                customerCode: t.customer?.redactionCode ?? null,
                product: t.productText,
                qty: t.qty,
                saleDate: iso(t.date),
                shipmentNo: s.no,
                shippedOn: iso(s.postingDate),
                taskOpen: t.tasks.length > 0,
            });
        }
        return rows;
    }

    /** One "tick Collected" sheet task per listed sale that has none open. */
    async createTasks(actor: string): Promise<ShippedNotCollectedTasksResult> {
        const rows = await this.list();
        const todo = rows.filter((r) => !r.taskOpen);
        if (todo.length === 0) return { created: 0, alreadyOpen: rows.length };
        const trades = await this.prisma.trade.findMany({
            where: { id: { in: todo.map((r) => r.tradeId) } },
            select: { id: true, reference: true, client: true },
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.sheetTask.createMany({
                data: trades.map((t) => ({
                    tradeId: t.id,
                    reference: t.reference,
                    client: t.client,
                    sheet: COLLECTED_TASK.sheet,
                    what: COLLECTED_TASK.what,
                    value: COLLECTED_TASK.value,
                    check: COLLECTED_TASK.check,
                    createdBy: actor,
                })),
            });
            await this.audit.record(
                actor,
                'sheet-tasks',
                `Tick Collected for ${trades.length} sale${trades.length === 1 ? '' : 's'} Business Central shipped`,
                tx,
            );
        });
        return {
            created: trades.length,
            alreadyOpen: rows.length - todo.length,
        };
    }
}
