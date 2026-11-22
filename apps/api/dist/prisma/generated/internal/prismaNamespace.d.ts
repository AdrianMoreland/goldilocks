import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly Product: "Product";
    readonly MetalSpotPrice: "MetalSpotPrice";
    readonly HistoricSpotPrice: "HistoricSpotPrice";
    readonly Branch: "Branch";
    readonly FetchAttempt: "FetchAttempt";
    readonly KbDocument: "KbDocument";
    readonly AiQuestionLog: "AiQuestionLog";
    readonly AiAnswerCache: "AiAnswerCache";
    readonly MarketModeState: "MarketModeState";
    readonly RoadmapDocument: "RoadmapDocument";
    readonly RoadmapSyncState: "RoadmapSyncState";
    readonly RoadmapSnapshot: "RoadmapSnapshot";
    readonly RoadmapInbox: "RoadmapInbox";
    readonly AuditLog: "AuditLog";
    readonly BcItem: "BcItem";
    readonly Stocktake: "Stocktake";
    readonly StocktakeLine: "StocktakeLine";
    readonly StocktakeDiscrepancy: "StocktakeDiscrepancy";
    readonly StocktakeBar: "StocktakeBar";
    readonly StocktakeCoin: "StocktakeCoin";
    readonly CustomerOrderItem: "CustomerOrderItem";
    readonly CustomerOrderEvidence: "CustomerOrderEvidence";
    readonly ImportBatch: "ImportBatch";
    readonly Trade: "Trade";
    readonly PurchaseLot: "PurchaseLot";
    readonly StockUnit: "StockUnit";
    readonly ProductAlias: "ProductAlias";
    readonly ProductRule: "ProductRule";
    readonly ZohoProduct: "ZohoProduct";
    readonly OrderEvent: "OrderEvent";
    readonly SheetTask: "SheetTask";
    readonly Handover: "Handover";
    readonly Customer: "Customer";
    readonly Vendor: "Vendor";
    readonly SupplierInvoice: "SupplierInvoice";
    readonly SalesProduct: "SalesProduct";
    readonly RefineryAlias: "RefineryAlias";
    readonly Quote: "Quote";
    readonly ZohoInvoice: "ZohoInvoice";
    readonly ZohoInvoiceLine: "ZohoInvoiceLine";
    readonly LineSerial: "LineSerial";
    readonly ZohoPayment: "ZohoPayment";
    readonly ZohoPurchaseOrderLine: "ZohoPurchaseOrderLine";
    readonly BcSalesOrder: "BcSalesOrder";
    readonly BcTrackingEntry: "BcTrackingEntry";
    readonly EntityLink: "EntityLink";
    readonly BcShipment: "BcShipment";
    readonly BcShipmentLine: "BcShipmentLine";
    readonly BcReceipt: "BcReceipt";
    readonly BcLedgerEntry: "BcLedgerEntry";
    readonly Item: "Item";
    readonly ItemEvent: "ItemEvent";
    readonly LiveStockBranch: "LiveStockBranch";
    readonly LiveStockLine: "LiveStockLine";
    readonly LiveStockBar: "LiveStockBar";
    readonly LiveStockMovement: "LiveStockMovement";
    readonly SheetApplication: "SheetApplication";
    readonly RolePermission: "RolePermission";
    readonly UserPermissionOverride: "UserPermissionOverride";
    readonly ProductPriceSnapshot: "ProductPriceSnapshot";
    readonly AiFeedback: "AiFeedback";
    readonly UserPreference: "UserPreference";
    readonly CompanySetting: "CompanySetting";
    readonly Notification: "Notification";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "product" | "metalSpotPrice" | "historicSpotPrice" | "branch" | "fetchAttempt" | "kbDocument" | "aiQuestionLog" | "aiAnswerCache" | "marketModeState" | "roadmapDocument" | "roadmapSyncState" | "roadmapSnapshot" | "roadmapInbox" | "auditLog" | "bcItem" | "stocktake" | "stocktakeLine" | "stocktakeDiscrepancy" | "stocktakeBar" | "stocktakeCoin" | "customerOrderItem" | "customerOrderEvidence" | "importBatch" | "trade" | "purchaseLot" | "stockUnit" | "productAlias" | "productRule" | "zohoProduct" | "orderEvent" | "sheetTask" | "handover" | "customer" | "vendor" | "supplierInvoice" | "salesProduct" | "refineryAlias" | "quote" | "zohoInvoice" | "zohoInvoiceLine" | "lineSerial" | "zohoPayment" | "zohoPurchaseOrderLine" | "bcSalesOrder" | "bcTrackingEntry" | "entityLink" | "bcShipment" | "bcShipmentLine" | "bcReceipt" | "bcLedgerEntry" | "item" | "itemEvent" | "liveStockBranch" | "liveStockLine" | "liveStockBar" | "liveStockMovement" | "sheetApplication" | "rolePermission" | "userPermissionOverride" | "productPriceSnapshot" | "aiFeedback" | "userPreference" | "companySetting" | "notification";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Product: {
            payload: Prisma.$ProductPayload<ExtArgs>;
            fields: Prisma.ProductFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProductFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                findFirst: {
                    args: Prisma.ProductFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                findMany: {
                    args: Prisma.ProductFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>[];
                };
                create: {
                    args: Prisma.ProductCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                createMany: {
                    args: Prisma.ProductCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>[];
                };
                delete: {
                    args: Prisma.ProductDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                update: {
                    args: Prisma.ProductUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                deleteMany: {
                    args: Prisma.ProductDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProductUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>[];
                };
                upsert: {
                    args: Prisma.ProductUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                aggregate: {
                    args: Prisma.ProductAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProduct>;
                };
                groupBy: {
                    args: Prisma.ProductGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProductCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductCountAggregateOutputType> | number;
                };
            };
        };
        MetalSpotPrice: {
            payload: Prisma.$MetalSpotPricePayload<ExtArgs>;
            fields: Prisma.MetalSpotPriceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MetalSpotPriceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MetalSpotPriceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>;
                };
                findFirst: {
                    args: Prisma.MetalSpotPriceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MetalSpotPriceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>;
                };
                findMany: {
                    args: Prisma.MetalSpotPriceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>[];
                };
                create: {
                    args: Prisma.MetalSpotPriceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>;
                };
                createMany: {
                    args: Prisma.MetalSpotPriceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MetalSpotPriceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>[];
                };
                delete: {
                    args: Prisma.MetalSpotPriceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>;
                };
                update: {
                    args: Prisma.MetalSpotPriceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>;
                };
                deleteMany: {
                    args: Prisma.MetalSpotPriceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MetalSpotPriceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MetalSpotPriceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>[];
                };
                upsert: {
                    args: Prisma.MetalSpotPriceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MetalSpotPricePayload>;
                };
                aggregate: {
                    args: Prisma.MetalSpotPriceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMetalSpotPrice>;
                };
                groupBy: {
                    args: Prisma.MetalSpotPriceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MetalSpotPriceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MetalSpotPriceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MetalSpotPriceCountAggregateOutputType> | number;
                };
            };
        };
        HistoricSpotPrice: {
            payload: Prisma.$HistoricSpotPricePayload<ExtArgs>;
            fields: Prisma.HistoricSpotPriceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HistoricSpotPriceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HistoricSpotPriceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>;
                };
                findFirst: {
                    args: Prisma.HistoricSpotPriceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HistoricSpotPriceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>;
                };
                findMany: {
                    args: Prisma.HistoricSpotPriceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>[];
                };
                create: {
                    args: Prisma.HistoricSpotPriceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>;
                };
                createMany: {
                    args: Prisma.HistoricSpotPriceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HistoricSpotPriceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>[];
                };
                delete: {
                    args: Prisma.HistoricSpotPriceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>;
                };
                update: {
                    args: Prisma.HistoricSpotPriceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>;
                };
                deleteMany: {
                    args: Prisma.HistoricSpotPriceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HistoricSpotPriceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HistoricSpotPriceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>[];
                };
                upsert: {
                    args: Prisma.HistoricSpotPriceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HistoricSpotPricePayload>;
                };
                aggregate: {
                    args: Prisma.HistoricSpotPriceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHistoricSpotPrice>;
                };
                groupBy: {
                    args: Prisma.HistoricSpotPriceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HistoricSpotPriceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HistoricSpotPriceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HistoricSpotPriceCountAggregateOutputType> | number;
                };
            };
        };
        Branch: {
            payload: Prisma.$BranchPayload<ExtArgs>;
            fields: Prisma.BranchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BranchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BranchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                findFirst: {
                    args: Prisma.BranchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BranchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                findMany: {
                    args: Prisma.BranchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                create: {
                    args: Prisma.BranchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                createMany: {
                    args: Prisma.BranchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BranchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                delete: {
                    args: Prisma.BranchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                update: {
                    args: Prisma.BranchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                deleteMany: {
                    args: Prisma.BranchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BranchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BranchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                upsert: {
                    args: Prisma.BranchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                aggregate: {
                    args: Prisma.BranchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBranch>;
                };
                groupBy: {
                    args: Prisma.BranchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BranchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchCountAggregateOutputType> | number;
                };
            };
        };
        FetchAttempt: {
            payload: Prisma.$FetchAttemptPayload<ExtArgs>;
            fields: Prisma.FetchAttemptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FetchAttemptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FetchAttemptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>;
                };
                findFirst: {
                    args: Prisma.FetchAttemptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FetchAttemptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>;
                };
                findMany: {
                    args: Prisma.FetchAttemptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>[];
                };
                create: {
                    args: Prisma.FetchAttemptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>;
                };
                createMany: {
                    args: Prisma.FetchAttemptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FetchAttemptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>[];
                };
                delete: {
                    args: Prisma.FetchAttemptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>;
                };
                update: {
                    args: Prisma.FetchAttemptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>;
                };
                deleteMany: {
                    args: Prisma.FetchAttemptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FetchAttemptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FetchAttemptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>[];
                };
                upsert: {
                    args: Prisma.FetchAttemptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FetchAttemptPayload>;
                };
                aggregate: {
                    args: Prisma.FetchAttemptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFetchAttempt>;
                };
                groupBy: {
                    args: Prisma.FetchAttemptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FetchAttemptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FetchAttemptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FetchAttemptCountAggregateOutputType> | number;
                };
            };
        };
        KbDocument: {
            payload: Prisma.$KbDocumentPayload<ExtArgs>;
            fields: Prisma.KbDocumentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.KbDocumentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.KbDocumentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>;
                };
                findFirst: {
                    args: Prisma.KbDocumentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.KbDocumentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>;
                };
                findMany: {
                    args: Prisma.KbDocumentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>[];
                };
                create: {
                    args: Prisma.KbDocumentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>;
                };
                createMany: {
                    args: Prisma.KbDocumentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.KbDocumentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>[];
                };
                delete: {
                    args: Prisma.KbDocumentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>;
                };
                update: {
                    args: Prisma.KbDocumentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>;
                };
                deleteMany: {
                    args: Prisma.KbDocumentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.KbDocumentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.KbDocumentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>[];
                };
                upsert: {
                    args: Prisma.KbDocumentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KbDocumentPayload>;
                };
                aggregate: {
                    args: Prisma.KbDocumentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateKbDocument>;
                };
                groupBy: {
                    args: Prisma.KbDocumentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KbDocumentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.KbDocumentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KbDocumentCountAggregateOutputType> | number;
                };
            };
        };
        AiQuestionLog: {
            payload: Prisma.$AiQuestionLogPayload<ExtArgs>;
            fields: Prisma.AiQuestionLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiQuestionLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiQuestionLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>;
                };
                findFirst: {
                    args: Prisma.AiQuestionLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiQuestionLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>;
                };
                findMany: {
                    args: Prisma.AiQuestionLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>[];
                };
                create: {
                    args: Prisma.AiQuestionLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>;
                };
                createMany: {
                    args: Prisma.AiQuestionLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiQuestionLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>[];
                };
                delete: {
                    args: Prisma.AiQuestionLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>;
                };
                update: {
                    args: Prisma.AiQuestionLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AiQuestionLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiQuestionLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiQuestionLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>[];
                };
                upsert: {
                    args: Prisma.AiQuestionLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiQuestionLogPayload>;
                };
                aggregate: {
                    args: Prisma.AiQuestionLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiQuestionLog>;
                };
                groupBy: {
                    args: Prisma.AiQuestionLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiQuestionLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiQuestionLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiQuestionLogCountAggregateOutputType> | number;
                };
            };
        };
        AiAnswerCache: {
            payload: Prisma.$AiAnswerCachePayload<ExtArgs>;
            fields: Prisma.AiAnswerCacheFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiAnswerCacheFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiAnswerCacheFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>;
                };
                findFirst: {
                    args: Prisma.AiAnswerCacheFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiAnswerCacheFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>;
                };
                findMany: {
                    args: Prisma.AiAnswerCacheFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>[];
                };
                create: {
                    args: Prisma.AiAnswerCacheCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>;
                };
                createMany: {
                    args: Prisma.AiAnswerCacheCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiAnswerCacheCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>[];
                };
                delete: {
                    args: Prisma.AiAnswerCacheDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>;
                };
                update: {
                    args: Prisma.AiAnswerCacheUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>;
                };
                deleteMany: {
                    args: Prisma.AiAnswerCacheDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiAnswerCacheUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiAnswerCacheUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>[];
                };
                upsert: {
                    args: Prisma.AiAnswerCacheUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiAnswerCachePayload>;
                };
                aggregate: {
                    args: Prisma.AiAnswerCacheAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiAnswerCache>;
                };
                groupBy: {
                    args: Prisma.AiAnswerCacheGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiAnswerCacheGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiAnswerCacheCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiAnswerCacheCountAggregateOutputType> | number;
                };
            };
        };
        MarketModeState: {
            payload: Prisma.$MarketModeStatePayload<ExtArgs>;
            fields: Prisma.MarketModeStateFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MarketModeStateFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MarketModeStateFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>;
                };
                findFirst: {
                    args: Prisma.MarketModeStateFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MarketModeStateFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>;
                };
                findMany: {
                    args: Prisma.MarketModeStateFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>[];
                };
                create: {
                    args: Prisma.MarketModeStateCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>;
                };
                createMany: {
                    args: Prisma.MarketModeStateCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MarketModeStateCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>[];
                };
                delete: {
                    args: Prisma.MarketModeStateDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>;
                };
                update: {
                    args: Prisma.MarketModeStateUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>;
                };
                deleteMany: {
                    args: Prisma.MarketModeStateDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MarketModeStateUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MarketModeStateUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>[];
                };
                upsert: {
                    args: Prisma.MarketModeStateUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketModeStatePayload>;
                };
                aggregate: {
                    args: Prisma.MarketModeStateAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMarketModeState>;
                };
                groupBy: {
                    args: Prisma.MarketModeStateGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MarketModeStateGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MarketModeStateCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MarketModeStateCountAggregateOutputType> | number;
                };
            };
        };
        RoadmapDocument: {
            payload: Prisma.$RoadmapDocumentPayload<ExtArgs>;
            fields: Prisma.RoadmapDocumentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RoadmapDocumentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RoadmapDocumentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>;
                };
                findFirst: {
                    args: Prisma.RoadmapDocumentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RoadmapDocumentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>;
                };
                findMany: {
                    args: Prisma.RoadmapDocumentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>[];
                };
                create: {
                    args: Prisma.RoadmapDocumentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>;
                };
                createMany: {
                    args: Prisma.RoadmapDocumentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RoadmapDocumentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>[];
                };
                delete: {
                    args: Prisma.RoadmapDocumentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>;
                };
                update: {
                    args: Prisma.RoadmapDocumentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>;
                };
                deleteMany: {
                    args: Prisma.RoadmapDocumentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RoadmapDocumentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RoadmapDocumentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>[];
                };
                upsert: {
                    args: Prisma.RoadmapDocumentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapDocumentPayload>;
                };
                aggregate: {
                    args: Prisma.RoadmapDocumentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRoadmapDocument>;
                };
                groupBy: {
                    args: Prisma.RoadmapDocumentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapDocumentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RoadmapDocumentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapDocumentCountAggregateOutputType> | number;
                };
            };
        };
        RoadmapSyncState: {
            payload: Prisma.$RoadmapSyncStatePayload<ExtArgs>;
            fields: Prisma.RoadmapSyncStateFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RoadmapSyncStateFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RoadmapSyncStateFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>;
                };
                findFirst: {
                    args: Prisma.RoadmapSyncStateFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RoadmapSyncStateFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>;
                };
                findMany: {
                    args: Prisma.RoadmapSyncStateFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>[];
                };
                create: {
                    args: Prisma.RoadmapSyncStateCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>;
                };
                createMany: {
                    args: Prisma.RoadmapSyncStateCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RoadmapSyncStateCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>[];
                };
                delete: {
                    args: Prisma.RoadmapSyncStateDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>;
                };
                update: {
                    args: Prisma.RoadmapSyncStateUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>;
                };
                deleteMany: {
                    args: Prisma.RoadmapSyncStateDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RoadmapSyncStateUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RoadmapSyncStateUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>[];
                };
                upsert: {
                    args: Prisma.RoadmapSyncStateUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSyncStatePayload>;
                };
                aggregate: {
                    args: Prisma.RoadmapSyncStateAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRoadmapSyncState>;
                };
                groupBy: {
                    args: Prisma.RoadmapSyncStateGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapSyncStateGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RoadmapSyncStateCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapSyncStateCountAggregateOutputType> | number;
                };
            };
        };
        RoadmapSnapshot: {
            payload: Prisma.$RoadmapSnapshotPayload<ExtArgs>;
            fields: Prisma.RoadmapSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RoadmapSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RoadmapSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.RoadmapSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RoadmapSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.RoadmapSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>[];
                };
                create: {
                    args: Prisma.RoadmapSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.RoadmapSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RoadmapSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.RoadmapSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>;
                };
                update: {
                    args: Prisma.RoadmapSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.RoadmapSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RoadmapSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RoadmapSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.RoadmapSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.RoadmapSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRoadmapSnapshot>;
                };
                groupBy: {
                    args: Prisma.RoadmapSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RoadmapSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        RoadmapInbox: {
            payload: Prisma.$RoadmapInboxPayload<ExtArgs>;
            fields: Prisma.RoadmapInboxFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RoadmapInboxFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RoadmapInboxFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>;
                };
                findFirst: {
                    args: Prisma.RoadmapInboxFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RoadmapInboxFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>;
                };
                findMany: {
                    args: Prisma.RoadmapInboxFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>[];
                };
                create: {
                    args: Prisma.RoadmapInboxCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>;
                };
                createMany: {
                    args: Prisma.RoadmapInboxCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RoadmapInboxCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>[];
                };
                delete: {
                    args: Prisma.RoadmapInboxDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>;
                };
                update: {
                    args: Prisma.RoadmapInboxUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>;
                };
                deleteMany: {
                    args: Prisma.RoadmapInboxDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RoadmapInboxUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RoadmapInboxUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>[];
                };
                upsert: {
                    args: Prisma.RoadmapInboxUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapInboxPayload>;
                };
                aggregate: {
                    args: Prisma.RoadmapInboxAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRoadmapInbox>;
                };
                groupBy: {
                    args: Prisma.RoadmapInboxGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapInboxGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RoadmapInboxCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RoadmapInboxCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
                };
            };
        };
        BcItem: {
            payload: Prisma.$BcItemPayload<ExtArgs>;
            fields: Prisma.BcItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>;
                };
                findFirst: {
                    args: Prisma.BcItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>;
                };
                findMany: {
                    args: Prisma.BcItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>[];
                };
                create: {
                    args: Prisma.BcItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>;
                };
                createMany: {
                    args: Prisma.BcItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>[];
                };
                delete: {
                    args: Prisma.BcItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>;
                };
                update: {
                    args: Prisma.BcItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>;
                };
                deleteMany: {
                    args: Prisma.BcItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>[];
                };
                upsert: {
                    args: Prisma.BcItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcItemPayload>;
                };
                aggregate: {
                    args: Prisma.BcItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcItem>;
                };
                groupBy: {
                    args: Prisma.BcItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcItemCountAggregateOutputType> | number;
                };
            };
        };
        Stocktake: {
            payload: Prisma.$StocktakePayload<ExtArgs>;
            fields: Prisma.StocktakeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StocktakeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StocktakeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>;
                };
                findFirst: {
                    args: Prisma.StocktakeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StocktakeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>;
                };
                findMany: {
                    args: Prisma.StocktakeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>[];
                };
                create: {
                    args: Prisma.StocktakeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>;
                };
                createMany: {
                    args: Prisma.StocktakeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StocktakeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>[];
                };
                delete: {
                    args: Prisma.StocktakeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>;
                };
                update: {
                    args: Prisma.StocktakeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>;
                };
                deleteMany: {
                    args: Prisma.StocktakeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StocktakeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StocktakeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>[];
                };
                upsert: {
                    args: Prisma.StocktakeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakePayload>;
                };
                aggregate: {
                    args: Prisma.StocktakeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStocktake>;
                };
                groupBy: {
                    args: Prisma.StocktakeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StocktakeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeCountAggregateOutputType> | number;
                };
            };
        };
        StocktakeLine: {
            payload: Prisma.$StocktakeLinePayload<ExtArgs>;
            fields: Prisma.StocktakeLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StocktakeLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StocktakeLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>;
                };
                findFirst: {
                    args: Prisma.StocktakeLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StocktakeLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>;
                };
                findMany: {
                    args: Prisma.StocktakeLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>[];
                };
                create: {
                    args: Prisma.StocktakeLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>;
                };
                createMany: {
                    args: Prisma.StocktakeLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StocktakeLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>[];
                };
                delete: {
                    args: Prisma.StocktakeLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>;
                };
                update: {
                    args: Prisma.StocktakeLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>;
                };
                deleteMany: {
                    args: Prisma.StocktakeLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StocktakeLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StocktakeLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>[];
                };
                upsert: {
                    args: Prisma.StocktakeLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeLinePayload>;
                };
                aggregate: {
                    args: Prisma.StocktakeLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStocktakeLine>;
                };
                groupBy: {
                    args: Prisma.StocktakeLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StocktakeLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeLineCountAggregateOutputType> | number;
                };
            };
        };
        StocktakeDiscrepancy: {
            payload: Prisma.$StocktakeDiscrepancyPayload<ExtArgs>;
            fields: Prisma.StocktakeDiscrepancyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StocktakeDiscrepancyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StocktakeDiscrepancyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>;
                };
                findFirst: {
                    args: Prisma.StocktakeDiscrepancyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StocktakeDiscrepancyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>;
                };
                findMany: {
                    args: Prisma.StocktakeDiscrepancyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>[];
                };
                create: {
                    args: Prisma.StocktakeDiscrepancyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>;
                };
                createMany: {
                    args: Prisma.StocktakeDiscrepancyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StocktakeDiscrepancyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>[];
                };
                delete: {
                    args: Prisma.StocktakeDiscrepancyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>;
                };
                update: {
                    args: Prisma.StocktakeDiscrepancyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>;
                };
                deleteMany: {
                    args: Prisma.StocktakeDiscrepancyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StocktakeDiscrepancyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StocktakeDiscrepancyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>[];
                };
                upsert: {
                    args: Prisma.StocktakeDiscrepancyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeDiscrepancyPayload>;
                };
                aggregate: {
                    args: Prisma.StocktakeDiscrepancyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStocktakeDiscrepancy>;
                };
                groupBy: {
                    args: Prisma.StocktakeDiscrepancyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeDiscrepancyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StocktakeDiscrepancyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeDiscrepancyCountAggregateOutputType> | number;
                };
            };
        };
        StocktakeBar: {
            payload: Prisma.$StocktakeBarPayload<ExtArgs>;
            fields: Prisma.StocktakeBarFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StocktakeBarFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StocktakeBarFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>;
                };
                findFirst: {
                    args: Prisma.StocktakeBarFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StocktakeBarFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>;
                };
                findMany: {
                    args: Prisma.StocktakeBarFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>[];
                };
                create: {
                    args: Prisma.StocktakeBarCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>;
                };
                createMany: {
                    args: Prisma.StocktakeBarCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StocktakeBarCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>[];
                };
                delete: {
                    args: Prisma.StocktakeBarDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>;
                };
                update: {
                    args: Prisma.StocktakeBarUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>;
                };
                deleteMany: {
                    args: Prisma.StocktakeBarDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StocktakeBarUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StocktakeBarUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>[];
                };
                upsert: {
                    args: Prisma.StocktakeBarUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeBarPayload>;
                };
                aggregate: {
                    args: Prisma.StocktakeBarAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStocktakeBar>;
                };
                groupBy: {
                    args: Prisma.StocktakeBarGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeBarGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StocktakeBarCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeBarCountAggregateOutputType> | number;
                };
            };
        };
        StocktakeCoin: {
            payload: Prisma.$StocktakeCoinPayload<ExtArgs>;
            fields: Prisma.StocktakeCoinFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StocktakeCoinFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StocktakeCoinFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>;
                };
                findFirst: {
                    args: Prisma.StocktakeCoinFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StocktakeCoinFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>;
                };
                findMany: {
                    args: Prisma.StocktakeCoinFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>[];
                };
                create: {
                    args: Prisma.StocktakeCoinCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>;
                };
                createMany: {
                    args: Prisma.StocktakeCoinCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StocktakeCoinCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>[];
                };
                delete: {
                    args: Prisma.StocktakeCoinDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>;
                };
                update: {
                    args: Prisma.StocktakeCoinUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>;
                };
                deleteMany: {
                    args: Prisma.StocktakeCoinDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StocktakeCoinUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StocktakeCoinUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>[];
                };
                upsert: {
                    args: Prisma.StocktakeCoinUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StocktakeCoinPayload>;
                };
                aggregate: {
                    args: Prisma.StocktakeCoinAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStocktakeCoin>;
                };
                groupBy: {
                    args: Prisma.StocktakeCoinGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeCoinGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StocktakeCoinCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StocktakeCoinCountAggregateOutputType> | number;
                };
            };
        };
        CustomerOrderItem: {
            payload: Prisma.$CustomerOrderItemPayload<ExtArgs>;
            fields: Prisma.CustomerOrderItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerOrderItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerOrderItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerOrderItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerOrderItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>;
                };
                findMany: {
                    args: Prisma.CustomerOrderItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>[];
                };
                create: {
                    args: Prisma.CustomerOrderItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>;
                };
                createMany: {
                    args: Prisma.CustomerOrderItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerOrderItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>[];
                };
                delete: {
                    args: Prisma.CustomerOrderItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>;
                };
                update: {
                    args: Prisma.CustomerOrderItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerOrderItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerOrderItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerOrderItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerOrderItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderItemPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerOrderItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomerOrderItem>;
                };
                groupBy: {
                    args: Prisma.CustomerOrderItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerOrderItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerOrderItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerOrderItemCountAggregateOutputType> | number;
                };
            };
        };
        CustomerOrderEvidence: {
            payload: Prisma.$CustomerOrderEvidencePayload<ExtArgs>;
            fields: Prisma.CustomerOrderEvidenceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerOrderEvidenceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerOrderEvidenceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>;
                };
                findFirst: {
                    args: Prisma.CustomerOrderEvidenceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerOrderEvidenceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>;
                };
                findMany: {
                    args: Prisma.CustomerOrderEvidenceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>[];
                };
                create: {
                    args: Prisma.CustomerOrderEvidenceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>;
                };
                createMany: {
                    args: Prisma.CustomerOrderEvidenceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerOrderEvidenceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>[];
                };
                delete: {
                    args: Prisma.CustomerOrderEvidenceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>;
                };
                update: {
                    args: Prisma.CustomerOrderEvidenceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerOrderEvidenceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerOrderEvidenceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerOrderEvidenceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>[];
                };
                upsert: {
                    args: Prisma.CustomerOrderEvidenceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerOrderEvidencePayload>;
                };
                aggregate: {
                    args: Prisma.CustomerOrderEvidenceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomerOrderEvidence>;
                };
                groupBy: {
                    args: Prisma.CustomerOrderEvidenceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerOrderEvidenceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerOrderEvidenceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerOrderEvidenceCountAggregateOutputType> | number;
                };
            };
        };
        ImportBatch: {
            payload: Prisma.$ImportBatchPayload<ExtArgs>;
            fields: Prisma.ImportBatchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ImportBatchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ImportBatchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                findFirst: {
                    args: Prisma.ImportBatchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ImportBatchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                findMany: {
                    args: Prisma.ImportBatchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>[];
                };
                create: {
                    args: Prisma.ImportBatchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                createMany: {
                    args: Prisma.ImportBatchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ImportBatchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>[];
                };
                delete: {
                    args: Prisma.ImportBatchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                update: {
                    args: Prisma.ImportBatchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                deleteMany: {
                    args: Prisma.ImportBatchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ImportBatchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ImportBatchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>[];
                };
                upsert: {
                    args: Prisma.ImportBatchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                aggregate: {
                    args: Prisma.ImportBatchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateImportBatch>;
                };
                groupBy: {
                    args: Prisma.ImportBatchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ImportBatchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ImportBatchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ImportBatchCountAggregateOutputType> | number;
                };
            };
        };
        Trade: {
            payload: Prisma.$TradePayload<ExtArgs>;
            fields: Prisma.TradeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TradeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TradeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                findFirst: {
                    args: Prisma.TradeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TradeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                findMany: {
                    args: Prisma.TradeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>[];
                };
                create: {
                    args: Prisma.TradeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                createMany: {
                    args: Prisma.TradeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TradeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>[];
                };
                delete: {
                    args: Prisma.TradeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                update: {
                    args: Prisma.TradeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                deleteMany: {
                    args: Prisma.TradeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TradeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TradeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>[];
                };
                upsert: {
                    args: Prisma.TradeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                aggregate: {
                    args: Prisma.TradeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrade>;
                };
                groupBy: {
                    args: Prisma.TradeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TradeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TradeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TradeCountAggregateOutputType> | number;
                };
            };
        };
        PurchaseLot: {
            payload: Prisma.$PurchaseLotPayload<ExtArgs>;
            fields: Prisma.PurchaseLotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PurchaseLotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PurchaseLotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>;
                };
                findFirst: {
                    args: Prisma.PurchaseLotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PurchaseLotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>;
                };
                findMany: {
                    args: Prisma.PurchaseLotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>[];
                };
                create: {
                    args: Prisma.PurchaseLotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>;
                };
                createMany: {
                    args: Prisma.PurchaseLotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PurchaseLotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>[];
                };
                delete: {
                    args: Prisma.PurchaseLotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>;
                };
                update: {
                    args: Prisma.PurchaseLotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>;
                };
                deleteMany: {
                    args: Prisma.PurchaseLotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PurchaseLotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PurchaseLotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>[];
                };
                upsert: {
                    args: Prisma.PurchaseLotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseLotPayload>;
                };
                aggregate: {
                    args: Prisma.PurchaseLotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePurchaseLot>;
                };
                groupBy: {
                    args: Prisma.PurchaseLotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PurchaseLotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PurchaseLotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PurchaseLotCountAggregateOutputType> | number;
                };
            };
        };
        StockUnit: {
            payload: Prisma.$StockUnitPayload<ExtArgs>;
            fields: Prisma.StockUnitFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockUnitFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockUnitFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>;
                };
                findFirst: {
                    args: Prisma.StockUnitFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockUnitFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>;
                };
                findMany: {
                    args: Prisma.StockUnitFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>[];
                };
                create: {
                    args: Prisma.StockUnitCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>;
                };
                createMany: {
                    args: Prisma.StockUnitCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockUnitCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>[];
                };
                delete: {
                    args: Prisma.StockUnitDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>;
                };
                update: {
                    args: Prisma.StockUnitUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>;
                };
                deleteMany: {
                    args: Prisma.StockUnitDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockUnitUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockUnitUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>[];
                };
                upsert: {
                    args: Prisma.StockUnitUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockUnitPayload>;
                };
                aggregate: {
                    args: Prisma.StockUnitAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockUnit>;
                };
                groupBy: {
                    args: Prisma.StockUnitGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockUnitGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockUnitCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockUnitCountAggregateOutputType> | number;
                };
            };
        };
        ProductAlias: {
            payload: Prisma.$ProductAliasPayload<ExtArgs>;
            fields: Prisma.ProductAliasFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProductAliasFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProductAliasFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>;
                };
                findFirst: {
                    args: Prisma.ProductAliasFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProductAliasFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>;
                };
                findMany: {
                    args: Prisma.ProductAliasFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>[];
                };
                create: {
                    args: Prisma.ProductAliasCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>;
                };
                createMany: {
                    args: Prisma.ProductAliasCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProductAliasCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>[];
                };
                delete: {
                    args: Prisma.ProductAliasDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>;
                };
                update: {
                    args: Prisma.ProductAliasUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>;
                };
                deleteMany: {
                    args: Prisma.ProductAliasDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProductAliasUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProductAliasUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>[];
                };
                upsert: {
                    args: Prisma.ProductAliasUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductAliasPayload>;
                };
                aggregate: {
                    args: Prisma.ProductAliasAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProductAlias>;
                };
                groupBy: {
                    args: Prisma.ProductAliasGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductAliasGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProductAliasCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductAliasCountAggregateOutputType> | number;
                };
            };
        };
        ProductRule: {
            payload: Prisma.$ProductRulePayload<ExtArgs>;
            fields: Prisma.ProductRuleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProductRuleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProductRuleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>;
                };
                findFirst: {
                    args: Prisma.ProductRuleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProductRuleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>;
                };
                findMany: {
                    args: Prisma.ProductRuleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>[];
                };
                create: {
                    args: Prisma.ProductRuleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>;
                };
                createMany: {
                    args: Prisma.ProductRuleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProductRuleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>[];
                };
                delete: {
                    args: Prisma.ProductRuleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>;
                };
                update: {
                    args: Prisma.ProductRuleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>;
                };
                deleteMany: {
                    args: Prisma.ProductRuleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProductRuleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProductRuleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>[];
                };
                upsert: {
                    args: Prisma.ProductRuleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductRulePayload>;
                };
                aggregate: {
                    args: Prisma.ProductRuleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProductRule>;
                };
                groupBy: {
                    args: Prisma.ProductRuleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductRuleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProductRuleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductRuleCountAggregateOutputType> | number;
                };
            };
        };
        ZohoProduct: {
            payload: Prisma.$ZohoProductPayload<ExtArgs>;
            fields: Prisma.ZohoProductFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ZohoProductFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ZohoProductFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>;
                };
                findFirst: {
                    args: Prisma.ZohoProductFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ZohoProductFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>;
                };
                findMany: {
                    args: Prisma.ZohoProductFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>[];
                };
                create: {
                    args: Prisma.ZohoProductCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>;
                };
                createMany: {
                    args: Prisma.ZohoProductCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ZohoProductCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>[];
                };
                delete: {
                    args: Prisma.ZohoProductDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>;
                };
                update: {
                    args: Prisma.ZohoProductUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>;
                };
                deleteMany: {
                    args: Prisma.ZohoProductDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ZohoProductUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ZohoProductUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>[];
                };
                upsert: {
                    args: Prisma.ZohoProductUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoProductPayload>;
                };
                aggregate: {
                    args: Prisma.ZohoProductAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateZohoProduct>;
                };
                groupBy: {
                    args: Prisma.ZohoProductGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoProductGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ZohoProductCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoProductCountAggregateOutputType> | number;
                };
            };
        };
        OrderEvent: {
            payload: Prisma.$OrderEventPayload<ExtArgs>;
            fields: Prisma.OrderEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrderEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrderEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>;
                };
                findFirst: {
                    args: Prisma.OrderEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrderEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>;
                };
                findMany: {
                    args: Prisma.OrderEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>[];
                };
                create: {
                    args: Prisma.OrderEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>;
                };
                createMany: {
                    args: Prisma.OrderEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrderEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>[];
                };
                delete: {
                    args: Prisma.OrderEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>;
                };
                update: {
                    args: Prisma.OrderEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>;
                };
                deleteMany: {
                    args: Prisma.OrderEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrderEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrderEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>[];
                };
                upsert: {
                    args: Prisma.OrderEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderEventPayload>;
                };
                aggregate: {
                    args: Prisma.OrderEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrderEvent>;
                };
                groupBy: {
                    args: Prisma.OrderEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrderEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderEventCountAggregateOutputType> | number;
                };
            };
        };
        SheetTask: {
            payload: Prisma.$SheetTaskPayload<ExtArgs>;
            fields: Prisma.SheetTaskFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SheetTaskFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SheetTaskFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>;
                };
                findFirst: {
                    args: Prisma.SheetTaskFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SheetTaskFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>;
                };
                findMany: {
                    args: Prisma.SheetTaskFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>[];
                };
                create: {
                    args: Prisma.SheetTaskCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>;
                };
                createMany: {
                    args: Prisma.SheetTaskCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SheetTaskCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>[];
                };
                delete: {
                    args: Prisma.SheetTaskDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>;
                };
                update: {
                    args: Prisma.SheetTaskUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>;
                };
                deleteMany: {
                    args: Prisma.SheetTaskDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SheetTaskUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SheetTaskUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>[];
                };
                upsert: {
                    args: Prisma.SheetTaskUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetTaskPayload>;
                };
                aggregate: {
                    args: Prisma.SheetTaskAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSheetTask>;
                };
                groupBy: {
                    args: Prisma.SheetTaskGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SheetTaskGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SheetTaskCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SheetTaskCountAggregateOutputType> | number;
                };
            };
        };
        Handover: {
            payload: Prisma.$HandoverPayload<ExtArgs>;
            fields: Prisma.HandoverFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HandoverFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HandoverFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>;
                };
                findFirst: {
                    args: Prisma.HandoverFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HandoverFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>;
                };
                findMany: {
                    args: Prisma.HandoverFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>[];
                };
                create: {
                    args: Prisma.HandoverCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>;
                };
                createMany: {
                    args: Prisma.HandoverCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HandoverCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>[];
                };
                delete: {
                    args: Prisma.HandoverDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>;
                };
                update: {
                    args: Prisma.HandoverUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>;
                };
                deleteMany: {
                    args: Prisma.HandoverDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HandoverUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HandoverUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>[];
                };
                upsert: {
                    args: Prisma.HandoverUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoverPayload>;
                };
                aggregate: {
                    args: Prisma.HandoverAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHandover>;
                };
                groupBy: {
                    args: Prisma.HandoverGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HandoverGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HandoverCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HandoverCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
        Vendor: {
            payload: Prisma.$VendorPayload<ExtArgs>;
            fields: Prisma.VendorFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VendorFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>;
                };
                findFirst: {
                    args: Prisma.VendorFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>;
                };
                findMany: {
                    args: Prisma.VendorFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>[];
                };
                create: {
                    args: Prisma.VendorCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>;
                };
                createMany: {
                    args: Prisma.VendorCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.VendorCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>[];
                };
                delete: {
                    args: Prisma.VendorDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>;
                };
                update: {
                    args: Prisma.VendorUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>;
                };
                deleteMany: {
                    args: Prisma.VendorDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VendorUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.VendorUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>[];
                };
                upsert: {
                    args: Prisma.VendorUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VendorPayload>;
                };
                aggregate: {
                    args: Prisma.VendorAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVendor>;
                };
                groupBy: {
                    args: Prisma.VendorGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VendorGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VendorCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VendorCountAggregateOutputType> | number;
                };
            };
        };
        SupplierInvoice: {
            payload: Prisma.$SupplierInvoicePayload<ExtArgs>;
            fields: Prisma.SupplierInvoiceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SupplierInvoiceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SupplierInvoiceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>;
                };
                findFirst: {
                    args: Prisma.SupplierInvoiceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SupplierInvoiceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>;
                };
                findMany: {
                    args: Prisma.SupplierInvoiceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>[];
                };
                create: {
                    args: Prisma.SupplierInvoiceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>;
                };
                createMany: {
                    args: Prisma.SupplierInvoiceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SupplierInvoiceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>[];
                };
                delete: {
                    args: Prisma.SupplierInvoiceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>;
                };
                update: {
                    args: Prisma.SupplierInvoiceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>;
                };
                deleteMany: {
                    args: Prisma.SupplierInvoiceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SupplierInvoiceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SupplierInvoiceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>[];
                };
                upsert: {
                    args: Prisma.SupplierInvoiceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierInvoicePayload>;
                };
                aggregate: {
                    args: Prisma.SupplierInvoiceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupplierInvoice>;
                };
                groupBy: {
                    args: Prisma.SupplierInvoiceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierInvoiceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SupplierInvoiceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierInvoiceCountAggregateOutputType> | number;
                };
            };
        };
        SalesProduct: {
            payload: Prisma.$SalesProductPayload<ExtArgs>;
            fields: Prisma.SalesProductFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SalesProductFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SalesProductFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>;
                };
                findFirst: {
                    args: Prisma.SalesProductFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SalesProductFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>;
                };
                findMany: {
                    args: Prisma.SalesProductFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>[];
                };
                create: {
                    args: Prisma.SalesProductCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>;
                };
                createMany: {
                    args: Prisma.SalesProductCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SalesProductCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>[];
                };
                delete: {
                    args: Prisma.SalesProductDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>;
                };
                update: {
                    args: Prisma.SalesProductUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>;
                };
                deleteMany: {
                    args: Prisma.SalesProductDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SalesProductUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SalesProductUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>[];
                };
                upsert: {
                    args: Prisma.SalesProductUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesProductPayload>;
                };
                aggregate: {
                    args: Prisma.SalesProductAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSalesProduct>;
                };
                groupBy: {
                    args: Prisma.SalesProductGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SalesProductGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SalesProductCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SalesProductCountAggregateOutputType> | number;
                };
            };
        };
        RefineryAlias: {
            payload: Prisma.$RefineryAliasPayload<ExtArgs>;
            fields: Prisma.RefineryAliasFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefineryAliasFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefineryAliasFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>;
                };
                findFirst: {
                    args: Prisma.RefineryAliasFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefineryAliasFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>;
                };
                findMany: {
                    args: Prisma.RefineryAliasFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>[];
                };
                create: {
                    args: Prisma.RefineryAliasCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>;
                };
                createMany: {
                    args: Prisma.RefineryAliasCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefineryAliasCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>[];
                };
                delete: {
                    args: Prisma.RefineryAliasDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>;
                };
                update: {
                    args: Prisma.RefineryAliasUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>;
                };
                deleteMany: {
                    args: Prisma.RefineryAliasDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefineryAliasUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefineryAliasUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>[];
                };
                upsert: {
                    args: Prisma.RefineryAliasUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefineryAliasPayload>;
                };
                aggregate: {
                    args: Prisma.RefineryAliasAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefineryAlias>;
                };
                groupBy: {
                    args: Prisma.RefineryAliasGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefineryAliasGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefineryAliasCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefineryAliasCountAggregateOutputType> | number;
                };
            };
        };
        Quote: {
            payload: Prisma.$QuotePayload<ExtArgs>;
            fields: Prisma.QuoteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuoteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuoteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>;
                };
                findFirst: {
                    args: Prisma.QuoteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuoteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>;
                };
                findMany: {
                    args: Prisma.QuoteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>[];
                };
                create: {
                    args: Prisma.QuoteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>;
                };
                createMany: {
                    args: Prisma.QuoteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.QuoteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>[];
                };
                delete: {
                    args: Prisma.QuoteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>;
                };
                update: {
                    args: Prisma.QuoteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>;
                };
                deleteMany: {
                    args: Prisma.QuoteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuoteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.QuoteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>[];
                };
                upsert: {
                    args: Prisma.QuoteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuotePayload>;
                };
                aggregate: {
                    args: Prisma.QuoteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuote>;
                };
                groupBy: {
                    args: Prisma.QuoteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuoteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.QuoteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuoteCountAggregateOutputType> | number;
                };
            };
        };
        ZohoInvoice: {
            payload: Prisma.$ZohoInvoicePayload<ExtArgs>;
            fields: Prisma.ZohoInvoiceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ZohoInvoiceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ZohoInvoiceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>;
                };
                findFirst: {
                    args: Prisma.ZohoInvoiceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ZohoInvoiceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>;
                };
                findMany: {
                    args: Prisma.ZohoInvoiceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>[];
                };
                create: {
                    args: Prisma.ZohoInvoiceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>;
                };
                createMany: {
                    args: Prisma.ZohoInvoiceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ZohoInvoiceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>[];
                };
                delete: {
                    args: Prisma.ZohoInvoiceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>;
                };
                update: {
                    args: Prisma.ZohoInvoiceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>;
                };
                deleteMany: {
                    args: Prisma.ZohoInvoiceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ZohoInvoiceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ZohoInvoiceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>[];
                };
                upsert: {
                    args: Prisma.ZohoInvoiceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoicePayload>;
                };
                aggregate: {
                    args: Prisma.ZohoInvoiceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateZohoInvoice>;
                };
                groupBy: {
                    args: Prisma.ZohoInvoiceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoInvoiceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ZohoInvoiceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoInvoiceCountAggregateOutputType> | number;
                };
            };
        };
        ZohoInvoiceLine: {
            payload: Prisma.$ZohoInvoiceLinePayload<ExtArgs>;
            fields: Prisma.ZohoInvoiceLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ZohoInvoiceLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ZohoInvoiceLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>;
                };
                findFirst: {
                    args: Prisma.ZohoInvoiceLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ZohoInvoiceLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>;
                };
                findMany: {
                    args: Prisma.ZohoInvoiceLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>[];
                };
                create: {
                    args: Prisma.ZohoInvoiceLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>;
                };
                createMany: {
                    args: Prisma.ZohoInvoiceLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ZohoInvoiceLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>[];
                };
                delete: {
                    args: Prisma.ZohoInvoiceLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>;
                };
                update: {
                    args: Prisma.ZohoInvoiceLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>;
                };
                deleteMany: {
                    args: Prisma.ZohoInvoiceLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ZohoInvoiceLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ZohoInvoiceLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>[];
                };
                upsert: {
                    args: Prisma.ZohoInvoiceLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoInvoiceLinePayload>;
                };
                aggregate: {
                    args: Prisma.ZohoInvoiceLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateZohoInvoiceLine>;
                };
                groupBy: {
                    args: Prisma.ZohoInvoiceLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoInvoiceLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ZohoInvoiceLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoInvoiceLineCountAggregateOutputType> | number;
                };
            };
        };
        LineSerial: {
            payload: Prisma.$LineSerialPayload<ExtArgs>;
            fields: Prisma.LineSerialFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LineSerialFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LineSerialFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>;
                };
                findFirst: {
                    args: Prisma.LineSerialFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LineSerialFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>;
                };
                findMany: {
                    args: Prisma.LineSerialFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>[];
                };
                create: {
                    args: Prisma.LineSerialCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>;
                };
                createMany: {
                    args: Prisma.LineSerialCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LineSerialCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>[];
                };
                delete: {
                    args: Prisma.LineSerialDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>;
                };
                update: {
                    args: Prisma.LineSerialUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>;
                };
                deleteMany: {
                    args: Prisma.LineSerialDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LineSerialUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LineSerialUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>[];
                };
                upsert: {
                    args: Prisma.LineSerialUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LineSerialPayload>;
                };
                aggregate: {
                    args: Prisma.LineSerialAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLineSerial>;
                };
                groupBy: {
                    args: Prisma.LineSerialGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LineSerialGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LineSerialCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LineSerialCountAggregateOutputType> | number;
                };
            };
        };
        ZohoPayment: {
            payload: Prisma.$ZohoPaymentPayload<ExtArgs>;
            fields: Prisma.ZohoPaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ZohoPaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ZohoPaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>;
                };
                findFirst: {
                    args: Prisma.ZohoPaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ZohoPaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>;
                };
                findMany: {
                    args: Prisma.ZohoPaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>[];
                };
                create: {
                    args: Prisma.ZohoPaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>;
                };
                createMany: {
                    args: Prisma.ZohoPaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ZohoPaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>[];
                };
                delete: {
                    args: Prisma.ZohoPaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>;
                };
                update: {
                    args: Prisma.ZohoPaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.ZohoPaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ZohoPaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ZohoPaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>[];
                };
                upsert: {
                    args: Prisma.ZohoPaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPaymentPayload>;
                };
                aggregate: {
                    args: Prisma.ZohoPaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateZohoPayment>;
                };
                groupBy: {
                    args: Prisma.ZohoPaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoPaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ZohoPaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoPaymentCountAggregateOutputType> | number;
                };
            };
        };
        ZohoPurchaseOrderLine: {
            payload: Prisma.$ZohoPurchaseOrderLinePayload<ExtArgs>;
            fields: Prisma.ZohoPurchaseOrderLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ZohoPurchaseOrderLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ZohoPurchaseOrderLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>;
                };
                findFirst: {
                    args: Prisma.ZohoPurchaseOrderLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ZohoPurchaseOrderLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>;
                };
                findMany: {
                    args: Prisma.ZohoPurchaseOrderLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>[];
                };
                create: {
                    args: Prisma.ZohoPurchaseOrderLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>;
                };
                createMany: {
                    args: Prisma.ZohoPurchaseOrderLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ZohoPurchaseOrderLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>[];
                };
                delete: {
                    args: Prisma.ZohoPurchaseOrderLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>;
                };
                update: {
                    args: Prisma.ZohoPurchaseOrderLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>;
                };
                deleteMany: {
                    args: Prisma.ZohoPurchaseOrderLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ZohoPurchaseOrderLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ZohoPurchaseOrderLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>[];
                };
                upsert: {
                    args: Prisma.ZohoPurchaseOrderLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ZohoPurchaseOrderLinePayload>;
                };
                aggregate: {
                    args: Prisma.ZohoPurchaseOrderLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateZohoPurchaseOrderLine>;
                };
                groupBy: {
                    args: Prisma.ZohoPurchaseOrderLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoPurchaseOrderLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ZohoPurchaseOrderLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ZohoPurchaseOrderLineCountAggregateOutputType> | number;
                };
            };
        };
        BcSalesOrder: {
            payload: Prisma.$BcSalesOrderPayload<ExtArgs>;
            fields: Prisma.BcSalesOrderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcSalesOrderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcSalesOrderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>;
                };
                findFirst: {
                    args: Prisma.BcSalesOrderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcSalesOrderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>;
                };
                findMany: {
                    args: Prisma.BcSalesOrderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>[];
                };
                create: {
                    args: Prisma.BcSalesOrderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>;
                };
                createMany: {
                    args: Prisma.BcSalesOrderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcSalesOrderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>[];
                };
                delete: {
                    args: Prisma.BcSalesOrderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>;
                };
                update: {
                    args: Prisma.BcSalesOrderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>;
                };
                deleteMany: {
                    args: Prisma.BcSalesOrderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcSalesOrderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcSalesOrderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>[];
                };
                upsert: {
                    args: Prisma.BcSalesOrderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcSalesOrderPayload>;
                };
                aggregate: {
                    args: Prisma.BcSalesOrderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcSalesOrder>;
                };
                groupBy: {
                    args: Prisma.BcSalesOrderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcSalesOrderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcSalesOrderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcSalesOrderCountAggregateOutputType> | number;
                };
            };
        };
        BcTrackingEntry: {
            payload: Prisma.$BcTrackingEntryPayload<ExtArgs>;
            fields: Prisma.BcTrackingEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcTrackingEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcTrackingEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>;
                };
                findFirst: {
                    args: Prisma.BcTrackingEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcTrackingEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>;
                };
                findMany: {
                    args: Prisma.BcTrackingEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>[];
                };
                create: {
                    args: Prisma.BcTrackingEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>;
                };
                createMany: {
                    args: Prisma.BcTrackingEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcTrackingEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>[];
                };
                delete: {
                    args: Prisma.BcTrackingEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>;
                };
                update: {
                    args: Prisma.BcTrackingEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.BcTrackingEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcTrackingEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcTrackingEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>[];
                };
                upsert: {
                    args: Prisma.BcTrackingEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcTrackingEntryPayload>;
                };
                aggregate: {
                    args: Prisma.BcTrackingEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcTrackingEntry>;
                };
                groupBy: {
                    args: Prisma.BcTrackingEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcTrackingEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcTrackingEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcTrackingEntryCountAggregateOutputType> | number;
                };
            };
        };
        EntityLink: {
            payload: Prisma.$EntityLinkPayload<ExtArgs>;
            fields: Prisma.EntityLinkFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EntityLinkFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EntityLinkFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>;
                };
                findFirst: {
                    args: Prisma.EntityLinkFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EntityLinkFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>;
                };
                findMany: {
                    args: Prisma.EntityLinkFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>[];
                };
                create: {
                    args: Prisma.EntityLinkCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>;
                };
                createMany: {
                    args: Prisma.EntityLinkCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EntityLinkCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>[];
                };
                delete: {
                    args: Prisma.EntityLinkDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>;
                };
                update: {
                    args: Prisma.EntityLinkUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>;
                };
                deleteMany: {
                    args: Prisma.EntityLinkDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EntityLinkUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EntityLinkUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>[];
                };
                upsert: {
                    args: Prisma.EntityLinkUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntityLinkPayload>;
                };
                aggregate: {
                    args: Prisma.EntityLinkAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEntityLink>;
                };
                groupBy: {
                    args: Prisma.EntityLinkGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EntityLinkGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EntityLinkCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EntityLinkCountAggregateOutputType> | number;
                };
            };
        };
        BcShipment: {
            payload: Prisma.$BcShipmentPayload<ExtArgs>;
            fields: Prisma.BcShipmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcShipmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcShipmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>;
                };
                findFirst: {
                    args: Prisma.BcShipmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcShipmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>;
                };
                findMany: {
                    args: Prisma.BcShipmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>[];
                };
                create: {
                    args: Prisma.BcShipmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>;
                };
                createMany: {
                    args: Prisma.BcShipmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcShipmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>[];
                };
                delete: {
                    args: Prisma.BcShipmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>;
                };
                update: {
                    args: Prisma.BcShipmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>;
                };
                deleteMany: {
                    args: Prisma.BcShipmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcShipmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcShipmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>[];
                };
                upsert: {
                    args: Prisma.BcShipmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentPayload>;
                };
                aggregate: {
                    args: Prisma.BcShipmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcShipment>;
                };
                groupBy: {
                    args: Prisma.BcShipmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcShipmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcShipmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcShipmentCountAggregateOutputType> | number;
                };
            };
        };
        BcShipmentLine: {
            payload: Prisma.$BcShipmentLinePayload<ExtArgs>;
            fields: Prisma.BcShipmentLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcShipmentLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcShipmentLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>;
                };
                findFirst: {
                    args: Prisma.BcShipmentLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcShipmentLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>;
                };
                findMany: {
                    args: Prisma.BcShipmentLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>[];
                };
                create: {
                    args: Prisma.BcShipmentLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>;
                };
                createMany: {
                    args: Prisma.BcShipmentLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcShipmentLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>[];
                };
                delete: {
                    args: Prisma.BcShipmentLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>;
                };
                update: {
                    args: Prisma.BcShipmentLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>;
                };
                deleteMany: {
                    args: Prisma.BcShipmentLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcShipmentLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcShipmentLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>[];
                };
                upsert: {
                    args: Prisma.BcShipmentLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcShipmentLinePayload>;
                };
                aggregate: {
                    args: Prisma.BcShipmentLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcShipmentLine>;
                };
                groupBy: {
                    args: Prisma.BcShipmentLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcShipmentLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcShipmentLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcShipmentLineCountAggregateOutputType> | number;
                };
            };
        };
        BcReceipt: {
            payload: Prisma.$BcReceiptPayload<ExtArgs>;
            fields: Prisma.BcReceiptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcReceiptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcReceiptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>;
                };
                findFirst: {
                    args: Prisma.BcReceiptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcReceiptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>;
                };
                findMany: {
                    args: Prisma.BcReceiptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>[];
                };
                create: {
                    args: Prisma.BcReceiptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>;
                };
                createMany: {
                    args: Prisma.BcReceiptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcReceiptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>[];
                };
                delete: {
                    args: Prisma.BcReceiptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>;
                };
                update: {
                    args: Prisma.BcReceiptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>;
                };
                deleteMany: {
                    args: Prisma.BcReceiptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcReceiptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcReceiptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>[];
                };
                upsert: {
                    args: Prisma.BcReceiptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcReceiptPayload>;
                };
                aggregate: {
                    args: Prisma.BcReceiptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcReceipt>;
                };
                groupBy: {
                    args: Prisma.BcReceiptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcReceiptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcReceiptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcReceiptCountAggregateOutputType> | number;
                };
            };
        };
        BcLedgerEntry: {
            payload: Prisma.$BcLedgerEntryPayload<ExtArgs>;
            fields: Prisma.BcLedgerEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BcLedgerEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BcLedgerEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>;
                };
                findFirst: {
                    args: Prisma.BcLedgerEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BcLedgerEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>;
                };
                findMany: {
                    args: Prisma.BcLedgerEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>[];
                };
                create: {
                    args: Prisma.BcLedgerEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>;
                };
                createMany: {
                    args: Prisma.BcLedgerEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BcLedgerEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>[];
                };
                delete: {
                    args: Prisma.BcLedgerEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>;
                };
                update: {
                    args: Prisma.BcLedgerEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.BcLedgerEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BcLedgerEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BcLedgerEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>[];
                };
                upsert: {
                    args: Prisma.BcLedgerEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BcLedgerEntryPayload>;
                };
                aggregate: {
                    args: Prisma.BcLedgerEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBcLedgerEntry>;
                };
                groupBy: {
                    args: Prisma.BcLedgerEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcLedgerEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BcLedgerEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BcLedgerEntryCountAggregateOutputType> | number;
                };
            };
        };
        Item: {
            payload: Prisma.$ItemPayload<ExtArgs>;
            fields: Prisma.ItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>;
                };
                findFirst: {
                    args: Prisma.ItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>;
                };
                findMany: {
                    args: Prisma.ItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>[];
                };
                create: {
                    args: Prisma.ItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>;
                };
                createMany: {
                    args: Prisma.ItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>[];
                };
                delete: {
                    args: Prisma.ItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>;
                };
                update: {
                    args: Prisma.ItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>;
                };
                deleteMany: {
                    args: Prisma.ItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>[];
                };
                upsert: {
                    args: Prisma.ItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemPayload>;
                };
                aggregate: {
                    args: Prisma.ItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateItem>;
                };
                groupBy: {
                    args: Prisma.ItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ItemCountAggregateOutputType> | number;
                };
            };
        };
        ItemEvent: {
            payload: Prisma.$ItemEventPayload<ExtArgs>;
            fields: Prisma.ItemEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ItemEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ItemEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>;
                };
                findFirst: {
                    args: Prisma.ItemEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ItemEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>;
                };
                findMany: {
                    args: Prisma.ItemEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>[];
                };
                create: {
                    args: Prisma.ItemEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>;
                };
                createMany: {
                    args: Prisma.ItemEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ItemEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>[];
                };
                delete: {
                    args: Prisma.ItemEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>;
                };
                update: {
                    args: Prisma.ItemEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>;
                };
                deleteMany: {
                    args: Prisma.ItemEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ItemEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ItemEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>[];
                };
                upsert: {
                    args: Prisma.ItemEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ItemEventPayload>;
                };
                aggregate: {
                    args: Prisma.ItemEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateItemEvent>;
                };
                groupBy: {
                    args: Prisma.ItemEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ItemEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ItemEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ItemEventCountAggregateOutputType> | number;
                };
            };
        };
        LiveStockBranch: {
            payload: Prisma.$LiveStockBranchPayload<ExtArgs>;
            fields: Prisma.LiveStockBranchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LiveStockBranchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LiveStockBranchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>;
                };
                findFirst: {
                    args: Prisma.LiveStockBranchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LiveStockBranchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>;
                };
                findMany: {
                    args: Prisma.LiveStockBranchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>[];
                };
                create: {
                    args: Prisma.LiveStockBranchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>;
                };
                createMany: {
                    args: Prisma.LiveStockBranchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LiveStockBranchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>[];
                };
                delete: {
                    args: Prisma.LiveStockBranchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>;
                };
                update: {
                    args: Prisma.LiveStockBranchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>;
                };
                deleteMany: {
                    args: Prisma.LiveStockBranchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LiveStockBranchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LiveStockBranchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>[];
                };
                upsert: {
                    args: Prisma.LiveStockBranchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBranchPayload>;
                };
                aggregate: {
                    args: Prisma.LiveStockBranchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLiveStockBranch>;
                };
                groupBy: {
                    args: Prisma.LiveStockBranchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockBranchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LiveStockBranchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockBranchCountAggregateOutputType> | number;
                };
            };
        };
        LiveStockLine: {
            payload: Prisma.$LiveStockLinePayload<ExtArgs>;
            fields: Prisma.LiveStockLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LiveStockLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LiveStockLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>;
                };
                findFirst: {
                    args: Prisma.LiveStockLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LiveStockLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>;
                };
                findMany: {
                    args: Prisma.LiveStockLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>[];
                };
                create: {
                    args: Prisma.LiveStockLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>;
                };
                createMany: {
                    args: Prisma.LiveStockLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LiveStockLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>[];
                };
                delete: {
                    args: Prisma.LiveStockLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>;
                };
                update: {
                    args: Prisma.LiveStockLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>;
                };
                deleteMany: {
                    args: Prisma.LiveStockLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LiveStockLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LiveStockLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>[];
                };
                upsert: {
                    args: Prisma.LiveStockLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockLinePayload>;
                };
                aggregate: {
                    args: Prisma.LiveStockLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLiveStockLine>;
                };
                groupBy: {
                    args: Prisma.LiveStockLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LiveStockLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockLineCountAggregateOutputType> | number;
                };
            };
        };
        LiveStockBar: {
            payload: Prisma.$LiveStockBarPayload<ExtArgs>;
            fields: Prisma.LiveStockBarFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LiveStockBarFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LiveStockBarFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>;
                };
                findFirst: {
                    args: Prisma.LiveStockBarFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LiveStockBarFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>;
                };
                findMany: {
                    args: Prisma.LiveStockBarFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>[];
                };
                create: {
                    args: Prisma.LiveStockBarCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>;
                };
                createMany: {
                    args: Prisma.LiveStockBarCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LiveStockBarCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>[];
                };
                delete: {
                    args: Prisma.LiveStockBarDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>;
                };
                update: {
                    args: Prisma.LiveStockBarUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>;
                };
                deleteMany: {
                    args: Prisma.LiveStockBarDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LiveStockBarUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LiveStockBarUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>[];
                };
                upsert: {
                    args: Prisma.LiveStockBarUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockBarPayload>;
                };
                aggregate: {
                    args: Prisma.LiveStockBarAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLiveStockBar>;
                };
                groupBy: {
                    args: Prisma.LiveStockBarGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockBarGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LiveStockBarCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockBarCountAggregateOutputType> | number;
                };
            };
        };
        LiveStockMovement: {
            payload: Prisma.$LiveStockMovementPayload<ExtArgs>;
            fields: Prisma.LiveStockMovementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LiveStockMovementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LiveStockMovementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>;
                };
                findFirst: {
                    args: Prisma.LiveStockMovementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LiveStockMovementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>;
                };
                findMany: {
                    args: Prisma.LiveStockMovementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>[];
                };
                create: {
                    args: Prisma.LiveStockMovementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>;
                };
                createMany: {
                    args: Prisma.LiveStockMovementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LiveStockMovementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>[];
                };
                delete: {
                    args: Prisma.LiveStockMovementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>;
                };
                update: {
                    args: Prisma.LiveStockMovementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>;
                };
                deleteMany: {
                    args: Prisma.LiveStockMovementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LiveStockMovementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LiveStockMovementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>[];
                };
                upsert: {
                    args: Prisma.LiveStockMovementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LiveStockMovementPayload>;
                };
                aggregate: {
                    args: Prisma.LiveStockMovementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLiveStockMovement>;
                };
                groupBy: {
                    args: Prisma.LiveStockMovementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockMovementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LiveStockMovementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LiveStockMovementCountAggregateOutputType> | number;
                };
            };
        };
        SheetApplication: {
            payload: Prisma.$SheetApplicationPayload<ExtArgs>;
            fields: Prisma.SheetApplicationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SheetApplicationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SheetApplicationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>;
                };
                findFirst: {
                    args: Prisma.SheetApplicationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SheetApplicationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>;
                };
                findMany: {
                    args: Prisma.SheetApplicationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>[];
                };
                create: {
                    args: Prisma.SheetApplicationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>;
                };
                createMany: {
                    args: Prisma.SheetApplicationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SheetApplicationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>[];
                };
                delete: {
                    args: Prisma.SheetApplicationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>;
                };
                update: {
                    args: Prisma.SheetApplicationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>;
                };
                deleteMany: {
                    args: Prisma.SheetApplicationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SheetApplicationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SheetApplicationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>[];
                };
                upsert: {
                    args: Prisma.SheetApplicationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SheetApplicationPayload>;
                };
                aggregate: {
                    args: Prisma.SheetApplicationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSheetApplication>;
                };
                groupBy: {
                    args: Prisma.SheetApplicationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SheetApplicationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SheetApplicationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SheetApplicationCountAggregateOutputType> | number;
                };
            };
        };
        RolePermission: {
            payload: Prisma.$RolePermissionPayload<ExtArgs>;
            fields: Prisma.RolePermissionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RolePermissionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RolePermissionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>;
                };
                findFirst: {
                    args: Prisma.RolePermissionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RolePermissionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>;
                };
                findMany: {
                    args: Prisma.RolePermissionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>[];
                };
                create: {
                    args: Prisma.RolePermissionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>;
                };
                createMany: {
                    args: Prisma.RolePermissionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RolePermissionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>[];
                };
                delete: {
                    args: Prisma.RolePermissionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>;
                };
                update: {
                    args: Prisma.RolePermissionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>;
                };
                deleteMany: {
                    args: Prisma.RolePermissionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RolePermissionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RolePermissionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>[];
                };
                upsert: {
                    args: Prisma.RolePermissionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionPayload>;
                };
                aggregate: {
                    args: Prisma.RolePermissionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRolePermission>;
                };
                groupBy: {
                    args: Prisma.RolePermissionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RolePermissionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RolePermissionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RolePermissionCountAggregateOutputType> | number;
                };
            };
        };
        UserPermissionOverride: {
            payload: Prisma.$UserPermissionOverridePayload<ExtArgs>;
            fields: Prisma.UserPermissionOverrideFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserPermissionOverrideFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserPermissionOverrideFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>;
                };
                findFirst: {
                    args: Prisma.UserPermissionOverrideFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserPermissionOverrideFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>;
                };
                findMany: {
                    args: Prisma.UserPermissionOverrideFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>[];
                };
                create: {
                    args: Prisma.UserPermissionOverrideCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>;
                };
                createMany: {
                    args: Prisma.UserPermissionOverrideCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserPermissionOverrideCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>[];
                };
                delete: {
                    args: Prisma.UserPermissionOverrideDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>;
                };
                update: {
                    args: Prisma.UserPermissionOverrideUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>;
                };
                deleteMany: {
                    args: Prisma.UserPermissionOverrideDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserPermissionOverrideUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserPermissionOverrideUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>[];
                };
                upsert: {
                    args: Prisma.UserPermissionOverrideUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPermissionOverridePayload>;
                };
                aggregate: {
                    args: Prisma.UserPermissionOverrideAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserPermissionOverride>;
                };
                groupBy: {
                    args: Prisma.UserPermissionOverrideGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserPermissionOverrideGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserPermissionOverrideCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserPermissionOverrideCountAggregateOutputType> | number;
                };
            };
        };
        ProductPriceSnapshot: {
            payload: Prisma.$ProductPriceSnapshotPayload<ExtArgs>;
            fields: Prisma.ProductPriceSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProductPriceSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProductPriceSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.ProductPriceSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProductPriceSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.ProductPriceSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>[];
                };
                create: {
                    args: Prisma.ProductPriceSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.ProductPriceSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProductPriceSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.ProductPriceSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>;
                };
                update: {
                    args: Prisma.ProductPriceSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.ProductPriceSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProductPriceSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProductPriceSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.ProductPriceSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPriceSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.ProductPriceSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProductPriceSnapshot>;
                };
                groupBy: {
                    args: Prisma.ProductPriceSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductPriceSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProductPriceSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductPriceSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        AiFeedback: {
            payload: Prisma.$AiFeedbackPayload<ExtArgs>;
            fields: Prisma.AiFeedbackFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AiFeedbackFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AiFeedbackFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>;
                };
                findFirst: {
                    args: Prisma.AiFeedbackFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AiFeedbackFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>;
                };
                findMany: {
                    args: Prisma.AiFeedbackFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>[];
                };
                create: {
                    args: Prisma.AiFeedbackCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>;
                };
                createMany: {
                    args: Prisma.AiFeedbackCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AiFeedbackCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>[];
                };
                delete: {
                    args: Prisma.AiFeedbackDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>;
                };
                update: {
                    args: Prisma.AiFeedbackUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>;
                };
                deleteMany: {
                    args: Prisma.AiFeedbackDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AiFeedbackUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AiFeedbackUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>[];
                };
                upsert: {
                    args: Prisma.AiFeedbackUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AiFeedbackPayload>;
                };
                aggregate: {
                    args: Prisma.AiFeedbackAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAiFeedback>;
                };
                groupBy: {
                    args: Prisma.AiFeedbackGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiFeedbackGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AiFeedbackCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AiFeedbackCountAggregateOutputType> | number;
                };
            };
        };
        UserPreference: {
            payload: Prisma.$UserPreferencePayload<ExtArgs>;
            fields: Prisma.UserPreferenceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserPreferenceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserPreferenceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>;
                };
                findFirst: {
                    args: Prisma.UserPreferenceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserPreferenceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>;
                };
                findMany: {
                    args: Prisma.UserPreferenceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>[];
                };
                create: {
                    args: Prisma.UserPreferenceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>;
                };
                createMany: {
                    args: Prisma.UserPreferenceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserPreferenceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>[];
                };
                delete: {
                    args: Prisma.UserPreferenceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>;
                };
                update: {
                    args: Prisma.UserPreferenceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>;
                };
                deleteMany: {
                    args: Prisma.UserPreferenceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserPreferenceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserPreferenceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>[];
                };
                upsert: {
                    args: Prisma.UserPreferenceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPreferencePayload>;
                };
                aggregate: {
                    args: Prisma.UserPreferenceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserPreference>;
                };
                groupBy: {
                    args: Prisma.UserPreferenceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserPreferenceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserPreferenceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserPreferenceCountAggregateOutputType> | number;
                };
            };
        };
        CompanySetting: {
            payload: Prisma.$CompanySettingPayload<ExtArgs>;
            fields: Prisma.CompanySettingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CompanySettingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CompanySettingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>;
                };
                findFirst: {
                    args: Prisma.CompanySettingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CompanySettingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>;
                };
                findMany: {
                    args: Prisma.CompanySettingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>[];
                };
                create: {
                    args: Prisma.CompanySettingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>;
                };
                createMany: {
                    args: Prisma.CompanySettingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CompanySettingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>[];
                };
                delete: {
                    args: Prisma.CompanySettingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>;
                };
                update: {
                    args: Prisma.CompanySettingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>;
                };
                deleteMany: {
                    args: Prisma.CompanySettingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CompanySettingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CompanySettingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>[];
                };
                upsert: {
                    args: Prisma.CompanySettingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanySettingPayload>;
                };
                aggregate: {
                    args: Prisma.CompanySettingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompanySetting>;
                };
                groupBy: {
                    args: Prisma.CompanySettingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanySettingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CompanySettingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanySettingCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly password: "password";
    readonly role: "role";
    readonly isActive: "isActive";
    readonly admin: "admin";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly lastLoginAt: "lastLoginAt";
    readonly uiSettings: "uiSettings";
    readonly branchId: "branchId";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: "id";
    readonly sku: "sku";
    readonly name: "name";
    readonly metalType: "metalType";
    readonly weight: "weight";
    readonly spreadBuy: "spreadBuy";
    readonly spreadSell: "spreadSell";
    readonly vatRate: "vatRate";
    readonly stock: "stock";
    readonly isActive: "isActive";
    readonly category: "category";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const MetalSpotPriceScalarFieldEnum: {
    readonly id: "id";
    readonly metalType: "metalType";
    readonly priceEur: "priceEur";
    readonly priceGbp: "priceGbp";
    readonly source: "source";
    readonly timestamp: "timestamp";
    readonly createdAt: "createdAt";
};
export type MetalSpotPriceScalarFieldEnum = (typeof MetalSpotPriceScalarFieldEnum)[keyof typeof MetalSpotPriceScalarFieldEnum];
export declare const HistoricSpotPriceScalarFieldEnum: {
    readonly id: "id";
    readonly metalType: "metalType";
    readonly priceEur: "priceEur";
    readonly priceGbp: "priceGbp";
    readonly recordedAt: "recordedAt";
    readonly createdAt: "createdAt";
};
export type HistoricSpotPriceScalarFieldEnum = (typeof HistoricSpotPriceScalarFieldEnum)[keyof typeof HistoricSpotPriceScalarFieldEnum];
export declare const BranchScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly address: "address";
    readonly region: "region";
    readonly currency: "currency";
    readonly createdAt: "createdAt";
};
export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum];
export declare const FetchAttemptScalarFieldEnum: {
    readonly id: "id";
    readonly attemptedAt: "attemptedAt";
    readonly durationMs: "durationMs";
    readonly success: "success";
    readonly errorMessage: "errorMessage";
    readonly metalsResolved: "metalsResolved";
    readonly triggeredBy: "triggeredBy";
};
export type FetchAttemptScalarFieldEnum = (typeof FetchAttemptScalarFieldEnum)[keyof typeof FetchAttemptScalarFieldEnum];
export declare const KbDocumentScalarFieldEnum: {
    readonly id: "id";
    readonly slug: "slug";
    readonly title: "title";
    readonly category: "category";
    readonly jurisdiction: "jurisdiction";
    readonly owner: "owner";
    readonly status: "status";
    readonly visibility: "visibility";
    readonly version: "version";
    readonly contentUpdatedOn: "contentUpdatedOn";
    readonly markdown: "markdown";
    readonly contentHash: "contentHash";
    readonly editedInApp: "editedInApp";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type KbDocumentScalarFieldEnum = (typeof KbDocumentScalarFieldEnum)[keyof typeof KbDocumentScalarFieldEnum];
export declare const AiQuestionLogScalarFieldEnum: {
    readonly id: "id";
    readonly createdAt: "createdAt";
    readonly userId: "userId";
    readonly question: "question";
    readonly status: "status";
    readonly mode: "mode";
    readonly toolNames: "toolNames";
    readonly cached: "cached";
    readonly retried: "retried";
    readonly citations: "citations";
    readonly model: "model";
    readonly corpusHash: "corpusHash";
    readonly inputTokens: "inputTokens";
    readonly cachedInputTokens: "cachedInputTokens";
    readonly outputTokens: "outputTokens";
    readonly costMicros: "costMicros";
    readonly latencyMs: "latencyMs";
    readonly error: "error";
};
export type AiQuestionLogScalarFieldEnum = (typeof AiQuestionLogScalarFieldEnum)[keyof typeof AiQuestionLogScalarFieldEnum];
export declare const AiAnswerCacheScalarFieldEnum: {
    readonly id: "id";
    readonly questionKey: "questionKey";
    readonly corpusHash: "corpusHash";
    readonly answer: "answer";
    readonly status: "status";
    readonly citations: "citations";
    readonly model: "model";
    readonly hits: "hits";
    readonly createdAt: "createdAt";
    readonly expiresAt: "expiresAt";
};
export type AiAnswerCacheScalarFieldEnum = (typeof AiAnswerCacheScalarFieldEnum)[keyof typeof AiAnswerCacheScalarFieldEnum];
export declare const MarketModeStateScalarFieldEnum: {
    readonly id: "id";
    readonly weekend: "weekend";
    readonly volatile: "volatile";
    readonly shortage: "shortage";
    readonly updatedBy: "updatedBy";
    readonly updatedAt: "updatedAt";
};
export type MarketModeStateScalarFieldEnum = (typeof MarketModeStateScalarFieldEnum)[keyof typeof MarketModeStateScalarFieldEnum];
export declare const RoadmapDocumentScalarFieldEnum: {
    readonly id: "id";
    readonly markdown: "markdown";
    readonly version: "version";
    readonly updatedBy: "updatedBy";
    readonly updatedAt: "updatedAt";
};
export type RoadmapDocumentScalarFieldEnum = (typeof RoadmapDocumentScalarFieldEnum)[keyof typeof RoadmapDocumentScalarFieldEnum];
export declare const RoadmapSyncStateScalarFieldEnum: {
    readonly id: "id";
    readonly baseCommit: "baseCommit";
    readonly baseMarkdown: "baseMarkdown";
    readonly syncedAt: "syncedAt";
    readonly syncedBy: "syncedBy";
};
export type RoadmapSyncStateScalarFieldEnum = (typeof RoadmapSyncStateScalarFieldEnum)[keyof typeof RoadmapSyncStateScalarFieldEnum];
export declare const RoadmapSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly markdown: "markdown";
    readonly version: "version";
    readonly reason: "reason";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type RoadmapSnapshotScalarFieldEnum = (typeof RoadmapSnapshotScalarFieldEnum)[keyof typeof RoadmapSnapshotScalarFieldEnum];
export declare const RoadmapInboxScalarFieldEnum: {
    readonly id: "id";
    readonly issueNumber: "issueNumber";
    readonly title: "title";
    readonly body: "body";
    readonly kind: "kind";
    readonly url: "url";
    readonly status: "status";
    readonly issueCreatedAt: "issueCreatedAt";
    readonly fetchedAt: "fetchedAt";
    readonly handledAt: "handledAt";
    readonly handledBy: "handledBy";
    readonly source: "source";
};
export type RoadmapInboxScalarFieldEnum = (typeof RoadmapInboxScalarFieldEnum)[keyof typeof RoadmapInboxScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly at: "at";
    readonly actor: "actor";
    readonly action: "action";
    readonly detail: "detail";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const BcItemScalarFieldEnum: {
    readonly itemNo: "itemNo";
    readonly description: "description";
    readonly productId: "productId";
    readonly refineryHint: "refineryHint";
    readonly salesProductId: "salesProductId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcItemScalarFieldEnum = (typeof BcItemScalarFieldEnum)[keyof typeof BcItemScalarFieldEnum];
export declare const StocktakeScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly countDate: "countDate";
    readonly cutoffDate: "cutoffDate";
    readonly status: "status";
    readonly stocktakeLead: "stocktakeLead";
    readonly secondChecker: "secondChecker";
    readonly notes: "notes";
    readonly createdBy: "createdBy";
    readonly finalisedBy: "finalisedBy";
    readonly finalisedAt: "finalisedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly imported: "imported";
    readonly importBatchId: "importBatchId";
};
export type StocktakeScalarFieldEnum = (typeof StocktakeScalarFieldEnum)[keyof typeof StocktakeScalarFieldEnum];
export declare const StocktakeLineScalarFieldEnum: {
    readonly id: "id";
    readonly stocktakeId: "stocktakeId";
    readonly itemNo: "itemNo";
    readonly description: "description";
    readonly locationCode: "locationCode";
    readonly qtyCalculated: "qtyCalculated";
    readonly countedNormal: "countedNormal";
    readonly countedCustomer: "countedCustomer";
    readonly counted: "counted";
    readonly reason: "reason";
    readonly serialsChecked: "serialsChecked";
    readonly serialNote: "serialNote";
    readonly batchName: "batchName";
    readonly documentNo: "documentNo";
    readonly entryType: "entryType";
    readonly unitAmount: "unitAmount";
    readonly unitCost: "unitCost";
    readonly sourceKey: "sourceKey";
};
export type StocktakeLineScalarFieldEnum = (typeof StocktakeLineScalarFieldEnum)[keyof typeof StocktakeLineScalarFieldEnum];
export declare const StocktakeDiscrepancyScalarFieldEnum: {
    readonly id: "id";
    readonly stocktakeId: "stocktakeId";
    readonly itemNo: "itemNo";
    readonly description: "description";
    readonly issueType: "issueType";
    readonly bcShows: "bcShows";
    readonly physicalFound: "physicalFound";
    readonly serialNo: "serialNo";
    readonly action: "action";
    readonly resolved: "resolved";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StocktakeDiscrepancyScalarFieldEnum = (typeof StocktakeDiscrepancyScalarFieldEnum)[keyof typeof StocktakeDiscrepancyScalarFieldEnum];
export declare const StocktakeBarScalarFieldEnum: {
    readonly id: "id";
    readonly stocktakeId: "stocktakeId";
    readonly metal: "metal";
    readonly locationCode: "locationCode";
    readonly weightLabel: "weightLabel";
    readonly refinery: "refinery";
    readonly serial: "serial";
    readonly grams: "grams";
    readonly details: "details";
    readonly status: "status";
    readonly carriedFromId: "carriedFromId";
    readonly sourceKey: "sourceKey";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StocktakeBarScalarFieldEnum = (typeof StocktakeBarScalarFieldEnum)[keyof typeof StocktakeBarScalarFieldEnum];
export declare const StocktakeCoinScalarFieldEnum: {
    readonly id: "id";
    readonly stocktakeId: "stocktakeId";
    readonly metal: "metal";
    readonly locationCode: "locationCode";
    readonly item: "item";
    readonly previousQty: "previousQty";
    readonly countedQty: "countedQty";
    readonly details: "details";
    readonly countsJson: "countsJson";
    readonly sourceKey: "sourceKey";
};
export type StocktakeCoinScalarFieldEnum = (typeof StocktakeCoinScalarFieldEnum)[keyof typeof StocktakeCoinScalarFieldEnum];
export declare const CustomerOrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly locationCode: "locationCode";
    readonly client: "client";
    readonly reference: "reference";
    readonly bcOrderNo: "bcOrderNo";
    readonly supplierRef: "supplierRef";
    readonly metal: "metal";
    readonly product: "product";
    readonly bcItemNo: "bcItemNo";
    readonly quantity: "quantity";
    readonly refinery: "refinery";
    readonly serials: "serials";
    readonly status: "status";
    readonly orderedOn: "orderedOn";
    readonly missing: "missing";
    readonly notes: "notes";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly tradeId: "tradeId";
};
export type CustomerOrderItemScalarFieldEnum = (typeof CustomerOrderItemScalarFieldEnum)[keyof typeof CustomerOrderItemScalarFieldEnum];
export declare const CustomerOrderEvidenceScalarFieldEnum: {
    readonly id: "id";
    readonly itemId: "itemId";
    readonly kind: "kind";
    readonly reference: "reference";
    readonly note: "note";
    readonly observedOn: "observedOn";
    readonly recordedBy: "recordedBy";
    readonly createdAt: "createdAt";
};
export type CustomerOrderEvidenceScalarFieldEnum = (typeof CustomerOrderEvidenceScalarFieldEnum)[keyof typeof CustomerOrderEvidenceScalarFieldEnum];
export declare const ImportBatchScalarFieldEnum: {
    readonly id: "id";
    readonly fileName: "fileName";
    readonly sheetMonth: "sheetMonth";
    readonly source: "source";
    readonly importedBy: "importedBy";
    readonly importedAt: "importedAt";
    readonly summary: "summary";
    readonly kind: "kind";
    readonly schemaVersion: "schemaVersion";
    readonly tableCounts: "tableCounts";
    readonly status: "status";
};
export type ImportBatchScalarFieldEnum = (typeof ImportBatchScalarFieldEnum)[keyof typeof ImportBatchScalarFieldEnum];
export declare const TradeScalarFieldEnum: {
    readonly id: "id";
    readonly reference: "reference";
    readonly referenceKey: "referenceKey";
    readonly occurrence: "occurrence";
    readonly metal: "metal";
    readonly branchCode: "branchCode";
    readonly branchId: "branchId";
    readonly initials: "initials";
    readonly client: "client";
    readonly qty: "qty";
    readonly productText: "productText";
    readonly productKey: "productKey";
    readonly productId: "productId";
    readonly date: "date";
    readonly spot: "spot";
    readonly cptyRaw: "cptyRaw";
    readonly cptyKind: "cptyKind";
    readonly state: "state";
    readonly stateFromColour: "stateFromColour";
    readonly lotKey: "lotKey";
    readonly lotId: "lotId";
    readonly supplierName: "supplierName";
    readonly supplierInvoice: "supplierInvoice";
    readonly collected: "collected";
    readonly collectedSource: "collectedSource";
    readonly collectedOn: "collectedOn";
    readonly deferredFrom: "deferredFrom";
    readonly deferredTo: "deferredTo";
    readonly cost: "cost";
    readonly receipt: "receipt";
    readonly profit: "profit";
    readonly margin: "margin";
    readonly vatDue: "vatDue";
    readonly totalPrice: "totalPrice";
    readonly netHedging: "netHedging";
    readonly boughtAt: "boughtAt";
    readonly soldAt: "soldAt";
    readonly paid: "paid";
    readonly notes: "notes";
    readonly hedgingNotes: "hedgingNotes";
    readonly sourceMonth: "sourceMonth";
    readonly sourceTab: "sourceTab";
    readonly sourceRow: "sourceRow";
    readonly fingerprint: "fingerprint";
    readonly missingFromImport: "missingFromImport";
    readonly issues: "issues";
    readonly firstBatchId: "firstBatchId";
    readonly lastBatchId: "lastBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly sourceKey: "sourceKey";
    readonly system: "system";
    readonly cptyFill: "cptyFill";
    readonly refinery: "refinery";
    readonly customerId: "customerId";
    readonly supplierInvoiceId: "supplierInvoiceId";
    readonly salesProductId: "salesProductId";
};
export type TradeScalarFieldEnum = (typeof TradeScalarFieldEnum)[keyof typeof TradeScalarFieldEnum];
export declare const PurchaseLotScalarFieldEnum: {
    readonly id: "id";
    readonly reference: "reference";
    readonly referenceKey: "referenceKey";
    readonly occurrence: "occurrence";
    readonly metal: "metal";
    readonly branchCode: "branchCode";
    readonly branchId: "branchId";
    readonly client: "client";
    readonly qty: "qty";
    readonly productText: "productText";
    readonly productKey: "productKey";
    readonly productId: "productId";
    readonly received: "received";
    readonly datePaid: "datePaid";
    readonly pricePaid: "pricePaid";
    readonly pricePerItem: "pricePerItem";
    readonly hedgedAt: "hedgedAt";
    readonly melt: "melt";
    readonly commentsRaw: "commentsRaw";
    readonly commentSoldQty: "commentSoldQty";
    readonly commentAllSold: "commentAllSold";
    readonly commentReview: "commentReview";
    readonly allocatedQty: "allocatedQty";
    readonly sourceMonth: "sourceMonth";
    readonly sourceTab: "sourceTab";
    readonly sourceRow: "sourceRow";
    readonly fingerprint: "fingerprint";
    readonly missingFromImport: "missingFromImport";
    readonly issues: "issues";
    readonly firstBatchId: "firstBatchId";
    readonly lastBatchId: "lastBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly sourceKey: "sourceKey";
    readonly system: "system";
    readonly refinery: "refinery";
    readonly sellerId: "sellerId";
    readonly supplierInvoiceId: "supplierInvoiceId";
    readonly salesProductId: "salesProductId";
};
export type PurchaseLotScalarFieldEnum = (typeof PurchaseLotScalarFieldEnum)[keyof typeof PurchaseLotScalarFieldEnum];
export declare const StockUnitScalarFieldEnum: {
    readonly id: "id";
    readonly lotId: "lotId";
    readonly seq: "seq";
    readonly tradeId: "tradeId";
};
export type StockUnitScalarFieldEnum = (typeof StockUnitScalarFieldEnum)[keyof typeof StockUnitScalarFieldEnum];
export declare const ProductAliasScalarFieldEnum: {
    readonly id: "id";
    readonly alias: "alias";
    readonly productKey: "productKey";
    readonly productId: "productId";
    readonly salesProductId: "salesProductId";
    readonly refinery: "refinery";
    readonly noProduct: "noProduct";
    readonly uses: "uses";
    readonly createdAt: "createdAt";
    readonly sources: "sources";
    readonly metalHint: "metalHint";
    readonly decidedBy: "decidedBy";
    readonly suggestedProductId: "suggestedProductId";
    readonly suggestedSalesProductId: "suggestedSalesProductId";
    readonly suggestedNoProduct: "suggestedNoProduct";
    readonly confidence: "confidence";
    readonly reason: "reason";
    readonly question: "question";
    readonly catalogueGap: "catalogueGap";
};
export type ProductAliasScalarFieldEnum = (typeof ProductAliasScalarFieldEnum)[keyof typeof ProductAliasScalarFieldEnum];
export declare const ProductRuleScalarFieldEnum: {
    readonly id: "id";
    readonly kind: "kind";
    readonly pattern: "pattern";
    readonly value: "value";
    readonly note: "note";
    readonly active: "active";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProductRuleScalarFieldEnum = (typeof ProductRuleScalarFieldEnum)[keyof typeof ProductRuleScalarFieldEnum];
export declare const ZohoProductScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly sku: "sku";
    readonly itemName: "itemName";
    readonly productNorm: "productNorm";
    readonly metal: "metal";
    readonly qtySold: "qtySold";
    readonly amount: "amount";
    readonly avgPrice: "avgPrice";
    readonly productId: "productId";
    readonly salesProductId: "salesProductId";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ZohoProductScalarFieldEnum = (typeof ZohoProductScalarFieldEnum)[keyof typeof ZohoProductScalarFieldEnum];
export declare const OrderEventScalarFieldEnum: {
    readonly id: "id";
    readonly tradeId: "tradeId";
    readonly step: "step";
    readonly by: "by";
    readonly at: "at";
    readonly note: "note";
};
export type OrderEventScalarFieldEnum = (typeof OrderEventScalarFieldEnum)[keyof typeof OrderEventScalarFieldEnum];
export declare const SheetTaskScalarFieldEnum: {
    readonly id: "id";
    readonly tradeId: "tradeId";
    readonly reference: "reference";
    readonly client: "client";
    readonly sheet: "sheet";
    readonly what: "what";
    readonly value: "value";
    readonly check: "check";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly createdBy: "createdBy";
    readonly closedAt: "closedAt";
    readonly closedBy: "closedBy";
    readonly closedVia: "closedVia";
};
export type SheetTaskScalarFieldEnum = (typeof SheetTaskScalarFieldEnum)[keyof typeof SheetTaskScalarFieldEnum];
export declare const HandoverScalarFieldEnum: {
    readonly id: "id";
    readonly note: "note";
    readonly by: "by";
    readonly createdAt: "createdAt";
};
export type HandoverScalarFieldEnum = (typeof HandoverScalarFieldEnum)[keyof typeof HandoverScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly redactionCode: "redactionCode";
    readonly name: "name";
    readonly zohoNumber: "zohoNumber";
    readonly bcCustomerNo: "bcCustomerNo";
    readonly bcVendorNo: "bcVendorNo";
    readonly status: "status";
    readonly currency: "currency";
    readonly sources: "sources";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const VendorScalarFieldEnum: {
    readonly id: "id";
    readonly redactionCode: "redactionCode";
    readonly name: "name";
    readonly zohoNumber: "zohoNumber";
    readonly status: "status";
    readonly currency: "currency";
    readonly sources: "sources";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum];
export declare const SupplierInvoiceScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly supplier: "supplier";
    readonly number: "number";
    readonly firstDate: "firstDate";
    readonly lastDate: "lastDate";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SupplierInvoiceScalarFieldEnum = (typeof SupplierInvoiceScalarFieldEnum)[keyof typeof SupplierInvoiceScalarFieldEnum];
export declare const SalesProductScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly metal: "metal";
    readonly genericNorm: "genericNorm";
    readonly weightLabel: "weightLabel";
    readonly refinery: "refinery";
    readonly pricingProductId: "pricingProductId";
    readonly active: "active";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SalesProductScalarFieldEnum = (typeof SalesProductScalarFieldEnum)[keyof typeof SalesProductScalarFieldEnum];
export declare const RefineryAliasScalarFieldEnum: {
    readonly id: "id";
    readonly alias: "alias";
    readonly refinery: "refinery";
    readonly createdAt: "createdAt";
};
export type RefineryAliasScalarFieldEnum = (typeof RefineryAliasScalarFieldEnum)[keyof typeof RefineryAliasScalarFieldEnum];
export declare const QuoteScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly reference: "reference";
    readonly referenceKey: "referenceKey";
    readonly date: "date";
    readonly metal: "metal";
    readonly branchCode: "branchCode";
    readonly qty: "qty";
    readonly productText: "productText";
    readonly productNorm: "productNorm";
    readonly customerId: "customerId";
    readonly salesProductId: "salesProductId";
    readonly status: "status";
    readonly convertedTradeId: "convertedTradeId";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type QuoteScalarFieldEnum = (typeof QuoteScalarFieldEnum)[keyof typeof QuoteScalarFieldEnum];
export declare const ZohoInvoiceScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly date: "date";
    readonly customerId: "customerId";
    readonly status: "status";
    readonly salesOrderNumber: "salesOrderNumber";
    readonly total: "total";
    readonly lineCount: "lineCount";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ZohoInvoiceScalarFieldEnum = (typeof ZohoInvoiceScalarFieldEnum)[keyof typeof ZohoInvoiceScalarFieldEnum];
export declare const ZohoInvoiceLineScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly invoiceId: "invoiceId";
    readonly lineNo: "lineNo";
    readonly date: "date";
    readonly customerId: "customerId";
    readonly qty: "qty";
    readonly itemName: "itemName";
    readonly productNorm: "productNorm";
    readonly unitPrice: "unitPrice";
    readonly lineTotal: "lineTotal";
    readonly itemDesc: "itemDesc";
    readonly collectedFlag: "collectedFlag";
    readonly collectedDate: "collectedDate";
    readonly refinery: "refinery";
    readonly salesProductId: "salesProductId";
    readonly deliveredBrinks: "deliveredBrinks";
    readonly soldBack: "soldBack";
    readonly refsFound: "refsFound";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ZohoInvoiceLineScalarFieldEnum = (typeof ZohoInvoiceLineScalarFieldEnum)[keyof typeof ZohoInvoiceLineScalarFieldEnum];
export declare const LineSerialScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly lineId: "lineId";
    readonly serial: "serial";
    readonly serialNorm: "serialNorm";
    readonly refinery: "refinery";
    readonly collectedFlag: "collectedFlag";
    readonly collectedDate: "collectedDate";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LineSerialScalarFieldEnum = (typeof LineSerialScalarFieldEnum)[keyof typeof LineSerialScalarFieldEnum];
export declare const ZohoPaymentScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly invoiceId: "invoiceId";
    readonly customerId: "customerId";
    readonly zohoCustomerId: "zohoCustomerId";
    readonly date: "date";
    readonly invoiceDate: "invoiceDate";
    readonly amount: "amount";
    readonly invoiceAmount: "invoiceAmount";
    readonly mode: "mode";
    readonly reference: "reference";
    readonly type: "type";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ZohoPaymentScalarFieldEnum = (typeof ZohoPaymentScalarFieldEnum)[keyof typeof ZohoPaymentScalarFieldEnum];
export declare const ZohoPurchaseOrderLineScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly poNumber: "poNumber";
    readonly lineNo: "lineNo";
    readonly date: "date";
    readonly vendorNumber: "vendorNumber";
    readonly vendorId: "vendorId";
    readonly itemName: "itemName";
    readonly productNorm: "productNorm";
    readonly qtyOrdered: "qtyOrdered";
    readonly qtyReceived: "qtyReceived";
    readonly qtyBilled: "qtyBilled";
    readonly price: "price";
    readonly itemTotal: "itemTotal";
    readonly status: "status";
    readonly reference: "reference";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ZohoPurchaseOrderLineScalarFieldEnum = (typeof ZohoPurchaseOrderLineScalarFieldEnum)[keyof typeof ZohoPurchaseOrderLineScalarFieldEnum];
export declare const BcSalesOrderScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly branchCode: "branchCode";
    readonly snapshot: "snapshot";
    readonly snapshotDate: "snapshotDate";
    readonly bcCustomerNo: "bcCustomerNo";
    readonly customerId: "customerId";
    readonly extDocNo: "extDocNo";
    readonly extDocCore: "extDocCore";
    readonly location: "location";
    readonly docDate: "docDate";
    readonly amount: "amount";
    readonly amountInclVat: "amountInclVat";
    readonly prepaid: "prepaid";
    readonly remaining: "remaining";
    readonly paid: "paid";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcSalesOrderScalarFieldEnum = (typeof BcSalesOrderScalarFieldEnum)[keyof typeof BcSalesOrderScalarFieldEnum];
export declare const BcTrackingEntryScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly snapshot: "snapshot";
    readonly entryNo: "entryNo";
    readonly itemNo: "itemNo";
    readonly locationCode: "locationCode";
    readonly serialNo: "serialNo";
    readonly serialNorm: "serialNorm";
    readonly lotNo: "lotNo";
    readonly remainingQuantity: "remainingQuantity";
    readonly postingDate: "postingDate";
    readonly documentNo: "documentNo";
    readonly entryType: "entryType";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcTrackingEntryScalarFieldEnum = (typeof BcTrackingEntryScalarFieldEnum)[keyof typeof BcTrackingEntryScalarFieldEnum];
export declare const EntityLinkScalarFieldEnum: {
    readonly id: "id";
    readonly linkType: "linkType";
    readonly fromTable: "fromTable";
    readonly fromKey: "fromKey";
    readonly toTable: "toTable";
    readonly toKey: "toKey";
    readonly method: "method";
    readonly confidence: "confidence";
    readonly status: "status";
    readonly note: "note";
    readonly confirmedBy: "confirmedBy";
    readonly confirmedAt: "confirmedAt";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EntityLinkScalarFieldEnum = (typeof EntityLinkScalarFieldEnum)[keyof typeof EntityLinkScalarFieldEnum];
export declare const BcShipmentScalarFieldEnum: {
    readonly id: "id";
    readonly no: "no";
    readonly customerNo: "customerNo";
    readonly customerId: "customerId";
    readonly documentDate: "documentDate";
    readonly postingDate: "postingDate";
    readonly externalDocNo: "externalDocNo";
    readonly locationCode: "locationCode";
    readonly tradeId: "tradeId";
    readonly zohoInvoiceId: "zohoInvoiceId";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcShipmentScalarFieldEnum = (typeof BcShipmentScalarFieldEnum)[keyof typeof BcShipmentScalarFieldEnum];
export declare const BcShipmentLineScalarFieldEnum: {
    readonly id: "id";
    readonly sourceKey: "sourceKey";
    readonly documentNo: "documentNo";
    readonly lineNo: "lineNo";
    readonly customerNo: "customerNo";
    readonly itemNo: "itemNo";
    readonly description: "description";
    readonly locationCode: "locationCode";
    readonly quantity: "quantity";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcShipmentLineScalarFieldEnum = (typeof BcShipmentLineScalarFieldEnum)[keyof typeof BcShipmentLineScalarFieldEnum];
export declare const BcReceiptScalarFieldEnum: {
    readonly id: "id";
    readonly no: "no";
    readonly vendorNo: "vendorNo";
    readonly sellerId: "sellerId";
    readonly documentDate: "documentDate";
    readonly locationCode: "locationCode";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcReceiptScalarFieldEnum = (typeof BcReceiptScalarFieldEnum)[keyof typeof BcReceiptScalarFieldEnum];
export declare const BcLedgerEntryScalarFieldEnum: {
    readonly id: "id";
    readonly entryNo: "entryNo";
    readonly postingDate: "postingDate";
    readonly entryType: "entryType";
    readonly documentType: "documentType";
    readonly documentNo: "documentNo";
    readonly itemNo: "itemNo";
    readonly locationCode: "locationCode";
    readonly quantity: "quantity";
    readonly remainingQuantity: "remainingQuantity";
    readonly salesAmount: "salesAmount";
    readonly costAmount: "costAmount";
    readonly open: "open";
    readonly serialNo: "serialNo";
    readonly serialKey: "serialKey";
    readonly sourceType: "sourceType";
    readonly sourceNo: "sourceNo";
    readonly missingFromImport: "missingFromImport";
    readonly importBatchId: "importBatchId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BcLedgerEntryScalarFieldEnum = (typeof BcLedgerEntryScalarFieldEnum)[keyof typeof BcLedgerEntryScalarFieldEnum];
export declare const ItemScalarFieldEnum: {
    readonly id: "id";
    readonly serial: "serial";
    readonly serialKey: "serialKey";
    readonly bcItemNo: "bcItemNo";
    readonly productId: "productId";
    readonly status: "status";
    readonly locationCode: "locationCode";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ItemScalarFieldEnum = (typeof ItemScalarFieldEnum)[keyof typeof ItemScalarFieldEnum];
export declare const ItemEventScalarFieldEnum: {
    readonly id: "id";
    readonly itemId: "itemId";
    readonly kind: "kind";
    readonly date: "date";
    readonly source: "source";
    readonly sourceRef: "sourceRef";
    readonly sourceKey: "sourceKey";
    readonly locationCode: "locationCode";
    readonly partyNo: "partyNo";
    readonly customerId: "customerId";
    readonly tradeId: "tradeId";
    readonly quantity: "quantity";
    readonly amount: "amount";
    readonly createdAt: "createdAt";
};
export type ItemEventScalarFieldEnum = (typeof ItemEventScalarFieldEnum)[keyof typeof ItemEventScalarFieldEnum];
export declare const LiveStockBranchScalarFieldEnum: {
    readonly code: "code";
    readonly name: "name";
    readonly branchId: "branchId";
    readonly cutoverDate: "cutoverDate";
    readonly createdAt: "createdAt";
};
export type LiveStockBranchScalarFieldEnum = (typeof LiveStockBranchScalarFieldEnum)[keyof typeof LiveStockBranchScalarFieldEnum];
export declare const LiveStockLineScalarFieldEnum: {
    readonly id: "id";
    readonly branchCode: "branchCode";
    readonly metal: "metal";
    readonly kind: "kind";
    readonly family: "family";
    readonly variant: "variant";
    readonly refinery: "refinery";
    readonly qty: "qty";
    readonly lowThreshold: "lowThreshold";
    readonly unassigned: "unassigned";
    readonly details: "details";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LiveStockLineScalarFieldEnum = (typeof LiveStockLineScalarFieldEnum)[keyof typeof LiveStockLineScalarFieldEnum];
export declare const LiveStockBarScalarFieldEnum: {
    readonly id: "id";
    readonly lineId: "lineId";
    readonly serial: "serial";
    readonly serialKey: "serialKey";
    readonly grams: "grams";
    readonly details: "details";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LiveStockBarScalarFieldEnum = (typeof LiveStockBarScalarFieldEnum)[keyof typeof LiveStockBarScalarFieldEnum];
export declare const LiveStockMovementScalarFieldEnum: {
    readonly id: "id";
    readonly lineId: "lineId";
    readonly delta: "delta";
    readonly qtyAfter: "qtyAfter";
    readonly source: "source";
    readonly reference: "reference";
    readonly reason: "reason";
    readonly note: "note";
    readonly actor: "actor";
    readonly at: "at";
    readonly reversesId: "reversesId";
};
export type LiveStockMovementScalarFieldEnum = (typeof LiveStockMovementScalarFieldEnum)[keyof typeof LiveStockMovementScalarFieldEnum];
export declare const SheetApplicationScalarFieldEnum: {
    readonly id: "id";
    readonly referenceKey: "referenceKey";
    readonly occurrence: "occurrence";
    readonly kind: "kind";
    readonly branchCode: "branchCode";
    readonly lineId: "lineId";
    readonly rowDate: "rowDate";
    readonly rowQty: "rowQty";
    readonly appliedQty: "appliedQty";
    readonly status: "status";
    readonly note: "note";
    readonly reason: "reason";
    readonly decidedBy: "decidedBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SheetApplicationScalarFieldEnum = (typeof SheetApplicationScalarFieldEnum)[keyof typeof SheetApplicationScalarFieldEnum];
export declare const RolePermissionScalarFieldEnum: {
    readonly role: "role";
    readonly key: "key";
    readonly updatedAt: "updatedAt";
};
export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum];
export declare const UserPermissionOverrideScalarFieldEnum: {
    readonly userId: "userId";
    readonly key: "key";
    readonly granted: "granted";
    readonly expiresAt: "expiresAt";
    readonly reason: "reason";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type UserPermissionOverrideScalarFieldEnum = (typeof UserPermissionOverrideScalarFieldEnum)[keyof typeof UserPermissionOverrideScalarFieldEnum];
export declare const ProductPriceSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly day: "day";
    readonly productId: "productId";
    readonly metalType: "metalType";
    readonly spotEur: "spotEur";
    readonly spreadSell: "spreadSell";
    readonly spreadBuy: "spreadBuy";
    readonly sellPriceEur: "sellPriceEur";
    readonly buyPriceEur: "buyPriceEur";
    readonly createdAt: "createdAt";
};
export type ProductPriceSnapshotScalarFieldEnum = (typeof ProductPriceSnapshotScalarFieldEnum)[keyof typeof ProductPriceSnapshotScalarFieldEnum];
export declare const AiFeedbackScalarFieldEnum: {
    readonly id: "id";
    readonly questionId: "questionId";
    readonly userId: "userId";
    readonly helpful: "helpful";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AiFeedbackScalarFieldEnum = (typeof AiFeedbackScalarFieldEnum)[keyof typeof AiFeedbackScalarFieldEnum];
export declare const UserPreferenceScalarFieldEnum: {
    readonly userId: "userId";
    readonly data: "data";
    readonly updatedAt: "updatedAt";
};
export type UserPreferenceScalarFieldEnum = (typeof UserPreferenceScalarFieldEnum)[keyof typeof UserPreferenceScalarFieldEnum];
export declare const CompanySettingScalarFieldEnum: {
    readonly key: "key";
    readonly value: "value";
    readonly updatedBy: "updatedBy";
    readonly updatedAt: "updatedAt";
};
export type CompanySettingScalarFieldEnum = (typeof CompanySettingScalarFieldEnum)[keyof typeof CompanySettingScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly kind: "kind";
    readonly title: "title";
    readonly body: "body";
    readonly link: "link";
    readonly createdAt: "createdAt";
    readonly readAt: "readAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumMetalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MetalType'>;
export type ListEnumMetalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MetalType[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumProductCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductCategory'>;
export type ListEnumProductCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductCategory[]'>;
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>;
export type EnumBranchRegionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BranchRegion'>;
export type ListEnumBranchRegionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BranchRegion[]'>;
export type EnumCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Currency'>;
export type ListEnumCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Currency[]'>;
export type EnumFetchTriggerFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FetchTrigger'>;
export type ListEnumFetchTriggerFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FetchTrigger[]'>;
export type EnumKbCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbCategory'>;
export type ListEnumKbCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbCategory[]'>;
export type EnumKbJurisdictionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbJurisdiction'>;
export type ListEnumKbJurisdictionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbJurisdiction[]'>;
export type EnumKbStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbStatus'>;
export type ListEnumKbStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbStatus[]'>;
export type EnumKbVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbVisibility'>;
export type ListEnumKbVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KbVisibility[]'>;
export type EnumStocktakeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StocktakeStatus'>;
export type ListEnumStocktakeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StocktakeStatus[]'>;
export type EnumSerialsCheckedFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SerialsChecked'>;
export type ListEnumSerialsCheckedFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SerialsChecked[]'>;
export type EnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscrepancyIssueType'>;
export type ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscrepancyIssueType[]'>;
export type EnumStockMetalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMetal'>;
export type ListEnumStockMetalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMetal[]'>;
export type EnumBarStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BarStatus'>;
export type ListEnumBarStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BarStatus[]'>;
export type EnumCustomerOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CustomerOrderStatus'>;
export type ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CustomerOrderStatus[]'>;
export type EnumEvidenceKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceKind'>;
export type ListEnumEvidenceKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceKind[]'>;
export type EnumCptyKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CptyKind'>;
export type ListEnumCptyKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CptyKind[]'>;
export type EnumTradeStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeState'>;
export type ListEnumTradeStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeState[]'>;
export type EnumCollectedSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CollectedSource'>;
export type ListEnumCollectedSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CollectedSource[]'>;
export type EnumOrderSystemFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderSystem'>;
export type ListEnumOrderSystemFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderSystem[]'>;
export type EnumAliasDeciderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AliasDecider'>;
export type ListEnumAliasDeciderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AliasDecider[]'>;
export type EnumMatchConfidenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchConfidence'>;
export type ListEnumMatchConfidenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchConfidence[]'>;
export type EnumProductRuleKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductRuleKind'>;
export type ListEnumProductRuleKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductRuleKind[]'>;
export type EnumOrderStepFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStep'>;
export type ListEnumOrderStepFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStep[]'>;
export type EnumTaskCheckFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskCheck'>;
export type ListEnumTaskCheckFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskCheck[]'>;
export type EnumSheetTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SheetTaskStatus'>;
export type ListEnumSheetTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SheetTaskStatus[]'>;
export type EnumTaskClosedViaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskClosedVia'>;
export type ListEnumTaskClosedViaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskClosedVia[]'>;
export type EnumQuoteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuoteStatus'>;
export type ListEnumQuoteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuoteStatus[]'>;
export type EnumCollectedFlagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CollectedFlag'>;
export type ListEnumCollectedFlagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CollectedFlag[]'>;
export type EnumLinkConfidenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkConfidence'>;
export type ListEnumLinkConfidenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkConfidence[]'>;
export type EnumLinkStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkStatus'>;
export type ListEnumLinkStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkStatus[]'>;
export type EnumItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemStatus'>;
export type ListEnumItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemStatus[]'>;
export type EnumItemEventKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemEventKind'>;
export type ListEnumItemEventKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemEventKind[]'>;
export type EnumItemEventSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemEventSource'>;
export type ListEnumItemEventSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemEventSource[]'>;
export type EnumLiveStockKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveStockKind'>;
export type ListEnumLiveStockKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveStockKind[]'>;
export type EnumLiveBarStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveBarStatus'>;
export type ListEnumLiveBarStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveBarStatus[]'>;
export type EnumLiveMovementSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveMovementSource'>;
export type ListEnumLiveMovementSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveMovementSource[]'>;
export type EnumSheetApplicationKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SheetApplicationKind'>;
export type ListEnumSheetApplicationKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SheetApplicationKind[]'>;
export type EnumSheetApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SheetApplicationStatus'>;
export type ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SheetApplicationStatus[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    product?: Prisma.ProductOmit;
    metalSpotPrice?: Prisma.MetalSpotPriceOmit;
    historicSpotPrice?: Prisma.HistoricSpotPriceOmit;
    branch?: Prisma.BranchOmit;
    fetchAttempt?: Prisma.FetchAttemptOmit;
    kbDocument?: Prisma.KbDocumentOmit;
    aiQuestionLog?: Prisma.AiQuestionLogOmit;
    aiAnswerCache?: Prisma.AiAnswerCacheOmit;
    marketModeState?: Prisma.MarketModeStateOmit;
    roadmapDocument?: Prisma.RoadmapDocumentOmit;
    roadmapSyncState?: Prisma.RoadmapSyncStateOmit;
    roadmapSnapshot?: Prisma.RoadmapSnapshotOmit;
    roadmapInbox?: Prisma.RoadmapInboxOmit;
    auditLog?: Prisma.AuditLogOmit;
    bcItem?: Prisma.BcItemOmit;
    stocktake?: Prisma.StocktakeOmit;
    stocktakeLine?: Prisma.StocktakeLineOmit;
    stocktakeDiscrepancy?: Prisma.StocktakeDiscrepancyOmit;
    stocktakeBar?: Prisma.StocktakeBarOmit;
    stocktakeCoin?: Prisma.StocktakeCoinOmit;
    customerOrderItem?: Prisma.CustomerOrderItemOmit;
    customerOrderEvidence?: Prisma.CustomerOrderEvidenceOmit;
    importBatch?: Prisma.ImportBatchOmit;
    trade?: Prisma.TradeOmit;
    purchaseLot?: Prisma.PurchaseLotOmit;
    stockUnit?: Prisma.StockUnitOmit;
    productAlias?: Prisma.ProductAliasOmit;
    productRule?: Prisma.ProductRuleOmit;
    zohoProduct?: Prisma.ZohoProductOmit;
    orderEvent?: Prisma.OrderEventOmit;
    sheetTask?: Prisma.SheetTaskOmit;
    handover?: Prisma.HandoverOmit;
    customer?: Prisma.CustomerOmit;
    vendor?: Prisma.VendorOmit;
    supplierInvoice?: Prisma.SupplierInvoiceOmit;
    salesProduct?: Prisma.SalesProductOmit;
    refineryAlias?: Prisma.RefineryAliasOmit;
    quote?: Prisma.QuoteOmit;
    zohoInvoice?: Prisma.ZohoInvoiceOmit;
    zohoInvoiceLine?: Prisma.ZohoInvoiceLineOmit;
    lineSerial?: Prisma.LineSerialOmit;
    zohoPayment?: Prisma.ZohoPaymentOmit;
    zohoPurchaseOrderLine?: Prisma.ZohoPurchaseOrderLineOmit;
    bcSalesOrder?: Prisma.BcSalesOrderOmit;
    bcTrackingEntry?: Prisma.BcTrackingEntryOmit;
    entityLink?: Prisma.EntityLinkOmit;
    bcShipment?: Prisma.BcShipmentOmit;
    bcShipmentLine?: Prisma.BcShipmentLineOmit;
    bcReceipt?: Prisma.BcReceiptOmit;
    bcLedgerEntry?: Prisma.BcLedgerEntryOmit;
    item?: Prisma.ItemOmit;
    itemEvent?: Prisma.ItemEventOmit;
    liveStockBranch?: Prisma.LiveStockBranchOmit;
    liveStockLine?: Prisma.LiveStockLineOmit;
    liveStockBar?: Prisma.LiveStockBarOmit;
    liveStockMovement?: Prisma.LiveStockMovementOmit;
    sheetApplication?: Prisma.SheetApplicationOmit;
    rolePermission?: Prisma.RolePermissionOmit;
    userPermissionOverride?: Prisma.UserPermissionOverrideOmit;
    productPriceSnapshot?: Prisma.ProductPriceSnapshotOmit;
    aiFeedback?: Prisma.AiFeedbackOmit;
    userPreference?: Prisma.UserPreferenceOmit;
    companySetting?: Prisma.CompanySettingOmit;
    notification?: Prisma.NotificationOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map