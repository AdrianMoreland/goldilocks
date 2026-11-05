import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useCustomerRecordsApi } from "@/api/customer-records.api"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const PAGE = 50
const STATUSES = ["Closed", "Draft", "Overdue", "Void"]
const COLLECTED: Record<string, string> = { YES: "Collected", NO: "Not collected", PARTIAL: "Part collected" }
const eur = (n: number | null) => (n === null ? "" : new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n))

/**
 * Zoho invoice history. Read only. Search by invoice number, customer or serial; the text travels in a POST body and
 * never reaches the address bar. Before 1 September 2026 invoices are Zoho's; later sales live in Business Central.
 */
export default function InvoicesPage() {
    const api = useCustomerRecordsApi()
    const [text, setText] = useState("")
    const [q, setQ] = useState("")
    const [status, setStatus] = useState("")
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => {
            setQ(text.trim())
            setOffset(0)
        }, 300)
        return () => clearTimeout(t)
    }, [text])

    const list = useQuery({
        queryKey: ["invoices", q, status, offset],
        queryFn: () => api.invoices({ q: q || undefined, status: status || undefined, limit: PAGE, offset }),
        placeholderData: (prev) => prev,
    })
    const total = list.data?.total ?? 0

    return (
        <BaseLayout title="Invoices" description="Zoho invoice history. Before 1 September 2026 invoices come from Zoho; later sales are in Business Central.">
            <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap gap-3">
                    <Input type="search" aria-label="Search invoices" placeholder="Search invoice, customer, serial" className="max-w-sm" value={text} onChange={(e) => setText(e.target.value)} />
                    <select
                        aria-label="Status"
                        className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                            setOffset(0)
                        }}
                    >
                        <option value="">Any status</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        {!list.data?.rows.length ? (
                            <p className="text-muted-foreground py-6 text-center text-sm">{list.isLoading ? "Loading..." : q || status ? "No invoice matches." : "No invoices imported yet."}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Collected</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list.data.rows.map((i) => (
                                        <TableRow key={i.id}>
                                            <TableCell>
                                                <Link className="hover:underline" to={`/invoices/${i.id}`}>
                                                    {i.number}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {i.customerId && i.customerName ? (
                                                    <Link className="hover:underline" to={`/customers/${i.customerId}`}>
                                                        {i.customerName}
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted-foreground">{i.customerName ?? ""}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="tabular-nums">{i.date ?? ""}</TableCell>
                                            <TableCell className="text-right tabular-nums">{eur(i.total)}</TableCell>
                                            <TableCell>{i.status ?? ""}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{i.collected ? COLLECTED[i.collected] : ""}</TableCell>
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
        </BaseLayout>
    )
}
