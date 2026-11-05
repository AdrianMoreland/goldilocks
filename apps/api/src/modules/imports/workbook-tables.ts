import type { WorkbookLoadTable } from '@goldilocks/shared-types';

/** A row after validation: column name -> cleaned value (string, number, boolean, null; dates are YYYY-MM-DD text). */
export type Row = Record<string, unknown>;

export type FkKind =
    | 'customer'
    | 'vendor'
    | 'supplierInvoice'
    | 'invoice'
    | 'line';
export type FieldKind = 's' | 'sReq' | 'n' | 'i' | 'b' | 'd' | 'flag';

/** [Prisma field, workbook column, kind]. Required text (`sReq`) becomes '' when the cell is empty. */
export type FieldSpec = readonly [string, string, FieldKind];

export interface FkSpec {
    /** Prisma field that stores the id. */
    field: string;
    /** Workbook column holding the key of the parent row. */
    column: string;
    kind: FkKind;
    /** A row without its parent is skipped instead of written with a null. */
    required?: boolean;
}

export interface DirectTableSpec {
    /** Prisma delegate name on the client. */
    delegate: string;
    /** Workbook column holding the row's own key; stored as `keyField`. */
    keyColumn: string;
    keyField: 'sourceKey' | 'redactionCode';
    fields: readonly FieldSpec[];
    fks: readonly FkSpec[];
}

/** Tables that are plain upserts by key. Trades, purchase lots and links have their own handlers. */
export const DIRECT_TABLES: Partial<
    Record<WorkbookLoadTable, DirectTableSpec>
> = {
    customers: {
        delegate: 'customer',
        keyColumn: 'id',
        keyField: 'redactionCode',
        fks: [],
        fields: [
            ['name', 'name', 'sReq'],
            ['zohoNumber', 'zoho_number', 's'],
            ['status', 'zoho_status', 's'],
            ['currency', 'currency', 's'],
            ['sources', 'sources', 's'],
        ],
    },
    vendors: {
        delegate: 'vendor',
        keyColumn: 'id',
        keyField: 'redactionCode',
        fks: [],
        fields: [
            ['name', 'name', 'sReq'],
            ['zohoNumber', 'zoho_number', 's'],
            ['status', 'zoho_status', 's'],
            ['currency', 'currency', 's'],
            ['sources', 'sources', 's'],
        ],
    },
    supplier_invoices: {
        delegate: 'supplierInvoice',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [],
        fields: [
            ['supplier', 'supplier', 'sReq'],
            ['number', 'number', 'sReq'],
            ['firstDate', 'first_date', 'd'],
            ['lastDate', 'last_date', 'd'],
        ],
    },
    invoices: {
        delegate: 'zohoInvoice',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [
            { field: 'customerId', column: 'customer_code', kind: 'customer' },
        ],
        fields: [
            ['date', 'date', 'd'],
            ['status', 'status', 's'],
            ['salesOrderNumber', 'sales_order_number', 's'],
            ['total', 'total', 'n'],
            ['lineCount', 'line_count', 'i'],
        ],
    },
    invoice_lines: {
        delegate: 'zohoInvoiceLine',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [
            {
                field: 'invoiceId',
                column: 'invoice_id',
                kind: 'invoice',
                required: true,
            },
            { field: 'customerId', column: 'customer_code', kind: 'customer' },
        ],
        fields: [
            ['lineNo', 'line_no', 'i'],
            ['date', 'date', 'd'],
            ['qty', 'qty', 'n'],
            ['itemName', 'item_name', 'sReq'],
            ['productNorm', 'product_norm', 's'],
            ['unitPrice', 'unit_price', 'n'],
            ['lineTotal', 'line_total', 'n'],
            ['itemDesc', 'item_desc', 's'],
            ['collectedFlag', 'collected_flag', 'flag'],
            ['collectedDate', 'collected_date', 'd'],
            ['refinery', 'refinery_detected', 's'],
            ['deliveredBrinks', 'delivered_brinks', 'b'],
            ['soldBack', 'sold_back', 'b'],
            ['refsFound', 'refs_found', 's'],
        ],
    },
    line_serials: {
        delegate: 'lineSerial',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [
            {
                field: 'lineId',
                column: 'invoice_line_id',
                kind: 'line',
                required: true,
            },
        ],
        fields: [
            ['serial', 'serial', 'sReq'],
            ['serialNorm', 'serial_norm', 'sReq'],
            ['refinery', 'refinery', 's'],
            ['collectedFlag', 'collected_flag', 'flag'],
            ['collectedDate', 'collected_date', 'd'],
        ],
    },
    payments: {
        delegate: 'zohoPayment',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [
            { field: 'invoiceId', column: 'invoice_id', kind: 'invoice' },
            { field: 'customerId', column: 'customer_code', kind: 'customer' },
        ],
        fields: [
            ['zohoCustomerId', 'zoho_customer_id', 's'],
            ['date', 'date', 'd'],
            ['invoiceDate', 'invoice_date', 'd'],
            ['amount', 'amount', 'n'],
            ['invoiceAmount', 'invoice_amount', 'n'],
            ['mode', 'mode', 's'],
            ['reference', 'reference', 's'],
            ['type', 'type', 's'],
        ],
    },
    purchase_orders: {
        delegate: 'zohoPurchaseOrderLine',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [{ field: 'vendorId', column: 'vendor_code', kind: 'vendor' }],
        fields: [
            ['poNumber', 'po_number', 'sReq'],
            ['lineNo', 'line_no', 'i'],
            ['date', 'date', 'd'],
            ['vendorNumber', 'vendor_number', 's'],
            ['itemName', 'item_name', 'sReq'],
            ['productNorm', 'product_norm', 's'],
            ['qtyOrdered', 'qty_ordered', 'n'],
            ['qtyReceived', 'qty_received', 'n'],
            ['qtyBilled', 'qty_billed', 'n'],
            ['price', 'price', 'n'],
            ['itemTotal', 'item_total', 'n'],
            ['status', 'status', 's'],
            ['reference', 'reference', 's'],
        ],
    },
    bc_sales_orders: {
        delegate: 'bcSalesOrder',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [{ field: 'customerId', column: 'client_code', kind: 'customer' }],
        fields: [
            ['branchCode', 'branch_code', 's'],
            ['snapshot', 'snapshot', 's'],
            ['snapshotDate', 'snapshot_date', 'd'],
            ['bcCustomerNo', 'bc_customer_no', 's'],
            ['extDocNo', 'ext_doc_no', 's'],
            ['extDocCore', 'ext_doc_core', 's'],
            ['location', 'location', 's'],
            ['docDate', 'doc_date', 'd'],
            ['amount', 'amount', 'n'],
            ['amountInclVat', 'amount_incl_vat', 'n'],
            ['prepaid', 'prepaid', 'n'],
            ['remaining', 'remaining', 'n'],
            ['paid', 'paid', 'b'],
        ],
    },
    bc_tracking_entries: {
        delegate: 'bcTrackingEntry',
        keyColumn: 'id',
        keyField: 'sourceKey',
        fks: [],
        fields: [
            ['snapshot', 'snapshot', 's'],
            ['entryNo', 'entry_no', 's'],
            ['itemNo', 'item_no', 'sReq'],
            ['locationCode', 'location_code', 's'],
            ['serialNo', 'serial_no', 's'],
            ['serialNorm', 'serial_norm', 's'],
            ['lotNo', 'lot_no', 's'],
            ['remainingQuantity', 'remaining_quantity', 'n'],
            ['postingDate', 'posting_date', 'd'],
            ['documentNo', 'document_no', 's'],
            ['entryType', 'entry_type', 's'],
        ],
    },
};

/** The parent table each foreign-key kind is looked up in, and the column it is matched on. */
export const FK_LOOKUP: Record<
    FkKind,
    { delegate: string; matchField: 'redactionCode' | 'sourceKey' }
> = {
    customer: { delegate: 'customer', matchField: 'redactionCode' },
    vendor: { delegate: 'vendor', matchField: 'redactionCode' },
    supplierInvoice: { delegate: 'supplierInvoice', matchField: 'sourceKey' },
    invoice: { delegate: 'zohoInvoice', matchField: 'sourceKey' },
    line: { delegate: 'zohoInvoiceLine', matchField: 'sourceKey' },
};

function text(v: unknown): string | null {
    return typeof v === 'string' && v !== '' ? v : null;
}

/** Turns one validated workbook row into the data the table stores (without the key and without foreign keys). */
export function mapFields(
    row: Row,
    fields: readonly FieldSpec[],
): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [field, column, kind] of fields) {
        const v = row[column];
        if (kind === 'sReq') out[field] = text(v) ?? '';
        else if (kind === 'd')
            out[field] =
                typeof v === 'string' ? new Date(`${v}T00:00:00.000Z`) : null;
        else if (kind === 'i') out[field] = typeof v === 'number' ? v : null;
        // Money and quantities are stored to 4 places; round here so a re-import compares equal.
        else if (kind === 'n')
            out[field] =
                typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : null;
        else if (kind === 'b') out[field] = typeof v === 'boolean' ? v : null;
        else out[field] = text(v); // 's' and 'flag'
    }
    return out;
}

/** A value in the form it is compared in, so a Date, a Decimal and a plain number all compare by content. */
export function comparable(v: unknown): unknown {
    if (v === undefined || v === null) return null;
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (
        typeof v === 'object' &&
        v !== null &&
        'toNumber' in v &&
        typeof v.toNumber === 'function'
    ) {
        return (v as { toNumber(): number }).toNumber();
    }
    return v;
}

/** The fields of `next` that differ from `existing`. */
export function changedFields(
    existing: Row,
    next: Record<string, unknown>,
): Record<string, unknown> {
    const diff: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(next))
        if (comparable(existing[k]) !== comparable(v)) diff[k] = v;
    return diff;
}
