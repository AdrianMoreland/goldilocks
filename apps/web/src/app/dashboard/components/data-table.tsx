"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CircleCheckBig,
    EllipsisVertical,
    GripVertical,
    Columns2,
    Loader,
    Plus,
    TrendingUp,
} from "lucide-react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type Row,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import {toast} from "sonner"

import type {Product} from "../../../lib/types.ts"

import {useIsMobile} from "@/hooks/use-mobile"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { TableCellViewer } from "./table-cell-viewer";


const formatEuro = (value: number) =>
    new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
    }).format(value)

const formatPercent = (value: number) =>
    `${(value * 100).toFixed(2)}%`

// Create a separate component for the drag handle
function DragHandle({id}: { id: number }) {
    const {attributes, listeners} = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent cursor-move"
        >
            <GripVertical className="text-muted-foreground size-3"/>
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

const columns: ColumnDef<Product>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({row}) => <DragHandle id={row.original.id}/>,
    },
    {
        id: "select",
        header: ({table}) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({row}) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "metalType",
        header: "Metal",
        cell: ({row}) => `${row.original.metalType}`,
    },
    {
        accessorKey: "weight",
        header: "Weight",
        cell: ({row}) => (
            <div className="w-16">
                <div className="text-base font-semibold text-foreground">
                    {row.original.weight}g
                </div>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Product",
        cell: ({row}) => {
            return <TableCellViewer item={row.original}/>
        },
        enableHiding: false,
    },
    {
        accessorKey: "priceSell",
        header: "Sell Price",
        cell: ({row}) => (
            <div className="w-16">
                <div className="text-base font-bold text-green-300 tabular-nums">
                    {formatEuro(row.original.priceSell)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "spreadSell",
        header: "Premium",
        cell: ({row}) => (
            <div className="w-24">
                <Badge variant="outline" className="text-foreground px-3 font-bold">
                    {row.original.spreadSell === 7 ? (
                        <CircleCheckBig className="text-green-500 dark:text-green-400"/>
                    ) : (
                        <Loader/>
                    )}
                    {formatPercent(row.original.spreadSell)}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "priceBuy",
        header: "Buy Price",
        cell: ({row}) => (
            <div className="w-16">
                <div className="text-base font-bold text-blue-300 tabular-nums">
                    {formatEuro(row.original.priceBuy)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "spreadBuy",
        header: "Discount",
        cell: ({row}) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.spreadBuy === 7 ? (
                    <CircleCheckBig className="text-green-500 dark:text-green-400"/>
                ) : (
                    <Loader/>
                )}
                {formatPercent(row.original.spreadBuy)}
            </Badge>
        ),
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
                        size="icon"
                    >
                        <EllipsisVertical/>
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

function DraggableRow({row}: { row: Row<Product> }) {
    const {transform, transition, setNodeRef, isDragging} = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell
                    key={cell.id}
                    className="px-4 py-2"
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable({
                              data: initialData,
                          }: {
    data: Product[]
    pastPerformanceData?: Product[]
    keyPersonnelData?: Product[]
    focusDocumentsData?: Product[]
}) {
    const [data, setData] = React.useState<Product[]>(initialData)

    React.useEffect(() => {
        if (initialData?.length) {
            setData(initialData)
        }
    }, [initialData])

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [selectedMetal, setSelectedMetal] = React.useState("gold")
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({id}) => id) || [],
        [data]
    )

    const filteredData = React.useMemo(() => {
        switch (selectedMetal) {
            case "gold":
                return data.filter(p => p.metalType === "GOLD")

            case "silver":
                return data.filter(p => p.metalType === "SILVER")

            case "platinum":
                return data.filter(p => p.metalType === "PLATINUM")

            case "palladium":
                return data.filter(p => p.metalType === "PALLADIUM")

            default:
                return data
        }
    }, [data, selectedMetal])


    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }


    return (
        <Tabs
            defaultValue="gold"
            value={selectedMetal}
            onValueChange={setSelectedMetal}
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6 flex-wrap gap-3">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="gold">
                    <SelectTrigger
                        className="flex w-fit sm:hidden cursor-pointer"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="palladium">Palladium</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList
                    className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 sm:flex">
                    <TabsTrigger value="gold" className="cursor-pointer">Gold</TabsTrigger>
                    <TabsTrigger value="silver" className="cursor-pointer">
                        Silver <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="platinum" className="cursor-pointer">
                        Platinum <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="palladium" className="cursor-pointer">Palladium</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="cursor-pointer">
                                <Columns2/>
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <ChevronDown/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        <Plus/>
                        <span className="hidden lg:inline">Add Section</span>
                    </Button>
                </div>
            </div>
            <TabsContent
                value="gold"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className="px-4 py-2"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row}/>
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                </div>
            </TabsContent>

        </Tabs>
    )
}



/*
  // -----------------------------
// 1. CREATE COLUMN FACTORIES
// -----------------------------
// Gold has NO VAT column
    const createColumns = (
        showVatExcl: boolean
    ): ColumnDef<Product>[] => {
        const baseColumns: ColumnDef<Product>[] = [
            {
                id: "drag",
                header: () => null,
                cell: ({ row }) => <DragHandle id={row.original.id} />,
            },
            {
                id: "select",
                header: ({ table }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && "indeterminate")
                            }
                            onCheckedChange={(value) =>
                                table.toggleAllPageRowsSelected(!!value)
                            }
                            aria-label="Select all"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                        />
                    </div>
                ),
            },
            {
                accessorKey: "metalType",
                header: "Metal",
                cell: ({ row }) => row.original.metalType,
            },
            {
                accessorKey: "weight",
                header: "Weight",
                cell: ({ row }) => (
                    <div className="w-16 font-semibold">
                        {row.original.weight}g
                    </div>
                ),
            },
            {
                accessorKey: "name",
                header: "Product",
                cell: ({ row }) => (
                    <TableCellViewer item={row.original} />
                ),
            },
            {
                accessorKey: "priceSell",
                header: "Sell Price",
                cell: ({ row }) => (
                    <div className="w-24">
                        <div className="text-base font-bold text-green-300 tabular-nums">
                            {formatEuro(row.original.priceSell)}
                        </div>
                    </div>
                ),
            },

            // -----------------------------
            // VAT COLUMN ONLY FOR NON-GOLD
            // -----------------------------
            ...(showVatExcl
                ? [
                    {
                        accessorKey: "priceVatExcl",
                        header: "VAT Excl.",
                        cell: ({ row }: { row: Row<Product> }) => {
                            // Example VAT calculation
                            const vatExcluded =
                                row.original.priceSell / 1.23

                            return (
                                <div className="w-24">
                                    <div className="text-sm font-medium text-orange-300 tabular-nums">
                                        {formatEuro(vatExcluded)}
                                    </div>
                                </div>
                            )
                        },
                    } as ColumnDef<Product>,
                ]
                : []),

            {
                accessorKey: "spreadSell",
                header: "Premium",
                cell: ({ row }) => (
                    <div className="w-24">
                        <Badge
                            variant="outline"
                            className="text-foreground px-3 font-bold"
                        >
                            {formatPercent(row.original.spreadSell)}
                        </Badge>
                    </div>
                ),
            },
            {
                accessorKey: "priceBuy",
                header: "Buy Price",
                cell: ({ row }) => (
                    <div className="w-24">
                        <div className="text-base font-bold text-blue-300 tabular-nums">
                            {formatEuro(row.original.priceBuy)}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "spreadBuy",
                header: "Discount",
                cell: ({ row }) => (
                    <Badge
                        variant="outline"
                        className="text-muted-foreground px-1.5"
                    >
                        {formatPercent(row.original.spreadBuy)}
                    </Badge>
                ),
            },
        ]

        return baseColumns
    }

    // -----------------------------
// 2. FILTER PRODUCTS BY METAL
// -----------------------------
    const goldData = React.useMemo(
        () =>
            data.filter(
                (item) =>
                    item.metalType.toLowerCase() === "gold"
            ),
        [data]
    )

    const silverData = React.useMemo(
        () =>
            data.filter(
                (item) =>
                    item.metalType.toLowerCase() === "silver"
            ),
        [data]
    )

    const platinumData = React.useMemo(
        () =>
            data.filter(
                (item) =>
                    item.metalType.toLowerCase() === "platinum"
            ),
        [data]
    )

    const palladiumData = React.useMemo(
        () =>
            data.filter(
                (item) =>
                    item.metalType.toLowerCase() === "palladium"
            ),
        [data]
    )


    /* // Create separate table instances for each tab
    const pastPerformanceIds = React.useMemo<UniqueIdentifier[]>(
      () => pastPerformance?.map(({ id }) => id) || [],
      [pastPerformance]
    )

    const keyPersonnelIds = React.useMemo<UniqueIdentifier[]>(
      () => keyPersonnel?.map(({ id }) => id) || [],
      [keyPersonnel]
    )

    const focusDocumentsIds = React.useMemo<UniqueIdentifier[]>(
      () => focusDocuments?.map(({ id }) => id) || [],
      [focusDocuments]
    )

    const pastPerformanceTable = useReactTable({
      data: pastPerformance,
      columns,
      state: {
        sorting,
        columnVisibility,
        rowSelection,
        columnFilters,
        pagination,
      },
      getRowId: (row) => row.id.toString(),
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    const keyPersonnelTable = useReactTable({
      data: keyPersonnel,
      columns,
      state: {
        sorting,
        columnVisibility,
        rowSelection,
        columnFilters,
        pagination,
      },
      getRowId: (row) => row.id.toString(),
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    const focusDocumentsTable = useReactTable({
      data: focusDocuments,
      columns,
      state: {
        sorting,
        columnVisibility,
        rowSelection,
        columnFilters,
        pagination,
      },
      getRowId: (row) => row.id.toString(),
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
    })


   function handlePastPerformanceDragEnd(event: DragEndEvent) {
      const { active, over } = event
      if (active && over && active.id !== over.id) {
        setPastPerformance((data) => {
          const oldIndex = pastPerformanceIds.indexOf(active.id)
          const newIndex = pastPerformanceIds.indexOf(over.id)
          return arrayMove(data, oldIndex, newIndex)
        })
      }
    }

    function handleKeyPersonnelDragEnd(event: DragEndEvent) {
      const { active, over } = event
      if (active && over && active.id !== over.id) {
        setKeyPersonnel((data) => {
          const oldIndex = keyPersonnelIds.indexOf(active.id)
          const newIndex = keyPersonnelIds.indexOf(over.id)
          return arrayMove(data, oldIndex, newIndex)
        })
      }
    }

    function handleFocusDocumentsDragEnd(event: DragEndEvent) {
      const { active, over } = event
      if (active && over && active.id !== over.id) {
        setFocusDocuments((data) => {
          const oldIndex = focusDocumentsIds.indexOf(active.id)
          const newIndex = focusDocumentsIds.indexOf(over.id)
          return arrayMove(data, oldIndex, newIndex)
        })
      }
    }

    // Component for rendering table content
      const TableContent = ({
      currentTable,
      currentDataIds,
      handleCurrentDragEnd
    }: {
      currentTable: ReturnType<typeof useReactTable<Product>>,
      currentDataIds: UniqueIdentifier[],
      handleCurrentDragEnd: (event: DragEndEvent) => void
    }) => (
      <>
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleCurrentDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {currentTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {currentTable.getRowModel().rows?.length ? (
                  <SortableContext
                    items={currentDataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {currentTable.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {currentTable.getFilteredSelectedRowModel().rows.length} of{" "}
            {currentTable.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${currentTable.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  currentTable.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20 cursor-pointer" id="rows-per-page">
                  <SelectValue
                    placeholder={currentTable.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {currentTable.getState().pagination.pageIndex + 1} of{" "}
              {currentTable.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
                onClick={() => currentTable.setPageIndex(0)}
                disabled={!currentTable.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => currentTable.previousPage()}
                disabled={!currentTable.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => currentTable.nextPage()}
                disabled={!currentTable.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex cursor-pointer"
                size="icon"
                onClick={() => currentTable.setPageIndex(currentTable.getPageCount() - 1)}
                disabled={!currentTable.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </>
    )

 */