import type { RoadmapSection } from "@goldilocks/shared-types"
import { StatusDot } from "@/components/status-dot"
import { boardColumns, type BoardColumn } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"
import { SectionTile } from "./section-card"

function ColumnHeading({ column }: { column: BoardColumn }) {
    return (
        <h3 className="flex items-center gap-2 px-1 text-sm font-medium">
            {column.key === "done" ? <StatusDot tone="ok" /> : column.key === "none" ? <StatusDot tone="muted" /> : <PriorityGlyph priority={column.key} />}
            {column.label}
            <span className="text-muted-foreground ml-auto font-mono text-xs tabular-nums">{column.items.length}</span>
        </h3>
    )
}

/** The board: a column per priority, then no priority, then done, with each section as a task card. Click a card to open its tasks in the drawer. */
export function BoardTab({ sections, onOpen }: { sections: RoadmapSection[]; onOpen: (key: string) => void }) {
    const columns = boardColumns(sections)

    return (
        <div className="-mx-1 overflow-x-auto px-1 pb-2">
            <div className="grid min-w-max auto-cols-[17rem] grid-flow-col items-start gap-3">
                {columns.map((column) => (
                    <section key={column.key} aria-label={column.label} className="bg-muted/40 flex flex-col gap-2.5 rounded-xl border p-2.5">
                        <ColumnHeading column={column} />
                        {column.items.length === 0 && <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-6 text-center text-xs">Nothing here.</p>}
                        {column.items.map(({ section }) => (
                            <SectionTile key={section.key} section={section} onOpen={() => onOpen(section.key)} />
                        ))}
                    </section>
                ))}
            </div>
        </div>
    )
}
