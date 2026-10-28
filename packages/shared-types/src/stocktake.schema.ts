import { z } from 'zod';
import { DISCREPANCY_ISSUE_TYPES } from './stocktake';
import { BAR_STATUSES, STOCK_METALS } from './stocktake-physical';

export const StocktakeStatusEnum = z.enum(['DRAFT', 'COUNTING', 'RECONCILING', 'FINALISED']);
export type StocktakeStatus = z.infer<typeof StocktakeStatusEnum>;

export const DiscrepancyIssueTypeEnum = z.enum(DISCREPANCY_ISSUE_TYPES);
export const SerialsCheckedEnum = z.enum(['YES', 'NO', 'NA']);

const dateOnly = z.iso.date();

export const CreateStocktakeRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  /** The day stock was physically counted. */
  countDate: dateOnly,
  /** The month-end position the count is reconciled to (may differ from countDate). */
  cutoffDate: dateOnly,
  stocktakeLead: z.string().trim().max(120).optional(),
  secondChecker: z.string().trim().max(120).optional(),
});
export type CreateStocktakeRequest = z.infer<typeof CreateStocktakeRequestSchema>;

export const UpdateStocktakeRequestSchema = z.object({
  status: StocktakeStatusEnum.optional(),
  stocktakeLead: z.string().trim().max(120).nullable().optional(),
  secondChecker: z.string().trim().max(120).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});
export type UpdateStocktakeRequest = z.infer<typeof UpdateStocktakeRequestSchema>;

/** The raw text pasted from Excel. Parsed on the server so the rules live in one place. */
export const ImportJournalRequestSchema = z.object({
  text: z.string().min(1).max(2_000_000),
});
export type ImportJournalRequest = z.infer<typeof ImportJournalRequestSchema>;

const count = z.number().int().min(0).max(1_000_000);

export const UpdateStocktakeLineRequestSchema = z.object({
  countedNormal: count.nullable().optional(),
  countedCustomer: count.nullable().optional(),
  counted: z.boolean().optional(),
  reason: z.string().max(1000).nullable().optional(),
  serialsChecked: SerialsCheckedEnum.nullable().optional(),
  serialNote: z.string().max(2000).nullable().optional(),
});
export type UpdateStocktakeLineRequest = z.infer<typeof UpdateStocktakeLineRequestSchema>;

export const StocktakeLineSchema = z.object({
  id: z.number(),
  itemNo: z.string(),
  description: z.string(),
  locationCode: z.string(),
  qtyCalculated: z.number(),
  countedNormal: z.number().nullable(),
  countedCustomer: z.number().nullable(),
  counted: z.boolean(),
  /** Qty. (Calculated) minus the counts; null until the line is counted. */
  variance: z.number().nullable(),
  reason: z.string().nullable(),
  serialsChecked: SerialsCheckedEnum.nullable(),
  serialNote: z.string().nullable(),
  batchName: z.string().nullable(),
  documentNo: z.string().nullable(),
  entryType: z.string().nullable(),
  unitAmount: z.number().nullable(),
  unitCost: z.number().nullable(),
});
export type StocktakeLine = z.infer<typeof StocktakeLineSchema>;

export const CreateDiscrepancyRequestSchema = z.object({
  itemNo: z.string().trim().max(40).nullable().optional(),
  description: z.string().trim().min(1).max(300),
  issueType: DiscrepancyIssueTypeEnum,
  bcShows: z.string().trim().max(500).default(''),
  physicalFound: z.string().trim().max(500).default(''),
  serialNo: z.string().trim().max(80).nullable().optional(),
  action: z.string().trim().max(2000).default(''),
});
export type CreateDiscrepancyRequest = z.infer<typeof CreateDiscrepancyRequestSchema>;

/** Explaining a difference never closes it: `resolved` is set on its own. */
export const UpdateDiscrepancyRequestSchema = z.object({
  bcShows: z.string().trim().max(500).optional(),
  physicalFound: z.string().trim().max(500).optional(),
  serialNo: z.string().trim().max(80).nullable().optional(),
  action: z.string().trim().max(2000).optional(),
  resolved: z.boolean().optional(),
});
export type UpdateDiscrepancyRequest = z.infer<typeof UpdateDiscrepancyRequestSchema>;

export const DiscrepancySchema = z.object({
  id: z.number(),
  itemNo: z.string().nullable(),
  description: z.string(),
  issueType: DiscrepancyIssueTypeEnum,
  bcShows: z.string(),
  physicalFound: z.string(),
  serialNo: z.string().nullable(),
  action: z.string(),
  resolved: z.boolean(),
  createdBy: z.string(),
});
export type Discrepancy = z.infer<typeof DiscrepancySchema>;

export const StocktakeSchema = z.object({
  id: z.number(),
  name: z.string(),
  countDate: dateOnly,
  cutoffDate: dateOnly,
  status: StocktakeStatusEnum,
  stocktakeLead: z.string().nullable(),
  secondChecker: z.string().nullable(),
  notes: z.string().nullable(),
  createdBy: z.string(),
  finalisedBy: z.string().nullable(),
  finalisedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});
export type Stocktake = z.infer<typeof StocktakeSchema>;

export const StocktakeDetailSchema = StocktakeSchema.extend({
  lines: z.array(StocktakeLineSchema),
  discrepancies: z.array(DiscrepancySchema),
});
export type StocktakeDetail = z.infer<typeof StocktakeDetailSchema>;

export const ImportJournalResultSchema = z.object({
  added: z.number(),
  /** Already present for this stocktake: left untouched so an import can be repeated safely. */
  skippedExisting: z.number(),
  issues: z.array(z.object({ row: z.number(), message: z.string() })),
});
export type ImportJournalResult = z.infer<typeof ImportJournalResultSchema>;

// --- BC item codes -----------------------------------------------------------

/** Several BC items (one per refinery) point at the same Goldilocks product. */
export const BcItemSchema = z.object({
  itemNo: z.string(),
  description: z.string(),
  productId: z.number().nullable(),
  productName: z.string().nullable(),
  /** Weight-based hints for the person confirming the link. Never applied automatically. */
  suggestedProductIds: z.array(z.number()),
});
export type BcItem = z.infer<typeof BcItemSchema>;

export const LinkBcItemRequestSchema = z.object({
  productId: z.number().int().positive().nullable(),
});
export type LinkBcItemRequest = z.infer<typeof LinkBcItemRequestSchema>;

export const BcItemProductOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  /** Shown beside the name: several products share a name across metals (1oz Britannia in gold and silver). */
  metalType: z.enum(['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']),
  category: z.enum(['BAR', 'COIN']).nullable(),
});

export const BcItemsResponseSchema = z.object({
  items: z.array(BcItemSchema),
  /** The products an item can be linked to (managers cannot read the admin product list). */
  products: z.array(BcItemProductOptionSchema),
});
export type BcItemsResponse = z.infer<typeof BcItemsResponseSchema>;

// --- Physical register: individual bars and coin counts ------------------------

export const StockMetalEnum = z.enum(STOCK_METALS);
export const BarStatusEnum = z.enum(BAR_STATUSES);

export const StocktakeBarSchema = z.object({
  id: z.number(),
  metal: StockMetalEnum,
  locationCode: z.string(),
  weightLabel: z.string(),
  refinery: z.string().nullable(),
  serial: z.string().nullable(),
  grams: z.number().nullable(),
  details: z.string().nullable(),
  status: BarStatusEnum,
  /** The bar row in the earlier stocktake this one was carried from; null for bars found or pasted in. */
  carriedFromId: z.number().nullable(),
  /** Another live bar in this stocktake has the same serial. */
  duplicateSerial: z.boolean(),
});
export type StocktakeBar = z.infer<typeof StocktakeBarSchema>;

export const AddBarRequestSchema = z.object({
  metal: StockMetalEnum,
  locationCode: z.string().trim().min(1).max(20),
  weightLabel: z.string().trim().min(1).max(80),
  refinery: z.string().trim().max(80).nullable().optional(),
  serial: z.string().trim().max(80).nullable().optional(),
  grams: z.number().positive().max(100000).nullable().optional(),
  details: z.string().trim().max(500).nullable().optional(),
});
export type AddBarRequest = z.infer<typeof AddBarRequestSchema>;

export const UpdateBarRequestSchema = z.object({
  status: BarStatusEnum.optional(),
  weightLabel: z.string().trim().min(1).max(80).optional(),
  refinery: z.string().trim().max(80).nullable().optional(),
  serial: z.string().trim().max(80).nullable().optional(),
  grams: z.number().positive().max(100000).nullable().optional(),
  details: z.string().trim().max(500).nullable().optional(),
});
export type UpdateBarRequest = z.infer<typeof UpdateBarRequestSchema>;

export const ImportPhysicalRequestSchema = z.object({
  metal: StockMetalEnum,
  text: z.string().min(1).max(2_000_000),
});
export type ImportPhysicalRequest = z.infer<typeof ImportPhysicalRequestSchema>;

export const ImportPhysicalResultSchema = z.object({
  added: z.number(),
  skipped: z.number(),
  issues: z.array(z.object({ row: z.number(), message: z.string() })),
});
export type ImportPhysicalResult = z.infer<typeof ImportPhysicalResultSchema>;

export const StocktakeCoinSchema = z.object({
  id: z.number(),
  metal: StockMetalEnum,
  locationCode: z.string(),
  item: z.string(),
  /** Last stocktake's counted quantity, for reference only. */
  previousQty: z.number().nullable(),
  countedQty: z.number().nullable(),
  details: z.string().nullable(),
});
export type StocktakeCoin = z.infer<typeof StocktakeCoinSchema>;

export const AddCoinRequestSchema = z.object({
  metal: StockMetalEnum,
  locationCode: z.string().trim().max(20).default(''),
  item: z.string().trim().min(1).max(120),
});
export type AddCoinRequest = z.infer<typeof AddCoinRequestSchema>;

export const UpdateCoinRequestSchema = z.object({
  countedQty: z.number().int().min(0).max(10_000_000).nullable().optional(),
  details: z.string().trim().max(500).nullable().optional(),
});
export type UpdateCoinRequest = z.infer<typeof UpdateCoinRequestSchema>;

export const PhysicalRegisterSchema = z.object({
  bars: z.array(StocktakeBarSchema),
  coins: z.array(StocktakeCoinSchema),
});
export type PhysicalRegister = z.infer<typeof PhysicalRegisterSchema>;

export const CarryForwardRequestSchema = z.object({
  /** Defaults to the most recent finalised stocktake. */
  fromStocktakeId: z.number().int().positive().optional(),
});
export type CarryForwardRequest = z.infer<typeof CarryForwardRequestSchema>;

export const CarryForwardResultSchema = z.object({
  fromStocktakeId: z.number(),
  fromName: z.string(),
  barsCarried: z.number(),
  barsAlreadyThere: z.number(),
  coinsCarried: z.number(),
  coinsAlreadyThere: z.number(),
});
export type CarryForwardResult = z.infer<typeof CarryForwardResultSchema>;
