import { z } from 'zod';
import { LINK_TYPES } from './import-workbook.schema';

/**
 * Review queues: what the import could not settle by itself. Admins decide here. Nothing in these queues changes a
 * trade, lot or invoice; a decision is recorded on the link or alias and consumers read it from there.
 */

export const ReviewLinkTypeSchema = z.enum(LINK_TYPES);

export const ReviewSummarySchema = z.object({
  /** Pending links per link type. */
  links: z.record(z.string(), z.number().int()),
  /** Sales whose CPTY names a purchase line that is not loaded. */
  unresolvedLots: z.number().int(),
  /** Trades that repeat an earlier reference. */
  duplicates: z.number().int(),
  /** Product texts not yet tied to a specific sales product. */
  aliases: z.number().int(),
});
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;

const EndSchema = z.object({
  table: z.string(),
  /** One line a person can recognise, e.g. "DU-G20260941 - 2 x 1oz Krugerrand". */
  label: z.string(),
  detail: z.string().nullable(),
});

export const ReviewLinkRowSchema = z.object({
  id: z.number().int(),
  linkType: z.string(),
  confidence: z.enum(['EXACT', 'PROBABLE']),
  method: z.string(),
  note: z.string().nullable(),
  from: EndSchema,
  to: EndSchema,
});
export type ReviewLinkRow = z.infer<typeof ReviewLinkRowSchema>;

export const ReviewLinksResponseSchema = z.object({
  total: z.number().int(),
  rows: z.array(ReviewLinkRowSchema),
});
export type ReviewLinksResponse = z.infer<typeof ReviewLinksResponseSchema>;

export const ReviewLinksQuerySchema = z.object({
  type: ReviewLinkTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ReviewLinksQuery = z.infer<typeof ReviewLinksQuerySchema>;

export const LinkDecisionSchema = z.enum(['CONFIRMED', 'REJECTED']);

export const LinkDecisionRequestSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(200),
  decision: LinkDecisionSchema,
});
export type LinkDecisionRequest = z.infer<typeof LinkDecisionRequestSchema>;

export const LinkDecisionResultSchema = z.object({ updated: z.number().int() });
export type LinkDecisionResult = z.infer<typeof LinkDecisionResultSchema>;

export const UnresolvedLotRowSchema = z.object({
  tradeId: z.number().int(),
  reference: z.string(),
  date: z.string().nullable(),
  qty: z.number().nullable(),
  productText: z.string(),
  lotKey: z.string(),
  branchCode: z.string().nullable(),
});
export type UnresolvedLotRow = z.infer<typeof UnresolvedLotRowSchema>;
export const UnresolvedLotsResponseSchema = z.object({ total: z.number().int(), rows: z.array(UnresolvedLotRowSchema) });
export type UnresolvedLotsResponse = z.infer<typeof UnresolvedLotsResponseSchema>;

export const DuplicateRowSchema = z.object({
  tradeId: z.number().int(),
  reference: z.string(),
  occurrence: z.number().int(),
  date: z.string().nullable(),
  qty: z.number().nullable(),
  productText: z.string(),
  branchCode: z.string().nullable(),
});
export type DuplicateRow = z.infer<typeof DuplicateRowSchema>;
export const DuplicatesResponseSchema = z.object({ total: z.number().int(), rows: z.array(DuplicateRowSchema) });
export type DuplicatesResponse = z.infer<typeof DuplicatesResponseSchema>;

export const AliasRowSchema = z.object({
  id: z.number().int(),
  alias: z.string(),
  uses: z.number().int(),
  refinery: z.string().nullable(),
});
export type AliasRow = z.infer<typeof AliasRowSchema>;
export const AliasesResponseSchema = z.object({ total: z.number().int(), rows: z.array(AliasRowSchema) });
export type AliasesResponse = z.infer<typeof AliasesResponseSchema>;

export const SalesProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  metal: z.enum(['GOLD', 'SILVER', 'PGM']),
  genericNorm: z.string(),
  refinery: z.string().nullable(),
  pricingProductId: z.number().int().nullable(),
  pricingProductName: z.string().nullable(),
});
export type SalesProduct = z.infer<typeof SalesProductSchema>;
export const SalesProductListSchema = z.array(SalesProductSchema);

export const CreateSalesProductRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  metal: z.enum(['GOLD', 'SILVER', 'PGM']),
  genericNorm: z.string().trim().min(1).max(120),
  refinery: z.string().trim().max(80).nullish(),
  pricingProductId: z.number().int().positive().nullish(),
});
export type CreateSalesProductRequest = z.infer<typeof CreateSalesProductRequestSchema>;

export const MapAliasRequestSchema = z.object({ salesProductId: z.number().int().positive() });
export type MapAliasRequest = z.infer<typeof MapAliasRequestSchema>;

export const ReviewPageQuerySchema = ReviewLinksQuerySchema.omit({ type: true });
export type ReviewPageQuery = z.infer<typeof ReviewPageQuerySchema>;

export const PricingProductOptionSchema = z.object({ id: z.number().int(), name: z.string(), metalType: z.string() });
export type PricingProductOption = z.infer<typeof PricingProductOptionSchema>;
export const PricingProductOptionListSchema = z.array(PricingProductOptionSchema);
