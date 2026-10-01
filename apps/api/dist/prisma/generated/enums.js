"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KbStatus = exports.KbJurisdiction = exports.KbCategory = exports.Currency = exports.ProductCategory = exports.MetalType = exports.UserRole = exports.FetchTrigger = void 0;
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
exports.KbStatus = {
    draft: 'draft',
    approved: 'approved',
    retired: 'retired'
};
//# sourceMappingURL=enums.js.map