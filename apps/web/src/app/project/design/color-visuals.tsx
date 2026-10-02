import { useState } from "react"
import { ArrowDown, ArrowUp, Check, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { RoadmapMarkdown } from "../components/roadmap-markdown"
import { contrast, inkOn, type Palette } from "./palette"

/** A colour rectangle with its name and hex; click copies the hex. Ink flips to stay readable on the fill. */
export function Swatch({ name, hex, note, className }: { name: string; hex: string; note?: string; className?: string }) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        void navigator.clipboard.writeText(hex).then(() => {
            setCopied(true)
            toast.success(`Copied ${hex}`)
            window.setTimeout(() => setCopied(false), 1200)
        })
    }
    return (
        <button
            type="button"
            onClick={copy}
            title={`Copy ${hex}`}
            className={cn("group flex min-h-24 cursor-pointer flex-col justify-end rounded-lg border p-2.5 text-left", className)}
            style={{ background: hex, color: inkOn(hex) }}
        >
            <span className="flex items-center justify-between text-xs font-semibold">
                {name}
                {copied && <Check className="size-3.5" />}
            </span>
            <span className="font-mono text-[11px] opacity-80">{hex}</span>
            {note && <span className="text-[11px] leading-tight opacity-80">{note}</span>}
        </button>
    )
}

function Heading({ children, hint }: { children: string; hint?: string }) {
    return (
        <div className="mb-2">
            <h3 className="text-sm font-semibold">{children}</h3>
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
    )
}

const PILLARS = [
    { key: "brand", title: "Brand", fill: "merrion-gold", text: "merrion-gold-text", use: "Identity, active and selected states, primary actions." },
    { key: "price", title: "Price", fill: "price-teal", text: "price-teal-text", use: "Anything we charge the customer." },
    { key: "buyback", title: "Buyback", fill: "buyback-raspberry", text: "buyback-raspberry-text", use: "Anything we pay the customer." },
] as const

const METALS = [
    { key: "metal-gold", name: "Gold" },
    { key: "metal-silver", name: "Silver" },
    { key: "metal-platinum", name: "Platinum" },
    { key: "metal-palladium", name: "Palladium" },
] as const

const RAMP = ["zinc-950", "zinc-900", "zinc-800", "zinc-700", "zinc-500", "zinc-400", "zinc-300", "zinc-200", "zinc-100", "zinc-50", "zinc-white"] as const

// Tailwind's stock status colours, as DESIGN.md names them for the 6px freshness dots and the movement arrows.
const STATUS = [
    { label: "Fresh", hex: "#10b981" },
    { label: "Stale", hex: "#f59e0b" },
    { label: "Fallback (last known)", hex: "#f97316" },
    { label: "Failed", hex: "#ef4444" },
] as const

export function ColorVisuals({ colors, palette }: { colors: Record<string, string>; palette: Palette }) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Heading hint="Each accent has a fill (buttons, tints, always with dark ink) and a text tone (numbers and labels). Click any swatch to copy its hex.">Three pillars</Heading>
                <div className="grid gap-3 md:grid-cols-3">
                    {PILLARS.map((p) => (
                        <div key={p.key} className="rounded-xl border p-3">
                            <p className="mb-2 text-sm font-semibold">{p.title}</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Swatch name="Fill" hex={colors[p.fill]!} />
                                <Swatch name="Text tone" hex={colors[p.text]!} note={p.key === "brand" ? "light mode" : undefined} />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">{p.use}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Heading hint="Identify the metal on the spot cards and chart. The only fixed hex values in component code; tints are derived with color-mix().">Metal family</Heading>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {METALS.map((m) => (
                        <Swatch key={m.key} name={m.name} hex={colors[m.key]!} />
                    ))}
                </div>
            </div>

            <div>
                <Heading hint="Light and dark pick different steps. Light: white ground, zinc-100 muted, zinc-200 borders. Dark: zinc-950 ground, zinc-800 muted and borders.">Neutral zinc ramp</Heading>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-11">
                    {RAMP.map((k) => (
                        <Swatch key={k} name={k.replace("zinc-", "")} hex={colors[k]!} className="min-h-16" />
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <Heading hint="Status uses small 6px dots, so a stale price is never silent.">Freshness status</Heading>
                    <ul className="flex flex-col gap-1.5 rounded-xl border p-3 text-sm">
                        {STATUS.map((s) => (
                            <li key={s.label} className="flex items-center gap-2.5">
                                <span className="size-1.5 rounded-full" style={{ background: s.hex }} />
                                {s.label}
                                <span className="text-muted-foreground ml-auto font-mono text-xs">{s.hex}</span>
                            </li>
                        ))}
                        <li className="mt-1 flex items-center gap-4 border-t pt-2.5 text-xs">
                            <span className="flex items-center gap-1 text-green-600">
                                <ArrowUp className="size-3.5" /> +0.42% up
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                                <ArrowDown className="size-3.5" /> −0.31% down
                            </span>
                            <span className="text-muted-foreground">always with an arrow</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <Heading hint="Destructive actions only. Never for Price, Buyback or a normal trade.">Destructive</Heading>
                    <div className="grid grid-cols-2 gap-2">
                        <Swatch name="Signal red" hex={colors["signal-red"]!} note="light mode" />
                        <Swatch name="Night red" hex={colors["night-red"]!} note="dark mode" />
                    </div>
                </div>
            </div>

            <div>
                <Heading hint="Text on any solid gold, teal, raspberry or metal fill is dark ink, never white. White on the gold is about 2.1:1, on teal about 2.4:1.">Dark ink on accents</Heading>
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <Check className="size-3.5" /> Do: dark ink
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[colors["merrion-gold"]!, colors["price-teal"]!, colors["buyback-raspberry"]!, colors["metal-platinum"]!].map((fill) => (
                                <span key={fill} className="rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: fill, color: colors["zinc-900"] }}>
                                    {contrast(fill, colors["zinc-900"]!).toFixed(1)}:1
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-xl border p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                            <X className="size-3.5" /> Don't: white ink
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[colors["merrion-gold"]!, colors["price-teal"]!, colors["buyback-raspberry"]!, colors["metal-platinum"]!].map((fill) => (
                                <span key={fill} className="rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: fill, color: "#ffffff" }}>
                                    {contrast(fill, "#ffffff").toFixed(1)}:1
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Heading hint="The same tokens resolve differently per mode. Note the darker text tones in light mode, where a light fill can't be read on white.">Light vs dark surfaces</Heading>
                <div className="grid gap-3 md:grid-cols-2">
                    <ModeCard mode="Light" colors={colors} light />
                    <ModeCard mode="Dark" colors={colors} light={false} />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                    The page you are reading is in the {palette.bg === colors["zinc-white"] ? "light" : "dark"} theme; use the toggle above to switch every specimen on this view.
                </p>
            </div>
        </div>
    )
}

function ModeCard({ mode, colors, light }: { mode: string; colors: Record<string, string>; light: boolean }) {
    const bg = light ? colors["zinc-white"]! : colors["zinc-950"]!
    const fg = light ? colors["ink-black"]! : colors["zinc-50"]!
    const muted = light ? colors["zinc-100"]! : colors["zinc-800"]!
    const mutedFg = light ? colors["zinc-500"]! : colors["zinc-400"]!
    const border = light ? colors["zinc-200"]! : colors["zinc-800"]!
    const rows = [
        { label: "Price", text: light ? colors["price-teal-text"]! : colors["price-teal"]!, fill: colors["price-teal"]! },
        { label: "Buyback", text: light ? colors["buyback-raspberry-text"]! : colors["buyback-raspberry"]!, fill: colors["buyback-raspberry"]! },
        { label: "Brand", text: light ? colors["merrion-gold-text"]! : colors["merrion-gold"]!, fill: colors["merrion-gold"]! },
    ]
    return (
        <div className="rounded-xl border p-4" style={{ background: bg, color: fg, borderColor: border }}>
            <p className="text-sm font-semibold">{mode}</p>
            <p className="text-xs" style={{ color: mutedFg }}>
                Secondary text · {light ? "zinc-500" : "zinc-400"}
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm" style={{ background: muted }}>
                        <span style={{ color: r.text }} className="font-semibold tabular-nums">
                            {r.label} €2,949
                        </span>
                        <span className="size-3 rounded-sm" style={{ background: r.fill }} />
                    </div>
                ))}
            </div>
        </div>
    )
}

/** The Colors prose, tucked behind a disclosure: the swatches above are the quick read, this is the reasoning. */
export function ProseDisclosure({ title, children }: { title: string; children: string }) {
    return (
        <details className="group rounded-xl border">
            <summary className="hover:bg-muted/50 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium select-none">{title}</summary>
            <div className="border-t px-4 py-3">
                <RoadmapMarkdown>{children}</RoadmapMarkdown>
            </div>
        </details>
    )
}

