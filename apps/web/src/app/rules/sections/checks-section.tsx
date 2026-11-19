import { useState } from "react"
import { RoutingRules } from "../devl/routing-rules"
import { MoneyInput } from "../devl/money-input"
import { checkOutcomes, initialChecks, sampleTrade, tradeFields, tradeHistory } from "../data"
import { useEditHandler, useHub } from "../hub-context"
import { Note, SectionShell } from "../components/section-shell"

export function ChecksSection() {
  const { markChanged } = useHub()
  const edited = useEditHandler("Checks and approvals")
  const [cashLimit, setCashLimit] = useState<number | null>(5000)
  return (
    <SectionShell
      lead={
        <>
          What a trade needs before it completes: photo ID, a manager code, a source of funds form. The assistant will
          read these too, so a draft's staff notes can say "this order will need ID at collection".
        </>
      }
      stage="later"
      title="Checks and approvals"
    >
      <Note title="Example thresholds" tone="warn">
        The amounts here are placeholders. The real ones come from the compliance procedures (roadmap 1.17) and are
        signed off before this goes live.
      </Note>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,600px)_minmax(0,1fr)]">
        <RoutingRules
          description="Every matching check applies. The preview below shows the first match."
          destinations={checkOutcomes}
          fallback="none"
          fields={tradeFields}
          history={tradeHistory}
          onChange={edited}
          routes={initialChecks}
          sampleResponse={sampleTrade}
          showSql={false}
          title="Checks on trades"
          wording={{
            route: "Check",
            add: "Add check",
            otherwise: "Otherwise",
            everyone: "Every trade needs",
            testTitle: "Test a trade",
            testHint: "Change the trade to see which check applies",
            fallback: "no rule",
          }}
        />
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
            <div>
              <h3 className="font-medium text-sm">Cash reporting threshold</h3>
              <p className="text-muted-foreground text-xs">Used by any check that mentions a cash limit.</p>
            </div>
            <MoneyInput
              currencies={[{ code: "EUR", locale: "en-IE", name: "Euro" }]}
              defaultCurrency="EUR"
              label="Cash at or above"
              onValueChange={(v) => {
                setCashLimit(v)
                markChanged("Checks and approvals")
              }}
              value={cashLimit}
            />
          </div>
          <Note title="Manager code">
            A "Manager code" check will ask a manager to enter their code on the trade before it can be completed, using
            the same code entry the high-value trade release will use.
          </Note>
        </div>
      </div>
    </SectionShell>
  )
}
