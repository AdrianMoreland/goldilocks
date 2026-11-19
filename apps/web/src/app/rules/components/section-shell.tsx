import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type Stage = "building" | "next" | "later"

const stageLabel: Record<Stage, string> = {
  building: "Being built",
  next: "Next",
  later: "Later",
}

const stageTone: Record<Stage, string> = {
  building: "bg-primary/12 text-primary-text",
  next: "bg-info/12 text-info-foreground",
  later: "bg-muted text-muted-foreground",
}

export function StageChip({ stage }: { stage: Stage }) {
  return <span className={cn("rounded-full px-2 py-0.5 font-medium text-[11px] whitespace-nowrap", stageTone[stage])}>{stageLabel[stage]}</span>
}

/** One section of the hub: a heading, what the rules decide, then the editors. */
export function SectionShell({
  title,
  stage,
  lead,
  actions,
  children,
}: {
  title: string
  stage: Stage
  lead: ReactNode
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 max-w-2xl flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-lg">{title}</h2>
            <StageChip stage={stage} />
          </div>
          <p className="text-muted-foreground text-sm text-pretty">{lead}</p>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  )
}

/** A quiet card for the explanations beside the editors. */
export function Note({ title, children, tone = "default" }: { title: string; children: ReactNode; tone?: "default" | "warn" }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-3 text-sm",
        tone === "warn" ? "border-warning-text/30 bg-warning text-warning-text" : "bg-card",
      )}
    >
      <p className="font-medium text-xs">{title}</p>
      <div className={cn("text-xs text-pretty", tone === "warn" ? "" : "text-muted-foreground")}>{children}</div>
    </div>
  )
}
