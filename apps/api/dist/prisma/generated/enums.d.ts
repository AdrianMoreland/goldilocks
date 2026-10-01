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
export declare const KbStatus: {
    readonly draft: "draft";
    readonly approved: "approved";
    readonly retired: "retired";
};
export type KbStatus = (typeof KbStatus)[keyof typeof KbStatus];
//# sourceMappingURL=enums.d.ts.map