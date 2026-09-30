import { Search, X } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { CustomizeColumnsMenu } from "./customize-columns-menu"
import type { DisplayProduct } from "./product-grouping"
import { PRODUCT_TYPE_OPTIONS, PRICE_BUCKET_OPTIONS } from "./product-columns"

interface ProductFilterBarProps {
    table: Table<DisplayProduct>
    search: string
    onSearchChange: (value: string) => void
    isFiltered: boolean
    onResetFilters: () => void
}

/** Search + faceted filters + the columns menu, above the product table. Search input has a stable id so the global "/" shortcut can focus it without prop-drilling a ref. */
export function ProductFilterBar({
    table,
    search,
    onSearchChange,
    isFiltered,
    onResetFilters,
}: ProductFilterBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
            <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="product-search-input"
                    placeholder="Search name or SKU… (/)"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            onSearchChange("")
                            e.currentTarget.blur()
                        }
                    }}
                    className="h-8 cursor-text pl-8"
                />
            </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Search by product name or SKU. Press / from anywhere to jump here, Esc to clear.</TooltipContent>
            </Tooltip>

            <DataTableFacetedFilter column={table.getColumn("productType")} title="Type" options={PRODUCT_TYPE_OPTIONS} />
            <DataTableFacetedFilter column={table.getColumn("priceBucket")} title="Price" options={PRICE_BUCKET_OPTIONS} />

            {isFiltered && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 cursor-pointer px-2" onClick={onResetFilters}>
                            Reset
                            <X />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Clear the search and every filter</TooltipContent>
                </Tooltip>
            )}

            <div className="ml-auto">
                <CustomizeColumnsMenu table={table} />
            </div>
        </div>
    )
}
