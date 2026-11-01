import { CheckCircle2, CircleDashed, Layers } from "lucide-react"
import type { RoadmapSection } from "@goldilocks/shared-types"
import { overviewTotals } from "../roadmap-state"
import { OpenWorkGauge } from "./open-work-gauge"
import { PriorityGlyph } from "./priority-glyph"
import { QuotaRings } from "./quota-rings"
import { RunList } from "./run-list"

function Tile({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
    return (
        <div className="bg-card hover:border-foreground/25 flex flex-col gap-2 rounded-2xl border p-4 shadow-xs/5 transition-colors">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                {icon}
                {label}
            </span>
            <span className="font-mono text-3xl font-medium tracking-tight tabular-nums">{value}</span>
        </div>
    )
}

/** The overview: four numbers, a ring per phase, the open-work gauge and the run list of what to do first. */
export function OverviewTab({ sections, onOpen, onGoBoard }: { sections: RoadmapSection[]; onOpen: (key: string) => void; onGoBoard: () => void }) {
    const totals = overviewTotals(sections)

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tile value={totals.tasksOpen} label="Tasks open" icon={<CircleDashed className="size-3.5" aria-hidden />} />
                <Tile value={totals.tasksDone} label="Tasks done" icon={<CheckCircle2 className="size-3.5" aria-hidden />} />
                <Tile value={totals.sectionsOpen} label="Sections open" icon={<Layers className="size-3.5" aria-hidden />} />
                <Tile value={totals.nowOpen} label="Open in Now" icon={<PriorityGlyph priority="P0" />} />
            </div>
            <QuotaRings sections={sections} />
            <div className="grid items-start gap-4 lg:grid-cols-2">
                <OpenWorkGauge sections={sections} onGoBoard={onGoBoard} />
                <RunList sections={sections} onOpen={onOpen} />
            </div>
        </div>
    )
}
