import { createHash, timingSafeEqual } from 'node:crypto';

/** Constant-time check of a shared token. An unset expected token never matches. */
export function isValidToken(
    expected: string | undefined,
    given: string | undefined,
): boolean {
    if (!expected || !given) return false;
    const a = createHash('sha256').update(expected).digest();
    const b = createHash('sha256').update(given).digest();
    return timingSafeEqual(a, b);
}
