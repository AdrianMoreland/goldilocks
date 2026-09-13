import {createZodDto} from 'nestjs-zod';
import {
    MessageResponseSchema, RawSpotPriceSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    SessionUserSchema,
} from '@goldilocks/shared-types';
import {
    ApiSuccessResponseSchema, MarketDataResponseSchema,
    CreateProductDtoSchema,
    CreateSpotPriceDtoSchema,
    HealthCheckSchema,
    ProductSchema,
    SpotPriceSchema,
    UpdateProductFullDtoSchema,
    TradeBootstrapResponseSchema,
    TradeCartRequestSchema,
    TradeCartResponseSchema,
    MeltCalculatorRequestSchema,
    MeltCalculatorResponseSchema,
    ProfitAnalysisRequestSchema,
    ProfitAnalysisResponseSchema,
    PortfolioBuildRequestSchema,
    PortfolioBuildResponseSchema,
} from "@goldilocks/shared-types";
import {createDto} from "./dto-generator";

// ============================================================================
// AUTHENTICATION DTOs
// ============================================================================

export class LoginRequestDto extends createDto(LoginRequestSchema, 'LoginRequestDto') {}

export class LoginResponseDto extends createDto(LoginResponseSchema, 'LoginResponseDto') {}

export class SessionUserDto extends createDto(SessionUserSchema, 'SessionUserDto') {}

/** Message response DTO - contains success/info messages */
export class MessageResponseDto extends createZodDto(
    ApiSuccessResponseSchema(MessageResponseSchema)
) {}

// ============================================================================
// HEALTH DTOs
// ============================================================================

/** Health check response DTO */
export class HealthCheckDto extends createZodDto(HealthCheckSchema) {}

// ============================================================================
// SPOT PRICE DTOs
// ============================================================================

export class RawSpotPriceResponseDto extends createDto(RawSpotPriceSchema, 'RawSpotPriceResponseDto') {}

export class SpotPriceResponseDto extends createDto(SpotPriceSchema, 'SpotPriceResponseDto') {}

export class CreateSpotPriceDto extends createDto(CreateSpotPriceDtoSchema, 'CreateSpotPriceDto') {}

// ============================================================================
// PRODUCT DTOs
// ============================================================================

export class CreateProductDto extends createDto(CreateProductDtoSchema, 'CreateProductDto') {}

export class ProductResponseDto extends createDto(ProductSchema, 'ProductResponseDto') {}

export class UpdateProductDto extends createDto(UpdateProductFullDtoSchema, 'UpdateProductDto') {}

export class MarketDataResponseDto extends createDto(MarketDataResponseSchema, 'MarketDataResponseDto') {}

// ============================================================================
// TRADE DTOs
// ============================================================================

export class TradeBootstrapResponseDto extends createDto(TradeBootstrapResponseSchema, 'TradeBootstrapResponseDto') {}

export class TradeCartRequestDto extends createDto(TradeCartRequestSchema, 'TradeCartRequestDto') {}

export class TradeCartResponseDto extends createDto(TradeCartResponseSchema, 'TradeCartResponseDto') {}

export class MeltCalculatorRequestDto extends createDto(MeltCalculatorRequestSchema, 'MeltCalculatorRequestDto') {}

export class MeltCalculatorResponseDto extends createDto(MeltCalculatorResponseSchema, 'MeltCalculatorResponseDto') {}

// ============================================================================
// PORTFOLIO DTOs
// ============================================================================

export class ProfitAnalysisRequestDto extends createDto(ProfitAnalysisRequestSchema, 'ProfitAnalysisRequestDto') {}

export class ProfitAnalysisResponseDto extends createDto(ProfitAnalysisResponseSchema, 'ProfitAnalysisResponseDto') {}

export class PortfolioBuildRequestDto extends createDto(PortfolioBuildRequestSchema, 'PortfolioBuildRequestDto') {}

export class PortfolioBuildResponseDto extends createDto(PortfolioBuildResponseSchema, 'PortfolioBuildResponseDto') {}