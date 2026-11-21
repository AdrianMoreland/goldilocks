import type { FlowLink, HeatCell } from '@goldilocks/shared-types';

/** The order steps in the order they happen; POSTED is the end, so a posted order is no longer waiting. */
export const ORDER_STEPS = [
    'ORDERED',
    'ARRIVED',
    'ALLOCATED',
    'MATCHED',
    'COLLECTED',
    'POSTED',
] as const;
const DONE_STEP = 'POSTED';
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/** Postgres EXTRACT(DOW) is 0 = Sunday; the charts start the week on Monday. Missing cells become zero. */
export function fillHeat(
    rows: { dow: number; hour: number; n: number }[],
): HeatCell[] {
    const byKey = new Map(
        rows.map((r) => [`${(r.dow + 6) % 7}:${r.hour}`, r.n]),
    );
    const cells: HeatCell[] = [];
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

interface StepEvent {
    tradeId: number;
    step: string;
    at: Date;
}

function byTrade<T extends StepEvent>(events: T[]): Map<number, T[]> {
    const map = new Map<number, T[]>();
    for (const e of events) {
        const list = map.get(e.tradeId) ?? [];
        list.push(e);
        map.set(e.tradeId, list);
    }
    for (const list of map.values())
        list.sort((a, b) => a.at.getTime() - b.at.getTime());
    return map;
}

/** Average hours from one recorded step to the next, and how many orders took each link, in step order. */
export function stepTransitions(events: StepEvent[]): {
    stepHours: { from: string; to: string; hours: number; orders: number }[];
    flow: FlowLink[];
} {
    const links = new Map<
        string,
        { from: string; to: string; totalMs: number; orders: number }
    >();
    for (const list of byTrade(events).values()) {
        for (let i = 1; i < list.length; i++) {
            const a = list[i - 1];
            const b = list[i];
            if (a.step === b.step) continue;
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
    const rank = (s: string) =>
        ORDER_STEPS.indexOf(s as (typeof ORDER_STEPS)[number]);
    const sorted = [...links.values()].sort(
        (x, y) => rank(x.from) - rank(y.from) || rank(x.to) - rank(y.to),
    );
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

/** Unfinished orders grouped by the latest step they reached, longest wait first. */
export function waitingByStep(
    events: (StepEvent & { reference: string })[],
    now: Date,
): { step: string; orders: { reference: string; days: number }[] }[] {
    const groups = new Map<string, { reference: string; days: number }[]>();
    for (const list of byTrade(events).values()) {
        const last = list[list.length - 1];
        if (last.step === DONE_STEP) continue;
        const days = Math.floor((now.getTime() - last.at.getTime()) / DAY_MS);
        const group = groups.get(last.step) ?? [];
        group.push({ reference: last.reference, days });
        groups.set(last.step, group);
    }
    return ORDER_STEPS.filter((s) => groups.has(s)).map((step) => ({
        step,
        orders: groups.get(step)!.sort((a, b) => b.days - a.days),
    }));
}
