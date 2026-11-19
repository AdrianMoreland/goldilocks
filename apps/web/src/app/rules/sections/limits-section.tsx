import { FlagTargeting } from "../devl/flag-targeting"
import { Redline } from "../devl/redline"
import { BRANCHES, initialLimits, limitRedline, limitVariants, productFields, productPopulation } from "../data"
import { useEditHandler, useHub } from "../hub-context"
import { Note, SectionShell } from "../components/section-shell"

export function LimitsSection() {
  const { toasts, markChanged } = useHub()
  const edited = useEditHandler("Premium limits")
  return (
    <SectionShell
      lead={
        <>
          How low a premium may go, and when. When several limits match a product, the strictest (highest) one wins, so a
          lower limit can never slip through by its place in the list. Offers that would go below a limit are refused
          when they are saved.
        </>
      }
      stage="building"
      title="Premium limits"
    >
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,580px)_minmax(0,1fr)]">
        <FlagTargeting
          environments={BRANCHES.map((b) => ({ id: b.id, name: b.name }))}
          fields={productFields}
          flagKey="premium-limits"
          flagName="Premium limits"
          onChange={edited}
          population={productPopulation}
          showRollout={false}
          targeting={initialLimits}
          variants={limitVariants}
          wording={{
            rulesTitle: "Limits",
            rulesHint: "Strictest limit wins",
            unit: ["product", "products"],
            offTitle: "When limits are off at this branch",
            offHint: "Every product gets this.",
            distributionTitle: "Limits across the catalogue",
            serves: "Applies to",
            everyoneElseGets: "has",
            serveVerb: "Set",
          }}
        />
        <div className="flex min-w-0 flex-col gap-4">
          <Redline
            onComplete={(text) => {
              markChanged("Premium limits")
              toasts.show({ title: "Changes reviewed", description: text.slice(0, 120), tone: "success", duration: 4000 })
            }}
            segments={limitRedline}
            title="Changes waiting to publish"
          />
          <Note title="Branch tabs">
            All branches applies everywhere. A branch tab adds limits for that branch only; where both match, the
            stricter limit wins. The preview counts each product twice: with stock confirmed and without.
          </Note>
          <Note title="Preview, not live yet">
            The count under each limit uses the first rule that matches. The server will apply strictest-wins when the
            limits go live.
          </Note>
        </div>
      </div>
    </SectionShell>
  )
}
