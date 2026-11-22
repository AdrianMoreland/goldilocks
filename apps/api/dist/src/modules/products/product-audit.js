"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeProductChange = describeProductChange;
const TRACKED = [
    'sku',
    'name',
    'metalType',
    'weight',
    'spreadBuy',
    'spreadSell',
    'vatRate',
    'stock',
    'isActive',
    'category',
    'description',
];
function show(value) {
    return value === null || value === undefined || value === ''
        ? '(none)'
        : String(value);
}
function describeProductChange(before, after) {
    return TRACKED.filter((field) => before[field] !== after[field])
        .map((field) => `${field} ${show(before[field])} → ${show(after[field])}`)
        .join(', ');
}
//# sourceMappingURL=product-audit.js.map