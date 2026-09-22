import { Keyboard } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ShortcutRow {
    keys: string
    label: string
}

const SHORTCUTS: ShortcutRow[] = [
    { keys: "/", label: "Focus search" },
    { keys: "↑ ↓", label: "Navigate rows" },
    { keys: "Enter / Space", label: "Select focused row" },
    { keys: "Esc", label: "Close dialog / clear search" },
    { keys: "t", label: "Toggle tools panel" },
    { keys: "g", label: "Toggle chart" },
]

const ADMIN_SHORTCUT: ShortcutRow = { keys: "a", label: "Admin panel" }

/**
 * Bottom-right shortcut hint — deliberately tiny and near-invisible until
 * hovered. Just enough to be discoverable, never loud enough to compete
 * with the actual pricing data.
 */
export function KeyboardShortcutsHint({ isAdmin }: { isAdmin: boolean }) {
    const rows = isAdmin ? [...SHORTCUTS, ADMIN_SHORTCUT] : SHORTCUTS

    return (
        <div className="pointer-events-none fixed bottom-2 right-2 z-40">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-label="Keyboard shortcuts"
                        className="pointer-events-auto flex size-6 cursor-help items-center justify-center rounded-full text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                    >
                        <Keyboard className="size-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                    <ul className="space-y-1">
                        {rows.map((row) => (
                            <li key={row.keys} className="flex items-center gap-2 text-xs">
                                <kbd className="rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1 font-mono text-[10px]">
                                    {row.keys}
                                </kbd>
                                <span>{row.label}</span>
                            </li>
                        ))}
                    </ul>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
