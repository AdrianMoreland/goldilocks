// src/product.schema.ts
import { z as z2 } from "zod";

// src/spot-price.schema.ts
import { z } from "zod";
var TaskStatusSchema = z.enum(["todo", "in-progress", "done"]);
var MetalTypeEnum = z.enum(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]);
var MetalSymbolSchema = z.enum(["XAU", "XAG", "XPT", "XPD"]);
var FetchSourceEnum = z.enum(["cache", "db", "live"]);
var SpotPriceSchema = z.object({
  id: z.string(),
  metalType: MetalTypeEnum,
  priceEur: z.number(),
  priceGbp: z.number(),
  previousClose: z.number(),
  change: z.number(),
  changePercent: z.number(),
  source: z.string(),
  timestamp: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  fetchSource: FetchSourceEnum.optional(),
  /** True when a live fetch was actually attempted for this metal and failed, and this price is the last-known-good value served instead — distinct from a cache/DB hit that's just the normal cascade preference. */
  isFallback: z.boolean().optional()
});
var RawSpotPriceSchema = z.object({
  id: z.string(),
  metalType: MetalTypeEnum,
  priceEur: z.number(),
  priceGbp: z.number(),
  source: z.string(),
  timestamp: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  fetchSource: FetchSourceEnum.optional(),
  isFallback: z.boolean().optional()
});
var HistoricSpotSchema = z.object({
  metalType: MetalTypeEnum,
  priceEur: z.number(),
  priceGbp: z.number(),
  timestamp: z.iso.datetime()
});
var CreateSpotPriceDtoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().optional().default("")
});
var SpotPriceArraySchema = z.array(SpotPriceSchema);
var SpotPriceMapSchema = z.record(MetalTypeEnum, SpotPriceSchema);
var TaskQueryParamsSchema = z.object({
  status: TaskStatusSchema.optional(),
  search: z.string().optional()
});

// src/product.schema.ts
var isoDateString = z2.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") return val;
  return void 0;
}, z2.iso.datetime());
var ProductCategoryEnum = z2.enum(["BAR", "COIN"]);
var ProductSchema = z2.object({
  id: z2.number(),
  sku: z2.string(),
  name: z2.string(),
  metalType: MetalTypeEnum,
  weight: z2.number(),
  spotPrice: z2.number(),
  spreadBuy: z2.number(),
  spreadSell: z2.number(),
  vatRate: z2.number(),
  category: ProductCategoryEnum.nullable().optional(),
  description: z2.string(),
  // Calculated fields
  // Raw market value of this product's own weight at the current spot price
  // (spot / troy oz * weight) — no premium/discount/VAT applied. Distinct
  // from `spotPrice`, which is the flat per-ounce metal price and is the
  // same for every product of a metal; this is what the product table's
  // "Market Price" column shows per row.
  marketValue: z2.number(),
  priceSell: z2.number(),
  priceSellVatExcl: z2.number(),
  priceBuy: z2.number(),
  stock: z2.number(),
  isActive: z2.boolean(),
  updatedAt: isoDateString,
  createdAt: isoDateString
});
var RawProductSchema = z2.object({
  id: z2.number(),
  sku: z2.string(),
  name: z2.string(),
  metalType: MetalTypeEnum,
  weight: z2.number(),
  spreadBuy: z2.number(),
  spreadSell: z2.number(),
  vatRate: z2.number(),
  stock: z2.number(),
  isActive: z2.boolean(),
  category: ProductCategoryEnum.nullable().optional(),
  description: z2.string().nullable().optional(),
  createdAt: isoDateString,
  updatedAt: isoDateString
});
var CreateProductDtoSchema = z2.object({
  sku: z2.string(),
  name: z2.string(),
  metalType: MetalTypeEnum,
  weight: z2.number(),
  spreadBuy: z2.number(),
  spreadSell: z2.number(),
  vatRate: z2.number(),
  stock: z2.number(),
  category: ProductCategoryEnum.nullable().optional(),
  description: z2.string().optional()
});
var UpdateProductFullDtoSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().extend({
  // still allow explicit optional overrides for calculated/update-only fields
  priceSell: z2.number().optional(),
  priceBuy: z2.number().optional(),
  isActive: z2.boolean().optional()
});
var UpdateStockRequestSchema = z2.object({
  stock_quantity: z2.number().int().nonnegative()
});
var ProductsSchema = z2.array(ProductSchema);
var ProductArraySchema = z2.array(ProductSchema);
var ProductMapSchema = z2.record(MetalTypeEnum, ProductSchema);

// src/product-name.ts
var WEIGHT_SPACE_RE = /(\d+(?:[./]\d+)?)\s+(oz|kg|g)\b/gi;
function normalizeProductName(name) {
  return name.replace(WEIGHT_SPACE_RE, "$1$2").trim();
}

// src/common.schema.ts
import { z as z3 } from "zod";
var ApiSuccessResponseSchema = (dataSchema) => z3.object({
  success: z3.literal(true),
  data: dataSchema,
  message: z3.string().optional()
});
var ApiErrorResponseSchema = z3.object({
  success: z3.literal(false),
  error: z3.object({
    code: z3.string(),
    message: z3.string(),
    details: z3.any().optional()
  }),
  timestamp: z3.iso.datetime()
});
var PaginationSchema = z3.object({
  page: z3.coerce.number().int().min(1).default(1),
  limit: z3.coerce.number().int().min(1).max(100).default(20)
});
var HealthCheckSchema = z3.object({
  status: z3.literal("ok"),
  timestamp: z3.iso.datetime(),
  uptime: z3.number(),
  environment: z3.string()
});

// src/auth.schemas.ts
import { z as z4 } from "zod";
var UserRole = z4.enum(["ADMIN", "USER", "MANAGER"]);
var UserStatus = z4.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
var Platform = z4.enum(["web", "mobile", "admin"]);
var UserSchema = z4.object({
  id: z4.string(),
  email: z4.email("Invalid email format"),
  username: z4.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  role: UserRole,
  status: UserStatus,
  createdAt: z4.date(),
  updatedAt: z4.date()
});
var LoginSchema = z4.object({
  email: z4.email("Please enter a valid email"),
  password: z4.string().min(1, "Password is required"),
  platform: Platform,
  rememberMe: z4.boolean().optional().default(false)
});
var RegisterSchema = z4.object({
  email: z4.email("Please enter a valid email"),
  username: z4.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z4.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z4.string(),
  platform: Platform
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
var ChangePasswordSchema = z4.object({
  currentPassword: z4.string().min(1, "Current password is required"),
  newPassword: z4.string().min(8, "New password must be at least 8 characters").max(100, "New password must be less than 100 characters"),
  confirmNewPassword: z4.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"]
});
var AuthResponseSchema = z4.object({
  accessToken: z4.string(),
  refreshToken: z4.string(),
  user: UserSchema.omit({ createdAt: true, updatedAt: true }),
  expiresIn: z4.number()
});
var UserProfileSchema = z4.object({
  id: z4.uuid(),
  email: z4.email(),
  username: z4.string(),
  role: UserRole,
  status: UserStatus,
  createdAt: z4.iso.datetime()
});
var MessageResponseSchema = z4.object({
  message: z4.string()
});

// src/market-data.schema.ts
import { z as z5 } from "zod";
var MarketDataResponseSchema = z5.object({
  spotPrices: z5.array(SpotPriceSchema),
  historicSpot: z5.array(HistoricSpotSchema),
  products: z5.array(ProductSchema),
  /** The actual timestamp of the spot-price snapshot being shown — the oldest `timestamp` across spotPrices, not "when the request happened". A cache/DB hit can be minutes old even though the request itself just ran. */
  fetchedAt: z5.iso.datetime(),
  /**
   * Set when one or more metals fell all the way through cache → DB → the
   * live API without finding a usable (non-zero, non-stale) price, so the
   * UI ends up showing €0.00 for them. Null when every metal resolved to a
   * real price. The frontend surfaces this as a toast rather than silently
   * showing zero with no explanation.
   */
  priceWarning: z5.string().nullable(),
  /** Same information as priceWarning, structured — lets the UI mark individual metal cards as failed rather than only showing one combined text warning. */
  degradedMetals: z5.array(MetalTypeEnum)
});
var RefreshResponseSchema = z5.object({
  spot: SpotPriceSchema,
  products: z5.array(ProductSchema),
  fetchedAt: z5.iso.datetime()
});
var RecalculateOverridesSchema = z5.object({
  GOLD: z5.number().positive().optional(),
  SILVER: z5.number().positive().optional(),
  PLATINUM: z5.number().positive().optional(),
  PALLADIUM: z5.number().positive().optional()
});
var HistoricCloseQuerySchema = z5.object({
  date: z5.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD").refine((value) => {
    const parsed = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
  }, "Not a real calendar date").optional()
});

// src/trade.schema.ts
import { z as z6 } from "zod";
var TradeTransactionTypeEnum = z6.enum(["buying", "selling"]);
var TradeProductSchema = z6.object({
  id: z6.number(),
  sku: z6.string(),
  name: z6.string(),
  weight: z6.number(),
  metalType: MetalTypeEnum,
  premiumPct: z6.number(),
  discountPct: z6.number()
});
var TradeBootstrapResponseSchema = z6.object({
  metalType: MetalTypeEnum,
  spot: z6.number(),
  minSpot: z6.number(),
  maxSpot: z6.number(),
  products: z6.array(TradeProductSchema)
});
var TradeCartItemRequestSchema = z6.object({
  productId: z6.number(),
  quantity: z6.coerce.number().int().min(1).default(1),
  percent: z6.coerce.number().min(0)
});
var TradeCartRequestSchema = z6.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  customSpot: z6.coerce.number().positive().optional(),
  items: z6.array(TradeCartItemRequestSchema).min(1)
});
var TradeCartLineSchema = z6.object({
  productId: z6.number(),
  product: z6.string(),
  sku: z6.string(),
  weight: z6.number(),
  quantity: z6.number(),
  percent: z6.number(),
  unitPrice: z6.number(),
  lineTotal: z6.number()
});
var TradeCartResponseSchema = z6.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  spot: z6.number(),
  lines: z6.array(TradeCartLineSchema),
  totalWeight: z6.number(),
  averagePerGram: z6.number(),
  totalPrice: z6.number()
});
var MeltCategoryKeyEnum = z6.enum(["24ct", "22ct", "90%", "Silver"]);
var MeltCategoryDataSchema = z6.object({
  metal: MetalTypeEnum,
  meltFactor: z6.number(),
  purity: z6.number()
});
var MeltCalculatorRequestSchema = z6.object({
  category: MeltCategoryKeyEnum,
  weight: z6.coerce.number().positive(),
  /** The spot the user is quoting from (a card override) — omitted means the server's latest market spot. */
  customSpot: z6.number().positive().optional()
});
var MeltCalculatorResponseSchema = z6.object({
  category: MeltCategoryKeyEnum,
  metal: MetalTypeEnum,
  spot: z6.number(),
  spotPerGram: z6.number(),
  meltFactor: z6.number(),
  purity: z6.number(),
  weight: z6.number(),
  meltValue: z6.number()
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
import { z as z7 } from "zod";
var ProfitAnalysisMissingFieldEnum = z7.enum(["spot", "premium", "price"]);
var ProfitAnalysisRequestSchema = z7.object({
  metalType: MetalTypeEnum,
  productId: z7.number(),
  purchaseSpot: z7.coerce.number(),
  purchasePremium: z7.coerce.number(),
  purchasePrice: z7.coerce.number(),
  missingField: ProfitAnalysisMissingFieldEnum,
  currentSpot: z7.coerce.number().positive(),
  currentDiscount: z7.coerce.number().min(0).max(99.99),
  targetProfit: z7.coerce.number().min(0)
});
var ProfitAnalysisResponseSchema = z7.object({
  product: z7.string(),
  productMultiplier: z7.number(),
  purchaseSpot: z7.number(),
  purchasePremium: z7.number(),
  purchasePrice: z7.number(),
  currentSpot: z7.number(),
  currentDiscount: z7.number(),
  currentBuybackValue: z7.number(),
  profit: z7.number(),
  profitPercent: z7.number(),
  requiredSpot: z7.number(),
  requiredPrice: z7.number(),
  targetProfit: z7.number(),
  targetReturn: z7.number()
});
var PortfolioProductTypeFilterEnum = z7.enum(["either", "bar", "coin"]);
var PriorityStrengthEnum = z7.enum(["none", "low", "medium", "high"]);
var PortfolioBuildRequestSchema = z7.object({
  metalType: MetalTypeEnum,
  budget: z7.coerce.number().positive(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: z7.number().optional(),
  priorityStrength: PriorityStrengthEnum,
  /** The spot the user is quoting from (a card override) — omitted means the server's latest market spot. */
  customSpot: z7.number().positive().optional()
});
var PortfolioLineItemSchema = z7.object({
  product: z7.string(),
  quantity: z7.number(),
  weight: z7.number(),
  totalWeight: z7.number(),
  unitPrice: z7.number(),
  totalValue: z7.number(),
  premium: z7.number(),
  type: z7.enum(["bar", "coin"]),
  isPriority: z7.boolean()
});
var PortfolioStrategyResultSchema = z7.object({
  strategy: z7.object({
    id: z7.enum(["maximum", "balanced", "flexible"]),
    name: z7.string(),
    badge: z7.string(),
    description: z7.string()
  }),
  totalInvested: z7.number(),
  unspent: z7.number(),
  totalGrams: z7.number(),
  averagePerGram: z7.number(),
  averagePremium: z7.number(),
  pieces: z7.number(),
  largestPositionPercent: z7.number(),
  flexibilityScore: z7.number(),
  priorityQuantity: z7.number(),
  priorityShare: z7.number(),
  items: z7.array(PortfolioLineItemSchema)
});
var PortfolioBuildResponseSchema = z7.object({
  metalType: MetalTypeEnum,
  budget: z7.number(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: z7.number().nullable(),
  priorityStrength: PriorityStrengthEnum,
  results: z7.array(PortfolioStrategyResultSchema)
});

// src/pricing-math.ts
var GRAMS_PER_TROY_OUNCE = 31.1034768;
var SPOT_STALE_AFTER_MS = 15 * 60 * 1e3;
function roundSellPrice(value) {
  return Math.ceil(Math.round(value * 100) / 100);
}
function roundBuyPrice(value) {
  return Math.floor(Math.round(value * 100) / 100);
}
function computeTransactionPrice(basePrice, transactionType, percent) {
  if (transactionType === "buying") {
    return roundSellPrice(basePrice * (1 + percent / 100));
  }
  return roundBuyPrice(basePrice * (1 - percent / 100));
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
import { z as z8 } from "zod";
var SessionUserRoleEnum = z8.enum(["ADMIN", "MANAGER", "SALES", "ACCOUNTING", "AUDITOR"]);
var SessionUserSchema = z8.object({
  id: z8.string(),
  email: z8.string(),
  firstName: z8.string(),
  lastName: z8.string(),
  role: SessionUserRoleEnum,
  admin: z8.boolean()
});
var LoginRequestSchema = z8.object({
  email: z8.string().email(),
  password: z8.string().min(1)
});
var LoginResponseSchema = z8.object({
  accessToken: z8.string(),
  user: SessionUserSchema
});
var CreateUserRequestSchema = z8.object({
  email: z8.string().email(),
  password: z8.string().min(6, "Password must be at least 6 characters"),
  firstName: z8.string().min(1, "First name is required"),
  lastName: z8.string().min(1, "Last name is required"),
  role: SessionUserRoleEnum,
  admin: z8.boolean().default(false)
});

// src/branch.schema.ts
import { z as z9 } from "zod";
var CurrencyEnum = z9.enum(["EUR", "USD", "GBP"]);
var BranchSchema = z9.object({
  id: z9.number(),
  name: z9.string(),
  address: z9.string().nullable(),
  currency: CurrencyEnum,
  createdAt: z9.iso.datetime()
});
var CreateBranchRequestSchema = z9.object({
  name: z9.string().min(1, "Name is required"),
  address: z9.string().optional(),
  currency: CurrencyEnum.default("EUR")
});

// src/market-mode.schema.ts
import { z as z10 } from "zod";
var MarketModeStateSchema = z10.object({
  weekend: z10.boolean(),
  volatile: z10.boolean(),
  shortage: z10.boolean(),
  /** Who last changed it (display name); null if it has never been changed. */
  updatedBy: z10.string().nullable(),
  updatedAt: z10.iso.datetime().nullable()
});
var UpdateMarketModeRequestSchema = z10.object({
  weekend: z10.boolean(),
  volatile: z10.boolean(),
  shortage: z10.boolean()
});

// src/fetch-attempt.schema.ts
import { z as z11 } from "zod";
var FetchTriggerEnum = z11.enum(["CRON", "REFRESH", "RETRY", "LAUNCH_FALLBACK"]);
var FetchAttemptSchema = z11.object({
  id: z11.string(),
  attemptedAt: z11.iso.datetime(),
  durationMs: z11.number(),
  success: z11.boolean(),
  errorMessage: z11.string().nullable(),
  metalsResolved: z11.array(MetalTypeEnum),
  triggeredBy: FetchTriggerEnum
});
var FetchMetricsSchema = z11.object({
  /** Fraction (0-1) of external API calls in the last 24h that succeeded. 1 when there were none to judge. */
  successRate24h: z11.number(),
  totalAttempts24h: z11.number(),
  failureCount24h: z11.number(),
  avgLatencyMs: z11.number(),
  /** Fraction (0-1) of the launch-page-load cascade's cache reads that hit — in-memory since process start, not a 24h window. */
  cacheHitRatio: z11.number()
});

// src/error-log.schema.ts
import { z as z12 } from "zod";
var ErrorLogSourceEnum = z12.enum(["server", "client"]);
var ErrorLogSeverityEnum = z12.enum(["error", "warning"]);
var ErrorLogKindEnum = z12.enum(["database", "http", "network", "external-api", "response", "crash"]);
var ErrorLogEntrySchema = z12.object({
  id: z12.string(),
  /** Short code shown to staff in the error toast ("ref E-7F3K2"), to find the matching entry. */
  reference: z12.string(),
  at: z12.string(),
  source: ErrorLogSourceEnum,
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: z12.string(),
  detail: z12.string().nullable().optional(),
  statusCode: z12.number().nullable().optional(),
  method: z12.string().nullable().optional(),
  path: z12.string().nullable().optional(),
  /** Vendor/driver error code, e.g. Prisma's "P1001". */
  code: z12.string().nullable().optional(),
  stack: z12.string().nullable().optional(),
  user: z12.string().nullable().optional(),
  userAgent: z12.string().nullable().optional()
});
var ClientErrorReportSchema = z12.object({
  reference: z12.string().max(20),
  occurredAt: z12.string().max(40),
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: z12.string().max(500),
  detail: z12.string().max(4e3).optional(),
  statusCode: z12.number().int().optional(),
  method: z12.string().max(10).optional(),
  path: z12.string().max(500).optional(),
  stack: z12.string().max(4e3).optional()
});
var ClientErrorReportBatchSchema = z12.object({
  reports: z12.array(ClientErrorReportSchema).max(50)
});
function createErrorReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `E-${out}`;
}

// src/kb.schema.ts
import { z as z13 } from "zod";
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
var KbCategoryEnum = z13.enum(KB_CATEGORIES);
var KbJurisdictionEnum = z13.enum(["all", "IE", "UK", "ES"]);
var KbStatusEnum = z13.enum(["draft", "approved", "retired"]);
var KbSlugSchema = z13.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase, hyphenated");
var isoDay = z13.iso.date();
var KbFrontmatterSchema = z13.object({
  slug: KbSlugSchema,
  title: z13.string().trim().min(1),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: z13.string().trim().min(1),
  status: KbStatusEnum,
  version: z13.coerce.number().int().positive(),
  updatedAt: isoDay
});
var KbDocumentSchema = z13.object({
  slug: KbSlugSchema,
  title: z13.string(),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: z13.string(),
  status: KbStatusEnum,
  version: z13.number().int(),
  contentUpdatedOn: isoDay,
  markdown: z13.string()
});
var KbDocumentListResponseSchema = z13.object({
  documents: z13.array(KbDocumentSchema)
});
var UpdateKbDocumentRequestSchema = z13.object({
  title: z13.string().trim().min(1).max(200),
  owner: z13.string().trim().min(1).max(100),
  markdown: z13.string().trim().min(1).max(1e5)
});
var SetKbStatusRequestSchema = z13.object({ status: KbStatusEnum });
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
function kbArticlePath(slug2, anchor) {
  return `/knowledge/articles/${slug2}${anchor ? `#${anchor}` : ""}`;
}
var KB_UNRESOLVED_HREF_PREFIX = "#unresolved-sop:";
function rewriteKbLinks(markdown, resolve) {
  return mapOutsideCode(
    markdown,
    (text) => text.replace(LINK_PATTERN, (_raw, slug2, anchor) => {
      const ref = { slug: slug2, anchor: anchor ?? null };
      const resolved = resolve(ref);
      return resolved ? `[${resolved.label}](${resolved.href})` : `[${slug2}](${KB_UNRESOLVED_HREF_PREFIX}${slug2})`;
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
    (text) => text.replace(/\[\[([a-z0-9-]+)(?:#([a-z0-9-]+))?\]\]/g, (_m, slug2, anchor) => anchor ? anchor.replace(/-/g, " ") : slug2.replace(/-/g, " ")).replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "").replace(/^\s*\|?\s*[-:| ]+\|[-:| ]*$/gm, "").replace(/\|/g, " ").replace(/[*_~]/g, "").replace(/^#{1,6}\s+/gm, "")
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
import { z as z14 } from "zod";
var AiModeEnum = z14.enum(["procedures", "email", "whatsapp"]);
var AI_QUESTION_MAX_LENGTH = 500;
var AI_MESSAGE_MAX_LENGTH = 4e3;
function aiInputLimit(mode) {
  return mode === "procedures" ? AI_QUESTION_MAX_LENGTH : AI_MESSAGE_MAX_LENGTH;
}
var AskRequestSchema = z14.object({
  /** A question (procedures) or the customer's pasted message (email, whatsapp). */
  question: z14.string().trim().min(1).max(AI_MESSAGE_MAX_LENGTH),
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
var AiAnswerStatusEnum = z14.enum(["answered", "refused", "uncited"]);
var AiCitationSchema = z14.object({
  slug: z14.string(),
  anchor: z14.string().nullable(),
  title: z14.string(),
  heading: z14.string().nullable()
});
var AiUsageSchema = z14.object({
  inputTokens: z14.number().int(),
  /** The part of the input served from OpenAI's prompt cache (billed at a fraction). */
  cachedInputTokens: z14.number().int(),
  outputTokens: z14.number().int()
});
var AiSpotNoteSchema = z14.object({
  tone: z14.enum(["custom", "stale", "healthy"]),
  message: z14.string()
});
var AskResponseSchema = z14.object({
  /** Markdown. Citations are left in as `[[slug#section]]`, which the reader turns into links. */
  answer: z14.string(),
  mode: AiModeEnum,
  status: AiAnswerStatusEnum,
  citations: z14.array(AiCitationSchema),
  model: z14.string(),
  usage: AiUsageSchema,
  latencyMs: z14.number().int(),
  /** Which SOPs the answer was based on — the audit trail for "what did it know when it said that?". */
  corpus: z14.object({ documents: z14.number().int(), hash: z14.string() }),
  /** Served from the answer cache: no model call, so usage is zero. */
  cached: z14.boolean(),
  /** Email/WhatsApp only: notes for the staff member (what the reply assumes, what to check), apart from the message to send. `answer` is the message itself. */
  notes: z14.string().nullable(),
  /** Things to check before relying on the answer, e.g. a figure that did not come from a price lookup, or prices that may be out of date. */
  warnings: z14.array(z14.string()),
  /** Present only when the answer used a price lookup. Shown to staff beside the answer, never written into it. */
  spotNote: AiSpotNoteSchema.nullable(),
  /** Which live lookups the answer used (getSpot, findProductPrices). Empty for a pure SOP answer. */
  toolsUsed: z14.array(z14.string())
});
var AiStatusSchema = z14.object({
  enabled: z14.boolean(),
  model: z14.string()
});
var AskStreamEventSchema = z14.discriminatedUnion("type", [
  z14.object({ type: z14.literal("delta"), text: z14.string() }),
  z14.object({ type: z14.literal("tool"), name: z14.string() }),
  z14.object({ type: z14.literal("done"), response: AskResponseSchema }),
  z14.object({ type: z14.literal("error"), status: z14.number().int(), message: z14.string() })
]);

// src/admin.schema.ts
import { z as z15 } from "zod";
var HealthStatusEnum = z15.enum(["up", "degraded", "down"]);
var HealthItemSchema = z15.object({
  key: z15.string(),
  label: z15.string(),
  status: HealthStatusEnum,
  /** One plain-language line: a measurement, or the reason it is not healthy. */
  detail: z15.string()
});
var HourlyStatsSchema = z15.object({
  hour: z15.string(),
  requests: z15.number(),
  clientErrors: z15.number(),
  serverErrors: z15.number(),
  avgLatencyMs: z15.number(),
  logins: z15.number(),
  failedLogins: z15.number()
});
var RouteStatsSchema = z15.object({
  route: z15.string(),
  count: z15.number(),
  errors: z15.number(),
  avgLatencyMs: z15.number()
});
var TableSizeSchema = z15.object({
  name: z15.string(),
  bytes: z15.number(),
  rows: z15.number()
});
var AdminOverviewSchema = z15.object({
  generatedAt: z15.string(),
  uptimeSeconds: z15.number(),
  nodeVersion: z15.string(),
  environment: z15.string(),
  aiEnabled: z15.boolean(),
  health: z15.array(HealthItemSchema),
  /** False when Redis is down: the traffic history below is then empty rather than wrong. */
  metricsAvailable: z15.boolean(),
  hours: z15.array(HourlyStatsSchema),
  topRoutes: z15.array(RouteStatsSchema),
  databaseBytes: z15.number(),
  tables: z15.array(TableSizeSchema),
  usersByRole: z15.array(z15.object({ role: z15.string(), count: z15.number() })),
  activeUsers: z15.number(),
  errorsByKind: z15.array(z15.object({ kind: z15.string(), count: z15.number() }))
});
var LogLevelEnum = z15.enum(["trace", "debug", "info", "warn", "error", "fatal"]);
var AdminLogEntrySchema = z15.object({
  id: z15.number(),
  /** Epoch milliseconds. */
  time: z15.number(),
  level: LogLevelEnum,
  message: z15.string(),
  context: z15.string().nullable(),
  method: z15.string().nullable(),
  url: z15.string().nullable(),
  status: z15.number().nullable(),
  responseTimeMs: z15.number().nullable(),
  /** Everything else pino recorded on the line, for the expanded view. */
  extra: z15.record(z15.string(), z15.unknown())
});
var AdminLogsResponseSchema = z15.object({
  entries: z15.array(AdminLogEntrySchema),
  capacity: z15.number()
});
var AuditEntrySchema = z15.object({
  at: z15.string(),
  user: z15.string(),
  action: z15.string(),
  detail: z15.string()
});
var AuditLogResponseSchema = z15.object({
  entries: z15.array(AuditEntrySchema),
  persisted: z15.boolean()
});
var ApiEndpointParameterSchema = z15.object({
  name: z15.string(),
  in: z15.enum(["path", "query", "header"]),
  required: z15.boolean(),
  type: z15.string(),
  options: z15.array(z15.string()).optional(),
  description: z15.string().optional()
});
var ApiEndpointSchema = z15.object({
  method: z15.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: z15.string(),
  summary: z15.string(),
  description: z15.string().optional(),
  tag: z15.string(),
  requiresAuth: z15.boolean(),
  parameters: z15.array(ApiEndpointParameterSchema),
  /** A starter JSON body built from the request schema; null when the route takes none. */
  bodyExample: z15.unknown().nullable()
});
var ApiCatalogueSchema = z15.object({
  endpoints: z15.array(ApiEndpointSchema)
});
var DbColumnSchema = z15.object({
  name: z15.string(),
  type: z15.string(),
  nullable: z15.boolean(),
  hasDefault: z15.boolean(),
  isPrimaryKey: z15.boolean(),
  /** Generated by the database, or never shown at all — cannot be set from the browser. */
  readOnly: z15.boolean(),
  /** The allowed values when the column is a Postgres enum. */
  enumValues: z15.array(z15.string()).optional()
});
var DbTableSummarySchema = z15.object({
  name: z15.string(),
  rows: z15.number(),
  bytes: z15.number(),
  writable: z15.boolean()
});
var DbTablesResponseSchema = z15.object({
  tables: z15.array(DbTableSummarySchema)
});
var DbRowsResponseSchema = z15.object({
  table: z15.string(),
  writable: z15.boolean(),
  columns: z15.array(DbColumnSchema),
  rows: z15.array(z15.record(z15.string(), z15.unknown())),
  total: z15.number(),
  page: z15.number(),
  pageSize: z15.number()
});
var DbValueSchema = z15.union([z15.string(), z15.number(), z15.boolean(), z15.null(), z15.record(z15.string(), z15.unknown()), z15.array(z15.unknown())]);
var DbInsertRequestSchema = z15.object({
  values: z15.record(z15.string(), DbValueSchema)
});
var DbUpdateRequestSchema = z15.object({
  /** The row's primary-key column(s) and current value(s). */
  key: z15.record(z15.string(), z15.union([z15.string(), z15.number()])),
  values: z15.record(z15.string(), DbValueSchema)
});
var DbDeleteRequestSchema = z15.object({
  key: z15.record(z15.string(), z15.union([z15.string(), z15.number()]))
});
var DbRowResponseSchema = z15.object({
  row: z15.record(z15.string(), z15.unknown())
});

// src/roadmap.schema.ts
import { z as z16 } from "zod";
var RoadmapDocumentSchema = z16.object({
  markdown: z16.string(),
  version: z16.number().int().nonnegative(),
  updatedBy: z16.string().nullable(),
  updatedAt: z16.iso.datetime().nullable()
});
var TaskText = z16.string().trim().min(1, "Task text is required").max(500).refine((t) => !/[\r\n]/.test(t), "Task text must be one line");
var Line = z16.number().int().nonnegative();
var RoadmapEditSchema = z16.discriminatedUnion("type", [
  z16.object({ type: z16.literal("toggle"), line: Line, text: z16.string(), checked: z16.boolean() }),
  z16.object({ type: z16.literal("add"), sectionLine: Line, parentLine: Line.optional(), text: TaskText }),
  z16.object({ type: z16.literal("delete"), line: Line, text: z16.string() }),
  z16.object({ type: z16.literal("edit"), line: Line, text: z16.string(), newText: TaskText })
]);
var RoadmapEditRequestSchema = z16.object({
  /** The document version the edit was made against. */
  version: z16.number().int().nonnegative(),
  edit: RoadmapEditSchema
});

// src/roadmap.ts
var TASK_LINE = /^(\s*)- \[( |x|X)\] (.*)$/;
var HEADING = /^(#{1,2}) (.+)$/;
var PRIORITY_EMOJI = { "\u{1F534}": "P0", "\u{1F7E0}": "P1", "\u{1F7E1}": "P2", "\u26AA": "P3" };
var indentOf = (line) => line.length - line.trimStart().length;
var eolOf = (markdown) => markdown.includes("\r\n") ? "\r\n" : "\n";
var linesOf = (markdown) => markdown.split(/\r?\n/);
function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function parseHeading(raw, group, headingLine, taken) {
  let text = raw.trim();
  let priority = null;
  for (const [emoji, level] of Object.entries(PRIORITY_EMOJI)) {
    if (text.includes(emoji)) {
      priority ??= level;
      text = text.replace(emoji, "");
    }
  }
  let depends = null;
  const arrow = text.indexOf("\u2190");
  if (arrow >= 0) {
    depends = text.slice(arrow + 1).replace(/^\s*depends:\s*/i, "").trim() || null;
    text = text.slice(0, arrow);
  }
  let note = null;
  text = text.replace(/\*\(([^)]*)\)\*/, (_m, inner) => {
    note = inner.trim();
    return "";
  });
  text = text.replace(/`/g, "").replace(/\s*→\s*$/, "").replace(/\s+/g, " ").trim();
  const idMatch = /^(\d+\.\d+)\s+(.*)$/.exec(text);
  const id = idMatch ? idMatch[1] ?? null : null;
  const title = idMatch ? idMatch[2] ?? text : text;
  const phase = /^PHASE (\d+)/.exec(title);
  let key = id ?? (phase ? `phase-${phase[1]}` : slug(title).slice(0, 30).replace(/-$/, ""));
  while (taken.has(key)) key += "-2";
  taken.add(key);
  return { key, id, title, note, depends, priority, group, headingLine, body: "", tasks: [] };
}
function parseRoadmap(markdown) {
  const lines = linesOf(markdown);
  const sections = [];
  const taken = /* @__PURE__ */ new Set();
  let group = "";
  let current = null;
  let stack = [];
  let body = [];
  let inFence = false;
  const close = () => {
    if (current) current.body = body.join("\n").trim();
    body = [];
    stack = [];
  };
  lines.forEach((line, index) => {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    const heading = inFence ? null : HEADING.exec(line);
    if (heading) {
      close();
      const level = heading[1].length;
      const headingText = heading[2];
      if (level === 1) group = headingText.trim();
      current = parseHeading(headingText, level === 1 ? headingText.trim() : group, index, taken);
      if (level === 1 && index === 0) current = null;
      else sections.push(current);
      return;
    }
    if (!current) return;
    const task = inFence ? null : TASK_LINE.exec(line);
    if (task) {
      const indent = task[1].length;
      const node = { line: index, checked: task[2] !== " ", text: task[3].trim(), notes: [], children: [] };
      while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
      (stack.length ? stack[stack.length - 1].task.children : current.tasks).push(node);
      stack.push({ indent, task: node });
      return;
    }
    const owner = line.trim() === "" ? void 0 : [...stack].reverse().find((entry) => indentOf(line) > entry.indent);
    if (owner) owner.task.notes.push(line.trim().replace(/^- /, ""));
    else {
      if (line.trim() !== "") stack = [];
      body.push(line);
    }
  });
  close();
  return sections.filter((s) => s.id !== null || s.body !== "" || s.tasks.length > 0 || s.group !== s.title);
}
function countTasks(tasks) {
  let done = 0;
  let total = 0;
  for (const task of tasks) {
    total += 1;
    if (task.checked) done += 1;
    const inner = countTasks(task.children);
    done += inner.done;
    total += inner.total;
  }
  return { done, total };
}
var RoadmapEditError = class extends Error {
};
function requireTask(lines, line, text) {
  const match = TASK_LINE.exec(lines[line] ?? "");
  if (!match) throw new RoadmapEditError(`Line ${line + 1} is not a task. Reload and try again.`);
  if (match[3].trim() !== text.trim()) throw new RoadmapEditError("That task changed since you loaded the page. Reload and try again.");
  return match;
}
function blockEnd(lines, line) {
  const indent = indentOf(lines[line]);
  let end = line;
  for (let i = line + 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    if (indentOf(lines[i]) <= indent) break;
    end = i;
  }
  return end;
}
function applyRoadmapEdit(markdown, edit) {
  const eol = eolOf(markdown);
  const lines = linesOf(markdown);
  switch (edit.type) {
    case "toggle": {
      const m = requireTask(lines, edit.line, edit.text);
      lines[edit.line] = `${m[1]}- [${edit.checked ? "x" : " "}] ${m[3]}`;
      break;
    }
    case "edit": {
      const m = requireTask(lines, edit.line, edit.text);
      lines[edit.line] = `${m[1]}- [${m[2]}] ${edit.newText}`;
      break;
    }
    case "delete": {
      requireTask(lines, edit.line, edit.text);
      lines.splice(edit.line, blockEnd(lines, edit.line) - edit.line + 1);
      break;
    }
    case "add": {
      const heading = HEADING.exec(lines[edit.sectionLine] ?? "");
      if (!heading && edit.parentLine === void 0) throw new RoadmapEditError("Section not found. Reload and try again.");
      if (edit.parentLine !== void 0) {
        const parent = TASK_LINE.exec(lines[edit.parentLine] ?? "");
        if (!parent) throw new RoadmapEditError("Parent task not found. Reload and try again.");
        const end = blockEnd(lines, edit.parentLine);
        lines.splice(end + 1, 0, `${parent[1]}  - [ ] ${edit.text}`);
        break;
      }
      let sectionEnd = lines.length;
      for (let i = edit.sectionLine + 1; i < lines.length; i++) {
        if (HEADING.test(lines[i])) {
          sectionEnd = i;
          break;
        }
      }
      let lastTop = -1;
      for (let i = edit.sectionLine + 1; i < sectionEnd; i++) if (TASK_LINE.test(lines[i]) && indentOf(lines[i]) === 0) lastTop = i;
      if (lastTop >= 0) {
        lines.splice(blockEnd(lines, lastTop) + 1, 0, `- [ ] ${edit.text}`);
      } else {
        let at = sectionEnd;
        while (at > edit.sectionLine + 1 && lines[at - 1].trim() === "") at--;
        lines.splice(at, 0, ...at === edit.sectionLine + 1 ? [""] : [], `- [ ] ${edit.text}`);
      }
      break;
    }
  }
  return lines.join(eol);
}

// src/design-md.ts
var unquote = (value) => value.trim().replace(/^"(.*)"$/s, "$1").replace(/\\"/g, '"');
function splitDocSections(markdown) {
  const sections = [];
  let current = null;
  let inFence = false;
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    const heading = inFence ? null : /^## (.+)$/.exec(line);
    if (heading) {
      if (current) sections.push({ title: current.title, body: current.lines.join("\n").trim() });
      current = { title: heading[1].trim(), lines: [] };
    } else current?.lines.push(line);
  }
  if (current) sections.push({ title: current.title, body: current.lines.join("\n").trim() });
  return sections;
}
function parseFrontMatter(raw) {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, rest: text };
  const data = {};
  let top = null;
  let sub = null;
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const pair = /^\s*([^:]+):\s*(.*)$/.exec(line);
    if (!pair) continue;
    const key = pair[1].trim();
    const value = pair[2];
    if (indent === 0) {
      top = key;
      sub = null;
      if (value) data[key] = unquote(value);
      else data[key] = {};
    } else if (top && typeof data[top] === "object") {
      const group = data[top];
      if (indent <= 2) {
        if (value) group[key] = unquote(value);
        else {
          group[key] = {};
          sub = key;
        }
      } else if (sub && typeof group[sub] === "object") {
        group[sub][key] = unquote(value);
      }
    }
  }
  return { data, rest: text.slice(match[0].length) };
}
var flat = (value) => typeof value === "object" && value ? Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === "string")) : {};
var nested = (value) => typeof value === "object" && value ? Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === "object")) : {};
function listItems(body, heading) {
  const start = body.search(heading);
  if (start < 0) return [];
  const after = body.slice(start).split("\n").slice(1);
  const items = [];
  for (const line of after) {
    if (/^###? /.test(line)) break;
    const bullet = /^- (.+)$/.exec(line);
    if (bullet) items.push(bullet[1]);
    else if (items.length && line.startsWith("  ") && line.trim()) items[items.length - 1] += ` ${line.trim()}`;
  }
  return items;
}
function parseDesignDoc(markdown) {
  const { data, rest } = parseFrontMatter(markdown);
  const prose = rest.replace(/^# .+\n/, "");
  const sections = splitDocSections(prose);
  const rules = [];
  for (const match of prose.matchAll(/\*\*(The [^*]+? Rule)\.\*\*\s+([^\n]+)/g)) rules.push({ name: match[1], text: match[2] });
  const dosSection = sections.find((s) => /^Do's and Don'ts/i.test(s.title))?.body ?? "";
  return {
    name: typeof data.name === "string" ? data.name : "Design system",
    description: typeof data.description === "string" ? data.description : "",
    tokens: {
      colors: flat(data.colors),
      typography: nested(data.typography),
      rounded: flat(data.rounded),
      spacing: flat(data.spacing),
      components: nested(data.components)
    },
    sections,
    rules,
    dos: listItems(dosSection, /^### Do:/m),
    donts: listItems(dosSection, /^### Don't:/m)
  };
}
export {
  AI_MESSAGE_MAX_LENGTH,
  AI_QUESTION_MAX_LENGTH,
  AdminLogEntrySchema,
  AdminLogsResponseSchema,
  AdminOverviewSchema,
  AiAnswerStatusEnum,
  AiCitationSchema,
  AiModeEnum,
  AiSpotNoteSchema,
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
  MarketModeStateSchema,
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
  RoadmapDocumentSchema,
  RoadmapEditError,
  RoadmapEditRequestSchema,
  RoadmapEditSchema,
  RouteStatsSchema,
  SPOT_STALE_AFTER_MS,
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
  UpdateMarketModeRequestSchema,
  UpdateProductFullDtoSchema,
  UpdateStockRequestSchema,
  UserProfileSchema,
  UserRole,
  UserSchema,
  UserStatus,
  aiInputLimit,
  applyRoadmapEdit,
  buildPortfolioStrategies,
  computeCurrentBuybackValue,
  computeMeltValue,
  computeProfit,
  computeRequiredSpotForTarget,
  computeTransactionPrice,
  countTasks,
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
  parseDesignDoc,
  parseKbDocument,
  parseRoadmap,
  planAutolinks,
  rewriteKbLinks,
  roundBuyPrice,
  roundSellPrice,
  searchKb,
  solveMissingPurchaseField,
  splitDocSections,
  splitFrontmatter,
  splitSections,
  termRegExp,
  toPlainText
};
