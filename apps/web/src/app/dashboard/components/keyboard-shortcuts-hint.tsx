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
    { keys: "1 2 3 4", label: "Gold / Silver / Platinum / Palladium" },
    { keys: "p", label: "Flip Price ⇄ Buyback" },
    { keys: "q", label: "Jump to Trade quantity" },
    { keys: "Ctrl + Z", label: "Unfreeze all spots & clear selected rows" },
    { keys: "Esc", label: "Close dialog / clear search" },
    { keys: "t", label: "Toggle tools panel" },
    { keys: "g", label: "Toggle chart" },
]

const ADMIN_SHORTCUT: ShortcutRow = { keys: "a", label: "Admin panel" }

/**
 * Bottom-corner shortcut hint. Sits at rest as a clearly visible, hover-able
 * keyboard badge — big enough to notice without competing with the pricing
 * data — and lists every shortcut on hover or keyboard focus.
 */
export function KeyboardShortcutsHint({ isAdmin }: { isAdmin: boolean }) {
    const rows = isAdmin ? [...SHORTCUTS, ADMIN_SHORTCUT] : SHORTCUTS

    return (
        <div className="pointer-events-none fixed bottom-3 right-3 z-40">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-label="Keyboard shortcuts"
                        className="pointer-events-auto flex size-10 cursor-help items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:text-foreground"
                    >
                        <Keyboard className="size-5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                    <p className="mb-1.5 text-xs font-semibold">Keyboard shortcuts</p>
                    <ul className="space-y-1.5">
                        {rows.map((row) => (
                            <li key={row.keys} className="flex items-center gap-2 text-xs">
                                <kbd className="rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1.5 py-0.5 font-mono text-[11px]">
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
