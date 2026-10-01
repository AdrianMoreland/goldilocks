import { RecalculateOverridesSchema, type RecalculateOverrides } from '@goldilocks/shared-types';
import { userStateKey } from '@/hooks/use-user-preference.hook';

/**
 * The spot the product table is quoting from for this user, where they froze
 * or typed one (see usePricingWorkbook). Read straight from session storage
 * at the moment it is needed, because the dashboard writes it there and other
 * parts of the app hold no live copy. Anything unreadable or invalid counts as
 * "no overrides": the assistant then quotes from the live spot.
 */
export function readSpotOverrides(userId: string | undefined): RecalculateOverrides | undefined {
    try {
        const stored = sessionStorage.getItem(userStateKey(userId, 'spot-overrides'))
        if (!stored) return undefined
        const parsed = RecalculateOverridesSchema.safeParse(JSON.parse(stored))
        if (!parsed.success) return undefined
        return Object.keys(parsed.data).length > 0 ? parsed.data : undefined
    } catch {
        return undefined
    }
}
