import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client/runtime/client").DbNullClass;
export declare const JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
export declare const AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
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
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
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
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client/runtime/client").DbNullClass;
    readonly JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
    readonly AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map