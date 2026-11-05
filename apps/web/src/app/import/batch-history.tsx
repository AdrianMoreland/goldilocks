import { useQuery } from "@tanstack/react-query"
import { useImportsApi } from "@/api/imports.api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/** The last workbook and report imports: file name, who, when, and the counts. No row data. */
export function BatchHistory() {
    const api = useImportsApi()
    const batches = useQuery({ queryKey: ["imports", "batches"], queryFn: () => api.batches() })
    if (!batches.data?.length) return null
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent imports</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File</TableHead>
                            <TableHead>When</TableHead>
                            <TableHead>By</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Added</TableHead>
                            <TableHead className="text-right">Changed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {batches.data.map((b) => {
                            const sum = (k: string) => Object.values(b.tableCounts ?? {}).reduce((n, t) => n + (t[k] ?? 0), 0)
                            return (
                                <TableRow key={b.id}>
                                    <TableCell className="max-w-64 truncate">{b.fileName}</TableCell>
                                    <TableCell>{new Date(b.importedAt).toLocaleString()}</TableCell>
                                    <TableCell>{b.importedBy}</TableCell>
                                    <TableCell>
                                        <Badge variant={b.status === "COMPLETE" ? "secondary" : "outline"}>{b.status === "COMPLETE" ? "Complete" : "Unfinished"}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">{sum("added").toLocaleString()}</TableCell>
                                    <TableCell className="text-right tabular-nums">{sum("changed").toLocaleString()}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
