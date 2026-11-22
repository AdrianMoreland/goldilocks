"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbUpdateRequestDto = exports.DbInsertRequestDto = exports.AiStatusDto = exports.AskResponseDto = exports.AskRequestDto = exports.SetKbStatusRequestDto = exports.UpdateKbDocumentRequestDto = exports.KbDocumentDto = exports.KbDocumentListResponseDto = exports.ClientErrorReportBatchDto = exports.FetchMetricsResponseDto = exports.FetchAttemptResponseDto = exports.CreateBranchRequestDto = exports.BranchResponseDto = exports.PortfolioBuildResponseDto = exports.PortfolioBuildRequestDto = exports.ProfitAnalysisResponseDto = exports.ProfitAnalysisRequestDto = exports.MeltCalculatorResponseDto = exports.MeltCalculatorRequestDto = exports.TradeCartResponseDto = exports.TradeCartRequestDto = exports.TradeBootstrapResponseDto = exports.HistoricCloseQueryDto = exports.BackfillHistoryQueryDto = exports.DbRowsQueryDto = exports.FetchLogQueryDto = exports.ErrorLogQueryDto = exports.AuditQueryDto = exports.AdminLogsQueryDto = exports.RefreshRequestDto = exports.RecalculateOverridesDto = exports.MarketDataResponseDto = exports.SpotStatusResponseDto = exports.UpdateStockRequestDto = exports.UpdateProductDto = exports.ProductResponseDto = exports.CreateProductDto = exports.CreateSpotPriceDto = exports.SpotPriceResponseDto = exports.RawSpotPriceResponseDto = exports.HealthCheckDto = exports.MessageResponseDto = exports.CreateUserRequestDto = exports.SetKbVisibilityRequestDto = exports.SetUserBranchRequestDto = exports.UiSettingsRequestDto = exports.SessionUserDto = exports.LoginResponseDto = exports.LoginRequestDto = void 0;
exports.RoadmapScopeRefreshDto = exports.RoadmapScopeDto = exports.RecordSearchRequestDto = exports.NameSuggestionDecisionRequestDto = exports.NameSuggestionAcceptRequestDto = exports.SettleNamesRequestDto = exports.RelinkRequestDto = exports.ApplyPerMetalRequestDto = exports.MapAliasRequestDto = exports.BcSalesProductsApplyRequestDto = exports.CreateSalesProductRequestDto = exports.LinkDecisionRequestDto = exports.ItemTraceQueryDto = exports.BcHistoryRequestDto = exports.BcAwaitingRequestDto = exports.SaveHandoverRequestDto = exports.RecordStepRequestDto = exports.WorkbookChunkRequestDto = exports.TradesheetImportRequestDto = exports.ImportCustomerOrdersRequestDto = exports.AddEvidenceRequestDto = exports.UpdateCustomerOrderRequestDto = exports.CreateCustomerOrderRequestDto = exports.CarryForwardRequestDto = exports.UpdateCoinRequestDto = exports.AddCoinRequestDto = exports.ImportPhysicalRequestDto = exports.UpdateBarRequestDto = exports.AddBarRequestDto = exports.LinkBcItemRequestDto = exports.UpdateDiscrepancyRequestDto = exports.CreateDiscrepancyRequestDto = exports.UpdateStocktakeLineRequestDto = exports.ImportJournalRequestDto = exports.UpdateStocktakeRequestDto = exports.CreateStocktakeRequestDto = exports.RoadmapPushResultDto = exports.RoadmapPushRequestDto = exports.RoadmapPullResultDto = exports.RoadmapPullRequestDto = exports.RoadmapSyncStatusDto = exports.RoadmapEditRequestDto = exports.RoadmapDocumentDto = exports.RoadmapInboxPromoteDto = exports.RoadmapInboxRefreshDto = exports.RoadmapInboxItemDto = exports.RoadmapInboxDto = exports.UpdateMarketModeRequestDto = exports.MarketModeStateDto = exports.DbDeleteRequestDto = void 0;
exports.MarkNotificationsReadDto = exports.CompanyQuoteTemplateDto = exports.UserPreferencesDto = exports.InviteUserRequestDto = exports.UpdatePermissionMatrixRequestDto = exports.SetOverridesRequestDto = exports.UpdateUserRequestDto = exports.AiFeedbackRequestDto = exports.AnalyticsQueryDto = exports.ResolveSheetApplicationRequestDto = exports.LiveBaselineRequestDto = exports.LinkLiveStockBranchRequestDto = exports.LowThresholdRequestDto = exports.TransferLiveStockRequestDto = exports.SetLiveStockBarStatusRequestDto = exports.AddLiveStockBarRequestDto = exports.CreateLiveStockLineRequestDto = exports.AdjustLiveStockRequestDto = exports.RoadmapQueueFiledResultDto = exports.RoadmapQueueFiledRequestDto = exports.RoadmapQueueAppendedDto = exports.RoadmapQueueListDto = exports.RoadmapQueueRequestDto = void 0;
const shared_types_1 = require("@goldilocks/shared-types");
const shared_types_2 = require("@goldilocks/shared-types");
const shared_types_3 = require("@goldilocks/shared-types");
const dto_generator_1 = require("./dto-generator");
class LoginRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.LoginRequestSchema, 'LoginRequestDto') {
}
exports.LoginRequestDto = LoginRequestDto;
class LoginResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.LoginResponseSchema, 'LoginResponseDto') {
}
exports.LoginResponseDto = LoginResponseDto;
class SessionUserDto extends (0, dto_generator_1.createDto)(shared_types_1.SessionUserSchema, 'SessionUserDto') {
}
exports.SessionUserDto = SessionUserDto;
class UiSettingsRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UiSettingsSchema, 'UiSettingsRequestDto') {
}
exports.UiSettingsRequestDto = UiSettingsRequestDto;
class SetUserBranchRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.SetUserBranchRequestSchema, 'SetUserBranchRequestDto') {
}
exports.SetUserBranchRequestDto = SetUserBranchRequestDto;
class SetKbVisibilityRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.SetKbVisibilityRequestSchema, 'SetKbVisibilityRequestDto') {
}
exports.SetKbVisibilityRequestDto = SetKbVisibilityRequestDto;
class CreateUserRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateUserRequestSchema, 'CreateUserRequestDto') {
}
exports.CreateUserRequestDto = CreateUserRequestDto;
class MessageResponseDto extends (0, dto_generator_1.createDto)((0, shared_types_2.ApiSuccessResponseSchema)(shared_types_1.MessageResponseSchema), 'MessageResponseDto') {
}
exports.MessageResponseDto = MessageResponseDto;
class HealthCheckDto extends (0, dto_generator_1.createDto)(shared_types_2.HealthCheckSchema, 'HealthCheckDto') {
}
exports.HealthCheckDto = HealthCheckDto;
class RawSpotPriceResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.RawSpotPriceSchema, 'RawSpotPriceResponseDto') {
}
exports.RawSpotPriceResponseDto = RawSpotPriceResponseDto;
class SpotPriceResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.SpotPriceSchema, 'SpotPriceResponseDto') {
}
exports.SpotPriceResponseDto = SpotPriceResponseDto;
class CreateSpotPriceDto extends (0, dto_generator_1.createDto)(shared_types_2.CreateSpotPriceDtoSchema, 'CreateSpotPriceDto') {
}
exports.CreateSpotPriceDto = CreateSpotPriceDto;
class CreateProductDto extends (0, dto_generator_1.createDto)(shared_types_2.CreateProductDtoSchema, 'CreateProductDto') {
}
exports.CreateProductDto = CreateProductDto;
class ProductResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.ProductSchema, 'ProductResponseDto') {
}
exports.ProductResponseDto = ProductResponseDto;
class UpdateProductDto extends (0, dto_generator_1.createDto)(shared_types_2.UpdateProductFullDtoSchema, 'UpdateProductDto') {
}
exports.UpdateProductDto = UpdateProductDto;
class UpdateStockRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateStockRequestSchema, 'UpdateStockRequestDto') {
}
exports.UpdateStockRequestDto = UpdateStockRequestDto;
class SpotStatusResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.SpotStatusResponseSchema, 'SpotStatusResponseDto') {
}
exports.SpotStatusResponseDto = SpotStatusResponseDto;
class MarketDataResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.MarketDataResponseSchema, 'MarketDataResponseDto') {
}
exports.MarketDataResponseDto = MarketDataResponseDto;
class RecalculateOverridesDto extends (0, dto_generator_1.createDto)(shared_types_1.RecalculateOverridesSchema, 'RecalculateOverridesDto') {
}
exports.RecalculateOverridesDto = RecalculateOverridesDto;
class RefreshRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RefreshRequestSchema, 'RefreshRequestDto') {
}
exports.RefreshRequestDto = RefreshRequestDto;
class AdminLogsQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.AdminLogsQuerySchema, 'AdminLogsQueryDto') {
}
exports.AdminLogsQueryDto = AdminLogsQueryDto;
class AuditQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.AuditQuerySchema, 'AuditQueryDto') {
}
exports.AuditQueryDto = AuditQueryDto;
class ErrorLogQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.ErrorLogQuerySchema, 'ErrorLogQueryDto') {
}
exports.ErrorLogQueryDto = ErrorLogQueryDto;
class FetchLogQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.FetchLogQuerySchema, 'FetchLogQueryDto') {
}
exports.FetchLogQueryDto = FetchLogQueryDto;
class DbRowsQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.DbRowsQuerySchema, 'DbRowsQueryDto') {
}
exports.DbRowsQueryDto = DbRowsQueryDto;
class BackfillHistoryQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.BackfillHistoryQuerySchema, 'BackfillHistoryQueryDto') {
}
exports.BackfillHistoryQueryDto = BackfillHistoryQueryDto;
class HistoricCloseQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.HistoricCloseQuerySchema, 'HistoricCloseQueryDto') {
}
exports.HistoricCloseQueryDto = HistoricCloseQueryDto;
class TradeBootstrapResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.TradeBootstrapResponseSchema, 'TradeBootstrapResponseDto') {
}
exports.TradeBootstrapResponseDto = TradeBootstrapResponseDto;
class TradeCartRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.TradeCartRequestSchema, 'TradeCartRequestDto') {
}
exports.TradeCartRequestDto = TradeCartRequestDto;
class TradeCartResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.TradeCartResponseSchema, 'TradeCartResponseDto') {
}
exports.TradeCartResponseDto = TradeCartResponseDto;
class MeltCalculatorRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.MeltCalculatorRequestSchema, 'MeltCalculatorRequestDto') {
}
exports.MeltCalculatorRequestDto = MeltCalculatorRequestDto;
class MeltCalculatorResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.MeltCalculatorResponseSchema, 'MeltCalculatorResponseDto') {
}
exports.MeltCalculatorResponseDto = MeltCalculatorResponseDto;
class ProfitAnalysisRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.ProfitAnalysisRequestSchema, 'ProfitAnalysisRequestDto') {
}
exports.ProfitAnalysisRequestDto = ProfitAnalysisRequestDto;
class ProfitAnalysisResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.ProfitAnalysisResponseSchema, 'ProfitAnalysisResponseDto') {
}
exports.ProfitAnalysisResponseDto = ProfitAnalysisResponseDto;
class PortfolioBuildRequestDto extends (0, dto_generator_1.createDto)(shared_types_2.PortfolioBuildRequestSchema, 'PortfolioBuildRequestDto') {
}
exports.PortfolioBuildRequestDto = PortfolioBuildRequestDto;
class PortfolioBuildResponseDto extends (0, dto_generator_1.createDto)(shared_types_2.PortfolioBuildResponseSchema, 'PortfolioBuildResponseDto') {
}
exports.PortfolioBuildResponseDto = PortfolioBuildResponseDto;
class BranchResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.BranchSchema, 'BranchResponseDto') {
}
exports.BranchResponseDto = BranchResponseDto;
class CreateBranchRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateBranchRequestSchema, 'CreateBranchRequestDto') {
}
exports.CreateBranchRequestDto = CreateBranchRequestDto;
class FetchAttemptResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.FetchAttemptSchema, 'FetchAttemptResponseDto') {
}
exports.FetchAttemptResponseDto = FetchAttemptResponseDto;
class FetchMetricsResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.FetchMetricsSchema, 'FetchMetricsResponseDto') {
}
exports.FetchMetricsResponseDto = FetchMetricsResponseDto;
class ClientErrorReportBatchDto extends (0, dto_generator_1.createDto)(shared_types_1.ClientErrorReportBatchSchema, 'ClientErrorReportBatchDto') {
}
exports.ClientErrorReportBatchDto = ClientErrorReportBatchDto;
class KbDocumentListResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.KbDocumentListResponseSchema, 'KbDocumentListResponseDto') {
}
exports.KbDocumentListResponseDto = KbDocumentListResponseDto;
class KbDocumentDto extends (0, dto_generator_1.createDto)(shared_types_1.KbDocumentSchema, 'KbDocumentDto') {
}
exports.KbDocumentDto = KbDocumentDto;
class UpdateKbDocumentRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateKbDocumentRequestSchema, 'UpdateKbDocumentRequestDto') {
}
exports.UpdateKbDocumentRequestDto = UpdateKbDocumentRequestDto;
class SetKbStatusRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.SetKbStatusRequestSchema, 'SetKbStatusRequestDto') {
}
exports.SetKbStatusRequestDto = SetKbStatusRequestDto;
class AskRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.AskRequestSchema, 'AskRequestDto') {
}
exports.AskRequestDto = AskRequestDto;
class AskResponseDto extends (0, dto_generator_1.createDto)(shared_types_1.AskResponseSchema, 'AskResponseDto') {
}
exports.AskResponseDto = AskResponseDto;
class AiStatusDto extends (0, dto_generator_1.createDto)(shared_types_1.AiStatusSchema, 'AiStatusDto') {
}
exports.AiStatusDto = AiStatusDto;
class DbInsertRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.DbInsertRequestSchema, 'DbInsertRequestDto') {
}
exports.DbInsertRequestDto = DbInsertRequestDto;
class DbUpdateRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.DbUpdateRequestSchema, 'DbUpdateRequestDto') {
}
exports.DbUpdateRequestDto = DbUpdateRequestDto;
class DbDeleteRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.DbDeleteRequestSchema, 'DbDeleteRequestDto') {
}
exports.DbDeleteRequestDto = DbDeleteRequestDto;
class MarketModeStateDto extends (0, dto_generator_1.createDto)(shared_types_1.MarketModeStateSchema, 'MarketModeStateDto') {
}
exports.MarketModeStateDto = MarketModeStateDto;
class UpdateMarketModeRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateMarketModeRequestSchema, 'UpdateMarketModeRequestDto') {
}
exports.UpdateMarketModeRequestDto = UpdateMarketModeRequestDto;
class RoadmapInboxDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapInboxSchema, 'RoadmapInboxDto') {
}
exports.RoadmapInboxDto = RoadmapInboxDto;
class RoadmapInboxItemDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapInboxItemSchema, 'RoadmapInboxItemDto') {
}
exports.RoadmapInboxItemDto = RoadmapInboxItemDto;
class RoadmapInboxRefreshDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapInboxRefreshSchema, 'RoadmapInboxRefreshDto') {
}
exports.RoadmapInboxRefreshDto = RoadmapInboxRefreshDto;
class RoadmapInboxPromoteDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapInboxPromoteSchema, 'RoadmapInboxPromoteDto') {
}
exports.RoadmapInboxPromoteDto = RoadmapInboxPromoteDto;
class RoadmapDocumentDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapDocumentSchema, 'RoadmapDocumentDto') {
}
exports.RoadmapDocumentDto = RoadmapDocumentDto;
class RoadmapEditRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapEditRequestSchema, 'RoadmapEditRequestDto') {
}
exports.RoadmapEditRequestDto = RoadmapEditRequestDto;
class RoadmapSyncStatusDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapSyncStatusSchema, 'RoadmapSyncStatusDto') {
}
exports.RoadmapSyncStatusDto = RoadmapSyncStatusDto;
class RoadmapPullRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapPullRequestSchema, 'RoadmapPullRequestDto') {
}
exports.RoadmapPullRequestDto = RoadmapPullRequestDto;
class RoadmapPullResultDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapPullResultSchema, 'RoadmapPullResultDto') {
}
exports.RoadmapPullResultDto = RoadmapPullResultDto;
class RoadmapPushRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapPushRequestSchema, 'RoadmapPushRequestDto') {
}
exports.RoadmapPushRequestDto = RoadmapPushRequestDto;
class RoadmapPushResultDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapPushResultSchema, 'RoadmapPushResultDto') {
}
exports.RoadmapPushResultDto = RoadmapPushResultDto;
class CreateStocktakeRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateStocktakeRequestSchema, 'CreateStocktakeRequestDto') {
}
exports.CreateStocktakeRequestDto = CreateStocktakeRequestDto;
class UpdateStocktakeRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateStocktakeRequestSchema, 'UpdateStocktakeRequestDto') {
}
exports.UpdateStocktakeRequestDto = UpdateStocktakeRequestDto;
class ImportJournalRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.ImportJournalRequestSchema, 'ImportJournalRequestDto') {
}
exports.ImportJournalRequestDto = ImportJournalRequestDto;
class UpdateStocktakeLineRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateStocktakeLineRequestSchema, 'UpdateStocktakeLineRequestDto') {
}
exports.UpdateStocktakeLineRequestDto = UpdateStocktakeLineRequestDto;
class CreateDiscrepancyRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateDiscrepancyRequestSchema, 'CreateDiscrepancyRequestDto') {
}
exports.CreateDiscrepancyRequestDto = CreateDiscrepancyRequestDto;
class UpdateDiscrepancyRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateDiscrepancyRequestSchema, 'UpdateDiscrepancyRequestDto') {
}
exports.UpdateDiscrepancyRequestDto = UpdateDiscrepancyRequestDto;
class LinkBcItemRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.LinkBcItemRequestSchema, 'LinkBcItemRequestDto') {
}
exports.LinkBcItemRequestDto = LinkBcItemRequestDto;
class AddBarRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.AddBarRequestSchema, 'AddBarRequestDto') {
}
exports.AddBarRequestDto = AddBarRequestDto;
class UpdateBarRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateBarRequestSchema, 'UpdateBarRequestDto') {
}
exports.UpdateBarRequestDto = UpdateBarRequestDto;
class ImportPhysicalRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.ImportPhysicalRequestSchema, 'ImportPhysicalRequestDto') {
}
exports.ImportPhysicalRequestDto = ImportPhysicalRequestDto;
class AddCoinRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.AddCoinRequestSchema, 'AddCoinRequestDto') {
}
exports.AddCoinRequestDto = AddCoinRequestDto;
class UpdateCoinRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateCoinRequestSchema, 'UpdateCoinRequestDto') {
}
exports.UpdateCoinRequestDto = UpdateCoinRequestDto;
class CarryForwardRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CarryForwardRequestSchema, 'CarryForwardRequestDto') {
}
exports.CarryForwardRequestDto = CarryForwardRequestDto;
class CreateCustomerOrderRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateCustomerOrderRequestSchema, 'CreateCustomerOrderRequestDto') {
}
exports.CreateCustomerOrderRequestDto = CreateCustomerOrderRequestDto;
class UpdateCustomerOrderRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateCustomerOrderRequestSchema, 'UpdateCustomerOrderRequestDto') {
}
exports.UpdateCustomerOrderRequestDto = UpdateCustomerOrderRequestDto;
class AddEvidenceRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.AddEvidenceRequestSchema, 'AddEvidenceRequestDto') {
}
exports.AddEvidenceRequestDto = AddEvidenceRequestDto;
class ImportCustomerOrdersRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.ImportCustomerOrdersRequestSchema, 'ImportCustomerOrdersRequestDto') {
}
exports.ImportCustomerOrdersRequestDto = ImportCustomerOrdersRequestDto;
class TradesheetImportRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.TradesheetImportRequestSchema, 'TradesheetImportRequestDto') {
}
exports.TradesheetImportRequestDto = TradesheetImportRequestDto;
class WorkbookChunkRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.WorkbookChunkRequestSchema, 'WorkbookChunkRequestDto') {
}
exports.WorkbookChunkRequestDto = WorkbookChunkRequestDto;
class RecordStepRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RecordStepRequestSchema, 'RecordStepRequestDto') {
}
exports.RecordStepRequestDto = RecordStepRequestDto;
class SaveHandoverRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.SaveHandoverRequestSchema, 'SaveHandoverRequestDto') {
}
exports.SaveHandoverRequestDto = SaveHandoverRequestDto;
class BcAwaitingRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.BcAwaitingRequestSchema, 'BcAwaitingRequestDto') {
}
exports.BcAwaitingRequestDto = BcAwaitingRequestDto;
class BcHistoryRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.BcHistoryRequestSchema, 'BcHistoryRequestDto') {
}
exports.BcHistoryRequestDto = BcHistoryRequestDto;
class ItemTraceQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.ItemTraceQuerySchema, 'ItemTraceQueryDto') {
}
exports.ItemTraceQueryDto = ItemTraceQueryDto;
class LinkDecisionRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.LinkDecisionRequestSchema, 'LinkDecisionRequestDto') {
}
exports.LinkDecisionRequestDto = LinkDecisionRequestDto;
class CreateSalesProductRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.CreateSalesProductRequestSchema, 'CreateSalesProductRequestDto') {
}
exports.CreateSalesProductRequestDto = CreateSalesProductRequestDto;
class BcSalesProductsApplyRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.BcSalesProductsApplyRequestSchema, 'BcSalesProductsApplyRequestDto') {
}
exports.BcSalesProductsApplyRequestDto = BcSalesProductsApplyRequestDto;
class MapAliasRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.MapAliasRequestSchema, 'MapAliasRequestDto') {
}
exports.MapAliasRequestDto = MapAliasRequestDto;
class ApplyPerMetalRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.ApplyPerMetalRequestSchema, 'ApplyPerMetalRequestDto') {
}
exports.ApplyPerMetalRequestDto = ApplyPerMetalRequestDto;
class RelinkRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RelinkRequestSchema, 'RelinkRequestDto') {
}
exports.RelinkRequestDto = RelinkRequestDto;
class SettleNamesRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.SettleNamesRequestSchema, 'SettleNamesRequestDto') {
}
exports.SettleNamesRequestDto = SettleNamesRequestDto;
class NameSuggestionAcceptRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.NameSuggestionAcceptRequestSchema, 'NameSuggestionAcceptRequestDto') {
}
exports.NameSuggestionAcceptRequestDto = NameSuggestionAcceptRequestDto;
class NameSuggestionDecisionRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.NameSuggestionDecisionRequestSchema, 'NameSuggestionDecisionRequestDto') {
}
exports.NameSuggestionDecisionRequestDto = NameSuggestionDecisionRequestDto;
class RecordSearchRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RecordSearchRequestSchema, 'RecordSearchRequestDto') {
}
exports.RecordSearchRequestDto = RecordSearchRequestDto;
class RoadmapScopeDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapScopeSchema, 'RoadmapScopeDto') {
}
exports.RoadmapScopeDto = RoadmapScopeDto;
class RoadmapScopeRefreshDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapScopeRefreshSchema, 'RoadmapScopeRefreshDto') {
}
exports.RoadmapScopeRefreshDto = RoadmapScopeRefreshDto;
class RoadmapQueueRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapQueueRequestSchema, 'RoadmapQueueRequestDto') {
}
exports.RoadmapQueueRequestDto = RoadmapQueueRequestDto;
class RoadmapQueueListDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapQueueListSchema, 'RoadmapQueueListDto') {
}
exports.RoadmapQueueListDto = RoadmapQueueListDto;
class RoadmapQueueAppendedDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapQueueAppendedSchema, 'RoadmapQueueAppendedDto') {
}
exports.RoadmapQueueAppendedDto = RoadmapQueueAppendedDto;
class RoadmapQueueFiledRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapQueueFiledRequestSchema, 'RoadmapQueueFiledRequestDto') {
}
exports.RoadmapQueueFiledRequestDto = RoadmapQueueFiledRequestDto;
class RoadmapQueueFiledResultDto extends (0, dto_generator_1.createDto)(shared_types_1.RoadmapQueueFiledResultSchema, 'RoadmapQueueFiledResultDto') {
}
exports.RoadmapQueueFiledResultDto = RoadmapQueueFiledResultDto;
class AdjustLiveStockRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.AdjustLiveStockRequestSchema, 'AdjustLiveStockRequestDto') {
}
exports.AdjustLiveStockRequestDto = AdjustLiveStockRequestDto;
class CreateLiveStockLineRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.CreateLiveStockLineRequestSchema, 'CreateLiveStockLineRequestDto') {
}
exports.CreateLiveStockLineRequestDto = CreateLiveStockLineRequestDto;
class AddLiveStockBarRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.AddLiveStockBarRequestSchema, 'AddLiveStockBarRequestDto') {
}
exports.AddLiveStockBarRequestDto = AddLiveStockBarRequestDto;
class SetLiveStockBarStatusRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.SetLiveStockBarStatusRequestSchema, 'SetLiveStockBarStatusRequestDto') {
}
exports.SetLiveStockBarStatusRequestDto = SetLiveStockBarStatusRequestDto;
class TransferLiveStockRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.TransferLiveStockRequestSchema, 'TransferLiveStockRequestDto') {
}
exports.TransferLiveStockRequestDto = TransferLiveStockRequestDto;
class LowThresholdRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.LowThresholdRequestSchema, 'LowThresholdRequestDto') {
}
exports.LowThresholdRequestDto = LowThresholdRequestDto;
class LinkLiveStockBranchRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.LinkLiveStockBranchRequestSchema, 'LinkLiveStockBranchRequestDto') {
}
exports.LinkLiveStockBranchRequestDto = LinkLiveStockBranchRequestDto;
class LiveBaselineRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.LiveBaselineRequestSchema, 'LiveBaselineRequestDto') {
}
exports.LiveBaselineRequestDto = LiveBaselineRequestDto;
class ResolveSheetApplicationRequestDto extends (0, dto_generator_1.createDto)(shared_types_3.ResolveSheetApplicationRequestSchema, 'ResolveSheetApplicationRequestDto') {
}
exports.ResolveSheetApplicationRequestDto = ResolveSheetApplicationRequestDto;
class AnalyticsQueryDto extends (0, dto_generator_1.createDto)(shared_types_1.AnalyticsQuerySchema, 'AnalyticsQueryDto') {
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
class AiFeedbackRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.AiFeedbackRequestSchema, 'AiFeedbackRequestDto') {
}
exports.AiFeedbackRequestDto = AiFeedbackRequestDto;
class UpdateUserRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdateUserRequestSchema, 'UpdateUserRequestDto') {
}
exports.UpdateUserRequestDto = UpdateUserRequestDto;
class SetOverridesRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.SetOverridesRequestSchema, 'SetOverridesRequestDto') {
}
exports.SetOverridesRequestDto = SetOverridesRequestDto;
class UpdatePermissionMatrixRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.UpdatePermissionMatrixRequestSchema, 'UpdatePermissionMatrixRequestDto') {
}
exports.UpdatePermissionMatrixRequestDto = UpdatePermissionMatrixRequestDto;
class InviteUserRequestDto extends (0, dto_generator_1.createDto)(shared_types_1.InviteUserRequestSchema, 'InviteUserRequestDto') {
}
exports.InviteUserRequestDto = InviteUserRequestDto;
class UserPreferencesDto extends (0, dto_generator_1.createDto)(shared_types_1.UserPreferencesSchema, 'UserPreferencesDto') {
}
exports.UserPreferencesDto = UserPreferencesDto;
class CompanyQuoteTemplateDto extends (0, dto_generator_1.createDto)(shared_types_1.CompanyQuoteTemplateSchema, 'CompanyQuoteTemplateDto') {
}
exports.CompanyQuoteTemplateDto = CompanyQuoteTemplateDto;
class MarkNotificationsReadDto extends (0, dto_generator_1.createDto)(shared_types_1.MarkNotificationsReadSchema, 'MarkNotificationsReadDto') {
}
exports.MarkNotificationsReadDto = MarkNotificationsReadDto;
//# sourceMappingURL=dtos.js.map