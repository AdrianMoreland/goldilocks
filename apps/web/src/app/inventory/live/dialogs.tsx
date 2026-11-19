import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { LiveMetal, LiveStockBranch, LiveStockLine } from "@goldilocks/shared-types"
import { useLiveStockApi } from "@/api/live-stock.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lineName, REASONS } from "./live-stock-model"

const field = "border-input bg-background h-11 w-full rounded-md border px-3 text-base"
const digits = (v: string) => v.replace(/\D/g, "")

/** One-tap reasons plus a free note. The reason is required on every change, so a count is never edited silently. */
function ReasonPicker({ reason, setReason, note, setNote }: { reason: string; setReason: (v: string) => void; note: string; setNote: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <Label>Reason</Label>
            <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => (
                    <Button key={r} type="button" size="sm" variant={reason === r ? "default" : "outline"} className="h-9" onClick={() => setReason(r)}>
                        {r}
                    </Button>
                ))}
            </div>
            <Input aria-label="Note" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
    )
}

export function EditCountDialog({ line, onClose, onSave }: { line: LiveStockLine; onClose: () => void; onSave: (qty: number, reason: string, note: string) => void }) {
    const [qty, setQty] = useState(String(line.qty))
    const [reason, setReason] = useState<string>("Recount")
    const [note, setNote] = useState("")
    const n = Number(qty)
    const valid = qty.trim() !== "" && Number.isInteger(n) && n >= 0 && n !== line.qty
    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{lineName(line)}</DialogTitle>
                    <DialogDescription>Currently {line.qty}. Type the new count.</DialogDescription>
                </DialogHeader>
                <Input aria-label="New count" inputMode="numeric" autoFocus className="h-14 text-center text-3xl tabular-nums" value={qty} onChange={(e) => setQty(digits(e.target.value))} />
                <ReasonPicker reason={reason} setReason={setReason} note={note} setNote={setNote} />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!valid}
                        onClick={() => {
                            onSave(n, reason, note)
                            onClose()
                        }}
                    >
                        Save count
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export interface NewLine {
    kind: "COIN" | "BAR"
    family: string
    variant: string
    refinery: string
    qty: number
    reason: string
}

export function AddLineDialog({ branch, metal, families, onClose, onSave }: { branch: string; metal: LiveMetal; families: string[]; onClose: () => void; onSave: (v: NewLine) => void }) {
    const [kind, setKind] = useState<"COIN" | "BAR">("COIN")
    const [family, setFamily] = useState("")
    const [variant, setVariant] = useState("")
    const [refinery, setRefinery] = useState("")
    const [qty, setQty] = useState("1")
    const n = Number(qty)
    const valid = variant.trim() !== "" && (kind === "BAR" || family.trim() !== "") && Number.isInteger(n) && n >= 0
    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add to {branch} {metal.toLowerCase()} stock
                    </DialogTitle>
                    <DialogDescription>For something not on the list yet.</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                    {(["COIN", "BAR"] as const).map((k) => (
                        <Button key={k} type="button" variant={kind === k ? "default" : "outline"} className="h-11 flex-1" onClick={() => setKind(k)}>
                            {k === "COIN" ? "Coin" : "Bar"}
                        </Button>
                    ))}
                </div>
                {kind === "COIN" && (
                    <div className="space-y-1">
                        <Label htmlFor="ls-family">Coin family</Label>
                        <input id="ls-family" list="ls-families" className={field} placeholder="Krugerrand, Maple, Sovereign..." value={family} onChange={(e) => setFamily(e.target.value)} />
                        <datalist id="ls-families">
                            {families
                                .filter((f) => f !== "Bar")
                                .map((f) => (
                                    <option key={f} value={f} />
                                ))}
                        </datalist>
                    </div>
                )}
                <div className="space-y-1">
                    <Label htmlFor="ls-variant">{kind === "COIN" ? "Variant" : "Weight"}</Label>
                    <input id="ls-variant" className={field} placeholder={kind === "COIN" ? "1oz, 1/10oz, Full..." : "1oz, 100g, 1kg..."} value={variant} onChange={(e) => setVariant(e.target.value)} />
                </div>
                {kind === "BAR" && (
                    <div className="space-y-1">
                        <Label htmlFor="ls-ref">Refinery</Label>
                        <input id="ls-ref" className={field} placeholder="Valcambi, Metalor..." value={refinery} onChange={(e) => setRefinery(e.target.value)} />
                    </div>
                )}
                <div className="space-y-1">
                    <Label htmlFor="ls-qty">Count</Label>
                    <input id="ls-qty" inputMode="numeric" className={field} value={qty} onChange={(e) => setQty(digits(e.target.value))} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!valid}
                        onClick={() => {
                            onSave({ kind, family: kind === "BAR" ? "Bar" : family.trim(), variant: variant.trim(), refinery: refinery.trim().toUpperCase(), qty: n, reason: "Added by hand" })
                            onClose()
                        }}
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function TransferDialog({
    line,
    branches,
    onClose,
    onSave,
}: {
    line: LiveStockLine
    branches: LiveStockBranch[]
    onClose: () => void
    onSave: (v: { toBranchCode: string; qty: number; barIds: number[]; reason: string; note: string }) => void
}) {
    const others = branches.filter((b) => b.code !== line.branchCode)
    const [to, setTo] = useState(others[0]?.code ?? "")
    const [qty, setQty] = useState("1")
    const [bars, setBars] = useState<number[]>([])
    const [note, setNote] = useState("")
    const n = Number(qty)
    const valid = to !== "" && Number.isInteger(n) && n >= 1 && n <= line.qty && bars.length <= n
    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move {lineName(line)}</DialogTitle>
                    <DialogDescription>
                        From {line.branchCode}, which has {line.qty}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="ls-to">To branch</Label>
                        <select id="ls-to" className={field} value={to} onChange={(e) => setTo(e.target.value)}>
                            {others.map((b) => (
                                <option key={b.code} value={b.code}>
                                    {b.code} · {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="ls-tq">How many</Label>
                        <input id="ls-tq" inputMode="numeric" className={field} value={qty} onChange={(e) => setQty(digits(e.target.value))} />
                    </div>
                </div>
                {line.bars.length > 0 && (
                    <div className="space-y-1">
                        <Label>Serialled bars that travel</Label>
                        <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
                            {line.bars.map((b) => (
                                <label key={b.id} className="flex min-h-9 items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="size-5"
                                        checked={bars.includes(b.id)}
                                        onChange={(e) => setBars((cur) => (e.target.checked ? [...cur, b.id] : cur.filter((x) => x !== b.id)))}
                                    />
                                    <span className="font-mono">{b.serial}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                <Input aria-label="Note" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!valid}
                        onClick={() => {
                            onSave({ toBranchCode: to, qty: n, barIds: bars, reason: "Transfer", note })
                            onClose()
                        }}
                    >
                        Move
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function HistoryDialog({ line, canEdit, onClose, onUndo }: { line: LiveStockLine; canEdit: boolean; onClose: () => void; onUndo: (movementId: number) => void }) {
    const api = useLiveStockApi()
    const q = useQuery({ queryKey: queryKeys.liveStock.history(line.id), queryFn: () => api.history(line.id) })
    const rows = q.data ?? []
    const newest = rows[0]
    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Why {line.qty}?</DialogTitle>
                    <DialogDescription>
                        {lineName(line)} at {line.branchCode}. Newest first.
                    </DialogDescription>
                </DialogHeader>
                {q.isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
                {!q.isLoading && rows.length === 0 && <p className="text-muted-foreground text-sm">No changes recorded yet.</p>}
                <ul className="divide-y">
                    {rows.map((m) => (
                        <li key={m.id} className="flex items-start justify-between gap-3 py-2 text-sm">
                            <div className={m.undone ? "text-muted-foreground line-through" : ""}>
                                <div>
                                    <span className="font-semibold tabular-nums">{m.delta > 0 ? `+${m.delta}` : m.delta}</span> → {m.qtyAfter}
                                    <span className="text-muted-foreground"> · {m.source.toLowerCase().replace("_", " ")}</span>
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {m.actor} · {new Date(m.at).toLocaleString()}
                                    {m.reason ? ` · ${m.reason}` : ""}
                                    {m.note ? ` · ${m.note}` : ""}
                                </div>
                            </div>
                            {canEdit && newest?.id === m.id && !m.undone && m.source === "MANUAL" && !m.reference && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        onUndo(m.id)
                                        onClose()
                                    }}
                                >
                                    Undo
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    )
}
