import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    compareProducts,
    computeVariance,
    parseJournalPaste,
    suggestProductForBcItem,
    type BcItemsResponse,
    type CreateDiscrepancyRequest,
    type CreateStocktakeRequest,
    type Discrepancy,
    type ImportJournalResult,
    type Stocktake,
    type StocktakeDetail,
    type StocktakeLine,
    type UpdateDiscrepancyRequest,
    type UpdateStocktakeLineRequest,
    type UpdateStocktakeRequest,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

const toDate = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);

type LineRow = Prisma.StocktakeLineGetPayload<object>;
type DiscrepancyRow = Prisma.StocktakeDiscrepancyGetPayload<object>;
type StocktakeRow = Prisma.StocktakeGetPayload<object>;

@Injectable()
export class StocktakeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    // --- stocktakes -----------------------------------------------------------

    async list(): Promise<Stocktake[]> {
        const rows = await this.prisma.stocktake.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return rows.map(toStocktake);
    }

    async get(id: number): Promise<StocktakeDetail> {
        const row = await this.prisma.stocktake.findUnique({
            where: { id },
            include: {
                lines: {
                    orderBy: [{ locationCode: 'asc' }, { itemNo: 'asc' }],
                },
                discrepancies: { orderBy: { id: 'asc' } },
            },
        });
        if (!row) throw new NotFoundException(`Stocktake ${id} not found.`);
        return {
            ...toStocktake(row),
            lines: row.lines.map(toLine),
            discrepancies: row.discrepancies.map(toDiscrepancy),
        };
    }

    async create(
        dto: CreateStocktakeRequest,
        actor: string,
    ): Promise<Stocktake> {
        if (dto.cutoffDate < dto.countDate) {
            throw new BadRequestException(
                'The cutoff date cannot be before the count date.',
            );
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const created = await tx.stocktake.create({
                data: {
                    name: dto.name,
                    countDate: toDate(dto.countDate),
                    cutoffDate: toDate(dto.cutoffDate),
                    stocktakeLead: dto.stocktakeLead,
                    secondChecker: dto.secondChecker,
                    createdBy: actor,
                },
            });
            await this.audit.record(
                actor,
                'stocktake-create',
                `${created.name} (count ${dto.countDate}, cutoff ${dto.cutoffDate})`,
                tx,
            );
            return created;
        });
        return toStocktake(row);
    }

    async update(
        id: number,
        dto: UpdateStocktakeRequest,
        actor: string,
    ): Promise<Stocktake> {
        const current = await this.requireOpen(id);
        // Finalising is a one-way door; it has its own endpoint so it cannot be reached by accident.
        if (dto.status === 'FINALISED') {
            throw new BadRequestException(
                'Use the finalise action to finalise a stocktake.',
            );
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.stocktake.update({
                where: { id },
                data: dto,
            });
            if (dto.status && dto.status !== current.status) {
                await this.audit.record(
                    actor,
                    'stocktake-status',
                    `${current.name}: ${current.status} -> ${dto.status}`,
                    tx,
                );
            }
            return updated;
        });
        return toStocktake(row);
    }

    /**
     * Locks the count. Rows are not copied: once finalised the service refuses every write, so the rows
     * themselves are the snapshot. Open discrepancies do not block this, because the guide says to record
     * and escalate what cannot be settled on the day; the report states how many are still unresolved.
     */
    async finalise(id: number, actor: string): Promise<Stocktake> {
        const current = await this.requireOpen(id);
        const [lines, unresolved, unconfirmedBars] = await Promise.all([
            this.prisma.stocktakeLine.count({ where: { stocktakeId: id } }),
            this.prisma.stocktakeDiscrepancy.count({
                where: { stocktakeId: id, resolved: false },
            }),
            this.prisma.stocktakeBar.count({
                where: { stocktakeId: id, status: 'UNCONFIRMED' },
            }),
        ]);
        if (lines === 0) {
            throw new BadRequestException(
                'Import the journal before finalising.',
            );
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.stocktake.update({
                where: { id },
                data: {
                    status: 'FINALISED',
                    finalisedBy: actor,
                    finalisedAt: new Date(),
                },
            });
            await this.audit.record(
                actor,
                'stocktake-finalise',
                `${current.name}: ${lines} lines, ${unresolved} unresolved discrepancies, ${unconfirmedBars} unconfirmed bars`,
                tx,
            );
            return updated;
        });
        return toStocktake(row);
    }

    // --- journal import -------------------------------------------------------

    /**
     * Adds journal lines. Lines already in this stocktake (same item and location) are left exactly as
     * they are, so pasting the same export twice cannot wipe counts that were entered in between.
     */
    async importJournal(
        id: number,
        text: string,
        actor: string,
    ): Promise<ImportJournalResult> {
        await this.requireOpen(id);
        const parsed = parseJournalPaste(text);
        if (parsed.rows.length === 0) {
            return { added: 0, skippedExisting: 0, issues: parsed.issues };
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const created = await tx.stocktakeLine.createMany({
                data: parsed.rows.map((r) => ({ stocktakeId: id, ...r })),
                skipDuplicates: true,
            });
            // Every BC item seen is remembered so it can be linked to a product, without ever renaming it.
            await tx.bcItem.createMany({
                data: [
                    ...new Map(
                        parsed.rows.map((r) => [
                            r.itemNo,
                            { itemNo: r.itemNo, description: r.description },
                        ]),
                    ).values(),
                ],
                skipDuplicates: true,
            });
            await this.audit.record(
                actor,
                'stocktake-import',
                `stocktake ${id}: ${created.count} added, ${parsed.rows.length - created.count} already present, ${parsed.issues.length} rows rejected`,
                tx,
            );
            return created.count;
        });
        return {
            added: result,
            skippedExisting: parsed.rows.length - result,
            issues: parsed.issues,
        };
    }

    // --- counting -------------------------------------------------------------

    async updateLine(
        stocktakeId: number,
        lineId: number,
        dto: UpdateStocktakeLineRequest,
    ): Promise<StocktakeLine> {
        await this.requireOpen(stocktakeId);
        const line = await this.prisma.stocktakeLine.findFirst({
            where: { id: lineId, stocktakeId },
        });
        if (!line) throw new NotFoundException(`Line ${lineId} not found.`);
        // Entering a count marks the line counted unless the caller says otherwise: it is the usual intent.
        const enteredCount =
            dto.countedNormal !== undefined ||
            dto.countedCustomer !== undefined;
        const row = await this.prisma.stocktakeLine.update({
            where: { id: lineId },
            data: {
                ...dto,
                counted: dto.counted ?? (enteredCount ? true : undefined),
            },
        });
        return toLine(row);
    }

    // --- discrepancies --------------------------------------------------------

    async addDiscrepancy(
        stocktakeId: number,
        dto: CreateDiscrepancyRequest,
        actor: string,
    ): Promise<Discrepancy> {
        await this.requireOpen(stocktakeId);
        const row = await this.prisma.stocktakeDiscrepancy.create({
            data: { stocktakeId, createdBy: actor, ...dto },
        });
        return toDiscrepancy(row);
    }

    async updateDiscrepancy(
        stocktakeId: number,
        discrepancyId: number,
        dto: UpdateDiscrepancyRequest,
    ): Promise<Discrepancy> {
        await this.requireOpen(stocktakeId);
        const existing = await this.prisma.stocktakeDiscrepancy.findFirst({
            where: { id: discrepancyId, stocktakeId },
        });
        if (!existing)
            throw new NotFoundException(
                `Discrepancy ${discrepancyId} not found.`,
            );
        const row = await this.prisma.stocktakeDiscrepancy.update({
            where: { id: discrepancyId },
            data: dto,
        });
        return toDiscrepancy(row);
    }

    async deleteDiscrepancy(
        stocktakeId: number,
        discrepancyId: number,
    ): Promise<void> {
        await this.requireOpen(stocktakeId);
        const res = await this.prisma.stocktakeDiscrepancy.deleteMany({
            where: { id: discrepancyId, stocktakeId },
        });
        if (res.count === 0)
            throw new NotFoundException(
                `Discrepancy ${discrepancyId} not found.`,
            );
    }

    // --- BC item codes --------------------------------------------------------

    /** Every BC item seen so far, with the linked product and, where none is linked, weight-based suggestions. */
    async listBcItems(): Promise<BcItemsResponse> {
        const [items, products] = await Promise.all([
            this.prisma.bcItem.findMany({
                include: { product: { select: { id: true, name: true } } },
                orderBy: { itemNo: 'asc' },
            }),
            this.prisma.product.findMany({
                where: { deletedAt: null },
                select: {
                    id: true,
                    name: true,
                    weight: true,
                    category: true,
                    metalType: true,
                },
            }),
        ]);
        const suggestable = products.map((p) => ({
            id: p.id,
            name: p.name,
            weight: Number(p.weight),
            category: p.category,
            metalType: p.metalType,
        }));
        const mapped = items.map((i) => {
            const s = i.product
                ? null
                : suggestProductForBcItem(i.description, suggestable);
            return {
                itemNo: i.itemNo,
                description: i.description,
                productId: i.productId,
                productName: i.product?.name ?? null,
                suggestedProductIds:
                    s?.status === 'SUGGESTED'
                        ? [s.productId]
                        : s?.status === 'AMBIGUOUS'
                          ? s.productIds
                          : [],
            };
        });
        return {
            items: mapped,
            // Display order, not id order: gold first, 1oz and 100g first within a metal.
            products: products
                .map((p) => ({
                    id: p.id,
                    name: p.name,
                    metalType: p.metalType,
                    category: p.category,
                    weight: Number(p.weight),
                }))
                .sort(compareProducts)
                .map(({ id, name, metalType, category }) => ({
                    id,
                    name,
                    metalType,
                    category,
                })),
        };
    }

    async linkBcItem(
        itemNo: string,
        productId: number | null,
        actor: string,
    ): Promise<void> {
        const item = await this.prisma.bcItem.findUnique({ where: { itemNo } });
        if (!item) throw new NotFoundException(`BC item ${itemNo} not found.`);
        if (productId !== null) {
            const product = await this.prisma.product.findFirst({
                where: { id: productId, deletedAt: null },
            });
            if (!product)
                throw new NotFoundException(`Product ${productId} not found.`);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.bcItem.update({ where: { itemNo }, data: { productId } });
            await this.audit.record(
                actor,
                'bc-item-link',
                `${itemNo} -> ${productId ?? 'unlinked'}`,
                tx,
            );
        });
    }

    // --- helpers --------------------------------------------------------------

    async requireOpen(id: number): Promise<StocktakeRow> {
        const row = await this.prisma.stocktake.findUnique({ where: { id } });
        if (!row) throw new NotFoundException(`Stocktake ${id} not found.`);
        if (row.status === 'FINALISED') {
            throw new ConflictException(
                'This stocktake is finalised and can no longer be changed.',
            );
        }
        return row;
    }
}

function toStocktake(row: StocktakeRow): Stocktake {
    return {
        id: row.id,
        name: row.name,
        countDate: toIso(row.countDate),
        cutoffDate: toIso(row.cutoffDate),
        status: row.status,
        stocktakeLead: row.stocktakeLead,
        secondChecker: row.secondChecker,
        notes: row.notes,
        createdBy: row.createdBy,
        finalisedBy: row.finalisedBy,
        finalisedAt: row.finalisedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
    };
}

function toLine(row: LineRow): StocktakeLine {
    return {
        id: row.id,
        itemNo: row.itemNo,
        description: row.description,
        locationCode: row.locationCode,
        qtyCalculated: row.qtyCalculated,
        countedNormal: row.countedNormal,
        countedCustomer: row.countedCustomer,
        counted: row.counted,
        variance: computeVariance(
            row.qtyCalculated,
            row.countedNormal,
            row.countedCustomer,
            row.counted,
        ),
        reason: row.reason,
        serialsChecked: row.serialsChecked,
        serialNote: row.serialNote,
        batchName: row.batchName,
        documentNo: row.documentNo,
        entryType: row.entryType,
        unitAmount: row.unitAmount === null ? null : Number(row.unitAmount),
        unitCost: row.unitCost === null ? null : Number(row.unitCost),
    };
}

function toDiscrepancy(row: DiscrepancyRow): Discrepancy {
    return {
        id: row.id,
        itemNo: row.itemNo,
        description: row.description,
        issueType: row.issueType,
        bcShows: row.bcShows,
        physicalFound: row.physicalFound,
        serialNo: row.serialNo,
        action: row.action,
        resolved: row.resolved,
        createdBy: row.createdBy,
    };
}
