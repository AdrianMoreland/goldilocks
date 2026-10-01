export interface ToolFacts {
    /** Every number a tool returned: the figures the assistant is allowed to quote. */
    numbers: number[];
    /** A price the assistant used may be out of date. */
    mayBeOutOfDate: boolean;
    /** When the (possibly out-of-date) spot was taken, for the warning. */
    asOfIrishTime: string | null;
}

/** Reads what the assistant was told by its lookups, out of their raw results. */
export function collectFacts(results: readonly unknown[]): ToolFacts {
    const facts: ToolFacts = {
        numbers: [],
        mayBeOutOfDate: false,
        asOfIrishTime: null,
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
            Object.values(record).forEach(visit);
        }
    };
    results.forEach(visit);
    return facts;
}
