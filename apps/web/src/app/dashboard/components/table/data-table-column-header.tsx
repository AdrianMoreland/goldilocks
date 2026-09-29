import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, Check, ChevronsUpDown, ListRestart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

/**
 * Sortable column header — a menu with ascending, descending and "Default
 * order". Default order is the catalogue's own order (bars lightest to
 * heaviest, coins heaviest to lightest, within their sections — see
 * buildDisplayProducts); picking it just clears this column's sort.
 */
export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    const sorted = column.getIsSorted()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn("type-table-head -ml-3 h-8 cursor-pointer text-base font-bold hover:bg-accent data-[state=open]:bg-accent", className)}
                    aria-label={`Sort by ${title}${sorted ? `, currently ${sorted === "asc" ? "ascending" : "descending"}` : ""}`}
                >
                    <span>{title}</span>
                    {sorted === "desc" ? (
                        <ArrowDown className="ml-1 h-3.5 w-3.5" />
                    ) : sorted === "asc" ? (
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                    ) : (
                        <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem className="cursor-pointer" onClick={() => column.toggleSorting(false)}>
                    <ArrowUp /> Ascending
                    {sorted === "asc" && <Check className="ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => column.toggleSorting(true)}>
                    <ArrowDown /> Descending
                    {sorted === "desc" && <Check className="ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer items-start" onClick={() => column.clearSorting()}>
                    <ListRestart className="mt-0.5" />
                    <span className="flex flex-col">
                        <span>Default order</span>
                        <span className="text-muted-foreground text-xs">Bars light → heavy, coins heavy → light</span>
                    </span>
                    {!sorted && <Check className="ml-auto" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
