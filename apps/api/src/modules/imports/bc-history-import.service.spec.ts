import { BcHistoryImportService } from './bc-history-import.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { BcHistoryRequest } from '@goldilocks/shared-types';

type Row = Record<string, unknown>;

/** A tiny in-memory stand-in for the Prisma delegates this service uses. */
function table(rows: Row[] = []) {
    let next = rows.length + 1;
    const data = rows.map((r, i) => ({ id: i + 1, ...r }));
    const matches = (row: Row, where: Row = {}) =>
        Object.entries(where).every(([k, cond]) => {
            if (k === 'NOT') return true;
            if (cond && typeof cond === 'object' && 'in' in cond)
                return (cond as { in: unknown[] }).in.includes(row[k]);
            if (cond && typeof cond === 'object' && 'not' in cond)
                return row[k] !== cond.not;
            return row[k] === cond;
        });
    return {
        data,
        findMany: jest.fn(async (args: { where?: Row } = {}) =>
            data.filter((r) => matches(r, args.where)),
        ),
        createMany: jest.fn(async ({ data: rowsIn }: { data: Row[] }) => {
            for (const r of rowsIn) data.push({ id: next++, ...r });
        }),
        create: jest.fn(async ({ data: r }: { data: Row }) => {
            const row = { id: next++, ...r };
            data.push(row);
            return row;
        }),
        update: jest.fn(
            async ({ where, data: r }: { where: Row; data: Row }) => {
                const row = data.find((x) => x['id'] === where['id'])!;
                Object.assign(row, r);
                return row;
            },
        ),
    };
}

function db() {
    const tables = {
        importBatch: table(),
        customer: table([
            { redactionCode: 'C000101', bcCustomerNo: null, bcVendorNo: null },
            {
                redactionCode: 'C000202',
                bcCustomerNo: null,
                bcVendorNo: 'PRV77777',
            },
        ]),
        trade: table([
            { referenceKey: 'DUG202609179', occurrence: 1, collected: false },
        ]),
        zohoInvoice: table([{ sourceKey: 'INV-009179' }]),
        bcShipment: table(),
        bcShipmentLine: table(),
        bcReceipt: table(),
        bcLedgerEntry: table(),
        bcTrackingEntry: table([
            {
                entryNo: '10',
                itemNo: '1101',
                serialNo: '1334834',
                serialNorm: '1334834',
                missingFromImport: false,
            },
            {
                entryNo: '11',
                itemNo: '1101',
                serialNo: '1334834',
                serialNorm: '1334834',
                missingFromImport: false,
            },
            {
                entryNo: '99',
                itemNo: '1101',
                serialNo: 'X1',
                serialNorm: 'X1',
                missingFromImport: false,
            },
        ]),
        bcItem: table([{ itemNo: '1101', productId: 7 }]),
        item: table(),
        itemEvent: table(),
    };
    return tables;
}

const request: BcHistoryRequest = {
    fileNames: ['paste'],
    shipments: [
        {
            no: 'SHP-100149',
            customerNo: 'PRV02393',
            customerCode: 'C000101',
            documentDate: '2026-10-29',
            postingDate: '2026-10-29',
            externalDocNo: 'DU-G202609179',
            locationCode: 'DU',
        },
        {
            no: 'SHP-100040',
            customerNo: 'PRV02161',
            customerCode: null,
            documentDate: '2026-09-01',
            postingDate: '2026-10-25',
            externalDocNo: 'INV-009179',
            locationCode: null,
        },
    ],
    shipmentLines: [
        {
            documentNo: 'SHP-100149',
            lineNo: 1,
            customerNo: 'PRV02393',
            itemNo: '1101',
            description: 'Argor-Heraeus 1oz bar',
            locationCode: 'DU',
            quantity: 1,
        },
    ],
    receipts: [
        {
            no: 'GRN-100108',
            vendorNo: 'PRV00001',
            sellerCode: 'C000202',
            documentDate: '2026-10-29',
            locationCode: null,
        },
    ],
    ledger: [
        {
            entryNo: 10,
            postingDate: '2026-10-29',
            entryType: 'Purchase',
            documentType: 'Purchase Receipt',
            documentNo: 'GRN-100108',
            itemNo: '1101',
            locationCode: 'DU',
            quantity: 25,
            remainingQuantity: 24,
            salesAmount: 0,
            costAmount: 87534.52,
            open: true,
        },
        {
            entryNo: 11,
            postingDate: '2026-10-29',
            entryType: 'Sale',
            documentType: 'Sales Shipment',
            documentNo: 'SHP-100149',
            itemNo: '1101',
            locationCode: 'DU',
            quantity: -1,
            remainingQuantity: 0,
            salesAmount: 3905,
            costAmount: -3529,
            open: false,
        },
    ],
};

function service(tables: ReturnType<typeof db>) {
    const prisma = {
        ...tables,
        $transaction: (fn: (tx: unknown) => Promise<unknown>) => fn(tables),
    } as unknown as PrismaService;
    return new BcHistoryImportService(prisma);
}

describe('BcHistoryImportService', () => {
    it('previews without writing', async () => {
        const tables = db();
        const result = await service(tables).preview(request);
        expect(result.batchId).toBe(0);
        expect(result.shipments.added).toBe(2);
        expect(result.eventsAdded).toBe(2);
        expect(result.itemsAdded).toBe(1);
        expect(tables.bcShipment.data).toHaveLength(0);
        expect(tables.item.data).toHaveLength(0);
        expect(tables.customer.update).not.toHaveBeenCalled();
    });

    it('links shipments, teaches BC numbers and traces the bar from receipt to collection', async () => {
        const tables = db();
        const result = await service(tables).commit(
            request,
            'owner@example.com',
        );

        expect(result).toMatchObject({
            shipmentsToTrades: 1,
            shipmentsToZohoInvoices: 1,
            shippedNotCollected: 1,
            customersLinked: 1,
            customerConflicts: 1,
            unknownCustomerCodes: 0,
            itemsAdded: 1,
            eventsAdded: 2,
            trackingWithoutLedger: 1,
        });
        expect(tables.customer.data[0]).toMatchObject({
            bcCustomerNo: 'PRV02393',
        });
        expect(tables.customer.data[1]).toMatchObject({
            bcVendorNo: 'PRV77777',
        });

        const shp = tables.bcShipment.data.find(
            (s) => s['no'] === 'SHP-100149',
        )!;
        expect(shp).toMatchObject({ tradeId: 1, customerId: 1 });

        expect(tables.item.data).toHaveLength(1);
        expect(tables.item.data[0]).toMatchObject({
            serialKey: '1334834',
            productId: 7,
            status: 'COLLECTED',
            locationCode: 'DU',
        });
        expect(
            tables.itemEvent.data.map((e) => [
                e['kind'],
                e['sourceRef'],
                e['partyNo'],
                e['customerId'],
                e['tradeId'],
            ]),
        ).toEqual([
            ['RECEIVED', 'GRN-100108', 'PRV00001', 2, null],
            ['COLLECTED', 'SHP-100149', 'PRV02393', 1, 1],
        ]);
    });

    it('changes nothing when the same lists are imported again', async () => {
        const tables = db();
        await service(tables).commit(request, 'owner@example.com');
        const again = await service(tables).commit(
            request,
            'owner@example.com',
        );
        expect(again.shipments).toEqual({ added: 0, changed: 0, unchanged: 2 });
        expect(again.ledger).toEqual({ added: 0, changed: 0, unchanged: 2 });
        expect(again.eventsAdded).toBe(0);
        expect(again.eventsUnchanged).toBe(2);
        expect(again.itemsAdded).toBe(0);
        expect(again.customersLinked).toBe(0);
        expect(tables.itemEvent.data).toHaveLength(2);
    });
});
