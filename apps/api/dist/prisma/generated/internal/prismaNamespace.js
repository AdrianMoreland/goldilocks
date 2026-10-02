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
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.RoadmapDocumentScalarFieldEnum = exports.MarketModeStateScalarFieldEnum = exports.AiAnswerCacheScalarFieldEnum = exports.AiQuestionLogScalarFieldEnum = exports.KbDocumentScalarFieldEnum = exports.FetchAttemptScalarFieldEnum = exports.BranchScalarFieldEnum = exports.HistoricSpotPriceScalarFieldEnum = exports.MetalSpotPriceScalarFieldEnum = exports.ProductScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
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
    RoadmapDocument: 'RoadmapDocument'
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
    lastLoginAt: 'lastLoginAt'
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
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map