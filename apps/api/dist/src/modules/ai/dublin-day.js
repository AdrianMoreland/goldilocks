"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dublinDate = dublinDate;
exports.startOfDublinDay = startOfDublinDay;
function dublinDate(at) {
    return at.toLocaleDateString('en-CA', { timeZone: 'Europe/Dublin' });
}
function startOfDublinDay(at) {
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
//# sourceMappingURL=dublin-day.js.map