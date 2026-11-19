import { FlagPlayground } from "../devl/flag-playground"
import { benchFields, benchFlags, benchPresets } from "../data"
import { Note, SectionShell } from "../components/section-shell"

export function TestSection() {
  return (
    <SectionShell
      lead={
        <>
          Paste or pick a request and watch each set of rules decide: every condition ticks or crosses, the winning rule
          lights up and the ones after it grey out.
        </>
      }
      stage="building"
      title="Test bench"
    >
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <FlagPlayground fields={benchFields} flags={benchFlags} presets={benchPresets} />
        <Note title="What it tests">
          The saved offer rules (All branches) and the checks on trades, against the same fields the server will use.
          Edits made in the other sections show here once they are published.
        </Note>
      </div>
    </SectionShell>
  )
}
