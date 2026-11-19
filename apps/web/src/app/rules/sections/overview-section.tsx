import { ArrowRightIcon } from "lucide-react"
import { FlagBoard } from "../devl/flag-board"
import { decisionLog, initialSwitches, switchEnvironments, switchSegments } from "../data"
import { useHub } from "../hub-context"
import { SectionShell, StageChip, type Stage } from "../components/section-shell"

export interface SectionSummary {
  id: string
  label: string
  stage: Stage
  summary: string
}

export function OverviewSection({ sections, onOpen }: { sections: SectionSummary[]; onOpen: (id: string) => void }) {
  const { toasts } = useHub()
  return (
    <SectionShell
      lead={
        <>
          One place for the rules behind the assistant, premiums, alerts and checks. Every rule is written as a sentence,
          tested against a sample before it is saved, and published as a numbered version so any answer can be traced back
          to the rules that produced it.
        </>
      }
      stage="building"
      title="Overview"
    >
      <ul className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              className="flex h-full w-full flex-col gap-1.5 rounded-xl border bg-card p-3 text-start transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onOpen(s.id)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-sm">{s.label}</span>
                <StageChip stage={s.stage} />
                <ArrowRightIcon className="ms-auto size-3.5 text-muted-foreground" />
              </span>
              <span className="text-muted-foreground text-xs text-pretty">{s.summary}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FlagBoard
          environments={switchEnvironments}
          flags={initialSwitches}
          onChange={() => toasts.show({ title: "Switch changed", description: "Takes effect when published.", tone: "info", duration: 2500 })}
          segments={switchSegments}
          showRollout={false}
          title="Rule switches by branch"
        />
        <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card text-sm">
          <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5 pb-2">
            <h3 className="font-medium">Decision log</h3>
            <span className="text-muted-foreground text-xs">Example entries</span>
          </div>
          <ul className="flex flex-col">
            {decisionLog.map((d) => (
              <li className="flex items-start gap-3 border-t px-4 py-2.5" key={`${d.time}-${d.detail}`}>
                <span className="w-11 shrink-0 font-mono text-muted-foreground text-xs tabular-nums">{d.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px]">{d.detail}</p>
                  <p className="text-muted-foreground text-xs">
                    {d.type} · {d.where}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-auto border-t px-4 py-2.5 text-muted-foreground text-xs">
            Once live, every assistant answer and alert records the rule and version it used.
          </p>
        </div>
      </div>
    </SectionShell>
  )
}
