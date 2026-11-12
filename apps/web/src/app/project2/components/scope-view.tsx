import { useSearchParams } from "react-router-dom"
import type { RoadmapScope } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { StatusDot } from "@/components/status-dot"
import { RoadmapMarkdown } from "../../project/components/roadmap-markdown"
import { scopeCounts } from "../scope-state"
import { ScopeBanner } from "./scope-banner"
import { ScopeItems } from "./scope-items"
import { ScopeQueue } from "./scope-queue"

const TABS = [
    { key: "now", label: "Now" },
    { key: "items", label: "Items" },
    { key: "decisions", label: "Decisions" },
    { key: "queue", label: "Queue" },
] as const

type TabKey = (typeof TABS)[number]["key"]

function Decisions({ decisions }: { decisions: RoadmapScope["view"]["decisions"] }) {
    const open = decisions.filter((d) => !d.settled)
    const settled = decisions.filter((d) => d.settled)
    return (
        <div className="flex flex-col gap-5">
            <section aria-label="Open decisions" className="flex flex-col gap-2">
                <h2 className="text-sm font-medium">Waiting on you</h2>
                {open.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No open decisions.</p>
                ) : (
                    <ul className="flex flex-col divide-y rounded-xl border">
                        {open.map((d) => (
                            <li key={d.id} className="flex items-start gap-3 px-4 py-3">
                                <StatusDot tone="warn" className="mt-2" />
                                <div className="min-w-0">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground mr-2 font-mono text-xs tabular-nums">{d.id}</span>
                                        {d.title}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        Until decided: {d.default ?? "no default"}
                                        {d.blocks ? ` · blocks ${d.blocks}` : ""}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <section aria-label="Settled decisions" className="flex flex-col gap-2">
                <h2 className="text-sm font-medium">Settled</h2>
                <ul className="flex flex-col divide-y rounded-xl border">
                    {settled.map((d) => (
                        <li key={d.id} className="px-4 py-3 text-sm break-words">
                            <span className="text-muted-foreground mr-2 font-mono text-xs tabular-nums">{d.id}</span>
                            {d.text}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

/**
 * The roadmap as read from the scope files (roadmap 1.20): what to do now, the open items, the decisions, and
 * the queue. The page is a view plus a queue; it never edits the files. The tab lives in the URL (?tab=items).
 */
export function ScopeView({ scope }: { scope: RoadmapScope }) {
    const [params, setParams] = useSearchParams()
    const tab: TabKey = TABS.find((t) => t.key === params.get("tab"))?.key ?? "now"
    const counts = scopeCounts(scope.view)
    const badge: Record<TabKey, number | null> = { now: null, items: counts.open, decisions: counts.decisions, queue: null }
    const select = (next: TabKey) =>
        setParams(
            (prev) => {
                const p = new URLSearchParams(prev)
                if (next === "now") p.delete("tab")
                else p.set("tab", next)
                return p
            },
            { replace: true },
        )

    return (
        <div className="flex flex-col gap-4">
            <ScopeBanner scope={scope} />

            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Goldilocks roadmap</h1>
                <p className="text-muted-foreground mt-1 max-w-prose text-sm">
                    Read from the scope files. Change them at a laptop; notes added here are queued and filed there.
                </p>
            </div>

            <div role="tablist" aria-label="Roadmap views" className="border-border -mb-1 flex gap-1 overflow-x-auto border-b">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={tab === key}
                        onClick={() => select(key)}
                        className={cn(
                            "-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                            tab === key ? "border-primary text-foreground" : "text-muted-foreground hover:text-foreground border-transparent",
                        )}
                    >
                        {label}
                        {badge[key] !== null && <span className="bg-muted rounded-full px-1.5 py-0.5 font-mono text-[11px] tabular-nums">{badge[key]}</span>}
                    </button>
                ))}
            </div>

            {scope.empty ? (
                <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-8 text-center text-sm">The scope files have not been pulled yet. Press Refresh above.</p>
            ) : (
                <>
                    {tab === "now" &&
                        (scope.view.now ? (
                            <article className="max-w-3xl">
                                <RoadmapMarkdown>{scope.view.now}</RoadmapMarkdown>
                            </article>
                        ) : (
                            <p className="text-muted-foreground text-sm">There is no NOW file in the roadmap repository yet.</p>
                        ))}
                    {tab === "items" && <ScopeItems items={scope.view.items} />}
                    {tab === "decisions" && <Decisions decisions={scope.view.decisions} />}
                </>
            )}
            {tab === "queue" && <ScopeQueue />}
        </div>
    )
}
