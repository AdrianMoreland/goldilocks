import type { ReactNode } from "react"
import { ArrowDown, ArrowLeftRight, ArrowUp, CircleAlert, Settings, TriangleAlert } from "lucide-react"
import { tint, type Palette } from "./palette"

function Specimen({ title, hint, palette, children }: { title: string; hint?: string; palette: Palette; children: ReactNode }) {
    return (
        <section>
            <h3 className="text-sm font-semibold">{title}</h3>
            {hint && <p className="text-muted-foreground mb-2 text-xs">{hint}</p>}
            <div className="mt-2 rounded-xl border p-4" style={{ background: palette.bg, color: palette.fg, borderColor: palette.border }}>
                {children}
            </div>
        </section>
    )
}

/** A 36px control in the system's crisp default: 6px corners, hairline border. */
const control = (palette: Palette) => ({ height: 36, borderRadius: 6, border: `1px solid ${palette.border}` })

const METAL_CARDS = [
    { name: "Gold", key: "metal-gold", price: "€2,948", change: "+0.42%", up: true, selected: true, dot: "#10b981" },
    { name: "Silver", key: "metal-silver", price: "€31.42", change: "−0.31%", up: false, selected: false, dot: "#10b981" },
    { name: "Platinum", key: "metal-platinum", price: "€1,012", change: "+0.08%", up: true, selected: false, dot: "#f59e0b" },
    { name: "Palladium", key: "metal-palladium", price: "€964", change: "−1.20%", up: false, selected: false, dot: "#f97316" },
] as const

export function ComponentVisuals({ colors, palette }: { colors: Record<string, string>; palette: Palette }) {
    const p = palette
    const priceTint = tint(p.price, 12, p.bg)
    return (
        <div className="flex flex-col gap-6">
            <Specimen title="Buttons" hint="Quiet, square, compact. Gold fills only the primary or pressed state; every icon-only button carries a title and aria-label." palette={p}>
                <div className="flex flex-wrap items-center gap-3">
                    <button type="button" className="px-4 text-sm font-medium" style={{ ...control(p), background: p.primary, color: p.ink, border: "none" }}>
                        Primary
                    </button>
                    <button type="button" className="px-4 text-sm font-medium" style={{ ...control(p), background: p.bg, color: p.fg }}>
                        Outline
                    </button>
                    <button type="button" className="px-4 text-sm font-medium" style={{ ...control(p), background: p.muted, color: p.fg }}>
                        Outline · hover
                    </button>
                    <button type="button" aria-label="Settings" title="Settings" className="grid size-9 place-items-center" style={{ ...control(p), background: p.primary, color: p.ink, border: "none" }}>
                        <Settings className="size-4" />
                    </button>
                    <button type="button" aria-label="Settings" title="Settings" className="grid size-9 place-items-center" style={{ ...control(p), background: p.bg, color: p.fg }}>
                        <Settings className="size-4" />
                    </button>
                    <span className="text-xs" style={{ color: p.mutedFg }}>
                        a pressed header toggle uses the gold fill
                    </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <input readOnly value="1 oz Britannia" className="w-56 px-3 text-sm" style={{ ...control(p), background: p.bg, color: p.fg, outline: `3px solid ${tint(p.fg, 25, "transparent")}`, outlineOffset: 0 }} aria-label="Focused input example" />
                    <span className="text-xs" style={{ color: p.mutedFg }}>
                        input · 36px, 6px corners, 3px focus ring at 50%
                    </span>
                </div>
            </Specimen>

            <Specimen title="Metal spot cards" hint="The signature component. A transparent 2px border turns the metal's colour when selected; the price is h4 with tabular numerals; the dot is the freshness signal." palette={p}>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {METAL_CARDS.map((m) => (
                        <div key={m.name} className="flex flex-col justify-between rounded-xl border-2 p-3 transition-shadow hover:shadow-lg" style={{ background: p.cardRaised, borderColor: m.selected ? colors[m.key] : "transparent", boxShadow: `inset 0 0 0 1px ${p.border}` }}>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: colors[m.key] }}>
                                    <span className="size-1.5 rounded-full" style={{ background: m.dot }} />
                                    {m.name}
                                </span>
                                <span className="rounded-full px-2 text-[11px] font-medium" style={{ background: tint(colors[m.key]!, 18, p.cardRaised), color: p.fg }}>
                                    pause
                                </span>
                            </div>
                            <p className="mt-2 text-xl leading-7 font-bold tabular-nums">{m.price}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium" style={{ color: m.up ? "#16a34a" : "#dc2626" }}>
                                {m.up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                                {m.change}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: p.mutedFg }}>
                    <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ background: "#10b981" }} /> fresh
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ background: "#f59e0b" }} /> stale
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ background: "#f97316" }} /> last known price
                    </span>
                    <span className="flex items-center gap-1.5">
                        <TriangleAlert className="size-3.5" style={{ color: "#f59e0b" }} /> amber triangle while stale
                    </span>
                    <span>Live · 01:56:30</span>
                </p>
            </Specimen>

            <Specimen title="Product grid" hint="Price pair in teal, Buyback pair in raspberry (their text tones). Sections sort independently; badges are outline with a 40% border mix and 12% fill mix, numbers only." palette={p}>
                <div className="overflow-x-auto rounded-lg border" style={{ borderColor: p.border }}>
                    <table className="w-full min-w-[34rem] text-left text-base tabular-nums">
                        <thead>
                            <tr style={{ background: p.muted }}>
                                {["Product", "Price", "Premium", "Buyback", "Discount"].map((h, i) => (
                                    <th key={h} className="px-3 py-1.5 text-base font-bold" style={{ color: i === 1 || i === 2 ? p.priceText : i >= 3 ? p.buybackText : p.fg }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5} className="px-3 py-1 text-[11px] font-bold tracking-wide uppercase" style={{ color: p.mutedFg, background: tint(p.muted, 50, p.bg) }}>
                                    Bars
                                </td>
                            </tr>
                            {[
                                ["Gold bar 1 oz", "€2,949", "3.8%", "€2,861", "1.2%"],
                                ["Gold bar 10 g", "€1,018", "5.1%", "€940", "2.4%"],
                            ].map((row, ri) => (
                                <tr key={row[0]} style={{ outline: ri === 0 ? `2px solid ${p.primaryText}` : undefined, outlineOffset: -2 }}>
                                    <td className="px-3 py-1.5">{row[0]}</td>
                                    <td className="px-3 py-1.5 font-semibold" style={{ color: p.priceText }}>
                                        {row[1]}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <Badge color={p.priceText} fill={p.price} bg={p.bg}>
                                            {row[2]}
                                        </Badge>
                                    </td>
                                    <td className="px-3 py-1.5 font-semibold" style={{ color: p.buybackText }}>
                                        {row[3]}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <Badge color={p.buybackText} fill={p.buyback} bg={p.bg}>
                                            {row[4]}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-2 text-xs" style={{ color: p.mutedFg }}>
                    The first row shows the keyboard-focus outline: 2px inset in the primary text tone.
                </p>
            </Specimen>

            <Specimen title="Pricing Tools panel" hint="The tolerated exception: rounder, pill-shaped. Each tab sets its accent through the theme; Price is teal, Buyback is raspberry." palette={p}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <button type="button" className="flex items-center gap-2.5 rounded-full px-4 py-1.5 text-left" style={{ background: p.price, color: p.ink }}>
                                <span>
                                    <span className="block text-lg leading-5 font-bold">Price</span>
                                    <span className="block text-[11px] opacity-80">Buyback</span>
                                </span>
                                <ArrowLeftRight className="size-4" />
                            </button>
                            <span className="text-xs" style={{ color: p.mutedFg }}>
                                direction pill, filled with the side being quoted
                            </span>
                        </div>
                        <div className="flex w-fit gap-1 rounded-full p-1" style={{ background: p.muted }}>
                            {["Quote", "Melt", "Compare"].map((t, i) => (
                                <span key={t} className="rounded-full px-3 py-1 text-xs font-medium" style={i === 0 ? { background: p.price, color: p.ink, fontWeight: 700 } : { color: p.mutedFg }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: priceTint }}>
                            <span className="text-[13px] font-semibold" style={{ color: p.mutedFg }}>
                                Total
                            </span>
                            <span className="text-xl font-extrabold tabular-nums" style={{ color: p.priceText }}>
                                €5,898
                            </span>
                        </div>
                        <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-medium" style={{ background: tint(p.destructive, 14, p.bg), color: p.fg }}>
                            <CircleAlert className="mt-0.5 size-4 shrink-0" />
                            Error banner: 12px corners on the soft tint, an icon and 12px medium text.
                        </div>
                    </div>
                </div>
            </Specimen>
        </div>
    )
}

function Badge({ color, fill, bg, children }: { color: string; fill: string; bg: string; children: ReactNode }) {
    return (
        <span className="rounded-md border px-1.5 py-0.5 text-xs font-medium" style={{ color, borderColor: tint(fill, 40, "transparent"), background: tint(fill, 12, bg) }}>
            {children}
        </span>
    )
}
