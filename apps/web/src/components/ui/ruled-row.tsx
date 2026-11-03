import * as React from "react"
import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface RuledRowProps {
    /** Usually a `StatusDot`. */
    leading?: React.ReactNode
    title: React.ReactNode
    /** A small second line under the title. */
    subtitle?: React.ReactNode
    /** Figures or a state word on the right. */
    trailing?: React.ReactNode
    /** Detail shown when the row is opened. Without it the row is plain and does not open. */
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
}

/** A list row separated from the next by a hairline, with an optional detail that opens inline. */
export function RuledRow({ leading, title, subtitle, trailing, children, open, defaultOpen, onOpenChange, className }: RuledRowProps) {
    const head = (
        <>
            {leading && <span className="flex shrink-0 items-center">{leading}</span>}
            <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium">{title}</span>
                {subtitle && <span className="text-muted-foreground block truncate text-xs">{subtitle}</span>}
            </span>
            {trailing && <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{trailing}</span>}
        </>
    )
    const rowClass = "flex w-full items-center gap-3 px-2 py-2.5"

    if (!children) return <div className={cn("border-b last:border-b-0", rowClass, className)}>{head}</div>

    return (
        <Collapsible open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} className={cn("group/row border-b last:border-b-0", className)}>
            <CollapsibleTrigger className={cn(rowClass, "hover:bg-muted focus-visible:ring-ring cursor-pointer rounded-md outline-none focus-visible:ring-2")}>
                {head}
                <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/row:rotate-90" aria-hidden />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-3 pl-7 text-sm">{children}</CollapsibleContent>
        </Collapsible>
    )
}
