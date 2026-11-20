import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AdjustLiveStockRequest, LiveStockBoard } from "@goldilocks/shared-types"
import { useLiveStockApi } from "@/api/live-stock.api"
import { queryKeys } from "@/lib/query-keys"

export function useBranches() {
    const api = useLiveStockApi()
    return useQuery({ queryKey: queryKeys.liveStock.branches, queryFn: api.branches })
}

const boardQuery = (api: ReturnType<typeof useLiveStockApi>, branch: string | undefined, metal: string) => ({
    queryKey: queryKeys.liveStock.board(branch ?? "", metal),
    queryFn: () => api.board({ branch: branch as string, metal: metal as "GOLD" | "SILVER" | "PGM" }),
    enabled: Boolean(branch),
    // Another person at the counter changes the same numbers: look again when the tab is refocused.
    refetchOnWindowFocus: true,
})

export function useBoard(branch: string | undefined, metal: string) {
    const api = useLiveStockApi()
    return useQuery(boardQuery(api, branch, metal))
}

/** Every branch's board for one metal (the branch list and the all-branches grid). Same keys as useBoard, so one cache. */
export function useAllBoards(codes: string[], metal: string) {
    const api = useLiveStockApi()
    return useQueries({ queries: codes.map((code) => boardQuery(api, code, metal)) })
}

/**
 * Every edit on the board. A count change shows at once and is rolled back if the server refuses it; the server's
 * answer then replaces it. A successful change offers Undo in its toast.
 */
export function useBoardMutations(branch: string, metal: string) {
    const api = useLiveStockApi()
    const qc = useQueryClient()
    const key = queryKeys.liveStock.board(branch, metal)
    const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.liveStock.all })
    // Toasts go to the top: the action and serial sheets rise from the bottom and a toast there would cover them.
    const at = { position: "top-center" } as const
    const fail = (e: Error) => toast.error(e.message, at)

    const undo = useMutation({
        mutationFn: (movementId: number) => api.undo(movementId),
        onSuccess: () => toast.success("Change undone", at),
        onError: fail,
        onSettled: refresh,
    })

    const adjust = useMutation({
        mutationFn: ({ lineId, body }: { lineId: number; body: AdjustLiveStockRequest; label: string }) => api.adjust(lineId, body),
        onMutate: async ({ lineId, body }) => {
            await qc.cancelQueries({ queryKey: key })
            const prev = qc.getQueryData<LiveStockBoard>(key)
            if (prev) {
                qc.setQueryData<LiveStockBoard>(key, {
                    ...prev,
                    lines: prev.lines.map((l) =>
                        l.id === lineId ? { ...l, qty: body.delta !== undefined ? Math.max(0, l.qty + body.delta) : (body.qty ?? l.qty) } : l,
                    ),
                })
            }
            return { prev }
        },
        onError: (e: Error, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(key, ctx.prev)
            fail(e)
        },
        onSuccess: (data, v) =>
            toast(`${v.label}: now ${data.qty}`, { ...at, action: { label: "Undo", onClick: () => undo.mutate(data.movementId) }, duration: 6000 }),
        onSettled: refresh,
    })

    const createLine = useMutation({ mutationFn: api.createLine, onSuccess: () => toast.success("Line added", at), onError: fail, onSettled: refresh })
    const transfer = useMutation({
        mutationFn: ({ lineId, body }: { lineId: number; body: Parameters<typeof api.transfer>[1] }) => api.transfer(lineId, body),
        onSuccess: () => toast.success("Transferred", at),
        onError: fail,
        onSettled: refresh,
    })
    const addBar = useMutation({
        mutationFn: ({ lineId, body }: { lineId: number; body: Parameters<typeof api.addBar>[1] }) => api.addBar(lineId, body),
        onSuccess: () => toast.success("Serial added", at),
        onError: fail,
        onSettled: refresh,
    })
    const barStatus = useMutation({
        mutationFn: ({ barId, body }: { barId: number; body: Parameters<typeof api.barStatus>[1] }) => api.barStatus(barId, body),
        onError: fail,
        onSettled: refresh,
    })
    /**
     * Saves the edit-mode draft: one count per line, one after another, so a refusal part-way leaves the rest unsaved
     * (the caller keeps those in the draft). One toast for the batch, whose Undo reverses every saved change.
     */
    const saveCounts = useMutation({
        mutationFn: async (changes: { lineId: number; qty: number }[]) => {
            const saved: { lineId: number; movementId: number }[] = []
            for (const c of changes) {
                try {
                    const r = await api.adjust(c.lineId, { qty: c.qty, reason: "Count edited" })
                    saved.push({ lineId: c.lineId, movementId: r.movementId })
                } catch (e) {
                    return { saved, error: e instanceof Error ? e : new Error(String(e)) }
                }
            }
            return { saved, error: null as Error | null }
        },
        onSuccess: ({ saved, error }) => {
            if (error) fail(new Error(`${saved.length} saved, then: ${error.message}`))
            if (saved.length === 0) return
            const undoAll = async () => {
                try {
                    for (const s of [...saved].reverse()) await api.undo(s.movementId)
                    toast.success("Changes undone", at)
                } catch (e) {
                    fail(e instanceof Error ? e : new Error(String(e)))
                } finally {
                    void refresh()
                }
            }
            toast(saved.length === 1 ? "1 count saved" : `${saved.length} counts saved`, { ...at, action: { label: "Undo", onClick: () => void undoAll() }, duration: 8000 })
        },
        onError: fail,
        onSettled: refresh,
    })
    return { adjust, undo, createLine, transfer, addBar, barStatus, saveCounts }
}
