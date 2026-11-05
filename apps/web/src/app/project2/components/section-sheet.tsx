import type { RoadmapEdit, RoadmapSection } from "@goldilocks/shared-types"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ChecklistStrip } from "./section-card"
import { SectionBody, SectionHeading } from "./section-pane"

/** The drawer a board card or an "up next" row opens: the section's heading, its progress and its editable tasks, beside the page instead of replacing it. */
export function SectionSheet({
    section,
    hideDone,
    busy,
    onEdit,
    onClose,
}: {
    section: RoadmapSection | undefined
    hideDone: boolean
    busy: boolean
    onEdit: (edit: RoadmapEdit) => void
    onClose: () => void
}) {
    return (
        <Sheet open={section !== undefined} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
                {section && (
                    <>
                        <SheetHeader className="gap-3 border-b pr-12">
                            <SheetTitle className="sr-only">{section.title}</SheetTitle>
                            <SheetDescription className="sr-only">Tasks and notes for this section of the roadmap.</SheetDescription>
                            <SectionHeading section={section} />
                            <ChecklistStrip section={section} />
                        </SheetHeader>
                        <div className="p-4">
                            <SectionBody section={section} hideDone={hideDone} busy={busy} onEdit={onEdit} />
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
