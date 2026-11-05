import { useState } from "react"
import { StatusDot } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export interface CloseItem {
    label: string
    count: number
    /** Called to look at those orders: switches the page to the queue or tab. */
    open: () => void
}

/** A go / no-go list for the end of the day. Open items never block closing; each goes into the note for the next person. */
export function CloseDayDialog({ items, open, onClose, onSave, busy }: { items: CloseItem[]; open: boolean; onClose: () => void; onSave: (note: string) => void; busy: boolean }) {
    const summary = items.filter((i) => i.count).map((i) => `${i.label}: ${i.count}`).join(". ")
    const [note, setNote] = useState("")
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Close the day</DialogTitle>
                    <DialogDescription>Open items do not block closing. Each one is handed to the next person.</DialogDescription>
                </DialogHeader>
                <div className="divide-y">
                    {items.map((i) => (
                        <div key={i.label} className="flex items-center justify-between gap-3 py-2 text-sm">
                            <span className="inline-flex items-center gap-2">
                                <StatusDot tone={i.count ? "warn" : "ok"} />
                                {i.label}
                            </span>
                            <span className="flex items-center gap-3">
                                <b className="tabular-nums">{i.count}</b>
                                {i.count > 0 && (
                                    <button type="button" className="text-xs underline underline-offset-2" onClick={() => { i.open(); onClose() }}>
                                        Open
                                    </button>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
                <label className="grid gap-1 text-sm font-medium">
                    Note for the next person
                    <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={summary ? `${summary}.` : "Anything they should know"} />
                </label>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={busy} onClick={() => onSave(note.trim() || (summary ? `${summary}.` : "All clear."))}>
                        Save handover and close the day
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
