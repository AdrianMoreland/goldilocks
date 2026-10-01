"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectFacts = collectFacts;
function collectFacts(results) {
    const facts = {
        numbers: [],
        mayBeOutOfDate: false,
        asOfIrishTime: null,
    };
    const visit = (value) => {
        if (typeof value === 'number') {
            facts.numbers.push(value);
        }
        else if (Array.isArray(value)) {
            value.forEach(visit);
        }
        else if (value && typeof value === 'object') {
            const record = value;
            if (record.mayBeOutOfDate === true) {
                facts.mayBeOutOfDate = true;
                if (typeof record.asOfIrishTime === 'string') {
                    facts.asOfIrishTime = record.asOfIrishTime;
                }
            }
            Object.values(record).forEach(visit);
        }
    };
    results.forEach(visit);
    return facts;
}
//# sourceMappingURL=tool-facts.js.map