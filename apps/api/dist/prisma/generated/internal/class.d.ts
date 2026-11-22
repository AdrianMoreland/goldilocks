import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    $connect(): runtime.Types.Utils.JsPromise<void>;
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get product(): Prisma.ProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get metalSpotPrice(): Prisma.MetalSpotPriceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get historicSpotPrice(): Prisma.HistoricSpotPriceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get branch(): Prisma.BranchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get fetchAttempt(): Prisma.FetchAttemptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get kbDocument(): Prisma.KbDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get aiQuestionLog(): Prisma.AiQuestionLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get aiAnswerCache(): Prisma.AiAnswerCacheDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get marketModeState(): Prisma.MarketModeStateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get roadmapDocument(): Prisma.RoadmapDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get roadmapSyncState(): Prisma.RoadmapSyncStateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get roadmapSnapshot(): Prisma.RoadmapSnapshotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get roadmapInbox(): Prisma.RoadmapInboxDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get auditLog(): Prisma.AuditLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcItem(): Prisma.BcItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stocktake(): Prisma.StocktakeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stocktakeLine(): Prisma.StocktakeLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stocktakeDiscrepancy(): Prisma.StocktakeDiscrepancyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stocktakeBar(): Prisma.StocktakeBarDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stocktakeCoin(): Prisma.StocktakeCoinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customerOrderItem(): Prisma.CustomerOrderItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customerOrderEvidence(): Prisma.CustomerOrderEvidenceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get importBatch(): Prisma.ImportBatchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trade(): Prisma.TradeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get purchaseLot(): Prisma.PurchaseLotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockUnit(): Prisma.StockUnitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get productAlias(): Prisma.ProductAliasDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get productRule(): Prisma.ProductRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get zohoProduct(): Prisma.ZohoProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get orderEvent(): Prisma.OrderEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get sheetTask(): Prisma.SheetTaskDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get handover(): Prisma.HandoverDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customer(): Prisma.CustomerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get vendor(): Prisma.VendorDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get supplierInvoice(): Prisma.SupplierInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get salesProduct(): Prisma.SalesProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get refineryAlias(): Prisma.RefineryAliasDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get quote(): Prisma.QuoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get zohoInvoice(): Prisma.ZohoInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get zohoInvoiceLine(): Prisma.ZohoInvoiceLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get lineSerial(): Prisma.LineSerialDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get zohoPayment(): Prisma.ZohoPaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get zohoPurchaseOrderLine(): Prisma.ZohoPurchaseOrderLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcSalesOrder(): Prisma.BcSalesOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcTrackingEntry(): Prisma.BcTrackingEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get entityLink(): Prisma.EntityLinkDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcShipment(): Prisma.BcShipmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcShipmentLine(): Prisma.BcShipmentLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcReceipt(): Prisma.BcReceiptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get bcLedgerEntry(): Prisma.BcLedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get item(): Prisma.ItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get itemEvent(): Prisma.ItemEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get liveStockBranch(): Prisma.LiveStockBranchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get liveStockLine(): Prisma.LiveStockLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get liveStockBar(): Prisma.LiveStockBarDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get liveStockMovement(): Prisma.LiveStockMovementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get sheetApplication(): Prisma.SheetApplicationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get userPermissionOverride(): Prisma.UserPermissionOverrideDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get productPriceSnapshot(): Prisma.ProductPriceSnapshotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get aiFeedback(): Prisma.AiFeedbackDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get userPreference(): Prisma.UserPreferenceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get companySetting(): Prisma.CompanySettingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get notification(): Prisma.NotificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map