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
const eur = (n: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

/**
 * Customers from the imported Zoho history and the tradesheets. Read only. The search text lives in this page's state
 * and travels in a POST body: a name is never put in the address bar, local storage or a request log.
 */
export default function CustomersPage() {
    const api = useCustomerRecordsApi()
    const [text, setText] = useState("")
    const [q, setQ] = useState("")
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => {
            setQ(text.trim())
            setOffset(0)
        }, 300)
        return () => clearTimeout(t)
    }, [text])

    const list = useQuery({ queryKey: ["customers", q, offset], queryFn: () => api.customers({ q: q || undefined, limit: PAGE, offset }), placeholderData: (prev) => prev })
    const total = list.data?.total ?? 0

    return (
        <BaseLayout title="Customers" description="History from Zoho and the tradesheets. Customer data stays inside Goldilocks.">
            <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-6">
                <Input type="search" aria-label="Search customers" placeholder="Search customers" className="max-w-sm" value={text} onChange={(e) => setText(e.target.value)} />
                <Card>
                    <CardContent className="pt-6">
                        {!list.data?.rows.length ? (
                            <p className="text-muted-foreground py-6 text-center text-sm">{list.isLoading ? "Loading..." : q ? "No customer matches." : "No customers imported yet."}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="text-right">Open orders</TableHead>
                                        <TableHead>Last order</TableHead>
                                        <TableHead className="text-right">Lifetime</TableHead>
                                        <TableHead>Since</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list.data.rows.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">
                                                <Link className="hover:underline" to={`/customers/${c.id}`}>
                                                    {c.name}
                                                </Link>
                                                {c.status && c.status !== "Active" && <span className="text-muted-foreground ml-2 text-xs">{c.status}</span>}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">{c.openOrders}</TableCell>
                                            <TableCell className="tabular-nums">{c.lastOrder ?? ""}</TableCell>
                                            <TableCell className="text-right tabular-nums">{c.lifetime ? eur(c.lifetime) : ""}</TableCell>
                                            <TableCell className="tabular-nums">{c.since ?? ""}</TableCell>
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
