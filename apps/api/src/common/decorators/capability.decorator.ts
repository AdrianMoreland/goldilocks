import { SetMetadata } from '@nestjs/common';
import type { Capabilities } from '@goldilocks/shared-types';

export const CAPABILITY_KEY = 'requiredCapability';

/** Boolean capabilities only - `knowledge` is a scope, filtered where the SOPs are listed. */
export type RequirableCapability = {
    [K in keyof Capabilities]: Capabilities[K] extends boolean ? K : never;
}[keyof Capabilities];

/**
 * Marks a route or whole controller as available only to branches that have the capability
 * (see branch-access.ts in shared-types). Enforced by CapabilityGuard on every request, so a UK
 * branch calling the API directly is refused no matter what the web app shows.
 */
export const RequiresCapability = (capability: RequirableCapability) =>
    SetMetadata(CAPABILITY_KEY, capability);
