import type { Prisma } from '../../../prisma/generated/client';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
type Db = Prisma.TransactionClient | PrismaService;
export declare const SHIPMENT_LINK: {
    readonly linkType: "bc_trade";
    readonly fromTable: "bc_shipments";
    readonly toTable: "trades";
};
export declare function tradeLinkKey(t: {
    id: number;
    sourceKey: string | null;
}): string;
export declare function tradeIdOfKey(db: Db, key: string): Promise<number | null>;
export declare function amountAgrees(receipt: number | null, bcAmount: number): boolean;
export declare function amountExact(receipt: number | null, bcAmount: number): boolean;
export interface ShipmentLine {
    shipmentNo: string;
    itemNo: string;
    customerId: number;
    postedOn: Date;
    productId: number | null;
    qty: number;
    amount: number;
}
export interface SaleCandidate {
    id: number;
    sourceKey: string | null;
    customerId: number | null;
    client: string;
    date: Date | null;
    productId: number | null;
    qty: number | null;
    receipt: number | null;
}
export type LineDecision = {
    outcome: 'LINK';
    trade: SaleCandidate;
} | {
    outcome: 'SUGGEST';
    trades: SaleCandidate[];
    note: string;
} | {
    outcome: 'NONE';
    reason: string;
};
export declare function decideLine(line: ShipmentLine, candidates: readonly SaleCandidate[], customerName: string | null, taken: ReadonlySet<number>): LineDecision;
export interface MatchCounts {
    linked: number;
    suggested: number;
    unmatched: number;
}
export declare function matchShipments(db: Db, dry: boolean): Promise<MatchCounts>;
export declare function applyShipmentLink(db: Db, fromKey: string, tradeId: number): Promise<void>;
export {};
//# sourceMappingURL=shipment-matcher.d.ts.map