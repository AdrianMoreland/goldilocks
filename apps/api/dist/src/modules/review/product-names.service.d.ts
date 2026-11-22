import { type AliasUsageResponse, type ApplyPerMetalRequest, type ApplyPerMetalResult, type AliasesResponse, type NameSuggestionAcceptResult, type NameSuggestionDecisionResult, type NameSuggestionTarget, type ProductMatch, type SettleNamesResult } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
type Db = Prisma.TransactionClient | PrismaService;
export type NameScope = 'all' | {
    ids: number[];
} | {
    aliases: string[];
};
export declare const REJECTED_REASON = "suggestion turned down";
type Settled = Pick<Prisma.ProductAliasUncheckedUpdateInput, 'productId' | 'salesProductId' | 'noProduct' | 'decidedBy' | 'suggestedProductId' | 'suggestedSalesProductId' | 'suggestedNoProduct' | 'confidence' | 'reason' | 'question' | 'catalogueGap'>;
export declare function settledState(m: ProductMatch): {
    tier: 'certain' | 'likely' | 'unclear';
    state: Settled;
};
export declare class ProductNamesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    private catalogue;
    settle(scope: NameScope, opts?: {
        dryRun?: boolean;
        db?: Db;
    }): Promise<SettleNamesResult>;
    private loadEvidence;
    private write;
    settleAndRecord(scope: NameScope, actor: string, db: Db, label: string): Promise<SettleNamesResult>;
    registerNames(names: {
        alias: string;
        uses: number;
        metalHint: 'GOLD' | 'SILVER' | null;
    }[], source: string, db: Db): Promise<void>;
    rescan(dryRun: boolean, actor: string): Promise<SettleNamesResult>;
    private loadUsage;
    list(rawQuery: Record<string, unknown>): Promise<AliasesResponse>;
    private targetNames;
    private toRow;
    private hasSuggestion;
    accept(items: {
        id: number;
        expected: NameSuggestionTarget;
    }[], actor: string): Promise<NameSuggestionAcceptResult>;
    reject(ids: number[], actor: string): Promise<NameSuggestionDecisionResult>;
    usage(id: number): Promise<AliasUsageResponse>;
    applyPerMetal(id: number, body: ApplyPerMetalRequest, actor: string): Promise<ApplyPerMetalResult>;
}
export {};
//# sourceMappingURL=product-names.service.d.ts.map