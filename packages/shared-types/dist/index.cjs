"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AI_MESSAGE_MAX_LENGTH: () => AI_MESSAGE_MAX_LENGTH,
  AI_QUESTION_MAX_LENGTH: () => AI_QUESTION_MAX_LENGTH,
  ALIAS_USAGE_SOURCES: () => ALIAS_USAGE_SOURCES,
  ALIAS_VIEWS: () => ALIAS_VIEWS,
  AddBarRequestSchema: () => AddBarRequestSchema,
  AddCoinRequestSchema: () => AddCoinRequestSchema,
  AddEvidenceRequestSchema: () => AddEvidenceRequestSchema,
  AddLiveStockBarRequestSchema: () => AddLiveStockBarRequestSchema,
  AdjustLiveStockRequestSchema: () => AdjustLiveStockRequestSchema,
  AdminLogEntrySchema: () => AdminLogEntrySchema,
  AdminLogsQuerySchema: () => AdminLogsQuerySchema,
  AdminLogsResponseSchema: () => AdminLogsResponseSchema,
  AdminOverviewSchema: () => AdminOverviewSchema,
  AiAnswerStatusEnum: () => AiAnswerStatusEnum,
  AiCitationSchema: () => AiCitationSchema,
  AiModeEnum: () => AiModeEnum,
  AiSpotNoteSchema: () => AiSpotNoteSchema,
  AiStatusSchema: () => AiStatusSchema,
  AiUsageSchema: () => AiUsageSchema,
  AliasCountsSchema: () => AliasCountsSchema,
  AliasRowSchema: () => AliasRowSchema,
  AliasSeenInSchema: () => AliasSeenInSchema,
  AliasTargetSchema: () => AliasTargetSchema,
  AliasUsageExampleSchema: () => AliasUsageExampleSchema,
  AliasUsageMetalSchema: () => AliasUsageMetalSchema,
  AliasUsageResponseSchema: () => AliasUsageResponseSchema,
  AliasUsageSourceSchema: () => AliasUsageSourceSchema,
  AliasesQuerySchema: () => AliasesQuerySchema,
  AliasesResponseSchema: () => AliasesResponseSchema,
  AllocationSummarySchema: () => AllocationSummarySchema,
  ApiCatalogueSchema: () => ApiCatalogueSchema,
  ApiEndpointParameterSchema: () => ApiEndpointParameterSchema,
  ApiEndpointSchema: () => ApiEndpointSchema,
  ApiErrorResponseSchema: () => ApiErrorResponseSchema,
  ApiSuccessResponseSchema: () => ApiSuccessResponseSchema,
  ApplyPerMetalRequestSchema: () => ApplyPerMetalRequestSchema,
  ApplyPerMetalResultSchema: () => ApplyPerMetalResultSchema,
  AskRequestSchema: () => AskRequestSchema,
  AskResponseSchema: () => AskResponseSchema,
  AskStreamEventSchema: () => AskStreamEventSchema,
  AuditEntrySchema: () => AuditEntrySchema,
  AuditLogResponseSchema: () => AuditLogResponseSchema,
  AuditQuerySchema: () => AuditQuerySchema,
  AuthResponseSchema: () => AuthResponseSchema,
  BAR_EXPORT_HEADERS: () => BAR_EXPORT_HEADERS,
  BAR_STATUSES: () => BAR_STATUSES,
  BC_HISTORY_KINDS: () => BC_HISTORY_KINDS,
  BackfillHistoryQuerySchema: () => BackfillHistoryQuerySchema,
  BarStatusEnum: () => BarStatusEnum,
  BaselineBarRowSchema: () => BaselineBarRowSchema,
  BaselineCoinRowSchema: () => BaselineCoinRowSchema,
  BcAwaitingRequestSchema: () => BcAwaitingRequestSchema,
  BcAwaitingResultSchema: () => BcAwaitingResultSchema,
  BcHistoryRequestSchema: () => BcHistoryRequestSchema,
  BcHistoryResultSchema: () => BcHistoryResultSchema,
  BcItemProductOptionSchema: () => BcItemProductOptionSchema,
  BcItemSchema: () => BcItemSchema,
  BcItemsResponseSchema: () => BcItemsResponseSchema,
  BcLedgerRowSchema: () => BcLedgerRowSchema,
  BcReceiptRowSchema: () => BcReceiptRowSchema,
  BcSalesProductActionSchema: () => BcSalesProductActionSchema,
  BcSalesProductRowSchema: () => BcSalesProductRowSchema,
  BcSalesProductsApplyRequestSchema: () => BcSalesProductsApplyRequestSchema,
  BcSalesProductsApplyResultSchema: () => BcSalesProductsApplyResultSchema,
  BcSalesProductsPreviewSchema: () => BcSalesProductsPreviewSchema,
  BcShipmentLineRowSchema: () => BcShipmentLineRowSchema,
  BcShipmentRowSchema: () => BcShipmentRowSchema,
  BranchRegionEnum: () => BranchRegionEnum,
  BranchSchema: () => BranchSchema,
  CASH_AML_THRESHOLD: () => CASH_AML_THRESHOLD,
  COIN_DESIGNS: () => COIN_DESIGNS,
  COIN_EXPORT_HEADERS: () => COIN_EXPORT_HEADERS,
  COLLAPSE_ABOVE_CHARACTERS: () => COLLAPSE_ABOVE_CHARACTERS,
  COLLECTED_FLAGS: () => COLLECTED_FLAGS,
  COLLECTED_TASK: () => COLLECTED_TASK,
  CPTY_KINDS: () => CPTY_KINDS,
  CUSTOMER_ORDER_STATUSES: () => CUSTOMER_ORDER_STATUSES,
  CUSTOMER_ORDER_STATUS_LABELS: () => CUSTOMER_ORDER_STATUS_LABELS,
  CarryForwardRequestSchema: () => CarryForwardRequestSchema,
  CarryForwardResultSchema: () => CarryForwardResultSchema,
  ChangePasswordSchema: () => ChangePasswordSchema,
  ClientErrorReportBatchSchema: () => ClientErrorReportBatchSchema,
  ClientErrorReportSchema: () => ClientErrorReportSchema,
  ColorModeEnum: () => ColorModeEnum,
  CreateBranchRequestSchema: () => CreateBranchRequestSchema,
  CreateCustomerOrderRequestSchema: () => CreateCustomerOrderRequestSchema,
  CreateDiscrepancyRequestSchema: () => CreateDiscrepancyRequestSchema,
  CreateLiveStockLineRequestSchema: () => CreateLiveStockLineRequestSchema,
  CreateProductDtoSchema: () => CreateProductDtoSchema,
  CreateSalesProductRequestSchema: () => CreateSalesProductRequestSchema,
  CreateSpotPriceDtoSchema: () => CreateSpotPriceDtoSchema,
  CreateStocktakeRequestSchema: () => CreateStocktakeRequestSchema,
  CreateUserRequestSchema: () => CreateUserRequestSchema,
  CurrencyEnum: () => CurrencyEnum,
  CustomerInvoiceRowSchema: () => CustomerInvoiceRowSchema,
  CustomerListResponseSchema: () => CustomerListResponseSchema,
  CustomerListRowSchema: () => CustomerListRowSchema,
  CustomerOrderEvidenceSchema: () => CustomerOrderEvidenceSchema,
  CustomerOrderRowSchema: () => CustomerOrderRowSchema,
  CustomerOrderSchema: () => CustomerOrderSchema,
  CustomerOrderStatusEnum: () => CustomerOrderStatusEnum,
  CustomerProfileSchema: () => CustomerProfileSchema,
  DISCREPANCY_ISSUE_TYPES: () => DISCREPANCY_ISSUE_TYPES,
  DbColumnSchema: () => DbColumnSchema,
  DbDeleteRequestSchema: () => DbDeleteRequestSchema,
  DbInsertRequestSchema: () => DbInsertRequestSchema,
  DbRowResponseSchema: () => DbRowResponseSchema,
  DbRowsQuerySchema: () => DbRowsQuerySchema,
  DbRowsResponseSchema: () => DbRowsResponseSchema,
  DbTableSummarySchema: () => DbTableSummarySchema,
  DbTablesResponseSchema: () => DbTablesResponseSchema,
  DbUpdateRequestSchema: () => DbUpdateRequestSchema,
  DiscrepancyIssueTypeEnum: () => DiscrepancyIssueTypeEnum,
  DiscrepancySchema: () => DiscrepancySchema,
  DuplicateRowSchema: () => DuplicateRowSchema,
  DuplicatesResponseSchema: () => DuplicatesResponseSchema,
  EMPTY_SCOPE_VIEW: () => EMPTY_SCOPE_VIEW,
  EVIDENCE_KINDS: () => EVIDENCE_KINDS,
  EVIDENCE_KIND_LABELS: () => EVIDENCE_KIND_LABELS,
  ErrorLogEntrySchema: () => ErrorLogEntrySchema,
  ErrorLogKindEnum: () => ErrorLogKindEnum,
  ErrorLogQuerySchema: () => ErrorLogQuerySchema,
  ErrorLogSeverityEnum: () => ErrorLogSeverityEnum,
  ErrorLogSourceEnum: () => ErrorLogSourceEnum,
  EvidenceKindEnum: () => EvidenceKindEnum,
  ExpectedCustomerStockSchema: () => ExpectedCustomerStockSchema,
  FAKE_CUSTOMERS: () => FAKE_CUSTOMERS,
  FIT_HIGH: () => FIT_HIGH,
  FIT_HIGH_SILVER: () => FIT_HIGH_SILVER,
  FIT_LOW: () => FIT_LOW,
  FOREIGN_COINS: () => FOREIGN_COINS,
  FetchAttemptSchema: () => FetchAttemptSchema,
  FetchLogQuerySchema: () => FetchLogQuerySchema,
  FetchMetricsSchema: () => FetchMetricsSchema,
  FetchSourceEnum: () => FetchSourceEnum,
  FetchTriggerEnum: () => FetchTriggerEnum,
  GRAMS_PER_TROY_OUNCE: () => GRAMS_PER_TROY_OUNCE,
  HandoverSchema: () => HandoverSchema,
  HealthCheckSchema: () => HealthCheckSchema,
  HealthItemSchema: () => HealthItemSchema,
  HealthStatusEnum: () => HealthStatusEnum,
  HistoricCloseQuerySchema: () => HistoricCloseQuerySchema,
  HistoricSpotSchema: () => HistoricSpotSchema,
  HourlyStatsSchema: () => HourlyStatsSchema,
  IMPORT_SCHEMA_VERSION: () => IMPORT_SCHEMA_VERSION,
  IMPORT_TABLE_NAMES: () => IMPORT_TABLE_NAMES,
  IMPORT_TABLE_SPECS: () => IMPORT_TABLE_SPECS,
  ISSUE_TYPE_LABELS: () => ISSUE_TYPE_LABELS,
  ITEM_EVENT_KINDS: () => ITEM_EVENT_KINDS,
  ITEM_STATUSES: () => ITEM_STATUSES,
  ImportBatchListSchema: () => ImportBatchListSchema,
  ImportBatchSummarySchema: () => ImportBatchSummarySchema,
  ImportCustomerOrdersRequestSchema: () => ImportCustomerOrdersRequestSchema,
  ImportCustomerOrdersResultSchema: () => ImportCustomerOrdersResultSchema,
  ImportJournalRequestSchema: () => ImportJournalRequestSchema,
  ImportJournalResultSchema: () => ImportJournalResultSchema,
  ImportMetaSchema: () => ImportMetaSchema,
  ImportPhysicalRequestSchema: () => ImportPhysicalRequestSchema,
  ImportPhysicalResultSchema: () => ImportPhysicalResultSchema,
  ImportRowIssueCodeSchema: () => ImportRowIssueCodeSchema,
  ImportRowIssueSchema: () => ImportRowIssueSchema,
  ImportTableSchemas: () => ImportTableSchemas,
  InventoryBarRowSchema: () => InventoryBarRowSchema,
  InventoryBarsQuerySchema: () => InventoryBarsQuerySchema,
  InventoryBarsResponseSchema: () => InventoryBarsResponseSchema,
  InventoryCoinRowSchema: () => InventoryCoinRowSchema,
  InventoryCoinsQuerySchema: () => InventoryCoinsQuerySchema,
  InventoryCoinsResponseSchema: () => InventoryCoinsResponseSchema,
  InventoryPositionSchema: () => InventoryPositionSchema,
  InventoryStocktakeRefSchema: () => InventoryStocktakeRefSchema,
  InvoiceCollectedSchema: () => InvoiceCollectedSchema,
  InvoiceDetailSchema: () => InvoiceDetailSchema,
  InvoiceLineRowSchema: () => InvoiceLineRowSchema,
  InvoiceLinkRowSchema: () => InvoiceLinkRowSchema,
  InvoiceListResponseSchema: () => InvoiceListResponseSchema,
  InvoiceListRowSchema: () => InvoiceListRowSchema,
  ItemTraceEventSchema: () => ItemTraceEventSchema,
  ItemTraceQuerySchema: () => ItemTraceQuerySchema,
  ItemTraceSchema: () => ItemTraceSchema,
  JOURNAL_EXPORT_HEADERS: () => JOURNAL_EXPORT_HEADERS,
  KB_BC_HUB: () => KB_BC_HUB,
  KB_BC_HUB_PATH: () => KB_BC_HUB_PATH,
  KB_CATEGORIES: () => KB_CATEGORIES,
  KB_CATEGORY_INFO: () => KB_CATEGORY_INFO,
  KB_FLOW_BARS: () => KB_FLOW_BARS,
  KB_GUIDE: () => KB_GUIDE,
  KB_REVIEW_MONTHS: () => KB_REVIEW_MONTHS,
  KB_REVIEW_WARNING_DAYS: () => KB_REVIEW_WARNING_DAYS,
  KB_TERMS: () => KB_TERMS,
  KB_UNRESOLVED_HREF_PREFIX: () => KB_UNRESOLVED_HREF_PREFIX,
  KbCategoryEnum: () => KbCategoryEnum,
  KbDocumentListResponseSchema: () => KbDocumentListResponseSchema,
  KbDocumentSchema: () => KbDocumentSchema,
  KbFrontmatterSchema: () => KbFrontmatterSchema,
  KbJurisdictionEnum: () => KbJurisdictionEnum,
  KbSlugSchema: () => KbSlugSchema,
  KbStatusEnum: () => KbStatusEnum,
  KbVisibilityEnum: () => KbVisibilityEnum,
  LINK_CONFIDENCES: () => LINK_CONFIDENCES,
  LINK_TYPES: () => LINK_TYPES,
  LIVE_BRANCH_CODES: () => LIVE_BRANCH_CODES,
  LIVE_BRANCH_NAMES: () => LIVE_BRANCH_NAMES,
  LatestHandoverSchema: () => LatestHandoverSchema,
  LinkBcItemRequestSchema: () => LinkBcItemRequestSchema,
  LinkDecisionRequestSchema: () => LinkDecisionRequestSchema,
  LinkDecisionResultSchema: () => LinkDecisionResultSchema,
  LinkDecisionSchema: () => LinkDecisionSchema,
  LinkLiveStockBranchRequestSchema: () => LinkLiveStockBranchRequestSchema,
  LiveBarStatusSchema: () => LiveBarStatusSchema,
  LiveBaselinePreviewSchema: () => LiveBaselinePreviewSchema,
  LiveBaselineRequestSchema: () => LiveBaselineRequestSchema,
  LiveBaselineResultSchema: () => LiveBaselineResultSchema,
  LiveKindSchema: () => LiveKindSchema,
  LiveMetalSchema: () => LiveMetalSchema,
  LiveMovementSourceSchema: () => LiveMovementSourceSchema,
  LiveStockBarSchema: () => LiveStockBarSchema,
  LiveStockBoardQuerySchema: () => LiveStockBoardQuerySchema,
  LiveStockBoardSchema: () => LiveStockBoardSchema,
  LiveStockBranchSchema: () => LiveStockBranchSchema,
  LiveStockBranchesResponseSchema: () => LiveStockBranchesResponseSchema,
  LiveStockLineSchema: () => LiveStockLineSchema,
  LiveStockMovementSchema: () => LiveStockMovementSchema,
  LogLevelEnum: () => LogLevelEnum,
  LoginRequestSchema: () => LoginRequestSchema,
  LoginResponseSchema: () => LoginResponseSchema,
  LoginSchema: () => LoginSchema,
  LowThresholdRequestSchema: () => LowThresholdRequestSchema,
  MAX_LISTED_ISSUES: () => MAX_LISTED_ISSUES,
  MELT_CATEGORIES: () => MELT_CATEGORIES,
  MapAliasRequestSchema: () => MapAliasRequestSchema,
  MarketDataResponseSchema: () => MarketDataResponseSchema,
  MarketModeStateSchema: () => MarketModeStateSchema,
  MeltCalculatorRequestSchema: () => MeltCalculatorRequestSchema,
  MeltCalculatorResponseSchema: () => MeltCalculatorResponseSchema,
  MeltCategoryDataSchema: () => MeltCategoryDataSchema,
  MeltCategoryKeyEnum: () => MeltCategoryKeyEnum,
  MessageResponseSchema: () => MessageResponseSchema,
  MetalSymbolSchema: () => MetalSymbolSchema,
  MetalTypeEnum: () => MetalTypeEnum,
  NameSuggestionAcceptRequestSchema: () => NameSuggestionAcceptRequestSchema,
  NameSuggestionAcceptResultSchema: () => NameSuggestionAcceptResultSchema,
  NameSuggestionDecisionRequestSchema: () => NameSuggestionDecisionRequestSchema,
  NameSuggestionDecisionResultSchema: () => NameSuggestionDecisionResultSchema,
  NameSuggestionTargetSchema: () => NameSuggestionTargetSchema,
  OPTIONAL_COLUMNS: () => OPTIONAL_COLUMNS,
  ORDER_LIFECYCLE: () => ORDER_LIFECYCLE,
  ORDER_LIFECYCLE_LABELS: () => ORDER_LIFECYCLE_LABELS,
  ORDER_STEPS: () => ORDER_STEPS,
  OrderDetailSchema: () => OrderDetailSchema,
  OrderEventSchema: () => OrderEventSchema,
  OrderLifecycleEnum: () => OrderLifecycleEnum,
  OrderListQuerySchema: () => OrderListQuerySchema,
  OrderListResponseSchema: () => OrderListResponseSchema,
  OrderQueueEnum: () => OrderQueueEnum,
  OrderRowSchema: () => OrderRowSchema,
  OrderSourceEnum: () => OrderSourceEnum,
  OrderStepEnum: () => OrderStepEnum,
  OverAllocatedLotSchema: () => OverAllocatedLotSchema,
  OverAllocatedResponseSchema: () => OverAllocatedResponseSchema,
  PLAN_ROW_STATUSES: () => PLAN_ROW_STATUSES,
  PORTFOLIO_MAX_QTY: () => PORTFOLIO_MAX_QTY,
  PORTFOLIO_SMALL_INVESTOR_LIMIT: () => PORTFOLIO_SMALL_INVESTOR_LIMIT,
  PRODUCT_NORM_EXAMPLES: () => PRODUCT_NORM_EXAMPLES,
  PURCHASE_FIELDS: () => PURCHASE_FIELDS,
  PaginationSchema: () => PaginationSchema,
  PaymentRowSchema: () => PaymentRowSchema,
  PerMetalChoiceSchema: () => PerMetalChoiceSchema,
  PhysicalRegisterSchema: () => PhysicalRegisterSchema,
  PlanCountsSchema: () => PlanCountsSchema,
  PlanRowSchema: () => PlanRowSchema,
  PlanRowStatusEnum: () => PlanRowStatusEnum,
  Platform: () => Platform,
  PortfolioBuildRequestSchema: () => PortfolioBuildRequestSchema,
  PortfolioBuildResponseSchema: () => PortfolioBuildResponseSchema,
  PortfolioLineItemSchema: () => PortfolioLineItemSchema,
  PortfolioProductTypeFilterEnum: () => PortfolioProductTypeFilterEnum,
  PortfolioStrategyResultSchema: () => PortfolioStrategyResultSchema,
  PricingProductOptionListSchema: () => PricingProductOptionListSchema,
  PricingProductOptionSchema: () => PricingProductOptionSchema,
  PriorityStrengthEnum: () => PriorityStrengthEnum,
  ProductArraySchema: () => ProductArraySchema,
  ProductCategoryEnum: () => ProductCategoryEnum,
  ProductMapSchema: () => ProductMapSchema,
  ProductSchema: () => ProductSchema,
  ProductStockLevelSchema: () => ProductStockLevelSchema,
  ProductStockLevelsResponseSchema: () => ProductStockLevelsResponseSchema,
  ProductsSchema: () => ProductsSchema,
  ProfitAnalysisMissingFieldEnum: () => ProfitAnalysisMissingFieldEnum,
  ProfitAnalysisRequestSchema: () => ProfitAnalysisRequestSchema,
  ProfitAnalysisResponseSchema: () => ProfitAnalysisResponseSchema,
  QuoteRowSchema: () => QuoteRowSchema,
  RECORD_PAGE_MAX: () => RECORD_PAGE_MAX,
  REDACTED_CODE_COLUMNS: () => REDACTED_CODE_COLUMNS,
  REDACTED_NAME_TABLES: () => REDACTED_NAME_TABLES,
  REDACTED_TEXT_COLUMNS: () => REDACTED_TEXT_COLUMNS,
  REFINERIES: () => REFINERIES,
  REGISTER_EXPORT_HEADERS: () => REGISTER_EXPORT_HEADERS,
  RELINK_TABLES: () => RELINK_TABLES,
  ROADMAP_QUEUE_MAX_TEXT: () => ROADMAP_QUEUE_MAX_TEXT,
  ROADMAP_SCOPE_FILES: () => ROADMAP_SCOPE_FILES,
  RawProductSchema: () => RawProductSchema,
  RawSpotPriceSchema: () => RawSpotPriceSchema,
  RecalculateOverridesSchema: () => RecalculateOverridesSchema,
  ReconcileResultSchema: () => ReconcileResultSchema,
  RecordSearchRequestSchema: () => RecordSearchRequestSchema,
  RecordStepRequestSchema: () => RecordStepRequestSchema,
  RefreshRequestSchema: () => RefreshRequestSchema,
  RefreshResponseSchema: () => RefreshResponseSchema,
  RegisterSchema: () => RegisterSchema,
  RelinkRequestSchema: () => RelinkRequestSchema,
  RelinkResultSchema: () => RelinkResultSchema,
  RelinkTableResultSchema: () => RelinkTableResultSchema,
  ResolveSheetApplicationRequestSchema: () => ResolveSheetApplicationRequestSchema,
  ReviewLinkRowSchema: () => ReviewLinkRowSchema,
  ReviewLinkTypeSchema: () => ReviewLinkTypeSchema,
  ReviewLinksQuerySchema: () => ReviewLinksQuerySchema,
  ReviewLinksResponseSchema: () => ReviewLinksResponseSchema,
  ReviewPageQuerySchema: () => ReviewPageQuerySchema,
  ReviewSummarySchema: () => ReviewSummarySchema,
  RoadmapDocumentSchema: () => RoadmapDocumentSchema,
  RoadmapEditError: () => RoadmapEditError,
  RoadmapEditRequestSchema: () => RoadmapEditRequestSchema,
  RoadmapEditSchema: () => RoadmapEditSchema,
  RoadmapInboxItemSchema: () => RoadmapInboxItemSchema,
  RoadmapInboxPromoteSchema: () => RoadmapInboxPromoteSchema,
  RoadmapInboxRefreshSchema: () => RoadmapInboxRefreshSchema,
  RoadmapInboxSchema: () => RoadmapInboxSchema,
  RoadmapPullRequestSchema: () => RoadmapPullRequestSchema,
  RoadmapPullResultSchema: () => RoadmapPullResultSchema,
  RoadmapPushRequestSchema: () => RoadmapPushRequestSchema,
  RoadmapPushResultSchema: () => RoadmapPushResultSchema,
  RoadmapQueueAppendedSchema: () => RoadmapQueueAppendedSchema,
  RoadmapQueueEntrySchema: () => RoadmapQueueEntrySchema,
  RoadmapQueueFiledRequestSchema: () => RoadmapQueueFiledRequestSchema,
  RoadmapQueueFiledResultSchema: () => RoadmapQueueFiledResultSchema,
  RoadmapQueueListSchema: () => RoadmapQueueListSchema,
  RoadmapQueueRequestSchema: () => RoadmapQueueRequestSchema,
  RoadmapQueueSourceSchema: () => RoadmapQueueSourceSchema,
  RoadmapScopeDecisionSchema: () => RoadmapScopeDecisionSchema,
  RoadmapScopeDoneSchema: () => RoadmapScopeDoneSchema,
  RoadmapScopeItemSchema: () => RoadmapScopeItemSchema,
  RoadmapScopeKeySchema: () => RoadmapScopeKeySchema,
  RoadmapScopeRefreshSchema: () => RoadmapScopeRefreshSchema,
  RoadmapScopeSchema: () => RoadmapScopeSchema,
  RoadmapScopeTaskSchema: () => RoadmapScopeTaskSchema,
  RoadmapScopeViewSchema: () => RoadmapScopeViewSchema,
  RoadmapSyncStatusSchema: () => RoadmapSyncStatusSchema,
  RouteStatsSchema: () => RouteStatsSchema,
  SAFE_STATUSES: () => SAFE_STATUSES,
  SALE_FIELDS: () => SALE_FIELDS,
  SHEETS: () => SHEETS,
  SPOT_FETCH_INTERVAL_MS: () => SPOT_FETCH_INTERVAL_MS,
  SPOT_LATE_AFTER_MS: () => SPOT_LATE_AFTER_MS,
  SPOT_RED_AFTER_MS: () => SPOT_RED_AFTER_MS,
  SPOT_STALE_AFTER_MS: () => SPOT_STALE_AFTER_MS,
  STEP_ROLE: () => STEP_ROLE,
  STOCK_METALS: () => STOCK_METALS,
  SYSTEMS: () => SYSTEMS,
  SalesProductListSchema: () => SalesProductListSchema,
  SalesProductSchema: () => SalesProductSchema,
  SaveHandoverRequestSchema: () => SaveHandoverRequestSchema,
  SerialsCheckedEnum: () => SerialsCheckedEnum,
  SessionBranchSchema: () => SessionBranchSchema,
  SessionUserRoleEnum: () => SessionUserRoleEnum,
  SessionUserSchema: () => SessionUserSchema,
  SetKbStatusRequestSchema: () => SetKbStatusRequestSchema,
  SetKbVisibilityRequestSchema: () => SetKbVisibilityRequestSchema,
  SetLiveStockBarStatusRequestSchema: () => SetLiveStockBarStatusRequestSchema,
  SetUserBranchRequestSchema: () => SetUserBranchRequestSchema,
  SettleNamesRequestSchema: () => SettleNamesRequestSchema,
  SettleNamesResultSchema: () => SettleNamesResultSchema,
  SettleResultSchema: () => SettleResultSchema,
  SheetApplyItemSchema: () => SheetApplyItemSchema,
  SheetApplyPreviewSchema: () => SheetApplyPreviewSchema,
  SheetApplyResultSchema: () => SheetApplyResultSchema,
  SheetKindSchema: () => SheetKindSchema,
  SheetLineOptionSchema: () => SheetLineOptionSchema,
  SheetNameEnum: () => SheetNameEnum,
  SheetTaskListQuerySchema: () => SheetTaskListQuerySchema,
  SheetTaskSchema: () => SheetTaskSchema,
  ShippedNotCollectedListSchema: () => ShippedNotCollectedListSchema,
  ShippedNotCollectedRowSchema: () => ShippedNotCollectedRowSchema,
  ShippedNotCollectedTasksResultSchema: () => ShippedNotCollectedTasksResultSchema,
  SpotPriceArraySchema: () => SpotPriceArraySchema,
  SpotPriceMapSchema: () => SpotPriceMapSchema,
  SpotPriceSchema: () => SpotPriceSchema,
  SpotStatusResponseSchema: () => SpotStatusResponseSchema,
  StockLevelStateSchema: () => StockLevelStateSchema,
  StockMetalEnum: () => StockMetalEnum,
  StockMetalSchema: () => StockMetalSchema,
  StocktakeBarSchema: () => StocktakeBarSchema,
  StocktakeCoinSchema: () => StocktakeCoinSchema,
  StocktakeDetailSchema: () => StocktakeDetailSchema,
  StocktakeLineSchema: () => StocktakeLineSchema,
  StocktakeSchema: () => StocktakeSchema,
  StocktakeStatusEnum: () => StocktakeStatusEnum,
  TRADE_METAL_SLIDER_BOUNDS: () => TRADE_METAL_SLIDER_BOUNDS,
  TRADE_STATES: () => TRADE_STATES,
  TabPlanSchema: () => TabPlanSchema,
  TableSizeSchema: () => TableSizeSchema,
  TaskCheckEnum: () => TaskCheckEnum,
  TaskQueryParamsSchema: () => TaskQueryParamsSchema,
  TaskStatusSchema: () => TaskStatusSchema,
  TradeBootstrapResponseSchema: () => TradeBootstrapResponseSchema,
  TradeCartItemRequestSchema: () => TradeCartItemRequestSchema,
  TradeCartLineSchema: () => TradeCartLineSchema,
  TradeCartRequestSchema: () => TradeCartRequestSchema,
  TradeCartResponseSchema: () => TradeCartResponseSchema,
  TradeProductSchema: () => TradeProductSchema,
  TradeTransactionTypeEnum: () => TradeTransactionTypeEnum,
  TradesheetImportPlanSchema: () => TradesheetImportPlanSchema,
  TradesheetImportRequestSchema: () => TradesheetImportRequestSchema,
  TradesheetImportResultSchema: () => TradesheetImportResultSchema,
  TradesheetTabSchema: () => TradesheetTabSchema,
  TransferLiveStockRequestSchema: () => TransferLiveStockRequestSchema,
  UI_SETTINGS_MAX_BYTES: () => UI_SETTINGS_MAX_BYTES,
  UiSettingsSchema: () => UiSettingsSchema,
  UnresolvedLotRowSchema: () => UnresolvedLotRowSchema,
  UnresolvedLotsResponseSchema: () => UnresolvedLotsResponseSchema,
  UpdateBarRequestSchema: () => UpdateBarRequestSchema,
  UpdateCoinRequestSchema: () => UpdateCoinRequestSchema,
  UpdateCustomerOrderRequestSchema: () => UpdateCustomerOrderRequestSchema,
  UpdateDiscrepancyRequestSchema: () => UpdateDiscrepancyRequestSchema,
  UpdateKbDocumentRequestSchema: () => UpdateKbDocumentRequestSchema,
  UpdateMarketModeRequestSchema: () => UpdateMarketModeRequestSchema,
  UpdateProductFullDtoSchema: () => UpdateProductFullDtoSchema,
  UpdateStockRequestSchema: () => UpdateStockRequestSchema,
  UpdateStocktakeLineRequestSchema: () => UpdateStocktakeLineRequestSchema,
  UpdateStocktakeRequestSchema: () => UpdateStocktakeRequestSchema,
  UserProfileSchema: () => UserProfileSchema,
  UserRole: () => UserRole,
  UserSchema: () => UserSchema,
  UserStatus: () => UserStatus,
  WORKBOOK_CHUNK_MAX_ROWS: () => WORKBOOK_CHUNK_MAX_ROWS,
  WORKBOOK_LOAD_ORDER: () => WORKBOOK_LOAD_ORDER,
  WorkbookChunkRequestSchema: () => WorkbookChunkRequestSchema,
  WorkbookChunkResultSchema: () => WorkbookChunkResultSchema,
  absorbFile: () => absorbFile,
  aiInputLimit: () => aiInputLimit,
  aliasKey: () => aliasKey,
  aliasOk: () => aliasOk,
  allowedSteps: () => allowedSteps,
  applyRoadmapEdit: () => applyRoadmapEdit,
  assignOccurrences: () => assignOccurrences,
  bcDate: () => bcDate,
  bcEventKind: () => bcEventKind,
  bcItemNoFromSku: () => bcItemNoFromSku,
  buildArticleLayout: () => buildArticleLayout,
  buildBarExportRows: () => buildBarExportRows,
  buildBlocks: () => buildBlocks,
  buildCoinExportRows: () => buildCoinExportRows,
  buildJournalExportRows: () => buildJournalExportRows,
  buildNameLookup: () => buildNameLookup,
  buildPortfolioStrategies: () => buildPortfolioStrategies,
  buildRegisterExportRows: () => buildRegisterExportRows,
  bundleScopeFiles: () => bundleScopeFiles,
  calculateProductPrice: () => calculateProductPrice,
  canSeeKbVisibility: () => canSeeKbVisibility,
  capabilitiesFor: () => capabilitiesFor,
  classifyCpty: () => classifyCpty,
  classifySection: () => classifySection,
  classifyTab: () => classifyTab,
  coerceCell: () => coerceCell,
  coinTokens: () => coinTokens,
  compareProcedures: () => compareProcedures,
  compareProducts: () => compareProducts,
  compareSerials: () => compareSerials,
  compareStockLabels: () => compareStockLabels,
  computeCurrentBuybackValue: () => computeCurrentBuybackValue,
  computeMeltValue: () => computeMeltValue,
  computeProfit: () => computeProfit,
  computeRequiredSpotForTarget: () => computeRequiredSpotForTarget,
  computeTransactionPrice: () => computeTransactionPrice,
  computeVariance: () => computeVariance,
  coreRef: () => coreRef,
  countTasks: () => countTasks,
  createErrorReference: () => createErrorReference,
  customerOrderChanges: () => customerOrderChanges,
  customerSafeRow: () => customerSafeRow,
  deriveMetalHint: () => deriveMetalHint,
  deriveOrder: () => deriveOrder,
  deriveTradeState: () => deriveTradeState,
  detectBcHistoryKind: () => detectBcHistoryKind,
  detectDateOrder: () => detectDateOrder,
  detectFileType: () => detectFileType,
  detectTabType: () => detectTabType,
  effectiveVatRate: () => effectiveVatRate,
  expectedCustomerStock: () => expectedCustomerStock,
  extractQtyAndProduct: () => extractQtyAndProduct,
  extractSources: () => extractSources,
  fakeRedactionMap: () => fakeRedactionMap,
  fakeWorkbookSheets: () => fakeWorkbookSheets,
  fillKind: () => fillKind,
  findAppOnlyTasks: () => findAppOnlyTasks,
  findBrokenLinks: () => findBrokenLinks,
  findDuplicateSerials: () => findDuplicateSerials,
  findHeaderRow: () => findHeaderRow,
  findLinks: () => findLinks,
  findTodos: () => findTodos,
  fingerprint: () => fingerprint,
  flowBarFor: () => flowBarFor,
  flowNextSlug: () => flowNextSlug,
  guessSheetMonth: () => guessSheetMonth,
  guessSheetMonthFromTabs: () => guessSheetMonthFromTabs,
  guideLibraryTargets: () => guideLibraryTargets,
  headingAnchor: () => headingAnchor,
  homePathFor: () => homePathFor,
  indexKbDocument: () => indexKbDocument,
  isBondedProduct: () => isBondedProduct,
  isCashOverThreshold: () => isCashOverThreshold,
  isClosingBar: () => isClosingBar,
  isOpenOrder: () => isOpenOrder,
  isPhysicallyHere: () => isPhysicallyHere,
  isRealSerial: () => isRealSerial,
  isReferenceCell: () => isReferenceCell,
  isSpotMarketClosed: () => isSpotMarketClosed,
  isStopStep: () => isStopStep,
  itemStatusAfter: () => itemStatusAfter,
  kbArticlePath: () => kbArticlePath,
  kbReviewDueOn: () => kbReviewDueOn,
  kbReviewStatus: () => kbReviewStatus,
  limitQuery: () => limitQuery,
  lineMatchesKey: () => lineMatchesKey,
  linkOrdersToTradesheet: () => linkOrdersToTradesheet,
  listedRefinery: () => listedRefinery,
  liveRefinery: () => liveRefinery,
  liveSerialKey: () => liveSerialKey,
  mapBcHistory: () => mapBcHistory,
  mapBcReport: () => mapBcReport,
  mapOutsideCode: () => mapOutsideCode,
  mapPurchaseHeaders: () => mapPurchaseHeaders,
  mapSaleHeaders: () => mapSaleHeaders,
  matchLines: () => matchLines2,
  matchProductName: () => matchProductName,
  matchTradeLine: () => matchTradeLine,
  meltLabel: () => meltLabel,
  mergeMetalPrices: () => mergeMetalPrices,
  mergeRoadmap: () => mergeRoadmap,
  metalAwareAlias: () => metalAwareAlias,
  metalInText: () => metalInText,
  metalsFitting: () => metalsFitting,
  nextAction: () => nextAction,
  normaliseBackfillHeaders: () => normaliseBackfillHeaders,
  normaliseName: () => normaliseName,
  normaliseProductText: () => normaliseProductText,
  normaliseRefinery: () => normaliseRefinery,
  normalizeClient: () => normalizeClient,
  normalizeProductName: () => normalizeProductName,
  normalizeReference: () => normalizeReference,
  normalizeSerial: () => normalizeSerial,
  onHandSerials: () => onHandSerials,
  orderLifecycle: () => orderLifecycle,
  orderSource: () => orderSource,
  parseBarWeight: () => parseBarWeight,
  parseBarsPaste: () => parseBarsPaste,
  parseBlocks: () => parseBlocks,
  parseCoinName: () => parseCoinName,
  parseCoinsPaste: () => parseCoinsPaste,
  parseCustomerOrdersPaste: () => parseCustomerOrdersPaste,
  parseDecisions: () => parseDecisions,
  parseDeferredLinks: () => parseDeferredLinks,
  parseDesignDoc: () => parseDesignDoc,
  parseJournalPaste: () => parseJournalPaste,
  parseKbDocument: () => parseKbDocument,
  parseMetal: () => parseMetal,
  parsePastedTable: () => parsePastedTable,
  parseProductName: () => parseProductName,
  parsePurchaseRow: () => parsePurchaseRow,
  parseQuantity: () => parseQuantity,
  parseReference: () => parseReference,
  parseRoadmap: () => parseRoadmap,
  parseSaleRow: () => parseSaleRow,
  parseScopeBundle: () => parseScopeBundle,
  parseScopeFile: () => parseScopeFile,
  parseSheetDate: () => parseSheetDate,
  parseSheetNumber: () => parseSheetNumber,
  parseSoldComment: () => parseSoldComment,
  parseTrackingPaste: () => parseTrackingPaste,
  parseTradesheetPaste: () => parseTradesheetPaste,
  parseTsv: () => parseTsv,
  parseWeight: () => parseWeight,
  parseWeightGrams: () => parseWeightGrams,
  planAutolinks: () => planAutolinks,
  planBarImport: () => planBarImport,
  planBaseline: () => planBaseline,
  planCustomerOrderImport: () => planCustomerOrderImport,
  planRow: () => planRow,
  planUpload: () => planUpload,
  priceMetalEvidence: () => priceMetalEvidence,
  pricingSkuFor: () => pricingSkuFor,
  procedureFlow: () => procedureFlow,
  productStockKey: () => productStockKey,
  productStockLevels: () => productStockLevels,
  readCollected: () => readCollected,
  readForeignCoin: () => readForeignCoin,
  readImportWorkbook: () => readImportWorkbook,
  readProduct: () => readProduct,
  referenceMatchKey: () => referenceMatchKey,
  refineryInText: () => refineryInText,
  refineryMatch: () => refineryMatch,
  refineryWords: () => refineryWords,
  resolveProduct: () => resolveProduct,
  resolveRowProduct: () => resolveRowProduct,
  rewriteKbLinks: () => rewriteKbLinks,
  roundBuyPrice: () => roundBuyPrice,
  roundSellPrice: () => roundSellPrice,
  rowIsBlank: () => rowIsBlank,
  ruleTone: () => ruleTone,
  searchKb: () => searchKb,
  serialKey: () => serialKey,
  shareTermsAcrossBlocks: () => shareTermsAcrossBlocks,
  sheetTasksForStep: () => sheetTasksForStep,
  solveMissingPurchaseField: () => solveMissingPurchaseField,
  sortBranchCodes: () => sortBranchCodes,
  splitDocSections: () => splitDocSections,
  splitFrontmatter: () => splitFrontmatter,
  splitScopeBundle: () => splitScopeBundle,
  splitSections: () => splitSections,
  splitSerials: () => splitSerials,
  spotFreshness: () => spotFreshness,
  spotLookup: () => spotLookup,
  stripHeader: () => stripHeader2,
  suggestProductForBcItem: () => suggestProductForBcItem,
  summarizeBars: () => summarizeBars,
  summarizeLines: () => summarizeLines,
  taskShowsDone: () => taskShowsDone,
  termRegExp: () => termRegExp,
  toCsv: () => toCsv,
  toIsoDate: () => toIsoDate,
  toPlainText: () => toPlainText,
  totalCounted: () => totalCounted,
  unredactTables: () => unredactTables,
  variantGrams: () => variantGrams,
  withoutOptionalColumns: () => withoutOptionalColumns
});
module.exports = __toCommonJS(index_exports);

// src/product.schema.ts
var import_zod2 = require("zod");

// src/spot-price.schema.ts
var import_zod = require("zod");
var TaskStatusSchema = import_zod.z.enum(["todo", "in-progress", "done"]);
var MetalTypeEnum = import_zod.z.enum(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]);
var MetalSymbolSchema = import_zod.z.enum(["XAU", "XAG", "XPT", "XPD"]);
var FetchSourceEnum = import_zod.z.enum(["cache", "db", "live"]);
var SpotPriceSchema = import_zod.z.object({
  id: import_zod.z.string(),
  metalType: MetalTypeEnum,
  priceEur: import_zod.z.number(),
  priceGbp: import_zod.z.number(),
  previousClose: import_zod.z.number(),
  change: import_zod.z.number(),
  changePercent: import_zod.z.number(),
  source: import_zod.z.string(),
  timestamp: import_zod.z.iso.datetime(),
  createdAt: import_zod.z.iso.datetime(),
  fetchSource: FetchSourceEnum.optional(),
  /** True when a live fetch was actually attempted for this metal and failed, and this price is the last-known-good value served instead - distinct from a cache/DB hit that's just the normal cascade preference. */
  isFallback: import_zod.z.boolean().optional()
});
var RawSpotPriceSchema = import_zod.z.object({
  id: import_zod.z.string(),
  metalType: MetalTypeEnum,
  priceEur: import_zod.z.number(),
  priceGbp: import_zod.z.number(),
  source: import_zod.z.string(),
  timestamp: import_zod.z.iso.datetime(),
  createdAt: import_zod.z.iso.datetime(),
  fetchSource: FetchSourceEnum.optional(),
  isFallback: import_zod.z.boolean().optional()
});
var HistoricSpotSchema = import_zod.z.object({
  metalType: MetalTypeEnum,
  priceEur: import_zod.z.number(),
  priceGbp: import_zod.z.number(),
  timestamp: import_zod.z.iso.datetime()
});
var CreateSpotPriceDtoSchema = import_zod.z.object({
  title: import_zod.z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: import_zod.z.string().optional().default("")
});
var SpotPriceArraySchema = import_zod.z.array(SpotPriceSchema);
var SpotPriceMapSchema = import_zod.z.record(MetalTypeEnum, SpotPriceSchema);
var TaskQueryParamsSchema = import_zod.z.object({
  status: TaskStatusSchema.optional(),
  search: import_zod.z.string().optional()
});

// src/product.schema.ts
var isoDateString = import_zod2.z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") return val;
  return void 0;
}, import_zod2.z.iso.datetime());
var ProductCategoryEnum = import_zod2.z.enum(["BAR", "COIN"]);
var ProductSchema = import_zod2.z.object({
  id: import_zod2.z.number(),
  sku: import_zod2.z.string(),
  name: import_zod2.z.string(),
  metalType: MetalTypeEnum,
  weight: import_zod2.z.number(),
  spotPrice: import_zod2.z.number(),
  spreadBuy: import_zod2.z.number(),
  spreadSell: import_zod2.z.number(),
  vatRate: import_zod2.z.number(),
  category: ProductCategoryEnum.nullable().optional(),
  description: import_zod2.z.string(),
  // Calculated fields
  // Raw market value of this product's own weight at the current spot price
  // (spot / troy oz * weight) - no premium/discount/VAT applied. Distinct
  // from `spotPrice`, which is the flat per-ounce metal price and is the
  // same for every product of a metal; this is what the product table's
  // "Market Price" column shows per row.
  marketValue: import_zod2.z.number(),
  priceSell: import_zod2.z.number(),
  priceSellVatExcl: import_zod2.z.number(),
  priceBuy: import_zod2.z.number(),
  stock: import_zod2.z.number(),
  isActive: import_zod2.z.boolean(),
  updatedAt: isoDateString,
  createdAt: isoDateString
});
var RawProductSchema = import_zod2.z.object({
  id: import_zod2.z.number(),
  sku: import_zod2.z.string(),
  name: import_zod2.z.string(),
  metalType: MetalTypeEnum,
  weight: import_zod2.z.number(),
  spreadBuy: import_zod2.z.number(),
  spreadSell: import_zod2.z.number(),
  vatRate: import_zod2.z.number(),
  stock: import_zod2.z.number(),
  isActive: import_zod2.z.boolean(),
  category: ProductCategoryEnum.nullable().optional(),
  description: import_zod2.z.string().nullable().optional(),
  createdAt: isoDateString,
  updatedAt: isoDateString
});
var CreateProductDtoSchema = import_zod2.z.object({
  sku: import_zod2.z.string(),
  name: import_zod2.z.string(),
  metalType: MetalTypeEnum,
  weight: import_zod2.z.number(),
  spreadBuy: import_zod2.z.number(),
  spreadSell: import_zod2.z.number(),
  vatRate: import_zod2.z.number(),
  stock: import_zod2.z.number(),
  category: ProductCategoryEnum.nullable().optional(),
  description: import_zod2.z.string().optional()
});
var UpdateProductFullDtoSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().extend({
  // still allow explicit optional overrides for calculated/update-only fields
  priceSell: import_zod2.z.number().optional(),
  priceBuy: import_zod2.z.number().optional(),
  isActive: import_zod2.z.boolean().optional(),
  // The `updatedAt` the edit form was opened with. When given and the product has changed since, the
  // API refuses the save (409) instead of silently overwriting another admin's change. Optional so
  // callers that do not send it behave as before.
  expectedUpdatedAt: import_zod2.z.iso.datetime().optional()
});
var UpdateStockRequestSchema = import_zod2.z.object({
  stock_quantity: import_zod2.z.number().int().nonnegative()
});
var ProductsSchema = import_zod2.z.array(ProductSchema);
var ProductArraySchema = import_zod2.z.array(ProductSchema);
var ProductMapSchema = import_zod2.z.record(MetalTypeEnum, ProductSchema);

// src/product-name.ts
var WEIGHT_SPACE_RE = /(\d+(?:[./]\d+)?)\s+(oz|kg|g)\b/gi;
function normalizeProductName(name) {
  return name.replace(WEIGHT_SPACE_RE, "$1$2").trim();
}

// src/common.schema.ts
var import_zod3 = require("zod");
var ApiSuccessResponseSchema = (dataSchema) => import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: dataSchema,
  message: import_zod3.z.string().optional()
});
var ApiErrorResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(false),
  error: import_zod3.z.object({
    code: import_zod3.z.string(),
    message: import_zod3.z.string(),
    details: import_zod3.z.any().optional()
  }),
  timestamp: import_zod3.z.iso.datetime()
});
var PaginationSchema = import_zod3.z.object({
  page: import_zod3.z.coerce.number().int().min(1).default(1),
  limit: import_zod3.z.coerce.number().int().min(1).max(100).default(20)
});
var HealthCheckSchema = import_zod3.z.object({
  status: import_zod3.z.literal("ok"),
  timestamp: import_zod3.z.iso.datetime(),
  uptime: import_zod3.z.number(),
  environment: import_zod3.z.string()
});

// src/auth.schemas.ts
var import_zod4 = require("zod");
var UserRole = import_zod4.z.enum(["ADMIN", "USER", "MANAGER"]);
var UserStatus = import_zod4.z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
var Platform = import_zod4.z.enum(["web", "mobile", "admin"]);
var UserSchema = import_zod4.z.object({
  id: import_zod4.z.string(),
  email: import_zod4.z.email("Invalid email format"),
  username: import_zod4.z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  role: UserRole,
  status: UserStatus,
  createdAt: import_zod4.z.date(),
  updatedAt: import_zod4.z.date()
});
var LoginSchema = import_zod4.z.object({
  email: import_zod4.z.email("Please enter a valid email"),
  password: import_zod4.z.string().min(1, "Password is required"),
  platform: Platform,
  rememberMe: import_zod4.z.boolean().optional().default(false)
});
var RegisterSchema = import_zod4.z.object({
  email: import_zod4.z.email("Please enter a valid email"),
  username: import_zod4.z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: import_zod4.z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: import_zod4.z.string(),
  platform: Platform
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
var ChangePasswordSchema = import_zod4.z.object({
  currentPassword: import_zod4.z.string().min(1, "Current password is required"),
  newPassword: import_zod4.z.string().min(8, "New password must be at least 8 characters").max(100, "New password must be less than 100 characters"),
  confirmNewPassword: import_zod4.z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"]
});
var AuthResponseSchema = import_zod4.z.object({
  accessToken: import_zod4.z.string(),
  refreshToken: import_zod4.z.string(),
  user: UserSchema.omit({ createdAt: true, updatedAt: true }),
  expiresIn: import_zod4.z.number()
});
var UserProfileSchema = import_zod4.z.object({
  id: import_zod4.z.uuid(),
  email: import_zod4.z.email(),
  username: import_zod4.z.string(),
  role: UserRole,
  status: UserStatus,
  createdAt: import_zod4.z.iso.datetime()
});
var MessageResponseSchema = import_zod4.z.object({
  message: import_zod4.z.string()
});

// src/market-data.schema.ts
var import_zod5 = require("zod");
var MarketDataResponseSchema = import_zod5.z.object({
  spotPrices: import_zod5.z.array(SpotPriceSchema),
  historicSpot: import_zod5.z.array(HistoricSpotSchema),
  products: import_zod5.z.array(ProductSchema),
  /** When the market price shown was struck: the vendor's own time, the oldest across spotPrices. Null when there is no price. Not when we fetched it, and not when this request ran. */
  snapshotAt: import_zod5.z.iso.datetime().nullable(),
  /** When we last received these prices from the vendor: the oldest fetch time across spotPrices. The freshness dot follows this. Null when there is no price. */
  lastFetchAt: import_zod5.z.iso.datetime().nullable(),
  /** True while the price cron is paused: nothing refreshes the prices until someone clicks Refresh. */
  autoRefreshPaused: import_zod5.z.boolean(),
  /**
   * Set when one or more metals fell all the way through cache → DB → the
   * live API without finding a usable (non-zero, non-stale) price, so the
   * UI ends up showing €0.00 for them. Null when every metal resolved to a
   * real price. The frontend surfaces this as a toast rather than silently
   * showing zero with no explanation.
   */
  priceWarning: import_zod5.z.string().nullable(),
  /** Same information as priceWarning, structured - lets the UI mark individual metal cards as failed rather than only showing one combined text warning. */
  degradedMetals: import_zod5.z.array(MetalTypeEnum)
});
var SpotStatusResponseSchema = MarketDataResponseSchema.pick({
  snapshotAt: true,
  lastFetchAt: true,
  autoRefreshPaused: true,
  degradedMetals: true
});
var RefreshResponseSchema = import_zod5.z.object({
  spot: SpotPriceSchema,
  products: import_zod5.z.array(ProductSchema),
  snapshotAt: import_zod5.z.iso.datetime().nullable()
});
var RecalculateOverridesSchema = import_zod5.z.object({
  GOLD: import_zod5.z.number().positive().optional(),
  SILVER: import_zod5.z.number().positive().optional(),
  PLATINUM: import_zod5.z.number().positive().optional(),
  PALLADIUM: import_zod5.z.number().positive().optional()
});
var HistoricCloseQuerySchema = import_zod5.z.object({
  date: import_zod5.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD").refine((value) => {
    const parsed = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
  }, "Not a real calendar date").optional()
});

// src/trade.schema.ts
var import_zod6 = require("zod");
var TradeTransactionTypeEnum = import_zod6.z.enum(["buying", "selling"]);
var TradeProductSchema = import_zod6.z.object({
  id: import_zod6.z.number(),
  sku: import_zod6.z.string(),
  name: import_zod6.z.string(),
  weight: import_zod6.z.number(),
  metalType: MetalTypeEnum,
  premiumPct: import_zod6.z.number(),
  discountPct: import_zod6.z.number()
});
var TradeBootstrapResponseSchema = import_zod6.z.object({
  metalType: MetalTypeEnum,
  spot: import_zod6.z.number(),
  minSpot: import_zod6.z.number(),
  maxSpot: import_zod6.z.number(),
  products: import_zod6.z.array(TradeProductSchema)
});
var TradeCartItemRequestSchema = import_zod6.z.object({
  productId: import_zod6.z.number(),
  quantity: import_zod6.z.coerce.number().int().min(1).default(1),
  percent: import_zod6.z.coerce.number().min(0)
});
var TradeCartRequestSchema = import_zod6.z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  customSpot: import_zod6.z.coerce.number().positive().optional(),
  items: import_zod6.z.array(TradeCartItemRequestSchema).min(1)
});
var TradeCartLineSchema = import_zod6.z.object({
  productId: import_zod6.z.number(),
  product: import_zod6.z.string(),
  sku: import_zod6.z.string(),
  weight: import_zod6.z.number(),
  quantity: import_zod6.z.number(),
  percent: import_zod6.z.number(),
  unitPrice: import_zod6.z.number(),
  lineTotal: import_zod6.z.number()
});
var TradeCartResponseSchema = import_zod6.z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  spot: import_zod6.z.number(),
  lines: import_zod6.z.array(TradeCartLineSchema),
  totalWeight: import_zod6.z.number(),
  averagePerGram: import_zod6.z.number(),
  totalPrice: import_zod6.z.number()
});
var MeltCategoryKeyEnum = import_zod6.z.enum(["24ct", "22ct", "90%", "Silver"]);
var MeltCategoryDataSchema = import_zod6.z.object({
  metal: MetalTypeEnum,
  meltFactor: import_zod6.z.number(),
  purity: import_zod6.z.number()
});
var MeltCalculatorRequestSchema = import_zod6.z.object({
  category: MeltCategoryKeyEnum,
  weight: import_zod6.z.coerce.number().positive(),
  /** The spot the user is quoting from (a card override) - omitted means the server's latest market spot. */
  customSpot: import_zod6.z.number().positive().optional()
});
var MeltCalculatorResponseSchema = import_zod6.z.object({
  category: MeltCategoryKeyEnum,
  metal: MetalTypeEnum,
  spot: import_zod6.z.number(),
  spotPerGram: import_zod6.z.number(),
  meltFactor: import_zod6.z.number(),
  purity: import_zod6.z.number(),
  weight: import_zod6.z.number(),
  meltValue: import_zod6.z.number()
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
var import_zod7 = require("zod");
var ProfitAnalysisMissingFieldEnum = import_zod7.z.enum(["spot", "premium", "price"]);
var ProfitAnalysisRequestSchema = import_zod7.z.object({
  metalType: MetalTypeEnum,
  productId: import_zod7.z.number(),
  purchaseSpot: import_zod7.z.coerce.number(),
  purchasePremium: import_zod7.z.coerce.number(),
  purchasePrice: import_zod7.z.coerce.number(),
  missingField: ProfitAnalysisMissingFieldEnum,
  currentSpot: import_zod7.z.coerce.number().positive(),
  currentDiscount: import_zod7.z.coerce.number().min(0).max(99.99),
  targetProfit: import_zod7.z.coerce.number().min(0)
});
var ProfitAnalysisResponseSchema = import_zod7.z.object({
  product: import_zod7.z.string(),
  productMultiplier: import_zod7.z.number(),
  purchaseSpot: import_zod7.z.number(),
  purchasePremium: import_zod7.z.number(),
  purchasePrice: import_zod7.z.number(),
  currentSpot: import_zod7.z.number(),
  currentDiscount: import_zod7.z.number(),
  currentBuybackValue: import_zod7.z.number(),
  profit: import_zod7.z.number(),
  profitPercent: import_zod7.z.number(),
  requiredSpot: import_zod7.z.number(),
  requiredPrice: import_zod7.z.number(),
  targetProfit: import_zod7.z.number(),
  targetReturn: import_zod7.z.number()
});
var PortfolioProductTypeFilterEnum = import_zod7.z.enum(["either", "bar", "coin"]);
var PriorityStrengthEnum = import_zod7.z.enum(["none", "low", "medium", "high"]);
var PortfolioBuildRequestSchema = import_zod7.z.object({
  metalType: MetalTypeEnum,
  budget: import_zod7.z.coerce.number().positive(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: import_zod7.z.number().optional(),
  priorityStrength: PriorityStrengthEnum,
  /** The spot the user is quoting from (a card override) - omitted means the server's latest market spot. */
  customSpot: import_zod7.z.number().positive().optional()
});
var PortfolioLineItemSchema = import_zod7.z.object({
  product: import_zod7.z.string(),
  quantity: import_zod7.z.number(),
  weight: import_zod7.z.number(),
  totalWeight: import_zod7.z.number(),
  unitPrice: import_zod7.z.number(),
  totalValue: import_zod7.z.number(),
  premium: import_zod7.z.number(),
  type: import_zod7.z.enum(["bar", "coin"]),
  isPriority: import_zod7.z.boolean()
});
var PortfolioStrategyResultSchema = import_zod7.z.object({
  strategy: import_zod7.z.object({
    id: import_zod7.z.enum(["maximum", "balanced", "flexible"]),
    name: import_zod7.z.string(),
    badge: import_zod7.z.string(),
    description: import_zod7.z.string()
  }),
  totalInvested: import_zod7.z.number(),
  unspent: import_zod7.z.number(),
  totalGrams: import_zod7.z.number(),
  averagePerGram: import_zod7.z.number(),
  averagePremium: import_zod7.z.number(),
  pieces: import_zod7.z.number(),
  largestPositionPercent: import_zod7.z.number(),
  flexibilityScore: import_zod7.z.number(),
  priorityQuantity: import_zod7.z.number(),
  priorityShare: import_zod7.z.number(),
  items: import_zod7.z.array(PortfolioLineItemSchema)
});
var PortfolioBuildResponseSchema = import_zod7.z.object({
  metalType: MetalTypeEnum,
  budget: import_zod7.z.number(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: import_zod7.z.number().nullable(),
  priorityStrength: PriorityStrengthEnum,
  results: import_zod7.z.array(PortfolioStrategyResultSchema)
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
function isBondedProduct(name) {
  return /bonded/i.test(name);
}
function effectiveVatRate(product) {
  return isBondedProduct(product.name) ? 0 : product.vatRate;
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

// src/spot-freshness.ts
var SPOT_FETCH_INTERVAL_MS = 5 * 60 * 1e3;
var SPOT_LATE_AFTER_MS = SPOT_FETCH_INTERVAL_MS + 60 * 1e3;
var SPOT_RED_AFTER_MS = 25 * 60 * 1e3;
var MAX_WEEKEND_GAP_MS = 50 * 60 * 60 * 1e3;
var LONDON_PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  hour: "2-digit",
  hourCycle: "h23"
});
function isSpotMarketClosed(at) {
  const parts = LONDON_PARTS.formatToParts(at);
  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  if (weekday === "Sat") return true;
  if (weekday === "Fri") return hour >= 22;
  if (weekday === "Sun") return hour < 23;
  return false;
}
function ageMs(iso, now) {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  return Number.isFinite(ms) ? Math.max(0, now.getTime() - ms) : null;
}
function spotFreshness(input) {
  const { snapshotAt, now } = input;
  const priceAgeMs = ageMs(snapshotAt, now);
  if (priceAgeMs === null || !snapshotAt) {
    return { state: "unknown", priceAgeMs: null, fetchAgeMs: null };
  }
  const fetchAgeMs = ageMs(input.lastFetchAt, now) ?? priceAgeMs;
  if (fetchAgeMs <= SPOT_LATE_AFTER_MS) return { state: "fresh", priceAgeMs, fetchAgeMs };
  const isClosingPrice = isSpotMarketClosed(now) && priceAgeMs < MAX_WEEKEND_GAP_MS && isSpotMarketClosed(new Date(new Date(snapshotAt).getTime() + SPOT_RED_AFTER_MS));
  if (isClosingPrice) return { state: "closed", priceAgeMs, fetchAgeMs };
  return { state: fetchAgeMs >= SPOT_RED_AFTER_MS ? "stale" : "late", priceAgeMs, fetchAgeMs };
}

// src/product-pricing.ts
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
function calculateProductPrice(product, spotMap) {
  const marketPrice = spotMap[product.metalType] ?? 0;
  const spotPerGram = marketPrice / GRAMS_PER_TROY_OUNCE;
  const basePrice = spotPerGram * product.weight;
  const priceSellVatExcl = basePrice * (1 + product.spreadSell);
  const vatRate = effectiveVatRate(product);
  const priceSell = priceSellVatExcl * (1 + vatRate);
  const priceBuy = basePrice * (1 + product.spreadBuy);
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    metalType: product.metalType,
    weight: round2(product.weight),
    description: product.description ?? "",
    spreadSell: product.spreadSell,
    spreadBuy: product.spreadBuy,
    vatRate,
    spotPrice: round2(marketPrice),
    marketValue: round2(basePrice),
    // Quoted prices are whole euros, rounded in the dealer's favour: what we charge rounds up, what
    // we pay rounds down - the same rule the Trade tool's computeTransactionPrice applies.
    priceSell: roundSellPrice(priceSell),
    priceSellVatExcl: roundSellPrice(priceSellVatExcl),
    priceBuy: roundBuyPrice(priceBuy),
    stock: product.stock,
    isActive: product.isActive,
    category: product.category ?? null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}
function mergeMetalPrices(base, overrides) {
  const merged = { ...base };
  for (const metal of Object.keys(overrides)) {
    const value = overrides[metal];
    if (value !== void 0) {
      merged[metal] = value;
    }
  }
  return merged;
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
var import_zod9 = require("zod");

// src/branch.schema.ts
var import_zod8 = require("zod");
var CurrencyEnum = import_zod8.z.enum(["EUR", "USD", "GBP"]);
var BranchRegionEnum = import_zod8.z.enum(["IE", "UK", "ES"]);
var SessionBranchSchema = import_zod8.z.object({
  id: import_zod8.z.number(),
  name: import_zod8.z.string(),
  region: BranchRegionEnum
});
var BranchSchema = import_zod8.z.object({
  id: import_zod8.z.number(),
  name: import_zod8.z.string(),
  region: BranchRegionEnum,
  address: import_zod8.z.string().nullable(),
  currency: CurrencyEnum,
  createdAt: import_zod8.z.iso.datetime()
});
var CreateBranchRequestSchema = import_zod8.z.object({
  name: import_zod8.z.string().min(1, "Name is required"),
  address: import_zod8.z.string().optional(),
  region: BranchRegionEnum.default("IE"),
  currency: CurrencyEnum.default("EUR")
});

// src/session.schema.ts
var SessionUserRoleEnum = import_zod9.z.enum(["ADMIN", "MANAGER", "SALES", "ACCOUNTING", "AUDITOR"]);
var UI_SETTINGS_MAX_BYTES = 16e3;
var ColorModeEnum = import_zod9.z.enum(["dark", "light"]);
var UiSettingsSchema = import_zod9.z.object({
  mode: ColorModeEnum,
  look: import_zod9.z.record(import_zod9.z.string(), import_zod9.z.unknown()).nullable()
}).refine((v) => JSON.stringify(v).length <= UI_SETTINGS_MAX_BYTES, {
  message: "Those display settings are too large to save."
});
var SessionUserSchema = import_zod9.z.object({
  id: import_zod9.z.string(),
  email: import_zod9.z.string(),
  firstName: import_zod9.z.string(),
  lastName: import_zod9.z.string(),
  role: SessionUserRoleEnum,
  admin: import_zod9.z.boolean(),
  // Defaults to null so a web build deployed before the API still parses the old response shape.
  branch: SessionBranchSchema.nullable().default(null),
  /** Null until the person first changes their look; the app then uses its defaults (dark). */
  uiSettings: UiSettingsSchema.nullable().default(null)
});
var LoginRequestSchema = import_zod9.z.object({
  email: import_zod9.z.string().email(),
  password: import_zod9.z.string().min(1)
});
var LoginResponseSchema = import_zod9.z.object({
  accessToken: import_zod9.z.string(),
  refreshToken: import_zod9.z.string().nullable().default(null),
  user: SessionUserSchema
});
var RefreshRequestSchema = import_zod9.z.object({
  refreshToken: import_zod9.z.string().min(1)
});
var CreateUserRequestSchema = import_zod9.z.object({
  email: import_zod9.z.string().email(),
  password: import_zod9.z.string().min(10, "Password must be at least 10 characters"),
  firstName: import_zod9.z.string().min(1, "First name is required"),
  lastName: import_zod9.z.string().min(1, "Last name is required"),
  role: SessionUserRoleEnum,
  admin: import_zod9.z.boolean().default(false),
  branchId: import_zod9.z.number().int().positive().nullable().default(null)
});
var SetUserBranchRequestSchema = import_zod9.z.object({
  branchId: import_zod9.z.number().int().positive().nullable()
});

// src/query.schema.ts
var import_zod11 = require("zod");

// src/admin.schema.ts
var import_zod10 = require("zod");
var HealthStatusEnum = import_zod10.z.enum(["up", "degraded", "down"]);
var HealthItemSchema = import_zod10.z.object({
  key: import_zod10.z.string(),
  label: import_zod10.z.string(),
  status: HealthStatusEnum,
  /** One plain-language line: a measurement, or the reason it is not healthy. */
  detail: import_zod10.z.string()
});
var HourlyStatsSchema = import_zod10.z.object({
  hour: import_zod10.z.string(),
  requests: import_zod10.z.number(),
  clientErrors: import_zod10.z.number(),
  serverErrors: import_zod10.z.number(),
  avgLatencyMs: import_zod10.z.number(),
  logins: import_zod10.z.number(),
  failedLogins: import_zod10.z.number()
});
var RouteStatsSchema = import_zod10.z.object({
  route: import_zod10.z.string(),
  count: import_zod10.z.number(),
  errors: import_zod10.z.number(),
  avgLatencyMs: import_zod10.z.number()
});
var TableSizeSchema = import_zod10.z.object({
  name: import_zod10.z.string(),
  bytes: import_zod10.z.number(),
  rows: import_zod10.z.number()
});
var AdminOverviewSchema = import_zod10.z.object({
  generatedAt: import_zod10.z.string(),
  uptimeSeconds: import_zod10.z.number(),
  nodeVersion: import_zod10.z.string(),
  environment: import_zod10.z.string(),
  aiEnabled: import_zod10.z.boolean(),
  /** The assistant's spend today (Dublin day) against its daily limit, in USD; null when it can't be read. */
  aiSpend: import_zod10.z.object({ spentUsd: import_zod10.z.number(), dailyLimitUsd: import_zod10.z.number() }).nullable(),
  health: import_zod10.z.array(HealthItemSchema),
  /** False when Redis is down: the traffic history below is then empty rather than wrong. */
  metricsAvailable: import_zod10.z.boolean(),
  hours: import_zod10.z.array(HourlyStatsSchema),
  topRoutes: import_zod10.z.array(RouteStatsSchema),
  databaseBytes: import_zod10.z.number(),
  tables: import_zod10.z.array(TableSizeSchema),
  usersByRole: import_zod10.z.array(import_zod10.z.object({ role: import_zod10.z.string(), count: import_zod10.z.number() })),
  activeUsers: import_zod10.z.number(),
  errorsByKind: import_zod10.z.array(import_zod10.z.object({ kind: import_zod10.z.string(), count: import_zod10.z.number() }))
});
var LogLevelEnum = import_zod10.z.enum(["trace", "debug", "info", "warn", "error", "fatal"]);
var AdminLogEntrySchema = import_zod10.z.object({
  id: import_zod10.z.number(),
  /** Epoch milliseconds. */
  time: import_zod10.z.number(),
  level: LogLevelEnum,
  message: import_zod10.z.string(),
  context: import_zod10.z.string().nullable(),
  method: import_zod10.z.string().nullable(),
  url: import_zod10.z.string().nullable(),
  status: import_zod10.z.number().nullable(),
  responseTimeMs: import_zod10.z.number().nullable(),
  /** Everything else pino recorded on the line, for the expanded view. */
  extra: import_zod10.z.record(import_zod10.z.string(), import_zod10.z.unknown())
});
var AdminLogsResponseSchema = import_zod10.z.object({
  entries: import_zod10.z.array(AdminLogEntrySchema),
  capacity: import_zod10.z.number()
});
var AuditEntrySchema = import_zod10.z.object({
  at: import_zod10.z.string(),
  user: import_zod10.z.string(),
  action: import_zod10.z.string(),
  detail: import_zod10.z.string()
});
var AuditLogResponseSchema = import_zod10.z.object({
  entries: import_zod10.z.array(AuditEntrySchema),
  persisted: import_zod10.z.boolean()
});
var ApiEndpointParameterSchema = import_zod10.z.object({
  name: import_zod10.z.string(),
  in: import_zod10.z.enum(["path", "query", "header"]),
  required: import_zod10.z.boolean(),
  type: import_zod10.z.string(),
  options: import_zod10.z.array(import_zod10.z.string()).optional(),
  description: import_zod10.z.string().optional()
});
var ApiEndpointSchema = import_zod10.z.object({
  method: import_zod10.z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: import_zod10.z.string(),
  summary: import_zod10.z.string(),
  description: import_zod10.z.string().optional(),
  tag: import_zod10.z.string(),
  requiresAuth: import_zod10.z.boolean(),
  parameters: import_zod10.z.array(ApiEndpointParameterSchema),
  /** A starter JSON body built from the request schema; null when the route takes none. */
  bodyExample: import_zod10.z.unknown().nullable()
});
var ApiCatalogueSchema = import_zod10.z.object({
  endpoints: import_zod10.z.array(ApiEndpointSchema)
});
var DbColumnSchema = import_zod10.z.object({
  name: import_zod10.z.string(),
  type: import_zod10.z.string(),
  nullable: import_zod10.z.boolean(),
  hasDefault: import_zod10.z.boolean(),
  isPrimaryKey: import_zod10.z.boolean(),
  /** Generated by the database, or never shown at all - cannot be set from the browser. */
  readOnly: import_zod10.z.boolean(),
  /** The allowed values when the column is a Postgres enum. */
  enumValues: import_zod10.z.array(import_zod10.z.string()).optional()
});
var DbTableSummarySchema = import_zod10.z.object({
  name: import_zod10.z.string(),
  rows: import_zod10.z.number(),
  bytes: import_zod10.z.number(),
  writable: import_zod10.z.boolean()
});
var DbTablesResponseSchema = import_zod10.z.object({
  tables: import_zod10.z.array(DbTableSummarySchema)
});
var DbRowsResponseSchema = import_zod10.z.object({
  table: import_zod10.z.string(),
  writable: import_zod10.z.boolean(),
  columns: import_zod10.z.array(DbColumnSchema),
  rows: import_zod10.z.array(import_zod10.z.record(import_zod10.z.string(), import_zod10.z.unknown())),
  total: import_zod10.z.number(),
  page: import_zod10.z.number(),
  pageSize: import_zod10.z.number()
});
var DbValueSchema = import_zod10.z.union([import_zod10.z.string(), import_zod10.z.number(), import_zod10.z.boolean(), import_zod10.z.null(), import_zod10.z.record(import_zod10.z.string(), import_zod10.z.unknown()), import_zod10.z.array(import_zod10.z.unknown())]);
var DbInsertRequestSchema = import_zod10.z.object({
  values: import_zod10.z.record(import_zod10.z.string(), DbValueSchema)
});
var DbUpdateRequestSchema = import_zod10.z.object({
  /** The row's primary-key column(s) and current value(s). */
  key: import_zod10.z.record(import_zod10.z.string(), import_zod10.z.union([import_zod10.z.string(), import_zod10.z.number()])),
  values: import_zod10.z.record(import_zod10.z.string(), DbValueSchema)
});
var DbDeleteRequestSchema = import_zod10.z.object({
  key: import_zod10.z.record(import_zod10.z.string(), import_zod10.z.union([import_zod10.z.string(), import_zod10.z.number()]))
});
var DbRowResponseSchema = import_zod10.z.object({
  row: import_zod10.z.record(import_zod10.z.string(), import_zod10.z.unknown())
});

// src/query.schema.ts
var boundedInt = (defaultValue, max) => import_zod11.z.coerce.number().int().min(1).max(max).default(defaultValue);
var limitQuery = (defaultValue, max) => import_zod11.z.object({ limit: boundedInt(defaultValue, max) });
var AdminLogsQuerySchema = import_zod11.z.object({
  limit: boundedInt(200, 1e3),
  level: LogLevelEnum.default("info"),
  q: import_zod11.z.string().optional()
});
var AuditQuerySchema = limitQuery(100, 500);
var ErrorLogQuerySchema = limitQuery(100, 500);
var FetchLogQuerySchema = limitQuery(20, 100);
var DbRowsQuerySchema = import_zod11.z.object({
  page: boundedInt(1, 1e6),
  pageSize: boundedInt(50, 200),
  sort: import_zod11.z.string().optional(),
  dir: import_zod11.z.enum(["asc", "desc"]).default("desc"),
  q: import_zod11.z.string().optional()
});
var BackfillHistoryQuerySchema = import_zod11.z.object({
  years: boundedInt(5, 10)
});

// src/branch-access.ts
var BY_REGION = {
  IE: { pricingWorkbook: true, assistant: true, sidebar: true, knowledge: "everything" },
  UK: { pricingWorkbook: false, assistant: false, sidebar: false, knowledge: "shared" },
  // Spain works like Ireland for now; narrow it here if Barcelona's pricing or VAT rules need to differ.
  ES: { pricingWorkbook: true, assistant: true, sidebar: true, knowledge: "everything" }
};
function capabilitiesFor(subject) {
  if (subject.admin) return BY_REGION.IE;
  return BY_REGION[subject.branchRegion ?? "IE"];
}
function canSeeKbVisibility(capabilities, visibility) {
  return capabilities.knowledge === "everything" || visibility === "all";
}
function homePathFor(capabilities) {
  return capabilities.pricingWorkbook ? "/dashboard" : "/knowledge";
}

// src/market-mode.schema.ts
var import_zod12 = require("zod");
var MarketModeStateSchema = import_zod12.z.object({
  weekend: import_zod12.z.boolean(),
  volatile: import_zod12.z.boolean(),
  shortage: import_zod12.z.boolean(),
  /** Who last changed it (display name); null if it has never been changed. */
  updatedBy: import_zod12.z.string().nullable(),
  updatedAt: import_zod12.z.iso.datetime().nullable()
});
var UpdateMarketModeRequestSchema = import_zod12.z.object({
  weekend: import_zod12.z.boolean(),
  volatile: import_zod12.z.boolean(),
  shortage: import_zod12.z.boolean()
});

// src/fetch-attempt.schema.ts
var import_zod13 = require("zod");
var FetchTriggerEnum = import_zod13.z.enum(["CRON", "REFRESH", "RETRY", "LAUNCH_FALLBACK"]);
var FetchAttemptSchema = import_zod13.z.object({
  id: import_zod13.z.string(),
  attemptedAt: import_zod13.z.iso.datetime(),
  durationMs: import_zod13.z.number(),
  success: import_zod13.z.boolean(),
  errorMessage: import_zod13.z.string().nullable(),
  metalsResolved: import_zod13.z.array(MetalTypeEnum),
  triggeredBy: FetchTriggerEnum
});
var FetchMetricsSchema = import_zod13.z.object({
  /** Fraction (0-1) of external API calls in the last 24h that succeeded. 1 when there were none to judge. */
  successRate24h: import_zod13.z.number(),
  totalAttempts24h: import_zod13.z.number(),
  failureCount24h: import_zod13.z.number(),
  avgLatencyMs: import_zod13.z.number(),
  /** Fraction (0-1) of the launch-page-load cascade's cache reads that hit - in-memory since process start, not a 24h window. */
  cacheHitRatio: import_zod13.z.number()
});

// src/error-log.schema.ts
var import_zod14 = require("zod");
var ErrorLogSourceEnum = import_zod14.z.enum(["server", "client"]);
var ErrorLogSeverityEnum = import_zod14.z.enum(["error", "warning"]);
var ErrorLogKindEnum = import_zod14.z.enum(["database", "http", "network", "external-api", "response", "crash"]);
var ErrorLogEntrySchema = import_zod14.z.object({
  id: import_zod14.z.string(),
  /** Short code shown to staff in the error toast ("ref E-7F3K2"), to find the matching entry. */
  reference: import_zod14.z.string(),
  at: import_zod14.z.string(),
  source: ErrorLogSourceEnum,
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: import_zod14.z.string(),
  detail: import_zod14.z.string().nullable().optional(),
  statusCode: import_zod14.z.number().nullable().optional(),
  method: import_zod14.z.string().nullable().optional(),
  path: import_zod14.z.string().nullable().optional(),
  /** Vendor/driver error code, e.g. Prisma's "P1001". */
  code: import_zod14.z.string().nullable().optional(),
  stack: import_zod14.z.string().nullable().optional(),
  user: import_zod14.z.string().nullable().optional(),
  userAgent: import_zod14.z.string().nullable().optional()
});
var ClientErrorReportSchema = import_zod14.z.object({
  reference: import_zod14.z.string().max(20),
  occurredAt: import_zod14.z.string().max(40),
  severity: ErrorLogSeverityEnum,
  kind: ErrorLogKindEnum,
  message: import_zod14.z.string().max(500),
  detail: import_zod14.z.string().max(4e3).optional(),
  statusCode: import_zod14.z.number().int().optional(),
  method: import_zod14.z.string().max(10).optional(),
  path: import_zod14.z.string().max(500).optional(),
  stack: import_zod14.z.string().max(4e3).optional()
});
var ClientErrorReportBatchSchema = import_zod14.z.object({
  reports: import_zod14.z.array(ClientErrorReportSchema).max(50)
});
function createErrorReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `E-${out}`;
}

// src/kb.schema.ts
var import_zod15 = require("zod");
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
var KbCategoryEnum = import_zod15.z.enum(KB_CATEGORIES);
var KbJurisdictionEnum = import_zod15.z.enum(["all", "IE", "UK", "ES"]);
var KbStatusEnum = import_zod15.z.enum(["draft", "approved", "retired"]);
var KbVisibilityEnum = import_zod15.z.enum(["all", "ie_only"]);
var SetKbVisibilityRequestSchema = import_zod15.z.object({ visibility: KbVisibilityEnum });
var KbSlugSchema = import_zod15.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase, hyphenated");
var isoDay = import_zod15.z.iso.date();
var KbFrontmatterSchema = import_zod15.z.object({
  slug: KbSlugSchema,
  title: import_zod15.z.string().trim().min(1),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: import_zod15.z.string().trim().min(1),
  status: KbStatusEnum,
  version: import_zod15.z.coerce.number().int().positive(),
  updatedAt: isoDay
});
var KbDocumentSchema = import_zod15.z.object({
  slug: KbSlugSchema,
  title: import_zod15.z.string(),
  category: KbCategoryEnum,
  jurisdiction: KbJurisdictionEnum,
  owner: import_zod15.z.string(),
  status: KbStatusEnum,
  visibility: KbVisibilityEnum.default("ie_only"),
  version: import_zod15.z.number().int(),
  contentUpdatedOn: isoDay,
  markdown: import_zod15.z.string()
});
var KbDocumentListResponseSchema = import_zod15.z.object({
  documents: import_zod15.z.array(KbDocumentSchema)
});
var UpdateKbDocumentRequestSchema = import_zod15.z.object({
  title: import_zod15.z.string().trim().min(1).max(200),
  owner: import_zod15.z.string().trim().min(1).max(100),
  markdown: import_zod15.z.string().trim().min(1).max(1e5)
});
var SetKbStatusRequestSchema = import_zod15.z.object({ status: KbStatusEnum });
var KB_CATEGORY_INFO = {
  sales: { label: "Sales", description: "Inquiries, quotes, pricing and customer conversations" },
  trading: { label: "Trading", description: "Payment, price lock, hedging and cancellations" },
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
  const text4 = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text4);
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
function headingAnchor(text4) {
  return text4.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
var TODO_PATTERN = /\[TODO:?\s*([^\]]*)\]/gi;
function findTodos(markdown) {
  const found = [];
  for (const match of textOutsideCode(markdown).matchAll(TODO_PATTERN)) {
    found.push((match[1] ?? "").trim());
  }
  return found;
}
function plainHeading(text4) {
  return text4.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
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
    (text4) => text4.replace(LINK_PATTERN, (_raw, slug2, anchor) => {
      const ref = { slug: slug2, anchor: anchor ?? null };
      const resolved = resolve(ref);
      return resolved ? `[${resolved.label}](${resolved.href}${resolved.title ? ` "${resolved.title.replace(/"/g, "'")}"` : ""})` : `[${slug2}](${KB_UNRESOLVED_HREF_PREFIX}${slug2})`;
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
    (text4) => text4.replace(/\[\[([a-z0-9-]+)(?:#([a-z0-9-]+))?\]\]/g, (_m, slug2, anchor) => anchor ? anchor.replace(/-/g, " ") : slug2.replace(/-/g, " ")).replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "").replace(/^\s*\|?\s*[-:| ]+\|[-:| ]*$/gm, "").replace(/\|/g, " ").replace(/[*_~]/g, "").replace(/^#{1,6}\s+/gm, "")
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
function buildSnippet(text4, tokens) {
  if (!text4) return [];
  const lower2 = text4.toLowerCase();
  const first = tokens.map((token) => lower2.indexOf(token)).filter((index) => index >= 0).sort((a, b) => a - b)[0];
  const start = first === void 0 ? 0 : Math.max(0, first - SNIPPET_RADIUS / 2);
  const end = Math.min(text4.length, start + SNIPPET_RADIUS * 2);
  const window = `${start > 0 ? "\u2026" : ""}${text4.slice(start, end).trim()}${end < text4.length ? "\u2026" : ""}`;
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
      const text4 = section.text.toLowerCase();
      const haystack = `${title} ${heading} ${text4}`;
      if (!tokens.every((token) => haystack.includes(token))) continue;
      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 10;
        if (heading.includes(token)) score += 6;
        const occurrences = text4.split(token).length - 1;
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
var KB_BC_HUB_PATH = "/knowledge/business-central";
var KB_GUIDE = {
  start: {
    title: "Who is paying whom?",
    hint: "Pick the side of the trade. Each step shows what to do at the desk and what to click in BC."
  },
  businessCentral: {
    title: "Business Central",
    hint: "The exact clicks for every job. Lost on a BC screen? Find it by name.",
    start: { label: "New to BC? Start here", target: { slug: "bc-quick-start" } },
    hub: { label: "Both flows on one page", target: { href: KB_BC_HUB_PATH } },
    stuck: { label: "Stuck? When to stop", target: { slug: "bc-troubleshooting-and-escalation" } }
  },
  branches: [
    {
      id: "price",
      title: "Price",
      tag: "Customer buys from us",
      blurb: "They pay us. Quote, take payment, lock the price, hand over.",
      icon: "receipt",
      phases: [
        {
          title: "Quote",
          desk: [
            {
              title: "Quote the customer",
              hint: "Identify them, price it, check stock, send it",
              target: { slug: "customer-inquiry-to-quote", anchor: "steps" }
            },
            { title: "Work out the Price", hint: "Spot, premium and VAT", target: { slug: "pricing", anchor: "sell-price" } }
          ],
          bc: [
            {
              title: "New customer",
              hint: "Only if they are not in BC yet",
              target: { slug: "bc-new-customer", anchor: "steps" },
              optional: true
            },
            {
              title: "Sales Quote",
              hint: "Create it and send it with the payment reference",
              target: { slug: "bc-sales-quote", anchor: "create-the-quote" }
            }
          ]
        },
        {
          title: "Wait for money",
          gate: {
            title: "STOP - has the money landed?",
            hint: "Nothing moves until the funds are confirmed. A screenshot or the customer\u2019s word is not proof.",
            target: { slug: "payment-lock-and-hedge", anchor: "confirming-funds" }
          },
          desk: [
            {
              title: "Take payment",
              hint: "Bank transfer, card or cash, and the fees",
              target: { slug: "payment-lock-and-hedge", anchor: "accepted-payment-methods" }
            }
          ],
          bc: [
            {
              title: "Nothing to do in BC yet",
              hint: "Do not convert the quote",
              target: { slug: "bc-sales-quote", anchor: "stop-here" },
              kind: "external"
            }
          ]
        },
        {
          title: "Lock it in",
          desk: [
            {
              title: "Lock the price and hedge",
              hint: "At current spot. A manager places the hedge",
              target: { slug: "payment-lock-and-hedge", anchor: "steps" }
            },
            {
              title: "Price moved?",
              hint: "Reprice, call the customer, record their choice",
              target: { slug: "customer-inquiry-to-quote", anchor: "price-changed-before-funds-landed" },
              kind: "soft"
            }
          ],
          bc: [
            {
              title: "Sales Order",
              hint: "Make Order from the quote",
              target: { slug: "bc-sales-order-and-prepayment", anchor: "convert-the-quote-to-a-sales-order" }
            },
            {
              title: "Prepayment Invoice",
              hint: "Enter the prepayment, post it, check it posted",
              target: { slug: "bc-sales-order-and-prepayment", anchor: "post-the-prepayment-invoice" }
            },
            { title: "Record the payment", hint: "Cash Receipt Journal. Amount is negative", target: { slug: "bc-record-customer-payment" } },
            {
              title: "Release and confirm",
              hint: "Fills the Hedging table, then email the customer",
              target: { slug: "bc-release-and-confirm", anchor: "steps" }
            }
          ]
        },
        {
          title: "Hand over",
          desk: [
            {
              title: "Check ID and hand it over",
              hint: "Signature, mark as collected",
              target: { slug: "customer-collection", anchor: "steps" }
            }
          ],
          bc: [
            {
              title: "Collect or ship",
              hint: "Serials, then Post \u2192 Ship and Invoice",
              target: { slug: "bc-collection-and-shipment", anchor: "final-posting" }
            }
          ]
        }
      ],
      alsoSee: [
        { label: "Bonded silver (VAT-free)", target: { slug: "bonded-silver-storage" } },
        { label: "Cash of \u20AC10,000 or more", target: { slug: "cash-transactions-ie" } }
      ]
    },
    {
      id: "buyback",
      title: "Buyback",
      tag: "Customer sells to us",
      blurb: "We pay them. Test the item, agree a price, record it, pay by bank transfer.",
      icon: "hand-coins",
      phases: [
        {
          title: "Identify",
          desk: [
            {
              title: "Identify the customer",
              hint: "Check photo ID and run the AML checks",
              target: { slug: "customer-buyback", anchor: "steps" }
            }
          ],
          bc: [
            {
              title: "New vendor",
              hint: "A customer selling to us is a vendor in BC",
              target: { slug: "bc-new-vendor", anchor: "steps" }
            }
          ]
        },
        {
          title: "Test and price",
          desk: [
            {
              title: "Test the item",
              hint: "Tester, weight, dimensions, condition",
              target: { slug: "customer-buyback", anchor: "testing" }
            },
            {
              title: "Work out the Buyback",
              hint: "Spot value less the product discount",
              target: { slug: "pricing", anchor: "buy-price" }
            }
          ],
          bc: [
            {
              title: "Nothing to do in BC yet",
              hint: "Test first, then record",
              target: { slug: "bc-purchase-orders", anchor: "rules" },
              kind: "external"
            }
          ]
        },
        {
          title: "Agree and record",
          desk: [
            {
              title: "Agree it and do the paperwork",
              hint: "Receipt, copies, price, signatures",
              target: { slug: "buyback-paperwork-and-testing", anchor: "at-the-desk" }
            }
          ],
          bc: [
            {
              title: "Purchase Order",
              hint: "Vendor, item, quantity, unit cost",
              target: { slug: "bc-purchase-orders", anchor: "steps" }
            },
            {
              title: "Serial numbers",
              hint: "Bars only. One serial per bar",
              target: { slug: "bc-purchase-orders", anchor: "serial-numbers-for-bars" }
            }
          ]
        },
        {
          title: "Pay",
          desk: [
            {
              title: "Pay by bank transfer",
              hint: "Tell them the timing first",
              target: { slug: "customer-buyback", anchor: "paying-the-customer" }
            }
          ],
          bc: [
            {
              title: "Accounts pay the seller",
              hint: "Not a branch step",
              target: { slug: "bc-purchase-orders", anchor: "who-does-what" },
              kind: "external"
            }
          ]
        },
        {
          title: "Into stock",
          desk: [
            {
              title: "Put it into stock",
              hint: "Counted in the monthly stock take",
              target: { slug: "stock-management", anchor: "monthly-stock-take" }
            }
          ],
          bc: [
            {
              title: "Receive and invoice",
              hint: "Goods and serials checked? Home \u2192 Post",
              target: { slug: "bc-purchase-orders", anchor: "steps" }
            }
          ]
        }
      ],
      alsoSee: [
        { label: "Scrap and non-standard items", target: { slug: "pricing", anchor: "scrap-and-non-standard-items" } },
        { label: "Selling bonded silver back", target: { slug: "bonded-silver-storage", anchor: "selling-bonded-silver-back" } }
      ]
    }
  ],
  quickLinks: [
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
      label: "Monthly stock take",
      hint: "Count, compare with BC, report differences",
      icon: "boxes",
      target: { slug: "stock-management", anchor: "monthly-stock-take" }
    },
    {
      label: "Is gold going up?",
      hint: "What to say, and what not to",
      icon: "messages",
      target: { slug: "customer-market-questions" }
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
      hint: "Spot, premiums, VAT rules",
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
      target: { slug: "kyc-aml" }
    }
  ]
};
var KB_BC_HUB = {
  title: "Two jobs, two flows.",
  intro: "Everything you do in Business Central is either a customer buying from us, or us buying in. Learn the shape of each flow first, then tap any step for the exact clicks.",
  flows: [
    {
      id: "price",
      title: "Customer buys from us",
      sub: "Price flow",
      items: [
        {
          kind: "step",
          title: "Sales Quote",
          hint: "Price it and send it with the payment reference",
          screen: "Sales Quotes \u2192 New",
          target: { slug: "bc-sales-quote" }
        },
        {
          kind: "stop",
          title: "STOP: payment confirmed?",
          hint: "Nothing moves until it is",
          target: { slug: "bc-sales-quote", anchor: "stop-here" }
        },
        {
          kind: "step",
          title: "Sales Order",
          hint: "Convert the quote, check the price",
          screen: "Quote \u2192 Make Order",
          target: { slug: "bc-sales-order-and-prepayment", anchor: "convert-the-quote-to-a-sales-order" }
        },
        {
          kind: "step",
          title: "Prepayment Invoice",
          hint: "Enter the prepayment, post it, check it posted",
          screen: "Actions \u2192 Posting \u2192 Prepayment",
          target: { slug: "bc-sales-order-and-prepayment", anchor: "post-the-prepayment-invoice" }
        },
        {
          kind: "step",
          title: "Cash Receipt Journal",
          hint: "Record the money, apply it to the invoice",
          screen: "Cash Receipt Journals",
          target: { slug: "bc-record-customer-payment" }
        },
        {
          kind: "step",
          title: "Release",
          hint: "Fills the Hedging table, then confirm",
          screen: "Home \u2192 Release",
          target: { slug: "bc-release-and-confirm" }
        },
        {
          kind: "step",
          title: "Collect or Ship",
          hint: "Ship and Invoice removes the stock",
          screen: "Orders Awaiting Collection",
          target: { slug: "bc-collection-and-shipment" }
        }
      ],
      foot: { label: "The whole sale in one page", target: { slug: "bc-customer-sales-workflow" } }
    },
    {
      id: "buyback",
      title: "We buy in",
      sub: "Customer Buyback or supplier order",
      items: [
        {
          kind: "step",
          title: "Vendor",
          hint: "Search first. New ones use DOM-VEND",
          screen: "Vendors \u2192 New",
          target: { slug: "bc-new-vendor" }
        },
        {
          kind: "step",
          title: "Purchase Order",
          hint: "Item, quantity, direct unit cost",
          screen: "Purchase Orders \u2192 New",
          target: { slug: "bc-purchase-orders", anchor: "steps" }
        },
        {
          kind: "step",
          title: "Serial numbers",
          hint: "Bars only: one serial per bar",
          screen: "Line \u2192 Item Tracking Lines",
          target: { slug: "bc-purchase-orders", anchor: "serial-numbers-for-bars" }
        },
        {
          kind: "step",
          title: "Check and print",
          hint: "Total vs the agreed deal. PO for signatures",
          screen: "Print/Send",
          target: { slug: "bc-purchase-orders", anchor: "steps" }
        },
        {
          kind: "external",
          title: "Accounts pays the seller",
          hint: "Not a branch step. Just wait for it",
          target: { slug: "bc-purchase-orders", anchor: "who-does-what" }
        },
        {
          kind: "step",
          title: "Receive and Invoice",
          hint: "Puts the stock into inventory",
          screen: "Home \u2192 Post",
          target: { slug: "bc-purchase-orders", anchor: "steps" }
        }
      ],
      foot: { label: "Stuck on a Purchase Order?", target: { slug: "bc-troubleshooting-and-escalation", anchor: "common-problems" } }
    }
  ],
  chain: [
    { label: "Quote", target: { slug: "bc-sales-quote" } },
    { label: "Wait", target: { slug: "bc-sales-quote", anchor: "stop-here" }, tone: "stop" },
    { label: "Order", target: { slug: "bc-sales-order-and-prepayment" } },
    { label: "Prepay Invoice", target: { slug: "bc-sales-order-and-prepayment", anchor: "post-the-prepayment-invoice" } },
    { label: "Journal", target: { slug: "bc-record-customer-payment" } },
    { label: "Release", target: { slug: "bc-release-and-confirm" } },
    { label: "Hand over", target: { slug: "bc-collection-and-shipment" }, tone: "end" }
  ],
  screens: [
    { title: "Customers", hint: "Search before you create", flow: "price", target: { slug: "bc-new-customer", anchor: "steps" } },
    { title: "Sales Quotes", hint: "New quote, lines, Print/Send", flow: "price", target: { slug: "bc-sales-quote", anchor: "create-the-quote" } },
    {
      title: "Sales Orders",
      hint: "Prepayment and Post Prepayment Invoice",
      flow: "price",
      target: { slug: "bc-sales-order-and-prepayment", anchor: "post-the-prepayment-invoice" }
    },
    {
      title: "Cash Receipt Journals",
      hint: "Negative amount, then Apply Entries",
      flow: "price",
      target: { slug: "bc-record-customer-payment", anchor: "fill-in-the-journal" }
    },
    {
      title: "Apply Entries",
      hint: "Link the payment to the invoice",
      flow: "price",
      target: { slug: "bc-record-customer-payment", anchor: "link-the-payment-to-the-invoice" }
    },
    {
      title: "Orders Awaiting Collection",
      hint: "Find the order and the balance owing",
      flow: "price",
      target: { slug: "bc-collection-and-shipment", anchor: "find-the-customer-s-order" }
    },
    {
      title: "Item Tracking Lines",
      hint: "One serial per bar, Quantity (Base) 1",
      flow: "price",
      target: { slug: "bc-collection-and-shipment", anchor: "serial-numbers-for-bars" }
    },
    { title: "Vendors", hint: "DOM-VEND template", flow: "buyback", target: { slug: "bc-new-vendor", anchor: "steps" } },
    { title: "Purchase Orders", hint: "Lines, serials, Receive and invoice", flow: "buyback", target: { slug: "bc-purchase-orders", anchor: "steps" } },
    { title: "Hedging table", hint: "Filled by Release", flow: "price", target: { slug: "bc-release-and-confirm", anchor: "steps" } }
  ],
  zoho: [
    { zoho: "Estimate", bc: "Sales Quote", target: { slug: "bc-sales-quote" } },
    { zoho: "Invoice", bc: "Sales Order + Prepayment Invoice", target: { slug: "bc-sales-order-and-prepayment" } },
    { zoho: "Record Payment", bc: "Cash Receipt Journal + Apply Entries", target: { slug: "bc-record-customer-payment" } },
    { zoho: "(no equivalent)", bc: "Release \u2192 fills the Hedging table", target: { slug: "bc-release-and-confirm" } },
    { zoho: "Mark as delivered", bc: "Post \u2192 Ship and Invoice", target: { slug: "bc-collection-and-shipment", anchor: "final-posting" } }
  ],
  traps: [
    {
      title: "Journal amount is negative",
      hint: "\u20AC4,495 received \u2192 -4495",
      target: { slug: "bc-record-customer-payment", anchor: "fill-in-the-journal" }
    },
    {
      title: "Prepayment field is 100",
      hint: "Even if only part has been paid",
      target: { slug: "bc-sales-order-and-prepayment", anchor: "the-prepayment-value" }
    },
    { title: "Release before confirming", hint: "No Release, no Hedging table", target: { slug: "bc-release-and-confirm", anchor: "steps" } },
    {
      title: "One serial per bar",
      hint: "Quantity (Base) = 1 on every line",
      target: { slug: "bc-collection-and-shipment", anchor: "serial-numbers-for-bars" }
    },
    { title: "Start from a Quote", hint: "Never a standalone Sales Order", target: { slug: "bc-sales-quote" } },
    { title: "Location Code DU", hint: "On every sales quote line", target: { slug: "bc-sales-quote", anchor: "create-the-quote" } }
  ],
  stop: {
    title: "Stop and ask a manager",
    hint: "Amendments, cancellations, reversals, posting corrections, or anything that doesn\u2019t match these flows. Don\u2019t use a function just because it\u2019s in the menu.",
    target: { slug: "bc-troubleshooting-and-escalation", anchor: "when-to-stop" }
  }
};
var KB_FLOW_BARS = [
  {
    id: "bc-price",
    label: "In Business Central \xB7 Customer buys from us",
    tone: "price",
    sequential: true,
    overview: { href: KB_BC_HUB_PATH },
    overviewSlug: "bc-customer-sales-workflow",
    items: [
      { slug: "bc-new-customer", label: "New customer" },
      { slug: "bc-sales-quote", label: "Sales Quote" },
      { slug: "bc-sales-order-and-prepayment", label: "Order + prepayment" },
      { slug: "bc-record-customer-payment", label: "Record payment" },
      { slug: "bc-release-and-confirm", label: "Release" },
      { slug: "bc-collection-and-shipment", label: "Collect / ship" }
    ]
  },
  {
    id: "bc-buy",
    label: "In Business Central \xB7 We buy in",
    tone: "buyback",
    sequential: true,
    overview: { href: KB_BC_HUB_PATH },
    items: [
      { slug: "bc-new-vendor", label: "New vendor" },
      { slug: "bc-purchase-orders", label: "Purchase Order" }
    ]
  },
  {
    id: "desk-price",
    label: "At the desk \xB7 Price",
    tone: "price",
    sequential: false,
    overview: { href: "/knowledge?flow=price" },
    items: [
      { slug: "customer-inquiry-to-quote", label: "Quote" },
      { slug: "pricing", label: "Price" },
      { slug: "payment-lock-and-hedge", label: "Payment and lock" },
      { slug: "customer-collection", label: "Hand over" }
    ]
  },
  {
    id: "desk-buyback",
    label: "At the desk \xB7 Buyback",
    tone: "buyback",
    sequential: false,
    overview: { href: "/knowledge?flow=buyback" },
    items: [
      { slug: "customer-buyback", label: "Buyback" },
      { slug: "buyback-paperwork-and-testing", label: "Paperwork and testing" },
      { slug: "stock-management", label: "Stock" }
    ]
  }
];
function flowBarFor(slug2, bars = KB_FLOW_BARS) {
  for (const bar of bars) {
    const index = bar.items.findIndex((item) => item.slug === slug2);
    if (index >= 0) return { bar, index };
  }
  return null;
}
function procedureFlow(slug2, bars = KB_FLOW_BARS) {
  for (const [barIndex, bar] of bars.entries()) {
    if (bar.overviewSlug === slug2) return { bar, barIndex, position: -1 };
    const position = bar.items.findIndex((item) => item.slug === slug2);
    if (position >= 0) return { bar, barIndex, position };
  }
  return null;
}
function compareProcedures(a, b, bars = KB_FLOW_BARS) {
  const rank2 = (slug2) => {
    const found = procedureFlow(slug2, bars);
    if (!found) return [0, 0, 0];
    return [found.bar.tone === "price" ? 1 : 2, found.barIndex, found.position];
  };
  const [a1, a2, a3] = rank2(a);
  const [b1, b2, b3] = rank2(b);
  return a1 - b1 || a2 - b2 || a3 - b3;
}
function flowNextSlug(slug2, bars = KB_FLOW_BARS) {
  const found = flowBarFor(slug2, bars);
  if (!found || !found.bar.sequential) return null;
  return found.bar.items[found.index + 1]?.slug ?? null;
}
function guideLibraryTargets(guide = KB_GUIDE, hub = KB_BC_HUB, bars = KB_FLOW_BARS) {
  const out = [];
  const add = (target, pendingSop = false) => {
    if ("slug" in target) out.push({ slug: target.slug, anchor: target.anchor, pendingSop });
  };
  const bc = guide.businessCentral;
  [bc.start, bc.hub, bc.stuck].forEach((link) => add(link.target));
  for (const branch of guide.branches) {
    for (const phase of branch.phases) {
      if (phase.gate) add(phase.gate.target);
      [...phase.desk, ...phase.bc].forEach((node) => add(node.target));
    }
    branch.alsoSee.forEach((link) => add(link.target));
  }
  [...guide.quickLinks, ...guide.tools].forEach((shortcut) => add(shortcut.target, shortcut.pendingSop));
  for (const flow of hub.flows) {
    flow.items.forEach((item) => add(item.target));
    add(flow.foot.target);
  }
  hub.chain.forEach((link) => add(link.target));
  hub.screens.forEach((screen) => add(screen.target));
  hub.zoho.forEach((row) => add(row.target));
  hub.traps.forEach((trap) => add(trap.target));
  add(hub.stop.target);
  for (const bar of bars) {
    bar.items.forEach((item) => add({ slug: item.slug }));
    add(bar.overview);
  }
  return out;
}

// src/kb-terms.ts
var KB_TERMS = [
  { id: "price-lock", phrases: ["price is locked", "lock the price", "locks the price", "price lock", "locked price", "hedged", "hedging", "hedge"], target: { slug: "payment-lock-and-hedge", anchor: "core-rule" } },
  { id: "funds-landed", phrases: ["funds have landed", "funds landed", "funds land", "confirm the funds", "confirming funds"], target: { slug: "payment-lock-and-hedge", anchor: "confirming-funds" } },
  { id: "customer-safe", phrases: ["customer safe", "CST Safe"], target: { slug: "stock-management", anchor: "customer-safe-cst-safe" } },
  { id: "bonded-silver", phrases: ["bonded silver", "bonded warehouse", "in bond"], target: { slug: "bonded-silver-storage" } },
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
  { id: "kyc-aml", phrases: ["KYC", "AML"], target: { slug: "kyc-aml" }, caseSensitive: true }
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
    (text4) => text4.replace(/\[\[[^\]]*\]\]/g, " ").replace(/\[TODO:?[^\]]*\]/gi, " ").replace(/\[[^\]]*\]\([^)]*\)/g, " ").replace(/^#{1,6}\s.*$/gm, " ")
  ).split("`").filter((_, index) => index % 2 === 0).join(" ");
}
function planAutolinks(sections, currentSlug, isAvailable, terms = KB_TERMS) {
  const plan = /* @__PURE__ */ new Map();
  const used = /* @__PURE__ */ new Set();
  const candidates = terms.filter((term) => term.target.slug !== currentSlug && isAvailable(term.target));
  for (const section of sections) {
    if (section.anchor === "related") continue;
    const text4 = linkableText(section.markdown);
    const linked = [];
    for (const term of candidates) {
      if (used.has(term.id)) continue;
      if (termRegExp(term).test(text4)) {
        used.add(term.id);
        linked.push(term);
      }
    }
    if (linked.length > 0) plan.set(section.anchor, linked);
  }
  return plan;
}

// src/kb-layout.ts
var MARKER = /^(\d{1,3}[.)]|[-*+])\s+(.*)$/;
var FENCE = /^\s*```/;
var HEADING = /^\s{0,3}#{1,6}\s/;
var TABLE_ROW = /^\s*\|/;
var QUOTE = /^\s*>/;
var RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;
var startsAnotherBlock = (line) => HEADING.test(line) || FENCE.test(line) || TABLE_ROW.test(line) || QUOTE.test(line) || RULE.test(line);
function indentOf(line) {
  return /^ */.exec(line)?.[0].length ?? 0;
}
function dedent(lines) {
  const indents = lines.filter((line) => line.trim() !== "").map(indentOf);
  const cut = indents.length > 0 ? Math.min(...indents, 4) : 0;
  return lines.map((line) => line.slice(Math.min(cut, indentOf(line))));
}
function parseBlocks(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (FENCE.test(line)) {
      const start2 = i;
      i++;
      while (i < lines.length && !FENCE.test(lines[i] ?? "")) i++;
      i = Math.min(i + 1, lines.length);
      blocks.push({ type: "other", markdown: lines.slice(start2, i).join("\n") });
      continue;
    }
    if (startsAnotherBlock(line)) {
      const start2 = i;
      const same2 = (candidate) => TABLE_ROW.test(line) ? TABLE_ROW.test(candidate) : QUOTE.test(line) ? QUOTE.test(candidate) : false;
      i++;
      while (i < lines.length && same2(lines[i] ?? "")) i++;
      blocks.push({ type: "other", markdown: lines.slice(start2, i).join("\n") });
      continue;
    }
    const marker = MARKER.exec(line);
    if (marker) {
      const ordered = /^\d/.test(marker[1] ?? "");
      const rawStart = i;
      const itemLines = [];
      while (i < lines.length) {
        const current = lines[i] ?? "";
        const item = MARKER.exec(current);
        if (item && !RULE.test(current)) {
          if (/^\d/.test(item[1] ?? "") !== ordered) break;
          itemLines.push([item[2] ?? ""]);
          i++;
          continue;
        }
        if (current.trim() === "") {
          let next = i + 1;
          while (next < lines.length && (lines[next] ?? "").trim() === "") next++;
          const after = lines[next] ?? "";
          const continues = next < lines.length && (indentOf(after) > 0 || MARKER.test(after) && /^\d/.test(MARKER.exec(after)?.[1] ?? "") === ordered && !RULE.test(after));
          if (!continues) break;
          itemLines[itemLines.length - 1]?.push("");
          i++;
          continue;
        }
        const lazy = indentOf(current) === 0 && (lines[i - 1] ?? "").trim() !== "" && !startsAnotherBlock(current);
        if (indentOf(current) > 0 || lazy) {
          itemLines[itemLines.length - 1]?.push(current);
          i++;
          continue;
        }
        break;
      }
      const items = itemLines.map((parts) => {
        const [first = "", ...rest] = parts;
        const body = [first, ...dedent(rest)].join("\n").replace(/\n+$/, "");
        return { markdown: body, text: toPlainText(body), hasNested: rest.some((part) => MARKER.test(part.trim())) };
      });
      blocks.push({ type: "list", ordered, items, raw: lines.slice(rawStart, i).join("\n").replace(/\n+$/, "") });
      continue;
    }
    const start = i;
    i++;
    while (i < lines.length && (lines[i] ?? "").trim() !== "" && !MARKER.test(lines[i] ?? "") && !startsAnotherBlock(lines[i] ?? "")) i++;
    blocks.push({ type: "paragraph", markdown: lines.slice(start, i).join("\n") });
  }
  return blocks;
}
var LEAD_ANCHORS = /* @__PURE__ */ new Set(["purpose", "summary"]);
var STOP_HEADING = /^(stop|when to stop|if it does not match|if the payment)/i;
function classifySection(section, index, blocks = parseBlocks(section.markdown)) {
  const heading = section.heading.toLowerCase();
  if (index === 0 && LEAD_ANCHORS.has(section.anchor)) return "lead";
  if (section.anchor === "related") return "related";
  if (section.anchor === "next") return "next";
  if (heading.startsWith("before you start")) return "before";
  if (STOP_HEADING.test(heading)) return "stop";
  if (section.isProposed || heading.startsWith("proposed controls")) return "proposal";
  if (blocks.some((block) => block.type === "list" && block.ordered)) return "steps";
  return "ref";
}
var STOP_STEP = /^[\s*_]*(stop|do not|never)\b/i;
var RULE_NO = /^[\s*_]*(do not|don[’']t|never|stop)\b/i;
var RULE_YES = /^[\s*_]*always\b/i;
var CHECK_LEAD_IN = /check each|check that|make sure|before you/i;
var RIGHT_WRONG = /^Right:\s*([\s\S]*?)\s+Wrong:\s*([\s\S]*)$/;
function isStopStep(text4) {
  return STOP_STEP.test(text4);
}
function ruleTone(text4) {
  if (RULE_NO.test(text4)) return "no";
  if (RULE_YES.test(text4)) return "yes";
  return "neutral";
}
function splitField(item) {
  const colon = item.text.indexOf(":");
  if (colon <= 1 || colon >= 34) return null;
  const match = /^([^:\n]{2,34}):\s*([\s\S]*)$/.exec(item.markdown);
  if (!match) return null;
  const label = (match[1] ?? "").replace(/[*_`]/g, "").trim();
  const value = (match[2] ?? "").replace(/^\*+\s*/, "").replace(/^([*_`[]*)([a-z])/, (_m, lead, ch) => lead + ch.toUpperCase());
  return label ? { label, value } : null;
}
function emitList(items, ordered) {
  const lines = [];
  const itemLines = [];
  items.forEach((item, index) => {
    itemLines.push(lines.length + 1);
    const [first = "", ...rest] = item.markdown.split("\n");
    lines.push(`${ordered ? `${index + 1}.` : "-"} ${first}`);
    for (const line of rest) lines.push(line.trim() === "" ? "" : `   ${line}`);
  });
  return { markdown: lines.join("\n"), itemLines };
}
function renderOrdered(items, out) {
  const fields = items.map(splitField);
  const fieldy = fields.filter((field2) => field2 !== null).length;
  if (items.length >= 4 && fieldy / items.length >= 0.7) {
    const leadIns = [];
    const rows = [];
    items.forEach((item, index) => {
      const field2 = fields[index];
      if (!field2) {
        leadIns.push(item.markdown);
        return;
      }
      rows.push({ ...field2, danger: /negative|never|do not/i.test(item.text) });
    });
    out.push({ type: "form", leadIns, rows });
    return;
  }
  if (items.length >= 3 && items.length <= 6 && items.every((item) => item.text.length <= 80 && !item.hasNested)) {
    out.push({ type: "markdown", variant: "miniflow", ...emitList(items, true) });
    return;
  }
  let rest = items;
  const first = items[0];
  if (items.length > 2 && first && isStopStep(first.text)) {
    out.push({ type: "stop", markdown: first.markdown });
    rest = items.slice(1);
  }
  out.push({ type: "markdown", variant: "steps", ...emitList(rest, true) });
}
function renderBullets(block, previous, kind, out) {
  const introduced = previous?.type === "paragraph" && CHECK_LEAD_IN.test(toPlainText(previous.markdown));
  if (kind === "before" || introduced) {
    out.push({ type: "markdown", variant: "checklist", markdown: emitList(block.items, false).markdown });
  } else if (block.items.some((item) => ruleTone(item.text) !== "neutral")) {
    out.push({ type: "markdown", variant: "rules", markdown: emitList(block.items, false).markdown });
  } else {
    out.push({ type: "markdown", variant: "plain", markdown: block.raw });
  }
}
function buildBlocks(markdown, kind) {
  const blocks = parseBlocks(markdown);
  const out = [];
  let plain = [];
  const flush = () => {
    if (plain.length > 0) out.push({ type: "markdown", variant: "plain", markdown: plain.join("\n\n") });
    plain = [];
  };
  blocks.forEach((block, index) => {
    if (block.type === "paragraph") {
      const pair = RIGHT_WRONG.exec(block.markdown.replace(/\n/g, " "));
      if (pair) {
        flush();
        out.push({ type: "rightwrong", right: pair[1] ?? "", wrong: pair[2] ?? "" });
      } else {
        plain.push(block.markdown);
      }
    } else if (block.type === "other") {
      plain.push(block.markdown);
    } else {
      const previous = blocks[index - 1];
      const sink = [];
      if (block.ordered) renderOrdered(block.items, sink);
      else renderBullets(block, previous, kind, sink);
      const only = sink[0];
      if (sink.length === 1 && only?.type === "markdown" && only.variant === "plain") {
        plain.push(only.markdown);
      } else {
        flush();
        out.push(...sink);
      }
    }
  });
  flush();
  return out;
}
var COLLAPSE_ABOVE_CHARACTERS = 700;
var MAIN_SECTION_ANCHORS = /* @__PURE__ */ new Set(["steps", "the-steps", "workflow"]);
function extractSources(markdown) {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => /^\s*\**sources?:\**/i.test(line));
  if (start < 0) return { markdown, sources: null };
  let end = start + 1;
  while (end < lines.length && (lines[end] ?? "").trim() !== "") end++;
  const text4 = toPlainText(lines.slice(start, end).join(" ")).replace(/^sources?:\s*/i, "").replace(/\.$/, "").trim();
  return { markdown: [...lines.slice(0, start), ...lines.slice(end)].join("\n").trim(), sources: text4 || null };
}
function firstSentence(text4) {
  return (text4.split(/(?<=[.:])\s/)[0] ?? "").slice(0, 120);
}
function countItems(blocks) {
  return blocks.reduce((total, block) => total + (block.type === "list" ? block.items.length : 0), 0);
}
function buildArticleLayout(sections) {
  let sources = null;
  const parsed = /* @__PURE__ */ new Map();
  const entries = sections.map((section, index) => {
    let markdown = section.markdown;
    const provisional = classifySection(section, index);
    if (provisional === "lead") {
      const lifted = extractSources(markdown);
      markdown = lifted.markdown;
      sources = lifted.sources;
    }
    const blocks = parseBlocks(markdown);
    const kind = classifySection(section, index, blocks);
    parsed.set(section.anchor, blocks);
    const text4 = toPlainText(markdown);
    return {
      section,
      kind,
      blocks: buildBlocks(markdown, kind),
      collapsed: kind === "ref" && text4.length > COLLAPSE_ABOVE_CHARACTERS && !MAIN_SECTION_ANCHORS.has(section.anchor) || kind === "proposal",
      preview: firstSentence(text4),
      itemCount: countItems(blocks)
    };
  });
  const nextEntry = entries.find((entry) => entry.kind === "next");
  return {
    entries,
    sources,
    next: nextEntry ? findLinks(nextEntry.section.markdown)[0] ?? null : null,
    contents: entries.filter((entry) => entry.kind !== "lead" && entry.kind !== "related" && entry.section.heading && entry.section.anchor).map((entry) => ({ anchor: entry.section.anchor, heading: entry.section.heading, hasTodo: entry.section.hasTodo }))
  };
}
function shareTermsAcrossBlocks(blocks, terms) {
  const shared = /* @__PURE__ */ new Map();
  let pending = terms;
  blocks.forEach((block, index) => {
    if (block.type !== "markdown" || pending.length === 0) return;
    const text4 = toPlainText(block.markdown);
    const taken = pending.filter((term) => {
      const pattern = termRegExp(term);
      pattern.lastIndex = 0;
      return pattern.test(text4);
    });
    if (taken.length === 0) return;
    shared.set(index, taken);
    pending = pending.filter((term) => !taken.includes(term));
  });
  return shared;
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
var import_zod16 = require("zod");
var AiModeEnum = import_zod16.z.enum(["procedures", "email", "whatsapp"]);
var AI_QUESTION_MAX_LENGTH = 500;
var AI_MESSAGE_MAX_LENGTH = 4e3;
function aiInputLimit(mode) {
  return mode === "procedures" ? AI_QUESTION_MAX_LENGTH : AI_MESSAGE_MAX_LENGTH;
}
var AskRequestSchema = import_zod16.z.object({
  /** A question (procedures) or the customer's pasted message (email, whatsapp). */
  question: import_zod16.z.string().trim().min(1).max(AI_MESSAGE_MAX_LENGTH),
  mode: AiModeEnum.default("procedures"),
  /**
   * The spot the product table is quoting from, when the user has frozen or typed one - otherwise
   * the live spot is used. Sent so a price the assistant quotes matches the price on screen.
   */
  spotOverrides: RecalculateOverridesSchema.optional()
}).refine((request) => request.question.length <= aiInputLimit(request.mode), {
  path: ["question"],
  message: "That is too long for a question. Keep it under 500 characters."
});
var AiAnswerStatusEnum = import_zod16.z.enum(["answered", "refused", "uncited"]);
var AiCitationSchema = import_zod16.z.object({
  slug: import_zod16.z.string(),
  anchor: import_zod16.z.string().nullable(),
  title: import_zod16.z.string(),
  heading: import_zod16.z.string().nullable()
});
var AiUsageSchema = import_zod16.z.object({
  inputTokens: import_zod16.z.number().int(),
  /** The part of the input served from the model vendor's prompt cache (billed at a fraction). */
  cachedInputTokens: import_zod16.z.number().int(),
  /** The part of the input written to the prompt cache (some vendors bill it above the normal input rate). */
  cacheWriteInputTokens: import_zod16.z.number().int().optional(),
  outputTokens: import_zod16.z.number().int()
});
var AiSpotNoteSchema = import_zod16.z.object({
  tone: import_zod16.z.enum(["custom", "stale", "healthy"]),
  message: import_zod16.z.string()
});
var AskResponseSchema = import_zod16.z.object({
  /** Markdown. Citations are left in as `[[slug#section]]`, which the reader turns into links. */
  answer: import_zod16.z.string(),
  mode: AiModeEnum,
  status: AiAnswerStatusEnum,
  citations: import_zod16.z.array(AiCitationSchema),
  model: import_zod16.z.string(),
  usage: AiUsageSchema,
  latencyMs: import_zod16.z.number().int(),
  /** Which SOPs the answer was based on - the audit trail for "what did it know when it said that?". */
  corpus: import_zod16.z.object({ documents: import_zod16.z.number().int(), hash: import_zod16.z.string() }),
  /** Served from the answer cache: no model call, so usage is zero. */
  cached: import_zod16.z.boolean(),
  /** Email/WhatsApp only: notes for the staff member (what the reply assumes, what to check), apart from the message to send. `answer` is the message itself. */
  notes: import_zod16.z.string().nullable(),
  /** Things to check before relying on the answer, e.g. a figure that did not come from a price lookup, or prices that may be out of date. */
  warnings: import_zod16.z.array(import_zod16.z.string()),
  /** Present only when the answer used a price lookup. Shown to staff beside the answer, never written into it. */
  spotNote: AiSpotNoteSchema.nullable(),
  /** Which live lookups the answer used (getSpot, findProductPrices). Empty for a pure SOP answer. */
  toolsUsed: import_zod16.z.array(import_zod16.z.string())
});
var AiStatusSchema = import_zod16.z.object({
  enabled: import_zod16.z.boolean(),
  model: import_zod16.z.string()
});
var AskStreamEventSchema = import_zod16.z.discriminatedUnion("type", [
  import_zod16.z.object({ type: import_zod16.z.literal("delta"), text: import_zod16.z.string() }),
  import_zod16.z.object({ type: import_zod16.z.literal("tool"), name: import_zod16.z.string() }),
  import_zod16.z.object({ type: import_zod16.z.literal("done"), response: AskResponseSchema }),
  import_zod16.z.object({ type: import_zod16.z.literal("error"), status: import_zod16.z.number().int(), message: import_zod16.z.string() })
]);

// src/roadmap.schema.ts
var import_zod17 = require("zod");
var RoadmapDocumentSchema = import_zod17.z.object({
  markdown: import_zod17.z.string(),
  version: import_zod17.z.number().int().nonnegative(),
  updatedBy: import_zod17.z.string().nullable(),
  updatedAt: import_zod17.z.iso.datetime().nullable()
});
var TaskText = import_zod17.z.string().trim().min(1, "Task text is required").max(500).refine((t) => !/[\r\n]/.test(t), "Task text must be one line");
var Line = import_zod17.z.number().int().nonnegative();
var RoadmapEditSchema = import_zod17.z.discriminatedUnion("type", [
  import_zod17.z.object({ type: import_zod17.z.literal("toggle"), line: Line, text: import_zod17.z.string(), checked: import_zod17.z.boolean() }),
  import_zod17.z.object({ type: import_zod17.z.literal("add"), sectionLine: Line, parentLine: Line.optional(), text: TaskText }),
  import_zod17.z.object({ type: import_zod17.z.literal("delete"), line: Line, text: import_zod17.z.string() }),
  import_zod17.z.object({ type: import_zod17.z.literal("edit"), line: Line, text: import_zod17.z.string(), newText: TaskText })
]);
var RoadmapEditRequestSchema = import_zod17.z.object({
  /** The document version the edit was made against. */
  version: import_zod17.z.number().int().nonnegative(),
  edit: RoadmapEditSchema
});

// src/roadmap.ts
var TASK_LINE = /^(\s*)- \[( |x|X)\] (.*)$/;
var HEADING2 = /^(#{1,2}) (.+)$/;
var PRIORITY_EMOJI = { "\u{1F534}": "P0", "\u{1F7E0}": "P1", "\u{1F7E1}": "P2", "\u26AA": "P3" };
var indentOf2 = (line) => line.length - line.trimStart().length;
var eolOf = (markdown) => markdown.includes("\r\n") ? "\r\n" : "\n";
var linesOf = (markdown) => markdown.split(/\r?\n/);
function slug(text4) {
  return text4.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function parseHeading(raw, group, headingLine, taken) {
  let text4 = raw.trim();
  let priority = null;
  for (const [emoji, level] of Object.entries(PRIORITY_EMOJI)) {
    if (text4.includes(emoji)) {
      priority ??= level;
      text4 = text4.replace(emoji, "");
    }
  }
  let depends = null;
  const arrow = text4.indexOf("\u2190");
  if (arrow >= 0) {
    depends = text4.slice(arrow + 1).replace(/^\s*depends:\s*/i, "").trim() || null;
    text4 = text4.slice(0, arrow);
  }
  let note = null;
  text4 = text4.replace(/\*\(([^)]*)\)\*/, (_m, inner) => {
    note = inner.trim();
    return "";
  });
  text4 = text4.replace(/`/g, "").replace(/\s*→\s*$/, "").replace(/\s+/g, " ").trim();
  const idMatch = /^(\d+\.\d+)\s+(.*)$/.exec(text4);
  const id = idMatch ? idMatch[1] ?? null : null;
  const title = idMatch ? idMatch[2] ?? text4 : text4;
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
    const heading = inFence ? null : HEADING2.exec(line);
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
    const owner = line.trim() === "" ? void 0 : [...stack].reverse().find((entry) => indentOf2(line) > entry.indent);
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
function requireTask(lines, line, text4) {
  const match = TASK_LINE.exec(lines[line] ?? "");
  if (!match) throw new RoadmapEditError(`Line ${line + 1} is not a task. Reload and try again.`);
  if (match[3].trim() !== text4.trim()) throw new RoadmapEditError("That task changed since you loaded the page. Reload and try again.");
  return match;
}
function blockEnd(lines, line) {
  const indent = indentOf2(lines[line]);
  let end = line;
  for (let i = line + 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    if (indentOf2(lines[i]) <= indent) break;
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
      const heading = HEADING2.exec(lines[edit.sectionLine] ?? "");
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
        if (HEADING2.test(lines[i])) {
          sectionEnd = i;
          break;
        }
      }
      let lastTop = -1;
      for (let i = edit.sectionLine + 1; i < sectionEnd; i++) if (TASK_LINE.test(lines[i]) && indentOf2(lines[i]) === 0) lastTop = i;
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

// src/roadmap-merge.ts
var splitLines = (markdown) => markdown.replace(/\r\n/g, "\n").split("\n");
var same = (a, b) => a.length === b.length && a.every((line, i) => line === b[i]);
function matchLines(a, b) {
  const n = a.length;
  const m = b.length;
  const width = m + 1;
  const table = new Uint32Array((n + 1) * width);
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      table[i2 * width + j2] = a[i2] === b[j2] ? table[(i2 + 1) * width + j2 + 1] + 1 : Math.max(table[(i2 + 1) * width + j2], table[i2 * width + j2 + 1]);
    }
  }
  const partner = new Array(n).fill(-1);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      partner[i] = j;
      i++;
      j++;
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) i++;
    else j++;
  }
  return partner;
}
var firstText = (...regions) => regions.flat().map((line) => line.trim()).find((line) => line !== "") ?? "";
function hunksOf(partner, side, baseLength) {
  const hunks = [];
  let b = 0;
  let x = 0;
  while (b <= baseLength) {
    let next = b;
    while (next < baseLength && partner[next] < 0) next++;
    const sideEnd = next < baseLength ? partner[next] : side.length;
    if (next > b || sideEnd > x) hunks.push({ start: b, end: next, lines: side.slice(x, sideEnd) });
    b = next + 1;
    x = sideEnd + 1;
  }
  return hunks;
}
function collide(a, b) {
  if (a.start === a.end && b.start === b.end) return a.start === b.start;
  if (a.start === a.end) return a.start > b.start && a.start < b.end;
  if (b.start === b.end) return b.start > a.start && b.start < a.end;
  return a.start < b.end && b.start < a.end;
}
function applyHunks(base, start, end, hunks) {
  const out = [];
  let at = start;
  for (const h of hunks) {
    out.push(...base.slice(at, h.start), ...h.lines);
    at = h.end;
  }
  out.push(...base.slice(at, end));
  return out;
}
function mergeRoadmap(baseText, fileText, appText) {
  const base = splitLines(baseText);
  const file = splitLines(fileText);
  const app = splitLines(appText);
  const fileHunks = hunksOf(matchLines(base, file), file, base.length);
  const appHunks = hunksOf(matchLines(base, app), app, base.length);
  const forApp = [];
  const forFile = [];
  const log = [];
  let at = 0;
  let fi = 0;
  let ai = 0;
  while (fi < fileHunks.length || ai < appHunks.length) {
    const nextF = fileHunks[fi];
    const nextA = appHunks[ai];
    const first = !nextA || nextF && nextF.start <= nextA.start ? nextF : nextA;
    const untouched = base.slice(at, first.start);
    forApp.push(...untouched);
    forFile.push(...untouched);
    const inFile = [];
    const inApp = [];
    let start = first.start;
    let end = first.end;
    (first === nextF ? inFile : inApp).push(first);
    if (first === nextF) fi++;
    else ai++;
    for (let grew = true; grew; ) {
      grew = false;
      const cluster = { start, end, lines: [] };
      const f = fileHunks[fi];
      const a = appHunks[ai];
      if (f && collide(cluster, f)) {
        inFile.push(f);
        fi++;
        end = Math.max(end, f.end);
        grew = true;
      } else if (a && collide(cluster, a)) {
        inApp.push(a);
        ai++;
        end = Math.max(end, a.end);
        grew = true;
      }
    }
    const B = base.slice(start, end);
    const F = applyHunks(base, start, end, inFile);
    const A = applyHunks(base, start, end, inApp);
    const entry = (kind) => log.push({ kind, baseLine: start + 1, text: firstText(A, F, B) });
    if (same(F, B) && same(A, B)) {
      forApp.push(...B);
      forFile.push(...B);
    } else if (same(F, B)) {
      forApp.push(...A);
      forFile.push(...A);
      entry("to-file");
    } else if (same(A, B)) {
      if (F.length === 0 && B.length > 0) {
        forApp.push(...B);
        entry("missing-from-file");
      } else {
        forApp.push(...F);
        entry("to-app");
      }
      forFile.push(...F);
    } else if (same(A, F)) {
      forApp.push(...A);
      forFile.push(...A);
    } else if (B.length === 0) {
      forApp.push(...F, ...A);
      forFile.push(...F, ...A);
      entry("both-added");
    } else if (A.length === 0) {
      forApp.push(...F);
      forFile.push(...F);
      entry("kept-file-edit");
    } else {
      forApp.push(...A);
      forFile.push(...A);
      entry("conflict-app-wins");
    }
    at = end;
  }
  const rest = base.slice(at);
  forApp.push(...rest);
  forFile.push(...rest);
  const eol = appText.includes("\r\n") ? "\r\n" : "\n";
  return {
    forApp: forApp.join(eol),
    forFile: forFile.join(fileText.includes("\r\n") ? "\r\n" : "\n"),
    log,
    fileChanged: !same(forFile, file),
    appChanged: !same(forApp, app)
  };
}

// src/roadmap-sync.schema.ts
var import_zod18 = require("zod");
var RoadmapSyncStatusSchema = import_zod18.z.object({
  /** `unconfigured` no GitHub token; `in-sync` same text; `differs` the app and master disagree; `unavailable` GitHub could not be reached. */
  state: import_zod18.z.enum(["unconfigured", "in-sync", "differs", "unavailable"]),
  /** `owner/name` the status was read from. */
  repo: import_zod18.z.string(),
  branch: import_zod18.z.string(),
  /** Commit of the branch tip the file was read at. */
  masterCommit: import_zod18.z.string().nullable(),
  appVersion: import_zod18.z.number().int().nonnegative(),
  appUpdatedAt: import_zod18.z.iso.datetime().nullable(),
  /** Lines in the app's copy that master does not have. */
  appOnlyLines: import_zod18.z.number().int().nonnegative(),
  /** Lines on master that the app's copy does not have. */
  masterOnlyLines: import_zod18.z.number().int().nonnegative(),
  /** A short `+`/`-` preview of the difference (app against master), capped. */
  preview: import_zod18.z.array(import_zod18.z.string()),
  /** The open `[roadmap-sync]` pull request, if there is one. */
  openSyncPr: import_zod18.z.object({ number: import_zod18.z.number().int(), title: import_zod18.z.string(), url: import_zod18.z.string() }).nullable(),
  /** When the GitHub token expires, as GitHub reports it. */
  tokenExpiresAt: import_zod18.z.iso.datetime().nullable(),
  /** Why the state is `unavailable`. */
  error: import_zod18.z.string().nullable(),
  /** App edits a push would send to GitHub; null when sync is not set up or could not be worked out. */
  appEditsToPush: import_zod18.z.number().int().nonnegative().nullable()
});
var RoadmapPullRequestSchema = import_zod18.z.object({
  /** Show what would change and write nothing. */
  dryRun: import_zod18.z.boolean().optional(),
  /** The first pull replaces the app's copy; it is refused unless this is true. */
  confirmReplace: import_zod18.z.boolean().optional()
});
var MergeEntrySchema = import_zod18.z.object({
  kind: import_zod18.z.enum(["to-file", "to-app", "conflict-app-wins", "kept-file-edit", "missing-from-file", "both-added"]),
  baseLine: import_zod18.z.number().int(),
  text: import_zod18.z.string()
});
var TaskRefSchema = import_zod18.z.object({
  /** Section key, e.g. `1.12`. */
  section: import_zod18.z.string(),
  title: import_zod18.z.string(),
  checked: import_zod18.z.boolean()
});
var RoadmapPullResultSchema = import_zod18.z.object({
  mode: import_zod18.z.enum(["adopt", "merge", "nothing"]),
  /** False for a dry run. */
  applied: import_zod18.z.boolean(),
  /** Master commit the pull read. */
  commit: import_zod18.z.string(),
  /** Whether the app's text changes (or changed). */
  appChanged: import_zod18.z.boolean(),
  /** The merge log: what was brought in, kept, flagged or decided in the app's favour. */
  log: import_zod18.z.array(MergeEntrySchema),
  /** First run only: tasks that exist only in the app, so would be replaced. Capped at 50. */
  appOnlyTasks: import_zod18.z.array(TaskRefSchema),
  appOnlyTaskCount: import_zod18.z.number().int().nonnegative(),
  /** First run only: tasks ticked in the app but not on master. Capped at 50. */
  ticksOnlyInApp: import_zod18.z.array(TaskRefSchema),
  ticksOnlyInAppCount: import_zod18.z.number().int().nonnegative(),
  /** Lines only in the app and only on master (first run). */
  appOnlyLines: import_zod18.z.number().int().nonnegative(),
  masterOnlyLines: import_zod18.z.number().int().nonnegative(),
  /** The snapshot of the app's previous text, when one was taken. */
  snapshotId: import_zod18.z.number().int().nullable(),
  /** The app's roadmap version after the pull. */
  appVersion: import_zod18.z.number().int().nonnegative()
});
var RoadmapPushRequestSchema = import_zod18.z.object({
  /** Show what would be sent and write nothing. */
  dryRun: import_zod18.z.boolean().optional()
});
var RoadmapPushResultSchema = import_zod18.z.object({
  mode: import_zod18.z.enum(["push", "nothing"]),
  /** False for a dry run. */
  applied: import_zod18.z.boolean(),
  /** Master commit the push was built on. */
  commit: import_zod18.z.string(),
  /** The app's edits being sent (the merge log's `to-file` entries). */
  edits: import_zod18.z.array(MergeEntrySchema),
  /** A short `+`/`-` preview of master against the new file, capped. */
  diffPreview: import_zod18.z.array(import_zod18.z.string()),
  /** The pull request opened or updated; null for a dry run or when there was nothing to push. */
  prNumber: import_zod18.z.number().int().nullable(),
  prUrl: import_zod18.z.string().nullable()
});

// src/roadmap-inbox.schema.ts
var import_zod19 = require("zod");
var RoadmapInboxItemSchema = import_zod19.z.object({
  id: import_zod19.z.number().int(),
  issueNumber: import_zod19.z.number().int(),
  title: import_zod19.z.string(),
  body: import_zod19.z.string(),
  /** Idea, Task or Fix when the issue says so; otherwise null. */
  kind: import_zod19.z.string().nullable(),
  url: import_zod19.z.string(),
  status: import_zod19.z.enum(["new", "promoted", "dismissed"]),
  issueCreatedAt: import_zod19.z.iso.datetime(),
  handledAt: import_zod19.z.iso.datetime().nullable(),
  handledBy: import_zod19.z.string().nullable()
});
var RoadmapInboxSchema = import_zod19.z.object({
  items: import_zod19.z.array(RoadmapInboxItemSchema),
  /** False when no GitHub token is set, so nothing can be fetched. */
  configured: import_zod19.z.boolean()
});
var RoadmapInboxRefreshSchema = import_zod19.z.object({
  added: import_zod19.z.number().int().nonnegative(),
  /** Items that were new here but have since been closed on GitHub, now marked dismissed. */
  closedOnGithub: import_zod19.z.number().int().nonnegative()
});
var RoadmapInboxPromoteSchema = import_zod19.z.object({
  sectionLine: import_zod19.z.number().int().nonnegative(),
  text: import_zod19.z.string().trim().min(1).max(500).refine((t) => !/[\r\n]/.test(t), "Task text must be one line"),
  version: import_zod19.z.number().int().nonnegative()
});

// src/roadmap-sync.ts
function absorbFile(base, file) {
  return mergeRoadmap(base, file, base).forApp;
}
var keyOf = (text4) => text4.toLowerCase().replace(/[^a-z0-9]/g, "");
var HEAD = 48;
var MIN_HEAD = 24;
function flatten(tasks, into) {
  for (const task of tasks) {
    into.push({ text: task.text, checked: task.checked });
    flatten(task.children, into);
  }
}
function tasksBySection(markdown) {
  const out = /* @__PURE__ */ new Map();
  for (const section of parseRoadmap(markdown)) {
    const list2 = out.get(section.key) ?? [];
    flatten(section.tasks, list2);
    out.set(section.key, list2);
  }
  return out;
}
function findAppOnlyTasks(app, master) {
  const mine = tasksBySection(app);
  const theirs = tasksBySection(master);
  const result = { appOnly: [], ticksOnlyInApp: [] };
  for (const [section, tasks] of mine) {
    const remote = theirs.get(section) ?? [];
    const full = /* @__PURE__ */ new Map();
    const head = /* @__PURE__ */ new Map();
    for (const task of remote) {
      const key = keyOf(task.text);
      if (!full.has(key)) full.set(key, task);
      if (key.length >= MIN_HEAD && !head.has(key.slice(0, HEAD))) head.set(key.slice(0, HEAD), task);
    }
    for (const task of tasks) {
      const key = keyOf(task.text);
      const match = full.get(key) ?? (key.length >= MIN_HEAD ? head.get(key.slice(0, HEAD)) : void 0);
      if (!match) result.appOnly.push({ section, title: task.text, checked: task.checked });
      else if (task.checked && !match.checked) result.ticksOnlyInApp.push({ section, title: task.text, checked: true });
    }
  }
  return result;
}

// src/roadmap-scope.schema.ts
var import_zod20 = require("zod");
var ROADMAP_SCOPE_FILES = [
  { key: "features", path: "docs/roadmap/features.md", required: true },
  { key: "fixes", path: "docs/roadmap/fixes.md", required: true },
  { key: "ops", path: "docs/roadmap/ops.md", required: true },
  { key: "decisions", path: "docs/roadmap/decisions.md", required: true },
  { key: "now", path: "docs/NOW.md", required: false }
];
var RoadmapScopeKeySchema = import_zod20.z.enum(["features", "fixes", "ops"]);
var RoadmapScopeTaskSchema = import_zod20.z.object({
  checked: import_zod20.z.boolean(),
  text: import_zod20.z.string(),
  /** 0 for a top-level subtask, 1 for one nested under it, and so on. */
  depth: import_zod20.z.number().int().nonnegative()
});
var RoadmapScopeItemSchema = import_zod20.z.object({
  id: import_zod20.z.string(),
  scope: RoadmapScopeKeySchema,
  title: import_zod20.z.string(),
  priority: import_zod20.z.enum(["P0", "P1", "P2", "P3"]),
  effort: import_zod20.z.enum(["S", "M", "L", "XL"]),
  status: import_zod20.z.enum(["idea", "planned", "next", "doing", "done", "dropped"]),
  after: import_zod20.z.array(import_zod20.z.string()),
  flags: import_zod20.z.array(import_zod20.z.string()),
  /** Commit the evidence was last checked at, null when never verified. */
  verified: import_zod20.z.string().nullable(),
  /** Number in an older numbering, for example `1.8`. */
  was: import_zod20.z.string().nullable(),
  evidence: import_zod20.z.array(import_zod20.z.string()),
  spec: import_zod20.z.string().nullable(),
  deadline: import_zod20.z.string().nullable(),
  /** Prose lines of the block that are not metadata or subtasks. */
  body: import_zod20.z.string(),
  tasks: import_zod20.z.array(RoadmapScopeTaskSchema)
});
var RoadmapScopeDoneSchema = import_zod20.z.object({
  id: import_zod20.z.string(),
  scope: RoadmapScopeKeySchema,
  text: import_zod20.z.string()
});
var RoadmapScopeDecisionSchema = import_zod20.z.object({
  id: import_zod20.z.string(),
  /** Open decisions have a title; settled ones carry their whole line in `text`. */
  title: import_zod20.z.string(),
  settled: import_zod20.z.boolean(),
  default: import_zod20.z.string().nullable(),
  blocks: import_zod20.z.string().nullable(),
  text: import_zod20.z.string()
});
var RoadmapScopeViewSchema = import_zod20.z.object({
  items: import_zod20.z.array(RoadmapScopeItemSchema),
  done: import_zod20.z.array(RoadmapScopeDoneSchema),
  decisions: import_zod20.z.array(RoadmapScopeDecisionSchema),
  /** The generated "what next" page, verbatim, or null. */
  now: import_zod20.z.string().nullable()
});
var RoadmapScopeSchema = import_zod20.z.object({
  /** True when ROADMAP_SOURCE=scope on the API. */
  enabled: import_zod20.z.boolean(),
  /** True when a token is configured and a roadmap repository is named. */
  configured: import_zod20.z.boolean(),
  /** Nothing has been pulled yet. */
  empty: import_zod20.z.boolean(),
  repo: import_zod20.z.string().nullable(),
  branch: import_zod20.z.string().nullable(),
  commit: import_zod20.z.string().nullable(),
  version: import_zod20.z.number().int().nonnegative(),
  syncedAt: import_zod20.z.iso.datetime().nullable(),
  syncedBy: import_zod20.z.string().nullable(),
  view: RoadmapScopeViewSchema
});
var RoadmapScopeRefreshSchema = import_zod20.z.object({
  /** False when the repository already matched what is stored. */
  changed: import_zod20.z.boolean(),
  commit: import_zod20.z.string(),
  version: import_zod20.z.number().int().nonnegative(),
  items: import_zod20.z.number().int().nonnegative(),
  decisions: import_zod20.z.number().int().nonnegative()
});

// src/roadmap-scope.ts
var MARK = /^<!--roadmap-file:(.+)-->$/;
function bundleScopeFiles(files) {
  return files.map((f) => `<!--roadmap-file:${f.path}-->
${f.content.replace(/\r\n/g, "\n").replace(/\n*$/, "\n")}`).join("");
}
function splitScopeBundle(bundle) {
  const out = /* @__PURE__ */ new Map();
  let path = null;
  let buf = [];
  const flush = () => {
    if (path) out.set(path, buf.join("\n"));
  };
  for (const line of bundle.split("\n")) {
    const m = MARK.exec(line);
    if (m) {
      flush();
      path = m[1] ?? null;
      buf = [];
    } else buf.push(line);
  }
  flush();
  return out;
}
var META = /^`([^`]+)`(?: · verified `([^`]+)` \(([\d-]+)\))?/;
var TASK = /^(\s*)- \[( |x|X)\] (.*)$/;
var PRIORITY = /^P[0-3]$/;
var EFFORT = /^(S|M|L|XL)$/;
var STATUS = /^(idea|planned|next|doing|done|dropped)$/;
var field = (parts, name) => {
  const hit = parts.find((p) => p.startsWith(`${name}:`));
  const value = hit?.slice(name.length + 1).trim();
  return value && value !== "none" ? value : null;
};
var list = (value) => value ? value.split(/[,\s]+/).filter(Boolean) : [];
function parseScopeFile(scope, markdown) {
  const text4 = markdown.replace(/\r\n/g, "\n");
  const [open = "", doneText = ""] = text4.split(/^## Done\s*$/m);
  const items = [];
  for (const block of open.split(/^### /m).slice(1)) {
    const lines = block.split("\n");
    const head = /^([FBO]-\d+) · (.+)$/.exec(lines[0] ?? "");
    const metaLine = lines.find((l) => l.startsWith("`"));
    const meta = metaLine ? META.exec(metaLine) : null;
    if (!head || !meta) continue;
    const parts = (meta[1] ?? "").split(" \xB7 ").map((s) => s.trim());
    const [priority = "", effort = "", status = ""] = parts;
    if (!PRIORITY.test(priority) || !EFFORT.test(effort) || !STATUS.test(status)) continue;
    const tasks = [];
    const prose = [];
    for (const l of lines.slice(1)) {
      const t = TASK.exec(l);
      if (t) tasks.push({ checked: t[2] !== " ", text: t[3] ?? "", depth: Math.floor((t[1] ?? "").length / 2) });
      else if (l !== metaLine && !/^(Evidence|Was|Spec|Deadline|fp):/.test(l)) prose.push(l);
    }
    const line = (name) => lines.find((l) => l.startsWith(`${name}:`))?.slice(name.length + 1).trim() ?? null;
    items.push({
      id: head[1] ?? "",
      scope,
      title: head[2] ?? "",
      priority,
      effort,
      status,
      after: list(field(parts, "after")),
      flags: (field(parts, "flags") ?? "").split(",").map((f) => f.trim()).filter(Boolean),
      verified: meta[2] ?? null,
      was: line("Was"),
      evidence: [...(line("Evidence") ?? "").matchAll(/`([^`]+)`/g)].map((m) => m[1] ?? ""),
      spec: line("Spec")?.replace(/^`|`$/g, "") ?? null,
      deadline: line("Deadline"),
      body: prose.join("\n").trim(),
      tasks
    });
  }
  const done = doneText.split("\n").map((l) => /^- ([FBO]-\d+)\b\s*·?\s*(.*)$/.exec(l)).filter((m) => m !== null).map((m) => ({ id: m[1] ?? "", scope, text: m[2] ?? "" }));
  return { items, done };
}
function parseDecisions(markdown) {
  const text4 = markdown.replace(/\r\n/g, "\n");
  const [open = "", settled = ""] = text4.split(/^## Settled\s*$/m);
  const out = [];
  for (const block of open.split(/^### /m).slice(1)) {
    const head = /^(D-\d+) · (.+)$/m.exec(block);
    if (!head) continue;
    const grab = (name) => new RegExp(`${name}: ([^\\n]*?)(?:\\.(?=\\s|$)|$)`, "m").exec(block)?.[1]?.trim() ?? null;
    const title = head[2] ?? "";
    out.push({ id: head[1] ?? "", title, settled: false, default: grab("Default"), blocks: grab("Blocks"), text: title });
  }
  for (const l of settled.split("\n")) {
    const m = /^- (D-\d+) · (.*)$/.exec(l);
    if (!m) continue;
    const text5 = m[2] ?? "";
    out.push({ id: m[1] ?? "", title: text5.split(":")[0] ?? text5, settled: true, default: null, blocks: null, text: text5 });
  }
  return out;
}
var SCOPES = ["features", "fixes", "ops"];
function parseScopeBundle(bundle) {
  const files = splitScopeBundle(bundle);
  const path = (key) => ROADMAP_SCOPE_FILES.find((f) => f.key === key)?.path ?? "";
  const items = [];
  const done = [];
  for (const scope of SCOPES) {
    const parsed = parseScopeFile(scope, files.get(path(scope)) ?? "");
    items.push(...parsed.items);
    done.push(...parsed.done);
  }
  return {
    items,
    done,
    decisions: parseDecisions(files.get(path("decisions")) ?? ""),
    now: files.get(path("now")) ?? null
  };
}
var EMPTY_SCOPE_VIEW = { items: [], done: [], decisions: [], now: null };

// src/roadmap-queue.schema.ts
var import_zod21 = require("zod");
var RoadmapQueueSourceSchema = import_zod21.z.enum(["phone", "web"]);
var ROADMAP_QUEUE_MAX_TEXT = 500;
var RoadmapQueueRequestSchema = import_zod21.z.object({
  text: import_zod21.z.string().trim().min(1, "Note is required").max(ROADMAP_QUEUE_MAX_TEXT * 2)
});
var RoadmapQueueEntrySchema = import_zod21.z.object({
  id: import_zod21.z.number().int().positive(),
  text: import_zod21.z.string(),
  source: RoadmapQueueSourceSchema,
  /** `new` until a laptop session has filed it into docs/INBOX.md, then `filed`. */
  status: import_zod21.z.enum(["new", "filed"]),
  /** The INBOX line this note becomes: `- YYYY-MM-DD (source): text`. */
  line: import_zod21.z.string(),
  createdAt: import_zod21.z.iso.datetime(),
  filedAt: import_zod21.z.iso.datetime().nullable()
});
var RoadmapQueueListSchema = import_zod21.z.object({
  entries: import_zod21.z.array(RoadmapQueueEntrySchema)
});
var RoadmapQueueAppendedSchema = import_zod21.z.object({
  id: import_zod21.z.number().int().positive(),
  line: import_zod21.z.string()
});
var RoadmapQueueFiledRequestSchema = import_zod21.z.object({
  ids: import_zod21.z.array(import_zod21.z.number().int().positive()).min(1).max(200)
});
var RoadmapQueueFiledResultSchema = import_zod21.z.object({
  filed: import_zod21.z.number().int().nonnegative()
});

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
  const text4 = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text4);
  if (!match) return { data: {}, rest: text4 };
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
  return { data, rest: text4.slice(match[0].length) };
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

// src/stocktake.ts
function computeVariance(qtyCalculated, countedNormal, countedCustomer, counted) {
  if (!counted) return null;
  return qtyCalculated - ((countedNormal ?? 0) + (countedCustomer ?? 0));
}
function totalCounted(countedNormal, countedCustomer) {
  return (countedNormal ?? 0) + (countedCustomer ?? 0);
}
function parseTsv(text4) {
  const rows = [];
  let row = [];
  let cell2 = "";
  let quoted = false;
  const src = text4.replace(/\r\n?/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell2 += '"';
          i++;
        } else quoted = false;
      } else cell2 += ch;
    } else if (ch === '"' && cell2 === "") quoted = true;
    else if (ch === "	") {
      row.push(cell2);
      cell2 = "";
    } else if (ch === "\n") {
      row.push(cell2);
      cell2 = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cell2 += ch;
  }
  row.push(cell2);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}
function parseQuantity(raw) {
  if (raw === void 0) return null;
  const cleaned = raw.trim().replace(/[,\s]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
function headerIndex(header) {
  const map = /* @__PURE__ */ new Map();
  header.forEach((h, i) => {
    const key = h.trim().toLowerCase();
    if (key && !map.has(key)) map.set(key, i);
  });
  return map;
}
function parseJournalPaste(text4) {
  const table = parseTsv(text4);
  const issues = [];
  if (table.length === 0) return { rows: [], issues: [{ row: 0, message: "Nothing to import." }] };
  const idx = headerIndex(table[0] ?? []);
  const col = (name) => idx.get(name.toLowerCase());
  const missing = ["Item No.", "Location Code", "Qty. (Calculated)"].filter((h) => col(h) === void 0);
  if (missing.length > 0) {
    return { rows: [], issues: [{ row: 1, message: `Missing column(s): ${missing.join(", ")}.` }] };
  }
  const cell2 = (r, name) => {
    const i = col(name);
    return i === void 0 ? "" : (r[i] ?? "").trim();
  };
  const rows = [];
  const seen = /* @__PURE__ */ new Set();
  table.slice(1).forEach((r, n) => {
    const rowNo = n + 2;
    const itemNo = cell2(r, "Item No.");
    const locationCode = cell2(r, "Location Code");
    const qty = parseQuantity(cell2(r, "Qty. (Calculated)"));
    if (!itemNo) return issues.push({ row: rowNo, message: "Item No. is blank." });
    if (!locationCode) return issues.push({ row: rowNo, message: `Item ${itemNo}: Location Code is blank.` });
    if (qty === null || !Number.isInteger(qty)) {
      return issues.push({ row: rowNo, message: `Item ${itemNo}: Qty. (Calculated) is not a whole number.` });
    }
    const key = `${itemNo}|${locationCode}`;
    if (seen.has(key)) return issues.push({ row: rowNo, message: `Item ${itemNo} at ${locationCode} appears twice.` });
    seen.add(key);
    rows.push({
      itemNo,
      description: cell2(r, "Description") || cell2(r, "ItemDescription"),
      locationCode,
      qtyCalculated: qty,
      batchName: cell2(r, "Batch Name") || null,
      documentNo: cell2(r, "Document No.") || null,
      entryType: cell2(r, "Entry Type") || null,
      unitAmount: parseQuantity(cell2(r, "Unit Amount")),
      unitCost: parseQuantity(cell2(r, "Unit Cost"))
    });
  });
  return { rows, issues };
}
function normalizeSerial(raw) {
  return raw.trim().toUpperCase().replace(/\s+/g, "").replace(/^(\d+)\.0+$/, "$1");
}
function splitSerials(text4) {
  return text4.split(/[,;\t\n\r]+/).map(normalizeSerial).filter((s) => s !== "" && s !== "N/A" && s !== "NA" && s !== "-");
}
function duplicatesOf(list2) {
  const seen = /* @__PURE__ */ new Set();
  const dup = /* @__PURE__ */ new Set();
  for (const s of list2) (seen.has(s) ? dup : seen).add(s);
  return [...dup].sort();
}
function compareSerials(expectedRaw, foundRaw) {
  const expected = expectedRaw.map(normalizeSerial).filter(Boolean);
  const found = foundRaw.map(normalizeSerial).filter(Boolean);
  const exp = new Set(expected);
  const fnd = new Set(found);
  return {
    matched: [...fnd].filter((s) => exp.has(s)).sort(),
    missing: [...exp].filter((s) => !fnd.has(s)).sort(),
    unexpected: [...fnd].filter((s) => !exp.has(s)).sort(),
    duplicatesFound: duplicatesOf(found),
    duplicatesExpected: duplicatesOf(expected)
  };
}
function parseTrackingPaste(text4) {
  const table = parseTsv(text4);
  const issues = [];
  if (table.length === 0) return { entries: [], issues: [{ row: 0, message: "Nothing to import." }] };
  const idx = headerIndex(table[0] ?? []);
  const need = ["Item No.", "Location Code", "Serial No.", "Remaining Quantity"];
  const missing = need.filter((h) => !idx.has(h.toLowerCase()));
  if (missing.length > 0) {
    return { entries: [], issues: [{ row: 1, message: `Missing column(s): ${missing.join(", ")}.` }] };
  }
  const get = (r, h) => (r[idx.get(h.toLowerCase()) ?? -1] ?? "").trim();
  const entries = [];
  table.slice(1).forEach((r, n) => {
    const remaining = parseQuantity(get(r, "Remaining Quantity"));
    const itemNo = get(r, "Item No.");
    if (!itemNo) return issues.push({ row: n + 2, message: "Item No. is blank." });
    if (remaining === null) return issues.push({ row: n + 2, message: `Item ${itemNo}: Remaining Quantity is not a number.` });
    entries.push({
      itemNo,
      locationCode: get(r, "Location Code"),
      // A blank serial is kept as an empty string; it is a recorded fact, not a reason to drop the row.
      serialNo: normalizeSerial(get(r, "Serial No.")),
      remainingQuantity: remaining,
      entryNo: idx.has("entry no.") ? get(r, "Entry No.") || null : null
    });
  });
  return { entries, issues };
}
function onHandSerials(entries, itemNo, locationCode) {
  return entries.filter((e) => e.itemNo === itemNo && e.locationCode === locationCode && e.remainingQuantity > 0 && e.serialNo !== "").map((e) => e.serialNo);
}
function parseWeightGrams(description) {
  const d = description.toLowerCase();
  const frac = d.match(/(\d+)\s*\/\s*(\d+)\s*oz/);
  if (frac) return Number(frac[1]) / Number(frac[2]) * GRAMS_PER_TROY_OUNCE;
  const m = d.match(/(\d+(?:\.\d+)?)\s*(kg|g|oz)\b/);
  if (!m) return null;
  const n = Number(m[1]);
  if (m[2] === "kg") return n * 1e3;
  if (m[2] === "oz") return n * GRAMS_PER_TROY_OUNCE;
  return n;
}
function parseMetal(description) {
  const d = description.toLowerCase();
  const found = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"].filter((m) => d.split(/[^a-z]+/).includes(m.toLowerCase()));
  return found.length === 1 ? found[0] ?? null : null;
}
function suggestProductForBcItem(description, products) {
  const grams = parseWeightGrams(description);
  if (grams === null) return { status: "NONE" };
  const wantsBar = /\bbar\b/i.test(description);
  const wantsCoin = /\bcoin\b/i.test(description);
  const metal = parseMetal(description);
  const hits = products.filter((p) => {
    if (metal && p.metalType && p.metalType !== metal) return false;
    if (Math.abs(p.weight - grams) > Math.max(0.05, grams * 5e-3)) return false;
    if (wantsBar && p.category === "COIN") return false;
    if (wantsCoin && p.category === "BAR") return false;
    return true;
  });
  if (hits.length === 0) return { status: "NONE" };
  if (hits.length === 1) return { status: "SUGGESTED", productId: hits[0]?.id ?? 0 };
  const skip = /* @__PURE__ */ new Set(["mixed", "years", "year", "coin", "coins", "bars", "bar", "gold", "silver", "platinum", "palladium"]);
  const words2 = (s) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4 && !skip.has(w));
  const wanted = words2(description);
  const score = (p) => {
    const have = new Set(words2(p.name));
    return wanted.filter((w) => have.has(w)).length;
  };
  const best = Math.max(...hits.map(score));
  const narrowed = best > 0 ? hits.filter((p) => score(p) === best) : hits;
  if (narrowed.length === 1) return { status: "SUGGESTED", productId: narrowed[0]?.id ?? 0 };
  return { status: "AMBIGUOUS", productIds: narrowed.map((p) => p.id) };
}
function summarizeLines(lines) {
  let counted = 0;
  let withVariance = 0;
  let netVariance = 0;
  for (const l of lines) {
    const v = computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted);
    if (v === null) continue;
    counted++;
    if (v !== 0) withVariance++;
    netVariance += v;
  }
  return { lines: lines.length, counted, uncounted: lines.length - counted, withVariance, netVariance };
}
var JOURNAL_EXPORT_HEADERS = [
  "Batch Name",
  "Posting Date",
  "Entry Type",
  "Document No.",
  "Item No.",
  "Description",
  "Location Code",
  "Salespers./Purch. Code",
  "Qty. (Calculated)",
  "Quantity Counted (normal Safe)",
  "Quantity Counted (customer Safe with sale after 1 Sept)",
  "Variance",
  "Reason for Variance",
  "Serial Numbers Checked (if applicable) (Yes/No/N/A)",
  "Note any serial number discrepancies",
  "Qty. (Phys. Inventory)",
  "Quantity",
  "Unit Amount",
  "Amount",
  "Unit Cost",
  "Applies-to Entry",
  "ItemDescription"
];
var SERIALS_LABEL = { YES: "Yes", NO: "No", NA: "N/A" };
function buildJournalExportRows(lines, postingDate) {
  return lines.map((l) => {
    const variance = computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted);
    const phys = l.counted ? totalCounted(l.countedNormal, l.countedCustomer) : l.qtyCalculated;
    return [
      l.batchName ?? "",
      postingDate ?? "",
      l.entryType ?? "",
      l.documentNo ?? "",
      l.itemNo,
      l.description,
      l.locationCode,
      "",
      l.qtyCalculated,
      l.countedNormal ?? "",
      l.countedCustomer ?? "",
      variance ?? "",
      l.reason ?? "",
      l.serialsChecked ? SERIALS_LABEL[l.serialsChecked] : "",
      l.serialNote ?? "",
      phys,
      l.counted ? phys - l.qtyCalculated : "",
      l.unitAmount ?? "",
      "",
      l.unitCost ?? "",
      "",
      l.description
    ];
  });
}
var DISCREPANCY_ISSUE_TYPES = ["QUANTITY", "LOCATION", "SERIAL", "PAID_NOT_COLLECTED", "OTHER"];
var ISSUE_TYPE_LABELS = {
  QUANTITY: "Quantity",
  LOCATION: "Location",
  SERIAL: "Serial Number",
  PAID_NOT_COLLECTED: "Paid-but-not-collected",
  OTHER: "Other"
};
var REGISTER_EXPORT_HEADERS = [
  "Item No.",
  "Description",
  "Issue Type",
  "BC Shows",
  "Physical Count / Found",
  "Serial No.",
  "Action / Notes",
  "Resolved"
];
function buildRegisterExportRows(entries) {
  return entries.map((e) => [
    e.itemNo ?? "",
    e.description,
    ISSUE_TYPE_LABELS[e.issueType],
    e.bcShows,
    e.physicalFound,
    e.serialNo ?? "",
    e.action,
    e.resolved ? "Yes" : "No"
  ]);
}
function toCsv(headers, rows) {
  const esc = (v) => {
    let s = String(v);
    if (typeof v === "string" && /^[=+\-@]/.test(s) && Number.isNaN(Number(s))) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\r\n");
}

// src/stocktake.schema.ts
var import_zod22 = require("zod");

// src/stocktake-physical.ts
var STOCK_METALS = ["GOLD", "SILVER", "PGM"];
var BAR_STATUSES = ["UNCONFIRMED", "CONFIRMED", "NEW", "GONE"];
function indexOf(header) {
  const m = /* @__PURE__ */ new Map();
  header.forEach((h, i) => {
    const k = h.trim().toLowerCase();
    if (k && !m.has(k)) m.set(k, i);
  });
  return m;
}
var NO_VALUE = /* @__PURE__ */ new Set(["", "n/a", "na", "-", "none"]);
var clean = (v) => {
  const t = (v ?? "").trim();
  return NO_VALUE.has(t.toLowerCase()) ? null : t;
};
function parseBarsPaste(text4) {
  const table = parseTsv(text4);
  const issues = [];
  const header = table[0];
  if (!header) return { rows: [], issues: [{ row: 0, message: "Nothing to import." }] };
  const idx = indexOf(header);
  const weightCol = idx.get("weight") ?? idx.get("weight/product") ?? idx.get("product");
  if (weightCol === void 0 || !idx.has("branch")) {
    return { rows: [], issues: [{ row: 1, message: "Needs at least a Branch and a Weight column." }] };
  }
  const get = (r, name) => idx.has(name) ? r[idx.get(name) ?? -1] : void 0;
  const rows = [];
  table.slice(1).forEach((r, n) => {
    const branch = clean(get(r, "branch"));
    const weight = clean(r[weightCol]);
    if (!branch && !weight) return;
    if (!branch) return issues.push({ row: n + 2, message: "Branch is blank." });
    if (!weight) return issues.push({ row: n + 2, message: "Weight is blank." });
    let refinery = clean(get(r, "refinery"));
    let serialRaw = clean(get(r, "serial"));
    if (serialRaw && !refinery && serialRaw.includes(":")) {
      const [maker, ...rest] = serialRaw.split(":");
      refinery = clean(maker);
      serialRaw = clean(rest.join(":"));
    }
    const serial = serialRaw ? normalizeSerial(serialRaw) : null;
    rows.push({
      locationCode: branch.toUpperCase(),
      weightLabel: weight,
      refinery,
      serial: serial || null,
      grams: parseQuantity(get(r, "gram") ?? get(r, "grams")),
      details: clean(get(r, "details"))
    });
  });
  return { rows, issues };
}
function parseCoinsPaste(text4) {
  const table = parseTsv(text4);
  const issues = [];
  const header = table[0];
  if (!header) return { rows: [], issues: [{ row: 0, message: "Nothing to import." }] };
  const idx = indexOf(header);
  const itemCol = idx.get("item") ?? idx.get("product") ?? idx.get("weight");
  const qtyCol = idx.get("quantity") ?? idx.get("qty") ?? idx.get("oct") ?? idx.get("sept");
  if (itemCol === void 0 || qtyCol === void 0) {
    return { rows: [], issues: [{ row: 1, message: "Needs an Item column and a Quantity column." }] };
  }
  const branchCol = idx.get("branch");
  const seen = /* @__PURE__ */ new Set();
  const rows = [];
  table.slice(1).forEach((r, n) => {
    const item = (r[itemCol] ?? "").trim();
    if (!item) return;
    const qty = parseQuantity(r[qtyCol]);
    if (qty === null || !Number.isInteger(qty) || qty < 0) {
      return issues.push({ row: n + 2, message: `${item}: quantity is not a whole number.` });
    }
    const loc = branchCol === void 0 ? "" : (r[branchCol] ?? "").trim().toUpperCase();
    const key = `${loc}|${item.toLowerCase()}`;
    if (seen.has(key)) return issues.push({ row: n + 2, message: `${item} appears twice.` });
    seen.add(key);
    rows.push({ locationCode: loc, item, quantity: qty });
  });
  return { rows, issues };
}
function findDuplicateSerials(bars) {
  const by = /* @__PURE__ */ new Map();
  for (const b of bars) {
    if (!b.serial || b.status === "GONE") continue;
    by.set(b.serial, [...by.get(b.serial) ?? [], b.id]);
  }
  for (const [k, ids] of by) if (ids.length < 2) by.delete(k);
  return by;
}
function summarizeBars(bars) {
  const s = { total: 0, confirmed: 0, added: 0, gone: 0, unconfirmed: 0, withoutSerial: 0 };
  for (const b of bars) {
    if (b.status === "GONE") {
      s.gone++;
      continue;
    }
    s.total++;
    if (b.status === "CONFIRMED") s.confirmed++;
    else if (b.status === "NEW") s.added++;
    else s.unconfirmed++;
    if (!b.serial) s.withoutSerial++;
  }
  return s;
}
function isClosingBar(status) {
  return status === "CONFIRMED" || status === "NEW";
}
function planBarImport(existing, incoming) {
  const liveSerials = new Set(existing.filter((b) => b.serial && b.status !== "GONE").map((b) => b.serial));
  const key = (b) => `${b.locationCode}|${b.weightLabel.toLowerCase()}|${(b.refinery ?? "").toLowerCase()}`;
  const unnumbered = /* @__PURE__ */ new Map();
  for (const b of existing) {
    if (!b.serial && b.status !== "GONE") unnumbered.set(key(b), (unnumbered.get(key(b)) ?? 0) + 1);
  }
  const toAdd = [];
  let skipped = 0;
  for (const row of incoming) {
    if (row.serial) {
      if (liveSerials.has(row.serial)) {
        skipped++;
        continue;
      }
      liveSerials.add(row.serial);
      toAdd.push(row);
      continue;
    }
    const left = unnumbered.get(key(row)) ?? 0;
    if (left > 0) {
      unnumbered.set(key(row), left - 1);
      skipped++;
    } else toAdd.push(row);
  }
  return { toAdd, skipped };
}
var BAR_EXPORT_HEADERS = ["Metal", "Branch", "Weight", "Refinery", "Serial", "Gram", "Status", "Details"];
var BAR_STATUS_TEXT = {
  UNCONFIRMED: "Not seen",
  CONFIRMED: "Confirmed",
  NEW: "Found (new)",
  GONE: "Gone"
};
function buildBarExportRows(bars) {
  return bars.map((b) => [b.metal, b.locationCode, b.weightLabel, b.refinery ?? "", b.serial ?? "", b.grams ?? "", BAR_STATUS_TEXT[b.status], b.details ?? ""]);
}
var COIN_EXPORT_HEADERS = ["Metal", "Branch", "Item", "Last count", "Counted now", "Change", "Details"];
function buildCoinExportRows(coins) {
  return coins.map((c) => [
    c.metal,
    c.locationCode,
    c.item,
    c.previousQty ?? "",
    c.countedQty ?? "",
    c.previousQty !== null && c.countedQty !== null ? c.countedQty - c.previousQty : "",
    c.details ?? ""
  ]);
}

// src/stocktake.schema.ts
var StocktakeStatusEnum = import_zod22.z.enum(["DRAFT", "COUNTING", "RECONCILING", "FINALISED"]);
var DiscrepancyIssueTypeEnum = import_zod22.z.enum(DISCREPANCY_ISSUE_TYPES);
var SerialsCheckedEnum = import_zod22.z.enum(["YES", "NO", "NA"]);
var dateOnly = import_zod22.z.iso.date();
var CreateStocktakeRequestSchema = import_zod22.z.object({
  name: import_zod22.z.string().trim().min(1, "Name is required").max(120),
  /** The day stock was physically counted. */
  countDate: dateOnly,
  /** The month-end position the count is reconciled to (may differ from countDate). */
  cutoffDate: dateOnly,
  stocktakeLead: import_zod22.z.string().trim().max(120).optional(),
  secondChecker: import_zod22.z.string().trim().max(120).optional()
});
var UpdateStocktakeRequestSchema = import_zod22.z.object({
  status: StocktakeStatusEnum.optional(),
  stocktakeLead: import_zod22.z.string().trim().max(120).nullable().optional(),
  secondChecker: import_zod22.z.string().trim().max(120).nullable().optional(),
  notes: import_zod22.z.string().max(2e3).nullable().optional()
});
var ImportJournalRequestSchema = import_zod22.z.object({
  text: import_zod22.z.string().min(1).max(2e6)
});
var count = import_zod22.z.number().int().min(0).max(1e6);
var UpdateStocktakeLineRequestSchema = import_zod22.z.object({
  countedNormal: count.nullable().optional(),
  countedCustomer: count.nullable().optional(),
  counted: import_zod22.z.boolean().optional(),
  reason: import_zod22.z.string().max(1e3).nullable().optional(),
  serialsChecked: SerialsCheckedEnum.nullable().optional(),
  serialNote: import_zod22.z.string().max(2e3).nullable().optional()
});
var StocktakeLineSchema = import_zod22.z.object({
  id: import_zod22.z.number(),
  itemNo: import_zod22.z.string(),
  description: import_zod22.z.string(),
  locationCode: import_zod22.z.string(),
  qtyCalculated: import_zod22.z.number(),
  countedNormal: import_zod22.z.number().nullable(),
  countedCustomer: import_zod22.z.number().nullable(),
  counted: import_zod22.z.boolean(),
  /** Qty. (Calculated) minus the counts; null until the line is counted. */
  variance: import_zod22.z.number().nullable(),
  reason: import_zod22.z.string().nullable(),
  serialsChecked: SerialsCheckedEnum.nullable(),
  serialNote: import_zod22.z.string().nullable(),
  batchName: import_zod22.z.string().nullable(),
  documentNo: import_zod22.z.string().nullable(),
  entryType: import_zod22.z.string().nullable(),
  unitAmount: import_zod22.z.number().nullable(),
  unitCost: import_zod22.z.number().nullable()
});
var CreateDiscrepancyRequestSchema = import_zod22.z.object({
  itemNo: import_zod22.z.string().trim().max(40).nullable().optional(),
  description: import_zod22.z.string().trim().min(1).max(300),
  issueType: DiscrepancyIssueTypeEnum,
  bcShows: import_zod22.z.string().trim().max(500).default(""),
  physicalFound: import_zod22.z.string().trim().max(500).default(""),
  serialNo: import_zod22.z.string().trim().max(80).nullable().optional(),
  action: import_zod22.z.string().trim().max(2e3).default("")
});
var UpdateDiscrepancyRequestSchema = import_zod22.z.object({
  bcShows: import_zod22.z.string().trim().max(500).optional(),
  physicalFound: import_zod22.z.string().trim().max(500).optional(),
  serialNo: import_zod22.z.string().trim().max(80).nullable().optional(),
  action: import_zod22.z.string().trim().max(2e3).optional(),
  resolved: import_zod22.z.boolean().optional()
});
var DiscrepancySchema = import_zod22.z.object({
  id: import_zod22.z.number(),
  itemNo: import_zod22.z.string().nullable(),
  description: import_zod22.z.string(),
  issueType: DiscrepancyIssueTypeEnum,
  bcShows: import_zod22.z.string(),
  physicalFound: import_zod22.z.string(),
  serialNo: import_zod22.z.string().nullable(),
  action: import_zod22.z.string(),
  resolved: import_zod22.z.boolean(),
  createdBy: import_zod22.z.string()
});
var StocktakeSchema = import_zod22.z.object({
  id: import_zod22.z.number(),
  name: import_zod22.z.string(),
  countDate: dateOnly,
  cutoffDate: dateOnly,
  status: StocktakeStatusEnum,
  stocktakeLead: import_zod22.z.string().nullable(),
  secondChecker: import_zod22.z.string().nullable(),
  notes: import_zod22.z.string().nullable(),
  createdBy: import_zod22.z.string(),
  finalisedBy: import_zod22.z.string().nullable(),
  finalisedAt: import_zod22.z.iso.datetime().nullable(),
  createdAt: import_zod22.z.iso.datetime()
});
var StocktakeDetailSchema = StocktakeSchema.extend({
  lines: import_zod22.z.array(StocktakeLineSchema),
  discrepancies: import_zod22.z.array(DiscrepancySchema)
});
var ImportJournalResultSchema = import_zod22.z.object({
  added: import_zod22.z.number(),
  /** Already present for this stocktake: left untouched so an import can be repeated safely. */
  skippedExisting: import_zod22.z.number(),
  issues: import_zod22.z.array(import_zod22.z.object({ row: import_zod22.z.number(), message: import_zod22.z.string() }))
});
var BcItemSchema = import_zod22.z.object({
  itemNo: import_zod22.z.string(),
  description: import_zod22.z.string(),
  productId: import_zod22.z.number().nullable(),
  productName: import_zod22.z.string().nullable(),
  /** Weight-based hints for the person confirming the link. Never applied automatically. */
  suggestedProductIds: import_zod22.z.array(import_zod22.z.number())
});
var LinkBcItemRequestSchema = import_zod22.z.object({
  productId: import_zod22.z.number().int().positive().nullable()
});
var BcItemProductOptionSchema = import_zod22.z.object({
  id: import_zod22.z.number(),
  name: import_zod22.z.string(),
  /** Shown beside the name: several products share a name across metals (1oz Britannia in gold and silver). */
  metalType: import_zod22.z.enum(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]),
  category: import_zod22.z.enum(["BAR", "COIN"]).nullable()
});
var BcItemsResponseSchema = import_zod22.z.object({
  items: import_zod22.z.array(BcItemSchema),
  /** The products an item can be linked to (managers cannot read the admin product list). */
  products: import_zod22.z.array(BcItemProductOptionSchema)
});
var StockMetalEnum = import_zod22.z.enum(STOCK_METALS);
var BarStatusEnum = import_zod22.z.enum(BAR_STATUSES);
var StocktakeBarSchema = import_zod22.z.object({
  id: import_zod22.z.number(),
  metal: StockMetalEnum,
  locationCode: import_zod22.z.string(),
  weightLabel: import_zod22.z.string(),
  refinery: import_zod22.z.string().nullable(),
  serial: import_zod22.z.string().nullable(),
  grams: import_zod22.z.number().nullable(),
  details: import_zod22.z.string().nullable(),
  status: BarStatusEnum,
  /** The bar row in the earlier stocktake this one was carried from; null for bars found or pasted in. */
  carriedFromId: import_zod22.z.number().nullable(),
  /** Another live bar in this stocktake has the same serial. */
  duplicateSerial: import_zod22.z.boolean()
});
var AddBarRequestSchema = import_zod22.z.object({
  metal: StockMetalEnum,
  locationCode: import_zod22.z.string().trim().min(1).max(20),
  weightLabel: import_zod22.z.string().trim().min(1).max(80),
  refinery: import_zod22.z.string().trim().max(80).nullable().optional(),
  serial: import_zod22.z.string().trim().max(80).nullable().optional(),
  grams: import_zod22.z.number().positive().max(1e5).nullable().optional(),
  details: import_zod22.z.string().trim().max(500).nullable().optional()
});
var UpdateBarRequestSchema = import_zod22.z.object({
  status: BarStatusEnum.optional(),
  weightLabel: import_zod22.z.string().trim().min(1).max(80).optional(),
  refinery: import_zod22.z.string().trim().max(80).nullable().optional(),
  serial: import_zod22.z.string().trim().max(80).nullable().optional(),
  grams: import_zod22.z.number().positive().max(1e5).nullable().optional(),
  details: import_zod22.z.string().trim().max(500).nullable().optional()
});
var ImportPhysicalRequestSchema = import_zod22.z.object({
  metal: StockMetalEnum,
  text: import_zod22.z.string().min(1).max(2e6)
});
var ImportPhysicalResultSchema = import_zod22.z.object({
  added: import_zod22.z.number(),
  skipped: import_zod22.z.number(),
  issues: import_zod22.z.array(import_zod22.z.object({ row: import_zod22.z.number(), message: import_zod22.z.string() }))
});
var StocktakeCoinSchema = import_zod22.z.object({
  id: import_zod22.z.number(),
  metal: StockMetalEnum,
  locationCode: import_zod22.z.string(),
  item: import_zod22.z.string(),
  /** Last stocktake's counted quantity, for reference only. */
  previousQty: import_zod22.z.number().nullable(),
  countedQty: import_zod22.z.number().nullable(),
  details: import_zod22.z.string().nullable()
});
var AddCoinRequestSchema = import_zod22.z.object({
  metal: StockMetalEnum,
  locationCode: import_zod22.z.string().trim().max(20).default(""),
  item: import_zod22.z.string().trim().min(1).max(120)
});
var UpdateCoinRequestSchema = import_zod22.z.object({
  countedQty: import_zod22.z.number().int().min(0).max(1e7).nullable().optional(),
  details: import_zod22.z.string().trim().max(500).nullable().optional()
});
var PhysicalRegisterSchema = import_zod22.z.object({
  bars: import_zod22.z.array(StocktakeBarSchema),
  coins: import_zod22.z.array(StocktakeCoinSchema)
});
var CarryForwardRequestSchema = import_zod22.z.object({
  /** Defaults to the most recent finalised stocktake. */
  fromStocktakeId: import_zod22.z.number().int().positive().optional()
});
var CarryForwardResultSchema = import_zod22.z.object({
  fromStocktakeId: import_zod22.z.number(),
  fromName: import_zod22.z.string(),
  barsCarried: import_zod22.z.number(),
  barsAlreadyThere: import_zod22.z.number(),
  coinsCarried: import_zod22.z.number(),
  coinsAlreadyThere: import_zod22.z.number()
});

// src/customer-orders.ts
var CUSTOMER_ORDER_STATUSES = ["TO_ORDER", "ORDERED", "IN_TRANSIT", "DELIVERED", "BAGGED", "ALLOCATED", "COLLECTED"];
var CUSTOMER_ORDER_STATUS_LABELS = {
  TO_ORDER: "To order (pending supplier)",
  ORDERED: "Ordered",
  IN_TRANSIT: "In transit",
  DELIVERED: "Here, not bagged",
  BAGGED: "Bagged (customer safe)",
  ALLOCATED: "Allocated (customer safe)",
  COLLECTED: "Collected"
};
function isPhysicallyHere(status) {
  return status === "DELIVERED" || status === "BAGGED" || status === "ALLOCATED";
}
var EVIDENCE_KINDS = ["TRADESHEET_COLLECTED", "ZOHO_INVOICE", "SIGNED_INVOICE", "BC_RECORD", "STAFF_NOTE"];
var EVIDENCE_KIND_LABELS = {
  TRADESHEET_COLLECTED: "Tradesheet says collected",
  ZOHO_INVOICE: "Zoho invoice",
  SIGNED_INVOICE: "Signed invoice",
  BC_RECORD: "Business Central record",
  STAFF_NOTE: "Staff note"
};
function normalizeReference(raw) {
  return (raw ?? "").toUpperCase().replace(/\s+/g, "");
}
function normalizeClient(raw) {
  return (raw ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
var wordSet = (s) => new Set(s.split(" ").filter(Boolean));
function matchTradeLine(order, tradeLines) {
  const ref = normalizeReference(order.reference);
  if (!ref) return { status: "NONE" };
  const byRef = tradeLines.filter((t) => normalizeReference(t.reference) === ref);
  if (byRef.length === 0) return { status: "NONE" };
  const name = normalizeClient(order.client);
  const sameName = byRef.filter((t) => normalizeClient(t.client) === name);
  if (sameName.length === 1) return { status: "EXACT", line: sameName[0] };
  if (sameName.length > 1) return { status: "AMBIGUOUS", lines: sameName };
  if (byRef.length === 1) {
    const only = byRef[0];
    const a = wordSet(name);
    const shared = [...wordSet(normalizeClient(only.client))].filter((w) => a.has(w)).length;
    return {
      status: "REVIEW",
      line: only,
      reason: shared > 0 ? "Reference matches; the client name is spelled differently." : "Reference matches but the client name is different."
    };
  }
  return { status: "AMBIGUOUS", lines: byRef };
}
function parseSheetDate(raw) {
  const t = (raw ?? "").trim();
  if (!t) return null;
  if (/^\d{4,6}(\.0+)?$/.test(t)) {
    const n = Math.floor(Number(t));
    if (n < 3e4 || n > 8e4) return null;
    return new Date(Date.UTC(1899, 11, 30) + n * 864e5).toISOString().slice(0, 10);
  }
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0];
  const dmy = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (dmy) {
    const year = dmy[3].length === 2 ? 2e3 + Number(dmy[3]) : Number(dmy[3]);
    const d = new Date(Date.UTC(year, Number(dmy[2]) - 1, Number(dmy[1])));
    return d.getUTCDate() === Number(dmy[1]) ? d.toISOString().slice(0, 10) : null;
  }
  return null;
}
var STATUS_WORDS = {
  "to order": "TO_ORDER",
  "needs product": "TO_ORDER",
  "pending supplier": "TO_ORDER",
  ordered: "ORDERED",
  "in transit": "IN_TRANSIT",
  transit: "IN_TRANSIT",
  delivered: "DELIVERED",
  bagged: "BAGGED",
  collected: "COLLECTED"
};
var none = (v) => {
  const t = (v ?? "").trim();
  return ["", "n/a", "na", "-"].includes(t.toLowerCase()) ? null : t;
};
function parseCustomerOrdersPaste(text4, fallbackStatus) {
  const table = parseTsv(text4);
  const issues = [];
  const header = table[0];
  if (!header) return { rows: [], issues: [{ row: 0, message: "Nothing to import." }] };
  const idx = /* @__PURE__ */ new Map();
  header.forEach((h, i) => {
    const k = h.trim().toLowerCase();
    if (k && !idx.has(k)) idx.set(k, i);
  });
  const col = (...names) => names.map((n) => idx.get(n)).find((v) => v !== void 0);
  const c = {
    status: col("status", "orderstatus", "order status"),
    collection: col("collection status"),
    branch: col("branch"),
    date: col("date ordered", "date"),
    client: col("client"),
    ref: col("reference"),
    qty: col("qty", "quantity"),
    product: col("product"),
    refinery: col("refinery"),
    serials: col("serials", "serial"),
    order: col("order number"),
    notes: col("notes"),
    missing: col("missing?", "missing")
  };
  if (c.client === void 0 || c.qty === void 0 || c.product === void 0) {
    return { rows: [], issues: [{ row: 1, message: "Needs at least Client, QTY and Product columns." }] };
  }
  const get = (r, i) => i === void 0 ? void 0 : r[i];
  const rows = [];
  table.slice(1).forEach((r, n) => {
    const rowNo = n + 2;
    const client = none(get(r, c.client));
    const product = none(get(r, c.product));
    if (!client && !product) return;
    if (!client) return issues.push({ row: rowNo, message: "Client is blank." });
    if (!product) return issues.push({ row: rowNo, message: `${client}: product is blank.` });
    const qty = parseQuantity(get(r, c.qty));
    if (qty === null || !Number.isInteger(qty) || qty < 1) {
      return issues.push({ row: rowNo, message: `${client}: quantity is not a whole number above zero.` });
    }
    const branch = none(get(r, c.branch));
    if (!branch) return issues.push({ row: rowNo, message: `${client}: branch is blank.` });
    let status = fallbackStatus;
    const statusText = (get(r, c.status) ?? "").trim().toLowerCase();
    if (statusText) {
      status = STATUS_WORDS[statusText] ?? null;
      if (!status) return issues.push({ row: rowNo, message: `${client}: status "${statusText}" is not one the app knows.` });
    }
    if ((get(r, c.collection) ?? "").trim().toLowerCase() === "collected") status = "COLLECTED";
    if (!status) return issues.push({ row: rowNo, message: `${client}: no status on the row and none chosen.` });
    const serials = none(get(r, c.serials));
    const missingText = (get(r, c.missing) ?? "").trim().toLowerCase();
    rows.push({
      locationCode: branch.toUpperCase(),
      client,
      reference: none(get(r, c.ref)),
      supplierRef: none(get(r, c.order)),
      product,
      quantity: qty,
      refinery: none(get(r, c.refinery)),
      serials,
      status,
      orderedOn: parseSheetDate(get(r, c.date)),
      missing: ["yes", "y", "true", "1", "missing"].includes(missingText),
      notes: none(get(r, c.notes))
    });
  });
  return { rows, issues };
}
var STATUS_RANK = {
  TO_ORDER: 0,
  ORDERED: 1,
  IN_TRANSIT: 2,
  DELIVERED: 3,
  BAGGED: 4,
  ALLOCATED: 4,
  COLLECTED: 5
};
function customerOrderChanges(stored, row, options = {}) {
  const changes = {};
  if (STATUS_RANK[row.status] > STATUS_RANK[stored.status]) changes.status = row.status;
  if (options.fields === "statusOnly") {
    if (row.missing && !stored.missing) changes.missing = true;
    return changes;
  }
  for (const f of ["serials", "notes", "supplierRef", "refinery"]) {
    const next = row[f]?.trim();
    if (next && next !== (stored[f] ?? "").trim()) changes[f] = next;
  }
  if (row.orderedOn && row.orderedOn !== stored.orderedOn) changes.orderedOn = row.orderedOn;
  if (row.missing && !stored.missing) changes.missing = true;
  return changes;
}
function planCustomerOrderImport(existing, incoming, options = {}) {
  const key = (r) => [r.locationCode.toUpperCase(), normalizeClient(r.client), normalizeReference(r.reference), r.product.trim().toLowerCase(), r.quantity].join("|");
  const have = /* @__PURE__ */ new Map();
  for (const e of existing) have.set(key(e), [...have.get(key(e)) ?? [], e]);
  const toAdd = [];
  const toUpdate = [];
  const used = /* @__PURE__ */ new Set();
  let unchanged = 0;
  const apply = (stored, row) => {
    used.add(stored.id);
    const changes = customerOrderChanges(stored, row, options);
    if (Object.keys(changes).length > 0) toUpdate.push({ id: stored.id, changes });
    else unchanged++;
  };
  const leftover = [];
  for (const row of incoming) {
    const stored = have.get(key(row))?.shift();
    if (stored) apply(stored, row);
    else leftover.push(row);
  }
  const loose = (r) => [r.locationCode.toUpperCase(), normalizeReference(r.reference), r.product.trim().toLowerCase(), r.quantity].join("|");
  for (const row of leftover) {
    const stored = options.fields === "statusOnly" && normalizeReference(row.reference) ? existing.find((e) => !used.has(e.id) && loose(e) === loose(row)) : void 0;
    if (stored) apply(stored, row);
    else toAdd.push(row);
  }
  return { toAdd, toUpdate, unchanged };
}
function expectedCustomerStock(orders) {
  const by = /* @__PURE__ */ new Map();
  for (const o of orders) {
    if (!isPhysicallyHere(o.status)) continue;
    const key = `${o.locationCode.toUpperCase()}|${o.product.trim().toLowerCase()}`;
    const cur = by.get(key);
    if (cur) cur.quantity += o.quantity;
    else by.set(key, { locationCode: o.locationCode.toUpperCase(), product: o.product.trim(), quantity: o.quantity });
  }
  return [...by.values()].sort((a, b) => a.locationCode.localeCompare(b.locationCode) || a.product.localeCompare(b.product));
}
var stripHeader = (h) => h.trim().toLowerCase().replace(/[:?]+$/, "").trim();
function parseTradesheetPaste(text4) {
  const table = parseTsv(text4);
  const issues = [];
  const header = table[0];
  if (!header) return { lines: [], issues: [{ row: 0, message: "Nothing to import." }] };
  const idx = /* @__PURE__ */ new Map();
  header.forEach((h, i) => {
    const k = stripHeader(h);
    if (k && !idx.has(k)) idx.set(k, i);
  });
  const col = (...names) => names.map((n) => idx.get(n)).find((v) => v !== void 0);
  const c = {
    client: col("client"),
    ref: col("reference"),
    qty: col("qty", "quantity"),
    product: col("product", "order"),
    date: col("date", "received", "date received"),
    collected: col("collected")
  };
  if (c.client === void 0 || c.ref === void 0) {
    return { lines: [], issues: [{ row: 1, message: "Needs a Client column and a Reference column." }] };
  }
  const get = (r, i) => i === void 0 ? "" : (r[i] ?? "").trim();
  const lines = [];
  table.slice(1).forEach((r, n) => {
    const reference = get(r, c.ref);
    const client = get(r, c.client);
    if (!reference && !client) return;
    if (!reference) return;
    const qty = parseQuantity(get(r, c.qty));
    lines.push({
      row: n + 2,
      reference,
      client,
      quantity: qty !== null && Number.isInteger(qty) ? qty : null,
      product: get(r, c.product) || null,
      date: parseSheetDate(get(r, c.date)),
      collected: get(r, c.collected) || null
    });
  });
  return { lines, issues };
}
function linkOrdersToTradesheet(orders, lines) {
  return orders.map((o) => {
    const m = matchTradeLine({ reference: o.reference ?? "", client: o.client }, lines);
    if (m.status === "NONE") return { orderId: o.id, status: "NONE", line: null, candidates: [], notes: [], sheetSaysCollected: false };
    if (m.status === "AMBIGUOUS") {
      return { orderId: o.id, status: "AMBIGUOUS", line: null, candidates: m.lines, notes: ["The same reference is on several tradesheet lines."], sheetSaysCollected: false };
    }
    const notes = m.status === "REVIEW" ? [m.reason] : [];
    if (m.line.quantity !== null && m.line.quantity !== o.quantity) {
      notes.push(`Quantity differs: order ${o.quantity}, tradesheet ${m.line.quantity}.`);
    }
    return { orderId: o.id, status: m.status, line: m.line, candidates: [], notes, sheetSaysCollected: m.line.collected !== null };
  });
}

// src/customer-orders.schema.ts
var import_zod23 = require("zod");
var CustomerOrderStatusEnum = import_zod23.z.enum(CUSTOMER_ORDER_STATUSES);
var EvidenceKindEnum = import_zod23.z.enum(EVIDENCE_KINDS);
var dateOnly2 = import_zod23.z.iso.date();
var CustomerOrderEvidenceSchema = import_zod23.z.object({
  id: import_zod23.z.number(),
  kind: EvidenceKindEnum,
  reference: import_zod23.z.string().nullable(),
  note: import_zod23.z.string().nullable(),
  observedOn: dateOnly2.nullable(),
  recordedBy: import_zod23.z.string(),
  createdAt: import_zod23.z.iso.datetime()
});
var CustomerOrderSchema = import_zod23.z.object({
  id: import_zod23.z.number(),
  locationCode: import_zod23.z.string(),
  client: import_zod23.z.string(),
  /** The tradesheet reference as written, e.g. DU-G20261002. */
  reference: import_zod23.z.string().nullable(),
  /** The Business Central sales order, e.g. SOR-100014. */
  bcOrderNo: import_zod23.z.string().nullable(),
  /** The supplier order, e.g. StoneX #505097. */
  supplierRef: import_zod23.z.string().nullable(),
  metal: StockMetalEnum.nullable(),
  product: import_zod23.z.string(),
  /** Optional BC item number, entered by a person. */
  bcItemNo: import_zod23.z.string().nullable(),
  quantity: import_zod23.z.number(),
  refinery: import_zod23.z.string().nullable(),
  serials: import_zod23.z.string().nullable(),
  status: CustomerOrderStatusEnum,
  orderedOn: dateOnly2.nullable(),
  missing: import_zod23.z.boolean(),
  notes: import_zod23.z.string().nullable(),
  createdBy: import_zod23.z.string(),
  createdAt: import_zod23.z.iso.datetime(),
  updatedAt: import_zod23.z.iso.datetime(),
  evidence: import_zod23.z.array(CustomerOrderEvidenceSchema)
});
var text = (max) => import_zod23.z.string().trim().max(max);
var CreateCustomerOrderRequestSchema = import_zod23.z.object({
  locationCode: text(20).min(1),
  client: text(200).min(1),
  reference: text(60).nullable().optional(),
  bcOrderNo: text(40).nullable().optional(),
  supplierRef: text(80).nullable().optional(),
  metal: StockMetalEnum.nullable().optional(),
  product: text(200).min(1),
  bcItemNo: text(40).nullable().optional(),
  quantity: import_zod23.z.number().int().min(1).max(1e6),
  refinery: text(80).nullable().optional(),
  serials: text(2e3).nullable().optional(),
  status: CustomerOrderStatusEnum.default("ORDERED"),
  orderedOn: dateOnly2.nullable().optional(),
  notes: text(2e3).nullable().optional()
});
var UpdateCustomerOrderRequestSchema = import_zod23.z.object({
  locationCode: text(20).min(1).optional(),
  client: text(200).min(1).optional(),
  reference: text(60).nullable().optional(),
  bcOrderNo: text(40).nullable().optional(),
  supplierRef: text(80).nullable().optional(),
  metal: StockMetalEnum.nullable().optional(),
  product: text(200).min(1).optional(),
  bcItemNo: text(40).nullable().optional(),
  quantity: import_zod23.z.number().int().min(1).max(1e6).optional(),
  refinery: text(80).nullable().optional(),
  serials: text(2e3).nullable().optional(),
  status: CustomerOrderStatusEnum.optional(),
  orderedOn: dateOnly2.nullable().optional(),
  missing: import_zod23.z.boolean().optional(),
  notes: text(2e3).nullable().optional()
});
var AddEvidenceRequestSchema = import_zod23.z.object({
  kind: EvidenceKindEnum,
  reference: text(200).nullable().optional(),
  note: text(2e3).nullable().optional(),
  observedOn: dateOnly2.nullable().optional()
});
var ImportCustomerOrdersRequestSchema = import_zod23.z.object({
  metal: StockMetalEnum,
  /** Used for rows that carry no status of their own (for example the Not bagged sheet). */
  fallbackStatus: CustomerOrderStatusEnum.nullable().optional(),
  text: import_zod23.z.string().min(1).max(2e6)
});
var ImportCustomerOrdersResultSchema = import_zod23.z.object({
  added: import_zod23.z.number(),
  updated: import_zod23.z.number(),
  unchanged: import_zod23.z.number(),
  issues: import_zod23.z.array(import_zod23.z.object({ row: import_zod23.z.number(), message: import_zod23.z.string() }))
});
var ExpectedCustomerStockSchema = import_zod23.z.array(
  import_zod23.z.object({ locationCode: import_zod23.z.string(), product: import_zod23.z.string(), quantity: import_zod23.z.number() })
);

// src/orders.ts
var ORDER_LIFECYCLE = ["QUOTE", "PAID", "ORDERED", "ARRIVED", "ALLOCATED", "MATCHED", "COLLECTED", "POSTED"];
var ORDER_LIFECYCLE_LABELS = {
  QUOTE: "Quote",
  PAID: "Paid",
  ORDERED: "Ordered",
  ARRIVED: "Arrived",
  ALLOCATED: "Allocated",
  MATCHED: "Matched",
  COLLECTED: "Collected",
  POSTED: "Posted in BC"
};
var ORDER_STEPS = ["ORDERED", "ARRIVED", "ALLOCATED", "MATCHED", "COLLECTED", "POSTED"];
var rank = (l) => ORDER_LIFECYCLE.indexOf(l);
function orderSource(f) {
  if (f.cptyKind === "DEFERRED") return "NEEDS_ORDER";
  if (f.hasLot || f.cptyKind === "LOT_REF") return "STOCK";
  if (f.supplierInvoice || f.cptyKind === "SUPPLIER_INVOICE" || f.steps.includes("ORDERED")) return "SUPPLIER";
  if (f.steps.includes("ALLOCATED")) return "STOCK";
  return "UNDECIDED";
}
function orderLifecycle(f) {
  if (f.cptyKind === "QUOTE_ONLY") return "QUOTE";
  let best = "PAID";
  const reach = (l) => {
    if (rank(l) > rank(best)) best = l;
  };
  if (f.supplierInvoice || f.cptyKind === "SUPPLIER_INVOICE" || f.steps.includes("ORDERED")) reach("ORDERED");
  if (f.steps.includes("ARRIVED")) reach("ARRIVED");
  if (f.steps.includes("ALLOCATED")) reach("ALLOCATED");
  if (f.hasLot || f.steps.includes("MATCHED")) reach("MATCHED");
  if (f.collected || f.steps.includes("COLLECTED")) reach("COLLECTED");
  const collected = best === "COLLECTED";
  if (f.steps.includes("POSTED") || collected && f.bcOpen === false) reach("POSTED");
  return best;
}
function deriveOrder(f) {
  const lifecycle = orderLifecycle(f);
  const source = orderSource(f);
  const q = [];
  if (f.cptyKind === "DEFERRED") q.push("defer");
  else if (lifecycle === "QUOTE") q.push("quote");
  else {
    if (lifecycle === "PAID" && source === "NEEDS_ORDER") q.push("order");
    if (lifecycle === "ORDERED") q.push("arrive");
    if (lifecycle === "ARRIVED" || lifecycle === "PAID" && source !== "NEEDS_ORDER") q.push("alloc");
    const noLine = !f.hasLot && source !== "SUPPLIER" && (f.cptyKind === "HEDGED" || f.cptyKind === "EMPTY");
    if (noLine && rank(lifecycle) >= rank("PAID") && rank(lifecycle) <= rank("ALLOCATED")) q.push("pline");
    if (lifecycle === "COLLECTED" && f.bcOpen === true) q.push("nopost");
    if ((lifecycle === "COLLECTED" || lifecycle === "POSTED") && !f.collected) q.push("tsmark");
    if (f.bcAnomaly) q.push("bcanom");
    if (f.lotOverAllocated) q.push("over");
  }
  return { lifecycle, source, queues: q };
}
function isOpenOrder(d, bcOpen) {
  switch (d.lifecycle) {
    case "QUOTE":
      return false;
    case "COLLECTED":
      return bcOpen === true || d.queues.length > 0;
    case "POSTED":
      return d.queues.includes("tsmark");
    default:
      return true;
  }
}
function nextAction(lifecycle, source, queues) {
  if (queues.includes("defer")) return { code: "DEFERRED", label: "Open the rows named in the notes and track those", who: "manager", step: null };
  switch (lifecycle) {
    case "QUOTE":
      return { code: "NONE", label: "Nothing: a quote reserves no stock", who: null, step: null };
    case "PAID":
      if (source === "NEEDS_ORDER") return { code: "ORDER", label: "Order the whole order from the supplier", who: "manager", step: "ORDERED" };
      return { code: "ALLOCATE_OR_ORDER", label: "Check stock: allocate it, or order the whole order", who: "broker", step: "ALLOCATED" };
    case "ORDERED":
      return { code: "ARRIVE", label: "Mark arrived when the delivery is here", who: "manager", step: "ARRIVED" };
    case "ARRIVED":
      return { code: "ALLOCATE", label: "Allocate it", who: "broker", step: "ALLOCATED" };
    case "ALLOCATED":
      if (source === "SUPPLIER") return { code: "READY", label: "Ready for collection", who: null, step: null };
      return { code: "MATCH", label: "Find the P-line, then write it in CPTY", who: "broker", step: "MATCHED" };
    case "MATCHED":
      return { code: "COLLECT", label: "Ready for collection", who: "manager", step: "COLLECTED" };
    case "COLLECTED":
      if (queues.includes("tsmark")) return { code: "TICK", label: "Tick Collected on the tradesheet", who: "manager", step: null };
      return { code: "POST", label: "Post, Ship and Invoice in BC", who: "manager", step: "POSTED" };
    case "POSTED":
      if (queues.includes("tsmark")) return { code: "TICK", label: "Tick Collected on the tradesheet", who: "manager", step: null };
      return { code: "DONE", label: "Done", who: null, step: null };
  }
}
function allowedSteps(lifecycle, source) {
  switch (lifecycle) {
    case "PAID":
      return source === "NEEDS_ORDER" ? ["ORDERED"] : ["ALLOCATED", "ORDERED"];
    case "ORDERED":
      return ["ARRIVED"];
    case "ARRIVED":
      return ["ALLOCATED"];
    case "ALLOCATED":
      return source === "SUPPLIER" ? ["COLLECTED"] : ["MATCHED", "COLLECTED"];
    case "MATCHED":
      return ["COLLECTED"];
    case "COLLECTED":
      return ["POSTED"];
    default:
      return [];
  }
}
var STEP_ROLE = {
  ORDERED: "manager",
  ARRIVED: "manager",
  ALLOCATED: "broker",
  MATCHED: "broker",
  COLLECTED: "manager",
  POSTED: "manager"
};
var SHEETS = ["Tradesheet", "Purchase tab", "Stock sheet", "Customer safe sheet"];
function customerSafeRow(c) {
  return ["Allocated", "DU", c.date ?? "", c.client, c.reference, c.qty ?? "", c.product, c.refinery ?? "", (c.serials ?? []).join(", ")].join("	");
}
function sheetTasksForStep(step, c) {
  switch (step) {
    case "ORDERED":
      return [{ sheet: "Tradesheet", what: "Put the supplier invoice in CPTY", value: c.supplierInvoice ?? "The supplier invoice number", check: "TRADE_CPTY" }];
    case "ALLOCATED": {
      const t = [];
      if (c.stockChange) t.push({ sheet: "Stock sheet", what: "Change the stock sheet", value: c.stockChange, check: "MANUAL" });
      t.push({ sheet: "Customer safe sheet", what: "Add the customer safe row", value: customerSafeRow(c), check: "MANUAL" });
      return t;
    }
    case "MATCHED": {
      const t = [{ sheet: "Tradesheet", what: "Write the P-line in CPTY", value: c.pline ?? "The P-line reference", check: "TRADE_CPTY" }];
      if (c.soldComment) t.push({ sheet: "Purchase tab", what: "Type into that P-line\u2019s Comments", value: c.soldComment, check: "MANUAL" });
      return t;
    }
    case "COLLECTED":
      return [
        { sheet: "Tradesheet", what: "Tick Collected (C or the date)", value: "C", check: "TRADE_COLLECTED" },
        { sheet: "Customer safe sheet", what: "Set the status to Collected", value: "Collected", check: "MANUAL" }
      ];
    default:
      return [];
  }
}
function taskShowsDone(task, trade) {
  if (task.check === "TRADE_COLLECTED") return trade.collected;
  if (task.check === "TRADE_CPTY") {
    const have = (trade.cptyRaw ?? "").trim().toLowerCase();
    const want = task.value.trim().toLowerCase();
    return want.length > 0 && have.length > 0 && have.includes(want);
  }
  return false;
}
var CASH_AML_THRESHOLD = 1e4;
var isCashOverThreshold = (mode, amount) => mode.trim().toLowerCase() === "cash" && amount >= CASH_AML_THRESHOLD;

// src/orders.schema.ts
var import_zod24 = require("zod");
var OrderLifecycleEnum = import_zod24.z.enum(ORDER_LIFECYCLE);
var OrderStepEnum = import_zod24.z.enum(ORDER_STEPS);
var SheetNameEnum = import_zod24.z.enum(SHEETS);
var OrderSourceEnum = import_zod24.z.enum(["STOCK", "SUPPLIER", "UNDECIDED", "NEEDS_ORDER"]);
var OrderQueueEnum = import_zod24.z.enum(["order", "arrive", "alloc", "pline", "nopost", "tsmark", "bcanom", "over", "defer", "quote"]);
var TaskCheckEnum = import_zod24.z.enum(["TRADE_COLLECTED", "TRADE_CPTY", "MANUAL"]);
var dateOnly3 = import_zod24.z.iso.date();
var SheetTaskSchema = import_zod24.z.object({
  id: import_zod24.z.number(),
  tradeId: import_zod24.z.number().nullable(),
  reference: import_zod24.z.string(),
  client: import_zod24.z.string(),
  sheet: SheetNameEnum,
  what: import_zod24.z.string(),
  value: import_zod24.z.string(),
  check: TaskCheckEnum,
  status: import_zod24.z.enum(["OPEN", "DONE"]),
  createdAt: import_zod24.z.iso.datetime(),
  createdBy: import_zod24.z.string(),
  closedAt: import_zod24.z.iso.datetime().nullable(),
  closedBy: import_zod24.z.string().nullable(),
  closedVia: import_zod24.z.enum(["MANUAL", "IMPORT"]).nullable()
});
var OrderEventSchema = import_zod24.z.object({
  id: import_zod24.z.number(),
  step: OrderStepEnum,
  by: import_zod24.z.string(),
  at: import_zod24.z.iso.datetime(),
  note: import_zod24.z.string().nullable()
});
var OrderRowSchema = import_zod24.z.object({
  id: import_zod24.z.number(),
  reference: import_zod24.z.string(),
  client: import_zod24.z.string(),
  branchCode: import_zod24.z.string().nullable(),
  metal: import_zod24.z.string(),
  qty: import_zod24.z.number().nullable(),
  product: import_zod24.z.string(),
  date: dateOnly3.nullable(),
  amount: import_zod24.z.number().nullable(),
  cpty: import_zod24.z.string().nullable(),
  supplierInvoice: import_zod24.z.string().nullable(),
  lifecycle: OrderLifecycleEnum,
  source: OrderSourceEnum,
  queues: import_zod24.z.array(OrderQueueEnum),
  nextAction: import_zod24.z.object({ code: import_zod24.z.string(), label: import_zod24.z.string(), who: import_zod24.z.enum(["broker", "manager"]).nullable(), step: OrderStepEnum.nullable() }),
  openTasks: import_zod24.z.number()
});
var OrderDetailSchema = OrderRowSchema.extend({
  events: import_zod24.z.array(OrderEventSchema),
  tasks: import_zod24.z.array(SheetTaskSchema),
  allowedSteps: import_zod24.z.array(OrderStepEnum),
  notes: import_zod24.z.string().nullable()
});
var OrderListQuerySchema = import_zod24.z.object({
  queue: import_zod24.z.union([OrderQueueEnum, import_zod24.z.literal("all")]).optional(),
  q: import_zod24.z.string().trim().max(80).optional(),
  branch: import_zod24.z.string().trim().max(8).optional()
});
var OrderListResponseSchema = import_zod24.z.object({
  rows: import_zod24.z.array(OrderRowSchema),
  /** Rows per queue across the whole open set, not just the filtered rows. */
  counts: import_zod24.z.record(import_zod24.z.string(), import_zod24.z.number()),
  openTasks: import_zod24.z.number(),
  asOf: import_zod24.z.iso.datetime()
});
var RecordStepRequestSchema = import_zod24.z.object({
  supplierInvoice: import_zod24.z.string().trim().max(60).optional(),
  pline: import_zod24.z.string().trim().max(40).optional(),
  soldComment: import_zod24.z.string().trim().max(60).optional(),
  serials: import_zod24.z.array(import_zod24.z.string().trim().max(40)).max(200).optional(),
  refinery: import_zod24.z.string().trim().max(60).optional(),
  stockChange: import_zod24.z.string().trim().max(200).optional(),
  note: import_zod24.z.string().trim().max(500).optional()
});
var SheetTaskListQuerySchema = import_zod24.z.object({ status: import_zod24.z.enum(["OPEN", "DONE"]).optional() });
var ReconcileResultSchema = import_zod24.z.object({ checked: import_zod24.z.number(), closed: import_zod24.z.number() });
var HandoverSchema = import_zod24.z.object({ id: import_zod24.z.number(), note: import_zod24.z.string(), by: import_zod24.z.string(), createdAt: import_zod24.z.iso.datetime() });
var LatestHandoverSchema = import_zod24.z.object({ handover: HandoverSchema.nullable() });
var SaveHandoverRequestSchema = import_zod24.z.object({ note: import_zod24.z.string().trim().min(1).max(2e3) });

// src/tradesheet-import.ts
var text2 = (v) => {
  if (v === null || v === void 0) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
};
function parseSheetNumber(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const t = text2(v).replace(/[£€$,\s]/g, "");
  if (!t || t === "-" || t.toLowerCase() === "n/a" || t.startsWith("#")) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
function toIsoDate(v) {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString().slice(0, 10);
  if (v === null || v === void 0 || v === "") return null;
  return parseSheetDate(String(v));
}
function fillKind(fill) {
  const f = (fill ?? "").replace("#", "").toUpperCase();
  const rgb = f.length === 8 ? f.slice(2) : f;
  if (rgb === "34A853") return "GREEN";
  if (rgb === "C9DAF8") return "BLUE";
  if (rgb === "FFE599") return "YELLOW";
  return "NONE";
}
function stripHeader2(h) {
  return text2(h).toLowerCase().replace(/[\s:?]+/g, "");
}
var SALE_FIELDS = [
  "branch",
  "initials",
  "client",
  "qty",
  "product",
  "date",
  "spot",
  "cpty",
  "cost",
  "receipt",
  "profit",
  "margin",
  "vatDue",
  "totalPrice",
  "aml",
  "paid",
  "ordered",
  "delivered",
  "collected",
  "notes",
  "netHedging",
  "boughtAt",
  "soldAt",
  "reference",
  "hedgingNotes"
];
var PURCHASE_FIELDS = [
  "branch",
  "initials",
  "client",
  "metal",
  "qty",
  "product",
  "spot",
  "received",
  "pricePaid",
  "pricePerItem",
  "datePaid",
  "hedgedAt",
  "melt",
  "comments",
  "reference"
];
var SALE_ALIASES = {
  branch: ["branch"],
  initials: ["initials"],
  client: ["client"],
  qty: ["qty", "quantity"],
  product: ["product", "order"],
  date: ["date"],
  spot: ["spot", "spotprice"],
  cpty: ["cpty"],
  cost: ["cost"],
  receipt: ["receipt"],
  profit: ["profit"],
  margin: ["margin"],
  vatDue: ["vatdue"],
  totalPrice: ["totalprice"],
  aml: ["aml"],
  paid: ["paid"],
  ordered: ["ordered"],
  delivered: ["delivered", "assigned"],
  collected: ["collected"],
  notes: ["notes"],
  netHedging: ["nethedging", "nethedgin"],
  boughtAt: ["bought@"],
  soldAt: ["sold@"],
  reference: ["reference", "ref"],
  hedgingNotes: ["hedgingnotes"]
};
var PURCHASE_ALIASES = {
  branch: ["branch"],
  initials: ["initials"],
  client: ["client"],
  metal: ["metal"],
  qty: ["qty", "quantity"],
  product: ["product"],
  spot: ["spot", "spotprice"],
  received: ["received", "datereceived"],
  pricePaid: ["pricepaid"],
  pricePerItem: ["price/item", "priceperitem"],
  datePaid: ["datepaid"],
  hedgedAt: ["hedgedat", "hedged"],
  melt: ["melt"],
  comments: ["comments"],
  reference: ["reference", "ref"]
};
function normaliseBackfillHeaders(headers) {
  const hits = headers.map((h, i) => stripHeader2(h) === "collected" ? i : -1).filter((i) => i !== -1);
  if (hits.length < 2) return headers;
  return headers.map((h, i) => i === hits[0] ? "Collected (flag)" : h);
}
function mapHeaders(headers, aliases) {
  const stripped = headers.map(stripHeader2);
  const map = {};
  for (const field2 of Object.keys(aliases)) {
    const index = stripped.findIndex((h) => h !== "" && aliases[field2].includes(h));
    if (index !== -1) map[field2] = index;
  }
  return map;
}
var mapSaleHeaders = (headers) => mapHeaders(headers, SALE_ALIASES);
var mapPurchaseHeaders = (headers) => mapHeaders(headers, PURCHASE_ALIASES);
function guessSheetMonthFromTabs(tabs, now = /* @__PURE__ */ new Date()) {
  const latestAllowed = new Date(now.getTime() + 31 * 864e5).toISOString().slice(0, 10);
  const earliestAllowed = "2020-01-01";
  let best = null;
  for (const tab of tabs) {
    const columns = [mapSaleHeaders(tab.headers).date, mapPurchaseHeaders(tab.headers).received].filter((c) => c !== void 0);
    if (columns.length === 0) continue;
    for (const row of tab.rows) {
      for (const column of columns) {
        const iso = toIsoDate(row.cells[column] ?? null);
        if (iso && iso >= earliestAllowed && iso <= latestAllowed && (best === null || iso > best)) best = iso;
      }
    }
  }
  return best ? best.slice(0, 7) : null;
}
function findHeaderRow(rows, kind, lookAhead = 5) {
  const limit = Math.min(rows.length, lookAhead);
  for (let i = 0; i < limit; i++) {
    const row = rows[i] ?? [];
    const map = kind === "sale" ? mapSaleHeaders(row) : mapPurchaseHeaders(row);
    if (map.reference !== void 0 && Object.keys(map).length >= 6) return i;
  }
  return -1;
}
function classifyTab(name, source = "TRADESHEET") {
  const n = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (source === "BACKFILL") {
    if (n === "rawg") return { kind: "IE_GOLD_SALES", skipReason: null };
    if (n === "rawgp") return { kind: "IE_GOLD_PURCHASES", skipReason: null };
    return { kind: null, skipReason: "A backfill file is read from its RawG and RawGP tabs only." };
  }
  if (n === "ie - gold") return { kind: "IE_GOLD_SALES", skipReason: null };
  if (n === "ie - silver") return { kind: "IE_SILVER_SALES", skipReason: null };
  if (n === "ie-gp" || n === "ie - gp" || n === "ie - purchases") return { kind: "IE_GOLD_PURCHASES", skipReason: null };
  if (n === "ie-sp" || n === "ie - sp") return { kind: "IE_SILVER_PURCHASES", skipReason: null };
  if (n === "bonded") return { kind: null, skipReason: "Bonded is modelled separately, later." };
  if (n.startsWith("es ")) return { kind: null, skipReason: "Spain tabs are imported later." };
  return { kind: null, skipReason: "Not a trade or purchase tab." };
}
var MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function guessSheetMonth(fileName) {
  const lower2 = fileName.toLowerCase();
  const year = /\b(20\d{2})\b/.exec(lower2)?.[1];
  if (!year) return null;
  const idx = MONTH_NAMES.findIndex((m) => new RegExp(`\\b${m}\\b|\\b${m.slice(0, 3)}\\b`).test(lower2));
  if (idx !== -1) return `${year}-${String(idx + 1).padStart(2, "0")}`;
  const numeric = /\b(20\d{2})[-_.](0[1-9]|1[0-2])\b/.exec(lower2);
  return numeric ? `${numeric[1]}-${numeric[2]}` : null;
}
var REFERENCE_RE = /^(?:([A-Z]{2})-?)?(GP|SP|G|S|P|B)-?(\d{4})(\d{2})(\d{1,4})$/;
function parseReference(raw) {
  const m = REFERENCE_RE.exec(normalizeReference(raw));
  if (!m) return null;
  const month = Number(m[4]);
  if (month < 1 || month > 12) return null;
  const type = m[2];
  return {
    branch: m[1] ?? null,
    type,
    role: type === "G" || type === "S" || type === "B" ? "SALE" : "PURCHASE",
    metal: type === "G" || type === "GP" ? "GOLD" : type === "S" || type === "SP" ? "SILVER" : null,
    year: Number(m[3]),
    month,
    counter: Number(m[5])
  };
}
function referenceMatchKey(raw) {
  return normalizeReference(raw).replace(/-/g, "");
}
function assignOccurrences(references) {
  const seen = /* @__PURE__ */ new Map();
  return references.map((r) => {
    const key = referenceMatchKey(r);
    if (!key) return 0;
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    return n;
  });
}
function classifyCpty(value) {
  const raw = text2(value);
  if (!raw) return { kind: "EMPTY", raw };
  const lower2 = raw.toLowerCase();
  if (/^quote\s*only\b/.test(lower2)) return { kind: "QUOTE_ONLY", raw };
  if (/^def+er+ed\b/.test(lower2)) return { kind: "DEFERRED", raw };
  if (/^hedged\b/.test(lower2)) return { kind: "HEDGED", raw };
  const ref = parseReference(raw);
  if (ref && ref.role === "PURCHASE") return { kind: "LOT_REF", raw, lotKey: referenceMatchKey(raw) };
  const supplier = /^([A-Za-z][A-Za-z. ]*?)\s*#?\s*(\d{4,})$/.exec(raw);
  if (supplier) return { kind: "SUPPLIER_INVOICE", raw, supplier: supplier[1].trim(), supplierInvoice: supplier[2] };
  return { kind: "OTHER", raw };
}
var TRADE_STATES = ["QUOTE", "AWAITING_HEDGE", "HEDGED", "INVOICED", "DEFERRED", "UNKNOWN"];
function deriveTradeState(cpty, cptyFill) {
  switch (cpty.kind) {
    case "QUOTE_ONLY":
      return { state: "QUOTE", fromColour: false };
    case "HEDGED":
      return { state: "HEDGED", fromColour: false };
    case "DEFERRED":
      return { state: "DEFERRED", fromColour: false };
    case "LOT_REF":
    case "SUPPLIER_INVOICE":
      return { state: "INVOICED", fromColour: false };
    case "EMPTY":
      return fillKind(cptyFill) === "BLUE" ? { state: "AWAITING_HEDGE", fromColour: true } : { state: "UNKNOWN", fromColour: false };
    default:
      return { state: "UNKNOWN", fromColour: false };
  }
}
function readCollected(cell2) {
  if (!cell2) return { collected: false, source: null, date: null };
  const value = cell2.value;
  const hasValue = value instanceof Date || typeof value === "number" && value !== 0 || typeof value === "string" && value.trim() !== "" || value === true;
  if (hasValue) return { collected: true, source: "VALUE", date: toIsoDate(value instanceof Date || typeof value === "string" ? value : null) };
  if (fillKind(cell2.fill) === "GREEN") return { collected: true, source: "FILL", date: null };
  return { collected: false, source: null, date: null };
}
var LINK_TOKEN_RE = /(?:[A-Za-z]{2}\s*-\s*)?[GS]\d{7,}/gi;
function parseDeferredLinks(...cells) {
  const out = { from: [], to: [] };
  const all = cells.filter(Boolean).join(" | ");
  const re = /deferred\s+(from|to)\s+([^|]*)/gi;
  let m;
  while ((m = re.exec(all)) !== null) {
    const refs = (m[2].match(LINK_TOKEN_RE) ?? []).map((t) => normalizeReference(t));
    const target = m[1].toLowerCase() === "from" ? out.from : out.to;
    for (const r of refs) if (!target.includes(r)) target.push(r);
  }
  return out;
}
var ALL_SOLD_RE = /\b(all\s*sold|sold\s*out|fully\s*matched|all\s*matched|matched\s*instantly|instantly\s*matched)\b/;
var CONCERN_RE = /damag|lost|missing|return|faulty|stolen/;
function parseSoldComment(comment, qty) {
  const raw = text2(comment);
  const lower2 = raw.toLowerCase();
  const none3 = { soldCount: null, allSold: false, remaining: qty, review: false, reason: null };
  if (!raw) return none3;
  if (ALL_SOLD_RE.test(lower2)) return { soldCount: qty, allSold: true, remaining: 0, review: false, reason: null };
  const counts = [...lower2.matchAll(/(\d+)\s*sold/g)].map((m) => Number(m[1]));
  if (counts.length > 0) {
    const sold = counts.reduce((a, b) => a + b, 0);
    const over = sold > qty;
    return {
      soldCount: sold,
      allSold: false,
      remaining: Math.max(0, qty - sold),
      review: over,
      reason: over ? `Comment says ${sold} sold but only ${qty} were bought.` : null
    };
  }
  const squashed = lower2.replace(/[^a-z]/g, "");
  if (squashed.includes("allsold")) {
    return { soldCount: qty, allSold: true, remaining: 0, review: true, reason: `Read "${raw}" as all sold; check the spelling.` };
  }
  if (/\bsold\b/.test(lower2)) {
    return { soldCount: qty, allSold: true, remaining: 0, review: true, reason: `"${raw}" has no number; read as all sold.` };
  }
  if (CONCERN_RE.test(lower2)) return { ...none3, review: true, reason: `Comment may affect stock: "${raw}".` };
  return none3;
}
function extractQtyAndProduct(value) {
  const s = text2(value).replace(/×/g, "x");
  if (!s) return { qty: null, product: "" };
  let m = /^(\d+)\s*x\s*(.+)$/i.exec(s);
  if (m) return { qty: Number(m[1]), product: m[2].trim() };
  m = /^(.+?)\s*x\s*(\d+)$/i.exec(s);
  if (m) return { qty: Number(m[2]), product: m[1].trim() };
  return { qty: null, product: s };
}
function fingerprint(parts) {
  const s = parts.map((p) => p === null || p === void 0 ? "" : String(p)).join("");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
var cellAt = (row, map, field2) => {
  const i = map[field2];
  return i === void 0 ? void 0 : row[i];
};
var valueAt = (row, map, field2) => cellAt(row, map, field2)?.value;
var orNull = (s) => s === "" ? null : s;
var isReferenceCell = (reference) => /[A-Za-z]/.test(reference);
var rowIsBlank = (row) => row.every((c) => text2(c?.value) === "");
function parseSaleRow(row, map, sourceRow) {
  const m = map;
  const reference = text2(valueAt(row, m, "reference"));
  if (!isReferenceCell(reference)) return null;
  const issues = [];
  const parsedReference = parseReference(reference);
  if (!parsedReference) issues.push("Reference is not in the expected format.");
  else if (parsedReference.role !== "SALE") issues.push("Reference looks like a purchase, not a sale.");
  const qtyAndProduct = extractQtyAndProduct(valueAt(row, m, "product"));
  const qtyCell = parseSheetNumber(valueAt(row, m, "qty"));
  const qty = qtyCell ?? qtyAndProduct.qty;
  if (qty === null || qty <= 0) issues.push("No quantity.");
  if (!qtyAndProduct.product) issues.push("No product.");
  const cptyCell = cellAt(row, m, "cpty");
  const cpty = classifyCpty(cptyCell?.value);
  const { state, fromColour } = deriveTradeState(cpty, cptyCell?.fill);
  if (state === "UNKNOWN") issues.push(cpty.kind === "OTHER" ? `CPTY "${cpty.raw}" is not recognised.` : "CPTY is empty and not marked as awaiting a hedge.");
  const date = toIsoDate(valueAt(row, m, "date"));
  if (!date) issues.push("No date.");
  const notes = orNull(text2(valueAt(row, m, "notes")));
  const hedgingNotes = orNull(text2(valueAt(row, m, "hedgingNotes")));
  const collected = readCollected(cellAt(row, m, "collected"));
  const branchCode = orNull(text2(valueAt(row, m, "branch")).toUpperCase()) ?? parsedReference?.branch ?? null;
  const sale = {
    sourceRow,
    reference,
    parsedReference,
    branchCode,
    initials: orNull(text2(valueAt(row, m, "initials"))),
    client: text2(valueAt(row, m, "client")),
    qty,
    product: qtyAndProduct.product,
    date,
    spot: parseSheetNumber(valueAt(row, m, "spot")),
    cpty,
    state,
    stateFromColour: fromColour,
    collected,
    cost: parseSheetNumber(valueAt(row, m, "cost")),
    receipt: parseSheetNumber(valueAt(row, m, "receipt")),
    profit: parseSheetNumber(valueAt(row, m, "profit")),
    margin: parseSheetNumber(valueAt(row, m, "margin")),
    vatDue: parseSheetNumber(valueAt(row, m, "vatDue")),
    totalPrice: parseSheetNumber(valueAt(row, m, "totalPrice")),
    paid: orNull(text2(valueAt(row, m, "paid"))),
    netHedging: parseSheetNumber(valueAt(row, m, "netHedging")),
    boughtAt: parseSheetNumber(valueAt(row, m, "boughtAt")),
    soldAt: parseSheetNumber(valueAt(row, m, "soldAt")),
    notes,
    hedgingNotes,
    deferred: parseDeferredLinks(notes, cpty.raw),
    issues
  };
  return {
    ...sale,
    fingerprint: fingerprint([
      sale.client,
      sale.qty,
      sale.product,
      sale.date,
      sale.cpty.raw,
      sale.state,
      sale.collected.collected,
      sale.cost,
      sale.receipt,
      sale.boughtAt,
      sale.soldAt,
      sale.notes
    ])
  };
}
function parsePurchaseRow(row, map, sourceRow) {
  const m = map;
  const reference = text2(valueAt(row, m, "reference"));
  if (!isReferenceCell(reference)) return null;
  const issues = [];
  const parsedReference = parseReference(reference);
  if (!parsedReference) issues.push("Reference is not in the expected format.");
  else if (parsedReference.role !== "PURCHASE") issues.push("Reference looks like a sale, not a purchase.");
  const { qty: embeddedQty, product } = extractQtyAndProduct(valueAt(row, m, "product"));
  const qty = parseSheetNumber(valueAt(row, m, "qty")) ?? embeddedQty;
  if (qty === null || qty <= 0) issues.push("No quantity.");
  if (!product) issues.push("No product.");
  const comments = orNull(text2(valueAt(row, m, "comments")));
  const sold = parseSoldComment(comments, qty ?? 0);
  if (sold.review && sold.reason) issues.push(sold.reason);
  const purchase = {
    sourceRow,
    reference,
    parsedReference,
    branchCode: orNull(text2(valueAt(row, m, "branch")).toUpperCase()) ?? parsedReference?.branch ?? null,
    client: text2(valueAt(row, m, "client")),
    qty,
    product,
    received: toIsoDate(valueAt(row, m, "received")),
    datePaid: toIsoDate(valueAt(row, m, "datePaid")),
    pricePaid: parseSheetNumber(valueAt(row, m, "pricePaid")),
    pricePerItem: parseSheetNumber(valueAt(row, m, "pricePerItem")),
    hedgedAt: parseSheetNumber(valueAt(row, m, "hedgedAt")),
    melt: valueAt(row, m, "melt") === true || /^(true|yes|y|melt)$/i.test(text2(valueAt(row, m, "melt"))),
    comments,
    sold,
    issues
  };
  return {
    ...purchase,
    fingerprint: fingerprint([purchase.client, purchase.qty, purchase.product, purchase.received, purchase.pricePaid, purchase.hedgedAt, purchase.comments])
  };
}

// src/tradesheet-import.schema.ts
var import_zod25 = require("zod");
var CellValueSchema = import_zod25.z.union([import_zod25.z.string().max(4e3), import_zod25.z.number(), import_zod25.z.boolean(), import_zod25.z.null()]);
var TradesheetTabSchema = import_zod25.z.object({
  name: import_zod25.z.string().min(1).max(100),
  /** 1-based row number of the header row in the sheet. */
  headerRow: import_zod25.z.number().int().min(1),
  headers: import_zod25.z.array(CellValueSchema).max(80),
  rows: import_zod25.z.array(
    import_zod25.z.object({
      /** 1-based row number in the sheet, for messages and traceability. */
      row: import_zod25.z.number().int().min(1),
      cells: import_zod25.z.array(CellValueSchema).max(80),
      /** Background colour (ARGB) by column index, only for cells whose colour means something. */
      fills: import_zod25.z.record(import_zod25.z.string(), import_zod25.z.string().max(12)).optional()
    })
  ).max(6e3)
});
var TradesheetImportRequestSchema = import_zod25.z.object({
  fileName: import_zod25.z.string().min(1).max(300),
  /** The month the file covers, "2026-10". */
  sheetMonth: import_zod25.z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use the form 2026-10"),
  source: import_zod25.z.enum(["TRADESHEET", "BACKFILL"]).default("TRADESHEET"),
  // The July copy has 25 tabs, most of them scratch tabs sent empty so the preview can name them as skipped.
  tabs: import_zod25.z.array(TradesheetTabSchema).min(1).max(60)
});
var PLAN_ROW_STATUSES = ["ADDED", "CHANGED", "RESTORED", "MISSING", "UNCHANGED"];
var PlanRowStatusEnum = import_zod25.z.enum(PLAN_ROW_STATUSES);
var PlanCountsSchema = import_zod25.z.object({
  added: import_zod25.z.number(),
  changed: import_zod25.z.number(),
  restored: import_zod25.z.number(),
  unchanged: import_zod25.z.number(),
  missing: import_zod25.z.number(),
  flagged: import_zod25.z.number(),
  /** Unchanged rows whose product or issues the commit will rewrite. */
  refreshed: import_zod25.z.number().default(0)
});
var PlanRowSchema = import_zod25.z.object({
  reference: import_zod25.z.string(),
  sourceRow: import_zod25.z.number(),
  status: PlanRowStatusEnum,
  /** Fields that differ from what Goldilocks holds, for CHANGED rows. */
  changedFields: import_zod25.z.array(import_zod25.z.string()),
  issues: import_zod25.z.array(import_zod25.z.string()),
  /** The state (or collected flag) was read from a cell colour. The preview marks these. */
  fromColour: import_zod25.z.boolean(),
  state: import_zod25.z.enum(TRADE_STATES).nullable(),
  /** The same reference appears more than once in this file. */
  duplicate: import_zod25.z.boolean()
});
var TabPlanSchema = import_zod25.z.object({
  name: import_zod25.z.string(),
  kind: import_zod25.z.enum(["IE_GOLD_SALES", "IE_SILVER_SALES", "IE_GOLD_PURCHASES", "IE_SILVER_PURCHASES"]).nullable(),
  /** Why the tab is not imported, or what is wrong with its header. Empty when the tab is read. */
  problems: import_zod25.z.array(import_zod25.z.string()),
  counts: PlanCountsSchema,
  /** Rows worth showing: everything except clean unchanged rows. */
  rows: import_zod25.z.array(PlanRowSchema),
  /** Product texts that matched no pricing product, with how many rows use each. */
  unmatchedProducts: import_zod25.z.array(import_zod25.z.object({ text: import_zod25.z.string(), rows: import_zod25.z.number() })),
  /** Rows with a product text, by how the product was found: a saved name decision, a built-in rule, or neither. */
  productMatches: import_zod25.z.object({ saved: import_zod25.z.number(), rule: import_zod25.z.number(), none: import_zod25.z.number(), notProduct: import_zod25.z.number() })
});
var TradesheetImportPlanSchema = import_zod25.z.object({
  fileName: import_zod25.z.string(),
  sheetMonth: import_zod25.z.string(),
  tabs: import_zod25.z.array(TabPlanSchema),
  totals: PlanCountsSchema,
  /** Things to know about the whole file, e.g. that no saved product-name decisions exist yet. */
  warnings: import_zod25.z.array(import_zod25.z.string())
});
var AllocationSummarySchema = import_zod25.z.object({
  /** Lots whose allocation was recomputed. */
  lotsChecked: import_zod25.z.number(),
  /** Sales now linked to the lot their CPTY names. */
  salesLinked: import_zod25.z.number(),
  /** Sales that name a purchase line which is not in the imported data (an older month, or a typo). */
  lotNotImported: import_zod25.z.number(),
  /** Lots where the sales took more items than were bought. */
  overAllocated: import_zod25.z.number(),
  /** Lots where the sheet's "N sold" comment disagrees with what the sales took. */
  soldMismatches: import_zod25.z.number()
});
var TradesheetImportResultSchema = import_zod25.z.object({
  batchId: import_zod25.z.number(),
  plan: TradesheetImportPlanSchema,
  allocation: AllocationSummarySchema
});

// src/product-order.ts
var METAL_RANK = { GOLD: 0, SILVER: 1, PLATINUM: 2, PALLADIUM: 3 };
var FEATURED_GRAMS = [GRAMS_PER_TROY_OUNCE, 100];
var featuredRank = (grams) => {
  const i = FEATURED_GRAMS.findIndex((g) => Math.abs(g - grams) <= Math.max(0.05, g * 5e-3));
  return i === -1 ? FEATURED_GRAMS.length : i;
};
function compareKeys(a, b) {
  return a.metal - b.metal || featuredRank(a.grams) - featuredRank(b.grams) || b.grams - a.grams || a.name.localeCompare(b.name);
}
function compareProducts(a, b) {
  return compareKeys({ metal: METAL_RANK[a.metalType], grams: a.weight, name: a.name }, { metal: METAL_RANK[b.metalType], grams: b.weight, name: b.name }) || a.id - b.id;
}
var STOCK_METAL_RANK = { GOLD: 0, SILVER: 1, PGM: 2 };
function compareStockLabels(a, b) {
  const key = (x) => ({
    metal: x.metal ? STOCK_METAL_RANK[x.metal] : 3,
    grams: parseWeightGrams(x.label) ?? -1,
    name: x.label
  });
  return compareKeys(key(a), key(b));
}

// src/import-workbook.schema.ts
var import_zod26 = require("zod");
var IMPORT_SCHEMA_VERSION = "1.1";
var oneOf = (...v) => ({ oneOf: v });
var SYSTEMS = ["ZOHO", "BC"];
var CPTY_KINDS = ["LOT_REF", "QUOTE_ONLY", "DEFERRED", "SUPPLIER_INVOICE", "HEDGED", "EMPTY", "OTHER"];
var COLLECTED_FLAGS = ["YES", "NO", "CHECK"];
var LINK_TYPES = [
  "trade_lot",
  "invoice_line_trade",
  "line_serial_bc_tracking",
  "trade_supplier_invoice",
  "stock_bar_bc_tracking",
  "safe_trade",
  "serial_customer_safe",
  "serial_stock_bar",
  "lot_supplier_invoice",
  "bc_trade"
];
var LINK_CONFIDENCES = ["EXACT", "PROBABLE"];
var SAFE_STATUSES = ["ALLOCATED", "COLLECTED", "ORDERED", "TO_ORDER"];
var sys = oneOf(...SYSTEMS);
var flag = oneOf(...COLLECTED_FLAGS);
var IMPORT_TABLE_SPECS = {
  trades: {
    id: "s",
    system: sys,
    branch_code: "s",
    ref_month: "m",
    source_month: "m",
    region: "s",
    metal: "s",
    branch: "s",
    initials: "s",
    client_code: "s",
    qty: "n",
    product_text: "s",
    product_norm: "s",
    date: "d",
    spot: "n",
    cpty_raw: "s",
    cpty_kind: oneOf(...CPTY_KINDS),
    hedged_order: "b",
    lot_key: "s",
    lot_id: "s",
    supplier_invoice_id: "s",
    receipt: "n",
    cost: "n",
    profit: "n",
    margin: "n",
    paid_by: "s",
    collected_raw: "s",
    collected_fill: "s",
    cpty_fill: "s",
    collected_flag: flag,
    collected_source: "s",
    notes: "s",
    reference: "s",
    reference_key: "s",
    occurrence: "i",
    source_file: "s",
    source_tab: "s",
    source_row: "i",
    issues: "s"
  },
  purchase_lots: {
    id: "s",
    system: sys,
    branch_code: "s",
    region: "s",
    metal: "s",
    branch: "s",
    seller_code: "s",
    supplier_invoice_id: "s",
    qty: "n",
    product_text: "s",
    product_norm: "s",
    received: "d",
    date_paid: "d",
    price_paid: "n",
    price_per_item: "n",
    hedged_at: "s",
    comments_raw: "s",
    comment_sold_qty: "n",
    comment_all_sold: "b",
    reference: "s",
    reference_key: "s",
    core_key: "s",
    occurrence: "i",
    source_file: "s",
    source_tab: "s",
    source_row: "i",
    issues: "s"
  },
  supplier_invoices: { id: "s", supplier: "s", number: "s", first_date: "d", last_date: "d", trade_rows: "i", lot_rows: "i" },
  invoices: { id: "s", system: sys, date: "d", customer_code: "s", status: "s", sales_order_number: "s", total: "n", line_count: "i" },
  invoice_lines: {
    id: "s",
    system: sys,
    invoice_id: "s",
    line_no: "i",
    date: "d",
    customer_code: "s",
    qty: "n",
    item_name: "s",
    product_norm: "s",
    unit_price: "n",
    line_total: "n",
    item_desc: "s",
    collected_flag: flag,
    collected_date: "d",
    refinery_detected: "s",
    delivered_brinks: "b",
    sold_back: "b",
    refs_found: "s",
    source_row: "i"
  },
  line_serials: { id: "s", invoice_line_id: "s", serial: "s", serial_norm: "s", refinery: "s", collected_flag: flag, collected_date: "d" },
  payments: {
    id: "s",
    system: sys,
    invoice_id: "s",
    customer_code: "s",
    zoho_customer_id: "s",
    date: "d",
    invoice_date: "d",
    amount: "n",
    invoice_amount: "n",
    mode: "s",
    reference: "s",
    type: "s"
  },
  purchase_orders: {
    id: "s",
    system: sys,
    po_number: "s",
    line_no: "i",
    date: "d",
    vendor_number: "s",
    vendor_code: "s",
    item_name: "s",
    product_norm: "s",
    qty_ordered: "n",
    qty_received: "n",
    qty_billed: "n",
    price: "n",
    item_total: "n",
    status: "s",
    reference: "s"
  },
  stock_bars: {
    id: "s",
    snapshot: "s",
    metal: "s",
    branch: "s",
    weight_label: "s",
    refinery: "s",
    serial: "s",
    serial_norm: "s",
    grams: "n",
    confirmed: "s",
    sold_tick: "b",
    details: "s",
    source_row: "i"
  },
  stock_coins: {
    id: "s",
    snapshot: "s",
    metal: "s",
    branch: "s",
    item: "s",
    product_norm: "s",
    qty_prev: "n",
    qty_counted: "n",
    qty_allocated_since: "n",
    qty_final: "n",
    counts_json: "s",
    details: "s",
    source_row: "i"
  },
  bc_journal_lines: {
    id: "s",
    snapshot: "s",
    item_no: "s",
    description: "s",
    location_code: "s",
    qty_calculated: "n",
    counted_normal: "n",
    counted_customer: "n",
    variance: "n",
    reason: "s",
    serials_checked: "s",
    serial_note: "s",
    batch_name: "s",
    posting_date: "d",
    document_no: "s",
    source_row: "i"
  },
  bc_tracking_entries: {
    id: "s",
    snapshot: "s",
    entry_no: "s",
    item_no: "s",
    location_code: "s",
    serial_no: "s",
    serial_norm: "s",
    lot_no: "s",
    remaining_quantity: "n",
    posting_date: "d",
    document_no: "s",
    entry_type: "s",
    source_row: "i"
  },
  bc_items: { id: "s", description: "s", product_norm: "s", refinery_hint: "s", source_row: "i" },
  zoho_products: { id: "s", sku: "s", item_name: "s", product_norm: "s", metal: "s", qty_sold: "n", amount: "n", avg_price: "n" },
  customer_safe_items: {
    id: "s",
    metal: "s",
    snapshot: "s",
    system: sys,
    branch_code: "s",
    status_raw: "s",
    status_norm: oneOf(...SAFE_STATUSES),
    branch: "s",
    date: "d",
    client_code: "s",
    reference: "s",
    reference_core: "s",
    qty: "n",
    product_text: "s",
    product_norm: "s",
    refinery: "s",
    serials: "s",
    notes: "s",
    source_row: "i"
  },
  bc_sales_orders: {
    id: "s",
    system: sys,
    branch_code: "s",
    snapshot: "s",
    snapshot_date: "d",
    bc_customer_no: "s",
    client_code: "s",
    ext_doc_no: "s",
    ext_doc_core: "s",
    location: "s",
    doc_date: "d",
    amount: "n",
    amount_incl_vat: "n",
    prepaid: "n",
    remaining: "n",
    paid: "b"
  },
  links: {
    id: "s",
    link_type: oneOf(...LINK_TYPES),
    from_table: "s",
    from_id: "s",
    to_table: "s",
    to_id: "s",
    method: "s",
    confidence: oneOf(...LINK_CONFIDENCES),
    note: "s"
  },
  customers: { id: "s", zoho_number: "s", zoho_status: "s", currency: "s", sources: "s", rows: "i" },
  vendors: { id: "s", zoho_number: "s", zoho_status: "s", currency: "s", sources: "s", rows: "i" },
  product_aliases: { id: "s", suggested_key: "s", example_text: "s", refinery: "s", uses: "i", sources: "s" }
};
var IMPORT_TABLE_NAMES = Object.keys(IMPORT_TABLE_SPECS);
var OPTIONAL_COLUMNS = {
  invoice_lines: ["refinery_detected"],
  product_aliases: ["refinery"]
};
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
var MONTH_RE = /^\d{4}-\d{2}$/;
function kindSchema(kind) {
  if (kind === "s") return import_zod26.z.string().nullable();
  if (kind === "n") return import_zod26.z.number().finite().nullable();
  if (kind === "i") return import_zod26.z.number().int().nullable();
  if (kind === "b") return import_zod26.z.boolean().nullable();
  if (kind === "d") return import_zod26.z.string().regex(DATE_RE).nullable();
  if (kind === "m") return import_zod26.z.string().regex(MONTH_RE).nullable();
  return import_zod26.z.enum(kind.oneOf).nullable();
}
var ImportTableSchemas = Object.fromEntries(
  IMPORT_TABLE_NAMES.map((name) => [
    name,
    import_zod26.z.strictObject(Object.fromEntries(Object.entries(IMPORT_TABLE_SPECS[name]).map(([col, kind]) => [col, kindSchema(kind)])))
  ])
);
var ImportMetaSchema = import_zod26.z.object({ schema_version: import_zod26.z.literal(IMPORT_SCHEMA_VERSION) });
var ImportRowIssueCodeSchema = import_zod26.z.enum([
  "BAD_NUMBER",
  "BAD_INTEGER",
  "BAD_BOOLEAN",
  "BAD_DATE",
  "IMPOSSIBLE_DATE",
  "BAD_VALUE",
  "EMAIL_OR_URL"
]);
var ImportRowIssueSchema = import_zod26.z.object({
  table: import_zod26.z.string(),
  /** 1-based sheet row (the header is row 1). */
  row: import_zod26.z.number().int(),
  column: import_zod26.z.string(),
  code: ImportRowIssueCodeSchema,
  /** Raw cell text for dates, numbers and flags only; never set for emails or free text. */
  raw: import_zod26.z.string().optional()
});

// src/import-workbook.ts
var MAX_LISTED_ISSUES = 500;
var MIN_YEAR = 1990;
var MAX_YEAR = 2100;
var EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
var URL_RE = /\bhttps?:\/\/|\bwww\./i;
var ok = (value) => ({ value });
var bad = (issue, raw) => ({ value: null, issue, raw: String(raw).slice(0, 40) });
function isEmpty(v) {
  return v === void 0 || v === null || typeof v === "string" && v.trim() === "";
}
function ymd(y, m, d) {
  if (y < MIN_YEAR || y > MAX_YEAR || m < 1 || m > 12) return null;
  if (d !== null && (d < 1 || d > new Date(Date.UTC(y, m, 0)).getUTCDate())) return null;
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return d === null ? `${y}-${p(m)}` : `${y}-${p(m)}-${p(d)}`;
}
function dateParts(v) {
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    return { y: v.getUTCFullYear(), m: v.getUTCMonth() + 1, d: v.getUTCDate(), hasDay: true };
  }
  if (typeof v === "number") {
    if (v < 2e4 || v > 8e4) return null;
    return dateParts(new Date(Math.round((v - 25569) * 864e5)));
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{1,4})-(\d{1,2})(?:-(\d{1,2}))?(?!\d)/);
  if (m) return { y: +m[1], m: +m[2], d: m[3] ? +m[3] : null, hasDay: Boolean(m[3]) };
  m = s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})$/);
  if (m) return { y: m[3].length === 2 ? 2e3 + +m[3] : +m[3], m: +m[2], d: +m[1], hasDay: true };
  return null;
}
function coerceCell(kind, v) {
  if (isEmpty(v)) return ok(null);
  if (kind === "s") {
    let s;
    if (v instanceof Date) s = Number.isNaN(v.getTime()) ? "" : v.toISOString().slice(0, 10);
    else if (typeof v === "boolean") s = v ? "TRUE" : "FALSE";
    else s = String(v).trim();
    if (EMAIL_RE.test(s) || URL_RE.test(s)) return { value: s, issue: "EMAIL_OR_URL" };
    return ok(s);
  }
  if (kind === "n" || kind === "i") {
    let n;
    if (typeof v === "number") n = v;
    else {
      let t2 = String(v).replace(/[€£$\s]/g, "");
      if (/^-?\d+,\d{1,2}$/.test(t2)) t2 = t2.replace(",", ".");
      else t2 = t2.replace(/,/g, "");
      n = t2 === "" ? NaN : Number(t2);
    }
    if (!Number.isFinite(n)) return bad("BAD_NUMBER", v);
    if (kind === "i" && !Number.isInteger(n)) return bad("BAD_INTEGER", v);
    return ok(n);
  }
  if (kind === "b") {
    if (typeof v === "boolean") return ok(v);
    const t2 = String(v).trim().toUpperCase();
    if (t2 === "TRUE" || t2 === "1") return ok(true);
    if (t2 === "FALSE" || t2 === "0") return ok(false);
    return bad("BAD_BOOLEAN", v);
  }
  if (kind === "d" || kind === "m") {
    const p = dateParts(v);
    if (!p) return bad("BAD_DATE", v);
    const shown = v instanceof Date ? v.toISOString().slice(0, 10) : v;
    if (kind === "d" && !p.hasDay) return bad("BAD_DATE", shown);
    const out = ymd(p.y, p.m, kind === "d" ? p.d : null);
    return out === null ? bad("IMPOSSIBLE_DATE", shown) : ok(out);
  }
  const t = String(v).trim().toUpperCase();
  const canonical = kind.oneOf.find((o) => o.toUpperCase() === t);
  return canonical !== void 0 ? ok(canonical) : bad("BAD_VALUE", v);
}
var LINK_KEY_COLUMNS = ["link_type", "confidence"];
function emptyTables() {
  return Object.fromEntries(IMPORT_TABLE_NAMES.map((n) => [n, []]));
}
function readImportWorkbook(sheets) {
  const schemaErrors = [];
  const tables = emptyTables();
  const issues = [];
  const issueTotals = {};
  const droppedRows = {};
  let schemaVersion = null;
  const metaRows = sheets["meta"];
  if (!metaRows) schemaErrors.push('Missing sheet "meta".');
  else {
    for (const r of metaRows.slice(1)) if (String(r[0] ?? "").trim() === "schema_version") schemaVersion = String(r[1] ?? "").trim() || null;
    if (schemaVersion !== IMPORT_SCHEMA_VERSION) {
      schemaErrors.push(`Unsupported schema version "${schemaVersion ?? "none"}" (expected ${IMPORT_SCHEMA_VERSION}).`);
    }
  }
  for (const name of IMPORT_TABLE_NAMES) {
    const rows = sheets[name];
    if (!rows || rows.length === 0) {
      schemaErrors.push(`Missing sheet "${name}".`);
      continue;
    }
    const spec = IMPORT_TABLE_SPECS[name];
    const header = rows[0].map((h) => String(h ?? "").trim());
    const optional = OPTIONAL_COLUMNS[name] ?? [];
    const missing = Object.keys(spec).filter((c) => !header.includes(c) && !optional.includes(c));
    const unknown = header.filter((h) => h !== "" && !(h in spec));
    if (missing.length || unknown.length) {
      const parts = [];
      if (missing.length) parts.push(`missing column(s) ${missing.join(", ")}`);
      if (unknown.length) parts.push(`unknown column(s) ${unknown.join(", ")}`);
      schemaErrors.push(`Sheet "${name}": ${parts.join("; ")}.`);
      continue;
    }
    const colIndex = header.map((h) => h in spec ? h : null);
    const out = tables[name];
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      if (cells.every(isEmpty)) continue;
      const row = Object.fromEntries(Object.keys(spec).map((c) => [c, null]));
      let drop = false;
      colIndex.forEach((col, i) => {
        if (!col) return;
        const res = coerceCell(spec[col], cells[i]);
        row[col] = res.value;
        if (!res.issue) return;
        const key = `${name}.${res.issue}`;
        issueTotals[key] = (issueTotals[key] ?? 0) + 1;
        if (issues.length < MAX_LISTED_ISSUES) {
          issues.push({ table: name, row: r + 1, column: col, code: res.issue, ...res.raw !== void 0 && res.issue !== "EMAIL_OR_URL" ? { raw: res.raw } : {} });
        }
        if (name === "links" && LINK_KEY_COLUMNS.includes(col)) drop = true;
      });
      if (drop) droppedRows[name] = (droppedRows[name] ?? 0) + 1;
      else out.push(row);
    }
  }
  const counts = Object.fromEntries(IMPORT_TABLE_NAMES.map((n) => [n, tables[n].length]));
  const total = (code) => Object.entries(issueTotals).filter(([k]) => k.endsWith(`.${code}`)).reduce((s, [, n]) => s + n, 0);
  return {
    ok: schemaErrors.length === 0,
    schemaErrors,
    schemaVersion,
    tables,
    counts,
    issues,
    issueTotals,
    droppedRows,
    warnings: { emailOrUrlCells: total("EMAIL_OR_URL"), impossibleDates: total("IMPOSSIBLE_DATE") }
  };
}

// src/unredact.ts
var REDACTED_CODE_COLUMNS = {
  trades: ["client_code"],
  purchase_lots: ["seller_code"],
  invoices: ["customer_code"],
  invoice_lines: ["customer_code"],
  payments: ["customer_code"],
  purchase_orders: ["vendor_code"],
  customer_safe_items: ["client_code"],
  bc_sales_orders: ["client_code"]
};
var REDACTED_NAME_TABLES = ["customers", "vendors"];
var REDACTED_TEXT_COLUMNS = {
  trades: ["notes", "cpty_raw", "reference", "collected_raw", "paid_by"],
  purchase_lots: ["comments_raw", "reference"],
  invoice_lines: ["item_desc"],
  payments: ["reference"],
  purchase_orders: ["reference"],
  customer_safe_items: ["notes", "reference", "serials"],
  stock_bars: ["details"],
  stock_coins: ["details"],
  bc_journal_lines: ["description", "reason", "serial_note"],
  links: ["note"]
};
var CODE = /^[CV]\d{6}$/;
var CODE_IN_TEXT = /\b[CV]\d{6}\b/g;
function unredactTables(tables, mapRows) {
  const names = /* @__PURE__ */ new Map();
  for (const m of mapRows) {
    const code = m.code?.trim();
    const original = m.original?.trim();
    if (code && original) names.set(code, original);
  }
  const unmapped = /* @__PURE__ */ new Set();
  let replaced = 0;
  const checkCode = (v) => {
    if (CODE.test(v) && !names.has(v)) unmapped.add(v);
  };
  const swapText = (v) => v.replace(CODE_IN_TEXT, (code) => {
    const name = names.get(code);
    if (name === void 0) {
      unmapped.add(code);
      return code;
    }
    replaced++;
    return name;
  });
  const out = {};
  for (const [table, rows] of Object.entries(tables)) {
    if (!rows) continue;
    const codeCols = REDACTED_CODE_COLUMNS[table] ?? [];
    const textCols = REDACTED_TEXT_COLUMNS[table] ?? [];
    const isPeople = REDACTED_NAME_TABLES.includes(table);
    if (codeCols.length === 0 && textCols.length === 0 && !isPeople) {
      out[table] = rows;
      continue;
    }
    out[table] = rows.map((row) => {
      let next = null;
      for (const col of codeCols) {
        const v = row[col];
        if (typeof v === "string") checkCode(v);
      }
      if (isPeople) {
        const id = String(row["id"] ?? "");
        checkCode(id);
        next = { ...row, name: names.get(id) ?? id };
        if (names.has(id)) replaced++;
      }
      for (const col of textCols) {
        const v = row[col];
        if (typeof v === "string") {
          const s = swapText(v);
          if (s !== v) (next ??= { ...row })[col] = s;
        }
      }
      return next ?? row;
    });
  }
  return { tables: out, unmappedCodes: [...unmapped].sort(), replaced };
}

// src/product-text.ts
function normaliseProductText(text4) {
  return String(text4 || "").toLowerCase().replace(/[()]/g, " ").replace(/\b20\d\d\b/g, " ").replace(/krugerrands/g, "krugerrand").replace(/\bounces?\b/g, "oz").replace(/\bgrams?\b/g, "g").replace(/(\d)\s+(oz|g|kg)\b/g, "$1$2").replace(/\b(gold|silver)?\s*(bullion bar|gold bar|bar)\b/g, " bar ").replace(/\b(gold|investment grade|bullion|coin|coins)\b/g, " ").replace(/[^a-z0-9/.]+/g, " ").replace(/\s+/g, " ").trim().split(" ").map((w) => /^[a-z]{4,}$/.test(w) && /s$/.test(w) && !/(ss|us|is)$/.test(w) ? w.slice(0, -1) : w).join(" ");
}
var PRODUCT_NORM_EXAMPLES = [
  ["Full Sovereign", "full sovereign"],
  ["Sovereign (Full)", "sovereign full"],
  ["1oz Gold Krugerrand Coin 2023", "1oz krugerrand"],
  ["1/2 oz Philharmonics", "1/2oz philharmonic"],
  ["10 gram gold bars", "10g bar"],
  ["1oz (31.1g) Gold Bar - PAMP", "1oz 31.1g bar pamp"],
  ["Half Ounce (15.5g) Gold Bar", "half oz 15.5g bar"],
  ["Investment Grade Gold Bullion (grams)", "g"],
  ["Silver - 1oz Coins -", "silver 1oz"],
  ["1oz Trees of Life (Mixed Years)", "1oz tree of life mixed year"],
  ["St Gaudens", "st gauden"],
  ["Lunar Series", "lunar serie"],
  ["#REF!", "ref"],
  ["5469.18", "5469.18"],
  ["", ""],
  ["1KG Bar", "1kg bar"],
  ["2.5g Bar", "2.5g bar"]
];
function aliasOk(text4, key) {
  const t = String(text4 ?? "").trim();
  const k = String(key ?? "");
  if (/^#[A-Z/0-9]+[!?]?$/i.test(t)) return false;
  if (k.replace(/[^a-z]/gi, "").length < 3) return false;
  if (/[,&+;]|\band\b/i.test(t)) return false;
  if (/investment/i.test(k)) return false;
  if (k.includes("|")) return false;
  return true;
}

// src/product-rules.ts
function metalInText(text4) {
  const s = String(text4 ?? "").toLowerCase();
  const found = /* @__PURE__ */ new Set();
  if (/\bgold\b/.test(s)) found.add("GOLD");
  if (/\bsilver\b/.test(s)) found.add("SILVER");
  if (/\bplatinum\b/.test(s)) found.add("PLATINUM");
  if (/\bpalladium\b/.test(s)) found.add("PALLADIUM");
  return found.size === 1 ? [...found][0] : null;
}
var WEIGHT_RE = /(?<![\d./])(\d+\/\d+|\d+(?:\.\d+)?)(oz|g|kg)\b/g;
var FRACTIONS = /* @__PURE__ */ new Set(["1/10OZ", "1/4OZ", "1/2OZ"]);
var BAR_BRANDS = /\b(pamp|valcambi|metalor|umicore|argor|heraeus|nadir|combi|combibar|credit suisse|baird|hafner|johnson matthey|rand refinery)\b/;
var UNKNOWN_COINS = /\b(buffalo|panda|angel|lunar|gauden|double eagle|ducat|isle of man|libertad)\b/;
function weightsOf(key) {
  const out = [];
  if (/\bhalf oz\b/.test(key)) out.push("1/2OZ");
  if (/\bquarter oz\b/.test(key)) out.push("1/4OZ");
  if (/\btenth oz\b/.test(key)) out.push("1/10OZ");
  for (const m of key.matchAll(WEIGHT_RE)) out.push(`${m[1]}${m[2]}`.toUpperCase());
  return [...new Set(out)];
}
function designOf(key, metal) {
  const pgm = metal === "PLATINUM" || metal === "PALLADIUM";
  if (/\bkrugerrand\b/.test(key)) return "KRUGERRAND";
  if (/\bmaple/.test(key)) return pgm ? "MAPLE" : "MAPLELEAF";
  if (/\bbritannia\b/.test(key)) return "BRITANNIA";
  if (/\bkangaroo\b/.test(key)) return "KANGAROO";
  if (/\b(philharmonic|phil)\b/.test(key)) return "PHILHARMONIC";
  if (/\btree\b/.test(key) && /\blife\b/.test(key)) return "TREEOFLIFE";
  if (/\beagle\b/.test(key)) return "USEAGLE";
  if (/\bqueen/.test(key) && /\bbeast/.test(key)) return "QUEENSBEASTS";
  return null;
}
function sovereignSku(key) {
  if (/\b(quarter|quintuple|eighth|eight)\b/.test(key)) return null;
  if (/\bhalf\b/.test(key)) return "GOLD-HALF-SOVEREIGN-COIN";
  if (/\bdouble\b/.test(key)) return "GOLD-DOUBLE-SOVEREIGN-COIN";
  return "GOLD-FULL-SOVEREIGN-COIN";
}
function pricingSkuFor(text4, metal) {
  const raw = String(text4 ?? "").toLowerCase();
  if (/[,&+;]|\band\b/.test(raw)) return null;
  const key = normaliseProductText(raw);
  if (!key) return null;
  const metalFromText = metalInText(raw);
  const M = metalFromText ?? metal;
  const done = (candidates) => {
    const unique = [...new Set(candidates)];
    return unique.length > 0 ? { sku: unique[0], candidates: unique, metalFromText } : null;
  };
  if (/\bsovereign\b/.test(key)) {
    if (M !== "GOLD" || /\bsilver\b/.test(key)) return null;
    const sku = sovereignSku(key);
    return sku ? done([sku]) : null;
  }
  const weights = weightsOf(key);
  if (weights.length === 0) return null;
  const design = designOf(key, M);
  if (/\bdouble eagle\b/.test(key) || !design && UNKNOWN_COINS.test(key)) return null;
  const bonded = /\bbonded\b/.test(key);
  const coinWord = /\bcoins?\b/.test(raw);
  const isBar = /\bbar\b/.test(key) || BAR_BRANDS.test(key);
  const forWeight = (W) => {
    const out = [];
    if (design) {
      if (design === "USEAGLE" && FRACTIONS.has(W)) out.push(`${M}-${W}-US-COIN`);
      out.push(`${M}-${W}-${design}-COIN`);
      if (FRACTIONS.has(W) || W === "1G") out.push(`${M}-${W}-COIN`);
    } else if (isBar) {
      if (bonded) out.push(`${M}-${W}-BONDED-BAR`);
      out.push(`${M}-${W}-BAR`);
      if (M === "SILVER") out.push(`${W}-SILVER-BAR`);
    } else if (coinWord) {
      if (bonded) out.push(`${M}-${W}-BONDED-COIN`);
      if (M === "SILVER" && W === "1KG") out.push("SILVER-1KG-COINS-COIN");
      out.push(`${M}-${W}-COIN`);
      if (M === "SILVER") out.push(`${W}-SILVER-COIN`);
    } else if (M === "GOLD" && FRACTIONS.has(W)) {
      out.push(`GOLD-${W}-COIN`);
    }
    return out;
  };
  return done(weights.flatMap(forWeight));
}

// src/product-match-coins.ts
var GRAMS_PER_TROY_OZ = 31.1035;
function meltLabel(fineGrams) {
  return `${(fineGrams / GRAMS_PER_TROY_OZ).toFixed(4)}oz melt`;
}
var has = (t, ...w) => w.some((x) => t.has(x));
var num = (t, ...n) => n.some((x) => t.has(x));
var FOREIGN_COINS = [
  { name: "20 French Franc", fineGrams: 5.806, test: (t) => has(t, "napoleon") && !num(t, "10", "100") || has(t, "french") && has(t, "franc") && num(t, "20") },
  { name: "10 French Franc", fineGrams: 2.903, test: (t) => has(t, "napoleon") && num(t, "10") || has(t, "french") && has(t, "franc") && num(t, "10") },
  { name: "100 French Franc", fineGrams: 29.03, test: (t) => has(t, "napoleon") && num(t, "100") || has(t, "french") && has(t, "franc") && num(t, "100") },
  { name: "20 Swiss Franc (Vreneli)", fineGrams: 5.806, test: (t) => has(t, "vreneli") || has(t, "swiss") && has(t, "franc") && num(t, "20") },
  { name: "Austrian 4 Ducat", fineGrams: 13.77, test: (t) => has(t, "ducat") && num(t, "4") },
  { name: "Austrian 1 Ducat", fineGrams: 3.442, test: (t) => has(t, "ducat") && !num(t, "4") ? num(t, "1", "one") ? true : "bare" : false },
  { name: "Austrian 100 Corona", fineGrams: 30.488, test: (t) => has(t, "corona", "krone", "kronen") && num(t, "100") },
  { name: "Austrian 20 Corona", fineGrams: 6.098, test: (t) => has(t, "corona", "krone", "kronen") && num(t, "20") },
  { name: "Austrian 10 Corona", fineGrams: 3.049, test: (t) => has(t, "corona", "krone", "kronen") && num(t, "10") },
  { name: "Mexican 50 Pesos", fineGrams: 37.5, test: (t) => has(t, "centenario") || has(t, "peso") && num(t, "50") },
  { name: "Mexican 2.5 Pesos", fineGrams: 1.875, test: (t) => has(t, "dos") && has(t, "medio") || has(t, "peso") && num(t, "2.5") },
  { name: "South African 2 Rand", fineGrams: 7.322, test: (t) => has(t, "rand") && !has(t, "refinery") && num(t, "2") },
  { name: "South African 1 Rand", fineGrams: 3.661, test: (t) => has(t, "rand") && !has(t, "refinery") && num(t, "1") },
  {
    name: "US $20 Double Eagle",
    fineGrams: 30.093,
    test: (t) => has(t, "double") && has(t, "eagle") || has(t, "gauden") || has(t, "liberty") && num(t, "20", "$20") || has(t, "us") && num(t, "20", "$20") || num(t, "$20") || has(t, "dollar") && num(t, "20")
  },
  {
    name: "US $10 Eagle",
    fineGrams: 15.046,
    test: (t) => num(t, "$10") || has(t, "dollar") && num(t, "10") || num(t, "10") && has(t, "liberty", "eagle")
  },
  { name: "US $5 Half Eagle", fineGrams: 7.523, test: (t) => num(t, "$5") || has(t, "dollar") && num(t, "5") },
  { name: "US $2.5 Quarter Eagle", fineGrams: 3.762, test: (t) => num(t, "$2.5") || has(t, "dollar") && num(t, "2.5") || has(t, "indian") && has(t, "head") && num(t, "2.5") },
  { name: "German 20 Mark", fineGrams: 7.168, test: (t) => has(t, "mark") && (num(t, "20") || has(t, "german")) },
  { name: "Russian 10 Rouble", fineGrams: 7.742, test: (t) => has(t, "rouble", "ruble") && num(t, "10") },
  { name: "Russian 5 Rouble", fineGrams: 3.871, test: (t) => has(t, "rouble", "ruble") && num(t, "5") },
  { name: "Turkish 100 Kurush", fineGrams: 6.615, test: (t) => has(t, "kurush", "kurus", "piastre") && num(t, "100") },
  { name: "Saudi Guinea", fineGrams: 7.322, test: (t) => has(t, "saudi") && has(t, "guinea") }
];
function coinTokens(text4) {
  const stripped = text4.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/(\d)\s+(oz|ounces?|g|grams?|kg)\b/g, "$1$2");
  const out = /* @__PURE__ */ new Set();
  for (const raw of stripped.replace(/[^a-z0-9./$]+/g, " ").split(" ")) {
    if (!raw) continue;
    let w = raw.replace(/^\.+|\.+$/g, "");
    if (/^[a-z]{4,}s$/.test(w) && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
    if (w) out.add(w);
  }
  return out;
}
function readForeignCoin(text4) {
  const tokens = coinTokens(text4);
  let bare = null;
  for (const coin of FOREIGN_COINS) {
    const r = coin.test(tokens);
    if (r === true) return { coin, sure: true };
    if (r === "bare" && !bare) bare = coin;
  }
  return bare ? { coin: bare, sure: false } : null;
}

// src/refineries.ts
var REFINERIES = [
  { refinery: "VALCAMBI SUISSE", spellings: ["Valcambi"] },
  { refinery: "PAMP SUISSE", spellings: ["PAMP", "PAMP Suisse", "PAMP Fortuna", "PAMP Lady Fortuna", "PAMP Rosa", "PAMP Diwali", "PAMP Diawli"] },
  { refinery: "ARGOR-HERAEUS", spellings: ["Argor Heraeus", "Argor"] },
  { refinery: "HERAEUS", spellings: ["Heareus"] },
  { refinery: "UMICORE", spellings: [] },
  { refinery: "METALOR", spellings: [] },
  { refinery: "CREDIT SUISSE", spellings: [] },
  { refinery: "PERTH MINT", spellings: ["The Perth Mint", "Perth Mint Australia"] },
  { refinery: "ROYAL MINT", spellings: ["Royal Mint - Star Wars"] },
  { refinery: "BAIRD & CO", spellings: ["Baird", "Baird & Co.", "Baird and Co"] },
  { refinery: "C HAFNER", spellings: ["Hafner", "C. Hafner", "C.Hafner", "CHafner"] },
  { refinery: "JOHNSON MATTHEY", spellings: [] },
  { refinery: "MERRION GOLD", spellings: [] },
  { refinery: "NADIR", spellings: [] },
  { refinery: "OPM METALS", spellings: ["OPM"] },
  { refinery: "ASSAY OFFICE", spellings: [] },
  { refinery: "MUNZE OSTERREICH", spellings: ["M\xFCnze \xD6sterreich", "Austrian Mint"] },
  { refinery: "ELEMENTAL", spellings: [] },
  { refinery: "ROYAL CANADIAN MINT", spellings: [] },
  { refinery: "SEMPSA", spellings: [] },
  { refinery: "RAND REFINERY", spellings: [] },
  { refinery: "DEGUSSA", spellings: [] },
  { refinery: "ASAHI", spellings: ["Asahi Refining"] },
  { refinery: "ENGELHARD", spellings: [] },
  { refinery: "KANTONAL BANK", spellings: ["Kantonalbank", "Zurcher Kantonalbank"] },
  { refinery: "MELBOURNE MINT", spellings: ["The Melbourne Mint"] }
];
var NO_REFINERY = ["Best Value (Mixed Refiners)", "Mixed", "Mixed/Other", "Unknown"];
function refineryWords(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();
}
var byWords = /* @__PURE__ */ new Map();
for (const r of REFINERIES) {
  byWords.set(refineryWords(r.refinery), r.refinery);
  for (const s of r.spellings) byWords.set(refineryWords(s), r.refinery);
}
var noRefinery = new Set(NO_REFINERY.map(refineryWords));
function listedRefinery(text4) {
  const w = refineryWords(text4);
  if (noRefinery.has(w)) return null;
  return byWords.get(w);
}
var spellingList = [...byWords.entries()].sort((a, b) => b[0].length - a[0].length);
function refineryMatch(text4) {
  const w = ` ${refineryWords(String(text4 ?? ""))} `;
  for (const [words2, canonical] of spellingList) if (w.includes(` ${words2} `)) return { refinery: canonical, words: words2 };
  return null;
}
function refineryInText(text4) {
  return refineryMatch(text4)?.refinery ?? null;
}

// src/product-match.ts
var METALS = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"];
var GRAMS_PER_OZ = 31.1034768;
var GRAMS_PER_TOLA = 11.6638;
var ZODIAC = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "sheep", "monkey", "rooster", "dog", "pig", "mouse"];
var FRACTIONS_GOLD = ["1/10oz", "1/4oz", "1/2oz", "1oz"];
var SILVER_COIN_WEIGHTS = ["1oz", "2oz", "5oz", "10oz", "1kg"];
var GOLD_SMALL = [...FRACTIONS_GOLD, "1/20oz"];
var COIN_DESIGNS = [
  { id: "sovereign:full", label: "Full Sovereign", words: ["sovereign"], metals: { GOLD: [] }, mints: ["ROYAL MINT"], fineGrams: 7.322 },
  { id: "sovereign:half", label: "Half Sovereign", words: [], metals: { GOLD: [] }, mints: ["ROYAL MINT"], fineGrams: 3.661 },
  { id: "sovereign:quarter", label: "Quarter Sovereign", words: [], metals: { GOLD: [] }, mints: ["ROYAL MINT"], fineGrams: 1.83 },
  { id: "sovereign:double", label: "Double Sovereign", words: [], metals: { GOLD: [] }, mints: ["ROYAL MINT"], fineGrams: 14.644 },
  { id: "sovereign:quintuple", label: "Quintuple Sovereign", words: [], metals: { GOLD: [] }, mints: ["ROYAL MINT"], fineGrams: 36.61 },
  {
    id: "britannia",
    label: "Britannia",
    words: ["britannia", "brit", "britania"],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ["1oz"], PALLADIUM: ["1oz"] },
    mints: ["ROYAL MINT"]
  },
  {
    id: "krugerrand",
    label: "Krugerrand",
    words: ["krugerrand", "kruger", "krug"],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ["1oz"] },
    mints: ["RAND REFINERY"]
  },
  {
    id: "treeoflife",
    label: "Tree of Life",
    words: ["cowboy"],
    allWords: ["tree", "life"],
    metals: { GOLD: [...FRACTIONS_GOLD, "1g"], SILVER: ["1oz"] },
    mints: ["MERRION GOLD"]
  },
  {
    id: "philharmonic",
    label: "Philharmonic",
    words: ["philharmonic", "philharmoniker", "phil"],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ["1oz"] },
    mints: ["MUNZE OSTERREICH"]
  },
  {
    id: "kangaroo",
    label: "Kangaroo",
    words: ["kangaroo", "nugget"],
    metals: { GOLD: [...FRACTIONS_GOLD, "2oz"], SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ["1oz"] },
    mints: ["PERTH MINT"]
  },
  {
    id: "maple",
    label: "Maple Leaf",
    words: ["maple", "maplegram"],
    metals: { GOLD: [...FRACTIONS_GOLD, "1g"], SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ["1oz"], PALLADIUM: ["1oz"] },
    mints: ["ROYAL CANADIAN MINT"]
  },
  {
    id: "eagle",
    label: "Eagle",
    words: ["eagle"],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ["1oz"] },
    mints: []
  },
  {
    id: "queensbeasts",
    label: "Queen's Beasts",
    words: [],
    allWords: ["queen", "beast"],
    metals: { GOLD: ["1/4oz", "1oz", "2oz", "10oz"], SILVER: ["2oz", "10oz"] },
    mints: ["ROYAL MINT"],
    noSourceDefault: true
  },
  // Bullion designs sold in several metals: the metal must come from the text, the tab or the price, never a default.
  {
    id: "panda",
    label: "Panda",
    words: ["panda"],
    metals: { GOLD: ["30g", "15g", "3g", ...GOLD_SMALL], SILVER: ["30g", "1oz"] },
    mints: ["CHINA MINT"],
    noSourceDefault: true,
    needsProduct: true
  },
  {
    id: "kookaburra",
    label: "Kookaburra",
    words: ["kookaburra"],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS },
    mints: ["PERTH MINT"],
    noSourceDefault: true,
    needsProduct: true
  },
  {
    id: "koala",
    label: "Koala",
    words: ["koala"],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS },
    mints: ["PERTH MINT"],
    noSourceDefault: true,
    needsProduct: true
  },
  {
    id: "lunar",
    label: "Lunar",
    words: ["lunar"],
    match: (t) => t.has("year") && ZODIAC.some((z34) => t.has(z34)),
    consume: ["the", "serie", "series", ...ZODIAC],
    metals: { GOLD: GOLD_SMALL, SILVER: SILVER_COIN_WEIGHTS },
    mints: ["PERTH MINT"],
    noSourceDefault: true,
    needsProduct: true
  },
  {
    id: "buffalo",
    label: "Buffalo",
    words: ["buffalo"],
    metals: { GOLD: ["1oz"], SILVER: ["1oz"] },
    mints: [],
    noSourceDefault: true,
    needsProduct: true
  },
  {
    id: "angel",
    label: "Angel",
    words: ["angel"],
    consume: ["isle", "man"],
    metals: { GOLD: GOLD_SMALL, SILVER: ["1oz"], PLATINUM: ["1oz"] },
    mints: [],
    noSourceDefault: true,
    needsProduct: true
  }
];
var OBSCURE_COIN_WORDS = /* @__PURE__ */ new Set([
  "libertad",
  "noble",
  "ducat",
  "gauden",
  "dragon",
  "myth",
  "legend",
  "sheep",
  "tiger",
  "rooster",
  "ox",
  "rat",
  "monkey",
  "pig",
  "horse",
  "goat",
  "snake",
  "rabbit",
  "wedge",
  "isle",
  "man",
  "proof",
  "victoria",
  "elizabeth",
  "edward",
  "george"
]);
var COUNTRY_WORDS = /* @__PURE__ */ new Set(["south", "african", "canadian", "american", "austrian", "australian", "irish", "us", "usa", "british", "uk"]);
var FILLER_WORDS = /* @__PURE__ */ new Set([
  "mixed",
  "year",
  "unc",
  "brilliant",
  "uncirculated",
  "assorted",
  "various",
  "purity",
  "carat",
  "ct",
  "k",
  "fine",
  "fineness",
  "new",
  "best",
  "value",
  "refiner",
  "refinery",
  "minted",
  "s",
  "g",
  "oz",
  "of",
  "the",
  "a",
  "x",
  "leaf",
  "standard",
  "size",
  "sized",
  "mint",
  "other",
  "africa",
  "austria",
  "switzerland",
  "australia",
  "canada",
  "vienna"
]);
var PURITY_NUMBERS = /^(999(\.9)?|9999|995|916(\.7)?|9167|91\.67|99\.99|99\.9|585|750|375|925)$/;
var NATURAL_LABELS = /* @__PURE__ */ new Set([
  "1/10oz",
  "1/4oz",
  "1/2oz",
  "1oz",
  "2oz",
  "5oz",
  "10oz",
  "100oz",
  "1000oz",
  "1/20oz",
  "1g",
  "2g",
  "2.5g",
  "3g",
  "5g",
  "10g",
  "15g",
  "20g",
  "30g",
  "50g",
  "100g",
  "250g",
  "500g",
  "1kg",
  "5kg",
  "15kg"
]);
var MELT_RE = /\b(melt|scrap|non[\s-]*lbma)\b/;
var MAYBE_NOT_A_PRODUCT_RE = /\b(account|balance|outstanding|notes?|comments?|contact|processing|invoice|inv)\b/;
var NOT_A_PRODUCT_RE = /\b(storage|fees?|shipment|shipmint|shipping|delivery|insurance|deposit|postage|courier)\b/;
function ozLabel(v) {
  const near = (a) => Math.abs(v - a) < 1e-9;
  if (near(0.1)) return "1/10oz";
  if (near(0.25)) return "1/4oz";
  if (near(0.5)) return "1/2oz";
  if (near(0.05)) return "1/20oz";
  return `${+v.toFixed(3)}oz`;
}
function gramLabel(g) {
  if (g >= 1e3 && Math.abs(g / 1e3 - Math.round(g / 1e3)) < 1e-9) return `${Math.round(g / 1e3)}kg`;
  return `${+g.toFixed(3)}g`;
}
var OZ_SNAPS = [
  [GRAMS_PER_OZ / 10, "1/10oz"],
  [GRAMS_PER_OZ / 4, "1/4oz"],
  [GRAMS_PER_OZ / 2, "1/2oz"],
  [GRAMS_PER_OZ, "1oz"],
  [GRAMS_PER_OZ * 2, "2oz"],
  [GRAMS_PER_OZ * 5, "5oz"],
  [GRAMS_PER_OZ * 10, "10oz"]
];
function readWeights(norm2) {
  const weights = [];
  let rest = norm2;
  rest = rest.replace(/(?<![\d./])(\d*\.?\d+)\s*tolas?\b/g, (_m, num3) => {
    const v = Number(num3);
    if (!Number.isFinite(v) || v <= 0) return " ";
    weights.push({ label: `${+v.toFixed(3)}tola`, grams: v * GRAMS_PER_TOLA, unit: "g" });
    return " ";
  });
  rest = rest.replace(/(?<![\d./])(\d+\/\d+|\d*\.?\d+)(oz|g|kg)\b/g, (_m, num3, unit) => {
    let v;
    if (num3.includes("/")) {
      const [a, b] = num3.split("/").map(Number);
      v = b ? a / b : NaN;
    } else v = Number(num3);
    if (!Number.isFinite(v) || v <= 0) return " ";
    if (unit === "oz") weights.push({ label: ozLabel(v), grams: v * GRAMS_PER_OZ, unit: "oz" });
    else {
      const g = unit === "kg" ? v * 1e3 : v;
      const snap = unit === "g" ? OZ_SNAPS.find(([sg]) => Math.abs(g - sg) / sg < 0.015) : void 0;
      weights.push(snap ? { label: snap[1], grams: g, unit: "g" } : { label: gramLabel(g), grams: g, unit: "g" });
    }
    return " ";
  });
  rest = rest.replace(/\b(half|quarter|tenth)\s+oz\b/g, (_m, w) => {
    const v = w === "half" ? 0.5 : w === "quarter" ? 0.25 : 0.1;
    weights.push({ label: ozLabel(v), grams: v * GRAMS_PER_OZ, unit: "oz" });
    return " ";
  });
  let bareOz = false;
  if (weights.length === 0) {
    const frac = /(?<![\d./])(1\/10|1\/4|1\/2)(?![\d./])/.exec(rest);
    if (frac) {
      const [a, b] = frac[1].split("/").map(Number);
      weights.push({ label: ozLabel(a / b), grams: a / b * GRAMS_PER_OZ, unit: "oz" });
      rest = rest.replace(frac[1], " ");
    }
  }
  if (weights.length === 0 && /(^|\s)oz(\s|$)/.test(rest)) {
    bareOz = true;
    weights.push({ label: "1oz", grams: GRAMS_PER_OZ, unit: "oz" });
    rest = rest.replace(/(^|\s)oz(?=\s|$)/g, " ");
  }
  return { weights, rest, bareOz };
}
var empty = (problem, over = {}) => ({
  empty: false,
  problem,
  notProduct: false,
  maybeNotProduct: false,
  weight: null,
  grams: null,
  metals: /* @__PURE__ */ new Set(),
  bar: false,
  coin: false,
  bonded: false,
  design: null,
  obscureWord: null,
  refinery: null,
  leftover: [],
  text: "",
  quantity: false,
  melt: false,
  certainNot: null,
  ...over
});
var stripAccents = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
function canonRefinery(text4) {
  const key = refineryWords(String(text4 ?? ""));
  if (!key || ["UNKNOWN", "N A", "NA", "NONE"].includes(key)) return null;
  const l = listedRefinery(key);
  return l === void 0 ? key : l;
}
function sovereignVariant(tokens) {
  if (tokens.has("quintuple")) return "sovereign:quintuple";
  if (tokens.has("quarter")) return "sovereign:quarter";
  if (tokens.has("double")) return "sovereign:double";
  if (tokens.has("half")) return "sovereign:half";
  return "sovereign:full";
}
function parseProductName(text4, refineryHint) {
  let raw = stripAccents(String(text4 ?? "")).toLowerCase().trim();
  let hint = refineryHint ?? null;
  const bar = raw.indexOf("|");
  if (bar >= 0) {
    hint = hint ?? raw.slice(bar + 1);
    raw = raw.slice(0, bar).trim();
  }
  if (!raw) return { ...empty("no product name"), empty: true };
  if (/^#[a-z/0-9]+[!?]?$/i.test(raw)) return empty("sheet error");
  if (/^[\d\s.,£$€%-]*$/.test(raw)) return empty("a bare number");
  if (NOT_A_PRODUCT_RE.test(raw)) return empty(null, { notProduct: true });
  if (MAYBE_NOT_A_PRODUCT_RE.test(raw)) return empty(null, { maybeNotProduct: true });
  const found = refineryMatch(raw);
  const given = canonRefinery(hint);
  const refinery = given ?? found?.refinery ?? null;
  for (let hit = found, guard = 0; hit && guard < 5; hit = refineryMatch(raw), guard++) {
    const re = new RegExp(`(?<![a-z0-9])${hit.words.toLowerCase().split(" ").join("[^a-z0-9]+")}(?![a-z0-9])`, "g");
    raw = raw.replace(re, " ");
  }
  raw = raw.replace(/best value \(?mixed refiners?\)?/g, " ");
  raw = raw.replace(/\b10z\b/g, "1oz").replace(/\bone\s*(oz|ounce)\b/g, "1oz");
  if (/\bpool sale\b/.test(raw)) return empty(null, { certainNot: "a pool sale, not a product" });
  if (/[,&+;]|\b(and|plus|or)\b/.test(raw)) return empty("several products in one name");
  let quantity = false;
  const unquantified = raw.replace(/\b(?:(?:monster|master)\s+)?(?:box|tube|case|roll|bag)?\s*(?:of\s+)?\d+\s*x\s*(?=[a-z\d])/g, " ").replace(/\s+x\s*\d+\b/g, " ");
  if (unquantified !== raw) {
    quantity = true;
    raw = unquantified.trim();
  }
  let carat = false;
  let caratCoin = false;
  raw = raw.replace(/\b(\d{1,2})\s*(?:carat|karat|ct|k)\b/g, (_m, n) => {
    carat = true;
    if (n === "22") caratCoin = true;
    return " ";
  });
  raw = raw.replace(/([a-z])\/([a-z])/g, "$1 $2").replace(/(\d)\s*(grams?|grammes?|gms?)\b/g, "$1g").replace(/(\d)\s*(ounces?)\b/g, "$1oz").replace(/(\d)\s*(kilos?|kilograms?)\b/g, "$1kg");
  if (/\b(copper|brass|bronze|nickel)\b/.test(raw)) return empty(null, { certainNot: "a base metal, not gold, silver, platinum or palladium" });
  const cleanText = raw;
  const norm2 = normaliseProductText(raw);
  const { weights, rest, bareOz } = readWeights(norm2);
  let weight = null;
  let grams = null;
  if (weights.length > 0) {
    const first = weights[0];
    for (const w of weights.slice(1)) {
      const ratio = w.grams / first.grams;
      const sameUnit = w.unit === first.unit;
      if (sameUnit && w.label !== first.label || Math.abs(ratio - 1) > 0.12) return empty("the name gives different weights");
    }
    const pick = weights.find((w) => NATURAL_LABELS.has(w.label)) ?? first;
    weight = pick.label;
    grams = pick.grams;
  }
  const tokens = rest.split(" ").filter(Boolean);
  const set = new Set(tokens);
  const metals = /* @__PURE__ */ new Set();
  if (/\bgold\b/.test(raw)) metals.add("GOLD");
  if (/\bsilver\b/.test(raw)) metals.add("SILVER");
  if (/\bplatinum\b/.test(raw)) metals.add("PLATINUM");
  if (/\bpalladium\b/.test(raw)) metals.add("PALLADIUM");
  if (carat) metals.add("GOLD");
  if (metals.size === 0 && weights.some((w) => w.label.endsWith("tola"))) metals.add("GOLD");
  const barWord = set.has("bar") || set.has("combi") || set.has("combibar");
  const coinWord = /\bcoins?\b/.test(raw) || caratCoin;
  const bonded = set.has("bonded");
  const consumed = /* @__PURE__ */ new Set(["bar", "bonded", "silver", "platinum", "palladium"]);
  const hits = [];
  const sov = COIN_DESIGNS.find((d) => d.id === "sovereign:full");
  let obscureWord = null;
  if (set.has("sovereign") || set.has("sov")) {
    const variant = sovereignVariant(set);
    hits.push(COIN_DESIGNS.find((d) => d.id === variant) ?? sov);
    for (const w of ["sovereign", "sov", "full", "half", "quarter", "double", "quintuple"]) consumed.add(w);
  }
  for (const d of COIN_DESIGNS) {
    if (d.id.startsWith("sovereign")) continue;
    const named = d.allWords ? d.allWords.every((w) => set.has(w)) : false;
    const any = d.words.some((w) => set.has(w)) || (d.match?.(set) ?? false);
    if (!named && !any) continue;
    if (d.id === "eagle" && set.has("double")) {
      obscureWord = "double eagle";
      consumed.add("eagle");
      consumed.add("double");
      continue;
    }
    hits.push(d);
    for (const w of [...d.words, ...d.allWords ?? [], ...d.consume ?? [], "of", "irish", ...d.match ? ["year"] : []]) consumed.add(w);
    if (d.id === "maple") consumed.add("leaf");
  }
  if (hits.length > 1) return empty("several products in one name");
  const design = hits[0] ?? null;
  const leftover = [];
  if (hits[0]?.id.startsWith("sovereign") && /\bmixed\b(?!\s*years?)/.test(raw)) leftover.push("mixed");
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (consumed.has(t)) continue;
    if (COUNTRY_WORDS.has(t) || FILLER_WORDS.has(t)) continue;
    if (PURITY_NUMBERS.test(t)) continue;
    if (/^(22|24|18|9)$/.test(t) && /\b(carat|ct|k)\b/.test(rest)) continue;
    if (/^\d+(\.\d+)?$/.test(t) && /\b(purity|carat|fine|fineness)\b/.test(rest)) continue;
    leftover.push(t);
  }
  if (!obscureWord) {
    const o = leftover.find((t) => OBSCURE_COIN_WORDS.has(t));
    if (o) obscureWord = o;
  }
  if (bareOz && leftover.length > 0) {
    weight = null;
    grams = null;
  }
  const purityWords = carat || /\b(purity|fineness)\b/.test(raw);
  const odd = weight !== null && !NATURAL_LABELS.has(weight) && !weight.endsWith("tola");
  const melt = !design && (MELT_RE.test(raw) || purityWords && odd && !barWord);
  return {
    empty: false,
    problem: null,
    notProduct: false,
    maybeNotProduct: false,
    weight,
    grams,
    metals,
    bar: barWord || weights.some((w) => w.label.endsWith("tola")),
    coin: coinWord,
    bonded,
    design,
    obscureWord,
    refinery,
    leftover,
    text: cleanText,
    quantity,
    melt,
    certainNot: null
  };
}
var SKU_DESIGN = {
  BRITANNIA: "britannia",
  KRUGERRAND: "krugerrand",
  MAPLE: "maple",
  MAPLELEAF: "maple",
  PHILHARMONIC: "philharmonic",
  KANGAROO: "kangaroo",
  TREEOFLIFE: "treeoflife",
  USEAGLE: "eagle",
  US: "eagle",
  QUEENSBEASTS: "queensbeasts"
};
function isMetal(m) {
  return !!m && METALS.includes(m);
}
function parseSku(p) {
  const metal = isMetal(p.metal) ? p.metal : null;
  if (!metal) return null;
  const parts = p.sku.toUpperCase().split("-");
  let weight = null;
  let design = null;
  let form = p.category === "BAR" || p.category === "COIN" ? p.category : null;
  let bonded = false;
  let melt = false;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const w = /^(\d+(?:\.\d+)?|\d+\/\d+)(OZ|G|KG|TOLA)$/.exec(part);
    if (w) {
      weight = `${w[1]}${w[2].toLowerCase()}`;
      continue;
    }
    if (part === "BAR") form = "BAR";
    else if (part === "COIN") form = "COIN";
    else if (part === "BONDED") bonded = true;
    else if (part === "MELT") melt = true;
    else if (part === "FULL" || part === "HALF" || part === "DOUBLE" || part === "QUARTER" || part === "QUINTUPLE") {
      if (parts[i + 1] === "SOVEREIGN") design = `sovereign:${part.toLowerCase()}`;
    } else if (SKU_DESIGN[part]) design = SKU_DESIGN[part];
  }
  return { p, metal, weight, form, design, bonded, melt };
}
var indexCache = /* @__PURE__ */ new WeakMap();
function parseSpecific(s, byId) {
  const pricing = s.pricingProductId != null ? byId.get(s.pricingProductId) : void 0;
  const refineryField = canonRefinery(s.refinery);
  const parsed = parseProductName(s.genericNorm || s.name, refineryField);
  const refinery = refineryField ?? parsed.refinery;
  let metal = pricing?.metal ?? (isMetal(s.metal) ? s.metal : null);
  if (!metal && parsed.metals.size === 1) metal = [...parsed.metals][0];
  const form = pricing?.form ?? (parsed.bar ? "BAR" : parsed.design || parsed.coin ? "COIN" : refinery ? "BAR" : null);
  const design = parsed.design?.id ?? null;
  const qualifiers = [...parsed.leftover, ...form === "BAR" && design ? [design] : []].sort();
  return {
    s,
    metal,
    weight: parsed.weight,
    form,
    design: form === "BAR" ? null : design,
    refinery: parsed.design && refinery && parsed.design.mints.includes(refinery) && form !== "BAR" ? null : refinery,
    qualifiers,
    pricingId: s.pricingProductId ?? null,
    nameNorm: informative(normaliseProductText(s.name)) ? normaliseProductText(s.name) : null,
    genericNormClean: s.genericNorm && informative(normaliseProductText(s.genericNorm)) ? normaliseProductText(s.genericNorm) : null
  };
}
var NON_INFORMATIVE = /* @__PURE__ */ new Set(["bar", "mixed", "best", "value", "refiner", "year", "gold", "silver", "platinum", "palladium", "oz", "g", "coin", "of", "the", "a"]);
function informative(norm2) {
  return norm2.split(" ").some((t) => t && !NON_INFORMATIVE.has(t) && !/^(\d+(\.\d+)?|\d+\/\d+)(oz|g|kg|tola)?$/.test(t));
}
function indexOf2(cat) {
  const hit = indexCache.get(cat);
  if (hit) return hit;
  const rows = cat.pricing.map(parseSku).filter((r) => r !== null);
  const byId = new Map(rows.map((r) => [r.p.id, r]));
  const specifics = (cat.specific ?? []).map((s) => parseSpecific(s, byId));
  const idx = { rows, byId, specifics };
  indexCache.set(cat, idx);
  return idx;
}
function findRow(idx, metal, weight, form, design, bonded = false) {
  return idx.rows.find((r) => r.metal === metal && r.weight === weight && r.form === form && r.design === design && r.bonded === bonded);
}
var toSources = (s) => (Array.isArray(s) ? s : String(s ?? "").split(/[\s,|]+/)).map((x) => x.toLowerCase()).filter(Boolean);
var isZohoSource = (sources) => sources.some((s) => /zoho|invoice_line|purchase_order/.test(s));
function fitMetals(perOz, spot) {
  return METALS.filter((m) => {
    const s = spot[m];
    if (!s || s <= 0) return false;
    return perOz >= s * 0.85 && perOz <= s * (m === "SILVER" ? 1.6 : 1.25);
  });
}
function hasPgmVariant(idx, design, weight) {
  return idx.rows.some(
    (r) => (r.metal === "PLATINUM" || r.metal === "PALLADIUM") && (design ? r.design === design.id : true) && (weight === null || r.weight === weight)
  );
}
function readMetal(p, input, grams, designMetals, pgmVariant) {
  if (p.metals.size > 1) return { metal: null, confidence: "UNCLEAR", how: "", problem: "the name gives two metals" };
  if (p.metals.size === 1) return { metal: [...p.metals][0], confidence: "CERTAIN", how: "text", from: "text" };
  const sources = toSources(input.sources);
  const hint = isMetal(input.metal) ? input.metal : null;
  const zoho = isZohoSource(sources) && !p.design?.noSourceDefault ? "GOLD" : null;
  const base = hint ?? zoho;
  const baseHow = hint ? "tab" : "zoho convention";
  const baseFrom = hint ? "tab" : "source";
  const baseConf = (hint === "SILVER" || !hint && zoho) && pgmVariant ? "LIKELY" : "CERTAIN";
  const ev = input.metalEvidence;
  if (ev && isMetal(ev.metal)) {
    if (hint && hint === ev.metal) return { metal: hint, confidence: baseConf, how: "tab, price agrees", from: "tab" };
    if (hint) return { metal: ev.metal, confidence: "LIKELY", how: `rows priced as ${ev.metal.toLowerCase()}, not ${hint.toLowerCase()} (tab)`, from: "price" };
    if (ev.from === "tab") return { metal: ev.metal, confidence: ev.metal === "SILVER" && pgmVariant ? "LIKELY" : "CERTAIN", how: "tab", from: "tab" };
    const agrees = zoho === ev.metal;
    return {
      metal: ev.metal,
      confidence: ev.rows >= 2 || agrees ? "CERTAIN" : "LIKELY",
      how: `price per oz of ${ev.rows} row${ev.rows === 1 ? "" : "s"} fits ${ev.metal.toLowerCase()}`,
      from: "price"
    };
  }
  let fits = [];
  const price = input.unitPrice;
  if (price && price > 0 && input.spot && grams && grams > 0) fits = fitMetals(price / (grams / GRAMS_PER_OZ), input.spot);
  if (fits.length === 1) {
    if (base === fits[0]) return { metal: base, confidence: "CERTAIN", how: `${baseHow}, price agrees`, from: baseFrom };
    return {
      metal: fits[0],
      from: "price",
      confidence: "LIKELY",
      how: base ? `price per oz fits ${fits[0].toLowerCase()}, not ${base.toLowerCase()} (${baseHow})` : "price per oz"
    };
  }
  if (fits.length > 1) {
    if (base && fits.includes(base)) return { metal: base, confidence: "LIKELY", how: `${baseHow}, price fits ${fits.length} metals`, from: baseFrom };
    return { metal: null, confidence: "UNCLEAR", how: "", problem: "the price fits more than one metal" };
  }
  if (base) return { metal: base, confidence: baseConf, how: baseHow, from: baseFrom };
  if (designMetals.length === 1) return { metal: designMetals[0], confidence: "CERTAIN", how: "only metal sold", from: "default" };
  return { metal: null, confidence: "UNCLEAR", how: "", problem: "no metal in the name or from the source" };
}
var RANK = { CERTAIN: 2, LIKELY: 1, UNCLEAR: 0 };
var lower = (a, b) => RANK[a] <= RANK[b] ? a : b;
var metalWord = (m) => m.toLowerCase();
var none2 = (reason, over = {}) => ({ outcome: "NONE", confidence: "UNCLEAR", reason, ...over });
function matchProductName(input, cat) {
  const seen = {};
  const r = matchInner(input, cat, seen);
  let m = seen.from && r.metal ? { ...r, metalFrom: seen.from } : r;
  if (m.productId !== void 0 && (m.outcome === "PRICING" || m.outcome === "SPECIFIC") && parseProductName(input.text, input.refinery ?? null).quantity) {
    const idx = indexOf2(cat);
    const name = m.outcome === "SPECIFIC" && m.salesProductId !== void 0 ? idx.specifics.find((x) => x.s.id === m.salesProductId)?.s.name : idx.byId.get(m.productId)?.p.name;
    m = { ...m, confidence: "LIKELY", question: `Match to ${name ?? "the single item"}? (quantity is on the row)` };
  }
  if (m.confidence === "LIKELY" && !m.question && m.outcome !== "NOT_A_PRODUCT" && m.productId !== void 0) {
    const idx = indexOf2(cat);
    const name = m.outcome === "SPECIFIC" && m.salesProductId !== void 0 ? idx.specifics.find((s) => s.s.id === m.salesProductId)?.s.name : idx.byId.get(m.productId)?.p.name;
    if (name) return { ...m, question: `Match to ${name}?` };
  }
  return m;
}
var NOT_A_PRODUCT_WORDS_RE = new RegExp(NOT_A_PRODUCT_RE.source, "gi");
function matchInner(input, cat, seen) {
  const idx = indexOf2(cat);
  let p = parseProductName(input.text, input.refinery ?? null);
  if (p.empty) return none2("no product name");
  if (p.notProduct) {
    const rest = parseProductName(String(input.text ?? "").replace(NOT_A_PRODUCT_WORDS_RE, " "), input.refinery ?? null);
    if (rest.weight !== null || rest.design !== null) {
      return { outcome: "NOT_A_PRODUCT", confidence: "LIKELY", reason: "has a fee or shipment word, but also a weight or design", question: "Mark as not a product?" };
    }
    return { outcome: "NOT_A_PRODUCT", confidence: "CERTAIN", reason: "a fee, shipment or deposit, not a product" };
  }
  if (p.maybeNotProduct) {
    return { outcome: "NOT_A_PRODUCT", confidence: "LIKELY", reason: "looks like a note, balance or account line", question: "Mark as not a product?" };
  }
  if (p.certainNot) return { outcome: "NOT_A_PRODUCT", confidence: "CERTAIN", reason: p.certainNot };
  const exact = exactSpecific(input, p, idx);
  if (exact) return exact;
  if (p.problem) return none2(p.problem);
  const foreign = readForeignCoin(p.text);
  if (foreign && [...p.metals].every((m2) => m2 === "GOLD") && !p.melt) {
    const hint = isMetal(input.metal) ? input.metal : null;
    if (hint && hint !== "GOLD") return none2(`${foreign.coin.name} is a gold coin`, { metal: hint });
    const spec = idx.specifics.find((s) => s.s.name.toLowerCase() === foreign.coin.name.toLowerCase());
    if (!spec || spec.pricingId == null) return none2(`no ${foreign.coin.name} product`, { catalogueGap: true, metal: "GOLD" });
    seen.from = p.metals.has("GOLD") ? "text" : "default";
    return {
      outcome: "SPECIFIC",
      productId: spec.pricingId,
      salesProductId: spec.s.id,
      confidence: foreign.sure ? "CERTAIN" : "LIKELY",
      reason: `${foreign.coin.name}, gold coin sold by melt value`,
      ...foreign.sure ? {} : { question: `Match to ${foreign.coin.name}?` },
      metal: "GOLD"
    };
  }
  if (p.melt) return matchMelt(input, p, idx, seen);
  const design = p.design;
  const isSovereign = !!design && design.id.startsWith("sovereign");
  const designMetals = design ? Object.keys(design.metals) : [];
  const grams = p.grams ?? (design?.fineGrams ?? null);
  const m = readMetal(p, input, grams, designMetals, hasPgmVariant(idx, design, p.weight));
  if (!m.metal) return none2(m.problem ?? "no metal", { weight: p.weight ?? void 0 });
  const metal = m.metal;
  seen.from = m.from;
  if (metal === "SILVER" && p.weight && /^\d+(\.\d+)?oz$/.test(p.weight) && !p.design) {
    const oz = parseFloat(p.weight);
    if (oz >= 900 && oz <= 1100 && p.weight !== "1000oz") p = { ...p, weight: "1000oz", bar: true };
  }
  const tola = !!p.weight && p.weight.endsWith("tola");
  if (tola) {
    if (metal !== "GOLD") return none2(`no ${metalWord(metal)} ${p.weight.replace("tola", " tola")} bar row`, { metal, weight: p.weight });
    const row = findRow(idx, "GOLD", p.weight, "BAR", null);
    if (!row) return none2(`no ${p.weight.replace("tola", " tola")} bar row`, { catalogueGap: true, metal, weight: p.weight });
  } else if (p.weight && !NATURAL_LABELS.has(p.weight)) return none2(`unusual weight ${p.weight}`, { metal, weight: p.weight });
  let conf = m.confidence;
  const parts = [];
  const metalPart = `${metalWord(metal)} (${m.how})`;
  const unsure = (c) => {
    conf = lower(conf, c);
  };
  const refinery = design && p.refinery && design.mints.includes(p.refinery) && !p.bar ? null : p.refinery;
  const sources = toSources(input.sources);
  let form = null;
  let formNote = "";
  if (p.bar && p.coin && !design) return none2("the name says both bar and coin");
  if (p.bar) form = "BAR";
  else if (p.coin || design || p.obscureWord) form = "COIN";
  else if (p.weight && !refinery && p.leftover.length > 0) {
    form = "COIN";
    formNote = "named piece with no bar word";
    unsure("LIKELY");
  }
  if (!form && p.weight) {
    const fractional = ["1/10oz", "1/4oz", "1/2oz"].includes(p.weight);
    if (refinery && !p.leftover.length) {
      form = "BAR";
      formNote = "refinery names a bar";
      if (!BAR_REFINERIES.has(refinery)) unsure("LIKELY");
    } else if (sources.includes("stock_coins") && !sources.includes("stock_bars")) {
      form = "COIN";
      formNote = "stock coin";
      unsure("LIKELY");
    } else if (sources.includes("stock_bars") && !sources.includes("stock_coins")) {
      form = "BAR";
      formNote = "stock bar";
      unsure("LIKELY");
    } else if (metal === "SILVER" && /oz$/.test(p.weight) && !p.leftover.length) {
      form = "COIN";
      formNote = "silver by the ounce with no bar word";
      unsure("LIKELY");
    } else if (fractional && metal === "GOLD") {
      form = "COIN";
      formNote = "fractional gold is a coin";
      unsure("LIKELY");
    } else if (/g$/.test(p.weight) && !["1g", "2g"].includes(p.weight)) {
      form = "BAR";
      formNote = "weight in grams";
      unsure("LIKELY");
    } else if (/kg$/.test(p.weight)) {
      form = "BAR";
      formNote = "weight in kg";
      unsure("LIKELY");
    }
  }
  if (isSovereign && design) {
    if (metal !== "GOLD") return none2("not in catalogue", { metal });
    const row = findRow(idx, "GOLD", null, "COIN", design.id);
    if (!row) return none2(`no ${design.label} pricing row`, { catalogueGap: true, metal });
    const quals = p.leftover.filter((t) => !OBSCURE_COIN_WORDS.has(t) || t === "proof");
    return finish(idx, row, { ...p, design }, metal, "COIN", null, quals.length ? lower(conf, "LIKELY") : conf, [design.label, metalPart], quals.length ? `Match to ${row.p.name}?` : void 0, quals, null, conf);
  }
  if (form === "BAR") {
    if (!p.weight) return none2("a bar with no weight", { metal });
    const row = (p.bonded ? findRow(idx, metal, p.weight, "BAR", null, true) : void 0) ?? findRow(idx, metal, p.weight, "BAR", null);
    if (!row) return none2(`no ${p.weight} ${metalWord(metal)} bar pricing row`, { catalogueGap: true, metal, weight: p.weight });
    if (p.bonded && !row.bonded) unsure("LIKELY");
    const quals = [...p.leftover, ...design ? [design.id] : []].sort();
    const explained = conf;
    if (p.leftover.length > 0) unsure("LIKELY");
    if (formNote) parts.push(formNote);
    return finish(idx, row, p, metal, "BAR", refinery, conf, [p.weight, "bar", ...design ? [design.label] : [], ...refinery ? [refinery] : [], metalPart, ...parts], p.leftover.length ? `Match to ${row.p.name}?` : void 0, quals, null, explained);
  }
  if (form === "COIN") {
    const obscure = !design && (p.obscureWord || p.leftover.length > 0);
    const weight = p.weight;
    const bonded = p.bonded;
    if (!weight) {
      if (design) {
        const w = design.metals[metal];
        if (!w) return none2(`${design.label} is not sold in ${metalWord(metal)}`, { metal });
        const row = findRow(idx, metal, "1oz", "COIN", design.id) ?? findRow(idx, metal, "1oz", "COIN", null);
        if (!row) return none2(`no 1oz ${metalWord(metal)} ${design.label} row`, { catalogueGap: true, metal });
        const q = row.design ? row.p.name : `1oz ${design.label}`;
        return {
          outcome: "PRICING",
          productId: row.p.id,
          confidence: "LIKELY",
          reason: `${design.label} + ${metalPart}, no weight`,
          question: `Match to ${q}?`,
          metal,
          catalogueGap: row.design ? void 0 : true
        };
      }
      return none2("a coin with no weight", { metal });
    }
    const base = { outcome: "PRICING", confidence: conf, reason: "", metal, weight };
    const reasonBase = [weight, "coin", ...design ? [design.label] : p.obscureWord ? [p.obscureWord] : [], metalPart];
    if (formNote) reasonBase.push(formNote);
    const dedicated = design ? findRow(idx, metal, weight, "COIN", design.id, bonded) : void 0;
    const generic = (bonded ? findRow(idx, metal, weight, "COIN", null, true) : void 0) ?? findRow(idx, metal, weight, "COIN", null);
    if (design) {
      const sold = design.metals[metal]?.includes(weight) ?? false;
      const row = dedicated ?? findRow(idx, metal, weight, "COIN", design.id) ?? generic;
      if (!row) {
        return none2(`needs generic ${weight} ${metalWord(metal)} coin row`, { catalogueGap: true, metal, weight });
      }
      let c = conf;
      if (!sold) c = lower(c, "LIKELY");
      const quals = p.leftover;
      const explained = c;
      if (p.leftover.length > 0) c = lower(c, "LIKELY");
      const res = finish(idx, row, p, metal, "COIN", refinery, c, reasonBase.concat(row.design ? [] : ["generic row"]), c === "LIKELY" ? `Match to ${row.p.name}?` : void 0, quals, design.id, explained);
      if (design.needsProduct && res.outcome !== "SPECIFIC") {
        return { ...res, confidence: lower(res.confidence, "LIKELY"), catalogueGap: true, question: res.question ?? `Match to ${row.p.name}?` };
      }
      return res;
    }
    if (!generic) {
      const gap = `needs generic ${weight} ${metalWord(metal)} coin row`;
      return none2(gap, { catalogueGap: true, metal, weight });
    }
    if (obscure) {
      return {
        ...base,
        productId: generic.p.id,
        confidence: lower(conf, "LIKELY"),
        reason: `${reasonBase.join(" + ")}; not in the catalogue, generic coin row`,
        question: `Match to ${generic.p.name}?`,
        catalogueGap: true
      };
    }
    return finish(idx, generic, p, metal, "COIN", refinery, conf, reasonBase, void 0, [], null);
  }
  if (p.weight) return none2(`${p.weight} ${metalWord(metal)}: bar or coin?`, { metal, weight: p.weight });
  return none2("no weight, form or design", { metal });
}
function exactSpecific(input, p, idx) {
  if (idx.specifics.length === 0 || p.quantity || p.design) return null;
  const rawText = stripAccents(String(input.text ?? ""));
  const bar = rawText.indexOf("|");
  const base = normaliseProductText(bar >= 0 ? rawText.slice(0, bar) : rawText);
  if (!base) return null;
  const given = canonRefinery(input.refinery ?? (bar >= 0 ? rawText.slice(bar + 1) : null));
  const cands = idx.specifics.filter(
    (s) => s.pricingId != null && (s.nameNorm === base && (!s.refinery || !given || s.refinery === given) || s.genericNormClean === base && (s.refinery ?? null) === (given ?? null))
  );
  if (cands.length !== 1) return null;
  const c = cands[0];
  const row = idx.byId.get(c.pricingId);
  const sm = row?.metal ?? c.metal;
  const hint = isMetal(input.metal) ? input.metal : null;
  if (sm && p.metals.size > 0 && !p.metals.has(sm)) return null;
  if (sm && hint && hint !== sm) return null;
  if (sm && input.metalEvidence && input.metalEvidence.metal !== sm) return null;
  return {
    outcome: "SPECIFIC",
    productId: c.pricingId,
    salesProductId: c.s.id,
    confidence: "CERTAIN",
    reason: `the name is ${c.s.name}`,
    ...sm ? { metal: sm } : {}
  };
}
function matchMelt(input, p, idx, seen) {
  const m = readMetal(p, input, p.grams, [], false);
  if (!m.metal) return none2(`melt or scrap: ${m.problem ?? "no metal"}`);
  seen.from = m.from;
  const row = idx.rows.find((r) => r.melt && r.metal === m.metal);
  if (!row) return none2(`no ${metalWord(m.metal)} melt row`, { catalogueGap: true, metal: m.metal });
  const weak = m.from === "source" || m.from === "default";
  return {
    outcome: "PRICING",
    productId: row.p.id,
    confidence: weak ? lower(m.confidence, "LIKELY") : m.confidence,
    reason: `melt or scrap + ${metalWord(m.metal)} (${m.how})`,
    metal: m.metal
  };
}
var BAR_REFINERIES = /* @__PURE__ */ new Set([
  "PAMP SUISSE",
  "VALCAMBI SUISSE",
  "ARGOR-HERAEUS",
  "HERAEUS",
  "UMICORE",
  "METALOR",
  "CREDIT SUISSE",
  "BAIRD & CO",
  "C HAFNER",
  "JOHNSON MATTHEY",
  "NADIR",
  "DEGUSSA",
  "OPM METALS",
  "ELEMENTAL",
  "SEMPSA",
  "ASSAY OFFICE"
]);
function finish(idx, row, p, metal, form, refinery, conf, reasonParts, question, qualifiers, designId, confIfSpecific) {
  const weightKey = designId?.startsWith("sovereign") || p.design?.id.startsWith("sovereign") ? null : p.weight;
  const designKey = form === "BAR" ? null : p.design?.id ?? designId;
  const quals = [...qualifiers].sort();
  const reasonText = reasonParts.join(" + ");
  const searchable = refinery !== null || quals.length > 0 || designKey !== null;
  if (searchable) {
    const cands = idx.specifics.filter(
      (s) => s.metal === metal && s.form === form && s.weight === weightKey && s.design === designKey && s.refinery === refinery && s.qualifiers.length === quals.length && s.qualifiers.every((q, i) => q === quals[i])
    );
    if (cands.length === 1 && cands[0].pricingId != null) {
      const c = cands[0];
      return {
        outcome: "SPECIFIC",
        productId: c.pricingId,
        salesProductId: c.s.id,
        confidence: confIfSpecific ?? conf,
        reason: `${reasonText} -> ${c.s.name}`,
        ...(confIfSpecific ?? conf) === "LIKELY" ? { question: `Match to ${c.s.name}?` } : {},
        metal,
        weight: p.weight ?? void 0
      };
    }
    if (cands.length > 1) {
      return {
        outcome: "PRICING",
        productId: row.p.id,
        confidence: conf,
        reason: `${reasonText}; ${cands.length} specific products fit, pricing only`,
        ...question ? { question } : {},
        metal,
        weight: p.weight ?? void 0
      };
    }
  }
  return {
    outcome: "PRICING",
    productId: row.p.id,
    confidence: conf,
    reason: reasonText,
    ...question ? { question } : {},
    metal,
    weight: p.weight ?? void 0
  };
}

// src/metal-evidence.ts
var GRAMS_PER_OZ2 = 31.1034768;
var METALS2 = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"];
var FIT_LOW = 0.8;
var FIT_HIGH = 1.3;
var FIT_HIGH_SILVER = 1.6;
function metalsFitting(perOz, spot) {
  return METALS2.filter((m) => {
    const s = spot[m];
    if (!s || s <= 0) return false;
    return perOz >= s * FIT_LOW && perOz <= s * (m === "SILVER" ? FIT_HIGH_SILVER : FIT_HIGH);
  });
}
function priceMetalEvidence(rows, grams, spotOn) {
  if (!grams || grams <= 0) return null;
  const ounces = grams / GRAMS_PER_OZ2;
  const votes = /* @__PURE__ */ new Map();
  let priced = 0;
  for (const r of rows) {
    if (!r.date || !r.unitPrice || r.unitPrice <= 0) continue;
    const spot = spotOn(r.date);
    if (!spot) continue;
    priced++;
    const fits = metalsFitting(r.unitPrice / ounces, spot);
    if (fits.length === 1) votes.set(fits[0], (votes.get(fits[0]) ?? 0) + 1);
  }
  if (votes.size !== 1) return null;
  const [metal, n] = [...votes.entries()][0];
  if (n * 2 < priced) return null;
  return { metal, rows: n };
}
function spotLookup(rows) {
  const byMetal = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const list2 = byMetal.get(r.metal) ?? [];
    list2.push({ date: r.date, price: r.price });
    byMetal.set(r.metal, list2);
  }
  for (const list2 of byMetal.values()) list2.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const WEEK_MS = 7 * 864e5;
  const cache = /* @__PURE__ */ new Map();
  return (date) => {
    if (cache.has(date)) return cache.get(date);
    const out = {};
    const t = Date.parse(date);
    for (const [metal, list2] of byMetal) {
      let lo = 0;
      let hi = list2.length - 1;
      let at = -1;
      while (lo <= hi) {
        const mid = lo + hi >> 1;
        if (list2[mid].date <= date) {
          at = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      if (at >= 0 && t - Date.parse(list2[at].date) <= WEEK_MS) out[metal] = list2[at].price;
    }
    const res = Object.keys(out).length ? out : void 0;
    cache.set(date, res);
    return res;
  };
}

// src/product-resolver.ts
var UNKNOWN_REFINERY = /* @__PURE__ */ new Set(["", "UNKNOWN", "N A", "NA", "NONE"]);
function normaliseRefinery(text4, aliases = []) {
  const key = refineryWords(String(text4 ?? ""));
  if (UNKNOWN_REFINERY.has(key)) return null;
  for (const a of aliases) if (refineryWords(a.alias) === key) return listedRefinery(a.refinery) ?? refineryWords(a.refinery);
  const listed = listedRefinery(key);
  return listed === void 0 ? key : listed;
}
var lookup = (m, k) => !m ? void 0 : m instanceof Map ? m.get(k) : Object.prototype.hasOwnProperty.call(m, k) ? m[k] : void 0;
function metalAwareAlias(key, text4, metal, ambiguous) {
  if (!ambiguous || metal !== "GOLD" && metal !== "SILVER" || metalInText(text4)) return key;
  return `${key} ${metal.toLowerCase()}`;
}
function aliasKey(productNorm, refinery) {
  return refinery ? `${productNorm}|${refinery}` : productNorm;
}
function matchGeneric(norm2, refinery, key, salesProducts, done) {
  if (!norm2) return { status: "REVIEW", reason: "NO_MATCH", key, candidateIds: [] };
  const sameName = salesProducts.filter((p) => p.genericNorm === norm2);
  if (sameName.length === 0) return { status: "REVIEW", reason: "NO_MATCH", key, candidateIds: [] };
  if (refinery) {
    const exact = sameName.filter((p) => normaliseRefinery(p.refinery) === refinery);
    if (exact.length === 1) return done("GENERIC_REFINERY", exact[0].id);
    if (exact.length > 1) return { status: "REVIEW", reason: "AMBIGUOUS", key, candidateIds: exact.map((p) => p.id) };
    return { status: "REVIEW", reason: "NO_MATCH", key, candidateIds: sameName.map((p) => p.id) };
  }
  const noRefinery2 = sameName.filter((p) => normaliseRefinery(p.refinery) === null);
  if (noRefinery2.length === 1) return done("GENERIC_REFINERY", noRefinery2[0].id);
  return { status: "REVIEW", reason: sameName.length ? "NEEDS_REFINERY" : "NO_MATCH", key, candidateIds: sameName.map((p) => p.id) };
}
function resolveProduct(input, data) {
  const byId = new Map(data.salesProducts.map((p) => [p.id, p]));
  const done = (method, id) => {
    const p = byId.get(id);
    return p ? { status: "RESOLVED", method, salesProductId: p.id, pricingProductId: p.pricingProductId } : null;
  };
  const norm2 = (input.productNorm?.trim() || normaliseProductText(input.productText)).trim();
  const refinery = normaliseRefinery(input.refinery, data.refineryAliases);
  const key = aliasKey(norm2, refinery);
  const bcItemNo = input.bcItemNo?.trim();
  if (bcItemNo) {
    const hit = lookup(data.bcItems, bcItemNo);
    const r = hit !== void 0 ? done("BC_ITEM", hit) : null;
    if (r) return r;
  }
  for (const k of refinery ? [key, norm2] : [norm2]) {
    const hit = lookup(data.aliases, k);
    const r = hit !== void 0 ? done("ALIAS", hit) : null;
    if (r) return r;
  }
  return matchGeneric(norm2, refinery, key, data.salesProducts, done);
}
var MELT_RE2 = /\b(scrap|melt)\b/;
var engineCatalogues = /* @__PURE__ */ new WeakMap();
function engineCatalogue(data) {
  const hit = engineCatalogues.get(data);
  if (hit) return hit;
  const built = {
    pricing: data.catalogue.map((c) => ({ id: c.id, sku: c.sku, name: c.sku, metal: c.metalType })),
    specific: (data.salesProducts ?? []).filter((p) => typeof p.id === "number" || typeof p.id === "string").map((p) => ({ id: p.id, name: p.name, metal: p.metal ?? null, refinery: p.refinery, genericNorm: p.genericNorm, pricingProductId: p.pricingProductId }))
  };
  engineCatalogues.set(data, built);
  return built;
}
var WEIGHT_TOKEN = /^(\d+\/\d+|\d+(?:\.\d+)?)(oz|g|kg)$/;
function bestDecision(keyTokens, refinery, decisions, refineryAliases, rowMetal) {
  let best = null;
  let bestTokens = 0;
  let bestFits = false;
  for (const d of decisions) {
    if (d.productId === null && d.salesProductId === null && !d.noProduct) continue;
    if (d.decidedBy === "RULE" && !d.noProduct && d.metalHint !== rowMetal) continue;
    const bar = d.key.indexOf("|");
    const name = (bar < 0 ? d.key : d.key.slice(0, bar)).trim();
    const decisionRefinery = bar < 0 ? null : normaliseRefinery(d.key.slice(bar + 1).trim(), refineryAliases);
    if (bar >= 0 && decisionRefinery !== refinery) continue;
    if (!aliasOk(name, name)) continue;
    const tokens = [...new Set(name.split(" ").filter(Boolean))];
    if (tokens.length < 2 && !tokens.some((t) => WEIGHT_TOKEN.test(t))) continue;
    if (!tokens.every((t) => keyTokens.has(t))) continue;
    const fits = !d.metalHint || d.metalHint === rowMetal;
    if (!best || fits && !bestFits || fits === bestFits && (tokens.length > bestTokens || tokens.length === bestTokens && d.key.length > best.key.length)) {
      best = d;
      bestTokens = tokens.length;
      bestFits = fits;
    }
  }
  return best;
}
function resolveRowProduct(input, data) {
  const text4 = input.productText ?? "";
  const key = normaliseProductText(text4);
  const refinery = normaliseRefinery(input.refinery, data.refineryAliases);
  const byId = new Map((data.salesProducts ?? []).map((p) => [p.id, p]));
  const base = {
    key,
    refinery,
    metalFromText: metalInText(text4),
    melt: MELT_RE2.test(key)
  };
  const viaSales = (method, id) => {
    const p = byId.get(id);
    return p ? { ...base, refinery: p.refinery ?? refinery, pricingProductId: p.pricingProductId, salesProductId: p.id, method } : null;
  };
  const bcItemNo = input.bcItemNo?.trim();
  if (bcItemNo) {
    const hit = lookup(data.bcItems, bcItemNo);
    const r = hit !== void 0 ? viaSales("BC_ITEM", hit) : null;
    if (r) return r;
  }
  if (key && aliasOk(text4, key)) {
    const keyTokens = new Set(key.split(" "));
    const textMetal = metalInText(text4);
    const rowMetalWord = textMetal ?? input.metal;
    if (rowMetalWord === "GOLD" || rowMetalWord === "SILVER") keyTokens.add(rowMetalWord.toLowerCase());
    const d = bestDecision(keyTokens, refinery, data.decisions ?? [], data.refineryAliases, textMetal ?? input.metal);
    if (d?.noProduct) return { ...base, pricingProductId: null, salesProductId: null, method: "NOT_PRODUCT" };
    if (d) {
      const r = d.salesProductId !== null ? viaSales("ALIAS", d.salesProductId) : null;
      if (r) return { ...r, pricingProductId: r.pricingProductId ?? d.productId };
      if (d.productId !== null) return { ...base, pricingProductId: d.productId, salesProductId: null, method: "ALIAS" };
    }
  }
  const matched = matchProductName(
    { text: text4, refinery: input.refinery ?? null, metal: input.metal },
    engineCatalogue(data)
  );
  if (matched.confidence === "CERTAIN" && (matched.outcome === "PRICING" || matched.outcome === "SPECIFIC") && matched.productId !== void 0) {
    if (matched.outcome === "SPECIFIC" && matched.salesProductId !== void 0) {
      const r = viaSales("GENERIC_REFINERY", matched.salesProductId);
      if (r) return { ...r, pricingProductId: matched.productId };
    }
    return { ...base, pricingProductId: matched.productId, salesProductId: null, method: "RULE" };
  }
  const rowMetal = metalInText(text4) ?? input.metal;
  const catalogueMetal = new Map(data.catalogue.map((c) => [c.id, c.metalType]));
  const sameMetal = (p) => {
    const m = p.pricingProductId !== null ? catalogueMetal.get(p.pricingProductId) : p.metal;
    if (!m) return false;
    return m === rowMetal || m === "PGM" && (rowMetal === "PLATINUM" || rowMetal === "PALLADIUM");
  };
  const salesProducts = (data.salesProducts ?? []).filter(sameMetal);
  if (key && salesProducts.length > 0) {
    const g = matchGeneric(key, refinery, aliasKey(key, refinery), salesProducts, (method, id) => {
      const p = byId.get(id);
      return p ? { status: "RESOLVED", method, salesProductId: p.id, pricingProductId: p.pricingProductId } : null;
    });
    if (g.status === "RESOLVED") {
      const r = viaSales("GENERIC_REFINERY", g.salesProductId);
      if (r) return r;
    }
  }
  const guess = pricingSkuFor(text4, input.metal);
  if (guess) {
    for (const sku of guess.candidates) {
      const p = data.catalogue.find((c) => c.sku === sku);
      if (p) return { ...base, pricingProductId: p.id, salesProductId: null, method: "RULE" };
    }
  }
  return { ...base, pricingProductId: null, salesProductId: null, method: "NONE" };
}

// src/detect-file-type.ts
var KIND_OF_TAB = {
  bc_journal: "bc_stock",
  bc_tracking: "bc_stock",
  bc_items: "bc_stock",
  bc_orders: "bc_awaiting_collection",
  zoho_products_sold: "zoho_export",
  zoho_invoices: "zoho_export",
  zoho_payments: "zoho_export",
  zoho_po: "zoho_export",
  zoho_contacts: "zoho_export",
  zoho_vendors: "zoho_export",
  customer_safe: "stock_sheet",
  stock_bars: "stock_sheet",
  stock_coins: "stock_sheet",
  trade_purchases: "tradesheet",
  trade_sales: "tradesheet"
};
var norm = (headers) => {
  const h = {};
  for (const x of headers) h[String(x).toLowerCase().replace(/:$/, "").trim()] = true;
  return h;
};
function detectTabType(tab, headers) {
  if (/^es\b|^es[\s_-]|spain|barcelona|madrid/i.test(tab)) return "";
  const h = norm(headers);
  if (h["item no."] && h["qty. (calculated)"]) return "bc_journal";
  if (h["item no."] && h["serial no."] && h["remaining quantity"]) return "bc_tracking";
  if (h["item_name"] && h["quantity_sold"]) return "zoho_products_sold";
  if (/^items$/i.test(tab) && headers.length <= 4) return "bc_items";
  if (h["invoice number"] && h["item desc"] && h["invoice status"]) return "zoho_invoices";
  if (h["payment mode"] && h["invoice number"] && !h["item desc"]) return "zoho_payments";
  if (h["purchase order number"]) return "zoho_po";
  if (h["customer number"] && h["display name"]) return "zoho_contacts";
  if (h["vendor number"] && h["display name"]) return "zoho_vendors";
  if (h["external document no."] && h["amount prepaid"]) return "bc_orders";
  if (h["serials"] && h["status"] && h["client"] && h["reference"] || /cst safe|customer safe|customer orders/i.test(tab) && h["client"]) return "customer_safe";
  if (/^ie/i.test(tab) && h["price paid"] && h["received"] && h["client"]) return "trade_purchases";
  if (/^ie/i.test(tab) && h["cpty"] && h["client"] && h["reference"]) return "trade_sales";
  if (h["serial"] && h["refinery"] && h["weight"]) return "stock_bars";
  if (h["item"] && (h["quantity"] || h["oct final"] || h["sept"]) && !h["serial"] && !h["client"] || /coin stock/i.test(tab) && headers.length >= 3) return "stock_coins";
  return "";
}
function detectFileType(tabs) {
  const names = new Set(tabs.map((t) => t.name.trim().toLowerCase()));
  const byName = (n) => tabs.find((t) => t.name.trim().toLowerCase() === n);
  const detected = tabs.map((t) => ({ name: t.name, type: detectTabType(t.name, t.headers) }));
  if (names.has("meta") && names.has("trades") && names.has("links")) return { kind: "import_workbook", tabs: detected };
  const map = byName("map");
  if (map) {
    const h = norm(map.headers);
    if (h["code"] && h["original"] && tabs.every((t) => ["map", "runs"].includes(t.name.trim().toLowerCase()))) {
      return { kind: "redaction_map", tabs: detected };
    }
  }
  const kinds = new Set(detected.filter((d) => d.type).map((d) => KIND_OF_TAB[d.type]));
  if (kinds.size === 0) return { kind: "unknown", tabs: detected };
  if (kinds.size > 1) return { kind: "mixed", tabs: detected };
  return { kind: [...kinds][0], tabs: detected };
}

// src/import-workbook.fixture.ts
var FAKE_CUSTOMERS = ["Fake Alder Trading", "Fake Birch Holdings", "Fake Cedar Jewellers"];
function fakeRedactionMap() {
  return FAKE_CUSTOMERS.map((original, i) => ({
    code: `C00000${i + 1}`,
    key: original.toLowerCase(),
    original,
    type: "customer"
  }));
}
var CODE_COLUMNS = /* @__PURE__ */ new Set(["client_code", "customer_code", "seller_code", "vendor_code"]);
function cell(kind, col, row) {
  if (kind === "s") {
    if (CODE_COLUMNS.has(col)) return `C00000${row % FAKE_CUSTOMERS.length + 1}`;
    if (col === "notes" || col === "comments_raw" || col === "details") return `note ${row} for C000001`;
    return `${col}-${row}`;
  }
  if (kind === "n") return row % 2 === 0 ? row + 0.25 : row;
  if (kind === "i") return row;
  if (kind === "b") return row % 2 === 0 ? true : "FALSE";
  if (kind === "d") return new Date(Date.UTC(2026, 9, 1 + row));
  if (kind === "m") return new Date(Date.UTC(2026, 9, 1));
  return kind.oneOf[row % kind.oneOf.length];
}
function fakeWorkbookSheets(rowsPerTable = 3) {
  const sheets = {
    meta: [["key", "value"], ["schema_version", IMPORT_SCHEMA_VERSION], ["redacted", "TRUE"]]
  };
  for (const name of IMPORT_TABLE_NAMES) {
    const spec = IMPORT_TABLE_SPECS[name];
    const cols = Object.keys(spec);
    const rows = [cols];
    for (let r = 1; r <= rowsPerTable; r++) rows.push(cols.map((c) => cell(spec[c], c, r)));
    sheets[name] = rows;
  }
  return sheets;
}
function withoutOptionalColumns(sheets) {
  const out = { ...sheets };
  for (const [table, drop] of Object.entries(OPTIONAL_COLUMNS)) {
    const rows = sheets[table];
    const keep = rows[0].map((h) => !drop?.includes(String(h)));
    out[table] = rows.map((r) => r.filter((_, i) => keep[i]));
  }
  return out;
}

// src/import-workbook-api.schema.ts
var import_zod27 = require("zod");
var WORKBOOK_LOAD_ORDER = [
  "customers",
  "vendors",
  "supplier_invoices",
  "purchase_lots",
  "trades",
  "invoices",
  "invoice_lines",
  "line_serials",
  "payments",
  "purchase_orders",
  "bc_sales_orders",
  "customer_safe_items",
  "bc_tracking_entries",
  "bc_items",
  "zoho_products",
  "stock_bars",
  "stock_coins",
  "bc_journal_lines",
  "product_aliases",
  "links"
];
var WORKBOOK_CHUNK_MAX_ROWS = 5e3;
var WorkbookChunkRequestSchema = import_zod27.z.object({
  /** Omit on the first chunk of a batch; send the id the server returned after that. */
  batchId: import_zod27.z.number().int().positive().optional(),
  fileName: import_zod27.z.string().min(1).max(200),
  schemaVersion: import_zod27.z.literal(IMPORT_SCHEMA_VERSION),
  table: import_zod27.z.enum(WORKBOOK_LOAD_ORDER),
  /** Rows exactly as the reader produces them (customers and vendors also carry `name`). Validated per table on the server. */
  rows: import_zod27.z.array(import_zod27.z.record(import_zod27.z.string(), import_zod27.z.unknown())).max(WORKBOOK_CHUNK_MAX_ROWS),
  /** True on the last chunk of this table: rows of the table not seen in this batch are then flagged missing. */
  lastOfTable: import_zod27.z.boolean().default(false),
  /** True on the very last request: the batch is marked complete. */
  complete: import_zod27.z.boolean().default(false)
});
var WorkbookChunkResultSchema = import_zod27.z.object({
  batchId: import_zod27.z.number().int(),
  table: import_zod27.z.enum(WORKBOOK_LOAD_ORDER),
  added: import_zod27.z.number().int(),
  changed: import_zod27.z.number().int(),
  unchanged: import_zod27.z.number().int(),
  /** Trades and purchase lots the tradesheet importer has not loaded yet: nothing is created for them. */
  unmatched: import_zod27.z.number().int(),
  /** Quotes recorded (trades whose counterparty says QUOTE_ONLY). */
  quotes: import_zod27.z.number().int(),
  /** Quotes that a real trade with the same reference turned into INVOICED. */
  quotesInvoiced: import_zod27.z.number().int(),
  /** Rows whose customer, invoice or supplier invoice is not loaded yet, per column. */
  unresolved: import_zod27.z.record(import_zod27.z.string(), import_zod27.z.number().int()),
  markedMissing: import_zod27.z.number().int()
});
var BcAwaitingRequestSchema = import_zod27.z.object({
  fileName: import_zod27.z.string().min(1).max(200),
  schemaVersion: import_zod27.z.literal(IMPORT_SCHEMA_VERSION),
  rows: import_zod27.z.array(import_zod27.z.record(import_zod27.z.string(), import_zod27.z.unknown())).min(1).max(WORKBOOK_CHUNK_MAX_ROWS)
});
var BcAwaitingResultSchema = import_zod27.z.object({
  batchId: import_zod27.z.number().int(),
  added: import_zod27.z.number().int(),
  changed: import_zod27.z.number().int(),
  unchanged: import_zod27.z.number().int(),
  /** Orders in the previous report that are not in this one. */
  gone: import_zod27.z.number().int(),
  /** Trades that got a POSTED step because their BC order is gone. */
  posted: import_zod27.z.number().int(),
  /** Gone orders whose trade already had a POSTED step. */
  alreadyPosted: import_zod27.z.number().int(),
  /** Gone orders that name no trade we have. */
  noTrade: import_zod27.z.number().int()
});
var ImportBatchSummarySchema = import_zod27.z.object({
  id: import_zod27.z.number().int(),
  fileName: import_zod27.z.string(),
  importedBy: import_zod27.z.string(),
  importedAt: import_zod27.z.string(),
  status: import_zod27.z.string(),
  schemaVersion: import_zod27.z.string().nullable(),
  /** Per table: added, changed, unchanged, unmatched. */
  tableCounts: import_zod27.z.record(import_zod27.z.string(), import_zod27.z.record(import_zod27.z.string(), import_zod27.z.number())).nullable()
});
var ImportBatchListSchema = import_zod27.z.array(ImportBatchSummarySchema);

// src/import-hub.ts
function planUpload(tables, fileName, chunkSize = WORKBOOK_CHUNK_MAX_ROWS) {
  const out = [];
  for (const table of WORKBOOK_LOAD_ORDER) {
    const rows = tables[table] ?? [];
    for (let i = 0; i < rows.length; i += chunkSize) {
      out.push({
        fileName,
        schemaVersion: IMPORT_SCHEMA_VERSION,
        table,
        rows: rows.slice(i, i + chunkSize),
        lastOfTable: i + chunkSize >= rows.length,
        complete: false
      });
    }
  }
  if (out.length) out[out.length - 1].complete = true;
  return out;
}
function normaliseName(s) {
  return String(s ?? "").toLowerCase().replace(/[’']/g, "").replace(/\([^)]*\)/g, " ").replace(/\band\b/g, "&").replace(/[^a-z0-9& ]+/g, " ").replace(/\b(ltd|limited|unlimited company|unlimited|company|dac|plc|inc|llc|eur|gbp|usd)\b/g, " ").replace(/\s+/g, " ").trim();
}
function buildNameLookup(mapRows) {
  const lookup2 = /* @__PURE__ */ new Map();
  for (const m of mapRows) {
    const code = m.code?.trim();
    if (!code) continue;
    if (m.original) lookup2.set(normaliseName(m.original), code);
    if (m.key) lookup2.set(m.key, code);
  }
  return lookup2;
}
var nr = (s) => String(s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function coreRef(s) {
  const k = nr(s);
  const m = k.match(/^(?:DU|CO|BL|BC|ZU|IE)?((?:GP|SP|G|S|B|P)\d{5,})$/);
  return m ? m[1] : k;
}
function branchOf(location, ref) {
  const b = String(location ?? "").trim().toUpperCase();
  if (/^(DU|CO|BL|BC|ZU)$/.test(b)) return b;
  const p = nr(ref).slice(0, 2);
  return /^(DU|CO|BL|BC|ZU)$/.test(p) ? p : null;
}
var HEADER_LOOKAHEAD = 5;
function mapBcReport(sheet, fileName, names, snapshotDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) {
  const norm2 = (h) => String(h ?? "").toLowerCase().replace(/:$/, "").trim();
  let headerAt = -1;
  for (let r = 0; r < Math.min(HEADER_LOOKAHEAD, sheet.length); r++) {
    const cells = sheet[r].map(norm2);
    if (cells.includes("external document no.") && cells.includes("amount prepaid")) {
      headerAt = r;
      break;
    }
  }
  if (headerAt === -1) return { rows: [], unmappedCustomers: 0, skipped: 0, headerFound: false };
  const header = sheet[headerAt].map(norm2);
  const col = (...names2) => header.findIndex((h) => names2.includes(h));
  const idx = {
    no: col("no.", "no"),
    custNo: col("sell-to customer no."),
    custName: col("sell-to customer name"),
    ext: col("external document no."),
    loc: col("location code"),
    docDate: col("document date"),
    amount: col("amount"),
    incl: col("amount including vat"),
    prepaid: col("amount prepaid"),
    remaining: col("remaining amount"),
    paid: col("paid")
  };
  const spec = IMPORT_TABLE_SPECS.bc_sales_orders;
  const get = (cells, i) => i >= 0 ? cells[i] : null;
  const val = (col2, raw) => coerceCell(spec[col2], raw).value;
  let unmapped = 0;
  let skipped = 0;
  const rows = [];
  for (const cells of sheet.slice(headerAt + 1)) {
    const no = String(get(cells, idx.no) ?? "").trim();
    if (!no) {
      if (cells.some((c) => c !== null && c !== void 0 && String(c).trim() !== "")) skipped++;
      continue;
    }
    const customerName = String(get(cells, idx.custName) ?? "").trim();
    const code = customerName ? names.get(normaliseName(customerName)) ?? null : null;
    if (customerName && !code) unmapped++;
    const ext = get(cells, idx.ext);
    const paidRaw = String(get(cells, idx.paid) ?? "").trim().toUpperCase();
    rows.push({
      id: no,
      system: "BC",
      branch_code: branchOf(get(cells, idx.loc), ext),
      snapshot: fileName,
      snapshot_date: snapshotDate,
      bc_customer_no: val("bc_customer_no", get(cells, idx.custNo)),
      client_code: code,
      ext_doc_no: val("ext_doc_no", ext),
      ext_doc_core: ext ? coreRef(ext) : null,
      location: val("location", get(cells, idx.loc)),
      doc_date: val("doc_date", get(cells, idx.docDate)),
      amount: val("amount", get(cells, idx.amount)),
      amount_incl_vat: val("amount_incl_vat", get(cells, idx.incl)),
      prepaid: val("prepaid", get(cells, idx.prepaid)),
      remaining: val("remaining", get(cells, idx.remaining)),
      paid: paidRaw === "1" || paidRaw === "TRUE" ? true : null
    });
  }
  return { rows, unmappedCustomers: unmapped, skipped, headerFound: true };
}

// src/review.schema.ts
var import_zod28 = require("zod");
var ReviewLinkTypeSchema = import_zod28.z.enum(LINK_TYPES);
var ReviewSummarySchema = import_zod28.z.object({
  /** Pending links per link type. */
  links: import_zod28.z.record(import_zod28.z.string(), import_zod28.z.number().int()),
  /** Sales whose CPTY names a purchase line that is not loaded. */
  unresolvedLots: import_zod28.z.number().int(),
  /** Trades that repeat an earlier reference. */
  duplicates: import_zod28.z.number().int(),
  /** Product texts not yet tied to a specific sales product. */
  aliases: import_zod28.z.number().int(),
  /** Purchase lines that more was sold from than was bought. */
  overAllocated: import_zod28.z.number().int()
});
var EndSchema = import_zod28.z.object({
  table: import_zod28.z.string(),
  /** One line a person can recognise, e.g. "DU-G20260941 - 2 x 1oz Krugerrand". */
  label: import_zod28.z.string(),
  detail: import_zod28.z.string().nullable()
});
var ReviewLinkRowSchema = import_zod28.z.object({
  id: import_zod28.z.number().int(),
  linkType: import_zod28.z.string(),
  confidence: import_zod28.z.enum(["EXACT", "PROBABLE"]),
  method: import_zod28.z.string(),
  note: import_zod28.z.string().nullable(),
  from: EndSchema,
  to: EndSchema,
  /** Why the rules did not settle this one themselves; null when they have no view on this link type. */
  why: import_zod28.z.string().nullable()
});
var ReviewLinksResponseSchema = import_zod28.z.object({
  total: import_zod28.z.number().int(),
  rows: import_zod28.z.array(ReviewLinkRowSchema)
});
var ReviewLinksQuerySchema = import_zod28.z.object({
  type: ReviewLinkTypeSchema.optional(),
  limit: import_zod28.z.coerce.number().int().min(1).max(200).default(50),
  offset: import_zod28.z.coerce.number().int().min(0).default(0)
});
var LinkDecisionSchema = import_zod28.z.enum(["CONFIRMED", "REJECTED"]);
var LinkDecisionRequestSchema = import_zod28.z.object({
  ids: import_zod28.z.array(import_zod28.z.number().int().positive()).min(1).max(200),
  decision: LinkDecisionSchema
});
var LinkDecisionResultSchema = import_zod28.z.object({ updated: import_zod28.z.number().int() });
var UnresolvedLotRowSchema = import_zod28.z.object({
  tradeId: import_zod28.z.number().int(),
  reference: import_zod28.z.string(),
  date: import_zod28.z.string().nullable(),
  qty: import_zod28.z.number().nullable(),
  productText: import_zod28.z.string(),
  lotKey: import_zod28.z.string(),
  branchCode: import_zod28.z.string().nullable()
});
var UnresolvedLotsResponseSchema = import_zod28.z.object({ total: import_zod28.z.number().int(), rows: import_zod28.z.array(UnresolvedLotRowSchema) });
var DuplicateRowSchema = import_zod28.z.object({
  tradeId: import_zod28.z.number().int(),
  reference: import_zod28.z.string(),
  occurrence: import_zod28.z.number().int(),
  date: import_zod28.z.string().nullable(),
  qty: import_zod28.z.number().nullable(),
  productText: import_zod28.z.string(),
  branchCode: import_zod28.z.string().nullable()
});
var DuplicatesResponseSchema = import_zod28.z.object({ total: import_zod28.z.number().int(), rows: import_zod28.z.array(DuplicateRowSchema) });
var AliasTargetSchema = import_zod28.z.object({
  kind: import_zod28.z.enum(["PRICING", "SPECIFIC", "NOT_A_PRODUCT"]),
  id: import_zod28.z.number().int().nullable(),
  name: import_zod28.z.string()
});
var ALIAS_USAGE_SOURCES = ["SALES", "PURCHASES", "ZOHO", "ZOHO_PO", "CUSTOMER_SAFE"];
var AliasUsageSourceSchema = import_zod28.z.enum(ALIAS_USAGE_SOURCES);
var AliasUsageMetalSchema = import_zod28.z.enum(["GOLD", "SILVER", "PGM"]);
var AliasSeenInSchema = import_zod28.z.object({
  source: AliasUsageSourceSchema,
  metal: AliasUsageMetalSchema.nullable(),
  count: import_zod28.z.number().int()
});
var AliasRowSchema = import_zod28.z.object({
  id: import_zod28.z.number().int(),
  alias: import_zod28.z.string(),
  uses: import_zod28.z.number().int(),
  refinery: import_zod28.z.string().nullable(),
  sources: import_zod28.z.string().nullable(),
  confidence: import_zod28.z.enum(["CERTAIN", "LIKELY", "UNCLEAR"]).nullable(),
  reason: import_zod28.z.string().nullable(),
  /** For a LIKELY suggestion: what to ask, e.g. "South African Krugerrand: match to 1oz Krugerrand?". */
  question: import_zod28.z.string().nullable(),
  /** The name needs a catalogue row that is not there yet. */
  catalogueGap: import_zod28.z.boolean(),
  /** RULE or PERSON once settled; null while it waits. */
  decidedBy: import_zod28.z.enum(["RULE", "PERSON"]).nullable(),
  /** The suggestion for a name that waits. */
  suggestion: AliasTargetSchema.nullable(),
  /** What a settled name was settled to. */
  settledTo: AliasTargetSchema.nullable(),
  /** Where the name is used, per source and tab metal. */
  seenIn: import_zod28.z.array(AliasSeenInSchema),
  /**
   * Set when the sales and purchases carrying the name span more than one metal and some still have no product:
   * one entry per metal seen, with the rows still unresolved. Null otherwise.
   */
  perMetal: import_zod28.z.array(import_zod28.z.object({ metal: AliasUsageMetalSchema, unresolved: import_zod28.z.number().int() })).nullable()
});
var AliasCountsSchema = import_zod28.z.object({
  settledByRule: import_zod28.z.number().int(),
  /** Names every sale and purchase row of which already has its product from its own sheet. */
  settledPerRow: import_zod28.z.number().int(),
  toConfirm: import_zod28.z.number().int(),
  toDecide: import_zod28.z.number().int()
});
var ALIAS_VIEWS = ["open", "confirm", "decide", "settled", "per-row"];
var AliasesQuerySchema = import_zod28.z.object({
  /** open = to confirm and to decide; confirm = LIKELY suggestions; decide = UNCLEAR; settled = settled by rule; per-row = every row has its product from its sheet. */
  view: import_zod28.z.enum(ALIAS_VIEWS).default("open"),
  limit: import_zod28.z.coerce.number().int().min(1).max(1e3).default(50),
  offset: import_zod28.z.coerce.number().int().min(0).default(0)
});
var AliasesResponseSchema = import_zod28.z.object({
  total: import_zod28.z.number().int(),
  counts: AliasCountsSchema,
  rows: import_zod28.z.array(AliasRowSchema)
});
var AliasUsageExampleSchema = import_zod28.z.object({
  source: AliasUsageSourceSchema,
  metal: AliasUsageMetalSchema.nullable(),
  /** The sheet tab, e.g. "IE - Gold"; null for a source without one. */
  sheet: import_zod28.z.string().nullable(),
  date: import_zod28.z.string().nullable(),
  qty: import_zod28.z.number().nullable(),
  /** Price per item. */
  unitPrice: import_zod28.z.number().nullable(),
  /** The product the row resolved to, if any. */
  resolvedTo: import_zod28.z.string().nullable()
});
var AliasUsageResponseSchema = import_zod28.z.object({ rows: import_zod28.z.array(AliasUsageExampleSchema) });
var PerMetalChoiceSchema = import_zod28.z.object({
  metal: AliasUsageMetalSchema,
  productId: import_zod28.z.number().int().positive().optional(),
  salesProductId: import_zod28.z.number().int().positive().optional()
}).refine((c) => [c.productId, c.salesProductId].filter((v) => v !== void 0).length === 1, {
  message: "Give exactly one of productId or salesProductId."
});
var ApplyPerMetalRequestSchema = import_zod28.z.object({ choices: import_zod28.z.array(PerMetalChoiceSchema).min(1).max(3) }).refine((v) => new Set(v.choices.map((c) => c.metal)).size === v.choices.length, { message: "One choice per metal." });
var ApplyPerMetalResultSchema = import_zod28.z.object({ trades: import_zod28.z.number().int(), lots: import_zod28.z.number().int() });
var SettleNamesRequestSchema = import_zod28.z.object({ dryRun: import_zod28.z.boolean().default(false) });
var SettleNamesResultSchema = import_zod28.z.object({
  dryRun: import_zod28.z.boolean(),
  /** Names the rules now settle (applied, unless dryRun). */
  certain: import_zod28.z.number().int(),
  /** Names with a suggestion to confirm. */
  likely: import_zod28.z.number().int(),
  /** Names a person has to decide. */
  unclear: import_zod28.z.number().int(),
  /** Names whose stored state the scan left as it was. */
  unchanged: import_zod28.z.number().int()
});
var RELINK_TABLES = ["trades", "purchase_lots", "zoho_invoice_lines", "zoho_products", "quotes"];
var RelinkRequestSchema = import_zod28.z.object({ dryRun: import_zod28.z.boolean(), correct: import_zod28.z.boolean().default(false) });
var RelinkTableResultSchema = import_zod28.z.object({
  rowsChecked: import_zod28.z.number().int(),
  /** Rows with no product that a settled name gives one (written when applied). */
  fill: import_zod28.z.number().int(),
  /** Rows whose product disagrees with a person's decision (written only when `correct` is on). */
  correct: import_zod28.z.number().int(),
  /** Rows that resolve to a pricing product only, in a table with no column for one. Not written. */
  pricingOnlyNoColumn: import_zod28.z.number().int(),
  /** Rows with no product that no name or rule resolves. */
  unresolved: import_zod28.z.number().int(),
  /** Rows whose name is settled as "not a product". Never touched. */
  notProduct: import_zod28.z.number().int(),
  /** Rows changed. Always 0 on a dry run. */
  written: import_zod28.z.number().int()
});
var RelinkResultSchema = import_zod28.z.object({
  dryRun: import_zod28.z.boolean(),
  correct: import_zod28.z.boolean(),
  tables: import_zod28.z.object({
    trades: RelinkTableResultSchema,
    purchase_lots: RelinkTableResultSchema,
    zoho_invoice_lines: RelinkTableResultSchema,
    zoho_products: RelinkTableResultSchema,
    quotes: RelinkTableResultSchema
  })
});
var NameSuggestionDecisionRequestSchema = import_zod28.z.object({
  ids: import_zod28.z.array(import_zod28.z.number().int().positive()).min(1).max(5e3)
});
var NameSuggestionDecisionResultSchema = import_zod28.z.object({
  /** Names changed by this call. */
  done: import_zod28.z.number().int(),
  /** Names skipped: gone, already decided by a person, or with no suggestion to act on. */
  skipped: import_zod28.z.number().int()
});
var NameSuggestionTargetSchema = import_zod28.z.object({
  productId: import_zod28.z.number().int().positive().optional(),
  salesProductId: import_zod28.z.number().int().positive().optional(),
  noProduct: import_zod28.z.literal(true).optional()
}).refine((t) => [t.productId, t.salesProductId, t.noProduct].filter((v) => v !== void 0).length === 1, {
  message: "Give exactly one of productId, salesProductId, noProduct."
});
var NameSuggestionAcceptRequestSchema = import_zod28.z.object({
  items: import_zod28.z.array(import_zod28.z.object({ id: import_zod28.z.number().int().positive(), expected: NameSuggestionTargetSchema })).min(1).max(5e3)
});
var NameSuggestionAcceptResultSchema = import_zod28.z.object({
  accepted: import_zod28.z.number().int(),
  /** Gone, already decided, or the suggestion changed since the person saw it. */
  skipped: import_zod28.z.number().int()
});
var SalesProductSchema = import_zod28.z.object({
  id: import_zod28.z.number().int(),
  name: import_zod28.z.string(),
  metal: import_zod28.z.enum(["GOLD", "SILVER", "PGM"]),
  genericNorm: import_zod28.z.string(),
  refinery: import_zod28.z.string().nullable(),
  pricingProductId: import_zod28.z.number().int().nullable(),
  pricingProductName: import_zod28.z.string().nullable()
});
var SalesProductListSchema = import_zod28.z.array(SalesProductSchema);
var CreateSalesProductRequestSchema = import_zod28.z.object({
  name: import_zod28.z.string().trim().min(1).max(120),
  metal: import_zod28.z.enum(["GOLD", "SILVER", "PGM"]),
  genericNorm: import_zod28.z.string().trim().min(1).max(120),
  refinery: import_zod28.z.string().trim().max(80).nullish(),
  pricingProductId: import_zod28.z.number().int().positive().nullish()
});
var BcSalesProductActionSchema = import_zod28.z.enum(["CREATE", "LINKED", "SKIP"]);
var BcSalesProductRowSchema = import_zod28.z.object({
  itemNo: import_zod28.z.string(),
  description: import_zod28.z.string(),
  action: BcSalesProductActionSchema,
  reason: import_zod28.z.string().optional(),
  name: import_zod28.z.string(),
  /** Null only when nothing says what metal the item is (such a row is skipped). */
  metal: import_zod28.z.enum(["GOLD", "SILVER", "PGM"]).nullable(),
  refinery: import_zod28.z.string().nullable(),
  genericNorm: import_zod28.z.string(),
  pricingProductId: import_zod28.z.number().int().nullable(),
  pricingProductName: import_zod28.z.string().nullable(),
  suggestedSku: import_zod28.z.string().optional()
});
var BcSalesProductsPreviewSchema = import_zod28.z.object({
  rows: import_zod28.z.array(BcSalesProductRowSchema),
  totals: import_zod28.z.object({ create: import_zod28.z.number().int(), linked: import_zod28.z.number().int(), skip: import_zod28.z.number().int(), total: import_zod28.z.number().int() })
});
var BcSalesProductsApplyRequestSchema = import_zod28.z.object({
  itemNos: import_zod28.z.array(import_zod28.z.string().trim().min(1).max(40)).max(5e3).optional()
});
var BcSalesProductsApplyResultSchema = import_zod28.z.object({
  /** New specific products. */
  created: import_zod28.z.number().int(),
  /** Items linked to a specific product that already had the same name. */
  linked: import_zod28.z.number().int(),
  /** Selected items that are not ready (see the preview's reasons). */
  skipped: import_zod28.z.number().int()
});
var MapAliasRequestSchema = import_zod28.z.object({
  salesProductId: import_zod28.z.number().int().positive().optional(),
  productId: import_zod28.z.number().int().positive().optional(),
  noProduct: import_zod28.z.literal(true).optional()
}).refine(
  (v) => [v.salesProductId, v.productId, v.noProduct].filter((x) => x !== void 0).length === 1,
  { message: "Choose exactly one of salesProductId, productId or noProduct." }
);
var ReviewPageQuerySchema = ReviewLinksQuerySchema.omit({ type: true });
var PricingProductOptionSchema = import_zod28.z.object({ id: import_zod28.z.number().int(), name: import_zod28.z.string(), metalType: import_zod28.z.string() });
var PricingProductOptionListSchema = import_zod28.z.array(PricingProductOptionSchema);
var SettleResultSchema = import_zod28.z.object({
  /** Pending links the rules confirmed because they make sense. */
  confirmed: import_zod28.z.number().int(),
  /** Pending links left for a person: the product or quantity does not fit. */
  asked: import_zod28.z.number().int(),
  /** Pending links left because their purchase line has more sold than bought. */
  overAllocated: import_zod28.z.number().int(),
  /** Quotes the sheet still lists, now invoiced because a Zoho invoice line matches. */
  quotesInvoiced: import_zod28.z.number().int()
});
var OverAllocatedLotSchema = import_zod28.z.object({
  lotId: import_zod28.z.number().int(),
  reference: import_zod28.z.string(),
  productText: import_zod28.z.string(),
  received: import_zod28.z.string().nullable(),
  bought: import_zod28.z.number().int(),
  sold: import_zod28.z.number().int(),
  /** The sales that name this purchase line, newest first, at most 20. */
  sales: import_zod28.z.array(import_zod28.z.object({ tradeId: import_zod28.z.number().int(), reference: import_zod28.z.string(), date: import_zod28.z.string().nullable(), qty: import_zod28.z.number().int().nullable() }))
});
var OverAllocatedResponseSchema = import_zod28.z.object({ total: import_zod28.z.number().int(), rows: import_zod28.z.array(OverAllocatedLotSchema) });

// src/customer-records.schema.ts
var import_zod29 = require("zod");
var RECORD_PAGE_MAX = 100;
var RecordSearchRequestSchema = import_zod29.z.object({
  q: import_zod29.z.string().trim().max(80).optional(),
  status: import_zod29.z.string().trim().max(30).optional(),
  limit: import_zod29.z.number().int().min(1).max(RECORD_PAGE_MAX).default(50),
  offset: import_zod29.z.number().int().min(0).default(0)
});
var CustomerListRowSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  name: import_zod29.z.string(),
  status: import_zod29.z.string().nullable(),
  currency: import_zod29.z.string().nullable(),
  /** Sales linked to this customer that are not collected yet. */
  openOrders: import_zod29.z.number().int(),
  lastOrder: import_zod29.z.string().nullable(),
  /** Sum of their Zoho invoices that are not draft or void. */
  lifetime: import_zod29.z.number(),
  /** Date of their first invoice or sale. */
  since: import_zod29.z.string().nullable()
});
var CustomerListResponseSchema = import_zod29.z.object({ total: import_zod29.z.number().int(), rows: import_zod29.z.array(CustomerListRowSchema) });
var CustomerOrderRowSchema = import_zod29.z.object({
  tradeId: import_zod29.z.number().int(),
  reference: import_zod29.z.string(),
  date: import_zod29.z.string().nullable(),
  qty: import_zod29.z.number().nullable(),
  productText: import_zod29.z.string(),
  state: import_zod29.z.string(),
  collected: import_zod29.z.boolean(),
  branchCode: import_zod29.z.string().nullable()
});
var InvoiceCollectedSchema = import_zod29.z.enum(["YES", "NO", "PARTIAL"]).nullable();
var CustomerInvoiceRowSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  number: import_zod29.z.string(),
  date: import_zod29.z.string().nullable(),
  total: import_zod29.z.number().nullable(),
  status: import_zod29.z.string().nullable(),
  collected: InvoiceCollectedSchema
});
var PaymentRowSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  date: import_zod29.z.string().nullable(),
  amount: import_zod29.z.number().nullable(),
  mode: import_zod29.z.string().nullable(),
  invoiceNumber: import_zod29.z.string().nullable()
});
var QuoteRowSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  reference: import_zod29.z.string(),
  date: import_zod29.z.string().nullable(),
  qty: import_zod29.z.number().nullable(),
  productText: import_zod29.z.string(),
  status: import_zod29.z.string()
});
var CustomerProfileSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  name: import_zod29.z.string(),
  status: import_zod29.z.string().nullable(),
  currency: import_zod29.z.string().nullable(),
  zohoNumber: import_zod29.z.string().nullable(),
  since: import_zod29.z.string().nullable(),
  lastOrder: import_zod29.z.string().nullable(),
  openOrders: import_zod29.z.number().int(),
  lifetime: import_zod29.z.number(),
  /** Newest first, at most 100 each. */
  orders: import_zod29.z.array(CustomerOrderRowSchema),
  invoices: import_zod29.z.array(CustomerInvoiceRowSchema),
  payments: import_zod29.z.array(PaymentRowSchema),
  quotes: import_zod29.z.array(QuoteRowSchema)
});
var InvoiceListRowSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  number: import_zod29.z.string(),
  date: import_zod29.z.string().nullable(),
  customerId: import_zod29.z.number().int().nullable(),
  customerName: import_zod29.z.string().nullable(),
  total: import_zod29.z.number().nullable(),
  status: import_zod29.z.string().nullable(),
  lineCount: import_zod29.z.number().int().nullable(),
  collected: InvoiceCollectedSchema
});
var InvoiceListResponseSchema = import_zod29.z.object({ total: import_zod29.z.number().int(), rows: import_zod29.z.array(InvoiceListRowSchema) });
var InvoiceLineRowSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  product: import_zod29.z.string(),
  refinery: import_zod29.z.string().nullable(),
  qty: import_zod29.z.number().nullable(),
  unitPrice: import_zod29.z.number().nullable(),
  lineTotal: import_zod29.z.number().nullable(),
  serials: import_zod29.z.array(import_zod29.z.string()),
  collectedFlag: import_zod29.z.enum(["YES", "NO", "CHECK"]).nullable(),
  collectedDate: import_zod29.z.string().nullable(),
  deliveredBrinks: import_zod29.z.boolean().nullable(),
  soldBack: import_zod29.z.boolean().nullable()
});
var InvoiceLinkRowSchema = import_zod29.z.object({
  linkType: import_zod29.z.string(),
  confidence: import_zod29.z.enum(["EXACT", "PROBABLE"]),
  status: import_zod29.z.enum(["PENDING", "CONFIRMED", "REJECTED"]),
  /** The sale the invoice line was matched to. */
  trade: import_zod29.z.string()
});
var InvoiceDetailSchema = import_zod29.z.object({
  id: import_zod29.z.number().int(),
  number: import_zod29.z.string(),
  date: import_zod29.z.string().nullable(),
  status: import_zod29.z.string().nullable(),
  total: import_zod29.z.number().nullable(),
  customerId: import_zod29.z.number().int().nullable(),
  customerName: import_zod29.z.string().nullable(),
  lines: import_zod29.z.array(InvoiceLineRowSchema),
  payments: import_zod29.z.array(PaymentRowSchema),
  links: import_zod29.z.array(InvoiceLinkRowSchema)
});

// src/inventory.schema.ts
var import_zod30 = require("zod");
var StockMetalSchema = import_zod30.z.enum(["GOLD", "SILVER", "PGM"]);
var InventoryStocktakeRefSchema = import_zod30.z.object({
  id: import_zod30.z.number().int(),
  name: import_zod30.z.string(),
  countDate: import_zod30.z.string(),
  status: import_zod30.z.string(),
  /** Loaded from the import workbook rather than counted here. */
  imported: import_zod30.z.boolean()
});
var InventoryPositionSchema = import_zod30.z.object({
  /** The stocktake the figures come from; null when none exists yet. */
  stocktake: InventoryStocktakeRefSchema.nullable(),
  /** The newest stocktakes, for choosing another. */
  available: import_zod30.z.array(InventoryStocktakeRefSchema),
  bars: import_zod30.z.object({
    total: import_zod30.z.number().int(),
    byMetal: import_zod30.z.record(import_zod30.z.string(), import_zod30.z.number().int()),
    /** Bars whose serial an open customer order names. */
    heldForCustomers: import_zod30.z.number().int(),
    /** Bars the stocktake lists as gone. */
    gone: import_zod30.z.number().int()
  }),
  coins: import_zod30.z.object({
    lines: import_zod30.z.number().int(),
    /** Counted pieces, where a count exists. */
    pieces: import_zod30.z.number().int(),
    byMetal: import_zod30.z.record(import_zod30.z.string(), import_zod30.z.number().int()),
    uncounted: import_zod30.z.number().int()
  })
});
var InventoryBarsQuerySchema = import_zod30.z.object({
  stocktakeId: import_zod30.z.coerce.number().int().positive().optional(),
  metal: StockMetalSchema.optional(),
  branch: import_zod30.z.string().trim().max(10).optional(),
  where: import_zod30.z.enum(["held", "free"]).optional(),
  /** A serial, or part of one. Never a name. */
  q: import_zod30.z.string().trim().max(40).optional(),
  limit: import_zod30.z.coerce.number().int().min(1).max(200).default(50),
  offset: import_zod30.z.coerce.number().int().min(0).default(0)
});
var InventoryBarRowSchema = import_zod30.z.object({
  id: import_zod30.z.number().int(),
  serial: import_zod30.z.string().nullable(),
  refinery: import_zod30.z.string().nullable(),
  weightLabel: import_zod30.z.string(),
  metal: StockMetalSchema,
  locationCode: import_zod30.z.string(),
  status: import_zod30.z.string(),
  details: import_zod30.z.string().nullable(),
  /** The open customer order that names this serial, if any. */
  heldFor: import_zod30.z.object({ orderId: import_zod30.z.number().int(), reference: import_zod30.z.string().nullable(), client: import_zod30.z.string(), status: import_zod30.z.string() }).nullable()
});
var InventoryBarsResponseSchema = import_zod30.z.object({ total: import_zod30.z.number().int(), rows: import_zod30.z.array(InventoryBarRowSchema) });
var InventoryCoinsQuerySchema = import_zod30.z.object({
  stocktakeId: import_zod30.z.coerce.number().int().positive().optional(),
  metal: StockMetalSchema.optional(),
  branch: import_zod30.z.string().trim().max(10).optional()
});
var InventoryCoinRowSchema = import_zod30.z.object({
  id: import_zod30.z.number().int(),
  item: import_zod30.z.string(),
  metal: StockMetalSchema,
  locationCode: import_zod30.z.string(),
  previousQty: import_zod30.z.number().int().nullable(),
  countedQty: import_zod30.z.number().int().nullable(),
  details: import_zod30.z.string().nullable()
});
var InventoryCoinsResponseSchema = import_zod30.z.object({ rows: import_zod30.z.array(InventoryCoinRowSchema) });

// src/live-stock.ts
var OZ_GRAMS = 31.1034768;
var WEIGHT_RE2 = /(^|[^0-9./])(\d+(?:\.\d+)?(?:\s*\/\s*\d+)?)\s*(oz|ozt|z|g|gr|gram|grams|kg|kilo)(?![a-z])/i;
function fractionValue(n) {
  const [a = 0, b] = n.split("/").map((s) => Number(s.trim()));
  return b ? a / b : a;
}
function parseWeight(text4) {
  const m = WEIGHT_RE2.exec(text4);
  if (!m) return null;
  const numberText = (m[2] ?? "").replace(/\s+/g, "");
  const unitRaw = (m[3] ?? "").toLowerCase();
  let unit;
  let numText = numberText;
  if (unitRaw === "z" && /^\d*0$/.test(numberText) && numberText.length > 1) {
    numText = numberText.slice(0, -1);
    unit = "oz";
  } else if (unitRaw === "z") {
    unit = "oz";
  } else if (unitRaw.startsWith("oz")) unit = "oz";
  else if (unitRaw === "kg" || unitRaw === "kilo") unit = "kg";
  else unit = "g";
  const value = fractionValue(numText);
  if (!Number.isFinite(value) || value <= 0) return null;
  const grams = unit === "oz" ? value * OZ_GRAMS : unit === "kg" ? value * 1e3 : value;
  const index = m.index + (m[1] ?? "").length;
  return {
    label: `${numText}${unit}`,
    grams: Math.round(grams * 1e4) / 1e4,
    index,
    length: m[0].length - (m[1] ?? "").length
  };
}
var COIN_FAMILIES = [
  { family: "Tree of Life", words: ["tree of life"] },
  { family: "Krugerrand", words: ["krugerrand", "kruger"] },
  { family: "Maple", words: ["maple", "maple leaf"] },
  { family: "Britannia", words: ["britannia"] },
  { family: "Philharmonic", words: ["philharmonic", "philharmoniker"] },
  { family: "Eagle", words: ["eagle", "american eagle"] },
  { family: "Buffalo", words: ["buffalo"] },
  { family: "Kangaroo", words: ["kangaroo"] },
  { family: "Kookaburra", words: ["kookaburra"] },
  { family: "Koala", words: ["koala"] },
  { family: "Lunar", words: ["lunar"] },
  { family: "Sovereign", words: ["sovereign"] },
  { family: "Libertad", words: ["libertad"] },
  { family: "Panda", words: ["panda"] },
  { family: "Nugget", words: ["nugget"] },
  { family: "Napoleon", words: ["napoleon"] },
  { family: "Vreneli", words: ["vreneli"] },
  { family: "Lady Fortuna", words: ["lady fortuna"] }
];
var words = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9/]+/g, " ").trim()} `;
function parseCoinName(text4) {
  const raw = text4.trim().replace(/\s+/g, " ");
  const w = words(raw);
  let family = null;
  let familyWords = "";
  let best = 0;
  for (const f of COIN_FAMILIES) {
    for (const word of f.words) {
      if (w.includes(` ${word} `) && word.length > best) {
        family = f.family;
        familyWords = word;
        best = word.length;
      }
    }
  }
  const weight = parseWeight(raw);
  if (!family) {
    return { family: "Other", variant: raw, grams: weight?.grams ?? null };
  }
  let rest = raw;
  if (weight) rest = (rest.slice(0, weight.index) + " " + rest.slice(weight.index + weight.length)).trim();
  const famRe = new RegExp(`\\b${familyWords.replace(/ /g, "\\s+")}\\b`, "i");
  rest = rest.replace(famRe, " ").replace(/\s*[-–]\s*/g, " - ").replace(/\s+/g, " ").replace(/^[-\s]+|[-\s]+$/g, "");
  const variant = [weight?.label, rest].filter(Boolean).join(" ").trim() || raw;
  return { family, variant, grams: weight?.grams ?? null };
}
function parseBarWeight(text4) {
  const w = parseWeight(text4);
  if (!w) return { variant: text4.trim(), grams: null };
  return { variant: w.label, grams: w.grams };
}
function liveSerialKey(serial) {
  return serial.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function liveRefinery(text4) {
  const t = (text4 ?? "").trim();
  if (!t) return { value: "", listed: true };
  const hit = listedRefinery(t);
  if (hit === null) return { value: "", listed: true };
  if (hit) return { value: hit, listed: true };
  return { value: refineryWords(t), listed: false };
}
var LIVE_BRANCH_CODES = ["DU", "BL", "CO", "BC"];
var LIVE_BRANCH_NAMES = {
  DU: "Dublin",
  BL: "Blanchardstown",
  CO: "Cork",
  BC: "Barcelona"
};
function sortBranchCodes(branches) {
  const rank2 = (c) => {
    const i = LIVE_BRANCH_CODES.indexOf(c);
    return i < 0 ? 99 : i;
  };
  return [...branches].sort((a, b) => rank2(a.code) - rank2(b.code) || a.code.localeCompare(b.code));
}
function variantGrams(variant) {
  return parseWeight(variant)?.grams ?? Number.POSITIVE_INFINITY;
}
var keyOf2 = (l) => [l.branchCode, l.metal, l.kind, l.family.toLowerCase(), l.variant.toLowerCase(), l.refinery].join("|");
function planBaseline(input) {
  const lines = /* @__PURE__ */ new Map();
  const bars = [];
  const barRows = [];
  const fixes = [];
  const issues = [];
  const unlisted = /* @__PURE__ */ new Set();
  let skippedSold = 0;
  const add = (l) => {
    const k = keyOf2(l);
    const cur = lines.get(k);
    if (cur) {
      cur.qty += l.qty;
      if (!cur.details && l.details) cur.details = l.details;
    } else lines.set(k, { ...l });
  };
  for (const b of input.bars) {
    if (b.sold) {
      skippedSold += 1;
      continue;
    }
    const branchCode = b.branch.trim().toUpperCase();
    if (!branchCode) {
      issues.push({ row: b.row, message: "No branch, so the bar was not loaded." });
      continue;
    }
    const weight = parseBarWeight(b.weight);
    if (weight.grams === null) {
      issues.push({ row: b.row, message: `Weight "${b.weight}" not understood.` });
      continue;
    }
    if (weight.variant.toLowerCase() !== b.weight.trim().toLowerCase().replace(/\s*bars?$/, "").replace(/\s+/g, "")) {
      fixes.push({ row: b.row, field: "weight", from: b.weight, to: weight.variant });
    }
    const ref = liveRefinery(b.refinery);
    if (b.refinery && ref.value !== b.refinery.trim()) {
      fixes.push({ row: b.row, field: "refinery", from: b.refinery, to: ref.value || "(none)" });
    }
    if (!ref.listed) unlisted.add(ref.value);
    const serial = b.serial?.trim() || null;
    add({
      branchCode,
      metal: b.metal,
      kind: "BAR",
      family: "Bar",
      variant: weight.variant,
      refinery: ref.value,
      qty: 1,
      details: null
    });
    if (serial && serial.toUpperCase() !== "NOSERIAL") {
      barRows.push(b.row);
      bars.push({
        branchCode,
        metal: b.metal,
        family: "Bar",
        variant: weight.variant,
        refinery: ref.value,
        serial,
        serialKey: liveSerialKey(serial),
        grams: b.grams ?? weight.grams,
        details: b.details
      });
    }
  }
  for (const c of input.coins) {
    const parsed = parseCoinName(c.item);
    for (const [code, count2] of Object.entries(c.counts)) {
      if (count2 === null || count2 === void 0) continue;
      if (!Number.isInteger(count2) || count2 < 0) {
        issues.push({ row: c.row, message: `${c.item} (${code}): "${count2}" is not a whole count.` });
        continue;
      }
      if (count2 === 0) continue;
      add({
        branchCode: code.trim().toUpperCase(),
        metal: c.metal,
        kind: "COIN",
        family: parsed.family,
        variant: parsed.variant,
        refinery: "",
        qty: count2,
        details: c.details[code]?.trim() || null
      });
    }
  }
  const seen = /* @__PURE__ */ new Map();
  bars.forEach((b, i) => seen.set(b.serialKey, [...seen.get(b.serialKey) ?? [], i]));
  const clashes = [];
  const drop = /* @__PURE__ */ new Set();
  for (const [serialKey2, idx] of seen) {
    if (idx.length > 1) {
      clashes.push({ serialKey: serialKey2, rows: idx.map((i) => barRows[i] ?? 0) });
      idx.forEach((i) => drop.add(i));
    }
  }
  return {
    lines: [...lines.values()],
    bars: bars.filter((_, i) => !drop.has(i)),
    fixes,
    issues,
    clashes: clashes.map((c) => ({ serialKey: c.serialKey, rows: c.rows })),
    skippedSold,
    unlistedRefineries: [...unlisted].sort()
  };
}

// src/live-stock.schema.ts
var import_zod31 = require("zod");
var LiveMetalSchema = import_zod31.z.enum(["GOLD", "SILVER", "PGM"]);
var LiveKindSchema = import_zod31.z.enum(["COIN", "BAR"]);
var LiveBarStatusSchema = import_zod31.z.enum(["IN_STOCK", "SOLD", "REMOVED"]);
var LiveMovementSourceSchema = import_zod31.z.enum([
  "MANUAL",
  "IMPORT",
  "SHEET_SALE",
  "SHEET_PURCHASE",
  "TRANSFER",
  "UNDO"
]);
var BranchCode = import_zod31.z.string().trim().min(1).max(8).transform((s) => s.toUpperCase());
var Reason = import_zod31.z.string().trim().min(1, "A short reason is required").max(120);
var Note = import_zod31.z.string().trim().max(500).optional();
var LiveStockBarSchema = import_zod31.z.object({
  id: import_zod31.z.number().int(),
  serial: import_zod31.z.string(),
  grams: import_zod31.z.number().nullable(),
  details: import_zod31.z.string().nullable(),
  status: LiveBarStatusSchema
});
var LiveStockLineSchema = import_zod31.z.object({
  id: import_zod31.z.number().int(),
  branchCode: import_zod31.z.string(),
  metal: LiveMetalSchema,
  kind: LiveKindSchema,
  family: import_zod31.z.string(),
  variant: import_zod31.z.string(),
  refinery: import_zod31.z.string(),
  qty: import_zod31.z.number().int(),
  lowThreshold: import_zod31.z.number().int().nullable(),
  unassigned: import_zod31.z.number().int(),
  details: import_zod31.z.string().nullable(),
  /** In-stock serialled bars on this line (bars only). */
  bars: import_zod31.z.array(LiveStockBarSchema),
  updatedAt: import_zod31.z.string()
});
var LiveStockBranchSchema = import_zod31.z.object({
  code: import_zod31.z.string(),
  name: import_zod31.z.string(),
  branchId: import_zod31.z.number().int().nullable(),
  cutoverDate: import_zod31.z.string().nullable(),
  /** Whether the signed-in person may change this branch's counts. */
  canEdit: import_zod31.z.boolean()
});
var LiveStockBoardSchema = import_zod31.z.object({
  branch: LiveStockBranchSchema,
  metal: LiveMetalSchema,
  lines: import_zod31.z.array(LiveStockLineSchema)
});
var LiveStockBranchesResponseSchema = import_zod31.z.object({
  branches: import_zod31.z.array(LiveStockBranchSchema),
  /** The code of the signed-in person's own branch, when it is linked. */
  mine: import_zod31.z.string().nullable()
});
var LiveStockMovementSchema = import_zod31.z.object({
  id: import_zod31.z.number().int(),
  lineId: import_zod31.z.number().int(),
  delta: import_zod31.z.number().int(),
  qtyAfter: import_zod31.z.number().int(),
  source: LiveMovementSourceSchema,
  reference: import_zod31.z.string().nullable(),
  reason: import_zod31.z.string().nullable(),
  note: import_zod31.z.string().nullable(),
  actor: import_zod31.z.string(),
  at: import_zod31.z.string(),
  reversesId: import_zod31.z.number().int().nullable(),
  /** True when a later UNDO already reversed this movement. */
  undone: import_zod31.z.boolean()
});
var AdjustLiveStockRequestSchema = import_zod31.z.object({
  delta: import_zod31.z.number().int().optional(),
  qty: import_zod31.z.number().int().min(0).optional(),
  reason: Reason,
  note: Note
}).refine((v) => v.delta === void 0 !== (v.qty === void 0), {
  message: "Send either delta or qty, not both."
}).refine((v) => v.delta !== 0, { message: "A change of zero is not a change." });
var CreateLiveStockLineRequestSchema = import_zod31.z.object({
  branchCode: BranchCode,
  metal: LiveMetalSchema,
  kind: LiveKindSchema,
  family: import_zod31.z.string().trim().min(1).max(60),
  variant: import_zod31.z.string().trim().min(1).max(80),
  refinery: import_zod31.z.string().trim().max(60).default(""),
  qty: import_zod31.z.number().int().min(0).default(0),
  reason: Reason,
  note: Note
});
var AddLiveStockBarRequestSchema = import_zod31.z.object({
  serial: import_zod31.z.string().trim().min(2).max(60),
  grams: import_zod31.z.number().positive().optional(),
  details: import_zod31.z.string().trim().max(200).optional(),
  reason: Reason
});
var SetLiveStockBarStatusRequestSchema = import_zod31.z.object({
  status: LiveBarStatusSchema,
  reason: Reason,
  note: Note
});
var TransferLiveStockRequestSchema = import_zod31.z.object({
  toBranchCode: BranchCode,
  qty: import_zod31.z.number().int().min(1),
  /** Serials of the bars that move; they must number `qty` or fewer (the rest travel unserialled). */
  barIds: import_zod31.z.array(import_zod31.z.number().int()).default([]),
  reason: Reason,
  note: Note
});
var LowThresholdRequestSchema = import_zod31.z.object({
  lowThreshold: import_zod31.z.number().int().min(0).nullable()
});
var LinkLiveStockBranchRequestSchema = import_zod31.z.object({
  branchId: import_zod31.z.number().int().nullable()
});
var BaselineBarRowSchema = import_zod31.z.object({
  metal: LiveMetalSchema,
  row: import_zod31.z.number().int(),
  branch: import_zod31.z.string(),
  weight: import_zod31.z.string(),
  refinery: import_zod31.z.string().nullable(),
  serial: import_zod31.z.string().nullable(),
  grams: import_zod31.z.number().nullable(),
  details: import_zod31.z.string().nullable(),
  sold: import_zod31.z.boolean()
});
var BaselineCoinRowSchema = import_zod31.z.object({
  metal: LiveMetalSchema,
  row: import_zod31.z.number().int(),
  item: import_zod31.z.string(),
  counts: import_zod31.z.record(import_zod31.z.string(), import_zod31.z.number().nullable()),
  details: import_zod31.z.record(import_zod31.z.string(), import_zod31.z.string().nullable())
});
var LiveBaselineRequestSchema = import_zod31.z.object({
  bars: import_zod31.z.array(BaselineBarRowSchema).max(5e3),
  coins: import_zod31.z.array(BaselineCoinRowSchema).max(2e3),
  /** The day the sheet was last updated. Sheet sales dated on or before it never apply. */
  cutoverDate: import_zod31.z.iso.date(),
  /** Only these branches are loaded; others in the file are ignored. */
  branchCodes: import_zod31.z.array(BranchCode).min(1).default(["DU", "CO", "BL", "BC"])
});
var LiveBaselinePreviewSchema = import_zod31.z.object({
  lines: import_zod31.z.number().int(),
  linesToCreate: import_zod31.z.number().int(),
  linesToChange: import_zod31.z.number().int(),
  units: import_zod31.z.number().int(),
  bars: import_zod31.z.number().int(),
  barsToCreate: import_zod31.z.number().int(),
  skippedSold: import_zod31.z.number().int(),
  fixes: import_zod31.z.array(import_zod31.z.object({ row: import_zod31.z.number(), field: import_zod31.z.string(), from: import_zod31.z.string(), to: import_zod31.z.string() })),
  issues: import_zod31.z.array(import_zod31.z.object({ row: import_zod31.z.number(), message: import_zod31.z.string() })),
  clashes: import_zod31.z.array(import_zod31.z.object({ serialKey: import_zod31.z.string(), rows: import_zod31.z.array(import_zod31.z.number()) })),
  unlistedRefineries: import_zod31.z.array(import_zod31.z.string()),
  byBranch: import_zod31.z.record(import_zod31.z.string(), import_zod31.z.number().int())
});
var LiveBaselineResultSchema = LiveBaselinePreviewSchema.extend({
  applied: import_zod31.z.literal(true)
});
var LiveStockBoardQuerySchema = import_zod31.z.object({
  branch: BranchCode,
  metal: LiveMetalSchema.default("GOLD")
});
var SheetKindSchema = import_zod31.z.enum(["SALE", "PURCHASE"]);
var SheetLineOptionSchema = import_zod31.z.object({
  lineId: import_zod31.z.number().int(),
  label: import_zod31.z.string(),
  qty: import_zod31.z.number().int()
});
var SheetApplyItemSchema = import_zod31.z.object({
  /** kind|referenceKey|occurrence, stable across uploads. */
  key: import_zod31.z.string(),
  applicationId: import_zod31.z.number().int().nullable(),
  kind: SheetKindSchema,
  reference: import_zod31.z.string(),
  branchCode: import_zod31.z.string(),
  metal: LiveMetalSchema,
  productText: import_zod31.z.string(),
  date: import_zod31.z.string().nullable(),
  /** Signed change to stock: negative for a sale. */
  delta: import_zod31.z.number().int(),
  /** The line it lands on, when it is clear. */
  line: SheetLineOptionSchema.nullable(),
  outcome: import_zod31.z.enum(["APPLY", "CREATE", "ASK_COUNTED", "PICK_LINE", "UNMATCHED", "WITHDRAWN", "NEGATIVE"]),
  message: import_zod31.z.string(),
  /** Lines a person may choose from, for the outcomes that need a choice. */
  options: import_zod31.z.array(SheetLineOptionSchema)
});
var SheetApplyPreviewSchema = import_zod31.z.object({
  /** Cut-over date per branch; null means that branch has no baseline yet and none of its rows apply. */
  cutovers: import_zod31.z.record(import_zod31.z.string(), import_zod31.z.string().nullable()),
  willApply: import_zod31.z.array(SheetApplyItemSchema),
  needsDecision: import_zod31.z.array(SheetApplyItemSchema),
  /** Rows already waiting from an earlier run. */
  pending: import_zod31.z.array(SheetApplyItemSchema),
  skipped: import_zod31.z.record(import_zod31.z.string(), import_zod31.z.number().int())
});
var SheetApplyResultSchema = import_zod31.z.object({
  applied: import_zod31.z.number().int(),
  units: import_zod31.z.number().int(),
  waiting: import_zod31.z.number().int(),
  failed: import_zod31.z.array(import_zod31.z.object({ reference: import_zod31.z.string(), message: import_zod31.z.string() })),
  skipped: import_zod31.z.record(import_zod31.z.string(), import_zod31.z.number().int())
});
var ResolveSheetApplicationRequestSchema = import_zod31.z.object({
  choice: import_zod31.z.enum(["COUNTED", "APPLY", "LINE", "REVERSE", "KEEP", "DISMISS"]),
  lineId: import_zod31.z.number().int().optional()
});

// src/product-stock.ts
var import_zod32 = require("zod");
var US_FAMILY = "Eagle";
function productStockKey(product) {
  const metal = product.metalType;
  if (metal !== "GOLD" && metal !== "SILVER") return null;
  const name = product.name;
  if (/bonded/i.test(name)) return null;
  if (/bar\b/i.test(name)) {
    if (/combi/i.test(name)) return null;
    const bar = parseBarWeight(name);
    if (bar.grams === null) return null;
    return { metal, kind: "BAR", variant: bar.variant, pampOnly: /pamp/i.test(name) };
  }
  const coin = parseCoinName(name);
  const weight = parseWeight(name)?.label ?? null;
  if (coin.family === "Sovereign") return { metal, kind: "COIN", family: "Sovereign", variant: coin.variant };
  if (coin.family !== "Other") return weight ? { metal, kind: "COIN", family: coin.family, variant: weight } : null;
  if (weight && /\bcoins?\b/i.test(name)) return { metal, kind: "COIN", family: null, variant: weight };
  return null;
}
function lineMatchesKey(line, key) {
  if (line.metal !== key.metal || line.kind !== key.kind) return false;
  if (line.variant.toLowerCase() !== key.variant.toLowerCase()) return false;
  if (key.kind === "BAR") return !key.pampOnly || /pamp/i.test(line.refinery);
  if (key.family === null) return line.family !== US_FAMILY && line.family !== "Other";
  return line.family.toLowerCase() === key.family.toLowerCase();
}
var StockLevelStateSchema = import_zod32.z.enum(["IN", "LOW", "OUT"]);
var ProductStockLevelSchema = import_zod32.z.object({
  productId: import_zod32.z.number(),
  total: import_zod32.z.number(),
  state: StockLevelStateSchema,
  /** Count per stock location that has the product (or a threshold for it), largest first. */
  branches: import_zod32.z.array(import_zod32.z.object({ code: import_zod32.z.string(), name: import_zod32.z.string(), qty: import_zod32.z.number() }))
});
var ProductStockLevelsResponseSchema = import_zod32.z.array(ProductStockLevelSchema);
function productStockLevels(products, lines) {
  const out = [];
  for (const product of products) {
    const key = productStockKey(product);
    if (!key) continue;
    const matched = lines.filter((l) => lineMatchesKey(l, key));
    const perBranch = /* @__PURE__ */ new Map();
    let threshold = 0;
    let hasThreshold = false;
    for (const l of matched) {
      const b = perBranch.get(l.branchCode) ?? { code: l.branchCode, name: l.branchName, qty: 0 };
      b.qty += l.qty;
      perBranch.set(l.branchCode, b);
      if (l.lowThreshold !== null) {
        threshold += l.lowThreshold;
        hasThreshold = true;
      }
    }
    const total = [...perBranch.values()].reduce((s, b) => s + b.qty, 0);
    const state = total <= 0 ? "OUT" : hasThreshold && total <= threshold ? "LOW" : "IN";
    out.push({
      productId: product.id,
      total,
      state,
      branches: [...perBranch.values()].filter((b) => b.qty !== 0).sort((a, b) => b.qty - a.qty || a.code.localeCompare(b.code))
    });
  }
  return out;
}

// src/sheet-apply.ts
function readProduct(text4) {
  const isBar = /\bbars?\b/i.test(text4);
  if (isBar) {
    const w = parseBarWeight(text4);
    return w.grams === null ? null : { kind: "BAR", variant: w.variant };
  }
  const coin = parseCoinName(text4);
  if (coin.family === "Other") return null;
  return { kind: "COIN", family: coin.family, variant: coin.variant, weight: parseWeight(text4)?.label ?? null };
}
function matchLines2(product, lines) {
  if (product.kind === "BAR") return lines.filter((l) => l.kind === "BAR" && l.variant === product.variant);
  const sameFamily = lines.filter((l) => l.kind === "COIN" && l.family.toLowerCase() === product.family.toLowerCase());
  const exact = sameFamily.filter((l) => l.variant.toLowerCase() === product.variant.toLowerCase());
  if (exact.length) return exact;
  if (!product.weight) return [];
  return sameFamily.filter((l) => l.variant.toLowerCase().startsWith(product.weight.toLowerCase()));
}
function planRow(row, prior, ctx) {
  if (!row.eligible) {
    if (prior && prior.status === "APPLIED" && prior.appliedQty !== 0) {
      return { type: "WITHDRAWN", appliedQty: prior.appliedQty, lineId: prior.lineId };
    }
    return { type: "SKIP", reason: "INELIGIBLE" };
  }
  if (!row.branchCode || ctx.cutoverDate === null) return { type: "SKIP", reason: "NO_BRANCH" };
  if (prior?.status === "DISMISSED") return { type: "SKIP", reason: "DISMISSED" };
  if (!row.date) return { type: "SKIP", reason: "NO_DATE" };
  if (row.date <= ctx.cutoverDate) return { type: "SKIP", reason: "CUTOVER" };
  if (!row.qty || row.qty <= 0) return { type: "SKIP", reason: "NO_QTY" };
  const sign = row.kind === "SALE" ? -1 : 1;
  const target = sign * row.qty;
  if (prior) {
    if (prior.status === "NEEDS_DECISION") return { type: "SKIP", reason: "PENDING" };
    const diff = target - prior.appliedQty;
    if (diff === 0) return { type: "SKIP", reason: "UNCHANGED" };
    if (prior.lineId === null) return { type: "SKIP", reason: "PENDING" };
    return { type: "APPLY", delta: diff, lineId: prior.lineId };
  }
  const product = readProduct(row.productText);
  if (!product) return { type: "UNMATCHED", delta: target, message: `Cannot tell what \u201C${row.productText}\u201D is.` };
  let found = matchLines2(product, ctx.candidates);
  if (row.kind === "SALE") {
    const stocked = found.filter((l) => l.qty > 0);
    if (stocked.length === 0) {
      return {
        type: "UNMATCHED",
        delta: target,
        message: found.length ? "The matching line has no stock on record." : "No stock line matches this product at this branch."
      };
    }
    found = stocked;
  }
  if (found.length === 0) {
    const create = product.kind === "BAR" ? { kind: "BAR", family: "Bar", variant: product.variant, refinery: "" } : { kind: "COIN", family: product.family, variant: product.variant, refinery: "" };
    return { type: "CREATE_AND_APPLY", delta: target, create };
  }
  if (found.length > 1) return { type: "PICK_LINE", delta: target, lineIds: found.map((l) => l.lineId) };
  const only = found[0];
  if (only.lastManualOn !== null && only.lastManualOn >= row.date) {
    return { type: "ASK_COUNTED", delta: target, lineId: only.lineId };
  }
  return { type: "APPLY", delta: target, lineId: only.lineId };
}

// src/product-names.ts
var METAL_TOKEN = [
  [/gold/, "GOLD"],
  [/silver/, "SILVER"],
  [/platinum/, "PLATINUM"],
  [/palladium/, "PALLADIUM"]
];
function deriveMetalHint(text4, sources, refinery) {
  const read = parseProductName(text4, refinery ?? null).metals;
  if (read.size === 1) return [...read][0];
  if (read.size > 1) return null;
  const list2 = (Array.isArray(sources) ? sources : String(sources ?? "").split(/[\s,|]+/)).map((s) => s.toLowerCase());
  const found = /* @__PURE__ */ new Set();
  for (const s of list2) for (const [re, m] of METAL_TOKEN) if (re.test(s)) found.add(m);
  return found.size === 1 ? [...found][0] : null;
}
function bcItemNoFromSku(sku) {
  const m = /^\s*(\d{4})(?:\.0+)?(?:\s*-\s*[A-Za-z][\w\s-]*)?\s*$/.exec(String(sku ?? ""));
  return m ? m[1] : null;
}

// src/bc-history.ts
var import_zod33 = require("zod");
var BC_HISTORY_KINDS = ["shipments", "shipment_lines", "receipts", "ledger"];
var isoDate = import_zod33.z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
var text3 = (max) => import_zod33.z.string().max(max).nullable();
var customerCode = import_zod33.z.string().regex(/^C\d{6}$/).nullable();
var BcShipmentRowSchema = import_zod33.z.strictObject({
  no: import_zod33.z.string().min(1).max(40),
  customerNo: text3(40),
  /** Redaction code of the sell-to customer, looked up from the name in the browser. */
  customerCode,
  documentDate: isoDate.nullable(),
  postingDate: isoDate.nullable(),
  externalDocNo: text3(100),
  locationCode: text3(40)
});
var BcShipmentLineRowSchema = import_zod33.z.strictObject({
  documentNo: import_zod33.z.string().min(1).max(40),
  /** Position of the line within its shipment, from 1. The export has no line number of its own. */
  lineNo: import_zod33.z.number().int().positive(),
  customerNo: text3(40),
  itemNo: text3(40),
  description: text3(200),
  locationCode: text3(40),
  quantity: import_zod33.z.number().nullable()
});
var BcReceiptRowSchema = import_zod33.z.strictObject({
  no: import_zod33.z.string().min(1).max(40),
  vendorNo: text3(40),
  /** Redaction code of a private seller (customer table), when the vendor name is in the map. */
  sellerCode: customerCode,
  documentDate: isoDate.nullable(),
  locationCode: text3(40)
});
var BcLedgerRowSchema = import_zod33.z.strictObject({
  entryNo: import_zod33.z.number().int().positive(),
  postingDate: isoDate.nullable(),
  entryType: import_zod33.z.string().min(1).max(40),
  documentType: text3(40),
  documentNo: import_zod33.z.string().max(40),
  itemNo: import_zod33.z.string().min(1).max(40),
  locationCode: text3(40),
  quantity: import_zod33.z.number(),
  remainingQuantity: import_zod33.z.number().nullable(),
  salesAmount: import_zod33.z.number().nullable(),
  costAmount: import_zod33.z.number().nullable(),
  open: import_zod33.z.boolean().nullable(),
  /** Serial No. column, when the list shows it. Placeholders ("NOBARNO3", "BRINKS TBC") are dropped. */
  serialNo: text3(60).default(null),
  /** Customer or Vendor (Source Type) and its BC number (Source No.). */
  sourceType: text3(20).default(null),
  sourceNo: text3(40).default(null)
});
var MAX_ROWS = 5e4;
var BcHistoryRequestSchema = import_zod33.z.object({
  fileNames: import_zod33.z.array(import_zod33.z.string().min(1).max(200)).max(10),
  shipments: import_zod33.z.array(BcShipmentRowSchema).max(MAX_ROWS).default([]),
  shipmentLines: import_zod33.z.array(BcShipmentLineRowSchema).max(MAX_ROWS).default([]),
  receipts: import_zod33.z.array(BcReceiptRowSchema).max(MAX_ROWS).default([]),
  ledger: import_zod33.z.array(BcLedgerRowSchema).max(MAX_ROWS).default([])
});
var tableCounts = import_zod33.z.object({ added: import_zod33.z.number().int(), changed: import_zod33.z.number().int(), unchanged: import_zod33.z.number().int() });
var BcHistoryResultSchema = import_zod33.z.object({
  /** 0 on a preview. */
  batchId: import_zod33.z.number().int(),
  shipments: tableCounts,
  shipmentLines: tableCounts,
  receipts: tableCounts,
  ledger: tableCounts,
  /** Customers that got their BC customer or vendor number from this import. */
  customersLinked: import_zod33.z.number().int(),
  /** A customer already holds a different BC number; nothing was overwritten. */
  customerConflicts: import_zod33.z.number().int(),
  /** Customer codes in the file that the app does not know. */
  unknownCustomerCodes: import_zod33.z.number().int(),
  /** Shipments whose External Document No. is a tradesheet reference found in the app. */
  shipmentsToTrades: import_zod33.z.number().int(),
  /** Shipments whose External Document No. is a Zoho invoice found in the app. */
  shipmentsToZohoInvoices: import_zod33.z.number().int(),
  /** Matched sales the tradesheet does not show as collected although BC shipped them. */
  shippedNotCollected: import_zod33.z.number().int(),
  itemsAdded: import_zod33.z.number().int(),
  itemsUpdated: import_zod33.z.number().int(),
  eventsAdded: import_zod33.z.number().int(),
  /** Stored events this import corrected (a date, a customer learnt since). */
  eventsUpdated: import_zod33.z.number().int(),
  eventsUnchanged: import_zod33.z.number().int(),
  /** Serial tracking entries whose ledger entry is not imported yet; they get events on a later import. */
  trackingWithoutLedger: import_zod33.z.number().int(),
  /** Shipment lines with no reference linked to a sale by customer, product, quantity and amount. */
  shipmentLinesLinked: import_zod33.z.number().int(),
  /** Shipment lines with sales suggested in the Review tab for a person to confirm. */
  shipmentLinesSuggested: import_zod33.z.number().int(),
  /** Shipment lines no sale fits. */
  shipmentLinesUnmatched: import_zod33.z.number().int()
});
var ITEM_EVENT_KINDS = [
  "RECEIVED",
  "OPENING_BALANCE",
  "ADJUSTED_IN",
  "ADJUSTED_OUT",
  "TRANSFERRED",
  "COLLECTED",
  "RETURNED_BY_CUSTOMER",
  "RETURNED_TO_VENDOR"
];
var ITEM_STATUSES = ["IN_STOCK", "COLLECTED", "GONE", "UNKNOWN"];
function bcEventKind(entryType, documentType, documentNo, quantity) {
  const type = entryType.trim().toLowerCase();
  const doc = (documentType ?? "").trim().toLowerCase();
  if (type === "purchase") return doc.includes("credit memo") || quantity < 0 ? "RETURNED_TO_VENDOR" : "RECEIVED";
  if (type === "sale") return doc.includes("credit memo") || quantity > 0 ? "RETURNED_BY_CUSTOMER" : "COLLECTED";
  if (type === "transfer") return "TRANSFERRED";
  if (type === "positive adjmt." || type === "positive adjmt") {
    return /^open/i.test((documentNo ?? "").trim()) ? "OPENING_BALANCE" : "ADJUSTED_IN";
  }
  if (type === "negative adjmt." || type === "negative adjmt") return "ADJUSTED_OUT";
  return null;
}
function itemStatusAfter(kind) {
  switch (kind) {
    case "COLLECTED":
      return "COLLECTED";
    case "ADJUSTED_OUT":
    case "RETURNED_TO_VENDOR":
      return "GONE";
    default:
      return "IN_STOCK";
  }
}
function serialKey(raw) {
  return String(raw ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function isRealSerial(raw) {
  const key = serialKey(raw);
  if (key.length < 3 || !/\d/.test(key)) return false;
  return !/^NOBARNO\d*$|TBC$|^NOSERIAL|^NA$|^NONE$/.test(key);
}
function parsePastedTable(textIn) {
  return textIn.replace(/\r\n?/g, "\n").split("\n").filter((line) => line.trim() !== "").map((line) => line.split("	"));
}
var headerNorm = (h) => String(h ?? "").toLowerCase().replace(/:$/, "").trim();
function detectBcHistoryKind(header) {
  const h = new Set(header.map(headerNorm));
  if (h.has("entry no.") && h.has("entry type") && h.has("item no.")) return "ledger";
  if (h.has("buy-from vendor no.")) return "receipts";
  if (h.has("document no.") && h.has("sell-to customer no.") && h.has("quantity")) return "shipment_lines";
  if (h.has("no.") && h.has("sell-to customer no.") && !h.has("amount prepaid")) return "shipments";
  return null;
}
var pad = (n) => String(n).padStart(2, "0");
var SLASH_DATE = /^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/;
function detectDateOrder(cells) {
  let dmy = 0;
  let mdy = 0;
  for (const c of cells) {
    const m = String(c ?? "").trim().match(SLASH_DATE);
    if (!m) continue;
    if (Number(m[1]) > 12) dmy++;
    else if (Number(m[2]) > 12) mdy++;
  }
  if (dmy === mdy) return null;
  return dmy > mdy ? "DMY" : "MDY";
}
function bcDate(raw, order = "DMY") {
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw.toISOString().slice(0, 10);
  if (typeof raw === "number" && raw > 2e4 && raw < 8e4) {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(raw) * 864e5);
    return d.toISOString().slice(0, 10);
  }
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const m = s.match(SLASH_DATE);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  let [day, month] = order === "DMY" ? [a, b] : [b, a];
  if (month > 12 && day <= 12) [day, month] = [month, day];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${m[3]}-${pad(month)}-${pad(day)}`;
}
function num2(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  const s = String(raw ?? "").trim().replace(/,/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function str(raw, max) {
  const s = String(raw ?? "").trim();
  return s ? s.slice(0, max) : null;
}
function bool(raw) {
  if (typeof raw === "boolean") return raw;
  const s = String(raw ?? "").trim().toLowerCase();
  if (["1", "true", "yes"].includes(s)) return true;
  if (["0", "false", "no"].includes(s)) return false;
  return null;
}
function mapBcHistory(sheet, names) {
  const out = { kind: null, shipments: [], shipmentLines: [], receipts: [], ledger: [], unmappedNames: 0, skipped: 0, dateOrder: "DMY" };
  const headerAt = sheet.findIndex((r, i) => i < 10 && detectBcHistoryKind(r) !== null);
  if (headerAt === -1) return out;
  const header = sheet[headerAt].map(headerNorm);
  const kind = detectBcHistoryKind(sheet[headerAt]);
  out.kind = kind;
  const at = (...names2) => header.findIndex((h) => names2.includes(h));
  const cell2 = (cells, i) => i >= 0 ? cells[i] : null;
  const code = (name) => {
    const n = normaliseName(String(name ?? ""));
    if (!n) return null;
    const c = names.get(n) ?? null;
    if (!c) out.unmappedNames++;
    return c && /^C\d{6}$/.test(c) ? c : null;
  };
  const body = sheet.slice(headerAt + 1).filter((r) => r.some((c) => String(c ?? "").trim() !== ""));
  const dateCols = header.map((h, i) => h.endsWith("date") ? i : -1).filter((i) => i >= 0);
  const order = detectDateOrder(body.flatMap((r) => dateCols.map((i) => r[i]))) ?? "DMY";
  out.dateOrder = order;
  const date = (raw) => bcDate(raw, order);
  if (kind === "shipments") {
    const i = { no: at("no."), custNo: at("sell-to customer no."), name: at("sell-to customer name"), doc: at("document date"), post: at("posting date"), ext: at("external document no."), loc: at("location code") };
    for (const r of body) {
      const no = str(cell2(r, i.no), 40);
      if (!no) {
        out.skipped++;
        continue;
      }
      out.shipments.push({
        no,
        customerNo: str(cell2(r, i.custNo), 40),
        customerCode: code(cell2(r, i.name)),
        documentDate: date(cell2(r, i.doc)),
        postingDate: date(cell2(r, i.post)),
        externalDocNo: str(cell2(r, i.ext), 100),
        locationCode: str(cell2(r, i.loc), 40)
      });
    }
  } else if (kind === "shipment_lines") {
    const i = { doc: at("document no."), custNo: at("sell-to customer no."), item: at("no."), desc: at("description"), loc: at("location code"), qty: at("quantity") };
    const lineNos = /* @__PURE__ */ new Map();
    for (const r of body) {
      const documentNo = str(cell2(r, i.doc), 40);
      if (!documentNo) {
        out.skipped++;
        continue;
      }
      const lineNo = (lineNos.get(documentNo) ?? 0) + 1;
      lineNos.set(documentNo, lineNo);
      out.shipmentLines.push({
        documentNo,
        lineNo,
        customerNo: str(cell2(r, i.custNo), 40),
        itemNo: str(cell2(r, i.item), 40),
        description: str(cell2(r, i.desc), 200),
        locationCode: str(cell2(r, i.loc), 40),
        quantity: num2(cell2(r, i.qty))
      });
    }
  } else if (kind === "receipts") {
    const i = { no: at("no."), vendorNo: at("buy-from vendor no."), name: at("buy-from vendor name"), doc: at("document date"), loc: at("location code") };
    for (const r of body) {
      const no = str(cell2(r, i.no), 40);
      if (!no) {
        out.skipped++;
        continue;
      }
      const vendorNo = str(cell2(r, i.vendorNo), 40);
      out.receipts.push({
        no,
        vendorNo,
        sellerCode: vendorNo && /^PRV/i.test(vendorNo) ? code(cell2(r, i.name)) : null,
        documentDate: date(cell2(r, i.doc)),
        locationCode: str(cell2(r, i.loc), 40)
      });
    }
  } else {
    const i = {
      entry: at("entry no."),
      post: at("posting date"),
      type: at("entry type"),
      docType: at("document type"),
      docNo: at("document no."),
      item: at("item no."),
      loc: at("location code"),
      qty: at("quantity"),
      rem: at("remaining quantity"),
      sales: at("sales amount (actual)"),
      cost: at("cost amount (actual)"),
      open: at("open"),
      serial: at("serial no."),
      srcType: at("source type"),
      srcNo: at("source no.")
    };
    for (const r of body) {
      const entryNo = num2(cell2(r, i.entry));
      const entryType = str(cell2(r, i.type), 40);
      const itemNo = str(cell2(r, i.item), 40);
      if (!entryNo || !Number.isInteger(entryNo) || entryNo <= 0 || !entryType || !itemNo) {
        out.skipped++;
        continue;
      }
      out.ledger.push({
        entryNo,
        postingDate: date(cell2(r, i.post)),
        entryType,
        documentType: str(cell2(r, i.docType), 40),
        documentNo: str(cell2(r, i.docNo), 40) ?? "",
        itemNo,
        locationCode: str(cell2(r, i.loc), 40),
        quantity: num2(cell2(r, i.qty)) ?? 0,
        remainingQuantity: num2(cell2(r, i.rem)),
        salesAmount: num2(cell2(r, i.sales)),
        costAmount: num2(cell2(r, i.cost)),
        open: bool(cell2(r, i.open)),
        serialNo: isRealSerial(cell2(r, i.serial)) ? str(cell2(r, i.serial), 60) : null,
        sourceType: str(cell2(r, i.srcType), 20),
        sourceNo: str(cell2(r, i.srcNo), 40)
      });
    }
  }
  return out;
}
var ItemTraceEventSchema = import_zod33.z.object({
  kind: import_zod33.z.enum(ITEM_EVENT_KINDS),
  date: isoDate.nullable(),
  source: import_zod33.z.string(),
  sourceRef: import_zod33.z.string().nullable(),
  locationCode: import_zod33.z.string().nullable(),
  /** BC customer or vendor no. on the document. */
  partyNo: import_zod33.z.string().nullable(),
  /** Redaction code of the customer, when known. */
  customerCode: import_zod33.z.string().nullable(),
  /** Tradesheet reference of the matched sale, when known. */
  tradeReference: import_zod33.z.string().nullable(),
  quantity: import_zod33.z.number(),
  amount: import_zod33.z.number().nullable()
});
var ItemTraceSchema = import_zod33.z.object({
  serial: import_zod33.z.string(),
  bcItemNo: import_zod33.z.string().nullable(),
  product: import_zod33.z.string().nullable(),
  status: import_zod33.z.enum(ITEM_STATUSES),
  locationCode: import_zod33.z.string().nullable(),
  events: import_zod33.z.array(ItemTraceEventSchema)
});
var ItemTraceQuerySchema = import_zod33.z.object({ serial: import_zod33.z.string().trim().min(3).max(60) });
var ShippedNotCollectedRowSchema = import_zod33.z.object({
  tradeId: import_zod33.z.number().int(),
  reference: import_zod33.z.string(),
  /** Redaction code of the customer, when the sale is linked to one. */
  customerCode: import_zod33.z.string().nullable(),
  product: import_zod33.z.string(),
  qty: import_zod33.z.number().nullable(),
  saleDate: isoDate.nullable(),
  shipmentNo: import_zod33.z.string(),
  /** The day BC posted the shipment, which is when the customer collected. */
  shippedOn: isoDate.nullable(),
  /** A "tick Collected" sheet task is already open for this sale. */
  taskOpen: import_zod33.z.boolean()
});
var ShippedNotCollectedListSchema = import_zod33.z.array(ShippedNotCollectedRowSchema);
var ShippedNotCollectedTasksResultSchema = import_zod33.z.object({
  /** Sheet tasks created now. */
  created: import_zod33.z.number().int(),
  /** Sales that already had an open task. */
  alreadyOpen: import_zod33.z.number().int()
});
var COLLECTED_TASK = { sheet: "Tradesheet", what: "Tick Collected (C or the date)", value: "C", check: "TRADE_COLLECTED" };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AI_MESSAGE_MAX_LENGTH,
  AI_QUESTION_MAX_LENGTH,
  ALIAS_USAGE_SOURCES,
  ALIAS_VIEWS,
  AddBarRequestSchema,
  AddCoinRequestSchema,
  AddEvidenceRequestSchema,
  AddLiveStockBarRequestSchema,
  AdjustLiveStockRequestSchema,
  AdminLogEntrySchema,
  AdminLogsQuerySchema,
  AdminLogsResponseSchema,
  AdminOverviewSchema,
  AiAnswerStatusEnum,
  AiCitationSchema,
  AiModeEnum,
  AiSpotNoteSchema,
  AiStatusSchema,
  AiUsageSchema,
  AliasCountsSchema,
  AliasRowSchema,
  AliasSeenInSchema,
  AliasTargetSchema,
  AliasUsageExampleSchema,
  AliasUsageMetalSchema,
  AliasUsageResponseSchema,
  AliasUsageSourceSchema,
  AliasesQuerySchema,
  AliasesResponseSchema,
  AllocationSummarySchema,
  ApiCatalogueSchema,
  ApiEndpointParameterSchema,
  ApiEndpointSchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  ApplyPerMetalRequestSchema,
  ApplyPerMetalResultSchema,
  AskRequestSchema,
  AskResponseSchema,
  AskStreamEventSchema,
  AuditEntrySchema,
  AuditLogResponseSchema,
  AuditQuerySchema,
  AuthResponseSchema,
  BAR_EXPORT_HEADERS,
  BAR_STATUSES,
  BC_HISTORY_KINDS,
  BackfillHistoryQuerySchema,
  BarStatusEnum,
  BaselineBarRowSchema,
  BaselineCoinRowSchema,
  BcAwaitingRequestSchema,
  BcAwaitingResultSchema,
  BcHistoryRequestSchema,
  BcHistoryResultSchema,
  BcItemProductOptionSchema,
  BcItemSchema,
  BcItemsResponseSchema,
  BcLedgerRowSchema,
  BcReceiptRowSchema,
  BcSalesProductActionSchema,
  BcSalesProductRowSchema,
  BcSalesProductsApplyRequestSchema,
  BcSalesProductsApplyResultSchema,
  BcSalesProductsPreviewSchema,
  BcShipmentLineRowSchema,
  BcShipmentRowSchema,
  BranchRegionEnum,
  BranchSchema,
  CASH_AML_THRESHOLD,
  COIN_DESIGNS,
  COIN_EXPORT_HEADERS,
  COLLAPSE_ABOVE_CHARACTERS,
  COLLECTED_FLAGS,
  COLLECTED_TASK,
  CPTY_KINDS,
  CUSTOMER_ORDER_STATUSES,
  CUSTOMER_ORDER_STATUS_LABELS,
  CarryForwardRequestSchema,
  CarryForwardResultSchema,
  ChangePasswordSchema,
  ClientErrorReportBatchSchema,
  ClientErrorReportSchema,
  ColorModeEnum,
  CreateBranchRequestSchema,
  CreateCustomerOrderRequestSchema,
  CreateDiscrepancyRequestSchema,
  CreateLiveStockLineRequestSchema,
  CreateProductDtoSchema,
  CreateSalesProductRequestSchema,
  CreateSpotPriceDtoSchema,
  CreateStocktakeRequestSchema,
  CreateUserRequestSchema,
  CurrencyEnum,
  CustomerInvoiceRowSchema,
  CustomerListResponseSchema,
  CustomerListRowSchema,
  CustomerOrderEvidenceSchema,
  CustomerOrderRowSchema,
  CustomerOrderSchema,
  CustomerOrderStatusEnum,
  CustomerProfileSchema,
  DISCREPANCY_ISSUE_TYPES,
  DbColumnSchema,
  DbDeleteRequestSchema,
  DbInsertRequestSchema,
  DbRowResponseSchema,
  DbRowsQuerySchema,
  DbRowsResponseSchema,
  DbTableSummarySchema,
  DbTablesResponseSchema,
  DbUpdateRequestSchema,
  DiscrepancyIssueTypeEnum,
  DiscrepancySchema,
  DuplicateRowSchema,
  DuplicatesResponseSchema,
  EMPTY_SCOPE_VIEW,
  EVIDENCE_KINDS,
  EVIDENCE_KIND_LABELS,
  ErrorLogEntrySchema,
  ErrorLogKindEnum,
  ErrorLogQuerySchema,
  ErrorLogSeverityEnum,
  ErrorLogSourceEnum,
  EvidenceKindEnum,
  ExpectedCustomerStockSchema,
  FAKE_CUSTOMERS,
  FIT_HIGH,
  FIT_HIGH_SILVER,
  FIT_LOW,
  FOREIGN_COINS,
  FetchAttemptSchema,
  FetchLogQuerySchema,
  FetchMetricsSchema,
  FetchSourceEnum,
  FetchTriggerEnum,
  GRAMS_PER_TROY_OUNCE,
  HandoverSchema,
  HealthCheckSchema,
  HealthItemSchema,
  HealthStatusEnum,
  HistoricCloseQuerySchema,
  HistoricSpotSchema,
  HourlyStatsSchema,
  IMPORT_SCHEMA_VERSION,
  IMPORT_TABLE_NAMES,
  IMPORT_TABLE_SPECS,
  ISSUE_TYPE_LABELS,
  ITEM_EVENT_KINDS,
  ITEM_STATUSES,
  ImportBatchListSchema,
  ImportBatchSummarySchema,
  ImportCustomerOrdersRequestSchema,
  ImportCustomerOrdersResultSchema,
  ImportJournalRequestSchema,
  ImportJournalResultSchema,
  ImportMetaSchema,
  ImportPhysicalRequestSchema,
  ImportPhysicalResultSchema,
  ImportRowIssueCodeSchema,
  ImportRowIssueSchema,
  ImportTableSchemas,
  InventoryBarRowSchema,
  InventoryBarsQuerySchema,
  InventoryBarsResponseSchema,
  InventoryCoinRowSchema,
  InventoryCoinsQuerySchema,
  InventoryCoinsResponseSchema,
  InventoryPositionSchema,
  InventoryStocktakeRefSchema,
  InvoiceCollectedSchema,
  InvoiceDetailSchema,
  InvoiceLineRowSchema,
  InvoiceLinkRowSchema,
  InvoiceListResponseSchema,
  InvoiceListRowSchema,
  ItemTraceEventSchema,
  ItemTraceQuerySchema,
  ItemTraceSchema,
  JOURNAL_EXPORT_HEADERS,
  KB_BC_HUB,
  KB_BC_HUB_PATH,
  KB_CATEGORIES,
  KB_CATEGORY_INFO,
  KB_FLOW_BARS,
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
  KbVisibilityEnum,
  LINK_CONFIDENCES,
  LINK_TYPES,
  LIVE_BRANCH_CODES,
  LIVE_BRANCH_NAMES,
  LatestHandoverSchema,
  LinkBcItemRequestSchema,
  LinkDecisionRequestSchema,
  LinkDecisionResultSchema,
  LinkDecisionSchema,
  LinkLiveStockBranchRequestSchema,
  LiveBarStatusSchema,
  LiveBaselinePreviewSchema,
  LiveBaselineRequestSchema,
  LiveBaselineResultSchema,
  LiveKindSchema,
  LiveMetalSchema,
  LiveMovementSourceSchema,
  LiveStockBarSchema,
  LiveStockBoardQuerySchema,
  LiveStockBoardSchema,
  LiveStockBranchSchema,
  LiveStockBranchesResponseSchema,
  LiveStockLineSchema,
  LiveStockMovementSchema,
  LogLevelEnum,
  LoginRequestSchema,
  LoginResponseSchema,
  LoginSchema,
  LowThresholdRequestSchema,
  MAX_LISTED_ISSUES,
  MELT_CATEGORIES,
  MapAliasRequestSchema,
  MarketDataResponseSchema,
  MarketModeStateSchema,
  MeltCalculatorRequestSchema,
  MeltCalculatorResponseSchema,
  MeltCategoryDataSchema,
  MeltCategoryKeyEnum,
  MessageResponseSchema,
  MetalSymbolSchema,
  MetalTypeEnum,
  NameSuggestionAcceptRequestSchema,
  NameSuggestionAcceptResultSchema,
  NameSuggestionDecisionRequestSchema,
  NameSuggestionDecisionResultSchema,
  NameSuggestionTargetSchema,
  OPTIONAL_COLUMNS,
  ORDER_LIFECYCLE,
  ORDER_LIFECYCLE_LABELS,
  ORDER_STEPS,
  OrderDetailSchema,
  OrderEventSchema,
  OrderLifecycleEnum,
  OrderListQuerySchema,
  OrderListResponseSchema,
  OrderQueueEnum,
  OrderRowSchema,
  OrderSourceEnum,
  OrderStepEnum,
  OverAllocatedLotSchema,
  OverAllocatedResponseSchema,
  PLAN_ROW_STATUSES,
  PORTFOLIO_MAX_QTY,
  PORTFOLIO_SMALL_INVESTOR_LIMIT,
  PRODUCT_NORM_EXAMPLES,
  PURCHASE_FIELDS,
  PaginationSchema,
  PaymentRowSchema,
  PerMetalChoiceSchema,
  PhysicalRegisterSchema,
  PlanCountsSchema,
  PlanRowSchema,
  PlanRowStatusEnum,
  Platform,
  PortfolioBuildRequestSchema,
  PortfolioBuildResponseSchema,
  PortfolioLineItemSchema,
  PortfolioProductTypeFilterEnum,
  PortfolioStrategyResultSchema,
  PricingProductOptionListSchema,
  PricingProductOptionSchema,
  PriorityStrengthEnum,
  ProductArraySchema,
  ProductCategoryEnum,
  ProductMapSchema,
  ProductSchema,
  ProductStockLevelSchema,
  ProductStockLevelsResponseSchema,
  ProductsSchema,
  ProfitAnalysisMissingFieldEnum,
  ProfitAnalysisRequestSchema,
  ProfitAnalysisResponseSchema,
  QuoteRowSchema,
  RECORD_PAGE_MAX,
  REDACTED_CODE_COLUMNS,
  REDACTED_NAME_TABLES,
  REDACTED_TEXT_COLUMNS,
  REFINERIES,
  REGISTER_EXPORT_HEADERS,
  RELINK_TABLES,
  ROADMAP_QUEUE_MAX_TEXT,
  ROADMAP_SCOPE_FILES,
  RawProductSchema,
  RawSpotPriceSchema,
  RecalculateOverridesSchema,
  ReconcileResultSchema,
  RecordSearchRequestSchema,
  RecordStepRequestSchema,
  RefreshRequestSchema,
  RefreshResponseSchema,
  RegisterSchema,
  RelinkRequestSchema,
  RelinkResultSchema,
  RelinkTableResultSchema,
  ResolveSheetApplicationRequestSchema,
  ReviewLinkRowSchema,
  ReviewLinkTypeSchema,
  ReviewLinksQuerySchema,
  ReviewLinksResponseSchema,
  ReviewPageQuerySchema,
  ReviewSummarySchema,
  RoadmapDocumentSchema,
  RoadmapEditError,
  RoadmapEditRequestSchema,
  RoadmapEditSchema,
  RoadmapInboxItemSchema,
  RoadmapInboxPromoteSchema,
  RoadmapInboxRefreshSchema,
  RoadmapInboxSchema,
  RoadmapPullRequestSchema,
  RoadmapPullResultSchema,
  RoadmapPushRequestSchema,
  RoadmapPushResultSchema,
  RoadmapQueueAppendedSchema,
  RoadmapQueueEntrySchema,
  RoadmapQueueFiledRequestSchema,
  RoadmapQueueFiledResultSchema,
  RoadmapQueueListSchema,
  RoadmapQueueRequestSchema,
  RoadmapQueueSourceSchema,
  RoadmapScopeDecisionSchema,
  RoadmapScopeDoneSchema,
  RoadmapScopeItemSchema,
  RoadmapScopeKeySchema,
  RoadmapScopeRefreshSchema,
  RoadmapScopeSchema,
  RoadmapScopeTaskSchema,
  RoadmapScopeViewSchema,
  RoadmapSyncStatusSchema,
  RouteStatsSchema,
  SAFE_STATUSES,
  SALE_FIELDS,
  SHEETS,
  SPOT_FETCH_INTERVAL_MS,
  SPOT_LATE_AFTER_MS,
  SPOT_RED_AFTER_MS,
  SPOT_STALE_AFTER_MS,
  STEP_ROLE,
  STOCK_METALS,
  SYSTEMS,
  SalesProductListSchema,
  SalesProductSchema,
  SaveHandoverRequestSchema,
  SerialsCheckedEnum,
  SessionBranchSchema,
  SessionUserRoleEnum,
  SessionUserSchema,
  SetKbStatusRequestSchema,
  SetKbVisibilityRequestSchema,
  SetLiveStockBarStatusRequestSchema,
  SetUserBranchRequestSchema,
  SettleNamesRequestSchema,
  SettleNamesResultSchema,
  SettleResultSchema,
  SheetApplyItemSchema,
  SheetApplyPreviewSchema,
  SheetApplyResultSchema,
  SheetKindSchema,
  SheetLineOptionSchema,
  SheetNameEnum,
  SheetTaskListQuerySchema,
  SheetTaskSchema,
  ShippedNotCollectedListSchema,
  ShippedNotCollectedRowSchema,
  ShippedNotCollectedTasksResultSchema,
  SpotPriceArraySchema,
  SpotPriceMapSchema,
  SpotPriceSchema,
  SpotStatusResponseSchema,
  StockLevelStateSchema,
  StockMetalEnum,
  StockMetalSchema,
  StocktakeBarSchema,
  StocktakeCoinSchema,
  StocktakeDetailSchema,
  StocktakeLineSchema,
  StocktakeSchema,
  StocktakeStatusEnum,
  TRADE_METAL_SLIDER_BOUNDS,
  TRADE_STATES,
  TabPlanSchema,
  TableSizeSchema,
  TaskCheckEnum,
  TaskQueryParamsSchema,
  TaskStatusSchema,
  TradeBootstrapResponseSchema,
  TradeCartItemRequestSchema,
  TradeCartLineSchema,
  TradeCartRequestSchema,
  TradeCartResponseSchema,
  TradeProductSchema,
  TradeTransactionTypeEnum,
  TradesheetImportPlanSchema,
  TradesheetImportRequestSchema,
  TradesheetImportResultSchema,
  TradesheetTabSchema,
  TransferLiveStockRequestSchema,
  UI_SETTINGS_MAX_BYTES,
  UiSettingsSchema,
  UnresolvedLotRowSchema,
  UnresolvedLotsResponseSchema,
  UpdateBarRequestSchema,
  UpdateCoinRequestSchema,
  UpdateCustomerOrderRequestSchema,
  UpdateDiscrepancyRequestSchema,
  UpdateKbDocumentRequestSchema,
  UpdateMarketModeRequestSchema,
  UpdateProductFullDtoSchema,
  UpdateStockRequestSchema,
  UpdateStocktakeLineRequestSchema,
  UpdateStocktakeRequestSchema,
  UserProfileSchema,
  UserRole,
  UserSchema,
  UserStatus,
  WORKBOOK_CHUNK_MAX_ROWS,
  WORKBOOK_LOAD_ORDER,
  WorkbookChunkRequestSchema,
  WorkbookChunkResultSchema,
  absorbFile,
  aiInputLimit,
  aliasKey,
  aliasOk,
  allowedSteps,
  applyRoadmapEdit,
  assignOccurrences,
  bcDate,
  bcEventKind,
  bcItemNoFromSku,
  buildArticleLayout,
  buildBarExportRows,
  buildBlocks,
  buildCoinExportRows,
  buildJournalExportRows,
  buildNameLookup,
  buildPortfolioStrategies,
  buildRegisterExportRows,
  bundleScopeFiles,
  calculateProductPrice,
  canSeeKbVisibility,
  capabilitiesFor,
  classifyCpty,
  classifySection,
  classifyTab,
  coerceCell,
  coinTokens,
  compareProcedures,
  compareProducts,
  compareSerials,
  compareStockLabels,
  computeCurrentBuybackValue,
  computeMeltValue,
  computeProfit,
  computeRequiredSpotForTarget,
  computeTransactionPrice,
  computeVariance,
  coreRef,
  countTasks,
  createErrorReference,
  customerOrderChanges,
  customerSafeRow,
  deriveMetalHint,
  deriveOrder,
  deriveTradeState,
  detectBcHistoryKind,
  detectDateOrder,
  detectFileType,
  detectTabType,
  effectiveVatRate,
  expectedCustomerStock,
  extractQtyAndProduct,
  extractSources,
  fakeRedactionMap,
  fakeWorkbookSheets,
  fillKind,
  findAppOnlyTasks,
  findBrokenLinks,
  findDuplicateSerials,
  findHeaderRow,
  findLinks,
  findTodos,
  fingerprint,
  flowBarFor,
  flowNextSlug,
  guessSheetMonth,
  guessSheetMonthFromTabs,
  guideLibraryTargets,
  headingAnchor,
  homePathFor,
  indexKbDocument,
  isBondedProduct,
  isCashOverThreshold,
  isClosingBar,
  isOpenOrder,
  isPhysicallyHere,
  isRealSerial,
  isReferenceCell,
  isSpotMarketClosed,
  isStopStep,
  itemStatusAfter,
  kbArticlePath,
  kbReviewDueOn,
  kbReviewStatus,
  limitQuery,
  lineMatchesKey,
  linkOrdersToTradesheet,
  listedRefinery,
  liveRefinery,
  liveSerialKey,
  mapBcHistory,
  mapBcReport,
  mapOutsideCode,
  mapPurchaseHeaders,
  mapSaleHeaders,
  matchLines,
  matchProductName,
  matchTradeLine,
  meltLabel,
  mergeMetalPrices,
  mergeRoadmap,
  metalAwareAlias,
  metalInText,
  metalsFitting,
  nextAction,
  normaliseBackfillHeaders,
  normaliseName,
  normaliseProductText,
  normaliseRefinery,
  normalizeClient,
  normalizeProductName,
  normalizeReference,
  normalizeSerial,
  onHandSerials,
  orderLifecycle,
  orderSource,
  parseBarWeight,
  parseBarsPaste,
  parseBlocks,
  parseCoinName,
  parseCoinsPaste,
  parseCustomerOrdersPaste,
  parseDecisions,
  parseDeferredLinks,
  parseDesignDoc,
  parseJournalPaste,
  parseKbDocument,
  parseMetal,
  parsePastedTable,
  parseProductName,
  parsePurchaseRow,
  parseQuantity,
  parseReference,
  parseRoadmap,
  parseSaleRow,
  parseScopeBundle,
  parseScopeFile,
  parseSheetDate,
  parseSheetNumber,
  parseSoldComment,
  parseTrackingPaste,
  parseTradesheetPaste,
  parseTsv,
  parseWeight,
  parseWeightGrams,
  planAutolinks,
  planBarImport,
  planBaseline,
  planCustomerOrderImport,
  planRow,
  planUpload,
  priceMetalEvidence,
  pricingSkuFor,
  procedureFlow,
  productStockKey,
  productStockLevels,
  readCollected,
  readForeignCoin,
  readImportWorkbook,
  readProduct,
  referenceMatchKey,
  refineryInText,
  refineryMatch,
  refineryWords,
  resolveProduct,
  resolveRowProduct,
  rewriteKbLinks,
  roundBuyPrice,
  roundSellPrice,
  rowIsBlank,
  ruleTone,
  searchKb,
  serialKey,
  shareTermsAcrossBlocks,
  sheetTasksForStep,
  solveMissingPurchaseField,
  sortBranchCodes,
  splitDocSections,
  splitFrontmatter,
  splitScopeBundle,
  splitSections,
  splitSerials,
  spotFreshness,
  spotLookup,
  stripHeader,
  suggestProductForBcItem,
  summarizeBars,
  summarizeLines,
  taskShowsDone,
  termRegExp,
  toCsv,
  toIsoDate,
  toPlainText,
  totalCounted,
  unredactTables,
  variantGrams,
  withoutOptionalColumns
});
