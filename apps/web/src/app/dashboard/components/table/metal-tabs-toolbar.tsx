import { ChevronDown, Columns2, Plus } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DisplayProduct } from "./product-grouping"
import { productColumnLabels } from "./product-columns"
import {METAL_TABS, MetalTabValue} from "./metal-tabs"

interface MetalTabsToolbarProps {
    table: Table<DisplayProduct>
    selectedTab: MetalTabValue
    onSelectedTabChange: (tab: MetalTabValue) => void
}

export function MetalTabsToolbar({ table, selectedTab, onSelectedTabChange }: MetalTabsToolbarProps) {
    return (
        <div className="flex items-center justify-between px-4 lg:px-6 flex-wrap gap-3">
            <Label htmlFor="view-selector" className="sr-only">View</Label>

            <Select value={selectedTab} onValueChange={(v) => onSelectedTabChange(v as MetalTabValue)}>
                <SelectTrigger className="flex w-fit sm:hidden cursor-pointer" size="sm" id="view-selector">
                    <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                    {METAL_TABS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <TabsList className="hidden sm:flex">
                {METAL_TABS.map(({ value, label }) => (
                    <TabsTrigger key={value} value={value} className="cursor-pointer">
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            <Columns2 />
                            <span className="hidden lg:inline">Customize Columns</span>
                            <span className="lg:hidden">Columns</span>
                            <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {productColumnLabels[column.id] ?? column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" className="cursor-pointer">
                    <Plus />
                    <span className="hidden lg:inline">Add Section</span>
                </Button>
            </div>
        </div>
    )
}