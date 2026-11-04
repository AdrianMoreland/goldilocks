import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAssistantDock } from "@/contexts/docks-context"
import { usePricingTools, type PricingToolTab, SIDE_PANEL_WIDTH as PANEL_WIDTH } from "../../context/pricing-tools-context"
import { ProductTab } from "./product-tab"
import { TradeTab } from "./trade-tab"
import { PortfolioTab } from "./portfolio-tab"
import { SettingsTab } from "./settings-tab"
import { CalculatorsTab } from "./calculators-tab"
import { cn } from "@/lib/utils"
import { formatMetalName } from "../../utils/formatters"
import { features } from "@/config/features"
import { useMediaQuery } from "@/hooks/use-media-query.hook"

// Settings isn't one of the row's tabs — it's a distinct "configure this
// panel" action rather than a workflow tab, so it gets its own icon button
// at the top of the panel instead of competing for space in the tab row.
const TABS: { value: PricingToolTab; label: string }[] = [
    { value: "product", label: "Product" },
    { value: "trade", label: "Trade" },
    { value: "portfolio", label: "Portfolio" },
    { value: "calculators", label: "Calculators" },
]

/**
 * Pricing tools panel — fills the full (fixed) viewport height alongside the
 * dashboard, with its own body scrolling independently. Toggled via the
 * header button; the panel's own inner width never changes with the toggle
 * or the active tab, only the outer box's width (clipped via
 * overflow-hidden) does.
 */
export function PricingToolsPanel() {
    const { open, toggleOpen, activeTab, setActiveTab, activeMetal, selectedProduct } = usePricingTools()
    // The assistant takes this panel's slot while it is open; the tools' own open/closed choice is kept for when it closes.
    const assistantOpen = useAssistantDock().open
    const phone = useMediaQuery("(max-width: 900px)")

    if (features.redesign) {
        return <RedesignedPanel phone={phone} shown={open && !assistantOpen} onClose={toggleOpen} activeTab={activeTab} onTab={setActiveTab} />
    }

    return (
        <div
            className="h-full shrink-0 overflow-hidden border-l bg-card transition-[width] duration-200 ease-in-out"
            style={{ width: open && !assistantOpen ? PANEL_WIDTH : 0 }}
            inert={!open || assistantOpen}
        >
            <div className="flex h-full flex-col" style={{ width: PANEL_WIDTH }}>
                <div className="flex items-start justify-between gap-2 border-b p-4">
                    <div>
                        <div className="type-h4">{selectedProduct ? selectedProduct.name : "Pricing Tools"}</div>
                        <div className="type-muted text-muted-foreground">{formatMetalName(activeMetal)}</div>
                    </div>
                    <Button
                        type="button"
                        variant={activeTab === "settings" ? "default" : "outline"}
                        size="icon"
                        className={cn("size-8 shrink-0 cursor-pointer", activeTab === "settings" && "bg-foreground text-background")}
                        title="Settings"
                        aria-label="Settings"
                        aria-pressed={activeTab === "settings"}
                        onClick={() => setActiveTab(activeTab === "settings" ? "product" : "settings")}
                    >
                        <Settings className="size-4" />
                    </Button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto py-4">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PricingToolTab)}>
                        <TabsList className="mx-4 h-auto w-[calc(100%-2rem)] flex-wrap justify-start gap-1 bg-transparent p-0">
                            {TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="bg-muted flex-none cursor-pointer px-2.5 py-1 text-xs"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="product" className="pt-4">
                            <ProductTab />
                        </TabsContent>
                        <TabsContent value="trade" className="pt-4">
                            <TradeTab />
                        </TabsContent>
                        <TabsContent value="portfolio" className="pt-4">
                            <PortfolioTab />
                        </TabsContent>
                        <TabsContent value="calculators" className="pt-4">
                            <CalculatorsTab />
                        </TabsContent>
                        <TabsContent value="settings" className="pt-4">
                            <SettingsTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}


// The prototype's tab row: underlines, not pills. The active one takes the theme's primary colour.
const UNDERLINE_TAB =
    "text-muted-foreground flex-1 cursor-pointer rounded-none border-0 border-b-2 border-transparent bg-transparent px-2 pt-1 pb-2 text-sm shadow-none " +
    "data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none " +
    "dark:text-muted-foreground dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-foreground"

/**
 * The tools panel as the prototype draws it: the settings cog and underline tabs share one row (the old title block is gone, the
 * product's name is in the Product tab), and on a phone the panel is a bottom sheet with a grab handle and a scrim instead of a
 * column that squeezes the table.
 */
function RedesignedPanel({
    phone,
    shown,
    onClose,
    activeTab,
    onTab,
}: {
    phone: boolean
    shown: boolean
    onClose: () => void
    activeTab: PricingToolTab
    onTab: (tab: PricingToolTab) => void
}) {
    const body = (
        <Tabs value={activeTab} onValueChange={(value) => onTab(value as PricingToolTab)} className="flex min-h-0 flex-1 flex-col gap-0">
            <div className="flex items-center gap-2 px-3 pt-3">
                <Button
                    type="button"
                    variant={activeTab === "settings" ? "default" : "outline"}
                    size="icon"
                    className={cn("size-8 shrink-0 cursor-pointer", activeTab === "settings" && "bg-foreground text-background")}
                    title="Settings"
                    aria-label="Settings"
                    aria-pressed={activeTab === "settings"}
                    onClick={() => onTab(activeTab === "settings" ? "product" : "settings")}
                >
                    <Settings className="size-4" />
                </Button>
                <TabsList className="h-auto min-w-0 flex-1 justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0">
                    {TABS.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className={UNDERLINE_TAB}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto py-4">
                <TabsContent value="product"><ProductTab /></TabsContent>
                <TabsContent value="trade"><TradeTab /></TabsContent>
                <TabsContent value="portfolio"><PortfolioTab /></TabsContent>
                <TabsContent value="calculators"><CalculatorsTab /></TabsContent>
                <TabsContent value="settings"><SettingsTab /></TabsContent>
            </div>
        </Tabs>
    )

    if (phone) {
        return (
            <>
                {shown && <div aria-hidden className="fixed inset-0 z-[54] bg-black/40" onClick={onClose} />}
                <div
                    role="dialog"
                    aria-label="Pricing tools"
                    inert={!shown}
                    className={cn(
                        "bg-card fixed inset-x-0 bottom-0 z-[55] flex h-[88svh] flex-col rounded-t-[18px] border border-b-0 shadow-2xl transition-[transform,visibility] duration-200",
                        shown ? "translate-y-0" : "invisible translate-y-full",
                    )}
                >
                    <div aria-hidden className="bg-muted-foreground/30 mx-auto mt-2 h-1 w-10 shrink-0 rounded-full" />
                    {body}
                </div>
            </>
        )
    }

    return (
        <div
            className="h-full shrink-0 overflow-hidden border-l bg-card transition-[width] duration-200 ease-in-out"
            style={{ width: shown ? PANEL_WIDTH : 0 }}
            inert={!shown}
        >
            <div className="flex h-full flex-col" style={{ width: PANEL_WIDTH }}>
                {body}
            </div>
        </div>
    )
}
