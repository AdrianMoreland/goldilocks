"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_STEPS = void 0;
exports.fillHeat = fillHeat;
exports.stepTransitions = stepTransitions;
exports.waitingByStep = waitingByStep;
exports.ORDER_STEPS = [
    'ORDERED',
    'ARRIVED',
    'ALLOCATED',
    'MATCHED',
    'COLLECTED',
    'POSTED',
];
const DONE_STEP = 'POSTED';
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
function fillHeat(rows) {
    const byKey = new Map(rows.map((r) => [`${(r.dow + 6) % 7}:${r.hour}`, r.n]));
    const cells = [];
    for (let weekday = 0; weekday < 7; weekday++) {
        for (let hour = 0; hour < 24; hour++) {
            cells.push({
                weekday,
                hour,
                value: byKey.get(`${weekday}:${hour}`) ?? 0,
            });
        }
    }
    return cells;
}
function byTrade(events) {
    const map = new Map();
    for (const e of events) {
        const list = map.get(e.tradeId) ?? [];
        list.push(e);
        map.set(e.tradeId, list);
    }
    for (const list of map.values())
        list.sort((a, b) => a.at.getTime() - b.at.getTime());
    return map;
}
function stepTransitions(events) {
    const links = new Map();
    for (const list of byTrade(events).values()) {
        for (let i = 1; i < list.length; i++) {
            const a = list[i - 1];
            const b = list[i];
            if (a.step === b.step)
                continue;
            const key = `${a.step}>${b.step}`;
            const link = links.get(key) ?? {
                from: a.step,
                to: b.step,
                totalMs: 0,
                orders: 0,
            };
            link.totalMs += b.at.getTime() - a.at.getTime();
            link.orders += 1;
            links.set(key, link);
        }
    }
    const rank = (s) => exports.ORDER_STEPS.indexOf(s);
    const sorted = [...links.values()].sort((x, y) => rank(x.from) - rank(y.from) || rank(x.to) - rank(y.to));
    return {
        stepHours: sorted.map((l) => ({
            from: l.from,
            to: l.to,
            hours: Math.round((l.totalMs / l.orders / HOUR_MS) * 10) / 10,
            orders: l.orders,
        })),
        flow: sorted.map((l) => ({ from: l.from, to: l.to, value: l.orders })),
    };
}
function waitingByStep(events, now) {
    const groups = new Map();
    for (const list of byTrade(events).values()) {
        const last = list[list.length - 1];
        if (last.step === DONE_STEP)
            continue;
        const days = Math.floor((now.getTime() - last.at.getTime()) / DAY_MS);
        const group = groups.get(last.step) ?? [];
        group.push({ reference: last.reference, days });
        groups.set(last.step, group);
    }
    return exports.ORDER_STEPS.filter((s) => groups.has(s)).map((step) => ({
        step,
        orders: groups.get(step).sort((a, b) => b.days - a.days),
    }));
}
//# sourceMappingURL=analytics.shape.js.map