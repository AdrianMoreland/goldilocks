"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAmount = parseAmount;
exports.numbersIn = numbersIn;
exports.findUnverifiedAmounts = findUnverifiedAmounts;
const NUMBER = String.raw `\d[\d.,]*\d|\d`;
const MONEY = new RegExp(String.raw `(?:€|EUR\b)\s?(${NUMBER})|(${NUMBER})\s?(?:€|EUR\b|euros?\b)`, 'gi');
function parseAmount(raw) {
    const lastDot = raw.lastIndexOf('.');
    const lastComma = raw.lastIndexOf(',');
    if (lastDot >= 0 && lastComma >= 0) {
        const decimal = lastDot > lastComma ? '.' : ',';
        const thousands = decimal === '.' ? /,/g : /\./g;
        return Number(raw.replace(thousands, '').replace(decimal, '.'));
    }
    const only = lastDot >= 0 ? '.' : lastComma >= 0 ? ',' : null;
    if (!only)
        return Number(raw);
    const parts = raw.split(only);
    const groupsOfThree = parts.length > 1 && parts.slice(1).every((p) => p.length === 3);
    return groupsOfThree
        ? Number(parts.join(''))
        : Number(`${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`);
}
function numbersIn(text) {
    const numbers = new Set();
    for (const match of text.matchAll(new RegExp(NUMBER, 'g'))) {
        const value = parseAmount(match[0]);
        if (Number.isFinite(value))
            numbers.add(value);
    }
    return numbers;
}
function findUnverifiedAmounts(text, allowed) {
    const known = [...allowed];
    const unverified = [];
    for (const match of text.matchAll(MONEY)) {
        const written = match[0].trim();
        const value = parseAmount(match[1] ?? match[2]);
        if (!Number.isFinite(value))
            continue;
        if (known.some((n) => Math.abs(n - value) < 0.005))
            continue;
        if (!unverified.includes(written))
            unverified.push(written);
    }
    return unverified;
}
//# sourceMappingURL=amount-check.js.map