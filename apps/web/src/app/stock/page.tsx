import { BaseLayout } from "@/components/layouts/base-layout"
import { LiveStockTab } from "@/app/inventory/live/live-stock-tab"

/**
 * Live stock for everyone signed in. Counts are editable only for the branch the server says you may edit (your own
 * linked branch; admins any), so for most brokers this is a read-only view. Admins use Inventory, which adds the stocktake.
 */
export default function StockPage() {
    return (
        <BaseLayout title="Stock" description="What each branch holds now">
            <div className="px-4 lg:px-6">
                <LiveStockTab />
            </div>
        </BaseLayout>
    )
}
