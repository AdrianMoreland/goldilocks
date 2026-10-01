/**
 * "Today" for the assistant's allowances and spend limit is the Irish
 * business day, so they reset overnight in Dublin rather than at 1 a.m. or
 * 2 a.m. (UTC midnight).
 */
export function dublinDate(at: Date): string {
    return at.toLocaleDateString('en-CA', { timeZone: 'Europe/Dublin' });
}

/** The instant the current Irish day began — UTC midnight, or an hour earlier during summer time. */
export function startOfDublinDay(at: Date): Date {
    const today = dublinDate(at);
    const [year, month, day] = today.split('-').map(Number);
    const utcMidnight = Date.UTC(year, month - 1, day);

    for (const offsetHours of [1, 0]) {
        const candidate = new Date(utcMidnight - offsetHours * 3_600_000);
        const previous = new Date(candidate.getTime() - 1);
        if (dublinDate(candidate) === today && dublinDate(previous) !== today) {
            return candidate;
        }
    }
    return new Date(utcMidnight);
}
