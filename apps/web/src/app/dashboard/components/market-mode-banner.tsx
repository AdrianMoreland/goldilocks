import { Activity } from "lucide-react"
import { usePricingSettings } from "../context/pricing-settings-context"
import { usePricingTools } from "../context/pricing-tools-context"

/**
 * Full-width strip at the very top of the dashboard whenever Weekend,
 * Volatile or Metal Shortage is switched on. Those modes change every
 * quoted premium and discount, so they can't live only inside the Settings
 * tab where a clerk quoting a customer would never look. Renders nothing in
 * STANDARD mode — no strip means no adjustment is active.
 */
export function MarketModeBanner() {
    const { modes, activeStatusLabel } = usePricingSettings()
    const { setActiveTab, openTools } = usePricingTools()

    if (!Object.values(modes).some(Boolean)) return null

    return (
        <div
            role="status"
            className="flex shrink-0 items-center justify-center gap-2 bg-foreground px-4 py-1.5 text-sm font-semibold text-background"
        >
            <Activity className="size-4 shrink-0" aria-hidden />
            <span className="tracking-wide">{activeStatusLabel} MODE ON</span>
            <span className="hidden font-normal opacity-80 sm:inline">— Trade quotes use adjusted premiums/discounts; the price grid shows standard prices.</span>
            <button
                type="button"
                className="ml-1 cursor-pointer rounded underline underline-offset-2 hover:opacity-80"
                onClick={() => {
                    setActiveTab("settings")
                    openTools()
                }}
            >
                Change
            </button>
        </div>
    )
}
