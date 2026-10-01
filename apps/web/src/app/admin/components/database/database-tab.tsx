import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Lock, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react"
import type { DbColumn, DbRowsResponse } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { Panel, PanelEmpty } from "../panel"
import { formatBytes, formatCount } from "../../lib/format"

const PAGE_SIZE = 50

type Row = Record<string, unknown>

// Set by the database itself; never worth showing a field for.
const AUTO_COLUMNS = new Set(["createdAt", "updatedAt"])

const isNumeric = (c: DbColumn) => /^(integer|bigint|smallint|numeric|double|real)/.test(c.type)
const isBoolean = (c: DbColumn) => c.type === "boolean"
const isJson = (c: DbColumn) => c.type === "json" || c.type === "jsonb"
const isLongText = (c: DbColumn) => c.type === "text" && ["markdown", "description", "answer", "errorMessage"].includes(c.name)

function cellText(value: unknown): string {
    if (value === null || value === undefined) return ""
    if (typeof value === "object") return JSON.stringify(value)
    return String(value as string | number | boolean)
}

function Cell({ value }: { value: unknown }) {
    if (value === null || value === undefined) return <span className="text-muted-foreground/70 text-[11px]">NULL</span>
    if (typeof value === "boolean") return <span className={value ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}>{String(value)}</span>
    const text = cellText(value)
    return (
        <span className={cn("block max-w-72 truncate", typeof value === "number" && "tabular-nums")} title={text}>
            {text}
        </span>
    )
}

export function DatabaseTab() {
    const api = useAdminApi()
    const tables = useQuery({ queryKey: queryKeys.admin.dbTables, queryFn: api.getDbTables })
    const [table, setTable] = React.useState<string | null>(null)

    const active = table ?? tables.data?.tables.find((t) => t.name === "products")?.name ?? tables.data?.tables[0]?.name ?? null

    return (
        <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <Panel title="Tables" description={tables.data ? `${tables.data.tables.length} in the public schema` : undefined}>
                {tables.isLoading ? (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 8 }, (_, i) => (
                            <Skeleton key={i} className="h-9" />
                        ))}
                    </div>
                ) : tables.isError ? (
                    <PanelEmpty>Couldn&apos;t load the tables.</PanelEmpty>
                ) : (
                    <ul className="-mx-1 flex flex-col">
                        {tables.data?.tables.map((t) => (
                            <li key={t.name}>
                                <button
                                    type="button"
                                    onClick={() => setTable(t.name)}
                                    aria-current={active === t.name}
                                    className={cn(
                                        "hover:bg-muted/60 focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-[3px]",
                                        active === t.name && "bg-muted font-medium",
                                    )}
                                >
                                    <span className="min-w-0 flex-1 truncate font-mono text-xs">{t.name}</span>
                                    {!t.writable && <Lock className="text-muted-foreground size-3 shrink-0" aria-label="Read-only" />}
                                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{formatCount(t.rows)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-muted-foreground text-xs">
                    <Lock className="mr-1 inline size-3" />
                    Read-only tables can be browsed but not changed here. Staff accounts are managed with Add user so they stay in step with sign-in.
                </p>
            </Panel>

            {active ? <TableView key={active} table={active} size={tables.data?.tables.find((t) => t.name === active)?.bytes} /> : <Skeleton className="h-96 rounded-xl" />}
        </div>
    )
}

function TableView({ table, size }: { table: string; size?: number }) {
    const api = useAdminApi()
    const queryClient = useQueryClient()
    const [page, setPage] = React.useState(1)
    const [sort, setSort] = React.useState("")
    const [dir, setDir] = React.useState<"asc" | "desc">("desc")
    const [search, setSearch] = React.useState("")
    const q = React.useDeferredValue(search.trim())
    const [editing, setEditing] = React.useState<{ mode: "insert" } | { mode: "edit"; row: Row } | null>(null)
    const [deleting, setDeleting] = React.useState<Row | null>(null)

    const rows = useQuery({
        queryKey: queryKeys.admin.dbRows(table, page, sort, dir, q),
        queryFn: () => api.getDbRows(table, page, sort, dir, q, PAGE_SIZE),
        placeholderData: (previous) => previous,
    })
    const data = rows.data

    React.useEffect(() => setPage(1), [q, sort, dir])

    const afterWrite = () => {
        void queryClient.invalidateQueries({ queryKey: ["admin", "db"] })
        void queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview })
        void queryClient.invalidateQueries({ queryKey: queryKeys.admin.audit })
        // The dashboard reads these tables through its own queries.
        void queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
    }

    const toggleSort = (name: string) => {
        if (sort === name) setDir((d) => (d === "asc" ? "desc" : "asc"))
        else {
            setSort(name)
            setDir("asc")
        }
    }

    const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1
    const writable = data?.writable ?? false
    const pkColumns = data?.columns.filter((c) => c.isPrimaryKey) ?? []

    return (
        <Panel
            title={table}
            description={data ? `${formatCount(data.total)} ${data.total === 1 ? "row" : "rows"}${size !== undefined ? ` · ${formatBytes(size)}` : ""}${writable ? "" : " · read-only"}` : undefined}
            action={
                writable && (
                    <Button size="sm" className="cursor-pointer" onClick={() => setEditing({ mode: "insert" })}>
                        <Plus /> Insert row
                    </Button>
                )
            }
        >
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-48 flex-1">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                    <Input placeholder="Search every column" aria-label={`Search ${table}`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
                </div>
                <Button size="icon" variant="outline" className="cursor-pointer" aria-label="Refresh" title="Refresh" onClick={() => void rows.refetch()}>
                    <RefreshCw className={cn(rows.isFetching && "animate-spin")} />
                </Button>
            </div>

            {rows.isError ? (
                <PanelEmpty>Couldn&apos;t load this table.</PanelEmpty>
            ) : !data ? (
                <Skeleton className="h-80" />
            ) : data.rows.length === 0 ? (
                <PanelEmpty>{q ? "No rows match that search." : "This table is empty."}</PanelEmpty>
            ) : (
                <div className={cn("max-h-[30rem] overflow-auto rounded-lg border", rows.isFetching && "opacity-70")}>
                    <table className="w-full border-collapse text-left text-xs">
                        <thead className="bg-muted sticky top-0 z-10">
                            <tr>
                                {writable && <th className="w-16 px-2 py-2" aria-label="Actions" />}
                                {data.columns.map((c) => (
                                    <th key={c.name} className="px-3 py-2 font-semibold whitespace-nowrap">
                                        <button type="button" className="focus-visible:ring-ring/50 flex cursor-pointer items-center gap-1 rounded outline-none focus-visible:ring-[3px]" onClick={() => toggleSort(c.name)}>
                                            {c.name}
                                            {c.isPrimaryKey && <span className="text-primary-text text-[11px]">PK</span>}
                                            {sort === c.name && (dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
                                        </button>
                                        <div className="text-muted-foreground text-[11px] font-normal">{c.type.replace(/"/g, "")}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row, i) => (
                                <tr key={pkColumns.map((c) => cellText(row[c.name])).join("|") || i} className="hover:bg-muted/40 border-t">
                                    {writable && (
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <Button variant="ghost" size="icon" className="size-7 cursor-pointer" aria-label="Edit row" title="Edit row" onClick={() => setEditing({ mode: "edit", row })}>
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive size-7 cursor-pointer" aria-label="Delete row" title="Delete row" onClick={() => setDeleting(row)}>
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </td>
                                    )}
                                    {data.columns.map((c) => (
                                        <td key={c.name} className="px-3 py-1.5 whitespace-nowrap">
                                            <Cell value={row[c.name]} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data && (
                <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground tabular-nums">
                        Page {data.page} of {pages}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="cursor-pointer" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                            <ChevronLeft /> Previous
                        </Button>
                        <Button variant="outline" size="sm" className="cursor-pointer" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                            Next <ChevronRight />
                        </Button>
                    </div>
                </div>
            )}

            {data && editing && <RowEditor table={table} data={data} state={editing} onClose={() => setEditing(null)} onSaved={afterWrite} />}
            {data && deleting && <DeleteRow table={table} data={data} row={deleting} onClose={() => setDeleting(null)} onDeleted={afterWrite} />}
        </Panel>
    )
}

function keyOf(data: DbRowsResponse, row: Row): Record<string, string | number> {
    const key: Record<string, string | number> = {}
    for (const c of data.columns.filter((col) => col.isPrimaryKey)) key[c.name] = row[c.name] as string | number
    return key
}

function RowEditor({
    table,
    data,
    state,
    onClose,
    onSaved,
}: {
    table: string
    data: DbRowsResponse
    state: { mode: "insert" } | { mode: "edit"; row: Row }
    onClose: () => void
    onSaved: () => void
}) {
    const api = useAdminApi()
    const isEdit = state.mode === "edit"
    const original = isEdit ? state.row : null
    const columns = data.columns.filter((c) => !c.readOnly && !AUTO_COLUMNS.has(c.name) && !(isEdit && c.isPrimaryKey) && !(!isEdit && c.isPrimaryKey && c.hasDefault))

    const [values, setValues] = React.useState<Record<string, string>>(() =>
        Object.fromEntries(columns.map((c) => [c.name, original ? cellText(original[c.name]) : ""])),
    )
    const [problem, setProblem] = React.useState<string | null>(null)

    const save = useMutation({
        mutationFn: async () => {
            const changes: Record<string, unknown> = {}
            for (const c of columns) {
                const raw = values[c.name] ?? ""
                if (original && raw === cellText(original[c.name])) continue
                if (raw === "") {
                    if (original || c.nullable) changes[c.name] = null // clearing on edit, or an explicit NULL on insert
                    else if (!c.hasDefault) throw new Error(`${c.name} is required.`)
                    continue
                }
                if (isNumeric(c) && Number.isNaN(Number(raw))) throw new Error(`${c.name} must be a number.`)
                if (isJson(c)) {
                    try {
                        changes[c.name] = JSON.parse(raw)
                        continue
                    } catch {
                        throw new Error(`${c.name} must be valid JSON.`)
                    }
                }
                changes[c.name] = isBoolean(c) ? raw === "true" : raw
            }
            if (original) {
                if (Object.keys(changes).length === 0) throw new Error("Nothing was changed.")
                return api.updateDbRow(table, keyOf(data, original), changes)
            }
            return api.insertDbRow(table, changes)
        },
        onSuccess: () => {
            toast.success(isEdit ? "Row updated" : "Row added")
            onSaved()
            onClose()
        },
        onError: (error) => setProblem(error instanceof Error ? error.message : "Couldn't save the row."),
    })

    return (
        <Sheet open onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{isEdit ? `Edit row in ${table}` : `Insert row into ${table}`}</SheetTitle>
                    <SheetDescription>
                        {isEdit ? "Only the fields you change are sent." : "Leave a field empty to use its default."} This writes to the live database.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-2">
                    {columns.map((c) => (
                        <FieldInput key={c.name} column={c} value={values[c.name] ?? ""} onChange={(v) => setValues((prev) => ({ ...prev, [c.name]: v }))} />
                    ))}
                </div>

                <SheetFooter>
                    {problem && (
                        <p role="alert" className="text-destructive text-sm">
                            {problem}
                        </p>
                    )}
                    <div className="flex gap-2">
                        <Button className="cursor-pointer" disabled={save.isPending} onClick={() => { setProblem(null); save.mutate() }}>
                            {isEdit ? "Save changes" : "Insert row"}
                        </Button>
                        <Button variant="outline" className="cursor-pointer" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function FieldInput({ column, value, onChange }: { column: DbColumn; value: string; onChange: (v: string) => void }) {
    const id = `field-${column.name}`
    const hint = [column.type.replace(/"/g, ""), column.nullable ? "optional" : column.hasDefault ? "has default" : "required"].join(", ")

    let control: React.ReactNode
    if (column.enumValues || isBoolean(column)) {
        const options = column.enumValues ?? ["true", "false"]
        control = (
            <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="border-input bg-background h-9 rounded-md border px-2 text-sm">
                <option value="">{column.nullable || column.hasDefault ? "(empty)" : "Choose…"}</option>
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        )
    } else if (isJson(column) || isLongText(column)) {
        control = <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} className={cn("min-h-24 text-xs", isJson(column) && "font-mono")} />
    } else {
        control = <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} inputMode={isNumeric(column) ? "decimal" : undefined} />
    }

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-[13px] font-semibold">
                {column.name} <span className="text-muted-foreground font-normal">{hint}</span>
            </label>
            {control}
        </div>
    )
}

function DeleteRow({ table, data, row, onClose, onDeleted }: { table: string; data: DbRowsResponse; row: Row; onClose: () => void; onDeleted: () => void }) {
    const api = useAdminApi()
    const [typed, setTyped] = React.useState("")
    const key = keyOf(data, row)
    const label = Object.entries(key).map(([k, v]) => `${k} ${String(v)}`).join(", ")

    const remove = useMutation({
        mutationFn: () => api.deleteDbRow(table, key),
        onSuccess: () => {
            toast.success("Row deleted")
            onDeleted()
            onClose()
        },
    })

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete this row?</DialogTitle>
                    <DialogDescription>
                        {table} · {label}. This removes it from the live database for good. For a product, setting its deletedAt or isActive is reversible; deleting the row is not.
                    </DialogDescription>
                </DialogHeader>
                <label className="flex flex-col gap-1">
                    <span className="text-[13px] font-semibold">Type delete to confirm</span>
                    <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus autoComplete="off" />
                </label>
                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" className="cursor-pointer" disabled={typed.trim().toLowerCase() !== "delete" || remove.isPending} onClick={() => remove.mutate()}>
                        Delete row
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
