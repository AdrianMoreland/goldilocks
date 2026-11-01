import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { SyncBanner } from "./components/sync-banner"

/**
 * Project Management, next version (roadmap 1.20; docs/ROADMAP-TOOL-PLAN.md). Built beside /project so
 * the working page is never touched: when this one does everything /project does, /project is removed
 * and this takes its place. So far it shows the sync status and pulls master into the app (slices 1 and 2). The route is wrapped in
 * RequireAdmin and the API checks admin again.
 */
export default function Project2Page() {
    return (
        <BaseLayout
            title="Project Management 2"
            showLogo
            headerActions={() => (
                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                    <Link to="/project">
                        <ArrowLeft /> Current project page
                    </Link>
                </Button>
            )}
        >
            <div className="flex flex-col gap-4 px-4 lg:px-6">
                <SyncBanner />
                <p className="text-muted-foreground text-sm">
                    This page is being built beside <Link to="/project" className="underline">the current one</Link>, which keeps working
                    unchanged. Roadmap editing, sync, inbox and backlog arrive here slice by slice.
                </p>
            </div>
        </BaseLayout>
    )
}
