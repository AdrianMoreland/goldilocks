import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { RoadmapSource } from "./components/roadmap-source"

/**
 * Project Management, next version (roadmap 1.20; docs/ROADMAP-TOOL-PLAN.md). Built beside /project so
 * the working page is never touched: when this one does everything /project does, /project is removed
 * and this takes its place. So far it shows the sync status, pulls master into the app (slices 1 and 2) and
 * holds the roadmap itself, which can be browsed, searched and edited. The route is wrapped in
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
                <RoadmapSource />
            </div>
        </BaseLayout>
    )
}
