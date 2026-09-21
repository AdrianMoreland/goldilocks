declare const LoginRequestDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodString;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class LoginRequestDto extends LoginRequestDto_base {
}
declare const LoginResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    accessToken: import("zod").ZodString;
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
}, import("zod/v4/core").$strip>, false>;
export declare class SessionUserDto extends SessionUserDto_base {
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
    marketValue: import("zod").ZodOptional<import("zod").ZodNumber>;
    priceSellVatExcl: import("zod").ZodOptional<import("zod").ZodNumber>;
    stock: import("zod").ZodOptional<import("zod").ZodNumber>;
    priceSell: import("zod").ZodOptional<import("zod").ZodNumber>;
    priceBuy: import("zod").ZodOptional<import("zod").ZodNumber>;
    isActive: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateProductDto extends UpdateProductDto_base {
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
    fetchedAt: import("zod").ZodISODateTime;
    priceWarning: import("zod").ZodNullable<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class MarketDataResponseDto extends MarketDataResponseDto_base {
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
    currency: import("zod").ZodDefault<import("zod").ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateBranchRequestDto extends CreateBranchRequestDto_base {
}
export {};
//# sourceMappingURL=dtos.d.ts.map