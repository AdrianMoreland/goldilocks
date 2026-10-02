import {
    MessageResponseSchema,
    RawSpotPriceSchema,
    LoginRequestSchema,
    LoginResponseSchema,
    RefreshRequestSchema,
    AdminLogsQuerySchema,
    AuditQuerySchema,
    ErrorLogQuerySchema,
    FetchLogQuerySchema,
    DbRowsQuerySchema,
    BackfillHistoryQuerySchema,
    SessionUserSchema,
    CreateUserRequestSchema,
    BranchSchema,
    CreateBranchRequestSchema,
    FetchAttemptSchema,
    ClientErrorReportBatchSchema,
    FetchMetricsSchema,
    RecalculateOverridesSchema,
    HistoricCloseQuerySchema,
    UpdateStockRequestSchema,
    KbDocumentListResponseSchema,
    KbDocumentSchema,
    UpdateKbDocumentRequestSchema,
    SetKbStatusRequestSchema,
    AskRequestSchema,
    AskResponseSchema,
    AiStatusSchema,
    DbInsertRequestSchema,
    DbUpdateRequestSchema,
    DbDeleteRequestSchema,
} from '@goldilocks/shared-types';
import {
    ApiSuccessResponseSchema,
    MarketDataResponseSchema,
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
} from '@goldilocks/shared-types';
import { createDto } from './dto-generator';

// ============================================================================
// AUTHENTICATION DTOs
// ============================================================================

export class LoginRequestDto extends createDto(
    LoginRequestSchema,
    'LoginRequestDto',
) {}

export class LoginResponseDto extends createDto(
    LoginResponseSchema,
    'LoginResponseDto',
) {}

export class SessionUserDto extends createDto(
    SessionUserSchema,
    'SessionUserDto',
) {}

export class CreateUserRequestDto extends createDto(
    CreateUserRequestSchema,
    'CreateUserRequestDto',
) {}

/** Message response DTO - contains success/info messages */
export class MessageResponseDto extends createDto(
    ApiSuccessResponseSchema(MessageResponseSchema),
    'MessageResponseDto',
) {}

// ============================================================================
// HEALTH DTOs
// ============================================================================

/** Health check response DTO */
export class HealthCheckDto extends createDto(
    HealthCheckSchema,
    'HealthCheckDto',
) {}

// ============================================================================
// SPOT PRICE DTOs
// ============================================================================

export class RawSpotPriceResponseDto extends createDto(
    RawSpotPriceSchema,
    'RawSpotPriceResponseDto',
) {}

export class SpotPriceResponseDto extends createDto(
    SpotPriceSchema,
    'SpotPriceResponseDto',
) {}

export class CreateSpotPriceDto extends createDto(
    CreateSpotPriceDtoSchema,
    'CreateSpotPriceDto',
) {}

// ============================================================================
// PRODUCT DTOs
// ============================================================================

export class CreateProductDto extends createDto(
    CreateProductDtoSchema,
    'CreateProductDto',
) {}

export class ProductResponseDto extends createDto(
    ProductSchema,
    'ProductResponseDto',
) {}

export class UpdateProductDto extends createDto(
    UpdateProductFullDtoSchema,
    'UpdateProductDto',
) {}

export class UpdateStockRequestDto extends createDto(
    UpdateStockRequestSchema,
    'UpdateStockRequestDto',
) {}

export class MarketDataResponseDto extends createDto(
    MarketDataResponseSchema,
    'MarketDataResponseDto',
) {}

export class RecalculateOverridesDto extends createDto(
    RecalculateOverridesSchema,
    'RecalculateOverridesDto',
) {}

export class RefreshRequestDto extends createDto(
    RefreshRequestSchema,
    'RefreshRequestDto',
) {}

export class AdminLogsQueryDto extends createDto(
    AdminLogsQuerySchema,
    'AdminLogsQueryDto',
) {}

export class AuditQueryDto extends createDto(
    AuditQuerySchema,
    'AuditQueryDto',
) {}

export class ErrorLogQueryDto extends createDto(
    ErrorLogQuerySchema,
    'ErrorLogQueryDto',
) {}

export class FetchLogQueryDto extends createDto(
    FetchLogQuerySchema,
    'FetchLogQueryDto',
) {}

export class DbRowsQueryDto extends createDto(
    DbRowsQuerySchema,
    'DbRowsQueryDto',
) {}

export class BackfillHistoryQueryDto extends createDto(
    BackfillHistoryQuerySchema,
    'BackfillHistoryQueryDto',
) {}

export class HistoricCloseQueryDto extends createDto(
    HistoricCloseQuerySchema,
    'HistoricCloseQueryDto',
) {}

// ============================================================================
// TRADE DTOs
// ============================================================================

export class TradeBootstrapResponseDto extends createDto(
    TradeBootstrapResponseSchema,
    'TradeBootstrapResponseDto',
) {}

export class TradeCartRequestDto extends createDto(
    TradeCartRequestSchema,
    'TradeCartRequestDto',
) {}

export class TradeCartResponseDto extends createDto(
    TradeCartResponseSchema,
    'TradeCartResponseDto',
) {}

export class MeltCalculatorRequestDto extends createDto(
    MeltCalculatorRequestSchema,
    'MeltCalculatorRequestDto',
) {}

export class MeltCalculatorResponseDto extends createDto(
    MeltCalculatorResponseSchema,
    'MeltCalculatorResponseDto',
) {}

// ============================================================================
// PORTFOLIO DTOs
// ============================================================================

export class ProfitAnalysisRequestDto extends createDto(
    ProfitAnalysisRequestSchema,
    'ProfitAnalysisRequestDto',
) {}

export class ProfitAnalysisResponseDto extends createDto(
    ProfitAnalysisResponseSchema,
    'ProfitAnalysisResponseDto',
) {}

export class PortfolioBuildRequestDto extends createDto(
    PortfolioBuildRequestSchema,
    'PortfolioBuildRequestDto',
) {}

export class PortfolioBuildResponseDto extends createDto(
    PortfolioBuildResponseSchema,
    'PortfolioBuildResponseDto',
) {}

// ============================================================================
// BRANCH DTOs
// ============================================================================

export class BranchResponseDto extends createDto(
    BranchSchema,
    'BranchResponseDto',
) {}

export class CreateBranchRequestDto extends createDto(
    CreateBranchRequestSchema,
    'CreateBranchRequestDto',
) {}

// ============================================================================
// FETCH ATTEMPT / SYSTEM STATUS DTOs
// ============================================================================

export class FetchAttemptResponseDto extends createDto(
    FetchAttemptSchema,
    'FetchAttemptResponseDto',
) {}

export class FetchMetricsResponseDto extends createDto(
    FetchMetricsSchema,
    'FetchMetricsResponseDto',
) {}

// ============================================================================
// ERROR LOG DTOs
// ============================================================================

export class ClientErrorReportBatchDto extends createDto(
    ClientErrorReportBatchSchema,
    'ClientErrorReportBatchDto',
) {}

// ============================================================================
// KNOWLEDGE CENTER DTOs
// ============================================================================

export class KbDocumentListResponseDto extends createDto(
    KbDocumentListResponseSchema,
    'KbDocumentListResponseDto',
) {}

export class KbDocumentDto extends createDto(
    KbDocumentSchema,
    'KbDocumentDto',
) {}

export class UpdateKbDocumentRequestDto extends createDto(
    UpdateKbDocumentRequestSchema,
    'UpdateKbDocumentRequestDto',
) {}

export class SetKbStatusRequestDto extends createDto(
    SetKbStatusRequestSchema,
    'SetKbStatusRequestDto',
) {}

// ============================================================================
// AI ASSISTANT DTOs
// ============================================================================

export class AskRequestDto extends createDto(
    AskRequestSchema,
    'AskRequestDto',
) {}

export class AskResponseDto extends createDto(
    AskResponseSchema,
    'AskResponseDto',
) {}

export class AiStatusDto extends createDto(AiStatusSchema, 'AiStatusDto') {}

// ============================================================================
// ADMIN CONSOLE DTOs
// ============================================================================

export class DbInsertRequestDto extends createDto(
    DbInsertRequestSchema,
    'DbInsertRequestDto',
) {}

export class DbUpdateRequestDto extends createDto(
    DbUpdateRequestSchema,
    'DbUpdateRequestDto',
) {}

export class DbDeleteRequestDto extends createDto(
    DbDeleteRequestSchema,
    'DbDeleteRequestDto',
) {}
