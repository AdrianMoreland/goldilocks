export function getYesterday(): string {
    const date = new Date();

    date.setUTCDate(
        date.getUTCDate() - 1
    );

    return date.toISOString().slice(0, 10);
}