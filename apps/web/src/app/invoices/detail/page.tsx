import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useCustomerRecordsApi } from "@/api/customer-records.api"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const eur = (n: number | null) => (n === null ? "" : new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n))
const LINK_LABELS: Record<string, string> = { invoice_line_trade: "Sale on the tradesheet" }

/**
 * One Zoho invoice: lines with serials and where each says it was collected, payments, and the sale each line was
 * matched to. A collected note is evidence, not proof. Nothing here is editable.
 */
export default function InvoiceDetailPage() {
    const id = Number(useParams().id)
    const api = useCustomerRecordsApi()
    const { data, isLoading, isError } = useQuery({ queryKey: ["invoice", id], queryFn: () => api.invoice(id), enabled: Number.isInteger(id) })

    const back = (
        <Button variant="ghost" size="sm" asChild>
            <Link to="/invoices">
                <ArrowLeft className="size-4" /> Invoices
            </Link>
        </Button>
    )

    if (isLoading) {
        return (
            <BaseLayout title="Invoice" headerActions={() => back}>
                <Skeleton className="m-6 h-40" />
            </BaseLayout>
        )
    }
    if (isError || !data) {
        return (
            <BaseLayout title="Invoice" headerActions={() => back}>
                <p className="text-muted-foreground p-6 text-sm">That invoice was not found.</p>
            </BaseLayout>
        )
    }

    return (
        <BaseLayout title={data.number} headerActions={() => back}>
            <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    {data.customerId && data.customerName && (
                        <Link className="font-medium hover:underline" to={`/customers/${data.customerId}`}>
                            {data.customerName}
                        </Link>
                    )}
                    <span className="text-muted-foreground tabular-nums">{data.date ?? ""}</span>
                    <span className="font-semibold tabular-nums">{eur(data.total)}</span>
                    {data.status && <Badge variant="outline">{data.status}</Badge>}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Serials</TableHead>
                                    <TableHead>Collected</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.lines.map((l) => (
                                    <TableRow key={l.id}>
                                        <TableCell className="font-medium">
                                            {l.product}
                                            {l.refinery && <span className="text-muted-foreground ml-2 text-xs">{l.refinery}</span>}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">{l.qty ?? ""}</TableCell>
                                        <TableCell className="text-right tabular-nums">{eur(l.lineTotal)}</TableCell>
                                        <TableCell>
                                            {l.serials.length ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {l.serials.map((s) => (
                                                        <span key={s} className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">none recorded</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {l.collectedFlag === "YES" ? `Collected${l.collectedDate ? ` ${l.collectedDate}` : ""}` : l.collectedFlag === "NO" ? "Not collected" : l.collectedFlag === "CHECK" ? "Check" : ""}
                                            {l.deliveredBrinks && <span className="text-muted-foreground ml-2 text-xs">delivered by Brinks</span>}
                                            {l.soldBack && <span className="text-muted-foreground ml-2 text-xs">sold back</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {data.payments.length === 0 && <p className="text-muted-foreground">No payments recorded.</p>}
                            {data.payments.map((p) => (
                                <div key={p.id} className="flex justify-between">
                                    <span>
                                        {eur(p.amount)} {p.mode ? `by ${p.mode.toLowerCase()}` : ""}
                                    </span>
                                    <span className="text-muted-foreground tabular-nums">{p.date ?? ""}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {data.links.length === 0 && <p className="text-muted-foreground">No sale matched yet.</p>}
                            {data.links.map((l, i) => (
                                <div key={i} className="flex items-center justify-between gap-3">
                                    <span>
                                        {LINK_LABELS[l.linkType] ?? l.linkType}
                                        <br />
                                        <span className="text-muted-foreground text-xs">{l.trade}</span>
                                    </span>
                                    <Badge variant={l.status === "CONFIRMED" ? "secondary" : "outline"}>{l.status === "CONFIRMED" ? "Confirmed" : "Probable, not confirmed"}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BaseLayout>
    )
}
