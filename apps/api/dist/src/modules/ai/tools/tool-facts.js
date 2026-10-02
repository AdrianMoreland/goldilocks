"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectFacts = collectFacts;
exports.describeSpotNote = describeSpotNote;
function collectFacts(results) {
    const facts = {
        numbers: [],
        mayBeOutOfDate: false,
        asOfIrishTime: null,
        usedCustomSpot: false,
        liveAsOfIrishTime: null,
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
            if (typeof record.eurPerTroyOunce === 'number' &&
                record.available !== false) {
                if (record.source === 'manual')
                    facts.usedCustomSpot = true;
                if (typeof record.asOfIrishTime === 'string' &&
                    facts.liveAsOfIrishTime === null) {
                    facts.liveAsOfIrishTime = record.asOfIrishTime;
                }
            }
            Object.values(record).forEach(visit);
        }
    };
    results.forEach(visit);
    return facts;
}
function describeSpotNote(facts) {
    if (facts.usedCustomSpot) {
        return {
            tone: 'custom',
            message: 'Custom Spot price used! Review before sending',
        };
    }
    if (facts.mayBeOutOfDate) {
        return {
            tone: 'stale',
            message: `The spot price may be out of date${facts.asOfIrishTime ? ` (taken ${facts.asOfIrishTime})` : ''}. Refresh prices or review them before sending`,
        };
    }
    if (facts.liveAsOfIrishTime) {
        return {
            tone: 'healthy',
            message: `The spot price seems healthy (taken ${facts.liveAsOfIrishTime})`,
        };
    }
    return null;
}
//# sourceMappingURL=tool-facts.js.map