import { Injectable } from '@nestjs/common';
import type {
    BcAwaitingRequest,
    BcAwaitingResult,
    WorkbookChunkRequest,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { WorkbookImportService } from './workbook-import.service';

type Row = Record<string, unknown>;
interface Delegate {
    findMany(args: unknown): Promise<Row[]>;
    createMany(args: unknown): Promise<unknown>;
    updateMany(args: unknown): Promise<{ count: number }>;
}

/** Shortest order-number core worth matching a trade reference on; shorter ones would match unrelated sales. */
const MIN_CORE = 6;

/**
 * The Business Central "Orders Awaiting Collection" report. Orders in it are upserted like any workbook table. An
 * order that was in the previous report and is missing from this one has been posted: its trade gets a POSTED step
 * (a normal order event, so the order board shows it) unless it has one already. The report must be complete, which
 * the request schema enforces by taking the whole file in one call.
 */
@Injectable()
export class BcAwaitingImportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly workbook: WorkbookImportService,
    ) {}

    preview(dto: BcAwaitingRequest): Promise<BcAwaitingResult> {
        return this.run(dto, this.prisma, 'preview', true);
    }

    commit(dto: BcAwaitingRequest, actor: string): Promise<BcAwaitingResult> {
        return this.prisma.$transaction(
            (tx) => this.run(dto, tx as unknown as PrismaService, actor, false),
            {
                timeout: 120_000,
                maxWait: 10_000,
            },
        );
    }

    private async run(
        dto: BcAwaitingRequest,
        db: PrismaService,
        actor: string,
        dry: boolean,
    ): Promise<BcAwaitingResult> {
        const chunk: WorkbookChunkRequest = {
            fileName: dto.fileName,
            schemaVersion: dto.schemaVersion,
            table: 'bc_sales_orders',
            rows: dto.rows,
            lastOfTable: false,
            complete: true,
        };
        const loaded = await this.workbook.loadChunk(chunk, db, actor, dry);

        const orders = db as unknown as Record<string, Delegate>;
        const newCores = new Set(
            dto.rows
                .map((r) =>
                    typeof r['ext_doc_core'] === 'string'
                        ? r['ext_doc_core']
                        : '',
                )
                .filter(Boolean),
        );
        const newKeys = new Set(dto.rows.map((r) => String(r['id'])));

        // Orders from earlier reports that this one did not touch.
        const earlier = await orders['bcSalesOrder'].findMany({
            where: dry
                ? { missingFromImport: false }
                : {
                      missingFromImport: false,
                      importBatchId: { not: loaded.batchId },
                  },
        });
        const gone = earlier.filter(
            (o) => !newKeys.has(String(o['sourceKey'])),
        );
        if (!dry && gone.length) {
            await orders['bcSalesOrder'].updateMany({
                where: { id: { in: gone.map((o) => o['id']) } },
                data: { missingFromImport: true },
            });
        }

        let posted = 0;
        let alreadyPosted = 0;
        let noTrade = 0;
        for (const order of gone) {
            const core =
                typeof order['extDocCore'] === 'string'
                    ? order['extDocCore']
                    : '';
            // The same sale can come back under a different order number; if its core is in the report it is not posted.
            if (newCores.has(core)) continue;
            if (core.length < MIN_CORE) {
                noTrade++;
                continue;
            }
            const trades = await orders['trade'].findMany({
                where: { referenceKey: { endsWith: core } },
            });
            if (trades.length === 0) {
                noTrade++;
                continue;
            }
            for (const trade of trades) {
                const done = await orders['orderEvent'].findMany({
                    where: { tradeId: trade['id'], step: 'POSTED' },
                });
                if (done.length) {
                    alreadyPosted++;
                    continue;
                }
                posted++;
                if (!dry) {
                    await orders['orderEvent'].createMany({
                        data: [
                            {
                                tradeId: trade['id'],
                                step: 'POSTED',
                                by: 'import',
                                note: 'No longer in the Business Central awaiting-collection report.',
                            },
                        ],
                    });
                }
            }
        }

        return {
            batchId: loaded.batchId,
            added: loaded.added,
            changed: loaded.changed,
            unchanged: loaded.unchanged,
            gone: gone.length,
            posted,
            alreadyPosted,
            noTrade,
        };
    }
}
