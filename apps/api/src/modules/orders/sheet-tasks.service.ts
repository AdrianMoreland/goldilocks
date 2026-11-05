import { Injectable, NotFoundException } from '@nestjs/common';
import {
    taskShowsDone,
    type Handover,
    type ReconcileResult,
    type SheetTask,
    type SheetTaskListQuery,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { toSheetTask } from './orders.service';

/**
 * Sheet tasks are the changes staff make by hand in the tradesheet, safe sheet and stock sheet. Goldilocks never
 * edits those sheets: a task holds the exact value to paste, and it closes when someone ticks it or when an import
 * shows the change.
 */
@Injectable()
export class SheetTasksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    async list(query: SheetTaskListQuery): Promise<SheetTask[]> {
        const rows = await this.prisma.sheetTask.findMany({
            where: query.status ? { status: query.status } : {},
            orderBy: [{ status: 'asc' }, { id: 'desc' }],
            take: 500,
        });
        return rows.map(toSheetTask);
    }

    async complete(id: number, actor: string): Promise<SheetTask> {
        const t = await this.prisma.sheetTask.findUnique({ where: { id } });
        if (!t) throw new NotFoundException(`Sheet task ${id} not found`);
        if (t.status === 'DONE') return toSheetTask(t);
        const done = await this.prisma.$transaction(async (tx) => {
            const u = await tx.sheetTask.update({
                where: { id },
                data: {
                    status: 'DONE',
                    closedAt: new Date(),
                    closedBy: actor,
                    closedVia: 'MANUAL',
                },
            });
            await this.audit.record(
                actor,
                'sheet-task-done',
                `${t.reference}: ${t.sheet}, ${t.what}`,
                tx,
            );
            return u;
        });
        return toSheetTask(done);
    }

    /** Close open tasks that the imported trades now show as done. Safe to run any time, and after every import. */
    async reconcile(actor: string): Promise<ReconcileResult> {
        const open = await this.prisma.sheetTask.findMany({
            where: {
                status: 'OPEN',
                check: { not: 'MANUAL' },
                tradeId: { not: null },
            },
            include: { trade: { select: { collected: true, cptyRaw: true } } },
        });
        const ids = open
            .filter((t) => t.trade && taskShowsDone(t, t.trade))
            .map((t) => t.id);
        if (ids.length) {
            await this.prisma.$transaction(async (tx) => {
                await tx.sheetTask.updateMany({
                    where: { id: { in: ids }, status: 'OPEN' },
                    data: {
                        status: 'DONE',
                        closedAt: new Date(),
                        closedBy: 'import',
                        closedVia: 'IMPORT',
                    },
                });
                await this.audit.record(
                    actor,
                    'sheet-tasks-reconcile',
                    `${ids.length} of ${open.length} open tasks closed by an import`,
                    tx,
                );
            });
        }
        return { checked: open.length, closed: ids.length };
    }

    async latestHandover(): Promise<Handover | null> {
        const h = await this.prisma.handover.findFirst({
            orderBy: { id: 'desc' },
        });
        return h
            ? {
                  id: h.id,
                  note: h.note,
                  by: h.by,
                  createdAt: h.createdAt.toISOString(),
              }
            : null;
    }

    async saveHandover(note: string, actor: string): Promise<Handover> {
        const h = await this.prisma.$transaction(async (tx) => {
            const created = await tx.handover.create({
                data: { note, by: actor },
            });
            await this.audit.record(actor, 'handover', 'Closed the day', tx);
            return created;
        });
        return {
            id: h.id,
            note: h.note,
            by: h.by,
            createdAt: h.createdAt.toISOString(),
        };
    }
}
