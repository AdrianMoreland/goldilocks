import { Injectable, NotFoundException } from '@nestjs/common';
import {
    compareStockLabels,
    CUSTOMER_ORDER_STATUS_LABELS,
    expectedCustomerStock,
    parseCustomerOrdersPaste,
    planCustomerOrderImport,
    type AddEvidenceRequest,
    type CreateCustomerOrderRequest,
    type CustomerOrderImportRow,
    type CustomerOrderPlanOptions,
    type CustomerOrder,
    type CustomerOrderStatus,
    type ExpectedCustomerStockResponse,
    type ImportCustomerOrdersRequest,
    type ImportCustomerOrdersResult,
    type StockMetal,
    type UpdateCustomerOrderRequest,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

const toDate = (iso: string | null | undefined) =>
    iso ? new Date(`${iso}T00:00:00.000Z`) : iso === null ? null : undefined;
const toIso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);
const blank = <T>(v: T | null | undefined) => (v === '' ? null : v);

type Db = Prisma.TransactionClient | PrismaService;
type OrderImportPlan = ReturnType<typeof planCustomerOrderImport>;

type ItemWithEvidence = Prisma.CustomerOrderItemGetPayload<{
    include: { evidence: true };
}>;

/**
 * Goods held for customers. Records custody and status; Business Central remains the system of record, so a
 * BC order number is a pointer, not a copy. A move to Collected never needs evidence here (the policy for
 * paid-but-not-collected is still undecided), but every claim of collection can be logged with its source.
 */
@Injectable()
export class CustomerOrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    async list(filter: {
        status?: CustomerOrderStatus;
        locationCode?: string;
    }): Promise<CustomerOrder[]> {
        const rows = await this.prisma.customerOrderItem.findMany({
            where: {
                ...(filter.status && { status: filter.status }),
                ...(filter.locationCode && {
                    locationCode: filter.locationCode.toUpperCase(),
                }),
            },
            include: { evidence: { orderBy: { id: 'asc' } } },
            orderBy: [
                { locationCode: 'asc' },
                { client: 'asc' },
                { id: 'asc' },
            ],
        });
        // Branch, then product display order (gold first, 1oz and 100g first), then client.
        return rows
            .sort(
                (a, b) =>
                    a.locationCode.localeCompare(b.locationCode) ||
                    compareStockLabels(
                        { metal: a.metal, label: a.product },
                        { metal: b.metal, label: b.product },
                    ) ||
                    a.client.localeCompare(b.client) ||
                    a.id - b.id,
            )
            .map(toOrder);
    }

    async create(
        dto: CreateCustomerOrderRequest,
        actor: string,
    ): Promise<CustomerOrder> {
        const row = await this.prisma.$transaction(async (tx) => {
            const created = await tx.customerOrderItem.create({
                data: {
                    locationCode: dto.locationCode.toUpperCase(),
                    client: dto.client,
                    reference: blank(dto.reference) ?? null,
                    bcOrderNo: blank(dto.bcOrderNo) ?? null,
                    supplierRef: blank(dto.supplierRef) ?? null,
                    metal: dto.metal ?? null,
                    product: dto.product,
                    bcItemNo: blank(dto.bcItemNo) ?? null,
                    quantity: dto.quantity,
                    refinery: blank(dto.refinery) ?? null,
                    serials: blank(dto.serials) ?? null,
                    status: dto.status,
                    orderedOn: toDate(dto.orderedOn) ?? null,
                    notes: blank(dto.notes) ?? null,
                    createdBy: actor,
                },
                include: { evidence: true },
            });
            await this.audit.record(
                actor,
                'customer-order-create',
                `${created.client}: ${created.quantity} x ${created.product} (${created.status})`,
                tx,
            );
            return created;
        });
        return toOrder(row);
    }

    async update(
        id: number,
        dto: UpdateCustomerOrderRequest,
        actor: string,
    ): Promise<CustomerOrder> {
        const current = await this.require(id);
        const { orderedOn, ...rest } = dto;
        const row = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.customerOrderItem.update({
                where: { id },
                data: {
                    ...rest,
                    ...(rest.locationCode && {
                        locationCode: rest.locationCode.toUpperCase(),
                    }),
                    ...(orderedOn !== undefined && {
                        orderedOn: toDate(orderedOn),
                    }),
                },
                include: { evidence: { orderBy: { id: 'asc' } } },
            });
            if (dto.status && dto.status !== current.status) {
                await this.audit.record(
                    actor,
                    'customer-order-status',
                    `${current.client}, ${current.product} x${current.quantity}: ${CUSTOMER_ORDER_STATUS_LABELS[current.status]} -> ${CUSTOMER_ORDER_STATUS_LABELS[dto.status]}`,
                    tx,
                );
            }
            return updated;
        });
        return toOrder(row);
    }

    /** Evidence is append-only: it can be added, never edited or removed, so the trail of where a claim came from stays intact. */
    async addEvidence(
        id: number,
        dto: AddEvidenceRequest,
        actor: string,
    ): Promise<CustomerOrder> {
        await this.require(id);
        await this.prisma.customerOrderEvidence.create({
            data: {
                itemId: id,
                kind: dto.kind,
                reference: blank(dto.reference) ?? null,
                note: blank(dto.note) ?? null,
                observedOn: toDate(dto.observedOn) ?? null,
                recordedBy: actor,
            },
        });
        const row = await this.prisma.customerOrderItem.findUniqueOrThrow({
            where: { id },
            include: { evidence: { orderBy: { id: 'asc' } } },
        });
        return toOrder(row);
    }

    /**
     * Works out what these rows would add and change, without writing. Shared by the paste import and the
     * workbook import, so both match and update stored items by exactly the same rules.
     */
    async planRows(
        db: Db,
        rows: CustomerOrderImportRow[],
        options?: CustomerOrderPlanOptions,
    ) {
        if (rows.length === 0) return { toAdd: [], toUpdate: [], unchanged: 0 };
        const existing = await db.customerOrderItem.findMany({
            where: {
                locationCode: {
                    in: [...new Set(rows.map((r) => r.locationCode))],
                },
            },
            select: {
                id: true,
                locationCode: true,
                client: true,
                reference: true,
                product: true,
                quantity: true,
                status: true,
                serials: true,
                notes: true,
                orderedOn: true,
                missing: true,
                supplierRef: true,
                refinery: true,
            },
            orderBy: { id: 'asc' },
        });
        return planCustomerOrderImport(
            existing.map((e) => ({ ...e, orderedOn: toIso(e.orderedOn) })),
            rows,
            options,
        );
    }

    /** Writes a plan from planRows inside the caller's transaction: createMany, then one update per changed item. */
    async writePlan(
        tx: Prisma.TransactionClient,
        plan: OrderImportPlan,
        metalFor: (row: CustomerOrderImportRow) => StockMetal,
        actor: string,
    ): Promise<void> {
        await tx.customerOrderItem.createMany({
            data: plan.toAdd.map((r) => ({
                locationCode: r.locationCode,
                client: r.client,
                reference: r.reference,
                supplierRef: r.supplierRef,
                metal: metalFor(r),
                product: r.product,
                quantity: r.quantity,
                refinery: r.refinery,
                serials: r.serials,
                status: r.status,
                orderedOn: toDate(r.orderedOn) ?? null,
                missing: r.missing,
                notes: r.notes,
                createdBy: actor,
            })),
        });
        for (const u of plan.toUpdate) {
            await tx.customerOrderItem.update({
                where: { id: u.id },
                data: { ...u.changes, orderedOn: toDate(u.changes.orderedOn) },
            });
        }
    }

    /** Reads the paste and works out what it would add and change, without writing anything. */
    private async planImport(dto: ImportCustomerOrdersRequest) {
        const parsed = parseCustomerOrdersPaste(
            dto.text,
            dto.fallbackStatus ?? null,
        );
        const plan = await this.planRows(this.prisma, parsed.rows);
        return { parsed, plan };
    }

    /** What a paste would do, as counts. Writes nothing. */
    async previewImport(
        dto: ImportCustomerOrdersRequest,
    ): Promise<ImportCustomerOrdersResult> {
        const { parsed, plan } = await this.planImport(dto);
        return {
            added: plan.toAdd.length,
            updated: plan.toUpdate.length,
            unchanged: plan.unchanged,
            issues: parsed.issues,
        };
    }

    /**
     * Adds and updates rows pasted from the Customer Orders sheet. A row already stored updates its status
     * (forward only), serials, notes and the other sheet fields; one with nothing new changes nothing.
     */
    async importSheet(
        dto: ImportCustomerOrdersRequest,
        actor: string,
    ): Promise<ImportCustomerOrdersResult> {
        const { parsed, plan } = await this.planImport(dto);
        if (plan.toAdd.length > 0 || plan.toUpdate.length > 0) {
            await this.prisma.$transaction(
                async (tx) => {
                    await this.writePlan(tx, plan, () => dto.metal, actor);
                    await this.audit.record(
                        actor,
                        'customer-orders-import',
                        `${plan.toAdd.length} added, ${plan.toUpdate.length} updated, ${plan.unchanged} unchanged, ${parsed.issues.length} rejected`,
                        tx,
                    );
                },
                { timeout: 120_000, maxWait: 10_000 },
            );
        }
        return {
            added: plan.toAdd.length,
            updated: plan.toUpdate.length,
            unchanged: plan.unchanged,
            issues: parsed.issues,
        };
    }

    /** What the orders say should be physically in each branch: a reference for counting the customer safe. */
    async expectedStock(): Promise<ExpectedCustomerStockResponse> {
        const rows = await this.prisma.customerOrderItem.findMany({
            where: { status: { in: ['DELIVERED', 'BAGGED', 'ALLOCATED'] } },
            select: {
                locationCode: true,
                product: true,
                quantity: true,
                status: true,
            },
        });
        return expectedCustomerStock(rows);
    }

    private async require(id: number) {
        const row = await this.prisma.customerOrderItem.findUnique({
            where: { id },
        });
        if (!row)
            throw new NotFoundException(`Customer order ${id} not found.`);
        return row;
    }
}

function toOrder(row: ItemWithEvidence): CustomerOrder {
    return {
        id: row.id,
        locationCode: row.locationCode,
        client: row.client,
        reference: row.reference,
        bcOrderNo: row.bcOrderNo,
        supplierRef: row.supplierRef,
        metal: row.metal,
        product: row.product,
        bcItemNo: row.bcItemNo,
        quantity: row.quantity,
        refinery: row.refinery,
        serials: row.serials,
        status: row.status,
        orderedOn: toIso(row.orderedOn),
        missing: row.missing,
        notes: row.notes,
        createdBy: row.createdBy,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        evidence: row.evidence.map((e) => ({
            id: e.id,
            kind: e.kind,
            reference: e.reference,
            note: e.note,
            observedOn: toIso(e.observedOn),
            recordedBy: e.recordedBy,
            createdAt: e.createdAt.toISOString(),
        })),
    };
}
