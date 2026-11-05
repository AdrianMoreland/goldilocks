import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { InventoryPosition } from "@goldilocks/shared-types"
import { useInventoryApi } from "@/api/inventory.api"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountTabs } from "@/components/ui/count-tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StocktakeListPage from "@/app/stocktake/page"

type Tab = "position" | "bars" | "coins" | "month-end"

const PAGE = 50
const METALS: Record<string, string> = { GOLD: "Gold", SILVER: "Silver", PGM: "Platinum / palladium" }
const BAR_STATUS: Record<string, string> = { UNCONFIRMED: "Not seen yet", CONFIRMED: "Confirmed", NEW: "New", GONE: "Gone" }

/**
 * Stock in one place, from the stocktake models: the position, bars by serial, coins by quantity, and the month-end
 * count. Figures come from one stocktake (the newest unless another is chosen) and an imported sheet is labelled as
 * such. Free-to-sell is not shown yet: it needs every product name tied to a sales product first.
 */
export default function InventoryPage() {
    const api = useInventoryApi()
    const [tab, setTab] = useState<Tab>("position")
    const [stocktakeId, setStocktakeId] = useState<number | undefined>(undefined)
    const position = useQuery({ queryKey: ["inventory", "position", stocktakeId], queryFn: () => api.position(stocktakeId) })
    const st = position.data?.stocktake

    return (
        <BaseLayout title="Inventory" description="Stock position, bars by serial, coins and the month-end count">
            <div className="space-y-4 px-4 lg:px-6">
                <CountTabs
                    aria-label="Inventory views"
                    value={tab}
                    onValueChange={(v) => setTab(v as Tab)}
                    items={[
                        { value: "position", label: "Position" },
                        { value: "bars", label: "Bars", count: position.data?.bars.total },
                        { value: "coins", label: "Coins", count: position.data?.coins.lines },
                        { value: "month-end", label: "Month-end" },
                    ]}
                />
                {tab !== "month-end" && position.data && (
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        {st ? (
                            <>
                                <span className="text-muted-foreground">Figures from</span>
                                <select
                                    aria-label="Stocktake"
                                    className="border-input bg-background h-9 rounded-md border px-2"
                                    value={st.id}
                                    onChange={(e) => setStocktakeId(Number(e.target.value))}
                                >
                                    {position.data.available.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.countDate})
                                        </option>
                                    ))}
                                </select>
                                {st.imported && <Badge variant="outline">Imported sheet, not counted here</Badge>}
                                <Badge variant="secondary">{st.status.toLowerCase()}</Badge>
                            </>
                        ) : (
                            <span className="text-muted-foreground">No stocktake yet. Import the stock sheet or start a month-end count.</span>
                        )}
                    </div>
                )}
                {tab === "position" && <PositionTab position={position.data} loading={position.isLoading} />}
                {tab === "bars" && st && <BarsTab stocktakeId={st.id} />}
                {tab === "coins" && st && <CoinsTab stocktakeId={st.id} />}
                {tab === "month-end" && <StocktakeListPage embedded />}
            </div>
        </BaseLayout>
    )
}

function Metals({ by }: { by: Record<string, number> }) {
    const entries = Object.entries(by)
    if (entries.length === 0) return <span className="text-muted-foreground text-sm">none</span>
    return (
        <span className="text-muted-foreground text-sm">
            {entries.map(([m, n]) => `${METALS[m] ?? m} ${n.toLocaleString()}`).join(" · ")}
        </span>
    )
}

function PositionTab({ position, loading }: { position: InventoryPosition | undefined; loading: boolean }) {
    if (loading || !position) return <p className="text-muted-foreground text-sm">Loading...</p>
    if (!position.stocktake) return null
    const { bars, coins } = position
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {(
                    [
                        ["Bars", bars.total.toLocaleString(), <Metals key="b" by={bars.byMetal} />],
                        ["Held for customers", bars.heldForCustomers.toLocaleString(), <span key="h" className="text-muted-foreground text-sm">bars named on an open customer order</span>],
                        ["Coin pieces counted", coins.pieces.toLocaleString(), <Metals key="c" by={coins.byMetal} />],
                        [
                            "Coin lines not counted",
                            coins.uncounted.toLocaleString(),
                            <span key="u" className="text-muted-foreground text-sm">
                                of {coins.lines.toLocaleString()} lines
                            </span>,
                        ],
                    ] as const
                ).map(([label, value, note]) => (
                    <Card key={label}>
                        <CardContent className="pt-6">
                            <div className="text-muted-foreground text-xs">{label}</div>
                            <div className="text-2xl font-semibold tabular-nums">{value}</div>
                            {note}
                        </CardContent>
                    </Card>
                ))}
            </div>
            {bars.gone > 0 && <p className="text-muted-foreground text-sm">{bars.gone} bars are listed as gone and are not counted above.</p>}
            <p className="text-muted-foreground text-sm">
                Free to sell is not shown yet. It needs each product name tied to a sales product (Import hub, Review), and a wrong number on a quote costs more
                than none.
            </p>
        </div>
    )
}

function BarsTab({ stocktakeId }: { stocktakeId: number }) {
    const api = useInventoryApi()
    const [text, setText] = useState("")
    const [q, setQ] = useState("")
    const [metal, setMetal] = useState("")
    const [where, setWhere] = useState("")
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => {
            setQ(text.trim())
            setOffset(0)
        }, 300)
        return () => clearTimeout(t)
    }, [text])

    const list = useQuery({
        queryKey: ["inventory", "bars", stocktakeId, q, metal, where, offset],
        queryFn: () => api.bars({ stocktakeId, q: q || undefined, metal: metal || undefined, where: where || undefined, limit: PAGE, offset }),
        placeholderData: (prev) => prev,
    })
    const total = list.data?.total ?? 0

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                <Input type="search" aria-label="Search by serial" placeholder="Search by serial" className="max-w-xs" value={text} onChange={(e) => setText(e.target.value)} />
                <select
                    aria-label="Metal"
                    className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                    value={metal}
                    onChange={(e) => {
                        setMetal(e.target.value)
                        setOffset(0)
                    }}
                >
                    <option value="">All metals</option>
                    {Object.entries(METALS).map(([k, v]) => (
                        <option key={k} value={k}>
                            {v}
                        </option>
                    ))}
                </select>
                <select
                    aria-label="Where"
                    className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                    value={where}
                    onChange={(e) => {
                        setWhere(e.target.value)
                        setOffset(0)
                    }}
                >
                    <option value="">Everywhere</option>
                    <option value="free">Not held for a customer</option>
                    <option value="held">Held for a customer</option>
                </select>
            </div>
            <Card>
                <CardContent className="pt-6">
                    {!list.data?.rows.length ? (
                        <p className="text-muted-foreground py-6 text-center text-sm">{list.isLoading ? "Loading..." : "No bars match."}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Serial</TableHead>
                                    <TableHead>Refinery</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Metal</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Held for</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {list.data.rows.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-mono text-sm">{b.serial ?? <span className="text-muted-foreground">no serial</span>}</TableCell>
                                        <TableCell>{b.refinery ?? ""}</TableCell>
                                        <TableCell>{b.weightLabel}</TableCell>
                                        <TableCell>{METALS[b.metal] ?? b.metal}</TableCell>
                                        <TableCell>{b.locationCode}</TableCell>
                                        <TableCell className="text-sm">
                                            {b.heldFor ? (
                                                <>
                                                    {b.heldFor.client}
                                                    <span className="text-muted-foreground ml-2 font-mono text-xs">{b.heldFor.reference ?? ""}</span>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{BAR_STATUS[b.status] ?? b.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            {total > PAGE && (
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                    <span className="tabular-nums">
                        {offset + 1}-{Math.min(offset + PAGE, total)} of {total.toLocaleString()}
                    </span>
                    <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

function CoinsTab({ stocktakeId }: { stocktakeId: number }) {
    const api = useInventoryApi()
    const [metal, setMetal] = useState("")
    const list = useQuery({ queryKey: ["inventory", "coins", stocktakeId, metal], queryFn: () => api.coins({ stocktakeId, metal: metal || undefined }) })
    return (
        <div className="space-y-3">
            <select aria-label="Metal" className="border-input bg-background h-9 rounded-md border px-2 text-sm" value={metal} onChange={(e) => setMetal(e.target.value)}>
                <option value="">All metals</option>
                {Object.entries(METALS).map(([k, v]) => (
                    <option key={k} value={k}>
                        {v}
                    </option>
                ))}
            </select>
            <Card>
                <CardContent className="pt-6">
                    {!list.data?.rows.length ? (
                        <p className="text-muted-foreground py-6 text-center text-sm">{list.isLoading ? "Loading..." : "No coins in this stocktake."}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Metal</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead className="text-right">Last count</TableHead>
                                    <TableHead className="text-right">This count</TableHead>
                                    <TableHead className="text-right">Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {list.data.rows.map((c) => {
                                    const diff = c.countedQty !== null && c.previousQty !== null ? c.countedQty - c.previousQty : null
                                    return (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.item}</TableCell>
                                            <TableCell>{METALS[c.metal] ?? c.metal}</TableCell>
                                            <TableCell>{c.locationCode}</TableCell>
                                            <TableCell className="text-right tabular-nums">{c.previousQty ?? ""}</TableCell>
                                            <TableCell className="text-right tabular-nums">{c.countedQty ?? <span className="text-muted-foreground">not counted</span>}</TableCell>
                                            <TableCell className="text-right tabular-nums">{diff === null ? "" : diff > 0 ? `+${diff}` : diff}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
