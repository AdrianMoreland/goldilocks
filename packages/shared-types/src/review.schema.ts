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
  /** Purchase lines that more was sold from than was bought. */
  overAllocated: z.number().int(),
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
  /** Why the rules did not settle this one themselves; null when they have no view on this link type. */
  why: z.string().nullable(),
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

/** What a product name is suggested to become (or, for a settled name, what it was settled to). */
export const AliasTargetSchema = z.object({
  kind: z.enum(['PRICING', 'SPECIFIC', 'NOT_A_PRODUCT']),
  id: z.number().int().nullable(),
  name: z.string(),
});
export type AliasTarget = z.infer<typeof AliasTargetSchema>;

/** Where a product name is used. */
export const ALIAS_USAGE_SOURCES = ['SALES', 'PURCHASES', 'ZOHO', 'CUSTOMER_SAFE'] as const;
export const AliasUsageSourceSchema = z.enum(ALIAS_USAGE_SOURCES);
export type AliasUsageSource = z.infer<typeof AliasUsageSourceSchema>;
export const AliasUsageMetalSchema = z.enum(['GOLD', 'SILVER', 'PGM']);
export type AliasUsageMetal = z.infer<typeof AliasUsageMetalSchema>;

/** How many rows of one source (and tab metal, where the source has one) carry a name. */
export const AliasSeenInSchema = z.object({
  source: AliasUsageSourceSchema,
  metal: AliasUsageMetalSchema.nullable(),
  count: z.number().int(),
});
export type AliasSeenIn = z.infer<typeof AliasSeenInSchema>;

export const AliasRowSchema = z.object({
  id: z.number().int(),
  alias: z.string(),
  uses: z.number().int(),
  refinery: z.string().nullable(),
  sources: z.string().nullable(),
  confidence: z.enum(['CERTAIN', 'LIKELY', 'UNCLEAR']).nullable(),
  reason: z.string().nullable(),
  /** For a LIKELY suggestion: what to ask, e.g. "South African Krugerrand: match to 1oz Krugerrand?". */
  question: z.string().nullable(),
  /** The name needs a catalogue row that is not there yet. */
  catalogueGap: z.boolean(),
  /** RULE or PERSON once settled; null while it waits. */
  decidedBy: z.enum(['RULE', 'PERSON']).nullable(),
  /** The suggestion for a name that waits. */
  suggestion: AliasTargetSchema.nullable(),
  /** What a settled name was settled to. */
  settledTo: AliasTargetSchema.nullable(),
  /** Where the name is used, per source and tab metal. */
  seenIn: z.array(AliasSeenInSchema),
  /**
   * Set when the sales and purchases carrying the name span more than one metal and some still have no product:
   * one entry per metal seen, with the rows still unresolved. Null otherwise.
   */
  perMetal: z.array(z.object({ metal: AliasUsageMetalSchema, unresolved: z.number().int() })).nullable(),
});
export type AliasRow = z.infer<typeof AliasRowSchema>;

/** Names in each state. "Settled" counts names settled by rule only; a person's own decisions are not queue items. */
export const AliasCountsSchema = z.object({
  settledByRule: z.number().int(),
  /** Names every sale and purchase row of which already has its product from its own sheet. */
  settledPerRow: z.number().int(),
  toConfirm: z.number().int(),
  toDecide: z.number().int(),
});
export type AliasCounts = z.infer<typeof AliasCountsSchema>;

export const ALIAS_VIEWS = ['open', 'confirm', 'decide', 'settled', 'per-row'] as const;
export const AliasesQuerySchema = z.object({
  /** open = to confirm and to decide; confirm = LIKELY suggestions; decide = UNCLEAR; settled = settled by rule; per-row = every row has its product from its sheet. */
  view: z.enum(ALIAS_VIEWS).default('open'),
  limit: z.coerce.number().int().min(1).max(1000).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type AliasesQuery = z.infer<typeof AliasesQuerySchema>;

export const AliasesResponseSchema = z.object({
  total: z.number().int(),
  counts: AliasCountsSchema,
  rows: z.array(AliasRowSchema),
});
export type AliasesResponse = z.infer<typeof AliasesResponseSchema>;

/** One example row of where a name is used. Never carries a customer or vendor name or code. */
export const AliasUsageExampleSchema = z.object({
  source: AliasUsageSourceSchema,
  metal: AliasUsageMetalSchema.nullable(),
  /** The sheet tab, e.g. "IE - Gold"; null for a source without one. */
  sheet: z.string().nullable(),
  date: z.string().nullable(),
  qty: z.number().nullable(),
  /** Price per item. */
  unitPrice: z.number().nullable(),
  /** The product the row resolved to, if any. */
  resolvedTo: z.string().nullable(),
});
export type AliasUsageExample = z.infer<typeof AliasUsageExampleSchema>;
export const AliasUsageResponseSchema = z.object({ rows: z.array(AliasUsageExampleSchema) });
export type AliasUsageResponse = z.infer<typeof AliasUsageResponseSchema>;

/** A product for the unresolved rows of one metal: exactly one of a pricing product or a specific product. */
export const PerMetalChoiceSchema = z
  .object({
    metal: AliasUsageMetalSchema,
    productId: z.number().int().positive().optional(),
    salesProductId: z.number().int().positive().optional(),
  })
  .refine((c) => [c.productId, c.salesProductId].filter((v) => v !== undefined).length === 1, {
    message: 'Give exactly one of productId or salesProductId.',
  });
export type PerMetalChoice = z.infer<typeof PerMetalChoiceSchema>;

export const ApplyPerMetalRequestSchema = z
  .object({ choices: z.array(PerMetalChoiceSchema).min(1).max(3) })
  .refine((v) => new Set(v.choices.map((c) => c.metal)).size === v.choices.length, { message: 'One choice per metal.' });
export type ApplyPerMetalRequest = z.infer<typeof ApplyPerMetalRequestSchema>;

export const ApplyPerMetalResultSchema = z.object({ trades: z.number().int(), lots: z.number().int() });
export type ApplyPerMetalResult = z.infer<typeof ApplyPerMetalResultSchema>;

/** Rescan: re-run the matching rules over every name a person has not decided. dryRun counts and writes nothing. */
export const SettleNamesRequestSchema = z.object({ dryRun: z.boolean().default(false) });
export type SettleNamesRequest = z.infer<typeof SettleNamesRequestSchema>;

export const SettleNamesResultSchema = z.object({
  dryRun: z.boolean(),
  /** Names the rules now settle (applied, unless dryRun). */
  certain: z.number().int(),
  /** Names with a suggestion to confirm. */
  likely: z.number().int(),
  /** Names a person has to decide. */
  unclear: z.number().int(),
  /** Names whose stored state the scan left as it was. */
  unchanged: z.number().int(),
});
export type SettleNamesResult = z.infer<typeof SettleNamesResultSchema>;

/** Turn down the engine's suggestions for these names. */
export const NameSuggestionDecisionRequestSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(5000),
});
export type NameSuggestionDecisionRequest = z.infer<typeof NameSuggestionDecisionRequestSchema>;

export const NameSuggestionDecisionResultSchema = z.object({
  /** Names changed by this call. */
  done: z.number().int(),
  /** Names skipped: gone, already decided by a person, or with no suggestion to act on. */
  skipped: z.number().int(),
});
export type NameSuggestionDecisionResult = z.infer<typeof NameSuggestionDecisionResultSchema>;

/** The suggestion the person saw: exactly one of a pricing product, a specific product, or "not a product". */
export const NameSuggestionTargetSchema = z
  .object({
    productId: z.number().int().positive().optional(),
    salesProductId: z.number().int().positive().optional(),
    noProduct: z.literal(true).optional(),
  })
  .refine((t) => [t.productId, t.salesProductId, t.noProduct].filter((v) => v !== undefined).length === 1, {
    message: 'Give exactly one of productId, salesProductId, noProduct.',
  });
export type NameSuggestionTarget = z.infer<typeof NameSuggestionTargetSchema>;

/**
 * Accept suggestions. Each item says which suggestion the person saw (`expected`); the server accepts a name only
 * if its stored suggestion still equals it, so a rescan between the screen and the click cannot change what is tied.
 */
export const NameSuggestionAcceptRequestSchema = z.object({
  items: z.array(z.object({ id: z.number().int().positive(), expected: NameSuggestionTargetSchema })).min(1).max(5000),
});
export type NameSuggestionAcceptRequest = z.infer<typeof NameSuggestionAcceptRequestSchema>;

export const NameSuggestionAcceptResultSchema = z.object({
  accepted: z.number().int(),
  /** Gone, already decided, or the suggestion changed since the person saw it. */
  skipped: z.number().int(),
});
export type NameSuggestionAcceptResult = z.infer<typeof NameSuggestionAcceptResultSchema>;

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

/** Specific products made from the Business Central item list. */
export const BcSalesProductActionSchema = z.enum(['CREATE', 'LINKED', 'SKIP']);
export type BcSalesProductAction = z.infer<typeof BcSalesProductActionSchema>;

export const BcSalesProductRowSchema = z.object({
  itemNo: z.string(),
  description: z.string(),
  action: BcSalesProductActionSchema,
  reason: z.string().optional(),
  name: z.string(),
  /** Null only when nothing says what metal the item is (such a row is skipped). */
  metal: z.enum(['GOLD', 'SILVER', 'PGM']).nullable(),
  refinery: z.string().nullable(),
  genericNorm: z.string(),
  pricingProductId: z.number().int().nullable(),
  pricingProductName: z.string().nullable(),
  suggestedSku: z.string().optional(),
});
export type BcSalesProductRow = z.infer<typeof BcSalesProductRowSchema>;

export const BcSalesProductsPreviewSchema = z.object({
  rows: z.array(BcSalesProductRowSchema),
  totals: z.object({ create: z.number().int(), linked: z.number().int(), skip: z.number().int(), total: z.number().int() }),
});
export type BcSalesProductsPreview = z.infer<typeof BcSalesProductsPreviewSchema>;

/** Empty or missing `itemNos` = every row that is ready to create. */
export const BcSalesProductsApplyRequestSchema = z.object({
  itemNos: z.array(z.string().trim().min(1).max(40)).max(5000).optional(),
});
export type BcSalesProductsApplyRequest = z.infer<typeof BcSalesProductsApplyRequestSchema>;

export const BcSalesProductsApplyResultSchema = z.object({
  /** New specific products. */
  created: z.number().int(),
  /** Items linked to a specific product that already had the same name. */
  linked: z.number().int(),
  /** Selected items that are not ready (see the preview's reasons). */
  skipped: z.number().int(),
});
export type BcSalesProductsApplyResult = z.infer<typeof BcSalesProductsApplyResultSchema>;

/** A name is tied to exactly one of: a specific sales product, a pricing product, or marked not a product. */
export const MapAliasRequestSchema = z
  .object({
    salesProductId: z.number().int().positive().optional(),
    productId: z.number().int().positive().optional(),
    noProduct: z.literal(true).optional(),
  })
  .refine(
    (v) => [v.salesProductId, v.productId, v.noProduct].filter((x) => x !== undefined).length === 1,
    { message: 'Choose exactly one of salesProductId, productId or noProduct.' },
  );
export type MapAliasRequest = z.infer<typeof MapAliasRequestSchema>;

export const ReviewPageQuerySchema = ReviewLinksQuerySchema.omit({ type: true });
export type ReviewPageQuery = z.infer<typeof ReviewPageQuerySchema>;

export const PricingProductOptionSchema = z.object({ id: z.number().int(), name: z.string(), metalType: z.string() });
export type PricingProductOption = z.infer<typeof PricingProductOptionSchema>;
export const PricingProductOptionListSchema = z.array(PricingProductOptionSchema);

export const SettleResultSchema = z.object({
  /** Pending links the rules confirmed because they make sense. */
  confirmed: z.number().int(),
  /** Pending links left for a person: the product or quantity does not fit. */
  asked: z.number().int(),
  /** Pending links left because their purchase line has more sold than bought. */
  overAllocated: z.number().int(),
  /** Quotes the sheet still lists, now invoiced because a Zoho invoice line matches. */
  quotesInvoiced: z.number().int(),
});
export type SettleResult = z.infer<typeof SettleResultSchema>;

export const OverAllocatedLotSchema = z.object({
  lotId: z.number().int(),
  reference: z.string(),
  productText: z.string(),
  received: z.string().nullable(),
  bought: z.number().int(),
  sold: z.number().int(),
  /** The sales that name this purchase line, newest first, at most 20. */
  sales: z.array(z.object({ tradeId: z.number().int(), reference: z.string(), date: z.string().nullable(), qty: z.number().int().nullable() })),
});
export type OverAllocatedLot = z.infer<typeof OverAllocatedLotSchema>;
export const OverAllocatedResponseSchema = z.object({ total: z.number().int(), rows: z.array(OverAllocatedLotSchema) });
export type OverAllocatedResponse = z.infer<typeof OverAllocatedResponseSchema>;
