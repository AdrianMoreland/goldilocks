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

// src/fetch-attempt.schema.ts
import { z as z10 } from "zod";
var FetchTriggerEnum = z10.enum(["CRON", "REFRESH", "RETRY", "LAUNCH_FALLBACK"]);
var FetchAttemptSchema = z10.object({
  id: z10.string(),
  attemptedAt: z10.iso.datetime(),
  durationMs: z10.number(),
  success: z10.boolean(),
  errorMessage: z10.string().nullable(),
  metalsResolved: z10.array(MetalTypeEnum),
  triggeredBy: FetchTriggerEnum
});
var FetchMetricsSchema = z10.object({
  /** Fraction (0-1) of external API calls in the last 24h that succeeded. 1 when there were none to judge. */
  successRate24h: z10.number(),
  totalAttempts24h: z10.number(),
  failureCount24h: z10.number(),
  avgLatencyMs: z10.number(),
  /** Fraction (0-1) of the launch-page-load cascade's cache reads that hit — in-memory since process start, not a 24h window. */
  cacheHitRatio: z10.number()
});

// src/error-log.schema.ts
import { z as z11 } from "zod";
var ErrorLogSourceEnum = z11.enum(["server", "client"]);
var ErrorLogSeverityEnum = z11.enum(["error", "warning"]);
var ErrorLogKindEnum = z11.enum(["database", "http", "network", "external-api", "response", "crash"]);
var ErrorLogEntrySchema = z11.object({
  id: z11.string(),
  /** Short code shown to staff in the error toast ("ref E-7F3K2"), to find the matching entry. */
  reference: z11.string(),
  at: z11.string(),
  source: ErrorLogSourceEnum,
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: z11.string(),
  detail: z11.string().nullable().optional(),
  statusCode: z11.number().nullable().optional(),
  method: z11.string().nullable().optional(),
  path: z11.string().nullable().optional(),
  /** Vendor/driver error code, e.g. Prisma's "P1001". */
  code: z11.string().nullable().optional(),
  stack: z11.string().nullable().optional(),
  user: z11.string().nullable().optional(),
  userAgent: z11.string().nullable().optional()
});
var ClientErrorReportSchema = z11.object({
  reference: z11.string().max(20),
  occurredAt: z11.string().max(40),
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: z11.string().max(500),
  detail: z11.string().max(4e3).optional(),
  statusCode: z11.number().int().optional(),
  method: z11.string().max(10).optional(),
  path: z11.string().max(500).optional(),
  stack: z11.string().max(4e3).optional()
});
var ClientErrorReportBatchSchema = z11.object({
  reports: z11.array(ClientErrorReportSchema).max(50)
});
function createErrorReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `E-${out}`;
}

// src/kb.schema.ts
import { z as z12 } from "zod";
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
var KbCategoryEnum = z12.enum(KB_CATEGORIES);
var KbJurisdictionEnum = z12.enum(["all", "IE", "UK", "ES"]);
var KbStatusEnum = z12.enum(["draft", "approved", "retired"]);
var KbSlugSchema = z12.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase, hyphenated");
var isoDay = z12.iso.date();
var KbFrontmatterSchema = z12.object({
  slug: KbSlugSchema,
  title: z12.string().trim().min(1),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: z12.string().trim().min(1),
  status: KbStatusEnum,
  version: z12.coerce.number().int().positive(),
  updatedAt: isoDay
});
var KbDocumentSchema = z12.object({
  slug: KbSlugSchema,
  title: z12.string(),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: z12.string(),
  status: KbStatusEnum,
  version: z12.number().int(),
  contentUpdatedOn: isoDay,
  markdown: z12.string()
});
var KbDocumentListResponseSchema = z12.object({
  documents: z12.array(KbDocumentSchema)
});
var UpdateKbDocumentRequestSchema = z12.object({
  title: z12.string().trim().min(1).max(200),
  owner: z12.string().trim().min(1).max(100),
  markdown: z12.string().trim().min(1).max(1e5)
});
var SetKbStatusRequestSchema = z12.object({ status: KbStatusEnum });
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
import { z as z13 } from "zod";
var AiModeEnum = z13.enum(["procedures", "email", "whatsapp"]);
var AI_QUESTION_MAX_LENGTH = 500;
var AI_MESSAGE_MAX_LENGTH = 4e3;
function aiInputLimit(mode) {
  return mode === "procedures" ? AI_QUESTION_MAX_LENGTH : AI_MESSAGE_MAX_LENGTH;
}
var AskRequestSchema = z13.object({
  /** A question (procedures) or the customer's pasted message (email, whatsapp). */
  question: z13.string().trim().min(1).max(AI_MESSAGE_MAX_LENGTH),
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
var AiAnswerStatusEnum = z13.enum(["answered", "refused", "uncited"]);
var AiCitationSchema = z13.object({
  slug: z13.string(),
  anchor: z13.string().nullable(),
  title: z13.string(),
  heading: z13.string().nullable()
});
var AiUsageSchema = z13.object({
  inputTokens: z13.number().int(),
  /** The part of the input served from OpenAI's prompt cache (billed at a fraction). */
  cachedInputTokens: z13.number().int(),
  outputTokens: z13.number().int()
});
var AskResponseSchema = z13.object({
  /** Markdown. Citations are left in as `[[slug#section]]`, which the reader turns into links. */
  answer: z13.string(),
  mode: AiModeEnum,
  status: AiAnswerStatusEnum,
  citations: z13.array(AiCitationSchema),
  model: z13.string(),
  usage: AiUsageSchema,
  latencyMs: z13.number().int(),
  /** Which SOPs the answer was based on — the audit trail for "what did it know when it said that?". */
  corpus: z13.object({ documents: z13.number().int(), hash: z13.string() }),
  /** Served from the answer cache: no model call, so usage is zero. */
  cached: z13.boolean(),
  /** Email/WhatsApp only: notes for the staff member (what the reply assumes, what to check), apart from the message to send. `answer` is the message itself. */
  notes: z13.string().nullable(),
  /** Things to check before relying on the answer, e.g. a figure that did not come from a price lookup, or prices that may be out of date. */
  warnings: z13.array(z13.string()),
  /** Which live lookups the answer used (getSpot, findProductPrices). Empty for a pure SOP answer. */
  toolsUsed: z13.array(z13.string())
});
var AiStatusSchema = z13.object({
  enabled: z13.boolean(),
  model: z13.string()
});
var AskStreamEventSchema = z13.discriminatedUnion("type", [
  z13.object({ type: z13.literal("delta"), text: z13.string() }),
  z13.object({ type: z13.literal("tool"), name: z13.string() }),
  z13.object({ type: z13.literal("done"), response: AskResponseSchema }),
  z13.object({ type: z13.literal("error"), status: z13.number().int(), message: z13.string() })
]);

// src/admin.schema.ts
import { z as z14 } from "zod";
var HealthStatusEnum = z14.enum(["up", "degraded", "down"]);
var HealthItemSchema = z14.object({
  key: z14.string(),
  label: z14.string(),
  status: HealthStatusEnum,
  /** One plain-language line: a measurement, or the reason it is not healthy. */
  detail: z14.string()
});
var HourlyStatsSchema = z14.object({
  hour: z14.string(),
  requests: z14.number(),
  clientErrors: z14.number(),
  serverErrors: z14.number(),
  avgLatencyMs: z14.number(),
  logins: z14.number(),
  failedLogins: z14.number()
});
var RouteStatsSchema = z14.object({
  route: z14.string(),
  count: z14.number(),
  errors: z14.number(),
  avgLatencyMs: z14.number()
});
var TableSizeSchema = z14.object({
  name: z14.string(),
  bytes: z14.number(),
  rows: z14.number()
});
var AdminOverviewSchema = z14.object({
  generatedAt: z14.string(),
  uptimeSeconds: z14.number(),
  nodeVersion: z14.string(),
  environment: z14.string(),
  aiEnabled: z14.boolean(),
  health: z14.array(HealthItemSchema),
  /** False when Redis is down: the traffic history below is then empty rather than wrong. */
  metricsAvailable: z14.boolean(),
  hours: z14.array(HourlyStatsSchema),
  topRoutes: z14.array(RouteStatsSchema),
  databaseBytes: z14.number(),
  tables: z14.array(TableSizeSchema),
  usersByRole: z14.array(z14.object({ role: z14.string(), count: z14.number() })),
  activeUsers: z14.number(),
  errorsByKind: z14.array(z14.object({ kind: z14.string(), count: z14.number() }))
});
var LogLevelEnum = z14.enum(["trace", "debug", "info", "warn", "error", "fatal"]);
var AdminLogEntrySchema = z14.object({
  id: z14.number(),
  /** Epoch milliseconds. */
  time: z14.number(),
  level: LogLevelEnum,
  message: z14.string(),
  context: z14.string().nullable(),
  method: z14.string().nullable(),
  url: z14.string().nullable(),
  status: z14.number().nullable(),
  responseTimeMs: z14.number().nullable(),
  /** Everything else pino recorded on the line, for the expanded view. */
  extra: z14.record(z14.string(), z14.unknown())
});
var AdminLogsResponseSchema = z14.object({
  entries: z14.array(AdminLogEntrySchema),
  capacity: z14.number()
});
var AuditEntrySchema = z14.object({
  at: z14.string(),
  user: z14.string(),
  action: z14.string(),
  detail: z14.string()
});
var AuditLogResponseSchema = z14.object({
  entries: z14.array(AuditEntrySchema),
  persisted: z14.boolean()
});
var ApiEndpointParameterSchema = z14.object({
  name: z14.string(),
  in: z14.enum(["path", "query", "header"]),
  required: z14.boolean(),
  type: z14.string(),
  options: z14.array(z14.string()).optional(),
  description: z14.string().optional()
});
var ApiEndpointSchema = z14.object({
  method: z14.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: z14.string(),
  summary: z14.string(),
  description: z14.string().optional(),
  tag: z14.string(),
  requiresAuth: z14.boolean(),
  parameters: z14.array(ApiEndpointParameterSchema),
  /** A starter JSON body built from the request schema; null when the route takes none. */
  bodyExample: z14.unknown().nullable()
});
var ApiCatalogueSchema = z14.object({
  endpoints: z14.array(ApiEndpointSchema)
});
var DbColumnSchema = z14.object({
  name: z14.string(),
  type: z14.string(),
  nullable: z14.boolean(),
  hasDefault: z14.boolean(),
  isPrimaryKey: z14.boolean(),
  /** Generated by the database, or never shown at all — cannot be set from the browser. */
  readOnly: z14.boolean(),
  /** The allowed values when the column is a Postgres enum. */
  enumValues: z14.array(z14.string()).optional()
});
var DbTableSummarySchema = z14.object({
  name: z14.string(),
  rows: z14.number(),
  bytes: z14.number(),
  writable: z14.boolean()
});
var DbTablesResponseSchema = z14.object({
  tables: z14.array(DbTableSummarySchema)
});
var DbRowsResponseSchema = z14.object({
  table: z14.string(),
  writable: z14.boolean(),
  columns: z14.array(DbColumnSchema),
  rows: z14.array(z14.record(z14.string(), z14.unknown())),
  total: z14.number(),
  page: z14.number(),
  pageSize: z14.number()
});
var DbValueSchema = z14.union([z14.string(), z14.number(), z14.boolean(), z14.null(), z14.record(z14.string(), z14.unknown()), z14.array(z14.unknown())]);
var DbInsertRequestSchema = z14.object({
  values: z14.record(z14.string(), DbValueSchema)
});
var DbUpdateRequestSchema = z14.object({
  /** The row's primary-key column(s) and current value(s). */
  key: z14.record(z14.string(), z14.union([z14.string(), z14.number()])),
  values: z14.record(z14.string(), DbValueSchema)
});
var DbDeleteRequestSchema = z14.object({
  key: z14.record(z14.string(), z14.union([z14.string(), z14.number()]))
});
var DbRowResponseSchema = z14.object({
  row: z14.record(z14.string(), z14.unknown())
});
export {
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
};
