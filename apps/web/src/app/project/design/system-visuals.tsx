import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import type { Palette } from "./palette"

function Heading({ children, hint }: { children: string; hint?: string }) {
    return (
        <div className="mb-2">
            <h3 className="text-sm font-semibold">{children}</h3>
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
    )
}

const SAMPLE: Record<string, string> = {
    h1: "Pricing Workbook",
    h2: "Pricing Workbook",
    h3: "Pricing Workbook",
    h4: "Gold €2,948",
    large: "Spot prices are live",
    p: "Running text sits at sixteen pixels with a generous line height.",
    "table-head": "Price · Premium · Buyback",
    "table-item": "Britannia 1 oz  €2,949  3.8%  €2,861",
    small: "Single-line label",
    muted: "Panel subtitle and default size in the tools panel",
    "field-label": "Quantity",
    label: "Badge caption",
    "section-label": "TRADE TOOLS",
}

/** Every text style from the tokens, rendered at its real size so the scale can be judged by eye. */
export function TypographyVisuals({ typography }: { typography: Record<string, Record<string, string>> }) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Heading hint="One family (Inter) does every job. Hierarchy comes from weight and size, never a second typeface. Every price uses tabular numerals.">Type scale</Heading>
                <ul className="divide-y rounded-xl border">
                    {Object.entries(typography).map(([name, t]) => {
                        const style: CSSProperties = {
                            fontSize: t.fontSize,
                            fontWeight: Number(t.fontWeight),
                            lineHeight: t.lineHeight,
                            letterSpacing: t.letterSpacing,
                            fontFeatureSettings: t.fontFeature ? t.fontFeature.replace(/\\"/g, '"') : undefined,
                            textTransform: name === "section-label" ? "uppercase" : undefined,
                        }
                        return (
                            <li key={name} className="grid gap-2 px-4 py-3 md:grid-cols-[11rem_1fr] md:items-center">
                                <div>
                                    <p className="font-mono text-xs font-semibold">type-{name}</p>
                                    <p className="text-muted-foreground text-[11px] tabular-nums">
                                        {t.fontWeight} · {t.fontSize} / {t.lineHeight}
                                        {t.letterSpacing ? ` · ${t.letterSpacing}` : ""}
                                    </p>
                                </div>
                                <p style={style} className="min-w-0 truncate">
                                    {SAMPLE[name] ?? "The quick brown fox"}
                                </p>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div>
                <Heading hint="Tabular figures keep a price column aligned like a spreadsheet. Proportional digits in a price column are a bug.">Tabular figures</Heading>
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border p-3">
                        <p className="text-muted-foreground mb-1 text-xs font-semibold">Tabular (correct)</p>
                        <p className="text-base leading-6 tabular-nums">
                            €1,111
                            <br />
                            €2,949
                            <br />
                            €10,087
                        </p>
                    </div>
                    <div className="rounded-xl border p-3">
                        <p className="text-muted-foreground mb-1 text-xs font-semibold">Proportional (a bug)</p>
                        <p className="text-base leading-6" style={{ fontVariantNumeric: "proportional-nums" }}>
                            €1,111
                            <br />
                            €2,949
                            <br />
                            €10,087
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <Heading hint="Quoted prices are whole euros and round in the dealer's favour; precise figures keep cents.">Number formats</Heading>
                <ul className="divide-y rounded-xl border text-sm">
                    {[
                        ["Quoted prices", "formatPrice", "€2,949", "Price up, Buyback down"],
                        ["Spot, gold / platinum / palladium", "formatSpot", "€2,948", "whole euros"],
                        ["Spot, silver", "formatSpot", "€31.42", "keeps its cents"],
                        ["Precise figures (€/g, P/L)", "formatEuro", "€94.80", "two decimals"],
                    ].map(([what, fn, example, note]) => (
                        <li key={what} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2 md:grid-cols-[16rem_9rem_7rem_1fr]">
                            <span>{what}</span>
                            <code className="text-muted-foreground font-mono text-xs">{fn}</code>
                            <span className="font-semibold tabular-nums">{example}</span>
                            <span className="text-muted-foreground hidden text-xs md:inline">{note}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const remToPx = (value: string) => (value.endsWith("rem") ? parseFloat(value) * 16 : parseFloat(value))

/** Spacing tokens as bars (width = real size) and the viewport schematic that explains where space goes. */
export function LayoutVisuals({ spacing, palette }: { spacing: Record<string, string>; palette: Palette }) {
    const box = (label: string, extra?: CSSProperties, className?: string) => (
        <div key={label} className={cn("flex items-center justify-center rounded-md border text-[11px] font-medium", className)} style={{ background: palette.muted, borderColor: palette.border, color: palette.mutedFg, ...extra }}>
            {label}
        </div>
    )
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Heading hint="The page fills the viewport exactly (h-svh, overflow-hidden). Only the table body and the side panel scroll.">Viewport layout</Heading>
                <div className="rounded-xl border p-3" style={{ background: palette.bg, color: palette.fg, borderColor: palette.border }}>
                    <div className="mx-auto flex aspect-[16/9] max-w-3xl flex-col gap-1.5">
                        {box("Header: title · freshness · actions", { background: palette.card }, "h-8 shrink-0")}
                        <div className="flex min-h-0 flex-1 gap-1.5">
                            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                <div className="grid shrink-0 grid-cols-4 gap-1.5">
                                    {["Gold", "Silver", "Platinum", "Palladium"].map((m) => box(m, { background: palette.cardRaised }, "h-12"))}
                                </div>
                                {box("Spot price chart · clamp(140px, 26vh, 320px)", { background: palette.card }, "h-16 shrink-0")}
                                {box("Product grid: the only scrolling region · min height 180px", { background: palette.card, borderColor: palette.primary }, "min-h-0 flex-1")}
                            </div>
                            {box("Tools panel clamp(260px, 32vw, 384px)", { background: palette.card, writingMode: "vertical-rl" }, "w-12 shrink-0")}
                        </div>
                    </div>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">Anything added above the table comes out of the fixed band and needs a way to collapse. The table never shrinks below 180px.</p>
            </div>

            <div>
                <Heading hint="Compact: the Merrion Gold preset sets the spacing unit to 0.18rem (Tailwind's default is 0.25rem). Bars are drawn at real size.">Spacing tokens</Heading>
                <ul className="flex flex-col gap-1.5 rounded-xl border p-3">
                    {Object.entries(spacing).map(([name, value]) => (
                        <li key={name} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-xs">
                            <span className="font-mono">{name}</span>
                            <span className="h-3 rounded-sm" style={{ width: `${Math.max(remToPx(value) * 4, 4)}px`, background: palette.primary }} />
                            <span className="text-muted-foreground tabular-nums">
                                {value} · {Math.round(remToPx(value) * 10) / 10}px
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

/** Depth comes from tone, not shadow: flat at rest, lift only on interaction, stock elevation when floating. */
export function ElevationVisuals({ palette }: { palette: Palette }) {
    const cards = [
        { title: "At rest", note: "Hairline border and a tone step. No shadow.", shadow: "none", hover: false },
        { title: "On hover", note: "A clickable metal card gains shadow-lg over 200ms. Hover me.", shadow: "none", hover: true },
        { title: "Floating", note: "Popovers, dropdowns, dialogs: stock shadcn elevation.", shadow: "0 10px 25px -5px rgb(0 0 0 / .25)", hover: false },
    ]
    return (
        <div className="grid gap-3 md:grid-cols-3">
            {cards.map((c) => (
                <div
                    key={c.title}
                    className={cn("rounded-xl border p-4 transition-shadow duration-200", c.hover && "cursor-pointer hover:shadow-lg")}
                    style={{ background: palette.cardRaised, color: palette.fg, borderColor: palette.border, boxShadow: c.shadow }}
                >
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="mt-1 text-xs" style={{ color: palette.mutedFg }}>
                        {c.note}
                    </p>
                </div>
            ))}
        </div>
    )
}

/** Corner radii from the tokens, the hairline default and the selected metal-card border. */
export function ShapeVisuals({ rounded, colors, palette }: { rounded: Record<string, string>; colors: Record<string, string>; palette: Palette }) {
    const use: Record<string, string> = { sm: "small chips", md: "buttons, inputs, badges", lg: "general", xl: "cards", "2xl": "tool results, banners", full: "subtab pills" }
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Heading hint="Tight, gently rounded rectangles. The larger steps stay inside the Pricing Tools panel.">Corner radius</Heading>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                    {Object.entries(rounded).map(([name, value]) => (
                        <div key={name} className="flex flex-col items-center gap-1.5 text-center">
                            <div className="size-16 border-2" style={{ borderRadius: value, background: palette.muted, borderColor: palette.primary }} />
                            <p className="font-mono text-xs font-semibold">{name}</p>
                            <p className="text-muted-foreground text-[11px]">
                                {value}
                                <br />
                                {use[name] ?? ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Heading hint="Borders are 1px hairlines everywhere. The metal card is the one exception: a 2px border, transparent until the card is selected, then the metal's colour.">Borders</Heading>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div className="rounded-xl border p-3 text-xs" style={{ background: palette.card, color: palette.fg, borderColor: palette.border }}>
                        1px hairline
                    </div>
                    {(["metal-gold", "metal-silver", "metal-platinum", "metal-palladium"] as const).map((key) => (
                        <div key={key} className="rounded-xl border-2 p-3 text-xs" style={{ background: palette.cardRaised, color: palette.fg, borderColor: colors[key] }}>
                            2px · selected {key.replace("metal-", "")}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
