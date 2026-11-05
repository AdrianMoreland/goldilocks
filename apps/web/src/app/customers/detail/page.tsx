import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useCustomerRecordsApi } from "@/api/customer-records.api"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountTabs } from "@/components/ui/count-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const eur = (n: number | null) => (n === null ? "" : new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n))

type Tab = "orders" | "invoices" | "payments" | "quotes"

const COLLECTED: Record<string, string> = { YES: "Collected", NO: "Not collected", PARTIAL: "Part collected" }

/** One customer: their sales, Zoho invoices, payments and quotes. Opened by number; nothing here is editable. */
export default function CustomerDetailPage() {
    const id = Number(useParams().id)
    const api = useCustomerRecordsApi()
    const [tab, setTab] = useState<Tab>("orders")
    const { data, isLoading, isError } = useQuery({ queryKey: ["customer", id], queryFn: () => api.customer(id), enabled: Number.isInteger(id) })

    const back = (
        <Button variant="ghost" size="sm" asChild>
            <Link to="/customers">
                <ArrowLeft className="size-4" /> Customers
            </Link>
        </Button>
    )

    if (isLoading) {
        return (
            <BaseLayout title="Customer" headerActions={() => back}>
                <Skeleton className="m-6 h-40" />
            </BaseLayout>
        )
    }
    if (isError || !data) {
        return (
            <BaseLayout title="Customer" headerActions={() => back}>
                <p className="text-muted-foreground p-6 text-sm">That customer was not found.</p>
            </BaseLayout>
        )
    }

    return (
        <BaseLayout title={data.name} description={data.zohoNumber ? `Zoho ${data.zohoNumber}` : undefined} headerActions={() => back}>
            <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(
                        [
                            ["Open orders", String(data.openOrders)],
                            ["Lifetime", data.lifetime ? eur(data.lifetime) : "-"],
                            ["Last order", data.lastOrder ?? "-"],
                            ["Customer since", data.since ?? "-"],
                        ] as const
                    ).map(([label, value]) => (
                        <Card key={label}>
                            <CardContent className="pt-6">
                                <div className="text-muted-foreground text-xs">{label}</div>
                                <div className="text-xl font-semibold tabular-nums">{value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <p className="text-muted-foreground text-xs">Customer data is kept inside Goldilocks only. Held items and history are not imported yet.</p>
                <CountTabs
                    aria-label="Customer records"
                    value={tab}
                    onValueChange={(v) => setTab(v as Tab)}
                    items={[
                        { value: "orders", label: "Orders", count: data.orders.length },
                        { value: "invoices", label: "Invoices", count: data.invoices.length },
                        { value: "payments", label: "Payments", count: data.payments.length },
                        { value: "quotes", label: "Quotes", count: data.quotes.length },
                    ]}
                />
                <Card>
                    <CardContent className="pt-6">
                        {tab === "orders" &&
                            (data.orders.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">No orders.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead>State</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.orders.map((o) => (
                                            <TableRow key={o.tradeId}>
                                                <TableCell>{o.reference}</TableCell>
                                                <TableCell className="tabular-nums">{o.date ?? ""}</TableCell>
                                                <TableCell>{o.productText}</TableCell>
                                                <TableCell className="text-right tabular-nums">{o.qty ?? ""}</TableCell>
                                                <TableCell>
                                                    <Badge variant={o.collected ? "secondary" : "outline"}>{o.collected ? "Collected" : o.state.replace(/_/g, " ").toLowerCase()}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ))}
                        {tab === "invoices" &&
                            (data.invoices.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">No invoices.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Collected</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.invoices.map((i) => (
                                            <TableRow key={i.id}>
                                                <TableCell>
                                                    <Link className="hover:underline" to={`/invoices/${i.id}`}>
                                                        {i.number}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="tabular-nums">{i.date ?? ""}</TableCell>
                                                <TableCell className="text-right tabular-nums">{eur(i.total)}</TableCell>
                                                <TableCell>{i.status ?? ""}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{i.collected ? COLLECTED[i.collected] : ""}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ))}
                        {tab === "payments" &&
                            (data.payments.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">No payments.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead>How</TableHead>
                                            <TableHead>Applied to</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.payments.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="tabular-nums">{p.date ?? ""}</TableCell>
                                                <TableCell className="text-right tabular-nums">{eur(p.amount)}</TableCell>
                                                <TableCell>{p.mode ?? ""}</TableCell>
                                                <TableCell>{p.invoiceNumber ?? ""}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ))}
                        {tab === "quotes" &&
                            (data.quotes.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">No quotes.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.quotes.map((q) => (
                                            <TableRow key={q.id}>
                                                <TableCell>{q.reference}</TableCell>
                                                <TableCell className="tabular-nums">{q.date ?? ""}</TableCell>
                                                <TableCell>{q.productText}</TableCell>
                                                <TableCell className="text-right tabular-nums">{q.qty ?? ""}</TableCell>
                                                <TableCell>{q.status.toLowerCase()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ))}
                    </CardContent>
                </Card>
            </div>
        </BaseLayout>
    )
}
