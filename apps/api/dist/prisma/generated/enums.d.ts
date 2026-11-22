export declare const FetchTrigger: {
    readonly CRON: "CRON";
    readonly REFRESH: "REFRESH";
    readonly RETRY: "RETRY";
    readonly LAUNCH_FALLBACK: "LAUNCH_FALLBACK";
};
export type FetchTrigger = (typeof FetchTrigger)[keyof typeof FetchTrigger];
export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly MANAGER: "MANAGER";
    readonly SALES: "SALES";
    readonly ACCOUNTING: "ACCOUNTING";
    readonly AUDITOR: "AUDITOR";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const MetalType: {
    readonly GOLD: "GOLD";
    readonly SILVER: "SILVER";
    readonly PLATINUM: "PLATINUM";
    readonly PALLADIUM: "PALLADIUM";
};
export type MetalType = (typeof MetalType)[keyof typeof MetalType];
export declare const ProductCategory: {
    readonly BAR: "BAR";
    readonly COIN: "COIN";
};
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];
export declare const Currency: {
    readonly EUR: "EUR";
    readonly USD: "USD";
    readonly GBP: "GBP";
};
export type Currency = (typeof Currency)[keyof typeof Currency];
export declare const KbCategory: {
    readonly sales: "sales";
    readonly trading: "trading";
    readonly operations: "operations";
    readonly compliance: "compliance";
    readonly storage: "storage";
    readonly systems: "systems";
    readonly directory: "directory";
    readonly meta: "meta";
};
export type KbCategory = (typeof KbCategory)[keyof typeof KbCategory];
export declare const KbJurisdiction: {
    readonly all: "all";
    readonly IE: "IE";
    readonly UK: "UK";
    readonly ES: "ES";
};
export type KbJurisdiction = (typeof KbJurisdiction)[keyof typeof KbJurisdiction];
export declare const KbVisibility: {
    readonly all: "all";
    readonly ie_only: "ie_only";
};
export type KbVisibility = (typeof KbVisibility)[keyof typeof KbVisibility];
export declare const BranchRegion: {
    readonly IE: "IE";
    readonly UK: "UK";
    readonly ES: "ES";
};
export type BranchRegion = (typeof BranchRegion)[keyof typeof BranchRegion];
export declare const KbStatus: {
    readonly draft: "draft";
    readonly approved: "approved";
    readonly retired: "retired";
};
export type KbStatus = (typeof KbStatus)[keyof typeof KbStatus];
export declare const StocktakeStatus: {
    readonly DRAFT: "DRAFT";
    readonly COUNTING: "COUNTING";
    readonly RECONCILING: "RECONCILING";
    readonly FINALISED: "FINALISED";
};
export type StocktakeStatus = (typeof StocktakeStatus)[keyof typeof StocktakeStatus];
export declare const SerialsChecked: {
    readonly YES: "YES";
    readonly NO: "NO";
    readonly NA: "NA";
};
export type SerialsChecked = (typeof SerialsChecked)[keyof typeof SerialsChecked];
export declare const DiscrepancyIssueType: {
    readonly QUANTITY: "QUANTITY";
    readonly LOCATION: "LOCATION";
    readonly SERIAL: "SERIAL";
    readonly PAID_NOT_COLLECTED: "PAID_NOT_COLLECTED";
    readonly OTHER: "OTHER";
};
export type DiscrepancyIssueType = (typeof DiscrepancyIssueType)[keyof typeof DiscrepancyIssueType];
export declare const StockMetal: {
    readonly GOLD: "GOLD";
    readonly SILVER: "SILVER";
    readonly PGM: "PGM";
};
export type StockMetal = (typeof StockMetal)[keyof typeof StockMetal];
export declare const BarStatus: {
    readonly UNCONFIRMED: "UNCONFIRMED";
    readonly CONFIRMED: "CONFIRMED";
    readonly NEW: "NEW";
    readonly GONE: "GONE";
};
export type BarStatus = (typeof BarStatus)[keyof typeof BarStatus];
export declare const CustomerOrderStatus: {
    readonly TO_ORDER: "TO_ORDER";
    readonly ORDERED: "ORDERED";
    readonly IN_TRANSIT: "IN_TRANSIT";
    readonly DELIVERED: "DELIVERED";
    readonly BAGGED: "BAGGED";
    readonly ALLOCATED: "ALLOCATED";
    readonly COLLECTED: "COLLECTED";
};
export type CustomerOrderStatus = (typeof CustomerOrderStatus)[keyof typeof CustomerOrderStatus];
export declare const EvidenceKind: {
    readonly TRADESHEET_COLLECTED: "TRADESHEET_COLLECTED";
    readonly ZOHO_INVOICE: "ZOHO_INVOICE";
    readonly SIGNED_INVOICE: "SIGNED_INVOICE";
    readonly BC_RECORD: "BC_RECORD";
    readonly STAFF_NOTE: "STAFF_NOTE";
};
export type EvidenceKind = (typeof EvidenceKind)[keyof typeof EvidenceKind];
export declare const TradeState: {
    readonly QUOTE: "QUOTE";
    readonly AWAITING_HEDGE: "AWAITING_HEDGE";
    readonly HEDGED: "HEDGED";
    readonly INVOICED: "INVOICED";
    readonly DEFERRED: "DEFERRED";
    readonly UNKNOWN: "UNKNOWN";
};
export type TradeState = (typeof TradeState)[keyof typeof TradeState];
export declare const CptyKind: {
    readonly EMPTY: "EMPTY";
    readonly QUOTE_ONLY: "QUOTE_ONLY";
    readonly HEDGED: "HEDGED";
    readonly DEFERRED: "DEFERRED";
    readonly LOT_REF: "LOT_REF";
    readonly SUPPLIER_INVOICE: "SUPPLIER_INVOICE";
    readonly OTHER: "OTHER";
};
export type CptyKind = (typeof CptyKind)[keyof typeof CptyKind];
export declare const CollectedSource: {
    readonly VALUE: "VALUE";
    readonly FILL: "FILL";
};
export type CollectedSource = (typeof CollectedSource)[keyof typeof CollectedSource];
export declare const AliasDecider: {
    readonly RULE: "RULE";
    readonly PERSON: "PERSON";
};
export type AliasDecider = (typeof AliasDecider)[keyof typeof AliasDecider];
export declare const MatchConfidence: {
    readonly CERTAIN: "CERTAIN";
    readonly LIKELY: "LIKELY";
    readonly UNCLEAR: "UNCLEAR";
};
export type MatchConfidence = (typeof MatchConfidence)[keyof typeof MatchConfidence];
export declare const ProductRuleKind: {
    readonly WORD: "WORD";
    readonly DESIGN: "DESIGN";
    readonly DEFAULT: "DEFAULT";
    readonly NOT_A_PRODUCT: "NOT_A_PRODUCT";
    readonly SHEET_METAL: "SHEET_METAL";
};
export type ProductRuleKind = (typeof ProductRuleKind)[keyof typeof ProductRuleKind];
export declare const OrderStep: {
    readonly ORDERED: "ORDERED";
    readonly ARRIVED: "ARRIVED";
    readonly ALLOCATED: "ALLOCATED";
    readonly MATCHED: "MATCHED";
    readonly COLLECTED: "COLLECTED";
    readonly POSTED: "POSTED";
};
export type OrderStep = (typeof OrderStep)[keyof typeof OrderStep];
export declare const SheetTaskStatus: {
    readonly OPEN: "OPEN";
    readonly DONE: "DONE";
};
export type SheetTaskStatus = (typeof SheetTaskStatus)[keyof typeof SheetTaskStatus];
export declare const TaskCheck: {
    readonly TRADE_COLLECTED: "TRADE_COLLECTED";
    readonly TRADE_CPTY: "TRADE_CPTY";
    readonly MANUAL: "MANUAL";
};
export type TaskCheck = (typeof TaskCheck)[keyof typeof TaskCheck];
export declare const TaskClosedVia: {
    readonly MANUAL: "MANUAL";
    readonly IMPORT: "IMPORT";
};
export type TaskClosedVia = (typeof TaskClosedVia)[keyof typeof TaskClosedVia];
export declare const OrderSystem: {
    readonly ZOHO: "ZOHO";
    readonly BC: "BC";
};
export type OrderSystem = (typeof OrderSystem)[keyof typeof OrderSystem];
export declare const CollectedFlag: {
    readonly YES: "YES";
    readonly NO: "NO";
    readonly CHECK: "CHECK";
};
export type CollectedFlag = (typeof CollectedFlag)[keyof typeof CollectedFlag];
export declare const QuoteStatus: {
    readonly OPEN: "OPEN";
    readonly INVOICED: "INVOICED";
    readonly EXPIRED: "EXPIRED";
};
export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];
export declare const LinkConfidence: {
    readonly EXACT: "EXACT";
    readonly PROBABLE: "PROBABLE";
};
export type LinkConfidence = (typeof LinkConfidence)[keyof typeof LinkConfidence];
export declare const LinkStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly REJECTED: "REJECTED";
};
export type LinkStatus = (typeof LinkStatus)[keyof typeof LinkStatus];
export declare const ItemStatus: {
    readonly IN_STOCK: "IN_STOCK";
    readonly COLLECTED: "COLLECTED";
    readonly GONE: "GONE";
    readonly UNKNOWN: "UNKNOWN";
};
export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];
export declare const ItemEventKind: {
    readonly RECEIVED: "RECEIVED";
    readonly OPENING_BALANCE: "OPENING_BALANCE";
    readonly ADJUSTED_IN: "ADJUSTED_IN";
    readonly ADJUSTED_OUT: "ADJUSTED_OUT";
    readonly TRANSFERRED: "TRANSFERRED";
    readonly COLLECTED: "COLLECTED";
    readonly RETURNED_BY_CUSTOMER: "RETURNED_BY_CUSTOMER";
    readonly RETURNED_TO_VENDOR: "RETURNED_TO_VENDOR";
};
export type ItemEventKind = (typeof ItemEventKind)[keyof typeof ItemEventKind];
export declare const ItemEventSource: {
    readonly BC: "BC";
    readonly ZOHO: "ZOHO";
    readonly TRADESHEET: "TRADESHEET";
    readonly STOCKTAKE: "STOCKTAKE";
    readonly STAFF: "STAFF";
};
export type ItemEventSource = (typeof ItemEventSource)[keyof typeof ItemEventSource];
export declare const LiveStockKind: {
    readonly COIN: "COIN";
    readonly BAR: "BAR";
};
export type LiveStockKind = (typeof LiveStockKind)[keyof typeof LiveStockKind];
export declare const LiveBarStatus: {
    readonly IN_STOCK: "IN_STOCK";
    readonly SOLD: "SOLD";
    readonly REMOVED: "REMOVED";
};
export type LiveBarStatus = (typeof LiveBarStatus)[keyof typeof LiveBarStatus];
export declare const LiveMovementSource: {
    readonly MANUAL: "MANUAL";
    readonly IMPORT: "IMPORT";
    readonly SHEET_SALE: "SHEET_SALE";
    readonly SHEET_PURCHASE: "SHEET_PURCHASE";
    readonly TRANSFER: "TRANSFER";
    readonly UNDO: "UNDO";
};
export type LiveMovementSource = (typeof LiveMovementSource)[keyof typeof LiveMovementSource];
export declare const SheetApplicationKind: {
    readonly SALE: "SALE";
    readonly PURCHASE: "PURCHASE";
};
export type SheetApplicationKind = (typeof SheetApplicationKind)[keyof typeof SheetApplicationKind];
export declare const SheetApplicationStatus: {
    readonly APPLIED: "APPLIED";
    readonly NEEDS_DECISION: "NEEDS_DECISION";
    readonly DISMISSED: "DISMISSED";
};
export type SheetApplicationStatus = (typeof SheetApplicationStatus)[keyof typeof SheetApplicationStatus];
//# sourceMappingURL=enums.d.ts.map