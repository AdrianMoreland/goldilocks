import { cn } from "@/lib/utils"
import { gaugeOf, type GridGroup, type GridRow } from "./live-stock-model"
import { LEVEL_BAR, LEVEL_CELL } from "./level-style"

/**
 * Every line against every branch, to see at a glance where stock is short and where it can come from. Each cell is
 * shaded by its level (green fine, amber at or under the low mark, plain at none). On a wide screen it is a table that
 * scrolls sideways inside its own box (the line names stay put); on a narrow one each line is a card with a small bar
 * per branch. Tapping a count opens that branch.
 */
export function AllBranchesGrid({ groups, branches, onOpen }: { groups: GridGroup[]; branches: { code: string; name: string }[]; onOpen: (code: string) => void }) {
    const cols = branches.length + 2
    return (
        <div className="@container/grid space-y-[8px]">
            <Legend />
            <div className="bg-card hidden overflow-x-auto rounded-lg border @min-[640px]/grid:block" role="region" aria-label="Stock by branch" tabIndex={0}>
                <table className="w-full min-w-[520px] border-collapse text-[14px] tabular-nums">
                    <thead>
                        <tr className="bg-muted text-muted-foreground text-[12px]">
                            <th scope="col" className="bg-muted sticky left-0 z-[1] border-b px-[12px] py-[10px] text-left font-semibold">
                                Line
                            </th>
                            {branches.map((b) => (
                                <th key={b.code} scope="col" className="border-b border-l px-[12px] py-[10px] text-center font-semibold whitespace-nowrap">
                                    {b.name}
                                </th>
                            ))}
                            <th scope="col" className="border-b border-l px-[12px] py-[10px] text-right font-semibold">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((g) => [
                            <tr key={g.kind}>
                                <th scope="colgroup" colSpan={cols} className="bg-muted/60 text-muted-foreground border-b px-[12px] py-[6px] text-left text-[12px] font-bold tracking-wide uppercase">
                                    {g.kind === "BAR" ? "Bars" : "Coins"}
                                </th>
                            </tr>,
                            ...g.rows.map((r) => (
                                <tr key={r.key}>
                                    <th scope="row" className="bg-card sticky left-0 z-[1] border-b px-[12px] py-[4px] text-left font-medium whitespace-nowrap">
                                        {r.label}
                                    </th>
                                    {branches.map((b) => {
                                        const c = r.cells[b.code]
                                        const qty = c?.qty ?? 0
                                        const level = c?.level ?? "zero"
                                        return (
                                            <td key={b.code} className={cn("border-b border-l p-0 text-center", LEVEL_CELL[level])}>
                                                <button
                                                    type="button"
                                                    onClick={() => onOpen(b.code)}
                                                    aria-label={`${r.label} at ${b.name}: ${qty}${level === "low" ? ", low" : ""}. Open ${b.name}`}
                                                    className="hover:bg-foreground/5 h-[44px] w-full min-w-[64px] px-[8px]"
                                                >
                                                    {qty}
                                                </button>
                                            </td>
                                        )
                                    })}
                                    <td className="border-b border-l px-[12px] py-[4px] text-right font-bold">{r.total}</td>
                                </tr>
                            )),
                        ])}
                    </tbody>
                </table>
            </div>
            <div className="space-y-[14px] @min-[640px]/grid:hidden">
                {groups.map((g) => (
                    <section key={g.kind} aria-label={g.kind === "BAR" ? "Bars" : "Coins"} className="space-y-[8px]">
                        <h3 className="text-muted-foreground text-[12px] font-bold tracking-wider uppercase">{g.kind === "BAR" ? "Bars" : "Coins"}</h3>
                        {g.rows.map((r) => (
                            <LineCard key={r.key} row={r} branches={branches} onOpen={onOpen} />
                        ))}
                    </section>
                ))}
            </div>
            <p className="text-muted-foreground text-[13px]">Lines with none anywhere are left out. Tap a count to open that branch.</p>
        </div>
    )
}

/** One line on a phone: its total, then a small level bar per branch. */
function LineCard({ row, branches, onOpen }: { row: GridRow; branches: { code: string; name: string }[]; onOpen: (code: string) => void }) {
    return (
        <div className="bg-card rounded-xl border p-[12px]">
            <div className="flex items-baseline justify-between gap-[8px]">
                <b className="min-w-0 truncate text-[15px]">{row.label}</b>
                <b className="text-[17px] tabular-nums">{row.total}</b>
            </div>
            <div className="mt-[8px] grid grid-cols-2 gap-[6px] min-[380px]:grid-cols-4">
                {branches.map((b) => {
                    const c = row.cells[b.code]
                    const qty = c?.qty ?? 0
                    const level = c?.level ?? "zero"
                    // Without a mark per cell here, the bar shows the branch's share of the line's total.
                    const { fill } = gaugeOf(qty, null)
                    const share = row.total ? (qty / row.total) * 100 : 0
                    return (
                        <button
                            key={b.code}
                            type="button"
                            onClick={() => onOpen(b.code)}
                            aria-label={`${row.label} at ${b.name}: ${qty}${level === "low" ? ", low" : ""}. Open ${b.name}`}
                            className={cn("hover:bg-muted/60 min-h-[48px] rounded-lg px-[8px] py-[6px] text-left", LEVEL_CELL[level])}
                        >
                            <span className="text-muted-foreground block truncate text-[11px] font-medium">{b.name}</span>
                            <b className="block text-[15px] tabular-nums">{qty}</b>
                            <span aria-hidden className="bg-muted mt-[3px] block h-[4px] overflow-hidden rounded-full">
                                <span className={cn("block h-full rounded-full", LEVEL_BAR[level])} style={{ width: `${fill ? Math.max(8, share) : 0}%` }} />
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function Legend() {
    const item = (cls: string, label: string) => (
        <span className="flex items-center gap-[6px]">
            <span aria-hidden className={cn("size-[12px] rounded-[3px] border", cls)} />
            {label}
        </span>
    )
    return (
        <div className="text-muted-foreground flex flex-wrap gap-x-[14px] gap-y-[4px] text-[12px]">
            {item("bg-emerald-500/25", "Fine")}
            {item("bg-amber-500/40", "At or under the low mark")}
            {item("bg-transparent", "None")}
        </div>
    )
}
