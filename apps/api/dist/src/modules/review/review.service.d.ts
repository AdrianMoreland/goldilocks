import { type CreateSalesProductRequest, type DuplicatesResponse, type LinkDecisionRequest, type LinkDecisionResult, type MapAliasRequest, type OverAllocatedResponse, type SettleResult, type PricingProductOption, type ReviewLinksResponse, type ReviewSummary, type SalesProduct, type UnresolvedLotsResponse } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { LinkRulesService } from './link-rules.service';
export declare class ReviewService {
    private readonly prisma;
    private readonly audit;
    private readonly rules;
    constructor(prisma: PrismaService, audit: AuditLogService, rules: LinkRulesService);
    private linkQuery;
    private pageQuery;
    private notOverSold;
    summary(): Promise<ReviewSummary>;
    links(rawQuery: Record<string, unknown>): Promise<ReviewLinksResponse>;
    private describe;
    settle(actor: string): Promise<SettleResult>;
    private overAllocatedLots;
    overAllocated(rawQuery: Record<string, unknown>): Promise<OverAllocatedResponse>;
    decide(body: LinkDecisionRequest, actor: string): Promise<LinkDecisionResult>;
    private applyShipmentLinks;
    private unresolvedWhere;
    private duplicateWhere;
    unresolvedLots(rawQuery: Record<string, unknown>): Promise<UnresolvedLotsResponse>;
    duplicates(rawQuery: Record<string, unknown>): Promise<DuplicatesResponse>;
    salesProducts(): Promise<SalesProduct[]>;
    pricingProducts(): Promise<PricingProductOption[]>;
    createSalesProduct(body: CreateSalesProductRequest, actor: string): Promise<SalesProduct>;
    mapAlias(id: number, body: MapAliasRequest, actor: string): Promise<{
        id: number;
    }>;
}
//# sourceMappingURL=review.service.d.ts.map