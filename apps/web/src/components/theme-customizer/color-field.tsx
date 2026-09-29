import * as React from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { contrastRatio, toHex } from "@/lib/color"
import { cn } from "@/lib/utils"

interface ColorFieldProps {
    label: string
    cssVar: string
    /** The colour currently in effect (override, else preset, else stylesheet). */
    value: string
    isOverridden: boolean
    onChange: (value: string) => void
    onReset: () => void
    /** When set, shows a live contrast ratio against this colour with a pass/fail against `minContrast`. */
    contrastWith?: { label: string; color: string; minContrast: number }
}

/**
 * One editable theme colour: swatch (native picker, which only speaks hex),
 * free-text field (any CSS colour — oklch, rgb…), a reset for this one
 * colour, and an optional live contrast check.
 */
export function ColorField({ label, cssVar, value, isOverridden, onChange, onReset, contrastWith }: ColorFieldProps) {
    const [draft, setDraft] = React.useState(value)
    React.useEffect(() => setDraft(value), [value])

    const hex = React.useMemo(() => toHex(value) ?? "#000000", [value])
    const ratio = React.useMemo(
        () => (contrastWith ? contrastRatio(value, contrastWith.color) : null),
        [value, contrastWith],
    )
    const passes = ratio !== null && contrastWith ? ratio >= contrastWith.minContrast : true
    const id = `theme-color-${cssVar.replace(/^--/, "")}`

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor={id} className="text-xs font-medium">{label}</Label>
                {ratio !== null && contrastWith && (
                    <span
                        className={cn("text-[11px] tabular-nums", passes ? "text-muted-foreground" : "text-destructive font-semibold")}
                        title={`Contrast against ${contrastWith.label} — needs ${contrastWith.minContrast}:1`}
                    >
                        {ratio.toFixed(1)}:1 on {contrastWith.label}
                        {!passes && " · too low"}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className="relative size-8 shrink-0 overflow-hidden rounded-md border" style={{ backgroundColor: value }}>
                    <input
                        type="color"
                        aria-label={`Pick ${label}`}
                        value={hex}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                </div>
                <Input
                    id={id}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => {
                        const next = draft.trim()
                        if (next && next !== value && CSS.supports("color", next)) onChange(next)
                        else setDraft(value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur()
                    }}
                    className="h-8 flex-1 font-mono text-xs"
                    spellCheck={false}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 cursor-pointer"
                    disabled={!isOverridden}
                    title={isOverridden ? "Reset to the theme's colour" : "Using the theme's colour"}
                    aria-label={`Reset ${label}`}
                    onClick={onReset}
                >
                    <RotateCcw className="size-3.5" />
                </Button>
            </div>
        </div>
    )
}
