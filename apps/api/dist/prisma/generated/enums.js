"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetApplicationStatus = exports.SheetApplicationKind = exports.LiveMovementSource = exports.LiveBarStatus = exports.LiveStockKind = exports.ItemEventSource = exports.ItemEventKind = exports.ItemStatus = exports.LinkStatus = exports.LinkConfidence = exports.QuoteStatus = exports.CollectedFlag = exports.OrderSystem = exports.TaskClosedVia = exports.TaskCheck = exports.SheetTaskStatus = exports.OrderStep = exports.ProductRuleKind = exports.MatchConfidence = exports.AliasDecider = exports.CollectedSource = exports.CptyKind = exports.TradeState = exports.EvidenceKind = exports.CustomerOrderStatus = exports.BarStatus = exports.StockMetal = exports.DiscrepancyIssueType = exports.SerialsChecked = exports.StocktakeStatus = exports.KbStatus = exports.BranchRegion = exports.KbVisibility = exports.KbJurisdiction = exports.KbCategory = exports.Currency = exports.ProductCategory = exports.MetalType = exports.UserRole = exports.FetchTrigger = void 0;
exports.FetchTrigger = {
    CRON: 'CRON',
    REFRESH: 'REFRESH',
    RETRY: 'RETRY',
    LAUNCH_FALLBACK: 'LAUNCH_FALLBACK'
};
exports.UserRole = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    SALES: 'SALES',
    ACCOUNTING: 'ACCOUNTING',
    AUDITOR: 'AUDITOR'
};
exports.MetalType = {
    GOLD: 'GOLD',
    SILVER: 'SILVER',
    PLATINUM: 'PLATINUM',
    PALLADIUM: 'PALLADIUM'
};
exports.ProductCategory = {
    BAR: 'BAR',
    COIN: 'COIN'
};
exports.Currency = {
    EUR: 'EUR',
    USD: 'USD',
    GBP: 'GBP'
};
exports.KbCategory = {
    sales: 'sales',
    trading: 'trading',
    operations: 'operations',
    compliance: 'compliance',
    storage: 'storage',
    systems: 'systems',
    directory: 'directory',
    meta: 'meta'
};
exports.KbJurisdiction = {
    all: 'all',
    IE: 'IE',
    UK: 'UK',
    ES: 'ES'
};
exports.KbVisibility = {
    all: 'all',
    ie_only: 'ie_only'
};
exports.BranchRegion = {
    IE: 'IE',
    UK: 'UK',
    ES: 'ES'
};
exports.KbStatus = {
    draft: 'draft',
    approved: 'approved',
    retired: 'retired'
};
exports.StocktakeStatus = {
    DRAFT: 'DRAFT',
    COUNTING: 'COUNTING',
    RECONCILING: 'RECONCILING',
    FINALISED: 'FINALISED'
};
exports.SerialsChecked = {
    YES: 'YES',
    NO: 'NO',
    NA: 'NA'
};
exports.DiscrepancyIssueType = {
    QUANTITY: 'QUANTITY',
    LOCATION: 'LOCATION',
    SERIAL: 'SERIAL',
    PAID_NOT_COLLECTED: 'PAID_NOT_COLLECTED',
    OTHER: 'OTHER'
};
exports.StockMetal = {
    GOLD: 'GOLD',
    SILVER: 'SILVER',
    PGM: 'PGM'
};
exports.BarStatus = {
    UNCONFIRMED: 'UNCONFIRMED',
    CONFIRMED: 'CONFIRMED',
    NEW: 'NEW',
    GONE: 'GONE'
};
exports.CustomerOrderStatus = {
    TO_ORDER: 'TO_ORDER',
    ORDERED: 'ORDERED',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    BAGGED: 'BAGGED',
    ALLOCATED: 'ALLOCATED',
    COLLECTED: 'COLLECTED'
};
exports.EvidenceKind = {
    TRADESHEET_COLLECTED: 'TRADESHEET_COLLECTED',
    ZOHO_INVOICE: 'ZOHO_INVOICE',
    SIGNED_INVOICE: 'SIGNED_INVOICE',
    BC_RECORD: 'BC_RECORD',
    STAFF_NOTE: 'STAFF_NOTE'
};
exports.TradeState = {
    QUOTE: 'QUOTE',
    AWAITING_HEDGE: 'AWAITING_HEDGE',
    HEDGED: 'HEDGED',
    INVOICED: 'INVOICED',
    DEFERRED: 'DEFERRED',
    UNKNOWN: 'UNKNOWN'
};
exports.CptyKind = {
    EMPTY: 'EMPTY',
    QUOTE_ONLY: 'QUOTE_ONLY',
    HEDGED: 'HEDGED',
    DEFERRED: 'DEFERRED',
    LOT_REF: 'LOT_REF',
    SUPPLIER_INVOICE: 'SUPPLIER_INVOICE',
    OTHER: 'OTHER'
};
exports.CollectedSource = {
    VALUE: 'VALUE',
    FILL: 'FILL'
};
exports.AliasDecider = {
    RULE: 'RULE',
    PERSON: 'PERSON'
};
exports.MatchConfidence = {
    CERTAIN: 'CERTAIN',
    LIKELY: 'LIKELY',
    UNCLEAR: 'UNCLEAR'
};
exports.ProductRuleKind = {
    WORD: 'WORD',
    DESIGN: 'DESIGN',
    DEFAULT: 'DEFAULT',
    NOT_A_PRODUCT: 'NOT_A_PRODUCT',
    SHEET_METAL: 'SHEET_METAL'
};
exports.OrderStep = {
    ORDERED: 'ORDERED',
    ARRIVED: 'ARRIVED',
    ALLOCATED: 'ALLOCATED',
    MATCHED: 'MATCHED',
    COLLECTED: 'COLLECTED',
    POSTED: 'POSTED'
};
exports.SheetTaskStatus = {
    OPEN: 'OPEN',
    DONE: 'DONE'
};
exports.TaskCheck = {
    TRADE_COLLECTED: 'TRADE_COLLECTED',
    TRADE_CPTY: 'TRADE_CPTY',
    MANUAL: 'MANUAL'
};
exports.TaskClosedVia = {
    MANUAL: 'MANUAL',
    IMPORT: 'IMPORT'
};
exports.OrderSystem = {
    ZOHO: 'ZOHO',
    BC: 'BC'
};
exports.CollectedFlag = {
    YES: 'YES',
    NO: 'NO',
    CHECK: 'CHECK'
};
exports.QuoteStatus = {
    OPEN: 'OPEN',
    INVOICED: 'INVOICED',
    EXPIRED: 'EXPIRED'
};
exports.LinkConfidence = {
    EXACT: 'EXACT',
    PROBABLE: 'PROBABLE'
};
exports.LinkStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    REJECTED: 'REJECTED'
};
exports.ItemStatus = {
    IN_STOCK: 'IN_STOCK',
    COLLECTED: 'COLLECTED',
    GONE: 'GONE',
    UNKNOWN: 'UNKNOWN'
};
exports.ItemEventKind = {
    RECEIVED: 'RECEIVED',
    OPENING_BALANCE: 'OPENING_BALANCE',
    ADJUSTED_IN: 'ADJUSTED_IN',
    ADJUSTED_OUT: 'ADJUSTED_OUT',
    TRANSFERRED: 'TRANSFERRED',
    COLLECTED: 'COLLECTED',
    RETURNED_BY_CUSTOMER: 'RETURNED_BY_CUSTOMER',
    RETURNED_TO_VENDOR: 'RETURNED_TO_VENDOR'
};
exports.ItemEventSource = {
    BC: 'BC',
    ZOHO: 'ZOHO',
    TRADESHEET: 'TRADESHEET',
    STOCKTAKE: 'STOCKTAKE',
    STAFF: 'STAFF'
};
exports.LiveStockKind = {
    COIN: 'COIN',
    BAR: 'BAR'
};
exports.LiveBarStatus = {
    IN_STOCK: 'IN_STOCK',
    SOLD: 'SOLD',
    REMOVED: 'REMOVED'
};
exports.LiveMovementSource = {
    MANUAL: 'MANUAL',
    IMPORT: 'IMPORT',
    SHEET_SALE: 'SHEET_SALE',
    SHEET_PURCHASE: 'SHEET_PURCHASE',
    TRANSFER: 'TRANSFER',
    UNDO: 'UNDO'
};
exports.SheetApplicationKind = {
    SALE: 'SALE',
    PURCHASE: 'PURCHASE'
};
exports.SheetApplicationStatus = {
    APPLIED: 'APPLIED',
    NEEDS_DECISION: 'NEEDS_DECISION',
    DISMISSED: 'DISMISSED'
};
//# sourceMappingURL=enums.js.map