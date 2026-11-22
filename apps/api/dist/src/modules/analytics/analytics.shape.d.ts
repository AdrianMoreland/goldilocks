import type { FlowLink, HeatCell } from '@goldilocks/shared-types';
export declare const ORDER_STEPS: readonly ["ORDERED", "ARRIVED", "ALLOCATED", "MATCHED", "COLLECTED", "POSTED"];
export declare function fillHeat(rows: {
    dow: number;
    hour: number;
    n: number;
}[]): HeatCell[];
interface StepEvent {
    tradeId: number;
    step: string;
    at: Date;
}
export declare function stepTransitions(events: StepEvent[]): {
    stepHours: {
        from: string;
        to: string;
        hours: number;
        orders: number;
    }[];
    flow: FlowLink[];
};
export declare function waitingByStep(events: (StepEvent & {
    reference: string;
})[], now: Date): {
    step: string;
    orders: {
        reference: string;
        days: number;
    }[];
}[];
export {};
//# sourceMappingURL=analytics.shape.d.ts.map