import { ChevronRight } from "lucide-react"
import type { RoadmapSection } from "@goldilocks/shared-types"
import { Card, CardContent } from "@/components/ui/card"
import { upNext } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"

/** The few sections worth opening first, most urgent on top; picking one opens its drawer. Shows a quiet note when nothing is open. */
export function UpNext({ sections, onSelect }: { sections: RoadmapSection[]; onSelect: (key: string) => void }) {
    const items = upNext(sections, 5)

    return (
        <Card aria-label="Up next" className="gap-2 py-4">
            <CardContent className="flex flex-col gap-2 px-2">
                <h2 className="px-2 text-sm font-medium">Up next</h2>
                {items.length === 0 ? (
                    <p className="text-muted-foreground px-2 py-4 text-sm">Nothing with a priority is open.</p>
                ) : (
                    <ul>
                        {items.map(({ section, done, total }) => (
                            <li key={section.key}>
                                <button type="button" onClick={() => onSelect(section.key)} className="hover:bg-muted focus-visible:ring-ring flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm focus-visible:ring-2 focus-visible:outline-none">
                                    {section.priority && <PriorityGlyph priority={section.priority} />}
                                    <span className="text-muted-foreground w-9 shrink-0 font-mono text-xs tabular-nums">{section.id}</span>
                                    <span className="min-w-0 flex-1 truncate">{section.title}</span>
                                    <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">{total - done} open</span>
                                    <ChevronRight className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
