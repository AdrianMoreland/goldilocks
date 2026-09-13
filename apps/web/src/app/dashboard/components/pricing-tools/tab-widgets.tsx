import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Shared themed building blocks for the pricing-tools tabs — each tab wraps
 * its root in `style={tabThemeStyle(...)}` (see tab-theme.ts) and composes
 * these on top, so every tab gets the same pill/rounded-card language and
 * per-tab accent color the Apps Script tool used, without re-deriving it.
 */

export function FieldLabel({ children }: { children: ReactNode }) {
    return <div className="text-muted-foreground mb-1.5 text-[13px] font-semibold">{children}</div>
}

export function SectionLabel({ children }: { children: ReactNode }) {
    return <div className="text-[11px] font-bold tracking-wide text-[var(--tab-accent-text-soft)]">{children}</div>
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[var(--tab-accent-text-soft)]"
            style={{ background: "var(--tab-accent-soft)" }}
        >
            <AlertTriangle className="size-3.5 shrink-0" />
            <span>{message}</span>
        </div>
    )
}

export function ResultHighlight({ label, value }: { label: string; value: string }) {
    return (
        <div className="mt-1 flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ background: "var(--tab-accent-soft)" }}>
            <span className="text-[13px] font-semibold text-[var(--tab-accent-text-soft)]">{label}</span>
            <span className="text-xl font-extrabold text-[var(--tab-accent-text)]">{value}</span>
        </div>
    )
}

/** A pill-shaped sub-tab row — replaces the square shadcn ToggleGroup with the rounded, accent-filled selector the Apps Script tool used for its tab/subtab rows. */
export function SubtabRow<T extends string>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[]
    value: T
    onChange: (value: T) => void
}) {
    return (
        <div className="bg-muted flex items-center gap-1 rounded-full p-1">
            {options.map((opt) => {
                const active = opt.value === value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        aria-pressed={active}
                        className={cn(
                            "flex-1 cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors",
                            active ? "text-white" : "text-muted-foreground hover:text-foreground",
                        )}
                        style={active ? { background: "var(--tab-accent)" } : undefined}
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}
