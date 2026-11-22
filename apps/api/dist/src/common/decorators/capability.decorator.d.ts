import type { Capabilities } from '@goldilocks/shared-types';
export declare const CAPABILITY_KEY = "requiredCapability";
export type RequirableCapability = {
    [K in keyof Capabilities]: Capabilities[K] extends boolean ? K : never;
}[keyof Capabilities];
export declare const RequiresCapability: (capability: RequirableCapability) => import("@nestjs/common").CustomDecorator<string>;
//# sourceMappingURL=capability.decorator.d.ts.map