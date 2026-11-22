import type { AliasesResponse, AliasUsageResponse, ApplyPerMetalResult, BcSalesProductsApplyResult, BcSalesProductsPreview, DuplicatesResponse, LinkDecisionResult, NameSuggestionAcceptResult, NameSuggestionDecisionResult, RelinkResult, SettleNamesResult, OverAllocatedResponse, PricingProductOption, ReviewLinksResponse, ReviewSummary, SalesProduct, SettleResult, UnresolvedLotsResponse } from '@goldilocks/shared-types';
import { ReviewService } from './review.service';
import { BcSalesProductsService } from './bc-sales-products.service';
import { ProductNamesService } from './product-names.service';
import { ProductRelinkService } from './product-relink.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { ApplyPerMetalRequestDto, BcSalesProductsApplyRequestDto, CreateSalesProductRequestDto, LinkDecisionRequestDto, MapAliasRequestDto, NameSuggestionAcceptRequestDto, NameSuggestionDecisionRequestDto, RelinkRequestDto, SettleNamesRequestDto } from '../../common/dto/dtos';
export declare class ReviewController {
    private readonly review;
    private readonly bcProducts;
    private readonly names;
    private readonly relinkRows;
    constructor(review: ReviewService, bcProducts: BcSalesProductsService, names: ProductNamesService, relinkRows: ProductRelinkService);
    summary(): Promise<ReviewSummary>;
    links(query: Record<string, string>): Promise<ReviewLinksResponse>;
    decide(body: LinkDecisionRequestDto, req: RequestWithUser): Promise<LinkDecisionResult>;
    settle(req: RequestWithUser): Promise<SettleResult>;
    overAllocated(query: Record<string, string>): Promise<OverAllocatedResponse>;
    unresolvedLots(query: Record<string, string>): Promise<UnresolvedLotsResponse>;
    duplicates(query: Record<string, string>): Promise<DuplicatesResponse>;
    aliases(query: Record<string, string>): Promise<AliasesResponse>;
    aliasUsage(id: number): Promise<AliasUsageResponse>;
    applyPerMetal(id: number, body: ApplyPerMetalRequestDto, req: RequestWithUser): Promise<ApplyPerMetalResult>;
    settleNames(body: SettleNamesRequestDto, req: RequestWithUser): Promise<SettleNamesResult>;
    relink(body: RelinkRequestDto, req: RequestWithUser): Promise<RelinkResult>;
    acceptNames(body: NameSuggestionAcceptRequestDto, req: RequestWithUser): Promise<NameSuggestionAcceptResult>;
    rejectNames(body: NameSuggestionDecisionRequestDto, req: RequestWithUser): Promise<NameSuggestionDecisionResult>;
    salesProducts(): Promise<SalesProduct[]>;
    pricingProducts(): Promise<PricingProductOption[]>;
    createSalesProduct(body: CreateSalesProductRequestDto, req: RequestWithUser): Promise<SalesProduct>;
    bcSalesProductsPreview(): Promise<BcSalesProductsPreview>;
    bcSalesProductsApply(body: BcSalesProductsApplyRequestDto, req: RequestWithUser): Promise<BcSalesProductsApplyResult>;
    mapAlias(id: number, body: MapAliasRequestDto, req: RequestWithUser): Promise<{
        id: number;
    }>;
}
//# sourceMappingURL=review.controller.d.ts.map