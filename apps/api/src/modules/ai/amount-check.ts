/**
 * The guard behind "the model never makes up a price": every euro amount in a
 * reply must be a figure the assistant was actually given — by a price lookup,
 * by the question itself, or by the procedures. Anything else (a hallucinated
 * price, a total the model worked out itself) is reported so the staff member
 * checks it before it reaches a customer.
 */

const NUMBER = String.raw`\d[\d.,]*\d|\d`;
const MONEY = new RegExp(
    String.raw`(?:€|EUR\b)\s?(${NUMBER})|(${NUMBER})\s?(?:€|EUR\b|euros?\b)`,
    'gi',
);

/** "10,120", "10.120", "10,120.50", "10.120,50" and "10,5" all read as the number they mean. */
export function parseAmount(raw: string): number {
    const lastDot = raw.lastIndexOf('.');
    const lastComma = raw.lastIndexOf(',');

    if (lastDot >= 0 && lastComma >= 0) {
        // Both present: whichever comes last is the decimal point.
        const decimal = lastDot > lastComma ? '.' : ',';
        const thousands = decimal === '.' ? /,/g : /\./g;
        return Number(raw.replace(thousands, '').replace(decimal, '.'));
    }
    const only = lastDot >= 0 ? '.' : lastComma >= 0 ? ',' : null;
    if (!only) return Number(raw);

    const parts = raw.split(only);
    const groupsOfThree =
        parts.length > 1 && parts.slice(1).every((p) => p.length === 3);
    return groupsOfThree
        ? Number(parts.join(''))
        : Number(`${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`);
}

/** Every number in a piece of text. */
export function numbersIn(text: string): Set<number> {
    const numbers = new Set<number>();
    for (const match of text.matchAll(new RegExp(NUMBER, 'g'))) {
        const value = parseAmount(match[0]);
        if (Number.isFinite(value)) numbers.add(value);
    }
    return numbers;
}

/** The euro amounts in `text` (as written) that are not among `allowed`. */
export function findUnverifiedAmounts(
    text: string,
    allowed: ReadonlySet<number>,
): string[] {
    const known = [...allowed];
    const unverified: string[] = [];

    for (const match of text.matchAll(MONEY)) {
        const written = match[0].trim();
        const value = parseAmount(match[1] ?? match[2]);
        if (!Number.isFinite(value)) continue;
        if (known.some((n) => Math.abs(n - value) < 0.005)) continue;
        if (!unverified.includes(written)) unverified.push(written);
    }
    return unverified;
}
