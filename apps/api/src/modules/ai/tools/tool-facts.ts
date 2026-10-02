export interface ToolFacts {
    /** Every number a tool returned: the figures the assistant is allowed to quote. */
    numbers: number[];
    /** A price the assistant used may be out of date. */
    mayBeOutOfDate: boolean;
    /** When the (possibly out-of-date) spot was taken, for the warning. */
    asOfIrishTime: string | null;
    /** A price used a spot the staff member froze or typed on the dashboard, not the live market. */
    usedCustomSpot: boolean;
    /** When the live spot was taken (Irish time) when a lookup priced from one; null when no lookup used a spot. */
    liveAsOfIrishTime: string | null;
}

/** Reads what the assistant was told by its lookups, out of their raw results. */
export function collectFacts(results: readonly unknown[]): ToolFacts {
    const facts: ToolFacts = {
        numbers: [],
        mayBeOutOfDate: false,
        asOfIrishTime: null,
        usedCustomSpot: false,
        liveAsOfIrishTime: null,
    };

    const visit = (value: unknown): void => {
        if (typeof value === 'number') {
            facts.numbers.push(value);
        } else if (Array.isArray(value)) {
            value.forEach(visit);
        } else if (value && typeof value === 'object') {
            const record = value as Record<string, unknown>;
            if (record.mayBeOutOfDate === true) {
                facts.mayBeOutOfDate = true;
                if (typeof record.asOfIrishTime === 'string') {
                    facts.asOfIrishTime = record.asOfIrishTime;
                }
            }
            if (
                typeof record.eurPerTroyOunce === 'number' &&
                record.available !== false
            ) {
                if (record.source === 'manual') facts.usedCustomSpot = true;
                if (
                    typeof record.asOfIrishTime === 'string' &&
                    facts.liveAsOfIrishTime === null
                ) {
                    facts.liveAsOfIrishTime = record.asOfIrishTime;
                }
            }
            Object.values(record).forEach(visit);
        }
    };
    results.forEach(visit);
    return facts;
}

/**
 * The note staff see beside a priced answer. A custom spot outranks staleness: once a person has typed or
 * frozen a number, how old the live feed is no longer matters. Null when no lookup priced from a spot.
 */
export function describeSpotNote(
    facts: ToolFacts,
): { tone: 'custom' | 'stale' | 'healthy'; message: string } | null {
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
