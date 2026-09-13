import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { usePricingTools, type PricingToolTab } from "../../context/pricing-tools-context"
import { ProductTab } from "./product-tab"
import { TradeTab } from "./trade-tab"
import { PortfolioTab } from "./portfolio-tab"
import { SettingsTab } from "./settings-tab"
import { CalculatorsTab } from "./calculators-tab"
import { cn } from "@/lib/utils"

// Scales with the viewport instead of staying pinned at 384px regardless of
// width: 384px on wide screens, shrinking down to a 260px floor so it never
// ends up hogging most of the window on a narrower one.
const PANEL_WIDTH = "clamp(260px, 32vw, 384px)"

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
    const { open, activeTab, setActiveTab, activeMetal, selectedProduct } = usePricingTools()

    return (
        <div
            className="h-full shrink-0 overflow-hidden border-l bg-card transition-[width] duration-200 ease-in-out"
            style={{ width: open ? PANEL_WIDTH : 0 }}
        >
            <div className="flex h-full flex-col" style={{ width: PANEL_WIDTH }}>
                <div className="flex items-start justify-between gap-2 border-b p-4">
                    <div>
                        <div className="font-semibold">{selectedProduct ? selectedProduct.name : "Pricing Tools"}</div>
                        <div className="text-muted-foreground text-sm">{activeMetal} mode</div>
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
