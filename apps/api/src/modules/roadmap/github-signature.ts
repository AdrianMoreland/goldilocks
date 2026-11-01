import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Checks GitHub's `X-Hub-Signature-256` header (`sha256=<hex HMAC of the raw body>`) in constant time.
 * Anything missing or malformed is simply "not valid"; nothing here throws.
 */
export function isValidGithubSignature(
    secret: string | undefined,
    rawBody: Buffer | undefined,
    header: string | undefined,
): boolean {
    if (!secret || !rawBody || !header) return false;
    const expected = Buffer.from(
        `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`,
    );
    const given = Buffer.from(header);
    return given.length === expected.length && timingSafeEqual(given, expected);
}
