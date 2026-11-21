import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Maximize, Minimize, Pin, Search } from "lucide-react"
import type { MetalType } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMarketData } from "@/hooks/use-market-data.hook"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import { useMyPreferences } from "@/api/settings.api"
import { features } from "@/config/features"
import { cn } from "@/lib/utils"
import { formatEuro, formatGrams, formatMetalName, formatPrice, formatSnapshotTime, formatSpot } from "../dashboard/utils/formatters"
import { FRESHNESS_DOT_CLASS, FRESHNESS_LABEL } from "../dashboard/utils/freshness"
import type { DisplayProduct } from "../dashboard/components/table/product-grouping"
import {
    BOARD_METALS,
    autoMetal,
    boardLists,
    changeSincePreviousClose,
    perGram,
    recentCloses,
    sparkPath,
    togglePin,
    type BoardView,
} from "./board-model"

const METAL_DOT: Record<MetalType, string> = {
    GOLD: "#D4A017",
    SILVER: "#8B95A1",
    PLATINUM: "#4C8EA3",
    PALLADIUM: "#8073B8",
}

/**
 * The price board: live prices for an iPad on a desk, a screen in a branch or a stand at an event. Read-only and always
 * the live market price: a spot someone typed or froze on the dashboard never shows here. Spot cards on top, then the
 * chosen metal's bars and coins as two lists with Price, Buyback and the move since the previous close.
 */
/** Once, on the first flagged visit: if the account still has the default board, take this browser's choices. */
function useCopyBoardToAccount(
    onAccount: boolean,
    account: ReturnType<typeof useMyPreferences>,
    localView: string,
    localPins: number[],
) {
    const done = React.useRef(false)
    React.useEffect(() => {
        if (!onAccount || done.current) return
        done.current = true
        const b = account.prefs.board
        const accountIsDefault = b.view === "GOLD" && b.pins.length === 0
        const localIsDefault = localView === "GOLD" && localPins.length === 0
        if (accountIsDefault && !localIsDefault) account.save({ board: { view: localView, pins: localPins } })
    }, [onAccount, account, localView, localPins])
}

export default function BoardPage() {
    const { products, spotPrices, historicSpot, freshness, snapshotAt, loading, error } = useMarketData({ quiet: true })
    const [localView, setLocalView] = useUserPreference<string>("board-view", "GOLD")
    const [localPins, setLocalPins] = useUserPreference<number[]>("board-pins", [])
    // With the preview flag the choices live on the account (Settings), so every screen shows the same board.
    const account = useMyPreferences()
    const onAccount = features.redesign && account.loaded
    useCopyBoardToAccount(onAccount, account, localView, localPins)
    const stored = onAccount ? account.prefs.board.view : localView
    const pins = onAccount ? account.prefs.board.pins : localPins
    const setView = (v: string) => (onAccount ? account.save({ board: { ...account.prefs.board, view: v } }) : setLocalView(v))
    const setPins = (update: (prev: number[]) => number[]) =>
        onAccount ? account.save({ board: { ...account.prefs.board, pins: update(account.prefs.board.pins) } }) : setLocalPins(update)
    const [editingPins, setEditingPins] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const now = useNow(1000)
    useWakeLock()

    // An older version stored "pinned"; anything unknown falls back to gold.
    const view: BoardView = stored === "auto" || (BOARD_METALS as string[]).includes(stored) ? (stored as BoardView) : "GOLD"
    const metal: MetalType = view === "auto" ? autoMetal(products, now) : view
    const spot = spotPrices.find((s) => s.metalType === metal)
    const lists = boardLists(products, metal, pins, query)
    const firstLoad = loading && products.length === 0

    return (
        <div className="bg-background text-foreground flex min-h-svh flex-col gap-4 p-4 tabular-nums lg:p-6">
            <header className="flex flex-wrap items-center gap-3">
                <Button asChild variant="ghost" size="icon" className="size-11 cursor-pointer" title="Back to the dashboard" aria-label="Back to the dashboard">
                    <Link to="/dashboard">
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <div className="min-w-[200px] flex-1">
                    <h1 className="text-xl font-bold lg:text-2xl">Live prices</h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span aria-hidden className={cn("inline-block size-2 rounded-full", FRESHNESS_DOT_CLASS[freshness.state])} />
                        <span>
                            {FRESHNESS_LABEL[freshness.state]}
                            {snapshotAt && ` · prices struck at ${formatSnapshotTime(snapshotAt)}`}
                        </span>
                    </p>
                </div>
                <label className="border-input bg-card text-muted-foreground flex h-11 w-full items-center gap-2 rounded-lg border px-3 sm:w-60">
                    <Search aria-hidden className="size-4 shrink-0" />
                    <input
                        id="board-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find a product"
                        aria-label="Find a product"
                        className="text-foreground min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                    />
                </label>
                <time className="text-2xl font-bold lg:text-3xl" dateTime={new Date(now).toISOString()}>
                    {new Date(now).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })}
                </time>
                <FullscreenButton />
            </header>

            <section aria-label="Spot prices per troy ounce" className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {BOARD_METALS.map((m) => (
                    <SpotCard
                        key={m}
                        metal={m}
                        selected={metal === m}
                        spot={spotPrices.find((s) => s.metalType === m)}
                        closes={recentCloses(historicSpot, m)}
                        onPick={() => setView(m)}
                    />
                ))}
            </section>

            <div className="flex flex-wrap items-center gap-2">
                <div role="group" aria-label="Metal" className="bg-muted flex max-w-full gap-1 overflow-x-auto rounded-xl p-1">
                    {BOARD_METALS.map((m) => (
                        <SegButton key={m} active={view === m} onClick={() => setView(m)}>
                            {formatMetalName(m)}
                        </SegButton>
                    ))}
                    <SegButton active={view === "auto"} onClick={() => setView("auto")} title="Shows each metal in turn, every 20 seconds, for a screen nobody touches">
                        Rotate
                    </SegButton>
                </div>
                <Button
                    variant={editingPins ? "default" : "outline"}
                    className="ml-auto h-11 cursor-pointer gap-2"
                    aria-pressed={editingPins}
                    onClick={() => setEditingPins((e) => !e)}
                >
                    <Pin className="size-4" />
                    {editingPins ? "Done" : "Choose pins"}
                </Button>
            </div>
            {editingPins && <p className="text-muted-foreground -mt-2 text-sm">Tap a product to pin it to the top of its list, or tap again to unpin.</p>}

            <main className="grid flex-1 grid-cols-1 items-start gap-4 lg:grid-cols-2">
                {firstLoad ? (
                    <>
                        <Skeleton className="h-96 rounded-xl" />
                        <Skeleton className="h-96 rounded-xl" />
                    </>
                ) : error && products.length === 0 ? (
                    <p className="text-muted-foreground py-16 text-center text-lg lg:col-span-2">Prices are not available right now. The board retries on its own.</p>
                ) : (
                    <>
                        <PriceList
                            title={`${formatMetalName(metal)} bars`}
                            rows={lists.bars}
                            query={query}
                            pins={pins}
                            editing={editingPins}
                            changePercent={spot?.changePercent}
                            onTogglePin={(id) => setPins((prev) => togglePin(prev, id))}
                        />
                        <PriceList
                            title={`${formatMetalName(metal)} coins`}
                            rows={lists.coins}
                            query={query}
                            pins={pins}
                            editing={editingPins}
                            changePercent={spot?.changePercent}
                            onTogglePin={(id) => setPins((prev) => togglePin(prev, id))}
                        />
                    </>
                )}
            </main>

            <footer className="text-muted-foreground text-xs">
                Price includes VAT where it applies. Today is the move since the previous close. Live market price; confirm with a broker before trading.
            </footer>
        </div>
    )
}

function SpotCard({
    metal,
    selected,
    spot,
    closes,
    onPick,
}: {
    metal: MetalType
    selected: boolean
    spot: { priceEur: number; changePercent?: number | null } | undefined
    closes: number[]
    onPick: () => void
}) {
    const pct = spot?.changePercent
    const up = (pct ?? 0) >= 0
    const path = sparkPath(closes, 96, 30)
    return (
        <button
            type="button"
            onClick={onPick}
            aria-pressed={selected}
            className={cn("bg-card flex min-w-0 cursor-pointer flex-col gap-1 rounded-xl border p-3 text-left lg:p-4", selected && "ring-primary ring-2")}
        >
            <span className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5">
                    <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: METAL_DOT[metal] }} />
                    {formatMetalName(metal)} · oz
                </span>
                {pct != null && (
                    <span className={cn("font-bold", up ? "text-status-ok" : "text-status-bad")}>
                        {up ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
                    </span>
                )}
            </span>
            <span className="flex items-end justify-between gap-2">
                <span className="text-2xl font-extrabold tracking-tight lg:text-3xl">{spot ? formatSpot(metal, spot.priceEur) : "—"}</span>
                {path && (
                    <svg viewBox="0 0 96 30" className="h-[30px] w-[64px] shrink-0 sm:w-[96px]" aria-hidden>
                        <path d={path} fill="none" stroke={METAL_DOT[metal]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            <span className="text-muted-foreground flex justify-between text-xs">
                <span>{spot ? `${formatEuro(perGram(spot.priceEur))} per gram` : ""}</span>
                {path && <span>30 days</span>}
            </span>
        </button>
    )
}

function PriceList({
    title,
    rows,
    query,
    pins,
    editing,
    changePercent,
    onTogglePin,
}: {
    title: string
    rows: DisplayProduct[]
    query: string
    pins: number[]
    editing: boolean
    changePercent: number | null | undefined
    onTogglePin: (id: number) => void
}) {
    const grid = "grid grid-cols-[minmax(0,1fr)_78px_78px] items-center gap-2 px-3 sm:grid-cols-[minmax(0,1fr)_96px_96px_64px] sm:px-4"
    return (
        <section aria-label={title} className="bg-card min-w-0 overflow-hidden rounded-xl border">
            <div className={cn(grid, "bg-muted text-muted-foreground min-h-10 border-b text-xs font-semibold tracking-wide uppercase")}>
                <span className="text-foreground text-sm tracking-normal normal-case">{title}</span>
                <span className="text-price-text text-right">Price</span>
                <span className="text-buyback-text text-right">Buyback</span>
                <span className="hidden text-right sm:block">Today</span>
            </div>
            {rows.length === 0 ? (
                <p className="text-muted-foreground px-4 py-6 text-sm">{query ? `No product matches "${query}".` : "No products here."}</p>
            ) : (
                <ul>
                    {rows.map((p) => {
                        const pinned = pins.includes(p.id)
                        const change = changeSincePreviousClose(p.priceSell, changePercent)
                        const body = (
                            <>
                                <span className="flex min-w-0 items-center gap-2 font-semibold">
                                    {pinned && <Pin aria-label="Pinned" className="text-primary size-3.5 shrink-0 fill-current" />}
                                    {editing && !pinned && <Pin aria-hidden className="text-muted-foreground size-3.5 shrink-0" />}
                                    <span className="truncate">{p.name}</span>
                                    <span className="text-muted-foreground shrink-0 text-xs font-medium">{formatGrams(p.weight)}</span>
                                </span>
                                <span className="text-price-text text-right text-[15px] font-extrabold sm:text-[17px]">{formatPrice(p.priceSell)}</span>
                                <span className="text-buyback-text text-right text-[15px] font-extrabold sm:text-[17px]">{formatPrice(p.priceBuy)}</span>
                                <span className={cn("hidden text-right text-xs font-bold sm:block", change == null ? "text-muted-foreground" : change < 0 ? "text-status-bad" : "text-status-ok")}>
                                    {change == null ? "—" : `${change < 0 ? "−" : "+"}${Math.abs(change) < 10 ? formatEuro(Math.abs(change)) : formatPrice(Math.abs(change))}`}
                                </span>
                            </>
                        )
                        return (
                            <li key={p.id} className="border-b last:border-b-0">
                                {editing ? (
                                    <button type="button" aria-pressed={pinned} onClick={() => onTogglePin(p.id)} className={cn(grid, "hover:bg-muted min-h-11 w-full cursor-pointer text-left")}>
                                        {body}
                                    </button>
                                ) : (
                                    <div className={cn(grid, "min-h-11")}>{body}</div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}

function SegButton({ active, onClick, title, children }: { active: boolean; onClick: () => void; title?: string; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={active}
            title={title}
            onClick={onClick}
            className={cn(
                "h-10 shrink-0 cursor-pointer rounded-lg px-4 text-sm font-semibold transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
        >
            {children}
        </button>
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

/** The current time, re-read every `ms`: drives the clock and the rotation. */
function useNow(ms: number): number {
    const [now, setNow] = React.useState(() => Date.now())
    React.useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), ms)
        return () => window.clearInterval(id)
    }, [ms])
    return now
}

/** Keeps the screen on while the board is open, where the browser supports it; asked for again when the tab returns. */
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
