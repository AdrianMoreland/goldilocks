/** "2026-09-30" → "30 Sep 2026". Parsed and printed in UTC so the day never shifts with the viewer's time zone. */
export function formatDay(day: string): string {
    return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-IE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
    return `${count} ${count === 1 ? singular : pluralForm}`;
}
