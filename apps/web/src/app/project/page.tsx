import { Suspense, lazy } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, BookOpenCheck, ListChecks, Palette, type LucideIcon } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { UNDERLINE_TAB } from "@/lib/underline-tabs"
import RoadmapView from "./views/roadmap-view"
import { features } from "@/config/features"
import { RoadmapSource, useScopeRoadmap } from "../project2/components/roadmap-source"

// The two reference views bundle large Markdown files; load them only when opened.
const EngineeringView = lazy(() => import("./views/engineering-view"))
const DesignView = lazy(() => import("./views/design-view"))

const VIEWS: { key: string; label: string; icon: LucideIcon }[] = [
    { key: "roadmap", label: "Roadmap", icon: ListChecks },
    { key: "engineering", label: "Engineering", icon: BookOpenCheck },
    { key: "design", label: "Design system", icon: Palette },
]

/**
 * Project Management: the roadmap you can edit, and two reference views (engineering knowledge hub,
 * design system) read from the repo's own documents. The view lives in the URL (?view=design) so a
 * refresh or a shared link lands in the same place. The route is wrapped in RequireAdmin and the roadmap
 * API checks admin again.
 */
export default function ProjectPage() {
    const [params, setParams] = useSearchParams()
    const view = VIEWS.find((v) => v.key === params.get("view"))?.key ?? "roadmap"
    // Once the API reads the roadmap from the scope files, the old copy of docs/ROADMAP.md is stale, so the rebuilt page shows here too.
    const scope = useScopeRoadmap()
    const scopeFiles = scope.data?.enabled === true

    return (
        <BaseLayout
            title="Project Management"
            showLogo
            headerActions={() => (
                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                    <Link to="/dashboard">
                        <ArrowLeft /> Pricing workbook
                    </Link>
                </Button>
            )}
        >
            <div className="flex flex-col gap-4 px-4 lg:px-6">
                <div role="tablist" aria-label="Project views" className={features.redesign ? "flex w-full max-w-full overflow-x-auto border-b" : "bg-muted flex w-fit max-w-full overflow-x-auto rounded-lg p-1"}>
                    {VIEWS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={view === key}
                            onClick={() => setParams(key === "roadmap" ? {} : { view: key }, { replace: true })}
                            data-state={view === key ? "active" : "inactive"}
                            className={cn(
                                features.redesign
                                    ? cn(UNDERLINE_TAB, "-mb-px")
                                    : "flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap",
                                !features.redesign && (view === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"),
                            )}
                        >
                            {!features.redesign && <Icon className="size-4" />} {label}
                        </button>
                    ))}
                </div>

                {view === "roadmap" && (features.redesign || scopeFiles ? <RoadmapSource /> : <RoadmapView />)}
                {view !== "roadmap" && (
                    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>{view === "engineering" ? <EngineeringView /> : <DesignView />}</Suspense>
                )}
            </div>
        </BaseLayout>
    )
}

/** The rebuilt roadmap (formerly /project2): sync status above the roadmap itself. Shown instead of the old one when the redesign is on. */
