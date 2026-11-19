import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  BellRingIcon,
  ClipboardCheckIcon,
  FlaskConicalIcon,
  LayoutGridIcon,
  PercentIcon,
  ShieldHalfIcon,
  SparklesIcon,
  UploadIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { GoNoGo } from "./devl/go-no-go"
import { NotificationCentre } from "./devl/notification-centre"
import { ToastDeck, useToastDeck } from "./devl/toast-deck"
import { notificationFeed, publishRequest } from "./data"
import { HubContext } from "./hub-context"
import { StageChip, type Stage } from "./components/section-shell"
import { OverviewSection } from "./sections/overview-section"
import { OffersSection } from "./sections/offers-section"
import { LimitsSection } from "./sections/limits-section"
import { AlertsSection } from "./sections/alerts-section"
import { PricingSection } from "./sections/pricing-section"
import { ChecksSection } from "./sections/checks-section"
import { SegmentsSection } from "./sections/segments-section"
import { TestSection } from "./sections/test-section"

interface SectionDef {
  id: string
  label: string
  icon: LucideIcon
  stage: Stage
  summary: string
}

const SECTIONS: SectionDef[] = [
  { id: "overview", label: "Overview", icon: LayoutGridIcon, stage: "building", summary: "Switches per branch and the decision log." },
  { id: "offers", label: "Assistant offers", icon: SparklesIcon, stage: "building", summary: "What the assistant proposes for a request: 4 rules, 5 offers." },
  { id: "limits", label: "Premium limits", icon: ShieldHalfIcon, stage: "building", summary: "How low a premium may go. Strictest wins: 4 limits." },
  { id: "alerts", label: "Price alerts", icon: BellRingIcon, stage: "next", summary: "Gold crosses a price, or a premium nears its limit: 2 alerts." },
  { id: "pricing", label: "Price rules", icon: PercentIcon, stage: "later", summary: "Premiums by rule, one tab per market mode: 4 rules." },
  { id: "checks", label: "Checks and approvals", icon: ClipboardCheckIcon, stage: "later", summary: "ID, manager code or source of funds: 3 checks." },
  { id: "segments", label: "Customer segments", icon: UsersIcon, stage: "later", summary: "VIPs and lapsed regulars, for offers and prices: 2 segments." },
  { id: "test", label: "Test bench", icon: FlaskConicalIcon, stage: "building", summary: "Try a request against every rule set." },
]

const isSection = (value: string | null): value is string => SECTIONS.some((s) => s.id === value)

/**
 * The Rules hub (admins only): one engine, several kinds of rules. Tonight's version is the full interface on example
 * data; nothing here changes prices, the assistant or alerts yet. The route is wrapped in RequireAdmin, and the API will
 * enforce the same on every rules call when it exists. The open section lives in the URL (?section=offers).
 */
export default function RulesPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get("section")
  const section = isSection(requested) ? requested : "overview"
  const open = useCallback(
    (id: string) => setParams(id === "overview" ? {} : { section: id }, { replace: true }),
    [setParams],
  )

  const toasts = useToastDeck()
  const [changed, setChanged] = useState<string[]>([])
  const [publishing, setPublishing] = useState(false)
  const [publishKey, setPublishKey] = useState(0)

  const markChanged = useCallback((what: string) => setChanged((list) => (list.includes(what) ? list : [...list, what])), [])
  const hub = useMemo(() => ({ toasts, markChanged }), [toasts, markChanged])

  const request = useMemo(
    () =>
      changed.length
        ? { ...publishRequest, action: `Publish changes to ${changed.join(", ")}` }
        : publishRequest,
    [changed],
  )

  return (
    <HubContext.Provider value={hub}>
      <BaseLayout
        description="Rules for the assistant, premiums, alerts and checks"
        headerActions={() => (
          <div className="flex items-center gap-2">
            <NotificationCentre
              notifications={notificationFeed}
              onRequest={(item, approved) =>
                toasts.show({
                  title: approved ? "Request approved" : "Request declined",
                  description: item.target,
                  tone: approved ? "success" : "default",
                  duration: 3000,
                })
              }
              onSettings={() => open("alerts")}
            />
            <Button
              onClick={() => {
                setPublishKey((k) => k + 1)
                setPublishing(true)
              }}
              size="sm"
              variant={changed.length ? "default" : "outline"}
            >
              <UploadIcon />
              Review and publish
              {changed.length > 0 && <span className="rounded-full bg-primary-foreground/20 px-1.5 text-[11px] tabular-nums">{changed.length}</span>}
            </Button>
          </div>
        )}
        title="Rules"
      >
        <div className="flex flex-col gap-4 px-4 pb-24 lg:px-6">
          <p className="rounded-lg border border-dashed px-3 py-2 text-muted-foreground text-xs">
            Preview with example data. Nothing on this page changes prices, the assistant or alerts yet.
          </p>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <nav aria-label="Rule types" className="min-w-0">
              <ul className="flex gap-1 overflow-x-auto pb-1 lg:sticky lg:top-4 lg:flex-col lg:overflow-visible">
                {SECTIONS.map((s) => {
                  const Icon = s.icon
                  const active = s.id === section
                  return (
                    <li className="shrink-0" key={s.id}>
                      <button
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                        )}
                        onClick={() => open(s.id)}
                        type="button"
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="whitespace-nowrap">{s.label}</span>
                        {s.id !== "overview" && s.id !== "test" && (
                          <span className="ms-auto max-lg:hidden">
                            <StageChip stage={s.stage} />
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="min-w-0">
              {section === "overview" && <OverviewSection onOpen={open} sections={SECTIONS.filter((s) => s.id !== "overview")} />}
              {section === "offers" && <OffersSection />}
              {section === "limits" && <LimitsSection />}
              {section === "alerts" && <AlertsSection />}
              {section === "pricing" && <PricingSection />}
              {section === "checks" && <ChecksSection />}
              {section === "segments" && <SegmentsSection />}
              {section === "test" && <TestSection />}
            </div>
          </div>
        </div>

        <Dialog onOpenChange={setPublishing} open={publishing}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Review and publish</DialogTitle>
              <DialogDescription>
                Publishing saves a new numbered version. Every assistant answer and alert records the version it used.
              </DialogDescription>
            </DialogHeader>
            <GoNoGo
              key={publishKey}
              onDecision={(decision) => {
                if (decision === "approved") {
                  toasts.show({
                    title: "Published as version 4 (preview)",
                    description: "In the live version this saves the rules and writes to the audit log.",
                    tone: "success",
                    duration: 5000,
                    action: { label: "Undo", onClick: () => toasts.show({ title: "Back to version 3", tone: "info", duration: 3000 }) },
                  })
                  setChanged([])
                  setPublishing(false)
                } else if (decision === "denied") {
                  setPublishing(false)
                }
              }}
              request={request}
              timeout={60}
            />
          </DialogContent>
        </Dialog>

        <ToastDeck className="fixed inset-x-auto right-4 bottom-4 left-4 z-50 sm:left-auto sm:w-[360px]" deck={toasts} />
      </BaseLayout>
    </HubContext.Provider>
  )
}
