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
/** Which tier actually satisfied this read — Redis cache, Postgres, or a fresh call to the live vendor API. Optional: only the two "how did we get this price" cascades (getAllLatestForLaunch/refreshAll) bother tagging it. */
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
    fetchedAt: z.ZodISODateTime;
    priceWarning: z.ZodNullable<z.ZodString>;
    degradedMetals: z.ZodArray<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
}, z.core.$strip>;
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
    fetchedAt: z.ZodISODateTime;
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
 * How old a live spot snapshot can be before prices may be out of date. The
 * cron refreshes every 10 minutes, so 15 survives one missed run without
 * flagging a healthy snapshot. Read by the dashboard cards and the assistant.
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
 * it. Throws a plain Error with a user-facing message on invalid input —
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
 * plain Error with a user-facing message on invalid input — callers in an
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
}, z.core.$strip>;
type SessionUser = z.infer<typeof SessionUserSchema>;
declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type LoginRequest = z.infer<typeof LoginRequestSchema>;
declare const LoginResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
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
    }, z.core.$strip>;
}, z.core.$strip>;
type LoginResponse = z.infer<typeof LoginResponseSchema>;
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
}, z.core.$strip>;
type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

declare const CurrencyEnum: z.ZodEnum<{
    EUR: "EUR";
    USD: "USD";
    GBP: "GBP";
}>;
declare const BranchSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
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
    currency: z.ZodDefault<z.ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
    }>>;
}, z.core.$strip>;
type Branch = z.infer<typeof BranchSchema>;
type CreateBranchRequest = z.infer<typeof CreateBranchRequestSchema>;

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
/** "E-7F3K2" — short enough to read out over the phone. */
declare function createErrorReference(): string;

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
    all: "all";
    IE: "IE";
    UK: "UK";
    ES: "ES";
}>;
type KbJurisdiction = z.infer<typeof KbJurisdictionEnum>;
/** draft: visible with a "Not yet approved" banner · approved: visible · retired: hidden from staff, kept for audit. */
declare const KbStatusEnum: z.ZodEnum<{
    draft: "draft";
    approved: "approved";
    retired: "retired";
}>;
type KbStatus = z.infer<typeof KbStatusEnum>;
/** Matches the README's slug rule. Never changes after approval — links depend on it. */
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
        all: "all";
        IE: "IE";
        UK: "UK";
        ES: "ES";
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
        all: "all";
        IE: "IE";
        UK: "UK";
        ES: "ES";
    }>;
    owner: z.ZodString;
    status: z.ZodEnum<{
        draft: "draft";
        approved: "approved";
        retired: "retired";
    }>;
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
            all: "all";
            IE: "IE";
            UK: "UK";
            ES: "ES";
        }>;
        owner: z.ZodString;
        status: z.ZodEnum<{
            draft: "draft";
            approved: "approved";
            retired: "retired";
        }>;
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

/** Applies `fn` to the text outside fenced blocks and inline code, leaving code untouched. */
declare function mapOutsideCode(markdown: string, fn: (text: string) => string): string;
interface RawKbFile {
    data: Record<string, string>;
    body: string;
}
/** Flat `key: value` frontmatter between `---` fences. Nothing nested — the SOP format doesn't need it. */
declare function splitFrontmatter(raw: string): RawKbFile | null;
/** "Identity check" → "identity-check", "Customer safe (CST Safe)" → "customer-safe-cst-safe". */
declare function headingAnchor(text: string): string;
interface KbSection {
    /** Citation anchor, unique within the document. Empty for the text before the first heading. */
    anchor: string;
    heading: string;
    /** Section body without its heading line. */
    markdown: string;
    /** Contains at least one `[TODO: …]` — the fact is unconfirmed, so nobody (human or AI) should rely on it. */
    hasTodo: boolean;
    /** The text of each TODO, for showing "what needs confirming". */
    todos: string[];
    /** "Proposed controls (not yet in force)" — intended practice, not current practice. */
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
}
/** Path of an article in the web app — also what the README says the importer rewrites links to. */
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
 * The Knowledge Center's front door: a flowchart that starts from the one
 * question every desk interaction begins with — who is paying whom? — and
 * then chains the steps, each pointing at the exact SOP section that answers
 * "what do I do now?".
 *
 * This is navigation, not content: the SOP files stay the owners'. It lives
 * here (plain data, no UI imports) so a test can check every target against
 * the real SOP files — an owner renaming a heading must fail a test, not
 * silently break a link on the desk's most-used page.
 *
 * Wording follows the product vocabulary: "Price" is what the customer pays
 * us, "Buyback" is what we pay the customer — never "Sell"/"Buy".
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
interface KbGuideStep {
    title: string;
    hint: string;
    icon: KbGuideIcon;
    target: KbGuideTarget;
}
interface KbGuideLink {
    label: string;
    target: KbGuideTarget;
}
interface KbGuideBranch {
    id: 'price' | 'buyback';
    title: string;
    /** Who is buying, in plain words. */
    tag: string;
    blurb: string;
    icon: KbGuideIcon;
    steps: KbGuideStep[];
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
interface KbGuide {
    start: {
        title: string;
        hint: string;
    };
    branches: KbGuideBranch[];
    quickLinks: KbGuideShortcut[];
    tools: KbGuideShortcut[];
}
declare const KB_GUIDE: KbGuide;
/** Every library target the guide points at, for tests and for the web app's resolver. */
declare function guideLibraryTargets(guide?: KbGuide): {
    slug: string;
    anchor?: string;
    pendingSop: boolean;
}[];

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
 * is linked only where it first appears — repeating a link on every mention
 * turns a page into a wall of underlines — and never to the article you are
 * already reading. `isAvailable` lets the caller drop targets that aren't in
 * the library (retired, or not written yet).
 */
declare function planAutolinks(sections: {
    anchor: string;
    heading: string;
    markdown: string;
}[], currentSlug: string, isAvailable: (target: KbTerm['target']) => boolean, terms?: KbTerm[]): Map<string, KbTerm[]>;

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
 * One question in, one answer out — no conversation history is sent.
 */
/**
 * What the staff member wants from the assistant:
 *  procedures — answer a question about how the desk works (from the approved SOPs)
 *  email      — they pasted a customer's email; draft a reply to send back
 *  whatsapp   — the same, for a WhatsApp message (shorter, less formal)
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
 * answered — answered from the SOPs, with at least one valid citation
 * refused  — the approved SOPs don't cover it (or it isn't confirmed), and the assistant said so
 * uncited  — the model answered but cited nothing the library recognises; shown with a warning
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
 *  delta — a piece of the answer as the model writes it (shown live, may still be corrected)
 *  tool  — the assistant is looking something up (e.g. a price); no text yet
 *  done  — the final, validated answer; the reader replaces whatever it streamed with this
 *  error — the question could not be answered; `status` is the HTTP status it would have had
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
        header: "header";
        query: "query";
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
            header: "header";
            query: "query";
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
                header: "header";
                query: "query";
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

export { AI_MESSAGE_MAX_LENGTH, AI_QUESTION_MAX_LENGTH, type AdminLogEntry, AdminLogEntrySchema, AdminLogsResponseSchema, type AdminOverview, AdminOverviewSchema, type AiAnswerStatus, AiAnswerStatusEnum, type AiCitation, AiCitationSchema, type AiMode, AiModeEnum, type AiSpotNote, AiSpotNoteSchema, type AiStatus, AiStatusSchema, type AiUsage, AiUsageSchema, ApiCatalogueSchema, type ApiEndpoint, type ApiEndpointParameter, ApiEndpointParameterSchema, ApiEndpointSchema, type ApiErrorResponse, ApiErrorResponseSchema, type ApiSuccessResponse, ApiSuccessResponseSchema, type AskRequest, type AskRequestInput, AskRequestSchema, type AskResponse, AskResponseSchema, type AskStreamEvent, AskStreamEventSchema, type AuditEntry, AuditEntrySchema, AuditLogResponseSchema, type AuthResponse, AuthResponseSchema, type Branch, BranchSchema, type BrokenKbLink, type ChangePasswordInput, ChangePasswordSchema, type ClientErrorReport, type ClientErrorReportBatch, ClientErrorReportBatchSchema, ClientErrorReportSchema, type CreateBranchRequest, CreateBranchRequestSchema, type CreateProductDto, CreateProductDtoSchema, type CreateSpotPriceDto, CreateSpotPriceDtoSchema, type CreateUserRequest, CreateUserRequestSchema, CurrencyEnum, type DbColumn, DbColumnSchema, type DbDeleteRequest, DbDeleteRequestSchema, type DbInsertRequest, DbInsertRequestSchema, DbRowResponseSchema, type DbRowsResponse, DbRowsResponseSchema, type DbTableSummary, DbTableSummarySchema, DbTablesResponseSchema, type DbUpdateRequest, DbUpdateRequestSchema, type DesignDoc, type DesignRule, type DesignTokens, type DocSection, type ErrorLogEntry, ErrorLogEntrySchema, type ErrorLogKind, ErrorLogKindEnum, type ErrorLogSeverity, ErrorLogSeverityEnum, type ErrorLogSource, ErrorLogSourceEnum, type FetchAttempt, FetchAttemptSchema, type FetchMetrics, FetchMetricsSchema, type FetchSource, FetchSourceEnum, type FetchTrigger, FetchTriggerEnum, GRAMS_PER_TROY_OUNCE, type HealthCheck, HealthCheckSchema, type HealthItem, HealthItemSchema, type HealthStatus, HealthStatusEnum, type HistoricCloseQuery, HistoricCloseQuerySchema, type HistoricSpot, HistoricSpotSchema, type HourlyStats, HourlyStatsSchema, KB_CATEGORIES, KB_CATEGORY_INFO, KB_GUIDE, KB_REVIEW_MONTHS, KB_REVIEW_WARNING_DAYS, KB_TERMS, KB_UNRESOLVED_HREF_PREFIX, type KbCategory, KbCategoryEnum, type KbDocument, type KbDocumentListResponse, KbDocumentListResponseSchema, KbDocumentSchema, type KbFrontmatter, KbFrontmatterSchema, type KbGuide, type KbGuideBranch, type KbGuideIcon, type KbGuideLink, type KbGuideShortcut, type KbGuideStep, type KbGuideTarget, type KbIndexedDocument, type KbIndexedSection, type KbJurisdiction, KbJurisdictionEnum, type KbLinkRef, type KbReviewState, type KbReviewStatus, type KbSearchHit, type KbSection, KbSlugSchema, type KbSnippetPart, type KbStatus, KbStatusEnum, type KbTerm, type LogLevel, LogLevelEnum, type LoginInput, type LoginRequest, LoginRequestSchema, type LoginResponse, LoginResponseSchema, LoginSchema, MELT_CATEGORIES, type MarketDataResponse, MarketDataResponseSchema, type MarketModeState, MarketModeStateSchema, type MeltCalculatorRequest, MeltCalculatorRequestSchema, type MeltCalculatorResponse, MeltCalculatorResponseSchema, type MeltCategoryData, MeltCategoryDataSchema, type MeltCategoryKey, MeltCategoryKeyEnum, type MessageResponse, MessageResponseSchema, type MetalSymbol, MetalSymbolSchema, type MetalType, MetalTypeEnum, PORTFOLIO_MAX_QTY, PORTFOLIO_SMALL_INVESTOR_LIMIT, type Pagination, PaginationSchema, type ParseKbResult, type ParsedKbDocument, Platform, type PlatformType, type PortfolioBuildRequest, PortfolioBuildRequestSchema, type PortfolioBuildResponse, PortfolioBuildResponseSchema, type PortfolioCandidateProduct, type PortfolioCandidateResult, type PortfolioLineItem, type PortfolioLineItemDto, PortfolioLineItemSchema, type PortfolioProductType, type PortfolioProductTypeFilter, PortfolioProductTypeFilterEnum, type PortfolioStrategyId, type PortfolioStrategyResult, type PortfolioStrategyResultDto, PortfolioStrategyResultSchema, type PriorityStrength, PriorityStrengthEnum, type Product, ProductArraySchema, type ProductCategory, ProductCategoryEnum, type ProductMapDTO, ProductMapSchema, ProductSchema, type Products, ProductsSchema, type ProfitAnalysisMissingField, type ProfitAnalysisMissingFieldDto, ProfitAnalysisMissingFieldEnum, type ProfitAnalysisRequest, ProfitAnalysisRequestSchema, type ProfitAnalysisResponse, ProfitAnalysisResponseSchema, type RawKbFile, type RawProduct, RawProductSchema, type RawSpotPrice, RawSpotPriceSchema, type RecalculateOverrides, RecalculateOverridesSchema, type RefreshResponse, RefreshResponseSchema, type RegisterInput, RegisterSchema, type ResolvedKbLink, type RoadmapDocument, RoadmapDocumentSchema, type RoadmapEdit, RoadmapEditError, type RoadmapEditRequest, RoadmapEditRequestSchema, RoadmapEditSchema, type RoadmapProgress, type RoadmapSection, type RoadmapTask, type RouteStats, RouteStatsSchema, SPOT_STALE_AFTER_MS, type SessionUser, SessionUserRoleEnum, SessionUserSchema, type SetKbStatusRequest, SetKbStatusRequestSchema, type SpotPrice, SpotPriceArraySchema, type SpotPriceMapDTO, SpotPriceMapSchema, SpotPriceSchema, TRADE_METAL_SLIDER_BOUNDS, TableSizeSchema, type TaskQueryParams, TaskQueryParamsSchema, type TaskStatus, TaskStatusSchema, type TradeBootstrapResponse, TradeBootstrapResponseSchema, type TradeCartItemRequest, TradeCartItemRequestSchema, type TradeCartLine, TradeCartLineSchema, type TradeCartRequest, TradeCartRequestSchema, type TradeCartResponse, TradeCartResponseSchema, type TradeProduct, TradeProductSchema, type TradeTransactionType, TradeTransactionTypeEnum, type UpdateKbDocumentRequest, UpdateKbDocumentRequestSchema, type UpdateMarketModeRequest, UpdateMarketModeRequestSchema, type UpdateProductFullDto, UpdateProductFullDtoSchema, type UpdateStockRequest, UpdateStockRequestSchema, type User, type UserProfile, UserProfileSchema, UserRole, type UserRoleType, UserSchema, UserStatus, type UserStatusType, aiInputLimit, applyRoadmapEdit, buildPortfolioStrategies, computeCurrentBuybackValue, computeMeltValue, computeProfit, computeRequiredSpotForTarget, computeTransactionPrice, countTasks, createErrorReference, findBrokenLinks, findLinks, findTodos, guideLibraryTargets, headingAnchor, indexKbDocument, kbArticlePath, kbReviewDueOn, kbReviewStatus, mapOutsideCode, normalizeProductName, parseDesignDoc, parseKbDocument, parseRoadmap, planAutolinks, rewriteKbLinks, roundBuyPrice, roundSellPrice, searchKb, solveMissingPurchaseField, splitDocSections, splitFrontmatter, splitSections, termRegExp, toPlainText };
