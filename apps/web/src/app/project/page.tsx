import { Suspense, lazy } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowLeft, BookOpenCheck, ListChecks, Palette, type LucideIcon } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import RoadmapView from "./views/roadmap-view"

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
                <div role="tablist" aria-label="Project views" className="bg-muted flex w-fit max-w-full overflow-x-auto rounded-lg p-1">
                    {VIEWS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={view === key}
                            onClick={() => setParams(key === "roadmap" ? {} : { view: key }, { replace: true })}
                            className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap",
                                view === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Icon className="size-4" /> {label}
                        </button>
                    ))}
                </div>

                {view === "roadmap" && <RoadmapView />}
                {view !== "roadmap" && (
                    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>{view === "engineering" ? <EngineeringView /> : <DesignView />}</Suspense>
                )}
            </div>
        </BaseLayout>
    )
}
