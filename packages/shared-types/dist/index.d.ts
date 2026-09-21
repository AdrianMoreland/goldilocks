import { z } from 'zod';

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
    marketValue: z.ZodOptional<z.ZodNumber>;
    priceSellVatExcl: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodOptional<z.ZodNumber>;
    priceSell: z.ZodOptional<z.ZodNumber>;
    priceBuy: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
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

export { type ApiErrorResponse, ApiErrorResponseSchema, type ApiSuccessResponse, ApiSuccessResponseSchema, type AuthResponse, AuthResponseSchema, type Branch, BranchSchema, type ChangePasswordInput, ChangePasswordSchema, type CreateBranchRequest, CreateBranchRequestSchema, type CreateProductDto, CreateProductDtoSchema, type CreateSpotPriceDto, CreateSpotPriceDtoSchema, type CreateUserRequest, CreateUserRequestSchema, CurrencyEnum, GRAMS_PER_TROY_OUNCE, type HealthCheck, HealthCheckSchema, type HistoricSpot, HistoricSpotSchema, type LoginInput, type LoginRequest, LoginRequestSchema, type LoginResponse, LoginResponseSchema, LoginSchema, MELT_CATEGORIES, type MarketDataResponse, MarketDataResponseSchema, type MeltCalculatorRequest, MeltCalculatorRequestSchema, type MeltCalculatorResponse, MeltCalculatorResponseSchema, type MeltCategoryData, MeltCategoryDataSchema, type MeltCategoryKey, MeltCategoryKeyEnum, type MessageResponse, MessageResponseSchema, type MetalSymbol, MetalSymbolSchema, type MetalType, MetalTypeEnum, PORTFOLIO_MAX_QTY, PORTFOLIO_SMALL_INVESTOR_LIMIT, type Pagination, PaginationSchema, Platform, type PlatformType, type PortfolioBuildRequest, PortfolioBuildRequestSchema, type PortfolioBuildResponse, PortfolioBuildResponseSchema, type PortfolioCandidateProduct, type PortfolioCandidateResult, type PortfolioLineItem, type PortfolioLineItemDto, PortfolioLineItemSchema, type PortfolioProductType, type PortfolioProductTypeFilter, PortfolioProductTypeFilterEnum, type PortfolioStrategyId, type PortfolioStrategyResult, type PortfolioStrategyResultDto, PortfolioStrategyResultSchema, type PriorityStrength, PriorityStrengthEnum, type Product, ProductArraySchema, type ProductMapDTO, ProductMapSchema, ProductSchema, type Products, ProductsSchema, type ProfitAnalysisMissingField, type ProfitAnalysisMissingFieldDto, ProfitAnalysisMissingFieldEnum, type ProfitAnalysisRequest, ProfitAnalysisRequestSchema, type ProfitAnalysisResponse, ProfitAnalysisResponseSchema, type RawProduct, RawProductSchema, type RawSpotPrice, RawSpotPriceSchema, type RefreshResponse, RefreshResponseSchema, type RegisterInput, RegisterSchema, type SessionUser, SessionUserRoleEnum, SessionUserSchema, type SpotPrice, SpotPriceArraySchema, type SpotPriceMapDTO, SpotPriceMapSchema, SpotPriceSchema, TRADE_METAL_SLIDER_BOUNDS, type TaskQueryParams, TaskQueryParamsSchema, type TaskStatus, TaskStatusSchema, type TradeBootstrapResponse, TradeBootstrapResponseSchema, type TradeCartItemRequest, TradeCartItemRequestSchema, type TradeCartLine, TradeCartLineSchema, type TradeCartRequest, TradeCartRequestSchema, type TradeCartResponse, TradeCartResponseSchema, type TradeProduct, TradeProductSchema, type TradeTransactionType, TradeTransactionTypeEnum, type UpdateProductFullDto, UpdateProductFullDtoSchema, type User, type UserProfile, UserProfileSchema, UserRole, type UserRoleType, UserSchema, UserStatus, type UserStatusType, buildPortfolioStrategies, computeCurrentBuybackValue, computeMeltValue, computeProfit, computeRequiredSpotForTarget, computeTransactionPrice, solveMissingPurchaseField };
