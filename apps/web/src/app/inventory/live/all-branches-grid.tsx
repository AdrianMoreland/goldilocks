import { cn } from "@/lib/utils"
import type { GridGroup } from "./live-stock-model"
import { LEVEL_NUMBER } from "./level-style"

/**
 * Every line against every branch, to see at a glance where stock is short and where it can come from. It scrolls
 * sideways inside its own box (the line names stay put), so the page itself never scrolls sideways.
 */
export function AllBranchesGrid({ groups, branches, onOpen }: { groups: GridGroup[]; branches: { code: string; name: string }[]; onOpen: (code: string) => void }) {
    const cols = branches.length + 2
    return (
        <div className="space-y-[8px]">
            <div className="bg-card overflow-x-auto rounded-lg border" role="region" aria-label="Stock by branch" tabIndex={0}>
                <table className="w-full min-w-[520px] border-collapse text-[14px] tabular-nums">
                    <thead>
                        <tr className="bg-muted text-muted-foreground text-[12px]">
                            <th scope="col" className="bg-muted sticky left-0 z-[1] border-b px-[12px] py-[10px] text-left font-semibold">
                                Line
                            </th>
                            {branches.map((b) => (
                                <th key={b.code} scope="col" className="border-b px-[12px] py-[10px] text-right font-semibold whitespace-nowrap">
                                    {b.name}
                                </th>
                            ))}
                            <th scope="col" className="border-b px-[12px] py-[10px] text-right font-semibold">
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
                                            <td key={b.code} className="border-b px-[4px] py-[2px] text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => onOpen(b.code)}
                                                    aria-label={`${r.label} at ${b.name}: ${qty}${level === "low" ? ", low" : ""}. Open ${b.name}`}
                                                    className={cn("hover:bg-muted h-[40px] min-w-[48px] rounded-md px-[8px] text-right", LEVEL_NUMBER[level], level === "low" && "font-bold")}
                                                >
                                                    {qty}
                                                </button>
                                            </td>
                                        )
                                    })}
                                    <td className="border-b px-[12px] py-[4px] text-right font-bold">{r.total}</td>
                                </tr>
                            )),
                        ])}
                    </tbody>
                </table>
            </div>
            <p className="text-muted-foreground text-[13px]">
                Amber is at or under that line&apos;s low mark; grey is none. Lines with none anywhere are left out. Tap a number to open that branch.
            </p>
        </div>
    )
}
