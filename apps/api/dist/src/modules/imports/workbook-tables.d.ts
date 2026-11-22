import { type WorkbookLoadTable } from '@goldilocks/shared-types';
export type Row = Record<string, unknown>;
export type FkKind = 'customer' | 'vendor' | 'supplierInvoice' | 'invoice' | 'line';
export type FieldKind = 's' | 'sReq' | 'n' | 'i' | 'iReq' | 'b' | 'd' | 'flag' | 'metal' | 'json';
export type FieldSpec = readonly [string, string, FieldKind];
export interface FkSpec {
    field: string;
    column: string;
    kind: FkKind;
    required?: boolean;
}
export interface DirectTableSpec {
    delegate: string;
    keyColumn: string;
    keyField: 'sourceKey' | 'redactionCode' | 'itemNo' | 'alias';
    fields: readonly FieldSpec[];
    fks: readonly FkSpec[];
    tracked?: false;
    stocktakeSnapshotColumn?: string;
    newerWins?: string;
    createOnly?: readonly string[];
    derive?: (data: Record<string, unknown>, row: Row, key: string) => void;
    keyOf?: (row: Row) => string | null;
}
export declare const DIRECT_TABLES: Partial<Record<WorkbookLoadTable, DirectTableSpec>>;
export declare function workbookAliasKey(row: Row): string | null;
export declare const FK_LOOKUP: Record<FkKind, {
    delegate: string;
    matchField: 'redactionCode' | 'sourceKey';
}>;
export declare function mapFields(row: Row, fields: readonly FieldSpec[]): Record<string, unknown>;
export declare function comparable(v: unknown): unknown;
export declare function changedFields(existing: Row, next: Record<string, unknown>): Record<string, unknown>;
//# sourceMappingURL=workbook-tables.d.ts.map