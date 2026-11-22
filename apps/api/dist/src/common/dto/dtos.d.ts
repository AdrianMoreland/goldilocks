declare const LoginRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodString;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class LoginRequestDto extends LoginRequestDto_base {
}
declare const LoginResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    accessToken: import("zod").ZodString;
    refreshToken: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodString>>;
    user: import("zod").ZodObject<{
        id: import("zod").ZodString;
        email: import("zod").ZodString;
        firstName: import("zod").ZodString;
        lastName: import("zod").ZodString;
        role: import("zod").ZodEnum<{
            ADMIN: "ADMIN";
            MANAGER: "MANAGER";
            SALES: "SALES";
            ACCOUNTING: "ACCOUNTING";
            AUDITOR: "AUDITOR";
        }>;
        admin: import("zod").ZodBoolean;
        branch: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodObject<{
            id: import("zod").ZodNumber;
            name: import("zod").ZodString;
            region: import("zod").ZodEnum<{
                IE: "IE";
                UK: "UK";
                ES: "ES";
            }>;
        }, import("zod/v4/core").$strip>>>;
        uiSettings: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodObject<{
            mode: import("zod").ZodEnum<{
                dark: "dark";
                light: "light";
            }>;
            look: import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
        }, import("zod/v4/core").$strip>>>;
        canViewAs: import("zod").ZodDefault<import("zod").ZodBoolean>;
        viewAs: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodString>>;
    }, import("zod/v4/core").$strip>;
}, import("zod/v4/core").$strip>, false>;
export declare class LoginResponseDto extends LoginResponseDto_base {
}
declare const SessionUserDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    email: import("zod").ZodString;
    firstName: import("zod").ZodString;
    lastName: import("zod").ZodString;
    role: import("zod").ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: import("zod").ZodBoolean;
    branch: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodObject<{
        id: import("zod").ZodNumber;
        name: import("zod").ZodString;
        region: import("zod").ZodEnum<{
            IE: "IE";
            UK: "UK";
            ES: "ES";
        }>;
    }, import("zod/v4/core").$strip>>>;
    uiSettings: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodObject<{
        mode: import("zod").ZodEnum<{
            dark: "dark";
            light: "light";
        }>;
        look: import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
    }, import("zod/v4/core").$strip>>>;
    canViewAs: import("zod").ZodDefault<import("zod").ZodBoolean>;
    viewAs: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class SessionUserDto extends SessionUserDto_base {
}
declare const UiSettingsRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    mode: import("zod").ZodEnum<{
        dark: "dark";
        light: "light";
    }>;
    look: import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UiSettingsRequestDto extends UiSettingsRequestDto_base {
}
declare const SetUserBranchRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    branchId: import("zod").ZodNullable<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class SetUserBranchRequestDto extends SetUserBranchRequestDto_base {
}
declare const SetKbVisibilityRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    visibility: import("zod").ZodEnum<{
        all: "all";
        ie_only: "ie_only";
    }>;
}, import("zod/v4/core").$strip>, false>;
export declare class SetKbVisibilityRequestDto extends SetKbVisibilityRequestDto_base {
}
declare const CreateUserRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodString;
    password: import("zod").ZodString;
    firstName: import("zod").ZodString;
    lastName: import("zod").ZodString;
    role: import("zod").ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: import("zod").ZodDefault<import("zod").ZodBoolean>;
    branchId: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodNumber>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateUserRequestDto extends CreateUserRequestDto_base {
}
declare const MessageResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    success: import("zod").ZodLiteral<true>;
    data: import("zod").ZodObject<{
        message: import("zod").ZodString;
    }, import("zod/v4/core").$strip>;
    message: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class MessageResponseDto extends MessageResponseDto_base {
}
declare const HealthCheckDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    status: import("zod").ZodLiteral<"ok">;
    timestamp: import("zod").ZodISODateTime;
    uptime: import("zod").ZodNumber;
    environment: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class HealthCheckDto extends HealthCheckDto_base {
}
declare const RawSpotPriceResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: import("zod").ZodNumber;
    priceGbp: import("zod").ZodNumber;
    source: import("zod").ZodString;
    timestamp: import("zod").ZodISODateTime;
    createdAt: import("zod").ZodISODateTime;
    fetchSource: import("zod").ZodOptional<import("zod").ZodEnum<{
        cache: "cache";
        db: "db";
        live: "live";
    }>>;
    isFallback: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class RawSpotPriceResponseDto extends RawSpotPriceResponseDto_base {
}
declare const SpotPriceResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    priceEur: import("zod").ZodNumber;
    priceGbp: import("zod").ZodNumber;
    previousClose: import("zod").ZodNumber;
    change: import("zod").ZodNumber;
    changePercent: import("zod").ZodNumber;
    source: import("zod").ZodString;
    timestamp: import("zod").ZodISODateTime;
    createdAt: import("zod").ZodISODateTime;
    fetchSource: import("zod").ZodOptional<import("zod").ZodEnum<{
        cache: "cache";
        db: "db";
        live: "live";
    }>>;
    isFallback: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class SpotPriceResponseDto extends SpotPriceResponseDto_base {
}
declare const CreateSpotPriceDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    title: import("zod").ZodString;
    description: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateSpotPriceDto extends CreateSpotPriceDto_base {
}
declare const CreateProductDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    sku: import("zod").ZodString;
    name: import("zod").ZodString;
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: import("zod").ZodNumber;
    spreadBuy: import("zod").ZodNumber;
    spreadSell: import("zod").ZodNumber;
    vatRate: import("zod").ZodNumber;
    stock: import("zod").ZodNumber;
    category: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateProductDto extends CreateProductDto_base {
}
declare const ProductResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodNumber;
    sku: import("zod").ZodString;
    name: import("zod").ZodString;
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    weight: import("zod").ZodNumber;
    spotPrice: import("zod").ZodNumber;
    spreadBuy: import("zod").ZodNumber;
    spreadSell: import("zod").ZodNumber;
    vatRate: import("zod").ZodNumber;
    category: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>;
    description: import("zod").ZodString;
    marketValue: import("zod").ZodNumber;
    priceSell: import("zod").ZodNumber;
    priceSellVatExcl: import("zod").ZodNumber;
    priceBuy: import("zod").ZodNumber;
    stock: import("zod").ZodNumber;
    isActive: import("zod").ZodBoolean;
    updatedAt: import("zod").ZodPreprocess<import("zod").ZodISODateTime>;
    createdAt: import("zod").ZodPreprocess<import("zod").ZodISODateTime>;
}, import("zod/v4/core").$strip>, false>;
export declare class ProductResponseDto extends ProductResponseDto_base {
}
declare const UpdateProductDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodOptional<import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
    description: import("zod").ZodOptional<import("zod").ZodString>;
    sku: import("zod").ZodOptional<import("zod").ZodString>;
    name: import("zod").ZodOptional<import("zod").ZodString>;
    weight: import("zod").ZodOptional<import("zod").ZodNumber>;
    spotPrice: import("zod").ZodOptional<import("zod").ZodNumber>;
    spreadBuy: import("zod").ZodOptional<import("zod").ZodNumber>;
    spreadSell: import("zod").ZodOptional<import("zod").ZodNumber>;
    vatRate: import("zod").ZodOptional<import("zod").ZodNumber>;
    category: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>>>>;
    marketValue: import("zod").ZodOptional<import("zod").ZodNumber>;
    priceSellVatExcl: import("zod").ZodOptional<import("zod").ZodNumber>;
    stock: import("zod").ZodOptional<import("zod").ZodNumber>;
    priceSell: import("zod").ZodOptional<import("zod").ZodNumber>;
    priceBuy: import("zod").ZodOptional<import("zod").ZodNumber>;
    isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
    expectedUpdatedAt: import("zod").ZodOptional<import("zod").ZodISODateTime>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
declare const UpdateStockRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    stock_quantity: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateStockRequestDto extends UpdateStockRequestDto_base {
}
declare const SpotStatusResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    snapshotAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    lastFetchAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    autoRefreshPaused: import("zod").ZodBoolean;
    degradedMetals: import("zod").ZodArray<import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class SpotStatusResponseDto extends SpotStatusResponseDto_base {
}
declare const MarketDataResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    spotPrices: import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodString;
        metalType: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        priceEur: import("zod").ZodNumber;
        priceGbp: import("zod").ZodNumber;
        previousClose: import("zod").ZodNumber;
        change: import("zod").ZodNumber;
        changePercent: import("zod").ZodNumber;
        source: import("zod").ZodString;
        timestamp: import("zod").ZodISODateTime;
        createdAt: import("zod").ZodISODateTime;
        fetchSource: import("zod").ZodOptional<import("zod").ZodEnum<{
            cache: "cache";
            db: "db";
            live: "live";
        }>>;
        isFallback: import("zod").ZodOptional<import("zod").ZodBoolean>;
    }, import("zod/v4/core").$strip>>;
    historicSpot: import("zod").ZodArray<import("zod").ZodObject<{
        metalType: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        priceEur: import("zod").ZodNumber;
        priceGbp: import("zod").ZodNumber;
        timestamp: import("zod").ZodISODateTime;
    }, import("zod/v4/core").$strip>>;
    products: import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodNumber;
        sku: import("zod").ZodString;
        name: import("zod").ZodString;
        metalType: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        weight: import("zod").ZodNumber;
        spotPrice: import("zod").ZodNumber;
        spreadBuy: import("zod").ZodNumber;
        spreadSell: import("zod").ZodNumber;
        vatRate: import("zod").ZodNumber;
        category: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
            BAR: "BAR";
            COIN: "COIN";
        }>>>;
        description: import("zod").ZodString;
        marketValue: import("zod").ZodNumber;
        priceSell: import("zod").ZodNumber;
        priceSellVatExcl: import("zod").ZodNumber;
        priceBuy: import("zod").ZodNumber;
        stock: import("zod").ZodNumber;
        isActive: import("zod").ZodBoolean;
        updatedAt: import("zod").ZodPreprocess<import("zod").ZodISODateTime>;
        createdAt: import("zod").ZodPreprocess<import("zod").ZodISODateTime>;
    }, import("zod/v4/core").$strip>>;
    snapshotAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    lastFetchAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    autoRefreshPaused: import("zod").ZodBoolean;
    priceWarning: import("zod").ZodNullable<import("zod").ZodString>;
    degradedMetals: import("zod").ZodArray<import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class MarketDataResponseDto extends MarketDataResponseDto_base {
}
declare const RecalculateOverridesDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    GOLD: import("zod").ZodOptional<import("zod").ZodNumber>;
    SILVER: import("zod").ZodOptional<import("zod").ZodNumber>;
    PLATINUM: import("zod").ZodOptional<import("zod").ZodNumber>;
    PALLADIUM: import("zod").ZodOptional<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class RecalculateOverridesDto extends RecalculateOverridesDto_base {
}
declare const RefreshRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    refreshToken: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class RefreshRequestDto extends RefreshRequestDto_base {
}
declare const AdminLogsQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    limit: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
    level: import("zod").ZodDefault<import("zod").ZodEnum<{
        error: "error";
        trace: "trace";
        debug: "debug";
        info: "info";
        warn: "warn";
        fatal: "fatal";
    }>>;
    q: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class AdminLogsQueryDto extends AdminLogsQueryDto_base {
}
declare const AuditQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    limit: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class AuditQueryDto extends AuditQueryDto_base {
}
declare const ErrorLogQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    limit: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class ErrorLogQueryDto extends ErrorLogQueryDto_base {
}
declare const FetchLogQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    limit: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class FetchLogQueryDto extends FetchLogQueryDto_base {
}
declare const DbRowsQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    page: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
    pageSize: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
    sort: import("zod").ZodOptional<import("zod").ZodString>;
    dir: import("zod").ZodDefault<import("zod").ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class DbRowsQueryDto extends DbRowsQueryDto_base {
}
declare const BackfillHistoryQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    years: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class BackfillHistoryQueryDto extends BackfillHistoryQueryDto_base {
}
declare const HistoricCloseQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    date: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class HistoricCloseQueryDto extends HistoricCloseQueryDto_base {
}
declare const TradeBootstrapResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    spot: import("zod").ZodNumber;
    minSpot: import("zod").ZodNumber;
    maxSpot: import("zod").ZodNumber;
    products: import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodNumber;
        sku: import("zod").ZodString;
        name: import("zod").ZodString;
        weight: import("zod").ZodNumber;
        metalType: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
        premiumPct: import("zod").ZodNumber;
        discountPct: import("zod").ZodNumber;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class TradeBootstrapResponseDto extends TradeBootstrapResponseDto_base {
}
declare const TradeCartRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    transactionType: import("zod").ZodEnum<{
        buying: "buying";
        selling: "selling";
    }>;
    customSpot: import("zod").ZodOptional<import("zod").ZodCoercedNumber<unknown>>;
    items: import("zod").ZodArray<import("zod").ZodObject<{
        productId: import("zod").ZodNumber;
        quantity: import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
        percent: import("zod").ZodCoercedNumber<unknown>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class TradeCartRequestDto extends TradeCartRequestDto_base {
}
declare const TradeCartResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    transactionType: import("zod").ZodEnum<{
        buying: "buying";
        selling: "selling";
    }>;
    spot: import("zod").ZodNumber;
    lines: import("zod").ZodArray<import("zod").ZodObject<{
        productId: import("zod").ZodNumber;
        product: import("zod").ZodString;
        sku: import("zod").ZodString;
        weight: import("zod").ZodNumber;
        quantity: import("zod").ZodNumber;
        percent: import("zod").ZodNumber;
        unitPrice: import("zod").ZodNumber;
        lineTotal: import("zod").ZodNumber;
    }, import("zod/v4/core").$strip>>;
    totalWeight: import("zod").ZodNumber;
    averagePerGram: import("zod").ZodNumber;
    totalPrice: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class TradeCartResponseDto extends TradeCartResponseDto_base {
}
declare const MeltCalculatorRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    category: import("zod").ZodEnum<{
        "24ct": "24ct";
        "22ct": "22ct";
        "90%": "90%";
        Silver: "Silver";
    }>;
    weight: import("zod").ZodCoercedNumber<unknown>;
    customSpot: import("zod").ZodOptional<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class MeltCalculatorRequestDto extends MeltCalculatorRequestDto_base {
}
declare const MeltCalculatorResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    category: import("zod").ZodEnum<{
        "24ct": "24ct";
        "22ct": "22ct";
        "90%": "90%";
        Silver: "Silver";
    }>;
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    spot: import("zod").ZodNumber;
    spotPerGram: import("zod").ZodNumber;
    meltFactor: import("zod").ZodNumber;
    purity: import("zod").ZodNumber;
    weight: import("zod").ZodNumber;
    meltValue: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class MeltCalculatorResponseDto extends MeltCalculatorResponseDto_base {
}
declare const ProfitAnalysisRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    productId: import("zod").ZodNumber;
    purchaseSpot: import("zod").ZodCoercedNumber<unknown>;
    purchasePremium: import("zod").ZodCoercedNumber<unknown>;
    purchasePrice: import("zod").ZodCoercedNumber<unknown>;
    missingField: import("zod").ZodEnum<{
        spot: "spot";
        premium: "premium";
        price: "price";
    }>;
    currentSpot: import("zod").ZodCoercedNumber<unknown>;
    currentDiscount: import("zod").ZodCoercedNumber<unknown>;
    targetProfit: import("zod").ZodCoercedNumber<unknown>;
}, import("zod/v4/core").$strip>, false>;
export declare class ProfitAnalysisRequestDto extends ProfitAnalysisRequestDto_base {
}
declare const ProfitAnalysisResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    product: import("zod").ZodString;
    productMultiplier: import("zod").ZodNumber;
    purchaseSpot: import("zod").ZodNumber;
    purchasePremium: import("zod").ZodNumber;
    purchasePrice: import("zod").ZodNumber;
    currentSpot: import("zod").ZodNumber;
    currentDiscount: import("zod").ZodNumber;
    currentBuybackValue: import("zod").ZodNumber;
    profit: import("zod").ZodNumber;
    profitPercent: import("zod").ZodNumber;
    requiredSpot: import("zod").ZodNumber;
    requiredPrice: import("zod").ZodNumber;
    targetProfit: import("zod").ZodNumber;
    targetReturn: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class ProfitAnalysisResponseDto extends ProfitAnalysisResponseDto_base {
}
declare const PortfolioBuildRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    budget: import("zod").ZodCoercedNumber<unknown>;
    productType: import("zod").ZodEnum<{
        bar: "bar";
        coin: "coin";
        either: "either";
    }>;
    priorityProductId: import("zod").ZodOptional<import("zod").ZodNumber>;
    priorityStrength: import("zod").ZodEnum<{
        none: "none";
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    customSpot: import("zod").ZodOptional<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class PortfolioBuildRequestDto extends PortfolioBuildRequestDto_base {
}
declare const PortfolioBuildResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metalType: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
    budget: import("zod").ZodNumber;
    productType: import("zod").ZodEnum<{
        bar: "bar";
        coin: "coin";
        either: "either";
    }>;
    priorityProductId: import("zod").ZodNullable<import("zod").ZodNumber>;
    priorityStrength: import("zod").ZodEnum<{
        none: "none";
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    results: import("zod").ZodArray<import("zod").ZodObject<{
        strategy: import("zod").ZodObject<{
            id: import("zod").ZodEnum<{
                maximum: "maximum";
                balanced: "balanced";
                flexible: "flexible";
            }>;
            name: import("zod").ZodString;
            badge: import("zod").ZodString;
            description: import("zod").ZodString;
        }, import("zod/v4/core").$strip>;
        totalInvested: import("zod").ZodNumber;
        unspent: import("zod").ZodNumber;
        totalGrams: import("zod").ZodNumber;
        averagePerGram: import("zod").ZodNumber;
        averagePremium: import("zod").ZodNumber;
        pieces: import("zod").ZodNumber;
        largestPositionPercent: import("zod").ZodNumber;
        flexibilityScore: import("zod").ZodNumber;
        priorityQuantity: import("zod").ZodNumber;
        priorityShare: import("zod").ZodNumber;
        items: import("zod").ZodArray<import("zod").ZodObject<{
            product: import("zod").ZodString;
            quantity: import("zod").ZodNumber;
            weight: import("zod").ZodNumber;
            totalWeight: import("zod").ZodNumber;
            unitPrice: import("zod").ZodNumber;
            totalValue: import("zod").ZodNumber;
            premium: import("zod").ZodNumber;
            type: import("zod").ZodEnum<{
                bar: "bar";
                coin: "coin";
            }>;
            isPriority: import("zod").ZodBoolean;
        }, import("zod/v4/core").$strip>>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class PortfolioBuildResponseDto extends PortfolioBuildResponseDto_base {
}
declare const BranchResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodNumber;
    name: import("zod").ZodString;
    region: import("zod").ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
    }>;
    address: import("zod").ZodNullable<import("zod").ZodString>;
    currency: import("zod").ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
    }>;
    createdAt: import("zod").ZodISODateTime;
}, import("zod/v4/core").$strip>, false>;
export declare class BranchResponseDto extends BranchResponseDto_base {
}
declare const CreateBranchRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    address: import("zod").ZodOptional<import("zod").ZodString>;
    region: import("zod").ZodDefault<import("zod").ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
    }>>;
    currency: import("zod").ZodDefault<import("zod").ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateBranchRequestDto extends CreateBranchRequestDto_base {
}
declare const FetchAttemptResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    attemptedAt: import("zod").ZodISODateTime;
    durationMs: import("zod").ZodNumber;
    success: import("zod").ZodBoolean;
    errorMessage: import("zod").ZodNullable<import("zod").ZodString>;
    metalsResolved: import("zod").ZodArray<import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
    triggeredBy: import("zod").ZodEnum<{
        CRON: "CRON";
        REFRESH: "REFRESH";
        RETRY: "RETRY";
        LAUNCH_FALLBACK: "LAUNCH_FALLBACK";
    }>;
}, import("zod/v4/core").$strip>, false>;
export declare class FetchAttemptResponseDto extends FetchAttemptResponseDto_base {
}
declare const FetchMetricsResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    successRate24h: import("zod").ZodNumber;
    totalAttempts24h: import("zod").ZodNumber;
    failureCount24h: import("zod").ZodNumber;
    avgLatencyMs: import("zod").ZodNumber;
    cacheHitRatio: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class FetchMetricsResponseDto extends FetchMetricsResponseDto_base {
}
declare const ClientErrorReportBatchDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    reports: import("zod").ZodArray<import("zod").ZodObject<{
        reference: import("zod").ZodString;
        occurredAt: import("zod").ZodString;
        severity: import("zod").ZodEnum<{
            error: "error";
            warning: "warning";
        }>;
        kind: import("zod").ZodEnum<{
            database: "database";
            http: "http";
            network: "network";
            "external-api": "external-api";
            response: "response";
            crash: "crash";
        }>;
        message: import("zod").ZodString;
        detail: import("zod").ZodOptional<import("zod").ZodString>;
        statusCode: import("zod").ZodOptional<import("zod").ZodNumber>;
        method: import("zod").ZodOptional<import("zod").ZodString>;
        path: import("zod").ZodOptional<import("zod").ZodString>;
        stack: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class ClientErrorReportBatchDto extends ClientErrorReportBatchDto_base {
}
declare const KbDocumentListResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    documents: import("zod").ZodArray<import("zod").ZodObject<{
        slug: import("zod").ZodString;
        title: import("zod").ZodString;
        category: import("zod").ZodEnum<{
            sales: "sales";
            trading: "trading";
            operations: "operations";
            compliance: "compliance";
            storage: "storage";
            systems: "systems";
            directory: "directory";
            meta: "meta";
        }>;
        jurisdiction: import("zod").ZodEnum<{
            IE: "IE";
            UK: "UK";
            ES: "ES";
            all: "all";
        }>;
        owner: import("zod").ZodString;
        status: import("zod").ZodEnum<{
            draft: "draft";
            approved: "approved";
            retired: "retired";
        }>;
        visibility: import("zod").ZodDefault<import("zod").ZodEnum<{
            all: "all";
            ie_only: "ie_only";
        }>>;
        version: import("zod").ZodNumber;
        contentUpdatedOn: import("zod").ZodISODate;
        markdown: import("zod").ZodString;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class KbDocumentListResponseDto extends KbDocumentListResponseDto_base {
}
declare const KbDocumentDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    slug: import("zod").ZodString;
    title: import("zod").ZodString;
    category: import("zod").ZodEnum<{
        sales: "sales";
        trading: "trading";
        operations: "operations";
        compliance: "compliance";
        storage: "storage";
        systems: "systems";
        directory: "directory";
        meta: "meta";
    }>;
    jurisdiction: import("zod").ZodEnum<{
        IE: "IE";
        UK: "UK";
        ES: "ES";
        all: "all";
    }>;
    owner: import("zod").ZodString;
    status: import("zod").ZodEnum<{
        draft: "draft";
        approved: "approved";
        retired: "retired";
    }>;
    visibility: import("zod").ZodDefault<import("zod").ZodEnum<{
        all: "all";
        ie_only: "ie_only";
    }>>;
    version: import("zod").ZodNumber;
    contentUpdatedOn: import("zod").ZodISODate;
    markdown: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class KbDocumentDto extends KbDocumentDto_base {
}
declare const UpdateKbDocumentRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    title: import("zod").ZodString;
    owner: import("zod").ZodString;
    markdown: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateKbDocumentRequestDto extends UpdateKbDocumentRequestDto_base {
}
declare const SetKbStatusRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    status: import("zod").ZodEnum<{
        draft: "draft";
        approved: "approved";
        retired: "retired";
    }>;
}, import("zod/v4/core").$strip>, false>;
export declare class SetKbStatusRequestDto extends SetKbStatusRequestDto_base {
}
declare const AskRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    question: import("zod").ZodString;
    mode: import("zod").ZodDefault<import("zod").ZodEnum<{
        email: "email";
        procedures: "procedures";
        whatsapp: "whatsapp";
    }>>;
    spotOverrides: import("zod").ZodOptional<import("zod").ZodObject<{
        GOLD: import("zod").ZodOptional<import("zod").ZodNumber>;
        SILVER: import("zod").ZodOptional<import("zod").ZodNumber>;
        PLATINUM: import("zod").ZodOptional<import("zod").ZodNumber>;
        PALLADIUM: import("zod").ZodOptional<import("zod").ZodNumber>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class AskRequestDto extends AskRequestDto_base {
}
declare const AskResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    questionId: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodNumber>>;
    answer: import("zod").ZodString;
    mode: import("zod").ZodEnum<{
        email: "email";
        procedures: "procedures";
        whatsapp: "whatsapp";
    }>;
    status: import("zod").ZodEnum<{
        answered: "answered";
        refused: "refused";
        uncited: "uncited";
    }>;
    citations: import("zod").ZodArray<import("zod").ZodObject<{
        slug: import("zod").ZodString;
        anchor: import("zod").ZodNullable<import("zod").ZodString>;
        title: import("zod").ZodString;
        heading: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>>;
    model: import("zod").ZodString;
    usage: import("zod").ZodObject<{
        inputTokens: import("zod").ZodNumber;
        cachedInputTokens: import("zod").ZodNumber;
        cacheWriteInputTokens: import("zod").ZodOptional<import("zod").ZodNumber>;
        outputTokens: import("zod").ZodNumber;
    }, import("zod/v4/core").$strip>;
    latencyMs: import("zod").ZodNumber;
    corpus: import("zod").ZodObject<{
        documents: import("zod").ZodNumber;
        hash: import("zod").ZodString;
    }, import("zod/v4/core").$strip>;
    cached: import("zod").ZodBoolean;
    notes: import("zod").ZodNullable<import("zod").ZodString>;
    warnings: import("zod").ZodArray<import("zod").ZodString>;
    spotNote: import("zod").ZodNullable<import("zod").ZodObject<{
        tone: import("zod").ZodEnum<{
            custom: "custom";
            stale: "stale";
            healthy: "healthy";
        }>;
        message: import("zod").ZodString;
    }, import("zod/v4/core").$strip>>;
    toolsUsed: import("zod").ZodArray<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class AskResponseDto extends AskResponseDto_base {
}
declare const AiStatusDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    enabled: import("zod").ZodBoolean;
    model: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class AiStatusDto extends AiStatusDto_base {
}
declare const DbInsertRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    values: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber, import("zod").ZodBoolean, import("zod").ZodNull, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>, import("zod").ZodArray<import("zod").ZodUnknown>]>>;
}, import("zod/v4/core").$strip>, false>;
export declare class DbInsertRequestDto extends DbInsertRequestDto_base {
}
declare const DbUpdateRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    key: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber]>>;
    values: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber, import("zod").ZodBoolean, import("zod").ZodNull, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>, import("zod").ZodArray<import("zod").ZodUnknown>]>>;
}, import("zod/v4/core").$strip>, false>;
export declare class DbUpdateRequestDto extends DbUpdateRequestDto_base {
}
declare const DbDeleteRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    key: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber]>>;
}, import("zod/v4/core").$strip>, false>;
export declare class DbDeleteRequestDto extends DbDeleteRequestDto_base {
}
declare const MarketModeStateDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    weekend: import("zod").ZodBoolean;
    volatile: import("zod").ZodBoolean;
    shortage: import("zod").ZodBoolean;
    updatedBy: import("zod").ZodNullable<import("zod").ZodString>;
    updatedAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
}, import("zod/v4/core").$strip>, false>;
export declare class MarketModeStateDto extends MarketModeStateDto_base {
}
declare const UpdateMarketModeRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    weekend: import("zod").ZodBoolean;
    volatile: import("zod").ZodBoolean;
    shortage: import("zod").ZodBoolean;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateMarketModeRequestDto extends UpdateMarketModeRequestDto_base {
}
declare const RoadmapInboxDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    items: import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodNumber;
        issueNumber: import("zod").ZodNumber;
        title: import("zod").ZodString;
        body: import("zod").ZodString;
        kind: import("zod").ZodNullable<import("zod").ZodString>;
        url: import("zod").ZodString;
        status: import("zod").ZodEnum<{
            new: "new";
            promoted: "promoted";
            dismissed: "dismissed";
        }>;
        issueCreatedAt: import("zod").ZodISODateTime;
        handledAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
        handledBy: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>>;
    configured: import("zod").ZodBoolean;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapInboxDto extends RoadmapInboxDto_base {
}
declare const RoadmapInboxItemDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodNumber;
    issueNumber: import("zod").ZodNumber;
    title: import("zod").ZodString;
    body: import("zod").ZodString;
    kind: import("zod").ZodNullable<import("zod").ZodString>;
    url: import("zod").ZodString;
    status: import("zod").ZodEnum<{
        new: "new";
        promoted: "promoted";
        dismissed: "dismissed";
    }>;
    issueCreatedAt: import("zod").ZodISODateTime;
    handledAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    handledBy: import("zod").ZodNullable<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapInboxItemDto extends RoadmapInboxItemDto_base {
}
declare const RoadmapInboxRefreshDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    added: import("zod").ZodNumber;
    closedOnGithub: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapInboxRefreshDto extends RoadmapInboxRefreshDto_base {
}
declare const RoadmapInboxPromoteDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    sectionLine: import("zod").ZodNumber;
    text: import("zod").ZodString;
    version: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapInboxPromoteDto extends RoadmapInboxPromoteDto_base {
}
declare const RoadmapDocumentDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    markdown: import("zod").ZodString;
    version: import("zod").ZodNumber;
    updatedBy: import("zod").ZodNullable<import("zod").ZodString>;
    updatedAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapDocumentDto extends RoadmapDocumentDto_base {
}
declare const RoadmapEditRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    version: import("zod").ZodNumber;
    edit: import("zod").ZodDiscriminatedUnion<[import("zod").ZodObject<{
        type: import("zod").ZodLiteral<"toggle">;
        line: import("zod").ZodNumber;
        text: import("zod").ZodString;
        checked: import("zod").ZodBoolean;
    }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
        type: import("zod").ZodLiteral<"add">;
        sectionLine: import("zod").ZodNumber;
        parentLine: import("zod").ZodOptional<import("zod").ZodNumber>;
        text: import("zod").ZodString;
    }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
        type: import("zod").ZodLiteral<"delete">;
        line: import("zod").ZodNumber;
        text: import("zod").ZodString;
    }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
        type: import("zod").ZodLiteral<"edit">;
        line: import("zod").ZodNumber;
        text: import("zod").ZodString;
        newText: import("zod").ZodString;
    }, import("zod/v4/core").$strip>], "type">;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapEditRequestDto extends RoadmapEditRequestDto_base {
}
declare const RoadmapSyncStatusDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    state: import("zod").ZodEnum<{
        unconfigured: "unconfigured";
        "in-sync": "in-sync";
        differs: "differs";
        unavailable: "unavailable";
    }>;
    repo: import("zod").ZodString;
    branch: import("zod").ZodString;
    masterCommit: import("zod").ZodNullable<import("zod").ZodString>;
    appVersion: import("zod").ZodNumber;
    appUpdatedAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    appOnlyLines: import("zod").ZodNumber;
    masterOnlyLines: import("zod").ZodNumber;
    preview: import("zod").ZodArray<import("zod").ZodString>;
    openSyncPr: import("zod").ZodNullable<import("zod").ZodObject<{
        number: import("zod").ZodNumber;
        title: import("zod").ZodString;
        url: import("zod").ZodString;
    }, import("zod/v4/core").$strip>>;
    tokenExpiresAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    error: import("zod").ZodNullable<import("zod").ZodString>;
    appEditsToPush: import("zod").ZodNullable<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapSyncStatusDto extends RoadmapSyncStatusDto_base {
}
declare const RoadmapPullRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    dryRun: import("zod").ZodOptional<import("zod").ZodBoolean>;
    confirmReplace: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapPullRequestDto extends RoadmapPullRequestDto_base {
}
declare const RoadmapPullResultDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    mode: import("zod").ZodEnum<{
        adopt: "adopt";
        merge: "merge";
        nothing: "nothing";
    }>;
    applied: import("zod").ZodBoolean;
    commit: import("zod").ZodString;
    appChanged: import("zod").ZodBoolean;
    log: import("zod").ZodArray<import("zod").ZodObject<{
        kind: import("zod").ZodEnum<{
            "to-file": "to-file";
            "to-app": "to-app";
            "conflict-app-wins": "conflict-app-wins";
            "kept-file-edit": "kept-file-edit";
            "missing-from-file": "missing-from-file";
            "both-added": "both-added";
        }>;
        baseLine: import("zod").ZodNumber;
        text: import("zod").ZodString;
    }, import("zod/v4/core").$strip>>;
    appOnlyTasks: import("zod").ZodArray<import("zod").ZodObject<{
        section: import("zod").ZodString;
        title: import("zod").ZodString;
        checked: import("zod").ZodBoolean;
    }, import("zod/v4/core").$strip>>;
    appOnlyTaskCount: import("zod").ZodNumber;
    ticksOnlyInApp: import("zod").ZodArray<import("zod").ZodObject<{
        section: import("zod").ZodString;
        title: import("zod").ZodString;
        checked: import("zod").ZodBoolean;
    }, import("zod/v4/core").$strip>>;
    ticksOnlyInAppCount: import("zod").ZodNumber;
    appOnlyLines: import("zod").ZodNumber;
    masterOnlyLines: import("zod").ZodNumber;
    snapshotId: import("zod").ZodNullable<import("zod").ZodNumber>;
    appVersion: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapPullResultDto extends RoadmapPullResultDto_base {
}
declare const RoadmapPushRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    dryRun: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapPushRequestDto extends RoadmapPushRequestDto_base {
}
declare const RoadmapPushResultDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    mode: import("zod").ZodEnum<{
        push: "push";
        nothing: "nothing";
    }>;
    applied: import("zod").ZodBoolean;
    commit: import("zod").ZodString;
    edits: import("zod").ZodArray<import("zod").ZodObject<{
        kind: import("zod").ZodEnum<{
            "to-file": "to-file";
            "to-app": "to-app";
            "conflict-app-wins": "conflict-app-wins";
            "kept-file-edit": "kept-file-edit";
            "missing-from-file": "missing-from-file";
            "both-added": "both-added";
        }>;
        baseLine: import("zod").ZodNumber;
        text: import("zod").ZodString;
    }, import("zod/v4/core").$strip>>;
    diffPreview: import("zod").ZodArray<import("zod").ZodString>;
    prNumber: import("zod").ZodNullable<import("zod").ZodNumber>;
    prUrl: import("zod").ZodNullable<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapPushResultDto extends RoadmapPushResultDto_base {
}
declare const CreateStocktakeRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    countDate: import("zod").ZodISODate;
    cutoffDate: import("zod").ZodISODate;
    stocktakeLead: import("zod").ZodOptional<import("zod").ZodString>;
    secondChecker: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateStocktakeRequestDto extends CreateStocktakeRequestDto_base {
}
declare const UpdateStocktakeRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    status: import("zod").ZodOptional<import("zod").ZodEnum<{
        DRAFT: "DRAFT";
        COUNTING: "COUNTING";
        RECONCILING: "RECONCILING";
        FINALISED: "FINALISED";
    }>>;
    stocktakeLead: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    secondChecker: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    notes: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateStocktakeRequestDto extends UpdateStocktakeRequestDto_base {
}
declare const ImportJournalRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    text: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class ImportJournalRequestDto extends ImportJournalRequestDto_base {
}
declare const UpdateStocktakeLineRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    countedNormal: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
    countedCustomer: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
    counted: import("zod").ZodOptional<import("zod").ZodBoolean>;
    reason: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    serialsChecked: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        NA: "NA";
        YES: "YES";
        NO: "NO";
    }>>>;
    serialNote: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateStocktakeLineRequestDto extends UpdateStocktakeLineRequestDto_base {
}
declare const CreateDiscrepancyRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    itemNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    description: import("zod").ZodString;
    issueType: import("zod").ZodEnum<{
        QUANTITY: "QUANTITY";
        LOCATION: "LOCATION";
        SERIAL: "SERIAL";
        PAID_NOT_COLLECTED: "PAID_NOT_COLLECTED";
        OTHER: "OTHER";
    }>;
    bcShows: import("zod").ZodDefault<import("zod").ZodString>;
    physicalFound: import("zod").ZodDefault<import("zod").ZodString>;
    serialNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    action: import("zod").ZodDefault<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateDiscrepancyRequestDto extends CreateDiscrepancyRequestDto_base {
}
declare const UpdateDiscrepancyRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    bcShows: import("zod").ZodOptional<import("zod").ZodString>;
    physicalFound: import("zod").ZodOptional<import("zod").ZodString>;
    serialNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    action: import("zod").ZodOptional<import("zod").ZodString>;
    resolved: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateDiscrepancyRequestDto extends UpdateDiscrepancyRequestDto_base {
}
declare const LinkBcItemRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    productId: import("zod").ZodNullable<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class LinkBcItemRequestDto extends LinkBcItemRequestDto_base {
}
declare const AddBarRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: import("zod").ZodString;
    weightLabel: import("zod").ZodString;
    refinery: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    serial: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    grams: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
    details: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class AddBarRequestDto extends AddBarRequestDto_base {
}
declare const UpdateBarRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    status: import("zod").ZodOptional<import("zod").ZodEnum<{
        UNCONFIRMED: "UNCONFIRMED";
        CONFIRMED: "CONFIRMED";
        NEW: "NEW";
        GONE: "GONE";
    }>>;
    weightLabel: import("zod").ZodOptional<import("zod").ZodString>;
    refinery: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    serial: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    grams: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
    details: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateBarRequestDto extends UpdateBarRequestDto_base {
}
declare const ImportPhysicalRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    text: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class ImportPhysicalRequestDto extends ImportPhysicalRequestDto_base {
}
declare const AddCoinRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    locationCode: import("zod").ZodDefault<import("zod").ZodString>;
    item: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class AddCoinRequestDto extends AddCoinRequestDto_base {
}
declare const UpdateCoinRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    countedQty: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
    details: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateCoinRequestDto extends UpdateCoinRequestDto_base {
}
declare const CarryForwardRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    fromStocktakeId: import("zod").ZodOptional<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class CarryForwardRequestDto extends CarryForwardRequestDto_base {
}
declare const CreateCustomerOrderRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    locationCode: import("zod").ZodString;
    client: import("zod").ZodString;
    reference: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    bcOrderNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    supplierRef: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    metal: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>>;
    product: import("zod").ZodString;
    bcItemNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    quantity: import("zod").ZodNumber;
    refinery: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    serials: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    status: import("zod").ZodDefault<import("zod").ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>>;
    orderedOn: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodISODate>>;
    notes: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateCustomerOrderRequestDto extends CreateCustomerOrderRequestDto_base {
}
declare const UpdateCustomerOrderRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    locationCode: import("zod").ZodOptional<import("zod").ZodString>;
    client: import("zod").ZodOptional<import("zod").ZodString>;
    reference: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    bcOrderNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    supplierRef: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    metal: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>>>;
    product: import("zod").ZodOptional<import("zod").ZodString>;
    bcItemNo: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    quantity: import("zod").ZodOptional<import("zod").ZodNumber>;
    refinery: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    serials: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    status: import("zod").ZodOptional<import("zod").ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>>;
    orderedOn: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodISODate>>;
    missing: import("zod").ZodOptional<import("zod").ZodBoolean>;
    notes: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateCustomerOrderRequestDto extends UpdateCustomerOrderRequestDto_base {
}
declare const AddEvidenceRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    kind: import("zod").ZodEnum<{
        TRADESHEET_COLLECTED: "TRADESHEET_COLLECTED";
        ZOHO_INVOICE: "ZOHO_INVOICE";
        SIGNED_INVOICE: "SIGNED_INVOICE";
        BC_RECORD: "BC_RECORD";
        STAFF_NOTE: "STAFF_NOTE";
    }>;
    reference: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    note: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    observedOn: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodISODate>>;
}, import("zod/v4/core").$strip>, false>;
export declare class AddEvidenceRequestDto extends AddEvidenceRequestDto_base {
}
declare const ImportCustomerOrdersRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    fallbackStatus: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
        TO_ORDER: "TO_ORDER";
        ORDERED: "ORDERED";
        IN_TRANSIT: "IN_TRANSIT";
        DELIVERED: "DELIVERED";
        BAGGED: "BAGGED";
        ALLOCATED: "ALLOCATED";
        COLLECTED: "COLLECTED";
    }>>>;
    text: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class ImportCustomerOrdersRequestDto extends ImportCustomerOrdersRequestDto_base {
}
declare const TradesheetImportRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    fileName: import("zod").ZodString;
    sheetMonth: import("zod").ZodString;
    source: import("zod").ZodDefault<import("zod").ZodEnum<{
        TRADESHEET: "TRADESHEET";
        BACKFILL: "BACKFILL";
    }>>;
    tabs: import("zod").ZodArray<import("zod").ZodObject<{
        name: import("zod").ZodString;
        headerRow: import("zod").ZodNumber;
        headers: import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber, import("zod").ZodBoolean, import("zod").ZodNull]>>;
        rows: import("zod").ZodArray<import("zod").ZodObject<{
            row: import("zod").ZodNumber;
            cells: import("zod").ZodArray<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber, import("zod").ZodBoolean, import("zod").ZodNull]>>;
            fills: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodString>>;
        }, import("zod/v4/core").$strip>>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class TradesheetImportRequestDto extends TradesheetImportRequestDto_base {
}
declare const WorkbookChunkRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    batchId: import("zod").ZodOptional<import("zod").ZodNumber>;
    fileName: import("zod").ZodString;
    schemaVersion: import("zod").ZodLiteral<"1.1">;
    table: import("zod").ZodEnum<{
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
    rows: import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
    lastOfTable: import("zod").ZodDefault<import("zod").ZodBoolean>;
    complete: import("zod").ZodDefault<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class WorkbookChunkRequestDto extends WorkbookChunkRequestDto_base {
}
declare const RecordStepRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    supplierInvoice: import("zod").ZodOptional<import("zod").ZodString>;
    pline: import("zod").ZodOptional<import("zod").ZodString>;
    soldComment: import("zod").ZodOptional<import("zod").ZodString>;
    serials: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
    refinery: import("zod").ZodOptional<import("zod").ZodString>;
    stockChange: import("zod").ZodOptional<import("zod").ZodString>;
    note: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class RecordStepRequestDto extends RecordStepRequestDto_base {
}
declare const SaveHandoverRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    note: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class SaveHandoverRequestDto extends SaveHandoverRequestDto_base {
}
declare const BcAwaitingRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    fileName: import("zod").ZodString;
    schemaVersion: import("zod").ZodLiteral<"1.1">;
    rows: import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
}, import("zod/v4/core").$strip>, false>;
export declare class BcAwaitingRequestDto extends BcAwaitingRequestDto_base {
}
declare const BcHistoryRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    fileNames: import("zod").ZodArray<import("zod").ZodString>;
    shipments: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodObject<{
        no: import("zod").ZodString;
        customerNo: import("zod").ZodNullable<import("zod").ZodString>;
        customerCode: import("zod").ZodNullable<import("zod").ZodString>;
        documentDate: import("zod").ZodNullable<import("zod").ZodString>;
        postingDate: import("zod").ZodNullable<import("zod").ZodString>;
        externalDocNo: import("zod").ZodNullable<import("zod").ZodString>;
        locationCode: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("zod/v4/core").$strict>>>;
    shipmentLines: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodObject<{
        documentNo: import("zod").ZodString;
        lineNo: import("zod").ZodNumber;
        customerNo: import("zod").ZodNullable<import("zod").ZodString>;
        itemNo: import("zod").ZodNullable<import("zod").ZodString>;
        description: import("zod").ZodNullable<import("zod").ZodString>;
        locationCode: import("zod").ZodNullable<import("zod").ZodString>;
        quantity: import("zod").ZodNullable<import("zod").ZodNumber>;
    }, import("zod/v4/core").$strict>>>;
    receipts: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodObject<{
        no: import("zod").ZodString;
        vendorNo: import("zod").ZodNullable<import("zod").ZodString>;
        sellerCode: import("zod").ZodNullable<import("zod").ZodString>;
        documentDate: import("zod").ZodNullable<import("zod").ZodString>;
        locationCode: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("zod/v4/core").$strict>>>;
    ledger: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodObject<{
        entryNo: import("zod").ZodNumber;
        postingDate: import("zod").ZodNullable<import("zod").ZodString>;
        entryType: import("zod").ZodString;
        documentType: import("zod").ZodNullable<import("zod").ZodString>;
        documentNo: import("zod").ZodString;
        itemNo: import("zod").ZodString;
        locationCode: import("zod").ZodNullable<import("zod").ZodString>;
        quantity: import("zod").ZodNumber;
        remainingQuantity: import("zod").ZodNullable<import("zod").ZodNumber>;
        salesAmount: import("zod").ZodNullable<import("zod").ZodNumber>;
        costAmount: import("zod").ZodNullable<import("zod").ZodNumber>;
        open: import("zod").ZodNullable<import("zod").ZodBoolean>;
        serialNo: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodString>>;
        sourceType: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodString>>;
        sourceNo: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodString>>;
    }, import("zod/v4/core").$strict>>>;
}, import("zod/v4/core").$strip>, false>;
export declare class BcHistoryRequestDto extends BcHistoryRequestDto_base {
}
declare const ItemTraceQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    serial: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class ItemTraceQueryDto extends ItemTraceQueryDto_base {
}
declare const LinkDecisionRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    ids: import("zod").ZodArray<import("zod").ZodNumber>;
    decision: import("zod").ZodEnum<{
        CONFIRMED: "CONFIRMED";
        REJECTED: "REJECTED";
    }>;
}, import("zod/v4/core").$strip>, false>;
export declare class LinkDecisionRequestDto extends LinkDecisionRequestDto_base {
}
declare const CreateSalesProductRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    genericNorm: import("zod").ZodString;
    refinery: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    pricingProductId: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateSalesProductRequestDto extends CreateSalesProductRequestDto_base {
}
declare const BcSalesProductsApplyRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    itemNos: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class BcSalesProductsApplyRequestDto extends BcSalesProductsApplyRequestDto_base {
}
declare const MapAliasRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    salesProductId: import("zod").ZodOptional<import("zod").ZodNumber>;
    productId: import("zod").ZodOptional<import("zod").ZodNumber>;
    noProduct: import("zod").ZodOptional<import("zod").ZodLiteral<true>>;
}, import("zod/v4/core").$strip>, false>;
export declare class MapAliasRequestDto extends MapAliasRequestDto_base {
}
declare const ApplyPerMetalRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    choices: import("zod").ZodArray<import("zod").ZodObject<{
        metal: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        productId: import("zod").ZodOptional<import("zod").ZodNumber>;
        salesProductId: import("zod").ZodOptional<import("zod").ZodNumber>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class ApplyPerMetalRequestDto extends ApplyPerMetalRequestDto_base {
}
declare const RelinkRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    dryRun: import("zod").ZodBoolean;
    correct: import("zod").ZodDefault<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class RelinkRequestDto extends RelinkRequestDto_base {
}
declare const SettleNamesRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    dryRun: import("zod").ZodDefault<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class SettleNamesRequestDto extends SettleNamesRequestDto_base {
}
declare const NameSuggestionAcceptRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    items: import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodNumber;
        expected: import("zod").ZodObject<{
            productId: import("zod").ZodOptional<import("zod").ZodNumber>;
            salesProductId: import("zod").ZodOptional<import("zod").ZodNumber>;
            noProduct: import("zod").ZodOptional<import("zod").ZodLiteral<true>>;
        }, import("zod/v4/core").$strip>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class NameSuggestionAcceptRequestDto extends NameSuggestionAcceptRequestDto_base {
}
declare const NameSuggestionDecisionRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    ids: import("zod").ZodArray<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class NameSuggestionDecisionRequestDto extends NameSuggestionDecisionRequestDto_base {
}
declare const RecordSearchRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    q: import("zod").ZodOptional<import("zod").ZodString>;
    status: import("zod").ZodOptional<import("zod").ZodString>;
    limit: import("zod").ZodDefault<import("zod").ZodNumber>;
    offset: import("zod").ZodDefault<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class RecordSearchRequestDto extends RecordSearchRequestDto_base {
}
declare const RoadmapScopeDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    enabled: import("zod").ZodBoolean;
    configured: import("zod").ZodBoolean;
    empty: import("zod").ZodBoolean;
    repo: import("zod").ZodNullable<import("zod").ZodString>;
    branch: import("zod").ZodNullable<import("zod").ZodString>;
    commit: import("zod").ZodNullable<import("zod").ZodString>;
    version: import("zod").ZodNumber;
    syncedAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    syncedBy: import("zod").ZodNullable<import("zod").ZodString>;
    view: import("zod").ZodObject<{
        items: import("zod").ZodArray<import("zod").ZodObject<{
            id: import("zod").ZodString;
            scope: import("zod").ZodEnum<{
                features: "features";
                fixes: "fixes";
                ops: "ops";
            }>;
            title: import("zod").ZodString;
            priority: import("zod").ZodEnum<{
                P0: "P0";
                P1: "P1";
                P2: "P2";
                P3: "P3";
            }>;
            effort: import("zod").ZodEnum<{
                S: "S";
                M: "M";
                L: "L";
                XL: "XL";
            }>;
            status: import("zod").ZodEnum<{
                done: "done";
                next: "next";
                idea: "idea";
                planned: "planned";
                doing: "doing";
                dropped: "dropped";
            }>;
            after: import("zod").ZodArray<import("zod").ZodString>;
            flags: import("zod").ZodArray<import("zod").ZodString>;
            verified: import("zod").ZodNullable<import("zod").ZodString>;
            was: import("zod").ZodNullable<import("zod").ZodString>;
            evidence: import("zod").ZodArray<import("zod").ZodString>;
            spec: import("zod").ZodNullable<import("zod").ZodString>;
            deadline: import("zod").ZodNullable<import("zod").ZodString>;
            body: import("zod").ZodString;
            tasks: import("zod").ZodArray<import("zod").ZodObject<{
                checked: import("zod").ZodBoolean;
                text: import("zod").ZodString;
                depth: import("zod").ZodNumber;
            }, import("zod/v4/core").$strip>>;
        }, import("zod/v4/core").$strip>>;
        done: import("zod").ZodArray<import("zod").ZodObject<{
            id: import("zod").ZodString;
            scope: import("zod").ZodEnum<{
                features: "features";
                fixes: "fixes";
                ops: "ops";
            }>;
            text: import("zod").ZodString;
        }, import("zod/v4/core").$strip>>;
        decisions: import("zod").ZodArray<import("zod").ZodObject<{
            id: import("zod").ZodString;
            title: import("zod").ZodString;
            settled: import("zod").ZodBoolean;
            default: import("zod").ZodNullable<import("zod").ZodString>;
            blocks: import("zod").ZodNullable<import("zod").ZodString>;
            text: import("zod").ZodString;
        }, import("zod/v4/core").$strip>>;
        now: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapScopeDto extends RoadmapScopeDto_base {
}
declare const RoadmapScopeRefreshDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    changed: import("zod").ZodBoolean;
    commit: import("zod").ZodString;
    version: import("zod").ZodNumber;
    items: import("zod").ZodNumber;
    decisions: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapScopeRefreshDto extends RoadmapScopeRefreshDto_base {
}
declare const RoadmapQueueRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    text: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapQueueRequestDto extends RoadmapQueueRequestDto_base {
}
declare const RoadmapQueueListDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    entries: import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodNumber;
        text: import("zod").ZodString;
        source: import("zod").ZodEnum<{
            web: "web";
            phone: "phone";
        }>;
        status: import("zod").ZodEnum<{
            new: "new";
            filed: "filed";
        }>;
        line: import("zod").ZodString;
        createdAt: import("zod").ZodISODateTime;
        filedAt: import("zod").ZodNullable<import("zod").ZodISODateTime>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapQueueListDto extends RoadmapQueueListDto_base {
}
declare const RoadmapQueueAppendedDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodNumber;
    line: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapQueueAppendedDto extends RoadmapQueueAppendedDto_base {
}
declare const RoadmapQueueFiledRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    ids: import("zod").ZodArray<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapQueueFiledRequestDto extends RoadmapQueueFiledRequestDto_base {
}
declare const RoadmapQueueFiledResultDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    filed: import("zod").ZodNumber;
}, import("zod/v4/core").$strip>, false>;
export declare class RoadmapQueueFiledResultDto extends RoadmapQueueFiledResultDto_base {
}
declare const AdjustLiveStockRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    delta: import("zod").ZodOptional<import("zod").ZodNumber>;
    qty: import("zod").ZodOptional<import("zod").ZodNumber>;
    reason: import("zod").ZodString;
    note: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class AdjustLiveStockRequestDto extends AdjustLiveStockRequestDto_base {
}
declare const CreateLiveStockLineRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    branchCode: import("zod").ZodPipe<import("zod").ZodString, import("zod").ZodTransform<string, string>>;
    metal: import("zod").ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PGM: "PGM";
    }>;
    kind: import("zod").ZodEnum<{
        BAR: "BAR";
        COIN: "COIN";
    }>;
    family: import("zod").ZodString;
    variant: import("zod").ZodString;
    refinery: import("zod").ZodDefault<import("zod").ZodString>;
    qty: import("zod").ZodDefault<import("zod").ZodNumber>;
    reason: import("zod").ZodString;
    note: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateLiveStockLineRequestDto extends CreateLiveStockLineRequestDto_base {
}
declare const AddLiveStockBarRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    serial: import("zod").ZodString;
    grams: import("zod").ZodOptional<import("zod").ZodNumber>;
    details: import("zod").ZodOptional<import("zod").ZodString>;
    reason: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class AddLiveStockBarRequestDto extends AddLiveStockBarRequestDto_base {
}
declare const SetLiveStockBarStatusRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    status: import("zod").ZodEnum<{
        IN_STOCK: "IN_STOCK";
        SOLD: "SOLD";
        REMOVED: "REMOVED";
    }>;
    reason: import("zod").ZodString;
    note: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class SetLiveStockBarStatusRequestDto extends SetLiveStockBarStatusRequestDto_base {
}
declare const TransferLiveStockRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    toBranchCode: import("zod").ZodPipe<import("zod").ZodString, import("zod").ZodTransform<string, string>>;
    qty: import("zod").ZodNumber;
    barIds: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodNumber>>;
    reason: import("zod").ZodString;
    note: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class TransferLiveStockRequestDto extends TransferLiveStockRequestDto_base {
}
declare const LowThresholdRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    lowThreshold: import("zod").ZodNullable<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class LowThresholdRequestDto extends LowThresholdRequestDto_base {
}
declare const LinkLiveStockBranchRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    branchId: import("zod").ZodNullable<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class LinkLiveStockBranchRequestDto extends LinkLiveStockBranchRequestDto_base {
}
declare const LiveBaselineRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    bars: import("zod").ZodArray<import("zod").ZodObject<{
        metal: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        row: import("zod").ZodNumber;
        branch: import("zod").ZodString;
        weight: import("zod").ZodString;
        refinery: import("zod").ZodNullable<import("zod").ZodString>;
        serial: import("zod").ZodNullable<import("zod").ZodString>;
        grams: import("zod").ZodNullable<import("zod").ZodNumber>;
        details: import("zod").ZodNullable<import("zod").ZodString>;
        sold: import("zod").ZodBoolean;
    }, import("zod/v4/core").$strip>>;
    coins: import("zod").ZodArray<import("zod").ZodObject<{
        metal: import("zod").ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PGM: "PGM";
        }>;
        row: import("zod").ZodNumber;
        item: import("zod").ZodString;
        counts: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodNullable<import("zod").ZodNumber>>;
        details: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodNullable<import("zod").ZodString>>;
    }, import("zod/v4/core").$strip>>;
    cutoverDate: import("zod").ZodISODate;
    branchCodes: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodPipe<import("zod").ZodString, import("zod").ZodTransform<string, string>>>>;
}, import("zod/v4/core").$strip>, false>;
export declare class LiveBaselineRequestDto extends LiveBaselineRequestDto_base {
}
declare const ResolveSheetApplicationRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    choice: import("zod").ZodEnum<{
        APPLY: "APPLY";
        COUNTED: "COUNTED";
        LINE: "LINE";
        REVERSE: "REVERSE";
        KEEP: "KEEP";
        DISMISS: "DISMISS";
    }>;
    lineId: import("zod").ZodOptional<import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>, false>;
export declare class ResolveSheetApplicationRequestDto extends ResolveSheetApplicationRequestDto_base {
}
declare const AnalyticsQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    preset: import("zod").ZodDefault<import("zod").ZodEnum<{
        "30d": "30d";
        "90d": "90d";
        "12m": "12m";
        ytd: "ytd";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class AnalyticsQueryDto extends AnalyticsQueryDto_base {
}
declare const AiFeedbackRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    helpful: import("zod").ZodBoolean;
}, import("zod/v4/core").$strip>, false>;
export declare class AiFeedbackRequestDto extends AiFeedbackRequestDto_base {
}
declare const UpdateUserRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    role: import("zod").ZodOptional<import("zod").ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>>;
    admin: import("zod").ZodOptional<import("zod").ZodBoolean>;
    isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
    branchId: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
    reason: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateUserRequestDto extends UpdateUserRequestDto_base {
}
declare const SetOverridesRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    overrides: import("zod").ZodArray<import("zod").ZodObject<{
        key: import("zod").ZodEnum<{
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
        granted: import("zod").ZodBoolean;
        expiresAt: import("zod").ZodNullable<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>>;
    reason: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class SetOverridesRequestDto extends SetOverridesRequestDto_base {
}
declare const UpdatePermissionMatrixRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    changes: import("zod").ZodArray<import("zod").ZodObject<{
        role: import("zod").ZodEnum<{
            ADMIN: "ADMIN";
            MANAGER: "MANAGER";
            SALES: "SALES";
            ACCOUNTING: "ACCOUNTING";
            AUDITOR: "AUDITOR";
        }>;
        key: import("zod").ZodEnum<{
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
        granted: import("zod").ZodBoolean;
    }, import("zod/v4/core").$strip>>;
    reason: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdatePermissionMatrixRequestDto extends UpdatePermissionMatrixRequestDto_base {
}
declare const InviteUserRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodString;
    firstName: import("zod").ZodString;
    lastName: import("zod").ZodString;
    role: import("zod").ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        SALES: "SALES";
        ACCOUNTING: "ACCOUNTING";
        AUDITOR: "AUDITOR";
    }>;
    admin: import("zod").ZodDefault<import("zod").ZodBoolean>;
    branchId: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodNumber>>;
}, import("zod/v4/core").$strip>, false>;
export declare class InviteUserRequestDto extends InviteUserRequestDto_base {
}
declare const UserPreferencesDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    detail: import("zod").ZodDefault<import("zod").ZodEnum<{
        simple: "simple";
        detailed: "detailed";
    }>>;
    singleKeyShortcuts: import("zod").ZodDefault<import("zod").ZodBoolean>;
    quote: import("zod").ZodDefault<import("zod").ZodObject<{
        signOff: import("zod").ZodDefault<import("zod").ZodString>;
        defaultChannel: import("zod").ZodDefault<import("zod").ZodNullable<import("zod").ZodEnum<{
            email: "email";
            whatsapp: "whatsapp";
        }>>>;
    }, import("zod/v4/core").$strip>>;
    board: import("zod").ZodDefault<import("zod").ZodObject<{
        view: import("zod").ZodDefault<import("zod").ZodString>;
        pins: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodNumber>>;
    }, import("zod/v4/core").$strip>>;
    notifications: import("zod").ZodDefault<import("zod").ZodObject<{
        muted: import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodEnum<{
            feed_down: "feed_down";
            order_step: "order_step";
            import_review: "import_review";
            permission_changed: "permission_changed";
        }>>>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UserPreferencesDto extends UserPreferencesDto_base {
}
declare const CompanyQuoteTemplateDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    opening: import("zod").ZodNullable<import("zod").ZodString>;
    closingNote: import("zod").ZodNullable<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CompanyQuoteTemplateDto extends CompanyQuoteTemplateDto_base {
}
declare const MarkNotificationsReadDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber>>;
}, import("zod/v4/core").$strip>, false>;
export declare class MarkNotificationsReadDto extends MarkNotificationsReadDto_base {
}
export {};
//# sourceMappingURL=dtos.d.ts.map