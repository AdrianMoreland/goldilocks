import * as React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {METAL_TABS, MetalTabValue} from "./metal-tabs"

interface MetalTabsToolbarProps {
    selectedTab: MetalTabValue
    onSelectedTabChange: (tab: MetalTabValue) => void
    /**
     * The metal spot-price cards and this toolbar's own metal-select
     * controls are two ways to pick the same thing — only one is ever shown
     * so they can't drift out of sync. This is the fallback, shown only
     * once the cards are hidden (see the header's "Toggle metal cards"
     * button).
     */
    showMetalSelect: boolean
}

export function MetalTabsToolbar({ selectedTab, onSelectedTabChange, showMetalSelect }: MetalTabsToolbarProps) {

    return (
        <div className="flex items-center justify-between px-4 lg:px-6 flex-wrap gap-3">
            {showMetalSelect && (
                <>
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
                </>
            )}
        </div>
    )
}