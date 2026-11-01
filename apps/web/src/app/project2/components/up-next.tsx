import { ChevronRight } from "lucide-react"
import type { RoadmapSection } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { upNext } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"

/** The few sections worth opening first, most urgent on top; picking one opens it below. Hidden when nothing is open. */
export function UpNext({ sections, selectedKey, onSelect }: { sections: RoadmapSection[]; selectedKey: string | undefined; onSelect: (key: string) => void }) {
    const items = upNext(sections, 5)
    if (items.length === 0) return null

    return (
        <section aria-label="Up next" className="bg-card rounded-xl border">
            <h2 className="px-4 pt-3 pb-1 text-sm font-medium">Up next</h2>
            <ul className="p-1.5">
                {items.map(({ section, done, total }) => (
                    <li key={section.key}>
                        <button
                            type="button"
                            onClick={() => onSelect(section.key)}
                            aria-current={section.key === selectedKey ? "true" : undefined}
                            className={cn("hover:bg-muted flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm", section.key === selectedKey && "bg-muted")}
                        >
                            {section.priority && <PriorityGlyph priority={section.priority} />}
                            <span className="text-muted-foreground w-9 shrink-0 font-mono text-xs tabular-nums">{section.id}</span>
                            <span className="min-w-0 flex-1 truncate">{section.title}</span>
                            <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">{total - done} open</span>
                            <ChevronRight className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}
