"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AI_MESSAGE_MAX_LENGTH: () => AI_MESSAGE_MAX_LENGTH,
  AI_QUESTION_MAX_LENGTH: () => AI_QUESTION_MAX_LENGTH,
  AdminLogEntrySchema: () => AdminLogEntrySchema,
  AdminLogsResponseSchema: () => AdminLogsResponseSchema,
  AdminOverviewSchema: () => AdminOverviewSchema,
  AiAnswerStatusEnum: () => AiAnswerStatusEnum,
  AiCitationSchema: () => AiCitationSchema,
  AiModeEnum: () => AiModeEnum,
  AiStatusSchema: () => AiStatusSchema,
  AiUsageSchema: () => AiUsageSchema,
  ApiCatalogueSchema: () => ApiCatalogueSchema,
  ApiEndpointParameterSchema: () => ApiEndpointParameterSchema,
  ApiEndpointSchema: () => ApiEndpointSchema,
  ApiErrorResponseSchema: () => ApiErrorResponseSchema,
  ApiSuccessResponseSchema: () => ApiSuccessResponseSchema,
  AskRequestSchema: () => AskRequestSchema,
  AskResponseSchema: () => AskResponseSchema,
  AskStreamEventSchema: () => AskStreamEventSchema,
  AuditEntrySchema: () => AuditEntrySchema,
  AuditLogResponseSchema: () => AuditLogResponseSchema,
  AuthResponseSchema: () => AuthResponseSchema,
  BranchSchema: () => BranchSchema,
  ChangePasswordSchema: () => ChangePasswordSchema,
  ClientErrorReportBatchSchema: () => ClientErrorReportBatchSchema,
  ClientErrorReportSchema: () => ClientErrorReportSchema,
  CreateBranchRequestSchema: () => CreateBranchRequestSchema,
  CreateProductDtoSchema: () => CreateProductDtoSchema,
  CreateSpotPriceDtoSchema: () => CreateSpotPriceDtoSchema,
  CreateUserRequestSchema: () => CreateUserRequestSchema,
  CurrencyEnum: () => CurrencyEnum,
  DbColumnSchema: () => DbColumnSchema,
  DbDeleteRequestSchema: () => DbDeleteRequestSchema,
  DbInsertRequestSchema: () => DbInsertRequestSchema,
  DbRowResponseSchema: () => DbRowResponseSchema,
  DbRowsResponseSchema: () => DbRowsResponseSchema,
  DbTableSummarySchema: () => DbTableSummarySchema,
  DbTablesResponseSchema: () => DbTablesResponseSchema,
  DbUpdateRequestSchema: () => DbUpdateRequestSchema,
  ErrorLogEntrySchema: () => ErrorLogEntrySchema,
  ErrorLogKindEnum: () => ErrorLogKindEnum,
  ErrorLogSeverityEnum: () => ErrorLogSeverityEnum,
  ErrorLogSourceEnum: () => ErrorLogSourceEnum,
  FetchAttemptSchema: () => FetchAttemptSchema,
  FetchMetricsSchema: () => FetchMetricsSchema,
  FetchSourceEnum: () => FetchSourceEnum,
  FetchTriggerEnum: () => FetchTriggerEnum,
  GRAMS_PER_TROY_OUNCE: () => GRAMS_PER_TROY_OUNCE,
  HealthCheckSchema: () => HealthCheckSchema,
  HealthItemSchema: () => HealthItemSchema,
  HealthStatusEnum: () => HealthStatusEnum,
  HistoricCloseQuerySchema: () => HistoricCloseQuerySchema,
  HistoricSpotSchema: () => HistoricSpotSchema,
  HourlyStatsSchema: () => HourlyStatsSchema,
  KB_CATEGORIES: () => KB_CATEGORIES,
  KB_CATEGORY_INFO: () => KB_CATEGORY_INFO,
  KB_GUIDE: () => KB_GUIDE,
  KB_REVIEW_MONTHS: () => KB_REVIEW_MONTHS,
  KB_REVIEW_WARNING_DAYS: () => KB_REVIEW_WARNING_DAYS,
  KB_TERMS: () => KB_TERMS,
  KB_UNRESOLVED_HREF_PREFIX: () => KB_UNRESOLVED_HREF_PREFIX,
  KbCategoryEnum: () => KbCategoryEnum,
  KbDocumentListResponseSchema: () => KbDocumentListResponseSchema,
  KbDocumentSchema: () => KbDocumentSchema,
  KbFrontmatterSchema: () => KbFrontmatterSchema,
  KbJurisdictionEnum: () => KbJurisdictionEnum,
  KbSlugSchema: () => KbSlugSchema,
  KbStatusEnum: () => KbStatusEnum,
  LogLevelEnum: () => LogLevelEnum,
  LoginRequestSchema: () => LoginRequestSchema,
  LoginResponseSchema: () => LoginResponseSchema,
  LoginSchema: () => LoginSchema,
  MELT_CATEGORIES: () => MELT_CATEGORIES,
  MarketDataResponseSchema: () => MarketDataResponseSchema,
  MeltCalculatorRequestSchema: () => MeltCalculatorRequestSchema,
  MeltCalculatorResponseSchema: () => MeltCalculatorResponseSchema,
  MeltCategoryDataSchema: () => MeltCategoryDataSchema,
  MeltCategoryKeyEnum: () => MeltCategoryKeyEnum,
  MessageResponseSchema: () => MessageResponseSchema,
  MetalSymbolSchema: () => MetalSymbolSchema,
  MetalTypeEnum: () => MetalTypeEnum,
  PORTFOLIO_MAX_QTY: () => PORTFOLIO_MAX_QTY,
  PORTFOLIO_SMALL_INVESTOR_LIMIT: () => PORTFOLIO_SMALL_INVESTOR_LIMIT,
  PaginationSchema: () => PaginationSchema,
  Platform: () => Platform,
  PortfolioBuildRequestSchema: () => PortfolioBuildRequestSchema,
  PortfolioBuildResponseSchema: () => PortfolioBuildResponseSchema,
  PortfolioLineItemSchema: () => PortfolioLineItemSchema,
  PortfolioProductTypeFilterEnum: () => PortfolioProductTypeFilterEnum,
  PortfolioStrategyResultSchema: () => PortfolioStrategyResultSchema,
  PriorityStrengthEnum: () => PriorityStrengthEnum,
  ProductArraySchema: () => ProductArraySchema,
  ProductCategoryEnum: () => ProductCategoryEnum,
  ProductMapSchema: () => ProductMapSchema,
  ProductSchema: () => ProductSchema,
  ProductsSchema: () => ProductsSchema,
  ProfitAnalysisMissingFieldEnum: () => ProfitAnalysisMissingFieldEnum,
  ProfitAnalysisRequestSchema: () => ProfitAnalysisRequestSchema,
  ProfitAnalysisResponseSchema: () => ProfitAnalysisResponseSchema,
  RawProductSchema: () => RawProductSchema,
  RawSpotPriceSchema: () => RawSpotPriceSchema,
  RecalculateOverridesSchema: () => RecalculateOverridesSchema,
  RefreshResponseSchema: () => RefreshResponseSchema,
  RegisterSchema: () => RegisterSchema,
  RouteStatsSchema: () => RouteStatsSchema,
  SessionUserRoleEnum: () => SessionUserRoleEnum,
  SessionUserSchema: () => SessionUserSchema,
  SetKbStatusRequestSchema: () => SetKbStatusRequestSchema,
  SpotPriceArraySchema: () => SpotPriceArraySchema,
  SpotPriceMapSchema: () => SpotPriceMapSchema,
  SpotPriceSchema: () => SpotPriceSchema,
  TRADE_METAL_SLIDER_BOUNDS: () => TRADE_METAL_SLIDER_BOUNDS,
  TableSizeSchema: () => TableSizeSchema,
  TaskQueryParamsSchema: () => TaskQueryParamsSchema,
  TaskStatusSchema: () => TaskStatusSchema,
  TradeBootstrapResponseSchema: () => TradeBootstrapResponseSchema,
  TradeCartItemRequestSchema: () => TradeCartItemRequestSchema,
  TradeCartLineSchema: () => TradeCartLineSchema,
  TradeCartRequestSchema: () => TradeCartRequestSchema,
  TradeCartResponseSchema: () => TradeCartResponseSchema,
  TradeProductSchema: () => TradeProductSchema,
  TradeTransactionTypeEnum: () => TradeTransactionTypeEnum,
  UpdateKbDocumentRequestSchema: () => UpdateKbDocumentRequestSchema,
  UpdateProductFullDtoSchema: () => UpdateProductFullDtoSchema,
  UpdateStockRequestSchema: () => UpdateStockRequestSchema,
  UserProfileSchema: () => UserProfileSchema,
  UserRole: () => UserRole,
  UserSchema: () => UserSchema,
  UserStatus: () => UserStatus,
  aiInputLimit: () => aiInputLimit,
  buildPortfolioStrategies: () => buildPortfolioStrategies,
  computeCurrentBuybackValue: () => computeCurrentBuybackValue,
  computeMeltValue: () => computeMeltValue,
  computeProfit: () => computeProfit,
  computeRequiredSpotForTarget: () => computeRequiredSpotForTarget,
  computeTransactionPrice: () => computeTransactionPrice,
  createErrorReference: () => createErrorReference,
  findBrokenLinks: () => findBrokenLinks,
  findLinks: () => findLinks,
  findTodos: () => findTodos,
  guideLibraryTargets: () => guideLibraryTargets,
  headingAnchor: () => headingAnchor,
  indexKbDocument: () => indexKbDocument,
  kbArticlePath: () => kbArticlePath,
  kbReviewDueOn: () => kbReviewDueOn,
  kbReviewStatus: () => kbReviewStatus,
  mapOutsideCode: () => mapOutsideCode,
  normalizeProductName: () => normalizeProductName,
  parseKbDocument: () => parseKbDocument,
  planAutolinks: () => planAutolinks,
  rewriteKbLinks: () => rewriteKbLinks,
  roundBuyPrice: () => roundBuyPrice,
  roundSellPrice: () => roundSellPrice,
  searchKb: () => searchKb,
  solveMissingPurchaseField: () => solveMissingPurchaseField,
  splitFrontmatter: () => splitFrontmatter,
  splitSections: () => splitSections,
  termRegExp: () => termRegExp,
  toPlainText: () => toPlainText
});
module.exports = __toCommonJS(index_exports);

// src/product.schema.ts
var import_zod2 = require("zod");

// src/spot-price.schema.ts
var import_zod = require("zod");
var TaskStatusSchema = import_zod.z.enum(["todo", "in-progress", "done"]);
var MetalTypeEnum = import_zod.z.enum(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]);
var MetalSymbolSchema = import_zod.z.enum(["XAU", "XAG", "XPT", "XPD"]);
var FetchSourceEnum = import_zod.z.enum(["cache", "db", "live"]);
var SpotPriceSchema = import_zod.z.object({
  id: import_zod.z.string(),
  metalType: MetalTypeEnum,
  priceEur: import_zod.z.number(),
  priceGbp: import_zod.z.number(),
  previousClose: import_zod.z.number(),
  change: import_zod.z.number(),
  changePercent: import_zod.z.number(),
  source: import_zod.z.string(),
  timestamp: import_zod.z.iso.datetime(),
  createdAt: import_zod.z.iso.datetime(),
  fetchSource: FetchSourceEnum.optional(),
  /** True when a live fetch was actually attempted for this metal and failed, and this price is the last-known-good value served instead — distinct from a cache/DB hit that's just the normal cascade preference. */
  isFallback: import_zod.z.boolean().optional()
});
var RawSpotPriceSchema = import_zod.z.object({
  id: import_zod.z.string(),
  metalType: MetalTypeEnum,
  priceEur: import_zod.z.number(),
  priceGbp: import_zod.z.number(),
  source: import_zod.z.string(),
  timestamp: import_zod.z.iso.datetime(),
  createdAt: import_zod.z.iso.datetime(),
  fetchSource: FetchSourceEnum.optional(),
  isFallback: import_zod.z.boolean().optional()
});
var HistoricSpotSchema = import_zod.z.object({
  metalType: MetalTypeEnum,
  priceEur: import_zod.z.number(),
  priceGbp: import_zod.z.number(),
  timestamp: import_zod.z.iso.datetime()
});
var CreateSpotPriceDtoSchema = import_zod.z.object({
  title: import_zod.z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: import_zod.z.string().optional().default("")
});
var SpotPriceArraySchema = import_zod.z.array(SpotPriceSchema);
var SpotPriceMapSchema = import_zod.z.record(MetalTypeEnum, SpotPriceSchema);
var TaskQueryParamsSchema = import_zod.z.object({
  status: TaskStatusSchema.optional(),
  search: import_zod.z.string().optional()
});

// src/product.schema.ts
var isoDateString = import_zod2.z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") return val;
  return void 0;
}, import_zod2.z.iso.datetime());
var ProductCategoryEnum = import_zod2.z.enum(["BAR", "COIN"]);
var ProductSchema = import_zod2.z.object({
  id: import_zod2.z.number(),
  sku: import_zod2.z.string(),
  name: import_zod2.z.string(),
  metalType: MetalTypeEnum,
  weight: import_zod2.z.number(),
  spotPrice: import_zod2.z.number(),
  spreadBuy: import_zod2.z.number(),
  spreadSell: import_zod2.z.number(),
  vatRate: import_zod2.z.number(),
  category: ProductCategoryEnum.nullable().optional(),
  description: import_zod2.z.string(),
  // Calculated fields
  // Raw market value of this product's own weight at the current spot price
  // (spot / troy oz * weight) — no premium/discount/VAT applied. Distinct
  // from `spotPrice`, which is the flat per-ounce metal price and is the
  // same for every product of a metal; this is what the product table's
  // "Market Price" column shows per row.
  marketValue: import_zod2.z.number(),
  priceSell: import_zod2.z.number(),
  priceSellVatExcl: import_zod2.z.number(),
  priceBuy: import_zod2.z.number(),
  stock: import_zod2.z.number(),
  isActive: import_zod2.z.boolean(),
  updatedAt: isoDateString,
  createdAt: isoDateString
});
var RawProductSchema = import_zod2.z.object({
  id: import_zod2.z.number(),
  sku: import_zod2.z.string(),
  name: import_zod2.z.string(),
  metalType: MetalTypeEnum,
  weight: import_zod2.z.number(),
  spreadBuy: import_zod2.z.number(),
  spreadSell: import_zod2.z.number(),
  vatRate: import_zod2.z.number(),
  stock: import_zod2.z.number(),
  isActive: import_zod2.z.boolean(),
  category: ProductCategoryEnum.nullable().optional(),
  description: import_zod2.z.string().nullable().optional(),
  createdAt: isoDateString,
  updatedAt: isoDateString
});
var CreateProductDtoSchema = import_zod2.z.object({
  sku: import_zod2.z.string(),
  name: import_zod2.z.string(),
  metalType: MetalTypeEnum,
  weight: import_zod2.z.number(),
  spreadBuy: import_zod2.z.number(),
  spreadSell: import_zod2.z.number(),
  vatRate: import_zod2.z.number(),
  stock: import_zod2.z.number(),
  category: ProductCategoryEnum.nullable().optional(),
  description: import_zod2.z.string().optional()
});
var UpdateProductFullDtoSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().extend({
  // still allow explicit optional overrides for calculated/update-only fields
  priceSell: import_zod2.z.number().optional(),
  priceBuy: import_zod2.z.number().optional(),
  isActive: import_zod2.z.boolean().optional()
});
var UpdateStockRequestSchema = import_zod2.z.object({
  stock_quantity: import_zod2.z.number().int().nonnegative()
});
var ProductsSchema = import_zod2.z.array(ProductSchema);
var ProductArraySchema = import_zod2.z.array(ProductSchema);
var ProductMapSchema = import_zod2.z.record(MetalTypeEnum, ProductSchema);

// src/product-name.ts
var WEIGHT_SPACE_RE = /(\d+(?:[./]\d+)?)\s+(oz|kg|g)\b/gi;
function normalizeProductName(name) {
  return name.replace(WEIGHT_SPACE_RE, "$1$2").trim();
}

// src/common.schema.ts
var import_zod3 = require("zod");
var ApiSuccessResponseSchema = (dataSchema) => import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: dataSchema,
  message: import_zod3.z.string().optional()
});
var ApiErrorResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(false),
  error: import_zod3.z.object({
    code: import_zod3.z.string(),
    message: import_zod3.z.string(),
    details: import_zod3.z.any().optional()
  }),
  timestamp: import_zod3.z.iso.datetime()
});
var PaginationSchema = import_zod3.z.object({
  page: import_zod3.z.coerce.number().int().min(1).default(1),
  limit: import_zod3.z.coerce.number().int().min(1).max(100).default(20)
});
var HealthCheckSchema = import_zod3.z.object({
  status: import_zod3.z.literal("ok"),
  timestamp: import_zod3.z.iso.datetime(),
  uptime: import_zod3.z.number(),
  environment: import_zod3.z.string()
});

// src/auth.schemas.ts
var import_zod4 = require("zod");
var UserRole = import_zod4.z.enum(["ADMIN", "USER", "MANAGER"]);
var UserStatus = import_zod4.z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
var Platform = import_zod4.z.enum(["web", "mobile", "admin"]);
var UserSchema = import_zod4.z.object({
  id: import_zod4.z.string(),
  email: import_zod4.z.email("Invalid email format"),
  username: import_zod4.z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  role: UserRole,
  status: UserStatus,
  createdAt: import_zod4.z.date(),
  updatedAt: import_zod4.z.date()
});
var LoginSchema = import_zod4.z.object({
  email: import_zod4.z.email("Please enter a valid email"),
  password: import_zod4.z.string().min(1, "Password is required"),
  platform: Platform,
  rememberMe: import_zod4.z.boolean().optional().default(false)
});
var RegisterSchema = import_zod4.z.object({
  email: import_zod4.z.email("Please enter a valid email"),
  username: import_zod4.z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: import_zod4.z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: import_zod4.z.string(),
  platform: Platform
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
var ChangePasswordSchema = import_zod4.z.object({
  currentPassword: import_zod4.z.string().min(1, "Current password is required"),
  newPassword: import_zod4.z.string().min(8, "New password must be at least 8 characters").max(100, "New password must be less than 100 characters"),
  confirmNewPassword: import_zod4.z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"]
});
var AuthResponseSchema = import_zod4.z.object({
  accessToken: import_zod4.z.string(),
  refreshToken: import_zod4.z.string(),
  user: UserSchema.omit({ createdAt: true, updatedAt: true }),
  expiresIn: import_zod4.z.number()
});
var UserProfileSchema = import_zod4.z.object({
  id: import_zod4.z.uuid(),
  email: import_zod4.z.email(),
  username: import_zod4.z.string(),
  role: UserRole,
  status: UserStatus,
  createdAt: import_zod4.z.iso.datetime()
});
var MessageResponseSchema = import_zod4.z.object({
  message: import_zod4.z.string()
});

// src/market-data.schema.ts
var import_zod5 = require("zod");
var MarketDataResponseSchema = import_zod5.z.object({
  spotPrices: import_zod5.z.array(SpotPriceSchema),
  historicSpot: import_zod5.z.array(HistoricSpotSchema),
  products: import_zod5.z.array(ProductSchema),
  /** The actual timestamp of the spot-price snapshot being shown — the oldest `timestamp` across spotPrices, not "when the request happened". A cache/DB hit can be minutes old even though the request itself just ran. */
  fetchedAt: import_zod5.z.iso.datetime(),
  /**
   * Set when one or more metals fell all the way through cache → DB → the
   * live API without finding a usable (non-zero, non-stale) price, so the
   * UI ends up showing €0.00 for them. Null when every metal resolved to a
   * real price. The frontend surfaces this as a toast rather than silently
   * showing zero with no explanation.
   */
  priceWarning: import_zod5.z.string().nullable(),
  /** Same information as priceWarning, structured — lets the UI mark individual metal cards as failed rather than only showing one combined text warning. */
  degradedMetals: import_zod5.z.array(MetalTypeEnum)
});
var RefreshResponseSchema = import_zod5.z.object({
  spot: SpotPriceSchema,
  products: import_zod5.z.array(ProductSchema),
  fetchedAt: import_zod5.z.iso.datetime()
});
var RecalculateOverridesSchema = import_zod5.z.object({
  GOLD: import_zod5.z.number().positive().optional(),
  SILVER: import_zod5.z.number().positive().optional(),
  PLATINUM: import_zod5.z.number().positive().optional(),
  PALLADIUM: import_zod5.z.number().positive().optional()
});
var HistoricCloseQuerySchema = import_zod5.z.object({
  date: import_zod5.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD").refine((value) => {
    const parsed = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
  }, "Not a real calendar date").optional()
});

// src/trade.schema.ts
var import_zod6 = require("zod");
var TradeTransactionTypeEnum = import_zod6.z.enum(["buying", "selling"]);
var TradeProductSchema = import_zod6.z.object({
  id: import_zod6.z.number(),
  sku: import_zod6.z.string(),
  name: import_zod6.z.string(),
  weight: import_zod6.z.number(),
  metalType: MetalTypeEnum,
  premiumPct: import_zod6.z.number(),
  discountPct: import_zod6.z.number()
});
var TradeBootstrapResponseSchema = import_zod6.z.object({
  metalType: MetalTypeEnum,
  spot: import_zod6.z.number(),
  minSpot: import_zod6.z.number(),
  maxSpot: import_zod6.z.number(),
  products: import_zod6.z.array(TradeProductSchema)
});
var TradeCartItemRequestSchema = import_zod6.z.object({
  productId: import_zod6.z.number(),
  quantity: import_zod6.z.coerce.number().int().min(1).default(1),
  percent: import_zod6.z.coerce.number().min(0)
});
var TradeCartRequestSchema = import_zod6.z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  customSpot: import_zod6.z.coerce.number().positive().optional(),
  items: import_zod6.z.array(TradeCartItemRequestSchema).min(1)
});
var TradeCartLineSchema = import_zod6.z.object({
  productId: import_zod6.z.number(),
  product: import_zod6.z.string(),
  sku: import_zod6.z.string(),
  weight: import_zod6.z.number(),
  quantity: import_zod6.z.number(),
  percent: import_zod6.z.number(),
  unitPrice: import_zod6.z.number(),
  lineTotal: import_zod6.z.number()
});
var TradeCartResponseSchema = import_zod6.z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  spot: import_zod6.z.number(),
  lines: import_zod6.z.array(TradeCartLineSchema),
  totalWeight: import_zod6.z.number(),
  averagePerGram: import_zod6.z.number(),
  totalPrice: import_zod6.z.number()
});
var MeltCategoryKeyEnum = import_zod6.z.enum(["24ct", "22ct", "90%", "Silver"]);
var MeltCategoryDataSchema = import_zod6.z.object({
  metal: MetalTypeEnum,
  meltFactor: import_zod6.z.number(),
  purity: import_zod6.z.number()
});
var MeltCalculatorRequestSchema = import_zod6.z.object({
  category: MeltCategoryKeyEnum,
  weight: import_zod6.z.coerce.number().positive(),
  /** The spot the user is quoting from (a card override) — omitted means the server's latest market spot. */
  customSpot: import_zod6.z.number().positive().optional()
});
var MeltCalculatorResponseSchema = import_zod6.z.object({
  category: MeltCategoryKeyEnum,
  metal: MetalTypeEnum,
  spot: import_zod6.z.number(),
  spotPerGram: import_zod6.z.number(),
  meltFactor: import_zod6.z.number(),
  purity: import_zod6.z.number(),
  weight: import_zod6.z.number(),
  meltValue: import_zod6.z.number()
});
var TRADE_METAL_SLIDER_BOUNDS = {
  GOLD: { min: 1e3, max: 5e3 },
  SILVER: { min: 10, max: 150 },
  PLATINUM: { min: 500, max: 3e3 },
  PALLADIUM: { min: 500, max: 3e3 }
};
var MELT_CATEGORIES = {
  "24ct": { metal: "GOLD", meltFactor: 0.85, purity: 1 },
  "22ct": { metal: "GOLD", meltFactor: 0.78776, purity: 0.916 },
  "90%": { metal: "GOLD", meltFactor: 0.729, purity: 0.9 },
  Silver: { metal: "SILVER", meltFactor: 0.8, purity: 0.9 }
};

// src/portfolio.schema.ts
var import_zod7 = require("zod");
var ProfitAnalysisMissingFieldEnum = import_zod7.z.enum(["spot", "premium", "price"]);
var ProfitAnalysisRequestSchema = import_zod7.z.object({
  metalType: MetalTypeEnum,
  productId: import_zod7.z.number(),
  purchaseSpot: import_zod7.z.coerce.number(),
  purchasePremium: import_zod7.z.coerce.number(),
  purchasePrice: import_zod7.z.coerce.number(),
  missingField: ProfitAnalysisMissingFieldEnum,
  currentSpot: import_zod7.z.coerce.number().positive(),
  currentDiscount: import_zod7.z.coerce.number().min(0).max(99.99),
  targetProfit: import_zod7.z.coerce.number().min(0)
});
var ProfitAnalysisResponseSchema = import_zod7.z.object({
  product: import_zod7.z.string(),
  productMultiplier: import_zod7.z.number(),
  purchaseSpot: import_zod7.z.number(),
  purchasePremium: import_zod7.z.number(),
  purchasePrice: import_zod7.z.number(),
  currentSpot: import_zod7.z.number(),
  currentDiscount: import_zod7.z.number(),
  currentBuybackValue: import_zod7.z.number(),
  profit: import_zod7.z.number(),
  profitPercent: import_zod7.z.number(),
  requiredSpot: import_zod7.z.number(),
  requiredPrice: import_zod7.z.number(),
  targetProfit: import_zod7.z.number(),
  targetReturn: import_zod7.z.number()
});
var PortfolioProductTypeFilterEnum = import_zod7.z.enum(["either", "bar", "coin"]);
var PriorityStrengthEnum = import_zod7.z.enum(["none", "low", "medium", "high"]);
var PortfolioBuildRequestSchema = import_zod7.z.object({
  metalType: MetalTypeEnum,
  budget: import_zod7.z.coerce.number().positive(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: import_zod7.z.number().optional(),
  priorityStrength: PriorityStrengthEnum,
  /** The spot the user is quoting from (a card override) — omitted means the server's latest market spot. */
  customSpot: import_zod7.z.number().positive().optional()
});
var PortfolioLineItemSchema = import_zod7.z.object({
  product: import_zod7.z.string(),
  quantity: import_zod7.z.number(),
  weight: import_zod7.z.number(),
  totalWeight: import_zod7.z.number(),
  unitPrice: import_zod7.z.number(),
  totalValue: import_zod7.z.number(),
  premium: import_zod7.z.number(),
  type: import_zod7.z.enum(["bar", "coin"]),
  isPriority: import_zod7.z.boolean()
});
var PortfolioStrategyResultSchema = import_zod7.z.object({
  strategy: import_zod7.z.object({
    id: import_zod7.z.enum(["maximum", "balanced", "flexible"]),
    name: import_zod7.z.string(),
    badge: import_zod7.z.string(),
    description: import_zod7.z.string()
  }),
  totalInvested: import_zod7.z.number(),
  unspent: import_zod7.z.number(),
  totalGrams: import_zod7.z.number(),
  averagePerGram: import_zod7.z.number(),
  averagePremium: import_zod7.z.number(),
  pieces: import_zod7.z.number(),
  largestPositionPercent: import_zod7.z.number(),
  flexibilityScore: import_zod7.z.number(),
  priorityQuantity: import_zod7.z.number(),
  priorityShare: import_zod7.z.number(),
  items: import_zod7.z.array(PortfolioLineItemSchema)
});
var PortfolioBuildResponseSchema = import_zod7.z.object({
  metalType: MetalTypeEnum,
  budget: import_zod7.z.number(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: import_zod7.z.number().nullable(),
  priorityStrength: PriorityStrengthEnum,
  results: import_zod7.z.array(PortfolioStrategyResultSchema)
});

// src/pricing-math.ts
var GRAMS_PER_TROY_OUNCE = 31.1034768;
function roundSellPrice(value) {
  return Math.ceil(Math.round(value * 100) / 100);
}
function roundBuyPrice(value) {
  return Math.floor(Math.round(value * 100) / 100);
}
function computeTransactionPrice(basePrice, transactionType, percent) {
  if (transactionType === "buying") {
    return Math.ceil(basePrice * (1 + percent / 100));
  }
  return Math.floor(basePrice * (1 - percent / 100));
}
function computeMeltValue(spotPerGram, meltFactor, purity, weight) {
  return spotPerGram * meltFactor * purity * weight;
}
function solveMissingPurchaseField(missingField, purchaseSpot, purchasePremium, purchasePrice, productMultiplier) {
  if (missingField === "price") {
    if (!isFinite(purchaseSpot) || purchaseSpot <= 0) {
      throw new Error("Please enter a valid purchase spot.");
    }
    if (!isFinite(purchasePremium) || purchasePremium < 0) {
      throw new Error("Please enter a valid purchase premium.");
    }
    purchasePrice = purchaseSpot * productMultiplier * (1 + purchasePremium / 100);
  } else if (missingField === "premium") {
    if (!isFinite(purchaseSpot) || purchaseSpot <= 0) {
      throw new Error("Please enter a valid purchase spot.");
    }
    if (!isFinite(purchasePrice) || purchasePrice <= 0) {
      throw new Error("Please enter a valid purchase price.");
    }
    const adjustedSpot = purchaseSpot * productMultiplier;
    if (adjustedSpot <= 0) {
      throw new Error("Unable to calculate the purchase premium.");
    }
    purchasePremium = (purchasePrice / adjustedSpot - 1) * 100;
  } else if (missingField === "spot") {
    if (!isFinite(purchasePremium) || purchasePremium < 0) {
      throw new Error("Please enter a valid purchase premium.");
    }
    if (!isFinite(purchasePrice) || purchasePrice <= 0) {
      throw new Error("Please enter a valid purchase price.");
    }
    const denominator = productMultiplier * (1 + purchasePremium / 100);
    if (denominator <= 0) {
      throw new Error("Unable to calculate the purchase spot.");
    }
    purchaseSpot = purchasePrice / denominator;
  } else {
    throw new Error("Invalid field selection.");
  }
  return { purchaseSpot, purchasePremium, purchasePrice };
}
function computeCurrentBuybackValue(currentSpot, currentDiscount, productMultiplier) {
  const currentAdjustedSpot = currentSpot * productMultiplier;
  return currentAdjustedSpot * (1 - currentDiscount / 100);
}
function computeProfit(currentBuybackValue, purchasePrice) {
  const profit = currentBuybackValue - purchasePrice;
  const profitPercent = purchasePrice !== 0 ? profit / purchasePrice * 100 : 0;
  return { profit, profitPercent };
}
function computeRequiredSpotForTarget(purchasePrice, targetProfit, productMultiplier, currentDiscount) {
  const requiredPrice = purchasePrice + targetProfit;
  const requiredDenominator = productMultiplier * (1 - currentDiscount / 100);
  const requiredSpot = requiredDenominator > 0 ? requiredPrice / requiredDenominator : 0;
  const targetReturn = purchasePrice !== 0 ? targetProfit / purchasePrice * 100 : 0;
  return { requiredPrice, requiredSpot, targetReturn };
}

// src/portfolio-builder-math.ts
var PORTFOLIO_SMALL_INVESTOR_LIMIT = 5e3;
var PORTFOLIO_MAX_QTY = 500;
function getNormalProducts(products, budget, priorityProductName) {
  const priority = (priorityProductName || "").trim();
  if (budget <= PORTFOLIO_SMALL_INVESTOR_LIMIT) {
    return products.filter((p) => p.sellPrice <= budget);
  }
  return products.filter((p) => {
    if (p.sellPrice > budget) return false;
    if (p.weight >= GRAMS_PER_TROY_OUNCE) return true;
    if (priority && p.product === priority) return true;
    return false;
  });
}
function findPreferredOneOzProduct(products) {
  const oneOz = products.filter((p) => Math.abs(p.weight - GRAMS_PER_TROY_OUNCE) < 0.75);
  if (!oneOz.length) return null;
  oneOz.sort(
    (a, b) => a.premium !== b.premium ? a.premium - b.premium : a.sellPrice / a.weight - b.sellPrice / b.weight
  );
  return oneOz[0];
}
function portfolioFromQuantities(quantities, allProducts, budget, priorityId) {
  const items = [];
  let totalInvested = 0;
  let totalGrams = 0;
  let totalPremiumWeight = 0;
  let pieces = 0;
  let largestPosition = 0;
  let priorityQuantity = 0;
  let priorityValue = 0;
  for (const p of allProducts) {
    let qty = quantities[p.product] ?? 0;
    if (qty <= 0) continue;
    qty = Math.min(qty, PORTFOLIO_MAX_QTY);
    const value = qty * p.sellPrice;
    const grams = qty * p.weight;
    totalInvested += value;
    totalGrams += grams;
    pieces += qty;
    totalPremiumWeight += p.premium * grams;
    largestPosition = Math.max(largestPosition, value);
    const isPriority = priorityId !== null && p.id === priorityId;
    if (isPriority) {
      priorityQuantity = qty;
      priorityValue = value;
    }
    items.push({
      product: p.product,
      quantity: qty,
      weight: p.weight,
      totalWeight: grams,
      unitPrice: p.sellPrice,
      totalValue: value,
      premium: p.premium,
      type: p.type,
      isPriority
    });
  }
  if (totalInvested <= 0) return null;
  items.sort((a, b) => b.totalValue - a.totalValue);
  const unspent = Math.max(0, budget - totalInvested);
  const averagePerGram = totalGrams > 0 ? totalInvested / totalGrams : 0;
  const averagePremium = totalGrams > 0 ? totalPremiumWeight / totalGrams : 0;
  const largestPositionPercent = totalInvested > 0 ? largestPosition / totalInvested * 100 : 0;
  let positionScore;
  if (pieces >= 4 && pieces <= 15) positionScore = 100;
  else if (pieces < 4) positionScore = pieces * 20;
  else positionScore = Math.max(20, 100 - (pieces - 15) * 2);
  const concentrationScore = Math.max(0, 100 - largestPositionPercent);
  const diversityScore = Math.min(100, items.length * 25);
  const flexibilityScore = Math.round(positionScore * 0.45 + concentrationScore * 0.35 + diversityScore * 0.2);
  return {
    totalInvested: Math.round(totalInvested),
    unspent: Math.round(unspent),
    totalGrams,
    averagePerGram,
    averagePremium,
    pieces,
    largestPositionPercent,
    flexibilityScore,
    priorityQuantity,
    priorityShare: totalInvested > 0 ? priorityValue / totalInvested * 100 : 0,
    items
  };
}
function fallbackPortfolio(products, budget, priorityId) {
  const affordable = products.filter((p2) => p2.sellPrice <= budget);
  if (!affordable.length) return null;
  affordable.sort((a, b) => a.sellPrice / a.weight - b.sellPrice / b.weight);
  const p = affordable[0];
  const qty = Math.floor(budget / p.sellPrice);
  if (qty <= 0) return null;
  return portfolioFromQuantities({ [p.product]: qty }, products, budget, priorityId);
}
function buildMaximumValue(normalProducts, allAffordable, budget, priorityId) {
  let products = normalProducts.slice();
  if (!products.length) products = allAffordable.slice();
  products.sort((a, b) => b.weight !== a.weight ? b.weight - a.weight : a.sellPrice - b.sellPrice);
  const quantities = {};
  let remaining = budget;
  while (remaining > 0) {
    let chosen = null;
    for (const p of products) {
      if (p.sellPrice <= remaining) {
        chosen = p;
        break;
      }
    }
    if (!chosen) break;
    const newQty = (quantities[chosen.product] ?? 0) + 1;
    quantities[chosen.product] = newQty;
    remaining -= chosen.sellPrice;
    if (newQty >= PORTFOLIO_MAX_QTY) {
      const chosenProduct = chosen.product;
      products = products.filter((p) => p.product !== chosenProduct);
    }
  }
  const priority = priorityId !== null ? allAffordable.find((p) => p.id === priorityId) ?? null : null;
  if (priority && priority.sellPrice <= remaining) {
    const currentQty = quantities[priority.product] ?? 0;
    if (currentQty < PORTFOLIO_MAX_QTY) {
      quantities[priority.product] = currentQty + 1;
      remaining -= priority.sellPrice;
    }
  }
  return portfolioFromQuantities(quantities, allAffordable, budget, priorityId);
}
function buildMaximumFlexibility(normalProducts, allAffordable, budget, priorityId, priorityStrength, priorityProduct) {
  let oneOz = findPreferredOneOzProduct(normalProducts);
  if (!oneOz) {
    const oneOzProducts = allAffordable.filter((p) => Math.abs(p.weight - GRAMS_PER_TROY_OUNCE) < 0.75);
    oneOzProducts.sort(
      (a, b) => a.premium !== b.premium ? a.premium - b.premium : a.sellPrice / a.weight - b.sellPrice / b.weight
    );
    if (oneOzProducts.length) oneOz = oneOzProducts[0] ?? null;
  }
  let primaryProduct = oneOz;
  if (priorityProduct && priorityProduct.sellPrice <= budget) {
    if (priorityStrength === "high" || priorityStrength === "medium") primaryProduct = priorityProduct;
  }
  if (!primaryProduct && priorityProduct) primaryProduct = priorityProduct;
  const quantities = {};
  if (priorityProduct && priorityStrength === "high") {
    let priorityQty = Math.floor(budget * 0.75 / priorityProduct.sellPrice);
    if (priorityQty < 1 && priorityProduct.sellPrice <= budget) priorityQty = 1;
    priorityQty = Math.min(priorityQty, PORTFOLIO_MAX_QTY);
    if (priorityQty > 0) quantities[priorityProduct.product] = priorityQty;
  } else if (priorityProduct && priorityStrength === "medium") {
    let mediumQty = Math.floor(budget * 0.5 / priorityProduct.sellPrice);
    if (mediumQty < 1 && priorityProduct.sellPrice <= budget) mediumQty = 1;
    mediumQty = Math.min(mediumQty, PORTFOLIO_MAX_QTY);
    if (mediumQty > 0) quantities[priorityProduct.product] = mediumQty;
  } else if (primaryProduct) {
    let primaryQty = Math.floor(budget / primaryProduct.sellPrice);
    primaryQty = Math.min(primaryQty, PORTFOLIO_MAX_QTY);
    if (primaryQty > 0) quantities[primaryProduct.product] = primaryQty;
  }
  let spent = 0;
  for (const name of Object.keys(quantities)) {
    const product = allAffordable.find((p) => p.product === name);
    if (product) spent += (quantities[name] ?? 0) * product.sellPrice;
  }
  let remaining = budget - spent;
  if (oneOz && (!priorityProduct || oneOz.product !== priorityProduct.product) && oneOz.sellPrice <= remaining) {
    let oneOzQty = Math.floor(remaining / oneOz.sellPrice);
    if (priorityStrength === "high" && priorityProduct) {
      const priorityValue = (quantities[priorityProduct.product] ?? 0) * priorityProduct.sellPrice;
      oneOzQty = Math.min(oneOzQty, Math.floor(priorityValue / oneOz.sellPrice));
    } else if (priorityStrength === "medium" && priorityProduct) {
      const mediumPriorityValue = (quantities[priorityProduct.product] ?? 0) * priorityProduct.sellPrice;
      oneOzQty = Math.min(oneOzQty, Math.floor(mediumPriorityValue / oneOz.sellPrice));
    }
    oneOzQty = Math.min(oneOzQty, PORTFOLIO_MAX_QTY);
    if (oneOzQty > 0) {
      quantities[oneOz.product] = (quantities[oneOz.product] ?? 0) + oneOzQty;
      spent += oneOzQty * oneOz.sellPrice;
      remaining = budget - spent;
    }
  }
  const remainderCandidates = allAffordable.filter((p) => p.sellPrice <= remaining);
  remainderCandidates.sort((a, b) => {
    if (priorityProduct) {
      const aPriority = a.product === priorityProduct.product ? 1 : 0;
      const bPriority = b.product === priorityProduct.product ? 1 : 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
    }
    if (oneOz) {
      const aOz = Math.abs(a.weight - GRAMS_PER_TROY_OUNCE) < 0.75 ? 1 : 0;
      const bOz = Math.abs(b.weight - GRAMS_PER_TROY_OUNCE) < 0.75 ? 1 : 0;
      if (aOz !== bOz) return bOz - aOz;
    }
    return a.sellPrice / a.weight - b.sellPrice / b.weight;
  });
  if (remainderCandidates.length) {
    const remainderProduct = remainderCandidates[0];
    let remainderQty = Math.floor(remaining / remainderProduct.sellPrice);
    if (remainderProduct.weight < GRAMS_PER_TROY_OUNCE && (!priorityProduct || remainderProduct.product !== priorityProduct.product)) {
      remainderQty = Math.min(remainderQty, 5);
    }
    remainderQty = Math.min(remainderQty, PORTFOLIO_MAX_QTY);
    if (remainderQty > 0) {
      quantities[remainderProduct.product] = (quantities[remainderProduct.product] ?? 0) + remainderQty;
    }
  }
  const portfolio = portfolioFromQuantities(quantities, allAffordable, budget, priorityId);
  if (!portfolio) return fallbackPortfolio(allAffordable, budget, priorityId);
  return portfolio;
}
function priorityMultiplier(strength) {
  switch (strength) {
    case "high":
      return 1;
    case "medium":
      return 0.65;
    case "low":
      return 0.3;
    default:
      return 0;
  }
}
function balancedScore(portfolio, budget, priorityStrength) {
  if (!portfolio) return -Infinity;
  const utilisation = portfolio.totalInvested / budget;
  const efficiencyScore = 1 / Math.max(1, portfolio.averagePerGram / 100);
  const utilisationScore = Math.min(1, utilisation);
  let concentration = 1 - portfolio.largestPositionPercent / 100;
  concentration = Math.max(0, Math.min(1, concentration));
  const pieces = portfolio.pieces;
  let pieceScore;
  if (pieces >= 6 && pieces <= 15) pieceScore = 1;
  else if (pieces < 6) pieceScore = pieces / 6;
  else pieceScore = Math.max(0, 1 - (pieces - 15) / 30);
  const goldScore = Math.min(1, portfolio.totalGrams / (budget / 130));
  const priorityScore = portfolio.priorityQuantity > 0 ? 1 : 0;
  let premiumScore;
  if (portfolio.averagePremium <= 6) premiumScore = 1;
  else if (portfolio.averagePremium <= 8) premiumScore = 1 - (portfolio.averagePremium - 6) * 0.2;
  else premiumScore = Math.max(0, 0.6 - (portfolio.averagePremium - 8) * 0.1);
  let score = utilisationScore * 0.18 + efficiencyScore * 0.22 + goldScore * 0.24 + pieceScore * 0.14 + concentration * 0.08 + premiumScore * 0.1 + priorityScore * priorityMultiplier(priorityStrength) * 0.04;
  if (portfolio.averagePremium > 10) {
    score -= (portfolio.averagePremium - 10) / 100;
  }
  return score;
}
function createBalancedCandidate(products, quantities, allAffordable, budget, priorityId) {
  const map = {};
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const qty = quantities[i] ?? 0;
    if (!p || qty <= 0) continue;
    map[p.product] = (map[p.product] ?? 0) + qty;
  }
  return portfolioFromQuantities(map, allAffordable, budget, priorityId);
}
function buildBalanced(normalProducts, allAffordable, budget, priorityId, priorityStrength) {
  const candidates = [];
  const oneOz = findPreferredOneOzProduct(normalProducts);
  if (oneOz) {
    const maxOz = Math.floor(budget / oneOz.sellPrice);
    for (let q = Math.max(0, maxOz - 8); q <= maxOz; q++) {
      candidates.push(createBalancedCandidate([oneOz], [q], allAffordable, budget, priorityId));
    }
  }
  for (const anchor of normalProducts) {
    if (Math.abs(anchor.weight - GRAMS_PER_TROY_OUNCE) < 0.5) continue;
    if (anchor.sellPrice > budget) continue;
    const maxAnchor = Math.min(5, Math.floor(budget / anchor.sellPrice));
    for (let aq = 1; aq <= maxAnchor; aq++) {
      const spentAnchor = aq * anchor.sellPrice;
      const remainder = budget - spentAnchor;
      const ozQty = oneOz ? Math.floor(remainder / oneOz.sellPrice) : 0;
      for (let delta = 0; delta <= 4; delta++) {
        const actualOz = Math.max(0, ozQty - delta);
        candidates.push(createBalancedCandidate([anchor, oneOz], [aq, actualOz], allAffordable, budget, priorityId));
      }
    }
  }
  for (let a = 0; a < normalProducts.length; a++) {
    const p1 = normalProducts[a];
    if (p1.sellPrice > budget) continue;
    for (let b = a + 1; b < normalProducts.length; b++) {
      const p2 = normalProducts[b];
      if (p2.sellPrice > budget) continue;
      const max1 = Math.min(4, Math.floor(budget / p1.sellPrice));
      const max2 = Math.min(12, Math.floor(budget / p2.sellPrice));
      for (let q1 = 1; q1 <= max1; q1++) {
        for (let q2 = 1; q2 <= max2; q2++) {
          const total = q1 * p1.sellPrice + q2 * p2.sellPrice;
          if (total <= budget) {
            candidates.push(createBalancedCandidate([p1, p2], [q1, q2], allAffordable, budget, priorityId));
          }
        }
      }
    }
  }
  if (oneOz) {
    const large = normalProducts.filter((p) => p.weight > GRAMS_PER_TROY_OUNCE * 1.5);
    for (const lp of large) {
      if (lp.sellPrice >= budget) continue;
      const maxLarge = Math.min(2, Math.floor(budget / lp.sellPrice));
      for (let lq = 1; lq <= maxLarge; lq++) {
        const rem = budget - lq * lp.sellPrice;
        const oq = Math.floor(rem / oneOz.sellPrice);
        for (let od = 0; od <= 3; od++) {
          const finalOq = Math.max(0, oq - od);
          candidates.push(createBalancedCandidate([lp, oneOz], [lq, finalOq], allAffordable, budget, priorityId));
        }
      }
    }
  }
  const validCandidates = candidates.filter(
    (c) => !!c && c.totalInvested > 0
  );
  if (!validCandidates.length) {
    return fallbackPortfolio(allAffordable, budget, priorityId);
  }
  validCandidates.sort(
    (a, b) => balancedScore(b, budget, priorityStrength) - balancedScore(a, budget, priorityStrength)
  );
  return validCandidates[0];
}
function buildPortfolioStrategies(allProducts, budget, productType, priorityProductName, priorityStrength) {
  if (!isFinite(budget) || budget <= 0) {
    throw new Error("Please enter a valid investment budget.");
  }
  const products = allProducts.filter((p) => {
    if (productType === "bar") return p.type === "bar";
    if (productType === "coin") return p.type === "coin";
    return true;
  });
  if (!products.length) {
    throw new Error("No products matching the selected product type were found.");
  }
  const priorityProductObject = priorityProductName ? products.find((p) => p.product === priorityProductName) ?? null : null;
  const priorityId = priorityProductObject ? priorityProductObject.id : null;
  const normalProducts = getNormalProducts(products, budget, priorityProductName);
  const allAffordable = products.filter((p) => p.sellPrice <= budget);
  if (!allAffordable.length) {
    throw new Error("No product can be purchased within the selected budget.");
  }
  const maximum = buildMaximumValue(normalProducts, allAffordable, budget, priorityId);
  const balanced = buildBalanced(normalProducts, allAffordable, budget, priorityId, priorityStrength);
  const flexible = buildMaximumFlexibility(
    normalProducts,
    allAffordable,
    budget,
    priorityId,
    priorityStrength,
    priorityProductObject
  );
  const fallback = () => fallbackPortfolio(allAffordable, budget, priorityId);
  const strategies = [
    {
      id: "maximum",
      name: "Maximum Value",
      badge: "MAXIMUM VALUE",
      description: "Starts with the largest affordable investment products and works down through the remaining budget, prioritising gold acquired and acquisition efficiency.",
      result: maximum
    },
    {
      id: "balanced",
      name: "Balanced",
      badge: "RECOMMENDED",
      description: "Looks for a sensible combination of larger bars and 1oz bars, balancing gold acquired, concentration and resale flexibility.",
      result: balanced
    },
    {
      id: "flexible",
      name: "Maximum Flexibility",
      badge: "MAXIMUM FLEXIBILITY",
      description: "Favours independently sellable 1oz positions and uses the remaining budget efficiently without turning a large investment into a collection of small-investor products.",
      result: flexible
    }
  ];
  return strategies.map(({ id, name, badge, description, result }) => ({
    strategy: { id, name, badge, description },
    result: result ?? fallback() ?? {
      totalInvested: 0,
      unspent: budget,
      totalGrams: 0,
      averagePerGram: 0,
      averagePremium: 0,
      pieces: 0,
      largestPositionPercent: 0,
      flexibilityScore: 0,
      priorityQuantity: 0,
      priorityShare: 0,
      items: []
    }
  }));
}

// src/session.schema.ts
var import_zod8 = require("zod");
var SessionUserRoleEnum = import_zod8.z.enum(["ADMIN", "MANAGER", "SALES", "ACCOUNTING", "AUDITOR"]);
var SessionUserSchema = import_zod8.z.object({
  id: import_zod8.z.string(),
  email: import_zod8.z.string(),
  firstName: import_zod8.z.string(),
  lastName: import_zod8.z.string(),
  role: SessionUserRoleEnum,
  admin: import_zod8.z.boolean()
});
var LoginRequestSchema = import_zod8.z.object({
  email: import_zod8.z.string().email(),
  password: import_zod8.z.string().min(1)
});
var LoginResponseSchema = import_zod8.z.object({
  accessToken: import_zod8.z.string(),
  user: SessionUserSchema
});
var CreateUserRequestSchema = import_zod8.z.object({
  email: import_zod8.z.string().email(),
  password: import_zod8.z.string().min(6, "Password must be at least 6 characters"),
  firstName: import_zod8.z.string().min(1, "First name is required"),
  lastName: import_zod8.z.string().min(1, "Last name is required"),
  role: SessionUserRoleEnum,
  admin: import_zod8.z.boolean().default(false)
});

// src/branch.schema.ts
var import_zod9 = require("zod");
var CurrencyEnum = import_zod9.z.enum(["EUR", "USD", "GBP"]);
var BranchSchema = import_zod9.z.object({
  id: import_zod9.z.number(),
  name: import_zod9.z.string(),
  address: import_zod9.z.string().nullable(),
  currency: CurrencyEnum,
  createdAt: import_zod9.z.iso.datetime()
});
var CreateBranchRequestSchema = import_zod9.z.object({
  name: import_zod9.z.string().min(1, "Name is required"),
  address: import_zod9.z.string().optional(),
  currency: CurrencyEnum.default("EUR")
});

// src/fetch-attempt.schema.ts
var import_zod10 = require("zod");
var FetchTriggerEnum = import_zod10.z.enum(["CRON", "REFRESH", "RETRY", "LAUNCH_FALLBACK"]);
var FetchAttemptSchema = import_zod10.z.object({
  id: import_zod10.z.string(),
  attemptedAt: import_zod10.z.iso.datetime(),
  durationMs: import_zod10.z.number(),
  success: import_zod10.z.boolean(),
  errorMessage: import_zod10.z.string().nullable(),
  metalsResolved: import_zod10.z.array(MetalTypeEnum),
  triggeredBy: FetchTriggerEnum
});
var FetchMetricsSchema = import_zod10.z.object({
  /** Fraction (0-1) of external API calls in the last 24h that succeeded. 1 when there were none to judge. */
  successRate24h: import_zod10.z.number(),
  totalAttempts24h: import_zod10.z.number(),
  failureCount24h: import_zod10.z.number(),
  avgLatencyMs: import_zod10.z.number(),
  /** Fraction (0-1) of the launch-page-load cascade's cache reads that hit — in-memory since process start, not a 24h window. */
  cacheHitRatio: import_zod10.z.number()
});

// src/error-log.schema.ts
var import_zod11 = require("zod");
var ErrorLogSourceEnum = import_zod11.z.enum(["server", "client"]);
var ErrorLogSeverityEnum = import_zod11.z.enum(["error", "warning"]);
var ErrorLogKindEnum = import_zod11.z.enum(["database", "http", "network", "external-api", "response", "crash"]);
var ErrorLogEntrySchema = import_zod11.z.object({
  id: import_zod11.z.string(),
  /** Short code shown to staff in the error toast ("ref E-7F3K2"), to find the matching entry. */
  reference: import_zod11.z.string(),
  at: import_zod11.z.string(),
  source: ErrorLogSourceEnum,
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: import_zod11.z.string(),
  detail: import_zod11.z.string().nullable().optional(),
  statusCode: import_zod11.z.number().nullable().optional(),
  method: import_zod11.z.string().nullable().optional(),
  path: import_zod11.z.string().nullable().optional(),
  /** Vendor/driver error code, e.g. Prisma's "P1001". */
  code: import_zod11.z.string().nullable().optional(),
  stack: import_zod11.z.string().nullable().optional(),
  user: import_zod11.z.string().nullable().optional(),
  userAgent: import_zod11.z.string().nullable().optional()
});
var ClientErrorReportSchema = import_zod11.z.object({
  reference: import_zod11.z.string().max(20),
  occurredAt: import_zod11.z.string().max(40),
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: import_zod11.z.string().max(500),
  detail: import_zod11.z.string().max(4e3).optional(),
  statusCode: import_zod11.z.number().int().optional(),
  method: import_zod11.z.string().max(10).optional(),
  path: import_zod11.z.string().max(500).optional(),
  stack: import_zod11.z.string().max(4e3).optional()
});
var ClientErrorReportBatchSchema = import_zod11.z.object({
  reports: import_zod11.z.array(ClientErrorReportSchema).max(50)
});
function createErrorReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `E-${out}`;
}

// src/kb.schema.ts
var import_zod12 = require("zod");
var KB_CATEGORIES = [
  "sales",
  "trading",
  "operations",
  "compliance",
  "storage",
  "systems",
  "directory",
  "meta"
];
var KbCategoryEnum = import_zod12.z.enum(KB_CATEGORIES);
var KbJurisdictionEnum = import_zod12.z.enum(["all", "IE", "UK", "ES"]);
var KbStatusEnum = import_zod12.z.enum(["draft", "approved", "retired"]);
var KbSlugSchema = import_zod12.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase, hyphenated");
var isoDay = import_zod12.z.iso.date();
var KbFrontmatterSchema = import_zod12.z.object({
  slug: KbSlugSchema,
  title: import_zod12.z.string().trim().min(1),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: import_zod12.z.string().trim().min(1),
  status: KbStatusEnum,
  version: import_zod12.z.coerce.number().int().positive(),
  updatedAt: isoDay
});
var KbDocumentSchema = import_zod12.z.object({
  slug: KbSlugSchema,
  title: import_zod12.z.string(),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: import_zod12.z.string(),
  status: KbStatusEnum,
  version: import_zod12.z.number().int(),
  contentUpdatedOn: isoDay,
  markdown: import_zod12.z.string()
});
var KbDocumentListResponseSchema = import_zod12.z.object({
  documents: import_zod12.z.array(KbDocumentSchema)
});
var UpdateKbDocumentRequestSchema = import_zod12.z.object({
  title: import_zod12.z.string().trim().min(1).max(200),
  owner: import_zod12.z.string().trim().min(1).max(100),
  markdown: import_zod12.z.string().trim().min(1).max(1e5)
});
var SetKbStatusRequestSchema = import_zod12.z.object({ status: KbStatusEnum });
var KB_CATEGORY_INFO = {
  sales: { label: "Sales", description: "Inquiries, quotes, pricing and customer conversations" },
  trading: { label: "Trading", description: "Payment, price lock, hedging, limit orders and cancellations" },
  operations: { label: "Operations", description: "Stock, fulfilment, collection, buyback and delivery" },
  compliance: { label: "Compliance", description: "KYC, AML and ID checks" },
  storage: { label: "Storage", description: "Bonded silver" },
  systems: { label: "Systems", description: "Which system is used for what" },
  directory: { label: "Directory", description: "Branches and contacts" },
  meta: { label: "About", description: "How SOPs are written" }
};

// src/kb-markdown.ts
var CODE_SEGMENT = /(```[\s\S]*?```|`[^`\n]*`)/g;
function mapOutsideCode(markdown, fn) {
  return markdown.split(CODE_SEGMENT).map((part, index) => index % 2 === 1 ? part : fn(part)).join("");
}
function textOutsideCode(markdown) {
  return markdown.split(CODE_SEGMENT).filter((_, index) => index % 2 === 0).join("\n");
}
function splitFrontmatter(raw) {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) return null;
  const data = {};
  const [, header = "", body = ""] = match;
  for (const line of header.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon < 1) continue;
    const key = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    data[key] = value;
  }
  return { data, body: body.trim() };
}
function headingAnchor(text) {
  return text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
var TODO_PATTERN = /\[TODO:?\s*([^\]]*)\]/gi;
function findTodos(markdown) {
  const found = [];
  for (const match of textOutsideCode(markdown).matchAll(TODO_PATTERN)) {
    found.push((match[1] ?? "").trim());
  }
  return found;
}
function plainHeading(text) {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
}
function splitSections(body) {
  const lines = body.split("\n");
  const raw = [{ heading: "", lines: [] }];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const heading = !inFence ? /^#{1,2}\s+(.+?)\s*#*\s*$/.exec(line) : null;
    if (heading) {
      raw.push({ heading: plainHeading(heading[1] ?? ""), lines: [] });
    } else {
      raw[raw.length - 1]?.lines.push(line);
    }
  }
  const used = /* @__PURE__ */ new Map();
  return raw.filter((section, index) => index > 0 || section.lines.join("").trim() !== "").map((section) => {
    const markdown = section.lines.join("\n").trim();
    const base = headingAnchor(section.heading);
    let anchor = base;
    if (base) {
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      if (seen > 0) anchor = `${base}-${seen + 1}`;
    }
    const todos = findTodos(markdown);
    return {
      anchor,
      heading: section.heading,
      markdown,
      hasTodo: todos.length > 0,
      todos,
      isProposed: /proposed controls/i.test(section.heading)
    };
  });
}
var LINK_PATTERN = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9-]+))?\]\]/g;
function findLinks(markdown) {
  return [...textOutsideCode(markdown).matchAll(LINK_PATTERN)].map((m) => ({ slug: m[1] ?? "", anchor: m[2] ?? null }));
}
function kbArticlePath(slug, anchor) {
  return `/knowledge/articles/${slug}${anchor ? `#${anchor}` : ""}`;
}
var KB_UNRESOLVED_HREF_PREFIX = "#unresolved-sop:";
function rewriteKbLinks(markdown, resolve) {
  return mapOutsideCode(
    markdown,
    (text) => text.replace(LINK_PATTERN, (_raw, slug, anchor) => {
      const ref = { slug, anchor: anchor ?? null };
      const resolved = resolve(ref);
      return resolved ? `[${resolved.label}](${resolved.href})` : `[${slug}](${KB_UNRESOLVED_HREF_PREFIX}${slug})`;
    })
  );
}
function parseKbDocument(raw) {
  const file = splitFrontmatter(raw);
  if (!file) return { ok: false, errors: ["Missing frontmatter: the file must start with a --- block."] };
  const frontmatter = KbFrontmatterSchema.safeParse(file.data);
  if (!frontmatter.success) {
    return {
      ok: false,
      errors: frontmatter.error.issues.map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    };
  }
  return {
    ok: true,
    doc: {
      frontmatter: frontmatter.data,
      body: file.body,
      sections: splitSections(file.body),
      links: findLinks(file.body)
    }
  };
}
function findBrokenLinks(docs) {
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));
  const broken = [];
  for (const doc of docs) {
    for (const link of doc.links) {
      const target = bySlug.get(link.slug);
      if (!target) {
        broken.push({ from: doc.slug, slug: link.slug, anchor: link.anchor, reason: "missing-document" });
      } else if (link.anchor && !target.sections.some((section) => section.anchor === link.anchor)) {
        broken.push({ from: doc.slug, slug: link.slug, anchor: link.anchor, reason: "missing-section" });
      }
    }
  }
  return broken;
}

// src/kb-search.ts
function toPlainText(markdown) {
  return mapOutsideCode(
    markdown,
    (text) => text.replace(/\[\[([a-z0-9-]+)(?:#([a-z0-9-]+))?\]\]/g, (_m, slug, anchor) => anchor ? anchor.replace(/-/g, " ") : slug.replace(/-/g, " ")).replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "").replace(/^\s*\|?\s*[-:| ]+\|[-:| ]*$/gm, "").replace(/\|/g, " ").replace(/[*_~]/g, "").replace(/^#{1,6}\s+/gm, "")
  ).replace(/`/g, "").replace(/\s+/g, " ").trim();
}
function indexKbDocument(doc) {
  const body = doc.markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    sections: splitSections(body).map((section) => ({
      anchor: section.anchor,
      heading: section.heading,
      text: toPlainText(section.markdown),
      hasTodo: section.hasTodo
    }))
  };
}
function tokenize(query) {
  return query.toLowerCase().split(/\s+/).map((token) => token.replace(/[^\p{L}\p{N}-]/gu, "")).filter((token) => token.length > 0);
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var SNIPPET_RADIUS = 70;
function buildSnippet(text, tokens) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const first = tokens.map((token) => lower.indexOf(token)).filter((index) => index >= 0).sort((a, b) => a - b)[0];
  const start = first === void 0 ? 0 : Math.max(0, first - SNIPPET_RADIUS / 2);
  const end = Math.min(text.length, start + SNIPPET_RADIUS * 2);
  const window = `${start > 0 ? "\u2026" : ""}${text.slice(start, end).trim()}${end < text.length ? "\u2026" : ""}`;
  if (tokens.length === 0) return [{ text: window, hit: false }];
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  return window.split(pattern).filter((part) => part !== "").map((part) => ({ text: part, hit: tokens.includes(part.toLowerCase()) }));
}
function searchKb(docs, query, limit = 20) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const hits = [];
  let order = 0;
  for (const doc of docs) {
    const title = doc.title.toLowerCase();
    const titleHasAll = tokens.every((token) => title.includes(token));
    for (const section of doc.sections) {
      order += 1;
      const heading = section.heading.toLowerCase();
      const text = section.text.toLowerCase();
      const haystack = `${title} ${heading} ${text}`;
      if (!tokens.every((token) => haystack.includes(token))) continue;
      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 10;
        if (heading.includes(token)) score += 6;
        const occurrences = text.split(token).length - 1;
        score += Math.min(occurrences, 3);
      }
      hits.push({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        sectionAnchor: section.anchor || null,
        sectionHeading: section.heading || null,
        hasTodo: section.hasTodo,
        score,
        snippet: buildSnippet(section.text, tokens),
        order
      });
    }
    if (titleHasAll && !hits.some((hit) => hit.slug === doc.slug)) {
      order += 1;
      hits.push({
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        sectionAnchor: null,
        sectionHeading: null,
        hasTodo: false,
        score: 10 * tokens.length,
        snippet: [],
        order
      });
    }
  }
  return hits.sort((a, b) => b.score - a.score || a.order - b.order).slice(0, limit).map(({ order: _order, ...hit }) => hit);
}

// src/kb-guide.ts
var KB_GUIDE = {
  start: {
    title: "Who is paying whom?",
    hint: "Pick the side of the trade. Everything else follows from it."
  },
  branches: [
    {
      id: "price",
      title: "Price",
      tag: "Customer buys from us",
      blurb: "They pay us. Quote, take payment, lock the price, hand over.",
      icon: "receipt",
      steps: [
        {
          title: "Quote the customer",
          hint: "Identify them, price it, check stock, send the quote",
          icon: "file-text",
          target: { slug: "customer-inquiry-to-quote", anchor: "steps" }
        },
        {
          title: "Work out the Price",
          hint: "Spot, premium and VAT",
          icon: "calculator",
          target: { slug: "pricing", anchor: "sell-price" }
        },
        {
          title: "Take payment",
          hint: "Bank transfer, card or cash \u2014 and confirm the funds landed",
          icon: "banknote",
          target: { slug: "payment-lock-and-hedge", anchor: "accepted-payment-methods" }
        },
        {
          title: "Lock the price and hedge",
          hint: "Only once the funds have landed",
          icon: "lock",
          target: { slug: "payment-lock-and-hedge", anchor: "steps" }
        },
        {
          title: "Hand it over",
          hint: "ID check, signature, mark as collected",
          icon: "package-check",
          target: { slug: "customer-collection", anchor: "steps" }
        }
      ],
      alsoSee: [
        { label: "Price moved before funds landed", target: { slug: "customer-inquiry-to-quote", anchor: "price-changed-before-funds-landed" } },
        { label: "Limit order", target: { slug: "limit-orders" } },
        { label: "Bonded silver (VAT-free)", target: { slug: "bonded-silver-storage" } }
      ]
    },
    {
      id: "buyback",
      title: "Buyback",
      tag: "Customer sells to us",
      blurb: "We pay them. Check the item, agree a price, record it, pay by bank transfer.",
      icon: "hand-coins",
      steps: [
        {
          title: "Identify the customer",
          hint: "Find or create them in BC, run the ID and AML checks",
          icon: "user-search",
          target: { slug: "customer-buyback", anchor: "steps" }
        },
        {
          title: "Check the item",
          hint: "Tester, weight and dimensions",
          icon: "search-check",
          target: { slug: "customer-buyback", anchor: "authentication" }
        },
        {
          title: "Work out the Buyback",
          hint: "Spot value less the product\u2019s discount",
          icon: "calculator",
          target: { slug: "pricing", anchor: "buy-price" }
        },
        {
          title: "Agree it and record it",
          hint: "Every purchase goes into BC",
          icon: "file-text",
          target: { slug: "customer-buyback", anchor: "purchase-records" }
        },
        {
          title: "Pay the customer",
          hint: "Bank transfer only \u2014 tell them the timing first",
          icon: "banknote",
          target: { slug: "customer-buyback", anchor: "paying-the-customer" }
        },
        {
          title: "Put it into stock",
          hint: "It goes under \u201CBought\u201D on the stock sheet",
          icon: "boxes",
          target: { slug: "stock-management", anchor: "the-stock-sheet" }
        }
      ],
      alsoSee: [
        { label: "Scrap and non-standard items", target: { slug: "pricing", anchor: "scrap-and-non-standard-items" } },
        { label: "Selling bonded silver back", target: { slug: "bonded-silver-storage", anchor: "selling-bonded-silver-back" } },
        { label: "Sell at a target price (limit order)", target: { slug: "limit-orders", anchor: "placing-a-sell-limit-order" } }
      ]
    }
  ],
  quickLinks: [
    {
      label: "Is gold going up?",
      hint: "What to say, and what not to",
      icon: "messages",
      target: { slug: "customer-market-questions" }
    },
    {
      label: "Checking a customer\u2019s ID",
      hint: "Accepted documents and the rules",
      icon: "id-card",
      target: { slug: "customer-collection", anchor: "identity-check" }
    },
    {
      label: "Who do I escalate to?",
      hint: "Contacts by topic",
      icon: "phone",
      target: { slug: "branch-directory", anchor: "escalation" }
    },
    {
      label: "Which system do I use?",
      hint: "BC, StoneX, Zoho and the rest",
      icon: "blocks",
      target: { slug: "systems-overview", anchor: "system-map" }
    },
    {
      label: "Available vs NET stock",
      hint: "What you can sell, and what to reorder",
      icon: "boxes",
      target: { slug: "stock-management", anchor: "available-vs-net" }
    }
  ],
  tools: [
    {
      label: "Pricing Workbook",
      hint: "Live spot and product prices",
      icon: "layout-dashboard",
      target: { href: "/dashboard" }
    },
    {
      label: "Pricing & VAT",
      hint: "Spot, premiums, VAT rules, market modes",
      icon: "calculator",
      target: { slug: "pricing" }
    },
    {
      label: "Stock",
      hint: "Monthly count and the customer safe",
      icon: "boxes",
      target: { slug: "stock-management" }
    },
    {
      label: "Bonded silver",
      hint: "VAT-free storage and serial numbers",
      icon: "vault",
      target: { slug: "bonded-silver-storage" }
    },
    {
      label: "Branch directory",
      hint: "Addresses, hours and contacts",
      icon: "book-user",
      target: { slug: "branch-directory" }
    },
    {
      label: "Compliance & ID",
      hint: "KYC and AML checks",
      icon: "shield-check",
      target: { slug: "kyc-aml" },
      pendingSop: true
    }
  ]
};
function guideLibraryTargets(guide = KB_GUIDE) {
  const out = [];
  const add = (target, pendingSop = false) => {
    if ("slug" in target) out.push({ slug: target.slug, anchor: target.anchor, pendingSop });
  };
  for (const branch of guide.branches) {
    branch.steps.forEach((step) => add(step.target));
    branch.alsoSee.forEach((link) => add(link.target));
  }
  [...guide.quickLinks, ...guide.tools].forEach((shortcut) => add(shortcut.target, shortcut.pendingSop));
  return out;
}

// src/kb-terms.ts
var KB_TERMS = [
  { id: "price-lock", phrases: ["price is locked", "lock the price", "locks the price", "price lock", "locked price", "hedged", "hedging", "hedge"], target: { slug: "payment-lock-and-hedge", anchor: "core-rule" } },
  { id: "funds-landed", phrases: ["funds have landed", "funds landed", "funds land", "confirm the funds", "confirming funds"], target: { slug: "payment-lock-and-hedge", anchor: "confirming-funds" } },
  { id: "limit-orders", phrases: ["limit orders", "limit order"], target: { slug: "limit-orders" } },
  { id: "customer-safe", phrases: ["customer safe", "CST Safe"], target: { slug: "stock-management", anchor: "customer-safe-cst-safe" } },
  { id: "available-vs-net", phrases: ["NET"], target: { slug: "stock-management", anchor: "available-vs-net" }, caseSensitive: true },
  { id: "stock-sheet", phrases: ["stock sheet", "Stock - IE"], target: { slug: "stock-management", anchor: "the-stock-sheet" } },
  { id: "bonded-silver", phrases: ["bonded silver", "bonded warehouse", "in bond"], target: { slug: "bonded-silver-storage" } },
  { id: "market-modes", phrases: ["market modes", "Metal Shortage", "Weekend", "Volatile"], target: { slug: "pricing", anchor: "market-modes" } },
  { id: "scrap", phrases: ["non-standard items", "scrap"], target: { slug: "pricing", anchor: "scrap-and-non-standard-items" } },
  { id: "spot-price", phrases: ["live spot", "spot price"], target: { slug: "pricing", anchor: "spot-price" } },
  { id: "buy-price", phrases: ["buy price"], target: { slug: "pricing", anchor: "buy-price" } },
  { id: "sell-price", phrases: ["sell price"], target: { slug: "pricing", anchor: "sell-price" } },
  { id: "vat", phrases: ["investment gold", "VAT"], target: { slug: "pricing", anchor: "vat" }, caseSensitive: true },
  { id: "identity-check", phrases: ["identity check", "ID check"], target: { slug: "customer-collection", anchor: "identity-check" } },
  { id: "third-party", phrases: ["third-party collection"], target: { slug: "customer-collection", anchor: "third-party-collection" } },
  { id: "quote-validity", phrases: ["quote validity", "indicative"], target: { slug: "customer-inquiry-to-quote", anchor: "quote-validity" } },
  { id: "paying-customer", phrases: ["paying the customer"], target: { slug: "customer-buyback", anchor: "paying-the-customer" } },
  { id: "signature-tablet", phrases: ["signature tablet", "signature capture"], target: { slug: "systems-overview", anchor: "customer-id-and-signatures" } },
  { id: "hedging-platforms", phrases: ["StoneX", "CoinInvest"], target: { slug: "systems-overview", anchor: "system-map" }, caseSensitive: true },
  { id: "bc", phrases: ["Business Central", "Zoho", "BC"], target: { slug: "systems-overview", anchor: "bc-and-zoho" }, caseSensitive: true },
  { id: "buyback", phrases: ["Buyback", "buyback"], target: { slug: "customer-buyback" }, caseSensitive: true },
  { id: "kyc-aml", phrases: ["KYC", "AML"], target: { slug: "kyc-aml" }, caseSensitive: true, pendingSop: true }
];
function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function termRegExp(term) {
  const phrases = [...term.phrases].sort((a, b) => b.length - a.length).map(escapeRegExp2);
  return new RegExp(`(?<![\\w-])(?:${phrases.join("|")})(?![\\w-])`, term.caseSensitive ? "g" : "gi");
}
function linkableText(markdown) {
  return mapOutsideCode(
    markdown,
    (text) => text.replace(/\[\[[^\]]*\]\]/g, " ").replace(/\[TODO:?[^\]]*\]/gi, " ").replace(/\[[^\]]*\]\([^)]*\)/g, " ").replace(/^#{1,6}\s.*$/gm, " ")
  ).split("`").filter((_, index) => index % 2 === 0).join(" ");
}
function planAutolinks(sections, currentSlug, isAvailable, terms = KB_TERMS) {
  const plan = /* @__PURE__ */ new Map();
  const used = /* @__PURE__ */ new Set();
  const candidates = terms.filter((term) => term.target.slug !== currentSlug && isAvailable(term.target));
  for (const section of sections) {
    if (section.anchor === "related") continue;
    const text = linkableText(section.markdown);
    const linked = [];
    for (const term of candidates) {
      if (used.has(term.id)) continue;
      if (termRegExp(term).test(text)) {
        used.add(term.id);
        linked.push(term);
      }
    }
    if (linked.length > 0) plan.set(section.anchor, linked);
  }
  return plan;
}

// src/kb-review.ts
var KB_REVIEW_MONTHS = 6;
var KB_REVIEW_WARNING_DAYS = 30;
var DAY_MS = 24 * 60 * 60 * 1e3;
function parseDay(day) {
  return /* @__PURE__ */ new Date(`${day}T00:00:00.000Z`);
}
function kbReviewDueOn(contentUpdatedOn, months = KB_REVIEW_MONTHS) {
  const start = parseDay(contentUpdatedOn);
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth() + months;
  const lastDayOfTarget = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const due = new Date(Date.UTC(year, month, Math.min(start.getUTCDate(), lastDayOfTarget)));
  return due.toISOString().slice(0, 10);
}
function kbReviewStatus(contentUpdatedOn, now = /* @__PURE__ */ new Date()) {
  const dueOn = kbReviewDueOn(contentUpdatedOn);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysUntilDue = Math.round((parseDay(dueOn).getTime() - today) / DAY_MS);
  return {
    dueOn,
    daysUntilDue,
    state: daysUntilDue < 0 ? "overdue" : daysUntilDue <= KB_REVIEW_WARNING_DAYS ? "due-soon" : "ok"
  };
}

// src/ai.schema.ts
var import_zod13 = require("zod");
var AiModeEnum = import_zod13.z.enum(["procedures", "email", "whatsapp"]);
var AI_QUESTION_MAX_LENGTH = 500;
var AI_MESSAGE_MAX_LENGTH = 4e3;
function aiInputLimit(mode) {
  return mode === "procedures" ? AI_QUESTION_MAX_LENGTH : AI_MESSAGE_MAX_LENGTH;
}
var AskRequestSchema = import_zod13.z.object({
  /** A question (procedures) or the customer's pasted message (email, whatsapp). */
  question: import_zod13.z.string().trim().min(1).max(AI_MESSAGE_MAX_LENGTH),
  mode: AiModeEnum.default("procedures"),
  /**
   * The spot the product table is quoting from, when the user has frozen or typed one — otherwise
   * the live spot is used. Sent so a price the assistant quotes matches the price on screen.
   */
  spotOverrides: RecalculateOverridesSchema.optional()
}).refine((request) => request.question.length <= aiInputLimit(request.mode), {
  path: ["question"],
  message: "That is too long for a question. Keep it under 500 characters."
});
var AiAnswerStatusEnum = import_zod13.z.enum(["answered", "refused", "uncited"]);
var AiCitationSchema = import_zod13.z.object({
  slug: import_zod13.z.string(),
  anchor: import_zod13.z.string().nullable(),
  title: import_zod13.z.string(),
  heading: import_zod13.z.string().nullable()
});
var AiUsageSchema = import_zod13.z.object({
  inputTokens: import_zod13.z.number().int(),
  /** The part of the input served from OpenAI's prompt cache (billed at a fraction). */
  cachedInputTokens: import_zod13.z.number().int(),
  outputTokens: import_zod13.z.number().int()
});
var AskResponseSchema = import_zod13.z.object({
  /** Markdown. Citations are left in as `[[slug#section]]`, which the reader turns into links. */
  answer: import_zod13.z.string(),
  mode: AiModeEnum,
  status: AiAnswerStatusEnum,
  citations: import_zod13.z.array(AiCitationSchema),
  model: import_zod13.z.string(),
  usage: AiUsageSchema,
  latencyMs: import_zod13.z.number().int(),
  /** Which SOPs the answer was based on — the audit trail for "what did it know when it said that?". */
  corpus: import_zod13.z.object({ documents: import_zod13.z.number().int(), hash: import_zod13.z.string() }),
  /** Served from the answer cache: no model call, so usage is zero. */
  cached: import_zod13.z.boolean(),
  /** Email/WhatsApp only: notes for the staff member (what the reply assumes, what to check), apart from the message to send. `answer` is the message itself. */
  notes: import_zod13.z.string().nullable(),
  /** Things to check before relying on the answer, e.g. a figure that did not come from a price lookup, or prices that may be out of date. */
  warnings: import_zod13.z.array(import_zod13.z.string()),
  /** Which live lookups the answer used (getSpot, findProductPrices). Empty for a pure SOP answer. */
  toolsUsed: import_zod13.z.array(import_zod13.z.string())
});
var AiStatusSchema = import_zod13.z.object({
  enabled: import_zod13.z.boolean(),
  model: import_zod13.z.string()
});
var AskStreamEventSchema = import_zod13.z.discriminatedUnion("type", [
  import_zod13.z.object({ type: import_zod13.z.literal("delta"), text: import_zod13.z.string() }),
  import_zod13.z.object({ type: import_zod13.z.literal("tool"), name: import_zod13.z.string() }),
  import_zod13.z.object({ type: import_zod13.z.literal("done"), response: AskResponseSchema }),
  import_zod13.z.object({ type: import_zod13.z.literal("error"), status: import_zod13.z.number().int(), message: import_zod13.z.string() })
]);

// src/admin.schema.ts
var import_zod14 = require("zod");
var HealthStatusEnum = import_zod14.z.enum(["up", "degraded", "down"]);
var HealthItemSchema = import_zod14.z.object({
  key: import_zod14.z.string(),
  label: import_zod14.z.string(),
  status: HealthStatusEnum,
  /** One plain-language line: a measurement, or the reason it is not healthy. */
  detail: import_zod14.z.string()
});
var HourlyStatsSchema = import_zod14.z.object({
  hour: import_zod14.z.string(),
  requests: import_zod14.z.number(),
  clientErrors: import_zod14.z.number(),
  serverErrors: import_zod14.z.number(),
  avgLatencyMs: import_zod14.z.number(),
  logins: import_zod14.z.number(),
  failedLogins: import_zod14.z.number()
});
var RouteStatsSchema = import_zod14.z.object({
  route: import_zod14.z.string(),
  count: import_zod14.z.number(),
  errors: import_zod14.z.number(),
  avgLatencyMs: import_zod14.z.number()
});
var TableSizeSchema = import_zod14.z.object({
  name: import_zod14.z.string(),
  bytes: import_zod14.z.number(),
  rows: import_zod14.z.number()
});
var AdminOverviewSchema = import_zod14.z.object({
  generatedAt: import_zod14.z.string(),
  uptimeSeconds: import_zod14.z.number(),
  nodeVersion: import_zod14.z.string(),
  environment: import_zod14.z.string(),
  aiEnabled: import_zod14.z.boolean(),
  health: import_zod14.z.array(HealthItemSchema),
  /** False when Redis is down: the traffic history below is then empty rather than wrong. */
  metricsAvailable: import_zod14.z.boolean(),
  hours: import_zod14.z.array(HourlyStatsSchema),
  topRoutes: import_zod14.z.array(RouteStatsSchema),
  databaseBytes: import_zod14.z.number(),
  tables: import_zod14.z.array(TableSizeSchema),
  usersByRole: import_zod14.z.array(import_zod14.z.object({ role: import_zod14.z.string(), count: import_zod14.z.number() })),
  activeUsers: import_zod14.z.number(),
  errorsByKind: import_zod14.z.array(import_zod14.z.object({ kind: import_zod14.z.string(), count: import_zod14.z.number() }))
});
var LogLevelEnum = import_zod14.z.enum(["trace", "debug", "info", "warn", "error", "fatal"]);
var AdminLogEntrySchema = import_zod14.z.object({
  id: import_zod14.z.number(),
  /** Epoch milliseconds. */
  time: import_zod14.z.number(),
  level: LogLevelEnum,
  message: import_zod14.z.string(),
  context: import_zod14.z.string().nullable(),
  method: import_zod14.z.string().nullable(),
  url: import_zod14.z.string().nullable(),
  status: import_zod14.z.number().nullable(),
  responseTimeMs: import_zod14.z.number().nullable(),
  /** Everything else pino recorded on the line, for the expanded view. */
  extra: import_zod14.z.record(import_zod14.z.string(), import_zod14.z.unknown())
});
var AdminLogsResponseSchema = import_zod14.z.object({
  entries: import_zod14.z.array(AdminLogEntrySchema),
  capacity: import_zod14.z.number()
});
var AuditEntrySchema = import_zod14.z.object({
  at: import_zod14.z.string(),
  user: import_zod14.z.string(),
  action: import_zod14.z.string(),
  detail: import_zod14.z.string()
});
var AuditLogResponseSchema = import_zod14.z.object({
  entries: import_zod14.z.array(AuditEntrySchema),
  persisted: import_zod14.z.boolean()
});
var ApiEndpointParameterSchema = import_zod14.z.object({
  name: import_zod14.z.string(),
  in: import_zod14.z.enum(["path", "query", "header"]),
  required: import_zod14.z.boolean(),
  type: import_zod14.z.string(),
  options: import_zod14.z.array(import_zod14.z.string()).optional(),
  description: import_zod14.z.string().optional()
});
var ApiEndpointSchema = import_zod14.z.object({
  method: import_zod14.z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: import_zod14.z.string(),
  summary: import_zod14.z.string(),
  description: import_zod14.z.string().optional(),
  tag: import_zod14.z.string(),
  requiresAuth: import_zod14.z.boolean(),
  parameters: import_zod14.z.array(ApiEndpointParameterSchema),
  /** A starter JSON body built from the request schema; null when the route takes none. */
  bodyExample: import_zod14.z.unknown().nullable()
});
var ApiCatalogueSchema = import_zod14.z.object({
  endpoints: import_zod14.z.array(ApiEndpointSchema)
});
var DbColumnSchema = import_zod14.z.object({
  name: import_zod14.z.string(),
  type: import_zod14.z.string(),
  nullable: import_zod14.z.boolean(),
  hasDefault: import_zod14.z.boolean(),
  isPrimaryKey: import_zod14.z.boolean(),
  /** Generated by the database, or never shown at all — cannot be set from the browser. */
  readOnly: import_zod14.z.boolean(),
  /** The allowed values when the column is a Postgres enum. */
  enumValues: import_zod14.z.array(import_zod14.z.string()).optional()
});
var DbTableSummarySchema = import_zod14.z.object({
  name: import_zod14.z.string(),
  rows: import_zod14.z.number(),
  bytes: import_zod14.z.number(),
  writable: import_zod14.z.boolean()
});
var DbTablesResponseSchema = import_zod14.z.object({
  tables: import_zod14.z.array(DbTableSummarySchema)
});
var DbRowsResponseSchema = import_zod14.z.object({
  table: import_zod14.z.string(),
  writable: import_zod14.z.boolean(),
  columns: import_zod14.z.array(DbColumnSchema),
  rows: import_zod14.z.array(import_zod14.z.record(import_zod14.z.string(), import_zod14.z.unknown())),
  total: import_zod14.z.number(),
  page: import_zod14.z.number(),
  pageSize: import_zod14.z.number()
});
var DbValueSchema = import_zod14.z.union([import_zod14.z.string(), import_zod14.z.number(), import_zod14.z.boolean(), import_zod14.z.null(), import_zod14.z.record(import_zod14.z.string(), import_zod14.z.unknown()), import_zod14.z.array(import_zod14.z.unknown())]);
var DbInsertRequestSchema = import_zod14.z.object({
  values: import_zod14.z.record(import_zod14.z.string(), DbValueSchema)
});
var DbUpdateRequestSchema = import_zod14.z.object({
  /** The row's primary-key column(s) and current value(s). */
  key: import_zod14.z.record(import_zod14.z.string(), import_zod14.z.union([import_zod14.z.string(), import_zod14.z.number()])),
  values: import_zod14.z.record(import_zod14.z.string(), DbValueSchema)
});
var DbDeleteRequestSchema = import_zod14.z.object({
  key: import_zod14.z.record(import_zod14.z.string(), import_zod14.z.union([import_zod14.z.string(), import_zod14.z.number()]))
});
var DbRowResponseSchema = import_zod14.z.object({
  row: import_zod14.z.record(import_zod14.z.string(), import_zod14.z.unknown())
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AI_MESSAGE_MAX_LENGTH,
  AI_QUESTION_MAX_LENGTH,
  AdminLogEntrySchema,
  AdminLogsResponseSchema,
  AdminOverviewSchema,
  AiAnswerStatusEnum,
  AiCitationSchema,
  AiModeEnum,
  AiStatusSchema,
  AiUsageSchema,
  ApiCatalogueSchema,
  ApiEndpointParameterSchema,
  ApiEndpointSchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  AskRequestSchema,
  AskResponseSchema,
  AskStreamEventSchema,
  AuditEntrySchema,
  AuditLogResponseSchema,
  AuthResponseSchema,
  BranchSchema,
  ChangePasswordSchema,
  ClientErrorReportBatchSchema,
  ClientErrorReportSchema,
  CreateBranchRequestSchema,
  CreateProductDtoSchema,
  CreateSpotPriceDtoSchema,
  CreateUserRequestSchema,
  CurrencyEnum,
  DbColumnSchema,
  DbDeleteRequestSchema,
  DbInsertRequestSchema,
  DbRowResponseSchema,
  DbRowsResponseSchema,
  DbTableSummarySchema,
  DbTablesResponseSchema,
  DbUpdateRequestSchema,
  ErrorLogEntrySchema,
  ErrorLogKindEnum,
  ErrorLogSeverityEnum,
  ErrorLogSourceEnum,
  FetchAttemptSchema,
  FetchMetricsSchema,
  FetchSourceEnum,
  FetchTriggerEnum,
  GRAMS_PER_TROY_OUNCE,
  HealthCheckSchema,
  HealthItemSchema,
  HealthStatusEnum,
  HistoricCloseQuerySchema,
  HistoricSpotSchema,
  HourlyStatsSchema,
  KB_CATEGORIES,
  KB_CATEGORY_INFO,
  KB_GUIDE,
  KB_REVIEW_MONTHS,
  KB_REVIEW_WARNING_DAYS,
  KB_TERMS,
  KB_UNRESOLVED_HREF_PREFIX,
  KbCategoryEnum,
  KbDocumentListResponseSchema,
  KbDocumentSchema,
  KbFrontmatterSchema,
  KbJurisdictionEnum,
  KbSlugSchema,
  KbStatusEnum,
  LogLevelEnum,
  LoginRequestSchema,
  LoginResponseSchema,
  LoginSchema,
  MELT_CATEGORIES,
  MarketDataResponseSchema,
  MeltCalculatorRequestSchema,
  MeltCalculatorResponseSchema,
  MeltCategoryDataSchema,
  MeltCategoryKeyEnum,
  MessageResponseSchema,
  MetalSymbolSchema,
  MetalTypeEnum,
  PORTFOLIO_MAX_QTY,
  PORTFOLIO_SMALL_INVESTOR_LIMIT,
  PaginationSchema,
  Platform,
  PortfolioBuildRequestSchema,
  PortfolioBuildResponseSchema,
  PortfolioLineItemSchema,
  PortfolioProductTypeFilterEnum,
  PortfolioStrategyResultSchema,
  PriorityStrengthEnum,
  ProductArraySchema,
  ProductCategoryEnum,
  ProductMapSchema,
  ProductSchema,
  ProductsSchema,
  ProfitAnalysisMissingFieldEnum,
  ProfitAnalysisRequestSchema,
  ProfitAnalysisResponseSchema,
  RawProductSchema,
  RawSpotPriceSchema,
  RecalculateOverridesSchema,
  RefreshResponseSchema,
  RegisterSchema,
  RouteStatsSchema,
  SessionUserRoleEnum,
  SessionUserSchema,
  SetKbStatusRequestSchema,
  SpotPriceArraySchema,
  SpotPriceMapSchema,
  SpotPriceSchema,
  TRADE_METAL_SLIDER_BOUNDS,
  TableSizeSchema,
  TaskQueryParamsSchema,
  TaskStatusSchema,
  TradeBootstrapResponseSchema,
  TradeCartItemRequestSchema,
  TradeCartLineSchema,
  TradeCartRequestSchema,
  TradeCartResponseSchema,
  TradeProductSchema,
  TradeTransactionTypeEnum,
  UpdateKbDocumentRequestSchema,
  UpdateProductFullDtoSchema,
  UpdateStockRequestSchema,
  UserProfileSchema,
  UserRole,
  UserSchema,
  UserStatus,
  aiInputLimit,
  buildPortfolioStrategies,
  computeCurrentBuybackValue,
  computeMeltValue,
  computeProfit,
  computeRequiredSpotForTarget,
  computeTransactionPrice,
  createErrorReference,
  findBrokenLinks,
  findLinks,
  findTodos,
  guideLibraryTargets,
  headingAnchor,
  indexKbDocument,
  kbArticlePath,
  kbReviewDueOn,
  kbReviewStatus,
  mapOutsideCode,
  normalizeProductName,
  parseKbDocument,
  planAutolinks,
  rewriteKbLinks,
  roundBuyPrice,
  roundSellPrice,
  searchKb,
  solveMissingPurchaseField,
  splitFrontmatter,
  splitSections,
  termRegExp,
  toPlainText
});
