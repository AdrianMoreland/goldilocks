import { z } from 'zod';

/**
 * Bar or coin, as chosen when the product was created. Nullable: products
 * created before this field existed have none, and the table then falls back
 * to inferring it from the name ("… Bar").
 */
declare const ProductCategoryEnum: z.ZodEnum<{
    BAR: "BAR";
    COIN: "COIN";
}>;
type ProductCategory = z.infer<typeof ProductCategoryEnum>;
declare const ProductSchema: z.ZodObject<{
    id: z.ZodNumber;
    sku: z.ZodString;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: z.ZodNumber;
    spotPrice: z.ZodNumber;
    spreadBuy: z.ZodNumber;
    spreadSell: z.ZodNumber;
    vatRate: z.ZodNumber;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: z.ZodString;
    marketValue: z.ZodNumber;
    priceSell: z.ZodNumber;
    priceSellVatExcl: z.ZodNumber;
    priceBuy: z.ZodNumber;
    stock: z.ZodNumber;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
    createdAt: z.ZodPreprocess<z.ZodISODateTime>;
}, z.core.$strip>;
declare const RawProductSchema: z.ZodObject<{
    id: z.ZodNumber;
    sku: z.ZodString;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: z.ZodNumber;
    spreadBuy: z.ZodNumber;
    spreadSell: z.ZodNumber;
    vatRate: z.ZodNumber;
    stock: z.ZodNumber;
    isActive: z.ZodBoolean;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodPreprocess<z.ZodISODateTime>;
    updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
}, z.core.$strip>;
declare const CreateProductDtoSchema: z.ZodObject<{
    sku: z.ZodString;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: z.ZodNumber;
    spreadBuy: z.ZodNumber;
    spreadSell: z.ZodNumber;
    vatRate: z.ZodNumber;
    stock: z.ZodNumber;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const UpdateProductFullDtoSchema: z.ZodObject<{
    metalType: z.ZodOptional<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    weight: z.ZodOptional<z.ZodNumber>;
    spotPrice: z.ZodOptional<z.ZodNumber>;
    spreadBuy: z.ZodOptional<z.ZodNumber>;
    spreadSell: z.ZodOptional<z.ZodNumber>;
    vatRate: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>>;
    marketValue: z.ZodOptional<z.ZodNumber>;
    priceSellVatExcl: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodOptional<z.ZodNumber>;
    priceSell: z.ZodOptional<z.ZodNumber>;
    priceBuy: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    expectedUpdatedAt: z.ZodOptional<z.ZodISODateTime>;
}, z.core.$strip>;
declare const UpdateStockRequestSchema: z.ZodObject<{
    stock_quantity: z.ZodNumber;
}, z.core.$strip>;
type UpdateStockRequest = z.infer<typeof UpdateStockRequestSchema>;
declare const ProductsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    sku: z.ZodString;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: z.ZodNumber;
    spotPrice: z.ZodNumber;
    spreadBuy: z.ZodNumber;
    spreadSell: z.ZodNumber;
    vatRate: z.ZodNumber;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: z.ZodString;
    marketValue: z.ZodNumber;
    priceSell: z.ZodNumber;
    priceSellVatExcl: z.ZodNumber;
    priceBuy: z.ZodNumber;
    stock: z.ZodNumber;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
    createdAt: z.ZodPreprocess<z.ZodISODateTime>;
}, z.core.$strip>>;
declare const ProductArraySchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    sku: z.ZodString;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: z.ZodNumber;
    spotPrice: z.ZodNumber;
    spreadBuy: z.ZodNumber;
    spreadSell: z.ZodNumber;
    vatRate: z.ZodNumber;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: z.ZodString;
    marketValue: z.ZodNumber;
    priceSell: z.ZodNumber;
    priceSellVatExcl: z.ZodNumber;
    priceBuy: z.ZodNumber;
    stock: z.ZodNumber;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
    createdAt: z.ZodPreprocess<z.ZodISODateTime>;
}, z.core.$strip>>;
declare const ProductMapSchema: z.ZodRecord<z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PLATINUM: "PLATINUM";
    PALLADIUM: "PALLADIUM";
}>, z.ZodObject<{
    id: z.ZodNumber;
    sku: z.ZodString;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: z.ZodNumber;
    spotPrice: z.ZodNumber;
    spreadBuy: z.ZodNumber;
    spreadSell: z.ZodNumber;
    vatRate: z.ZodNumber;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: z.ZodString;
    marketValue: z.ZodNumber;
    priceSell: z.ZodNumber;
    priceSellVatExcl: z.ZodNumber;
    priceBuy: z.ZodNumber;
    stock: z.ZodNumber;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
    createdAt: z.ZodPreprocess<z.ZodISODateTime>;
}, z.core.$strip>>;
type Product = z.infer<typeof ProductSchema>;
type Products = z.infer<typeof ProductsSchema>;
type ProductMapDTO = z.infer<typeof ProductMapSchema>;
type UpdateProductFullDto = z.infer<typeof UpdateProductFullDtoSchema>;
type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
type RawProduct = z.infer<typeof RawProductSchema>;

declare function normalizeProductName(name: string): string;

declare const TaskStatusSchema: z.ZodEnum<{
    todo: "todo";
    "in-progress": "in-progress";
    done: "done";
}>;
declare const MetalTypeEnum: z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PLATINUM: "PLATINUM";
    PALLADIUM: "PALLADIUM";
}>;
declare const MetalSymbolSchema: z.ZodEnum<{
    XAU: "XAU";
    XAG: "XAG";
    XPT: "XPT";
    XPD: "XPD";
}>;
/** Which tier actually satisfied this read - Redis cache, Postgres, or a fresh call to the live vendor API. Optional: only the two "how did we get this price" cascades (getAllLatestForLaunch/refreshAll) bother tagging it. */
declare const FetchSourceEnum: z.ZodEnum<{
    cache: "cache";
    db: "db";
    live: "live";
}>;
declare const SpotPriceSchema: z.ZodObject<{
    id: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: z.ZodNumber;
    priceGbp: z.ZodNumber;
    previousClose: z.ZodNumber;
    change: z.ZodNumber;
    changePercent: z.ZodNumber;
    source: z.ZodString;
    timestamp: z.ZodISODateTime;
    createdAt: z.ZodISODateTime;
    fetchSource: z.ZodOptional<z.ZodEnum<{
        cache: "cache";
        db: "db";
        live: "live";
    }>>;
    isFallback: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const RawSpotPriceSchema: z.ZodObject<{
    id: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: z.ZodNumber;
    priceGbp: z.ZodNumber;
    source: z.ZodString;
    timestamp: z.ZodISODateTime;
    createdAt: z.ZodISODateTime;
    fetchSource: z.ZodOptional<z.ZodEnum<{
        cache: "cache";
        db: "db";
        live: "live";
    }>>;
    isFallback: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const HistoricSpotSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: z.ZodNumber;
    priceGbp: z.ZodNumber;
    timestamp: z.ZodISODateTime;
}, z.core.$strip>;
declare const CreateSpotPriceDtoSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
declare const SpotPriceArraySchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: z.ZodNumber;
    priceGbp: z.ZodNumber;
    previousClose: z.ZodNumber;
    change: z.ZodNumber;
    changePercent: z.ZodNumber;
    source: z.ZodString;
    timestamp: z.ZodISODateTime;
    createdAt: z.ZodISODateTime;
    fetchSource: z.ZodOptional<z.ZodEnum<{
        cache: "cache";
        db: "db";
        live: "live";
    }>>;
    isFallback: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
declare const SpotPriceMapSchema: z.ZodRecord<z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PLATINUM: "PLATINUM";
    PALLADIUM: "PALLADIUM";
}>, z.ZodObject<{
    id: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: z.ZodNumber;
    priceGbp: z.ZodNumber;
    previousClose: z.ZodNumber;
    change: z.ZodNumber;
    changePercent: z.ZodNumber;
    source: z.ZodString;
    timestamp: z.ZodISODateTime;
    createdAt: z.ZodISODateTime;
    fetchSource: z.ZodOptional<z.ZodEnum<{
        cache: "cache";
        db: "db";
        live: "live";
    }>>;
    isFallback: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
declare const TaskQueryParamsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        todo: "todo";
        "in-progress": "in-progress";
        done: "done";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type TaskQueryParams = z.infer<typeof TaskQueryParamsSchema>;
type TaskStatus = z.infer<typeof TaskStatusSchema>;
type MetalType = z.infer<typeof MetalTypeEnum>;
type MetalSymbol = z.infer<typeof MetalSymbolSchema>;
type FetchSource = z.infer<typeof FetchSourceEnum>;
type SpotPrice = z.infer<typeof SpotPriceSchema>;
type HistoricSpot = z.infer<typeof HistoricSpotSchema>;
type CreateSpotPriceDto = z.infer<typeof CreateSpotPriceDtoSchema>;
type SpotPriceMapDTO = z.infer<typeof SpotPriceMapSchema>;
type RawSpotPrice = z.infer<typeof RawSpotPriceSchema>;

declare const ApiSuccessResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: T;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ApiErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>;
    timestamp: z.ZodISODateTime;
}, z.core.$strip>;
declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const HealthCheckSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    timestamp: z.ZodISODateTime;
    uptime: z.ZodNumber;
    environment: z.ZodString;
}, z.core.$strip>;
type Pagination = z.infer<typeof PaginationSchema>;
type HealthCheck = z.infer<typeof HealthCheckSchema>;
type ApiSuccessResponse<T> = z.infer<ReturnType<typeof ApiSuccessResponseSchema<z.ZodType<T>>>>;
type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

declare const UserRole: z.ZodEnum<{
    ADMIN: "ADMIN";
    USER: "USER";
    MANAGER: "MANAGER";
}>;
declare const UserStatus: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    INACTIVE: "INACTIVE";
    SUSPENDED: "SUSPENDED";
}>;
declare const Platform: z.ZodEnum<{
    web: "web";
    mobile: "mobile";
    admin: "admin";
}>;
declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodEmail;
    username: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
        MANAGER: "MANAGER";
    }>;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        SUSPENDED: "SUSPENDED";
    }>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
declare const LoginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    platform: z.ZodEnum<{
        web: "web";
        mobile: "mobile";
        admin: "admin";
    }>;
    rememberMe: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
declare const RegisterSchema: z.ZodObject<{
    email: z.ZodEmail;
    username: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    platform: z.ZodEnum<{
        web: "web";
        mobile: "mobile";
        admin: "admin";
    }>;
}, z.core.$strip>;
declare const ChangePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmNewPassword: z.ZodString;
}, z.core.$strip>;
declare const AuthResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        status: z.ZodEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
            SUSPENDED: "SUSPENDED";
        }>;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            USER: "USER";
            MANAGER: "MANAGER";
        }>;
        email: z.ZodEmail;
        username: z.ZodString;
    }, z.core.$strip>;
    expiresIn: z.ZodNumber;
}, z.core.$strip>;
declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodUUID;
    email: z.ZodEmail;
    username: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
        MANAGER: "MANAGER";
    }>;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        SUSPENDED: "SUSPENDED";
    }>;
    createdAt: z.ZodISODateTime;
}, z.core.$strip>;
declare const MessageResponseSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
type LoginInput = z.infer<typeof LoginSchema>;
type RegisterInput = z.infer<typeof RegisterSchema>;
type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
type AuthResponse = z.infer<typeof AuthResponseSchema>;
type UserProfile = z.infer<typeof UserProfileSchema>;
type MessageResponse = z.infer<typeof MessageResponseSchema>;
type User = z.infer<typeof UserSchema>;
type UserRoleType = z.infer<typeof UserRole>;
type UserStatusType = z.infer<typeof UserStatus>;
type PlatformType = z.infer<typeof Platform>;

declare const MarketDataResponseSchema: z.ZodObject<{
    spotPrices: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        priceEur: z.ZodNumber;
        priceGbp: z.ZodNumber;
        previousClose: z.ZodNumber;
        change: z.ZodNumber;
        changePercent: z.ZodNumber;
        source: z.ZodString;
        timestamp: z.ZodISODateTime;
        createdAt: z.ZodISODateTime;
        fetchSource: z.ZodOptional<z.ZodEnum<{
            cache: "cache";
            db: "db";
            live: "live";
        }>>;
        isFallback: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    historicSpot: z.ZodArray<z.ZodObject<{
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        priceEur: z.ZodNumber;
        priceGbp: z.ZodNumber;
        timestamp: z.ZodISODateTime;
    }, z.core.$strip>>;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        sku: z.ZodString;
        name: z.ZodString;
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        weight: z.ZodNumber;
        spotPrice: z.ZodNumber;
        spreadBuy: z.ZodNumber;
        spreadSell: z.ZodNumber;
        vatRate: z.ZodNumber;
        category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            BAR: "BAR";
            COIN: "COIN";
        }>>>;
        description: z.ZodString;
        marketValue: z.ZodNumber;
        priceSell: z.ZodNumber;
        priceSellVatExcl: z.ZodNumber;
        priceBuy: z.ZodNumber;
        stock: z.ZodNumber;
        isActive: z.ZodBoolean;
        updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
        createdAt: z.ZodPreprocess<z.ZodISODateTime>;
    }, z.core.$strip>>;
    snapshotAt: z.ZodNullable<z.ZodISODateTime>;
    lastFetchAt: z.ZodNullable<z.ZodISODateTime>;
    autoRefreshPaused: z.ZodBoolean;
    priceWarning: z.ZodNullable<z.ZodString>;
    degradedMetals: z.ZodArray<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
}, z.core.$strip>;
/** The light poll behind the dashboard's price status: no products, no history. */
declare const SpotStatusResponseSchema: z.ZodObject<{
    snapshotAt: z.ZodNullable<z.ZodISODateTime>;
    lastFetchAt: z.ZodNullable<z.ZodISODateTime>;
    autoRefreshPaused: z.ZodBoolean;
    degradedMetals: z.ZodArray<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
}, z.core.$strip>;
type SpotStatusResponse = z.infer<typeof SpotStatusResponseSchema>;
declare const RefreshResponseSchema: z.ZodObject<{
    spot: z.ZodObject<{
        id: z.ZodString;
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        priceEur: z.ZodNumber;
        priceGbp: z.ZodNumber;
        previousClose: z.ZodNumber;
        change: z.ZodNumber;
        changePercent: z.ZodNumber;
        source: z.ZodString;
        timestamp: z.ZodISODateTime;
        createdAt: z.ZodISODateTime;
        fetchSource: z.ZodOptional<z.ZodEnum<{
            cache: "cache";
            db: "db";
            live: "live";
        }>>;
        isFallback: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        sku: z.ZodString;
        name: z.ZodString;
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        weight: z.ZodNumber;
        spotPrice: z.ZodNumber;
        spreadBuy: z.ZodNumber;
        spreadSell: z.ZodNumber;
        vatRate: z.ZodNumber;
        category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            BAR: "BAR";
            COIN: "COIN";
        }>>>;
        description: z.ZodString;
        marketValue: z.ZodNumber;
        priceSell: z.ZodNumber;
        priceSellVatExcl: z.ZodNumber;
        priceBuy: z.ZodNumber;
        stock: z.ZodNumber;
        isActive: z.ZodBoolean;
        updatedAt: z.ZodPreprocess<z.ZodISODateTime>;
        createdAt: z.ZodPreprocess<z.ZodISODateTime>;
    }, z.core.$strip>>;
    snapshotAt: z.ZodNullable<z.ZodISODateTime>;
}, z.core.$strip>;
declare const RecalculateOverridesSchema: z.ZodObject<{
    GOLD: z.ZodOptional<z.ZodNumber>;
    SILVER: z.ZodOptional<z.ZodNumber>;
    PLATINUM: z.ZodOptional<z.ZodNumber>;
    PALLADIUM: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type RecalculateOverrides = z.infer<typeof RecalculateOverridesSchema>;
declare const HistoricCloseQuerySchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type HistoricCloseQuery = z.infer<typeof HistoricCloseQuerySchema>;
type MarketDataResponse = z.infer<typeof MarketDataResponseSchema>;
type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

declare const TradeTransactionTypeEnum: z.ZodEnum<{
    buying: "buying";
    selling: "selling";
}>;
type TradeTransactionType = z.infer<typeof TradeTransactionTypeEnum>;
declare const TradeProductSchema: z.ZodObject<{
    id: z.ZodNumber;
    sku: z.ZodString;
    name: z.ZodString;
    weight: z.ZodNumber;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    premiumPct: z.ZodNumber;
    discountPct: z.ZodNumber;
}, z.core.$strip>;
type TradeProduct = z.infer<typeof TradeProductSchema>;
declare const TradeBootstrapResponseSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    spot: z.ZodNumber;
    minSpot: z.ZodNumber;
    maxSpot: z.ZodNumber;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        sku: z.ZodString;
        name: z.ZodString;
        weight: z.ZodNumber;
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        premiumPct: z.ZodNumber;
        discountPct: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
type TradeBootstrapResponse = z.infer<typeof TradeBootstrapResponseSchema>;
declare const TradeCartItemRequestSchema: z.ZodObject<{
    productId: z.ZodNumber;
    quantity: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    percent: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
type TradeCartItemRequest = z.infer<typeof TradeCartItemRequestSchema>;
/** Most lines one cart may carry. A real cart is a handful; the cap keeps one request from multiplying work. */
declare const TRADE_CART_MAX_ITEMS = 100;
declare const TradeCartRequestSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    transactionType: z.ZodEnum<{
        buying: "buying";
        selling: "selling";
    }>;
    customSpot: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        quantity: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        percent: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type TradeCartRequest = z.infer<typeof TradeCartRequestSchema>;
declare const TradeCartLineSchema: z.ZodObject<{
    productId: z.ZodNumber;
    product: z.ZodString;
    sku: z.ZodString;
    weight: z.ZodNumber;
    quantity: z.ZodNumber;
    percent: z.ZodNumber;
    unitPrice: z.ZodNumber;
    lineTotal: z.ZodNumber;
}, z.core.$strip>;
type TradeCartLine = z.infer<typeof TradeCartLineSchema>;
declare const TradeCartResponseSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    transactionType: z.ZodEnum<{
        buying: "buying";
        selling: "selling";
    }>;
    spot: z.ZodNumber;
    lines: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        product: z.ZodString;
        sku: z.ZodString;
        weight: z.ZodNumber;
        quantity: z.ZodNumber;
        percent: z.ZodNumber;
        unitPrice: z.ZodNumber;
        lineTotal: z.ZodNumber;
    }, z.core.$strip>>;
    totalWeight: z.ZodNumber;
    averagePerGram: z.ZodNumber;
    totalPrice: z.ZodNumber;
}, z.core.$strip>;
type TradeCartResponse = z.infer<typeof TradeCartResponseSchema>;
declare const MeltCategoryKeyEnum: z.ZodEnum<{
    "24ct": "24ct";
    "22ct": "22ct";
    "90%": "90%";
    Silver: "Silver";
}>;
type MeltCategoryKey = z.infer<typeof MeltCategoryKeyEnum>;
declare const MeltCategoryDataSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    meltFactor: z.ZodNumber;
    purity: z.ZodNumber;
}, z.core.$strip>;
type MeltCategoryData = z.infer<typeof MeltCategoryDataSchema>;
declare const MeltCalculatorRequestSchema: z.ZodObject<{
    category: z.ZodEnum<{
        "24ct": "24ct";
        "22ct": "22ct";
        "90%": "90%";
        Silver: "Silver";
    }>;
    weight: z.ZodCoercedNumber<unknown>;
    customSpot: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type MeltCalculatorRequest = z.infer<typeof MeltCalculatorRequestSchema>;
declare const MeltCalculatorResponseSchema: z.ZodObject<{
    category: z.ZodEnum<{
        "24ct": "24ct";
        "22ct": "22ct";
        "90%": "90%";
        Silver: "Silver";
    }>;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    spot: z.ZodNumber;
    spotPerGram: z.ZodNumber;
    meltFactor: z.ZodNumber;
    purity: z.ZodNumber;
    weight: z.ZodNumber;
    meltValue: z.ZodNumber;
}, z.core.$strip>;
type MeltCalculatorResponse = z.infer<typeof MeltCalculatorResponseSchema>;
declare const TRADE_METAL_SLIDER_BOUNDS: Record<z.infer<typeof MetalTypeEnum>, {
    min: number;
    max: number;
}>;
declare const MELT_CATEGORIES: Record<MeltCategoryKey, MeltCategoryData>;

declare const ProfitAnalysisMissingFieldEnum: z.ZodEnum<{
    spot: "spot";
    premium: "premium";
    price: "price";
}>;
type ProfitAnalysisMissingFieldDto = z.infer<typeof ProfitAnalysisMissingFieldEnum>;
declare const ProfitAnalysisRequestSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    productId: z.ZodNumber;
    purchaseSpot: z.ZodCoercedNumber<unknown>;
    purchasePremium: z.ZodCoercedNumber<unknown>;
    purchasePrice: z.ZodCoercedNumber<unknown>;
    missingField: z.ZodEnum<{
        spot: "spot";
        premium: "premium";
        price: "price";
    }>;
    currentSpot: z.ZodCoercedNumber<unknown>;
    currentDiscount: z.ZodCoercedNumber<unknown>;
    targetProfit: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
type ProfitAnalysisRequest = z.infer<typeof ProfitAnalysisRequestSchema>;
declare const ProfitAnalysisResponseSchema: z.ZodObject<{
    product: z.ZodString;
    productMultiplier: z.ZodNumber;
    purchaseSpot: z.ZodNumber;
    purchasePremium: z.ZodNumber;
    purchasePrice: z.ZodNumber;
    currentSpot: z.ZodNumber;
    currentDiscount: z.ZodNumber;
    currentBuybackValue: z.ZodNumber;
    profit: z.ZodNumber;
    profitPercent: z.ZodNumber;
    requiredSpot: z.ZodNumber;
    requiredPrice: z.ZodNumber;
    targetProfit: z.ZodNumber;
    targetReturn: z.ZodNumber;
}, z.core.$strip>;
type ProfitAnalysisResponse = z.infer<typeof ProfitAnalysisResponseSchema>;
declare const PortfolioProductTypeFilterEnum: z.ZodEnum<{
    bar: "bar";
    coin: "coin";
    either: "either";
}>;
declare const PriorityStrengthEnum: z.ZodEnum<{
    none: "none";
    low: "low";
    medium: "medium";
    high: "high";
}>;
declare const PortfolioBuildRequestSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    budget: z.ZodCoercedNumber<unknown>;
    productType: z.ZodEnum<{
        bar: "bar";
        coin: "coin";
        either: "either";
    }>;
    priorityProductId: z.ZodOptional<z.ZodNumber>;
    priorityStrength: z.ZodEnum<{
        none: "none";
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    customSpot: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type PortfolioBuildRequest = z.infer<typeof PortfolioBuildRequestSchema>;
declare const PortfolioLineItemSchema: z.ZodObject<{
    product: z.ZodString;
    quantity: z.ZodNumber;
    weight: z.ZodNumber;
    totalWeight: z.ZodNumber;
    unitPrice: z.ZodNumber;
    totalValue: z.ZodNumber;
    premium: z.ZodNumber;
    type: z.ZodEnum<{
        bar: "bar";
        coin: "coin";
    }>;
    isPriority: z.ZodBoolean;
}, z.core.$strip>;
type PortfolioLineItemDto = z.infer<typeof PortfolioLineItemSchema>;
declare const PortfolioStrategyResultSchema: z.ZodObject<{
    strategy: z.ZodObject<{
        id: z.ZodEnum<{
            maximum: "maximum";
            balanced: "balanced";
            flexible: "flexible";
        }>;
        name: z.ZodString;
        badge: z.ZodString;
        description: z.ZodString;
    }, z.core.$strip>;
    totalInvested: z.ZodNumber;
    unspent: z.ZodNumber;
    totalGrams: z.ZodNumber;
    averagePerGram: z.ZodNumber;
    averagePremium: z.ZodNumber;
    pieces: z.ZodNumber;
    largestPositionPercent: z.ZodNumber;
    flexibilityScore: z.ZodNumber;
    priorityQuantity: z.ZodNumber;
    priorityShare: z.ZodNumber;
    items: z.ZodArray<z.ZodObject<{
        product: z.ZodString;
        quantity: z.ZodNumber;
        weight: z.ZodNumber;
        totalWeight: z.ZodNumber;
        unitPrice: z.ZodNumber;
        totalValue: z.ZodNumber;
        premium: z.ZodNumber;
        type: z.ZodEnum<{
            bar: "bar";
            coin: "coin";
        }>;
        isPriority: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
type PortfolioStrategyResultDto = z.infer<typeof PortfolioStrategyResultSchema>;
declare const PortfolioBuildResponseSchema: z.ZodObject<{
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    budget: z.ZodNumber;
    productType: z.ZodEnum<{
        bar: "bar";
        coin: "coin";
        either: "either";
    }>;
    priorityProductId: z.ZodNullable<z.ZodNumber>;
    priorityStrength: z.ZodEnum<{
        none: "none";
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    results: z.ZodArray<z.ZodObject<{
        strategy: z.ZodObject<{
            id: z.ZodEnum<{
                maximum: "maximum";
                balanced: "balanced";
                flexible: "flexible";
            }>;
            name: z.ZodString;
            badge: z.ZodString;
            description: z.ZodString;
        }, z.core.$strip>;
        totalInvested: z.ZodNumber;
        unspent: z.ZodNumber;
        totalGrams: z.ZodNumber;
        averagePerGram: z.ZodNumber;
        averagePremium: z.ZodNumber;
        pieces: z.ZodNumber;
        largestPositionPercent: z.ZodNumber;
        flexibilityScore: z.ZodNumber;
        priorityQuantity: z.ZodNumber;
        priorityShare: z.ZodNumber;
        items: z.ZodArray<z.ZodObject<{
            product: z.ZodString;
            quantity: z.ZodNumber;
            weight: z.ZodNumber;
            totalWeight: z.ZodNumber;
            unitPrice: z.ZodNumber;
            totalValue: z.ZodNumber;
            premium: z.ZodNumber;
            type: z.ZodEnum<{
                bar: "bar";
                coin: "coin";
            }>;
            isPriority: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type PortfolioBuildResponse = z.infer<typeof PortfolioBuildResponseSchema>;

declare const GRAMS_PER_TROY_OUNCE = 31.1034768;
/**
 * How old a market price (its vendor time) can be before the assistant
 * calls it possibly out of date. The dashboard's dot follows the fetch age
 * instead (see spot-freshness.ts).
 */
declare const SPOT_STALE_AFTER_MS: number;
/**
 * Whole-euro rounding for quoted product prices, always in the dealer's
 * favour: a price we charge rounds UP, a buyback we pay rounds DOWN. The
 * value is snapped to cents first so float noise (2948.0000000004) doesn't
 * push a whole-euro price up by €1.
 */
declare function roundSellPrice(value: number): number;
declare function roundBuyPrice(value: number): number;
/** Bonded (deferred-VAT storage) products are recognised by name, as the product table does. */
declare function isBondedProduct(name: string): boolean;
/**
 * The VAT rate a customer actually pays. Bonded products carry no VAT, so
 * the stored rate (the seed gave every non-gold product 23%) is ignored for
 * them and Price equals Price ex. VAT.
 */
declare function effectiveVatRate(product: {
    name: string;
    vatRate: number;
}): number;
/**
 * Prices one line: a buy (customer pays a premium over spot) or a sell
 * (customer receives a discount off spot).
 *
 * Rounding always favors the dealer, not the customer:
 *   - 'buying'  (dealer sells to customer)   -> round UP   (Math.ceil)
 *   - 'selling' (dealer buys from customer)  -> round DOWN (Math.floor)
 */
declare function computeTransactionPrice(basePrice: number, transactionType: TradeTransactionType, percent: number): number;
declare function computeMeltValue(spotPerGram: number, meltFactor: number, purity: number, weight: number): number;
type ProfitAnalysisMissingField = 'spot' | 'premium' | 'price';
/**
 * Exactly one of {spot, premium, price} is unknown; the other two determine
 * it. Throws a plain Error with a user-facing message on invalid input -
 * callers in an HTTP context should catch and rethrow as a 400.
 */
declare function solveMissingPurchaseField(missingField: ProfitAnalysisMissingField, purchaseSpot: number, purchasePremium: number, purchasePrice: number, productMultiplier: number): {
    purchaseSpot: number;
    purchasePremium: number;
    purchasePrice: number;
};
declare function computeCurrentBuybackValue(currentSpot: number, currentDiscount: number, productMultiplier: number): number;
declare function computeProfit(currentBuybackValue: number, purchasePrice: number): {
    profit: number;
    profitPercent: number;
};
declare function computeRequiredSpotForTarget(purchasePrice: number, targetProfit: number, productMultiplier: number, currentDiscount: number): {
    requiredPrice: number;
    requiredSpot: number;
    targetReturn: number;
};

/** How often the price cron calls the vendor while it is running. */
declare const SPOT_FETCH_INTERVAL_MS: number;
/** Fresh (green) for one fetch cycle plus a minute of grace; after that a fetch was missed. */
declare const SPOT_LATE_AFTER_MS: number;
/** Stale (red) this long after the last fetch: staff should type a spot or refresh before quoting. */
declare const SPOT_RED_AFTER_MS: number;
/**
 * fresh: the feed is keeping up. late: a fetch was missed (amber).
 * stale: no fetch for 25 minutes or more (red). closed: the market is shut and
 * this is its closing price. unknown: no price yet.
 */
type SpotFreshnessState = 'fresh' | 'late' | 'stale' | 'closed' | 'unknown';
interface SpotFreshness {
    state: SpotFreshnessState;
    /** Age of the market price itself (now - snapshotAt). */
    priceAgeMs: number | null;
    /** Time since we last received a price (now - lastFetchAt, or the price age if unknown). */
    fetchAgeMs: number | null;
}
/**
 * Spot metals stop trading from Friday 22:00 to Sunday 23:00, London time
 * (summer time included). Bank holidays are not covered.
 */
declare function isSpotMarketClosed(at: Date): boolean;
declare function spotFreshness(input: {
    snapshotAt: string | null | undefined;
    lastFetchAt: string | null | undefined;
    now: Date;
}): SpotFreshness;

/**
 * Prices one stored product from a spot-price map (euros per troy ounce, by metal). The one place
 * a product's quoted Price, Price ex. VAT and Buyback are worked out, so the staff app, the API and
 * the public site cannot disagree on a price.
 */
declare function calculateProductPrice(product: RawProduct, spotMap: Record<MetalType, number>): Product;
/** Merges a base spot-price map with overrides; an override wins when it has a value. */
declare function mergeMetalPrices(base: Record<MetalType, number>, overrides: Partial<Record<MetalType, number>>): Record<MetalType, number>;

type PortfolioProductType = 'bar' | 'coin';
type PriorityStrength = 'none' | 'low' | 'medium' | 'high';
type PortfolioProductTypeFilter = 'either' | 'bar' | 'coin';
declare const PORTFOLIO_SMALL_INVESTOR_LIMIT = 5000;
declare const PORTFOLIO_MAX_QTY = 500;
interface PortfolioCandidateProduct {
    id: number;
    product: string;
    weight: number;
    sellPrice: number;
    premium: number;
    type: PortfolioProductType;
}
interface PortfolioLineItem {
    product: string;
    quantity: number;
    weight: number;
    totalWeight: number;
    unitPrice: number;
    totalValue: number;
    premium: number;
    type: PortfolioProductType;
    isPriority: boolean;
}
interface PortfolioCandidateResult {
    totalInvested: number;
    unspent: number;
    totalGrams: number;
    averagePerGram: number;
    averagePremium: number;
    pieces: number;
    largestPositionPercent: number;
    flexibilityScore: number;
    priorityQuantity: number;
    priorityShare: number;
    items: PortfolioLineItem[];
}
type PortfolioStrategyId = 'maximum' | 'balanced' | 'flexible';
interface PortfolioStrategyResult {
    strategy: {
        id: PortfolioStrategyId;
        name: string;
        badge: string;
        description: string;
    };
    result: PortfolioCandidateResult;
}
/**
 * Builds and scores the three portfolio strategies for a budget. Throws a
 * plain Error with a user-facing message on invalid input - callers in an
 * HTTP context should catch and rethrow as a 400.
 */
declare function buildPortfolioStrategies(allProducts: PortfolioCandidateProduct[], budget: number, productType: PortfolioProductTypeFilter, priorityProductName: string, priorityStrength: PriorityStrength): PortfolioStrategyResult[];

declare const SessionUserRoleEnum: z.ZodEnum<{
    ADMIN: "ADMIN";
    MANAGER: "MANAGER";
    SALES: "SALES";
    ACCOUNTING: "ACCOUNTING";
    AUDITOR: "AUDITOR";
}>;
/**
 * The look a person chose, saved on their account so it follows them to any browser: light or dark, and the theme
 * editor's settings (theme, colours, font, text size, density) as the web app stores them. The web app checks the look
 * field by field when it reads it back, so the server only bounds its size.
 */
declare const UI_SETTINGS_MAX_BYTES = 16000;
declare const ColorModeEnum: z.ZodEnum<{
    dark: "dark";
    light: "light";
}>;
type ColorMode = z.infer<typeof ColorModeEnum>;
declare const UiSettingsSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        dark: "dark";
        light: "light";
    }>;
    look: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type UiSettings = z.infer<typeof UiSettingsSchema>;
declare const SessionUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: z.ZodBoolean;
    branch: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        region: z.ZodEnum<{
            IE: "IE";
            UK: "UK";
            ES: "ES";
        }>;
    }, z.core.$strip>>>;
    uiSettings: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        mode: z.ZodEnum<{
            dark: "dark";
            light: "light";
        }>;
        look: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    canViewAs: z.ZodDefault<z.ZodBoolean>;
    viewAs: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type SessionUser = z.infer<typeof SessionUserSchema>;
declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type LoginRequest = z.infer<typeof LoginRequestSchema>;
declare const LoginResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            MANAGER: "MANAGER";
            SALES: "SALES";
            ACCOUNTING: "ACCOUNTING";
            AUDITOR: "AUDITOR";
        }>;
        admin: z.ZodBoolean;
        branch: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodString;
            region: z.ZodEnum<{
                IE: "IE";
                UK: "UK";
                ES: "ES";
            }>;
        }, z.core.$strip>>>;
        uiSettings: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            mode: z.ZodEnum<{
                dark: "dark";
                light: "light";
            }>;
            look: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>>;
        canViewAs: z.ZodDefault<z.ZodBoolean>;
        viewAs: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
type LoginResponse = z.infer<typeof LoginResponseSchema>;
declare const RefreshRequestSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
declare const CreateUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: z.ZodDefault<z.ZodBoolean>;
    branchId: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
/** Admin: move a staff member to another branch (or clear it). */
declare const SetUserBranchRequestSchema: z.ZodObject<{
    branchId: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type SetUserBranchRequest = z.infer<typeof SetUserBranchRequestSchema>;

/** `?limit=` - the newest N rows of a log-style list. */
declare const limitQuery: (defaultValue: number, max: number) => z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const AdminLogsQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    level: z.ZodDefault<z.ZodEnum<{
        error: "error";
        trace: "trace";
        debug: "debug";
        info: "info";
        warn: "warn";
        fatal: "fatal";
    }>>;
    q: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type AdminLogsQuery = z.infer<typeof AdminLogsQuerySchema>;
declare const AuditQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const ErrorLogQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const FetchLogQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const DbRowsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    dir: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type DbRowsQuery = z.infer<typeof DbRowsQuerySchema>;
declare const BackfillHistoryQuerySchema: z.ZodObject<{
    years: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type BackfillHistoryQuery = z.infer<typeof BackfillHistoryQuerySchema>;

declare const CurrencyEnum: z.ZodEnum<{
    EUR: "EUR";
    USD: "USD";
    GBP: "GBP";
}>;
/** Which side of the business a branch belongs to. Drives what its staff may use (see branch-access.ts). */
declare const BranchRegionEnum: z.ZodEnum<{
    IE: "IE";
    UK: "UK";
    ES: "ES";
}>;
type BranchRegion = z.infer<typeof BranchRegionEnum>;
/** The branch as it travels on a session: just enough for the web app to work out capabilities. */
declare const SessionBranchSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    region: z.ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
    }>;
}, z.core.$strip>;
type SessionBranch = z.infer<typeof SessionBranchSchema>;
declare const BranchSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    region: z.ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
    }>;
    address: z.ZodNullable<z.ZodString>;
    currency: z.ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
    }>;
    createdAt: z.ZodISODateTime;
}, z.core.$strip>;
declare const CreateBranchRequestSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    region: z.ZodDefault<z.ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
    }>>;
    currency: z.ZodDefault<z.ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
    }>>;
}, z.core.$strip>;
type Branch = z.infer<typeof BranchSchema>;
type CreateBranchRequest = z.infer<typeof CreateBranchRequestSchema>;

/**
 * Knowledge Center (roadmap 1.4). The SOP file format is specified in
 * docs/sops/00-README.md; these enums are that spec in code, so the importer,
 * the API and the web app can never disagree about what a category is.
 */
declare const KB_CATEGORIES: readonly ["sales", "trading", "operations", "compliance", "storage", "systems", "directory", "meta"];
declare const KbCategoryEnum: z.ZodEnum<{
    sales: "sales";
    trading: "trading";
    operations: "operations";
    compliance: "compliance";
    storage: "storage";
    systems: "systems";
    directory: "directory";
    meta: "meta";
}>;
type KbCategory = z.infer<typeof KbCategoryEnum>;
declare const KbJurisdictionEnum: z.ZodEnum<{
    IE: "IE";
    UK: "UK";
    ES: "ES";
    all: "all";
}>;
type KbJurisdiction = z.infer<typeof KbJurisdictionEnum>;
/** draft: visible with a "Not yet approved" banner · approved: visible · retired: hidden from staff, kept for audit. */
declare const KbStatusEnum: z.ZodEnum<{
    draft: "draft";
    approved: "approved";
    retired: "retired";
}>;
type KbStatus = z.infer<typeof KbStatusEnum>;
/**
 * Which branches may read a SOP. `ie_only` (the default) is what every SOP was before branches existed;
 * `all` is shown to UK branches too. An admin classifies each SOP - nothing is shared by accident.
 */
declare const KbVisibilityEnum: z.ZodEnum<{
    all: "all";
    ie_only: "ie_only";
}>;
type KbVisibility = z.infer<typeof KbVisibilityEnum>;
declare const SetKbVisibilityRequestSchema: z.ZodObject<{
    visibility: z.ZodEnum<{
        all: "all";
        ie_only: "ie_only";
    }>;
}, z.core.$strip>;
type SetKbVisibilityRequest = z.infer<typeof SetKbVisibilityRequestSchema>;
/** Matches the README's slug rule. Never changes after approval - links depend on it. */
declare const KbSlugSchema: z.ZodString;
/** The YAML frontmatter at the top of every SOP file. Values arrive as strings, hence the coercion on version. */
declare const KbFrontmatterSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    category: z.ZodEnum<{
        sales: "sales";
        trading: "trading";
        operations: "operations";
        compliance: "compliance";
        storage: "storage";
        systems: "systems";
        directory: "directory";
        meta: "meta";
    }>;
    jurisdiction: z.ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
        all: "all";
    }>;
    owner: z.ZodString;
    status: z.ZodEnum<{
        draft: "draft";
        approved: "approved";
        retired: "retired";
    }>;
    version: z.ZodCoercedNumber<unknown>;
    updatedAt: z.ZodISODate;
}, z.core.$strip>;
type KbFrontmatter = z.infer<typeof KbFrontmatterSchema>;
/** One SOP as the API serves it. `contentUpdatedOn` is the SOP's own date (frontmatter `updatedAt`), not the row's. */
declare const KbDocumentSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    category: z.ZodEnum<{
        sales: "sales";
        trading: "trading";
        operations: "operations";
        compliance: "compliance";
        storage: "storage";
        systems: "systems";
        directory: "directory";
        meta: "meta";
    }>;
    jurisdiction: z.ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
        all: "all";
    }>;
    owner: z.ZodString;
    status: z.ZodEnum<{
        draft: "draft";
        approved: "approved";
        retired: "retired";
    }>;
    visibility: z.ZodDefault<z.ZodEnum<{
        all: "all";
        ie_only: "ie_only";
    }>>;
    version: z.ZodNumber;
    contentUpdatedOn: z.ZodISODate;
    markdown: z.ZodString;
}, z.core.$strip>;
type KbDocument = z.infer<typeof KbDocumentSchema>;
declare const KbDocumentListResponseSchema: z.ZodObject<{
    documents: z.ZodArray<z.ZodObject<{
        slug: z.ZodString;
        title: z.ZodString;
        category: z.ZodEnum<{
            sales: "sales";
            trading: "trading";
            operations: "operations";
            compliance: "compliance";
            storage: "storage";
            systems: "systems";
            directory: "directory";
            meta: "meta";
        }>;
        jurisdiction: z.ZodEnum<{
            IE: "IE";
            UK: "UK";
            ES: "ES";
            all: "all";
        }>;
        owner: z.ZodString;
        status: z.ZodEnum<{
            draft: "draft";
            approved: "approved";
            retired: "retired";
        }>;
        visibility: z.ZodDefault<z.ZodEnum<{
            all: "all";
            ie_only: "ie_only";
        }>>;
        version: z.ZodNumber;
        contentUpdatedOn: z.ZodISODate;
        markdown: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type KbDocumentListResponse = z.infer<typeof KbDocumentListResponseSchema>;
/**
 * Admin edit of a SOP's content. Frontmatter fields the file format owns
 * (slug, category, jurisdiction, version, status, date) are deliberately not
 * editable here: slug never changes, status moves through the approval
 * workflow, and version/date are set by approval.
 */
declare const UpdateKbDocumentRequestSchema: z.ZodObject<{
    title: z.ZodString;
    owner: z.ZodString;
    markdown: z.ZodString;
}, z.core.$strip>;
type UpdateKbDocumentRequest = z.infer<typeof UpdateKbDocumentRequestSchema>;
/** Moves a SOP through draft → approved, back to draft, or to retired. */
declare const SetKbStatusRequestSchema: z.ZodObject<{
    status: z.ZodEnum<{
        draft: "draft";
        approved: "approved";
        retired: "retired";
    }>;
}, z.core.$strip>;
type SetKbStatusRequest = z.infer<typeof SetKbStatusRequestSchema>;
/** Plain-language description of each category, shown on the library tiles (from the README's category list). */
declare const KB_CATEGORY_INFO: Record<KbCategory, {
    label: string;
    description: string;
}>;

/**
 * What a signed-in person may use, decided in ONE place from their branch. The API guard and the web app
 * both call this, so "UK branches don't get the Pricing Workbook" is a rule here, not a check scattered
 * across components. Add a capability by adding a field and a line per region below.
 */
interface Capabilities {
    /** The /dashboard Pricing Workbook and every API behind it: prices, trade, portfolio, market mode, products. */
    pricingWorkbook: boolean;
    /** The internal AI assistant. It answers from every approved SOP and quotes live prices, so it follows the other two. */
    assistant: boolean;
    /** The side menu. A branch whose only page is the Knowledge Center has nowhere to navigate. */
    sidebar: boolean;
    /** Which SOPs the Knowledge Center lists: every one, or only those classified `all`. */
    knowledge: 'everything' | 'shared';
}
interface CapabilitySubject {
    /** Null (no branch assigned) behaves as IE: every account that existed before branches keeps what it had. */
    branchRegion: BranchRegion | null;
    admin: boolean;
}
declare function capabilitiesFor(subject: CapabilitySubject): Capabilities;
declare function canSeeKbVisibility(capabilities: Capabilities, visibility: KbVisibility): boolean;
/** Where a person lands after sign-in, and where a blocked page sends them. */
declare function homePathFor(capabilities: Capabilities): string;

/**
 * The company-wide market condition. Standard is "no mode on"; Volatile is the
 * only one used much, Weekend and Shortage rarely. One shared value, set by an
 * Admin or Manager, that every user's dashboard follows.
 */
declare const MarketModeStateSchema: z.ZodObject<{
    weekend: z.ZodBoolean;
    volatile: z.ZodBoolean;
    shortage: z.ZodBoolean;
    updatedBy: z.ZodNullable<z.ZodString>;
    updatedAt: z.ZodNullable<z.ZodISODateTime>;
}, z.core.$strip>;
declare const UpdateMarketModeRequestSchema: z.ZodObject<{
    weekend: z.ZodBoolean;
    volatile: z.ZodBoolean;
    shortage: z.ZodBoolean;
}, z.core.$strip>;
type MarketModeState = z.infer<typeof MarketModeStateSchema>;
type UpdateMarketModeRequest = z.infer<typeof UpdateMarketModeRequestSchema>;

/** What triggered a call to the external metal-price vendor API. */
declare const FetchTriggerEnum: z.ZodEnum<{
    CRON: "CRON";
    REFRESH: "REFRESH";
    RETRY: "RETRY";
    LAUNCH_FALLBACK: "LAUNCH_FALLBACK";
}>;
declare const FetchAttemptSchema: z.ZodObject<{
    id: z.ZodString;
    attemptedAt: z.ZodISODateTime;
    durationMs: z.ZodNumber;
    success: z.ZodBoolean;
    errorMessage: z.ZodNullable<z.ZodString>;
    metalsResolved: z.ZodArray<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
    triggeredBy: z.ZodEnum<{
        CRON: "CRON";
        REFRESH: "REFRESH";
        RETRY: "RETRY";
        LAUNCH_FALLBACK: "LAUNCH_FALLBACK";
    }>;
}, z.core.$strip>;
declare const FetchMetricsSchema: z.ZodObject<{
    successRate24h: z.ZodNumber;
    totalAttempts24h: z.ZodNumber;
    failureCount24h: z.ZodNumber;
    avgLatencyMs: z.ZodNumber;
    cacheHitRatio: z.ZodNumber;
}, z.core.$strip>;
type FetchTrigger = z.infer<typeof FetchTriggerEnum>;
type FetchAttempt = z.infer<typeof FetchAttemptSchema>;
type FetchMetrics = z.infer<typeof FetchMetricsSchema>;

declare const ErrorLogSourceEnum: z.ZodEnum<{
    server: "server";
    client: "client";
}>;
declare const ErrorLogSeverityEnum: z.ZodEnum<{
    error: "error";
    warning: "warning";
}>;
/**
 * Machine-readable category, so the Admin panel can group and explain:
 *  - database      Prisma / Postgres failure
 *  - http          an API request answered with an error status
 *  - network       the browser couldn't reach the API at all
 *  - external-api  the metal-price vendor failed
 *  - response      the API answered, but not in the shape the app expects
 *  - crash         an unhandled exception (server or browser)
 */
declare const ErrorLogKindEnum: z.ZodEnum<{
    database: "database";
    http: "http";
    network: "network";
    "external-api": "external-api";
    response: "response";
    crash: "crash";
}>;
declare const ErrorLogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    reference: z.ZodString;
    at: z.ZodString;
    source: z.ZodEnum<{
        server: "server";
        client: "client";
    }>;
    severity: z.ZodEnum<{
        error: "error";
        warning: "warning";
    }>;
    kind: z.ZodEnum<{
        database: "database";
        http: "http";
        network: "network";
        "external-api": "external-api";
        response: "response";
        crash: "crash";
    }>;
    message: z.ZodString;
    detail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    statusCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    method: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    stack: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    user: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** What the web app sends for a browser-side failure. Bounded so a bug can't flood Redis. */
declare const ClientErrorReportSchema: z.ZodObject<{
    reference: z.ZodString;
    occurredAt: z.ZodString;
    severity: z.ZodEnum<{
        error: "error";
        warning: "warning";
    }>;
    kind: z.ZodEnum<{
        database: "database";
        http: "http";
        network: "network";
        "external-api": "external-api";
        response: "response";
        crash: "crash";
    }>;
    message: z.ZodString;
    detail: z.ZodOptional<z.ZodString>;
    statusCode: z.ZodOptional<z.ZodNumber>;
    method: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    stack: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ClientErrorReportBatchSchema: z.ZodObject<{
    reports: z.ZodArray<z.ZodObject<{
        reference: z.ZodString;
        occurredAt: z.ZodString;
        severity: z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>;
        kind: z.ZodEnum<{
            database: "database";
            http: "http";
            network: "network";
            "external-api": "external-api";
            response: "response";
            crash: "crash";
        }>;
        message: z.ZodString;
        detail: z.ZodOptional<z.ZodString>;
        statusCode: z.ZodOptional<z.ZodNumber>;
        method: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        stack: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ErrorLogSource = z.infer<typeof ErrorLogSourceEnum>;
type ErrorLogSeverity = z.infer<typeof ErrorLogSeverityEnum>;
type ErrorLogKind = z.infer<typeof ErrorLogKindEnum>;
type ErrorLogEntry = z.infer<typeof ErrorLogEntrySchema>;
type ClientErrorReport = z.infer<typeof ClientErrorReportSchema>;
type ClientErrorReportBatch = z.infer<typeof ClientErrorReportBatchSchema>;
/** "E-7F3K2" - short enough to read out over the phone. */
declare function createErrorReference(): string;

/** Applies `fn` to the text outside fenced blocks and inline code, leaving code untouched. */
declare function mapOutsideCode(markdown: string, fn: (text: string) => string): string;
interface RawKbFile {
    data: Record<string, string>;
    body: string;
}
/** Flat `key: value` frontmatter between `---` fences. Nothing nested - the SOP format doesn't need it. */
declare function splitFrontmatter(raw: string): RawKbFile | null;
/** "Identity check" → "identity-check", "Customer safe (CST Safe)" → "customer-safe-cst-safe". */
declare function headingAnchor(text: string): string;
interface KbSection {
    /** Citation anchor, unique within the document. Empty for the text before the first heading. */
    anchor: string;
    heading: string;
    /** Section body without its heading line. */
    markdown: string;
    /** Contains at least one `[TODO: …]` - the fact is unconfirmed, so nobody (human or AI) should rely on it. */
    hasTodo: boolean;
    /** The text of each TODO, for showing "what needs confirming". */
    todos: string[];
    /** "Proposed controls (not yet in force)" - intended practice, not current practice. */
    isProposed: boolean;
}
declare function findTodos(markdown: string): string[];
/** Splits at level-2 headings (the README's "section"); deeper headings stay inside their section. */
declare function splitSections(body: string): KbSection[];
interface KbLinkRef {
    slug: string;
    anchor: string | null;
}
/** Every `[[slug]]` / `[[slug#section]]` outside code. */
declare function findLinks(markdown: string): KbLinkRef[];
interface ResolvedKbLink {
    label: string;
    href: string;
    /** Hover text, and what a screen reader hears beyond the label. */
    title?: string;
}
/** Path of an article in the web app - also what the README says the importer rewrites links to. */
declare function kbArticlePath(slug: string, anchor?: string | null): string;
/** Marker href for a link whose SOP isn't in the Knowledge Center (yet). The web app renders it as a muted chip. */
declare const KB_UNRESOLVED_HREF_PREFIX = "#unresolved-sop:";
/**
 * Turns `[[slug#section]]` into an ordinary Markdown link. `resolve` supplies
 * the label/href (it knows titles and the current document); returning null
 * marks the link as unresolved rather than leaving raw brackets on screen.
 */
declare function rewriteKbLinks(markdown: string, resolve: (ref: KbLinkRef) => ResolvedKbLink | null): string;
interface ParsedKbDocument {
    frontmatter: KbFrontmatter;
    body: string;
    sections: KbSection[];
    links: KbLinkRef[];
}
type ParseKbResult = {
    ok: true;
    doc: ParsedKbDocument;
} | {
    ok: false;
    errors: string[];
};
declare function parseKbDocument(raw: string): ParseKbResult;
interface BrokenKbLink {
    from: string;
    slug: string;
    anchor: string | null;
    reason: 'missing-document' | 'missing-section';
}
/**
 * Checks every link in a set of documents against that set. A link to a slug
 * that doesn't exist fails the import (README); a link to a section that
 * doesn't exist is the same mistake one level down.
 */
declare function findBrokenLinks(docs: {
    slug: string;
    sections: KbSection[];
    links: KbLinkRef[];
}[]): BrokenKbLink[];

/**
 * Knowledge Center search. Runs in the browser over the already-loaded SOPs
 * (a handful of short documents), so typing gives instant, section-level
 * results without a round trip. Pure and dependency-free on purpose: if the
 * corpus ever outgrows this, the same function can back a server endpoint.
 */
interface KbIndexedSection {
    anchor: string;
    heading: string;
    /** Plain text: Markdown syntax and [[link]] brackets removed. */
    text: string;
    hasTodo: boolean;
}
interface KbIndexedDocument {
    slug: string;
    title: string;
    category: KbCategory;
    sections: KbIndexedSection[];
}
/** Markdown → readable plain text, good enough for matching and snippets. */
declare function toPlainText(markdown: string): string;
declare function indexKbDocument(doc: {
    slug: string;
    title: string;
    category: KbCategory;
    markdown: string;
}): KbIndexedDocument;
interface KbSnippetPart {
    text: string;
    hit: boolean;
}
interface KbSearchHit {
    slug: string;
    title: string;
    category: KbCategory;
    /** Null when the match is on the document title alone. */
    sectionAnchor: string | null;
    sectionHeading: string | null;
    hasTodo: boolean;
    score: number;
    snippet: KbSnippetPart[];
}
/**
 * Every query word must appear somewhere in a section (or in its document's
 * title). Title and heading matches outrank body matches; ties keep the
 * library's own order so results don't shuffle as you type.
 */
declare function searchKb(docs: KbIndexedDocument[], query: string, limit?: number): KbSearchHit[];

/**
 * The Knowledge Center's front door: a swimlane that starts from the one
 * question every desk interaction begins with - who is paying whom? - and
 * then lays out the phases of that trade twice: what you do at the desk, and
 * what you click in Business Central (BC). Every node points at the exact SOP
 * section that answers "what do I do now?".
 *
 * This is navigation, not content: the SOP files stay the owners'. It lives
 * here (plain data, no UI imports) so a test can check every target against
 * the real SOP files - an owner renaming a heading must fail a test, not
 * silently break a link on the desk's most-used page.
 *
 * Wording follows the product vocabulary: "Price" is what the customer pays
 * us, "Buyback" is what we pay the customer - never "Sell"/"Buy".
 */
/** Icon names the web app maps to its icon set; kept as strings so this package stays UI-free. */
type KbGuideIcon = 'file-text' | 'calculator' | 'banknote' | 'lock' | 'package-check' | 'id-card' | 'search-check' | 'hand-coins' | 'boxes' | 'vault' | 'book-user' | 'shield-check' | 'messages' | 'phone' | 'blocks' | 'layout-dashboard' | 'user-search' | 'receipt';
/** A place in the library (a whole SOP, or one section of it), or somewhere else in the app. */
type KbGuideTarget = {
    slug: string;
    anchor?: string;
} | {
    href: string;
};
interface KbGuideLink {
    label: string;
    target: KbGuideTarget;
}
/** The two flows. Price is what the customer pays us; Buyback is what we pay (customers and suppliers). */
type KbFlowTone = 'price' | 'buyback';
/** The Business Central hub page in the web app (the route lives in apps/web/src/config/routes.tsx). */
declare const KB_BC_HUB_PATH = "/knowledge/business-central";
interface KbGuideNode {
    title: string;
    hint: string;
    target: KbGuideTarget;
    /** `soft` is a side situation (reprice); `external` is "not your step" / "nothing to do yet" and renders dashed. */
    kind?: 'soft' | 'external';
    /** Only some of the time ("if new"). */
    optional?: boolean;
}
/** The red STOP bar that runs across both lanes of a phase. */
interface KbGuideGate {
    title: string;
    hint: string;
    target: KbGuideTarget;
}
interface KbGuidePhase {
    title: string;
    gate?: KbGuideGate;
    /** What you do with the customer. */
    desk: KbGuideNode[];
    /** What you click in BC, in the real BC order. */
    bc: KbGuideNode[];
}
interface KbGuideBranch {
    id: KbFlowTone;
    title: string;
    /** Who is buying, in plain words. */
    tag: string;
    blurb: string;
    icon: KbGuideIcon;
    phases: KbGuidePhase[];
    /** Side situations that branch off this path. */
    alsoSee: KbGuideLink[];
}
interface KbGuideShortcut {
    label: string;
    hint: string;
    icon: KbGuideIcon;
    target: KbGuideTarget;
    /** The SOP doesn't exist yet; the tile shows "coming soon" instead of a dead link. */
    pendingSop?: boolean;
}
/** The Business Central banner on the home page: learn it, see both flows, or get unstuck. */
interface KbGuideBc {
    title: string;
    hint: string;
    start: KbGuideLink;
    hub: KbGuideLink;
    stuck: KbGuideLink;
}
type KbBcHubItem = {
    kind: 'step';
    title: string;
    hint: string; /** The BC screen to open, shown as a mono chip. */
    screen: string;
    target: KbGuideTarget;
} | {
    kind: 'stop';
    title: string;
    hint: string;
    target: KbGuideTarget;
} | {
    kind: 'external';
    title: string;
    hint: string;
    target: KbGuideTarget;
};
interface KbBcHubFlow {
    id: KbFlowTone;
    title: string;
    sub: string;
    items: KbBcHubItem[];
    foot: KbGuideLink;
}
interface KbBcChainLink {
    label: string;
    target: KbGuideTarget;
    tone?: 'stop' | 'end';
}
interface KbBcScreen {
    /** The page name as BC shows it - what staff actually know. */
    title: string;
    hint: string;
    flow: KbFlowTone;
    target: KbGuideTarget;
}
interface KbBcTrap {
    title: string;
    hint: string;
    target: KbGuideTarget;
}
interface KbBcHub {
    title: string;
    intro: string;
    flows: KbBcHubFlow[];
    /** "The whole sale, in one line". */
    chain: KbBcChainLink[];
    screens: KbBcScreen[];
    zoho: {
        zoho: string;
        bc: string;
        target: KbGuideTarget;
    }[];
    traps: KbBcTrap[];
    stop: {
        title: string;
        hint: string;
        target: KbGuideTarget;
    };
}
interface KbFlowBar {
    id: string;
    label: string;
    tone: KbFlowTone;
    items: {
        slug: string;
        label: string;
    }[];
    /** Steps happen in this order, so the last step's "Next" can be derived from it. Desk bars are a set, not a sequence. */
    sequential: boolean;
    /** "See the whole flow". */
    overview: KbGuideTarget;
    /** The one-page SOP that covers the whole flow. It carries the flow's badge and leads its list, but is not a step in the stepper. */
    overviewSlug?: string;
}
interface KbGuide {
    start: {
        title: string;
        hint: string;
    };
    businessCentral: KbGuideBc;
    branches: KbGuideBranch[];
    quickLinks: KbGuideShortcut[];
    tools: KbGuideShortcut[];
}
declare const KB_GUIDE: KbGuide;
/** Business Central on one page: the two flows, a screen finder, the Zoho translation and the traps. */
declare const KB_BC_HUB: KbBcHub;
/**
 * Where a procedure sits in the process, for the stepper at the top of its
 * page. Membership lives here rather than in SOP frontmatter, so the SOP owners'
 * files stay untouched.
 */
declare const KB_FLOW_BARS: KbFlowBar[];
/** The flow bar a procedure belongs to, and its place in it. Null when the procedure isn't part of a flow. */
declare function flowBarFor(slug: string, bars?: KbFlowBar[]): {
    bar: KbFlowBar;
    index: number;
} | null;
/** Which flow a procedure belongs to, counting a flow's one-page overview (position -1, ahead of step 1) as well as its steps. */
declare function procedureFlow(slug: string, bars?: KbFlowBar[]): {
    bar: KbFlowBar;
    barIndex: number;
    position: number;
} | null;
/**
 * Order for a list of procedures: general ones first, then the "customer buys from us" flow in the order the work
 * happens (overview, new customer ... collection), then the "we buy in" flow. Ties fall back to the caller's order.
 */
declare function compareProcedures(a: string, b: string, bars?: KbFlowBar[]): number;
/** The slug of the next step in a sequential flow, when the procedure has none of its own "Next" section. */
declare function flowNextSlug(slug: string, bars?: KbFlowBar[]): string | null;
interface KbGuideLibraryTarget {
    slug: string;
    anchor?: string;
    pendingSop: boolean;
}
/** Every library target the guide points at, for tests and for the web app's resolver. */
declare function guideLibraryTargets(guide?: KbGuide, hub?: KbBcHub, bars?: KbFlowBar[]): KbGuideLibraryTarget[];

/**
 * Words and phrases in SOP text that are explained by another SOP. The reader
 * turns the first mention of each into a link, so nobody has to know where
 * "customer safe" or "market modes" is defined. The SOP files are never
 * edited for this: links are added at display time from this list, and a test
 * checks every target against the real SOPs so a renamed heading is caught.
 */
interface KbTerm {
    id: string;
    /** Matched as whole words/phrases, longest first. */
    phrases: string[];
    target: {
        slug: string;
        anchor?: string;
    };
    /** Abbreviations like "VAT" or "BC" must match exactly; "net" in a sentence is not "NET". */
    caseSensitive?: boolean;
    /** The SOP doesn't exist yet; the term simply isn't linked until it does. */
    pendingSop?: boolean;
}
declare const KB_TERMS: KbTerm[];
/** Whole-word matcher for one term. Global, so callers can iterate matches. */
declare function termRegExp(term: KbTerm): RegExp;
/**
 * Decides, once for a whole article, which section links which term. A term
 * is linked only where it first appears - repeating a link on every mention
 * turns a page into a wall of underlines - and never to the article you are
 * already reading. `isAvailable` lets the caller drop targets that aren't in
 * the library (retired, or not written yet).
 */
declare function planAutolinks(sections: {
    anchor: string;
    heading: string;
    markdown: string;
}[], currentSlug: string, isAvailable: (target: KbTerm['target']) => boolean, terms?: KbTerm[]): Map<string, KbTerm[]>;

/**
 * How a procedure page lays out an SOP's Markdown (docs/KNOWLEDGE-CENTER-LAYOUT
 * rules, spec section 6). Everything here is a pure function of the text, so the
 * reader renders the same thing on the server and in the browser and each rule
 * has a unit test against the real SOPs.
 *
 * The SOP files are not changed to suit these rules. A rule that doesn't match
 * simply leaves the section as ordinary Markdown, so an unknown SOP never fails.
 */
interface KbListItem {
    /** The item's Markdown, with its own indentation removed (nested lists stay inside it). */
    markdown: string;
    /** Plain text, for the rules that look at wording and length. */
    text: string;
    hasNested: boolean;
}
type KbBlock = {
    type: 'paragraph';
    markdown: string;
} | {
    type: 'list';
    ordered: boolean;
    items: KbListItem[];
    raw: string;
} | {
    type: 'other';
    markdown: string;
};
/**
 * Splits Markdown into the blocks the layout rules care about: paragraphs, lists
 * and "other" (tables, headings, code, quotes). Top-level list items start at
 * column 0; anything indented belongs to the item above it.
 */
declare function parseBlocks(markdown: string): KbBlock[];
type KbSectionKind = 'lead' | 'related' | 'next' | 'before' | 'stop' | 'proposal' | 'steps' | 'ref';
/** What a section is for, from its heading and whether it holds a numbered list. */
declare function classifySection(section: KbSection, index: number, blocks?: KbBlock[]): KbSectionKind;
/** How a run of Markdown is styled: ordinary text, a numbered rail, lettered cards, tick boxes, or ✕/✓ rules. */
type KbMarkdownVariant = 'plain' | 'steps' | 'miniflow' | 'checklist' | 'rules';
type KbRenderBlock = {
    type: 'markdown';
    markdown: string;
    variant: KbMarkdownVariant;
    /** For `steps`: the line each item starts on in `markdown`, so a chip can scroll to "step 3". */
    itemLines?: number[];
} | {
    type: 'stop';
    markdown: string;
} | {
    type: 'form';
    leadIns: string[];
    rows: KbFormRow[];
} | {
    type: 'rightwrong';
    right: string;
    wrong: string;
};
interface KbFormRow {
    label: string;
    value: string;
    /** The row says "negative", "never" or "do not" - the one that goes wrong. */
    danger: boolean;
}
/** A step that is a warning ("Do not accept the cash until…"), so it gets the STOP look. */
declare function isStopStep(text: string): boolean;
/** Whether a bullet is a "don't" (no), an "always" (yes) or neither. */
declare function ruleTone(text: string): 'no' | 'yes' | 'neutral';
/** A section body as render blocks. Adjacent plain Markdown is merged so it renders as one piece. */
declare function buildBlocks(markdown: string, kind: KbSectionKind): KbRenderBlock[];
interface KbLayoutEntry {
    section: KbSection;
    kind: KbSectionKind;
    blocks: KbRenderBlock[];
    /** Long reference sections and proposals start folded, with a one-line preview. */
    collapsed: boolean;
    preview: string;
    itemCount: number;
}
interface KbArticleLayout {
    /** One entry per section, in order: every section is accounted for. */
    entries: KbLayoutEntry[];
    /** "Sources: …" lifted out of the lead, shown as a footnote. */
    sources: string | null;
    /** The first link in the "Next" section, if it has one. */
    next: KbLinkRef | null;
    /** "On this page": every section with a heading except the lead and Related. */
    contents: {
        anchor: string;
        heading: string;
        hasTodo: boolean;
    }[];
}
declare const COLLAPSE_ABOVE_CHARACTERS = 700;
/** Pulls a "Source(s): …" line (and the lines that continue it) out of Markdown. */
declare function extractSources(markdown: string): {
    markdown: string;
    sources: string | null;
};
/** Everything the procedure page needs to know about an article's sections. Never throws. */
declare function buildArticleLayout(sections: KbSection[]): KbArticleLayout;
/**
 * A section links each concept at its first mention only. The Markdown is now
 * rendered in several pieces, so each term is handed to the first piece that
 * mentions it, and to no other.
 */
declare function shareTermsAcrossBlocks(blocks: KbRenderBlock[], terms: KbTerm[]): Map<number, KbTerm[]>;

/**
 * SOP review cadence (README: "Review every 6 months"). Pure date maths, used
 * by the reader to show when a procedure is next due and by the admin view to
 * list what is overdue. Dates are whole days in UTC, matching how SOPs are
 * dated, so the answer never shifts with the viewer's time zone.
 */
declare const KB_REVIEW_MONTHS = 6;
/** How far ahead a review counts as "due soon". */
declare const KB_REVIEW_WARNING_DAYS = 30;
type KbReviewState = 'ok' | 'due-soon' | 'overdue';
interface KbReviewStatus {
    /** YYYY-MM-DD the next review is due. */
    dueOn: string;
    state: KbReviewState;
    /** Negative once overdue. */
    daysUntilDue: number;
}
/** The date six months on, clamped to the month's end (31 Aug → 28 Feb, never "3 Mar"). */
declare function kbReviewDueOn(contentUpdatedOn: string, months?: number): string;
declare function kbReviewStatus(contentUpdatedOn: string, now?: Date): KbReviewStatus;

/**
 * Internal AI assistant (roadmap 1.5; plan in docs/AI-AGENT-PLAN.md).
 * One question in, one answer out - no conversation history is sent.
 */
/**
 * What the staff member wants from the assistant:
 *  procedures - answer a question about how the desk works (from the approved SOPs)
 *  email      - they pasted a customer's email; draft a reply to send back
 *  whatsapp   - the same, for a WhatsApp message (shorter, less formal)
 */
declare const AiModeEnum: z.ZodEnum<{
    email: "email";
    procedures: "procedures";
    whatsapp: "whatsapp";
}>;
type AiMode = z.infer<typeof AiModeEnum>;
/** Long enough for a real question, short enough that nobody pastes a document (and its tokens) into it. */
declare const AI_QUESTION_MAX_LENGTH = 500;
/** A pasted customer message is longer than a question, but still bounded. */
declare const AI_MESSAGE_MAX_LENGTH = 4000;
declare function aiInputLimit(mode: AiMode): number;
declare const AskRequestSchema: z.ZodObject<{
    question: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<{
        email: "email";
        procedures: "procedures";
        whatsapp: "whatsapp";
    }>>;
    spotOverrides: z.ZodOptional<z.ZodObject<{
        GOLD: z.ZodOptional<z.ZodNumber>;
        SILVER: z.ZodOptional<z.ZodNumber>;
        PLATINUM: z.ZodOptional<z.ZodNumber>;
        PALLADIUM: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type AskRequest = z.infer<typeof AskRequestSchema>;
/** What a client sends: `mode` may be left out and defaults to "procedures". */
type AskRequestInput = z.input<typeof AskRequestSchema>;
/**
 * answered - answered from the SOPs, with at least one valid citation
 * refused  - the approved SOPs don't cover it (or it isn't confirmed), and the assistant said so
 * uncited  - the model answered but cited nothing the library recognises; shown with a warning
 */
declare const AiAnswerStatusEnum: z.ZodEnum<{
    answered: "answered";
    refused: "refused";
    uncited: "uncited";
}>;
type AiAnswerStatus = z.infer<typeof AiAnswerStatusEnum>;
/** A section of a SOP the answer relied on. `anchor` is null for a citation of a whole SOP. */
declare const AiCitationSchema: z.ZodObject<{
    slug: z.ZodString;
    anchor: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    heading: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type AiCitation = z.infer<typeof AiCitationSchema>;
declare const AiUsageSchema: z.ZodObject<{
    inputTokens: z.ZodNumber;
    cachedInputTokens: z.ZodNumber;
    cacheWriteInputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodNumber;
}, z.core.$strip>;
type AiUsage = z.infer<typeof AiUsageSchema>;
/**
 * What the spot behind a priced answer was, for the staff member only (it is not part of the reply):
 * `custom` = a frozen or typed spot, `stale` = a live spot that may be out of date, `healthy` = a fresh live spot.
 */
declare const AiSpotNoteSchema: z.ZodObject<{
    tone: z.ZodEnum<{
        custom: "custom";
        stale: "stale";
        healthy: "healthy";
    }>;
    message: z.ZodString;
}, z.core.$strip>;
type AiSpotNote = z.infer<typeof AiSpotNoteSchema>;
declare const AskResponseSchema: z.ZodObject<{
    questionId: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    answer: z.ZodString;
    mode: z.ZodEnum<{
        email: "email";
        procedures: "procedures";
        whatsapp: "whatsapp";
    }>;
    status: z.ZodEnum<{
        answered: "answered";
        refused: "refused";
        uncited: "uncited";
    }>;
    citations: z.ZodArray<z.ZodObject<{
        slug: z.ZodString;
        anchor: z.ZodNullable<z.ZodString>;
        title: z.ZodString;
        heading: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    model: z.ZodString;
    usage: z.ZodObject<{
        inputTokens: z.ZodNumber;
        cachedInputTokens: z.ZodNumber;
        cacheWriteInputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodNumber;
    }, z.core.$strip>;
    latencyMs: z.ZodNumber;
    corpus: z.ZodObject<{
        documents: z.ZodNumber;
        hash: z.ZodString;
    }, z.core.$strip>;
    cached: z.ZodBoolean;
    notes: z.ZodNullable<z.ZodString>;
    warnings: z.ZodArray<z.ZodString>;
    spotNote: z.ZodNullable<z.ZodObject<{
        tone: z.ZodEnum<{
            custom: "custom";
            stale: "stale";
            healthy: "healthy";
        }>;
        message: z.ZodString;
    }, z.core.$strip>>;
    toolsUsed: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
type AskResponse = z.infer<typeof AskResponseSchema>;
declare const AiStatusSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    model: z.ZodString;
}, z.core.$strip>;
type AiStatus = z.infer<typeof AiStatusSchema>;
/**
 * What POST /ai/ask/stream sends, one JSON object per server-sent event:
 *  delta - a piece of the answer as the model writes it (shown live, may still be corrected)
 *  tool  - the assistant is looking something up (e.g. a price); no text yet
 *  done  - the final, validated answer; the reader replaces whatever it streamed with this
 *  error - the question could not be answered; `status` is the HTTP status it would have had
 */
declare const AskStreamEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"delta">;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool">;
    name: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"done">;
    response: z.ZodObject<{
        questionId: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
        answer: z.ZodString;
        mode: z.ZodEnum<{
            email: "email";
            procedures: "procedures";
            whatsapp: "whatsapp";
        }>;
        status: z.ZodEnum<{
            answered: "answered";
            refused: "refused";
            uncited: "uncited";
        }>;
        citations: z.ZodArray<z.ZodObject<{
            slug: z.ZodString;
            anchor: z.ZodNullable<z.ZodString>;
            title: z.ZodString;
            heading: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        model: z.ZodString;
        usage: z.ZodObject<{
            inputTokens: z.ZodNumber;
            cachedInputTokens: z.ZodNumber;
            cacheWriteInputTokens: z.ZodOptional<z.ZodNumber>;
            outputTokens: z.ZodNumber;
        }, z.core.$strip>;
        latencyMs: z.ZodNumber;
        corpus: z.ZodObject<{
            documents: z.ZodNumber;
            hash: z.ZodString;
        }, z.core.$strip>;
        cached: z.ZodBoolean;
        notes: z.ZodNullable<z.ZodString>;
        warnings: z.ZodArray<z.ZodString>;
        spotNote: z.ZodNullable<z.ZodObject<{
            tone: z.ZodEnum<{
                custom: "custom";
                stale: "stale";
                healthy: "healthy";
            }>;
            message: z.ZodString;
        }, z.core.$strip>>;
        toolsUsed: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"error">;
    status: z.ZodNumber;
    message: z.ZodString;
}, z.core.$strip>], "type">;
type AskStreamEvent = z.infer<typeof AskStreamEventSchema>;

declare const HealthStatusEnum: z.ZodEnum<{
    up: "up";
    degraded: "degraded";
    down: "down";
}>;
declare const HealthItemSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    status: z.ZodEnum<{
        up: "up";
        degraded: "degraded";
        down: "down";
    }>;
    detail: z.ZodString;
}, z.core.$strip>;
/** One hour of API traffic. `hour` is the start of the hour, ISO 8601 UTC. */
declare const HourlyStatsSchema: z.ZodObject<{
    hour: z.ZodString;
    requests: z.ZodNumber;
    clientErrors: z.ZodNumber;
    serverErrors: z.ZodNumber;
    avgLatencyMs: z.ZodNumber;
    logins: z.ZodNumber;
    failedLogins: z.ZodNumber;
}, z.core.$strip>;
declare const RouteStatsSchema: z.ZodObject<{
    route: z.ZodString;
    count: z.ZodNumber;
    errors: z.ZodNumber;
    avgLatencyMs: z.ZodNumber;
}, z.core.$strip>;
declare const TableSizeSchema: z.ZodObject<{
    name: z.ZodString;
    bytes: z.ZodNumber;
    rows: z.ZodNumber;
}, z.core.$strip>;
declare const AdminOverviewSchema: z.ZodObject<{
    generatedAt: z.ZodString;
    uptimeSeconds: z.ZodNumber;
    nodeVersion: z.ZodString;
    environment: z.ZodString;
    aiEnabled: z.ZodBoolean;
    aiSpend: z.ZodNullable<z.ZodObject<{
        spentUsd: z.ZodNumber;
        dailyLimitUsd: z.ZodNumber;
    }, z.core.$strip>>;
    health: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        status: z.ZodEnum<{
            up: "up";
            degraded: "degraded";
            down: "down";
        }>;
        detail: z.ZodString;
    }, z.core.$strip>>;
    metricsAvailable: z.ZodBoolean;
    hours: z.ZodArray<z.ZodObject<{
        hour: z.ZodString;
        requests: z.ZodNumber;
        clientErrors: z.ZodNumber;
        serverErrors: z.ZodNumber;
        avgLatencyMs: z.ZodNumber;
        logins: z.ZodNumber;
        failedLogins: z.ZodNumber;
    }, z.core.$strip>>;
    topRoutes: z.ZodArray<z.ZodObject<{
        route: z.ZodString;
        count: z.ZodNumber;
        errors: z.ZodNumber;
        avgLatencyMs: z.ZodNumber;
    }, z.core.$strip>>;
    databaseBytes: z.ZodNumber;
    tables: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        bytes: z.ZodNumber;
        rows: z.ZodNumber;
    }, z.core.$strip>>;
    usersByRole: z.ZodArray<z.ZodObject<{
        role: z.ZodString;
        count: z.ZodNumber;
    }, z.core.$strip>>;
    activeUsers: z.ZodNumber;
    errorsByKind: z.ZodArray<z.ZodObject<{
        kind: z.ZodString;
        count: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const LogLevelEnum: z.ZodEnum<{
    error: "error";
    trace: "trace";
    debug: "debug";
    info: "info";
    warn: "warn";
    fatal: "fatal";
}>;
declare const AdminLogEntrySchema: z.ZodObject<{
    id: z.ZodNumber;
    time: z.ZodNumber;
    level: z.ZodEnum<{
        error: "error";
        trace: "trace";
        debug: "debug";
        info: "info";
        warn: "warn";
        fatal: "fatal";
    }>;
    message: z.ZodString;
    context: z.ZodNullable<z.ZodString>;
    method: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    status: z.ZodNullable<z.ZodNumber>;
    responseTimeMs: z.ZodNullable<z.ZodNumber>;
    extra: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
declare const AdminLogsResponseSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        time: z.ZodNumber;
        level: z.ZodEnum<{
            error: "error";
            trace: "trace";
            debug: "debug";
            info: "info";
            warn: "warn";
            fatal: "fatal";
        }>;
        message: z.ZodString;
        context: z.ZodNullable<z.ZodString>;
        method: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        status: z.ZodNullable<z.ZodNumber>;
        responseTimeMs: z.ZodNullable<z.ZodNumber>;
        extra: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strip>>;
    capacity: z.ZodNumber;
}, z.core.$strip>;
declare const AuditEntrySchema: z.ZodObject<{
    at: z.ZodString;
    user: z.ZodString;
    action: z.ZodString;
    detail: z.ZodString;
}, z.core.$strip>;
declare const AuditLogResponseSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        at: z.ZodString;
        user: z.ZodString;
        action: z.ZodString;
        detail: z.ZodString;
    }, z.core.$strip>>;
    persisted: z.ZodBoolean;
}, z.core.$strip>;
declare const ApiEndpointParameterSchema: z.ZodObject<{
    name: z.ZodString;
    in: z.ZodEnum<{
        path: "path";
        query: "query";
        header: "header";
    }>;
    required: z.ZodBoolean;
    type: z.ZodString;
    options: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ApiEndpointSchema: z.ZodObject<{
    method: z.ZodEnum<{
        GET: "GET";
        POST: "POST";
        PUT: "PUT";
        PATCH: "PATCH";
        DELETE: "DELETE";
    }>;
    path: z.ZodString;
    summary: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tag: z.ZodString;
    requiresAuth: z.ZodBoolean;
    parameters: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        in: z.ZodEnum<{
            path: "path";
            query: "query";
            header: "header";
        }>;
        required: z.ZodBoolean;
        type: z.ZodString;
        options: z.ZodOptional<z.ZodArray<z.ZodString>>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    bodyExample: z.ZodNullable<z.ZodUnknown>;
}, z.core.$strip>;
declare const ApiCatalogueSchema: z.ZodObject<{
    endpoints: z.ZodArray<z.ZodObject<{
        method: z.ZodEnum<{
            GET: "GET";
            POST: "POST";
            PUT: "PUT";
            PATCH: "PATCH";
            DELETE: "DELETE";
        }>;
        path: z.ZodString;
        summary: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        tag: z.ZodString;
        requiresAuth: z.ZodBoolean;
        parameters: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            in: z.ZodEnum<{
                path: "path";
                query: "query";
                header: "header";
            }>;
            required: z.ZodBoolean;
            type: z.ZodString;
            options: z.ZodOptional<z.ZodArray<z.ZodString>>;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        bodyExample: z.ZodNullable<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const DbColumnSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    nullable: z.ZodBoolean;
    hasDefault: z.ZodBoolean;
    isPrimaryKey: z.ZodBoolean;
    readOnly: z.ZodBoolean;
    enumValues: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const DbTableSummarySchema: z.ZodObject<{
    name: z.ZodString;
    rows: z.ZodNumber;
    bytes: z.ZodNumber;
    writable: z.ZodBoolean;
}, z.core.$strip>;
declare const DbTablesResponseSchema: z.ZodObject<{
    tables: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        rows: z.ZodNumber;
        bytes: z.ZodNumber;
        writable: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const DbRowsResponseSchema: z.ZodObject<{
    table: z.ZodString;
    writable: z.ZodBoolean;
    columns: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        nullable: z.ZodBoolean;
        hasDefault: z.ZodBoolean;
        isPrimaryKey: z.ZodBoolean;
        readOnly: z.ZodBoolean;
        enumValues: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    rows: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
}, z.core.$strip>;
declare const DbInsertRequestSchema: z.ZodObject<{
    values: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodArray<z.ZodUnknown>]>>;
}, z.core.$strip>;
declare const DbUpdateRequestSchema: z.ZodObject<{
    key: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    values: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodArray<z.ZodUnknown>]>>;
}, z.core.$strip>;
declare const DbDeleteRequestSchema: z.ZodObject<{
    key: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
}, z.core.$strip>;
declare const DbRowResponseSchema: z.ZodObject<{
    row: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
type HealthStatus = z.infer<typeof HealthStatusEnum>;
type HealthItem = z.infer<typeof HealthItemSchema>;
type HourlyStats = z.infer<typeof HourlyStatsSchema>;
type RouteStats = z.infer<typeof RouteStatsSchema>;
type AdminOverview = z.infer<typeof AdminOverviewSchema>;
type LogLevel = z.infer<typeof LogLevelEnum>;
type AdminLogEntry = z.infer<typeof AdminLogEntrySchema>;
type AuditEntry = z.infer<typeof AuditEntrySchema>;
type ApiEndpoint = z.infer<typeof ApiEndpointSchema>;
type ApiEndpointParameter = z.infer<typeof ApiEndpointParameterSchema>;
type DbColumn = z.infer<typeof DbColumnSchema>;
type DbTableSummary = z.infer<typeof DbTableSummarySchema>;
type DbRowsResponse = z.infer<typeof DbRowsResponseSchema>;
type DbInsertRequest = z.infer<typeof DbInsertRequestSchema>;
type DbUpdateRequest = z.infer<typeof DbUpdateRequestSchema>;
type DbDeleteRequest = z.infer<typeof DbDeleteRequestSchema>;

/** The roadmap Markdown as stored in the database. `version` is bumped on every save (optimistic locking). */
declare const RoadmapDocumentSchema: z.ZodObject<{
    markdown: z.ZodString;
    version: z.ZodNumber;
    updatedBy: z.ZodNullable<z.ZodString>;
    updatedAt: z.ZodNullable<z.ZodISODateTime>;
}, z.core.$strip>;
/**
 * One change to the roadmap. Lines are 0-based indexes into the version the client is looking at;
 * `text` repeats the task's current text so a stale index is refused instead of hitting the wrong task.
 */
declare const RoadmapEditSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"toggle">;
    line: z.ZodNumber;
    text: z.ZodString;
    checked: z.ZodBoolean;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"add">;
    sectionLine: z.ZodNumber;
    parentLine: z.ZodOptional<z.ZodNumber>;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"delete">;
    line: z.ZodNumber;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"edit">;
    line: z.ZodNumber;
    text: z.ZodString;
    newText: z.ZodString;
}, z.core.$strip>], "type">;
declare const RoadmapEditRequestSchema: z.ZodObject<{
    version: z.ZodNumber;
    edit: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"toggle">;
        line: z.ZodNumber;
        text: z.ZodString;
        checked: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"add">;
        sectionLine: z.ZodNumber;
        parentLine: z.ZodOptional<z.ZodNumber>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"delete">;
        line: z.ZodNumber;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"edit">;
        line: z.ZodNumber;
        text: z.ZodString;
        newText: z.ZodString;
    }, z.core.$strip>], "type">;
}, z.core.$strip>;
type RoadmapDocument = z.infer<typeof RoadmapDocumentSchema>;
type RoadmapEdit = z.infer<typeof RoadmapEditSchema>;
type RoadmapEditRequest = z.infer<typeof RoadmapEditRequestSchema>;

/**
 * Pure helpers for docs/ROADMAP.md, shared by the API (which applies edits) and the web page (which
 * reads the structure). Everything works on lines, so an edit touches only the line it means to and the
 * rest of the file, wording and spacing included, comes back untouched.
 */
interface RoadmapTask {
    /** 0-based line in the Markdown. */
    line: number;
    checked: boolean;
    text: string;
    /** Indented non-checkbox lines under the task (evidence, caveats). */
    notes: string[];
    children: RoadmapTask[];
}
interface RoadmapSection {
    /** `0.12`, or a slug for headings without an ID (`icebox`). Unique in the file. */
    key: string;
    /** The ID as written (`0.12`), or null. */
    id: string | null;
    title: string;
    /** Section note from the heading, e.g. "quick win; feeds charts". */
    note: string | null;
    /** `← depends: …` from the heading. */
    depends: string | null;
    priority: 'P0' | 'P1' | 'P2' | 'P3' | null;
    /** The `# ` heading this section sits under. */
    group: string;
    /** 0-based line of the heading. */
    headingLine: number;
    /** Prose, tables and plain bullets that are not tasks. */
    body: string;
    tasks: RoadmapTask[];
}
interface RoadmapProgress {
    done: number;
    total: number;
}
/** Splits the roadmap into its `#`/`##` sections, each with its task tree. */
declare function parseRoadmap(markdown: string): RoadmapSection[];
declare function countTasks(tasks: RoadmapTask[]): RoadmapProgress;
declare class RoadmapEditError extends Error {
}
/** Applies one edit and returns the new Markdown. Throws RoadmapEditError when the edit does not fit the file. */
declare function applyRoadmapEdit(markdown: string, edit: RoadmapEdit): string;

/**
 * Three-way merge of docs/ROADMAP.md for the sync between the app's copy and the file on `master`
 * (docs/ROADMAP-TOOL-PLAN.md section 7). Pure and line based, like the rest of the roadmap helpers, so
 * everything a side did not touch comes back byte for byte.
 *
 *   base - the file at the last sync
 *   file - the file on master now
 *   app  - the app's copy now
 *
 * Two results come back because one rule makes them differ: a task that disappears from the file is
 * never deleted from the app (it stays, and is reported), while the file keeps its deletion.
 *
 * Per region (a stretch of lines between lines all three versions agree on):
 *
 * | Situation                                    | forApp        | forFile       |
 * |----------------------------------------------|---------------|---------------|
 * | only the app changed it                      | app           | app           |
 * | only the file changed it                     | file          | file          |
 * | only the file deleted it                     | kept, flagged | file (deleted)|
 * | both made the same change                    | that change   | that change   |
 * | both changed it differently                  | app wins      | app wins      |
 * | app deleted it, file edited it since base    | file (kept)   | file (kept)   |
 * | both added different lines at the same place | both          | both          |
 */
type RoadmapMergeKind = 'to-file' | 'to-app' | 'conflict-app-wins' | 'kept-file-edit' | 'missing-from-file' | 'both-added';
interface RoadmapMergeEntry {
    kind: RoadmapMergeKind;
    /** 1-based line in the base where the region starts (the line it would be inserted before, for pure additions). */
    baseLine: number;
    /** The first non-empty line involved, trimmed, for the log. */
    text: string;
}
interface RoadmapMergeResult {
    forApp: string;
    forFile: string;
    log: RoadmapMergeEntry[];
    /** True when `forFile` differs from the file on master, i.e. there is something to push. */
    fileChanged: boolean;
    /** True when `forApp` differs from the app's copy, i.e. there is something to pull. */
    appChanged: boolean;
}
/** Three-way merge; see the file comment for the rules. All three inputs are whole Markdown documents. */
declare function mergeRoadmap(baseText: string, fileText: string, appText: string): RoadmapMergeResult;

/**
 * Where the app's roadmap stands against `docs/ROADMAP.md` on master (GET /roadmap/sync). Read only:
 * slice 1 of docs/ROADMAP-TOOL-PLAN.md shows the gap; nothing is written to the app or to GitHub.
 */
declare const RoadmapSyncStatusSchema: z.ZodObject<{
    state: z.ZodEnum<{
        unconfigured: "unconfigured";
        "in-sync": "in-sync";
        differs: "differs";
        unavailable: "unavailable";
    }>;
    repo: z.ZodString;
    branch: z.ZodString;
    masterCommit: z.ZodNullable<z.ZodString>;
    appVersion: z.ZodNumber;
    appUpdatedAt: z.ZodNullable<z.ZodISODateTime>;
    appOnlyLines: z.ZodNumber;
    masterOnlyLines: z.ZodNumber;
    preview: z.ZodArray<z.ZodString>;
    openSyncPr: z.ZodNullable<z.ZodObject<{
        number: z.ZodNumber;
        title: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>;
    tokenExpiresAt: z.ZodNullable<z.ZodISODateTime>;
    error: z.ZodNullable<z.ZodString>;
    appEditsToPush: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type RoadmapSyncStatus = z.infer<typeof RoadmapSyncStatusSchema>;
/** What a pull may be asked to do (POST /roadmap/sync/pull). */
declare const RoadmapPullRequestSchema: z.ZodObject<{
    dryRun: z.ZodOptional<z.ZodBoolean>;
    confirmReplace: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * The outcome of a pull, or of its preview: what the dry run shows is what the real run returns.
 * `adopt` is the first run (replaces the app's copy with master's), `merge` every later one, `nothing`
 * when master has not moved since the last pull.
 */
declare const RoadmapPullResultSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        adopt: "adopt";
        merge: "merge";
        nothing: "nothing";
    }>;
    applied: z.ZodBoolean;
    commit: z.ZodString;
    appChanged: z.ZodBoolean;
    log: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            "to-file": "to-file";
            "to-app": "to-app";
            "conflict-app-wins": "conflict-app-wins";
            "kept-file-edit": "kept-file-edit";
            "missing-from-file": "missing-from-file";
            "both-added": "both-added";
        }>;
        baseLine: z.ZodNumber;
        text: z.ZodString;
    }, z.core.$strip>>;
    appOnlyTasks: z.ZodArray<z.ZodObject<{
        section: z.ZodString;
        title: z.ZodString;
        checked: z.ZodBoolean;
    }, z.core.$strip>>;
    appOnlyTaskCount: z.ZodNumber;
    ticksOnlyInApp: z.ZodArray<z.ZodObject<{
        section: z.ZodString;
        title: z.ZodString;
        checked: z.ZodBoolean;
    }, z.core.$strip>>;
    ticksOnlyInAppCount: z.ZodNumber;
    appOnlyLines: z.ZodNumber;
    masterOnlyLines: z.ZodNumber;
    snapshotId: z.ZodNullable<z.ZodNumber>;
    appVersion: z.ZodNumber;
}, z.core.$strip>;
/** What a push may be asked to do (POST /roadmap/sync/push). */
declare const RoadmapPushRequestSchema: z.ZodObject<{
    dryRun: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/** The outcome of a push, or of its preview: what the dry run shows is what the real run returns. */
declare const RoadmapPushResultSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        push: "push";
        nothing: "nothing";
    }>;
    applied: z.ZodBoolean;
    commit: z.ZodString;
    edits: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            "to-file": "to-file";
            "to-app": "to-app";
            "conflict-app-wins": "conflict-app-wins";
            "kept-file-edit": "kept-file-edit";
            "missing-from-file": "missing-from-file";
            "both-added": "both-added";
        }>;
        baseLine: z.ZodNumber;
        text: z.ZodString;
    }, z.core.$strip>>;
    diffPreview: z.ZodArray<z.ZodString>;
    prNumber: z.ZodNullable<z.ZodNumber>;
    prUrl: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type RoadmapPullRequest = z.infer<typeof RoadmapPullRequestSchema>;
type RoadmapPullResult = z.infer<typeof RoadmapPullResultSchema>;
type RoadmapPushRequest = z.infer<typeof RoadmapPushRequestSchema>;
type RoadmapPushResult = z.infer<typeof RoadmapPushResultSchema>;

/** One captured idea: a GitHub issue labelled `roadmap`, copied into the app to triage (roadmap 1.20 slice 4). */
declare const RoadmapInboxItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    issueNumber: z.ZodNumber;
    title: z.ZodString;
    body: z.ZodString;
    kind: z.ZodNullable<z.ZodString>;
    url: z.ZodString;
    status: z.ZodEnum<{
        new: "new";
        promoted: "promoted";
        dismissed: "dismissed";
    }>;
    issueCreatedAt: z.ZodISODateTime;
    handledAt: z.ZodNullable<z.ZodISODateTime>;
    handledBy: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const RoadmapInboxSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        issueNumber: z.ZodNumber;
        title: z.ZodString;
        body: z.ZodString;
        kind: z.ZodNullable<z.ZodString>;
        url: z.ZodString;
        status: z.ZodEnum<{
            new: "new";
            promoted: "promoted";
            dismissed: "dismissed";
        }>;
        issueCreatedAt: z.ZodISODateTime;
        handledAt: z.ZodNullable<z.ZodISODateTime>;
        handledBy: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    configured: z.ZodBoolean;
}, z.core.$strip>;
/** What a refresh found. */
declare const RoadmapInboxRefreshSchema: z.ZodObject<{
    added: z.ZodNumber;
    closedOnGithub: z.ZodNumber;
}, z.core.$strip>;
/** Turn an item into a task in a section: the heading line of the section, the task text, and the roadmap version on screen. */
declare const RoadmapInboxPromoteSchema: z.ZodObject<{
    sectionLine: z.ZodNumber;
    text: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strip>;
type RoadmapInboxItem = z.infer<typeof RoadmapInboxItemSchema>;
type RoadmapInbox = z.infer<typeof RoadmapInboxSchema>;
type RoadmapInboxRefresh = z.infer<typeof RoadmapInboxRefreshSchema>;
type RoadmapInboxPromote = z.infer<typeof RoadmapInboxPromoteSchema>;

/**
 * What the app and master last agreed on, after master's changes are taken in
 * (docs/ROADMAP-SYNC-PULL-DESIGN.md section 2). Master's deletions stay in it, flagged, so a later push
 * cannot bring them back; what differs between the app and this text is exactly the app's own edits.
 */
declare function absorbFile(base: string, file: string): string;
interface TaskRef {
    /** Section key, e.g. `1.12`. */
    section: string;
    title: string;
    checked: boolean;
}
interface AppOnlyTasks {
    /** In the app, nowhere on master (same section, same text). */
    appOnly: TaskRef[];
    /** Ticked in the app, present but unticked on master. */
    ticksOnlyInApp: TaskRef[];
}
/**
 * The tasks a first pull would put at risk: those only the app has, and ticks only the app made.
 * Matching is by section key and task text, ignoring case, spacing, punctuation, dash style and emoji; a task
 * whose first part matches counts as the same task even if its trailing note was reworded, so a stale copy
 * that differs only in wording does not look like hundreds of app-only tasks.
 */
declare function findAppOnlyTasks(app: string, master: string): AppOnlyTasks;

/** The scope files a roadmap is made of, in the order they are bundled. */
declare const ROADMAP_SCOPE_FILES: readonly [{
    readonly key: "features";
    readonly path: "docs/roadmap/features.md";
    readonly required: true;
}, {
    readonly key: "fixes";
    readonly path: "docs/roadmap/fixes.md";
    readonly required: true;
}, {
    readonly key: "ops";
    readonly path: "docs/roadmap/ops.md";
    readonly required: true;
}, {
    readonly key: "decisions";
    readonly path: "docs/roadmap/decisions.md";
    readonly required: true;
}, {
    readonly key: "now";
    readonly path: "docs/NOW.md";
    readonly required: false;
}];
declare const RoadmapScopeKeySchema: z.ZodEnum<{
    features: "features";
    fixes: "fixes";
    ops: "ops";
}>;
declare const RoadmapScopeTaskSchema: z.ZodObject<{
    checked: z.ZodBoolean;
    text: z.ZodString;
    depth: z.ZodNumber;
}, z.core.$strip>;
/** One open item of a scope file (`### F-02 · Title` block). */
declare const RoadmapScopeItemSchema: z.ZodObject<{
    id: z.ZodString;
    scope: z.ZodEnum<{
        features: "features";
        fixes: "fixes";
        ops: "ops";
    }>;
    title: z.ZodString;
    priority: z.ZodEnum<{
        P0: "P0";
        P1: "P1";
        P2: "P2";
        P3: "P3";
    }>;
    effort: z.ZodEnum<{
        S: "S";
        M: "M";
        L: "L";
        XL: "XL";
    }>;
    status: z.ZodEnum<{
        done: "done";
        next: "next";
        idea: "idea";
        planned: "planned";
        doing: "doing";
        dropped: "dropped";
    }>;
    after: z.ZodArray<z.ZodString>;
    flags: z.ZodArray<z.ZodString>;
    verified: z.ZodNullable<z.ZodString>;
    was: z.ZodNullable<z.ZodString>;
    evidence: z.ZodArray<z.ZodString>;
    spec: z.ZodNullable<z.ZodString>;
    deadline: z.ZodNullable<z.ZodString>;
    body: z.ZodString;
    tasks: z.ZodArray<z.ZodObject<{
        checked: z.ZodBoolean;
        text: z.ZodString;
        depth: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** A finished item: one line of the `## Done` list. */
declare const RoadmapScopeDoneSchema: z.ZodObject<{
    id: z.ZodString;
    scope: z.ZodEnum<{
        features: "features";
        fixes: "fixes";
        ops: "ops";
    }>;
    text: z.ZodString;
}, z.core.$strip>;
declare const RoadmapScopeDecisionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    settled: z.ZodBoolean;
    default: z.ZodNullable<z.ZodString>;
    blocks: z.ZodNullable<z.ZodString>;
    text: z.ZodString;
}, z.core.$strip>;
declare const RoadmapScopeViewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scope: z.ZodEnum<{
            features: "features";
            fixes: "fixes";
            ops: "ops";
        }>;
        title: z.ZodString;
        priority: z.ZodEnum<{
            P0: "P0";
            P1: "P1";
            P2: "P2";
            P3: "P3";
        }>;
        effort: z.ZodEnum<{
            S: "S";
            M: "M";
            L: "L";
            XL: "XL";
        }>;
        status: z.ZodEnum<{
            done: "done";
            next: "next";
            idea: "idea";
            planned: "planned";
            doing: "doing";
            dropped: "dropped";
        }>;
        after: z.ZodArray<z.ZodString>;
        flags: z.ZodArray<z.ZodString>;
        verified: z.ZodNullable<z.ZodString>;
        was: z.ZodNullable<z.ZodString>;
        evidence: z.ZodArray<z.ZodString>;
        spec: z.ZodNullable<z.ZodString>;
        deadline: z.ZodNullable<z.ZodString>;
        body: z.ZodString;
        tasks: z.ZodArray<z.ZodObject<{
            checked: z.ZodBoolean;
            text: z.ZodString;
            depth: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    done: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scope: z.ZodEnum<{
            features: "features";
            fixes: "fixes";
            ops: "ops";
        }>;
        text: z.ZodString;
    }, z.core.$strip>>;
    decisions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        settled: z.ZodBoolean;
        default: z.ZodNullable<z.ZodString>;
        blocks: z.ZodNullable<z.ZodString>;
        text: z.ZodString;
    }, z.core.$strip>>;
    now: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** `GET /roadmap/scope`: the stored view and where it came from. */
declare const RoadmapScopeSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    configured: z.ZodBoolean;
    empty: z.ZodBoolean;
    repo: z.ZodNullable<z.ZodString>;
    branch: z.ZodNullable<z.ZodString>;
    commit: z.ZodNullable<z.ZodString>;
    version: z.ZodNumber;
    syncedAt: z.ZodNullable<z.ZodISODateTime>;
    syncedBy: z.ZodNullable<z.ZodString>;
    view: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            scope: z.ZodEnum<{
                features: "features";
                fixes: "fixes";
                ops: "ops";
            }>;
            title: z.ZodString;
            priority: z.ZodEnum<{
                P0: "P0";
                P1: "P1";
                P2: "P2";
                P3: "P3";
            }>;
            effort: z.ZodEnum<{
                S: "S";
                M: "M";
                L: "L";
                XL: "XL";
            }>;
            status: z.ZodEnum<{
                done: "done";
                next: "next";
                idea: "idea";
                planned: "planned";
                doing: "doing";
                dropped: "dropped";
            }>;
            after: z.ZodArray<z.ZodString>;
            flags: z.ZodArray<z.ZodString>;
            verified: z.ZodNullable<z.ZodString>;
            was: z.ZodNullable<z.ZodString>;
            evidence: z.ZodArray<z.ZodString>;
            spec: z.ZodNullable<z.ZodString>;
            deadline: z.ZodNullable<z.ZodString>;
            body: z.ZodString;
            tasks: z.ZodArray<z.ZodObject<{
                checked: z.ZodBoolean;
                text: z.ZodString;
                depth: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        done: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            scope: z.ZodEnum<{
                features: "features";
                fixes: "fixes";
                ops: "ops";
            }>;
            text: z.ZodString;
        }, z.core.$strip>>;
        decisions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            settled: z.ZodBoolean;
            default: z.ZodNullable<z.ZodString>;
            blocks: z.ZodNullable<z.ZodString>;
            text: z.ZodString;
        }, z.core.$strip>>;
        now: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const RoadmapScopeRefreshSchema: z.ZodObject<{
    changed: z.ZodBoolean;
    commit: z.ZodString;
    version: z.ZodNumber;
    items: z.ZodNumber;
    decisions: z.ZodNumber;
}, z.core.$strip>;
type RoadmapScopeKey = z.infer<typeof RoadmapScopeKeySchema>;
type RoadmapScopeTask = z.infer<typeof RoadmapScopeTaskSchema>;
type RoadmapScopeItem = z.infer<typeof RoadmapScopeItemSchema>;
type RoadmapScopeDone = z.infer<typeof RoadmapScopeDoneSchema>;
type RoadmapScopeDecision = z.infer<typeof RoadmapScopeDecisionSchema>;
type RoadmapScopeView = z.infer<typeof RoadmapScopeViewSchema>;
type RoadmapScope = z.infer<typeof RoadmapScopeSchema>;
type RoadmapScopeRefresh = z.infer<typeof RoadmapScopeRefreshSchema>;

/** One text holding every file, each preceded by a marker line. Missing optional files are left out. */
declare function bundleScopeFiles(files: {
    path: string;
    content: string;
}[]): string;
declare function splitScopeBundle(bundle: string): Map<string, string>;
/** Open items and Done lines of one scope file. Blocks that do not match the format are skipped. */
declare function parseScopeFile(scope: RoadmapScopeKey, markdown: string): {
    items: RoadmapScopeItem[];
    done: RoadmapScopeDone[];
};
/** Open decisions (`### D-nn` blocks) and settled ones (`- D-nn · text` lines). */
declare function parseDecisions(markdown: string): RoadmapScopeDecision[];
/** The whole view from a bundle made by `bundleScopeFiles`. */
declare function parseScopeBundle(bundle: string): RoadmapScopeView;
declare const EMPTY_SCOPE_VIEW: RoadmapScopeView;

/** Where a queued note came from. Queue notes only ever add a line to docs/INBOX.md; they carry no ID, priority or effort. */
declare const RoadmapQueueSourceSchema: z.ZodEnum<{
    web: "web";
    phone: "phone";
}>;
declare const ROADMAP_QUEUE_MAX_TEXT = 500;
/** A note typed in the app or sent from the phone shortcut. Whitespace is collapsed on the server. */
declare const RoadmapQueueRequestSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
declare const RoadmapQueueEntrySchema: z.ZodObject<{
    id: z.ZodNumber;
    text: z.ZodString;
    source: z.ZodEnum<{
        web: "web";
        phone: "phone";
    }>;
    status: z.ZodEnum<{
        new: "new";
        filed: "filed";
    }>;
    line: z.ZodString;
    createdAt: z.ZodISODateTime;
    filedAt: z.ZodNullable<z.ZodISODateTime>;
}, z.core.$strip>;
declare const RoadmapQueueListSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        text: z.ZodString;
        source: z.ZodEnum<{
            web: "web";
            phone: "phone";
        }>;
        status: z.ZodEnum<{
            new: "new";
            filed: "filed";
        }>;
        line: z.ZodString;
        createdAt: z.ZodISODateTime;
        filedAt: z.ZodNullable<z.ZodISODateTime>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const RoadmapQueueAppendedSchema: z.ZodObject<{
    id: z.ZodNumber;
    line: z.ZodString;
}, z.core.$strip>;
declare const RoadmapQueueFiledRequestSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
declare const RoadmapQueueFiledResultSchema: z.ZodObject<{
    filed: z.ZodNumber;
}, z.core.$strip>;
type RoadmapQueueSource = z.infer<typeof RoadmapQueueSourceSchema>;
type RoadmapQueueRequest = z.infer<typeof RoadmapQueueRequestSchema>;
type RoadmapQueueEntry = z.infer<typeof RoadmapQueueEntrySchema>;
type RoadmapQueueList = z.infer<typeof RoadmapQueueListSchema>;
type RoadmapQueueAppended = z.infer<typeof RoadmapQueueAppendedSchema>;
type RoadmapQueueFiledRequest = z.infer<typeof RoadmapQueueFiledRequestSchema>;
type RoadmapQueueFiledResult = z.infer<typeof RoadmapQueueFiledResultSchema>;

/**
 * Pure readers for the two reference documents the Project Management page shows: DESIGN.md (YAML
 * front matter of design tokens, then prose) and docs/ENGINEERING.md (numbered `##` sections).
 * Kept dependency-free so the page can read the Markdown as-is, with no second copy to keep in step.
 */
interface DocSection {
    /** The `## ` heading text. */
    title: string;
    /** Everything under it up to the next `## `, trimmed. */
    body: string;
}
interface DesignTokens {
    colors: Record<string, string>;
    typography: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
    spacing: Record<string, string>;
    components: Record<string, Record<string, string>>;
}
interface DesignRule {
    name: string;
    text: string;
}
interface DesignDoc {
    name: string;
    description: string;
    tokens: DesignTokens;
    /** The prose after the front matter, split on `## `. */
    sections: DocSection[];
    /** "The X Rule." paragraphs from anywhere in the prose. */
    rules: DesignRule[];
    dos: string[];
    donts: string[];
}
/** Splits on `## ` headings, ignoring any inside code fences. Text before the first heading is dropped. */
declare function splitDocSections(markdown: string): DocSection[];
declare function parseDesignDoc(markdown: string): DesignDoc;

/**
 * Business Central's Physical Inventory Journal convention used by the month-end stocktake:
 * `Variance = Qty. (Calculated) - (normal safe + customer safe)`. Negative means more was found than BC
 * expects; positive means stock is missing from the shelves.
 *
 * `null` means "not counted yet", never zero: a blank count must not read as "everything is missing".
 * Once a line is marked counted, a blank column counts as 0.
 */
declare function computeVariance(qtyCalculated: number, countedNormal: number | null, countedCustomer: number | null, counted: boolean): number | null;
/** Total physically present, i.e. what goes into BC's `Qty. (Phys. Inventory)`. */
declare function totalCounted(countedNormal: number | null, countedCustomer: number | null): number;
interface ParseIssue {
    row: number;
    message: string;
}
/** Excel gives tab-separated text; quoted cells can hold tabs and newlines. */
declare function parseTsv(text: string): string[][];
/** Accepts "1,234", "1 234", "5.0" and plain numbers; returns null for blanks and non-numbers. */
declare function parseQuantity(raw: string | undefined): number | null;
interface JournalImportRow {
    itemNo: string;
    description: string;
    locationCode: string;
    qtyCalculated: number;
    batchName: string | null;
    documentNo: string | null;
    entryType: string | null;
    unitAmount: number | null;
    unitCost: number | null;
}
interface JournalImportResult {
    rows: JournalImportRow[];
    issues: ParseIssue[];
}
/**
 * Reads the Physical Inventory Journal as pasted from Excel. Columns are found by their BC header, so the
 * extra columns the team adds (counts, variance, reasons) and a different column order are both fine.
 * Duplicate Item No. + Location rows are flagged, never merged: BC can list one item twice, and which
 * line is right is a decision for a person.
 */
declare function parseJournalPaste(text: string): JournalImportResult;
/**
 * Serials are identifiers, not numbers: "046156" keeps its zero. Excel sometimes hands a numeric serial
 * back as "251109.0", which is the same bar.
 */
declare function normalizeSerial(raw: string): string;
/** Splits pasted serial lists on commas, semicolons, tabs and line breaks; blanks and N/A are dropped. */
declare function splitSerials(text: string): string[];
interface SerialComparison {
    /** In BC and found on the shelf. */
    matched: string[];
    /** In BC but not found physically. */
    missing: string[];
    /** Found physically but not in BC (includes bars BC has no serial for). */
    unexpected: string[];
    /** Typed or scanned more than once: one bar cannot be in two places. */
    duplicatesFound: string[];
    /** Listed more than once in BC: a data problem to escalate, not to merge. */
    duplicatesExpected: string[];
}
/** A matching count does not prove the serials are right; this is the check that does. */
declare function compareSerials(expectedRaw: string[], foundRaw: string[]): SerialComparison;
interface TrackingEntry {
    itemNo: string;
    locationCode: string;
    serialNo: string;
    remainingQuantity: number;
    entryNo: string | null;
}
/**
 * Reads the Item Tracking Entries report. Only entries with Remaining Quantity above zero are on hand;
 * the report also lists serials that have already left, so the filter is applied by the caller via
 * {@link onHandSerials} and the whole list is kept here.
 */
declare function parseTrackingPaste(text: string): {
    entries: TrackingEntry[];
    issues: ParseIssue[];
};
/** Serials BC believes are still on hand for an item at a location. */
declare function onHandSerials(entries: TrackingEntry[], itemNo: string, locationCode: string): string[];
interface SuggestableProduct {
    id: number;
    name: string;
    weight: number;
    category: 'BAR' | 'COIN' | null;
    metalType?: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
}
/**
 * Pulls a weight in grams out of a BC description such as "Umicore - 250g bar", "1oz Pamp Suisse",
 * "Argor-Heraeus 1KG bar" or "1/2oz Krugerrand". Returns null when no weight is stated.
 */
declare function parseWeightGrams(description: string): number | null;
/** The metal a BC description names ("1oz Gold Britannia", "Platinum Valcambi Suisse 5g bars"), or null when it names none. */
declare function parseMetal(description: string): 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM' | null;
type MappingSuggestion = {
    status: 'SUGGESTED';
    productId: number;
} | {
    status: 'AMBIGUOUS';
    productIds: number[];
} | {
    status: 'NONE';
};
/**
 * A starting point for the person confirming the mapping, never a decision. A single hit still needs
 * confirming; several hits (gold and silver 1oz, say) are returned as ambiguous. Matches on weight and,
 * when the description says so, bar or coin.
 */
declare function suggestProductForBcItem(description: string, products: SuggestableProduct[]): MappingSuggestion;
interface CountLine {
    itemNo: string;
    description: string;
    locationCode: string;
    qtyCalculated: number;
    countedNormal: number | null;
    countedCustomer: number | null;
    counted: boolean;
    reason: string | null;
    serialsChecked: 'YES' | 'NO' | 'NA' | null;
    serialNote: string | null;
    batchName: string | null;
    documentNo: string | null;
    entryType: string | null;
    unitAmount: number | null;
    unitCost: number | null;
}
interface StocktakeSummary {
    lines: number;
    counted: number;
    uncounted: number;
    withVariance: number;
    netVariance: number;
}
declare function summarizeLines(lines: CountLine[]): StocktakeSummary;
/** The journal's own columns first, in BC's order, then the team's added columns, as the accounts team receives it. */
declare const JOURNAL_EXPORT_HEADERS: readonly ["Batch Name", "Posting Date", "Entry Type", "Document No.", "Item No.", "Description", "Location Code", "Salespers./Purch. Code", "Qty. (Calculated)", "Quantity Counted (normal Safe)", "Quantity Counted (customer Safe with sale after 1 Sept)", "Variance", "Reason for Variance", "Serial Numbers Checked (if applicable) (Yes/No/N/A)", "Note any serial number discrepancies", "Qty. (Phys. Inventory)", "Quantity", "Unit Amount", "Amount", "Unit Cost", "Applies-to Entry", "ItemDescription"];
/**
 * One row per line. Uncounted lines leave the count, variance and phys. columns blank rather than
 * writing zeros, and `Qty. (Phys. Inventory)` keeps BC's calculated value so the file is not mistaken
 * for a posted count. `Quantity` is BC's own adjustment (phys. minus calculated), the opposite sign to
 * Variance, and is blank until the line is counted.
 */
declare function buildJournalExportRows(lines: CountLine[], postingDate: string | null): (string | number)[][];
/** Issue types from the manager's month-end guide. */
declare const DISCREPANCY_ISSUE_TYPES: readonly ["QUANTITY", "LOCATION", "SERIAL", "PAID_NOT_COLLECTED", "OTHER"];
type DiscrepancyIssueType = (typeof DISCREPANCY_ISSUE_TYPES)[number];
declare const ISSUE_TYPE_LABELS: Record<DiscrepancyIssueType, string>;
interface RegisterEntry {
    itemNo: string | null;
    description: string;
    issueType: DiscrepancyIssueType;
    bcShows: string;
    physicalFound: string;
    serialNo: string | null;
    action: string;
    resolved: boolean;
}
declare const REGISTER_EXPORT_HEADERS: readonly ["Item No.", "Description", "Issue Type", "BC Shows", "Physical Count / Found", "Serial No.", "Action / Notes", "Resolved"];
declare function buildRegisterExportRows(entries: RegisterEntry[]): string[][];
/** RFC 4180 CSV; opens in Excel. Cells that would be read as a formula are prefixed so pasted text cannot run one. */
declare function toCsv(headers: readonly string[], rows: (string | number)[][]): string;

declare const StocktakeStatusEnum: z.ZodEnum<{
    DRAFT: "DRAFT";
    COUNTING: "COUNTING";
    RECONCILING: "RECONCILING";
    FINALISED: "FINALISED";
}>;
type StocktakeStatus = z.infer<typeof StocktakeStatusEnum>;
declare const DiscrepancyIssueTypeEnum: z.ZodEnum<{
    QUANTITY: "QUANTITY";
    LOCATION: "LOCATION";
    SERIAL: "SERIAL";
    PAID_NOT_COLLECTED: "PAID_NOT_COLLECTED";
    OTHER: "OTHER";
}>;
declare const SerialsCheckedEnum: z.ZodEnum<{
    NA: "NA";
    YES: "YES";
    NO: "NO";
}>;
declare const CreateStocktakeRequestSchema: z.ZodObject<{
    name: z.ZodString;
    countDate: z.ZodISODate;
    cutoffDate: z.ZodISODate;
    stocktakeLead: z.ZodOptional<z.ZodString>;
    secondChecker: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type CreateStocktakeRequest = z.infer<typeof CreateStocktakeRequestSchema>;
declare const UpdateStocktakeRequestSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        COUNTING: "COUNTING";
        RECONCILING: "RECONCILING";
        FINALISED: "FINALISED";
    }>>;
    stocktakeLead: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    secondChecker: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type UpdateStocktakeRequest = z.infer<typeof UpdateStocktakeRequestSchema>;
/** The raw text pasted from Excel. Parsed on the server so the rules live in one place. */
declare const ImportJournalRequestSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
type ImportJournalRequest = z.infer<typeof ImportJournalRequestSchema>;
declare const UpdateStocktakeLineRequestSchema: z.ZodObject<{
    countedNormal: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    countedCustomer: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    counted: z.ZodOptional<z.ZodBoolean>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serialsChecked: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        NA: "NA";
        YES: "YES";
        NO: "NO";
    }>>>;
    serialNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type UpdateStocktakeLineRequest = z.infer<typeof UpdateStocktakeLineRequestSchema>;
declare const StocktakeLineSchema: z.ZodObject<{
    id: z.ZodNumber;
    itemNo: z.ZodString;
    description: z.ZodString;
    locationCode: z.ZodString;
    qtyCalculated: z.ZodNumber;
    countedNormal: z.ZodNullable<z.ZodNumber>;
    countedCustomer: z.ZodNullable<z.ZodNumber>;
    counted: z.ZodBoolean;
    variance: z.ZodNullable<z.ZodNumber>;
    reason: z.ZodNullable<z.ZodString>;
    serialsChecked: z.ZodNullable<z.ZodEnum<{
        NA: "NA";
        YES: "YES";
        NO: "NO";
    }>>;
    serialNote: z.ZodNullable<z.ZodString>;
    batchName: z.ZodNullable<z.ZodString>;
    documentNo: z.ZodNullable<z.ZodString>;
    entryType: z.ZodNullable<z.ZodString>;
    unitAmount: z.ZodNullable<z.ZodNumber>;
    unitCost: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type StocktakeLine = z.infer<typeof StocktakeLineSchema>;
declare const CreateDiscrepancyRequestSchema: z.ZodObject<{
    itemNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodString;
    issueType: z.ZodEnum<{
        QUANTITY: "QUANTITY";
        LOCATION: "LOCATION";
        SERIAL: "SERIAL";
        PAID_NOT_COLLECTED: "PAID_NOT_COLLECTED";
        OTHER: "OTHER";
    }>;
    bcShows: z.ZodDefault<z.ZodString>;
    physicalFound: z.ZodDefault<z.ZodString>;
    serialNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    action: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
type CreateDiscrepancyRequest = z.infer<typeof CreateDiscrepancyRequestSchema>;
/** Explaining a difference never closes it: `resolved` is set on its own. */
declare const UpdateDiscrepancyRequestSchema: z.ZodObject<{
    bcShows: z.ZodOptional<z.ZodString>;
    physicalFound: z.ZodOptional<z.ZodString>;
    serialNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    action: z.ZodOptional<z.ZodString>;
    resolved: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
type UpdateDiscrepancyRequest = z.infer<typeof UpdateDiscrepancyRequestSchema>;
declare const DiscrepancySchema: z.ZodObject<{
    id: z.ZodNumber;
    itemNo: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
    issueType: z.ZodEnum<{
        QUANTITY: "QUANTITY";
        LOCATION: "LOCATION";
        SERIAL: "SERIAL";
        PAID_NOT_COLLECTED: "PAID_NOT_COLLECTED";
        OTHER: "OTHER";
    }>;
    bcShows: z.ZodString;
    physicalFound: z.ZodString;
    serialNo: z.ZodNullable<z.ZodString>;
    action: z.ZodString;
    resolved: z.ZodBoolean;
    createdBy: z.ZodString;
}, z.core.$strip>;
type Discrepancy = z.infer<typeof DiscrepancySchema>;
declare const StocktakeSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    countDate: z.ZodISODate;
    cutoffDate: z.ZodISODate;
    status: z.ZodEnum<{
        DRAFT: "DRAFT";
        COUNTING: "COUNTING";
        RECONCILING: "RECONCILING";
        FINALISED: "FINALISED";
    }>;
    stocktakeLead: z.ZodNullable<z.ZodString>;
    secondChecker: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdBy: z.ZodString;
    finalisedBy: z.ZodNullable<z.ZodString>;
    finalisedAt: z.ZodNullable<z.ZodISODateTime>;
    createdAt: z.ZodISODateTime;
}, z.core.$strip>;
type Stocktake = z.infer<typeof StocktakeSchema>;
declare const StocktakeDetailSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    countDate: z.ZodISODate;
    cutoffDate: z.ZodISODate;
    status: z.ZodEnum<{
        DRAFT: "DRAFT";
        COUNTING: "COUNTING";
        RECONCILING: "RECONCILING";
        FINALISED: "FINALISED";
    }>;
    stocktakeLead: z.ZodNullable<z.ZodString>;
    secondChecker: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdBy: z.ZodString;
    finalisedBy: z.ZodNullable<z.ZodString>;
    finalisedAt: z.ZodNullable<z.ZodISODateTime>;
    createdAt: z.ZodISODateTime;
    lines: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        itemNo: z.ZodString;
        description: z.ZodString;
        locationCode: z.ZodString;
        qtyCalculated: z.ZodNumber;
        countedNormal: z.ZodNullable<z.ZodNumber>;
        countedCustomer: z.ZodNullable<z.ZodNumber>;
        counted: z.ZodBoolean;
        variance: z.ZodNullable<z.ZodNumber>;
        reason: z.ZodNullable<z.ZodString>;
        serialsChecked: z.ZodNullable<z.ZodEnum<{
            NA: "NA";
            YES: "YES";
            NO: "NO";
        }>>;
        serialNote: z.ZodNullable<z.ZodString>;
        batchName: z.ZodNullable<z.ZodString>;
        documentNo: z.ZodNullable<z.ZodString>;
        entryType: z.ZodNullable<z.ZodString>;
        unitAmount: z.ZodNullable<z.ZodNumber>;
        unitCost: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    discrepancies: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        itemNo: z.ZodNullable<z.ZodString>;
        description: z.ZodString;
        issueType: z.ZodEnum<{
            QUANTITY: "QUANTITY";
            LOCATION: "LOCATION";
            SERIAL: "SERIAL";
            PAID_NOT_COLLECTED: "PAID_NOT_COLLECTED";
            OTHER: "OTHER";
        }>;
        bcShows: z.ZodString;
        physicalFound: z.ZodString;
        serialNo: z.ZodNullable<z.ZodString>;
        action: z.ZodString;
        resolved: z.ZodBoolean;
        createdBy: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type StocktakeDetail = z.infer<typeof StocktakeDetailSchema>;
declare const ImportJournalResultSchema: z.ZodObject<{
    added: z.ZodNumber;
    skippedExisting: z.ZodNumber;
    issues: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ImportJournalResult = z.infer<typeof ImportJournalResultSchema>;
/** Several BC items (one per refinery) point at the same Goldilocks product. */
declare const BcItemSchema: z.ZodObject<{
    itemNo: z.ZodString;
    description: z.ZodString;
    productId: z.ZodNullable<z.ZodNumber>;
    productName: z.ZodNullable<z.ZodString>;
    suggestedProductIds: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
type BcItem = z.infer<typeof BcItemSchema>;
declare const LinkBcItemRequestSchema: z.ZodObject<{
    productId: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type LinkBcItemRequest = z.infer<typeof LinkBcItemRequestSchema>;
declare const BcItemProductOptionSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    metalType: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    category: z.ZodNullable<z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>;
}, z.core.$strip>;
declare const BcItemsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        itemNo: z.ZodString;
        description: z.ZodString;
        productId: z.ZodNullable<z.ZodNumber>;
        productName: z.ZodNullable<z.ZodString>;
        suggestedProductIds: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>>;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        metalType: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        category: z.ZodNullable<z.ZodEnum<{
            BAR: "BAR";
            COIN: "COIN";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type BcItemsResponse = z.infer<typeof BcItemsResponseSchema>;
declare const StockMetalEnum: z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PGM: "PGM";
}>;
declare const BarStatusEnum: z.ZodEnum<{
    UNCONFIRMED: "UNCONFIRMED";
    CONFIRMED: "CONFIRMED";
    NEW: "NEW";
    GONE: "GONE";
}>;
declare const StocktakeBarSchema: z.ZodObject<{
    id: z.ZodNumber;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: z.ZodString;
    weightLabel: z.ZodString;
    refinery: z.ZodNullable<z.ZodString>;
    serial: z.ZodNullable<z.ZodString>;
    grams: z.ZodNullable<z.ZodNumber>;
    details: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        UNCONFIRMED: "UNCONFIRMED";
        CONFIRMED: "CONFIRMED";
        NEW: "NEW";
        GONE: "GONE";
    }>;
    carriedFromId: z.ZodNullable<z.ZodNumber>;
    duplicateSerial: z.ZodBoolean;
}, z.core.$strip>;
type StocktakeBar = z.infer<typeof StocktakeBarSchema>;
declare const AddBarRequestSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: z.ZodString;
    weightLabel: z.ZodString;
    refinery: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serial: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    grams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    details: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type AddBarRequest = z.infer<typeof AddBarRequestSchema>;
declare const UpdateBarRequestSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        UNCONFIRMED: "UNCONFIRMED";
        CONFIRMED: "CONFIRMED";
        NEW: "NEW";
        GONE: "GONE";
    }>>;
    weightLabel: z.ZodOptional<z.ZodString>;
    refinery: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serial: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    grams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    details: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type UpdateBarRequest = z.infer<typeof UpdateBarRequestSchema>;
declare const ImportPhysicalRequestSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    text: z.ZodString;
}, z.core.$strip>;
type ImportPhysicalRequest = z.infer<typeof ImportPhysicalRequestSchema>;
declare const ImportPhysicalResultSchema: z.ZodObject<{
    added: z.ZodNumber;
    skipped: z.ZodNumber;
    issues: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ImportPhysicalResult = z.infer<typeof ImportPhysicalResultSchema>;
declare const StocktakeCoinSchema: z.ZodObject<{
    id: z.ZodNumber;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: z.ZodString;
    item: z.ZodString;
    previousQty: z.ZodNullable<z.ZodNumber>;
    countedQty: z.ZodNullable<z.ZodNumber>;
    details: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type StocktakeCoin = z.infer<typeof StocktakeCoinSchema>;
declare const AddCoinRequestSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: z.ZodDefault<z.ZodString>;
    item: z.ZodString;
}, z.core.$strip>;
type AddCoinRequest = z.infer<typeof AddCoinRequestSchema>;
declare const UpdateCoinRequestSchema: z.ZodObject<{
    countedQty: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    details: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type UpdateCoinRequest = z.infer<typeof UpdateCoinRequestSchema>;
declare const PhysicalRegisterSchema: z.ZodObject<{
    bars: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        locationCode: z.ZodString;
        weightLabel: z.ZodString;
        refinery: z.ZodNullable<z.ZodString>;
        serial: z.ZodNullable<z.ZodString>;
        grams: z.ZodNullable<z.ZodNumber>;
        details: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            UNCONFIRMED: "UNCONFIRMED";
            CONFIRMED: "CONFIRMED";
            NEW: "NEW";
            GONE: "GONE";
        }>;
        carriedFromId: z.ZodNullable<z.ZodNumber>;
        duplicateSerial: z.ZodBoolean;
    }, z.core.$strip>>;
    coins: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        locationCode: z.ZodString;
        item: z.ZodString;
        previousQty: z.ZodNullable<z.ZodNumber>;
        countedQty: z.ZodNullable<z.ZodNumber>;
        details: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type PhysicalRegister = z.infer<typeof PhysicalRegisterSchema>;
declare const CarryForwardRequestSchema: z.ZodObject<{
    fromStocktakeId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type CarryForwardRequest = z.infer<typeof CarryForwardRequestSchema>;
declare const CarryForwardResultSchema: z.ZodObject<{
    fromStocktakeId: z.ZodNumber;
    fromName: z.ZodString;
    barsCarried: z.ZodNumber;
    barsAlreadyThere: z.ZodNumber;
    coinsCarried: z.ZodNumber;
    coinsAlreadyThere: z.ZodNumber;
}, z.core.$strip>;
type CarryForwardResult = z.infer<typeof CarryForwardResultSchema>;

/** Metal groups as the monthly stock workbook splits them (the PGM sheet covers platinum and palladium). */
declare const STOCK_METALS: readonly ["GOLD", "SILVER", "PGM"];
type StockMetal = (typeof STOCK_METALS)[number];
/**
 * UNCONFIRMED: carried from last month's list, not yet seen on the shelf. Never assumed present.
 * CONFIRMED: carried from last month and physically seen this month.
 * NEW: found this month and not on last month's list.
 * GONE: on last month's list and no longer here (sold, moved); kept with its history, not deleted.
 */
declare const BAR_STATUSES: readonly ["UNCONFIRMED", "CONFIRMED", "NEW", "GONE"];
type BarStatus = (typeof BAR_STATUSES)[number];
interface BarImportRow {
    locationCode: string;
    weightLabel: string;
    refinery: string | null;
    serial: string | null;
    grams: number | null;
    details: string | null;
}
interface BarsImportResult {
    rows: BarImportRow[];
    issues: ParseIssue[];
}
/**
 * Reads a bar list pasted from the stock workbook: Branch, Weight, Refinery, Serial, Gram, Details (any order,
 * any extra columns such as CONFIRMED or Sold are ignored). A serial written as "Valcambi Suisse: AG84938"
 * with no Refinery cell is split into refinery and serial, as the silver sheet does. A bar with no serial is
 * kept as a bar with no serial; nothing is invented.
 */
declare function parseBarsPaste(text: string): BarsImportResult;
interface CoinImportRow {
    locationCode: string;
    item: string;
    quantity: number;
}
/**
 * Reads coin counts as "Item" plus "Quantity" (an optional "Branch" column gives a location; blank means one
 * shared count). Coins are counted by product and quantity, never one row per coin.
 */
declare function parseCoinsPaste(text: string): {
    rows: CoinImportRow[];
    issues: ParseIssue[];
};
interface SerialHolder {
    id: number;
    serial: string | null;
    refinery?: string | null;
    status: BarStatus;
}
/**
 * Serials that appear on more than one live bar. A serial identifies one bar, so a repeat is a data problem to
 * look at, not a reason to block either bar from being counted. Bars marked GONE are ignored.
 */
declare function findDuplicateSerials(bars: SerialHolder[]): Map<string, number[]>;
interface BarSummary {
    total: number;
    confirmed: number;
    added: number;
    gone: number;
    /** Carried from last month and still not seen: must be resolved or reported, never assumed. */
    unconfirmed: number;
    withoutSerial: number;
}
declare function summarizeBars(bars: {
    status: BarStatus;
    serial: string | null;
}[]): BarSummary;
/**
 * What a finalised stocktake hands to the next one: bars that were seen (confirmed or newly found).
 * Unconfirmed bars are not part of the closing position and stay visible in the old report.
 */
declare function isClosingBar(status: BarStatus): boolean;
/**
 * Decides which pasted bars are new, so pasting the same list twice adds nothing. A serial is the identity of a
 * bar, so a serial already on a live bar is skipped. Bars with no serial have no identity, so they are matched by
 * branch, weight and refinery and skipped only up to the number already on the register: pasting 3 identical
 * unnumbered bars when 2 are there adds 1.
 */
declare function planBarImport(existing: {
    locationCode: string;
    weightLabel: string;
    refinery: string | null;
    serial: string | null;
    status: BarStatus;
}[], incoming: BarImportRow[]): {
    toAdd: BarImportRow[];
    skipped: number;
};
declare const BAR_EXPORT_HEADERS: readonly ["Metal", "Branch", "Weight", "Refinery", "Serial", "Gram", "Status", "Details"];
declare function buildBarExportRows(bars: {
    metal: StockMetal;
    locationCode: string;
    weightLabel: string;
    refinery: string | null;
    serial: string | null;
    grams: number | null;
    status: BarStatus;
    details: string | null;
}[]): (string | number)[][];
declare const COIN_EXPORT_HEADERS: readonly ["Metal", "Branch", "Item", "Last count", "Counted now", "Change", "Details"];
/** Change is blank unless both counts exist, so an uncounted line never looks like a loss. */
declare function buildCoinExportRows(coins: {
    metal: StockMetal;
    locationCode: string;
    item: string;
    previousQty: number | null;
    countedQty: number | null;
    details: string | null;
}[]): (string | number)[][];

/**
 * Where an item for a customer is in its life. TO_ORDER (paid, not yet ordered from the supplier), ORDERED and
 * IN_TRANSIT are not in the branch yet.
 * DELIVERED is here but not bagged; BAGGED is in the customer safe. COLLECTED has left with the customer.
 * Collection is never inferred from one source: the evidence log records where each claim came from.
 */
declare const CUSTOMER_ORDER_STATUSES: readonly ["TO_ORDER", "ORDERED", "IN_TRANSIT", "DELIVERED", "BAGGED", "ALLOCATED", "COLLECTED"];
type CustomerOrderStatus = (typeof CUSTOMER_ORDER_STATUSES)[number];
declare const CUSTOMER_ORDER_STATUS_LABELS: Record<CustomerOrderStatus, string>;
/** Physically in the branch, so still part of stock and of the customer-safe count. */
declare function isPhysicallyHere(status: CustomerOrderStatus): boolean;
declare const EVIDENCE_KINDS: readonly ["TRADESHEET_COLLECTED", "ZOHO_INVOICE", "SIGNED_INVOICE", "BC_RECORD", "STAFF_NOTE"];
type EvidenceKind = (typeof EVIDENCE_KINDS)[number];
declare const EVIDENCE_KIND_LABELS: Record<EvidenceKind, string>;
/** "DU- G202609166", "du-g202609166 " and "DU-G202609166" are one reference. */
declare function normalizeReference(raw: string | null | undefined): string;
/** Case, spacing and punctuation differences only. A different spelling ("Caulfeild") is not folded in: it is flagged. */
declare function normalizeClient(raw: string | null | undefined): string;
interface TradeLineKey {
    reference: string;
    client: string;
}
type TradeMatch<T extends TradeLineKey = TradeLineKey> = {
    status: 'EXACT';
    line: T;
} | {
    status: 'REVIEW';
    line: T;
    reason: string;
} | {
    status: 'AMBIGUOUS';
    lines: T[];
} | {
    status: 'NONE';
};
/**
 * Links a customer order to a tradesheet line using the reference first and the client name second. The name
 * alone never links anything. A reference match with a different name (a typo, or a different customer) is
 * returned for review, never silently accepted. The same reference on several lines is ambiguous.
 */
declare function matchTradeLine<T extends TradeLineKey>(order: TradeLineKey, tradeLines: T[]): TradeMatch<T>;
/** Excel serial numbers (46293), ISO dates and day/month/year all appear in the existing sheets. */
declare function parseSheetDate(raw: string | undefined): string | null;
interface CustomerOrderImportRow {
    locationCode: string;
    client: string;
    reference: string | null;
    supplierRef: string | null;
    product: string;
    quantity: number;
    refinery: string | null;
    serials: string | null;
    status: CustomerOrderStatus;
    orderedOn: string | null;
    missing: boolean;
    notes: string | null;
}
/**
 * Reads a sheet pasted from the Customer Orders workbook. Columns are found by header (STATUS or OrderStatus,
 * Collection Status, BRANCH, Date or DATE ORDERED, Client, Reference, QTY, Product, Refinery, SERIALS,
 * ORDER NUMBER, NOTES, Missing?). A status the app does not know rejects that row instead of guessing; if
 * the sheet has no status column, `fallbackStatus` is used (for example "Not bagged" sheets are DELIVERED).
 */
declare function parseCustomerOrdersPaste(text: string, fallbackStatus: CustomerOrderStatus | null): {
    rows: CustomerOrderImportRow[];
    issues: ParseIssue[];
};
/** What a stored item holds that a repeat paste may change. */
interface ExistingCustomerOrder {
    id: number;
    locationCode: string;
    client: string;
    reference: string | null;
    product: string;
    quantity: number;
    status: CustomerOrderStatus;
    serials: string | null;
    notes: string | null;
    orderedOn: string | null;
    missing: boolean;
    supplierRef: string | null;
    refinery: string | null;
}
interface CustomerOrderChanges {
    status?: CustomerOrderStatus;
    serials?: string;
    notes?: string;
    orderedOn?: string;
    missing?: boolean;
    supplierRef?: string;
    refinery?: string;
}
/** `statusOnly`: a matched item may only have its status moved forward (and `missing` set); text and dates are left alone. */
interface CustomerOrderPlanOptions {
    /**
     * 'statusOnly' (the workbook route): a matched item only moves its status forward, and a row whose client is
     * spelled differently still matches an item with the same branch, reference, product and quantity, because the
     * workbook names clients from the redaction map, which may hold a fuller spelling than the sheet.
     */
    fields?: 'all' | 'statusOnly';
}
/** The fields a pasted row would change on a stored item. Status only moves forward; text and the missing flag are never cleared. */
declare function customerOrderChanges(stored: ExistingCustomerOrder, row: CustomerOrderImportRow, options?: CustomerOrderPlanOptions): CustomerOrderChanges;
/**
 * Which pasted rows are new and which change a stored item. A row is the same as one already stored when branch,
 * client, product, quantity and reference all match; matches are paired up only as many times as the item is
 * stored, so two genuine identical orders in one paste are both kept the first time and neither added again on
 * a repeat. A matched row updates the stored item (see customerOrderChanges) or counts as unchanged.
 */
declare function planCustomerOrderImport(existing: ExistingCustomerOrder[], incoming: CustomerOrderImportRow[], options?: CustomerOrderPlanOptions): {
    toAdd: CustomerOrderImportRow[];
    toUpdate: {
        id: number;
        changes: CustomerOrderChanges;
    }[];
    unchanged: number;
};
interface CustomerSafeLine {
    locationCode: string;
    product: string;
    quantity: number;
}
/** What the customer orders say should be physically in each branch, grouped by product text. A reference for counting, not the count. */
declare function expectedCustomerStock(orders: {
    locationCode: string;
    product: string;
    quantity: number;
    status: CustomerOrderStatus;
}[]): CustomerSafeLine[];

interface TradesheetLine extends TradeLineKey {
    /** Row number in the paste (1 is the header), for pointing a person back at the sheet. */
    row: number;
    quantity: number | null;
    product: string | null;
    /** The sheet's Date or Received column as an ISO date, when it is readable. */
    date: string | null;
    /** What the sheet's Collected column holds, as written. Non-empty means the sheet claims collection. */
    collected: string | null;
}
/**
 * Reads one tradesheet tab pasted from Google Sheets (IE - Gold, IE - Silver, ES - Gold ...). Headers carry
 * trailing colons and differ between tabs, so they are matched loosely: Client, Reference (or Original Reference
 * is ignored), QTY, Product or Order, Date or Date Received, Collected. Quote-only rows are still read: whether
 * they matter is for the matcher and the person, not the parser. Nothing is written back to the sheet.
 */
declare function parseTradesheetPaste(text: string): {
    lines: TradesheetLine[];
    issues: ParseIssue[];
};
type LinkStatus = 'EXACT' | 'REVIEW' | 'AMBIGUOUS' | 'NONE';
interface OrderLink {
    orderId: number;
    status: LinkStatus;
    /** Present for EXACT and REVIEW. */
    line: TradesheetLine | null;
    /** Lines to choose from when AMBIGUOUS. */
    candidates: TradesheetLine[];
    /** Why a person should look: a different name, or a quantity that disagrees with the order. */
    notes: string[];
    /** The sheet says this line was collected. Evidence for the log, never a status change. */
    sheetSaysCollected: boolean;
}
/** Matches each order against the pasted tradesheet. Reference first, then name; the name alone never links. */
declare function linkOrdersToTradesheet(orders: {
    id: number;
    reference: string | null;
    client: string;
    quantity: number;
}[], lines: TradesheetLine[]): OrderLink[];

declare const CustomerOrderStatusEnum: z.ZodEnum<{
    TO_ORDER: "TO_ORDER";
    ORDERED: "ORDERED";
    IN_TRANSIT: "IN_TRANSIT";
    DELIVERED: "DELIVERED";
    BAGGED: "BAGGED";
    ALLOCATED: "ALLOCATED";
    COLLECTED: "COLLECTED";
}>;
declare const EvidenceKindEnum: z.ZodEnum<{
    TRADESHEET_COLLECTED: "TRADESHEET_COLLECTED";
    ZOHO_INVOICE: "ZOHO_INVOICE";
    SIGNED_INVOICE: "SIGNED_INVOICE";
    BC_RECORD: "BC_RECORD";
    STAFF_NOTE: "STAFF_NOTE";
}>;
declare const CustomerOrderEvidenceSchema: z.ZodObject<{
    id: z.ZodNumber;
    kind: z.ZodEnum<{
        TRADESHEET_COLLECTED: "TRADESHEET_COLLECTED";
        ZOHO_INVOICE: "ZOHO_INVOICE";
        SIGNED_INVOICE: "SIGNED_INVOICE";
        BC_RECORD: "BC_RECORD";
        STAFF_NOTE: "STAFF_NOTE";
    }>;
    reference: z.ZodNullable<z.ZodString>;
    note: z.ZodNullable<z.ZodString>;
    observedOn: z.ZodNullable<z.ZodISODate>;
    recordedBy: z.ZodString;
    createdAt: z.ZodISODateTime;
}, z.core.$strip>;
type CustomerOrderEvidence = z.infer<typeof CustomerOrderEvidenceSchema>;
declare const CustomerOrderSchema: z.ZodObject<{
    id: z.ZodNumber;
    locationCode: z.ZodString;
    client: z.ZodString;
    reference: z.ZodNullable<z.ZodString>;
    bcOrderNo: z.ZodNullable<z.ZodString>;
    supplierRef: z.ZodNullable<z.ZodString>;
    metal: z.ZodNullable<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
    product: z.ZodString;
    bcItemNo: z.ZodNullable<z.ZodString>;
    quantity: z.ZodNumber;
    refinery: z.ZodNullable<z.ZodString>;
    serials: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>;
    orderedOn: z.ZodNullable<z.ZodISODate>;
    missing: z.ZodBoolean;
    notes: z.ZodNullable<z.ZodString>;
    createdBy: z.ZodString;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
    evidence: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        kind: z.ZodEnum<{
            TRADESHEET_COLLECTED: "TRADESHEET_COLLECTED";
            ZOHO_INVOICE: "ZOHO_INVOICE";
            SIGNED_INVOICE: "SIGNED_INVOICE";
            BC_RECORD: "BC_RECORD";
            STAFF_NOTE: "STAFF_NOTE";
        }>;
        reference: z.ZodNullable<z.ZodString>;
        note: z.ZodNullable<z.ZodString>;
        observedOn: z.ZodNullable<z.ZodISODate>;
        recordedBy: z.ZodString;
        createdAt: z.ZodISODateTime;
    }, z.core.$strip>>;
}, z.core.$strip>;
type CustomerOrder = z.infer<typeof CustomerOrderSchema>;
declare const CreateCustomerOrderRequestSchema: z.ZodObject<{
    locationCode: z.ZodString;
    client: z.ZodString;
    reference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bcOrderNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    supplierRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metal: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>>;
    product: z.ZodString;
    bcItemNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    quantity: z.ZodNumber;
    refinery: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serials: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>>;
    orderedOn: z.ZodOptional<z.ZodNullable<z.ZodISODate>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type CreateCustomerOrderRequest = z.infer<typeof CreateCustomerOrderRequestSchema>;
declare const UpdateCustomerOrderRequestSchema: z.ZodObject<{
    locationCode: z.ZodOptional<z.ZodString>;
    client: z.ZodOptional<z.ZodString>;
    reference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bcOrderNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    supplierRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metal: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>>;
    product: z.ZodOptional<z.ZodString>;
    bcItemNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    quantity: z.ZodOptional<z.ZodNumber>;
    refinery: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serials: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>>;
    orderedOn: z.ZodOptional<z.ZodNullable<z.ZodISODate>>;
    missing: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type UpdateCustomerOrderRequest = z.infer<typeof UpdateCustomerOrderRequestSchema>;
declare const AddEvidenceRequestSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        TRADESHEET_COLLECTED: "TRADESHEET_COLLECTED";
        ZOHO_INVOICE: "ZOHO_INVOICE";
        SIGNED_INVOICE: "SIGNED_INVOICE";
        BC_RECORD: "BC_RECORD";
        STAFF_NOTE: "STAFF_NOTE";
    }>;
    reference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    observedOn: z.ZodOptional<z.ZodNullable<z.ZodISODate>>;
}, z.core.$strip>;
type AddEvidenceRequest = z.infer<typeof AddEvidenceRequestSchema>;
declare const ImportCustomerOrdersRequestSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    fallbackStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>>>;
    text: z.ZodString;
}, z.core.$strip>;
type ImportCustomerOrdersRequest = z.infer<typeof ImportCustomerOrdersRequestSchema>;
declare const ImportCustomerOrdersResultSchema: z.ZodObject<{
    added: z.ZodNumber;
    updated: z.ZodNumber;
    unchanged: z.ZodNumber;
    issues: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ImportCustomerOrdersResult = z.infer<typeof ImportCustomerOrdersResultSchema>;
declare const ExpectedCustomerStockSchema: z.ZodArray<z.ZodObject<{
    locationCode: z.ZodString;
    product: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>>;
type ExpectedCustomerStockResponse = z.infer<typeof ExpectedCustomerStockSchema>;

/**
 * Reading a monthly trade sheet (.xlsx exported from Google Sheets). Pure functions only: the browser reads the
 * workbook with its cell fills and hands plain cells here, and the API checks the same rows again with these
 * functions. Nothing in this file guesses: a row it cannot classify is returned with an issue, never forced.
 *
 * Money is returned as plain numbers straight from the sheet. The API converts them to Decimal at the boundary;
 * nothing here adds, subtracts or rounds money.
 */
type SheetValue = string | number | boolean | Date | null | undefined;
/** One cell: its value, and its background colour as read from the file (ARGB like "FF34A853", or null). */
interface SheetCell {
    value: SheetValue;
    fill?: string | null;
}
type SheetRow = SheetCell[];
/** Numbers as written in the sheet. Blank, "N/A", "-" and Excel errors ("#DIV/0!") are null, never zero. */
declare function parseSheetNumber(v: SheetValue): number | null;
/** ISO date (yyyy-mm-dd) from a Date, an Excel serial or the text forms parseSheetDate already knows. */
declare function toIsoDate(v: SheetValue): string | null;
/** No trade on the sheets is older than this; an earlier year is a typo ("206" for "2026"). */
declare const FIRST_TRADE_YEAR = 2000;
/** True when an ISO date (yyyy-mm-dd) falls in a year a trade can have. */
declare const isRealTradeYear: (iso: string) => boolean;
type FillKind = 'GREEN' | 'BLUE' | 'YELLOW' | 'NONE';
/**
 * The sheet uses colour as data: green on the Collected cell means collected (October 2026 has a value in that
 * cell on 1 of 167 rows but green on 44), light blue on an empty CPTY cell means paid and waiting for a hedge,
 * yellow marks a hedge placed on an order. White and theme fills mean nothing.
 */
declare function fillKind(fill: string | null | undefined): FillKind;
/** "Bought @:", "Price / Item:" and "price/item" are one header. The sheets mix case, colons and spaces. */
declare function stripHeader(h: SheetValue): string;
declare const SALE_FIELDS: readonly ["branch", "initials", "client", "qty", "product", "date", "spot", "cpty", "cost", "receipt", "profit", "margin", "vatDue", "totalPrice", "aml", "paid", "ordered", "delivered", "collected", "notes", "netHedging", "boughtAt", "soldAt", "reference", "hedgingNotes"];
type SaleField = (typeof SALE_FIELDS)[number];
declare const PURCHASE_FIELDS: readonly ["branch", "initials", "client", "metal", "qty", "product", "spot", "received", "pricePaid", "pricePerItem", "datePaid", "hedgedAt", "melt", "comments", "reference"];
type PurchaseField = (typeof PURCHASE_FIELDS)[number];
/**
 * The RawG tab has two Collected columns: a true/false flag (a formula whose saved value is often missing) and,
 * further right, "Collected:" holding the date. The date is the real record, so the flag is renamed out of the way
 * and the date column is the one the importer reads.
 */
declare function normaliseBackfillHeaders(headers: SheetValue[]): SheetValue[];
type HeaderMap<F extends string> = Partial<Record<F, number>>;
declare const mapSaleHeaders: (headers: SheetValue[]) => HeaderMap<SaleField>;
declare const mapPurchaseHeaders: (headers: SheetValue[]) => HeaderMap<PurchaseField>;
/**
 * The month a file covers, read from the dates in its rows, for a file whose name does not say. It is the month of
 * the newest sale or purchase date that is not in the future, so a master file that runs January to August reads as
 * 2026-08. A stray date far in the past or the future (a typo such as the year 206) cannot win. Null when no tab
 * holds a usable date.
 */
declare function guessSheetMonthFromTabs(tabs: ReadonlyArray<{
    headers: SheetValue[];
    rows: ReadonlyArray<{
        cells: SheetValue[];
    }>;
}>, now?: Date): string | null;
/**
 * The header is on row 1 in the real sheets and on row 2 in the July copy (row 1 is a timestamp). Looks at the
 * first rows for the one that names a reference column and enough other known columns.
 */
declare function findHeaderRow(rows: SheetValue[][], kind: 'sale' | 'purchase', lookAhead?: number): number;
type TabKind = 'IE_GOLD_SALES' | 'IE_SILVER_SALES' | 'IE_GOLD_PURCHASES' | 'IE_SILVER_PURCHASES';
interface TabClassification {
    kind: TabKind | null;
    /** Why a tab is not imported, for the preview. Null when it is. */
    skipReason: string | null;
}
type ImportSource = 'TRADESHEET' | 'BACKFILL';
/**
 * Older months name the purchases tab "IE - Purchases" or "IE - GP". All of those are Irish gold purchases.
 * A backfill file is the July copy, where Jan to Jun 2026 sit in one `RawG` tab (gold sales) and one `RawGP` tab
 * (gold purchases): those two names count only when the file is marked as a backfill.
 */
declare function classifyTab(name: string, source?: ImportSource): TabClassification;
/** "October 2026 - EU Trade Sheet (1).xlsx" is 2026-10. Null when the name does not say, so a person picks. */
declare function guessSheetMonth(fileName: string): string | null;
type ReferenceType = 'G' | 'S' | 'B' | 'GP' | 'SP' | 'P';
interface ParsedReference {
    /** Two-letter branch prefix when there is one (DU, CO, BL, BC, ZU). Older references have none. */
    branch: string | null;
    type: ReferenceType;
    role: 'SALE' | 'PURCHASE';
    /** Known from the type letter. A bare "P" purchase (older sheets) is gold or silver, so it is null. */
    metal: 'GOLD' | 'SILVER' | null;
    year: number;
    month: number;
    counter: number;
}
/**
 * DU-G20261002 is branch DU, a gold sale (G), October 2026, row 02. Purchases are GP (gold) and SP (silver);
 * the July template wrote GP-20260673, older sheets wrote P20250102 or G20260102 with no branch. Returns null
 * for anything else, so a typo is visible instead of half-parsed.
 */
declare function parseReference(raw: string | null | undefined): ParsedReference | null;
/**
 * The form two references are compared in: spacing, case and hyphens folded away, so "BL -GP20260654" and
 * "BL-GP20260654" match. Nothing else is folded: a reference with the wrong branch is a different reference.
 */
declare function referenceMatchKey(raw: string | null | undefined): string;
/** Occurrence number per row (1 for the first use of a reference, 2 for a repeat). Repeats are history errors. */
declare function assignOccurrences(references: Array<string | null | undefined>): number[];
type CptyKind = 'EMPTY' | 'QUOTE_ONLY' | 'HEDGED' | 'DEFERRED' | 'LOT_REF' | 'SUPPLIER_INVOICE' | 'OTHER';
interface CptyInfo {
    kind: CptyKind;
    /** The cell as written, trimmed. */
    raw: string;
    /** Set for LOT_REF: the purchase reference in the form lots are compared in. */
    lotKey?: string;
    /** Set for SUPPLIER_INVOICE: the supplier name and its invoice number, e.g. StoneX and 510873. */
    supplier?: string;
    supplierInvoice?: string;
}
/**
 * What the CPTY cell says. The staff type "Quote Only" on a quote, clear it when the customer has paid, write
 * "HEDGED" when the manager hedges, then replace it with the purchase line (a GP reference) or the supplier
 * invoice (StoneX / Coininvest). "Deferred" marks a hedged sale that got no purchase line before month end.
 * Case, trailing spaces and the "Deffered" typo are all in the real data.
 */
declare function classifyCpty(value: SheetValue): CptyInfo;
declare const TRADE_STATES: readonly ["QUOTE", "AWAITING_HEDGE", "HEDGED", "INVOICED", "DEFERRED", "UNKNOWN"];
type TradeState = (typeof TRADE_STATES)[number];
interface TradeStateResult {
    state: TradeState;
    /** True when the state needed the cell colour (an empty CPTY with a blue fill). The preview marks these. */
    fromColour: boolean;
}
/** The real sheets have no Status column. An empty CPTY with no colour could be anything, so it stays UNKNOWN. */
declare function deriveTradeState(cpty: CptyInfo, cptyFill: string | null | undefined): TradeStateResult;
interface CollectedInfo {
    collected: boolean;
    /** Collected cell has a date or any text (VALUE), or is filled green (FILL). */
    source: 'VALUE' | 'FILL' | null;
    date: string | null;
}
declare function readCollected(cell: SheetCell | undefined): CollectedInfo;
interface DeferredLinks {
    /** References this sale was carried from ("Deferred from DU-G202609226"). */
    from: string[];
    /** References this sale was carried to ("Deferred to DU-G202609132-3"). */
    to: string[];
}
/** Reads "Deferred from ..." / "Deferred to ..." in NOTES (or CPTY), with several references and spacing slips. */
declare function parseDeferredLinks(...cells: Array<string | null | undefined>): DeferredLinks;
interface SoldInfo {
    /** Items the comment says were sold. Null when the comment says nothing about sales. */
    soldCount: number | null;
    allSold: boolean;
    /** What is left according to the comment alone. The allocations from sales are the real answer. */
    remaining: number;
    /** True when the comment was a typo, a bare "sold", more sold than bought, or notes a person should read. */
    review: boolean;
    reason: string | null;
}
/**
 * "3 sold", "ALL SOLD" and friends. The only record of what is left of a purchase in the sheets is this
 * free text, so anything beyond the plain forms is flagged for a person instead of being guessed.
 */
declare function parseSoldComment(comment: SheetValue, qty: number): SoldInfo;
interface QtyAndProduct {
    qty: number | null;
    product: string;
}
/** "5 x 10g gold bar", "5x 10g bar" and "1oz Eagles x 3" carry the quantity in the product cell. */
declare function extractQtyAndProduct(value: SheetValue): QtyAndProduct;
/** A short stable hash of the fields that matter, to tell on reimport whether a row changed. Not a security hash. */
declare function fingerprint(parts: Array<string | number | boolean | null | undefined>): string;
interface ParsedSale {
    /** Row number in the tab, 1-based, for messages. */
    sourceRow: number;
    reference: string;
    parsedReference: ParsedReference | null;
    branchCode: string | null;
    initials: string | null;
    client: string;
    qty: number | null;
    product: string;
    date: string | null;
    spot: number | null;
    cpty: CptyInfo;
    state: TradeState;
    stateFromColour: boolean;
    collected: CollectedInfo;
    cost: number | null;
    receipt: number | null;
    profit: number | null;
    margin: number | null;
    vatDue: number | null;
    totalPrice: number | null;
    paid: string | null;
    netHedging: number | null;
    boughtAt: number | null;
    soldAt: number | null;
    notes: string | null;
    hedgingNotes: string | null;
    deferred: DeferredLinks;
    fingerprint: string;
    issues: string[];
}
interface ParsedPurchase {
    sourceRow: number;
    reference: string;
    parsedReference: ParsedReference | null;
    branchCode: string | null;
    client: string;
    qty: number | null;
    product: string;
    received: string | null;
    datePaid: string | null;
    pricePaid: number | null;
    pricePerItem: number | null;
    hedgedAt: number | null;
    melt: boolean;
    comments: string | null;
    sold: SoldInfo;
    fingerprint: string;
    issues: string[];
}
/**
 * A reference always has letters in it (DU-G20261002). A cell holding only digits and punctuation is a stray
 * figure from a scratch calculation below the data, not a trade, so the row is skipped rather than flagged.
 */
declare const isReferenceCell: (reference: string) => boolean;
declare const rowIsBlank: (row: SheetRow) => boolean;
/**
 * One sales row. A row with no reference is not a trade (spacer or total) and returns null. Everything the
 * parser could not read is listed in `issues`; the row is still returned so the preview can show it.
 */
declare function parseSaleRow(row: SheetRow, map: HeaderMap<SaleField>, sourceRow: number): ParsedSale | null;
/** One purchases row. The lot's remaining stock is the comment's reading here; sales decide the real figure later. */
declare function parsePurchaseRow(row: SheetRow, map: HeaderMap<PurchaseField>, sourceRow: number): ParsedPurchase | null;

/**
 * The order lifecycle staff see, derived from what the tradesheet shows plus the steps Goldilocks has recorded.
 * The tradesheet stays the source of truth: nothing here is written back to it. Each recorded step instead leaves
 * sheet tasks (the exact value to paste), and an import that shows the change closes them.
 */
declare const ORDER_LIFECYCLE: readonly ["QUOTE", "PAID", "ORDERED", "ARRIVED", "ALLOCATED", "MATCHED", "COLLECTED", "POSTED"];
type OrderLifecycle = (typeof ORDER_LIFECYCLE)[number];
declare const ORDER_LIFECYCLE_LABELS: Record<OrderLifecycle, string>;
/** Steps Goldilocks records. Quote and Paid come from the tradesheet. */
declare const ORDER_STEPS: readonly ["ORDERED", "ARRIVED", "ALLOCATED", "MATCHED", "COLLECTED", "POSTED"];
type OrderStep = (typeof ORDER_STEPS)[number];
/**
 * Where the goods come from. A supplier invoice in CPTY means the whole order was sent to a supplier. A P-line in
 * CPTY means it was filled from stock. With neither, nobody has decided yet.
 */
type OrderSource = 'STOCK' | 'SUPPLIER' | 'UNDECIDED' | 'NEEDS_ORDER';
type OrderQueue = 'order' | 'arrive' | 'alloc' | 'pline' | 'nopost' | 'tsmark' | 'bcanom' | 'over' | 'defer' | 'quote';
interface OrderFacts {
    cptyKind: CptyKind;
    /** The Collected cell on the tradesheet (value or green fill). */
    collected: boolean;
    /** CPTY names a purchase line that exists. */
    hasLot: boolean;
    supplierInvoice: string | null;
    /** Steps recorded in Goldilocks for this order. */
    steps: readonly OrderStep[];
    /** In the latest BC "Orders Awaiting Collection": true open, false absent (posted), null no report or no link. */
    bcOpen: boolean | null;
    /** Set by the service from BC and lot data. */
    bcAnomaly?: boolean;
    lotOverAllocated?: boolean;
}
interface DerivedOrder {
    lifecycle: OrderLifecycle;
    source: OrderSource;
    queues: OrderQueue[];
}
declare function orderSource(f: OrderFacts): OrderSource;
/** The furthest stage any fact supports. */
declare function orderLifecycle(f: OrderFacts): OrderLifecycle;
declare function deriveOrder(f: OrderFacts): DerivedOrder;
/** Open means staff still have something to do. Collected counts as open only while BC lists it or a queue needs it. */
declare function isOpenOrder(d: DerivedOrder, bcOpen: boolean | null): boolean;
type OrderRole = 'broker' | 'manager';
interface NextAction {
    code: string;
    label: string;
    /** Who does it: brokers allocate; managers order, hedge, post and sign off. Null when nothing is needed. */
    who: OrderRole | null;
    /** The step that button records, if any. */
    step: OrderStep | null;
}
declare function nextAction(lifecycle: OrderLifecycle, source: OrderSource, queues: readonly OrderQueue[]): NextAction;
/** Steps that may be recorded from a stage. Allocation and ordering are both possible from Paid: stock decides. */
declare function allowedSteps(lifecycle: OrderLifecycle, source: OrderSource): OrderStep[];
/** The role that may record a step. */
declare const STEP_ROLE: Record<OrderStep, OrderRole>;
declare const SHEETS: readonly ["Tradesheet", "Purchase tab", "Stock sheet", "Customer safe sheet"];
type SheetName = (typeof SHEETS)[number];
/** How an import can tell a task is done. MANUAL means only a person can tick it. */
type TaskCheck = 'TRADE_COLLECTED' | 'TRADE_CPTY' | 'MANUAL';
interface SheetTaskDraft {
    sheet: SheetName;
    what: string;
    value: string;
    check: TaskCheck;
}
interface StepContext {
    client: string;
    reference: string;
    /** For example "1oz Krugerrand". */
    product: string;
    qty: number | null;
    supplierInvoice?: string | null;
    /** The purchase line chosen for a sale, for example DU-GP20261028. */
    pline?: string | null;
    /** Running "N sold" text for that purchase line's Comments. */
    soldComment?: string | null;
    serials?: readonly string[];
    refinery?: string | null;
    /** Text for the stock sheet, for example "Coins: 1oz Krugerrand 42 -> 37". */
    stockChange?: string | null;
    date?: string | null;
}
/** The tab-separated row for the customer safe sheet. */
declare function customerSafeRow(c: StepContext): string;
/** What recording a step asks staff to change in the sheets. Goldilocks never edits a sheet itself. */
declare function sheetTasksForStep(step: OrderStep, c: StepContext): SheetTaskDraft[];
/** Whether the imported trade now shows what a task asked for. Only tasks with a check can close by import. */
declare function taskShowsDone(task: {
    check: TaskCheck;
    value: string;
}, trade: {
    collected: boolean;
    cptyRaw: string | null;
}): boolean;
/** Cash of 10,000 euro or more triggers the cash transactions procedure. */
declare const CASH_AML_THRESHOLD = 10000;
declare const isCashOverThreshold: (mode: string, amount: number) => boolean;

declare const OrderLifecycleEnum: z.ZodEnum<{
    ORDERED: "ORDERED";
    ALLOCATED: "ALLOCATED";
    COLLECTED: "COLLECTED";
    QUOTE: "QUOTE";
    PAID: "PAID";
    ARRIVED: "ARRIVED";
    MATCHED: "MATCHED";
    POSTED: "POSTED";
}>;
declare const OrderStepEnum: z.ZodEnum<{
    ORDERED: "ORDERED";
    ALLOCATED: "ALLOCATED";
    COLLECTED: "COLLECTED";
    ARRIVED: "ARRIVED";
    MATCHED: "MATCHED";
    POSTED: "POSTED";
}>;
declare const SheetNameEnum: z.ZodEnum<{
    Tradesheet: "Tradesheet";
    "Purchase tab": "Purchase tab";
    "Stock sheet": "Stock sheet";
    "Customer safe sheet": "Customer safe sheet";
}>;
declare const OrderSourceEnum: z.ZodEnum<{
    STOCK: "STOCK";
    SUPPLIER: "SUPPLIER";
    UNDECIDED: "UNDECIDED";
    NEEDS_ORDER: "NEEDS_ORDER";
}>;
declare const OrderQueueEnum: z.ZodEnum<{
    order: "order";
    arrive: "arrive";
    alloc: "alloc";
    pline: "pline";
    nopost: "nopost";
    tsmark: "tsmark";
    bcanom: "bcanom";
    over: "over";
    defer: "defer";
    quote: "quote";
}>;
declare const TaskCheckEnum: z.ZodEnum<{
    TRADE_COLLECTED: "TRADE_COLLECTED";
    TRADE_CPTY: "TRADE_CPTY";
    MANUAL: "MANUAL";
}>;
declare const SheetTaskSchema: z.ZodObject<{
    id: z.ZodNumber;
    tradeId: z.ZodNullable<z.ZodNumber>;
    reference: z.ZodString;
    client: z.ZodString;
    sheet: z.ZodEnum<{
        Tradesheet: "Tradesheet";
        "Purchase tab": "Purchase tab";
        "Stock sheet": "Stock sheet";
        "Customer safe sheet": "Customer safe sheet";
    }>;
    what: z.ZodString;
    value: z.ZodString;
    check: z.ZodEnum<{
        TRADE_COLLECTED: "TRADE_COLLECTED";
        TRADE_CPTY: "TRADE_CPTY";
        MANUAL: "MANUAL";
    }>;
    status: z.ZodEnum<{
        DONE: "DONE";
        OPEN: "OPEN";
    }>;
    createdAt: z.ZodISODateTime;
    createdBy: z.ZodString;
    closedAt: z.ZodNullable<z.ZodISODateTime>;
    closedBy: z.ZodNullable<z.ZodString>;
    closedVia: z.ZodNullable<z.ZodEnum<{
        MANUAL: "MANUAL";
        IMPORT: "IMPORT";
    }>>;
}, z.core.$strip>;
type SheetTask = z.infer<typeof SheetTaskSchema>;
declare const OrderEventSchema: z.ZodObject<{
    id: z.ZodNumber;
    step: z.ZodEnum<{
        ORDERED: "ORDERED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
        ARRIVED: "ARRIVED";
        MATCHED: "MATCHED";
        POSTED: "POSTED";
    }>;
    by: z.ZodString;
    at: z.ZodISODateTime;
    note: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type OrderEvent = z.infer<typeof OrderEventSchema>;
declare const OrderRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    reference: z.ZodString;
    client: z.ZodString;
    branchCode: z.ZodNullable<z.ZodString>;
    metal: z.ZodString;
    qty: z.ZodNullable<z.ZodNumber>;
    product: z.ZodString;
    date: z.ZodNullable<z.ZodISODate>;
    amount: z.ZodNullable<z.ZodNumber>;
    cpty: z.ZodNullable<z.ZodString>;
    supplierInvoice: z.ZodNullable<z.ZodString>;
    lifecycle: z.ZodEnum<{
        ORDERED: "ORDERED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
        QUOTE: "QUOTE";
        PAID: "PAID";
        ARRIVED: "ARRIVED";
        MATCHED: "MATCHED";
        POSTED: "POSTED";
    }>;
    source: z.ZodEnum<{
        STOCK: "STOCK";
        SUPPLIER: "SUPPLIER";
        UNDECIDED: "UNDECIDED";
        NEEDS_ORDER: "NEEDS_ORDER";
    }>;
    queues: z.ZodArray<z.ZodEnum<{
        order: "order";
        arrive: "arrive";
        alloc: "alloc";
        pline: "pline";
        nopost: "nopost";
        tsmark: "tsmark";
        bcanom: "bcanom";
        over: "over";
        defer: "defer";
        quote: "quote";
    }>>;
    nextAction: z.ZodObject<{
        code: z.ZodString;
        label: z.ZodString;
        who: z.ZodNullable<z.ZodEnum<{
            broker: "broker";
            manager: "manager";
        }>>;
        step: z.ZodNullable<z.ZodEnum<{
            ORDERED: "ORDERED";
            ALLOCATED: "ALLOCATED";
            COLLECTED: "COLLECTED";
            ARRIVED: "ARRIVED";
            MATCHED: "MATCHED";
            POSTED: "POSTED";
        }>>;
    }, z.core.$strip>;
    openTasks: z.ZodNumber;
}, z.core.$strip>;
type OrderRow = z.infer<typeof OrderRowSchema>;
declare const OrderDetailSchema: z.ZodObject<{
    id: z.ZodNumber;
    reference: z.ZodString;
    client: z.ZodString;
    branchCode: z.ZodNullable<z.ZodString>;
    metal: z.ZodString;
    qty: z.ZodNullable<z.ZodNumber>;
    product: z.ZodString;
    date: z.ZodNullable<z.ZodISODate>;
    amount: z.ZodNullable<z.ZodNumber>;
    cpty: z.ZodNullable<z.ZodString>;
    supplierInvoice: z.ZodNullable<z.ZodString>;
    lifecycle: z.ZodEnum<{
        ORDERED: "ORDERED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
        QUOTE: "QUOTE";
        PAID: "PAID";
        ARRIVED: "ARRIVED";
        MATCHED: "MATCHED";
        POSTED: "POSTED";
    }>;
    source: z.ZodEnum<{
        STOCK: "STOCK";
        SUPPLIER: "SUPPLIER";
        UNDECIDED: "UNDECIDED";
        NEEDS_ORDER: "NEEDS_ORDER";
    }>;
    queues: z.ZodArray<z.ZodEnum<{
        order: "order";
        arrive: "arrive";
        alloc: "alloc";
        pline: "pline";
        nopost: "nopost";
        tsmark: "tsmark";
        bcanom: "bcanom";
        over: "over";
        defer: "defer";
        quote: "quote";
    }>>;
    nextAction: z.ZodObject<{
        code: z.ZodString;
        label: z.ZodString;
        who: z.ZodNullable<z.ZodEnum<{
            broker: "broker";
            manager: "manager";
        }>>;
        step: z.ZodNullable<z.ZodEnum<{
            ORDERED: "ORDERED";
            ALLOCATED: "ALLOCATED";
            COLLECTED: "COLLECTED";
            ARRIVED: "ARRIVED";
            MATCHED: "MATCHED";
            POSTED: "POSTED";
        }>>;
    }, z.core.$strip>;
    openTasks: z.ZodNumber;
    events: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        step: z.ZodEnum<{
            ORDERED: "ORDERED";
            ALLOCATED: "ALLOCATED";
            COLLECTED: "COLLECTED";
            ARRIVED: "ARRIVED";
            MATCHED: "MATCHED";
            POSTED: "POSTED";
        }>;
        by: z.ZodString;
        at: z.ZodISODateTime;
        note: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        tradeId: z.ZodNullable<z.ZodNumber>;
        reference: z.ZodString;
        client: z.ZodString;
        sheet: z.ZodEnum<{
            Tradesheet: "Tradesheet";
            "Purchase tab": "Purchase tab";
            "Stock sheet": "Stock sheet";
            "Customer safe sheet": "Customer safe sheet";
        }>;
        what: z.ZodString;
        value: z.ZodString;
        check: z.ZodEnum<{
            TRADE_COLLECTED: "TRADE_COLLECTED";
            TRADE_CPTY: "TRADE_CPTY";
            MANUAL: "MANUAL";
        }>;
        status: z.ZodEnum<{
            DONE: "DONE";
            OPEN: "OPEN";
        }>;
        createdAt: z.ZodISODateTime;
        createdBy: z.ZodString;
        closedAt: z.ZodNullable<z.ZodISODateTime>;
        closedBy: z.ZodNullable<z.ZodString>;
        closedVia: z.ZodNullable<z.ZodEnum<{
            MANUAL: "MANUAL";
            IMPORT: "IMPORT";
        }>>;
    }, z.core.$strip>>;
    allowedSteps: z.ZodArray<z.ZodEnum<{
        ORDERED: "ORDERED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
        ARRIVED: "ARRIVED";
        MATCHED: "MATCHED";
        POSTED: "POSTED";
    }>>;
    notes: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type OrderDetail = z.infer<typeof OrderDetailSchema>;
declare const OrderListQuerySchema: z.ZodObject<{
    queue: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        order: "order";
        arrive: "arrive";
        alloc: "alloc";
        pline: "pline";
        nopost: "nopost";
        tsmark: "tsmark";
        bcanom: "bcanom";
        over: "over";
        defer: "defer";
        quote: "quote";
    }>, z.ZodLiteral<"all">]>>;
    q: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type OrderListQuery = z.infer<typeof OrderListQuerySchema>;
declare const OrderListResponseSchema: z.ZodObject<{
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        reference: z.ZodString;
        client: z.ZodString;
        branchCode: z.ZodNullable<z.ZodString>;
        metal: z.ZodString;
        qty: z.ZodNullable<z.ZodNumber>;
        product: z.ZodString;
        date: z.ZodNullable<z.ZodISODate>;
        amount: z.ZodNullable<z.ZodNumber>;
        cpty: z.ZodNullable<z.ZodString>;
        supplierInvoice: z.ZodNullable<z.ZodString>;
        lifecycle: z.ZodEnum<{
            ORDERED: "ORDERED";
            ALLOCATED: "ALLOCATED";
            COLLECTED: "COLLECTED";
            QUOTE: "QUOTE";
            PAID: "PAID";
            ARRIVED: "ARRIVED";
            MATCHED: "MATCHED";
            POSTED: "POSTED";
        }>;
        source: z.ZodEnum<{
            STOCK: "STOCK";
            SUPPLIER: "SUPPLIER";
            UNDECIDED: "UNDECIDED";
            NEEDS_ORDER: "NEEDS_ORDER";
        }>;
        queues: z.ZodArray<z.ZodEnum<{
            order: "order";
            arrive: "arrive";
            alloc: "alloc";
            pline: "pline";
            nopost: "nopost";
            tsmark: "tsmark";
            bcanom: "bcanom";
            over: "over";
            defer: "defer";
            quote: "quote";
        }>>;
        nextAction: z.ZodObject<{
            code: z.ZodString;
            label: z.ZodString;
            who: z.ZodNullable<z.ZodEnum<{
                broker: "broker";
                manager: "manager";
            }>>;
            step: z.ZodNullable<z.ZodEnum<{
                ORDERED: "ORDERED";
                ALLOCATED: "ALLOCATED";
                COLLECTED: "COLLECTED";
                ARRIVED: "ARRIVED";
                MATCHED: "MATCHED";
                POSTED: "POSTED";
            }>>;
        }, z.core.$strip>;
        openTasks: z.ZodNumber;
    }, z.core.$strip>>;
    counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    openTasks: z.ZodNumber;
    asOf: z.ZodISODateTime;
}, z.core.$strip>;
type OrderListResponse = z.infer<typeof OrderListResponseSchema>;
declare const RecordStepRequestSchema: z.ZodObject<{
    supplierInvoice: z.ZodOptional<z.ZodString>;
    pline: z.ZodOptional<z.ZodString>;
    soldComment: z.ZodOptional<z.ZodString>;
    serials: z.ZodOptional<z.ZodArray<z.ZodString>>;
    refinery: z.ZodOptional<z.ZodString>;
    stockChange: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type RecordStepRequest = z.infer<typeof RecordStepRequestSchema>;
declare const SheetTaskListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        DONE: "DONE";
        OPEN: "OPEN";
    }>>;
}, z.core.$strip>;
type SheetTaskListQuery = z.infer<typeof SheetTaskListQuerySchema>;
declare const ReconcileResultSchema: z.ZodObject<{
    checked: z.ZodNumber;
    closed: z.ZodNumber;
}, z.core.$strip>;
type ReconcileResult = z.infer<typeof ReconcileResultSchema>;
declare const HandoverSchema: z.ZodObject<{
    id: z.ZodNumber;
    note: z.ZodString;
    by: z.ZodString;
    createdAt: z.ZodISODateTime;
}, z.core.$strip>;
type Handover = z.infer<typeof HandoverSchema>;
/** Wrapped so that "no note yet" is a normal answer, not an empty body. */
declare const LatestHandoverSchema: z.ZodObject<{
    handover: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        note: z.ZodString;
        by: z.ZodString;
        createdAt: z.ZodISODateTime;
    }, z.core.$strip>>;
}, z.core.$strip>;
type LatestHandover = z.infer<typeof LatestHandoverSchema>;
declare const SaveHandoverRequestSchema: z.ZodObject<{
    note: z.ZodString;
}, z.core.$strip>;
type SaveHandoverRequest = z.infer<typeof SaveHandoverRequestSchema>;

declare const TradesheetTabSchema: z.ZodObject<{
    name: z.ZodString;
    headerRow: z.ZodNumber;
    headers: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>;
    rows: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        cells: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>;
        fills: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type TradesheetTab = z.infer<typeof TradesheetTabSchema>;
declare const TradesheetImportRequestSchema: z.ZodObject<{
    fileName: z.ZodString;
    sheetMonth: z.ZodString;
    source: z.ZodDefault<z.ZodEnum<{
        TRADESHEET: "TRADESHEET";
        BACKFILL: "BACKFILL";
    }>>;
    tabs: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        headerRow: z.ZodNumber;
        headers: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>;
        rows: z.ZodArray<z.ZodObject<{
            row: z.ZodNumber;
            cells: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>;
            fills: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type TradesheetImportRequest = z.infer<typeof TradesheetImportRequestSchema>;
declare const PLAN_ROW_STATUSES: readonly ["ADDED", "CHANGED", "RESTORED", "MISSING", "UNCHANGED"];
declare const PlanRowStatusEnum: z.ZodEnum<{
    ADDED: "ADDED";
    CHANGED: "CHANGED";
    RESTORED: "RESTORED";
    MISSING: "MISSING";
    UNCHANGED: "UNCHANGED";
}>;
type PlanRowStatus = z.infer<typeof PlanRowStatusEnum>;
declare const PlanCountsSchema: z.ZodObject<{
    added: z.ZodNumber;
    changed: z.ZodNumber;
    restored: z.ZodNumber;
    unchanged: z.ZodNumber;
    missing: z.ZodNumber;
    flagged: z.ZodNumber;
    refreshed: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
type PlanCounts = z.infer<typeof PlanCountsSchema>;
declare const PlanRowSchema: z.ZodObject<{
    reference: z.ZodString;
    sourceRow: z.ZodNumber;
    status: z.ZodEnum<{
        ADDED: "ADDED";
        CHANGED: "CHANGED";
        RESTORED: "RESTORED";
        MISSING: "MISSING";
        UNCHANGED: "UNCHANGED";
    }>;
    changedFields: z.ZodArray<z.ZodString>;
    issues: z.ZodArray<z.ZodString>;
    fromColour: z.ZodBoolean;
    state: z.ZodNullable<z.ZodEnum<{
        HEDGED: "HEDGED";
        DEFERRED: "DEFERRED";
        QUOTE: "QUOTE";
        AWAITING_HEDGE: "AWAITING_HEDGE";
        INVOICED: "INVOICED";
        UNKNOWN: "UNKNOWN";
    }>>;
    duplicate: z.ZodBoolean;
}, z.core.$strip>;
type PlanRow = z.infer<typeof PlanRowSchema>;
declare const TabPlanSchema: z.ZodObject<{
    name: z.ZodString;
    kind: z.ZodNullable<z.ZodEnum<{
        IE_GOLD_SALES: "IE_GOLD_SALES";
        IE_SILVER_SALES: "IE_SILVER_SALES";
        IE_GOLD_PURCHASES: "IE_GOLD_PURCHASES";
        IE_SILVER_PURCHASES: "IE_SILVER_PURCHASES";
    }>>;
    problems: z.ZodArray<z.ZodString>;
    counts: z.ZodObject<{
        added: z.ZodNumber;
        changed: z.ZodNumber;
        restored: z.ZodNumber;
        unchanged: z.ZodNumber;
        missing: z.ZodNumber;
        flagged: z.ZodNumber;
        refreshed: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    rows: z.ZodArray<z.ZodObject<{
        reference: z.ZodString;
        sourceRow: z.ZodNumber;
        status: z.ZodEnum<{
            ADDED: "ADDED";
            CHANGED: "CHANGED";
            RESTORED: "RESTORED";
            MISSING: "MISSING";
            UNCHANGED: "UNCHANGED";
        }>;
        changedFields: z.ZodArray<z.ZodString>;
        issues: z.ZodArray<z.ZodString>;
        fromColour: z.ZodBoolean;
        state: z.ZodNullable<z.ZodEnum<{
            HEDGED: "HEDGED";
            DEFERRED: "DEFERRED";
            QUOTE: "QUOTE";
            AWAITING_HEDGE: "AWAITING_HEDGE";
            INVOICED: "INVOICED";
            UNKNOWN: "UNKNOWN";
        }>>;
        duplicate: z.ZodBoolean;
    }, z.core.$strip>>;
    unmatchedProducts: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        rows: z.ZodNumber;
    }, z.core.$strip>>;
    productMatches: z.ZodObject<{
        saved: z.ZodNumber;
        rule: z.ZodNumber;
        none: z.ZodNumber;
        notProduct: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
type TabPlan = z.infer<typeof TabPlanSchema>;
declare const TradesheetImportPlanSchema: z.ZodObject<{
    fileName: z.ZodString;
    sheetMonth: z.ZodString;
    tabs: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        kind: z.ZodNullable<z.ZodEnum<{
            IE_GOLD_SALES: "IE_GOLD_SALES";
            IE_SILVER_SALES: "IE_SILVER_SALES";
            IE_GOLD_PURCHASES: "IE_GOLD_PURCHASES";
            IE_SILVER_PURCHASES: "IE_SILVER_PURCHASES";
        }>>;
        problems: z.ZodArray<z.ZodString>;
        counts: z.ZodObject<{
            added: z.ZodNumber;
            changed: z.ZodNumber;
            restored: z.ZodNumber;
            unchanged: z.ZodNumber;
            missing: z.ZodNumber;
            flagged: z.ZodNumber;
            refreshed: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
        rows: z.ZodArray<z.ZodObject<{
            reference: z.ZodString;
            sourceRow: z.ZodNumber;
            status: z.ZodEnum<{
                ADDED: "ADDED";
                CHANGED: "CHANGED";
                RESTORED: "RESTORED";
                MISSING: "MISSING";
                UNCHANGED: "UNCHANGED";
            }>;
            changedFields: z.ZodArray<z.ZodString>;
            issues: z.ZodArray<z.ZodString>;
            fromColour: z.ZodBoolean;
            state: z.ZodNullable<z.ZodEnum<{
                HEDGED: "HEDGED";
                DEFERRED: "DEFERRED";
                QUOTE: "QUOTE";
                AWAITING_HEDGE: "AWAITING_HEDGE";
                INVOICED: "INVOICED";
                UNKNOWN: "UNKNOWN";
            }>>;
            duplicate: z.ZodBoolean;
        }, z.core.$strip>>;
        unmatchedProducts: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            rows: z.ZodNumber;
        }, z.core.$strip>>;
        productMatches: z.ZodObject<{
            saved: z.ZodNumber;
            rule: z.ZodNumber;
            none: z.ZodNumber;
            notProduct: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    totals: z.ZodObject<{
        added: z.ZodNumber;
        changed: z.ZodNumber;
        restored: z.ZodNumber;
        unchanged: z.ZodNumber;
        missing: z.ZodNumber;
        flagged: z.ZodNumber;
        refreshed: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    warnings: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
type TradesheetImportPlan = z.infer<typeof TradesheetImportPlanSchema>;
/** What matching sales to purchase lots found, for the lots and sales this import touched. */
declare const AllocationSummarySchema: z.ZodObject<{
    lotsChecked: z.ZodNumber;
    salesLinked: z.ZodNumber;
    lotNotImported: z.ZodNumber;
    overAllocated: z.ZodNumber;
    soldMismatches: z.ZodNumber;
}, z.core.$strip>;
type AllocationSummary = z.infer<typeof AllocationSummarySchema>;
declare const TradesheetImportResultSchema: z.ZodObject<{
    batchId: z.ZodNumber;
    plan: z.ZodObject<{
        fileName: z.ZodString;
        sheetMonth: z.ZodString;
        tabs: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodNullable<z.ZodEnum<{
                IE_GOLD_SALES: "IE_GOLD_SALES";
                IE_SILVER_SALES: "IE_SILVER_SALES";
                IE_GOLD_PURCHASES: "IE_GOLD_PURCHASES";
                IE_SILVER_PURCHASES: "IE_SILVER_PURCHASES";
            }>>;
            problems: z.ZodArray<z.ZodString>;
            counts: z.ZodObject<{
                added: z.ZodNumber;
                changed: z.ZodNumber;
                restored: z.ZodNumber;
                unchanged: z.ZodNumber;
                missing: z.ZodNumber;
                flagged: z.ZodNumber;
                refreshed: z.ZodDefault<z.ZodNumber>;
            }, z.core.$strip>;
            rows: z.ZodArray<z.ZodObject<{
                reference: z.ZodString;
                sourceRow: z.ZodNumber;
                status: z.ZodEnum<{
                    ADDED: "ADDED";
                    CHANGED: "CHANGED";
                    RESTORED: "RESTORED";
                    MISSING: "MISSING";
                    UNCHANGED: "UNCHANGED";
                }>;
                changedFields: z.ZodArray<z.ZodString>;
                issues: z.ZodArray<z.ZodString>;
                fromColour: z.ZodBoolean;
                state: z.ZodNullable<z.ZodEnum<{
                    HEDGED: "HEDGED";
                    DEFERRED: "DEFERRED";
                    QUOTE: "QUOTE";
                    AWAITING_HEDGE: "AWAITING_HEDGE";
                    INVOICED: "INVOICED";
                    UNKNOWN: "UNKNOWN";
                }>>;
                duplicate: z.ZodBoolean;
            }, z.core.$strip>>;
            unmatchedProducts: z.ZodArray<z.ZodObject<{
                text: z.ZodString;
                rows: z.ZodNumber;
            }, z.core.$strip>>;
            productMatches: z.ZodObject<{
                saved: z.ZodNumber;
                rule: z.ZodNumber;
                none: z.ZodNumber;
                notProduct: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>;
        totals: z.ZodObject<{
            added: z.ZodNumber;
            changed: z.ZodNumber;
            restored: z.ZodNumber;
            unchanged: z.ZodNumber;
            missing: z.ZodNumber;
            flagged: z.ZodNumber;
            refreshed: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
        warnings: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    allocation: z.ZodObject<{
        lotsChecked: z.ZodNumber;
        salesLinked: z.ZodNumber;
        lotNotImported: z.ZodNumber;
        overAllocated: z.ZodNumber;
        soldMismatches: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
type TradesheetImportResult = z.infer<typeof TradesheetImportResultSchema>;

interface OrderableProduct {
    id: number;
    name: string;
    metalType: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
    weight: number;
}
/**
 * Display order for product lists in the stocktake and customer-order screens: gold, then silver, then the rest;
 * within a metal 1oz then 100g first, then heaviest to lightest, then by name. Ids are never changed or used for
 * importance (only as the last tiebreak so the order is stable). The dashboard keeps its own order.
 */
declare function compareProducts(a: OrderableProduct, b: OrderableProduct): number;
type StockOrderMetal = 'GOLD' | 'SILVER' | 'PGM' | null;
/**
 * The same order for rows that only carry a metal group and a text label ("100g Bar", "1oz Krugerrand"): bars,
 * coin counts and customer orders. The weight is read from the label; a label with no weight sorts after the
 * ones that have one, by name. A row with no metal sorts after the metals.
 */
declare function compareStockLabels(a: {
    metal: StockOrderMetal;
    label: string;
}, b: {
    metal: StockOrderMetal;
    label: string;
}): number;

/**
 * Contract for the assembled import workbook ("GL import.xlsx", built by the owner's Apps Script).
 * Column lists mirror `COLS` in the script exactly; the tables below describe the cleaned values the
 * reader produces, not the raw cell types (which vary: 1.0 for 1, real dates for text, TRUE/FALSE, ...).
 */
declare const IMPORT_SCHEMA_VERSION = "1.1";
/** s text, n number, i whole number, b boolean, d date (YYYY-MM-DD), m month (YYYY-MM), or an allowed list. */
type ColumnKind = 's' | 'n' | 'i' | 'b' | 'd' | 'm' | {
    readonly oneOf: readonly string[];
};
declare const SYSTEMS: readonly ["ZOHO", "BC"];
declare const CPTY_KINDS: readonly ["LOT_REF", "QUOTE_ONLY", "DEFERRED", "SUPPLIER_INVOICE", "HEDGED", "EMPTY", "OTHER"];
declare const COLLECTED_FLAGS: readonly ["YES", "NO", "CHECK"];
declare const LINK_TYPES: readonly ["trade_lot", "invoice_line_trade", "line_serial_bc_tracking", "trade_supplier_invoice", "stock_bar_bc_tracking", "safe_trade", "serial_customer_safe", "serial_stock_bar", "lot_supplier_invoice", "bc_trade"];
declare const LINK_CONFIDENCES: readonly ["EXACT", "PROBABLE"];
declare const SAFE_STATUSES: readonly ["ALLOCATED", "COLLECTED", "ORDERED", "TO_ORDER"];
/** Column kinds for every table, in the script's column order. */
declare const IMPORT_TABLE_SPECS: {
    readonly trades: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly branch_code: "s";
        readonly ref_month: "m";
        readonly source_month: "m";
        readonly region: "s";
        readonly metal: "s";
        readonly branch: "s";
        readonly initials: "s";
        readonly client_code: "s";
        readonly qty: "n";
        readonly product_text: "s";
        readonly product_norm: "s";
        readonly date: "d";
        readonly spot: "n";
        readonly cpty_raw: "s";
        readonly cpty_kind: {
            readonly oneOf: readonly ["LOT_REF", "QUOTE_ONLY", "DEFERRED", "SUPPLIER_INVOICE", "HEDGED", "EMPTY", "OTHER"];
        };
        readonly hedged_order: "b";
        readonly lot_key: "s";
        readonly lot_id: "s";
        readonly supplier_invoice_id: "s";
        readonly receipt: "n";
        readonly cost: "n";
        readonly profit: "n";
        readonly margin: "n";
        readonly paid_by: "s";
        readonly collected_raw: "s";
        readonly collected_fill: "s";
        readonly cpty_fill: "s";
        readonly collected_flag: {
            readonly oneOf: readonly ["YES", "NO", "CHECK"];
        };
        readonly collected_source: "s";
        readonly notes: "s";
        readonly reference: "s";
        readonly reference_key: "s";
        readonly occurrence: "i";
        readonly source_file: "s";
        readonly source_tab: "s";
        readonly source_row: "i";
        readonly issues: "s";
    };
    readonly purchase_lots: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly branch_code: "s";
        readonly region: "s";
        readonly metal: "s";
        readonly branch: "s";
        readonly seller_code: "s";
        readonly supplier_invoice_id: "s";
        readonly qty: "n";
        readonly product_text: "s";
        readonly product_norm: "s";
        readonly received: "d";
        readonly date_paid: "d";
        readonly price_paid: "n";
        readonly price_per_item: "n";
        readonly hedged_at: "s";
        readonly comments_raw: "s";
        readonly comment_sold_qty: "n";
        readonly comment_all_sold: "b";
        readonly reference: "s";
        readonly reference_key: "s";
        readonly core_key: "s";
        readonly occurrence: "i";
        readonly source_file: "s";
        readonly source_tab: "s";
        readonly source_row: "i";
        readonly issues: "s";
    };
    readonly supplier_invoices: {
        readonly id: "s";
        readonly supplier: "s";
        readonly number: "s";
        readonly first_date: "d";
        readonly last_date: "d";
        readonly trade_rows: "i";
        readonly lot_rows: "i";
    };
    readonly invoices: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly date: "d";
        readonly customer_code: "s";
        readonly status: "s";
        readonly sales_order_number: "s";
        readonly total: "n";
        readonly line_count: "i";
    };
    readonly invoice_lines: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly invoice_id: "s";
        readonly line_no: "i";
        readonly date: "d";
        readonly customer_code: "s";
        readonly qty: "n";
        readonly item_name: "s";
        readonly product_norm: "s";
        readonly unit_price: "n";
        readonly line_total: "n";
        readonly item_desc: "s";
        readonly collected_flag: {
            readonly oneOf: readonly ["YES", "NO", "CHECK"];
        };
        readonly collected_date: "d";
        readonly refinery_detected: "s";
        readonly delivered_brinks: "b";
        readonly sold_back: "b";
        readonly refs_found: "s";
        readonly source_row: "i";
    };
    readonly line_serials: {
        readonly id: "s";
        readonly invoice_line_id: "s";
        readonly serial: "s";
        readonly serial_norm: "s";
        readonly refinery: "s";
        readonly collected_flag: {
            readonly oneOf: readonly ["YES", "NO", "CHECK"];
        };
        readonly collected_date: "d";
    };
    readonly payments: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly invoice_id: "s";
        readonly customer_code: "s";
        readonly zoho_customer_id: "s";
        readonly date: "d";
        readonly invoice_date: "d";
        readonly amount: "n";
        readonly invoice_amount: "n";
        readonly mode: "s";
        readonly reference: "s";
        readonly type: "s";
    };
    readonly purchase_orders: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly po_number: "s";
        readonly line_no: "i";
        readonly date: "d";
        readonly vendor_number: "s";
        readonly vendor_code: "s";
        readonly item_name: "s";
        readonly product_norm: "s";
        readonly qty_ordered: "n";
        readonly qty_received: "n";
        readonly qty_billed: "n";
        readonly price: "n";
        readonly item_total: "n";
        readonly status: "s";
        readonly reference: "s";
    };
    readonly stock_bars: {
        readonly id: "s";
        readonly snapshot: "s";
        readonly metal: "s";
        readonly branch: "s";
        readonly weight_label: "s";
        readonly refinery: "s";
        readonly serial: "s";
        readonly serial_norm: "s";
        readonly grams: "n";
        readonly confirmed: "s";
        readonly sold_tick: "b";
        readonly details: "s";
        readonly source_row: "i";
    };
    readonly stock_coins: {
        readonly id: "s";
        readonly snapshot: "s";
        readonly metal: "s";
        readonly branch: "s";
        readonly item: "s";
        readonly product_norm: "s";
        readonly qty_prev: "n";
        readonly qty_counted: "n";
        readonly qty_allocated_since: "n";
        readonly qty_final: "n";
        readonly counts_json: "s";
        readonly details: "s";
        readonly source_row: "i";
    };
    readonly bc_journal_lines: {
        readonly id: "s";
        readonly snapshot: "s";
        readonly item_no: "s";
        readonly description: "s";
        readonly location_code: "s";
        readonly qty_calculated: "n";
        readonly counted_normal: "n";
        readonly counted_customer: "n";
        readonly variance: "n";
        readonly reason: "s";
        readonly serials_checked: "s";
        readonly serial_note: "s";
        readonly batch_name: "s";
        readonly posting_date: "d";
        readonly document_no: "s";
        readonly source_row: "i";
    };
    readonly bc_tracking_entries: {
        readonly id: "s";
        readonly snapshot: "s";
        readonly entry_no: "s";
        readonly item_no: "s";
        readonly location_code: "s";
        readonly serial_no: "s";
        readonly serial_norm: "s";
        readonly lot_no: "s";
        readonly remaining_quantity: "n";
        readonly posting_date: "d";
        readonly document_no: "s";
        readonly entry_type: "s";
        readonly source_row: "i";
    };
    readonly bc_items: {
        readonly id: "s";
        readonly description: "s";
        readonly product_norm: "s";
        readonly refinery_hint: "s";
        readonly source_row: "i";
    };
    readonly zoho_products: {
        readonly id: "s";
        readonly sku: "s";
        readonly item_name: "s";
        readonly product_norm: "s";
        readonly metal: "s";
        readonly qty_sold: "n";
        readonly amount: "n";
        readonly avg_price: "n";
    };
    readonly customer_safe_items: {
        readonly id: "s";
        readonly metal: "s";
        readonly snapshot: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly branch_code: "s";
        readonly status_raw: "s";
        readonly status_norm: {
            readonly oneOf: readonly ["ALLOCATED", "COLLECTED", "ORDERED", "TO_ORDER"];
        };
        readonly branch: "s";
        readonly date: "d";
        readonly client_code: "s";
        readonly reference: "s";
        readonly reference_core: "s";
        readonly qty: "n";
        readonly product_text: "s";
        readonly product_norm: "s";
        readonly refinery: "s";
        readonly serials: "s";
        readonly notes: "s";
        readonly source_row: "i";
    };
    readonly bc_sales_orders: {
        readonly id: "s";
        readonly system: {
            readonly oneOf: readonly ["ZOHO", "BC"];
        };
        readonly branch_code: "s";
        readonly snapshot: "s";
        readonly snapshot_date: "d";
        readonly bc_customer_no: "s";
        readonly client_code: "s";
        readonly ext_doc_no: "s";
        readonly ext_doc_core: "s";
        readonly location: "s";
        readonly doc_date: "d";
        readonly amount: "n";
        readonly amount_incl_vat: "n";
        readonly prepaid: "n";
        readonly remaining: "n";
        readonly paid: "b";
    };
    readonly links: {
        readonly id: "s";
        readonly link_type: {
            readonly oneOf: readonly ["trade_lot", "invoice_line_trade", "line_serial_bc_tracking", "trade_supplier_invoice", "stock_bar_bc_tracking", "safe_trade", "serial_customer_safe", "serial_stock_bar", "lot_supplier_invoice", "bc_trade"];
        };
        readonly from_table: "s";
        readonly from_id: "s";
        readonly to_table: "s";
        readonly to_id: "s";
        readonly method: "s";
        readonly confidence: {
            readonly oneOf: readonly ["EXACT", "PROBABLE"];
        };
        readonly note: "s";
    };
    readonly customers: {
        readonly id: "s";
        readonly zoho_number: "s";
        readonly zoho_status: "s";
        readonly currency: "s";
        readonly sources: "s";
        readonly rows: "i";
    };
    readonly vendors: {
        readonly id: "s";
        readonly zoho_number: "s";
        readonly zoho_status: "s";
        readonly currency: "s";
        readonly sources: "s";
        readonly rows: "i";
    };
    readonly product_aliases: {
        readonly id: "s";
        readonly suggested_key: "s";
        readonly example_text: "s";
        readonly refinery: "s";
        readonly uses: "i";
        readonly sources: "s";
    };
};
type ImportTableName = keyof typeof IMPORT_TABLE_SPECS;
declare const IMPORT_TABLE_NAMES: ImportTableName[];
/** Columns an older build of the script did not write yet; missing is allowed and reads as empty. */
declare const OPTIONAL_COLUMNS: Partial<Record<ImportTableName, readonly string[]>>;
type KindValue<K> = K extends 'n' | 'i' ? number | null : K extends 'b' ? boolean | null : K extends {
    readonly oneOf: infer V extends readonly string[];
} ? V[number] | null : string | null;
type ImportRow<T extends ImportTableName> = {
    -readonly [C in keyof (typeof IMPORT_TABLE_SPECS)[T]]: KindValue<(typeof IMPORT_TABLE_SPECS)[T][C]>;
};
/** One strict Zod schema per table. The API re-validates every uploaded chunk with these. */
declare const ImportTableSchemas: { [T in ImportTableName]: z.ZodType<ImportRow<T>>; };
declare const ImportMetaSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<"1.1">;
}, z.core.$strip>;
declare const ImportRowIssueCodeSchema: z.ZodEnum<{
    BAD_NUMBER: "BAD_NUMBER";
    BAD_INTEGER: "BAD_INTEGER";
    BAD_BOOLEAN: "BAD_BOOLEAN";
    BAD_DATE: "BAD_DATE";
    IMPOSSIBLE_DATE: "IMPOSSIBLE_DATE";
    BAD_VALUE: "BAD_VALUE";
    EMAIL_OR_URL: "EMAIL_OR_URL";
}>;
type ImportRowIssueCode = z.infer<typeof ImportRowIssueCodeSchema>;
declare const ImportRowIssueSchema: z.ZodObject<{
    table: z.ZodString;
    row: z.ZodNumber;
    column: z.ZodString;
    code: z.ZodEnum<{
        BAD_NUMBER: "BAD_NUMBER";
        BAD_INTEGER: "BAD_INTEGER";
        BAD_BOOLEAN: "BAD_BOOLEAN";
        BAD_DATE: "BAD_DATE";
        IMPOSSIBLE_DATE: "IMPOSSIBLE_DATE";
        BAD_VALUE: "BAD_VALUE";
        EMAIL_OR_URL: "EMAIL_OR_URL";
    }>;
    raw: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ImportRowIssue = z.infer<typeof ImportRowIssueSchema>;

/** Parsed sheets: sheet name -> rows of cells, first row = header. Spreadsheet libraries differ in cell types, so cells stay `unknown`. */
type RawSheets = Record<string, readonly (readonly unknown[])[]>;
declare const MAX_LISTED_ISSUES = 500;
type Coerced = {
    value: unknown;
    issue?: ImportRowIssueCode;
    raw?: string;
};
/** One cell read the way the workbook reader reads it; `issue` is set when the value could not be used. */
declare function coerceCell(kind: ColumnKind, v: unknown): Coerced;
interface ImportReadResult {
    /** False when the workbook's shape is wrong (see `schemaErrors`); the tables are then not usable. */
    ok: boolean;
    schemaErrors: string[];
    schemaVersion: string | null;
    tables: {
        [T in ImportTableName]: ImportRow<T>[];
    };
    counts: Record<ImportTableName, number>;
    /** The first MAX_LISTED_ISSUES issues; totals below are complete. */
    issues: ImportRowIssue[];
    /** `table.CODE` -> count. */
    issueTotals: Record<string, number>;
    /** Rows left out because a required enum value was invalid (links only). */
    droppedRows: Partial<Record<ImportTableName, number>>;
    /** Cells that need the owner's Continue or Stop before anything is kept. */
    warnings: {
        emailOrUrlCells: number;
        impossibleDates: number;
    };
}
/** Reads the parsed sheets into typed tables. Never throws on data: every problem is a schema error or a row issue. */
declare function readImportWorkbook(sheets: RawSheets): ImportReadResult;

/** One row of the owner's private `map` sheet. The map never leaves the owner's browser. */
interface RedactionMapRow {
    code: string;
    key?: string;
    original: string;
    type?: string;
}
/**
 * Columns that hold exactly one redacted code (or a supplier name left readable on purpose). These stay codes:
 * only the customers and vendors tables get a `name`, so a real name lives in one place in the database and
 * every other row points at it by code. They are still scanned so a code with no mapping is reported.
 */
declare const REDACTED_CODE_COLUMNS: Partial<Record<ImportTableName, readonly string[]>>;
/** Tables whose rows are the people themselves: `id` stays the code and a `name` is added. */
declare const REDACTED_NAME_TABLES: readonly ["customers", "vendors"];
/** Free-text columns where the script replaced names inside sentences with codes. */
declare const REDACTED_TEXT_COLUMNS: Partial<Record<ImportTableName, readonly string[]>>;
interface UnredactResult<Tables> {
    tables: Tables;
    /** Distinct codes found in the data that the map does not know, sorted. Empty = fully resolved. */
    unmappedCodes: string[];
    /** Number of cells rewritten. */
    replaced: number;
}
/**
 * Adds the real `name` to every customers and vendors row, and restores names inside the free-text columns.
 * Code columns elsewhere are checked (unmapped codes are reported) but kept as codes. Pure: the input is not changed.
 * Values that are not codes (supplier names, invoice numbers) are left as they are, and name themselves.
 */
declare function unredactTables<Tables extends Partial<{
    [T in ImportTableName]: ImportRow<T>[];
}>>(tables: Tables, mapRows: readonly RedactionMapRow[]): UnredactResult<Tables>;

/**
 * Product text as it arrives from sheets and invoices, cleaned to one comparable key. Pure.
 */
/** Port of `productNorm_` in the import script, so text normalised here equals the workbook's `product_norm`. */
declare function normaliseProductText(text: string | null | undefined): string;
/** Input text and the key it must produce. The import script's copy of the rule is checked against the same pairs. */
declare const PRODUCT_NORM_EXAMPLES: ReadonlyArray<readonly [string, string]>;
/**
 * Whether a text and its key are fit to be saved as a name decision, or to match one. Rejects sheet errors, keys
 * that say nothing about the product (no words, or just a weight), texts that list several products, and keys
 * that carry a refinery suffix or a marketing phrase.
 */
declare function aliasOk(text: string | null | undefined, key: string | null | undefined): boolean;

/**
 * Built-in rules that turn generic product text ("1oz Krugerrand", "50g PAMP", "Full Sovereign") into the SKU of
 * a pricing product. Pure: it returns SKU candidates in priority order and the caller picks the first one the
 * catalogue really has. When the text is not clear it returns null rather than guess.
 */
interface PricingSkuGuess {
    /** The first candidate. */
    sku: string;
    /** Every SKU worth trying, best first. */
    candidates: string[];
    /** Set when the text itself names one metal. */
    metalFromText: MetalType | null;
}
/** The metal the text names, as a whole word. Null when it names none, or names two different ones. */
declare function metalInText(text: string | null | undefined): MetalType | null;
/** `metal` is the metal of the sheet the text came from; a metal named in the text overrides it. */
declare function pricingSkuFor(text: string | null | undefined, metal: MetalType): PricingSkuGuess | null;

type MatchMetal = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
type MatchConfidence = 'CERTAIN' | 'LIKELY' | 'UNCLEAR';
type MetalFrom = 'text' | 'tab' | 'source' | 'price' | 'default';
type MatchOutcome = 'PRICING' | 'SPECIFIC' | 'NOT_A_PRODUCT' | 'NONE';
interface CoinDesign {
    /** Stable key, also used by the rules table. */
    id: string;
    /** Name shown in questions ("Match to 1oz Krugerrand?"). */
    label: string;
    /** Cleaned words (see `normaliseProductText`) of which any one names the design. */
    words: readonly string[];
    /** Cleaned words that must all be present (for designs named by two words); used instead of `words`. */
    allWords?: readonly string[];
    /** The metals it is sold in, with the weights, as labels like "1oz", "1/4oz". */
    metals: Partial<Record<MatchMetal, readonly string[]>>;
    /** Refineries and mints that make it: naming one next to the design adds nothing. */
    mints: readonly string[];
    /** Fixed fine weight in grams, for designs sold by name rather than by weight (sovereigns). */
    fineGrams?: number;
    /** Another way a text names the design, for names that are not one word ("year of the horse"). */
    match?: (tokens: ReadonlySet<string>) => boolean;
    /** Extra words the design's name uses ("isle", "man"): taken out of the text with it. */
    consume?: readonly string[];
    /** Sold in several metals and one name: the Zoho "gold unless it says silver" convention is not applied; the metal must be shown. */
    noSourceDefault?: boolean;
    /** Has no pricing row of its own: without a specific product it only matches the generic coin row, LIKELY, and is flagged for the catalogue. */
    needsProduct?: boolean;
}
/** The coin designs the shop sells. Synonyms: brits, kruger, nugget (Kangaroo), cowboy (Irish Tree of Life). */
declare const COIN_DESIGNS: readonly CoinDesign[];
interface MatchPricingProduct {
    id: number;
    sku: string;
    name: string;
    metal: string;
    category?: string | null;
}
interface MatchSpecificProduct {
    id: number | string;
    name: string;
    metal?: string | null;
    refinery?: string | null;
    genericNorm?: string | null;
    pricingProductId?: number | null;
}
interface MatchCatalogue {
    pricing: readonly MatchPricingProduct[];
    specific?: readonly MatchSpecificProduct[];
}
interface MatchInput {
    /** The product name as written. `name|REFINERY` is accepted. */
    text: string | null | undefined;
    refinery?: string | null;
    /** The metal of the tab or sheet the name came from. */
    metal?: MatchMetal | null;
    /** Where the name was seen, e.g. "purchase_orders,invoice_lines" or "tradesheet". */
    sources?: string | readonly string[] | null;
    /**
     * The metal the rows that carry this name point to (see `priceMetalEvidence`): used when the text names no metal
     * and there is no tab metal. One row is a suggestion (LIKELY), several rows that agree are CERTAIN.
     */
    metalEvidence?: {
        metal: MatchMetal;
        from: 'tab' | 'price';
        rows: number;
    } | null;
    /** Price of one unit of the product, for the price check. */
    unitPrice?: number | null;
    /** The day of the price (informational: the caller already chose `spot` for it). */
    date?: string | Date | null;
    /** Spot price per troy ounce for that day, same currency as `unitPrice`. */
    spot?: Partial<Record<MatchMetal, number>> | null;
}
interface ProductMatch {
    outcome: MatchOutcome;
    /** The pricing product. */
    productId?: number;
    /** The specific product, only for outcome SPECIFIC. */
    salesProductId?: number | string;
    confidence: MatchConfidence;
    reason: string;
    /** For LIKELY: what to ask the person. */
    question?: string;
    /** True when the catalogue lacks a row this name needs. */
    catalogueGap?: boolean;
    /** What was read from the text, for display and tests. */
    metal?: MatchMetal;
    /** Where the metal came from: the text itself, the tab, the source (Zoho convention), the price, or the only metal sold. */
    metalFrom?: MetalFrom;
    weight?: string;
}
interface Parsed {
    empty: boolean;
    problem: string | null;
    notProduct: boolean;
    maybeNotProduct: boolean;
    weight: string | null;
    grams: number | null;
    metals: Set<MatchMetal>;
    bar: boolean;
    coin: boolean;
    bonded: boolean;
    design: CoinDesign | null;
    obscureWord: string | null;
    refinery: string | null;
    leftover: string[];
    /** The cleaned text (accents gone, lower case, refinery and quantity words out), for tests that read words. */
    text: string;
    /** The name has a quantity ("500 x 1oz ..."): the match is for the single item. */
    quantity: boolean;
    /** Melt or scrap: priced by the ounce on the Melt row. */
    melt: boolean;
    /** Not a product, and nothing in the text changes that (a base metal, a pool sale). */
    certainNot: string | null;
}
/** Reads one name. `refineryHint` is a refinery given next to the name. */
declare function parseProductName(text: string | null | undefined, refineryHint?: string | null): Parsed;
/** Matches one name. Every LIKELY answer carries the question to put to a person. */
declare function matchProductName(input: MatchInput, cat: MatchCatalogue): ProductMatch;

/**
 * Foreign gold coins sold by melt value: each is a specific product on the "Gold Melt" pricing row, priced from its
 * fine gold weight. Data only; `readForeignCoin` finds the coin a text names. Pure.
 */
interface ForeignCoin {
    /** The specific product's name (`sales_products.name`). */
    name: string;
    /** Fine gold in grams. */
    fineGrams: number;
    /** The coin a text names, from its cleaned tokens. `true` is sure, `'bare'` means the coin is clear but not its size. */
    test: (t: Tokens) => boolean | 'bare';
}
type Tokens = ReadonlySet<string>;
/** Fine gold in troy ounces as the product's `weightLabel` ("0.1867oz melt"). */
declare function meltLabel(fineGrams: number): string;
declare const FOREIGN_COINS: readonly ForeignCoin[];
/** Cleaned tokens of a name for the tests above: lower case, accents gone, plurals cut ("francs" -> "franc"). */
declare function coinTokens(text: string): Set<string>;
/** The foreign coin a text names, and whether its size is clear; null when it names none. */
declare function readForeignCoin(text: string): {
    coin: ForeignCoin;
    sure: boolean;
} | null;

/**
 * Which metal the rows that carry a product name point to, from their prices against that day's spot. Pure: the
 * caller loads the rows and the spot table (all in one currency; the sheets and Zoho are in euro) and passes them in.
 */

/** A unit price fits a metal when it is within these multiples of that day's spot per fine ounce (silver coins carry a bigger premium). */
declare const FIT_LOW = 0.8;
declare const FIT_HIGH = 1.3;
declare const FIT_HIGH_SILVER = 1.6;
type SpotRow = Partial<Record<MatchMetal, number>>;
interface PriceRow {
    /** YYYY-MM-DD */
    date: string | null;
    /** Price of one item (not the line total). */
    unitPrice: number | null;
}
/** The metals whose spot a price per ounce is close to. */
declare function metalsFitting(perOz: number, spot: SpotRow): MatchMetal[];
/**
 * The metal every priced row agrees on. A row votes only when exactly one metal fits its price per fine ounce; a row
 * that fits none or several abstains. Returns null when nobody votes, when the votes disagree, or when fewer than
 * half the priced rows voted.
 */
declare function priceMetalEvidence(rows: readonly PriceRow[], grams: number | null, spotOn: (date: string) => SpotRow | undefined): {
    metal: MatchMetal;
    rows: number;
} | null;
/**
 * Spot lookup by day from a list of (metal, day, price) rows: the price on that day, else the latest one before it
 * within a week (weekends, holidays). One lookup built once for a whole scan.
 */
declare function spotLookup(rows: readonly {
    metal: MatchMetal;
    date: string;
    price: number;
}[]): (date: string) => SpotRow | undefined;

/**
 * The refineries and mints seen in the data, with the spellings that stand for each. Pure. Matching ignores case,
 * punctuation and accents.
 */
declare const REFINERIES: ReadonlyArray<{
    refinery: string;
    spellings: readonly string[];
}>;
/** Upper case, accents dropped, everything but letters and digits becomes one space. */
declare function refineryWords(s: string): string;
/** The canonical refinery for a spelling, null when the text means "no single refinery", undefined when not listed. */
declare function listedRefinery(text: string): string | null | undefined;
/** The longest listed refinery or spelling contained, as whole words, in a free text; `words` is the spelling found. */
declare function refineryMatch(text: string | null | undefined): {
    refinery: string;
    words: string;
} | null;
/** The refinery named in a free text (longest match, whole words); null when none. */
declare function refineryInText(text: string | null | undefined): string | null;

type SalesProductId = string | number;
interface RefineryAliasEntry {
    /** A spelling seen in the data. */
    alias: string;
    /** The canonical refinery it stands for. */
    refinery: string;
}
/**
 * "ARGOR HERAEUS" and "ARGOR-HERAEUS" become one refinery. Explicit `aliases` win; then the built-in list of
 * refineries and spellings; any other text is kept as its upper-case words. Null = not known or mixed.
 */
declare function normaliseRefinery(text: string | null | undefined, aliases?: readonly RefineryAliasEntry[]): string | null;
interface SalesProductRef {
    id: SalesProductId;
    name: string;
    /** The generic `product_norm` this product is a specific version of, e.g. "1oz bar" or "1/10oz krugerrand". */
    genericNorm: string;
    /** Normalised refinery, or null for products with no refinery (coins). */
    refinery: string | null;
    pricingProductId: number | null;
    /** The metal of the product, for products with no pricing product to say. */
    metal?: string | null;
}
interface ResolverData {
    salesProducts: readonly SalesProductRef[];
    /** BC item number -> sales product id. */
    bcItems?: ReadonlyMap<string, SalesProductId> | Record<string, SalesProductId>;
    /** Confirmed alias keys (a normalised product text, or `norm|REFINERY`) -> sales product id. */
    aliases?: ReadonlyMap<string, SalesProductId> | Record<string, SalesProductId>;
    refineryAliases?: readonly RefineryAliasEntry[];
}
interface ResolveInput {
    productText?: string | null;
    /** The workbook's `product_norm`, when you have it; otherwise derived from `productText`. */
    productNorm?: string | null;
    refinery?: string | null;
    bcItemNo?: string | null;
}
type ResolveMethod = 'BC_ITEM' | 'ALIAS' | 'GENERIC_REFINERY';
type ReviewReason = 'NO_MATCH' | 'AMBIGUOUS' | 'NEEDS_REFINERY';
type ResolveResult = {
    status: 'RESOLVED';
    method: ResolveMethod;
    salesProductId: SalesProductId;
    pricingProductId: number | null;
} | {
    status: 'REVIEW';
    reason: ReviewReason; /** Alias key to confirm in the queue. */
    key: string;
    candidateIds: SalesProductId[];
};
type IdMap = ReadonlyMap<string, SalesProductId> | Record<string, SalesProductId>;
/**
 * The alias to save for a name a tab met. Gold and silver share many names and a saved name holds one decision, so when the
 * name is ambiguous (already saved, or met on both metals) and the text names no metal, the tab's metal is added as a word
 * ("1oz britannia silver"). The resolver reads the row's metal as one more word, so that name only fits that metal's rows.
 */
declare function metalAwareAlias(key: string, text: string | null | undefined, metal: MetalType, ambiguous: boolean): string;
declare function aliasKey(productNorm: string, refinery: string | null): string;
declare function resolveProduct(input: ResolveInput, data: ResolverData): ResolveResult;
/** A saved name decision: a cleaned product text settled to a specific product, or to a pricing product. */
interface ProductDecision {
    key: string;
    productId: number | null;
    salesProductId: SalesProductId | null;
    /** Settled as not a product (a fee, a deposit). */
    noProduct?: boolean;
    /** Who settled it. A person's decision applies to every row with that name; a RULE decision only to rows of its metal. */
    decidedBy?: 'RULE' | 'PERSON' | null;
    /**
     * The metal the name was seen under (its text, else its tab or source). Cleaned alias texts lose "gold", so the
     * key cannot say which metal a rule decision was made for: a RULE decision applies only to a row of this metal,
     * and not at all when no metal is known (the engine then runs for the row with its own metal).
     */
    metalHint?: string | null;
}
interface CatalogueProductRef {
    id: number;
    sku: string;
    metalType: MetalType;
}
interface RowResolverData {
    /** The pricing products (the catalogue). */
    catalogue: readonly CatalogueProductRef[];
    salesProducts?: readonly SalesProductRef[];
    bcItems?: IdMap;
    decisions?: readonly ProductDecision[];
    refineryAliases?: readonly RefineryAliasEntry[];
}
interface RowResolveInput {
    productText?: string | null;
    metal: MetalType;
    refinery?: string | null;
    bcItemNo?: string | null;
}
type RowResolveMethod = 'BC_ITEM' | 'ALIAS' | 'GENERIC_REFINERY' | 'RULE' | 'NOT_PRODUCT' | 'NONE';
interface RowResolveResult {
    /** The cleaned product text. */
    key: string;
    pricingProductId: number | null;
    /** Only set when the row named a specific product. */
    salesProductId: SalesProductId | null;
    refinery: string | null;
    method: RowResolveMethod;
    /** The metal the text names, when it names exactly one. */
    metalFromText: MetalType | null;
    /** "scrap" or "melt" in the text: bought back for its metal, not for resale. */
    melt: boolean;
}
/**
 * First hit wins: BC item number, saved name decision, generic name + refinery against the specific products,
 * built-in rules against the catalogue, else NONE. A row keeps the pricing product when there is one and the
 * specific product only when it was named.
 */
declare function resolveRowProduct(input: RowResolveInput, data: RowResolverData): RowResolveResult;

/**
 * Tells the Import hub what a dropped file is, from tab names and header rows only (no row data).
 * `detectTabType` is a port of `detectType_` in the owner's Apps Script, so both sides agree.
 */
type TabType = 'bc_journal' | 'bc_tracking' | 'zoho_products_sold' | 'bc_items' | 'zoho_invoices' | 'zoho_payments' | 'zoho_po' | 'zoho_contacts' | 'zoho_vendors' | 'bc_orders' | 'customer_safe' | 'trade_purchases' | 'trade_sales' | 'stock_bars' | 'stock_coins';
type FileKind = 'import_workbook' | 'redaction_map' | 'bc_awaiting_collection' | 'tradesheet' | 'zoho_export' | 'bc_stock' | 'stock_sheet' | 'mixed' | 'unknown';
/** Returns '' for tabs that are not recognised (Spain tabs are ignored on purpose). */
declare function detectTabType(tab: string, headers: readonly unknown[]): TabType | '';
interface TabHeaders {
    name: string;
    headers: readonly unknown[];
}
interface DetectedFile {
    kind: FileKind;
    tabs: {
        name: string;
        type: TabType | '';
    }[];
}
/** File-level answer for the Import hub. A file is "mixed" when its recognised tabs belong to different kinds. */
declare function detectFileType(tabs: readonly TabHeaders[]): DetectedFile;

/**
 * Builds a fake workbook in the shape the real one has, for specs and the `validate:workbook --fake` check.
 * Every name is invented; nothing here comes from real data. Cell types are deliberately varied the way a
 * spreadsheet library returns them: real dates, floats for whole numbers, TRUE/FALSE as booleans or text.
 */
declare const FAKE_CUSTOMERS: string[];
declare function fakeRedactionMap(): RedactionMapRow[];
/** A raw-sheets object for the whole workbook: `rowsPerTable` rows in every table, plus `meta`. */
declare function fakeWorkbookSheets(rowsPerTable?: number): RawSheets;
/** Columns an old script build did not write; handy for testing that they may be absent. */
declare function withoutOptionalColumns(sheets: RawSheets): RawSheets;

/**
 * Tables the workbook import writes, in the order a batch must send them: parents first, so a row can find the
 * customer, invoice or supplier invoice it points at. The browser sends one table per request, at most
 * WORKBOOK_CHUNK_MAX_ROWS rows each. `customer_safe_items` must stay after `customers`: it resolves client codes to names.
 */
declare const WORKBOOK_LOAD_ORDER: readonly ["customers", "vendors", "supplier_invoices", "purchase_lots", "trades", "invoices", "invoice_lines", "line_serials", "payments", "purchase_orders", "bc_sales_orders", "customer_safe_items", "bc_tracking_entries", "bc_items", "zoho_products", "stock_bars", "stock_coins", "bc_journal_lines", "product_aliases", "links"];
type WorkbookLoadTable = (typeof WORKBOOK_LOAD_ORDER)[number];
declare const WORKBOOK_CHUNK_MAX_ROWS = 5000;
declare const WorkbookChunkRequestSchema: z.ZodObject<{
    batchId: z.ZodOptional<z.ZodNumber>;
    fileName: z.ZodString;
    schemaVersion: z.ZodLiteral<"1.1">;
    table: z.ZodEnum<{
        trades: "trades";
        purchase_lots: "purchase_lots";
        supplier_invoices: "supplier_invoices";
        invoices: "invoices";
        invoice_lines: "invoice_lines";
        line_serials: "line_serials";
        payments: "payments";
        purchase_orders: "purchase_orders";
        stock_bars: "stock_bars";
        stock_coins: "stock_coins";
        bc_journal_lines: "bc_journal_lines";
        bc_tracking_entries: "bc_tracking_entries";
        bc_items: "bc_items";
        zoho_products: "zoho_products";
        customer_safe_items: "customer_safe_items";
        bc_sales_orders: "bc_sales_orders";
        links: "links";
        customers: "customers";
        vendors: "vendors";
        product_aliases: "product_aliases";
    }>;
    rows: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    lastOfTable: z.ZodDefault<z.ZodBoolean>;
    complete: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type WorkbookChunkRequest = z.infer<typeof WorkbookChunkRequestSchema>;
declare const WorkbookChunkResultSchema: z.ZodObject<{
    batchId: z.ZodNumber;
    table: z.ZodEnum<{
        trades: "trades";
        purchase_lots: "purchase_lots";
        supplier_invoices: "supplier_invoices";
        invoices: "invoices";
        invoice_lines: "invoice_lines";
        line_serials: "line_serials";
        payments: "payments";
        purchase_orders: "purchase_orders";
        stock_bars: "stock_bars";
        stock_coins: "stock_coins";
        bc_journal_lines: "bc_journal_lines";
        bc_tracking_entries: "bc_tracking_entries";
        bc_items: "bc_items";
        zoho_products: "zoho_products";
        customer_safe_items: "customer_safe_items";
        bc_sales_orders: "bc_sales_orders";
        links: "links";
        customers: "customers";
        vendors: "vendors";
        product_aliases: "product_aliases";
    }>;
    added: z.ZodNumber;
    changed: z.ZodNumber;
    unchanged: z.ZodNumber;
    unmatched: z.ZodNumber;
    quotes: z.ZodNumber;
    quotesInvoiced: z.ZodNumber;
    unresolved: z.ZodRecord<z.ZodString, z.ZodNumber>;
    markedMissing: z.ZodNumber;
}, z.core.$strip>;
type WorkbookChunkResult = z.infer<typeof WorkbookChunkResultSchema>;
/**
 * The Business Central "Orders Awaiting Collection" report, read in the browser into `bc_sales_orders` rows
 * (id = the BC order number, so a newer report updates the same order). The whole report goes in one request: an
 * order that is no longer in it has been posted, so a partial file would post orders wrongly.
 */
declare const BcAwaitingRequestSchema: z.ZodObject<{
    fileName: z.ZodString;
    schemaVersion: z.ZodLiteral<"1.1">;
    rows: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type BcAwaitingRequest = z.infer<typeof BcAwaitingRequestSchema>;
declare const BcAwaitingResultSchema: z.ZodObject<{
    batchId: z.ZodNumber;
    added: z.ZodNumber;
    changed: z.ZodNumber;
    unchanged: z.ZodNumber;
    gone: z.ZodNumber;
    posted: z.ZodNumber;
    alreadyPosted: z.ZodNumber;
    noTrade: z.ZodNumber;
}, z.core.$strip>;
type BcAwaitingResult = z.infer<typeof BcAwaitingResultSchema>;
declare const ImportBatchSummarySchema: z.ZodObject<{
    id: z.ZodNumber;
    fileName: z.ZodString;
    importedBy: z.ZodString;
    importedAt: z.ZodString;
    status: z.ZodString;
    schemaVersion: z.ZodNullable<z.ZodString>;
    tableCounts: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNumber>>>;
}, z.core.$strip>;
type ImportBatchSummary = z.infer<typeof ImportBatchSummarySchema>;
declare const ImportBatchListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    fileName: z.ZodString;
    importedBy: z.ZodString;
    importedAt: z.ZodString;
    status: z.ZodString;
    schemaVersion: z.ZodNullable<z.ZodString>;
    tableCounts: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNumber>>>;
}, z.core.$strip>>;

/**
 * Logic behind the Import hub that does not need a browser: how a read workbook is cut into requests, and how the
 * Business Central "Orders Awaiting Collection" report becomes `bc_sales_orders` rows.
 */
type Row = Record<string, unknown>;
/**
 * Cuts the tables into the requests the server expects: load order, at most WORKBOOK_CHUNK_MAX_ROWS rows each,
 * `lastOfTable` on the final chunk of every table that is sent, `complete` on the very last request. Empty tables
 * send nothing, so an empty tab never flags the rows already stored as missing.
 */
declare function planUpload(tables: Partial<Record<WorkbookLoadTable, Row[]>>, fileName: string, chunkSize?: number): Omit<WorkbookChunkRequest, 'batchId'>[];
/** Port of `normName_` in the import script: the form a name is looked up in. */
declare function normaliseName(s: string | null | undefined): string;
/** Real name -> redaction code, from the owner's map. Built in the browser; the map is never sent anywhere. */
declare function buildNameLookup(mapRows: readonly RedactionMapRow[]): Map<string, string>;
/** Port of `coreRef_`: "DU-G20260941" -> "G20260941". */
declare function coreRef(s: unknown): string;
interface BcReportResult {
    rows: Row[];
    /** Customer names the map did not know; those rows keep no customer code. */
    unmappedCustomers: number;
    /** Rows without an order number, left out. */
    skipped: number;
    /** The report's header row was not found, so nothing could be read. */
    headerFound: boolean;
}
/**
 * Reads the report's sheet (rows of cells, header within the first rows) into `bc_sales_orders` rows. The order
 * number is the row id, so a newer report updates the same order. Customer names become codes through the map; a
 * name it does not know is dropped rather than sent.
 */
declare function mapBcReport(sheet: readonly (readonly unknown[])[], fileName: string, names: ReadonlyMap<string, string>, 
/** The day the report was taken; it carries no date of its own. Lets a newer report win over an older copy. */
snapshotDate?: string): BcReportResult;

/**
 * Review queues: what the import could not settle by itself. Admins decide here. Nothing in these queues changes a
 * trade, lot or invoice; a decision is recorded on the link or alias and consumers read it from there.
 */
declare const ReviewLinkTypeSchema: z.ZodEnum<{
    trade_lot: "trade_lot";
    invoice_line_trade: "invoice_line_trade";
    line_serial_bc_tracking: "line_serial_bc_tracking";
    trade_supplier_invoice: "trade_supplier_invoice";
    stock_bar_bc_tracking: "stock_bar_bc_tracking";
    safe_trade: "safe_trade";
    serial_customer_safe: "serial_customer_safe";
    serial_stock_bar: "serial_stock_bar";
    lot_supplier_invoice: "lot_supplier_invoice";
    bc_trade: "bc_trade";
}>;
declare const ReviewSummarySchema: z.ZodObject<{
    links: z.ZodRecord<z.ZodString, z.ZodNumber>;
    unresolvedLots: z.ZodNumber;
    duplicates: z.ZodNumber;
    aliases: z.ZodNumber;
    overAllocated: z.ZodNumber;
}, z.core.$strip>;
type ReviewSummary = z.infer<typeof ReviewSummarySchema>;
declare const ReviewLinkRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    linkType: z.ZodString;
    confidence: z.ZodEnum<{
        EXACT: "EXACT";
        PROBABLE: "PROBABLE";
    }>;
    method: z.ZodString;
    note: z.ZodNullable<z.ZodString>;
    from: z.ZodObject<{
        table: z.ZodString;
        label: z.ZodString;
        detail: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    to: z.ZodObject<{
        table: z.ZodString;
        label: z.ZodString;
        detail: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    why: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type ReviewLinkRow = z.infer<typeof ReviewLinkRowSchema>;
declare const ReviewLinksResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        linkType: z.ZodString;
        confidence: z.ZodEnum<{
            EXACT: "EXACT";
            PROBABLE: "PROBABLE";
        }>;
        method: z.ZodString;
        note: z.ZodNullable<z.ZodString>;
        from: z.ZodObject<{
            table: z.ZodString;
            label: z.ZodString;
            detail: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
        to: z.ZodObject<{
            table: z.ZodString;
            label: z.ZodString;
            detail: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
        why: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ReviewLinksResponse = z.infer<typeof ReviewLinksResponseSchema>;
declare const ReviewLinksQuerySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        trade_lot: "trade_lot";
        invoice_line_trade: "invoice_line_trade";
        line_serial_bc_tracking: "line_serial_bc_tracking";
        trade_supplier_invoice: "trade_supplier_invoice";
        stock_bar_bc_tracking: "stock_bar_bc_tracking";
        safe_trade: "safe_trade";
        serial_customer_safe: "serial_customer_safe";
        serial_stock_bar: "serial_stock_bar";
        lot_supplier_invoice: "lot_supplier_invoice";
        bc_trade: "bc_trade";
    }>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type ReviewLinksQuery = z.infer<typeof ReviewLinksQuerySchema>;
declare const LinkDecisionSchema: z.ZodEnum<{
    CONFIRMED: "CONFIRMED";
    REJECTED: "REJECTED";
}>;
declare const LinkDecisionRequestSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber>;
    decision: z.ZodEnum<{
        CONFIRMED: "CONFIRMED";
        REJECTED: "REJECTED";
    }>;
}, z.core.$strip>;
type LinkDecisionRequest = z.infer<typeof LinkDecisionRequestSchema>;
declare const LinkDecisionResultSchema: z.ZodObject<{
    updated: z.ZodNumber;
}, z.core.$strip>;
type LinkDecisionResult = z.infer<typeof LinkDecisionResultSchema>;
declare const UnresolvedLotRowSchema: z.ZodObject<{
    tradeId: z.ZodNumber;
    reference: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    qty: z.ZodNullable<z.ZodNumber>;
    productText: z.ZodString;
    lotKey: z.ZodString;
    branchCode: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type UnresolvedLotRow = z.infer<typeof UnresolvedLotRowSchema>;
declare const UnresolvedLotsResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        tradeId: z.ZodNumber;
        reference: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
        productText: z.ZodString;
        lotKey: z.ZodString;
        branchCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type UnresolvedLotsResponse = z.infer<typeof UnresolvedLotsResponseSchema>;
declare const DuplicateRowSchema: z.ZodObject<{
    tradeId: z.ZodNumber;
    reference: z.ZodString;
    occurrence: z.ZodNumber;
    date: z.ZodNullable<z.ZodString>;
    qty: z.ZodNullable<z.ZodNumber>;
    productText: z.ZodString;
    branchCode: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type DuplicateRow = z.infer<typeof DuplicateRowSchema>;
declare const DuplicatesResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        tradeId: z.ZodNumber;
        reference: z.ZodString;
        occurrence: z.ZodNumber;
        date: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
        productText: z.ZodString;
        branchCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type DuplicatesResponse = z.infer<typeof DuplicatesResponseSchema>;
/** What a product name is suggested to become (or, for a settled name, what it was settled to). */
declare const AliasTargetSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        PRICING: "PRICING";
        SPECIFIC: "SPECIFIC";
        NOT_A_PRODUCT: "NOT_A_PRODUCT";
    }>;
    id: z.ZodNullable<z.ZodNumber>;
    name: z.ZodString;
}, z.core.$strip>;
type AliasTarget = z.infer<typeof AliasTargetSchema>;
/** Where a product name is used. */
declare const ALIAS_USAGE_SOURCES: readonly ["SALES", "PURCHASES", "ZOHO", "ZOHO_PO", "CUSTOMER_SAFE"];
declare const AliasUsageSourceSchema: z.ZodEnum<{
    SALES: "SALES";
    ZOHO: "ZOHO";
    PURCHASES: "PURCHASES";
    ZOHO_PO: "ZOHO_PO";
    CUSTOMER_SAFE: "CUSTOMER_SAFE";
}>;
type AliasUsageSource = z.infer<typeof AliasUsageSourceSchema>;
declare const AliasUsageMetalSchema: z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PGM: "PGM";
}>;
type AliasUsageMetal = z.infer<typeof AliasUsageMetalSchema>;
/** How many rows of one source (and tab metal, where the source has one) carry a name. */
declare const AliasSeenInSchema: z.ZodObject<{
    source: z.ZodEnum<{
        SALES: "SALES";
        ZOHO: "ZOHO";
        PURCHASES: "PURCHASES";
        ZOHO_PO: "ZOHO_PO";
        CUSTOMER_SAFE: "CUSTOMER_SAFE";
    }>;
    metal: z.ZodNullable<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
    count: z.ZodNumber;
}, z.core.$strip>;
type AliasSeenIn = z.infer<typeof AliasSeenInSchema>;
declare const AliasRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    alias: z.ZodString;
    uses: z.ZodNumber;
    refinery: z.ZodNullable<z.ZodString>;
    sources: z.ZodNullable<z.ZodString>;
    confidence: z.ZodNullable<z.ZodEnum<{
        CERTAIN: "CERTAIN";
        LIKELY: "LIKELY";
        UNCLEAR: "UNCLEAR";
    }>>;
    reason: z.ZodNullable<z.ZodString>;
    question: z.ZodNullable<z.ZodString>;
    catalogueGap: z.ZodBoolean;
    decidedBy: z.ZodNullable<z.ZodEnum<{
        RULE: "RULE";
        PERSON: "PERSON";
    }>>;
    suggestion: z.ZodNullable<z.ZodObject<{
        kind: z.ZodEnum<{
            PRICING: "PRICING";
            SPECIFIC: "SPECIFIC";
            NOT_A_PRODUCT: "NOT_A_PRODUCT";
        }>;
        id: z.ZodNullable<z.ZodNumber>;
        name: z.ZodString;
    }, z.core.$strip>>;
    settledTo: z.ZodNullable<z.ZodObject<{
        kind: z.ZodEnum<{
            PRICING: "PRICING";
            SPECIFIC: "SPECIFIC";
            NOT_A_PRODUCT: "NOT_A_PRODUCT";
        }>;
        id: z.ZodNullable<z.ZodNumber>;
        name: z.ZodString;
    }, z.core.$strip>>;
    seenIn: z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<{
            SALES: "SALES";
            ZOHO: "ZOHO";
            PURCHASES: "PURCHASES";
            ZOHO_PO: "ZOHO_PO";
            CUSTOMER_SAFE: "CUSTOMER_SAFE";
        }>;
        metal: z.ZodNullable<z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>>;
        count: z.ZodNumber;
    }, z.core.$strip>>;
    perMetal: z.ZodNullable<z.ZodArray<z.ZodObject<{
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        unresolved: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type AliasRow = z.infer<typeof AliasRowSchema>;
/** Names in each state. "Settled" counts names settled by rule only; a person's own decisions are not queue items. */
declare const AliasCountsSchema: z.ZodObject<{
    settledByRule: z.ZodNumber;
    settledPerRow: z.ZodNumber;
    toConfirm: z.ZodNumber;
    toDecide: z.ZodNumber;
}, z.core.$strip>;
type AliasCounts = z.infer<typeof AliasCountsSchema>;
declare const ALIAS_VIEWS: readonly ["open", "confirm", "decide", "settled", "per-row"];
declare const AliasesQuerySchema: z.ZodObject<{
    view: z.ZodDefault<z.ZodEnum<{
        settled: "settled";
        open: "open";
        confirm: "confirm";
        decide: "decide";
        "per-row": "per-row";
    }>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type AliasesQuery = z.infer<typeof AliasesQuerySchema>;
declare const AliasesResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    counts: z.ZodObject<{
        settledByRule: z.ZodNumber;
        settledPerRow: z.ZodNumber;
        toConfirm: z.ZodNumber;
        toDecide: z.ZodNumber;
    }, z.core.$strip>;
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        alias: z.ZodString;
        uses: z.ZodNumber;
        refinery: z.ZodNullable<z.ZodString>;
        sources: z.ZodNullable<z.ZodString>;
        confidence: z.ZodNullable<z.ZodEnum<{
            CERTAIN: "CERTAIN";
            LIKELY: "LIKELY";
            UNCLEAR: "UNCLEAR";
        }>>;
        reason: z.ZodNullable<z.ZodString>;
        question: z.ZodNullable<z.ZodString>;
        catalogueGap: z.ZodBoolean;
        decidedBy: z.ZodNullable<z.ZodEnum<{
            RULE: "RULE";
            PERSON: "PERSON";
        }>>;
        suggestion: z.ZodNullable<z.ZodObject<{
            kind: z.ZodEnum<{
                PRICING: "PRICING";
                SPECIFIC: "SPECIFIC";
                NOT_A_PRODUCT: "NOT_A_PRODUCT";
            }>;
            id: z.ZodNullable<z.ZodNumber>;
            name: z.ZodString;
        }, z.core.$strip>>;
        settledTo: z.ZodNullable<z.ZodObject<{
            kind: z.ZodEnum<{
                PRICING: "PRICING";
                SPECIFIC: "SPECIFIC";
                NOT_A_PRODUCT: "NOT_A_PRODUCT";
            }>;
            id: z.ZodNullable<z.ZodNumber>;
            name: z.ZodString;
        }, z.core.$strip>>;
        seenIn: z.ZodArray<z.ZodObject<{
            source: z.ZodEnum<{
                SALES: "SALES";
                ZOHO: "ZOHO";
                PURCHASES: "PURCHASES";
                ZOHO_PO: "ZOHO_PO";
                CUSTOMER_SAFE: "CUSTOMER_SAFE";
            }>;
            metal: z.ZodNullable<z.ZodEnum<{
                GOLD: "GOLD";
                SILVER: "SILVER";
                PGM: "PGM";
            }>>;
            count: z.ZodNumber;
        }, z.core.$strip>>;
        perMetal: z.ZodNullable<z.ZodArray<z.ZodObject<{
            metal: z.ZodEnum<{
                GOLD: "GOLD";
                SILVER: "SILVER";
                PGM: "PGM";
            }>;
            unresolved: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type AliasesResponse = z.infer<typeof AliasesResponseSchema>;
/** One example row of where a name is used. Never carries a customer or vendor name or code. */
declare const AliasUsageExampleSchema: z.ZodObject<{
    source: z.ZodEnum<{
        SALES: "SALES";
        ZOHO: "ZOHO";
        PURCHASES: "PURCHASES";
        ZOHO_PO: "ZOHO_PO";
        CUSTOMER_SAFE: "CUSTOMER_SAFE";
    }>;
    metal: z.ZodNullable<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
    sheet: z.ZodNullable<z.ZodString>;
    date: z.ZodNullable<z.ZodString>;
    qty: z.ZodNullable<z.ZodNumber>;
    unitPrice: z.ZodNullable<z.ZodNumber>;
    resolvedTo: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type AliasUsageExample = z.infer<typeof AliasUsageExampleSchema>;
declare const AliasUsageResponseSchema: z.ZodObject<{
    rows: z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<{
            SALES: "SALES";
            ZOHO: "ZOHO";
            PURCHASES: "PURCHASES";
            ZOHO_PO: "ZOHO_PO";
            CUSTOMER_SAFE: "CUSTOMER_SAFE";
        }>;
        metal: z.ZodNullable<z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>>;
        sheet: z.ZodNullable<z.ZodString>;
        date: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
        unitPrice: z.ZodNullable<z.ZodNumber>;
        resolvedTo: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type AliasUsageResponse = z.infer<typeof AliasUsageResponseSchema>;
/** A product for the unresolved rows of one metal: exactly one of a pricing product or a specific product. */
declare const PerMetalChoiceSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    productId: z.ZodOptional<z.ZodNumber>;
    salesProductId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type PerMetalChoice = z.infer<typeof PerMetalChoiceSchema>;
declare const ApplyPerMetalRequestSchema: z.ZodObject<{
    choices: z.ZodArray<z.ZodObject<{
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        productId: z.ZodOptional<z.ZodNumber>;
        salesProductId: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ApplyPerMetalRequest = z.infer<typeof ApplyPerMetalRequestSchema>;
declare const ApplyPerMetalResultSchema: z.ZodObject<{
    trades: z.ZodNumber;
    lots: z.ZodNumber;
}, z.core.$strip>;
type ApplyPerMetalResult = z.infer<typeof ApplyPerMetalResultSchema>;
/** Rescan: re-run the matching rules over every name a person has not decided. dryRun counts and writes nothing. */
declare const SettleNamesRequestSchema: z.ZodObject<{
    dryRun: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type SettleNamesRequest = z.infer<typeof SettleNamesRequestSchema>;
declare const SettleNamesResultSchema: z.ZodObject<{
    dryRun: z.ZodBoolean;
    certain: z.ZodNumber;
    likely: z.ZodNumber;
    unclear: z.ZodNumber;
    unchanged: z.ZodNumber;
}, z.core.$strip>;
type SettleNamesResult = z.infer<typeof SettleNamesResultSchema>;
/** The tables Relink looks at: the only ones with a product column. */
declare const RELINK_TABLES: readonly ["trades", "purchase_lots", "zoho_invoice_lines", "zoho_products", "quotes"];
type RelinkTable = (typeof RELINK_TABLES)[number];
/**
 * Relink: re-attach products on existing rows from the settled names. `dryRun` counts and writes nothing. `correct`
 * also changes rows whose product disagrees with a person's decision (fill-only otherwise).
 */
declare const RelinkRequestSchema: z.ZodObject<{
    dryRun: z.ZodBoolean;
    correct: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type RelinkRequest = z.infer<typeof RelinkRequestSchema>;
declare const RelinkTableResultSchema: z.ZodObject<{
    rowsChecked: z.ZodNumber;
    fill: z.ZodNumber;
    correct: z.ZodNumber;
    pricingOnlyNoColumn: z.ZodNumber;
    unresolved: z.ZodNumber;
    notProduct: z.ZodNumber;
    written: z.ZodNumber;
}, z.core.$strip>;
type RelinkTableResult = z.infer<typeof RelinkTableResultSchema>;
declare const RelinkResultSchema: z.ZodObject<{
    dryRun: z.ZodBoolean;
    correct: z.ZodBoolean;
    tables: z.ZodObject<{
        trades: z.ZodObject<{
            rowsChecked: z.ZodNumber;
            fill: z.ZodNumber;
            correct: z.ZodNumber;
            pricingOnlyNoColumn: z.ZodNumber;
            unresolved: z.ZodNumber;
            notProduct: z.ZodNumber;
            written: z.ZodNumber;
        }, z.core.$strip>;
        purchase_lots: z.ZodObject<{
            rowsChecked: z.ZodNumber;
            fill: z.ZodNumber;
            correct: z.ZodNumber;
            pricingOnlyNoColumn: z.ZodNumber;
            unresolved: z.ZodNumber;
            notProduct: z.ZodNumber;
            written: z.ZodNumber;
        }, z.core.$strip>;
        zoho_invoice_lines: z.ZodObject<{
            rowsChecked: z.ZodNumber;
            fill: z.ZodNumber;
            correct: z.ZodNumber;
            pricingOnlyNoColumn: z.ZodNumber;
            unresolved: z.ZodNumber;
            notProduct: z.ZodNumber;
            written: z.ZodNumber;
        }, z.core.$strip>;
        zoho_products: z.ZodObject<{
            rowsChecked: z.ZodNumber;
            fill: z.ZodNumber;
            correct: z.ZodNumber;
            pricingOnlyNoColumn: z.ZodNumber;
            unresolved: z.ZodNumber;
            notProduct: z.ZodNumber;
            written: z.ZodNumber;
        }, z.core.$strip>;
        quotes: z.ZodObject<{
            rowsChecked: z.ZodNumber;
            fill: z.ZodNumber;
            correct: z.ZodNumber;
            pricingOnlyNoColumn: z.ZodNumber;
            unresolved: z.ZodNumber;
            notProduct: z.ZodNumber;
            written: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
type RelinkResult = z.infer<typeof RelinkResultSchema>;
/** Turn down the engine's suggestions for these names. */
declare const NameSuggestionDecisionRequestSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
type NameSuggestionDecisionRequest = z.infer<typeof NameSuggestionDecisionRequestSchema>;
declare const NameSuggestionDecisionResultSchema: z.ZodObject<{
    done: z.ZodNumber;
    skipped: z.ZodNumber;
}, z.core.$strip>;
type NameSuggestionDecisionResult = z.infer<typeof NameSuggestionDecisionResultSchema>;
/** The suggestion the person saw: exactly one of a pricing product, a specific product, or "not a product". */
declare const NameSuggestionTargetSchema: z.ZodObject<{
    productId: z.ZodOptional<z.ZodNumber>;
    salesProductId: z.ZodOptional<z.ZodNumber>;
    noProduct: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strip>;
type NameSuggestionTarget = z.infer<typeof NameSuggestionTargetSchema>;
/**
 * Accept suggestions. Each item says which suggestion the person saw (`expected`); the server accepts a name only
 * if its stored suggestion still equals it, so a rescan between the screen and the click cannot change what is tied.
 */
declare const NameSuggestionAcceptRequestSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        expected: z.ZodObject<{
            productId: z.ZodOptional<z.ZodNumber>;
            salesProductId: z.ZodOptional<z.ZodNumber>;
            noProduct: z.ZodOptional<z.ZodLiteral<true>>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type NameSuggestionAcceptRequest = z.infer<typeof NameSuggestionAcceptRequestSchema>;
declare const NameSuggestionAcceptResultSchema: z.ZodObject<{
    accepted: z.ZodNumber;
    skipped: z.ZodNumber;
}, z.core.$strip>;
type NameSuggestionAcceptResult = z.infer<typeof NameSuggestionAcceptResultSchema>;
declare const SalesProductSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    genericNorm: z.ZodString;
    refinery: z.ZodNullable<z.ZodString>;
    pricingProductId: z.ZodNullable<z.ZodNumber>;
    pricingProductName: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type SalesProduct = z.infer<typeof SalesProductSchema>;
declare const SalesProductListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    genericNorm: z.ZodString;
    refinery: z.ZodNullable<z.ZodString>;
    pricingProductId: z.ZodNullable<z.ZodNumber>;
    pricingProductName: z.ZodNullable<z.ZodString>;
}, z.core.$strip>>;
declare const CreateSalesProductRequestSchema: z.ZodObject<{
    name: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    genericNorm: z.ZodString;
    refinery: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    pricingProductId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
type CreateSalesProductRequest = z.infer<typeof CreateSalesProductRequestSchema>;
/** Specific products made from the Business Central item list. */
declare const BcSalesProductActionSchema: z.ZodEnum<{
    CREATE: "CREATE";
    LINKED: "LINKED";
    SKIP: "SKIP";
}>;
type BcSalesProductAction = z.infer<typeof BcSalesProductActionSchema>;
declare const BcSalesProductRowSchema: z.ZodObject<{
    itemNo: z.ZodString;
    description: z.ZodString;
    action: z.ZodEnum<{
        CREATE: "CREATE";
        LINKED: "LINKED";
        SKIP: "SKIP";
    }>;
    reason: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    metal: z.ZodNullable<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
    refinery: z.ZodNullable<z.ZodString>;
    genericNorm: z.ZodString;
    pricingProductId: z.ZodNullable<z.ZodNumber>;
    pricingProductName: z.ZodNullable<z.ZodString>;
    suggestedSku: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type BcSalesProductRow = z.infer<typeof BcSalesProductRowSchema>;
declare const BcSalesProductsPreviewSchema: z.ZodObject<{
    rows: z.ZodArray<z.ZodObject<{
        itemNo: z.ZodString;
        description: z.ZodString;
        action: z.ZodEnum<{
            CREATE: "CREATE";
            LINKED: "LINKED";
            SKIP: "SKIP";
        }>;
        reason: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        metal: z.ZodNullable<z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>>;
        refinery: z.ZodNullable<z.ZodString>;
        genericNorm: z.ZodString;
        pricingProductId: z.ZodNullable<z.ZodNumber>;
        pricingProductName: z.ZodNullable<z.ZodString>;
        suggestedSku: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    totals: z.ZodObject<{
        create: z.ZodNumber;
        linked: z.ZodNumber;
        skip: z.ZodNumber;
        total: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
type BcSalesProductsPreview = z.infer<typeof BcSalesProductsPreviewSchema>;
/** Empty or missing `itemNos` = every row that is ready to create. */
declare const BcSalesProductsApplyRequestSchema: z.ZodObject<{
    itemNos: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type BcSalesProductsApplyRequest = z.infer<typeof BcSalesProductsApplyRequestSchema>;
declare const BcSalesProductsApplyResultSchema: z.ZodObject<{
    created: z.ZodNumber;
    linked: z.ZodNumber;
    skipped: z.ZodNumber;
}, z.core.$strip>;
type BcSalesProductsApplyResult = z.infer<typeof BcSalesProductsApplyResultSchema>;
/** A name is tied to exactly one of: a specific sales product, a pricing product, or marked not a product. */
declare const MapAliasRequestSchema: z.ZodObject<{
    salesProductId: z.ZodOptional<z.ZodNumber>;
    productId: z.ZodOptional<z.ZodNumber>;
    noProduct: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strip>;
type MapAliasRequest = z.infer<typeof MapAliasRequestSchema>;
declare const ReviewPageQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type ReviewPageQuery = z.infer<typeof ReviewPageQuerySchema>;
declare const PricingProductOptionSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    metalType: z.ZodString;
}, z.core.$strip>;
type PricingProductOption = z.infer<typeof PricingProductOptionSchema>;
declare const PricingProductOptionListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    metalType: z.ZodString;
}, z.core.$strip>>;
declare const SettleResultSchema: z.ZodObject<{
    confirmed: z.ZodNumber;
    asked: z.ZodNumber;
    overAllocated: z.ZodNumber;
    quotesInvoiced: z.ZodNumber;
}, z.core.$strip>;
type SettleResult = z.infer<typeof SettleResultSchema>;
declare const OverAllocatedLotSchema: z.ZodObject<{
    lotId: z.ZodNumber;
    reference: z.ZodString;
    productText: z.ZodString;
    received: z.ZodNullable<z.ZodString>;
    bought: z.ZodNumber;
    sold: z.ZodNumber;
    sales: z.ZodArray<z.ZodObject<{
        tradeId: z.ZodNumber;
        reference: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type OverAllocatedLot = z.infer<typeof OverAllocatedLotSchema>;
declare const OverAllocatedResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        lotId: z.ZodNumber;
        reference: z.ZodString;
        productText: z.ZodString;
        received: z.ZodNullable<z.ZodString>;
        bought: z.ZodNumber;
        sold: z.ZodNumber;
        sales: z.ZodArray<z.ZodObject<{
            tradeId: z.ZodNumber;
            reference: z.ZodString;
            date: z.ZodNullable<z.ZodString>;
            qty: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type OverAllocatedResponse = z.infer<typeof OverAllocatedResponseSchema>;

/**
 * Customers and invoices from the imported Zoho history and the tradesheets. Read only, admin only. Customer names
 * appear only in these responses: searches are POST bodies and pages are addressed by number, so a name never reaches
 * a URL, a log line or browser storage. Lists are paged (at most 100 rows); there is no export.
 */
declare const RECORD_PAGE_MAX = 100;
declare const RecordSearchRequestSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
type RecordSearchRequest = z.infer<typeof RecordSearchRequestSchema>;
declare const CustomerListRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    status: z.ZodNullable<z.ZodString>;
    currency: z.ZodNullable<z.ZodString>;
    openOrders: z.ZodNumber;
    lastOrder: z.ZodNullable<z.ZodString>;
    lifetime: z.ZodNumber;
    since: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type CustomerListRow = z.infer<typeof CustomerListRowSchema>;
declare const CustomerListResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        status: z.ZodNullable<z.ZodString>;
        currency: z.ZodNullable<z.ZodString>;
        openOrders: z.ZodNumber;
        lastOrder: z.ZodNullable<z.ZodString>;
        lifetime: z.ZodNumber;
        since: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type CustomerListResponse = z.infer<typeof CustomerListResponseSchema>;
declare const CustomerOrderRowSchema: z.ZodObject<{
    tradeId: z.ZodNumber;
    reference: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    qty: z.ZodNullable<z.ZodNumber>;
    productText: z.ZodString;
    state: z.ZodString;
    collected: z.ZodBoolean;
    branchCode: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const InvoiceCollectedSchema: z.ZodNullable<z.ZodEnum<{
    YES: "YES";
    NO: "NO";
    PARTIAL: "PARTIAL";
}>>;
declare const CustomerInvoiceRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    number: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    total: z.ZodNullable<z.ZodNumber>;
    status: z.ZodNullable<z.ZodString>;
    collected: z.ZodNullable<z.ZodEnum<{
        YES: "YES";
        NO: "NO";
        PARTIAL: "PARTIAL";
    }>>;
}, z.core.$strip>;
declare const PaymentRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    date: z.ZodNullable<z.ZodString>;
    amount: z.ZodNullable<z.ZodNumber>;
    mode: z.ZodNullable<z.ZodString>;
    invoiceNumber: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const QuoteRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    reference: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    qty: z.ZodNullable<z.ZodNumber>;
    productText: z.ZodString;
    status: z.ZodString;
}, z.core.$strip>;
declare const CustomerProfileSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    status: z.ZodNullable<z.ZodString>;
    currency: z.ZodNullable<z.ZodString>;
    zohoNumber: z.ZodNullable<z.ZodString>;
    since: z.ZodNullable<z.ZodString>;
    lastOrder: z.ZodNullable<z.ZodString>;
    openOrders: z.ZodNumber;
    lifetime: z.ZodNumber;
    orders: z.ZodArray<z.ZodObject<{
        tradeId: z.ZodNumber;
        reference: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
        productText: z.ZodString;
        state: z.ZodString;
        collected: z.ZodBoolean;
        branchCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    invoices: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        number: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        total: z.ZodNullable<z.ZodNumber>;
        status: z.ZodNullable<z.ZodString>;
        collected: z.ZodNullable<z.ZodEnum<{
            YES: "YES";
            NO: "NO";
            PARTIAL: "PARTIAL";
        }>>;
    }, z.core.$strip>>;
    payments: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        date: z.ZodNullable<z.ZodString>;
        amount: z.ZodNullable<z.ZodNumber>;
        mode: z.ZodNullable<z.ZodString>;
        invoiceNumber: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    quotes: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        reference: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
        productText: z.ZodString;
        status: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type CustomerProfile = z.infer<typeof CustomerProfileSchema>;
declare const InvoiceListRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    number: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    customerId: z.ZodNullable<z.ZodNumber>;
    customerName: z.ZodNullable<z.ZodString>;
    total: z.ZodNullable<z.ZodNumber>;
    status: z.ZodNullable<z.ZodString>;
    lineCount: z.ZodNullable<z.ZodNumber>;
    collected: z.ZodNullable<z.ZodEnum<{
        YES: "YES";
        NO: "NO";
        PARTIAL: "PARTIAL";
    }>>;
}, z.core.$strip>;
type InvoiceListRow = z.infer<typeof InvoiceListRowSchema>;
declare const InvoiceListResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        number: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        customerId: z.ZodNullable<z.ZodNumber>;
        customerName: z.ZodNullable<z.ZodString>;
        total: z.ZodNullable<z.ZodNumber>;
        status: z.ZodNullable<z.ZodString>;
        lineCount: z.ZodNullable<z.ZodNumber>;
        collected: z.ZodNullable<z.ZodEnum<{
            YES: "YES";
            NO: "NO";
            PARTIAL: "PARTIAL";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type InvoiceListResponse = z.infer<typeof InvoiceListResponseSchema>;
declare const InvoiceLineRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    product: z.ZodString;
    refinery: z.ZodNullable<z.ZodString>;
    qty: z.ZodNullable<z.ZodNumber>;
    unitPrice: z.ZodNullable<z.ZodNumber>;
    lineTotal: z.ZodNullable<z.ZodNumber>;
    serials: z.ZodArray<z.ZodString>;
    collectedFlag: z.ZodNullable<z.ZodEnum<{
        YES: "YES";
        NO: "NO";
        CHECK: "CHECK";
    }>>;
    collectedDate: z.ZodNullable<z.ZodString>;
    deliveredBrinks: z.ZodNullable<z.ZodBoolean>;
    soldBack: z.ZodNullable<z.ZodBoolean>;
}, z.core.$strip>;
declare const InvoiceLinkRowSchema: z.ZodObject<{
    linkType: z.ZodString;
    confidence: z.ZodEnum<{
        EXACT: "EXACT";
        PROBABLE: "PROBABLE";
    }>;
    status: z.ZodEnum<{
        CONFIRMED: "CONFIRMED";
        REJECTED: "REJECTED";
        PENDING: "PENDING";
    }>;
    trade: z.ZodString;
}, z.core.$strip>;
declare const InvoiceDetailSchema: z.ZodObject<{
    id: z.ZodNumber;
    number: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    status: z.ZodNullable<z.ZodString>;
    total: z.ZodNullable<z.ZodNumber>;
    customerId: z.ZodNullable<z.ZodNumber>;
    customerName: z.ZodNullable<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        product: z.ZodString;
        refinery: z.ZodNullable<z.ZodString>;
        qty: z.ZodNullable<z.ZodNumber>;
        unitPrice: z.ZodNullable<z.ZodNumber>;
        lineTotal: z.ZodNullable<z.ZodNumber>;
        serials: z.ZodArray<z.ZodString>;
        collectedFlag: z.ZodNullable<z.ZodEnum<{
            YES: "YES";
            NO: "NO";
            CHECK: "CHECK";
        }>>;
        collectedDate: z.ZodNullable<z.ZodString>;
        deliveredBrinks: z.ZodNullable<z.ZodBoolean>;
        soldBack: z.ZodNullable<z.ZodBoolean>;
    }, z.core.$strip>>;
    payments: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        date: z.ZodNullable<z.ZodString>;
        amount: z.ZodNullable<z.ZodNumber>;
        mode: z.ZodNullable<z.ZodString>;
        invoiceNumber: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    links: z.ZodArray<z.ZodObject<{
        linkType: z.ZodString;
        confidence: z.ZodEnum<{
            EXACT: "EXACT";
            PROBABLE: "PROBABLE";
        }>;
        status: z.ZodEnum<{
            CONFIRMED: "CONFIRMED";
            REJECTED: "REJECTED";
            PENDING: "PENDING";
        }>;
        trade: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type InvoiceDetail = z.infer<typeof InvoiceDetailSchema>;

/**
 * Stock position from the stocktake models: bars by serial and coins by quantity, taken from one stocktake (the newest
 * unless another is asked for). An imported stocktake is a sheet loaded from the import workbook, not a count done in
 * Goldilocks, and is labelled so. A bar counts as held for a customer when an open customer order names its serial.
 * Free-to-sell figures are not here: they need every product name tied to a sales product first.
 */
declare const StockMetalSchema: z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PGM: "PGM";
}>;
declare const InventoryStocktakeRefSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    countDate: z.ZodString;
    status: z.ZodString;
    imported: z.ZodBoolean;
}, z.core.$strip>;
type InventoryStocktakeRef = z.infer<typeof InventoryStocktakeRefSchema>;
declare const InventoryPositionSchema: z.ZodObject<{
    stocktake: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        countDate: z.ZodString;
        status: z.ZodString;
        imported: z.ZodBoolean;
    }, z.core.$strip>>;
    available: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        countDate: z.ZodString;
        status: z.ZodString;
        imported: z.ZodBoolean;
    }, z.core.$strip>>;
    bars: z.ZodObject<{
        total: z.ZodNumber;
        byMetal: z.ZodRecord<z.ZodString, z.ZodNumber>;
        heldForCustomers: z.ZodNumber;
        gone: z.ZodNumber;
    }, z.core.$strip>;
    coins: z.ZodObject<{
        lines: z.ZodNumber;
        pieces: z.ZodNumber;
        byMetal: z.ZodRecord<z.ZodString, z.ZodNumber>;
        uncounted: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
type InventoryPosition = z.infer<typeof InventoryPositionSchema>;
declare const InventoryBarsQuerySchema: z.ZodObject<{
    stocktakeId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    metal: z.ZodOptional<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
    branch: z.ZodOptional<z.ZodString>;
    where: z.ZodOptional<z.ZodEnum<{
        held: "held";
        free: "free";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type InventoryBarsQuery = z.infer<typeof InventoryBarsQuerySchema>;
declare const InventoryBarRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    serial: z.ZodNullable<z.ZodString>;
    refinery: z.ZodNullable<z.ZodString>;
    weightLabel: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: z.ZodString;
    status: z.ZodString;
    details: z.ZodNullable<z.ZodString>;
    heldFor: z.ZodNullable<z.ZodObject<{
        orderId: z.ZodNumber;
        reference: z.ZodNullable<z.ZodString>;
        client: z.ZodString;
        status: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type InventoryBarRow = z.infer<typeof InventoryBarRowSchema>;
declare const InventoryBarsResponseSchema: z.ZodObject<{
    total: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        serial: z.ZodNullable<z.ZodString>;
        refinery: z.ZodNullable<z.ZodString>;
        weightLabel: z.ZodString;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        locationCode: z.ZodString;
        status: z.ZodString;
        details: z.ZodNullable<z.ZodString>;
        heldFor: z.ZodNullable<z.ZodObject<{
            orderId: z.ZodNumber;
            reference: z.ZodNullable<z.ZodString>;
            client: z.ZodString;
            status: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type InventoryBarsResponse = z.infer<typeof InventoryBarsResponseSchema>;
declare const InventoryCoinsQuerySchema: z.ZodObject<{
    stocktakeId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    metal: z.ZodOptional<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
    branch: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type InventoryCoinsQuery = z.infer<typeof InventoryCoinsQuerySchema>;
declare const InventoryCoinRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    item: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: z.ZodString;
    previousQty: z.ZodNullable<z.ZodNumber>;
    countedQty: z.ZodNullable<z.ZodNumber>;
    details: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type InventoryCoinRow = z.infer<typeof InventoryCoinRowSchema>;
declare const InventoryCoinsResponseSchema: z.ZodObject<{
    rows: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        item: z.ZodString;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        locationCode: z.ZodString;
        previousQty: z.ZodNullable<z.ZodNumber>;
        countedQty: z.ZodNullable<z.ZodNumber>;
        details: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type InventoryCoinsResponse = z.infer<typeof InventoryCoinsResponseSchema>;

/**
 * Pure helpers for the live stock board: reading the names the stock sheet uses into a family and a variant, folding
 * serials and refineries, and planning the baseline load. No database, no clock.
 */
type LiveMetal = 'GOLD' | 'SILVER' | 'PGM';
type LiveKind = 'COIN' | 'BAR';
interface ParsedWeight {
    /** Canonical label: "1oz", "1/10oz", "100g", "1kg". */
    label: string;
    /** Grams, for ordering. */
    grams: number;
}
/** The first weight in a text ("1/10oz Maple", "100g Bar", "10z Kookaburra" is read as 1oz), or null. */
declare function parseWeight(text: string): (ParsedWeight & {
    index: number;
    length: number;
}) | null;
interface ParsedCoin {
    family: string;
    /** Weight plus whatever else tells the variants apart: "1oz", "1oz 22K", "Half Proof". */
    variant: string;
    grams: number | null;
}
/** Reads "1oz Krugerrand", "2013 1oz Britannia - Old Design", "Half Sovereign Proof" into a family and a variant. */
declare function parseCoinName(text: string): ParsedCoin;
interface ParsedBarWeight {
    /** "100g", "1oz", "1kg". The line's variant. */
    variant: string;
    grams: number | null;
}
/** "100g Bar", "1oz bar", "1KG Bar", "10z Bar". Anything without a weight keeps its own text. */
declare function parseBarWeight(text: string): ParsedBarWeight;
/** Serial folded for comparing: upper case, letters and digits only. */
declare function liveSerialKey(serial: string): string;
/** A refinery as the board stores it: the canonical name when listed, else tidied upper case; "" for none. */
declare function liveRefinery(text: string | null | undefined): {
    value: string;
    listed: boolean;
};
/** Tab order: Dublin is the main branch. */
declare const LIVE_BRANCH_CODES: readonly ["DU", "BL", "CO", "BC"];
/** What each stock location is called. BL is Blanchardstown, not Belfast. */
declare const LIVE_BRANCH_NAMES: Record<string, string>;
/** Sort branch codes into tab order; unknown codes go last, alphabetically. */
declare function sortBranchCodes<T extends {
    code: string;
}>(branches: T[]): T[];
/** Compare variants by size, then name. Unweighted variants sort last. */
declare function variantGrams(variant: string): number;
interface BaselineBarRow {
    metal: LiveMetal;
    /** 1-based row in the sheet, for messages. */
    row: number;
    branch: string;
    weight: string;
    refinery: string | null;
    serial: string | null;
    grams: number | null;
    details: string | null;
    sold: boolean;
}
interface BaselineCoinRow {
    metal: LiveMetal;
    row: number;
    item: string;
    /** Count per branch code as written in the sheet. */
    counts: Record<string, number | null>;
    details: Record<string, string | null>;
}
interface BaselineLine {
    branchCode: string;
    metal: LiveMetal;
    kind: LiveKind;
    family: string;
    variant: string;
    refinery: string;
    qty: number;
    details: string | null;
}
interface BaselineBar {
    branchCode: string;
    metal: LiveMetal;
    family: string;
    variant: string;
    refinery: string;
    serial: string;
    serialKey: string;
    grams: number | null;
    details: string | null;
}
interface BaselineFix {
    row: number;
    field: 'refinery' | 'weight' | 'item';
    from: string;
    to: string;
}
interface BaselineIssue {
    row: number;
    message: string;
}
interface BaselinePlan {
    lines: BaselineLine[];
    bars: BaselineBar[];
    /** Spellings changed on the way in, shown in the preview so a person can see them. */
    fixes: BaselineFix[];
    /** Rows not loaded, with the reason. */
    issues: BaselineIssue[];
    /** Same serial on two bars in the file: neither loads. */
    clashes: {
        serialKey: string;
        rows: number[];
    }[];
    skippedSold: number;
    unlistedRefineries: string[];
}
/**
 * Turns the stock sheet's rows into lines and serialled bars. Sold-flagged bars are not loaded. A bar with no branch
 * is reported, never guessed. A serial found twice goes to `clashes` and neither copy loads.
 */
declare function planBaseline(input: {
    bars: BaselineBarRow[];
    coins: BaselineCoinRow[];
}): BaselinePlan;

/** Live stock board (roadmap 1.12b): current counts per branch that staff edit, backed by append-only movements. */
declare const LiveMetalSchema: z.ZodEnum<{
    GOLD: "GOLD";
    SILVER: "SILVER";
    PGM: "PGM";
}>;
declare const LiveKindSchema: z.ZodEnum<{
    BAR: "BAR";
    COIN: "COIN";
}>;
declare const LiveBarStatusSchema: z.ZodEnum<{
    IN_STOCK: "IN_STOCK";
    SOLD: "SOLD";
    REMOVED: "REMOVED";
}>;
declare const LiveMovementSourceSchema: z.ZodEnum<{
    MANUAL: "MANUAL";
    IMPORT: "IMPORT";
    SHEET_SALE: "SHEET_SALE";
    SHEET_PURCHASE: "SHEET_PURCHASE";
    TRANSFER: "TRANSFER";
    UNDO: "UNDO";
}>;
declare const LiveStockBarSchema: z.ZodObject<{
    id: z.ZodNumber;
    serial: z.ZodString;
    grams: z.ZodNullable<z.ZodNumber>;
    details: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        IN_STOCK: "IN_STOCK";
        SOLD: "SOLD";
        REMOVED: "REMOVED";
    }>;
}, z.core.$strip>;
type LiveStockBar = z.infer<typeof LiveStockBarSchema>;
declare const LiveStockLineSchema: z.ZodObject<{
    id: z.ZodNumber;
    branchCode: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    kind: z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>;
    family: z.ZodString;
    variant: z.ZodString;
    refinery: z.ZodString;
    qty: z.ZodNumber;
    lowThreshold: z.ZodNullable<z.ZodNumber>;
    unassigned: z.ZodNumber;
    details: z.ZodNullable<z.ZodString>;
    bars: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        serial: z.ZodString;
        grams: z.ZodNullable<z.ZodNumber>;
        details: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            IN_STOCK: "IN_STOCK";
            SOLD: "SOLD";
            REMOVED: "REMOVED";
        }>;
    }, z.core.$strip>>;
    updatedAt: z.ZodString;
}, z.core.$strip>;
type LiveStockLine = z.infer<typeof LiveStockLineSchema>;
declare const LiveStockBranchSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    branchId: z.ZodNullable<z.ZodNumber>;
    cutoverDate: z.ZodNullable<z.ZodString>;
    canEdit: z.ZodBoolean;
}, z.core.$strip>;
type LiveStockBranch = z.infer<typeof LiveStockBranchSchema>;
declare const LiveStockBoardSchema: z.ZodObject<{
    branch: z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        branchId: z.ZodNullable<z.ZodNumber>;
        cutoverDate: z.ZodNullable<z.ZodString>;
        canEdit: z.ZodBoolean;
    }, z.core.$strip>;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    lines: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        branchCode: z.ZodString;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        kind: z.ZodEnum<{
            BAR: "BAR";
            COIN: "COIN";
        }>;
        family: z.ZodString;
        variant: z.ZodString;
        refinery: z.ZodString;
        qty: z.ZodNumber;
        lowThreshold: z.ZodNullable<z.ZodNumber>;
        unassigned: z.ZodNumber;
        details: z.ZodNullable<z.ZodString>;
        bars: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            serial: z.ZodString;
            grams: z.ZodNullable<z.ZodNumber>;
            details: z.ZodNullable<z.ZodString>;
            status: z.ZodEnum<{
                IN_STOCK: "IN_STOCK";
                SOLD: "SOLD";
                REMOVED: "REMOVED";
            }>;
        }, z.core.$strip>>;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type LiveStockBoard = z.infer<typeof LiveStockBoardSchema>;
declare const LiveStockBranchesResponseSchema: z.ZodObject<{
    branches: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        branchId: z.ZodNullable<z.ZodNumber>;
        cutoverDate: z.ZodNullable<z.ZodString>;
        canEdit: z.ZodBoolean;
    }, z.core.$strip>>;
    mine: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type LiveStockBranchesResponse = z.infer<typeof LiveStockBranchesResponseSchema>;
declare const LiveStockMovementSchema: z.ZodObject<{
    id: z.ZodNumber;
    lineId: z.ZodNumber;
    delta: z.ZodNumber;
    qtyAfter: z.ZodNumber;
    source: z.ZodEnum<{
        MANUAL: "MANUAL";
        IMPORT: "IMPORT";
        SHEET_SALE: "SHEET_SALE";
        SHEET_PURCHASE: "SHEET_PURCHASE";
        TRANSFER: "TRANSFER";
        UNDO: "UNDO";
    }>;
    reference: z.ZodNullable<z.ZodString>;
    reason: z.ZodNullable<z.ZodString>;
    note: z.ZodNullable<z.ZodString>;
    actor: z.ZodString;
    at: z.ZodString;
    reversesId: z.ZodNullable<z.ZodNumber>;
    undone: z.ZodBoolean;
}, z.core.$strip>;
type LiveStockMovement = z.infer<typeof LiveStockMovementSchema>;
/** Change a count by a step (`delta`) or to a typed value (`qty`). Exactly one of the two. */
declare const AdjustLiveStockRequestSchema: z.ZodObject<{
    delta: z.ZodOptional<z.ZodNumber>;
    qty: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type AdjustLiveStockRequest = z.infer<typeof AdjustLiveStockRequestSchema>;
declare const CreateLiveStockLineRequestSchema: z.ZodObject<{
    branchCode: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    kind: z.ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>;
    family: z.ZodString;
    variant: z.ZodString;
    refinery: z.ZodDefault<z.ZodString>;
    qty: z.ZodDefault<z.ZodNumber>;
    reason: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type CreateLiveStockLineRequest = z.infer<typeof CreateLiveStockLineRequestSchema>;
declare const AddLiveStockBarRequestSchema: z.ZodObject<{
    serial: z.ZodString;
    grams: z.ZodOptional<z.ZodNumber>;
    details: z.ZodOptional<z.ZodString>;
    reason: z.ZodString;
}, z.core.$strip>;
type AddLiveStockBarRequest = z.infer<typeof AddLiveStockBarRequestSchema>;
declare const SetLiveStockBarStatusRequestSchema: z.ZodObject<{
    status: z.ZodEnum<{
        IN_STOCK: "IN_STOCK";
        SOLD: "SOLD";
        REMOVED: "REMOVED";
    }>;
    reason: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type SetLiveStockBarStatusRequest = z.infer<typeof SetLiveStockBarStatusRequestSchema>;
declare const TransferLiveStockRequestSchema: z.ZodObject<{
    toBranchCode: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    qty: z.ZodNumber;
    barIds: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
    reason: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type TransferLiveStockRequest = z.infer<typeof TransferLiveStockRequestSchema>;
declare const LowThresholdRequestSchema: z.ZodObject<{
    lowThreshold: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type LowThresholdRequest = z.infer<typeof LowThresholdRequestSchema>;
declare const LinkLiveStockBranchRequestSchema: z.ZodObject<{
    branchId: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type LinkLiveStockBranchRequest = z.infer<typeof LinkLiveStockBranchRequestSchema>;
declare const BaselineBarRowSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    row: z.ZodNumber;
    branch: z.ZodString;
    weight: z.ZodString;
    refinery: z.ZodNullable<z.ZodString>;
    serial: z.ZodNullable<z.ZodString>;
    grams: z.ZodNullable<z.ZodNumber>;
    details: z.ZodNullable<z.ZodString>;
    sold: z.ZodBoolean;
}, z.core.$strip>;
declare const BaselineCoinRowSchema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    row: z.ZodNumber;
    item: z.ZodString;
    counts: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodNumber>>;
    details: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** The stock sheet as the browser read it. The server plans and (on commit) writes; it never opens the file. */
declare const LiveBaselineRequestSchema: z.ZodObject<{
    bars: z.ZodArray<z.ZodObject<{
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        row: z.ZodNumber;
        branch: z.ZodString;
        weight: z.ZodString;
        refinery: z.ZodNullable<z.ZodString>;
        serial: z.ZodNullable<z.ZodString>;
        grams: z.ZodNullable<z.ZodNumber>;
        details: z.ZodNullable<z.ZodString>;
        sold: z.ZodBoolean;
    }, z.core.$strip>>;
    coins: z.ZodArray<z.ZodObject<{
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        row: z.ZodNumber;
        item: z.ZodString;
        counts: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodNumber>>;
        details: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    cutoverDate: z.ZodISODate;
    branchCodes: z.ZodDefault<z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>;
}, z.core.$strip>;
type LiveBaselineRequest = z.infer<typeof LiveBaselineRequestSchema>;
declare const LiveBaselinePreviewSchema: z.ZodObject<{
    lines: z.ZodNumber;
    linesToCreate: z.ZodNumber;
    linesToChange: z.ZodNumber;
    units: z.ZodNumber;
    bars: z.ZodNumber;
    barsToCreate: z.ZodNumber;
    skippedSold: z.ZodNumber;
    fixes: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        field: z.ZodString;
        from: z.ZodString;
        to: z.ZodString;
    }, z.core.$strip>>;
    issues: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>;
    clashes: z.ZodArray<z.ZodObject<{
        serialKey: z.ZodString;
        rows: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>>;
    unlistedRefineries: z.ZodArray<z.ZodString>;
    byBranch: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
type LiveBaselinePreview = z.infer<typeof LiveBaselinePreviewSchema>;
declare const LiveBaselineResultSchema: z.ZodObject<{
    lines: z.ZodNumber;
    linesToCreate: z.ZodNumber;
    linesToChange: z.ZodNumber;
    units: z.ZodNumber;
    bars: z.ZodNumber;
    barsToCreate: z.ZodNumber;
    skippedSold: z.ZodNumber;
    fixes: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        field: z.ZodString;
        from: z.ZodString;
        to: z.ZodString;
    }, z.core.$strip>>;
    issues: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>>;
    clashes: z.ZodArray<z.ZodObject<{
        serialKey: z.ZodString;
        rows: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>>;
    unlistedRefineries: z.ZodArray<z.ZodString>;
    byBranch: z.ZodRecord<z.ZodString, z.ZodNumber>;
    applied: z.ZodLiteral<true>;
}, z.core.$strip>;
type LiveBaselineResult = z.infer<typeof LiveBaselineResultSchema>;
declare const LiveStockBoardQuerySchema: z.ZodObject<{
    branch: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    metal: z.ZodDefault<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>;
}, z.core.$strip>;
type LiveStockBoardQuery = z.infer<typeof LiveStockBoardQuerySchema>;
declare const SheetKindSchema: z.ZodEnum<{
    SALE: "SALE";
    PURCHASE: "PURCHASE";
}>;
declare const SheetLineOptionSchema: z.ZodObject<{
    lineId: z.ZodNumber;
    label: z.ZodString;
    qty: z.ZodNumber;
}, z.core.$strip>;
/** What one tradesheet row would do, or is waiting on. */
declare const SheetApplyItemSchema: z.ZodObject<{
    key: z.ZodString;
    applicationId: z.ZodNullable<z.ZodNumber>;
    kind: z.ZodEnum<{
        SALE: "SALE";
        PURCHASE: "PURCHASE";
    }>;
    reference: z.ZodString;
    branchCode: z.ZodString;
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    productText: z.ZodString;
    date: z.ZodNullable<z.ZodString>;
    delta: z.ZodNumber;
    line: z.ZodNullable<z.ZodObject<{
        lineId: z.ZodNumber;
        label: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
    outcome: z.ZodEnum<{
        CREATE: "CREATE";
        APPLY: "APPLY";
        ASK_COUNTED: "ASK_COUNTED";
        PICK_LINE: "PICK_LINE";
        UNMATCHED: "UNMATCHED";
        WITHDRAWN: "WITHDRAWN";
        NEGATIVE: "NEGATIVE";
    }>;
    message: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        lineId: z.ZodNumber;
        label: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
type SheetApplyItem = z.infer<typeof SheetApplyItemSchema>;
declare const SheetApplyPreviewSchema: z.ZodObject<{
    cutovers: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>;
    willApply: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        applicationId: z.ZodNullable<z.ZodNumber>;
        kind: z.ZodEnum<{
            SALE: "SALE";
            PURCHASE: "PURCHASE";
        }>;
        reference: z.ZodString;
        branchCode: z.ZodString;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        productText: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        delta: z.ZodNumber;
        line: z.ZodNullable<z.ZodObject<{
            lineId: z.ZodNumber;
            label: z.ZodString;
            qty: z.ZodNumber;
        }, z.core.$strip>>;
        outcome: z.ZodEnum<{
            CREATE: "CREATE";
            APPLY: "APPLY";
            ASK_COUNTED: "ASK_COUNTED";
            PICK_LINE: "PICK_LINE";
            UNMATCHED: "UNMATCHED";
            WITHDRAWN: "WITHDRAWN";
            NEGATIVE: "NEGATIVE";
        }>;
        message: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            lineId: z.ZodNumber;
            label: z.ZodString;
            qty: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    needsDecision: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        applicationId: z.ZodNullable<z.ZodNumber>;
        kind: z.ZodEnum<{
            SALE: "SALE";
            PURCHASE: "PURCHASE";
        }>;
        reference: z.ZodString;
        branchCode: z.ZodString;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        productText: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        delta: z.ZodNumber;
        line: z.ZodNullable<z.ZodObject<{
            lineId: z.ZodNumber;
            label: z.ZodString;
            qty: z.ZodNumber;
        }, z.core.$strip>>;
        outcome: z.ZodEnum<{
            CREATE: "CREATE";
            APPLY: "APPLY";
            ASK_COUNTED: "ASK_COUNTED";
            PICK_LINE: "PICK_LINE";
            UNMATCHED: "UNMATCHED";
            WITHDRAWN: "WITHDRAWN";
            NEGATIVE: "NEGATIVE";
        }>;
        message: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            lineId: z.ZodNumber;
            label: z.ZodString;
            qty: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    pending: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        applicationId: z.ZodNullable<z.ZodNumber>;
        kind: z.ZodEnum<{
            SALE: "SALE";
            PURCHASE: "PURCHASE";
        }>;
        reference: z.ZodString;
        branchCode: z.ZodString;
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        productText: z.ZodString;
        date: z.ZodNullable<z.ZodString>;
        delta: z.ZodNumber;
        line: z.ZodNullable<z.ZodObject<{
            lineId: z.ZodNumber;
            label: z.ZodString;
            qty: z.ZodNumber;
        }, z.core.$strip>>;
        outcome: z.ZodEnum<{
            CREATE: "CREATE";
            APPLY: "APPLY";
            ASK_COUNTED: "ASK_COUNTED";
            PICK_LINE: "PICK_LINE";
            UNMATCHED: "UNMATCHED";
            WITHDRAWN: "WITHDRAWN";
            NEGATIVE: "NEGATIVE";
        }>;
        message: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            lineId: z.ZodNumber;
            label: z.ZodString;
            qty: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    skipped: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
type SheetApplyPreview = z.infer<typeof SheetApplyPreviewSchema>;
declare const SheetApplyResultSchema: z.ZodObject<{
    applied: z.ZodNumber;
    units: z.ZodNumber;
    waiting: z.ZodNumber;
    failed: z.ZodArray<z.ZodObject<{
        reference: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>;
    skipped: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
type SheetApplyResult = z.infer<typeof SheetApplyResultSchema>;
declare const ResolveSheetApplicationRequestSchema: z.ZodObject<{
    choice: z.ZodEnum<{
        APPLY: "APPLY";
        COUNTED: "COUNTED";
        LINE: "LINE";
        REVERSE: "REVERSE";
        KEEP: "KEEP";
        DISMISS: "DISMISS";
    }>;
    lineId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type ResolveSheetApplicationRequest = z.infer<typeof ResolveSheetApplicationRequestSchema>;

/**
 * Which live-stock lines a priced product draws on, so the dashboard can show "in stock / low / out" next to its price.
 * Live stock is kept per sheet line (metal, bar weight or coin family + weight), not per product, so this reads the
 * product's name. Only gold and silver are counted (platinum and palladium sit together in one PGM sheet); bonded
 * products, CombiBars and coins with no recognisable family or weight get no key, so no flag rather than a wrong one.
 */
type ProductStockKey = {
    metal: 'GOLD' | 'SILVER';
    kind: 'BAR';
    variant: string;
    pampOnly: boolean;
} | {
    metal: 'GOLD' | 'SILVER';
    kind: 'COIN';
    family: string | null;
    variant: string;
};
declare function productStockKey(product: {
    name: string;
    metalType: string;
}): ProductStockKey | null;
interface StockLineForMatch {
    metal: string;
    kind: string;
    family: string;
    variant: string;
    refinery: string;
}
declare function lineMatchesKey(line: StockLineForMatch, key: ProductStockKey): boolean;
declare const StockLevelStateSchema: z.ZodEnum<{
    IN: "IN";
    LOW: "LOW";
    OUT: "OUT";
}>;
type StockLevelState = z.infer<typeof StockLevelStateSchema>;
declare const ProductStockLevelSchema: z.ZodObject<{
    productId: z.ZodNumber;
    total: z.ZodNumber;
    state: z.ZodEnum<{
        IN: "IN";
        LOW: "LOW";
        OUT: "OUT";
    }>;
    branches: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ProductStockLevel = z.infer<typeof ProductStockLevelSchema>;
declare const ProductStockLevelsResponseSchema: z.ZodArray<z.ZodObject<{
    productId: z.ZodNumber;
    total: z.ZodNumber;
    state: z.ZodEnum<{
        IN: "IN";
        LOW: "LOW";
        OUT: "OUT";
    }>;
    branches: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>>;
/**
 * Totals per product across every stock location. LOW when the total is at or under the summed low-stock thresholds
 * of its lines (only when at least one threshold is set); OUT at zero. Products with no key are left out.
 */
declare function productStockLevels(products: {
    id: number;
    name: string;
    metalType: string;
}[], lines: (StockLineForMatch & {
    qty: number;
    lowThreshold: number | null;
    branchCode: string;
    branchName: string;
})[]): ProductStockLevel[];

/**
 * Deciding what one tradesheet row does to live stock. Pure: the service gathers the rows, the stock lines and the
 * earlier applications, and acts on what this returns. Every rule that keeps a sale from being counted twice is here.
 *
 * A sale takes stock out, a purchase puts it in. The row's `date` has no time of day, so "this edit came before that
 * sale" can only be told apart by the day: an edit on or after the sale's day might already include it, and then a
 * person is asked rather than the system guessing.
 */
type SheetKind = 'SALE' | 'PURCHASE';
interface ApplyRow {
    kind: SheetKind;
    referenceKey: string;
    occurrence: number;
    branchCode: string | null;
    metal: LiveMetal;
    productText: string;
    qty: number | null;
    /** YYYY-MM-DD, or null when the sheet has no date. */
    date: string | null;
    /** False for a quote, deferred, repeated or flagged row, or one the importer no longer finds. */
    eligible: boolean;
}
/** A stock line the row could land on, as the service read it. */
interface LineCandidate {
    lineId: number;
    kind: LiveKind;
    family: string;
    variant: string;
    refinery: string;
    qty: number;
    /** The day of the newest manual count change on this line that was not undone; null when none since cut-over. */
    lastManualOn: string | null;
}
type ApplicationStatus = 'APPLIED' | 'NEEDS_DECISION' | 'DISMISSED';
interface PriorApplication {
    id: number;
    status: ApplicationStatus;
    /** Signed: negative for a sale, positive for a purchase. What has been taken from or put into stock so far. */
    appliedQty: number;
    lineId: number | null;
    reason: string | null;
}
type SkipReason = 'CUTOVER' | 'NO_DATE' | 'NO_BRANCH' | 'NO_QTY' | 'INELIGIBLE' | 'DISMISSED' | 'UNCHANGED' | 'PENDING';
type RowPlan = {
    type: 'SKIP';
    reason: SkipReason;
}
/** Change the line by `delta` and record it. `create` is set when no line exists yet (a purchase). */
 | {
    type: 'APPLY';
    delta: number;
    lineId: number;
    create?: undefined;
} | {
    type: 'CREATE_AND_APPLY';
    delta: number;
    create: NewLine;
}
/** A manual edit on or after the sale's day may already include it. Ask. */
 | {
    type: 'ASK_COUNTED';
    delta: number;
    lineId: number;
}
/** More than one line fits (bars from several refineries). Ask which. */
 | {
    type: 'PICK_LINE';
    delta: number;
    lineIds: number[];
}
/** No line fits, or none has stock to take from. */
 | {
    type: 'UNMATCHED';
    delta: number;
    message: string;
}
/** Applied earlier, but the row is now a quote, deferred, repeated or gone. A person decides. */
 | {
    type: 'WITHDRAWN';
    appliedQty: number;
    lineId: number | null;
};
interface NewLine {
    kind: LiveKind;
    family: string;
    variant: string;
    refinery: string;
}
interface PlanContext {
    /** Sheet rows dated on or before this day are already in the baseline. Null: that branch has no baseline yet. */
    cutoverDate: string | null;
    candidates: LineCandidate[];
}
/** What the product text is: a bar of some weight, or a coin family and variant. Null when it cannot be read. */
declare function readProduct(text: string): {
    kind: 'BAR';
    variant: string;
} | {
    kind: 'COIN';
    family: string;
    variant: string;
    weight: string | null;
} | null;
/** The lines a row's product could mean: the exact variant first, then variants that start with the same weight. */
declare function matchLines(product: NonNullable<ReturnType<typeof readProduct>>, lines: LineCandidate[]): LineCandidate[];
declare function planRow(row: ApplyRow, prior: PriorApplication | null, ctx: PlanContext): RowPlan;

/**
 * Small helpers for product names that settle themselves: the metal a name was seen under, and the Business Central
 * item number a Zoho SKU stands for.
 */

/**
 * The metal a name was seen under: what its own text says (as the matching engine reads it), else the one metal
 * named by its sources (a tab such as "tradesheet:silver"). Null when neither says, or they say two. Alias texts
 * lose "gold" when they are cleaned, so this is the only place a name keeps its metal; a rule decision is only
 * valid for rows of that metal (see `ProductDecision.metalHint`).
 */
declare function deriveMetalHint(text: string | null | undefined, sources: string | readonly string[] | null | undefined, refinery?: string | null): MatchMetal | null;
/**
 * The BC item number inside a Zoho SKU: "1103", "1103-HISTORIC" and "2705.0" all give the number. Null when the SKU
 * is not (or does not start with) a plain four-digit item number.
 */
declare function bcItemNoFromSku(sku: string | null | undefined): string | null;

/**
 * Business Central history: posted sales shipments (+ lines), posted purchase receipts and item ledger entries. With
 * the item tracking entries the workbook already imports, they give each serial its receipt (who we bought it from)
 * and its shipment (who collected it). Names are turned into redaction codes in the browser; the API never sees them.
 */
declare const BC_HISTORY_KINDS: readonly ["shipments", "shipment_lines", "receipts", "ledger"];
type BcHistoryKind = (typeof BC_HISTORY_KINDS)[number];
declare const BcShipmentRowSchema: z.ZodObject<{
    no: z.ZodString;
    customerNo: z.ZodNullable<z.ZodString>;
    customerCode: z.ZodNullable<z.ZodString>;
    documentDate: z.ZodNullable<z.ZodString>;
    postingDate: z.ZodNullable<z.ZodString>;
    externalDocNo: z.ZodNullable<z.ZodString>;
    locationCode: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
type BcShipmentRow = z.infer<typeof BcShipmentRowSchema>;
declare const BcShipmentLineRowSchema: z.ZodObject<{
    documentNo: z.ZodString;
    lineNo: z.ZodNumber;
    customerNo: z.ZodNullable<z.ZodString>;
    itemNo: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    locationCode: z.ZodNullable<z.ZodString>;
    quantity: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
type BcShipmentLineRow = z.infer<typeof BcShipmentLineRowSchema>;
declare const BcReceiptRowSchema: z.ZodObject<{
    no: z.ZodString;
    vendorNo: z.ZodNullable<z.ZodString>;
    sellerCode: z.ZodNullable<z.ZodString>;
    documentDate: z.ZodNullable<z.ZodString>;
    locationCode: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
type BcReceiptRow = z.infer<typeof BcReceiptRowSchema>;
declare const BcLedgerRowSchema: z.ZodObject<{
    entryNo: z.ZodNumber;
    postingDate: z.ZodNullable<z.ZodString>;
    entryType: z.ZodString;
    documentType: z.ZodNullable<z.ZodString>;
    documentNo: z.ZodString;
    itemNo: z.ZodString;
    locationCode: z.ZodNullable<z.ZodString>;
    quantity: z.ZodNumber;
    remainingQuantity: z.ZodNullable<z.ZodNumber>;
    salesAmount: z.ZodNullable<z.ZodNumber>;
    costAmount: z.ZodNullable<z.ZodNumber>;
    open: z.ZodNullable<z.ZodBoolean>;
    serialNo: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    sourceType: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    sourceNo: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
type BcLedgerRow = z.infer<typeof BcLedgerRowSchema>;
declare const BcHistoryRequestSchema: z.ZodObject<{
    fileNames: z.ZodArray<z.ZodString>;
    shipments: z.ZodDefault<z.ZodArray<z.ZodObject<{
        no: z.ZodString;
        customerNo: z.ZodNullable<z.ZodString>;
        customerCode: z.ZodNullable<z.ZodString>;
        documentDate: z.ZodNullable<z.ZodString>;
        postingDate: z.ZodNullable<z.ZodString>;
        externalDocNo: z.ZodNullable<z.ZodString>;
        locationCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>>;
    shipmentLines: z.ZodDefault<z.ZodArray<z.ZodObject<{
        documentNo: z.ZodString;
        lineNo: z.ZodNumber;
        customerNo: z.ZodNullable<z.ZodString>;
        itemNo: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        locationCode: z.ZodNullable<z.ZodString>;
        quantity: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strict>>>;
    receipts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        no: z.ZodString;
        vendorNo: z.ZodNullable<z.ZodString>;
        sellerCode: z.ZodNullable<z.ZodString>;
        documentDate: z.ZodNullable<z.ZodString>;
        locationCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>>;
    ledger: z.ZodDefault<z.ZodArray<z.ZodObject<{
        entryNo: z.ZodNumber;
        postingDate: z.ZodNullable<z.ZodString>;
        entryType: z.ZodString;
        documentType: z.ZodNullable<z.ZodString>;
        documentNo: z.ZodString;
        itemNo: z.ZodString;
        locationCode: z.ZodNullable<z.ZodString>;
        quantity: z.ZodNumber;
        remainingQuantity: z.ZodNullable<z.ZodNumber>;
        salesAmount: z.ZodNullable<z.ZodNumber>;
        costAmount: z.ZodNullable<z.ZodNumber>;
        open: z.ZodNullable<z.ZodBoolean>;
        serialNo: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        sourceType: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        sourceNo: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strip>;
type BcHistoryRequest = z.infer<typeof BcHistoryRequestSchema>;
declare const BcHistoryResultSchema: z.ZodObject<{
    batchId: z.ZodNumber;
    shipments: z.ZodObject<{
        added: z.ZodNumber;
        changed: z.ZodNumber;
        unchanged: z.ZodNumber;
    }, z.core.$strip>;
    shipmentLines: z.ZodObject<{
        added: z.ZodNumber;
        changed: z.ZodNumber;
        unchanged: z.ZodNumber;
    }, z.core.$strip>;
    receipts: z.ZodObject<{
        added: z.ZodNumber;
        changed: z.ZodNumber;
        unchanged: z.ZodNumber;
    }, z.core.$strip>;
    ledger: z.ZodObject<{
        added: z.ZodNumber;
        changed: z.ZodNumber;
        unchanged: z.ZodNumber;
    }, z.core.$strip>;
    customersLinked: z.ZodNumber;
    customerConflicts: z.ZodNumber;
    unknownCustomerCodes: z.ZodNumber;
    shipmentsToTrades: z.ZodNumber;
    shipmentsToZohoInvoices: z.ZodNumber;
    shippedNotCollected: z.ZodNumber;
    itemsAdded: z.ZodNumber;
    itemsUpdated: z.ZodNumber;
    eventsAdded: z.ZodNumber;
    eventsUpdated: z.ZodNumber;
    eventsUnchanged: z.ZodNumber;
    trackingWithoutLedger: z.ZodNumber;
    shipmentLinesLinked: z.ZodNumber;
    shipmentLinesSuggested: z.ZodNumber;
    shipmentLinesUnmatched: z.ZodNumber;
}, z.core.$strip>;
type BcHistoryResult = z.infer<typeof BcHistoryResultSchema>;
declare const ITEM_EVENT_KINDS: readonly ["RECEIVED", "OPENING_BALANCE", "ADJUSTED_IN", "ADJUSTED_OUT", "TRANSFERRED", "COLLECTED", "RETURNED_BY_CUSTOMER", "RETURNED_TO_VENDOR"];
type ItemEventKind = (typeof ITEM_EVENT_KINDS)[number];
declare const ITEM_STATUSES: readonly ["IN_STOCK", "COLLECTED", "GONE", "UNKNOWN"];
type ItemStatus = (typeof ITEM_STATUSES)[number];
/**
 * What a BC item ledger entry means for one bar. A posted sales shipment is the collection (the shipment is posted
 * when the customer collects). Opening balances carry the document number "OPEN…" in this tenant. Null for an entry
 * that says nothing about where a bar is.
 */
declare function bcEventKind(entryType: string, documentType: string | null, documentNo: string | null, quantity: number): ItemEventKind | null;
/** Where a bar is after an event. A transfer keeps it in stock (its location changes). */
declare function itemStatusAfter(kind: ItemEventKind): ItemStatus;
/** The form serials are matched in: upper case, letters and digits only (same as the import script's `nr_`). */
declare function serialKey(raw: unknown): string;
/**
 * A serial that names a real bar. BC holds placeholders typed when a bar had none ("NOBARNO12", "BRINKS TBC",
 * "TBC"); those, and keys without a digit or shorter than 3 characters, are not serials.
 */
declare function isRealSerial(raw: unknown): boolean;
/** A block copied from a BC list (Ctrl+C) is tab-separated, one row per line, header first. */
declare function parsePastedTable(textIn: string): string[][];
/** Which BC list a header row comes from. */
declare function detectBcHistoryKind(header: readonly unknown[]): BcHistoryKind | null;
type DateOrder = 'DMY' | 'MDY';
/**
 * Which way round the slash dates in a list are written. BC copies dates in the user's regional format, which differs
 * between machines (12/10/2026 is 12 October on one and 10 December on another), so the whole list decides: a first
 * part above 12 proves day-first, a second part above 12 proves month-first. Null when nothing in the list tells.
 */
declare function detectDateOrder(cells: readonly unknown[]): DateOrder | null;
/**
 * A BC date as YYYY-MM-DD. Accepts a Date, an Excel serial, ISO text, or slash text read in `order` (day-first when
 * not given: the Irish format). A value that only fits the other way round is read that way. Null when unreadable.
 */
declare function bcDate(raw: unknown, order?: DateOrder): string | null;
interface BcHistoryMapped {
    kind: BcHistoryKind | null;
    shipments: BcShipmentRow[];
    shipmentLines: BcShipmentLineRow[];
    receipts: BcReceiptRow[];
    ledger: BcLedgerRow[];
    /** Customer or private-seller names not in the redaction map (the row is kept with no code). */
    unmappedNames: number;
    /** Rows without their key column, left out. */
    skipped: number;
    /** How the list's slash dates were read (day-first unless the list proves otherwise). */
    dateOrder: DateOrder;
}
/**
 * Maps one BC list (header row first) to import rows. `names` is the redaction lookup (normalised name -> code);
 * names never leave the browser. Company vendors (non-PRV) are not looked up: they are suppliers, not customers.
 */
declare function mapBcHistory(sheet: readonly (readonly unknown[])[], names: ReadonlyMap<string, string>): BcHistoryMapped;
declare const ItemTraceEventSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        COLLECTED: "COLLECTED";
        RECEIVED: "RECEIVED";
        OPENING_BALANCE: "OPENING_BALANCE";
        ADJUSTED_IN: "ADJUSTED_IN";
        ADJUSTED_OUT: "ADJUSTED_OUT";
        TRANSFERRED: "TRANSFERRED";
        RETURNED_BY_CUSTOMER: "RETURNED_BY_CUSTOMER";
        RETURNED_TO_VENDOR: "RETURNED_TO_VENDOR";
    }>;
    date: z.ZodNullable<z.ZodString>;
    source: z.ZodString;
    sourceRef: z.ZodNullable<z.ZodString>;
    locationCode: z.ZodNullable<z.ZodString>;
    partyNo: z.ZodNullable<z.ZodString>;
    customerCode: z.ZodNullable<z.ZodString>;
    tradeReference: z.ZodNullable<z.ZodString>;
    quantity: z.ZodNumber;
    amount: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
type ItemTraceEvent = z.infer<typeof ItemTraceEventSchema>;
declare const ItemTraceSchema: z.ZodObject<{
    serial: z.ZodString;
    bcItemNo: z.ZodNullable<z.ZodString>;
    product: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        GONE: "GONE";
        COLLECTED: "COLLECTED";
        UNKNOWN: "UNKNOWN";
        IN_STOCK: "IN_STOCK";
    }>;
    locationCode: z.ZodNullable<z.ZodString>;
    events: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            COLLECTED: "COLLECTED";
            RECEIVED: "RECEIVED";
            OPENING_BALANCE: "OPENING_BALANCE";
            ADJUSTED_IN: "ADJUSTED_IN";
            ADJUSTED_OUT: "ADJUSTED_OUT";
            TRANSFERRED: "TRANSFERRED";
            RETURNED_BY_CUSTOMER: "RETURNED_BY_CUSTOMER";
            RETURNED_TO_VENDOR: "RETURNED_TO_VENDOR";
        }>;
        date: z.ZodNullable<z.ZodString>;
        source: z.ZodString;
        sourceRef: z.ZodNullable<z.ZodString>;
        locationCode: z.ZodNullable<z.ZodString>;
        partyNo: z.ZodNullable<z.ZodString>;
        customerCode: z.ZodNullable<z.ZodString>;
        tradeReference: z.ZodNullable<z.ZodString>;
        quantity: z.ZodNumber;
        amount: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ItemTrace = z.infer<typeof ItemTraceSchema>;
declare const ItemTraceQuerySchema: z.ZodObject<{
    serial: z.ZodString;
}, z.core.$strip>;
type ItemTraceQuery = z.infer<typeof ItemTraceQuerySchema>;
declare const ShippedNotCollectedRowSchema: z.ZodObject<{
    tradeId: z.ZodNumber;
    reference: z.ZodString;
    customerCode: z.ZodNullable<z.ZodString>;
    product: z.ZodString;
    qty: z.ZodNullable<z.ZodNumber>;
    saleDate: z.ZodNullable<z.ZodString>;
    shipmentNo: z.ZodString;
    shippedOn: z.ZodNullable<z.ZodString>;
    taskOpen: z.ZodBoolean;
}, z.core.$strip>;
type ShippedNotCollectedRow = z.infer<typeof ShippedNotCollectedRowSchema>;
declare const ShippedNotCollectedListSchema: z.ZodArray<z.ZodObject<{
    tradeId: z.ZodNumber;
    reference: z.ZodString;
    customerCode: z.ZodNullable<z.ZodString>;
    product: z.ZodString;
    qty: z.ZodNullable<z.ZodNumber>;
    saleDate: z.ZodNullable<z.ZodString>;
    shipmentNo: z.ZodString;
    shippedOn: z.ZodNullable<z.ZodString>;
    taskOpen: z.ZodBoolean;
}, z.core.$strip>>;
declare const ShippedNotCollectedTasksResultSchema: z.ZodObject<{
    created: z.ZodNumber;
    alreadyOpen: z.ZodNumber;
}, z.core.$strip>;
type ShippedNotCollectedTasksResult = z.infer<typeof ShippedNotCollectedTasksResultSchema>;
/** The sheet task that asks staff to tick Collected for a sale BC shipped. Closed by the import that shows it done. */
declare const COLLECTED_TASK: {
    readonly sheet: "Tradesheet";
    readonly what: "Tick Collected (C or the date)";
    readonly value: "C";
    readonly check: "TRADE_COLLECTED";
};

/**
 * Named things a person may see or do, checked on the server for every request. A person's set is their role
 * preset, adjusted by their own overrides (grant or remove, optionally until a date). The admin flag holds every
 * permission. Add a page by adding its key here and to the presets it belongs to; the database stores keys as text,
 * so a removed key is simply ignored.
 */
declare const PERMISSION_KEYS: readonly ["analytics.pricing", "analytics.sales", "analytics.orders", "analytics.inventory", "analytics.customers", "analytics.chatbot", "analytics.ops", "admin.audit", "page.dashboard", "page.inventory", "page.analytics", "page.knowledge", "page.stocktake", "page.customer-orders", "page.orders", "page.import", "page.customers", "page.invoices", "page.tradesheets", "page.rules"];
declare const PermissionKeySchema: z.ZodEnum<{
    "analytics.pricing": "analytics.pricing";
    "analytics.sales": "analytics.sales";
    "analytics.orders": "analytics.orders";
    "analytics.inventory": "analytics.inventory";
    "analytics.customers": "analytics.customers";
    "analytics.chatbot": "analytics.chatbot";
    "analytics.ops": "analytics.ops";
    "admin.audit": "admin.audit";
    "page.dashboard": "page.dashboard";
    "page.inventory": "page.inventory";
    "page.analytics": "page.analytics";
    "page.knowledge": "page.knowledge";
    "page.stocktake": "page.stocktake";
    "page.customer-orders": "page.customer-orders";
    "page.orders": "page.orders";
    "page.import": "page.import";
    "page.customers": "page.customers";
    "page.invoices": "page.invoices";
    "page.tradesheets": "page.tradesheets";
    "page.rules": "page.rules";
}>;
type PermissionKey = z.infer<typeof PermissionKeySchema>;
type PermissionRole = z.infer<typeof SessionUserRoleEnum>;
/** What each key means, for the roles matrix and the user sheet. */
declare const PERMISSION_LABELS: Record<PermissionKey, {
    group: string;
    label: string;
}>;
/**
 * Pages that can never be handed to anyone but an admin, so they are not in the matrix: the admin console can read
 * and edit the database, and the roadmap is the private plan. Both stay behind the admin flag on the server.
 */
declare const ADMIN_ONLY_PAGES: readonly ["Admin console", "Project (roadmap)"];
/** The starting presets, seeded once by the migration. Admins change them later in Roles & permissions. */
declare const DEFAULT_ROLE_PERMISSIONS: Record<PermissionRole, readonly PermissionKey[]>;
interface RolePermissionRow {
    role: PermissionRole;
    key: string;
}
interface PermissionOverrideRow {
    key: string;
    granted: boolean;
    /** Null means the override has no end date. */
    expiresAt: Date | null;
}
interface PermissionSubject {
    role: PermissionRole;
    admin: boolean;
}
/** A person's permissions, sorted. Expired overrides and keys no longer in the list are ignored. */
declare function effectivePermissions(subject: PermissionSubject, presets: readonly RolePermissionRow[], overrides: readonly PermissionOverrideRow[], now: Date): PermissionKey[];
declare const PermissionListSchema: z.ZodArray<z.ZodEnum<{
    "analytics.pricing": "analytics.pricing";
    "analytics.sales": "analytics.sales";
    "analytics.orders": "analytics.orders";
    "analytics.inventory": "analytics.inventory";
    "analytics.customers": "analytics.customers";
    "analytics.chatbot": "analytics.chatbot";
    "analytics.ops": "analytics.ops";
    "admin.audit": "admin.audit";
    "page.dashboard": "page.dashboard";
    "page.inventory": "page.inventory";
    "page.analytics": "page.analytics";
    "page.knowledge": "page.knowledge";
    "page.stocktake": "page.stocktake";
    "page.customer-orders": "page.customer-orders";
    "page.orders": "page.orders";
    "page.import": "page.import";
    "page.customers": "page.customers";
    "page.invoices": "page.invoices";
    "page.tradesheets": "page.tradesheets";
    "page.rules": "page.rules";
}>>;

/**
 * Analytics: one route per tab, each behind its own permission. Every route takes the same period and returns
 * the period it used plus the previous period of the same length, so KPI tiles can show the change.
 */
declare const ANALYTICS_PRESETS: readonly ["30d", "90d", "12m", "ytd"];
declare const AnalyticsPresetSchema: z.ZodEnum<{
    "30d": "30d";
    "90d": "90d";
    "12m": "12m";
    ytd: "ytd";
}>;
type AnalyticsPreset = z.infer<typeof AnalyticsPresetSchema>;
declare const AnalyticsQuerySchema: z.ZodObject<{
    preset: z.ZodDefault<z.ZodEnum<{
        "30d": "30d";
        "90d": "90d";
        "12m": "12m";
        ytd: "ytd";
    }>>;
}, z.core.$strip>;
type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
interface AnalyticsRange {
    from: string;
    to: string;
}
interface AnalyticsPeriod {
    preset: AnalyticsPreset;
    current: AnalyticsRange;
    previous: AnalyticsRange;
}
/** Days are counted in Dublin time; `today` is passed in so the rule is testable. Ranges are inclusive. */
declare function resolveAnalyticsPeriod(preset: AnalyticsPreset, today: string): AnalyticsPeriod;
type KpiUnit = 'eur' | 'pct' | 'count' | 'seconds' | 'ms' | 'hours';
interface AnalyticsKpi {
    key: string;
    label: string;
    unit: KpiUnit;
    /** Null when there is no data for the period. */
    value: number | null;
    /** Same figure for the previous period; null when it cannot be compared (no data, or not a period figure). */
    previous: number | null;
    hint?: string;
}
/** A visible warning about the data behind a chart, shown under it. */
interface AnalyticsNote {
    chart: string;
    text: string;
}
interface LabelValue {
    label: string;
    value: number;
}
interface HeatCell {
    /** 0 = Monday ... 6 = Sunday. */
    weekday: number;
    hour: number;
    value: number;
}
interface DayValue {
    day: string;
    value: number;
}
interface FlowLink {
    from: string;
    to: string;
    value: number;
}
interface AnalyticsBase {
    period: AnalyticsPeriod;
    kpis: AnalyticsKpi[];
    notes: AnalyticsNote[];
}
type AnalyticsMetal = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
interface PricingAnalytics extends AnalyticsBase {
    /** Daily close per metal, EUR/oz. */
    spot: {
        day: string;
        GOLD: number | null;
        SILVER: number | null;
        PLATINUM: number | null;
        PALLADIUM: number | null;
    }[];
    /** First and last close of the period per metal, for the slope chart. */
    change: {
        metal: AnalyticsMetal;
        start: number;
        end: number;
    }[];
    /** Each active product's Price premium (spreadSell) by metal and category. */
    premiums: {
        productId: number;
        name: string;
        metal: AnalyticsMetal;
        category: string | null;
        premium: number;
        buyback: number;
    }[];
    /** Average Price premium per metal per day from the daily snapshot; empty until the snapshot has run. */
    premiumHistory: {
        day: string;
        metal: AnalyticsMetal;
        premium: number;
    }[];
    snapshotSince: string | null;
    marketMode: {
        weekend: boolean;
        volatile: boolean;
        shortage: boolean;
        updatedBy: string | null;
        updatedAt: string | null;
    };
}
interface SalesAnalytics extends AnalyticsBase {
    /** Gross profit and margin per month (invoiced trades), split by metal. */
    byMonth: {
        month: string;
        goldProfit: number;
        silverProfit: number;
        margin: number | null;
        trades: number;
    }[];
    byBranch: LabelValue[];
    /** Profit per day for the calendar heatmap. */
    byDay: DayValue[];
    topProducts: {
        product: string;
        trades: number;
        qty: number;
        revenue: number;
        margin: number | null;
    }[];
    /** When trades are written, Monday to Sunday by hour. */
    tradeHours: HeatCell[];
}
interface OrdersAnalytics extends AnalyticsBase {
    tradeStates: LabelValue[];
    orderItemStatus: LabelValue[];
    /** Average hours spent going from one recorded step to the next. */
    stepHours: {
        from: string;
        to: string;
        hours: number;
        orders: number;
    }[];
    /** Orders moving between steps, for the flow chart. */
    flow: FlowLink[];
    /** Open orders by the latest step they reached, with how many days they have been waiting there. */
    waiting: {
        step: string;
        orders: {
            reference: string;
            days: number;
        }[];
    }[];
}
interface InventoryAnalytics extends AnalyticsBase {
    byBranch: {
        branch: string;
        gold: number;
        silver: number;
    }[];
    /** Metal, then product family, by pieces: for the treemap. */
    tree: {
        metal: string;
        family: string;
        qty: number;
    }[];
    low: {
        branch: string;
        product: string;
        qty: number;
        threshold: number;
    }[];
    movementsByDay: {
        day: string;
        in: number;
        out: number;
    }[];
    movementsSince: string | null;
}
interface CustomersAnalytics extends AnalyticsBase {
    byMonth: {
        month: string;
        total: number;
        invoices: number;
    }[];
    status: LabelValue[];
    topCustomers: LabelValue[];
    byDay: DayValue[];
    invoicesUntil: string | null;
}
interface ChatbotAnalytics extends AnalyticsBase {
    byDay: DayValue[];
    outcome: LabelValue[];
    byMode: LabelValue[];
    latencyByMode: LabelValue[];
    hours: HeatCell[];
    feedback: {
        helpful: number;
        notHelpful: number;
        since: string | null;
    };
    /** Procedure questions show their text; reply requests show only their length, since they hold customer messages. */
    recent: {
        at: string;
        text: string;
        status: string;
        seconds: number;
    }[];
}
interface OpsAnalytics extends AnalyticsBase {
    /** Failed price-feed fetches, Monday to Sunday by hour (Dublin time). */
    feedFailures: HeatCell[];
    feedByDay: {
        day: string;
        ok: number;
        failed: number;
    }[];
    imports: {
        at: string;
        kind: string;
        file: string;
        by: string;
        status: string;
    }[];
    importsByKind: LabelValue[];
}
declare const AiFeedbackRequestSchema: z.ZodObject<{
    helpful: z.ZodBoolean;
}, z.core.$strip>;
type AiFeedbackRequest = z.infer<typeof AiFeedbackRequestSchema>;

declare const PermissionOverrideSchema: z.ZodObject<{
    key: z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>;
    granted: z.ZodBoolean;
    expiresAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type PermissionOverride = z.infer<typeof PermissionOverrideSchema>;
declare const AdminUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: z.ZodBoolean;
    isActive: z.ZodBoolean;
    branch: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        region: z.ZodEnum<{
            IE: "IE";
            UK: "UK";
            ES: "ES";
        }>;
    }, z.core.$strip>>;
    lastLoginAt: z.ZodNullable<z.ZodString>;
    overrides: z.ZodArray<z.ZodObject<{
        key: z.ZodEnum<{
            "analytics.pricing": "analytics.pricing";
            "analytics.sales": "analytics.sales";
            "analytics.orders": "analytics.orders";
            "analytics.inventory": "analytics.inventory";
            "analytics.customers": "analytics.customers";
            "analytics.chatbot": "analytics.chatbot";
            "analytics.ops": "analytics.ops";
            "admin.audit": "admin.audit";
            "page.dashboard": "page.dashboard";
            "page.inventory": "page.inventory";
            "page.analytics": "page.analytics";
            "page.knowledge": "page.knowledge";
            "page.stocktake": "page.stocktake";
            "page.customer-orders": "page.customer-orders";
            "page.orders": "page.orders";
            "page.import": "page.import";
            "page.customers": "page.customers";
            "page.invoices": "page.invoices";
            "page.tradesheets": "page.tradesheets";
            "page.rules": "page.rules";
        }>;
        granted: z.ZodBoolean;
        expiresAt: z.ZodNullable<z.ZodString>;
        reason: z.ZodString;
        createdBy: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    permissions: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
}, z.core.$strip>;
type AdminUser = z.infer<typeof AdminUserSchema>;
declare const AdminUserListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: z.ZodBoolean;
    isActive: z.ZodBoolean;
    branch: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        region: z.ZodEnum<{
            IE: "IE";
            UK: "UK";
            ES: "ES";
        }>;
    }, z.core.$strip>>;
    lastLoginAt: z.ZodNullable<z.ZodString>;
    overrides: z.ZodArray<z.ZodObject<{
        key: z.ZodEnum<{
            "analytics.pricing": "analytics.pricing";
            "analytics.sales": "analytics.sales";
            "analytics.orders": "analytics.orders";
            "analytics.inventory": "analytics.inventory";
            "analytics.customers": "analytics.customers";
            "analytics.chatbot": "analytics.chatbot";
            "analytics.ops": "analytics.ops";
            "admin.audit": "admin.audit";
            "page.dashboard": "page.dashboard";
            "page.inventory": "page.inventory";
            "page.analytics": "page.analytics";
            "page.knowledge": "page.knowledge";
            "page.stocktake": "page.stocktake";
            "page.customer-orders": "page.customer-orders";
            "page.orders": "page.orders";
            "page.import": "page.import";
            "page.customers": "page.customers";
            "page.invoices": "page.invoices";
            "page.tradesheets": "page.tradesheets";
            "page.rules": "page.rules";
        }>;
        granted: z.ZodBoolean;
        expiresAt: z.ZodNullable<z.ZodString>;
        reason: z.ZodString;
        createdBy: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    permissions: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
}, z.core.$strip>>;
declare const UpdateUserRequestSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>>;
    admin: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    branchId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    reason: z.ZodString;
}, z.core.$strip>;
type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
declare const SetOverridesRequestSchema: z.ZodObject<{
    overrides: z.ZodArray<z.ZodObject<{
        key: z.ZodEnum<{
            "analytics.pricing": "analytics.pricing";
            "analytics.sales": "analytics.sales";
            "analytics.orders": "analytics.orders";
            "analytics.inventory": "analytics.inventory";
            "analytics.customers": "analytics.customers";
            "analytics.chatbot": "analytics.chatbot";
            "analytics.ops": "analytics.ops";
            "admin.audit": "admin.audit";
            "page.dashboard": "page.dashboard";
            "page.inventory": "page.inventory";
            "page.analytics": "page.analytics";
            "page.knowledge": "page.knowledge";
            "page.stocktake": "page.stocktake";
            "page.customer-orders": "page.customer-orders";
            "page.orders": "page.orders";
            "page.import": "page.import";
            "page.customers": "page.customers";
            "page.invoices": "page.invoices";
            "page.tradesheets": "page.tradesheets";
            "page.rules": "page.rules";
        }>;
        granted: z.ZodBoolean;
        expiresAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    reason: z.ZodString;
}, z.core.$strip>;
type SetOverridesRequest = z.infer<typeof SetOverridesRequestSchema>;
declare const PermissionMatrixSchema: z.ZodObject<{
    ADMIN: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
    MANAGER: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
    SALES: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
    ACCOUNTING: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
    AUDITOR: z.ZodArray<z.ZodEnum<{
        "analytics.pricing": "analytics.pricing";
        "analytics.sales": "analytics.sales";
        "analytics.orders": "analytics.orders";
        "analytics.inventory": "analytics.inventory";
        "analytics.customers": "analytics.customers";
        "analytics.chatbot": "analytics.chatbot";
        "analytics.ops": "analytics.ops";
        "admin.audit": "admin.audit";
        "page.dashboard": "page.dashboard";
        "page.inventory": "page.inventory";
        "page.analytics": "page.analytics";
        "page.knowledge": "page.knowledge";
        "page.stocktake": "page.stocktake";
        "page.customer-orders": "page.customer-orders";
        "page.orders": "page.orders";
        "page.import": "page.import";
        "page.customers": "page.customers";
        "page.invoices": "page.invoices";
        "page.tradesheets": "page.tradesheets";
        "page.rules": "page.rules";
    }>>;
}, z.core.$strip>;
type PermissionMatrix = Record<PermissionRole, readonly PermissionKey[]>;
/** Only the cells the admin toggled, so two admins editing at once never undo each other's work. */
declare const UpdatePermissionMatrixRequestSchema: z.ZodObject<{
    changes: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            ADMIN: "ADMIN";
            MANAGER: "MANAGER";
            SALES: "SALES";
            ACCOUNTING: "ACCOUNTING";
            AUDITOR: "AUDITOR";
        }>;
        key: z.ZodEnum<{
            "analytics.pricing": "analytics.pricing";
            "analytics.sales": "analytics.sales";
            "analytics.orders": "analytics.orders";
            "analytics.inventory": "analytics.inventory";
            "analytics.customers": "analytics.customers";
            "analytics.chatbot": "analytics.chatbot";
            "analytics.ops": "analytics.ops";
            "admin.audit": "admin.audit";
            "page.dashboard": "page.dashboard";
            "page.inventory": "page.inventory";
            "page.analytics": "page.analytics";
            "page.knowledge": "page.knowledge";
            "page.stocktake": "page.stocktake";
            "page.customer-orders": "page.customer-orders";
            "page.orders": "page.orders";
            "page.import": "page.import";
            "page.customers": "page.customers";
            "page.invoices": "page.invoices";
            "page.tradesheets": "page.tradesheets";
            "page.rules": "page.rules";
        }>;
        granted: z.ZodBoolean;
    }, z.core.$strip>>;
    reason: z.ZodString;
}, z.core.$strip>;
type UpdatePermissionMatrixRequest = z.infer<typeof UpdatePermissionMatrixRequestSchema>;
/** Admin: create an account and email the person a link to set their own password. */
declare const InviteUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: z.ZodDefault<z.ZodBoolean>;
    branchId: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;
declare function diffPermissionMatrix(before: PermissionMatrix, after: PermissionMatrix): {
    role: PermissionRole;
    key: PermissionKey;
    granted: boolean;
}[];
type UserFields = {
    role: PermissionRole;
    admin: boolean;
    isActive: boolean;
    branchId: number | null;
};
declare function diffUserChanges(before: UserFields, patch: Partial<UserFields>): {
    field: keyof UserFields;
    from: UserFields[keyof UserFields];
    to: UserFields[keyof UserFields];
}[];
/** Each permission whose override was added, changed or removed, sorted by key, for the audit log. */
declare function diffOverrides(before: PermissionOverride[], after: PermissionOverride[]): {
    key: PermissionKey;
    from: string | null;
    to: string | null;
}[];

/**
 * Settings: each person's preferences (saved on their account so they follow them to any browser), the company's
 * quote wording (admins), in-app notifications (admins only for now) and signed-in sessions.
 */
declare const NOTIFICATION_KINDS: readonly ["feed_down", "order_step", "import_review", "permission_changed"];
declare const NotificationKindSchema: z.ZodEnum<{
    feed_down: "feed_down";
    order_step: "order_step";
    import_review: "import_review";
    permission_changed: "permission_changed";
}>;
type NotificationKind = z.infer<typeof NotificationKindSchema>;
declare const NOTIFICATION_LABELS: Record<NotificationKind, string>;
declare const USER_PREFERENCES_MAX_BYTES = 8000;
declare const UserPreferencesSchema: z.ZodObject<{
    detail: z.ZodDefault<z.ZodEnum<{
        simple: "simple";
        detailed: "detailed";
    }>>;
    singleKeyShortcuts: z.ZodDefault<z.ZodBoolean>;
    quote: z.ZodDefault<z.ZodObject<{
        signOff: z.ZodDefault<z.ZodString>;
        defaultChannel: z.ZodDefault<z.ZodNullable<z.ZodEnum<{
            email: "email";
            whatsapp: "whatsapp";
        }>>>;
    }, z.core.$strip>>;
    board: z.ZodDefault<z.ZodObject<{
        view: z.ZodDefault<z.ZodString>;
        pins: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>>;
    notifications: z.ZodDefault<z.ZodObject<{
        muted: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            feed_down: "feed_down";
            order_step: "order_step";
            import_review: "import_review";
            permission_changed: "permission_changed";
        }>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type UserPreferences = z.infer<typeof UserPreferencesSchema>;
/** Company wording around the generated price lines. Null keeps the built-in text. Placeholders: {name}, {spot_time}. */
declare const CompanyQuoteTemplateSchema: z.ZodObject<{
    opening: z.ZodNullable<z.ZodString>;
    closingNote: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type CompanyQuoteTemplate = z.infer<typeof CompanyQuoteTemplateSchema>;
declare const QUOTE_PLACEHOLDERS: readonly ["name", "spot_time"];
declare function renderQuoteText(template: string, values: Record<(typeof QUOTE_PLACEHOLDERS)[number], string>): string;
declare const NotificationSchema: z.ZodObject<{
    id: z.ZodNumber;
    kind: z.ZodEnum<{
        feed_down: "feed_down";
        order_step: "order_step";
        import_review: "import_review";
        permission_changed: "permission_changed";
    }>;
    title: z.ZodString;
    body: z.ZodString;
    link: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    readAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type AppNotification = z.infer<typeof NotificationSchema>;
declare const NotificationListSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        kind: z.ZodEnum<{
            feed_down: "feed_down";
            order_step: "order_step";
            import_review: "import_review";
            permission_changed: "permission_changed";
        }>;
        title: z.ZodString;
        body: z.ZodString;
        link: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        readAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    unread: z.ZodNumber;
}, z.core.$strip>;
declare function isMuted(prefs: {
    muted: readonly NotificationKind[];
}, kind: NotificationKind): boolean;
declare const SignedInSessionSchema: z.ZodObject<{
    id: z.ZodString;
    device: z.ZodString;
    ip: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    lastActiveAt: z.ZodString;
    current: z.ZodBoolean;
}, z.core.$strip>;
type SignedInSession = z.infer<typeof SignedInSessionSchema>;
declare const SignedInSessionListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    device: z.ZodString;
    ip: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    lastActiveAt: z.ZodString;
    current: z.ZodBoolean;
}, z.core.$strip>>;
/** "Chrome on Windows" from a user-agent string; good enough to recognise your own devices. */
declare function parseUserAgent(ua: string | null | undefined): string;
declare const MarkNotificationsReadSchema: z.ZodObject<{
    ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
type MarkNotificationsRead = z.infer<typeof MarkNotificationsReadSchema>;

/**
 * "View as": lets an admin see the app the way another kind of person does, without signing in again. The browser
 * sends the choice in this header; the API honours it only for a real admin, and then treats that request as a
 * non-admin of that role and region (so every guard, permission and branch rule applies for real). Writes an admin
 * could make are refused while viewing as someone else, which is what a check needs.
 */
declare const VIEW_AS_HEADER = "x-view-as";
interface ViewAsOption {
    value: string;
    label: string;
    role: Exclude<PermissionRole, 'ADMIN'>;
    region: BranchRegion;
}
declare const VIEW_AS_OPTIONS: readonly ViewAsOption[];
/** The option a header value names, or null when it is empty or unknown (an unknown value never grants anything). */
declare function parseViewAs(raw: string | string[] | undefined | null): ViewAsOption | null;

export { ADMIN_ONLY_PAGES, AI_MESSAGE_MAX_LENGTH, AI_QUESTION_MAX_LENGTH, ALIAS_USAGE_SOURCES, ALIAS_VIEWS, ANALYTICS_PRESETS, type AddBarRequest, AddBarRequestSchema, type AddCoinRequest, AddCoinRequestSchema, type AddEvidenceRequest, AddEvidenceRequestSchema, type AddLiveStockBarRequest, AddLiveStockBarRequestSchema, type AdjustLiveStockRequest, AdjustLiveStockRequestSchema, type AdminLogEntry, AdminLogEntrySchema, type AdminLogsQuery, AdminLogsQuerySchema, AdminLogsResponseSchema, type AdminOverview, AdminOverviewSchema, type AdminUser, AdminUserListSchema, AdminUserSchema, type AiAnswerStatus, AiAnswerStatusEnum, type AiCitation, AiCitationSchema, type AiFeedbackRequest, AiFeedbackRequestSchema, type AiMode, AiModeEnum, type AiSpotNote, AiSpotNoteSchema, type AiStatus, AiStatusSchema, type AiUsage, AiUsageSchema, type AliasCounts, AliasCountsSchema, type AliasRow, AliasRowSchema, type AliasSeenIn, AliasSeenInSchema, type AliasTarget, AliasTargetSchema, type AliasUsageExample, AliasUsageExampleSchema, type AliasUsageMetal, AliasUsageMetalSchema, type AliasUsageResponse, AliasUsageResponseSchema, type AliasUsageSource, AliasUsageSourceSchema, type AliasesQuery, AliasesQuerySchema, type AliasesResponse, AliasesResponseSchema, type AllocationSummary, AllocationSummarySchema, type AnalyticsKpi, type AnalyticsMetal, type AnalyticsNote, type AnalyticsPeriod, type AnalyticsPreset, AnalyticsPresetSchema, type AnalyticsQuery, AnalyticsQuerySchema, type AnalyticsRange, ApiCatalogueSchema, type ApiEndpoint, type ApiEndpointParameter, ApiEndpointParameterSchema, ApiEndpointSchema, type ApiErrorResponse, ApiErrorResponseSchema, type ApiSuccessResponse, ApiSuccessResponseSchema, type AppNotification, type AppOnlyTasks, type ApplicationStatus, type ApplyPerMetalRequest, ApplyPerMetalRequestSchema, type ApplyPerMetalResult, ApplyPerMetalResultSchema, type ApplyRow, type AskRequest, type AskRequestInput, AskRequestSchema, type AskResponse, AskResponseSchema, type AskStreamEvent, AskStreamEventSchema, type AuditEntry, AuditEntrySchema, AuditLogResponseSchema, AuditQuerySchema, type AuthResponse, AuthResponseSchema, BAR_EXPORT_HEADERS, BAR_STATUSES, BC_HISTORY_KINDS, type BackfillHistoryQuery, BackfillHistoryQuerySchema, type BarImportRow, type BarStatus, BarStatusEnum, type BarSummary, type BarsImportResult, type BaselineBar, type BaselineBarRow, BaselineBarRowSchema, type BaselineCoinRow, BaselineCoinRowSchema, type BaselineFix, type BaselineIssue, type BaselineLine, type BaselinePlan, type BcAwaitingRequest, BcAwaitingRequestSchema, type BcAwaitingResult, BcAwaitingResultSchema, type BcHistoryKind, type BcHistoryMapped, type BcHistoryRequest, BcHistoryRequestSchema, type BcHistoryResult, BcHistoryResultSchema, type BcItem, BcItemProductOptionSchema, BcItemSchema, type BcItemsResponse, BcItemsResponseSchema, type BcLedgerRow, BcLedgerRowSchema, type BcReceiptRow, BcReceiptRowSchema, type BcReportResult, type BcSalesProductAction, BcSalesProductActionSchema, type BcSalesProductRow, BcSalesProductRowSchema, type BcSalesProductsApplyRequest, BcSalesProductsApplyRequestSchema, type BcSalesProductsApplyResult, BcSalesProductsApplyResultSchema, type BcSalesProductsPreview, BcSalesProductsPreviewSchema, type BcShipmentLineRow, BcShipmentLineRowSchema, type BcShipmentRow, BcShipmentRowSchema, type Branch, type BranchRegion, BranchRegionEnum, BranchSchema, type BrokenKbLink, CASH_AML_THRESHOLD, COIN_DESIGNS, COIN_EXPORT_HEADERS, COLLAPSE_ABOVE_CHARACTERS, COLLECTED_FLAGS, COLLECTED_TASK, CPTY_KINDS, CUSTOMER_ORDER_STATUSES, CUSTOMER_ORDER_STATUS_LABELS, type Capabilities, type CapabilitySubject, type CarryForwardRequest, CarryForwardRequestSchema, type CarryForwardResult, CarryForwardResultSchema, type CatalogueProductRef, type ChangePasswordInput, ChangePasswordSchema, type ChatbotAnalytics, type ClientErrorReport, type ClientErrorReportBatch, ClientErrorReportBatchSchema, ClientErrorReportSchema, type Coerced, type CoinDesign, type CoinImportRow, type CollectedInfo, type ColorMode, ColorModeEnum, type ColumnKind, type CompanyQuoteTemplate, CompanyQuoteTemplateSchema, type CountLine, type CptyInfo, type CptyKind, type CreateBranchRequest, CreateBranchRequestSchema, type CreateCustomerOrderRequest, CreateCustomerOrderRequestSchema, type CreateDiscrepancyRequest, CreateDiscrepancyRequestSchema, type CreateLiveStockLineRequest, CreateLiveStockLineRequestSchema, type CreateProductDto, CreateProductDtoSchema, type CreateSalesProductRequest, CreateSalesProductRequestSchema, type CreateSpotPriceDto, CreateSpotPriceDtoSchema, type CreateStocktakeRequest, CreateStocktakeRequestSchema, type CreateUserRequest, CreateUserRequestSchema, CurrencyEnum, CustomerInvoiceRowSchema, type CustomerListResponse, CustomerListResponseSchema, type CustomerListRow, CustomerListRowSchema, type CustomerOrder, type CustomerOrderChanges, type CustomerOrderEvidence, CustomerOrderEvidenceSchema, type CustomerOrderImportRow, type CustomerOrderPlanOptions, CustomerOrderRowSchema, CustomerOrderSchema, type CustomerOrderStatus, CustomerOrderStatusEnum, type CustomerProfile, CustomerProfileSchema, type CustomerSafeLine, type CustomersAnalytics, DEFAULT_ROLE_PERMISSIONS, DISCREPANCY_ISSUE_TYPES, type DateOrder, type DayValue, type DbColumn, DbColumnSchema, type DbDeleteRequest, DbDeleteRequestSchema, type DbInsertRequest, DbInsertRequestSchema, DbRowResponseSchema, type DbRowsQuery, DbRowsQuerySchema, type DbRowsResponse, DbRowsResponseSchema, type DbTableSummary, DbTableSummarySchema, DbTablesResponseSchema, type DbUpdateRequest, DbUpdateRequestSchema, type DeferredLinks, type DerivedOrder, type DesignDoc, type DesignRule, type DesignTokens, type DetectedFile, type Discrepancy, type DiscrepancyIssueType, DiscrepancyIssueTypeEnum, DiscrepancySchema, type DocSection, type DuplicateRow, DuplicateRowSchema, type DuplicatesResponse, DuplicatesResponseSchema, EMPTY_SCOPE_VIEW, EVIDENCE_KINDS, EVIDENCE_KIND_LABELS, type ErrorLogEntry, ErrorLogEntrySchema, type ErrorLogKind, ErrorLogKindEnum, ErrorLogQuerySchema, type ErrorLogSeverity, ErrorLogSeverityEnum, type ErrorLogSource, ErrorLogSourceEnum, type EvidenceKind, EvidenceKindEnum, type ExistingCustomerOrder, type ExpectedCustomerStockResponse, ExpectedCustomerStockSchema, FAKE_CUSTOMERS, FIRST_TRADE_YEAR, FIT_HIGH, FIT_HIGH_SILVER, FIT_LOW, FOREIGN_COINS, type FetchAttempt, FetchAttemptSchema, FetchLogQuerySchema, type FetchMetrics, FetchMetricsSchema, type FetchSource, FetchSourceEnum, type FetchTrigger, FetchTriggerEnum, type FileKind, type FillKind, type FlowLink, type ForeignCoin, GRAMS_PER_TROY_OUNCE, type Handover, HandoverSchema, type HeaderMap, type HealthCheck, HealthCheckSchema, type HealthItem, HealthItemSchema, type HealthStatus, HealthStatusEnum, type HeatCell, type HistoricCloseQuery, HistoricCloseQuerySchema, type HistoricSpot, HistoricSpotSchema, type HourlyStats, HourlyStatsSchema, IMPORT_SCHEMA_VERSION, IMPORT_TABLE_NAMES, IMPORT_TABLE_SPECS, ISSUE_TYPE_LABELS, ITEM_EVENT_KINDS, ITEM_STATUSES, ImportBatchListSchema, type ImportBatchSummary, ImportBatchSummarySchema, type ImportCustomerOrdersRequest, ImportCustomerOrdersRequestSchema, type ImportCustomerOrdersResult, ImportCustomerOrdersResultSchema, type ImportJournalRequest, ImportJournalRequestSchema, type ImportJournalResult, ImportJournalResultSchema, ImportMetaSchema, type ImportPhysicalRequest, ImportPhysicalRequestSchema, type ImportPhysicalResult, ImportPhysicalResultSchema, type ImportReadResult, type ImportRow, type ImportRowIssue, type ImportRowIssueCode, ImportRowIssueCodeSchema, ImportRowIssueSchema, type ImportSource, type ImportTableName, ImportTableSchemas, type InventoryAnalytics, type InventoryBarRow, InventoryBarRowSchema, type InventoryBarsQuery, InventoryBarsQuerySchema, type InventoryBarsResponse, InventoryBarsResponseSchema, type InventoryCoinRow, InventoryCoinRowSchema, type InventoryCoinsQuery, InventoryCoinsQuerySchema, type InventoryCoinsResponse, InventoryCoinsResponseSchema, type InventoryPosition, InventoryPositionSchema, type InventoryStocktakeRef, InventoryStocktakeRefSchema, type InviteUserRequest, InviteUserRequestSchema, InvoiceCollectedSchema, type InvoiceDetail, InvoiceDetailSchema, InvoiceLineRowSchema, InvoiceLinkRowSchema, type InvoiceListResponse, InvoiceListResponseSchema, type InvoiceListRow, InvoiceListRowSchema, type ItemEventKind, type ItemStatus, type ItemTrace, type ItemTraceEvent, ItemTraceEventSchema, type ItemTraceQuery, ItemTraceQuerySchema, ItemTraceSchema, JOURNAL_EXPORT_HEADERS, type JournalImportResult, type JournalImportRow, KB_BC_HUB, KB_BC_HUB_PATH, KB_CATEGORIES, KB_CATEGORY_INFO, KB_FLOW_BARS, KB_GUIDE, KB_REVIEW_MONTHS, KB_REVIEW_WARNING_DAYS, KB_TERMS, KB_UNRESOLVED_HREF_PREFIX, type KbArticleLayout, type KbBcChainLink, type KbBcHub, type KbBcHubFlow, type KbBcHubItem, type KbBcScreen, type KbBcTrap, type KbBlock, type KbCategory, KbCategoryEnum, type KbDocument, type KbDocumentListResponse, KbDocumentListResponseSchema, KbDocumentSchema, type KbFlowBar, type KbFlowTone, type KbFormRow, type KbFrontmatter, KbFrontmatterSchema, type KbGuide, type KbGuideBc, type KbGuideBranch, type KbGuideGate, type KbGuideIcon, type KbGuideLibraryTarget, type KbGuideLink, type KbGuideNode, type KbGuidePhase, type KbGuideShortcut, type KbGuideTarget, type KbIndexedDocument, type KbIndexedSection, type KbJurisdiction, KbJurisdictionEnum, type KbLayoutEntry, type KbLinkRef, type KbListItem, type KbMarkdownVariant, type KbRenderBlock, type KbReviewState, type KbReviewStatus, type KbSearchHit, type KbSection, type KbSectionKind, KbSlugSchema, type KbSnippetPart, type KbStatus, KbStatusEnum, type KbTerm, type KbVisibility, KbVisibilityEnum, type KpiUnit, LINK_CONFIDENCES, LINK_TYPES, LIVE_BRANCH_CODES, LIVE_BRANCH_NAMES, type LabelValue, type LatestHandover, LatestHandoverSchema, type LineCandidate, type LinkBcItemRequest, LinkBcItemRequestSchema, type LinkDecisionRequest, LinkDecisionRequestSchema, type LinkDecisionResult, LinkDecisionResultSchema, LinkDecisionSchema, type LinkLiveStockBranchRequest, LinkLiveStockBranchRequestSchema, type LinkStatus, LiveBarStatusSchema, type LiveBaselinePreview, LiveBaselinePreviewSchema, type LiveBaselineRequest, LiveBaselineRequestSchema, type LiveBaselineResult, LiveBaselineResultSchema, type LiveKind, LiveKindSchema, type LiveMetal, LiveMetalSchema, LiveMovementSourceSchema, type LiveStockBar, LiveStockBarSchema, type LiveStockBoard, type LiveStockBoardQuery, LiveStockBoardQuerySchema, LiveStockBoardSchema, type LiveStockBranch, LiveStockBranchSchema, type LiveStockBranchesResponse, LiveStockBranchesResponseSchema, type LiveStockLine, LiveStockLineSchema, type LiveStockMovement, LiveStockMovementSchema, type LogLevel, LogLevelEnum, type LoginInput, type LoginRequest, LoginRequestSchema, type LoginResponse, LoginResponseSchema, LoginSchema, type LowThresholdRequest, LowThresholdRequestSchema, MAX_LISTED_ISSUES, MELT_CATEGORIES, type MapAliasRequest, MapAliasRequestSchema, type MappingSuggestion, type MarkNotificationsRead, MarkNotificationsReadSchema, type MarketDataResponse, MarketDataResponseSchema, type MarketModeState, MarketModeStateSchema, type MatchCatalogue, type MatchConfidence, type MatchInput, type MatchMetal, type MatchOutcome, type MatchPricingProduct, type MatchSpecificProduct, type MeltCalculatorRequest, MeltCalculatorRequestSchema, type MeltCalculatorResponse, MeltCalculatorResponseSchema, type MeltCategoryData, MeltCategoryDataSchema, type MeltCategoryKey, MeltCategoryKeyEnum, type MessageResponse, MessageResponseSchema, type MetalFrom, type MetalSymbol, MetalSymbolSchema, type MetalType, MetalTypeEnum, NOTIFICATION_KINDS, NOTIFICATION_LABELS, type NameSuggestionAcceptRequest, NameSuggestionAcceptRequestSchema, type NameSuggestionAcceptResult, NameSuggestionAcceptResultSchema, type NameSuggestionDecisionRequest, NameSuggestionDecisionRequestSchema, type NameSuggestionDecisionResult, NameSuggestionDecisionResultSchema, type NameSuggestionTarget, NameSuggestionTargetSchema, type NewLine, type NextAction, type NotificationKind, NotificationKindSchema, NotificationListSchema, NotificationSchema, OPTIONAL_COLUMNS, ORDER_LIFECYCLE, ORDER_LIFECYCLE_LABELS, ORDER_STEPS, type OpsAnalytics, type OrderDetail, OrderDetailSchema, type OrderEvent, OrderEventSchema, type OrderFacts, type OrderLifecycle, OrderLifecycleEnum, type OrderLink, type OrderListQuery, OrderListQuerySchema, type OrderListResponse, OrderListResponseSchema, type OrderQueue, OrderQueueEnum, type OrderRole, type OrderRow, OrderRowSchema, type OrderSource, OrderSourceEnum, type OrderStep, OrderStepEnum, type OrderableProduct, type OrdersAnalytics, type OverAllocatedLot, OverAllocatedLotSchema, type OverAllocatedResponse, OverAllocatedResponseSchema, PERMISSION_KEYS, PERMISSION_LABELS, PLAN_ROW_STATUSES, PORTFOLIO_MAX_QTY, PORTFOLIO_SMALL_INVESTOR_LIMIT, PRODUCT_NORM_EXAMPLES, PURCHASE_FIELDS, type Pagination, PaginationSchema, type ParseIssue, type ParseKbResult, type ParsedBarWeight, type ParsedCoin, type ParsedKbDocument, type ParsedPurchase, type ParsedReference, type ParsedSale, type ParsedWeight, PaymentRowSchema, type PerMetalChoice, PerMetalChoiceSchema, type PermissionKey, PermissionKeySchema, PermissionListSchema, type PermissionMatrix, PermissionMatrixSchema, type PermissionOverride, type PermissionOverrideRow, PermissionOverrideSchema, type PermissionRole, type PermissionSubject, type PhysicalRegister, PhysicalRegisterSchema, type PlanContext, type PlanCounts, PlanCountsSchema, type PlanRow, PlanRowSchema, type PlanRowStatus, PlanRowStatusEnum, Platform, type PlatformType, type PortfolioBuildRequest, PortfolioBuildRequestSchema, type PortfolioBuildResponse, PortfolioBuildResponseSchema, type PortfolioCandidateProduct, type PortfolioCandidateResult, type PortfolioLineItem, type PortfolioLineItemDto, PortfolioLineItemSchema, type PortfolioProductType, type PortfolioProductTypeFilter, PortfolioProductTypeFilterEnum, type PortfolioStrategyId, type PortfolioStrategyResult, type PortfolioStrategyResultDto, PortfolioStrategyResultSchema, type PriceRow, type PricingAnalytics, type PricingProductOption, PricingProductOptionListSchema, PricingProductOptionSchema, type PricingSkuGuess, type PriorApplication, type PriorityStrength, PriorityStrengthEnum, type Product, ProductArraySchema, type ProductCategory, ProductCategoryEnum, type ProductDecision, type ProductMapDTO, ProductMapSchema, type ProductMatch, ProductSchema, type ProductStockKey, type ProductStockLevel, ProductStockLevelSchema, ProductStockLevelsResponseSchema, type Products, ProductsSchema, type ProfitAnalysisMissingField, type ProfitAnalysisMissingFieldDto, ProfitAnalysisMissingFieldEnum, type ProfitAnalysisRequest, ProfitAnalysisRequestSchema, type ProfitAnalysisResponse, ProfitAnalysisResponseSchema, type PurchaseField, QUOTE_PLACEHOLDERS, type QtyAndProduct, QuoteRowSchema, RECORD_PAGE_MAX, REDACTED_CODE_COLUMNS, REDACTED_NAME_TABLES, REDACTED_TEXT_COLUMNS, REFINERIES, REGISTER_EXPORT_HEADERS, RELINK_TABLES, ROADMAP_QUEUE_MAX_TEXT, ROADMAP_SCOPE_FILES, type RawKbFile, type RawProduct, RawProductSchema, type RawSheets, type RawSpotPrice, RawSpotPriceSchema, type RecalculateOverrides, RecalculateOverridesSchema, type ReconcileResult, ReconcileResultSchema, type RecordSearchRequest, RecordSearchRequestSchema, type RecordStepRequest, RecordStepRequestSchema, type RedactionMapRow, type ReferenceType, type RefineryAliasEntry, type RefreshRequest, RefreshRequestSchema, type RefreshResponse, RefreshResponseSchema, type RegisterEntry, type RegisterInput, RegisterSchema, type RelinkRequest, RelinkRequestSchema, type RelinkResult, RelinkResultSchema, type RelinkTable, type RelinkTableResult, RelinkTableResultSchema, type ResolveInput, type ResolveMethod, type ResolveResult, type ResolveSheetApplicationRequest, ResolveSheetApplicationRequestSchema, type ResolvedKbLink, type ResolverData, type ReviewLinkRow, ReviewLinkRowSchema, ReviewLinkTypeSchema, type ReviewLinksQuery, ReviewLinksQuerySchema, type ReviewLinksResponse, ReviewLinksResponseSchema, type ReviewPageQuery, ReviewPageQuerySchema, type ReviewReason, type ReviewSummary, ReviewSummarySchema, type RoadmapDocument, RoadmapDocumentSchema, type RoadmapEdit, RoadmapEditError, type RoadmapEditRequest, RoadmapEditRequestSchema, RoadmapEditSchema, type RoadmapInbox, type RoadmapInboxItem, RoadmapInboxItemSchema, type RoadmapInboxPromote, RoadmapInboxPromoteSchema, type RoadmapInboxRefresh, RoadmapInboxRefreshSchema, RoadmapInboxSchema, type RoadmapMergeEntry, type RoadmapMergeKind, type RoadmapMergeResult, type RoadmapProgress, type RoadmapPullRequest, RoadmapPullRequestSchema, type RoadmapPullResult, RoadmapPullResultSchema, type RoadmapPushRequest, RoadmapPushRequestSchema, type RoadmapPushResult, RoadmapPushResultSchema, type RoadmapQueueAppended, RoadmapQueueAppendedSchema, type RoadmapQueueEntry, RoadmapQueueEntrySchema, type RoadmapQueueFiledRequest, RoadmapQueueFiledRequestSchema, type RoadmapQueueFiledResult, RoadmapQueueFiledResultSchema, type RoadmapQueueList, RoadmapQueueListSchema, type RoadmapQueueRequest, RoadmapQueueRequestSchema, type RoadmapQueueSource, RoadmapQueueSourceSchema, type RoadmapScope, type RoadmapScopeDecision, RoadmapScopeDecisionSchema, type RoadmapScopeDone, RoadmapScopeDoneSchema, type RoadmapScopeItem, RoadmapScopeItemSchema, type RoadmapScopeKey, RoadmapScopeKeySchema, type RoadmapScopeRefresh, RoadmapScopeRefreshSchema, RoadmapScopeSchema, type RoadmapScopeTask, RoadmapScopeTaskSchema, type RoadmapScopeView, RoadmapScopeViewSchema, type RoadmapSection, type RoadmapSyncStatus, RoadmapSyncStatusSchema, type RoadmapTask, type RolePermissionRow, type RouteStats, RouteStatsSchema, type RowPlan, type RowResolveInput, type RowResolveMethod, type RowResolveResult, type RowResolverData, SAFE_STATUSES, SALE_FIELDS, SHEETS, SPOT_FETCH_INTERVAL_MS, SPOT_LATE_AFTER_MS, SPOT_RED_AFTER_MS, SPOT_STALE_AFTER_MS, STEP_ROLE, STOCK_METALS, SYSTEMS, type SaleField, type SalesAnalytics, type SalesProduct, type SalesProductId, SalesProductListSchema, type SalesProductRef, SalesProductSchema, type SaveHandoverRequest, SaveHandoverRequestSchema, type SerialComparison, type SerialHolder, SerialsCheckedEnum, type SessionBranch, SessionBranchSchema, type SessionUser, SessionUserRoleEnum, SessionUserSchema, type SetKbStatusRequest, SetKbStatusRequestSchema, type SetKbVisibilityRequest, SetKbVisibilityRequestSchema, type SetLiveStockBarStatusRequest, SetLiveStockBarStatusRequestSchema, type SetOverridesRequest, SetOverridesRequestSchema, type SetUserBranchRequest, SetUserBranchRequestSchema, type SettleNamesRequest, SettleNamesRequestSchema, type SettleNamesResult, SettleNamesResultSchema, type SettleResult, SettleResultSchema, type SheetApplyItem, SheetApplyItemSchema, type SheetApplyPreview, SheetApplyPreviewSchema, type SheetApplyResult, SheetApplyResultSchema, type SheetCell, type SheetKind, SheetKindSchema, SheetLineOptionSchema, type SheetName, SheetNameEnum, type SheetRow, type SheetTask, type SheetTaskDraft, type SheetTaskListQuery, SheetTaskListQuerySchema, SheetTaskSchema, type SheetValue, ShippedNotCollectedListSchema, type ShippedNotCollectedRow, ShippedNotCollectedRowSchema, type ShippedNotCollectedTasksResult, ShippedNotCollectedTasksResultSchema, type SignedInSession, SignedInSessionListSchema, SignedInSessionSchema, type SkipReason, type SoldInfo, type SpotFreshness, type SpotFreshnessState, type SpotPrice, SpotPriceArraySchema, type SpotPriceMapDTO, SpotPriceMapSchema, SpotPriceSchema, type SpotRow, type SpotStatusResponse, SpotStatusResponseSchema, type StepContext, type StockLevelState, StockLevelStateSchema, type StockLineForMatch, type StockMetal, StockMetalEnum, StockMetalSchema, type StockOrderMetal, type Stocktake, type StocktakeBar, StocktakeBarSchema, type StocktakeCoin, StocktakeCoinSchema, type StocktakeDetail, StocktakeDetailSchema, type StocktakeLine, StocktakeLineSchema, StocktakeSchema, type StocktakeStatus, StocktakeStatusEnum, type StocktakeSummary, type SuggestableProduct, TRADE_CART_MAX_ITEMS, TRADE_METAL_SLIDER_BOUNDS, TRADE_STATES, type TabClassification, type TabHeaders, type TabKind, type TabPlan, TabPlanSchema, type TabType, TableSizeSchema, type TaskCheck, TaskCheckEnum, type TaskQueryParams, TaskQueryParamsSchema, type TaskRef, type TaskStatus, TaskStatusSchema, type TrackingEntry, type TradeBootstrapResponse, TradeBootstrapResponseSchema, type TradeCartItemRequest, TradeCartItemRequestSchema, type TradeCartLine, TradeCartLineSchema, type TradeCartRequest, TradeCartRequestSchema, type TradeCartResponse, TradeCartResponseSchema, type TradeLineKey, type TradeMatch, type TradeProduct, TradeProductSchema, type TradeState, type TradeStateResult, type TradeTransactionType, TradeTransactionTypeEnum, type TradesheetImportPlan, TradesheetImportPlanSchema, type TradesheetImportRequest, TradesheetImportRequestSchema, type TradesheetImportResult, TradesheetImportResultSchema, type TradesheetLine, type TradesheetTab, TradesheetTabSchema, type TransferLiveStockRequest, TransferLiveStockRequestSchema, UI_SETTINGS_MAX_BYTES, USER_PREFERENCES_MAX_BYTES, type UiSettings, UiSettingsSchema, type UnredactResult, type UnresolvedLotRow, UnresolvedLotRowSchema, type UnresolvedLotsResponse, UnresolvedLotsResponseSchema, type UpdateBarRequest, UpdateBarRequestSchema, type UpdateCoinRequest, UpdateCoinRequestSchema, type UpdateCustomerOrderRequest, UpdateCustomerOrderRequestSchema, type UpdateDiscrepancyRequest, UpdateDiscrepancyRequestSchema, type UpdateKbDocumentRequest, UpdateKbDocumentRequestSchema, type UpdateMarketModeRequest, UpdateMarketModeRequestSchema, type UpdatePermissionMatrixRequest, UpdatePermissionMatrixRequestSchema, type UpdateProductFullDto, UpdateProductFullDtoSchema, type UpdateStockRequest, UpdateStockRequestSchema, type UpdateStocktakeLineRequest, UpdateStocktakeLineRequestSchema, type UpdateStocktakeRequest, UpdateStocktakeRequestSchema, type UpdateUserRequest, UpdateUserRequestSchema, type User, type UserPreferences, UserPreferencesSchema, type UserProfile, UserProfileSchema, UserRole, type UserRoleType, UserSchema, UserStatus, type UserStatusType, VIEW_AS_HEADER, VIEW_AS_OPTIONS, type ViewAsOption, WORKBOOK_CHUNK_MAX_ROWS, WORKBOOK_LOAD_ORDER, type WorkbookChunkRequest, WorkbookChunkRequestSchema, type WorkbookChunkResult, WorkbookChunkResultSchema, type WorkbookLoadTable, absorbFile, aiInputLimit, aliasKey, aliasOk, allowedSteps, applyRoadmapEdit, assignOccurrences, bcDate, bcEventKind, bcItemNoFromSku, buildArticleLayout, buildBarExportRows, buildBlocks, buildCoinExportRows, buildJournalExportRows, buildNameLookup, buildPortfolioStrategies, buildRegisterExportRows, bundleScopeFiles, calculateProductPrice, canSeeKbVisibility, capabilitiesFor, classifyCpty, classifySection, classifyTab, coerceCell, coinTokens, compareProcedures, compareProducts, compareSerials, compareStockLabels, computeCurrentBuybackValue, computeMeltValue, computeProfit, computeRequiredSpotForTarget, computeTransactionPrice, computeVariance, coreRef, countTasks, createErrorReference, customerOrderChanges, customerSafeRow, deriveMetalHint, deriveOrder, deriveTradeState, detectBcHistoryKind, detectDateOrder, detectFileType, detectTabType, diffOverrides, diffPermissionMatrix, diffUserChanges, effectivePermissions, effectiveVatRate, expectedCustomerStock, extractQtyAndProduct, extractSources, fakeRedactionMap, fakeWorkbookSheets, fillKind, findAppOnlyTasks, findBrokenLinks, findDuplicateSerials, findHeaderRow, findLinks, findTodos, fingerprint, flowBarFor, flowNextSlug, guessSheetMonth, guessSheetMonthFromTabs, guideLibraryTargets, headingAnchor, homePathFor, indexKbDocument, isBondedProduct, isCashOverThreshold, isClosingBar, isMuted, isOpenOrder, isPhysicallyHere, isRealSerial, isRealTradeYear, isReferenceCell, isSpotMarketClosed, isStopStep, itemStatusAfter, kbArticlePath, kbReviewDueOn, kbReviewStatus, limitQuery, lineMatchesKey, linkOrdersToTradesheet, listedRefinery, liveRefinery, liveSerialKey, mapBcHistory, mapBcReport, mapOutsideCode, mapPurchaseHeaders, mapSaleHeaders, matchLines, matchProductName, matchTradeLine, meltLabel, mergeMetalPrices, mergeRoadmap, metalAwareAlias, metalInText, metalsFitting, nextAction, normaliseBackfillHeaders, normaliseName, normaliseProductText, normaliseRefinery, normalizeClient, normalizeProductName, normalizeReference, normalizeSerial, onHandSerials, orderLifecycle, orderSource, parseBarWeight, parseBarsPaste, parseBlocks, parseCoinName, parseCoinsPaste, parseCustomerOrdersPaste, parseDecisions, parseDeferredLinks, parseDesignDoc, parseJournalPaste, parseKbDocument, parseMetal, parsePastedTable, parseProductName, parsePurchaseRow, parseQuantity, parseReference, parseRoadmap, parseSaleRow, parseScopeBundle, parseScopeFile, parseSheetDate, parseSheetNumber, parseSoldComment, parseTrackingPaste, parseTradesheetPaste, parseTsv, parseUserAgent, parseViewAs, parseWeight, parseWeightGrams, planAutolinks, planBarImport, planBaseline, planCustomerOrderImport, planRow, planUpload, priceMetalEvidence, pricingSkuFor, procedureFlow, productStockKey, productStockLevels, readCollected, readForeignCoin, readImportWorkbook, readProduct, referenceMatchKey, refineryInText, refineryMatch, refineryWords, renderQuoteText, resolveAnalyticsPeriod, resolveProduct, resolveRowProduct, rewriteKbLinks, roundBuyPrice, roundSellPrice, rowIsBlank, ruleTone, searchKb, serialKey, shareTermsAcrossBlocks, sheetTasksForStep, solveMissingPurchaseField, sortBranchCodes, splitDocSections, splitFrontmatter, splitScopeBundle, splitSections, splitSerials, spotFreshness, spotLookup, stripHeader, suggestProductForBcItem, summarizeBars, summarizeLines, taskShowsDone, termRegExp, toCsv, toIsoDate, toPlainText, totalCounted, unredactTables, variantGrams, withoutOptionalColumns };
