import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Maximize, Minimize, Pin, PinOff } from "lucide-react"
import type { MetalType } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMarketData } from "@/hooks/use-market-data.hook"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import { cn } from "@/lib/utils"
import { formatGrams, formatMetalName, formatPrice, formatSnapshotTime, formatSpot } from "../dashboard/utils/formatters"
import { FRESHNESS_DOT_CLASS, FRESHNESS_LABEL } from "../dashboard/utils/freshness"
import type { DisplayProduct } from "../dashboard/components/table/product-grouping"
import { BOARD_METALS, autoMetal, boardProducts, pinnedProducts, togglePin, type BoardView } from "./board-model"

/**
 * The price board: live prices, large, for an iPad on a desk, a screen in a branch or a stand at an event.
 * Read-only and always the live market price: a spot someone typed or froze on the dashboard never shows here.
 */
export default function BoardPage() {
    const { products, spotPrices, freshness, snapshotAt, loading, error } = useMarketData({ quiet: true })
    const [view, setView] = useUserPreference<BoardView>("board-view", "GOLD")
    const [pins, setPins] = useUserPreference<number[]>("board-pins", [])
    const [editingPins, setEditingPins] = React.useState(false)
    const now = useNow(1000)
    useWakeLock()

    const metal: MetalType | null = view === "auto" ? autoMetal(products, now) : view === "pinned" ? null : view
    const cards = metal ? boardProducts(products, metal) : pinnedProducts(products, pins)
    const firstLoad = loading && products.length === 0

    return (
        <div className="bg-background text-foreground flex min-h-svh flex-col gap-4 p-4 lg:p-6">
            <header className="flex flex-wrap items-center gap-3">
                <Button asChild variant="ghost" size="icon" className="cursor-pointer" title="Back to the dashboard" aria-label="Back to the dashboard">
                    <Link to="/dashboard">
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold lg:text-2xl">Live prices</h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span aria-hidden className={cn("inline-block size-2.5 rounded-full", FRESHNESS_DOT_CLASS[freshness.state])} />
                        <span>
                            {FRESHNESS_LABEL[freshness.state]}
                            {snapshotAt && ` · prices at ${formatSnapshotTime(snapshotAt)}`}
                        </span>
                    </p>
                </div>
                <time className="text-2xl font-semibold tabular-nums lg:text-3xl" dateTime={new Date(now).toISOString()}>
                    {new Date(now).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })}
                </time>
                <FullscreenButton />
            </header>

            <section aria-label="Spot prices per troy ounce" className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {BOARD_METALS.map((m) => {
                    const spot = spotPrices.find((s) => s.metalType === m)
                    const up = (spot?.changePercent ?? 0) >= 0
                    return (
                        <div key={m} className={cn("bg-card rounded-xl border p-3 lg:p-4", metal === m && "ring-primary ring-2")}>
                            <div className="text-muted-foreground text-sm font-medium">{formatMetalName(m)} · oz</div>
                            <div className="text-2xl font-bold tabular-nums lg:text-3xl">{spot ? formatSpot(m, spot.priceEur) : "—"}</div>
                            {spot?.changePercent != null && (
                                <div className={cn("text-sm font-semibold tabular-nums", up ? "text-status-ok" : "text-status-bad")}>
                                    {up ? "▲" : "▼"} {Math.abs(spot.changePercent).toFixed(2)}%
                                </div>
                            )}
                        </div>
                    )
                })}
            </section>

            <nav aria-label="What the board shows" className="flex flex-wrap items-center gap-2">
                {BOARD_METALS.map((m) => (
                    <ViewButton key={m} active={view === m} onClick={() => setView(m)}>
                        {formatMetalName(m)}
                    </ViewButton>
                ))}
                <ViewButton active={view === "pinned"} onClick={() => setView("pinned")}>
                    Pinned{pins.length > 0 && ` (${pins.length})`}
                </ViewButton>
                <ViewButton active={view === "auto"} onClick={() => setView("auto")} title="Shows each metal in turn, for a screen nobody touches">
                    Auto
                </ViewButton>
                <Button
                    variant={editingPins ? "default" : "outline"}
                    className="ml-auto h-11 cursor-pointer gap-2"
                    aria-pressed={editingPins}
                    onClick={() => setEditingPins((e) => !e)}
                >
                    <Pin className="size-4" />
                    {editingPins ? "Done" : "Choose pins"}
                </Button>
            </nav>

            <main className="flex-1">
                {firstLoad ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }, (_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                ) : error && products.length === 0 ? (
                    <p className="text-muted-foreground py-16 text-center text-lg">Prices are not available right now. The board retries on its own.</p>
                ) : cards.length === 0 ? (
                    <p className="text-muted-foreground py-16 text-center text-lg">
                        {view === "pinned" ? "Nothing pinned yet. Tap “Choose pins”, then tap the products to keep on this view." : "No products for this metal."}
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {cards.map((p) => (
                            <PriceCard
                                key={p.id}
                                product={p}
                                showMetal={metal === null}
                                editing={editingPins}
                                pinned={pins.includes(p.id)}
                                onTogglePin={() => setPins((prev) => togglePin(prev, p.id))}
                            />
                        ))}
                    </ul>
                )}
            </main>

            <footer className="text-muted-foreground text-xs">Prices include VAT where it applies. Live market price; confirm with a broker before trading.</footer>
        </div>
    )
}

function PriceCard({
    product: p,
    showMetal,
    editing,
    pinned,
    onTogglePin,
}: {
    product: DisplayProduct
    showMetal: boolean
    editing: boolean
    pinned: boolean
    onTogglePin: () => void
}) {
    const body = (
        <>
            <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                    <div className="truncate text-lg font-semibold lg:text-xl">{p.name}</div>
                    <div className="text-muted-foreground text-sm tabular-nums">
                        {showMetal && `${formatMetalName(p.metalType)} · `}
                        {formatGrams(p.weight)}
                    </div>
                </div>
                {editing ? (
                    pinned ? <PinOff aria-hidden className="text-primary size-5" /> : <Pin aria-hidden className="text-muted-foreground size-5" />
                ) : (
                    pinned && <Pin aria-label="Pinned" className="text-primary size-4" />
                )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                    <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Price</div>
                    <div className="text-price-text text-3xl font-bold tabular-nums xl:text-4xl">{formatPrice(p.priceSell)}</div>
                </div>
                <div>
                    <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Buyback</div>
                    <div className="text-buyback-text text-3xl font-bold tabular-nums xl:text-4xl">{formatPrice(p.priceBuy)}</div>
                </div>
            </div>
        </>
    )
    const cardClass = cn("bg-card block w-full rounded-xl border p-4 text-left", pinned && editing && "ring-primary ring-2")
    return (
        <li>
            {editing ? (
                <button type="button" aria-pressed={pinned} onClick={onTogglePin} className={cn(cardClass, "cursor-pointer")}>
                    {body}
                </button>
            ) : (
                <div className={cardClass}>{body}</div>
            )}
        </li>
    )
}

function ViewButton({ active, onClick, title, children }: { active: boolean; onClick: () => void; title?: string; children: React.ReactNode }) {
    return (
        <Button variant={active ? "default" : "outline"} aria-pressed={active} title={title} className="h-11 min-w-[88px] cursor-pointer" onClick={onClick}>
            {children}
        </Button>
    )
}

/** Full screen where the browser allows it (most desktop browsers and iPad Safari; not iPhone Safari, so the button hides there). */
function FullscreenButton() {
    const [on, setOn] = React.useState(() => typeof document !== "undefined" && document.fullscreenElement !== null)
    React.useEffect(() => {
        const onChange = () => setOn(document.fullscreenElement !== null)
        document.addEventListener("fullscreenchange", onChange)
        return () => document.removeEventListener("fullscreenchange", onChange)
    }, [])
    if (typeof document === "undefined" || !document.fullscreenEnabled) return null
    return (
        <Button
            variant="outline"
            size="icon"
            className="size-11 cursor-pointer"
            title={on ? "Leave full screen" : "Full screen"}
            aria-label={on ? "Leave full screen" : "Full screen"}
            onClick={() => (on ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => undefined)}
        >
            {on ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
        </Button>
    )
}

/** The current time, re-read every `ms`: drives the clock and the "auto" metal rotation. */
function useNow(ms: number): number {
    const [now, setNow] = React.useState(() => Date.now())
    React.useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), ms)
        return () => window.clearInterval(id)
    }, [ms])
    return now
}

/** Keeps the screen on while the board is open, where the browser supports it; the lock is dropped when the tab hides, so it is asked for again on return. */
function useWakeLock() {
    React.useEffect(() => {
        if (!("wakeLock" in navigator)) return
        let lock: WakeLockSentinel | null = null
        let cancelled = false
        const request = () => {
            if (document.visibilityState !== "visible") return
            navigator.wakeLock
                .request("screen")
                .then((l) => {
                    if (cancelled) void l.release()
                    else lock = l
                })
                .catch(() => undefined)
        }
        request()
        document.addEventListener("visibilitychange", request)
        return () => {
            cancelled = true
            document.removeEventListener("visibilitychange", request)
            void lock?.release()
        }
    }, [])
}
