"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoPaymentScalarFieldEnum = exports.LineSerialScalarFieldEnum = exports.ZohoInvoiceLineScalarFieldEnum = exports.ZohoInvoiceScalarFieldEnum = exports.QuoteScalarFieldEnum = exports.RefineryAliasScalarFieldEnum = exports.SalesProductScalarFieldEnum = exports.SupplierInvoiceScalarFieldEnum = exports.VendorScalarFieldEnum = exports.CustomerScalarFieldEnum = exports.HandoverScalarFieldEnum = exports.SheetTaskScalarFieldEnum = exports.OrderEventScalarFieldEnum = exports.ZohoProductScalarFieldEnum = exports.ProductRuleScalarFieldEnum = exports.ProductAliasScalarFieldEnum = exports.StockUnitScalarFieldEnum = exports.PurchaseLotScalarFieldEnum = exports.TradeScalarFieldEnum = exports.ImportBatchScalarFieldEnum = exports.CustomerOrderEvidenceScalarFieldEnum = exports.CustomerOrderItemScalarFieldEnum = exports.StocktakeCoinScalarFieldEnum = exports.StocktakeBarScalarFieldEnum = exports.StocktakeDiscrepancyScalarFieldEnum = exports.StocktakeLineScalarFieldEnum = exports.StocktakeScalarFieldEnum = exports.BcItemScalarFieldEnum = exports.AuditLogScalarFieldEnum = exports.RoadmapInboxScalarFieldEnum = exports.RoadmapSnapshotScalarFieldEnum = exports.RoadmapSyncStateScalarFieldEnum = exports.RoadmapDocumentScalarFieldEnum = exports.MarketModeStateScalarFieldEnum = exports.AiAnswerCacheScalarFieldEnum = exports.AiQuestionLogScalarFieldEnum = exports.KbDocumentScalarFieldEnum = exports.FetchAttemptScalarFieldEnum = exports.BranchScalarFieldEnum = exports.HistoricSpotPriceScalarFieldEnum = exports.MetalSpotPriceScalarFieldEnum = exports.ProductScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
exports.NullsOrder = exports.JsonNullValueFilter = exports.QueryMode = exports.JsonNullValueInput = exports.NullableJsonNullValueInput = exports.SortOrder = exports.NotificationScalarFieldEnum = exports.CompanySettingScalarFieldEnum = exports.UserPreferenceScalarFieldEnum = exports.AiFeedbackScalarFieldEnum = exports.ProductPriceSnapshotScalarFieldEnum = exports.UserPermissionOverrideScalarFieldEnum = exports.RolePermissionScalarFieldEnum = exports.SheetApplicationScalarFieldEnum = exports.LiveStockMovementScalarFieldEnum = exports.LiveStockBarScalarFieldEnum = exports.LiveStockLineScalarFieldEnum = exports.LiveStockBranchScalarFieldEnum = exports.ItemEventScalarFieldEnum = exports.ItemScalarFieldEnum = exports.BcLedgerEntryScalarFieldEnum = exports.BcReceiptScalarFieldEnum = exports.BcShipmentLineScalarFieldEnum = exports.BcShipmentScalarFieldEnum = exports.EntityLinkScalarFieldEnum = exports.BcTrackingEntryScalarFieldEnum = exports.BcSalesOrderScalarFieldEnum = exports.ZohoPurchaseOrderLineScalarFieldEnum = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Product: 'Product',
    MetalSpotPrice: 'MetalSpotPrice',
    HistoricSpotPrice: 'HistoricSpotPrice',
    Branch: 'Branch',
    FetchAttempt: 'FetchAttempt',
    KbDocument: 'KbDocument',
    AiQuestionLog: 'AiQuestionLog',
    AiAnswerCache: 'AiAnswerCache',
    MarketModeState: 'MarketModeState',
    RoadmapDocument: 'RoadmapDocument',
    RoadmapSyncState: 'RoadmapSyncState',
    RoadmapSnapshot: 'RoadmapSnapshot',
    RoadmapInbox: 'RoadmapInbox',
    AuditLog: 'AuditLog',
    BcItem: 'BcItem',
    Stocktake: 'Stocktake',
    StocktakeLine: 'StocktakeLine',
    StocktakeDiscrepancy: 'StocktakeDiscrepancy',
    StocktakeBar: 'StocktakeBar',
    StocktakeCoin: 'StocktakeCoin',
    CustomerOrderItem: 'CustomerOrderItem',
    CustomerOrderEvidence: 'CustomerOrderEvidence',
    ImportBatch: 'ImportBatch',
    Trade: 'Trade',
    PurchaseLot: 'PurchaseLot',
    StockUnit: 'StockUnit',
    ProductAlias: 'ProductAlias',
    ProductRule: 'ProductRule',
    ZohoProduct: 'ZohoProduct',
    OrderEvent: 'OrderEvent',
    SheetTask: 'SheetTask',
    Handover: 'Handover',
    Customer: 'Customer',
    Vendor: 'Vendor',
    SupplierInvoice: 'SupplierInvoice',
    SalesProduct: 'SalesProduct',
    RefineryAlias: 'RefineryAlias',
    Quote: 'Quote',
    ZohoInvoice: 'ZohoInvoice',
    ZohoInvoiceLine: 'ZohoInvoiceLine',
    LineSerial: 'LineSerial',
    ZohoPayment: 'ZohoPayment',
    ZohoPurchaseOrderLine: 'ZohoPurchaseOrderLine',
    BcSalesOrder: 'BcSalesOrder',
    BcTrackingEntry: 'BcTrackingEntry',
    EntityLink: 'EntityLink',
    BcShipment: 'BcShipment',
    BcShipmentLine: 'BcShipmentLine',
    BcReceipt: 'BcReceipt',
    BcLedgerEntry: 'BcLedgerEntry',
    Item: 'Item',
    ItemEvent: 'ItemEvent',
    LiveStockBranch: 'LiveStockBranch',
    LiveStockLine: 'LiveStockLine',
    LiveStockBar: 'LiveStockBar',
    LiveStockMovement: 'LiveStockMovement',
    SheetApplication: 'SheetApplication',
    RolePermission: 'RolePermission',
    UserPermissionOverride: 'UserPermissionOverride',
    ProductPriceSnapshot: 'ProductPriceSnapshot',
    AiFeedback: 'AiFeedback',
    UserPreference: 'UserPreference',
    CompanySetting: 'CompanySetting',
    Notification: 'Notification'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    password: 'password',
    role: 'role',
    isActive: 'isActive',
    admin: 'admin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLoginAt: 'lastLoginAt',
    uiSettings: 'uiSettings',
    branchId: 'branchId'
};
exports.ProductScalarFieldEnum = {
    id: 'id',
    sku: 'sku',
    name: 'name',
    metalType: 'metalType',
    weight: 'weight',
    spreadBuy: 'spreadBuy',
    spreadSell: 'spreadSell',
    vatRate: 'vatRate',
    stock: 'stock',
    isActive: 'isActive',
    category: 'category',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.MetalSpotPriceScalarFieldEnum = {
    id: 'id',
    metalType: 'metalType',
    priceEur: 'priceEur',
    priceGbp: 'priceGbp',
    source: 'source',
    timestamp: 'timestamp',
    createdAt: 'createdAt'
};
exports.HistoricSpotPriceScalarFieldEnum = {
    id: 'id',
    metalType: 'metalType',
    priceEur: 'priceEur',
    priceGbp: 'priceGbp',
    recordedAt: 'recordedAt',
    createdAt: 'createdAt'
};
exports.BranchScalarFieldEnum = {
    id: 'id',
    name: 'name',
    address: 'address',
    region: 'region',
    currency: 'currency',
    createdAt: 'createdAt'
};
exports.FetchAttemptScalarFieldEnum = {
    id: 'id',
    attemptedAt: 'attemptedAt',
    durationMs: 'durationMs',
    success: 'success',
    errorMessage: 'errorMessage',
    metalsResolved: 'metalsResolved',
    triggeredBy: 'triggeredBy'
};
exports.KbDocumentScalarFieldEnum = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    category: 'category',
    jurisdiction: 'jurisdiction',
    owner: 'owner',
    status: 'status',
    visibility: 'visibility',
    version: 'version',
    contentUpdatedOn: 'contentUpdatedOn',
    markdown: 'markdown',
    contentHash: 'contentHash',
    editedInApp: 'editedInApp',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AiQuestionLogScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    userId: 'userId',
    question: 'question',
    status: 'status',
    mode: 'mode',
    toolNames: 'toolNames',
    cached: 'cached',
    retried: 'retried',
    citations: 'citations',
    model: 'model',
    corpusHash: 'corpusHash',
    inputTokens: 'inputTokens',
    cachedInputTokens: 'cachedInputTokens',
    outputTokens: 'outputTokens',
    costMicros: 'costMicros',
    latencyMs: 'latencyMs',
    error: 'error'
};
exports.AiAnswerCacheScalarFieldEnum = {
    id: 'id',
    questionKey: 'questionKey',
    corpusHash: 'corpusHash',
    answer: 'answer',
    status: 'status',
    citations: 'citations',
    model: 'model',
    hits: 'hits',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
};
exports.MarketModeStateScalarFieldEnum = {
    id: 'id',
    weekend: 'weekend',
    volatile: 'volatile',
    shortage: 'shortage',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt'
};
exports.RoadmapDocumentScalarFieldEnum = {
    id: 'id',
    markdown: 'markdown',
    version: 'version',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt'
};
exports.RoadmapSyncStateScalarFieldEnum = {
    id: 'id',
    baseCommit: 'baseCommit',
    baseMarkdown: 'baseMarkdown',
    syncedAt: 'syncedAt',
    syncedBy: 'syncedBy'
};
exports.RoadmapSnapshotScalarFieldEnum = {
    id: 'id',
    markdown: 'markdown',
    version: 'version',
    reason: 'reason',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.RoadmapInboxScalarFieldEnum = {
    id: 'id',
    issueNumber: 'issueNumber',
    title: 'title',
    body: 'body',
    kind: 'kind',
    url: 'url',
    status: 'status',
    issueCreatedAt: 'issueCreatedAt',
    fetchedAt: 'fetchedAt',
    handledAt: 'handledAt',
    handledBy: 'handledBy',
    source: 'source'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    at: 'at',
    actor: 'actor',
    action: 'action',
    detail: 'detail'
};
exports.BcItemScalarFieldEnum = {
    itemNo: 'itemNo',
    description: 'description',
    productId: 'productId',
    refineryHint: 'refineryHint',
    salesProductId: 'salesProductId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StocktakeScalarFieldEnum = {
    id: 'id',
    name: 'name',
    countDate: 'countDate',
    cutoffDate: 'cutoffDate',
    status: 'status',
    stocktakeLead: 'stocktakeLead',
    secondChecker: 'secondChecker',
    notes: 'notes',
    createdBy: 'createdBy',
    finalisedBy: 'finalisedBy',
    finalisedAt: 'finalisedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    imported: 'imported',
    importBatchId: 'importBatchId'
};
exports.StocktakeLineScalarFieldEnum = {
    id: 'id',
    stocktakeId: 'stocktakeId',
    itemNo: 'itemNo',
    description: 'description',
    locationCode: 'locationCode',
    qtyCalculated: 'qtyCalculated',
    countedNormal: 'countedNormal',
    countedCustomer: 'countedCustomer',
    counted: 'counted',
    reason: 'reason',
    serialsChecked: 'serialsChecked',
    serialNote: 'serialNote',
    batchName: 'batchName',
    documentNo: 'documentNo',
    entryType: 'entryType',
    unitAmount: 'unitAmount',
    unitCost: 'unitCost',
    sourceKey: 'sourceKey'
};
exports.StocktakeDiscrepancyScalarFieldEnum = {
    id: 'id',
    stocktakeId: 'stocktakeId',
    itemNo: 'itemNo',
    description: 'description',
    issueType: 'issueType',
    bcShows: 'bcShows',
    physicalFound: 'physicalFound',
    serialNo: 'serialNo',
    action: 'action',
    resolved: 'resolved',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StocktakeBarScalarFieldEnum = {
    id: 'id',
    stocktakeId: 'stocktakeId',
    metal: 'metal',
    locationCode: 'locationCode',
    weightLabel: 'weightLabel',
    refinery: 'refinery',
    serial: 'serial',
    grams: 'grams',
    details: 'details',
    status: 'status',
    carriedFromId: 'carriedFromId',
    sourceKey: 'sourceKey',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StocktakeCoinScalarFieldEnum = {
    id: 'id',
    stocktakeId: 'stocktakeId',
    metal: 'metal',
    locationCode: 'locationCode',
    item: 'item',
    previousQty: 'previousQty',
    countedQty: 'countedQty',
    details: 'details',
    countsJson: 'countsJson',
    sourceKey: 'sourceKey'
};
exports.CustomerOrderItemScalarFieldEnum = {
    id: 'id',
    locationCode: 'locationCode',
    client: 'client',
    reference: 'reference',
    bcOrderNo: 'bcOrderNo',
    supplierRef: 'supplierRef',
    metal: 'metal',
    product: 'product',
    bcItemNo: 'bcItemNo',
    quantity: 'quantity',
    refinery: 'refinery',
    serials: 'serials',
    status: 'status',
    orderedOn: 'orderedOn',
    missing: 'missing',
    notes: 'notes',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tradeId: 'tradeId'
};
exports.CustomerOrderEvidenceScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    kind: 'kind',
    reference: 'reference',
    note: 'note',
    observedOn: 'observedOn',
    recordedBy: 'recordedBy',
    createdAt: 'createdAt'
};
exports.ImportBatchScalarFieldEnum = {
    id: 'id',
    fileName: 'fileName',
    sheetMonth: 'sheetMonth',
    source: 'source',
    importedBy: 'importedBy',
    importedAt: 'importedAt',
    summary: 'summary',
    kind: 'kind',
    schemaVersion: 'schemaVersion',
    tableCounts: 'tableCounts',
    status: 'status'
};
exports.TradeScalarFieldEnum = {
    id: 'id',
    reference: 'reference',
    referenceKey: 'referenceKey',
    occurrence: 'occurrence',
    metal: 'metal',
    branchCode: 'branchCode',
    branchId: 'branchId',
    initials: 'initials',
    client: 'client',
    qty: 'qty',
    productText: 'productText',
    productKey: 'productKey',
    productId: 'productId',
    date: 'date',
    spot: 'spot',
    cptyRaw: 'cptyRaw',
    cptyKind: 'cptyKind',
    state: 'state',
    stateFromColour: 'stateFromColour',
    lotKey: 'lotKey',
    lotId: 'lotId',
    supplierName: 'supplierName',
    supplierInvoice: 'supplierInvoice',
    collected: 'collected',
    collectedSource: 'collectedSource',
    collectedOn: 'collectedOn',
    deferredFrom: 'deferredFrom',
    deferredTo: 'deferredTo',
    cost: 'cost',
    receipt: 'receipt',
    profit: 'profit',
    margin: 'margin',
    vatDue: 'vatDue',
    totalPrice: 'totalPrice',
    netHedging: 'netHedging',
    boughtAt: 'boughtAt',
    soldAt: 'soldAt',
    paid: 'paid',
    notes: 'notes',
    hedgingNotes: 'hedgingNotes',
    sourceMonth: 'sourceMonth',
    sourceTab: 'sourceTab',
    sourceRow: 'sourceRow',
    fingerprint: 'fingerprint',
    missingFromImport: 'missingFromImport',
    issues: 'issues',
    firstBatchId: 'firstBatchId',
    lastBatchId: 'lastBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    sourceKey: 'sourceKey',
    system: 'system',
    cptyFill: 'cptyFill',
    refinery: 'refinery',
    customerId: 'customerId',
    supplierInvoiceId: 'supplierInvoiceId',
    salesProductId: 'salesProductId'
};
exports.PurchaseLotScalarFieldEnum = {
    id: 'id',
    reference: 'reference',
    referenceKey: 'referenceKey',
    occurrence: 'occurrence',
    metal: 'metal',
    branchCode: 'branchCode',
    branchId: 'branchId',
    client: 'client',
    qty: 'qty',
    productText: 'productText',
    productKey: 'productKey',
    productId: 'productId',
    received: 'received',
    datePaid: 'datePaid',
    pricePaid: 'pricePaid',
    pricePerItem: 'pricePerItem',
    hedgedAt: 'hedgedAt',
    melt: 'melt',
    commentsRaw: 'commentsRaw',
    commentSoldQty: 'commentSoldQty',
    commentAllSold: 'commentAllSold',
    commentReview: 'commentReview',
    allocatedQty: 'allocatedQty',
    sourceMonth: 'sourceMonth',
    sourceTab: 'sourceTab',
    sourceRow: 'sourceRow',
    fingerprint: 'fingerprint',
    missingFromImport: 'missingFromImport',
    issues: 'issues',
    firstBatchId: 'firstBatchId',
    lastBatchId: 'lastBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    sourceKey: 'sourceKey',
    system: 'system',
    refinery: 'refinery',
    sellerId: 'sellerId',
    supplierInvoiceId: 'supplierInvoiceId',
    salesProductId: 'salesProductId'
};
exports.StockUnitScalarFieldEnum = {
    id: 'id',
    lotId: 'lotId',
    seq: 'seq',
    tradeId: 'tradeId'
};
exports.ProductAliasScalarFieldEnum = {
    id: 'id',
    alias: 'alias',
    productKey: 'productKey',
    productId: 'productId',
    salesProductId: 'salesProductId',
    refinery: 'refinery',
    noProduct: 'noProduct',
    uses: 'uses',
    createdAt: 'createdAt',
    sources: 'sources',
    metalHint: 'metalHint',
    decidedBy: 'decidedBy',
    suggestedProductId: 'suggestedProductId',
    suggestedSalesProductId: 'suggestedSalesProductId',
    suggestedNoProduct: 'suggestedNoProduct',
    confidence: 'confidence',
    reason: 'reason',
    question: 'question',
    catalogueGap: 'catalogueGap'
};
exports.ProductRuleScalarFieldEnum = {
    id: 'id',
    kind: 'kind',
    pattern: 'pattern',
    value: 'value',
    note: 'note',
    active: 'active',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ZohoProductScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    sku: 'sku',
    itemName: 'itemName',
    productNorm: 'productNorm',
    metal: 'metal',
    qtySold: 'qtySold',
    amount: 'amount',
    avgPrice: 'avgPrice',
    productId: 'productId',
    salesProductId: 'salesProductId',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.OrderEventScalarFieldEnum = {
    id: 'id',
    tradeId: 'tradeId',
    step: 'step',
    by: 'by',
    at: 'at',
    note: 'note'
};
exports.SheetTaskScalarFieldEnum = {
    id: 'id',
    tradeId: 'tradeId',
    reference: 'reference',
    client: 'client',
    sheet: 'sheet',
    what: 'what',
    value: 'value',
    check: 'check',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    closedAt: 'closedAt',
    closedBy: 'closedBy',
    closedVia: 'closedVia'
};
exports.HandoverScalarFieldEnum = {
    id: 'id',
    note: 'note',
    by: 'by',
    createdAt: 'createdAt'
};
exports.CustomerScalarFieldEnum = {
    id: 'id',
    redactionCode: 'redactionCode',
    name: 'name',
    zohoNumber: 'zohoNumber',
    bcCustomerNo: 'bcCustomerNo',
    bcVendorNo: 'bcVendorNo',
    status: 'status',
    currency: 'currency',
    sources: 'sources',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VendorScalarFieldEnum = {
    id: 'id',
    redactionCode: 'redactionCode',
    name: 'name',
    zohoNumber: 'zohoNumber',
    status: 'status',
    currency: 'currency',
    sources: 'sources',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SupplierInvoiceScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    supplier: 'supplier',
    number: 'number',
    firstDate: 'firstDate',
    lastDate: 'lastDate',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SalesProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    metal: 'metal',
    genericNorm: 'genericNorm',
    weightLabel: 'weightLabel',
    refinery: 'refinery',
    pricingProductId: 'pricingProductId',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RefineryAliasScalarFieldEnum = {
    id: 'id',
    alias: 'alias',
    refinery: 'refinery',
    createdAt: 'createdAt'
};
exports.QuoteScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    reference: 'reference',
    referenceKey: 'referenceKey',
    date: 'date',
    metal: 'metal',
    branchCode: 'branchCode',
    qty: 'qty',
    productText: 'productText',
    productNorm: 'productNorm',
    customerId: 'customerId',
    salesProductId: 'salesProductId',
    status: 'status',
    convertedTradeId: 'convertedTradeId',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ZohoInvoiceScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    date: 'date',
    customerId: 'customerId',
    status: 'status',
    salesOrderNumber: 'salesOrderNumber',
    total: 'total',
    lineCount: 'lineCount',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ZohoInvoiceLineScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    invoiceId: 'invoiceId',
    lineNo: 'lineNo',
    date: 'date',
    customerId: 'customerId',
    qty: 'qty',
    itemName: 'itemName',
    productNorm: 'productNorm',
    unitPrice: 'unitPrice',
    lineTotal: 'lineTotal',
    itemDesc: 'itemDesc',
    collectedFlag: 'collectedFlag',
    collectedDate: 'collectedDate',
    refinery: 'refinery',
    salesProductId: 'salesProductId',
    deliveredBrinks: 'deliveredBrinks',
    soldBack: 'soldBack',
    refsFound: 'refsFound',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LineSerialScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    lineId: 'lineId',
    serial: 'serial',
    serialNorm: 'serialNorm',
    refinery: 'refinery',
    collectedFlag: 'collectedFlag',
    collectedDate: 'collectedDate',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ZohoPaymentScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    invoiceId: 'invoiceId',
    customerId: 'customerId',
    zohoCustomerId: 'zohoCustomerId',
    date: 'date',
    invoiceDate: 'invoiceDate',
    amount: 'amount',
    invoiceAmount: 'invoiceAmount',
    mode: 'mode',
    reference: 'reference',
    type: 'type',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ZohoPurchaseOrderLineScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    poNumber: 'poNumber',
    lineNo: 'lineNo',
    date: 'date',
    vendorNumber: 'vendorNumber',
    vendorId: 'vendorId',
    itemName: 'itemName',
    productNorm: 'productNorm',
    qtyOrdered: 'qtyOrdered',
    qtyReceived: 'qtyReceived',
    qtyBilled: 'qtyBilled',
    price: 'price',
    itemTotal: 'itemTotal',
    status: 'status',
    reference: 'reference',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BcSalesOrderScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    branchCode: 'branchCode',
    snapshot: 'snapshot',
    snapshotDate: 'snapshotDate',
    bcCustomerNo: 'bcCustomerNo',
    customerId: 'customerId',
    extDocNo: 'extDocNo',
    extDocCore: 'extDocCore',
    location: 'location',
    docDate: 'docDate',
    amount: 'amount',
    amountInclVat: 'amountInclVat',
    prepaid: 'prepaid',
    remaining: 'remaining',
    paid: 'paid',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BcTrackingEntryScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    snapshot: 'snapshot',
    entryNo: 'entryNo',
    itemNo: 'itemNo',
    locationCode: 'locationCode',
    serialNo: 'serialNo',
    serialNorm: 'serialNorm',
    lotNo: 'lotNo',
    remainingQuantity: 'remainingQuantity',
    postingDate: 'postingDate',
    documentNo: 'documentNo',
    entryType: 'entryType',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.EntityLinkScalarFieldEnum = {
    id: 'id',
    linkType: 'linkType',
    fromTable: 'fromTable',
    fromKey: 'fromKey',
    toTable: 'toTable',
    toKey: 'toKey',
    method: 'method',
    confidence: 'confidence',
    status: 'status',
    note: 'note',
    confirmedBy: 'confirmedBy',
    confirmedAt: 'confirmedAt',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BcShipmentScalarFieldEnum = {
    id: 'id',
    no: 'no',
    customerNo: 'customerNo',
    customerId: 'customerId',
    documentDate: 'documentDate',
    postingDate: 'postingDate',
    externalDocNo: 'externalDocNo',
    locationCode: 'locationCode',
    tradeId: 'tradeId',
    zohoInvoiceId: 'zohoInvoiceId',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BcShipmentLineScalarFieldEnum = {
    id: 'id',
    sourceKey: 'sourceKey',
    documentNo: 'documentNo',
    lineNo: 'lineNo',
    customerNo: 'customerNo',
    itemNo: 'itemNo',
    description: 'description',
    locationCode: 'locationCode',
    quantity: 'quantity',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BcReceiptScalarFieldEnum = {
    id: 'id',
    no: 'no',
    vendorNo: 'vendorNo',
    sellerId: 'sellerId',
    documentDate: 'documentDate',
    locationCode: 'locationCode',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BcLedgerEntryScalarFieldEnum = {
    id: 'id',
    entryNo: 'entryNo',
    postingDate: 'postingDate',
    entryType: 'entryType',
    documentType: 'documentType',
    documentNo: 'documentNo',
    itemNo: 'itemNo',
    locationCode: 'locationCode',
    quantity: 'quantity',
    remainingQuantity: 'remainingQuantity',
    salesAmount: 'salesAmount',
    costAmount: 'costAmount',
    open: 'open',
    serialNo: 'serialNo',
    serialKey: 'serialKey',
    sourceType: 'sourceType',
    sourceNo: 'sourceNo',
    missingFromImport: 'missingFromImport',
    importBatchId: 'importBatchId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ItemScalarFieldEnum = {
    id: 'id',
    serial: 'serial',
    serialKey: 'serialKey',
    bcItemNo: 'bcItemNo',
    productId: 'productId',
    status: 'status',
    locationCode: 'locationCode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ItemEventScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    kind: 'kind',
    date: 'date',
    source: 'source',
    sourceRef: 'sourceRef',
    sourceKey: 'sourceKey',
    locationCode: 'locationCode',
    partyNo: 'partyNo',
    customerId: 'customerId',
    tradeId: 'tradeId',
    quantity: 'quantity',
    amount: 'amount',
    createdAt: 'createdAt'
};
exports.LiveStockBranchScalarFieldEnum = {
    code: 'code',
    name: 'name',
    branchId: 'branchId',
    cutoverDate: 'cutoverDate',
    createdAt: 'createdAt'
};
exports.LiveStockLineScalarFieldEnum = {
    id: 'id',
    branchCode: 'branchCode',
    metal: 'metal',
    kind: 'kind',
    family: 'family',
    variant: 'variant',
    refinery: 'refinery',
    qty: 'qty',
    lowThreshold: 'lowThreshold',
    unassigned: 'unassigned',
    details: 'details',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LiveStockBarScalarFieldEnum = {
    id: 'id',
    lineId: 'lineId',
    serial: 'serial',
    serialKey: 'serialKey',
    grams: 'grams',
    details: 'details',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LiveStockMovementScalarFieldEnum = {
    id: 'id',
    lineId: 'lineId',
    delta: 'delta',
    qtyAfter: 'qtyAfter',
    source: 'source',
    reference: 'reference',
    reason: 'reason',
    note: 'note',
    actor: 'actor',
    at: 'at',
    reversesId: 'reversesId'
};
exports.SheetApplicationScalarFieldEnum = {
    id: 'id',
    referenceKey: 'referenceKey',
    occurrence: 'occurrence',
    kind: 'kind',
    branchCode: 'branchCode',
    lineId: 'lineId',
    rowDate: 'rowDate',
    rowQty: 'rowQty',
    appliedQty: 'appliedQty',
    status: 'status',
    note: 'note',
    reason: 'reason',
    decidedBy: 'decidedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RolePermissionScalarFieldEnum = {
    role: 'role',
    key: 'key',
    updatedAt: 'updatedAt'
};
exports.UserPermissionOverrideScalarFieldEnum = {
    userId: 'userId',
    key: 'key',
    granted: 'granted',
    expiresAt: 'expiresAt',
    reason: 'reason',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.ProductPriceSnapshotScalarFieldEnum = {
    id: 'id',
    day: 'day',
    productId: 'productId',
    metalType: 'metalType',
    spotEur: 'spotEur',
    spreadSell: 'spreadSell',
    spreadBuy: 'spreadBuy',
    sellPriceEur: 'sellPriceEur',
    buyPriceEur: 'buyPriceEur',
    createdAt: 'createdAt'
};
exports.AiFeedbackScalarFieldEnum = {
    id: 'id',
    questionId: 'questionId',
    userId: 'userId',
    helpful: 'helpful',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserPreferenceScalarFieldEnum = {
    userId: 'userId',
    data: 'data',
    updatedAt: 'updatedAt'
};
exports.CompanySettingScalarFieldEnum = {
    key: 'key',
    value: 'value',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    kind: 'kind',
    title: 'title',
    body: 'body',
    link: 'link',
    createdAt: 'createdAt',
    readAt: 'readAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map