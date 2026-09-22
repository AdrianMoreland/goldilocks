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
  ApiErrorResponseSchema: () => ApiErrorResponseSchema,
  ApiSuccessResponseSchema: () => ApiSuccessResponseSchema,
  AuthResponseSchema: () => AuthResponseSchema,
  BranchSchema: () => BranchSchema,
  ChangePasswordSchema: () => ChangePasswordSchema,
  CreateBranchRequestSchema: () => CreateBranchRequestSchema,
  CreateProductDtoSchema: () => CreateProductDtoSchema,
  CreateSpotPriceDtoSchema: () => CreateSpotPriceDtoSchema,
  CreateUserRequestSchema: () => CreateUserRequestSchema,
  CurrencyEnum: () => CurrencyEnum,
  FetchAttemptSchema: () => FetchAttemptSchema,
  FetchMetricsSchema: () => FetchMetricsSchema,
  FetchSourceEnum: () => FetchSourceEnum,
  FetchTriggerEnum: () => FetchTriggerEnum,
  GRAMS_PER_TROY_OUNCE: () => GRAMS_PER_TROY_OUNCE,
  HealthCheckSchema: () => HealthCheckSchema,
  HistoricSpotSchema: () => HistoricSpotSchema,
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
  ProductMapSchema: () => ProductMapSchema,
  ProductSchema: () => ProductSchema,
  ProductsSchema: () => ProductsSchema,
  ProfitAnalysisMissingFieldEnum: () => ProfitAnalysisMissingFieldEnum,
  ProfitAnalysisRequestSchema: () => ProfitAnalysisRequestSchema,
  ProfitAnalysisResponseSchema: () => ProfitAnalysisResponseSchema,
  RawProductSchema: () => RawProductSchema,
  RawSpotPriceSchema: () => RawSpotPriceSchema,
  RefreshResponseSchema: () => RefreshResponseSchema,
  RegisterSchema: () => RegisterSchema,
  SessionUserRoleEnum: () => SessionUserRoleEnum,
  SessionUserSchema: () => SessionUserSchema,
  SpotPriceArraySchema: () => SpotPriceArraySchema,
  SpotPriceMapSchema: () => SpotPriceMapSchema,
  SpotPriceSchema: () => SpotPriceSchema,
  TRADE_METAL_SLIDER_BOUNDS: () => TRADE_METAL_SLIDER_BOUNDS,
  TaskQueryParamsSchema: () => TaskQueryParamsSchema,
  TaskStatusSchema: () => TaskStatusSchema,
  TradeBootstrapResponseSchema: () => TradeBootstrapResponseSchema,
  TradeCartItemRequestSchema: () => TradeCartItemRequestSchema,
  TradeCartLineSchema: () => TradeCartLineSchema,
  TradeCartRequestSchema: () => TradeCartRequestSchema,
  TradeCartResponseSchema: () => TradeCartResponseSchema,
  TradeProductSchema: () => TradeProductSchema,
  TradeTransactionTypeEnum: () => TradeTransactionTypeEnum,
  UpdateProductFullDtoSchema: () => UpdateProductFullDtoSchema,
  UserProfileSchema: () => UserProfileSchema,
  UserRole: () => UserRole,
  UserSchema: () => UserSchema,
  UserStatus: () => UserStatus,
  buildPortfolioStrategies: () => buildPortfolioStrategies,
  computeCurrentBuybackValue: () => computeCurrentBuybackValue,
  computeMeltValue: () => computeMeltValue,
  computeProfit: () => computeProfit,
  computeRequiredSpotForTarget: () => computeRequiredSpotForTarget,
  computeTransactionPrice: () => computeTransactionPrice,
  solveMissingPurchaseField: () => solveMissingPurchaseField
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
  description: import_zod2.z.string().optional()
});
var UpdateProductFullDtoSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().extend({
  // still allow explicit optional overrides for calculated/update-only fields
  priceSell: import_zod2.z.number().optional(),
  priceBuy: import_zod2.z.number().optional(),
  isActive: import_zod2.z.boolean().optional()
});
var ProductsSchema = import_zod2.z.array(ProductSchema);
var ProductArraySchema = import_zod2.z.array(ProductSchema);
var ProductMapSchema = import_zod2.z.record(MetalTypeEnum, ProductSchema);

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
  weight: import_zod6.z.coerce.number().positive()
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
  priorityStrength: PriorityStrengthEnum
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  AuthResponseSchema,
  BranchSchema,
  ChangePasswordSchema,
  CreateBranchRequestSchema,
  CreateProductDtoSchema,
  CreateSpotPriceDtoSchema,
  CreateUserRequestSchema,
  CurrencyEnum,
  FetchAttemptSchema,
  FetchMetricsSchema,
  FetchSourceEnum,
  FetchTriggerEnum,
  GRAMS_PER_TROY_OUNCE,
  HealthCheckSchema,
  HistoricSpotSchema,
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
  ProductMapSchema,
  ProductSchema,
  ProductsSchema,
  ProfitAnalysisMissingFieldEnum,
  ProfitAnalysisRequestSchema,
  ProfitAnalysisResponseSchema,
  RawProductSchema,
  RawSpotPriceSchema,
  RefreshResponseSchema,
  RegisterSchema,
  SessionUserRoleEnum,
  SessionUserSchema,
  SpotPriceArraySchema,
  SpotPriceMapSchema,
  SpotPriceSchema,
  TRADE_METAL_SLIDER_BOUNDS,
  TaskQueryParamsSchema,
  TaskStatusSchema,
  TradeBootstrapResponseSchema,
  TradeCartItemRequestSchema,
  TradeCartLineSchema,
  TradeCartRequestSchema,
  TradeCartResponseSchema,
  TradeProductSchema,
  TradeTransactionTypeEnum,
  UpdateProductFullDtoSchema,
  UserProfileSchema,
  UserRole,
  UserSchema,
  UserStatus,
  buildPortfolioStrategies,
  computeCurrentBuybackValue,
  computeMeltValue,
  computeProfit,
  computeRequiredSpotForTarget,
  computeTransactionPrice,
  solveMissingPurchaseField
});
